# Skill — Code review (Boy-Scout / SRP / KISS / DRY)

A focused quality pass on a diff before it's considered done. Not a bug hunt —
this is about keeping the codebase clean, small, and consistent. Leave the code
cleaner than you found it.

## When to run

After every feature or refactor, on the diff, before declaring done.

## Checklist

**DRY**
- Is any markup, CSS, or logic duplicated twice or more? Factor it (a shared
  component, a `ui/` primitive like `Surface.astro`, a `lib` helper).
- Is a design value hardcoded instead of using a token?

**KISS**
- Is this the simplest thing that works? Remove speculative flexibility.
- Any abstraction (component/helper) used in only one place? Inline it.
- Did this add a client island where a static `.astro` component would do?

**SRP / structure**
- Does each unit do one thing? Split mixed responsibilities (e.g. content access
  leaking into a component — it belongs in `lib`).
- Right layer? `ui/` primitive vs `cards/` vs `layout/` vs `islands/` vs `lib/`.

**Boy-Scout**
- Dead code, commented-out blocks, leftover `console.log`? Remove them.
- Names descriptive and consistent with neighbours (English, casing)?
- Touched something fragile nearby that's cheap to improve? Improve it.

**Conventions** (see [`conventions.md`](../../context/conventions.md))
- One folder per island; `@/…` imports, not deep relative paths.
- Comments and identifiers in English; user copy in French (no em dash).

## Finish

`pnpm lint && pnpm test && pnpm build` green. If a finding is too big to fix
now, note it — don't leave it silently.
