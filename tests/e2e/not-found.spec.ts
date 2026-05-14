import { test, expect } from "@playwright/test";

test("unknown route renders the custom 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist", {
    waitUntil: "domcontentloaded",
  });
  // Status may be 200 (serve default) or 404 (Amplify) depending on host;
  // what matters is the rendered body.
  expect(response?.status()).toBeGreaterThanOrEqual(200);
  await expect(page.getByRole("heading", { level: 1, name: /page not found/i })).toBeVisible();
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Projects" })).toBeVisible();
});

test("direct /404/ URL also renders the 404 page", async ({ page }) => {
  await page.goto("/404/");
  await expect(page.getByRole("heading", { level: 1, name: /page not found/i })).toBeVisible();
});

test("clicking Home from the 404 page returns to the homepage", async ({ page }) => {
  await page.goto("/some-bogus-path");
  await page.getByRole("main").getByRole("link", { name: "Home" }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Hi, I.*Nick Baynham/i })).toBeVisible();
});
