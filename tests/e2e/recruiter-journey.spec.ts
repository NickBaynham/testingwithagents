import { test, expect } from "@playwright/test";

test("recruiter journey: home -> resume -> contact -> LinkedIn link", async ({ page }) => {
  // 1. Land on Home, see hero + tagline + primary CTA.
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Nick Baynham/i })).toBeVisible();
  await expect(page.getByText(/Software testing for the agentic era/i).first()).toBeVisible();

  // 2. Click "View Resume" CTA in the hero, land on /resume/.
  await page.getByRole("main").getByRole("link", { name: "View Resume" }).click();
  await expect(page).toHaveURL(/\/resume\/$/);
  await expect(page.getByRole("heading", { level: 1, name: /Nick Baynham/i })).toBeVisible();

  // 3. Resume page surfaces the recruiter summary and contact button.
  await expect(page.getByRole("complementary", { name: /recruiter summary/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact me" })).toBeVisible();

  // 4. Click Contact, land on /contact/.
  await page.getByRole("link", { name: "Contact me" }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.getByRole("heading", { level: 1, name: /Let.+talk/i })).toBeVisible();

  // 5. LinkedIn link is reachable from Contact (and footer).
  const linkedinLinks = page.getByRole("link", { name: "LinkedIn" });
  await expect(linkedinLinks.first()).toBeVisible();
  await expect(linkedinLinks.first()).toHaveAttribute("href", /linkedin\.com\/in\/nickbaynham/);
});

test("sitemap.xml is served with all primary routes", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("<urlset");
  for (const path of ["/", "/about", "/resume", "/contact"]) {
    const url = new RegExp(`<loc>https://[^<]+${path === "/" ? "/?</loc>" : path + "/?</loc>"}`);
    expect(body).toMatch(url);
  }
});

test("robots.txt allows crawling and references the sitemap", async ({ page }) => {
  const response = await page.request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/User-Agent: \*/);
  expect(body).toMatch(/Allow: \//);
  expect(body).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/);
});

test("home page carries canonical, og, and twitter metadata", async ({ page }) => {
  await page.goto("/");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toContain("testingwithagents.com");
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
  expect(ogTitle).toMatch(/Nick Baynham/i);
  const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
  expect(twitterCard).toBe("summary_large_image");
});
