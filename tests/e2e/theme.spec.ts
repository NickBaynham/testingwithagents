import { test, expect } from "@playwright/test";

test("first paint is light when no localStorage entry exists", async ({ browser }) => {
  // Default-light is the rule regardless of OS prefers-color-scheme.
  for (const scheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto("/");
    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe("light");
    await context.close();
  }
});

test("each of the three themes can be selected, persists across reload", async ({ page }) => {
  await page.goto("/");

  for (const target of ["dark", "warm", "light"] as const) {
    await page
      .getByRole("radiogroup", { name: /theme/i })
      .getByRole("radio", { name: new RegExp(`${target} theme`, "i") })
      .click();

    await expect
      .poll(async () => page.evaluate(() => document.documentElement.getAttribute("data-theme")))
      .toBe(target);

    const persisted = await page.evaluate(() => window.localStorage.getItem("theme"));
    expect(persisted).toBe(target);

    await page.reload();
    const reloaded = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(reloaded).toBe(target);
  }
});

test("active theme's radio is aria-checked=true; others are false", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("radiogroup", { name: /theme/i });
  await group.getByRole("radio", { name: /warm theme/i }).click();

  await expect(group.getByRole("radio", { name: /warm theme/i })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(group.getByRole("radio", { name: /light theme/i })).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await expect(group.getByRole("radio", { name: /dark theme/i })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});
