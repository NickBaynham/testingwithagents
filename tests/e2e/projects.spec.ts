import { test, expect } from "@playwright/test";

test("projects index lists all three featured projects", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.getByRole("heading", { level: 1, name: /proof of work/i })).toBeVisible();
  for (const title of [
    "Universal Testing Language",
    "Agentic Testing Workflow Prototype",
    "API Automation Framework",
  ]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});

test("category filter narrows the project list", async ({ page }) => {
  await page.goto("/projects/");
  // 3 cards initially.
  await expect(page.getByRole("link", { name: /Universal Testing Language/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /API Automation Framework/i })).toBeVisible();

  // Pick "API Testing" - only the API project matches.
  await page
    .getByRole("group", { name: /category/i })
    .getByRole("button", { name: "API Testing" })
    .click();

  await expect(page.getByRole("link", { name: /API Automation Framework/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Universal Testing Language/i })).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: /Agentic Testing Workflow Prototype/i }),
  ).not.toBeVisible();
});

test("technology filter narrows the project list", async ({ page }) => {
  await page.goto("/projects/");
  await page
    .getByRole("group", { name: /technology/i })
    .getByRole("button", { name: "Pydantic" })
    .click();

  await expect(page.getByRole("link", { name: /API Automation Framework/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Universal Testing Language/i })).not.toBeVisible();
});

test("clicking a project card opens its case study", async ({ page }) => {
  await page.goto("/projects/");
  await page.getByRole("link", { name: /API Automation Framework/i }).click();
  await expect(page).toHaveURL(/\/projects\/api-automation-framework\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "API Automation Framework" }),
  ).toBeVisible();
  // Case-study sections render.
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Testing Strategy" })).toBeVisible();
});

test("home renders three featured projects linking to detail routes", async ({ page }) => {
  await page.goto("/");
  const featuredSection = page.locator("section", {
    has: page.getByRole("heading", { name: /Featured projects/i }),
  });
  for (const title of [
    "Universal Testing Language",
    "Agentic Testing Workflow Prototype",
    "API Automation Framework",
  ]) {
    const link = featuredSection.getByRole("link", { name: new RegExp(title, "i") });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/projects\/[a-z-]+\/$/);
  }
});

test("sitemap.xml includes the three project detail routes", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const slug of [
    "universal-testing-language",
    "agentic-testing-workflow",
    "api-automation-framework",
  ]) {
    expect(body).toContain(`/projects/${slug}`);
  }
});
