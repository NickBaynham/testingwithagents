# Content Guide

How to add and update site content. Grows phase by phase.

## Sources

- `content/projects/*.mdx` - project case studies (Phase 2).
- `content/blog/*.mdx` - blog posts (Phase 3).
- `content/resume/resume.mdx` - resume (Phase 1).
- `content/recruiter-summary.mdx` - shared recruiter summary block (Phase 1).

## Frontmatter

| Content type | Schema location | Loader |
| --- | --- | --- |
| Project | `lib/content/projects.ts` (`projectFrontmatterSchema`) | `getAllProjects()`, `getProjectBySlug()`, `getFeaturedProjects()` |
| Blog post (Phase 3) | not yet defined | not yet defined |

Each content type is validated at build time with Zod. An invalid file fails `make build`; the loader names the file and the violating field so the fix is obvious.

## Editing the Recruiter Summary

`content/recruiter-summary.mdx` is the single source for the recruiter-summary block rendered on Home, About, Resume, and (Phases 2/3) the Projects and Blog indexes.

- No frontmatter today; the file is plain MDX (markdown + JSX).
- Keep it short - two short paragraphs is the visual budget. The block sits inside an `<aside>` and is intentionally compact.
- The first paragraph lists target roles in bold so they read as the lede.
- Edit, then `make build` and `make e2e` to verify every page that mounts the block still renders correctly.

The block is rendered by `components/RecruiterSummary.tsx`, which wraps the MDX body in an `<aside aria-label="Recruiter summary">` with prose styling for inline links and `<strong>`.

## Editing the Resume

`content/resume/resume.mdx` is the source for the `/resume` page and (Phase 4) the build-time PDF generation at `/resume.pdf`.

Structure:

1. `## Professional summary` - one short paragraph.
2. `## Target roles` - bulleted list of role titles. Keep aligned with the `recruiter-summary` roles.
3. `## Core skills` - bulleted list, outcome-flavored not technology-flavored.
4. `## Technology stack` - grouped by category. Use **bold** for category labels.
5. `## Selected experience` - one section per role with `### Role - Company (YYYY - YYYY)` and 3-5 outcome bullets.
6. `## Education and certifications` - optional, keep brief.
7. `## Find me online` - LinkedIn, GitHub, email.

Render rules:

- The page wraps the MDX in `prose prose-slate dark:prose-invert`; standard markdown styling applies.
- Inline links automatically get the accent color and an underline via the `prose-a` styles in `app/resume/page.tsx`.
- After editing, `make build` confirms MDX still parses; `make a11y` confirms contrast on any new color or section.

## Authoring a Project

1. Create `content/projects/<slug>.mdx`. The filename slug must match the `slug` field in the frontmatter (the loader enforces this).
2. Frontmatter (validated against `projectFrontmatterSchema` in `lib/content/projects.ts`):

   ```yaml
   ---
   title: "Universal Testing Language"        # required, plain string
   slug: "universal-testing-language"         # required, kebab-case, matches filename
   summary: "One-line elevator pitch."       # required, plain string
   categories:                                # required, at least one
     - "Automation Frameworks"               # must come from the CATEGORIES enum
     - "AI-Assisted Testing"
   technologies:                              # required, at least one free-form string
     - "TypeScript"
     - "Playwright"
   status: "Concept"                          # required: Concept | Prototype | Active | Archived
   repoUrl: "https://github.com/..."         # optional, must be a valid URL if present
   coverImage: "/projects/utl/cover.png"     # optional, served from public/ if present
   order: 1                                   # required, non-negative integer; lower = earlier on /projects
   featured: true                             # optional, defaults to false; surfaces on Home
   ---
   ```

3. Body sections (case-study template). Use these `##` headings in this order so every project tells the same story:

   - `## Overview`
   - `## Problem`
   - `## Users`
   - `## Goals`
   - `## Architecture` (include a `<Diagram caption="..." />` block)
   - `## Technologies` (use `<TechList items={[...]} />`)
   - `## Testing Strategy`
   - `## AI Role` - where AI helps and where humans stay in control
   - `## Challenges`
   - `## Results`
   - `## Next Steps`

4. Optional MDX components (auto-imported via `mdx-components.tsx`):

   - `<Diagram caption="...">` - dashed-bordered placeholder or `<Diagram src="..." caption="...">` for a real image.
   - `<TechList items={["A", "B"]} />` - row of pill-style tags.
   - `<RepoLink href="https://github.com/..." label="View repo" />` - styled repo CTA.
   - `<RecruiterSummary />` - mounts the shared block; do not use inside the case-study body, the page already renders it where appropriate.

5. Run `make build` to confirm the schema validates and the route generates. Run `make e2e` to confirm filters and detail navigation still work. Run `make a11y` if a new color or image lands.

The Home "Featured projects" section automatically renders the top three projects by `featured: true`, sorted by `order`.

## Authoring a Blog Post

1. Create `content/blog/<slug>.mdx`. The filename slug must match the `slug` field in the frontmatter (the loader enforces this).
2. Frontmatter (validated against `postFrontmatterSchema` in `lib/content/blog.ts`):

   ```yaml
   ---
   title: "Software testing for the agentic era"
   slug: "software-testing-for-the-agentic-era"     # kebab-case, matches filename
   excerpt: "What stays the same and what changes." # one-line summary
   publishedAt: "2026-05-12"                         # YYYY-MM-DD, required
   updatedAt: "2026-05-14"                           # YYYY-MM-DD, optional
   categories:
     - "Agentic Testing"                             # from POST_CATEGORIES enum
   tags:
     - "agents"                                      # free-form, at least one
     - "strategy"
   coverImage: "/blog/agentic-era/cover.png"        # optional, served from public/
   ---
   ```

3. Body is plain MDX (markdown + JSX). Reading time is computed from word count by the `reading-time` package at build time and shown as "N min read" on the index and detail pages.
4. The `/blog` index orders posts newest first by `publishedAt`. Related posts on the detail page are ranked by tag overlap with the current post; prev/next nav uses chronological order.
5. The RSS feed (`/rss.xml`) and JSON feed (`/feed.json`) regenerate at build time and include every post automatically. The Home "Latest writing" section surfaces the three most recent posts.
6. Run `make build` to confirm the schema validates and the route generates. Run `make e2e` for the full blog flow; `make a11y` for the contrast check on every theme.
