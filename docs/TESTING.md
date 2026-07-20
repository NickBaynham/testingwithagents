# Testing

Layered testing strategy. Every phase ships its tests alongside its code.

## Layers

| Layer | Tool | Location | Run |
|---|---|---|---|
| Static | TypeScript strict, ESLint, markdownlint, Prettier | repo | `make lint`, `make typecheck` |
| Unit / Component | Vitest + React Testing Library | `tests/unit/` | `make unit` |
| End-to-end | Playwright | `tests/e2e/` | `make e2e` |
| Accessibility | axe-core via Playwright (tag `@a11y`) | `tests/a11y/` | `make a11y` |
| Visual | Playwright screenshots (Phase 2+) | `tests/e2e/__screenshots__/` | `make e2e` |
| Link integrity | lychee | `lychee.toml` | `make linkcheck` |

## Pinned Profiles

- Playwright projects: `chromium-desktop` at 1280x800 and `chromium-mobile` (Pixel 7) at 390x844. Defined in `playwright.config.ts`.
- Visual baselines (Phase 2+): regenerate with `npx playwright test --update-snapshots` and include a `CHANGELOG.md` entry. CI snapshots are taken on Linux; local macOS runs use `--ignore-snapshots` unless regenerating intentionally.

Performance scoring (Lighthouse / PageSpeed Insights) is out of scope for automated CI. Run it manually from the browser or PageSpeed Insights when investigating a regression.

## Running

- `make test` runs unit + e2e + a11y.
- `make ci` runs the full local CI: lint, typecheck, test, build, linkcheck.

## Writing a test

- Unit tests go under `tests/unit/`, file extension `.test.ts` or `.test.tsx`. They use `vitest` + `@testing-library/react`. Common matchers come from `@testing-library/jest-dom` (already wired in `tests/unit/setup.ts`).
- E2E tests go under `tests/e2e/`, file extension `.spec.ts`. They use Playwright. A test is treated as an a11y check if its title contains `@a11y` and it lives under `tests/a11y/`.
- A11y tests use `@axe-core/playwright`. Filter violations to `serious` or `critical` impact and assert the resulting array is empty. WCAG tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`.

## Known environment pitfalls

- **Every unit test fails with `window.localStorage` undefined (`TypeError: Cannot read properties of undefined (reading 'clear')` in `tests/unit/setup.ts`).** Node 25+ enables an experimental Web Storage global by default; without `--localstorage-file` it is present-but-unavailable, and it shadows jsdom's own `localStorage` inside the Vitest environment. The `test:unit` script therefore sets `NODE_OPTIONS=--no-experimental-webstorage` (the flag exists since Node 22.4, so it is safe on the CI-pinned Node 24), and the Makefile `unit` target delegates to `npm run test:unit` so the flag applies identically via `make`, npm, and GitHub Actions. If the whole unit suite ever fails on localStorage after a local Node upgrade, check that this flag is still in `package.json` before debugging anything else.
