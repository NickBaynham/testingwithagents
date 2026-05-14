# Content Guide

How to add and update site content. Grows phase by phase.

## Sources

- `content/projects/*.mdx` - project case studies (Phase 2).
- `content/blog/*.mdx` - blog posts (Phase 3).
- `content/resume/resume.mdx` - resume (Phase 1).
- `content/recruiter-summary.mdx` - shared recruiter summary block (Phase 1).

## Frontmatter (target)

To be filled in as Phase 2/3 define the schemas for projects and blog posts. Each content type will be validated at build time with Zod; build fails on schema violations.

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

## Authoring a Project (Phase 2)

To be filled in.

## Authoring a Blog Post (Phase 3)

To be filled in.
