# TODO

Work not yet started or in progress. See `plan/plan.md` for full phase context.

## In Progress (Phase 0)

- [x] AWS Amplify app creation, GitHub connection, `AMPLIFY_APP_ID` captured (`d2f2x4ij8pxn6g`) and recorded in `docs/DEPLOYMENT.md`. Branch `main` live at `https://main.d2f2x4ij8pxn6g.amplifyapp.com`.
- [ ] AWS OIDC provider + `testingwithagents-deploy` IAM role + GitHub secrets (`AWS_DEPLOY_ROLE_ARN`, `AMPLIFY_APP_ID`) so the GH Actions `deploy` job stops failing (user-driven, README "AWS Amplify Setup" steps 2-4).
- [x] Write `amplify.yml` build spec for static export.
- [ ] Verify `@tailwindcss/typography` v4 release line and pin once Phase 1 needs prose styling.

## Open Issues

- Transitive `postcss <8.5.10` advisory (XSS in CSS stringify output) inside `node_modules/next/node_modules/postcss`. Only exploitable if untrusted CSS is generated server-side; for an authored static portfolio the risk is low. Wait for a Next.js 16 patch that bumps the bundled postcss; do not `npm audit fix --force` (it downgrades Next to 9.x).
- Visual regression baselines: deferred to Phase 2 (first appears on `/projects`).
- AWS OIDC role + `AWS_DEPLOY_ROLE_ARN` / `AMPLIFY_APP_ID` GitHub secrets must be configured before the `deploy` job in `.github/workflows/ci.yml` can succeed on `main` pushes. See `docs/DEPLOYMENT.md` "Continuous Deployment (GitHub Actions)" for the setup.
- `lychee.toml` excludes placeholder routes (`/about`, `/blog`, `/contact`, `/projects`, `/resume`, `/resume.pdf`) until each phase ships the destination. Remove each exclude line when its phase lands (annotated inline in `lychee.toml`).

## Phase 1 (MVP Skeleton)

### Commit A (done)

- [x] Global layout (header + nav + footer, skip-to-content, dark/light toggle).
- [x] Tailwind design tokens (palette, light/dark themes, WCAG AA verified).
- [x] Home page with real hero, positioning paragraph, four primary CTAs, placeholder sections.
- [x] 404 page.
- [x] `docs/MAINTENANCE.md` skeleton + Commit A catalog entries.

### Commit B (done)

- [x] About, Resume, Contact pages.
- [x] MDX wiring (`@next/mdx`, `mdx-components.tsx`, `pageExtensions`).
- [x] `@tailwindcss/typography` v4 pin via `@plugin` in `app/globals.css`.
- [x] `content/resume/resume.mdx` + `content/recruiter-summary.mdx`.
- [x] `<RecruiterSummary>` block on Home, About, Resume.
- [x] `docs/MAINTENANCE.md` catalog entries for `<RecruiterSummary>` and the three new pages.
- [x] Removed `/about`, `/resume`, `/contact` from `lychee.toml` exclude list (routes now exist).

### Commit C (planned)

- SEO baseline (per-route `generateMetadata`, canonical, OG defaults, `app/sitemap.ts`, `app/robots.ts`).
- Recruiter-journey Playwright E2E (Home -> Resume -> resume.pdf link -> LinkedIn -> Contact).
- axe scans on About, Resume, Contact.
- `docs/MAINTENANCE.md` SEO section + final catalog reconciliation.

## Phase 2 (planned)

- `content/projects/*.mdx` with Zod-validated frontmatter.
- `/projects` index with category/tech filters (progressive enhancement).
- `/projects/[slug]` case-study template.
- Three MVP projects: Universal Testing Language, Agentic Testing Workflow Prototype, API Automation Framework.
- Open Graph image generator.

## Phase 6 (deferred from Phase 2 MVP)

- Playwright Automation Project (req section 7.4).
- Quality Intelligence Dashboard (req section 7.5).

## Phase 3 (planned)

- `content/blog/*.mdx` with reading-time, RSS feed (`/rss.xml`), JSON feed (`/feed.json`).
- Four initial posts per req section 22.

## Phase 4 (planned)

- Structured data (JSON-LD): `Person`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`.
- Nonce-based CSP via middleware; HSTS, Referrer-Policy, Permissions-Policy.
- Build-time resume PDF generated from `content/resume/resume.mdx` via Playwright headless print.

## Phase 5 (planned)

- Amplify production promotion, custom domain attach, ACM cert, www->apex redirect.
- Privacy notice page (`/privacy`).
