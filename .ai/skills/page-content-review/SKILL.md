---
name: page-content-review
description: >-
  Review and rewrite the editorial content of labs.jordan-t.dev pages
  (experiment write-ups, hero, descriptions). Trigger when the author wants to
  review, rewrite, shorten, clarify, or check the tone of page copy or an
  experiment description. Checks for em dash, overselling, repetition, and
  confidentiality leaks.
---

# Skill — Page content review and rewriting

Before any review, read [`../_shared/tone.md`](../_shared/tone.md) and apply all
of its tone conventions (banned self-promotion, no em dash, honesty about
trade-offs, never invented figures).

## Goal

Clarity, conciseness, tone consistency. The playful, hands-on angle of the labs
is embraced but never oversold: show the reasoning and the result, don't sell
yourself.

## Site-specific constraints

- **The experiment `description` is reused**: it appears on the gallery card and
  as the page meta description and lede. Keep it self-contained and concise (one
  to two sentences). The MDX body can be longer.
- **No repetition between description and body**: the MDX write-up doesn't
  restate the `description`. It brings something else (context, the actual
  technique, what it cost, what was learned).
- **Single source of truth**: consistency across the labs, the portfolio, and
  the brand. No diverging narrative between channels.
- **Confidentiality**: never a phone number, date of birth, full postal
  address, or other sensitive personal data.

## Review checklist

To run explicitly on every text under review:

- Is there an em dash (—) anywhere? (forbidden, replace it)
- Any phrasing that oversells? (see the banned list in `_shared/tone.md`)
- Any repetition between the `description` and the body?
- Any unverified or estimated figure? (get it confirmed by the author)
- Does the tone drift toward "polished AI", smooth and impersonal?
- Any confidential data leak (phone, address, personal data)?

## Method

When a phrasing choice is at stake, propose labeled variants (e.g. "Variant A
(sober)", "Variant B (more direct)") and let the author decide, rather than
imposing a single rewrite.
