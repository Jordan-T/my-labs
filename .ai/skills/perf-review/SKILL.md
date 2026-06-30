# Skill — Performance review

Catch **predictable** performance regressions — the ones that come from
structure, not from a profiler. The site is fast because of how it's built
(static `.astro` rendering, near-zero client JS, islands hydrated only where
needed); this skill keeps that property from silently eroding.

## When to run

- Before any commit.
- Whenever you add a `client:*` island, an image/asset, or a dependency.

## Automated check

```bash
node .ai/skills/perf-review/check-perf.mjs
```

`check-perf.mjs` (dependency-free Node) flags:

1. **Eager hydration** — every `client:load` directive must carry a one-line
   "why" comment (prefer `client:visible` / `client:idle`; `client:load` ships
   and runs JS immediately, so it must be justified).
2. **Heavy raster images** in `public/` over the size budget — un-optimized
   images are the most common regression in a static export.
3. **Raw `<img>` tags** in components — they invite layout shift and unsized
   media; prefer Astro's `<Image>` (`astro:assets`) or properly sized media.

Exit code is non-zero on any finding, so it can gate CI.

## Manual checklist

- Does this change add a client island where a static `.astro` component would
  do? "The JS is a budget."
- Any new dependency shipped to the browser — is it worth its bytes?
- New assets: compressed, correctly sized, and within budget?
- No render-blocking work that could move to build time?

## Tuning

Size budgets and scanned folders are constants at the top of `check-perf.mjs` —
adjust them there, with a comment, rather than scattering thresholds.
