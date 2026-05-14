# Site Maintenance Handbook

How to change things on testingwithagents.com without re-deriving the architecture from the source. Pair this with [`ARCHITECTURE.md`](ARCHITECTURE.md) (system structure) and [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) (how to add projects, posts, resume MDX).

## If you only change one thing today

| You want to change... | File to edit | Section below |
| --- | --- | --- |
| Site name, role, tagline, email, social links | `lib/site-config.ts` | [Common content edits](#common-content-edits) |
| Primary nav links | `lib/site-config.ts` (`primaryNav`) | [Common content edits](#common-content-edits) |
| Home hero copy or CTAs | `app/page.tsx` | [Common content edits](#common-content-edits) |
| 404 page copy | `app/not-found.tsx` | [Common content edits](#common-content-edits) |
| Accent color or any palette token | `app/globals.css` (`:root[data-theme="..."]`) | [Theming and visual tokens](#theming-and-visual-tokens) |
| Default theme behavior (light/dark fallback) | `app/layout.tsx` (`themeBootstrap`) | [Theming and visual tokens](#theming-and-visual-tokens) |
| What `<Nav>` / `<Footer>` / `<ThemeToggle>` actually do | `components/` | [Component catalog](#component-catalog) |
| Add a new page to the nav | `lib/site-config.ts` + new route folder | [Adding a nav link or footer link](#adding-a-nav-link-or-footer-link) |

## Common content edits

Most user-facing copy lives in two places:

1. **`lib/site-config.ts`** - the single source of truth for things repeated across the site: site name, role, tagline, email, LinkedIn, GitHub, and the primary nav array. Components import from here; never copy these values into a component.
2. **The page that owns the copy** - the hero paragraph and CTA labels are in `app/page.tsx`; the 404 message is in `app/not-found.tsx`; About / Resume / Contact will follow in Commit B with similar shapes.

Rules of thumb:

- Strings that appear on more than one page belong in `lib/site-config.ts`.
- Marketing copy specific to one page lives in that page's `app/<route>/page.tsx`.
- Long-form prose (resume bullets, project case studies, blog posts) will live in MDX under `content/` once Commit B lands. See [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) for that pattern.

## Theming and visual tokens

Tokens live in `app/globals.css`. Two layers:

1. **CSS custom properties under `:root, [data-theme="light"]` and `[data-theme="dark"]`** - the palette. Edit hex values here to change the look.
2. **The `@theme inline` block** - exposes the same variables to Tailwind v4 so utility classes can reference them.

Token vocabulary:

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-bg` | slate-50 | slate-900 | Page background |
| `--color-surface` | white | slate-800 | Cards, buttons, raised panels |
| `--color-surface-muted` | slate-100 | near-black | Footer, subtle backgrounds |
| `--color-border` | slate-200 | slate-700 | Borders, dividers |
| `--color-text` | slate-900 | slate-200 | Headings, primary body |
| `--color-text-muted` | slate-700 | slate-300 | Secondary body (passes WCAG AA on every surface) |
| `--color-text-subtle` | slate-600 | slate-400 | Tertiary text, footer copy (passes WCAG AA on every surface) |
| `--color-accent` | cyan-700 | cyan-400 | Links, primary CTA, brand eyebrow |
| `--color-accent-hover` | cyan-800 | cyan-300 | Accent hover state |
| `--color-accent-fg` | white | slate-900 | Text on accent backgrounds |
| `--color-focus-ring` | cyan-600 | cyan-300 | `:focus-visible` outline |

When you swap a color, check WCAG AA contrast on all surfaces. The accessibility scan (`make a11y`) will catch regressions but it's faster to verify with a contrast checker first.

### How light / dark switching works

- `<html>` carries a `data-theme="light"` or `data-theme="dark"` attribute.
- The no-FOUC bootstrap script in `app/layout.tsx` sets the attribute before paint, reading (in order): `localStorage.theme`, then `prefers-color-scheme`.
- `<ThemeToggle>` flips the attribute on click and writes the new value to `localStorage`.
- CSS uses `:root:not([data-theme])` plus a `prefers-color-scheme: dark` media query as a last-resort fallback for first paint when JavaScript is disabled.

To make a route default to one theme regardless of preference, set `data-theme` on the route's wrapper element. Don't disable the toggle - users override the default.

## Component catalog

One entry per component. Keep this in sync whenever a component is added, renamed, or removed.

### `components/SkipLink.tsx`

Visually hidden link, jumps to `#main` when focused. First child of `<body>`. No props. Required for keyboard-only users.

### `components/Nav.tsx`

Sticky header with brand and primary nav. Client component because it reads `usePathname()` to mark the active route with `aria-current="page"`. Reads its link list from `primaryNav` in `lib/site-config.ts`; renders the site name from `site.name`. Embeds `<ThemeToggle>` on the right.

To add a nav link, edit `primaryNav`; do not edit `Nav.tsx` for routing changes.

### `components/Footer.tsx`

Server component. Renders copyright (year is computed at build time), the tagline, and LinkedIn / GitHub / email links sourced from `site.social` and `site.contactEmail`. To change social URLs or email, edit `lib/site-config.ts`.

### `components/ThemeToggle.tsx`

Client component. Uses `useSyncExternalStore` to mirror the `data-theme` attribute on `<html>`. Click flips the value and persists to `localStorage`. The button label and `aria-label` track current state. No props.

If a future feature needs to read the current theme outside the toggle, prefer adding a `useTheme()` hook that calls the same `useSyncExternalStore`; do not duplicate the snapshot logic.

### `app/page.tsx` - Home

Five sections: hero (eyebrow + heading + positioning paragraph + four primary CTAs), then bordered section blocks for Featured projects, Latest writing, and Skills snapshot. Featured projects / posts are placeholders today; they wire to real content in Phase 2 / 3. The four CTAs live in a typed `primaryCtas` array at the top of the file.

### `app/not-found.tsx` - 404

Static page rendered by Next.js when no route matches. Plain layout (the global `<Nav>` and `<Footer>` still wrap it via `app/layout.tsx`).

## Adding a nav link or footer link

1. **Nav:** add an entry to `primaryNav` in `lib/site-config.ts`. Create `app/<your-route>/page.tsx`. No changes to `Nav.tsx` needed.
2. **Footer:** the social block is hard-coded to three slots (LinkedIn, GitHub, email). To add a fourth, edit `components/Footer.tsx` and add the new URL to `site.social` in `lib/site-config.ts`. Keep the labels short - the footer wraps responsively but does not scroll horizontally.

## Updating the resume

Coming in Commit B. The plan: `content/resume/resume.mdx` is the single source. `/resume` renders it; `/resume.pdf` is generated from it at build time (Phase 4). The downloadable PDF link on Home (`Download Resume` CTA) already points at `/resume.pdf`.

## SEO basics

Coming in Commit C. The plan: per-route `generateMetadata` for titles, descriptions, canonicals, and OG images; `app/sitemap.ts` and `app/robots.ts` for crawler hints; OG image generation via `ImageResponse` at build time.

For now, only the global defaults in `app/layout.tsx` `metadata` apply. Edit those if you need to override the site-wide title template or description.

## When something looks broken

- **Theme not applying or flashing wrong on load:** check the `themeBootstrap` script in `app/layout.tsx`; it must run before the first paint of `<body>`.
- **Nav active state wrong:** `isActive()` in `Nav.tsx` uses prefix matching (`/projects/foo` highlights `Projects`). Adjust there if you add a route that needs different behavior.
- **A11y scan failing on color contrast:** the most likely culprit is a token change in `globals.css`. Run `make a11y` after any palette edit. Light-mode text-on-`surface-muted` is the historical tightest pair.
- **Static export missing a page:** confirm the route is statically renderable (no runtime `fetch` of dynamic data, no `cookies()` / `headers()` in the route tree).
