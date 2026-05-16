# Changelog

All notable shipped changes. Newest entries at the top.

## Unreleased

### Phase 4 - SEO, OG images, security baseline, resume PDF

- **Per-route Open Graph images (corrected fix).** `scripts/generate-og-images.tsx` is a build-time PNG generator (satori + @resvg/resvg-js + Inter 400/600 from `@fontsource/inter`) that emits `public/og/default.png` plus one PNG per project and per blog post with explicit `.png` extensions. Wired as `prebuild`. Each page's `metadata.openGraph.images` and `metadata.twitter.images` references the matching file. This replaces the Phase 2 rolled-back `opengraph-image.tsx` route handler, which hit an Amplify trailing-slash 301 on extensionless paths. Verified live URLs return `200 image/png` (test in `tests/e2e/og-images.spec.ts`, 14 assertions).
- **Build-time resume PDF.** `scripts/generate-resume-pdf.tsx` runs as `postbuild`. Spins up `serve out` on port 4747, drives Playwright headless Chromium to `/resume/` with the light theme forced, prints to Letter-format PDF with 0.6" margins, and writes `out/resume.pdf`. PDF is a build artifact - regenerated on every deploy, never committed. Home "Download Resume" CTA and the Resume page's new "Download PDF" button both link at `/resume.pdf`. `/resume.pdf` removed from `lychee.toml` excludes. Test in `tests/e2e/resume-pdf.spec.ts` asserts the magic header, content-type, and size envelope.
- **Security headers via `amplify.yml` customHeaders.** Static export has no Next runtime for headers, so the policy moves to Amplify Hosting. Applied to `**/*`: HSTS (`max-age=31536000; includeSubDomains; preload`), Referrer-Policy (`strict-origin-when-cross-origin`), Permissions-Policy (`camera=(), microphone=(), geolocation=(), interest-cohort=()`), X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), Cross-Origin-Opener-Policy (`same-origin`). CSP is intentionally deferred - nonce CSP needs a runtime; hash CSP needs automated regen on every `themeBootstrap` edit. Deviation documented in `plan/plan.md`, `docs/ARCHITECTURE.md`, and `docs/MAINTENANCE.md`.
- **CTA reshape.** Home `View Resume` -> `Download Resume` (now that `/resume.pdf` actually exists). Resume page gains a `Download PDF` button. Resume MDX no longer carries the Phase 4 placeholder note. Recruiter-journey e2e updated to navigate via the Resume nav link instead of the now-downloading CTA, and asserts the new Download PDF link.

### Phase 4 - deploy-time fixes

- Amplify build job 13 failed because the build image does not ship Playwright browsers; `chromium.launch()` from the resume-PDF postbuild threw `Executable doesn't exist at /root/.cache/ms-playwright/...`. Added `npx playwright install chromium` to `amplify.yml` preBuild and included `/root/.cache/ms-playwright/**/*` in the cache block so subsequent builds reuse the binary. First build after the fix downloads ~150 MB; later builds short-circuit.
- Live verification of the next deploy showed the security headers from `amplify.yml` `customHeaders:` were absent from responses. Amplify silently ignores that block - the headers must live on the Amplify app config, applied via `aws amplify update-app --custom-headers ...`. Set the canonical six-header payload via CLI; verified live with curl. `amplify.yml` now keeps the policy as a *commented-out* reference, with the CLI invocation captured in `docs/DEPLOYMENT.md` "Security headers (Amplify custom-headers)".
- Added `tests/e2e/security-headers.spec.ts` that asserts all six headers against a deployed Amplify URL (gated on `SECURITY_HEADERS_URL` env var so it does not run against the local `serve` instance, which does not set them).
- `docs/MAINTENANCE.md` troubleshooting section gains entries for both deploy-time gotchas so the next person can recognize them in seconds.

### Phase 4 - JSON-LD structured data (shipped earlier in the phase as commit `7dca5a9`)

- `lib/seo/structured-data.ts` builders (Person, BreadcrumbList, BlogPosting, CreativeWork), `<JsonLd>` renderer, wired on Home, About, every project, every post.

