import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Stable pattern identity, e.g. "gateway.outbound-http".
        id: z.string().optional(),
        family: z.enum(['inside-a-service', 'between-services', 'across-teams']).optional(),
        // Test names from the test-boundary matrix that this pattern introduces.
        tests: z.array(z.string()).optional(),
        related: z.array(z.string()).optional(),
        // Path in the companion repo, rendered as an "In the repo" link.
        repo: z.object({ path: z.string(), ref: z.string().default('main') }).optional(),
        // Machine-oriented summary; also the source for generated skills.
        agent: z
          .object({
            use_when: z.string(),
            checklist: z.array(z.string()),
          })
          .optional(),
      }),
    }),
  }),
};
