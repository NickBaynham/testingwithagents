import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/blog/", "/blog/software-testing-for-the-agentic-era/"] as const;
const themes = ["light", "dark", "warm"] as const;

for (const path of routes) {
  for (const theme of themes) {
    test(`@a11y ${path} in ${theme} theme has no serious or critical violations`, async ({
      page,
    }) => {
      await page.addInitScript((t) => {
        try {
          window.localStorage.setItem("theme", t);
        } catch {
          /* ignore */
        }
      }, theme);

      await page.goto(path, { waitUntil: "networkidle" });
      // Make sure the page has actually painted before axe samples colors.
      await page.getByRole("heading", { level: 1 }).first().waitFor({ state: "visible" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(blocking).toEqual([]);
    });
  }
}
