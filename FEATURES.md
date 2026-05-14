# Features

Current shipped capabilities of testingwithagents.com.

## Phase 0 (Foundations)

- Buildable Next.js 16 application skeleton with the Tailwind v4 default scaffold.
- Static export build pipeline: `next build` emits a self-contained `out/` directory; `npm run start` serves it via `serve` for local production smoke tests and CI Playwright runs.
- `amplify.yml` build spec at the repo root configures AWS Amplify Hosting for the static export (Node 24 via nvm, cached `node_modules` and `.next/cache`, `baseDirectory: out`).
- Local quality toolchain: lint, format check, typecheck, unit tests, e2e tests, a11y tests, broken-link check, production build - all invoked via `make` targets.
- Reproducible local services via Docker Compose (Plausible analytics, lychee link checker).
- GitHub Actions CI running lint, typecheck, unit, build, e2e, a11y, and linkcheck on every PR.
- GitHub Actions `deploy` job that, on push to `main`, assumes an AWS IAM role via OIDC and triggers an Amplify release through `aws amplify start-job`.
- Documentation skeleton (`docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/CONTENT_GUIDE.md`, `docs/DEPLOYMENT.md`) that grows per phase.

## Phase 1 (planned)

See `plan/plan.md` and `TODO.md`.
