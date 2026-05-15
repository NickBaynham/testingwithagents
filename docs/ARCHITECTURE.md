# Architecture

This document captures the runtime and build-time architecture of testingwithagents.com. It grows phase by phase per `plan/plan.md`.

## Stack

- Next.js 16 (App Router, static export) on Node 24.
- TypeScript with `strict` enabled.
- Tailwind CSS v4.
- MDX for project case studies, blog posts, and resume content.
- Vitest + React Testing Library for unit and component tests.
- Playwright + axe-core for end-to-end, accessibility, and visual tests.

## MDX Integration (decision)

- Choice: `@next/mdx` for pages-as-MDX and content-loader pattern for blog/project MDX read from `content/`.
- Reason: First-class App Router and React Server Component compatibility. Avoids the runtime cost of `next-mdx-remote` for content we own and control at build time.
- Wired in: Phase 2 (project content) and Phase 3 (blog content).

## Tailwind v4 Plugin Pins

- `tailwindcss@^4` and `@tailwindcss/postcss@^4` set by the scaffold.
- `@tailwindcss/typography` will be added in Phase 1 / Phase 3 when prose styling is needed. Verify the installed version targets v4 (`pnpm view @tailwindcss/typography versions` or `npm view`). Pin in `package.json`.

## Security Headers

Set in Phase 4. CSP uses a per-request nonce issued by Next.js middleware; inline scripts pass through `next/script` with the nonce. HSTS, `Referrer-Policy`, and `Permissions-Policy` configured via `next.config.ts` and Amplify response-header rules.

## Routing & Layout

App Router under `app/`. The root layout (`app/layout.tsx`) wraps every route with:

1. A no-FOUC inline `themeBootstrap` script (loaded via `next/script` with `strategy="beforeInteractive"`) that reads `localStorage.theme` and sets `data-theme` on `<html>` before paint. **Default is `light`** when no entry is stored; `prefers-color-scheme` is intentionally not consulted so the slate-light palette is the canonical first impression.
2. `<SkipLink>` as the first focusable element in `<body>`, targeting `#main`.
3. `<Nav>` (sticky, client component for active-route detection via `usePathname`).
4. `<main id="main">` containing the route subtree.
5. `<Footer>` (server component).

Routes implemented in Phase 1 Commit A: `/` and `not-found`. Sibling pages (`/about`, `/resume`, `/contact`) land in Commit B; SEO primitives (`sitemap.ts`, `robots.ts`, per-route `generateMetadata`) in Commit C.

Site-wide content (name, role, tagline, email, social links, primary nav) lives in `lib/site-config.ts` so a single edit propagates everywhere.

## Design Tokens

Palette: three themes share an eleven-token vocabulary defined as CSS custom properties in `app/globals.css`, then re-declared inside an `@theme inline` block so Tailwind v4 utilities can reference them.

- **Light** (default): slate neutrals + deep-cyan accent. Selectors: `:root, [data-theme="light"]`.
- **Dark**: slate neutrals + cyan-400 accent. Selector: `[data-theme="dark"]`.
- **Warm**: white background + slate text + amber-700 accent. Selector: `[data-theme="warm"]`.

First-paint resolution: the no-FOUC bootstrap script sets `data-theme` from `localStorage.theme`, falling back to `"light"` if absent. The CSS no longer relies on a `prefers-color-scheme` fallback - users explicitly opt in to dark or warm via `<ThemeToggle>` and the choice persists.

Tokens fall into four families - background surfaces (`--color-bg`, `--color-surface`, `--color-surface-muted`), borders (`--color-border`), text (`--color-text`, `--color-text-muted`, `--color-text-subtle`), accent (`--color-accent`, `--color-accent-hover`, `--color-accent-fg`, `--color-focus-ring`). The full table with hex values and per-theme contrast notes is in `docs/MAINTENANCE.md` under "Theming and visual tokens".

Type scale: Tailwind v4 defaults, surfaced through `@theme` so they can be overridden centrally. Font stack uses `next/font/google` to load Geist Sans + Geist Mono with `display: "swap"`.

A change to any token must keep WCAG AA contrast in **all three themes**. `make a11y` enforces this; the historical tightest pairs are light-mode text-subtle on `--color-surface-muted`, and any element that uses Tailwind's typography plugin (`prose`) - the plugin sets its own `--tw-prose-*` palette that ignores `data-theme`, so components that need theme-aware prose styling must override the relevant `--tw-prose-*` variables or style directly without `prose` (see `components/RecruiterSummary.tsx` for the pattern).

## SEO

Phase 1 baseline shipped:

- `app/layout.tsx` `metadata` sets the title template (`%s — Nick Baynham`), description, default canonical (`/`), Open Graph (`website` type, site name, title, description, url, locale), and Twitter card (`summary_large_image`).
- Each `app/<route>/page.tsx` exports its own `Metadata` with `title`, `description`, and `alternates.canonical`. With `trailingSlash: true`, canonicals end with `/`.
- `app/sitemap.ts` and `app/robots.ts` emit static `/sitemap.xml` and `/robots.txt`. Both files declare `export const dynamic = "force-static"` because `next.config.ts` sets `output: "export"`.
- Sitemap routes are enumerated explicitly so a new page only ships once it is intentional; add a path when a route lands.
- Per-route Open Graph images via `ImageResponse` are deferred to Phase 2 (projects) and Phase 3 (blog); the global OG defaults apply to every page until then.

Structured data (JSON-LD: `Person`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`) lands in Phase 4 along with the security-header polish.
