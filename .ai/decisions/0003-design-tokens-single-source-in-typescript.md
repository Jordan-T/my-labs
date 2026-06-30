# 0003 — Design tokens: single source in TypeScript, generated to CSS

- **Status:** Accepted
- **Date:** 2026-06-26

## Context

The "Onyx & Azure" charter is colour-heavy and every colour is derived from a
small set of primitives (surfaces, accents, text), with many translucent washes
computed via `color-mix`. These colours must be available as CSS custom
properties at runtime, but defining them by hand in CSS makes the derivation
implicit and easy to break, and offers no single place to swap a palette.

## Decision

Colours live in **one TypeScript source**, `src/config/theme.ts`: a `brand`
palette of primitives plus a `siteColors()` function that derives the full token
set (washes, edges, tag/status colours) from those primitives.
`scripts/generate-tokens.ts` (run via `pnpm generate:tokens`, before `dev` and
`build`) writes them into `src/styles/tokens.generated.css`, which `globals.css`
imports. The generated file is **not edited by hand** and is git-ignored.

Non-colour tokens (spacing, radii, typography, motion, breakpoints) are not
themeable and stay as plain CSS in `globals.css` / `media.css`.

## Alternatives considered

- **Hand-written CSS custom properties** — rejected: the derivation between
  primitives and washes becomes implicit, drift-prone, and there is no single
  point to introduce a palette variant.
- **A CSS preprocessor (Sass variables)** — rejected: adds a preprocessor for a
  job custom properties already do at runtime, and loses runtime themeability.

## Consequences

- **Positive:** one colour source; a palette swap updates the whole system; a
  theme variant is a new `BrandPalette` emitted under a `[data-theme]` selector.
- **Negative / trade-offs:** a generated artifact in the build (`pnpm
  generate:tokens` must run before styling is correct); contributors must edit
  `theme.ts`, never the generated CSS.
