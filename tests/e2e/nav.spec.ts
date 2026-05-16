import { test, expect } from "@playwright/test";
import { primaryNav } from "../../lib/site-config";

test("home renders every primary nav link in the header", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  for (const item of primaryNav) {
    await expect(header.getByRole("link", { name: item.label })).toBeVisible();
  }
});

test("home renders the four primary CTAs with the expected hrefs", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");

  // trailingSlash: true normalizes route hrefs; static files like /resume.pdf
  // keep their original form.
  // trailingSlash: true normalizes route hrefs; static files like /resume.pdf
  // keep their original form (none in the Home CTA set today).
  const portfolio = main.getByRole("link", { name: "View Portfolio" });
  await expect(portfolio).toHaveAttribute("href", "/projects/");

  const blog = main.getByRole("link", { name: "Read the Blog" });
  await expect(blog).toHaveAttribute("href", "/blog/");

  const resume = main.getByRole("link", { name: "Download Resume" });
  await expect(resume).toHaveAttribute("href", "/resume.pdf");

  const contact = main.getByRole("link", { name: "Contact Me" });
  await expect(contact).toHaveAttribute("href", "/contact/");
});

test("home page has working skip-to-content link", async ({ page }) => {
  await page.goto("/");
  // Tab to focus the skip link, which is the first focusable element.
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to main content/i });
  await expect(skip).toBeFocused();
});

test("footer contains LinkedIn, GitHub, and email links", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Email" })).toBeVisible();
});
