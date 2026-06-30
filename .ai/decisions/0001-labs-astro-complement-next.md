# 0001 — labs.jordan-t.dev on Astro, a deliberate complement to the Next.js portfolio

- **Status:** Accepted
- **Date:** 2026-06-26

## Context

The main portfolio `jordan-t.dev` is built with Next.js (App Router) and is the
durable, evolvable product: it keeps the door open to server-side features and a
large ecosystem. Separately, there is a need for a playground to publish small
interactive technical experiments (CSS, animation, performance, WebGL, POCs),
where the priority is a near-zero JavaScript baseline and the islands model, not
long-term product evolution.

Putting the experiments inside the portfolio would either dilute its roadmap or
force the portfolio's framework onto content that has different constraints.

## Decision

We build the experiments as a **separate static site, `labs.jordan-t.dev`, on
Astro**, with `output: "static"`, deployed to Vercel. Zero client JavaScript by
default; interactivity ships as Preact islands hydrated only where needed
(`client:visible` / `client:idle`). The two sites cross-link in header and
footer.

## Alternatives considered

- **Add experiments to the Next.js portfolio** — rejected: couples the
  playground to the portfolio's framework and roadmap, and Next always ships
  some baseline JS, working against the zero-JS goal for pure content + islands.
- **A single Astro site for both** — rejected: the portfolio deliberately chose
  Next for durability and server-side headroom (its own ADR). Migrating it would
  trade that away for a property only the labs need.

## Consequences

- **Positive:** each site optimises for its own goal; labs can be aggressively
  static and JS-light; experiments ship without touching the portfolio.
- **Negative / trade-offs:** two repos and two deploys to maintain; the design
  charter and AI methodology must be **ported and kept in sync** between them
  (the labs charter is a port of the portfolio's, by design).
