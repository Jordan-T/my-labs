# AGENTS.md

Entry point for any AI agent or contributor working in this repository. This
file is intentionally **light**: it orients you to the detailed context. Read
the linked file for an area before changing code in it.

> **Golden rule.** The rules in this repo are strict. When a change would
> violate one, do not make it — stop and flag it instead.

## What this is

**labs.jordan-t.dev**: a static gallery of interactive technical experiments
(CSS, animation, performance, WebGL, POCs), and the sister site of the durable
Next.js portfolio **jordan-t.dev**. Full context:
[`.ai/context/project.md`](.ai/context/project.md).

## Stack — non-negotiable

- **Astro + TypeScript `strict`**, static output (`output: "static"`), deployed
  to **Vercel**. Do not downgrade.
- **Zero client JavaScript by default.** Interactivity ships as **Preact
  islands** only (`client:visible` / `client:idle`). "The JS is a budget."
  React can be added later alongside Preact (see
  [`.ai/context/architecture.md`](.ai/context/architecture.md)).
- **Scoped Astro `<style>` + CSS custom properties.** No Tailwind, no CSS-in-JS,
  no CSS Modules — see
  [ADR-0002](.ai/decisions/0002-scoped-astro-styles-over-css-modules.md).
- **PostCSS** is scoped to polyfilling standard CSS only (`@custom-media` for
  breakpoints) — never to invent syntax or compile away tokens. **Stylelint**
  lints CSS and `<style>` blocks (`pnpm lint:css`). Design tokens stay 100%
  custom properties.
- **Content Collections** (Zod schema) + **MDX** for experiment content.
- **pnpm** only — do not introduce an `npm`/`yarn` lockfile.

## Commands

```bash
pnpm dev             # local dev server (regenerates tokens first)
pnpm build           # generate tokens, astro check, production build — gate any PR
pnpm test            # Vitest, single run
pnpm lint            # ESLint + Stylelint + custom-media guard-rail
pnpm generate:tokens # regenerate src/styles/tokens.generated.css from theme.ts
```

A change is **not done** until `pnpm lint`, `pnpm test`, and `pnpm build` pass
with zero errors.

## Context — read before editing the relevant area

| Topic | File |
|---|---|
| Project, goals, status | [`.ai/context/project.md`](.ai/context/project.md) |
| Architecture & data flow | [`.ai/context/architecture.md`](.ai/context/architecture.md) |
| Code & content conventions | [`.ai/context/conventions.md`](.ai/context/conventions.md) |
| Design system & styling | [`.ai/context/design-system.md`](.ai/context/design-system.md) |

## Skills — reusable procedures, some with scripts

| Skill | Use it to |
|---|---|
| [`accessibility-review`](.ai/skills/accessibility-review/SKILL.md) | Audit a11y before a component is done |
| [`perf-review`](.ai/skills/perf-review/SKILL.md) | Catch predictable performance regressions |
| [`code-review`](.ai/skills/code-review/SKILL.md) | DRY / KISS / SRP / Boy-Scout pass on a diff |
| [`page-content-review`](.ai/skills/page-content-review/SKILL.md) | Review/rewrite French page copy (tone, em dash, overselling) |
| [`article-writing`](.ai/skills/article-writing/SKILL.md) | Write or structure an experiment's French MDX write-up |
| [`write-adr`](.ai/skills/write-adr/SKILL.md) | Record an architecture decision |
| [`breakpoints-check`](.ai/skills/breakpoints-check/SKILL.md) | Validate `@custom-media` breakpoints (auto-runs in `pnpm lint`) |

Architecture decisions are logged in [`.ai/decisions/`](.ai/decisions/).
