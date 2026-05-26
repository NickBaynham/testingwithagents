import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd, type JsonLdObject } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

const description =
  "Test Commander is a human-guided agentic testing workflow that helps testers explore web applications, generate BDD specs, create Playwright automation, run tests in CI/CD, and produce quality reports.";

export const metadata: Metadata = {
  title: "Test Commander",
  description,
  alternates: { canonical: "/test-commander" },
  openGraph: {
    type: "website",
    title: `Test Commander — ${site.name}`,
    description,
    url: `${site.url}/test-commander`,
    images: [{ url: "/og/test-commander.png", width: 1200, height: 630, alt: "Test Commander" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Test Commander — ${site.name}`,
    description,
    images: ["/og/test-commander.png"],
  },
};

const creativeWork: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Test Commander",
  description,
  creator: { "@type": "Person", name: site.name, url: site.url },
  keywords:
    "AI software testing, agentic testing, AI-assisted QA, Playwright automation, BDD testing, quality engineering, CI/CD testing, human-in-the-loop testing",
  creativeWorkStatus: "Active",
  url: `${site.url}/test-commander`,
};

/* ---------- shared layout primitives (kept inline so the page stays self-contained) ---------- */

function SectionHeader({
  number,
  eyebrow,
  title,
  intro,
}: {
  number: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
        <span aria-hidden="true">{number} / </span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">{intro}</p>
      ) : null}
    </header>
  );
}

function Terminal({
  label = "~/test-commander",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-sm">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
        </span>
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">{label}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text)]">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

/* ---------- content models ---------- */

const heroCommands = `$ make app-up
$ make explore-ui
$ make generate-bdd
$ make generate-tests
$ make test-ui
$ make report-quality`;

const workflowSteps: readonly { label: string; hint: string; body: ReactNode }[] = [
  {
    label: "Explore",
    hint: "Walk the UI with the tester in the lead.",
    body: (
      <>
        The agent explores the UI with guidance from the tester. It identifies pages, navigation
        paths, forms, validation behavior, likely defect surfaces, test data needs, and stable
        locators. The output is a structured exploration report.
      </>
    ),
  },
  {
    label: "Model",
    hint: "Organize findings into a lightweight app model.",
    body: (
      <>
        Findings consolidate into a page inventory, user-flow map, page-object candidates, locator
        inventory, risk areas, and test-data requirements. The team finishes with a clearer picture
        of what the application actually does.
      </>
    ),
  },
  {
    label: "Specify",
    hint: "Turn observations into BDD scenarios.",
    body: (
      <>
        The agent drafts BDD-style feature files from the exploration output. Specs are readable to
        manual testers, business analysts, automation engineers, and product owners, so review is a
        conversation rather than a translation exercise.
      </>
    ),
  },
  {
    label: "Automate",
    hint: "Convert approved specs into Playwright tests.",
    body: (
      <>
        Approved BDD scenarios become deterministic Playwright tests. Stable locators, page objects,
        fixtures, clear assertions, and tags like <code>@smoke</code>, <code>@regression</code>, and{" "}
        <code>@negative</code>. The goal is maintainable automation, not random clicking.
      </>
    ),
  },
  {
    label: "Execute",
    hint: "Run locally or in CI/CD.",
    body: (
      <>
        Tests run from the terminal locally and from the same scripts in CI/CD. The tester never has
        to leave the workflow to inspect, re-run, or triage results.
      </>
    ),
  },
  {
    label: "Report",
    hint: "Produce quality evidence, not opinions.",
    body: (
      <>
        A quality report summarizes exploration findings, BDD coverage, test results, defects, and
        historical trends. Facts, interpretation, and human-review items stay clearly separated.
      </>
    ),
  },
  {
    label: "Improve",
    hint: "Feed insights back into the next exploration.",
    body: (
      <>
        Risks, gaps, and review notes become the seed of the next exploration cycle. The system is
        designed so that quality knowledge compounds with each iteration.
      </>
    ),
  },
];

const phaseIIncludes = [
  "UI exploration and flow discovery",
  "Locator discovery and page-object modeling",
  "BDD specification generation",
  "Playwright UI test generation",
  "Local and CI/CD test execution",
  "Quality reporting",
  "Blog posts and courseware",
];

const phaseIDefers = [
  "API testing",
  "Database validation",
  "Performance testing",
  "Full security testing",
  "Jira integration",
  "Production monitoring",
];

const makeCommands: readonly { command: string; purpose: string }[] = [
  { command: "make setup", purpose: "Install project dependencies." },
  { command: "make app-up", purpose: "Start the target application locally." },
  { command: "make explore-ui", purpose: "Explore the UI and generate exploration artifacts." },
  { command: "make generate-bdd", purpose: "Generate BDD specs from exploration output." },
  { command: "make generate-tests", purpose: "Generate Playwright tests from approved specs." },
  { command: "make test-ui", purpose: "Run the UI automation suite." },
  { command: "make report-quality", purpose: "Generate the quality report." },
];

const audiences: readonly { name: string; pitch: string; points: readonly string[] }[] = [
  {
    name: "Manual testers",
    pitch: "Turn exploratory knowledge into reusable evidence.",
    points: [
      "Organize exploration into user flows and risks.",
      "Convert observations into BDD scenarios you can review.",
      "Participate in AI-assisted work without becoming a developer overnight.",
    ],
  },
  {
    name: "Automation engineers",
    pitch: "Start from a model, not a pile of vague tickets.",
    points: [
      "Structured flows, locators, and page objects as inputs.",
      "Spec-first generation that maps cleanly to Playwright.",
      "Less rework because tests start from real testing intent.",
    ],
  },
  {
    name: "QA managers",
    pitch: "A repeatable quality process with explicit guardrails.",
    points: [
      "Faster design, clearer coverage, stronger reporting.",
      "Easier onboarding for new testers.",
      "A practical way to adopt AI without losing human oversight.",
    ],
  },
  {
    name: "Recruiters and hiring managers",
    pitch: "Evidence of modern QA judgement, not just tooling.",
    points: [
      "AI-assisted exploration, BDD, Playwright, CI/CD, reporting — connected.",
      "Demonstrates human-in-the-loop quality systems.",
      "Pairs automation engineering with strategic communication.",
    ],
  },
  {
    name: "Clients",
    pitch: "A practical path to AI-enhanced quality engineering.",
    points: [
      "Modernize exploratory testing into a structured automation pipeline.",
      "Generate readable specs your team can review and approve.",
      "Stand up regression coverage and quality reports without starting from scratch.",
    ],
  },
];

const principles: readonly { title: string; body: string }[] = [
  {
    title: "Human-guided, not fully autonomous",
    body: "The agent helps; the tester owns the quality decision. AI output is never treated as automatically correct.",
  },
  {
    title: "Exploration before automation",
    body: "Automation starts from understanding. Identify what matters first, then encode it.",
  },
  {
    title: "BDD as the bridge",
    body: "Readable specs connect manual testers, automation engineers, and product stakeholders.",
  },
  {
    title: "Deterministic tests for CI/CD",
    body: "AI may help generate tests, but CI/CD needs reliable checks. Playwright stays the source of truth.",
  },
  {
    title: "Separate facts from interpretation",
    body: "Reports distinguish observed, tested, passed, failed, inferred, and items needing human review.",
  },
];

const roadmap: readonly { phase: string; title: string; body: string; current?: boolean }[] = [
  {
    phase: "Phase I",
    title: "UI testing",
    body: "Exploration, BDD generation, Playwright automation, CI/CD, quality reporting, documentation, blog posts, courseware.",
    current: true,
  },
  {
    phase: "Phase II",
    title: "API testing",
    body: "API discovery, contract-style checks, UI/API consistency tests, API quality reporting.",
  },
  {
    phase: "Phase III",
    title: "Database validation",
    body: "Test data setup and reset, state validation, UI/API/database traceability, integrity checks.",
  },
  {
    phase: "Phase IV",
    title: "Quality intelligence",
    body: "Historical trends, risk scoring, release readiness, agent-assisted recommendations, dashboard views.",
  },
  {
    phase: "Phase V",
    title: "Training and consulting",
    body: "Course, workshops, client demos, implementation templates, starter kits.",
  },
];

type AdoptionTone = "observe" | "design" | "execute" | "scale" | "evolve";

const implementationStages: readonly {
  stage: string;
  title: string;
  outcome: string;
  body: string;
  tone: AdoptionTone;
}[] = [
  {
    stage: "Stage 1",
    title: "Quality visibility",
    outcome: "A shared quality baseline.",
    body: "Existing requirements, tests, defects, risks, and reports become a single living dashboard. No major process change — just the picture, made visible.",
    tone: "observe",
  },
  {
    stage: "Stage 2",
    title: "Requirements review",
    outcome: "Stories become clearer and more testable.",
    body: "Test Commander reviews stories before implementation for clarity, missing acceptance criteria, edge cases, data rules, and automation suitability. Quality shifts left through better questions, not more meetings.",
    tone: "observe",
  },
  {
    stage: "Stage 3",
    title: "Guided exploration",
    outcome: "Exploratory testing becomes durable.",
    body: "A tester points Test Commander at a target environment and explores. Observations, screenshots, risks, bugs, locator candidates, and test data needs join the quality knowledge base instead of someone's notebook.",
    tone: "design",
  },
  {
    stage: "Stage 4",
    title: "BDD and test design",
    outcome: "Test design becomes traceable to business intent.",
    body: "Approved test ideas become BDD scenarios tied to requirements and risks. The team can see which stories have coverage and which edge cases are still missing.",
    tone: "design",
  },
  {
    stage: "Stage 5",
    title: "Strategic automation",
    outcome: "Playwright tests with rationale, not guesswork.",
    body: "Automation candidates are scored on business criticality, repeatability, determinism, UI stability, and maintenance cost. Only the candidates worth automating become Playwright tests, page objects, fixtures, and test data.",
    tone: "execute",
  },
  {
    stage: "Stage 6",
    title: "Team web console",
    outcome: "A quality command center the whole team sees.",
    body: "Live dashboard, journal, BDD viewer, run history, evidence gallery, risk register. Testers explore, developers inspect traces, product owners answer questions, managers read the summary — one shared quality story.",
    tone: "scale",
  },
  {
    stage: "Stage 7",
    title: "Sandboxed workspaces",
    outcome: "No-code testing environments on demand.",
    body: "A pull request spins up a temporary Test Commander workspace with UI, runtime, uploaded docs, target URL, and artifact storage. Open a link, start testing. No local setup. No Playwright install on a tester's laptop.",
    tone: "scale",
  },
  {
    stage: "Stage 8",
    title: "Continuous self-improvement",
    outcome: "The system gets better at helping the team test.",
    body: "Lessons accumulate from requirements, code, tests, failures, and production defects. Candidate lessons are reviewed, accepted, rejected, or flagged for human review — then promoted into project guidance. The loop is governed, not silent.",
    tone: "evolve",
  },
  {
    stage: "Stage 9",
    title: "Governed autonomy",
    outcome: "Continuous monitoring with human-approved change.",
    body: "Test Commander watches code, requirements, and pipelines. It analyzes impact, proposes coverage, runs approved suites, captures evidence, opens pull requests, and explains itself. Humans still approve the changes that matter.",
    tone: "evolve",
  },
];

type AutonomyLevel = {
  level: string;
  name: string;
  body: string;
  recommended?: boolean;
};

const autonomyLevels: readonly AutonomyLevel[] = [
  {
    level: "Level 0",
    name: "Read-only advisor",
    body: "Reads artifacts, answers questions, produces reports, risks, and recommendations. Modifies nothing. The right place to start.",
  },
  {
    level: "Level 1",
    name: "Assisted testing",
    body: "Generates proposed artifacts — BDD scenarios, draft tests, automation candidates, report updates. A human reviews and approves.",
  },
  {
    level: "Level 2",
    name: "Approved execution",
    body: "Runs designated test suites and updates reports in safe environments. Smoke, regression, screenshots. A good team default.",
  },
  {
    level: "Level 3",
    name: "Pull request automation",
    body: "Creates branches and PRs with proposed test updates: new BDD scenarios, generated tests, refreshed traceability. Humans review and merge.",
    recommended: true,
  },
  {
    level: "Level 4",
    name: "Governed maintenance",
    body: "Automatically maintains low-risk assets under strict rules — locator refreshes when confidence is high, diagrams, report regeneration, flaky-test triage. Anything load-bearing still goes to review.",
  },
  {
    level: "Level 5",
    name: "Fully autonomous agent",
    body: "Continuously modifies tests, adds coverage, updates strategy, executes validation with minimal human involvement. Imaginable, not recommended as a default.",
  },
];

const continuousFlow: readonly string[] = [
  "Code change detected",
  "Impact analysis",
  "Story and risk review",
  "Coverage gap analysis",
  "Generate candidates",
  "Run impacted suite",
  "Capture evidence",
  "Open PR · learn",
];

const samplePrComment = `Test Commander Analysis

Changed areas:
  - Checkout
  - Saved addresses
  - Payment error handling

Detected risks:
  - Saved address validation behavior changed
  - Payment failure scenario lacks automated coverage

Existing tests:
  - 12 checkout tests passing
  - 2 impacted tests failed
  - 1 flaky test detected

Recommended actions:
  - Clarify expected behavior for expired saved addresses
  - Add BDD scenario for payment timeout
  - Approve generated Playwright test candidate

Artifacts:
  quality report · screenshots · trace · coverage map`;

/* ---------- page ---------- */

export default function TestCommanderPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <JsonLd
        items={[
          creativeWork,
          breadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "Test Commander", path: "/test-commander" },
          ]),
        ]}
      />

      {/* ============================================================
         HERO — asymmetric. Title block + value paragraph on the left,
         a terminal preview card on the right. Stacks on mobile.
         ============================================================ */}
      <section
        aria-labelledby="hero-heading"
        className="relative grid gap-12 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Flagship project · Phase I
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-5xl font-semibold tracking-tight text-[var(--color-text)] sm:text-6xl"
          >
            Test Commander
          </h1>
          <p className="mt-4 text-2xl font-medium leading-tight text-[var(--color-text-muted)] sm:text-3xl">
            AI-assisted software testing from exploration to automation.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--color-text-muted)]">
            A practical workflow for testers: explore software, identify user flows, design
            scenarios, generate BDD specs, produce deterministic Playwright automation, and ship
            quality reports — all from the terminal. Not a replacement for testers. An assistant for
            them.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            <li>
              <Link
                href="#workflow"
                className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)] transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                See the workflow
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
              >
                Discuss a role or engagement
              </Link>
            </li>
          </ul>
          <p className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />
            <span>
              <span className="text-[var(--color-accent)]">Autonomous where safe.</span>{" "}
              Human-governed where it matters.
            </span>
          </p>
        </div>

        <div className="lg:pt-6">
          <Terminal label="~/test-commander · phase I demo">{heroCommands}</Terminal>
          <p className="mt-4 font-mono text-xs leading-relaxed text-[var(--color-text-subtle)]">
            <span className="text-[var(--color-accent)]">{"// "}</span>
            Six commands take a tester from a cold local app to a quality report. The agent does the
            heavy lifting; the tester stays in charge of every decision in between.
          </p>
        </div>
      </section>

      {/* ============================================================
         PITCH STRIP — strongest one-liner, centered, flanked by
         the three concrete outcomes.
         ============================================================ */}
      <section
        aria-labelledby="pitch-heading"
        className="mt-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 sm:px-12"
      >
        <h2
          id="pitch-heading"
          className="text-balance text-center text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
        >
          Test Commander turns human testing insight into structured automation and quality
          evidence.
        </h2>
        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              term: "Human judgement",
              def: "Testers stay in charge of scope, risk, and what “good enough” means.",
            },
            {
              term: "Agent assistance",
              def: "Exploration, documentation, drafting, generation, summarization.",
            },
            {
              term: "Deterministic evidence",
              def: "Playwright tests, BDD specs, and reports a CI/CD pipeline can rely on.",
            },
          ].map(({ term, def }) => (
            <div key={term}>
              <dt className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {term}
              </dt>
              <dd className="mt-2 text-base leading-7 text-[var(--color-text-muted)]">{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============================================================
         WHAT IT IS — short intro, then the transformation cascade
         showing where exploration ends up.
         ============================================================ */}
      <section aria-labelledby="what-heading" className="mt-24">
        <SectionHeader
          number="01"
          eyebrow="What it is"
          title="A terminal-first testing assistant."
          intro={
            <>
              Test Commander is a workflow and framework concept for modern quality engineering. It
              treats AI as a structured assistant, not a magic test generator. The tester stays in
              control; the agent does the heavy lifting.
            </>
          }
        />
        <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3 font-mono text-sm">
          {[
            "Exploratory notes",
            "Structured ideas",
            "BDD specifications",
            "Playwright tests",
            "Quality evidence",
          ].map((stage, i, arr) => (
            <Fragment key={stage}>
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-[var(--color-text)]">
                {stage}
              </li>
              {i < arr.length - 1 ? (
                <li aria-hidden="true" className="text-[var(--color-accent)]">
                  <Chevron />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </section>

      {/* ============================================================
         WHY IT EXISTS — problems the system addresses.
         ============================================================ */}
      <section aria-labelledby="why-heading" className="mt-24">
        <SectionHeader
          number="02"
          eyebrow="Why it exists"
          title="Most testing teams hit the same wall."
          intro={
            <>
              Manual testing knowledge stays trapped in people&rsquo;s heads. Exploration produces
              insight but inconsistent documentation. Automation lags behind delivery. Reports are
              manual, inconsistent, or missing. Teams want to use AI but worry about reliability.
              Test Commander connects exploration, design, automation, and reporting so the work
              compounds instead of dispersing.
            </>
          }
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            "Manual testing knowledge becomes reusable, not lost.",
            "Exploration produces documentation, not anecdotes.",
            "Automation starts from intent, not screen-recorded clicks.",
            "Reports communicate evidence, not opinions.",
            "AI accelerates the boring parts, humans own the calls.",
            "The same workflow runs locally and in CI/CD.",
          ].map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <span aria-hidden="true" className="mt-1 text-[var(--color-accent)]">
                <Chevron />
              </span>
              <span className="text-[var(--color-text-muted)]">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================================================
         FOR MANUAL TESTERS — the shopping cart example as input
         observations → produced artifacts.
         ============================================================ */}
      <section aria-labelledby="for-testers-heading" className="mt-24">
        <SectionHeader
          number="03"
          eyebrow="For manual testers"
          title="Your thinking becomes the input."
          intro={
            <>
              Think of Test Commander as an assistant that turns your testing instincts into
              organized artifacts. You decide what matters. The agent helps document, structure, and
              automate. Here is what that conversion looks like on a real workflow.
            </>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              You observe
            </h3>
            <p className="mt-3 text-sm text-[var(--color-text-subtle)]">
              Exploring a shopping-cart flow, you notice friction the team has not catalogued.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-text-muted)]">
              <li>The cart count does not always update.</li>
              <li>Invalid search terms are handled inconsistently.</li>
              <li>Required form fields do not show clear errors.</li>
              <li>Login behavior changes after a failed attempt.</li>
              <li>Some buttons are hard to locate reliably.</li>
            </ul>
          </article>
          <article className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-surface)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Test Commander produces
            </h3>
            <p className="mt-3 text-sm text-[var(--color-text-subtle)]">
              Those observations become reusable artifacts in minutes, ready for review.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-text-muted)]">
              <li>User-flow documentation for the cart and checkout.</li>
              <li>Page-object candidates with stable locators.</li>
              <li>Defects and risks logged with severity hints.</li>
              <li>BDD scenarios you can review and approve.</li>
              <li>Playwright tests and quality-report findings.</li>
            </ul>
          </article>
        </div>
      </section>

      {/* ============================================================
         THE WORKFLOW — the centerpiece. Seven nodes with chevron
         separators, then expanded descriptions of each step.
         ============================================================ */}
      <section aria-labelledby="workflow-heading" id="workflow" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="04"
          eyebrow="The workflow"
          title="A loop, not a one-way street."
          intro={
            <>
              Seven steps, designed to feed each other. Insight gathered in one cycle seeds the
              exploration in the next.
            </>
          }
        />
        <ol className="mt-10 flex flex-wrap items-stretch gap-x-2 gap-y-3">
          {workflowSteps.map((step, i) => (
            <Fragment key={step.label}>
              <li className="min-w-[140px] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <div className="font-mono text-xs text-[var(--color-text-subtle)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-base font-semibold text-[var(--color-text)]">
                  {step.label}
                </div>
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">{step.hint}</div>
              </li>
              {i < workflowSteps.length - 1 ? (
                <li
                  aria-hidden="true"
                  className="hidden items-center text-[var(--color-accent)] sm:flex"
                >
                  <Chevron />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {workflowSteps.map((step, i) => (
            <article key={step.label}>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                <span className="font-mono text-sm text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}.
                </span>{" "}
                {step.label}
              </h3>
              <p className="mt-2 text-[var(--color-text-muted)]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================
         PHASE I — what ships now vs what is deferred.
         ============================================================ */}
      <section aria-labelledby="phase-heading" className="mt-24">
        <SectionHeader
          number="05"
          eyebrow="Phase I"
          title="UI testing first. Everything else later."
          intro={
            <>
              The first phase keeps the surface area teachable. Target application:{" "}
              <strong className="font-semibold text-[var(--color-text)]">OWASP Juice Shop</strong> —
              realistic UI complexity, controlled defects, no production risk. The focus is quality
              engineering, not security exploitation.
            </>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-surface)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              In Phase I
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--color-text-muted)]">
              {phaseIIncludes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 text-[var(--color-accent)]">
                    <Chevron />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Deferred to later phases
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--color-text-muted)]">
              {phaseIDefers.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-3 shrink-0 bg-[var(--color-text-subtle)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ============================================================
         EXAMPLE ARTIFACTS — three terminal-styled snippets.
         ============================================================ */}
      <section aria-labelledby="artifacts-heading" className="mt-24">
        <SectionHeader
          number="06"
          eyebrow="What it produces"
          title="Artifacts you can review, automate, and ship."
          intro={
            <>
              The output is not just &ldquo;a test ran.&rdquo; It is structured artifacts your team
              can read, edit, version-control, and learn from.
            </>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Page inventory · YAML
            </p>
            <Terminal label="exploration/pages.yaml">
              {`pages:
  - name: Product Catalog
    purpose: Browse available products
    keyElements:
      - search field
      - product cards
      - basket button
    risks:
      - products may fail to load
      - search results may be inaccurate
      - basket count may not update`}
            </Terminal>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              BDD scenario · Gherkin
            </p>
            <Terminal label="features/basket.feature">
              {`Feature: Basket Management
  @smoke @basket
  Scenario: Customer adds a product to the basket
    Given the customer is on the product catalog page
    When the customer adds a product to the basket
    Then the basket should show the added item`}
            </Terminal>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Quality report · summary
            </p>
            <Terminal label="reports/latest.md">
              {`Explored 5 major UI flows:
  catalog, search, login, registration, basket.

Test suite: 14 UI tests
  passed:  12
  failed:   1   (basket count update)
  skipped:  1

Highest-risk area: basket flow.
Human review recommended for basket and
registration validation messages.`}
            </Terminal>
          </div>
        </div>
      </section>

      {/* ============================================================
         TERMINAL COMMANDS — the make targets, as a labeled table.
         ============================================================ */}
      <section aria-labelledby="commands-heading" className="mt-24">
        <SectionHeader
          number="07"
          eyebrow="Terminal workflow"
          title="Seven commands, end to end."
          intro={
            <>
              Test Commander is terminal-first by design. A tester who is comfortable with the
              command line never has to open an IDE to drive the workflow.
            </>
          }
        />
        <div className="mt-10 overflow-hidden rounded-lg border border-[var(--color-border)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                <th
                  scope="col"
                  className="border-b border-[var(--color-border)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]"
                >
                  Command
                </th>
                <th
                  scope="col"
                  className="border-b border-[var(--color-border)] px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]"
                >
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {makeCommands.map((row, i) => (
                <tr
                  key={row.command}
                  className={
                    i < makeCommands.length - 1
                      ? "border-b border-[var(--color-border)]"
                      : undefined
                  }
                >
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top">
                    <code className="font-mono text-sm text-[var(--color-text)]">
                      {row.command}
                    </code>
                  </td>
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top text-[var(--color-text-muted)]">
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
         WHO IT'S FOR — five-card grid replacing five separate "Value
         for X" sections in the original draft.
         ============================================================ */}
      <section aria-labelledby="audiences-heading" className="mt-24">
        <SectionHeader
          number="08"
          eyebrow="Who it&rsquo;s for"
          title="Five different audiences, one workflow."
          intro={
            <>
              The same artifacts serve manual testers, automation engineers, QA managers,
              recruiters, and clients — each gets value at a different point in the lifecycle.
            </>
          }
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((aud) => (
            <li
              key={aud.name}
              className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-accent)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{aud.name}</h3>
              <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">{aud.pitch}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
                {aud.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================================================
         DESIGN PRINCIPLES — five cards.
         ============================================================ */}
      <section aria-labelledby="principles-heading" className="mt-24">
        <SectionHeader
          number="09"
          eyebrow="Design principles"
          title="The opinions baked into the workflow."
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Principle {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================================================
         CAPABILITY ROADMAP — five-phase strip of what ships when.
         Phase I marked current. (Distinct from the team-adoption
         maturity model in section 11.)
         ============================================================ */}
      <section aria-labelledby="roadmap-heading" className="mt-24">
        <SectionHeader
          number="10"
          eyebrow="Capability roadmap"
          title="UI now. API, data, intelligence, training next."
          intro={
            <>
              What the system <em>can do</em>, phase by phase. Pair this with the team-adoption
              maturity model below — the two roadmaps answer different questions.
            </>
          }
        />
        <ol className="mt-10 grid gap-6 lg:grid-cols-5">
          {roadmap.map((stage) => (
            <li
              key={stage.phase}
              className={
                "rounded-lg border bg-[var(--color-surface)] p-5 " +
                (stage.current
                  ? "border-[var(--color-accent)] shadow-sm"
                  : "border-[var(--color-border)]")
              }
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {stage.phase}
                {stage.current ? <span className="ml-2 normal-case">· Current</span> : null}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================================================
         IMPLEMENTATION ROADMAP — 9-stage team-adoption maturity
         model. Each card uses a `tone` to subtly progress from
         "observe" through "evolve" so the visual reads as a
         maturity gradient without resorting to nine colour
         variations.
         ============================================================ */}
      <section aria-labelledby="adoption-heading" className="mt-24">
        <SectionHeader
          number="11"
          eyebrow="Implementation roadmap"
          title="How teams adopt Test Commander."
          intro={
            <>
              Adoption does not have to be all-or-nothing. Start with visibility, layer in
              requirements review, exploration, BDD, and automation, then graduate to a team console
              and finally to continuous, governed autonomy.
            </>
          }
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {implementationStages.map((stg) => {
            const toneRing =
              stg.tone === "evolve"
                ? "border-[var(--color-accent)] shadow-sm"
                : stg.tone === "scale"
                  ? "border-[var(--color-border)] shadow-sm"
                  : "border-[var(--color-border)]";
            const toneDot =
              stg.tone === "evolve"
                ? "bg-[var(--color-accent)]"
                : stg.tone === "scale"
                  ? "bg-[var(--color-accent)] opacity-60"
                  : stg.tone === "execute"
                    ? "bg-[var(--color-accent)] opacity-40"
                    : stg.tone === "design"
                      ? "bg-[var(--color-accent)] opacity-25"
                      : "bg-[var(--color-text-subtle)] opacity-40";
            return (
              <li
                key={stg.stage}
                className={`rounded-lg border bg-[var(--color-surface)] p-5 ${toneRing}`}
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${toneDot}`} />
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                    {stg.stage}
                  </p>
                </div>
                <h3 className="mt-3 text-base font-semibold text-[var(--color-text)]">
                  {stg.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-[var(--color-accent)]">{stg.outcome}</p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">{stg.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ============================================================
         AUTONOMY LEVELS — Level 0 through Level 5. Level 3 (PR
         automation) is flagged as the recommended team default.
         ============================================================ */}
      <section aria-labelledby="autonomy-heading" className="mt-24">
        <SectionHeader
          number="12"
          eyebrow="Autonomy levels"
          title="How much should the agent be allowed to do on its own?"
          intro={
            <>
              The interesting design question isn&rsquo;t whether Test Commander <em>can</em> run
              unattended — it&rsquo;s which actions are safe to automate and which still need a
              human signature. Six levels, deliberately graduated.
            </>
          }
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {autonomyLevels.map((lvl) => (
            <li
              key={lvl.level}
              className={
                "relative rounded-lg border bg-[var(--color-surface)] p-5 " +
                (lvl.recommended
                  ? "border-[var(--color-accent)] shadow-sm"
                  : "border-[var(--color-border)]")
              }
            >
              {lvl.recommended ? (
                <span className="absolute -top-3 right-4 rounded-full bg-[var(--color-accent)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-fg)]">
                  Recommended default
                </span>
              ) : null}
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {lvl.level}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">{lvl.name}</h3>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{lvl.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl border-l-2 border-[var(--color-accent)] pl-4 text-sm italic text-[var(--color-text-muted)]">
          The best mature workflow lives at Level 3. Test Commander runs continuously, but every
          change to test assets arrives as a pull request a human can read, accept, or reject.
        </p>
      </section>

      {/* ============================================================
         CONTINUOUS QUALITY AGENT — the long-term vision. Two
         columns on lg: narrative + flow on the left, sample PR
         comment in a terminal card on the right.
         ============================================================ */}
      <section aria-labelledby="continuous-heading" className="mt-24">
        <SectionHeader
          number="13"
          eyebrow="Continuous quality agent mode"
          title="A living quality system, not a one-shot script."
          intro={
            <>
              The long-term vision is a continuous quality agent: Test Commander watches the
              application and the delivery pipeline, responds to change, and produces evidence —
              continuously, transparently, under approval rules.
            </>
          }
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="rounded-md border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)] px-5 py-4 text-lg font-medium text-[var(--color-text)]">
              Continuously improving, human-governed quality automation.
            </p>
            <p className="mt-6 text-[var(--color-text-muted)]">
              When requirements change, code ships, or tests fail, the agent reacts. It analyzes
              impact, reviews updated stories, identifies coverage gaps, generates candidate
              scenarios, runs impacted suites, captures evidence, updates reports, and records
              lessons learned. Automatic observation, automatic analysis, automatic reporting.
              Human-approved implementation.
            </p>
            <ol
              aria-label="Continuous quality agent loop"
              className="mt-8 flex flex-wrap items-stretch gap-x-2 gap-y-3"
            >
              {continuousFlow.map((step, i) => (
                <Fragment key={step}>
                  <li className="min-w-[140px] flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-xs text-[var(--color-text)]">
                    {step}
                  </li>
                  {i < continuousFlow.length - 1 ? (
                    <li
                      aria-hidden="true"
                      className="hidden items-center text-[var(--color-accent)] sm:flex"
                    >
                      <Chevron />
                    </li>
                  ) : null}
                </Fragment>
              ))}
            </ol>
            <p className="mt-8 text-[var(--color-text-muted)]">
              The same loop runs on pull requests, pushes, nightly schedules, release candidates,
              and manual dispatches. Read-only analysis happens automatically. Report updates happen
              automatically. Test execution happens automatically in safe environments. Generated
              changes arrive as pull requests. Core methodology improvements are proposed, reviewed,
              and promoted deliberately.
            </p>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Sample PR comment · continuous-agent output
            </p>
            <Terminal label="PR #428 · test-commander comment">{samplePrComment}</Terminal>
            <p className="mt-4 text-sm text-[var(--color-text-subtle)]">
              The agent says what it changed, what it analyzed, what it found, and what a human
              should look at next. No surprises, no silent edits.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
         CTA — direct, no form.
         ============================================================ */}
      <section
        aria-labelledby="cta-heading"
        className="mt-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-8 py-12 sm:px-12"
      >
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
          What&rsquo;s next
        </p>
        <h2
          id="cta-heading"
          className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
        >
          Hiring for AI-augmented QA, or building it yourself?
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
          Test Commander is part of an ongoing body of work in AI-augmented software quality,
          Playwright automation, and human-guided agentic testing. If you are hiring — or your team
          is exploring practical AI-assisted testing — I would like to talk.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)] transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Contact me
            </Link>
          </li>
          <li>
            <a
              href={site.social.linkedin}
              rel="me noopener"
              className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              Connect on LinkedIn
            </a>
          </li>
          <li>
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              Browse other projects
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
