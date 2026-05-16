import { test, expect } from "@playwright/test";

test("privacy page renders with the expected sections", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(
    page.getByRole("heading", { level: 1, name: /What this site knows about you/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Data this site collects/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /What this site does not do/i })).toBeVisible();
});

test("footer Privacy link navigates to /privacy", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
});

test("sitemap.xml includes /privacy", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/<loc>https:\/\/[^<]+\/privacy<\/loc>/);
});
