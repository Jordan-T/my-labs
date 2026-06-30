/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { getViteConfig } from "astro/config";

// getViteConfig wires Astro's virtual modules (astro:content, …) and the Preact
// integration's JSX handling into Vitest, so lib and island tests run with the
// same resolution as the build. The @ alias mirrors tsconfig paths.
export default getViteConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
