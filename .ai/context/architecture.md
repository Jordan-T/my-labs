# Architecture

> Why before what: each rule exists to keep the site fast, statically
> exportable, and easy to reason about. When a change would break one of these,
> stop and flag it rather than working around it.

## Rendering model

- **`.astro` components render at build time to static HTML — zero JS.** This is
  the default and the rule. Reach for an island only for genuine client-side
  interactivity (browser-only APIs, real state).
- **Islands are explicit and isolated.** An interactive component is a Preact
  component under `src/components/islands/`, mounted from an `.astro` file with a
  `client:*` directive (`client:visible` or `client:idle`, never `client:load`
  unless justified). Each island is a leaf, never a wrapper that drags the tree
  into the client.
- **Static output.** `astro.config.mjs` sets `output: "static"`. There is no
  server at runtime: everything is computed at build time.

## Adding React later (alongside Preact)

Preact is the default island runtime ("JS is a budget"). If a specific
experiment needs React (a React-only library), add `@astrojs/react` and scope
each renderer with `include`/`exclude` globs so they never both claim the same
files — e.g. Preact owns `src/components/islands/**` and React owns a dedicated
`src/components/islands-react/**`. Document the reason in an ADR.

## Layout & routing

- `Header` and `Footer` live in `src/components/layout/BaseLayout.astro`, never
  inside a page.
- Routes: `/` (home gallery) and `/experiments/[slug]` (detail).
- Dynamic routes pre-render their full set with `getStaticPaths()`.

## Data layer

- **All content access goes through `src/lib/`.** Pages and components consume
  `lib` functions; they never call `getCollection` ad hoc with sorting/filtering
  logic inline.
- `src/lib/experiments.ts` wraps `getCollection("experiments")`: it filters out
  unpublished entries and sorts (featured first, then newest date). Defaults for
  optional frontmatter fields are declared in the Zod schema
  (`src/content.config.ts`), not in components.
- `lib` functions accept an **injectable entry list** so tests pass fixtures
  instead of reading real content.

## Content pipeline

- **Experiments** — one MDX file per experiment in
  `src/content/experiments/`, loaded by the `glob()` loader in
  `src/content.config.ts`. Typed frontmatter: `title`, `description`, `status`
  (`wip|done`, default `wip`), `featured` (default `false`), `tags`
  (`{ label, type }`), `date` (ISO `YYYY-MM-DD`, **always quoted**), an optional
  `image` (local path resolved via the `image()` schema helper, shown as a subtle
  hint on the card), optional `github`/`external`, and `published` (default
  `true`; `false` hides it from listings and routes). Sort order: featured
  first, then newest date.
- The live demo and the write-up share **one page** (combined layout). A demo is
  either a Preact island embedded in the MDX body, an iframe via the shared
  `ui/Embed.astro` component, or just the `external` link. There is no schema
  field for the demo kind: place it in the MDX body.

## Site config

Site-wide info (name, role, URL, portfolio backlink, socials) lives in
`src/config/site.ts`. Never hardcode these in components; import the config.

## SEO

- Per-page `<title>`/description handled in `BaseLayout.astro`.
- The `noindex` robots meta and `public/robots.txt` `Disallow: /` are
  intentional pre-launch (see [`project.md`](./project.md)).
