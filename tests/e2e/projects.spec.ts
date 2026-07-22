import { test, expect } from "@playwright/test";

test("projects index lists all five projects", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.getByRole("heading", { level: 1, name: /proof of work/i })).toBeVisible();
  for (const title of [
    "Universal Testing Language",
    "Agentic Testing Workflow Prototype",
    "API Automation Framework",
    "Marketing Commander",
    "Dev Commander",
  ]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
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
  await expect(page.getByRole("link", { name: /Marketing Commander/i })).not.toBeVisible();
  await expect(page.getByRole("link", { name: /Dev Commander/i })).not.toBeVisible();
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

test("sitemap.xml includes the five project detail routes", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const slug of [
    "universal-testing-language",
    "agentic-testing-workflow",
    "api-automation-framework",
    "marketing-commander",
    "dev-commander",
  ]) {
    expect(body).toContain(`/projects/${slug}`);
  }
});

test("marketing commander case study renders the Test Commander section", async ({ page }) => {
  await page.goto("/projects/marketing-commander/");
  await expect(page.getByRole("heading", { level: 1, name: "Marketing Commander" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "How Test Commander Tests This Project", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/587 mechanical findings/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeVisible();
});

test("dev commander case study renders the Test Commander handoff section", async ({ page }) => {
  await page.goto("/projects/dev-commander/");
  await expect(page.getByRole("heading", { level: 1, name: "Dev Commander" })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "How Dev Commander Hands Off to Test Commander",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText(/dc:handoff-to-tc/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeVisible();
});
