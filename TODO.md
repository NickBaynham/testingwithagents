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

### Commit C (done)

- [x] SEO baseline (per-route `generateMetadata`, canonical, OG defaults, `app/sitemap.ts`, `app/robots.ts`).
- [x] Recruiter-journey Playwright E2E (Home -> Resume -> Contact -> LinkedIn). The `/resume.pdf` step waits for the Phase 4 PDF generator.
- [x] axe scans on About, Resume, Contact.
- [x] `docs/MAINTENANCE.md` SEO section + final catalog reconciliation.

Phase 1 MVP skeleton (Commits A + B + C) complete. All five primary nav routes except `/projects` (Phase 2) and `/blog` (Phase 3) are live with real content.

## Phase 2 (in progress)

- [x] Theme system upgrade: default to slate-light regardless of `prefers-color-scheme`, keep slate-dark as opt-in, add warm theme (white + amber-700). `<ThemeToggle>` is now a three-option radiogroup. Axe scans run per-theme on Home, About, Resume, Contact.
- [x] `content/projects/*.mdx` with Zod-validated frontmatter (`lib/content/projects.ts`).
- [x] `/projects` index with Category + Technology filter rows. Filter state in URL, progressively enhanced.
- [x] `/projects/[slug]` case-study route with the 11-section template.
- [x] Three MVP projects: Universal Testing Language, Agentic Testing Workflow Prototype, API Automation Framework.
- [ ] Per-project Open Graph images (moved to Phase 4 task 2). The Next.js `opengraph-image.tsx` route handler emits an extensionless file that Amplify Hosting's static backend 301-redirects, breaking the og:image URL. Phase 4 will replace it with a build-time PNG generator that writes to `public/<route>/og.png` and references the file with an explicit `.png` extension.
- [ ] Visual baselines (Playwright screenshots) on `/projects` and one detail page (deferred - requires Linux CI to generate stable baselines; will land in a Phase 2 follow-up commit when CI runs the screenshot regen).
- [ ] Case-study layout snapshot test (deferred alongside the visual baseline work).

## Phase 6 (deferred from Phase 2 MVP)

- Playwright Automation Project (req section 7.4).
- Quality Intelligence Dashboard (req section 7.5).

## Phase 3 (done)

- [x] `content/blog/*.mdx` with Zod-validated frontmatter and reading-time computed at build (`lib/content/blog.ts`).
- [x] `/blog` index with Category + Tag filter chips, RSS/JSON feed links, recruiter-summary block.
- [x] `/blog/[slug]` detail route with byline, reading time, related posts (tag overlap), prev/next.
- [x] RSS feed (`/rss.xml`) and JSON feed (`/feed.json`) generated at build.
- [x] Four initial posts authored per requirements section 22.
- [x] Home "Latest writing" wired to load the 3 most recent posts.
- [x] Footer RSS link.
- [x] Sitemap includes blog routes; `/blog` removed from `lychee.toml` excludes.

## Phase 4 (done)

- [x] Structured data (JSON-LD): `Person`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`.
- [x] Per-route Open Graph images via build-time PNG script (corrected fix for the Phase 2 rollback).
- [x] Security headers via `amplify.yml customHeaders`: HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, COOP.
- [x] Build-time resume PDF from `content/resume/resume.mdx` via Playwright headless print.

### Phase 4 deviations carried as follow-ups

- **CSP**: deferred. Nonce CSP needs a runtime (incompatible with `output: "export"`); hash CSP needs automated SHA-256 regen on every `themeBootstrap` edit. Add when a hash-pinning hook is wired into the build.
- **Visual baselines + case-study snapshot test**: still deferred from Phase 2 (requires Linux CI to generate stable baselines first).
- **Sitemap lastmod from frontmatter**: blog uses `publishedAt`/`updatedAt`; project frontmatter has no `updatedAt` field today. Falls back to build time. Low priority.
- **Image audit (AVIF/WebP)**: no shipped images yet beyond the OG PNGs. Revisit when cover images land.

## Phase 5 (planned)

- Amplify production promotion, custom domain attach, ACM cert, www->apex redirect.
- Privacy notice page (`/privacy`).
