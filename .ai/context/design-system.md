# Design system — "Onyx & Azure"

Industrial-blueprint aesthetic: abyssal background, tiered surfaces, 1px
low-opacity borders, isometric feel. **CSS-first** — the platform does the work.
Identical charter to the portfolio jordan-t.dev.

> **Colours** are sourced from `src/config/theme.ts` and generated into
> `src/styles/tokens.generated.css` (see
> [ADR-0003](../decisions/0003-design-tokens-single-source-in-typescript.md));
> **non-colour** tokens (spacing, radii, typography) live in
> `src/styles/globals.css`. Either way the values are tokens — never hardcode a
> design value, always `var(--…)`.

## Hard rules

- **Scoped Astro `<style>` only** — styles live in the component's own `<style>`
  block. No Tailwind, no CSS-in-JS, no CSS Modules — see
  [ADR-0002](../decisions/0002-scoped-astro-styles-over-css-modules.md).
- **No inline styles** in markup.
- **No hardcoded design values** — colours, fonts, spacing, transitions, radii,
  and widths all come from tokens.
- **px discipline.** `px` is allowed only on `border` / `outline` /
  `background`; everything else uses `rem` or a token. Raw px primitives live
  only in `globals.css` / `media.css`.
- **Colours live only in the theme source** (`src/config/theme.ts`, generated to
  `tokens.generated.css`). Component styles use `var(--color-*)` — never a raw
  hex/rgb/hsl/named colour. This keeps one colour source and enables variants.
- Colour and breakpoint rules are enforced by **Stylelint** (`pnpm lint:css`)
  plus the custom-media guard-rail.

## Surfaces (elevation tiers)

`--color-bg` (page) < `--color-surface` (cards/bento) < `--color-surface-raised`
(hover). Higher tier = more elevated. The shared card/bento base is the
`ui/Surface.astro` primitive — compose with it rather than re-declaring borders
and padding.

## Accents (semantic, not decorative)

- `--color-accent` — electric azure: interactive, CTA, edges, hover.
- `--color-accent2` — indigo: secondary motifs, reflections.
- `--color-accent-alert` — technical amber: concepts, alerts, work-in-progress.

For washes/hovers, derive from a token with
`color-mix(in srgb, var(--color-accent) N%, transparent)` — never a hardcoded
rgba. Recurring washes are already tokenized (`--accent-wash`, `--accent-edge`,
`--alert-edge`, `--alert-wash`, …); reuse the token rather than re-declaring the
`color-mix`.

## Tags & statuses

Tags are minimal (border + text, transparent background), one colour per type:
`framework` = azure, `language` = indigo, `tool` = slate (muted), `concept` =
amber. Statuses: `wip` = amber, `done` = muted. All come from the generated
`--tag-*` / `--status-*` tokens.

## Spacing & layout

- Every padding/margin/gap uses a `--space-*` token (`--space-2xs` …
  `--space-4xl`). No ad-hoc `rem` spacing.
- Page container width = `--maxw`; reading/prose column = `--maxw-prose`. Never
  hardcode a width.
- Radii from `--radius-*`; transitions from `--transition-base`.

## Breakpoints

Defined once as **custom media** in `src/styles/media.css` and used via
`@media (--mq-*)`: `--mq-compact` (≤600px), `--mq-ui` (≤720px), `--mq-grid`
(≤900px). **Never repeat a literal width in a `@media`**, and never introduce a
fourth breakpoint.

`@media (--mq-*)` is not native CSS yet — it is polyfilled at build by
`postcss-custom-media` (+ `@csstools/postcss-global-data`). Run
[`breakpoints-check`](../skills/breakpoints-check/SKILL.md) (wired into
`pnpm lint`) as the guard-rail.

## Focus & motion

Every interactive element shows a visible `:focus-visible` ring:
`outline: 2px solid var(--color-accent)` with an `outline-offset`. Animations
respect `prefers-reduced-motion` (global rule in `globals.css`).

## Factoring CSS — DRY over duplication

Scoped Astro styles have no `composes:`. Share CSS by **composing primitive
components** (`ui/Surface.astro`, `ui/Section.astro`) or a small set of global
utility classes in `globals.css`. Never re-declare a card/section base in two
components.
