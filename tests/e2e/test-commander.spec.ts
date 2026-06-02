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
    // Phase 0-4 shipped surface: install pair (./bootstrap.sh + make install)
    // plus five /tc:* commands spanning all four shipped skills.
    for (const cmd of [
      "./bootstrap.sh",
      "make install",
      "/tc:init",
      "/tc:status",
      "/tc:journal append",
      "/tc:next",
      "/tc:review-requirements",
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
      await expect(
        page.getByRole("heading", { level: 3, name: audience, exact: true }),
      ).toBeVisible();
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
    // Scope to the adoption section: "Governed autonomy" is also an autonomy-mode
    // heading elsewhere on the page, so an unscoped exact match collides under
    // strict mode. exact: true — several adoption-stage titles (e.g. "Strategic
    // automation") are substrings of capability-roadmap card titles. See the
    // heading-locator note in AGENTS.md.
    const adoption = page.locator('section[aria-labelledby="adoption-heading"]');
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
      await expect(
        adoption.getByRole("heading", { level: 3, name: title, exact: true }),
      ).toBeVisible();
    }
  });

  test("autonomy modes render with Mode 3 flagged as recommended default", async ({ page }) => {
    await page.goto("/test-commander/");
    // Scope to the autonomy section: "Governed autonomy" also titles an
    // adoption-roadmap stage, so an unscoped exact match collides under strict mode.
    const autonomy = page.locator('section[aria-labelledby="autonomy-heading"]');
    // The five shipped autonomy modes (0 read-only-advisor → 4 governed-autonomy).
    for (const name of [
      "Read-only advisor",
      "Assisted testing",
      "Approved execution",
      "Pull-request automation",
      "Governed autonomy",
    ]) {
      await expect(autonomy.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
    }
    // The "Recommended default" pill is a sibling of the Mode 3 heading.
    const mode3Card = autonomy
      .getByRole("heading", { level: 3, name: "Pull-request automation", exact: true })
      .locator("xpath=ancestor::li[1]");
    await expect(mode3Card.getByText(/Recommended default/i)).toBeVisible();
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
