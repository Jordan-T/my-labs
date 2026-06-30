---
name: article-writing
description: >-
  Write or structure a French-language experiment write-up for
  labs.jordan-t.dev. Trigger when the author wants to write or flesh out an
  experiment's MDX content, a technical retrospective, or structure long-form
  content. Produces a short takeaways framing plus "why/how" sections, in a
  measured tone without overselling.
---

# Skill — Experiment write-up writing

Before any drafting, read [`../_shared/tone.md`](../_shared/tone.md) and apply
all of its tone conventions (banned self-promotion, no em dash, honesty about
trade-offs, never invented figures).

Specialized assistant for writing the French-language MDX content of an
experiment. The output explains a reasoning and a set of choices; it never
oversells. The live demo (island or embed) carries the "what"; the prose carries
the "why" and "how".

## Typical write-up structure

1. **Short hook** that frames the experiment and the stakes, no warm-up.
2. **Body in titled sections**, each centered on a "why" or "how", not just a
   "what". The heading announces an idea, not a keyword.
3. **A "Ce qu'il faut retenir" framing** when the write-up is long: 3 to 4
   short, factual points for a reader who only skims.
4. **Figures / measurements** when relevant (Lighthouse, Core Web Vitals,
   bundle sizes), using values supplied by the author. Never estimate a figure:
   ask for it.
5. **Sober closing note** (link to the demo, the source, or an invitation to
   discuss) when the experiment has one.

## Mini-ADR format for technical-choice sections

When a section recounts a technical choice, structure it in three beats:

- **Context**: the forces at play, the actual constraint.
- **Decision**: what was settled on, in active voice.
- **Consequence / trade-off**: what it brings, and what it costs, or what
  another option would have given. Honesty about the trade-off is what makes it
  credible.

These prose sections don't replace the ADRs in `.ai/decisions/` (English, out of
scope here): they popularize the "why" for a reader.

## Recurring citable references

Use when they genuinely serve the point, without gratuitous jargon: CSS-first,
zero JS by default, islands hydrated only where needed, single source of truth.

## Method

Work iteratively, in steps with validation checkpoints (plan, then
section-by-section), rather than one big block at once. Let the author validate
the framing and the plan before fleshing out the body.
