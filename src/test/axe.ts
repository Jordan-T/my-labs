import axe from "axe-core";

// jsdom can't assess colour contrast, landmark regions, or heading order on an
// isolated component, so we disable those rules and verify them manually
// (see .ai/skills/accessibility-review/SKILL.md).
const DISABLED_RULES = ["color-contrast", "region", "heading-order"];

/** Run axe on a rendered container and return its violations. */
export async function findA11yViolations(
  container: Element,
): Promise<axe.Result[]> {
  const results = await axe.run(container, {
    rules: Object.fromEntries(
      DISABLED_RULES.map((id) => [id, { enabled: false }]),
    ),
  });
  return results.violations;
}
