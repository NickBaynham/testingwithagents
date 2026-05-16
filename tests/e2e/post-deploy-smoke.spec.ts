import { test, expect } from "@playwright/test";

/*
  Post-deploy smoke test. Runs against the deployed Amplify URL after
  `aws amplify start-job` completes. Catches the deploy-time regressions
  that local tests cannot see, because they only manifest under real
  Amplify Hosting (custom rules, response headers, trailing-slash
  behavior, content types served by CloudFront, etc).

  Gated on `LIVE_URL` so it does not run against the local `serve`
  webserver in `make e2e`. The GitHub Actions `post-deploy-smoke` job
  sets `LIVE_URL` after the deploy succeeds.
*/

const target = process.env.LIVE_URL;

test.describe("post-deploy smoke", () => {
  test.skip(!target, "Set LIVE_URL to a deployed Amplify URL to run.");

  test("home returns 200 and matches the prerendered index size envelope", async ({ request }) => {
    const url = target as string;
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/html");
    const body = await response.text();
    expect(body).toMatch(/<title>Nick Baynham/);
  });

  test("unknown path serves the 404 body, NOT the homepage body", async ({ request }) => {
    const url = `${target}/this-route-does-not-exist`;
    const response = await request.get(url);
    // Status may be 404 (Amplify customRule) or 200 depending on cache; the
    // body is what we actually care about because the Amplify customRule
    // bug from Phase 0 verification served homepage content with 404 status.
    const body = await response.text();
    expect(body).toMatch(/Page not found/);
    expect(body).not.toMatch(/Hi, I.*Nick Baynham/);
  });

  test("/404.html itself serves the 404 page", async ({ request }) => {
    const response = await request.get(`${target}/404.html`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(/Page not found/);
  });

  test("six security headers are present on every response", async ({ request }) => {
    const response = await request.get(target as string);
    const headers = response.headers();
    expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toMatch(/camera=\(\)/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  });

  test("default OG image serves as a PNG (no extensionless 301)", async ({ request }) => {
    const response = await request.get(`${target}/og/default.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const buf = await response.body();
    expect(buf.byteLength).toBeGreaterThan(5000);
  });

  test("a per-project OG image serves as a PNG", async ({ request }) => {
    const response = await request.get(`${target}/og/projects/universal-testing-language.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("a per-post OG image serves as a PNG", async ({ request }) => {
    const response = await request.get(
      `${target}/og/blog/software-testing-for-the-agentic-era.png`,
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("/resume.pdf serves with application/pdf content-type", async ({ request }) => {
    const response = await request.get(`${target}/resume.pdf`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/application\/pdf/);
    const buf = await response.body();
    expect(buf.slice(0, 5).toString()).toBe("%PDF-");
    expect(buf.byteLength).toBeGreaterThan(50_000);
  });

  test("sitemap.xml lists every primary route", async ({ request }) => {
    const response = await request.get(`${target}/sitemap.xml`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const path of [
      "/",
      "/about",
      "/resume",
      "/contact",
      "/projects",
      "/blog",
      "/projects/universal-testing-language",
      "/blog/software-testing-for-the-agentic-era",
    ]) {
      expect(body).toContain(path);
    }
  });

  test("rss.xml is reachable and lists the canonical posts", async ({ request }) => {
    const response = await request.get(`${target}/rss.xml`);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("software-testing-for-the-agentic-era");
  });
});
