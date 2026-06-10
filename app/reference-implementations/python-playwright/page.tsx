import type { Metadata } from "next";
import { site } from "@/lib/site-config";
import {
  Callout,
  CodeBlock,
  DataTable,
  ExternalLink,
  PageHero,
  Prose,
  Section,
  SubHeading,
} from "../primitives";

const REPO = "https://github.com/NickBaynham/python-test-automation";

const description =
  "A beginner-friendly guide to the Python Playwright reference implementation: automate UI, REST API, and MongoDB testing with one platform, from first run to a full-stack scenario, with worked examples that all run and pass.";

export const metadata: Metadata = {
  title: "Python Playwright Reference Implementation",
  description,
  alternates: { canonical: "/reference-implementations/python-playwright" },
  openGraph: {
    type: "website",
    title: `Python Playwright Reference Implementation — ${site.name}`,
    description,
    url: `${site.url}/reference-implementations/python-playwright`,
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
  },
};

const uiExample = `from collections.abc import Callable
from uuid import uuid4

from playwright.sync_api import expect

from tests.e2e.pages.sample_app import SampleAppPage


def test_new_item_is_listed(
    sample_app: SampleAppPage, track_item: Callable[[str], str]
) -> None:
    name = track_item(f"guide-{uuid4().hex[:8]}")
    sample_app.open()
    sample_app.add_item(name)
    expect(sample_app.items().filter(has_text=name)).to_have_count(1)`;

const apiExample = `from testplatform.api import ApiClient
from testplatform.assertions import assert_json_contains, assert_status


def test_item_lifecycle(api: ApiClient) -> None:
    created = api.post("/items", json_body={"name": "guide item"})
    assert_status(created, 201)
    item_id = created.json()["id"]

    fetched = api.get(f"/items/{item_id}")
    assert_status(fetched, 200)
    assert_json_contains(fetched, {"name": "guide item"})

    assert_status(api.request("DELETE", f"/items/{item_id}"), 204)
    assert_status(api.get(f"/items/{item_id}"), 404)`;

const dbExample = `from uuid import uuid4

from testplatform.assertions import assert_collection_count, assert_field_values
from testplatform.db import MongoSeeder, MongoTarget


def test_seeded_order_state(mongo_target: MongoTarget, seeder: MongoSeeder) -> None:
    tag = f"guide-{uuid4().hex[:8]}"
    seeder.seed(
        "orders", {"tag": tag, "status": "new"}, {"tag": tag, "status": "paid"}
    )
    assert_collection_count(mongo_target, "orders", 2, {"tag": tag})
    assert_field_values(
        mongo_target, "orders", {"tag": tag, "status": "paid"}, {"status": "paid"}
    )`;

const firstRun = `make install            # dependencies (PDM)
make install-browsers   # detect browsers, write config/browsers.json
make docker-up          # start the sample stack: React app, REST API, MongoDB
make test               # run everything: unit, integration, e2e
make report             # browse the Allure HTML report`;

const pageObjectSketch = `class SignInPage(BasePage):
    @property
    def path(self) -> str:
        return "/sign-in"

    @property
    def ready_locator(self) -> Locator:
        return self.heading  # visible exactly when the page is usable`;

