// Lints plain CSS and the scoped <style> blocks inside .astro components.
// Design tokens are the single source of truth, so raw colour values are
// forbidden in component styles (see .ai/context/design-system.md).
export default {
  extends: ["stylelint-config-standard"],
  overrides: [{ files: ["**/*.astro"], customSyntax: "postcss-html" }],
  ignoreFiles: ["src/styles/tokens.generated.css", "dist/**", ".astro/**"],
  rules: {
    // Colours come from theme tokens via var(--…), never raw values.
    "color-no-hex": true,
    "color-named": "never",
    // media.css declares breakpoints with @custom-media (unknown to standard).
    "at-rule-no-unknown": [true, { ignoreAtRules: ["custom-media"] }],
    // Astro's :global() escape hatch (used to style <Content /> MDX output).
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
    // @media (--mq-*) is polyfilled by postcss-custom-media; the custom-media
    // guard-rail (pnpm lint:breakpoints) validates these instead.
    "media-query-no-invalid": null,
    "media-feature-name-value-no-unknown": null,
  },
};
