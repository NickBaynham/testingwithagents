import { test, expect } from "@playwright/test";

test("homepage renders and exposes a top-level heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
