// One-off importer: copies draft parts into src/content/docs with Starlight front matter and slug links.
// Usage: node scripts/migrate-draft.mjs <drafts-root> <part-dir> [<part-dir> ...]
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, posix } from 'node:path';

const P = (family, slug) => ({ out: `patterns/${family}/${slug}`, url: `/patterns/${family}/${slug}/`, family, slug });
const J = (slug) => ({ out: `journeys/${slug}`, url: `/journeys/${slug}/` });
const A = (slug) => P('across-teams', slug);
const B = (slug) => P('between-services', slug);
const I = (slug) => P('inside-a-service', slug);

// draft file (part-dir/name) -> destination
const map = {
  'part-1-subscriptions/index': J('build-one-service-testably'),
  'part-1-subscriptions/domain': I('domain'), 'part-1-subscriptions/use-case': I('use-case'),
  'part-1-subscriptions/persistence': I('persistence'), 'part-1-subscriptions/http': I('inbound-http-gateway'),
  'part-1-subscriptions/gateway': I('outbound-http-gateway'), 'part-1-subscriptions/messaging-inbound': I('inbound-messaging'),
  'part-1-subscriptions/messaging-outbound': I('outbound-messaging'), 'part-1-subscriptions/closed-box': I('closed-box-test'),
  'part-2-payments/index': J('add-a-second-service'),
  'part-2-payments/synchronous-inbound': B('synchronous-inbound-pending'),
  'part-2-payments/contracts': B('bidirectional-contracts'),
  'part-2-payments/webhook-idempotency': B('webhook-idempotency'),
  'part-2-payments/error-classification': B('error-classification'),
  'part-3-contracts/index': J('stop-contract-drift'),
  'part-3-contracts/consumer-driven-contracts': B('consumer-driven-contracts'),
  'part-3-contracts/contract-drift': B('contract-drift'),
  'part-3-contracts/deployment-gates': B('deployment-gates'),
  'part-4-customer-experience/index': J('one-product-several-teams'),
  ...Object.fromEntries(['platform-enables-autonomy', 'team-interaction-patterns', 'monorepo', 'integration-boundaries',
    'failure-and-degradation', 'test-boundaries', 'ways-of-working'].map((s) => [`part-4-customer-experience/${s}`, A(s)])),
};

const [root, ...parts] = process.argv.slice(2);
const q = (s) => s.replace(/"/g, '\\"');

for (const part of parts) {
  for (const file of readdirSync(join(root, part)).filter((f) => f.endsWith('.md'))) {
    const key = `${part}/${basename(file, '.md')}`;
    const dest = map[key];
    if (!dest) { console.log(`skip ${key}`); continue; }
    let body = readFileSync(join(root, part, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
    const h1 = body.match(/^# (.+)$/m)?.[1] ?? basename(file, '.md');
    body = body.replace(/^# .+\n+/m, '');
    body = body.replace(/\]\(((?:\.\.?\/)[^)#]*?)(?:\.md)?(#[^)]*)?\)/g, (m, path, hash = '') => {
      const target = posix.normalize(posix.join(part, path.replace(/\/$/, '/index')));
      const hit = map[target] ?? map[`${target}/index`];
      if (hit) return `](${hit.url}${hash})`;
      return m;
    });
    // Links to material that is not on the site (wiki, code-examples, review notes): keep the words, drop the link.
    body = body.replace(/\[([^\]]+)\]\((?:\.\.?\/)[^)]*(?:wiki|code-examples|REVIEW)[^)]*\)/g, '$1');
    const fm = ['---', `title: "${q(h1)}"`, ...(dest.family ? [`id: ${dest.family}.${dest.slug}`, `family: ${dest.family}`] : []), '---', ''].join('\n');
    const path = join('src/content/docs', `${dest.out}.md`);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, `${fm}\n${body}`);
    console.log(dest.out);
  }
}
