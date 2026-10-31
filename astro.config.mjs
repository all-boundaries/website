import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://allboundaries.net',
  markdown: {
    // Mermaid fences become build-time SVG; everything else goes through Starlight's code blocks.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
  },
  integrations: [
    starlight({
      title: 'All Boundaries',
      description: 'Practical patterns for testing and designing software boundaries, with real examples.',
      logo: { src: './src/assets/logo.svg' },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      plugins: [
        starlightLlmsTxt({
          projectName: 'All Boundaries',
          description: 'Practical patterns for software boundaries: gateways, contracts, idempotency, team interaction. Each pattern has an agent-oriented summary.',
          promote: ['start/**', 'patterns/**'],
          demote: ['journeys/**'],
        }),
      ],
      sidebar: [
        { label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
        {
          label: 'Patterns',
          items: [
            { label: 'Inside a service', items: [{ autogenerate: { directory: 'patterns/inside-a-service' } }] },
            { label: 'Between services', items: [{ autogenerate: { directory: 'patterns/between-services' } }] },
            { label: 'Across teams', items: [{ autogenerate: { directory: 'patterns/across-teams' } }] },
          ],
        },
        { label: 'Journeys', items: [{ autogenerate: { directory: 'journeys' } }] },
        { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
      ],
    }),
  ],
});
