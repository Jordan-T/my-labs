import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const tagType = z.enum(["framework", "language", "tool", "concept"]);

// One MDX file per experiment. The live demo lives in the MDX body (a Preact
// island or an <Embed> iframe); `external` is the fallback when there is no
// embedded demo. See .ai/context/architecture.md.
const experiments = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/experiments" }),
  // `image()` resolves a local path (relative to the entry) to typed
  // ImageMetadata, used as a subtle visual hint on the card.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // ISO YYYY-MM-DD, always quoted. Lexicographic sort doubles as date sort.
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
      status: z.enum(["wip", "done"]).default("wip"),
      featured: z.boolean().default(false),
      tags: z.array(z.object({ label: z.string(), type: tagType })).default([]),
      image: image().optional(),
      github: z.url().optional(),
      external: z.url().optional(),
      // false hides the experiment from listings and from generated routes.
      published: z.boolean().default(true),
    }),
});

export const collections = { experiments };
