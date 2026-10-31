// One-off importer: copies a drafts folder into src/content/docs with Starlight front matter.
// Usage: node scripts/migrate-draft.mjs <drafts-dir> <family> <index-target>
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const [dir, family, indexTarget] = process.argv.slice(2);
const names = {
  domain: 'domain', 'use-case': 'use-case', persistence: 'persistence',
  http: 'inbound-http-gateway', gateway: 'outbound-http-gateway',
  'messaging-inbound': 'inbound-messaging', 'messaging-outbound': 'outbound-messaging',
  'closed-box': 'closed-box-test',
};
const urlFor = (slug) => slug === 'index' ? `/${indexTarget}/` : `/patterns/${family}/${names[slug] ?? slug}/`;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const slug = basename(file, '.md');
  let body = readFileSync(join(dir, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  const h1 = body.match(/^# (.+)$/m)?.[1] ?? slug;
  body = body.replace(/^# .+\n+/m, '');
  body = body.replace(/\]\(\.\/([\w-]+)(?:\.md)?\)/g, (_, s) => `](${urlFor(s)})`);
  const isIndex = slug === 'index';
  const out = isIndex ? `${indexTarget}.md` : `patterns/${family}/${names[slug] ?? slug}.md`;
  const fm = ['---', `title: "${h1.replace(/"/g, '\\"')}"`, ...(isIndex ? [] : [`id: ${family}.${names[slug] ?? slug}`, `family: ${family}`]), '---', ''].join('\n');
  const path = join('src/content/docs', out);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, fm + '\n' + body);
  console.log(out);
}
