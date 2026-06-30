# Conventions

> Deduced from the codebase, not bolted on top of it. New code should be
> indistinguishable from existing code.

## Naming & structure

- One component per folder for islands:
  `islands/ComponentName/ComponentName.tsx` (+ co-located test). Simple `.astro`
  components are single files grouped by role.
- Components grouped by role: `ui/` (primitives), `cards/`, `layout/`,
  `islands/` (interactive Preact).
- Components and types in `PascalCase`; functions and variables in `camelCase`.
- Path alias `@/*` → `src/*` (see `tsconfig.json`). Import via `@/…`, not deep
  relative paths.

## TypeScript

- `strict` mode. No implicit `any`; don't reach for a non-null `!` to silence
  the compiler.
- Type content against the Content Collections schema; add defaults in the Zod
  schema (`src/content.config.ts`), not in components.

## Language

- **Code, identifiers, comments, and documentation: English.**
- **User-facing copy (markup text, MDX content): French.** This is a French
  site, so follow French typography: never use the em dash (`—`); prefer a
  colon, comma, or parentheses instead. (This rule is about the French copy;
  these English docs use normal English punctuation.) Tone:
  [`../skills/_shared/tone.md`](../skills/_shared/tone.md).
- **Commit messages: English, Conventional Commits** (`feat:`, `fix:`,
  `refactor:`, `chore:`, `test:`, `docs:`, `style:`). One logical change per
  commit.

## Code quality — non-negotiable

- **DRY.** Markup, CSS, or logic duplicated twice or more gets factored out
  (a shared component, a layout primitive like `ui/Surface.astro`, a `lib`
  helper).
- **KISS.** The simplest solution that works. Never extract a component/helper
  used in a single place; don't over-abstract.
- **Clean code.** Small focused units, descriptive names, no dead or
  commented-out code, no leftover `console.log`.
- **Comments: sparse, only when truly useful.** Capture a non-obvious "why"
  (a constraint, a trade-off, a workaround), never restate what the code says.
- Run a DRY/KISS pass on the diff after every feature — see
  [`code-review`](../skills/code-review/SKILL.md).

## Testing

Vitest only.

**Test:** business logic in `src/lib/` (filtering, sorting, defaults);
interactive island components **only when they contain a branch/decision**.

**Don't test:** the framework (Astro rendering, routing, `getStaticPaths`),
markup/snapshots, CSS, or third-party libraries.

**How:** co-locate as `*.test.ts(x)` next to the unit; pass fixtures to `lib`
functions so real content changes never break tests.

**Accessibility:** every new or modified interactive island gets an axe test
(via `axe-core` + `@testing-library/preact`) — see
[`accessibility-review`](../skills/accessibility-review/SKILL.md).

## Definition of done

A change is **not done** until `pnpm lint`, `pnpm test`, and `pnpm build` all
pass with zero errors.
