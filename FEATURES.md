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
