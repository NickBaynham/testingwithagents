# testingwithagents.com Build Plan

This plan implements the requirements in `requirements/business_requirements.md` as an incremental, phased build. Each phase delivers a verifiable, working slice of the site. Documentation and testing are first-class work items in every phase, not afterthoughts.

## Guiding Principles

- Work in small, testable increments. Each task ends with a passing build, lint, and test run.
- Identify and prove root causes before fixing issues. No guessed fixes.
- Latest stable APIs and libraries. Pin versions in `package.json`.
- Static-first. Generate as much as possible at build time.
- Content as data. Projects and blog posts live as MDX/JSON so they can be added without touching components.
- Update `CHANGELOG.md`, `FEATURES.md`, and `TODO.md` at the end of every task.

## Technology Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSG, MDX, strong SEO, latest React Server Components |
| Language | TypeScript (strict) | Type safety for content models and components |
| Styling | Tailwind CSS v4 | Utility-first, dark/light mode built in |
| Content | MDX + frontmatter | Project pages and blog posts as files |
| Testing - unit | Vitest + React Testing Library | Fast, ESM-native |
| Testing - E2E | Playwright | Aligns with site theme; cross-browser |
| Testing - a11y | axe-core via Playwright | Catches WCAG issues in CI |
| Testing - visual | Playwright screenshots, optional Percy later | Stable diffs on key pages |
| Lint/Format | ESLint, Prettier, markdownlint | Consistent code and prose |
| Link checks | lychee | Broken-link smoke test |
| CI | GitHub Actions | Runs lint, types, tests, build, linkcheck, and deploys to Amplify on `main` |
| Local services | Docker Compose | Link checker, optional analytics |
| Hosting | AWS Amplify Hosting | SSG hosting, branch previews, integrated CI; no backend needed (static-only site) |
| DNS / TLS | Route 53 + ACM | Apex + www, HTTPS managed by Amplify |
| Analytics | Plausible (self-hosted via Docker locally, hosted in prod) | Privacy-respecting |
| Domain | testingwithagents.com (registrar: Route 53) | Brand requirement; registrar decided up front to avoid Phase 5 delay |

### Stack risk notes

- Tailwind CSS v4 is recent. Before locking the version in Phase 0, verify that `@tailwindcss/typography` (used for blog and case-study prose) ships a v4-compatible release; otherwise pin to the last v3 line and revisit in Phase 4.
- MDX must be wired through `@next/mdx` or `next-mdx-remote` in a way that is compatible with React Server Components in Next.js 16. Decide in Phase 0 and document in `docs/ARCHITECTURE.md`.
- The site is static-only. The `web-scaffold:create-website` skill provisions both an Amplify frontend and an App Runner FastAPI backend - the backend half is intentionally out of scope.

## Repository Layout (target)

```text
testingwithagents/
  app/                       Next.js App Router pages
    (marketing)/             Home, About, Resume, Contact
    projects/                Index + dynamic [slug]
    blog/                    Index + dynamic [slug]
  content/
    projects/*.mdx
    blog/*.mdx
    resume/resume.mdx
  components/
  lib/                       Content loaders, MDX config, SEO helpers
  public/                    Static assets, resume.pdf, OG images
  tests/
    unit/
    e2e/
    a11y/
  docs/
    ARCHITECTURE.md
    CONTENT_GUIDE.md
    MAINTENANCE.md
    TESTING.md
    DEPLOYMENT.md
  docker/                    Compose files for local tooling
  Makefile
  CHANGELOG.md
  FEATURES.md
  TODO.md
  README.md
```

## Make Targets (defined in Phase 0, extended each phase)

Canonical entry points (the six required by the project working agreement):

- `make install` - install Node dependencies and Playwright browsers (alias: `make setup`)
- `make config` - validate local environment, required env vars, and Next.js config
- `make build` - production build (`next build`)
- `make test` - unit + e2e + a11y test suites
- `make deploy` - trigger an AWS Amplify release of the current branch
- `make run-docker` - bring up local Docker services (analytics, lychee); alias: `make compose-up`

Supporting targets:

