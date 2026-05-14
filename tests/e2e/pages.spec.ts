import { test, expect } from "@playwright/test";

const pages = [
  { path: "/about/", h1: /coming from|^About/i, navLabel: "About", hasSummary: true },
  { path: "/resume/", h1: /Nick Baynham/i, navLabel: "Resume", hasSummary: true },
  { path: "/contact/", h1: /Let.+talk/i, navLabel: "Contact", hasSummary: false },
] as const;

for (const p of pages) {
  test(`navigates from Home to ${p.path} via the nav and renders the page`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: p.navLabel }).click();
    await expect(page).toHaveURL(new RegExp(`${p.path.replace(/\//g, "\\/")}$`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(p.h1);
  });

  if (p.hasSummary) {
    test(`${p.path} renders the recruiter summary block`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.getByRole("complementary", { name: /recruiter summary/i })).toBeVisible();
    });
  } else {
    test(`${p.path} does not render the recruiter summary block`, async ({ page }) => {
      // Recruiter summary is intentionally absent on Contact per the plan
      // (Home, About, Resume, Projects, Blog only - keeps the layout focused).
      await page.goto(p.path);
      await expect(page.getByRole("complementary", { name: /recruiter summary/i })).toHaveCount(0);
    });
  }
}

test("home page also renders the recruiter summary block", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("complementary", { name: /recruiter summary/i })).toBeVisible();
});
