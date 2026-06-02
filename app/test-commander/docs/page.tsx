import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd, type JsonLdObject } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

const REPO = "https://github.com/NickBaynham/test-commander";

const description =
  "End-user documentation for Test Commander: install, the workflow order, the committed .test-commander/ workspace, a full reference of all 64 /tc:* commands across 20 skills, the governed execution pipeline, the five autonomy modes, and how to customize it for your project. Test Commander is a Claude Code plugin plus a small Python runtime; the full roadmap (Phases 0–13) is shipped.";

export const metadata: Metadata = {
  title: "Test Commander — Documentation",
  description,
  alternates: { canonical: "/test-commander/docs" },
  openGraph: {
    type: "article",
    title: `Test Commander Documentation — ${site.name}`,
    description,
    url: `${site.url}/test-commander/docs`,
    images: [{ url: "/og/test-commander.png", width: 1200, height: 630, alt: "Test Commander" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Test Commander Documentation — ${site.name}`,
    description,
    images: ["/og/test-commander.png"],
  },
};

const techArticle: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Test Commander documentation",
  description,
  author: { "@type": "Person", name: site.name, url: site.url },
  url: `${site.url}/test-commander/docs`,
  about: "AI-assisted software testing, quality engineering, Playwright automation",
};

/* ---------- inline layout primitives (kept self-contained, matching /test-commander) ---------- */

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

function Terminal({ label, children }: { label: string; children: ReactNode }) {
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
        aria-label={`Terminal: ${label}`}
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text)] focus:outline focus:outline-2 focus:outline-[var(--color-accent)]"
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

/* ---------- content models ---------- */

const installSteps = `# 1. Clone and provision the environment (Python 3.12, PDM, Docker, git, make).
$ git clone https://github.com/NickBaynham/test-commander
$ cd test-commander
$ ./bootstrap.sh          # verify prerequisites; auto-install the safe ones
$ make install            # validate manifests, register the local marketplace,
                          # install the plugin, verify the 20 skills

# 2. Inside YOUR project, initialize the workspace.
$ cd ~/projects/your-app
$ /tc:init                # copy the workspace template into .test-commander/
$ /tc:status              # read-only snapshot of the workspace + per-phase status
$ /tc:next                # ask what to do next for this project`;

const workflowOrder = `/tc:init                    # 1.  workspace
/tc:review-requirements     # 2.  requirements quality
/tc:learn-from-docs ...     # 3.  project knowledge ingestion
/tc:create-charter          # 4.  scope an exploratory session
/tc:explore                 #     explore + classify
/tc:test-ideas              #     enrich the seeds
/tc:generate-bdd            # 5.  BDD + traceability
/tc:automation-plan         # 6.  score, then generate
/tc:automate                #     the Playwright suite
/tc:run                     # 7.  execute + collect evidence
/tc:report                  #     publish the quality report
/tc:learn                   # 8.  governed learning loop
/tc:visualize               # 9.  diagrams + infographics
/tc:web-start               # 10. read-only web console
# 10.5 governance · 11 API+MCP · 12 sandboxes · 13 continuous quality`;

const workspaceTree = `your-app/
└── .test-commander/            # committed to git like any other source
    ├── project.md              # project metadata
    ├── config.yaml             # YOUR domain extensions (D19)
    ├── journal/                # append-only narrative log
    ├── documents/uploaded/     # your requirements + docs (input)
    ├── requirements/           # reviews + open questions
    ├── product-knowledge/      # ingested entities, journeys, rules, impact map
    ├── charters/ · sessions/   # exploratory testing
    ├── exploration-notes/
    ├── test-ideas/             # tc-test-idea/v1 seeds, enriched
    ├── bdd/features/           # Gherkin with @req:/@cs: linkage
    ├── traceability/           # requirement + scenario maps, coverage
    ├── test-data/              # seed JSON, never inlined in test code (D6)
    ├── runs/ · evidence/       # execution records + screenshots/traces
    ├── quality-report/         # current report + committed history
    ├── lessons/                # governed learning inbox
    ├── visuals/                # Mermaid sources + rendered assets
    ├── policy/ · audit/        # governance: permissions, approvals, audit log
    ├── sandbox/                # sandbox config + state
    └── continuous/             # autonomy config + analysis artifacts`;

type CommandRef = {
  name: string;
  purpose: string;
};

type SkillRef = {
  skill: string;
  phase: string;
  runtime?: boolean;
  blurb: string;
  commands: readonly CommandRef[];
};

const reference: readonly SkillRef[] = [
  {
    skill: "tc-core",
    phase: "Phase 1",
    blurb: "Workspace orchestration: initialize, inspect, journal, and recommend.",
    commands: [
      {
        name: "/tc:init",
        purpose:
          "Copy the workspace template into .test-commander/. Idempotent — existing files preserved.",
      },
      {
        name: "/tc:status",
        purpose:
          "Print a read-only snapshot: per-bucket file counts, populated counts, per-phase status.",
      },
      {
        name: "/tc:journal",
        purpose: "Append a timestamped narrative entry to today's journal. Append-only.",
      },
      {
        name: "/tc:next",
        purpose: "Read the workspace state and recommend the next /tc:* command for this project.",
      },
    ],
  },
  {
    skill: "tc-requirements",
    phase: "Phase 2",
    blurb:
      "Requirements quality: rubric review, INVEST, acceptance criteria, coverage, and test-idea seeds.",
    commands: [
      {
        name: "/tc:review-requirements",
        purpose:
          "Run the 16-dimension rubric on uploaded requirements; emit a review plus open questions.",
      },
      {
        name: "/tc:review-user-stories",
        purpose:
          "INVEST review of user stories: independent, negotiable, valuable, estimable, small, testable.",
      },
      {
        name: "/tc:review-acceptance-criteria",
        purpose: "Review acceptance criteria for testability, completeness, and clarity.",
      },
      {
        name: "/tc:requirements-coverage",
        purpose: "Build the requirement coverage map across the workspace.",
      },
      {
        name: "/tc:requirements-to-tests",
        purpose: "Seed a tc-test-idea/v1 file for every requirement (skip-not-overwrite).",
      },
    ],
  },
  {
    skill: "tc-knowledge",
    phase: "Phase 3",
    blurb:
      "Project knowledge ingestion: five helpers extract structured artifacts with file:line provenance.",
    commands: [
      {
        name: "/tc:learn-from-docs",
        purpose: "Extract entities, terms, and user journeys from uploaded documents.",
      },
      {
        name: "/tc:learn-from-specs",
        purpose: "Extract endpoints and contracts from API specifications.",
      },
      {
        name: "/tc:learn-from-code",
        purpose: "Extract modules and business rules from source, each with path:line provenance.",
      },
      { name: "/tc:learn-from-api", purpose: "Extract behavior from recorded API traffic." },
      {
        name: "/tc:learn-from-tests",
        purpose: "Extract existing coverage from the project's current tests.",
      },
    ],
  },
  {
    skill: "tc-explore",
    phase: "Phase 4",
    blurb: "Charter-based exploratory testing against a recorded Playwright session.",
    commands: [
      {
        name: "/tc:create-charter",
        purpose: "Scope an exploratory session against the project knowledge and risk areas.",
      },
      {
        name: "/tc:explore",
        purpose:
          "Classify each recorded event into six universal observation types and six anomaly categories.",
      },
      {
        name: "/tc:session-summary",
        purpose: "Synthesize the exploration session summary with a charter-coverage matrix.",
      },
      {
        name: "/tc:test-ideas",
        purpose: "Enrich the Phase-2 test-idea seeds with the exploration findings.",
      },
    ],
  },
  {
    skill: "tc-bdd",
    phase: "Phase 5",
    blurb: "BDD generation and review with machine-readable traceability tags.",
    commands: [
      {
        name: "/tc:generate-bdd",
        purpose: "Render one Gherkin scenario per enrichment candidate with @req:/@cs: provenance.",
      },
      { name: "/tc:review-bdd", purpose: "Run a six-category universal BDD quality rubric." },
    ],
  },
  {
    skill: "tc-traceability",
    phase: "Phase 5",
    blurb: "The cross-cutting map tying requirements to the scenarios that exercise them.",
    commands: [
      {
        name: "/tc:traceability-map",
        purpose: "Rebuild the requirement and scenario-level traceability chains.",
      },
    ],
  },
  {
    skill: "tc-build-framework",
    phase: "Phase 6",
    blurb: "The lazily-scaffolded Playwright + TypeScript framework.",
    commands: [
      {
        name: "/tc:build-framework",
        purpose:
          "Scaffold the project-root tests/ tree, playwright.config.ts, and package.json only when first needed (D8).",
      },
    ],
  },
  {
    skill: "tc-automation-plan",
    phase: "Phase 6",
    blurb: "The strategic gate before any code is generated.",
    commands: [
      {
        name: "/tc:automation-plan",
        purpose:
          "Score every scenario against a seven-factor suitability rubric: automate / consider / manual.",
      },
    ],
  },
  {
    skill: "tc-automate",
    phase: "Phase 6",
    blurb: "Generate and mechanically review the automation.",
    commands: [
      {
        name: "/tc:automate",
        purpose:
          "Generate page objects, fixtures, and specs with @req:/@cs: provenance and fixture-mediated data.",
      },
      {
        name: "/tc:review-automation",
        purpose: "Mechanically review the generated suite for quality and framework compliance.",
      },
    ],
  },
  {
    skill: "tc-test-data",
    phase: "Phase 6",
    blurb: "The data discipline (D6): nothing inlined in test code.",
    commands: [
      {
        name: "/tc:generate-test-data",
        purpose: "Populate test-data/ seed JSON and a per-area spec consumed via fixtures.",
      },
    ],
  },
  {
    skill: "tc-run",
    phase: "Phase 7",
    blurb: "Execution and failure triage.",
    commands: [
      {
        name: "/tc:run",
        purpose:
          "Orchestrate suite execution; capture per-run records and route evidence per config policy.",
      },
      {
        name: "/tc:analyze-results",
        purpose:
          "Classify failures by responsible layer without weakening assertions or adding sleeps.",
      },
    ],
  },
  {
    skill: "tc-quality-report",
    phase: "Phase 7",
    blurb: "The quality report and release-readiness gate.",
    commands: [
      {
        name: "/tc:report",
        purpose: "Write the current quality report and snapshot a copy to committed history.",
      },
      {
        name: "/tc:quality-gate",
        purpose:
          "Evaluate release-readiness against project-defined thresholds; separate facts from interpretation.",
      },
    ],
  },
  {
    skill: "tc-evidence",
    phase: "Phase 7",
    runtime: true,
    blurb:
      "Runtime, not commands: the evidence indexer that routes screenshots, traces, and logs into evidence/ per the config policy.",
    commands: [],
  },
  {
    skill: "tc-learning",
    phase: "Phase 8",
    blurb: "The governed learning loop — nothing promoted silently.",
    commands: [
      { name: "/tc:learn", purpose: "Open and seed the governed lessons inbox." },
      { name: "/tc:learn-from-failures", purpose: "Derive candidate lessons from test failures." },
      {
        name: "/tc:learn-from-exploration",
        purpose: "Derive candidate lessons from exploration sessions.",
      },
      { name: "/tc:learn-from-feedback", purpose: "Derive candidate lessons from human feedback." },
      {
        name: "/tc:review-lessons",
        purpose: "Review candidate lessons: accept, reject, or flag for human review.",
      },
      {
        name: "/tc:promote-lessons",
        purpose:
          "Promote accepted lessons into project guidance — every promotion visible in git diff.",
      },
    ],
  },
  {
    skill: "tc-visualize",
    phase: "Phase 9",
    blurb: "Visual documentation: eight diagram types, infographics, and a deterministic renderer.",
    commands: [
      { name: "/tc:visualize", purpose: "Generate the workspace's full diagram set." },
      { name: "/tc:diagram-architecture", purpose: "Architecture diagram (Mermaid source)." },
      { name: "/tc:diagram-coverage", purpose: "Coverage diagram." },
      { name: "/tc:diagram-flow", purpose: "User-flow diagram." },
      { name: "/tc:diagram-risk", purpose: "Risk diagram." },
      { name: "/tc:diagram-sequence", purpose: "Sequence diagram." },
      { name: "/tc:diagram-state", purpose: "State diagram." },
      { name: "/tc:diagram-test-strategy", purpose: "Test-strategy diagram." },
      { name: "/tc:diagram-traceability", purpose: "Traceability diagram." },
      { name: "/tc:generate-infographic", purpose: "Build a quality-report infographic." },
      {
        name: "/tc:render-visuals",
        purpose:
          "Render Mermaid sources to SVG/PNG deterministically (degrades gracefully without the CLI).",
      },
    ],
  },
  {
    skill: "tc-web",
    phase: "Phase 10",
    blurb: "The read-only web console over the committed workspace.",
    commands: [
      {
        name: "/tc:web-init",
        purpose:
          "Provision the console config (.web/console.json) inside the workspace. Idempotent.",
      },
      {
        name: "/tc:web-start",
        purpose: "Bring up the console stack (Next.js + FastAPI) on docker compose. Read-only.",
      },
      {
        name: "/tc:web-sync",
        purpose: "Reconcile the SQLite index with the workspace (a clean rebuild).",
      },
      {
        name: "/tc:web-index-artifacts",
        purpose: "Rebuild the index from the workspace into .web/index.db.",
      },
      {
        name: "/tc:web-export",
        purpose: "Export the console view as a deterministic static bundle.",
      },
    ],
  },
  {
    skill: "tc-governance",
    phase: "Phase 10.5",
    runtime: true,
    blurb:
      "Runtime, not commands: the controlled-execution pipeline behind the console's /api/execute — intent → plan → permission policy → approval gate → bounded execution → output validation → audit. Default deny; no backdoor.",
    commands: [],
  },
  {
    skill: "tc-mcp",
    phase: "Phase 11",
    runtime: true,
    blurb:
      "Runtime, not commands: an expanded Runtime API (apps/api) and a schema-first MCP server (apps/mcp). Both are alternative front-ends to the same governed pipeline; the seven permission levels are enforced server-side.",
    commands: [],
  },
  {
    skill: "tc-sandbox",
    phase: "Phase 12",
    blurb:
      "On-demand, team-accessible environments launched from GitHub Actions, governed and safe-by-default.",
    commands: [
      {
        name: "/tc:sandbox-init",
        purpose:
          "Write the sandbox config (provider, target, allow-list, private-range block). Skip-not-overwrite.",
      },
      {
        name: "/tc:sandbox-launch",
        purpose:
          "Launch the sandbox via its provider and persist state. Idempotent; dry-run by default.",
      },
      {
        name: "/tc:sandbox-status",
        purpose: "Report the persisted sandbox state (none / running / stopped).",
      },
      { name: "/tc:sandbox-sync", purpose: "Push the committed workspace into the sandbox." },
      { name: "/tc:sandbox-stop", purpose: "Tear the sandbox down. Idempotent." },
      {
        name: "/tc:sandbox-export",
        purpose: "Write a shareable bundle of endpoints, labels, and status.",
      },
    ],
  },
  {
    skill: "tc-continuous-quality",
    phase: "Phase 13",
    blurb:
      "The continuous quality agent: watch → analyze → propose → PR, gated by the autonomy mode.",
    commands: [
      {
        name: "/tc:watch-changes",
        purpose: "Detect changed files from a pull-request or push diff.",
      },
      {
        name: "/tc:impact-analysis",
        purpose:
          "Map changed files to impacted features and requirements (deterministic; never invents impact).",
      },
      {
        name: "/tc:coverage-gap-analysis",
        purpose: "Find impacted features that lack coverage (never invents coverage).",
      },
      {
        name: "/tc:propose-tests",
        purpose: "Propose BDD/automation for the gaps — safe-write; never opens a PR.",
      },
      {
        name: "/tc:create-test-pr",
        purpose: "Open a clearly-labeled PR through the pipeline; gated by the autonomy mode.",
      },
      {
        name: "/tc:continuous-quality-check",
        purpose: "Run the whole loop under the configured autonomy mode.",
      },
    ],
  },
];

const autonomyModes: readonly { mode: string; name: string; approves: string; pr: string }[] = [
  { mode: "0", name: "read-only-advisor", approves: "nothing (read-only)", pr: "no" },
  { mode: "1", name: "assisted-testing", approves: "safe-write", pr: "no" },
  { mode: "2", name: "approved-execution", approves: "+ execute-tests", pr: "no" },
  { mode: "3", name: "pull-request-automation", approves: "+ code-write", pr: "yes (labeled)" },
  { mode: "4", name: "governed-autonomy", approves: "+ external-network", pr: "yes (labeled)" },
];

const docLinks: readonly { title: string; href: string; body: string }[] = [
  {
    title: "Command reference",
    href: `${REPO}/blob/main/docs/command-reference.md`,
    body: "Every shipped command, indexed by phase, linking each per-command page.",
  },
  {
    title: "Workspace reference",
    href: `${REPO}/blob/main/docs/workspace-reference.md`,
    body: "Per-directory ownership inside .test-commander/.",
  },
  {
    title: "Customizing for your project",
    href: `${REPO}/blob/main/docs/user-guide/customizing-for-your-project.md`,
    body: "The D19 extension model: config.yaml, tag namespaces, autonomy + sandbox config.",
  },
  {
    title: "Autonomy levels",
    href: `${REPO}/blob/main/docs/autonomy-levels.md`,
    body: "The five continuous-quality modes and how the gate maps them to the pipeline.",
  },
  {
    title: "Governance guide",
    href: `${REPO}/blob/main/docs/user-guide/governance.md`,
    body: "The controlled-execution pipeline, end to end.",
  },
  {
    title: "Install guide",
    href: `${REPO}/blob/main/docs/install.md`,
    body: "Prerequisites and the full make install path across macOS, Linux, WSL2, Git Bash.",
  },
];

/* ---------- page ---------- */

export default function TestCommanderDocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <JsonLd
        items={[
          techArticle,
          breadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "Test Commander", path: "/test-commander" },
            { name: "Documentation", path: "/test-commander/docs" },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="pt-16 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
          <Link href="/test-commander" className="hover:text-[var(--color-accent-hover)]">
            Test Commander
          </Link>{" "}
          / Documentation · Phases 0–13 shipped
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
          End-user documentation
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--color-text-muted)]">
          Test Commander is a Claude Code plugin plus a small Python runtime. It turns a
          project&rsquo;s requirements, source, specs, recorded API traffic, and exploratory
          recordings into one committed workspace of structured quality artifacts — then runs that
          workspace from the terminal, a web console, an API, an MCP server, sandboxes, and a
          continuous agent. This page is the practical reference: install, the workflow order, the
          workspace, all{" "}
          <strong className="font-semibold text-[var(--color-text)]">64 commands</strong>,
          governance, and the autonomy modes.
        </p>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
          {[
            ["Getting started", "#getting-started"],
            ["The workspace", "#workspace"],
            ["Command reference", "#reference"],
            ["Governance", "#governance"],
            ["Autonomy", "#autonomy"],
            ["Customize", "#customize"],
            ["More docs", "#more"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {label}
            </a>
          ))}
        </nav>
      </section>

      {/* GETTING STARTED */}
      <section id="getting-started" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="01"
          eyebrow="Getting started"
          title="Install once, then init per project."
          intro={
            <>
              Test Commander supports macOS, Linux, WSL2, and Git Bash (Decision D13). You install
              the plugin once from its repo, then run <code>/tc:init</code> inside each project you
              want to test. The workspace lives at <code>.test-commander/</code> and is committed to
              git.
            </>
          }
        />
        <div className="mt-10">
          <Terminal label="install + initialize">{installSteps}</Terminal>
        </div>
        <div className="mt-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
            The workflow order — let <code>/tc:next</code> guide you, or follow the phases
          </p>
          <Terminal label="the workflow, phase by phase">{workflowOrder}</Terminal>
        </div>
      </section>

      {/* THE WORKSPACE */}
      <section id="workspace" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="02"
          eyebrow="The workspace"
          title="One committed directory is the source of truth."
          intro={
            <>
              Everything Test Commander produces lands under <code>.test-commander/</code> as plain
              Markdown, YAML, and JSON. Every helper is idempotent and byte-deterministic, so
              re-running against unchanged input produces identical bytes — the workspace reviews
              like any other source, in real <code>git diff</code>s.
            </>
          }
        />
        <div className="mt-10">
          <Terminal label=".test-commander/ — committed workspace layout">{workspaceTree}</Terminal>
        </div>
      </section>

      {/* COMMAND REFERENCE */}
      <section id="reference" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="03"
          eyebrow="Command reference"
          title="64 commands across 20 skills."
          intro={
            <>
              Each <code>tc-*</code> skill owns a set of <code>/tc:*</code> commands (Decision D1 —
              every skill is vendored in-repo). Three skills — <code>tc-evidence</code>,{" "}
              <code>tc-governance</code>, and <code>tc-mcp</code> — ship runtime rather than
              commands. Commands are read-only or proposal-first by default; anything that mutates
              the workspace or runs code flows through the governed pipeline.
            </>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {reference.map((sk) => (
            <article
              key={sk.skill}
              className={
                "rounded-lg border bg-[var(--color-surface)] p-6 " +
                (sk.runtime ? "border-[var(--color-border)]" : "border-[var(--color-border)]")
              }
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-base font-semibold text-[var(--color-text)]">
                  {sk.skill}
                </h3>
                <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent-fg)]">
                  {sk.phase}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{sk.blurb}</p>
              {sk.commands.length > 0 ? (
                <dl className="mt-4 space-y-3">
                  {sk.commands.map((cmd) => (
                    <div key={cmd.name}>
                      <dt>
                        <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-text)]">
                          {cmd.name}
                        </code>
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                        {cmd.purpose}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-4 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 font-mono text-xs text-[var(--color-text-subtle)]">
                  runtime — no /tc:* commands
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* GOVERNANCE */}
      <section id="governance" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="04"
          eyebrow="Governance"
          title="One execution path. Default deny. No backdoor."
          intro={
            <>
              From Phase 10.5 on, every action above read-only flows through a single
              controlled-execution pipeline. The web console, the Runtime API, the MCP server,
              sandboxes, and the continuous agent are all front-ends to it — none can bypass it.
            </>
          }
        />
        <ol className="mt-10 flex flex-wrap items-stretch gap-x-2 gap-y-3 font-mono text-xs">
          {[
            "Intent router",
            "Command planner",
            "Permission policy",
            "Approval gate",
            "Bounded execution",
            "Output validation",
            "Audit log",
          ].map((stage, i, arr) => (
            <Fragment key={stage}>
              <li className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)]">
                {stage}
              </li>
              {i < arr.length - 1 ? (
                <li aria-hidden="true" className="flex items-center text-[var(--color-accent)]">
                  →
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-[var(--color-text-muted)]">
          An unsafe request is blocked before the agent is ever reached. A privileged action that is
          not approved is held — no execution, no change. An approved action is executed in bounds,
          its diff validated against the plan, and the whole action written to an append-only audit
          journal. The seven permission levels — <code>read-only</code>, <code>safe-write</code>,{" "}
          <code>code-write</code>, <code>execute-tests</code>, <code>external-network</code>,{" "}
          <code>destructive</code>, <code>admin</code> — are resolved per role and enforced
          server-side.
        </p>
      </section>

      {/* AUTONOMY */}
      <section id="autonomy" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="05"
          eyebrow="Autonomy modes"
          title="The agent&rsquo;s autonomy is a ceiling, not a license."
          intro={
            <>
              The continuous quality agent (Phase 13) runs through the same pipeline. The configured
              autonomy mode decides which permission levels it may <em>auto-approve</em>; nothing
              above the mode executes without explicit human approval. The modes are cumulative.
            </>
          }
        />
        <div className="mt-10 overflow-hidden rounded-lg border border-[var(--color-border)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                {["Mode", "Name", "Auto-approves", "Can open PRs"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="border-b border-[var(--color-border)] px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-subtle)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {autonomyModes.map((m, i) => (
                <tr
                  key={m.mode}
                  className={
                    i < autonomyModes.length - 1
                      ? "border-b border-[var(--color-border)]"
                      : undefined
                  }
                >
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top font-mono text-[var(--color-accent)]">
                    {m.mode}
                  </td>
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top font-mono text-[var(--color-text)]">
                    {m.name}
                  </td>
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top text-[var(--color-text-muted)]">
                    {m.approves}
                  </td>
                  <td className="bg-[var(--color-surface)] px-5 py-3 align-top text-[var(--color-text-muted)]">
                    {m.pr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl border-l-2 border-[var(--color-accent)] pl-4 text-sm italic text-[var(--color-text-muted)]">
          <code>destructive</code> and <code>admin</code> are never auto-approved at any mode, and
          the agent never auto-merges. A team starts at Mode 0 (advice only) and raises the mode
          deliberately.
        </p>
      </section>

      {/* CUSTOMIZE */}
      <section id="customize" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="06"
          eyebrow="Customize"
          title="Universal cores, additive project tuning."
          intro={
            <>
              Per Decision D19, every shipped rubric, tag taxonomy, and detector uses universal
              English and software-engineering vocabulary only — the same workflow runs against a
              banking app, a hospital system, or an internal dashboard. Your domain enters{" "}
              <em>additively</em>.
            </>
          }
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            [
              "<workspace>/config.yaml",
              "Extend rubric keyword sets, tag namespaces, and policy overrides. Extensions union with the universal core — you cannot remove a default.",
            ],
            [
              "documents/uploaded/",
              "Drop your real requirements and docs as Markdown. The Phase-2/3 helpers find and parse them — the requirements Test Commander reviews are yours.",
            ],
            [
              "policy/permissions.yaml + approvals.yaml",
              "Define roles and which permission levels each may reach, and which actions require an approval. The seven levels are the fixed contract; you tune the roles.",
            ],
            [
              "continuous/config.yaml",
              "Set the autonomy mode (0–4) and the label applied to agent-opened pull requests.",
            ],
          ].map(([code, body]) => (
            <li
              key={code}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <code className="font-mono text-xs text-[var(--color-accent)]">{code}</code>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* MORE DOCS */}
      <section id="more" className="mt-24 scroll-mt-24">
        <SectionHeader
          number="07"
          eyebrow="More documentation"
          title="The full guides live in the repo."
          intro={
            <>
              Every shipped phase ships an end-to-end walkthrough under{" "}
              <code>docs/user-guide/</code> in the test-commander repo, each driving the seeded
              fixture with verbatim output. These are the authoritative references.
            </>
          }
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {docLinks.map((d) => (
            <li
              key={d.title}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                <a
                  href={d.href}
                  rel="noopener"
                  className="underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
                >
                  {d.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{d.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 flex flex-wrap gap-3">
          <a
            href={REPO}
            rel="noopener"
            className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-fg)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            View the repository
          </a>
          <Link
            href="/test-commander"
            className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            Back to the overview
          </Link>
        </p>
      </section>
    </div>
  );
}
