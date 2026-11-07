// Fails when a content page is missing from the sidebar, listed twice, or the sidebar names a page that does not exist.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const docs = 'src/content/docs';
const pages = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pages(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [relative(docs, join(dir, e.name))] : [],
  );
const slugOf = (file) => file.replace(/\.mdx?$/, '').replace(/\/index$/, '');
const existing = new Set(pages(docs).map(slugOf).filter((s) => s !== 'index'));

const config = readFileSync('astro.config.mjs', 'utf8');
const sidebar = config.slice(config.indexOf('sidebar: ['));
const listed = [...sidebar.matchAll(/'((?:start|journeys|patterns|reference)\/[^']+)'/g)].map((m) => m[1]);

const seen = new Set();
const problems = [];
for (const slug of listed) {
  if (seen.has(slug)) problems.push(`listed twice: ${slug}`);
  seen.add(slug);
  if (!existing.has(slug)) problems.push(`no such page: ${slug}`);
}
for (const slug of existing) if (!seen.has(slug)) problems.push(`missing from sidebar: ${slug}`);

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`sidebar covers ${existing.size} pages`);
