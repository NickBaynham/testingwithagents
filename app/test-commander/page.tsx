import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd, type JsonLdObject } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

const description =
  "Test Commander is a Claude Code plugin plus a small Python runtime that turns a project's requirements, source, specs, recorded API traffic, and exploratory recordings into one committed workspace of structured quality artifacts. Phases 0 through 4 are shipped: workspace orchestration, requirements quality review, project knowledge ingestion, and charter-based exploratory testing. Twelve /tc:* commands across four skills.";

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
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Terminal output: ${label}`}
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text)] focus:outline focus:outline-2 focus:outline-[var(--color-accent)]"
      >
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

const heroCommands = `$ ./bootstrap.sh && make install
$ /tc:init
$ /tc:review-requirements
$ /tc:learn-from-docs
$ /tc:create-charter --target "Sign-in flow"
$ /tc:explore --charter CH-001
$ /tc:session-summary --session SESS-20260528-600
$ /tc:test-ideas --session SESS-20260528-600`;

const workflowSteps: readonly {
  label: string;
  hint: string;
  status: "shipped" | "in-development" | "planned";
  body: ReactNode;
}[] = [
  {
    label: "Explore",
    hint: "Charter-based sessions with structured anomaly capture.",
    status: "shipped",
    body: (
      <>
        Phase 4 (shipped 2026-05-28). <code>/tc:create-charter</code> scopes a session against the
        project knowledge; <code>/tc:explore</code> classifies every recorded Playwright event into
        six universal observation types and six universal anomaly categories with a Charter-Coverage
        matrix; an internal exploration-review sub-mode routes gap signals to{" "}
        <code>requirements/open-questions.md</code>.
      </>
    ),
  },
  {
    label: "Model",
    hint: "Ingest documents, specs, code, recordings, tests.",
    status: "shipped",
    body: (
      <>
        Phase 3 (shipped 2026-05-27). Five <code>/tc:learn-from-*</code> commands extract entities,
        terms, journeys, endpoints, modules, recorded responses, and test coverage into ten
        structured product-knowledge artifacts under <code>.test-commander/product-knowledge/</code>{" "}
        with full <code>path:line</code> provenance. A shared synthesizer rebuilds{" "}
        <code>system-model.md</code> byte-deterministically at the end of every run.
      </>
    ),
  },
  {
    label: "Specify",
    hint: "Reviewed requirements; BDD generation next.",
    status: "in-development",
    body: (
      <>
        Phase 2 (shipped 2026-05-27) ships the requirements layer:{" "}
        <code>/tc:review-requirements</code>, <code>/tc:review-user-stories</code>,{" "}
        <code>/tc:review-acceptance-criteria</code>, plus <code>/tc:requirements-to-tests</code> for
        seeded <code>tc-test-idea/v1</code> files Phase 4 enriches with session-derived candidates.
        Phase 5 (BDD generation + traceability) is the next milestone.
      </>
    ),
  },
  {
    label: "Automate",
    hint: "Playwright framework lazily scaffolded.",
    status: "planned",
    body: (
      <>
        Phase 6. <code>/tc:build-framework</code> will lazily scaffold a Playwright + TypeScript
        framework; <code>/tc:automation-plan</code> and <code>/tc:automate</code> will score
        automation candidates against the enriched test-ideas, generate page objects + fixtures, and
        keep test data in <code>.test-commander/test-data/</code> rather than inline in code.
        Approved BDD scenarios become deterministic Playwright tests.
      </>
    ),
  },
  {
    label: "Execute",
    hint: "Local + CI runs with evidence captured per run.",
    status: "planned",
    body: (
      <>
        Phase 7. <code>/tc:run</code> orchestrates suite execution; per-run records land in{" "}
        <code>.test-commander/runs/</code>; screenshots, traces, and logs route to{" "}
        <code>.test-commander/evidence/</code> with the policy defined in <code>config.yaml</code>.
        The same workflow runs locally and in CI.
      </>
    ),
  },
  {
    label: "Report",
    hint: "Quality report with history; release-readiness scoring.",
    status: "planned",
    body: (
      <>
        Phase 7. <code>/tc:report</code> writes{" "}
        <code>.test-commander/quality-report/current-quality-report.md</code> and snapshots a copy
        to <code>history/YYYY-MM-DD-HHmm.md</code>. <code>/tc:quality-gate</code> evaluates
        release-readiness against project-defined thresholds. Facts, interpretation, and
        human-review items stay clearly separated.
      </>
    ),
  },
  {
    label: "Improve",
    hint: "Governed lessons; nothing promoted silently.",
    status: "planned",
    body: (
      <>
        Phase 8. <code>/tc:learn</code>, <code>/tc:learn-from-failures</code>,{" "}
        <code>/tc:learn-from-exploration</code>, <code>/tc:review-lessons</code>, and{" "}
        <code>/tc:promote-lessons</code> turn the workspace into a learning loop. Every promotion is
        visible in <code>git diff</code> — Test Commander never silently rewrites methodology.
      </>
    ),
  },
];

const phaseIIncludes = [
  "Phase 0 — Repository foundation, plugin scaffold, marketplace registration",
  "Phase 1 — Workspace and artifact model (/tc:init, /tc:status, /tc:journal, /tc:next)",
  "Phase 2 — Requirements quality (16-dimension rubric, INVEST review, acceptance-criteria review, coverage map, seeded test-ideas)",
  "Phase 3 — Project knowledge ingestion (five /tc:learn-from-* helpers, shared synthesizer, ten product-knowledge artifacts)",
  "Phase 4 — Charter-based exploratory testing (charters, recorded-session replay, session summaries, Phase-2 seed enrichment)",
  "All commands idempotent and byte-deterministic; workspace committed to git",
];

const phaseIDefers = [
  "Phase 5 — BDD generation and traceability maps (in development; starts next)",
  "Phase 6 — Lazy Playwright framework + strategic automation",
  "Phase 7 — Execution, evidence policy, quality report with history",
  "Phase 8 — Governed continuous learning loop",
  "Phase 9 — Mermaid diagrams + infographics",
  "Phases 10 through 13 — Web console, runtime MCP, sandboxes, continuous agent",
];

const makeCommands: readonly { command: string; purpose: string }[] = [
  {
    command: "./bootstrap.sh",
    purpose: "Verify prereqs (Python 3.12, PDM, Docker, git, make); auto-install the safe ones.",
  },
  {
    command: "make install",
    purpose:
      "Validate plugin manifests, register the local Claude Code marketplace, install the test-commander plugin, verify the four shipped skills.",
  },
  {
    command: "/tc:init",
    purpose:
      "Inside a consuming project, copy the 63-file workspace template into .test-commander/. Idempotent — existing files are preserved.",
  },
  {
    command: "/tc:status",
    purpose:
      "Print a snapshot: per-bucket file counts, populated counts (bytes differ from template), per-phase status. Read-only.",
  },
  {
    command: "/tc:journal append",
    purpose:
      "Append a timestamped narrative entry to today's journal/YYYY-MM-DD.md. Append-only; never edited in place.",
  },
  {
    command: "/tc:next",
    purpose: "Read the workspace state and recommend the next /tc:* command for this project.",
  },
  {
    command: "/tc:review-requirements",
    purpose:
      "Run the 16-dimension rubric on uploaded requirements.md; emit requirements-review.md plus [<kind>] open-questions.",
  },
];

const shippedSkills: readonly {
  skill: string;
  phase: string;
  pitch: string;
  commands: readonly string[];
}[] = [
  {
    skill: "tc-core",
    phase: "Phase 1",
    pitch: "Workspace orchestration. Initialize, inspect, journal, recommend.",
    commands: ["/tc:init", "/tc:status", "/tc:journal", "/tc:next"],
  },
  {
    skill: "tc-requirements",
    phase: "Phase 2",
    pitch:
      "Requirements quality. 16-dimension rubric, INVEST review, AC review, coverage, seed test-ideas.",
    commands: [
      "/tc:review-requirements",
      "/tc:review-user-stories",
      "/tc:review-acceptance-criteria",
      "/tc:requirements-coverage",
      "/tc:requirements-to-tests",
    ],
  },
  {
    skill: "tc-knowledge",
    phase: "Phase 3",
    pitch:
      "Project knowledge ingestion. Five helpers extract structured artifacts from documents, specs, code, recorded API traffic, and existing tests.",
    commands: [
      "/tc:learn-from-docs",
      "/tc:learn-from-specs",
      "/tc:learn-from-code",
      "/tc:learn-from-api",
      "/tc:learn-from-tests",
    ],
  },
  {
    skill: "tc-explore",
    phase: "Phase 4",
    pitch:
      "Charter-based exploratory testing. Scope a session, replay a recorded Playwright run, synthesize the summary, enrich the Phase-2 test-idea seeds.",
    commands: ["/tc:create-charter", "/tc:explore", "/tc:session-summary", "/tc:test-ideas"],
  },
];

const walkthroughs: readonly { phase: string; title: string; href: string; body: string }[] = [
  {
    phase: "Phase 1",
    title: "First workflow walkthrough",
    href: "https://github.com/NickBaynham/test-commander/blob/main/docs/user-guide/workflow.md",
    body: "From clone to /tc:next: init the workspace, edit project metadata, append a journal entry, ask what to do next.",
  },
  {
    phase: "Phase 2",
    title: "Reviewing requirements",
    href: "https://github.com/NickBaynham/test-commander/blob/main/docs/user-guide/reviewing-requirements.md",
    body: "Upload requirements.md, run the rubric pass, surface mutually-exclusive open questions, seed tc-test-idea/v1 files for every REQ.",
  },
  {
    phase: "Phase 3",
    title: "Building project knowledge",
    href: "https://github.com/NickBaynham/test-commander/blob/main/docs/user-guide/building-project-knowledge.md",
    body: "Drive five /tc:learn-from-* helpers against the seeded sample-project fixture; produce ten product-knowledge artifacts with file:line provenance.",
  },
  {
    phase: "Phase 4",
    title: "Exploring an app",
    href: "https://github.com/NickBaynham/test-commander/blob/main/docs/user-guide/exploring-an-app.md",
    body: "Charter -> explore -> session-summary -> test-ideas: scope an exploration, classify every recorded event into universal observation and anomaly cores, enrich the Phase-2 seeds.",
  },
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
    title: "Universal cores, project-specific tuning",
    body: "Per Decision D19, every shipped detector uses universal English and software-engineering vocabulary only. Domain awareness enters additively through <workspace>/config.yaml — extensions union with the universal core; you cannot remove a default. The same rubric runs against a banking app, a hospital system, or an internal dashboard.",
  },
  {
    title: "file:line provenance for every claim",
    body: "Every entity, business rule, endpoint, anomaly, candidate scenario, or open question Test Commander surfaces is paired with the path:line where it came from. The structured artifacts are indexes, not summaries. You can always answer 'where did this come from' without leaving the workspace.",
  },
  {
    title: "Byte-deterministic re-runs",
    body: "Every shipped helper is idempotent. Re-running against unchanged input produces byte-identical bytes. The workspace is safe to commit to git like any other source artifact — reviews show up as real diffs; nothing flickers on re-run.",
  },
  {
    title: "Exploration before automation",
    body: "Automation starts from understanding. Identify what matters first, then encode it.",
  },
  {
    title: "BDD as the bridge (Phase 5, in development)",
    body: "Readable specs connect manual testers, automation engineers, and product stakeholders. The tc-test-idea/v1 schema Phase 2 authors and Phase 4 enriches is the input contract Phase 5 will read.",
  },
  {
    title: "Deterministic tests for CI/CD (Phase 6+)",
    body: "AI may help generate tests, but CI/CD needs reliable checks. Playwright stays the source of truth once Phase 6 lays the framework down.",
  },
  {
    title: "Separate facts from interpretation",
    body: "Reports distinguish observed, tested, passed, failed, inferred, and items needing human review. Phase 7's quality report enforces this separation.",
  },
];

type RoadmapStatus = "shipped" | "in-development" | "planned";

const roadmap: readonly {
  phase: string;
  title: string;
  body: string;
  status: RoadmapStatus;
  current?: boolean;
}[] = [
  {
    phase: "Phase 0",
    title: "Repo foundation",
    body: "Bootstrap script, plugin manifest, marketplace registration, skill verifier, link checker, CI scaffold.",
    status: "shipped",
  },
  {
    phase: "Phase 1",
    title: "Workspace + artifact model",
    body: "tc-core: /tc:init, /tc:status, /tc:journal, /tc:next. 63-file workspace template; per-phase recommendation engine.",
    status: "shipped",
  },
  {
    phase: "Phase 2",
    title: "Requirements + user-story intelligence",
    body: "tc-requirements: 16-dimension rubric, INVEST review, AC review, coverage map, tc-test-idea/v1 seeds.",
    status: "shipped",
  },
  {
    phase: "Phase 3",
    title: "Project knowledge ingestion",
    body: "tc-knowledge: five /tc:learn-from-* helpers (docs, specs, code, api, tests) + shared synthesizer; ten product-knowledge artifacts with file:line provenance.",
    status: "shipped",
  },
  {
    phase: "Phase 4",
    title: "Exploratory testing",
    body: "tc-explore: /tc:create-charter, /tc:explore + internal review sub-mode, /tc:session-summary, /tc:test-ideas enriching Phase-2 seeds.",
    status: "shipped",
    current: true,
  },
  {
    phase: "Phase 5",
    title: "BDD generation + traceability",
    body: "tc-bdd + tc-traceability: /tc:generate-bdd, /tc:review-bdd, /tc:traceability-map. Reads enriched test-ideas; emits Gherkin features tied to REQ-IDs.",
    status: "in-development",
  },
  {
    phase: "Phase 6",
    title: "Playwright framework + automation candidates",
    body: "tc-build-framework, tc-automation-plan, tc-automate, tc-test-data: lazy Playwright + TypeScript scaffolding, automation candidate scoring, declarative test data. The strategic-automation adoption stage below names how teams roll this out.",
    status: "planned",
  },
  {
    phase: "Phase 7",
    title: "Execution + evidence + quality report",
    body: "tc-run + tc-quality-report + tc-evidence: /tc:run, /tc:analyze-results, /tc:report, /tc:quality-gate. Per-run records; committed quality-report history.",
    status: "planned",
  },
  {
    phase: "Phase 8",
    title: "Continuous learning",
    body: "tc-learning: governed lessons inbox; /tc:learn-from-failures, /tc:learn-from-exploration, /tc:review-lessons, /tc:promote-lessons. Nothing promoted silently.",
    status: "planned",
  },
  {
    phase: "Phase 9",
    title: "Visual documentation",
    body: "tc-visualize: Mermaid sources + rendered SVG/PNG, infographics for the quality report.",
    status: "planned",
  },
  {
    phase: "Phase 10",
    title: "Web console MVP",
    body: "tc-web: team-facing dashboard + journal + BDD viewer + run history + evidence gallery + risk register. The same workspace, multi-user.",
    status: "planned",
  },
  {
    phase: "Phase 11",
    title: "Runtime API + MCP server",
    body: "tc-mcp: serve the workspace + commands over an MCP endpoint so other agents and tools can drive Test Commander programmatically.",
    status: "planned",
  },
  {
    phase: "Phase 12",
    title: "Sandboxed testing environment",
    body: "tc-sandbox: on-demand workspaces per PR; no-local-install testing surface; ephemeral artifact storage.",
    status: "planned",
  },
  {
    phase: "Phase 13",
    title: "Continuous quality agent",
    body: "tc-continuous-quality: governed autonomy modes; watch code + requirements + pipelines; open PRs with proposed test updates.",
    status: "planned",
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
            Flagship project · Phases 0-4 shipped · Phase 5 next
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
         SHIPPED SKILLS — four skills, twelve commands. Each card lists
         the commands the skill owns.
         ============================================================ */}
      <section aria-labelledby="skills-heading" className="mt-24">
        <SectionHeader
          number="05b"
          eyebrow="What ships now"
          title="Four skills, twelve commands, one workspace per project."
          intro={
            <>
              Each <code>tc-*</code> skill is owned in-repo (Decision D1 — no community-skill
              dependencies). The commands route to bundled Python helpers; the workspace lives at{" "}
              <code>.test-commander/</code> inside the consuming project and is committed to git
              like any other source artifact.
            </>
          }
        />
        <ol className="mt-10 grid gap-6 lg:grid-cols-2">
          {shippedSkills.map((sk) => (
            <li
              key={sk.skill}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-base font-semibold text-[var(--color-text)]">
                  {sk.skill}
                </h3>
                <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-fg)]">
                  {sk.phase} · shipped
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{sk.pitch}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {sk.commands.map((cmd) => (
                  <li
                    key={cmd}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 font-mono text-xs text-[var(--color-text)]"
                  >
                    {cmd}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================================================
         USER-GUIDE WALKTHROUGHS — four documentation links, one per
         shipped phase. Each walks the seeded fixture end to end with
         reproducible terminal output.
         ============================================================ */}
      <section aria-labelledby="walkthroughs-heading" className="mt-24">
        <SectionHeader
          number="05c"
          eyebrow="User-guide walkthroughs"
          title="One reproducible walkthrough per shipped phase."
          intro={
            <>
              Every shipped phase ships its own end-to-end walkthrough under{" "}
              <code>docs/user-guide/</code> in the test-commander repo. Each one drives the seeded
              fixture end to end with verbatim sample output so a reader can reproduce the result in
              a tmp workspace.
            </>
          }
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {walkthroughs.map((w) => (
            <li
              key={w.title}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                {w.phase}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                <a
                  href={w.href}
                  rel="noopener"
                  className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
                >
                  {w.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{w.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-[var(--color-text-muted)]">
          For a single hands-on tour that walks all four shipped phases against one tmp project,
          read the blog post{" "}
          <Link
            href="/blog/test-commander-after-phase-4-hands-on-tour/"
            className="font-medium text-[var(--color-text)] underline decoration-[var(--color-accent)] underline-offset-2 hover:text-[var(--color-accent)]"
          >
            Test Commander after Phase 4: a hands-on tour
          </Link>
          .
        </p>
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
              Charter · YAML frontmatter (Phase 4 · shipped)
            </p>
            <Terminal label=".test-commander/charters/CH-001.md">
              {`---