### Phase 3 - Blog and thought leadership

- New `lib/content/blog.ts`: Zod-validated content loader for `content/blog/*.mdx`. Strict schema (`title`, `slug` kebab-case, `excerpt`, `publishedAt` YYYY-MM-DD, optional `updatedAt`, `categories` from a fixed enum, `tags`, optional `coverImage`). Build fails with a per-file error on schema violations. Reading time computed at load via the `reading-time` package and surfaced as `readingTimeMinutes`. Pure helpers `findPrevNext` and `findRelatedPosts` (by tag overlap) plus their async wrappers.
- New `/blog` index (`app/blog/page.tsx` + `components/BlogIndexBrowser.tsx`): chronological list, Category and Tag filter rows, RSS / JSON feed links. Same URL-state filter pattern as `/projects` so filtered views are shareable; without JavaScript the full list still renders.
- New `/blog/[slug]` post detail route. `generateStaticParams` enumerates every slug. Page renders title, author byline, publish date, reading-time, the MDX body inside `prose prose-slate` with per-element token overrides for all three themes, a "Related posts" section ranked by tag overlap, and a prev/next nav by `publishedAt`.
- New build-time feeds: `app/rss.xml/route.ts` emits RSS 2.0; `app/feed.json/route.ts` emits JSON Feed 1.1. Both run at build time (`dynamic = "force-static"`), pull from `getAllPosts()`, and include every post automatically. Footer now carries an RSS link.
- Four initial blog posts authored under `content/blog/`: **Software testing for the agentic era**, **Why AI agents still need human testers**, **Agentic engineering antipatterns**, **What QA should provide as evidence of readiness**.
- Home "Latest writing" section now loads the three most recent posts from the loader instead of the placeholder copy.
- `app/sitemap.ts` extended to enumerate every blog post route alongside the static and project routes.
- Tests: `tests/unit/blog-loader.test.tsx` (14 cases - valid frontmatter, invalid date format, unknown category, empty tags, strict-mode rejection, slug mismatch, helpful error message, plus `findPrevNext` neighbors and `findRelatedPosts` ranking). `tests/e2e/blog.spec.ts` (index lists four posts newest first, category filter, click-through to post with related and prev/next visible, Home Latest writing renders three, rss.xml + feed.json validation, sitemap includes blog routes, footer RSS link). `tests/a11y/blog.spec.ts` (axe on `/blog` and one post x light/dark/warm x desktop/mobile = 12).
- `lychee.toml`: removed `/blog` from placeholder excludes (route exists now).
- A11y test refinement: `tests/a11y/blog.spec.ts` waits for `networkidle` and for the h1 to be visible before sampling - long-form post pages take a beat to paint and axe was occasionally sampling mid-render.

### Phase 2 - Projects, case studies, OG images

