# Project — labs.jordan-t.dev

A static gallery of interactive technical experiments (CSS, animation,
performance, WebGL, POCs), and the sister site of the durable Next.js portfolio
**jordan-t.dev**. Same engineering rigour as the portfolio, with a little more
room to play.

## What it is

- A static site built with **Astro** and exported to plain HTML/CSS, deployed to
  Vercel. No CMS, no database, no runtime backend.
- Content-driven: each experiment is authored as MDX in a typed Content
  Collection and read at build time.
- Two public surfaces: the home gallery of experiment cards, and the per
  experiment detail page (`/experiments/[slug]`) combining the write-up, the
  live demo, and links.

## Why a separate repo

The portfolio (`jordan-t.dev`, Next.js) is the durable, evolvable product. Labs
is the playground: pure static, zero JS by default, the place to use Astro and
the islands model without compromising the portfolio's roadmap. See
[ADR-0001](../decisions/0001-labs-astro-complement-next.md).

## Goals that drive every decision

These are constraints the code must keep satisfying, not aspirations.

- **Performance by structure.** Zero client JavaScript by default; interactivity
  ships as Preact islands only, hydrated with `client:visible` / `client:idle`.
  "The JS is a budget." See [`perf-review`](../skills/perf-review/SKILL.md).
- **Accessibility is a build gate, not a review step.** Semantic markup, keyboard
  navigation, a skip link, `prefers-reduced-motion` honoured, axe assertions in
  the test suite. See
  [`accessibility-review`](../skills/accessibility-review/SKILL.md).
- **Clean, durable architecture.** Strict separation of concerns, a real
  design-token system, DRY/KISS enforced on every change.
- **CSS-first.** Layout and interaction lean on the platform before reaching for
  JavaScript.

## Status

Live at labs.jordan-t.dev. The pre-launch `noindex` robots meta and
`public/robots.txt` `Disallow: /` were removed once the site went to
production.

## Where things live

| Concern | File |
|---|---|
| Architecture & data flow | [`architecture.md`](./architecture.md) |
| Code & content conventions | [`conventions.md`](./conventions.md) |
| Design tokens & styling rules | [`design-system.md`](./design-system.md) |
| Reusable agent skills | [`../skills/`](../skills/) |
| Architecture decisions (ADRs) | [`../decisions/`](../decisions/) |
