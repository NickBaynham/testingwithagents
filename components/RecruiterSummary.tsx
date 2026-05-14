import SummaryBody from "@/content/recruiter-summary.mdx";

/*
  Renders the recruiter-summary block on Home, About, Resume, and (later)
  the Projects/Blog indexes. Content lives in content/recruiter-summary.mdx;
  edit there so every page updates together.
*/
export function RecruiterSummary() {
  return (
    <aside
      aria-label="Recruiter summary"
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4 text-sm text-[var(--color-text-muted)]"
    >
      <div className="prose prose-sm max-w-none prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-accent)] hover:prose-a:text-[var(--color-accent-hover)] [&_p]:my-0 [&_p+p]:mt-2">
        <SummaryBody />
      </div>
    </aside>
  );
}
