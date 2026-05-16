import { test, expect } from "@playwright/test";

test("blog index lists all four posts newest first", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.getByRole("heading", { level: 1, name: /notes on testing/i })).toBeVisible();

  const titles = await page.getByRole("heading", { level: 2 }).allTextContents();
  expect(titles[0]).toMatch(/software testing for the agentic era/i);
  expect(titles).toHaveLength(4);
});

test("category filter narrows the post list", async ({ page }) => {
  await page.goto("/blog/");
  await page
    .getByRole("group", { name: /category/i })
    .getByRole("button", { name: "Quality Strategy" })
    .click();

  await expect(
    page.getByRole("heading", { name: /What QA should provide as evidence of readiness/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Software testing for the agentic era/i }),
  ).not.toBeVisible();
});

test("clicking a post on the index opens the case study with related posts", async ({ page }) => {
  await page.goto("/blog/");
  await page.getByRole("link", { name: /software testing for the agentic era/i }).click();
  await expect(page).toHaveURL(/\/blog\/software-testing-for-the-agentic-era\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /software testing for the agentic era/i }),
  ).toBeVisible();
  // Reading-time + byline visible.
  await expect(page.getByText(/min read/i)).toBeVisible();
  // Related posts surface.
  await expect(page.getByRole("heading", { name: /related posts/i })).toBeVisible();
  // Post navigation.
  await expect(page.getByRole("navigation", { name: /post navigation/i })).toBeVisible();
});

test("home renders the three most recent posts in Latest writing", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: /Latest writing/i }),
  });
  const titles = await section.getByRole("heading", { level: 3 }).allTextContents();
  expect(titles).toHaveLength(3);
  expect(titles[0]).toMatch(/software testing for the agentic era/i);
});

test("rss.xml is served with all post URLs", async ({ page }) => {
  const response = await page.request.get("/rss.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("<rss");
  for (const slug of [
    "software-testing-for-the-agentic-era",
    "why-ai-agents-still-need-human-testers",
    "agentic-engineering-antipatterns",
    "what-qa-should-provide-as-evidence-of-readiness",
  ]) {
    expect(body).toContain(`/blog/${slug}/`);
  }
});

test("feed.json validates as JSON Feed 1.1 and lists the posts", async ({ page }) => {
  const response = await page.request.get("/feed.json");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.version).toBe("https://jsonfeed.org/version/1.1");
  expect(body.items).toHaveLength(4);
  expect(body.items[0].url).toContain("/blog/software-testing-for-the-agentic-era/");
});

test("sitemap.xml includes every blog post route", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const slug of [
    "software-testing-for-the-agentic-era",
    "why-ai-agents-still-need-human-testers",
    "agentic-engineering-antipatterns",
    "what-qa-should-provide-as-evidence-of-readiness",
  ]) {
    expect(body).toContain(`/blog/${slug}`);
  }
});

test("footer RSS link is present and points at /rss.xml", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const rss = footer.getByRole("link", { name: "RSS" });
  await expect(rss).toBeVisible();
  await expect(rss).toHaveAttribute("href", "/rss.xml");
});
