import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import remarkSimplePlantumlPlugin from '@akebifiky/remark-simple-plantuml';

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remarkSimplePlantumlPlugin]
  },
  integrations: [
      preact(),
      react(),
      mdx()
  ],
  site: `http://astro.build`
});