- New `lib/content/projects.ts`: Zod-validated content loader for `content/projects/*.mdx`. Strict schema (`title`, `slug` kebab-case matching filename, `summary`, `categories` from a fixed enum, `technologies`, `status`, optional `repoUrl` / `coverImage`, `order`, `featured`). Build fails with a per-file error on invalid frontmatter. Helper functions `getAllProjects`, `getFeaturedProjects`, `getProjectBySlug`, `getProjectSlugs`.
- New `/projects` index (`app/projects/page.tsx` + `components/ProjectsBrowser.tsx`): server component loads project data, client component renders Category + Technology filter rows. Filter state lives in the URL (`?category=...&tech=...`) so filtered views are shareable; without JavaScript the full grid still renders.
- New `/projects/[slug]` case-study detail route. Uses `generateStaticParams` to pre-render all three projects at build. Frontmatter drives the H1, summary, status badge, categories/technologies metadata, and optional repo link. MDX body renders inside `prose prose-slate` with per-element token overrides so all three themes pass WCAG AA.
- New MDX building blocks under `components/mdx/`: `<Diagram>` (placeholder or image), `<TechList items={...} />`, `<RepoLink href={...} />`. Registered globally via `mdx-components.tsx` alongside `<RecruiterSummary>`.
- Three flagship projects authored under `content/projects/`: **Universal Testing Language**, **Agentic Testing Workflow Prototype**, **API Automation Framework**. Each follows the full case-study template (Overview / Problem / Users / Goals / Architecture / Technologies / Testing Strategy / AI Role / Challenges / Results / Next Steps).
- Home "Featured projects" section now loads the top three featured projects from the content loader instead of the placeholder paragraph.
- Attempted per-project Open Graph images via `app/projects/[slug]/opengraph-image.tsx`. **Rolled back**: the Next.js convention emits an extensionless artifact (`out/projects/<slug>/opengraph-image`), and Amplify Hosting's static-site backend 301-redirects extensionless paths to add a trailing slash, which then 404s. The correct approach is to generate PNGs with an explicit `.png` extension into `public/` at build time using `@vercel/og` or `satori` as a build dependency rather than as a Next route handler. Moved to Phase 4 task 2 with the explicit fix documented.
- `app/sitemap.ts` now emits the `/projects` index plus every project detail route alongside the static routes.
- New tests: `tests/e2e/projects.spec.ts` (index renders three cards, category and technology filters narrow the list, clicking a card opens the case study, Home featured links match `/projects/[slug]/` shape, sitemap includes project routes) and `tests/a11y/projects.spec.ts` (axe on `/projects` and one detail page x light/dark/warm themes x desktop/mobile = 12 assertions). Unit tests for the Zod schema and `parseProjectSource` cover valid frontmatter, unknown categories, empty technologies, invalid slugs, strict-mode rejection, and slug/filename mismatch.
- `lychee.toml`: removed `/projects` from the placeholder excludes now that the route exists.
- `docs/CONTENT_GUIDE.md`: filled in the "Authoring a Project" section with the full frontmatter spec, case-study section list, and the MDX building blocks. `docs/MAINTENANCE.md`: added catalog entries for the new loader, page, browser, detail route, OG image generator, and MDX components; refreshed the quick-reference table with project edit recipes.

### Phase 2 - Theme system upgrade

- Added a third theme, **warm** - pure white background, slate text, amber-700 accent (`#b45309`, ~6.2:1 on white). Selector `[data-theme="warm"]` in `app/globals.css`. Borders stay slate-200 so cards do not compete with the amber accent; `--color-surface-muted` is amber-100 (`#fef3c7`).
- **Default first paint is now `light`** regardless of OS `prefers-color-scheme`. The no-FOUC bootstrap script in `app/layout.tsx` reads `localStorage.theme` and falls back to `"light"`; users explicitly opt in to dark or warm via `<ThemeToggle>` and the choice persists.
- `<ThemeToggle>` reshaped from a binary cycle to a three-option segmented control (`role="radiogroup"` with one `role="radio"` per theme). Active theme reports `aria-checked="true"`. Still uses `useSyncExternalStore` so React 19's `react-hooks/set-state-in-effect` rule passes.
- `components/RecruiterSummary.tsx` no longer uses Tailwind's `prose` plugin - it set its own `--tw-prose-body` palette that did not follow `data-theme`, breaking AA contrast in dark mode. Replaced with direct token-driven styling via attribute selectors on the MDX children. AA verified for all three themes.
- `tests/a11y/homepage.spec.ts` and `tests/a11y/pages.spec.ts` now run axe once per theme (light / dark / warm) using `page.addInitScript` to set `localStorage.theme` **before** page load - setting `data-theme` after navigation triggers a CSS transition and axe samples mid-blend. Total a11y assertions: 4 routes x 3 themes x 2 viewports = 24, all green.
- `tests/e2e/theme.spec.ts` rewritten: first-paint assertion is now "light when no `localStorage.theme` is set" (was "matches `prefers-color-scheme`"). Added assertions that each of the three themes can be selected, persists across reload, and that `aria-checked` updates accordingly. `tests/unit/theme-toggle.test.tsx` covers the new radiogroup contract.
- `docs/ARCHITECTURE.md` Routing & Layout and Design Tokens sections updated. `docs/MAINTENANCE.md` palette table now has a Warm column, the `<ThemeToggle>` catalog entry reflects the segmented-control contract, and the troubleshooting note about Tailwind `prose` ignoring `data-theme` is captured.

