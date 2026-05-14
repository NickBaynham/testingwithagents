import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/about/", "/resume/", "/contact/"] as const;

for (const path of routes) {
  test(`@a11y ${path} has no serious or critical violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(blocking).toEqual([]);
  });
}
