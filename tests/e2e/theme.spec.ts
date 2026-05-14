import { test, expect } from "@playwright/test";

test("theme toggle flips data-theme and persists across reload", async ({ page }) => {
  await page.goto("/");
  // The bootstrap script sets data-theme before paint; record the initial value.
  const initial = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(initial === "light" || initial === "dark").toBe(true);

  await page.getByRole("button", { name: /switch to (light|dark) theme/i }).click();

  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(after).not.toBe(initial);

  const persisted = await page.evaluate(() => window.localStorage.getItem("theme"));
  expect(persisted).toBe(after);

  await page.reload();
  const reloaded = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(reloaded).toBe(after);
});

test("first paint matches prefers-color-scheme when no localStorage entry is set", async ({
  browser,
}) => {
  for (const scheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto("/");
    const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(theme).toBe(scheme);
    await context.close();
  }
});
