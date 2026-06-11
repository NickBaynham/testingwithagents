<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# testingwithagents.com

A professional portfolio and thought-leadership site for Nick Baynham, positioning him as a software testing and quality engineering professional focused on AI-augmented testing, agentic automation, and developer productivity.

The site functions as a career-positioning platform: part portfolio, part thought-leadership hub, part proof-of-work library, part recruiting funnel. Brand tagline: "Software testing for the agentic era."

## Audiences

- Recruiters - fast access to resume, target roles, contact, LinkedIn, GitHub.
- Hiring managers - technical depth, testing philosophy, project case studies.
- Engineering and QA leaders - evidence of strategy, architecture, and pragmatic AI adoption.
- Peers in software testing - useful articles, examples, and experiments.

## Source of truth

This file captures project identity and working norms. Implementation details live in the documents below; do not duplicate them here.

- [Business Requirements](requirements/business_requirements.md) - scope, user journeys, functional and non-functional requirements, MVP definition, success metrics.
- [Build Plan](plan/plan.md) - phased delivery plan, technology stack and version targets, repository layout, Make targets, testing and documentation strategy, risks, per-phase exit criteria.
- [Agent Runbook: Publishing a Blog Post](docs/AGENT_BLOG_PUBLISHING.md) - operational runbook for adding a new post. Read this before authoring any `content/blog/*.mdx`. Covers the frontmatter schema, body conventions for the long-form project-log style, the five hardcoded test-count assertions in `tests/e2e/blog.spec.ts` that must be updated, the OG-image regeneration flow, the CHANGELOG convention, the local `make ci` gate, and the commit/push pattern.

@requirements/business_requirements.md
@plan/plan.md

## Working Agreement

- Work incrementally. Every change ends with a green `make ci`.
- Identify root cause before fixing. Reproduce, isolate with a failing test, then fix.
- Use latest stable APIs and libraries. Pin versions.
- Static-first. Generate at build time wherever possible.
- Content as data. Add a project or post by writing MDX, not by editing components.
- No emojis in code, content, logs, or UI. Standard technical writing only.
- Keep modules, components, and functions short. Apply DRY.
- Default to no comments. Add a comment only when the "why" is non-obvious.
- Update `CHANGELOG.md`, `FEATURES.md`, and `TODO.md` at the end of every task.
- When an issue is resolved, update the relevant doc (this file, `plan/plan.md`, or `docs/*`) with preventive guidance so the problem cannot recur silently.

## E2E test conventions (Playwright)

- **Match closed-set headings/labels with `exact: true`.** `getByRole("heading", { name })`
  matches the accessible name as a *substring* by default. A test that asserts a fixed list
  of card titles (adoption stages, autonomy levels, audiences, roadmap phases) will hit a
  strict-mode violation the moment page copy introduces another heading that *contains* one
  of those titles — e.g. the adoption stage "Strategic automation" colliding with the
  roadmap card "Playwright framework + strategic automation". Pass `exact: true` (or scope
  the locator to its section) so each assertion matches only its own element. This is the
  most common reason an unrelated copy edit turns these specs red.
- Prefer scoping (`section.getByRole(...)`) or `exact: true` over `.first()` when the intent
  is "this specific element," so a future duplicate fails loudly instead of silently passing.
- **Assert internal link hrefs in their post-hydration canonical form — with the trailing
  slash** (`/reference-implementations/python-playwright/`, not `...playwright`). The site
  builds with `trailingSlash: true`; the prerendered DOM briefly carries the href as
  authored, and Next.js normalizes it during hydration. An unslashed assertion can pass
  locally (fast, pre-hydration) and fail in CI (slower, hydrated). Match the slashed form
  the existing nav/CTA specs use.
- **Run new e2e specs with `CI=true` locally before pushing** — CI mode (single worker,
  retries) changes timing enough to surface hydration races a parallel local run hides.
- **Hover-dependent tests must skip under mobile emulation**
  (`test.skip(isMobile, ...)`): the chromium-mobile project emulates touch, where `hover()`
  is unreliable even after resizing the viewport to desktop width.
- **Every `overflow-x-auto` (or otherwise scrollable) container needs `tabIndex={0}`,
  `role="region"`, an `aria-label`, and a visible focus outline** — axe's
  `scrollable-region-focusable` rule (serious, WCAG 2.1.1) fails otherwise. This has now
  bitten twice (the test-commander `Terminal`, then the reference-implementations
  `DataTable`). Treat it as a checklist item whenever adding a scroll container, and do not
  trust a local a11y pass to clear it: whether content actually overflows at the mobile
  viewport depends on font rendering, which differs between macOS and the Linux CI runners —
  the DataTable case passed locally and failed only in CI.

## Definition of Done (per task)

A task is done when:

1. Code, content, and tests are written and committed.
2. `make ci` is green locally and in GitHub Actions.
3. Affected documentation is updated.
4. `CHANGELOG.md`, `FEATURES.md`, and `TODO.md` reflect the new state.
5. The change has been previewed against the relevant user journey from the business requirements.

Per-phase exit criteria live in [plan/plan.md](plan/plan.md).
