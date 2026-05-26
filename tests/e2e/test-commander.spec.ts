import { test, expect } from "@playwright/test";

test.describe("/test-commander", () => {
  test("hero, workflow loop, and terminal commands render", async ({ page }) => {
    await page.goto("/test-commander/");

    // Hero
    await expect(page.getByRole("heading", { level: 1, name: "Test Commander" })).toBeVisible();
    await expect(
      page.getByText(/AI-assisted software testing from exploration to automation/i),
    ).toBeVisible();

    // The workflow centerpiece: every step label must be present.
    for (const step of [
      "Explore",
      "Model",
      "Specify",
      "Automate",
      "Execute",
      "Report",
      "Improve",
    ]) {
      await expect(
        page.getByRole("heading", { level: 3, name: new RegExp(`\\b${step}\\b`) }).first(),
      ).toBeVisible();
    }

    // The seven terminal commands all appear, exactly as documented.
    for (const cmd of [
      "make setup",
      "make app-up",
      "make explore-ui",
      "make generate-bdd",
      "make generate-tests",
      "make test-ui",
      "make report-quality",
    ]) {
      await expect(page.getByText(cmd, { exact: true }).first()).toBeVisible();
    }

    // Audience grid renders all five cards.
    for (const audience of [
      "Manual testers",
      "Automation engineers",
      "QA managers",
      "Recruiters and hiring managers",
      "Clients",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name: audience })).toBeVisible();
    }

    // CTA section links to Contact and LinkedIn. trailingSlash: true in
    // next.config.ts normalizes internal hrefs to end with "/".
    const cta = page.getByRole("link", { name: "Contact me" });
    await expect(cta).toHaveAttribute("href", "/contact/");
    await expect(page.getByRole("link", { name: "Connect on LinkedIn" })).toHaveAttribute(
      "href",
      /linkedin\.com\/in\/nickbaynham/,
    );
  });

  test("safety positioning tagline appears in the hero", async ({ page }) => {
    await page.goto("/test-commander/");
    await expect(page.getByText(/Autonomous where safe\./i)).toBeVisible();
    await expect(page.getByText(/Human-governed where it matters\./i)).toBeVisible();
  });

  test("implementation roadmap renders all nine adoption stages", async ({ page }) => {
    await page.goto("/test-commander/");
    for (const title of [
      "Quality visibility",
      "Requirements review",
      "Guided exploration",
      "BDD and test design",
      "Strategic automation",
      "Team web console",
      "Sandboxed workspaces",
      "Continuous self-improvement",
      "Governed autonomy",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
  });

  test("autonomy levels render with Level 3 flagged as recommended default", async ({ page }) => {
    await page.goto("/test-commander/");
    for (const name of [
      "Read-only advisor",
      "Assisted testing",
      "Approved execution",
      "Pull request automation",
      "Governed maintenance",
      "Fully autonomous agent",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
    // The "Recommended default" pill is a sibling of the Level 3 heading.
    const level3Card = page
      .getByRole("heading", { level: 3, name: "Pull request automation" })
      .locator("xpath=ancestor::li[1]");
    await expect(level3Card.getByText(/Recommended default/i)).toBeVisible();
  });

  test("continuous quality agent section renders the flow and the PR-comment artifact", async ({
    page,
  }) => {
    await page.goto("/test-commander/");
    // The continuous-loop ordered list has an accessible name.
    const loop = page.getByRole("list", { name: /Continuous quality agent loop/i });
    await expect(loop).toBeVisible();
    for (const step of [
      "Code change detected",
      "Impact analysis",
      "Story and risk review",
      "Coverage gap analysis",
      "Generate candidates",
      "Run impacted suite",
      "Capture evidence",
      "Open PR · learn",
    ]) {
      await expect(loop.getByText(step, { exact: true })).toBeVisible();
    }
    // PR-comment terminal artifact carries the agent's distinctive opening line.
    await expect(page.getByText(/Test Commander Analysis/)).toBeVisible();
    await expect(page.getByText(/Approve generated Playwright test candidate/)).toBeVisible();
  });

  test("page metadata is unique and references the OG image", async ({ page }) => {
    await page.goto("/test-commander/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/test-commander");
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(ogImage).toMatch(/\/og\/test-commander\.png$/);
    const ogTitle = await page.locator('meta[property="og:title"]').first().getAttribute("content");
    expect(ogTitle).toMatch(/Test Commander/);
  });

  test("nav exposes Test Commander as a top-level link", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("banner").getByRole("link", { name: "Test Commander" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/test-commander\/$/);
  });
});
