import type { Experiment } from "@/lib/experiments";

/** Minimal experiment entry for unit-testing the pure lib helpers. */
export function makeExperiment(
  overrides: Partial<Experiment["data"]> & { id?: string } = {},
): Experiment {
  const { id = "x", ...data } = overrides;
  return {
    id,
    collection: "experiments",
    data: {
      title: "Title",
      description: "Description",
      date: "2024-01-01",
      status: "wip",
      featured: false,
      tags: [],
      published: true,
      ...data,
    },
  } as Experiment;
}