- `make dev` - run Next.js dev server
- `make lint` - eslint + markdownlint + prettier check
- `make typecheck` - tsc --noEmit
- `make unit` - Vitest unit tests only
- `make e2e` - Playwright suite only
- `make a11y` - axe-core accessibility scans only
- `make start` - serve production build locally
- `make compose-down` - stop local Docker services
- `make linkcheck` - lychee scan on built site
- `make ci` - full local CI equivalent: lint, typecheck, test, build, linkcheck

A starter `Makefile` is committed at the repo root before Phase 0 begins so the targets exist as soon as Phase 0 scaffolds the toolchain. Each target prints a clear error if its prerequisite (e.g. `package.json`, `aws` CLI, `AMPLIFY_APP_ID`) is missing.

---

## Phase 0 - Foundations (1 to 2 days)

Goal: a deployable empty site with the full quality toolchain, so every later phase ships through working CI.

Tasks:

1. Initialize Next.js 16 + TypeScript + Tailwind v4 project.
2. Configure ESLint (next/core-web-vitals + typescript-eslint), Prettier, markdownlint, EditorConfig.
3. Add Vitest + React Testing Library with one example component test.
4. Add Playwright with one homepage smoke test.
5. Add axe-core a11y check against the homepage.
6. Add lychee link checker config.
7. Author the `Makefile` with the targets above.
8. Add `docker-compose.yml` with services for lychee and a local Plausible container for development.
9. Configure GitHub Actions: jobs for lint, typecheck, unit, e2e, a11y, build, linkcheck, and a `deploy` job that triggers an AWS Amplify release on push to `main` (via OIDC-assumed IAM role; `aws amplify start-job`). The deploy step **must** be idempotent against `LimitExceededException` so a concurrent Amplify build (manual console click, hot-fix in flight) does not fail CI. Add a `post-deploy-smoke` job that runs after `deploy` against the live Amplify URL and exercises `tests/e2e/post-deploy-smoke.spec.ts` + `tests/e2e/security-headers.spec.ts`. Block merges on red.
10. Create `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/CONTENT_GUIDE.md`, `docs/DEPLOYMENT.md` (stubs that grow per phase).
11. Initialize `CHANGELOG.md`, `FEATURES.md`, `TODO.md`.
12. Create the AWS Amplify Hosting app, connect it to the GitHub repo, configure the build spec (`amplify.yml`) for Next.js static export, and verify a preview deploy of a feature branch succeeds. Record the `AMPLIFY_APP_ID` in `docs/DEPLOYMENT.md`. The full reconciliation between Amplify defaults and a static-export site lives in `docs/DEPLOYMENT.md` "Common deploy failures"; the canonical Phase 0 list of *app-level* configuration steps (each is a one-line `aws amplify` call) is:
    - **Override the default customRule.** Replace `{ source: "/<*>", target: "/index.html", status: "404-200" }` (default) with `{ source: "/<*>", target: "/404.html", status: "404" }` so `out/404.html` is what users see on unknown paths.
    - **Disable webhook auto-build on `main`.** `aws amplify update-branch --no-enable-auto-build`. Makes the GH Actions `deploy` job the single canonical trigger.
    - **Apply security headers via app config.** Use `aws amplify update-app --custom-headers ...` (the `customHeaders:` block in `amplify.yml` is silently ignored). Six headers required: `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`.
    - **Install Playwright browsers in preBuild.** Amplify's build image does not ship them. `amplify.yml` preBuild runs `npx playwright install chromium chromium-headless-shell`; the cache block keeps the binary across builds.
13. Decide MDX integration approach (`@next/mdx` vs `next-mdx-remote`) and document the choice + RSC compatibility caveats in `docs/ARCHITECTURE.md`.
14. Verify Tailwind v4 plugin compatibility (especially `@tailwindcss/typography`); pin versions accordingly.

Exit criteria:

