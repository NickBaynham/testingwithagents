import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { breadcrumbListJsonLd, personJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nick Baynham's background, testing philosophy, and what he's building toward in AI-augmented quality engineering.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <JsonLd
        items={[
          personJsonLd(),
          breadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        About
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        Where I&rsquo;m coming from.
      </h1>

      <div className="mt-8">
        <RecruiterSummary />
      </div>

      <section aria-labelledby="summary-heading" className="mt-12 space-y-4">
        <h2
          id="summary-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Professional summary
        </h2>
        <p className="text-[var(--color-text-muted)]">
          I&rsquo;m a software testing and automation engineer. Most of my career has lived at the
          intersection of test architecture, API testing, and CI/CD reliability. The work I&rsquo;m
          drawn to now sits at the boundary between human judgment and AI: where agents help write,
          maintain, or explore tests, but a person still owns the quality decision.
        </p>
      </section>

      <section aria-labelledby="philosophy-heading" className="mt-10 space-y-4">
        <h2
          id="philosophy-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          My testing philosophy
        </h2>
        <p className="text-[var(--color-text-muted)]">
          Tests exist to communicate quality, not to satisfy a coverage number. The best test
          strategy is the one a team can actually maintain: API-first where possible, UI where
          necessary, deterministic when running in CI, expressive when read by a future engineer.
          Flakiness is a design problem, not a configuration problem.
        </p>
      </section>

      <section aria-labelledby="ai-heading" className="mt-10 space-y-4">
        <h2
          id="ai-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Why AI plus QA matters
        </h2>
        <p className="text-[var(--color-text-muted)]">
          AI is not a replacement for judgment about what to test. It is a force multiplier for the
          parts of testing that are easy to describe and tedious to do: generating candidate cases,
          maintaining selectors, summarizing failures, suggesting risk areas. The win is using
          agents to surface signal faster while the engineer stays accountable for the decision.
        </p>
      </section>

      <section aria-labelledby="building-heading" className="mt-10 space-y-4">
        <h2
          id="building-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          What I&rsquo;m building toward
        </h2>
        <p className="text-[var(--color-text-muted)]">
          A practical body of evidence that AI-assisted testing can be both useful and honest about
          its limits: a universal testing language to bridge frameworks, agentic workflows that help
          with the slog of test maintenance, and quality dashboards that translate test signals into
          something a product team can act on.
        </p>
      </section>

      <section aria-labelledby="focus-heading" className="mt-10 space-y-4">
        <h2
          id="focus-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Current focus areas
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            Agentic workflows in software testing, with explicit guardrails and observability.
          </li>
          <li>API-first automation strategy that scales beyond a few hundred tests.</li>
          <li>Quality signal design for engineering leaders and product owners.</li>
          <li>Tool evaluation for AI coding agents applied to test maintenance.</li>
        </ul>
      </section>
    </div>
  );
}
