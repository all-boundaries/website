import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection('docs');
  return docs.map((doc) => ({ params: { slug: doc.id }, props: { doc } }));
};

// Raw markdown twin of every page, Mermaid left as source, for LLM consumption.
export const GET: APIRoute = ({ props }) => {
  const { doc } = props as { doc: Awaited<ReturnType<typeof getCollection<'docs'>>>[number] };
  const agent = doc.data.agent
    ? `> **Use when:** ${doc.data.agent.use_when}\n>\n${doc.data.agent.checklist.map((c) => `> - ${c}`).join('\n')}\n\n`
    : '';
  const text = `# ${doc.data.title}\n\n${agent}${doc.body ?? ''}`;
  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
