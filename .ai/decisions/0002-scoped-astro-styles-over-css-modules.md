# 0002 — Scoped Astro `<style>` over CSS Modules

- **Status:** Accepted
- **Date:** 2026-06-26

## Context

The portfolio styles with CSS Modules + global custom properties (its ADR-0001),
sharing common bases through `composes:`. Labs ports the same "Onyx & Azure"
charter and the same token discipline, but runs on Astro rather than Next/React.
Astro has first-class **scoped `<style>` blocks** inside `.astro` components:
styles are automatically scoped to the component, with zero runtime, which is the
idiomatic Astro way to do exactly what CSS Modules do for React.

This is the single deliberate divergence from the portfolio's stack.

## Decision

We style components with **scoped `<style>` blocks inside `.astro` files**, on
top of the same global token layer (`globals.css` + generated
`tokens.generated.css`). We **forbid Tailwind, CSS-in-JS, and CSS Modules**.
PostCSS stays scoped to polyfilling on-track standard CSS only (`@custom-media`).

Because scoped Astro styles have **no `composes:`**, shared CSS is factored by
**composing primitive components** (`ui/Surface.astro`, `ui/Section.astro`) or a
small set of global utility classes in `globals.css` — never by duplicating a
base in two components.

## Alternatives considered

- **CSS Modules (as in the portfolio)** — rejected here: redundant with Astro's
  native scoping, adds a `.module.css` file convention that fights the
  single-file `.astro` component model.
- **Tailwind / CSS-in-JS** — rejected for the same reasons as the portfolio:
  couples design values to markup or implies a runtime, against the token system
  and the zero-JS baseline.

## Consequences

- **Positive:** idiomatic Astro, zero styling runtime, styles co-located with
  the component, same token discipline as the portfolio.
- **Negative / trade-offs:** no `composes:`, so DRY relies on primitive
  components and global utilities — a small shift in how shared CSS is expressed
  versus the portfolio.
