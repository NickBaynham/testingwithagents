import { test, expect } from "@playwright/test";

test("blog index lists all seven posts newest first", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.getByRole("heading", { level: 1, name: /notes on testing/i })).toBeVisible();

  const titles = await page.getByRole("heading", { level: 2 }).allTextContents();
  expect(titles[0]).toMatch(/from exploration to automation/i);
  expect(titles).toHaveLength(7);
});

test("category filter narrows the post list", async ({ page }) => {
  await page.goto("/blog/");
  await page
    .getByRole("group", { name: /category/i })
    .getByRole("button", { name: "Quality Strategy" })
    .click();

  await expect(
    page.getByRole("heading", { name: /What QA should provide as evidence of readiness/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Software testing for the agentic era/i }),
  ).not.toBeVisible();
});

test("clicking a post on the index opens the case study with related posts", async ({ page }) => {
  await page.goto("/blog/");
  await page.getByRole("link", { name: /software testing for the agentic era/i }).click();
  await expect(page).toHaveURL(/\/blog\/software-testing-for-the-agentic-era\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /software testing for the agentic era/i }),
  ).toBeVisible();
  // Reading-time + byline visible.
  await expect(page.getByText(/min read/i)).toBeVisible();
  // Related posts surface.
  await expect(page.getByRole("heading", { name: /related posts/i })).toBeVisible();
  // Post navigation.
  await expect(page.getByRole("navigation", { name: /post navigation/i })).toBeVisible();
});

test("home renders the three most recent posts in Latest writing", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: /Latest writing/i }),
  });
  const titles = await section.getByRole("heading", { level: 3 }).allTextContents();
  expect(titles).toHaveLength(3);
  expect(titles[0]).toMatch(/from exploration to automation/i);
});

test("rss.xml is served with all post URLs", async ({ page }) => {
  const response = await page.request.get("/rss.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("<rss");
  for (const slug of [
    "from-exploration-to-automation-agentic-testing-workflow",
    "exploratory-testing-with-claude-code-and-playwright-mcp",
    "agentic-test-data-manager",
    "software-testing-for-the-agentic-era",
    "why-ai-agents-still-need-human-testers",
    "agentic-engineering-antipatterns",
    "what-qa-should-provide-as-evidence-of-readiness",
  ]) {
    expect(body).toContain(`/blog/${slug}/`);
  }
});

test("feed.json validates as JSON Feed 1.1 and lists the posts", async ({ page }) => {
  const response = await page.request.get("/feed.json");
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.version).toBe("https://jsonfeed.org/version/1.1");
  expect(body.items).toHaveLength(7);
  expect(body.items[0].url).toContain(
    "/blog/from-exploration-to-automation-agentic-testing-workflow/",
  );
});

test("sitemap.xml includes every blog post route", async ({ page }) => {
  const response = await page.request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const body = await response.text();
  for (const slug of [
    "from-exploration-to-automation-agentic-testing-workflow",
    "exploratory-testing-with-claude-code-and-playwright-mcp",
    "agentic-test-data-manager",
    "software-testing-for-the-agentic-era",
    "why-ai-agents-still-need-human-testers",
    "agentic-engineering-antipatterns",
    "what-qa-should-provide-as-evidence-of-readiness",
  ]) {
    expect(body).toContain(`/blog/${slug}`);
  }
});

test("footer RSS link is present and points at /rss.xml", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const rss = footer.getByRole("link", { name: "RSS" });
  await expect(rss).toBeVisible();
  await expect(rss).toHaveAttribute("href", "/rss.xml");
});

const POST_SLUGS = [
  "from-exploration-to-automation-agentic-testing-workflow",
  "exploratory-testing-with-claude-code-and-playwright-mcp",
  "agentic-test-data-manager",
  "software-testing-for-the-agentic-era",
  "why-ai-agents-still-need-human-testers",
  "agentic-engineering-antipatterns",
  "what-qa-should-provide-as-evidence-of-readiness",
] as const;

test.describe("post body never leaks YAML frontmatter", () => {
  for (const slug of POST_SLUGS) {
    test(`${slug} article does not render frontmatter literals`, async ({ page }) => {
      await page.goto(`/blog/${slug}/`);
      const article = page.locator("article").first();
      const text = (await article.innerText()).toLowerCase();
      // These tokens only exist in YAML frontmatter; if they appear in the
      // rendered article body it means the MDX compiler is treating the
      // `---YAML---` block as content instead of stripping it.
      expect(text).not.toContain("publishedat:");
      expect(text).not.toContain('slug: "');
      expect(text).not.toContain('excerpt: "');
    });
  }
});

test.describe("post code blocks are readable in every theme", () => {
  const THEMES = ["light", "dark", "warm"] as const;
  for (const theme of THEMES) {
    test(`code block bg vs. code text meets WCAG AA contrast in ${theme} theme`, async ({
      page,
    }) => {
      // Set the theme BEFORE first navigation so the no-FOUC bootstrap picks it up.
      await page.addInitScript((t) => {
        window.localStorage.setItem("theme", t);
      }, theme);
      await page.goto("/blog/agentic-test-data-manager/");
      const pre = page.locator("article pre").first();
      await expect(pre).toBeVisible();
      const ratio = await pre.evaluate((el) => {
        const code = el.querySelector("code") ?? el;
        const preBg = window.getComputedStyle(el).backgroundColor;
        const codeFg = window.getComputedStyle(code).color;
        // Render each color through a canvas so any browser format (rgb, lab,
        // color()) resolves to a concrete sRGB triple.
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d")!;
        const toRgb = (input: string): [number, number, number] => {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "#000";
          ctx.fillStyle = input;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          return [r, g, b];
        };
        const lum = ([r, g, b]: [number, number, number]) => {
          const ch = (c: number) => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
        };
        const L1 = lum(toRgb(preBg));
        const L2 = lum(toRgb(codeFg));
        const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
        return (hi + 0.05) / (lo + 0.05);
      });
      // WCAG AA body-text contrast floor. Dark-on-dark code blocks come in
      // around 2:1, which is what the user reported as unreadable.
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  }
});
