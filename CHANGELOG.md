# Changelog

All notable shipped changes. Newest entries at the top.

## Unreleased

### Phase 0 - Foundations

- Scaffolded Next.js 16 + TypeScript (strict) + Tailwind CSS v4 via `create-next-app`.
- Configured ESLint (next/core-web-vitals + typescript), Prettier, markdownlint-cli2, and EditorConfig. `make lint` is green.
- Added Vitest + React Testing Library with `tests/unit/setup.ts` and a first Home component test. `make unit` is green.
- Added Playwright with `chromium-desktop` (1280x800) and `chromium-mobile` (Pixel 7, 390x844) projects and a homepage smoke test. `make e2e` is green.
- Added `@axe-core/playwright` with a homepage a11y test under `tests/a11y/`. `make a11y` is green.
- Added `lychee.toml` and a lychee service in `docker/docker-compose.yml`.
- Added `docker/docker-compose.yml` with services for Plausible analytics (long-running) and lychee (one-shot under the `tools` profile).
- Added GitHub Actions workflow `.github/workflows/ci.yml` with jobs for lint, typecheck, unit, build, e2e, a11y, and linkcheck.
- Created documentation stubs: `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/CONTENT_GUIDE.md`, `docs/DEPLOYMENT.md`.
- Consolidated agent context into `AGENTS.md` (replacing the prior `Agent.md`). `CLAUDE.md` references it via `@AGENTS.md`.
- Updated `plan/plan.md` to reflect Next.js 16, AWS Amplify Hosting as primary, expanded Make targets, deferred projects, nonce-CSP strategy, and resume PDF generation from MDX.
- Set `allowedDevOrigins: ["127.0.0.1", "localhost"]` in `next.config.ts` to silence Next.js 16's cross-origin dev resource warning.
- Switched Next.js to static export (`output: "export"`, `trailingSlash: true`, `images.unoptimized: true`). `next build` now emits `out/` instead of the SSR-style `.next/` server bundle, matching the static-only hosting target.
- Replaced `npm run start` (`next start`) with `serve out -l tcp://0.0.0.0:3000`; added `serve` as a devDependency so Playwright's `webServer` works in CI against the exported static site.
- Updated `.github/workflows/ci.yml`: build artifact path changed from `.next` to `out`, and the lychee glob now points at `./out/**/*.html`.
- Added `amplify.yml` build spec for AWS Amplify Hosting (Node 24 via nvm, `npm ci`, `npm run build`, `baseDirectory: out`, with `node_modules` and `.next/cache` caching).
- Added `/test-results` and `/playwright-report` to `.gitignore`; added the same paths to `.prettierignore` so local Playwright artifacts no longer fail `make lint`.
- Removed Lighthouse / Lighthouse CI from project scope: dropped the `lighthouse` Make target, the `lighthouse` Docker Compose service, the `Performance` row in the testing strategy, and all phase tasks/exit-criteria that depended on it. Manual PageSpeed checks remain available when needed.
- Added a `deploy` job to `.github/workflows/ci.yml`. On push to `main`, after every CI job passes, the workflow assumes an AWS IAM role via GitHub OIDC and triggers `aws amplify start-job --job-type RELEASE`. Requires `AWS_DEPLOY_ROLE_ARN` and `AMPLIFY_APP_ID` secrets, with an optional `AWS_REGION` repo variable.
- Replaced the boilerplate `create-next-app` README with a project README: project summary, doc index, `make` quickstart, and a step-by-step AWS Amplify Hosting + GitHub OIDC setup walkthrough. Detailed operational concerns continue to live in `docs/DEPLOYMENT.md`.
- First production-mode deploy live at `https://main.d2f2x4ij8pxn6g.amplifyapp.com`. Amplify App ID `d2f2x4ij8pxn6g` recorded in `docs/DEPLOYMENT.md`. End-to-end pipeline verified: `git push origin main` -> Amplify GitHub-App webhook -> `amplify.yml` build (Node 24, `npm ci`, `next build`) -> static `out/` deployed to the Amplify CDN -> homepage serves HTTP 200.
