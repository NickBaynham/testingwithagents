# testingwithagents.com

A professional portfolio and thought-leadership site for Nick Baynham, positioning him as a software testing and quality engineering professional focused on AI-augmented testing, agentic automation, and developer productivity.

The site functions as a career-positioning platform: part portfolio, part thought-leadership hub, part proof-of-work library, part recruiting funnel. Brand tagline: "Software testing for the agentic era."

## Audiences

- Recruiters - fast access to resume, target roles, contact, LinkedIn, GitHub.
- Hiring managers - technical depth, testing philosophy, project case studies.
- Engineering and QA leaders - evidence of strategy, architecture, and pragmatic AI adoption.
- Peers in software testing - useful articles, examples, and experiments.

## Source Documents

- [Business Requirements](requirements/business_requirements.md) - full scope, user journeys, functional and non-functional requirements, MVP definition, and success metrics.
- [Build Plan](plan/plan.md) - phased delivery plan with stack choices, testing strategy, documentation strategy, Make targets, and per-phase exit criteria.

@requirements/business_requirements.md
@plan/plan.md

## Technology Stack (summary)

- Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS v4
- MDX for blog posts, project pages, and resume content
- Vitest + React Testing Library for unit and component tests
- Playwright for end-to-end, accessibility (axe-core), and visual tests
- Lighthouse CI for performance, accessibility, best practices, and SEO budgets
- lychee for broken-link checks
- GitHub Actions for CI; AWS Amplify Hosting for the production site (Route 53 + ACM for the custom domain). Static-only - no backend.
- Docker Compose for local tooling (analytics, Lighthouse runner, link checker)

Full rationale and version targets live in [plan/plan.md](plan/plan.md).

## Repository Layout (target)

```
testingwithagents/
  app/                Next.js App Router pages
  content/            MDX content (projects, blog, resume)
  components/         UI components
  lib/                Content loaders, MDX config, SEO helpers
  public/             Static assets, resume.pdf, OG images
  tests/              unit, e2e, a11y
  docs/               ARCHITECTURE, CONTENT_GUIDE, TESTING, DEPLOYMENT
  docker/             Compose files for local tooling
  Makefile
  CHANGELOG.md
  FEATURES.md
  TODO.md
  README.md
```

## Make Targets (canonical entry points)

Required by the project working agreement:

- `make install` - install Node dependencies and Playwright browsers (alias: `make setup`)
- `make config` - validate local environment and required config
- `make build` - production build
- `make test` - unit + e2e + a11y test suites
- `make deploy` - trigger an AWS Amplify release of the current branch
- `make run-docker` - bring up local Docker services (alias: `make compose-up`)

Supporting:

- `make dev` - run Next.js dev server
- `make lint` - eslint, markdownlint, prettier check
- `make typecheck` - tsc --noEmit
- `make unit` / `make e2e` / `make a11y` - individual test suites
- `make start` - serve production build
- `make compose-down` - stop local Docker services
- `make linkcheck` - lychee scan
- `make lighthouse` - Lighthouse CI
- `make ci` - full local equivalent of CI

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

## Definition of Done

A task is done when:
1. Code, content, and tests are written and committed.
2. `make ci` is green locally and in GitHub Actions.
3. Affected documentation is updated.
4. `CHANGELOG.md`, `FEATURES.md`, and `TODO.md` reflect the new state.
5. The change has been previewed against the relevant user journey from the business requirements.
