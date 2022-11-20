import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import remarkSimplePlantumlPlugin from '@akebifiky/remark-simple-plantuml';

// https://astro.build/config
export default defineConfig({
    markdown: {
        extendDefaultPlugins: true,
        remarkPlugins: [
            remarkSimplePlantumlPlugin
        ]
    },
	integrations: [
		// Enable Preact to support Preact JSX components.
		preact(),
		// Enable React for the Algolia search component.
		react(),
	],
	site: `http://astro.build`,
});