- `make install`, `make config`, `make build`, `make test`, `make run-docker`, and `make ci` all succeed locally.
- GitHub Actions CI pipeline green on PR; the `deploy` job runs and triggers an Amplify release on push to `main`.
- Amplify preview URL reachable for the feature branch.
- `curl -I https://<branch>.<app>.amplifyapp.com/` returns `HTTP/2 200` and the body byte-length matches `out/index.html`; `curl https://<branch>.<app>.amplifyapp.com/this-route-does-not-exist` returns the body of `out/404.html` (not `out/index.html`).
- The `post-deploy-smoke` job in `.github/workflows/ci.yml` runs `tests/e2e/post-deploy-smoke.spec.ts` against the live Amplify URL after every deploy and **must be green**. It covers: homepage 200 + correct title, unknown route returns the 404 body, six security headers present, OG images serve as `image/png`, `/resume.pdf` serves as `application/pdf`, sitemap lists every route. This is the regression net for every issue catalogued in `docs/DEPLOYMENT.md` "Common deploy failures".

---

## Phase 1 - MVP Skeleton (3 to 5 days)

Goal: every MVP page exists with real layout, navigation, theming, and accessibility, even if content is minimal. Recruiter journey works end to end.

Tasks:

1. Global layout: header with primary nav, footer with social links, skip-to-content link, dark/light toggle that respects `prefers-color-scheme`.
2. Design tokens in Tailwind config: typography scale, spacing, color palette for light and dark modes. Document in `docs/ARCHITECTURE.md` under "Design Tokens".
3. Home page (`/`):
   - Hero with name, role, tagline ("Software testing for the agentic era.").
   - Positioning paragraph from requirements section 22.
   - Primary CTAs: View Portfolio, Read the Blog, Download Resume, Contact Me.
   - Placeholder sections for Featured Projects, Featured Posts, Skills Snapshot.
4. About page (`/about`): Professional Summary, Testing Philosophy, Why AI + QA Matters, What I'm Building Toward, Current Focus Areas.
5. Resume page (`/resume`): MDX-driven content, downloadable PDF link (`/resume.pdf`), target roles list, core skills, technology stack, LinkedIn and GitHub links.
6. Contact page (`/contact`): email link (mailto), LinkedIn, GitHub, optional Calendly placeholder. No form in MVP.
7. Recruiter Summary Block component reused on every major page: Home, About, Resume, Projects index, and Blog index. Per requirements section 10.3, this keeps the job-search context visible without dominating the layout. The block reads target roles from a single content source (`content/recruiter-summary.mdx`) so updates land in one place.
8. SEO primitives: `<title>`, meta description, canonical URL, Open Graph defaults, generated `sitemap.xml`, `robots.txt`.
9. 404 page.
10. Author `docs/MAINTENANCE.md` - the site-maintenance handbook. Captures the recurring "how do I change X on the site?" tasks so a future maintainer (or future-you) does not have to re-derive answers from the codebase. Required sections:
    - Common content edits: hero copy, tagline, positioning paragraph, primary CTAs, target roles, footer links, recruiter-summary text.
    - Theming and visual tokens: where the slate palette and accent color live, how to swap them, how light/dark is toggled, no-FOUC strategy.
    - Component catalog: one-line purpose + props for every component in `components/`, kept in sync as components ship.
    - Adding a nav link or footer link without touching layout code.
    - Updating the resume: where the source MDX lives, how `/resume.pdf` is generated (Phase 4 link), what target-role list to edit.
    - SEO basics: per-route `generateMetadata`, OG image overrides, sitemap regeneration triggers.
    - "If you only change one thing today" quick-reference table at the top, linking to each section.
    Cross-link `docs/CONTENT_GUIDE.md` (for adding projects/posts/resume) and `docs/ARCHITECTURE.md` (for system structure) to avoid duplication. Each Phase 1 component or page added in this phase ships with its catalog entry in `docs/MAINTENANCE.md` written in the same commit.

Testing:

- Unit tests for `<Nav>`, `<RecruiterSummary>`, `<ThemeToggle>`, and content loaders.
- Playwright E2E for the recruiter journey: Home -> Resume -> Download link -> LinkedIn link -> Contact.
- axe-core scans on Home, About, Resume, Contact.

Documentation:

