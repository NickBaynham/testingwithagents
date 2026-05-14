import Link from "next/link";
import { site } from "@/lib/site-config";

type Cta = { label: string; href: string; emphasis?: boolean };

const primaryCtas: readonly Cta[] = [
  { label: "View Portfolio", href: "/projects", emphasis: true },
  { label: "Read the Blog", href: "/blog" },
  { label: "Download Resume", href: "/resume.pdf" },
  { label: "Contact Me", href: "/contact" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section aria-labelledby="hero-heading" className="py-16 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
          {site.tagline}
        </p>
        <h1
          id="hero-heading"
          className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl"
        >
          Hi, I&rsquo;m {site.name}.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
          I&rsquo;m a software testing and automation engineer focused on the next generation of
          quality systems: AI-assisted test design, agentic workflows, API-first automation, and
          practical quality signals that help teams ship with confidence.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {primaryCtas.map((cta) => (
            <li key={cta.href}>
              <Link
                href={cta.href}
                className={
                  "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors " +
                  (cta.emphasis
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)]"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:text-[var(--color-accent)]")
                }
              >
                {cta.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="featured-projects-heading"
        className="border-t border-[var(--color-border)] py-12"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="featured-projects-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
          >
            Featured projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            All projects &rarr;
          </Link>
        </div>
        <p className="mt-3 text-[var(--color-text-muted)]">
          The portfolio lands in Phase 2. Expect a Universal Testing Language, an agentic testing
          workflow prototype, and an API automation framework.
        </p>
      </section>

      <section
        aria-labelledby="featured-posts-heading"
        className="border-t border-[var(--color-border)] py-12"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="featured-posts-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
          >
            Latest writing
          </h2>
          <Link
            href="/blog"
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            All posts &rarr;
          </Link>
        </div>
        <p className="mt-3 text-[var(--color-text-muted)]">
          The blog launches in Phase 3 with notes on agentic testing, the limits of AI in QA, and
          what evidence a quality engineer should ship with a story.
        </p>
      </section>

      <section
        aria-labelledby="skills-snapshot-heading"
        className="border-t border-[var(--color-border)] py-12"
      >
        <h2
          id="skills-snapshot-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Skills snapshot
        </h2>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Test automation architecture, API testing, Playwright, Python and TypeScript SDETs, CI/CD,
          AI-assisted test design, and pragmatic adoption of agentic workflows.
        </p>
      </section>
    </div>
  );
}
