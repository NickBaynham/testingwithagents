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

## Phase 1 (MVP Skeleton)

### Commit A - global layout, design tokens, Home, 404

- Design-token system in `app/globals.css`: slate palette + deep-cyan accent, light / dark themes driven by a `data-theme` attribute, no-FOUC bootstrap script set before paint, `prefers-color-scheme` fallback when JS is disabled. All text/surface combinations meet WCAG AA contrast.
- Global layout shell: sticky `<Nav>` (active-route detection), `<SkipLink>`, `<Footer>` with social links, `<ThemeToggle>` using `useSyncExternalStore`. Site-wide content lives in `lib/site-config.ts`.
- Home page (`/`) with real hero, positioning paragraph, four primary CTAs (Portfolio, Blog, Resume PDF, Contact), and bordered section blocks for Featured projects / Latest writing / Skills snapshot.
- Custom 404 page (`app/not-found.tsx`).
- `docs/MAINTENANCE.md` - site-maintenance handbook with quick-reference table, theming guide, and component catalog; updated alongside every Phase 1 component.

### Commit B - About, Resume, Contact, MDX, RecruiterSummary

- MDX wired via `@next/mdx` + `mdx-components.tsx` + `pageExtensions`. Tailwind v4 typography plugin loaded via `@plugin` in `app/globals.css` (closes the Phase 0 deferral).
- `content/recruiter-summary.mdx` and `content/resume/resume.mdx` are now the single sources for the recruiter-summary block and resume body.
- `<RecruiterSummary>` component mounts on Home, About, and Resume; reads from a single MDX file so a single edit updates every page.
- `/about` page with Professional summary, Testing philosophy, Why AI + QA matters, What I'm building toward, and Current focus areas sections.
- `/resume` page renders the MDX resume with Contact / LinkedIn / GitHub CTAs and the recruiter-summary block.
- `/contact` page with email, LinkedIn, and GitHub channel cards (no form, scheduling link planned for Phase 6).
- Home page CTAs updated: "View Resume" points to `/resume/` while the PDF generation is still in Phase 4.
- Test coverage: navigate-from-nav e2e specs for the three new pages, axe scans on each, RecruiterSummary unit test, and a vitest MDX stub alias so unit tests work without running the @next/mdx webpack loader.

### Commit C - SEO baseline + recruiter-journey

- Global title template, description, canonical, Open Graph (`type: website`, site name, title, description, url, locale), and Twitter card (`summary_large_image`) wired in `app/layout.tsx`. Per-route overrides on Home, About, Resume, Contact.
- Static `/sitemap.xml` and `/robots.txt` emitted at build time from `app/sitemap.ts` and `app/robots.ts`.
- Recruiter-journey Playwright spec covers Home -> Resume -> Contact -> LinkedIn, plus sitemap.xml / robots.txt / canonical-and-OG meta-tag verification.

Phase 1 MVP skeleton (Commits A + B + C) complete. Recruiter, hiring-manager, and peer journeys land on real pages with consistent identity, navigation, theming, accessibility, and discoverability.

## Phase 4 (SEO + OG + security + resume PDF)

- **JSON-LD structured data** on every detail route: Person on Home + About, BreadcrumbList on detail pages, BlogPosting on posts, CreativeWork on projects.
- **Per-route Open Graph images** generated at build time as 1200x630 PNGs under `public/og/` (default + one per project + one per post). Each page references its image with an explicit `.png` URL.
- **Security headers** applied to every response by Amplify Hosting: HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options, Cross-Origin-Opener-Policy. (CSP deferred - see `docs/MAINTENANCE.md` troubleshooting note.)
- **Resume PDF** generated at build time from the canonical `content/resume/resume.mdx` via Playwright headless print. Home CTA and `/resume` page link to `/resume.pdf`.

## Phase 2 (in progress)

### Theme system upgrade

- Three themes shipping: **Light** (default, slate + deep-cyan), **Dark** (opt-in, slate + cyan-400), **Warm** (opt-in, white background + slate text + amber-700 accent). All three pass WCAG AA contrast on every shipped route.
- First paint is always **Light** regardless of OS `prefers-color-scheme`. Users opt in to dark or warm via the toggle; the choice persists in `localStorage`.
- `<ThemeToggle>` is a three-option segmented control (`role="radiogroup"`) with one keyboard-accessible radio per theme.

### Projects index, case studies, OG images

- `content/projects/*.mdx` is the source of truth for case studies. Frontmatter is validated by Zod at build time; build fails with a per-file error on schema violations.
- `/projects` index lists every project with Category and Technology filter chips. Filter state persists in the URL so filtered views are shareable; the page degrades gracefully without JavaScript.
- `/projects/[slug]` case-study detail pages follow an 11-section template (Overview, Problem, Users, Goals, Architecture, Technologies, Testing Strategy, AI Role, Challenges, Results, Next Steps).
- Three flagship projects live: Universal Testing Language, Agentic Testing Workflow Prototype, API Automation Framework.
- Per-project Open Graph images generated at build time via `next/og` `ImageResponse` (1200x630 PNG per project slug).
- Home "Featured projects" automatically surfaces the top three projects marked `featured: true`, sorted by `order`.
- Sitemap includes every project detail route.

### Phase 2 remaining

See `plan/plan.md` and `TODO.md`. Pending: visual baselines (Playwright screenshots) for `/projects` and one detail page; small case-study layout snapshot test.

## Phase 3 (Blog and thought leadership)

- `content/blog/*.mdx` is the source of truth for posts. Zod-validated frontmatter; reading time computed at build time.
- `/blog` index with Category and Tag filter chips, RSS / JSON feed links, and the recruiter summary block.
- `/blog/[slug]` post detail with author byline, publish date, reading time, related-posts section (tag-overlap ranking), and prev/next navigation.
- Build-time `/rss.xml` (RSS 2.0) and `/feed.json` (JSON Feed 1.1).
- Footer carries an RSS link; Home "Latest writing" surfaces the three most recent posts.
- Eight posts live: Software testing for the agentic era, Why AI agents still need human testers, Agentic engineering antipatterns, What QA should provide as evidence of readiness, Agentic Test Data Manager (project writeup), Exploratory testing with Claude Code and the Playwright MCP, From exploration to automation: an agentic testing workflow, Inside a single agentic testing session.
- Sitemap includes every blog post route.