- Update `docs/ARCHITECTURE.md`: routing, layout, theming.
- Create `docs/MAINTENANCE.md` per task 10. Update it in the same commit as any new component or page so the catalog never drifts.
- Update `docs/CONTENT_GUIDE.md`: how the Resume MDX is structured.
- Update `CHANGELOG.md`, `FEATURES.md`, `TODO.md`.

Exit criteria:

- All six MVP pages render with real layout and copy stubs.
- `docs/MAINTENANCE.md` is current with every component and page shipped in Phase 1.
- Recruiter E2E passes.

---

## Phase 2 - Projects and Case Studies (4 to 6 days)

Goal: the proof-of-work surface. Portfolio index, project detail pages, and the case study format.

Tasks:

1. Content model: `content/projects/*.mdx` with frontmatter (`title`, `slug`, `summary`, `categories`, `technologies`, `status`, `repoUrl`, `coverImage`, `order`, `featured`).
2. Content loader in `lib/content/projects.ts` with Zod schema validation at build time. Build fails on invalid frontmatter.
3. `/projects` index: card grid, filter by category and technology (client-side, progressive enhancement so it works without JS).
4. `/projects/[slug]` dynamic route rendering MDX using the case study template from requirements section 9:
   Overview, Problem, Users, Goals, Architecture, Technologies, Testing Strategy, AI Role, Challenges, Results, Next Steps.
5. MDX components: `<Diagram>`, `<TechList>`, `<RepoLink>`, `<RecruiterSummary>` available globally.
6. Author three initial projects in MDX (the MVP set per requirements section 22):
   - Universal Testing Language (flagship, requirements section 7.1)
   - Agentic Testing Workflow Prototype (requirements section 7.2)
   - API Automation Framework (requirements section 7.3)

   The Playwright Automation Project (requirements section 7.4) and Quality Intelligence Dashboard (requirements section 7.5) are intentionally deferred to Phase 6 to keep MVP scope tight. They are tracked in `TODO.md` from Phase 0.
7. Home page wires its "Featured Projects" section to load top three by `featured` flag.
8. Add Open Graph image generator for project pages using Next.js `ImageResponse`.
9. Theme system upgrade. Phase 1 shipped two themes (slate light + slate dark) with the no-FOUC bootstrap resolving from `localStorage.theme` then `prefers-color-scheme`. Phase 2 makes the light slate theme the explicit default and adds a third option:
   - **Default**: existing slate light (white-ish background, slate text, deep-cyan accent). Site uses this for any visitor with no stored preference, regardless of OS `prefers-color-scheme`.
   - **Dark**: existing slate dark, kept as an opt-in only.
   - **New "Warm"**: pure white background, slate text, **amber/orange accent** (start from `amber-700 #b45309` for the accent, `amber-800 #92400e` for hover, `amber-100 #fef3c7` for `--color-surface-muted`). Borders stay slate-200 unless an amber tint reads better in mockups. All text/surface combinations must meet WCAG AA contrast (verified by `make a11y`); the historical tight pairs to check are `--color-text-subtle` on `--color-surface-muted` and accent links inside paragraph copy.
   - Reshape `<ThemeToggle>` from a binary flip to a three-option control (segmented control, dropdown, or labeled cycle). The chosen pattern must be keyboard-accessible and clearly indicate the active theme; preserve `useSyncExternalStore` so the React 19 `react-hooks/set-state-in-effect` rule still passes.
   - Update `app/layout.tsx` `themeBootstrap`: read `localStorage.theme` first; if absent, set `data-theme="light"` (no longer fall back to `prefers-color-scheme`). Document the change in `docs/ARCHITECTURE.md` "Routing & Layout" and `docs/MAINTENANCE.md` "Theming and visual tokens".
   - Update the existing `theme.spec.ts` so the "first paint matches prefers-color-scheme" assertion is replaced by "first paint is `light` regardless of `prefers-color-scheme` when no `localStorage.theme` is set", plus assertions that the toggle can reach all three themes and that each persists across reload.
   - Update `tests/a11y/homepage.spec.ts` and `tests/a11y/pages.spec.ts` to run the axe scan once per theme on at least Home, Resume, and Contact, so every palette stays AA-compliant.
   - Update the catalog entry for `<ThemeToggle>` in `docs/MAINTENANCE.md`, refresh the token table to include the warm theme column, and call out the changed first-paint behavior.