export default function PythonPlaywrightPage() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHero
        eyebrow="Reference implementation"
        title="Python Playwright"
        intro={
          <>
            A complete, open-source test automation platform in Python: Playwright-driven UI tests
            across every browser your machine has, a typed REST API client with schema-validating
            assertions, MongoDB seeding and state verification, and one full-stack scenario that
            chains all three. This guide takes you from a fresh clone to writing your own tests at
            each layer. Every code example on this page runs and passes against the project&apos;s
            dockerized sample stack.
          </>
        }
      >
        <p className="mt-6">
          <ExternalLink href={REPO}>View the source on GitHub</ExternalLink>
        </p>
      </PageHero>

      <Section
        id="introduction"
        number="01"
        title="Introduction"
        intro="The platform tests applications at three layers. Knowing which layer a check belongs to is the single most useful skill this guide teaches."
      >
        <DataTable
          caption="The three testing layers and what each verifies"
          head={["Layer", "Test suite", "Verifies", "Built on"]}
          rows={[
            [
              "UI",
              <code key="1">tests/e2e/</code>,
              "What a user sees and does in the browser",
              "Playwright, page objects",
            ],
            [
              "API",
              <code key="2">tests/integration/</code>,
              "REST contracts: status codes, payloads, schemas",
              "httpx client, assertion helpers",
            ],
            [
              "Database",
              <code key="3">tests/integration/</code>,
              "Stored state behind the application",
              "pymongo target, seeding, state assertions",
            ],
          ]}
        />
        <Prose>
          <p>
            A fourth pattern, the <strong>full-stack scenario</strong>, chains all three: act in the
            UI, verify through the API, confirm the document in MongoDB. The repository ships a
            working one in{" "}
            <ExternalLink href={`${REPO}/tree/main/tests/e2e`}>
              tests/e2e/test_full_stack.py
            </ExternalLink>
            .
          </p>
          <p>
            You will need Python 3.14+, PDM, GNU Make, Docker Desktop, and the Allure CLI — the{" "}
            <ExternalLink href={`${REPO}/blob/main/README.md`}>README</ExternalLink> lists install
            commands for each. Then the first run is five commands:
          </p>
        </Prose>
        <CodeBlock label="First run" code={firstRun} />
        <Callout kind="tip" title="How the browser matrix works">
          <p>
            <code>make install-browsers</code> detects what your machine can run — Playwright
            engines (chromium, firefox, webkit) plus system browsers like Chrome and Edge — and
            writes <code>config/browsers.json</code>. Every UI test then runs automatically against
            each browser marked available. Your colleague with Edge installed runs a wider matrix
            than you, with zero test changes.
          </p>
        </Callout>
      </Section>

      <Section
        id="ui-tests"
        number="02"
        title="UI Testing, Step by Step"
        intro="UI tests are written against page objects, never raw selectors. The fixtures handle browsers, isolation, and failure evidence for you."
      >
        <Prose>
          <p>Three steps to a new UI test:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Create a page object</strong> under <code>tests/e2e/pages/</code> extending{" "}
              <code>BasePage</code>. Implement <code>path</code> (the route) and{" "}
              <code>ready_locator</code> (an element visible exactly when the page is usable — this
              is how the platform avoids sleeps). Expose locators and actions as attributes and
              methods.
            </li>
            <li>
              <strong>Write the test as a plain function</strong> taking the page-object fixture,
              and assert with Playwright&apos;s <code>expect</code>, which waits intelligently.
            </li>
            <li>
              <strong>Create unique data and clean it up</strong> — the <code>track_item</code>{" "}
              fixture deletes whatever your test created, even when the test fails.
            </li>
          </ol>
        </Prose>
        <CodeBlock label="A minimal page object" code={pageObjectSketch} />
        <Callout kind="note" title="Locator conventions">
          <p>
            Role-based locators first (
            <code>get_by_role(&quot;button&quot;, name=&quot;Add&quot;)</code>), test-id locators (
            <code>get_by_test_id</code>) where a role would be ambiguous, and never structural CSS
            or XPath. Roles follow the accessibility tree, which stays stable across React
            re-renders — and doubles as a quiet accessibility check on the app under test. See{" "}
            <ExternalLink href={`${REPO}/blob/main/tests/e2e/pages/sample_app.py`}>
              the reference page object
            </ExternalLink>
            .
          </p>
        </Callout>
        <SubHeading>A complete UI test</SubHeading>
        <CodeBlock label="tests/e2e/test_example.py" code={uiExample} />
        <Prose>
          <p>
            Run it with <code>make docker-up</code> then <code>make test-e2e</code>. It executes
            once per available browser. If it fails, a full-page screenshot and a Playwright trace
            land in <code>test-artifacts/</code>, named after the test.
          </p>
        </Prose>
        <Callout kind="warning" title="Never assert only that something is absent">
          <p>
            Absence checks pass before the application has reacted — a test asserting an empty list
            can go green before the bug renders the item. Anchor on a positive state change first,
            then assert the absence alongside it. This rule caught a real false-pass in this very
            project.
          </p>
        </Callout>
      </Section>

      <Section
        id="api-tests"
        number="03"
        title="API Testing, Step by Step"
        intro="API tests use a typed httpx client and assertion helpers whose failure messages carry the response body — diagnosable from the test report alone."
      >
        <Prose>
          <p>
            Take the <code>api</code> fixture (an <code>ApiClient</code> bound to{" "}
            <code>TP_API_BASE_URL</code>), make calls with <code>get</code>/<code>post</code>/
            <code>request</code>, and assert with <code>assert_status</code>,{" "}
            <code>assert_json</code>, <code>assert_json_contains</code>, or{" "}
            <code>assert_matches_schema</code> (JSON Schema 2020-12, reporting every violation at
            once). Delete what you create.
          </p>
        </Prose>
        <SubHeading>A complete API test</SubHeading>
        <CodeBlock label="tests/integration/test_example.py" code={apiExample} />
        <Callout kind="tip" title="Failures explain themselves">
          <p>
            <code>assert_status(response, 200)</code> failing against a 500 shows you the error
            body, not just the number. A proxy returning an HTML error page produces{" "}
            <em>&quot;response body is not JSON: &lt;html&gt;...&quot;</em> instead of a decode
            traceback. Write assertions through the helpers and your future self reads better
            failure reports.
          </p>
        </Callout>
      </Section>

      <Section
        id="db-tests"
        number="04"
        title="Database Testing, Step by Step"
        intro="Database tests seed their own state, verify documents directly in MongoDB, and remove exactly what they seeded."
      >
        <Prose>
          <p>
            The <code>mongo_target</code> fixture connects to <code>TP_MONGO_URL</code> and fails
            fast with guidance when the database is down. The <code>seeder</code> fixture inserts
            documents and deletes them afterwards — by id, never by dropping collections, so it is
            safe against a database holding data your test does not own. Tag seeded documents with a
            unique marker and scope queries to it.
          </p>
        </Prose>
        <SubHeading>A complete database test</SubHeading>
        <CodeBlock label="tests/integration/test_example_db.py" code={dbExample} />
        <Callout kind="note" title="The full-stack pattern">
          <p>
            When a behavior spans layers, chain them: act in the UI, locate the effect through the
            API, verify the stored document. Full-stack tests are the most expensive kind — keep one
            per user journey and let the cheaper layers carry the volume. The{" "}
            <ExternalLink href={`${REPO}/tree/main/tests/e2e`}>reference scenario</ExternalLink>{" "}
            shows the shape.
          </p>
        </Callout>
      </Section>

      <Section
        id="design"
        number="05"
        title="Designing Tests for the Framework"
        intro="The rules that keep a growing suite fast, trustworthy, and pleasant to work in."
      >
        <DataTable
          caption="Test design principles"
          head={["Principle", "What it means in practice"]}
          rows={[
            [
              <strong key="a">Choose the lowest layer that proves the behavior</strong>,
              "A payload contract belongs in an API test, not behind a browser. A stored side effect belongs in a database assertion. A user journey belongs in the UI suite.",
            ],
            [
              <strong key="b">Isolation is non-negotiable</strong>,
              "Every test creates its own data with unique names, cleans up what it creates, and never depends on another test having run. Whole-list equality against shared state is forbidden; filter to your own data.",
            ],
            [
              <strong key="c">Page objects own locators; tests own assertions</strong>,
              "If a test reaches for page.get_by_* directly, the locator belongs in a page object. If a page object asserts, that judgment belongs in the test.",
            ],
            [
              <strong key="d">Configuration comes from the environment</strong>,
              "Tests read targets through load_settings(), never hardcoded URLs. Remote targets require every TP_*_URL explicitly — the platform refuses to point a remote run at localhost defaults.",
            ],
            [
              <strong key="e">Names state behavior</strong>,
              "test_added_item_appears_and_input_clears tells the reader what broke without opening the file.",
            ],
          ]}
        />
      </Section>

      <Section
        id="troubleshooting"
        number="06"
        title="Troubleshooting"
        intro="The failures you will actually hit, each with its cause and fix. All of these were encountered for real while building the platform."
      >
        <DataTable
          caption="Common failures with causes and fixes"
          head={["Symptom", "Cause", "Fix"]}
          rows={[
            [
              <code key="1">sample API not reachable / MongoDB not reachable</code>,
              "The dockerized stack is down",
              <span key="f1">
                <code>make docker-up</code> and wait for healthy
              </span>,
            ],
            [
              "Every e2e test skipped: no usable browser inventory",
              <span key="c2">
                Missing or invalid <code>config/browsers.json</code>
              </span>,
              <code key="f2">make install-browsers</code>,
            ],
            [
              "Coverage failure when running one test file",
              "The 90% gate is calibrated for the full suite",
              <span key="f3">
                Add <code>--no-cov</code> for spot runs
              </span>,
            ],
            [
              <span key="c4">
                ValidationError naming <code>TP_*_URL</code> variables
              </span>,
              "Remote mode refuses defaulted localhost URLs",
              "Set every named variable explicitly",
            ],
            [
              <code key="5">port is already allocated</code>,
              "Another process owns 3100, 8100, or 27100",
              <span key="f5">
                Copy <code>.env.example</code> to <code>.env</code>; change the port and its
                matching URL together
              </span>,
            ],
            [
              "A test failed — where is the evidence?",
              "Failure artifacts are captured automatically",
              <span key="f6">
                Screenshots and traces in <code>test-artifacts/</code>; open traces with{" "}
                <code>playwright show-trace</code>; <code>make report</code> for Allure
              </span>,
            ],
            [
              <span key="c7">
                Windows: <code>make</code> not found
              </span>,
              "GNU Make is not installed by default",
              <code key="f7">choco install make</code>,
            ],
          ]}
        />
        <Callout kind="tip" title="When a test fails on some browsers but not others">
          <p>
            An e2e race that varies by browser is usually an application race, not test flakiness.
            While building this platform, the suite caught the sample app losing user input typed
            during an in-flight submit — three browsers failed, one passed by timing luck. The fix
            belonged in the application. Root-cause before adding waits.
          </p>
        </Callout>
      </Section>
    </main>
  );
}