### Phase 1 - MVP Skeleton (Commit C)

- SEO baseline shipped end-to-end. `app/layout.tsx` `metadata` now sets the title template, description, default canonical, Open Graph (`type: website`, site name, title, description, url, locale), and Twitter card (`summary_large_image`). Each `app/<route>/page.tsx` exports its own `title`, `description`, and `alternates.canonical`. With `trailingSlash: true` the emitted canonical href ends with `/`.
- New `app/sitemap.ts` and `app/robots.ts` emit static `/sitemap.xml` and `/robots.txt`. Both declare `export const dynamic = "force-static"` (required when `output: "export"` is set). Routes are enumerated explicitly so a new page only joins the sitemap intentionally.
- New `tests/e2e/recruiter-journey.spec.ts`: full Home -> Resume -> Contact -> LinkedIn flow, plus checks for sitemap.xml, robots.txt, and the canonical / OG / Twitter meta tags on the homepage.
- `docs/ARCHITECTURE.md` SEO section rewritten to reflect what shipped; `docs/MAINTENANCE.md` SEO section now lists what to edit for global vs per-route metadata and how to add a new route to the sitemap.
- `lychee.toml`: added `^https?://(?:www\.)?testingwithagents\.com` to the placeholder excludes (canonical / sitemap URLs reference the eventual production host which does not yet resolve). Removal trigger: Phase 5 custom-domain cutover.

### Phase 1 - MVP Skeleton (Commit B)

- Wired MDX: added `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` and the `pageExtensions` array to `next.config.ts`. Created `mdx-components.tsx` at the repo root (required for App Router MDX). Tailwind v4 typography plugin (`@tailwindcss/typography`) loaded via `@plugin` in `app/globals.css`; closes the Phase 0 deferral.
- New MDX content sources: `content/recruiter-summary.mdx` (target roles + one-paragraph hook, single source for every page that mounts the recruiter-summary block) and `content/resume/resume.mdx` (professional summary, target roles, core skills, technology stack, selected-experience template, contact links).
- New `components/RecruiterSummary.tsx`: wraps the MDX summary in an `<aside aria-label="Recruiter summary">` with compact prose styling. Mounted on Home, About, and Resume per `plan/plan.md`; Projects and Blog indexes will mount it in Phases 2 and 3.
- New pages: `app/about/page.tsx` (six sections matching `business_requirements.md` section 6.2), `app/resume/page.tsx` (renders the resume MDX inside `prose prose-slate dark:prose-invert`, with CTA buttons for Contact / LinkedIn / GitHub), `app/contact/page.tsx` (three contact-channel cards, no form, Phase 6 placeholder note for scheduling).
- Home page CTAs updated: "Download Resume" -> "View Resume" pointing at `/resume/` while the PDF generation is still in Phase 4. Home now mounts `<RecruiterSummary>` between the hero CTAs and the featured-projects section.
- Contact-page inline link to `/resume` now has an explicit underline so it meets axe-core's "links must be distinguishable without relying on color" rule. Caught and fixed pre-commit.
- Tests: `tests/unit/recruiter-summary.test.tsx` (with an MDX import mock pattern), `tests/e2e/pages.spec.ts` (navigate Home -> About / Resume / Contact via the nav, assert H1, assert recruiter-summary presence on About/Resume and absence on Contact), `tests/a11y/pages.spec.ts` (axe scans on each new route). All chromium-desktop and chromium-mobile.
- Vitest now stubs `*.mdx` imports via a path alias so unit tests can render components that transitively import MDX without running the `@next/mdx` webpack loader. Dedicated tests can still substitute their own MDX body via `vi.mock(...)`.
- `lychee.toml`: removed the `/about`, `/resume`, `/contact` placeholder excludes now that those routes exist. The `/projects`, `/blog`, and `/resume.pdf` excludes remain with phase-removal triggers documented inline.

### Phase 1 - Post-deploy verification