Testing:

- Unit tests for the content loader, including schema-violation cases.
- Snapshot test for the case study layout.
- E2E: open `/projects`, filter by "API Testing", click into the API Automation Framework, verify case study sections render.
- a11y scans on `/projects` and one project detail page, **plus the multi-theme scan added by task 9 above**.
- Visual baseline (Playwright screenshot) on `/projects` and one detail page. Pin browser to Chromium, viewport to 1280x800 desktop and 390x844 mobile, and disable animations in the test profile. Baselines are stored under `tests/e2e/__screenshots__/` and regenerated only with `npx playwright test --update-snapshots` accompanied by a `CHANGELOG.md` entry explaining the visual change. CI runs visuals in a Linux container to match the snapshot platform; local macOS runs use `--ignore-snapshots` unless the developer regenerates intentionally.

Documentation:

- Update `docs/CONTENT_GUIDE.md` with the project frontmatter spec and case study section names.
- Update `FEATURES.md` and `CHANGELOG.md`.

Exit criteria:

- Three projects live with full case studies.
- Filtering works with and without JavaScript.
- Three themes ship (slate light default, slate dark, warm amber). First paint is always `light` for users with no stored preference. `make a11y` passes the WCAG AA scan once per theme on Home, Resume, and Contact.
- All tests green; visual baselines committed.

---

## Phase 3 - Blog and Thought Leadership (3 to 5 days)

Goal: ongoing publishing surface that demonstrates the user's point of view.

Tasks:

1. Content model: `content/blog/*.mdx` with frontmatter (`title`, `slug`, `excerpt`, `publishedAt`, `updatedAt`, `categories`, `tags`, `coverImage`, `readingTime`).
2. Reading time computed at build via `reading-time`.
3. `/blog` index: chronological list, category and tag chips, RSS link.
4. `/blog/[slug]` rendering MDX with author byline, share image, related posts (by overlapping tags), prev/next navigation.
5. RSS feed (`/rss.xml`) and JSON feed (`/feed.json`) generated at build.
6. Open Graph images for posts via `ImageResponse`.
7. Author four initial posts from requirements section 22:
   - Software Testing for the Agentic Era
   - Why AI Agents Still Need Human Testers
   - Agentic Engineering Antipatterns
   - What QA Should Provide as Evidence of Readiness
8. Home page "Featured Posts" wired to the three most recent.

Testing:

- Unit tests for the post loader, RSS generator, related-posts logic.
- E2E: from Home featured post tile, navigate to post, verify metadata, related posts, RSS link.
- a11y scans on `/blog` and one post.
- Markdown lint on all MDX content.
- Linkcheck must pass.

Documentation:

- `docs/CONTENT_GUIDE.md` extended: how to author a post, frontmatter rules, image conventions, internal-linking style.
- Update `FEATURES.md` and `CHANGELOG.md`.

Exit criteria:

- Blog index and four posts live.
- RSS feed validates against W3C feed validator.
- All tests green.

---

## Phase 4 - SEO, Performance, Accessibility Hardening (2 to 3 days)

Goal: meet the non-functional requirements in sections 11.3, 13, and 17.

Scope note: Phase 1 already shipped the SEO *baseline* (titles, meta descriptions, canonical URLs, OG defaults, sitemap, robots.txt). Phase 4 is the *polish and audit* pass: per-page completeness, structured data, image and font optimization, and security headers. Lighthouse / performance budgets are explicitly out of scope; verify performance manually via PageSpeed Insights or browser DevTools when needed.

Tasks:

