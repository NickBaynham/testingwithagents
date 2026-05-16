import { test, expect, type Page } from "@playwright/test";

async function readJsonLd(page: Page): Promise<unknown[]> {
  return await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((n) => {
      try {
        return JSON.parse(n.textContent ?? "");
      } catch {
        return { _parseError: true };
      }
    }),
  );
}

test("home page emits a Person JSON-LD block", async ({ page }) => {
  await page.goto("/");
  const blocks = await readJsonLd(page);
  expect(blocks.length).toBeGreaterThan(0);
  const types = blocks.map((b) => (b as { "@type"?: string })["@type"]);
  expect(types).toContain("Person");
});

test("about page emits Person and BreadcrumbList JSON-LD blocks", async ({ page }) => {
  await page.goto("/about/");
  const blocks = await readJsonLd(page);
  const types = blocks.map((b) => (b as { "@type"?: string })["@type"]);
  expect(types).toContain("Person");
  expect(types).toContain("BreadcrumbList");
});

test("blog post page emits BlogPosting and BreadcrumbList JSON-LD blocks", async ({ page }) => {
  await page.goto("/blog/software-testing-for-the-agentic-era/");
  const blocks = await readJsonLd(page);
  const types = blocks.map((b) => (b as { "@type"?: string })["@type"]);
  expect(types).toContain("BlogPosting");
  expect(types).toContain("BreadcrumbList");

  const posting = blocks.find((b) => (b as { "@type"?: string })["@type"] === "BlogPosting") as
    | Record<string, unknown>
    | undefined;
  expect(posting?.headline).toBe("Software testing for the agentic era");
  expect(posting?.datePublished).toBe("2026-05-12");
  expect(posting).toHaveProperty("author");
});

test("project page emits CreativeWork and BreadcrumbList JSON-LD blocks", async ({ page }) => {
  await page.goto("/projects/api-automation-framework/");
  const blocks = await readJsonLd(page);
  const types = blocks.map((b) => (b as { "@type"?: string })["@type"]);
  expect(types).toContain("CreativeWork");
  expect(types).toContain("BreadcrumbList");

  const work = blocks.find((b) => (b as { "@type"?: string })["@type"] === "CreativeWork") as
    | Record<string, unknown>
    | undefined;
  expect(work?.name).toBe("API Automation Framework");
  expect(work?.creativeWorkStatus).toBe("Active");
});

test("breadcrumbs are absolute URLs ending with a trailing slash", async ({ page }) => {
  await page.goto("/blog/software-testing-for-the-agentic-era/");
  const blocks = await readJsonLd(page);
  const crumbs = blocks.find((b) => (b as { "@type"?: string })["@type"] === "BreadcrumbList") as
    | Record<string, unknown>
    | undefined;
  const items = crumbs?.itemListElement as Array<Record<string, unknown>>;
  for (const item of items) {
    expect(item.item as string).toMatch(/^https?:\/\/.+\/$/);
  }
});
