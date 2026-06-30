# Skill — Accessibility review

Audit the accessibility of a new or modified visible component before
considering it done. Accessibility is a **build gate** here, not an afterthought.

## When to run

- After creating or changing any component that renders visible UI.
- Before any commit that touches markup.

## Steps

1. **Run the automated gates.**

   ```bash
   pnpm lint   # eslint-plugin-astro a11y rules on .astro files
   pnpm test   # axe assertions on interactive island components
   ```

   Both must be green.

2. **Add or update an axe test** for any interactive island, using `axe-core`
   with `@testing-library/preact` (render the component, run axe on the
   container, assert zero violations). Static `.astro` components are verified
   manually against the checklist below (RTL renders Preact, not `.astro`).

3. **Manual checklist** (axe can't see everything, especially in jsdom):
   - Semantic landmarks (`header`, `main`, `nav`, `footer`) and a single logical
     heading order.
   - A skip link to the main content as the first focusable element.
   - Every interactive element is reachable and operable by keyboard, with a
     visible `:focus-visible` ring.
   - Images/SVGs have meaningful `alt` (or `alt=""` + `aria-hidden` when purely
     decorative). Iframes (`ui/Embed.astro`) carry a descriptive `title`.
   - Interactive controls have an accessible name (text, `aria-label`, …).
   - Colour is never the only carrier of meaning.
   - Animations are gated behind `prefers-reduced-motion`.

## Notes

`color-contrast`, `region`, and `heading-order` are hard for axe to assess on an
isolated component in jsdom — verify contrast and landmark/heading structure
manually against the design tokens.