1. Per-page `generateMetadata` audit: unique title, description, canonical URL, OG image, Twitter card. Fill any gaps left from Phase 1.
2. Per-route Open Graph image generation. The Next.js `opengraph-image.tsx` route convention emits an extensionless artifact (`out/<route>/opengraph-image`), which Amplify Hosting's static-site backend 301-redirects to add a trailing slash, breaking the meta-tag URL. Fix by generating PNGs at build time with explicit `.png` extension into `public/<route>/og.png` (using `@vercel/og` or `satori` as a build-time dependency, **not** as a Next route handler), and setting `metadata.openGraph.images` to those paths. Phase 2 attempted this with `app/projects/[slug]/opengraph-image.tsx` and rolled it back; this is the corrected approach. Cover projects and (Phase 3) blog posts.
3. Structured data (JSON-LD): `Person` on Home and About, `BlogPosting` on posts, `CreativeWork` on projects, `BreadcrumbList` on all detail pages.
4. Sitemap regenerated with all routes and lastmod dates from content frontmatter.
5. Image audit: every `<Image>` has alt text, width, height; convert to AVIF/WebP at build.
6. Font strategy: `next/font` with subset and `display: swap`.
7. Accessibility pass: focus rings, skip links, ARIA landmarks, color contrast in both themes verified.
8. Security headers via `next.config.ts` and Amplify response-header rules: `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. CSP uses a per-request nonce strategy (App Router middleware sets the nonce; inline scripts are nonced via `next/script`). Document the policy and its allow-list in `docs/ARCHITECTURE.md` under "Security Headers".
9. Generate `/resume.pdf` at build time from the same MDX source used by `/resume`, mitigating the drift risk called out in the Risks table. The build step renders the resume route to PDF via Playwright headless print and writes the output to `public/resume.pdf`. `make build` regenerates it; CI fails if the checked-in copy is stale.

Testing:

- Expand axe scans to every route.
- Add Playwright keyboard-navigation test: tab through Home, ensure all primary CTAs reachable and have visible focus.
- Add a CSP regression test that asserts the nonce-bearing `Content-Security-Policy` header is present on the production build and that no inline script lacks a nonce.
- Add a "resume PDF freshness" test: regenerate the PDF and assert the checked-in `public/resume.pdf` byte-matches the regenerated artifact.

Documentation:

- `docs/ARCHITECTURE.md`: SEO, structured data, security header policy.
- `docs/TESTING.md`: a11y thresholds, how to update them.
- Update `CHANGELOG.md`.

Exit criteria:

- axe scans clean across all routes.
- Security headers visible in production response.

---

## Phase 5 - Launch (1 to 2 days)

Goal: production cutover to testingwithagents.com on AWS Amplify Hosting.

Prerequisite (done in Phase 0): registrar is Route 53; the Amplify app exists and previews work. Phase 5 promotes the `main` branch to production and wires the custom domain.

Tasks:

1. Promote the `main` branch in Amplify to the production environment; disable auto-build on feature branches if they should not consume build minutes.
2. Custom domain in Amplify: attach `testingwithagents.com` and `www.testingwithagents.com`, request the ACM certificate (DNS-validated via Route 53), and configure the `www` to apex redirect using Amplify's redirect rules.
3. Route 53 hosted zone: confirm A/AAAA (alias) records point at the Amplify domain target; confirm CAA records permit Amazon issuance.
4. Production environment variables in Amplify: analytics domain, RSS metadata, contact email, `NEXT_PUBLIC_SITE_URL=https://testingwithagents.com`.
5. Plausible (or chosen analytics) configured for production. Local Docker Compose Plausible kept for dev parity.
6. Privacy notice page (`/privacy`) describing analytics scope.
7. Final content sweep: typos, broken links, accurate target-role list, latest resume PDF (regenerated by the Phase 4 build step).
8. Soft-launch checklist run by the user against the recruiter, hiring manager, and peer journeys from requirements section 5.
9. Announcement: LinkedIn post, GitHub README link, optional Hacker News "Show HN" if appropriate.

Testing:

- Full `make ci` against production build.
- Production smoke E2E hitting the live `https://testingwithagents.com` after DNS propagation, including a TLS-version check and an HSTS header assertion.
- `curl -I https://www.testingwithagents.com` verifies the 301 redirect to the apex.
- Manual run of the three core user journeys.

Documentation:

- `docs/DEPLOYMENT.md`: domain, DNS, environment variables, rollback procedure.
- Update `CHANGELOG.md` with the launch entry.
- Reset `TODO.md` for post-launch work.

