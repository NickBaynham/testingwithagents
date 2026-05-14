import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("@a11y homepage has no serious or critical violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );

  expect(blocking).toEqual([]);
});
