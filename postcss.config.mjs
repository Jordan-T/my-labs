// PostCSS is scoped to polyfilling standard, on-track CSS only: it injects the
// custom-media definitions from src/styles/media.css and resolves @media (--mq-*)
// at build time. It never invents syntax or compiles away design tokens.
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";

export default {
  plugins: [
    postcssGlobalData({ files: ["src/styles/media.css"] }),
    postcssCustomMedia(),
  ],
};
