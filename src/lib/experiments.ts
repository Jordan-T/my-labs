import type { CollectionEntry } from "astro:content";

export type Experiment = CollectionEntry<"experiments">;

/** Keep only published experiments. Pure, so it is unit-tested. */
export function filterPublished(entries: Experiment[]): Experiment[] {
  return entries.filter((entry) => entry.data.published);
}

/** Featured first, then newest date. Pure, so it is unit-tested. */
export function sortExperiments(entries: Experiment[]): Experiment[] {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }
    return b.data.date.localeCompare(a.data.date);
  });
}

/** Published experiments, ordered for display. Reads the collection.
 * `getCollection` is imported dynamically so the pure helpers above stay
 * testable without loading the server-only `astro:content` module. */
export async function getPublishedExperiments(): Promise<Experiment[]> {
  const { getCollection } = await import("astro:content");
  const all = await getCollection("experiments");
  return sortExperiments(filterPublished(all));
}
