import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { entrySchema } from "./data/schema.ts";

const entries = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/data/entries",
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: entrySchema,
});

export const collections = { entries };
