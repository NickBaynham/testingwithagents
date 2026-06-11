import { test, expect } from "@playwright/test";

test("landing page renders and links to both implementations", async ({ page }) => {
  await page.goto("/reference-implementations/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Test Automation Reference Implementations",
  );
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Python Playwright", exact: true })).toHaveAttribute(
    "href",
    "/reference-implementations/python-playwright/",
  );
  await expect(
    main.getByRole("link", { name: "TypeScript Playwright", exact: true }),
  ).toHaveAttribute("href", "/reference-implementations/typescript-playwright/");
});

test("nav parent link navigates to the landing page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Reference Implementations" }).click();
  await expect(page).toHaveURL(/\/reference-implementations\/$/);
});

test("nav submenu reveals both implementation links on hover (desktop)", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "the hover dropdown is a desktop-only enhancement by design");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const banner = page.getByRole("banner");
  const submenuLink = banner.getByRole("link", { name: "Python Playwright" });
  await expect(submenuLink).toBeHidden();
  await banner.getByRole("link", { name: "Reference Implementations" }).hover();
  await expect(submenuLink).toBeVisible();
  await expect(banner.getByRole("link", { name: "TypeScript Playwright" })).toBeVisible();
  await submenuLink.click();
  await expect(page).toHaveURL(/\/reference-implementations\/python-playwright\/$/);
});

test("python guide renders its sections", async ({ page }) => {
  await page.goto("/reference-implementations/python-playwright/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Python Playwright");
  for (const section of [
    "Introduction",
    "UI Testing, Step by Step",
    "API Testing, Step by Step",
    "Database Testing, Step by Step",
    "Designing Tests for the Framework",
    "Troubleshooting",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: section, exact: true })).toBeVisible();
  }
});

test("typescript page renders with status table and twin cross-link", async ({ page }) => {
  await page.goto("/reference-implementations/typescript-playwright/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("TypeScript Playwright");
  await expect(page.getByRole("heading", { level: 2, name: "Where It Stands" })).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "Python reference implementation" }),
  ).toHaveAttribute("href", "/reference-implementations/python-playwright/");
});
