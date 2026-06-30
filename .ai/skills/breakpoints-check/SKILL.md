# Skill — Custom-media guard-rail

Validate that responsive breakpoints stay correct. `@media (--mq-*)` is not
native CSS — it is polyfilled at build by `postcss-custom-media`, so a mistyped
or undefined custom media **fails silently** (the query never matches and the
responsive rule is simply dropped). Stylelint cannot catch this.

## When it runs

Automatically as part of `pnpm lint:css` (and therefore `pnpm lint`). Run it
directly with `node .ai/skills/breakpoints-check/check-custom-media.mjs`.

## What it checks

It scans plain `.css` files **and the scoped `<style>` blocks of `.astro`
components**, and reports:

1. **Undefined custom media** — every `@media (--name)` must reference a
   `@custom-media` defined in `src/styles/media.css` (the single source of
   truth). A typo like `@media (--mq-uii)` fails the check.
2. **No literal pixel breakpoint** — a raw `@media (max-width: 720px)` is
   rejected; use the corresponding `--mq-*` token.

Exit code is non-zero on any finding, so it gates CI alongside Stylelint.

## Adding a breakpoint

Add it once to `src/styles/media.css` (`@custom-media --mq-… (…)`), then use
`@media (--mq-…)`. Keep the set small — see the design system; do not introduce
a fourth breakpoint without reason.
