#!/usr/bin/env node
/**
 * Custom-media guard-rail (dependency-free).
 *
 * `@media (--mq-*)` is polyfilled by postcss-custom-media — an undefined or
 * mistyped custom media fails SILENTLY (the query never matches). Stylelint
 * cannot validate this, so we check it here, across plain .css files AND the
 * scoped <style> blocks of .astro components:
 *
 *   1. Every `@media (--name)` references a custom media defined in media.css.
 *   2. No literal pixel breakpoint survives in a @media (use a --mq-* token).
 *
 * Run with `pnpm lint:css` (wired via npm-run-all2). Exits non-zero on findings.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");
const MEDIA_FILE = join(SRC_DIR, "styles", "media.css");

const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/** Replace every character of `match` with spaces, but keep newlines, so the
 * surrounding line numbers stay accurate after blanking a region out. */
const blank = (s) => s.replace(/[^\n]/g, " ");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** For .astro, keep only the content inside <style> blocks (blank the rest), so
 * markup and frontmatter are not scanned for @media. .css is returned as-is. */
function stylesOnly(content, ext) {
  if (ext !== ".astro") return content;
  let out = blank(content);
  for (const m of content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const start = m.index + m[0].indexOf(m[1]);
    out = out.slice(0, start) + m[1] + out.slice(start + m[1].length);
  }
  return out;
}

// Defined custom media (single source of truth).
const defined = new Set(
  [...readFileSync(MEDIA_FILE, "utf8").matchAll(/@custom-media\s+(--[\w-]+)/g)].map(
    (m) => m[1],
  ),
);

const findings = [];

for (const file of walk(SRC_DIR)) {
  const ext = extname(file);
  if ((ext !== ".css" && ext !== ".astro") || file === MEDIA_FILE) continue;
  // Blank out comments (keep newlines) so documentation like `@media (--mq-*)`
  // is not mistaken for a real query, while line numbers stay accurate.
  const css = stylesOnly(readFileSync(file, "utf8"), ext).replace(
    /\/\*[\s\S]*?\*\//g,
    blank,
  );

  for (const m of css.matchAll(/@media([^{]*)\{/g)) {
    const condition = m[1];
    const line = lineOf(css, m.index);

    for (const ref of condition.matchAll(/--[\w-]+/g)) {
      if (!defined.has(ref[0])) {
        findings.push(
          `${rel(file)}:${line}  @media references undefined custom media "${ref[0]}"`,
        );
      }
    }
    if (/\d+px/.test(condition)) {
      findings.push(
        `${rel(file)}:${line}  literal px breakpoint in @media — use a --mq-* custom media (src/styles/media.css)`,
      );
    }
  }
}

if (findings.length === 0) {
  console.log(`✓ custom-media: ${defined.size} breakpoints, all references valid`);
  process.exit(0);
}

console.error(`✗ custom-media: ${findings.length} finding(s)\n`);
for (const f of findings) console.error("  • " + f);
console.error("\nSee .ai/skills/breakpoints-check/SKILL.md");
process.exit(1);
