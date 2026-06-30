import { describe, expect, it } from "vitest";
import { filterPublished, sortExperiments } from "@/lib/experiments";
import { makeExperiment } from "@/lib/__fixtures__/experiments";

describe("filterPublished", () => {
  it("drops unpublished entries", () => {
    const entries = [
      makeExperiment({ id: "a", published: true }),
      makeExperiment({ id: "b", published: false }),
    ];
    expect(filterPublished(entries).map((e) => e.id)).toEqual(["a"]);
  });
});

describe("sortExperiments", () => {
  it("orders featured first, then by newest date", () => {
    const entries = [
      makeExperiment({ id: "old", date: "2023-01-01" }),
      makeExperiment({ id: "featured", date: "2020-01-01", featured: true }),
      makeExperiment({ id: "new", date: "2025-01-01" }),
    ];
    expect(sortExperiments(entries).map((e) => e.id)).toEqual([
      "featured",
      "new",
      "old",
    ]);
  });

  it("does not mutate the input array", () => {
    const entries = [
      makeExperiment({ id: "a", date: "2020-01-01" }),
      makeExperiment({ id: "b", date: "2021-01-01" }),
    ];
    const before = entries.map((e) => e.id);
    sortExperiments(entries);
    expect(entries.map((e) => e.id)).toEqual(before);
  });
});
