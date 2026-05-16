import { test, expect } from "@playwright/test";

test("/resume.pdf is served as a PDF and has reasonable size", async ({ page }) => {
  const response = await page.request.get("/resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/application\/pdf/);
  const buffer = await response.body();
  // PDFs start with the magic %PDF- header.
  expect(buffer.slice(0, 5).toString()).toBe("%PDF-");
  // The build-time render is over 50 KB; well under 5 MB.
  expect(buffer.byteLength).toBeGreaterThan(50_000);
  expect(buffer.byteLength).toBeLessThan(5_000_000);
});

test("Home Download Resume CTA links to /resume.pdf", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("main").getByRole("link", { name: "Download Resume" });
  await expect(link).toHaveAttribute("href", "/resume.pdf");
});

test("/resume page surfaces a Download PDF link to /resume.pdf", async ({ page }) => {
  await page.goto("/resume/");
  const link = page.getByRole("link", { name: "Download PDF" });
  await expect(link).toHaveAttribute("href", "/resume.pdf");
});
