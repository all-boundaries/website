import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import rehypeMermaid from 'rehype-mermaid';

const mermaidCss = `
  * { font-family: Arial, Helvetica, sans-serif !important; }
  p { font-size: 16px !important; line-height: 1.5 !important; margin: 0 !important; }
  .node rect, .node polygon, .node circle, .node path, .actor, .labelBox { fill: var(--sl-color-black) !important; stroke: var(--sl-color-gray-4) !important; stroke-width: 1.5px !important; rx: 8px; ry: 8px; }
  .cluster rect { fill: var(--sl-color-gray-6) !important; stroke: var(--sl-color-gray-5) !important; stroke-width: 1px !important; rx: 12px; ry: 12px; }
  .edgePath path, .flowchart-link, .messageLine0, .messageLine1, .relation { stroke: var(--sl-color-accent) !important; stroke-width: 1.75px !important; }
  marker path, .arrowMarkerPath, .arrowheadPath { fill: var(--sl-color-accent) !important; stroke: var(--sl-color-accent) !important; }
  .edgeLabel, .edgeLabel p, .edgeLabel span, .nodeLabel, .nodeLabel p, .cluster-label, .cluster-label span { color: var(--sl-color-white) !important; background: transparent !important; }
  .edgeLabel rect, .labelBkg { fill: var(--sl-color-black) !important; background: var(--sl-color-black) !important; }
  text, .messageText, .actor text, .noteText { fill: var(--sl-color-white) !important; stroke: none !important; }
  .note { fill: var(--sl-color-gray-6) !important; stroke: var(--sl-color-gray-5) !important; }
`;

export default defineConfig({
  site: 'https://allboundaries.net',
  markdown: {
    // Mermaid fences become build-time SVG; everything else goes through Starlight's code blocks.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    rehypePlugins: [[rehypeMermaid, {
      strategy: 'inline-svg',
      // Colours come from the page's CSS variables so diagrams follow light and dark themes.
      mermaidConfig: {
        theme: 'base',
        fontFamily: 'Arial, Helvetica, sans-serif',
        flowchart: { curve: 'linear', htmlLabels: true },
        themeCSS: mermaidCss,
      },
    }]],
  },
  integrations: [
    starlight({
      title: 'All Boundaries',
      description: 'Practical patterns for testing and designing software boundaries, with real examples.',
      favicon: '/favicon.svg',
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
        SocialIcons: './src/components/SocialIcons.astro',
        Footer: './src/components/Footer.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      editLink: { baseUrl: 'https://github.com/all-boundaries/website/edit/main/' },
      expressiveCode: {
        themes: ['one-dark-pro', 'one-light'],
        styleOverrides: {
          borderRadius: '12px',
          borderColor: '#8da09666',
          frames: { frameBoxShadowCssValue: 'none' },
        },
      },
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
