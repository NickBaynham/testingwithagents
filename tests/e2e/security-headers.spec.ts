import { test, expect } from "@playwright/test";

/*
  Asserts the security headers we ship in Amplify Hosting's custom-headers
  configuration. The local Playwright `serve` instance does NOT set these
  headers, so the test only runs when SECURITY_HEADERS_URL is set to a
  reachable Amplify URL (typically the preview or production host). The
  GitHub Actions deploy job sets this to the canonical URL after the
  release lands.
*/

const target = process.env.SECURITY_HEADERS_URL;

test.describe("security headers (live Amplify host)", () => {
  test.skip(!target, "Set SECURITY_HEADERS_URL to a deployed Amplify URL to run.");

  test("HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, and COOP are present", async ({
    request,
  }) => {
    const url = target as string;
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toMatch(/camera=\(\)/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  });
});
