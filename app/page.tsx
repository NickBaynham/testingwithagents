import Link from "next/link";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { getRecentPosts } from "@/lib/content/blog";
import { getFeaturedProjects } from "@/lib/content/projects";
import { site } from "@/lib/site-config";

type Cta = { label: string; href: string; emphasis?: boolean };

const primaryCtas: readonly Cta[] = [
  { label: "View Portfolio", href: "/projects", emphasis: true },
  { label: "Read the Blog", href: "/blog" },
  { label: "View Resume", href: "/resume" },
  { label: "Contact Me", href: "/contact" },
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default async function Home() {
  const [featured, recentPosts] = await Promise.all([getFeaturedProjects(3), getRecentPosts(3)]);

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

        <div className="mt-10">
          <RecruiterSummary />
        </div>
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
        {featured.length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">
            The portfolio lands in Phase 2. Add an MDX file under{" "}
            <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm">
              content/projects/
            </code>{" "}
            with{" "}
            <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm">
              featured: true
            </code>{" "}
            to surface it here.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}/`}
                  className="block h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)]"
                >
                  <h3 className="text-base font-semibold tracking-tight text-[var(--color-text)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
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
        {recentPosts.length === 0 ? (
          <p className="mt-3 text-[var(--color-text-muted)]">
            The blog launches in Phase 3. Add an MDX file under{" "}
            <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm">
              content/blog/
            </code>{" "}
            to surface it here.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {recentPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="group block">
                  <h3 className="text-base font-semibold tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{p.excerpt}</p>
                  <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                    {formatDate(p.publishedAt)} &middot; {p.readingTimeMinutes} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
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
