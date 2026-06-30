import { writeFile } from "node:fs/promises";
import path from "node:path";
import { siteColors } from "../src/config/theme";

const HEADER = `/* Generated from src/config/theme.ts by scripts/generate-tokens.ts.
   Do not edit by hand — run \`pnpm generate:tokens\` after changing the theme. */
`;

function toRoot(vars: Record<string, string>): string {
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return `:root {\n${body}\n}\n`;
}

async function main() {
  const out = path.join(process.cwd(), "src", "styles", "tokens.generated.css");
  await writeFile(out, `${HEADER}\n${toRoot(siteColors())}`, "utf8");
  console.log(`✓ Tokens generated: ${path.relative(process.cwd(), out)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
