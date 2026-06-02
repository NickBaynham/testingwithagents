import { test, expect } from "@playwright/test";

test.describe("/test-commander/docs", () => {
  test("renders the documentation hero, command reference, and key sections", async ({ page }) => {
    await page.goto("/test-commander/docs/");

    await expect(
      page.getByRole("heading", { level: 1, name: "End-user documentation" }),
    ).toBeVisible();

    // Command reference: spot-check a foundation skill and the final-phase skill.
    for (const skill of ["tc-core", "tc-continuous-quality", "tc-sandbox", "tc-governance"]) {
      await expect(page.getByRole("heading", { level: 3, name: skill, exact: true })).toBeVisible();
    }

    // A representative command from the reference is documented.
    await expect(page.getByText("/tc:continuous-quality-check", { exact: true })).toBeVisible();

    // The governed-pipeline stages render.
    for (const stage of ["Intent router", "Approval gate", "Audit log"]) {
      await expect(page.getByText(stage, { exact: true }).first()).toBeVisible();
    }

    // The five autonomy modes render in the table.
    for (const name of [
      "read-only-advisor",
      "assisted-testing",
      "approved-execution",
      "pull-request-automation",
      "governed-autonomy",
    ]) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }
  });

  test("metadata is unique and canonical points at the docs route", async ({ page }) => {
    await page.goto("/test-commander/docs/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/test-commander/docs");
    const ogTitle = await page.locator('meta[property="og:title"]').first().getAttribute("content");
    expect(ogTitle).toMatch(/Documentation/);
  });

  test("the overview page links to the docs page", async ({ page }) => {
    await page.goto("/test-commander/");
    const docsLink = page.getByRole("link", { name: "Read the docs" });
    await expect(docsLink).toHaveAttribute("href", "/test-commander/docs/");
    await docsLink.click();
    await expect(page).toHaveURL(/\/test-commander\/docs\/$/);
  });
});
