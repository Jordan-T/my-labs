# Skill — Write an ADR

Record a significant architecture decision as a short, immutable note, so the
*why* survives the people and the session that made it.

## When to write one

When a decision is hard to reverse or shapes future work: a framework/library
choice, a structural rule, a rendering-model constraint, a styling strategy.
Skip it for routine changes — an ADR is for decisions, not diffs.

## How

1. Copy [`template.md`](./template.md) to
   `.ai/decisions/NNNN-kebab-title.md`, where `NNNN` is the next zero-padded
   number (see [`../../decisions/`](../../decisions/) for the latest).
2. Fill **Context** (the forces), **Decision** (what we chose, active voice),
   **Alternatives** (and why rejected), **Consequences** (good and bad, honest).
3. Keep it short — one screen. Status starts `Accepted`.
4. ADRs are append-only: don't rewrite an old one. To change a decision, write a
   new ADR that supersedes it (link both ways).

## Style

- Plain English, "why before what".
- State the alternatives you rejected and *why* — that's the valuable part.
