import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = (await getCollection('docs')).filter((d) => d.data.agent && d.data.id);
  return docs.map((doc) => ({
    params: { slug: `${doc.data.id}/SKILL.md` },
    props: { doc },
  }));
};

// One installable agent skill per pattern, generated from the `agent` front matter.
export const GET: APIRoute = ({ props }) => {
  const { doc } = props as { doc: Awaited<ReturnType<typeof getCollection<'docs'>>>[number] };
  const { id, title, description, agent, repo } = doc.data;
  const name = id!.replace(/\./g, '-');
  const lines = [
    '---',
    `name: ${name}`,
    `description: Use when ${agent!.use_when}`,
    '---',
    '',
    `# ${title}`,
    '',
    description ?? '',
    '',
    '## Checklist',
    ...agent!.checklist.map((c) => `- ${c}`),
    '',
    '## Full pattern',
    `https://allboundaries.net/raw/${doc.id}.md`,
    ...(repo ? ['', `Example code: ${repo.path} @ ${repo.ref}`] : []),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
