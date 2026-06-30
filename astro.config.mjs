// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

import { SITE_URL } from "./src/config/site";

// Static, content-driven site. Zero client JS by default; interactivity ships
// as Preact islands only. React can be added later alongside Preact via the
// `include`/`exclude` options on each framework integration (see
// .ai/context/architecture.md).
export default defineConfig({
  site: SITE_URL,
  output: "static",
  // Vector-first assets: pass images through unchanged (sized, no layout shift)
  // instead of pulling in the native Sharp dependency. Revisit if a real raster
  // experiment needs optimization.
  image: { service: passthroughImageService() },
  integrations: [mdx(), preact()],
});
