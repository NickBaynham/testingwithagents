import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site-config";
import {
  Callout,
  CodeBlock,
  DataTable,
  ExternalLink,
  PageHero,
  Prose,
  Section,
} from "../primitives";

const REPO = "https://github.com/NickBaynham/typescript-test-automation";

const description =
  "The TypeScript twin of the Python Playwright reference implementation: strict-mode TypeScript, Zod-validated configuration, host-aware browser installation, and Playwright Test driving a dockerized React app — with REST API and MongoDB layers following the same phased plan.";

export const metadata: Metadata = {
  title: "TypeScript Playwright Reference Implementation",
  description,
  alternates: { canonical: "/reference-implementations/typescript-playwright" },
  openGraph: {
    type: "website",
    title: `TypeScript Playwright Reference Implementation — ${site.name}`,
    description,
    url: `${site.url}/reference-implementations/typescript-playwright`,
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
  },
};

const firstRun = `make install            # dependencies (pnpm)
make install-browsers   # host-aware browser install, writes config/browsers.json
make docker-up          # start the dockerized sample React app
make test               # unit tests with coverage, then e2e across available browsers
make report             # Allure HTML report (pure-JavaScript Allure 3 CLI)`;

export default function TypeScriptPlaywrightPage() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHero
        eyebrow="Reference implementation"
        title="TypeScript Playwright"
        intro={
          <>
            The TypeScript twin of the{" "}
            <Link
              href="/reference-implementations/python-playwright"
              className="font-medium text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
            >
              Python reference implementation
            </Link>
            : the same platform scope and phased engineering approach, rebuilt natively in
            TypeScript. Playwright is at home here — the test runner, fixtures, and failure
            artifacts are all first-party. The UI testing layer is shipped and verified; the REST
            API and MongoDB layers follow the same plan the Python twin completed.
          </>
        }
      >
        <p className="mt-6">
          <ExternalLink href={REPO}>View the source on GitHub</ExternalLink>
        </p>
      </PageHero>

      <Section
        id="status"
        number="01"
        title="Where It Stands"
        intro="Built in deliberate parity with the Python twin, phase by phase. Decisions made in one implementation are mirrored — or deliberately diverged with the reason recorded — in the other."
      >
        <DataTable
          caption="Delivery phases and their status"
          head={["Phase", "Capability", "Status"]}
          rows={[
            [
              "0",
              "Quality-gated TypeScript project: strict tsc, ESLint + Prettier, Vitest with a 90% coverage gate, pnpm audit",
              "Shipped",
            ],
            [
              "1",
              "React UI testing: page objects, host-aware browser matrix, dockerized sample app, Allure reporting, Linux + Windows CI",
              "Shipped",
            ],
            ["2", "REST API testing: typed fetch client, Zod-validated responses", "In progress"],
            [
              "3",
              "MongoDB state verification and the full-stack scenario, plus the tester guide",
              "Planned",
            ],
          ]}
        />
        <Callout kind="note" title="Same ideas, native idioms">
          <p>
            Where Python uses Pydantic, PDM, and pytest, this implementation uses Zod (with static
            types inferred from schemas), pnpm, and Vitest plus Playwright Test. Failure screenshots
            and traces come from Playwright Test&apos;s built-in <code>only-on-failure</code> and{" "}
            <code>retain-on-failure</code> settings rather than hand-rolled fixtures.
          </p>
        </Callout>
      </Section>

      <Section
        id="first-run"
        number="02"
        title="First Run"
        intro="Five commands from clone to a browsable test report. Node 24 LTS, pnpm, Docker Desktop, and GNU Make are the prerequisites; on native Windows the same pnpm scripts run without Make."
      >
        <CodeBlock label="First run" code={firstRun} />
        <Prose>
          <p>
            The browser matrix works exactly as in the Python twin: detection writes{" "}
            <code>config/browsers.json</code>, and the Playwright configuration derives its projects
            from the browsers marked available — including branded Chrome and Edge via channels. A
            launch smoke test proves every &quot;available&quot; browser genuinely runs.
          </p>
        </Prose>
      </Section>

      <Section
        id="ui-layer"
        number="03"
        title="The UI Layer"
        intro="Page objects with React-suited locator conventions, documented and unit tested."
      >
        <Prose>
          <p>
            Page objects extend <code>BasePage</code> (route-path navigation, readiness contract)
            and follow a documented locator hierarchy: role with accessible name first, then label,
            then test id — structural CSS and XPath are excluded by policy. The conventions are
            documented in <code>docs/page-objects.md</code> in{" "}
            <ExternalLink href={REPO}>the repository</ExternalLink>, and the sign-in page object in{" "}
            <code>src/pages/</code> is the executable reference.
          </p>
          <p>
            The platform&apos;s own modules are unit tested with Vitest behind a 90 percent coverage
            gate, while e2e specs in <code>tests/e2e/</code> drive the dockerized sample application
            across the browser matrix — 16 tests (4 specs by 4 browsers) green in CI.
          </p>
        </Prose>
        <Callout kind="tip" title="Following along">
          <p>
            The full guide format you see on the{" "}
            <Link
              href="/reference-implementations/python-playwright"
              className="font-medium text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
            >
              Python page
            </Link>{" "}
            — layer-by-layer how-tos with executed examples and a troubleshooting table — arrives
            here when Phase 3 completes, matching the twin&apos;s tester guide. The concepts on that
            page apply to this implementation today; only the syntax differs.
          </p>
        </Callout>
      </Section>
    </main>
  );
}
