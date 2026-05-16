# Site Maintenance Handbook

How to change things on testingwithagents.com without re-deriving the architecture from the source. Pair this with [`ARCHITECTURE.md`](ARCHITECTURE.md) (system structure) and [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) (how to add projects, posts, resume MDX).

## If you only change one thing today

| You want to change... | File to edit | Section below |
| --- | --- | --- |
| Site name, role, tagline, email, social links | `lib/site-config.ts` | [Common content edits](#common-content-edits) |
| Primary nav links | `lib/site-config.ts` (`primaryNav`) | [Common content edits](#common-content-edits) |
| Home hero copy or CTAs | `app/page.tsx` | [Common content edits](#common-content-edits) |
| About page sections | `app/about/page.tsx` | [Common content edits](#common-content-edits) |
| Resume page body | `content/resume/resume.mdx` | [Common content edits](#common-content-edits) and [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) |
| Recruiter summary text (Home, About, Resume, Projects) | `content/recruiter-summary.mdx` | [Common content edits](#common-content-edits) |
| Contact channels (email, LinkedIn, GitHub) | `lib/site-config.ts` + `app/contact/page.tsx` for notes | [Common content edits](#common-content-edits) |
| 404 page copy | `app/not-found.tsx` | [Common content edits](#common-content-edits) |
| Add or edit a project case study | `content/projects/<slug>.mdx` | [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) "Authoring a Project" |
| Mark a project as featured on Home | `content/projects/<slug>.mdx` frontmatter (`featured: true`) | [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) "Authoring a Project" |
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

| Token | Light (default) | Dark | Warm | Used for |
| --- | --- | --- | --- | --- |
| `--color-bg` | slate-50 | slate-900 | white | Page background |
| `--color-surface` | white | slate-800 | white | Cards, buttons, raised panels |
| `--color-surface-muted` | slate-100 | near-black | amber-100 | Footer, subtle backgrounds |
| `--color-border` | slate-200 | slate-700 | slate-200 | Borders, dividers |
| `--color-text` | slate-900 | slate-200 | slate-900 | Headings, primary body |
| `--color-text-muted` | slate-700 | slate-300 | slate-700 | Secondary body (passes WCAG AA on every surface) |
| `--color-text-subtle` | slate-600 | slate-400 | slate-600 | Tertiary text, footer copy (passes WCAG AA on every surface) |
| `--color-accent` | cyan-700 | cyan-400 | amber-700 | Links, primary CTA, brand eyebrow |
| `--color-accent-hover` | cyan-800 | cyan-300 | amber-800 | Accent hover state |
| `--color-accent-fg` | white | slate-900 | white | Text on accent backgrounds |
| `--color-focus-ring` | cyan-600 | cyan-300 | amber-600 | `:focus-visible` outline |

When you swap a color, check WCAG AA contrast on **all three themes** on all surfaces. The accessibility scan (`make a11y`) runs axe once per theme on Home, Resume, Contact and About; the historical tight pairs are `--color-text-subtle` on `--color-surface-muted` and accent links inside paragraph copy. It is faster to verify with a contrast checker first.

### How theme switching works

- `<html>` carries a `data-theme="light"`, `data-theme="dark"`, or `data-theme="warm"` attribute.
- The no-FOUC bootstrap script in `app/layout.tsx` sets the attribute before paint, reading `localStorage.theme`. **If no entry exists, the theme is always `light`** regardless of OS `prefers-color-scheme` - the slate-light palette is the canonical first impression.
- `<ThemeToggle>` is a three-option `role="radiogroup"` with a radio per theme. Clicking a radio flips the attribute on `<html>` and writes the new value to `localStorage`.
- Tests that need to scan a specific theme via Playwright should use `page.addInitScript` to write `localStorage.theme` **before** the page loads; setting `data-theme` after load triggers a CSS transition and axe will sample mid-blend.

To make a route default to one theme regardless of stored preference, set `data-theme` on the route's wrapper element. Don't disable the toggle - users override the default.

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

Client component. A three-option segmented control (`role="radiogroup"`) with one `role="radio"` per theme (Light, Dark, Warm). Uses `useSyncExternalStore` to mirror the `data-theme` attribute on `<html>` so React 19's `react-hooks/set-state-in-effect` rule still passes. Click a radio to set the theme; the new value is written to `localStorage` and the active radio reports `aria-checked="true"`. No props.

If a future feature needs to read the current theme outside the toggle, prefer adding a `useTheme()` hook that calls the same `useSyncExternalStore`; do not duplicate the snapshot logic.

### `app/page.tsx` - Home

Five sections: hero (eyebrow + heading + positioning paragraph + four primary CTAs), then bordered section blocks for Featured projects, Latest writing, and Skills snapshot. Featured projects / posts are placeholders today; they wire to real content in Phase 2 / 3. The four CTAs live in a typed `primaryCtas` array at the top of the file.

### `app/not-found.tsx` - 404

Static page rendered by Next.js when no route matches. Plain layout (the global `<Nav>` and `<Footer>` still wrap it via `app/layout.tsx`).

### `components/RecruiterSummary.tsx`

Server component. Wraps `content/recruiter-summary.mdx` in an `<aside aria-label="Recruiter summary">` with compact prose styling. Used on Home, About, and Resume; will also mount on Projects and Blog indexes in later phases. Edit the MDX file, not the component, to change the visible text.

### `app/about/page.tsx` - About

Six sections in order: introduction H1, RecruiterSummary block, Professional summary, Testing philosophy, Why AI plus QA matters, What I'm building toward, Current focus areas. All section copy is local to this file. Edit any heading or paragraph in place.

### `app/resume/page.tsx` - Resume

Renders `content/resume/resume.mdx` inside a `prose prose-slate` article. Above the MDX it shows the H1, three call-to-action buttons (Contact me, LinkedIn, GitHub) sourced from `lib/site-config.ts`, and the RecruiterSummary block. To update resume content, edit the MDX; to change the CTAs or social URLs, edit `lib/site-config.ts`. The downloadable PDF link will land in Phase 4.

### `app/contact/page.tsx` - Contact

Three contact-channel cards (Email, LinkedIn, GitHub) defined in a local `channels` array. Each card has a label, the contact handle, and a one-line note about expected response. URLs come from `lib/site-config.ts`. The footer mentions a Phase 6 scheduling link; no form today.

### `lib/content/projects.ts` - project content loader

Zod-validated loader for `content/projects/*.mdx`. Exports `projectFrontmatterSchema`, `getAllProjects`, `getFeaturedProjects`, `getProjectBySlug`, `getProjectSlugs`, plus `CATEGORIES` and `STATUSES` enums consumed by the index page. An invalid frontmatter fails `make build` with a per-file error. To add a project, see `docs/CONTENT_GUIDE.md` "Authoring a Project".

### `app/projects/page.tsx` and `components/ProjectsBrowser.tsx` - projects index

Server component (`page.tsx`) loads all projects and the technology list, then passes them to the client component (`ProjectsBrowser`). The browser renders two filter rows (Category, Technology) plus a card grid. Filter state lives in the URL (`?category=...&tech=...`) so a filtered view is shareable; without JavaScript, the full grid still renders.

### `app/projects/[slug]/page.tsx` - case-study detail route

Dynamic route. `generateStaticParams` enumerates every project slug at build time. The MDX body is loaded via a slug-based dynamic import. Frontmatter drives the H1, summary, status badge, categories list, technology list, and the optional repository link. Body MDX is rendered inside `prose prose-slate` with per-element token overrides so all three themes pass WCAG AA.

### `components/mdx/Diagram.tsx`, `TechList.tsx`, `RepoLink.tsx` - MDX building blocks

Available globally in MDX via `mdx-components.tsx`. `Diagram` renders a captioned figure (dashed-bordered placeholder when no `src`); `TechList` renders a row of pill tags; `RepoLink` renders a bordered call-to-action link to a repository. Each follows the design tokens so it works in all three themes without per-component theme logic.

## Adding a nav link or footer link

1. **Nav:** add an entry to `primaryNav` in `lib/site-config.ts`. Create `app/<your-route>/page.tsx`. No changes to `Nav.tsx` needed.
2. **Footer:** the social block is hard-coded to three slots (LinkedIn, GitHub, email). To add a fourth, edit `components/Footer.tsx` and add the new URL to `site.social` in `lib/site-config.ts`. Keep the labels short - the footer wraps responsively but does not scroll horizontally.

## Updating the resume

Coming in Commit B. The plan: `content/resume/resume.mdx` is the single source. `/resume` renders it; `/resume.pdf` is generated from it at build time (Phase 4). The downloadable PDF link on Home (`Download Resume` CTA) already points at `/resume.pdf`.

## SEO basics

What ships today:

- **Global defaults** (`app/layout.tsx`): site title template, description, canonical (for `/`), Open Graph (`website`, `siteName`, `title`, `description`, `url`, `locale`), and Twitter (`summary_large_image`). To change the global tagline or description, edit there. To change the canonical host, edit `site.url` in `lib/site-config.ts` (and `metadataBase` automatically follows).
- **Per-route overrides**: each `app/<route>/page.tsx` exports a `Metadata` object with its own `title`, `description`, and `alternates.canonical`. To add a new page to the SEO surface, do the same in its `page.tsx` and add the route to `app/sitemap.ts`.
- **Sitemap** (`app/sitemap.ts`): emits `/sitemap.xml` at build time. Routes are enumerated explicitly. Add an entry when a new page lands. `export const dynamic = "force-static"` is required because `next.config.ts` sets `output: "export"`.
- **Robots** (`app/robots.ts`): emits `/robots.txt`. Allows all user agents, blocks `/api/` and `/_next/`, advertises the sitemap. Same `force-static` requirement.

Open Graph images are still global; per-route OG images via `ImageResponse` land in Phase 2 (projects) and Phase 3 (blog), where they have meaningful content to render.

A Playwright spec under `tests/e2e/recruiter-journey.spec.ts` asserts the canonical / OG / Twitter tags are present on the homepage and that `/sitemap.xml` and `/robots.txt` serve correctly. Run `make e2e` to verify after any SEO change.

## When something looks broken

- **Theme not applying or flashing wrong on load:** check the `themeBootstrap` script in `app/layout.tsx`; it must run before the first paint of `<body>`.
- **Nav active state wrong:** `isActive()` in `Nav.tsx` uses prefix matching (`/projects/foo` highlights `Projects`). Adjust there if you add a route that needs different behavior.
- **A11y scan failing on color contrast:** the most likely culprit is a token change in `globals.css`. Run `make a11y` after any palette edit. Light-mode text-on-`surface-muted` is the historical tightest pair.
- **Static export missing a page:** confirm the route is statically renderable (no runtime `fetch` of dynamic data, no `cookies()` / `headers()` in the route tree).
- **Live site serves the homepage on unknown URLs** (e.g. `/foo` returns the home hero with HTTP 404): the Amplify `customRules` are misconfigured. The default `target: /index.html` rule must be replaced with `target: /404.html`. See [`DEPLOYMENT.md`](DEPLOYMENT.md) section "customRules: 404 handling" for the exact `aws amplify update-app` invocation. The `tests/e2e/not-found.spec.ts` spec catches the regression on every PR against the local server, but cannot see the live Amplify config.
- **OG image URL 404s in production but works locally**: the Next.js `opengraph-image.tsx` route convention emits an extensionless artifact (`out/<route>/opengraph-image`). Amplify Hosting's static backend 301-redirects extensionless paths to add a trailing slash, which then 404s. Phase 4 task 2 replaces the route handler with a build-time PNG script that writes `public/<route>/og.png` with an explicit extension. Until then, the global OG image defaults from `app/layout.tsx` apply to every share.