- Caught and fixed an Amplify Hosting default-rule bug: every new app ships with a customRule of `source: "/<*>", target: "/index.html", status: "404-200"`, which serves the homepage body for every non-existent route. Replaced with `target: "/404.html", status: "404"` via `aws amplify update-app --custom-rules` so the real 404 page is what users see. Required step is now documented in `docs/DEPLOYMENT.md` ("customRules: 404 handling"), called out as a Phase 0 task in `plan/plan.md`, and listed as a troubleshooting entry in `docs/MAINTENANCE.md`.
- New Playwright specs that lock in the behavior the customRule misconfiguration broke: `tests/e2e/not-found.spec.ts` (unknown route renders the 404 page, direct `/404/` URL works, Home link returns to the homepage), `tests/e2e/nav.spec.ts` (every primary nav link present, four Home CTAs point at the correct hrefs, skip-to-content link works, footer social links visible), `tests/e2e/theme.spec.ts` (toggle flips `data-theme` and persists across reload; first paint honors `prefers-color-scheme`).
- Mobile Nav layout fix: at 390x844 the previous flex row overflowed and the `<ThemeToggle>` click was intercepted by the brand link. Nav now has a horizontally scrollable primary list, a shrink-protected toggle, and tighter mobile padding.
- Linkcheck pipeline made actually runnable end-to-end. Lychee config now disables on-disk cache (the Docker mount is read-only by design), drops the unsupported `base` key, excludes LinkedIn (returns HTTP 999 to bots), and excludes the placeholder routes for `/about`, `/blog`, `/contact`, `/projects`, `/resume`, and `/resume.pdf` with explicit "remove this exclude when Phase X ships" comments. `docker/docker-compose.yml` now passes `--root-dir /workspace/out` so root-relative links inside the static export resolve correctly. Run summary: `make linkcheck` -> 57 OK, 0 errors, 37 excluded.

### Phase 1 - MVP Skeleton (Commit A)

- Design tokens in `app/globals.css`: slate neutral palette + deep-cyan accent, exposed via CSS custom properties and re-declared in `@theme inline` so Tailwind v4 utilities can reference them. Light / dark resolved by a `data-theme` attribute on `<html>` with a `prefers-color-scheme` fallback for first paint without JS.
- New layout components under `components/`: `SkipLink`, `Nav` (sticky, marks active route via `usePathname`), `Footer`, `ThemeToggle` (uses `useSyncExternalStore` to mirror the `data-theme` attribute so it satisfies React 19's `react-hooks/set-state-in-effect` rule). Shared site-wide content (name, role, tagline, email, social links, primary nav) consolidated in `lib/site-config.ts`.
- `app/layout.tsx` rewritten: `metadataBase` + title template + description; no-FOUC inline `themeBootstrap` loaded via `next/script` with `strategy="beforeInteractive"`; SkipLink + Nav + `<main id="main">` + Footer wrap every route.
- `app/page.tsx` rewritten as the real Home: eyebrow tagline, "Hi, I'm Nick Baynham." H1, positioning paragraph verbatim from `requirements/business_requirements.md` section 22, four primary CTAs (View Portfolio, Read the Blog, Download Resume, Contact Me), bordered section blocks for Featured projects, Latest writing, and Skills snapshot.
- Added `app/not-found.tsx` 404 page with Home and Projects CTAs.
- Tightened light-mode text tokens to slate-600 / slate-700 to keep all text/surface combinations above WCAG AA. Caught and fixed by `make a11y`.
- Unit tests for `<Nav>` (renders every primary link, marks the active route) and `<ThemeToggle>` (toggles `data-theme`, persists to `localStorage`, flips back on second click). `tests/unit/setup.ts` now polyfills `matchMedia` in jsdom and clears `data-theme` / `localStorage` between tests.
- Authored `docs/MAINTENANCE.md` - site-maintenance handbook with a quick-reference table, theming guide, component catalog, and "when something looks broken" troubleshooting. Linked from `README.md` and `plan/plan.md`. Per `plan/plan.md` Phase 1 task 10, the catalog is updated in the same commit as any new component or page.
- Filled in `docs/ARCHITECTURE.md` Routing & Layout and Design Tokens sections.

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