Exit criteria:

- testingwithagents.com serves the production site over HTTPS.
- Analytics receiving events.
- All journeys verified live.

---

## Phase 6 - Post-Launch Enhancements (ongoing)

Pull items from requirements section 19 as time allows. Each item follows the same incremental discipline: design note in `docs/`, content or code change, tests, changelog update.

Prioritized backlog:

1. Now / Current Focus page.
2. Testing Philosophy page.
3. Tools & Stack page.
4. Speaking / Writing page.
5. Recruiter-specific landing page with a single, scoped CTA.
6. Testing With Agents Lab: experiments index with shorter, lab-note style posts.
7. Newsletter signup (only if a low-maintenance provider is chosen).
8. Searchable knowledge base across blog and projects.
9. Embedded interactive demos for the Universal Testing Language project.
10. Downloadable portfolio PDF assembled at build time.

---

## Testing Strategy Summary

| Layer | Tool | Coverage Target |
|---|---|---|
| Static analysis | TypeScript strict, ESLint, markdownlint | Zero errors in CI |
| Unit | Vitest + RTL | Content loaders, schema validation, utilities, key components |
| Component | RTL | Theme toggle, nav, recruiter summary, MDX components |
| Integration / E2E | Playwright | Recruiter journey, hiring-manager journey, peer journey |
| Accessibility | axe-core via Playwright | All routes pass with zero serious or critical violations |
| Visual | Playwright screenshots | Home, Projects index, one project, one post |
| Link integrity | lychee | Zero broken links on built site |
| Security headers | Custom Playwright test | CSP and HSTS present in production build |
| Content validation | Zod schemas at build | Build fails on invalid frontmatter |

Tests run on every PR via GitHub Actions and via `make ci` locally. No phase is "done" until its tests are written and green.

## Documentation Strategy Summary

Living documents updated at the end of every task:

- `CHANGELOG.md` - chronological log of shipped changes.
- `FEATURES.md` - current capabilities of the site.
- `TODO.md` - work not yet started or in progress.

Reference documents updated when their domain changes:

- `docs/ARCHITECTURE.md` - structure, routing, theming, SEO, headers.
- `docs/CONTENT_GUIDE.md` - how to add a project, post, or resume update.
- `docs/MAINTENANCE.md` - site-maintenance handbook: common edits, theming, component catalog, nav/footer changes, "if you only change one thing today" quick reference.
- `docs/TESTING.md` - how to run and extend the test suites.
- `docs/DEPLOYMENT.md` - environments, DNS, secrets, rollback.

Per requirements section 16, the site itself should embody the working culture the user wants to demonstrate. The same applies to this repo: the docs and tests are part of the portfolio.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Scope creep into "Lab" features before MVP is shipped | Phase gates; Lab work is Phase 6 only |
| Visual design overinvestment | Phase 1 ships with restrained, token-driven design; iterate after launch |
| Content drift between resume PDF and Resume page | Phase 4 generates `public/resume.pdf` from the Resume MDX at build time; CI fails if the checked-in PDF is stale |
| Accessibility regressions when adding components | axe-core in CI on every route |
| Broken outbound links over time | lychee in CI plus scheduled monthly run |
| Hosting lock-in to AWS Amplify | Keep Next.js output framework-portable (no Amplify-only APIs in application code); document deploy paths and rollback in `docs/DEPLOYMENT.md`; alternate target (Netlify or self-hosted Node) documented as a fallback |
| Tailwind v4 plugin ecosystem gaps | Verify `@tailwindcss/typography` and any other plugins in Phase 0; pin to v3 line if v4 compatibility is missing |
| Strict CSP breaking Next.js inline scripts | Use middleware-issued nonce; CSP regression test asserts policy and nonce on every script tag |

## Definition of Done (per phase)

A phase is complete when:

1. All listed tasks ship behind a green CI run.
2. New tests for the phase exist and pass.
3. Relevant docs are updated.
4. `CHANGELOG.md`, `FEATURES.md`, and `TODO.md` reflect the new state.
5. A preview deploy of the phase is reviewed against the corresponding user journey from requirements section 5.
