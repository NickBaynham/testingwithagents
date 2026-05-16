import type { Metadata } from "next";
import Link from "next/link";
import Resume from "@/content/resume/resume.mdx";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Nick Baynham's resume: target roles, core skills, technology stack, and selected experience in AI-augmented quality engineering.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Resume
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        {site.name}
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/resume.pdf"
          className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Download PDF
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
        >
          Contact me
        </Link>
        <a
          href={site.social.linkedin}
          rel="me noopener"
          className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
        >
          LinkedIn
        </a>
        <a
          href={site.social.github}
          rel="me noopener"
          className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
        >
          GitHub
        </a>
      </div>

      <div className="mt-8">
        <RecruiterSummary />
      </div>

      <article className="prose prose-slate mt-12 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)] prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-accent)] hover:prose-a:text-[var(--color-accent-hover)] dark:prose-invert">
        <Resume />
      </article>
    </div>
  );
}
