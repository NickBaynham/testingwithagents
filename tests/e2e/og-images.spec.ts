import { test, expect, type Page } from "@playwright/test";

async function ogImageUrl(page: Page): Promise<string | null> {
  return await page.locator('meta[property="og:image"]').first().getAttribute("content");
}

const routes = [
  { path: "/", expectedSuffix: "/og/default.png" },
  {
    path: "/projects/universal-testing-language/",
    expectedSuffix: "/og/projects/universal-testing-language.png",
  },
  {
    path: "/blog/software-testing-for-the-agentic-era/",
    expectedSuffix: "/og/blog/software-testing-for-the-agentic-era.png",
  },
] as const;

for (const r of routes) {
  test(`og:image on ${r.path} points to ${r.expectedSuffix}`, async ({ page }) => {
    await page.goto(r.path);
    const og = await ogImageUrl(page);
    expect(og).toBeTruthy();
    expect(og!.endsWith(r.expectedSuffix)).toBe(true);
  });

  test(`og:image asset for ${r.path} is served as a PNG`, async ({ page }) => {
    const response = await page.request.get(r.expectedSuffix);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    // Sanity-check the body length is in the OG-size ballpark (not the 14KB 404 page).
    const buffer = await response.body();
    expect(buffer.byteLength).toBeGreaterThan(5000);
  });
}

test("twitter:image meta is set on a project page", async ({ page }) => {
  await page.goto("/projects/universal-testing-language/");
  const tw = await page.locator('meta[name="twitter:image"]').first().getAttribute("content");
  expect(tw).toBeTruthy();
  expect(tw!.endsWith("/og/projects/universal-testing-language.png")).toBe(true);
});