id: CH-001
mission: Discover whether the Sign-in flow plus workspace-detail asset upload
  behaves correctly under the documented risk conditions.
target: Sign-in flow plus workspace-detail asset upload (POST /workspaces/{id}/assets).
time-box: 60min
risk-areas:
  - Authentication / authorization boundaries
  - Session lifecycle and token leakage
  - Performance under documented load thresholds
acceptance-criteria:
  - Every flow under '...' completes the happy path with documented status codes.
  - Authentication is correctly enforced for every endpoint that should require it.
  - At least one anomaly per universal category is documented or explained away.
created_at: 2026-05-28T18:47:33Z
phase_3_sources:
  - product-knowledge/entities.md
  - product-knowledge/user-journeys.md
  - requirements/open-questions.md
---`}
            </Terminal>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Exploration note · table excerpt (Phase 4 · shipped)
            </p>
            <Terminal label=".test-commander/exploration-notes/SESS-20260528-600.md">
              {`# SESS-20260528-600 - exploration note for CH-001

## Observations

| # | event_type      | Page             | Result |
| - | --------------- | ---------------- | ------ |
| 0 | page_load       | /sign-in         | ok     |
| 4 | click           | /sign-in         |        |
| 5 | network_request | /sign-in         | 201    |
| 8 | network_request | /dashboard       | 200    |

