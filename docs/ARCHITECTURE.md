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

To be filled in during Phase 1 (global layout, navigation, theming).

## Design Tokens

To be filled in during Phase 1 (Tailwind config, light/dark palette, typography scale).

## SEO

Baseline (titles, meta description, canonical, OG defaults, sitemap, robots) lands in Phase 1. Structured data (`Person`, `BlogPosting`, `CreativeWork`, `BreadcrumbList`) lands in Phase 4.
