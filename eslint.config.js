import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/", ".astro/", "src/styles/tokens.generated.css"] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