## Anomalies

| Category         | Severity | Page             | Evidence |
| ---------------- | -------- | ---------------- | -------- |
| auth-mismatch    | high     | /workspaces/ws-1 | S-005    |
| broken-link      | medium   | /account/profile | S-004    |
| slow-response    | high     | /dashboard       | S-002    |`}
            </Terminal>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              Enriched test-idea · Phase-2 seed + Phase-4 enrichment
            </p>
            <Terminal label=".test-commander/test-ideas/REQ-005.md">
              {`---
schema: tc-test-idea/v1
requirement_id: REQ-005
requirement_title: All API access requires an authenticated user account
status: enriched              # was: status: seed (Phase 2)
phase_4_sessions: [SESS-20260528-600]
phase_2_findings: [completeness, consistency, testability]
candidates:                   # Phase 2 seeded; preserved byte-for-byte
  - id: REQ-005-happy-01
    title: Happy path
    type: positive
generated_by: /tc:requirements-to-tests
---

## Phase 4 enrichment

### SESS-20260528-600

- **CS-600-001** (negative) - Reproduce auth-mismatch on /workspaces/ws-1
- **CS-600-010** (happy)    - Happy path: POST /sessions returns 201`}
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
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((stage) => {
            const isShipped = stage.status === "shipped";
            const isInDev = stage.status === "in-development";
            const ringClass = stage.current
              ? "border-[var(--color-accent)] shadow-sm"
              : isShipped
                ? "border-[var(--color-border)]"
                : isInDev
                  ? "border-[var(--color-accent)] border-dashed"
                  : "border-[var(--color-border)] bg-[var(--color-surface-muted)]";
            const pillLabel = isShipped ? "Shipped" : isInDev ? "In development" : "Planned";
            const pillClass = isShipped
              ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
              : isInDev
                ? "bg-[var(--color-surface-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]"
                : "bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)] border border-[var(--color-border)]";
            return (
              <li
                key={stage.phase}
                className={`rounded-lg border bg-[var(--color-surface)] p-5 ${ringClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {stage.phase}
                    {stage.current ? <span className="ml-2 normal-case">· Current</span> : null}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${pillClass}`}
                  >
                    {pillLabel}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{stage.body}</p>
              </li>
            );
          })}
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
