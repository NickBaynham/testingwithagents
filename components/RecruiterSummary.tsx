import SummaryBody from "@/content/recruiter-summary.mdx";

/*
  Renders the recruiter-summary block on Home, About, Resume, and (later)
  the Projects/Blog indexes. Content lives in content/recruiter-summary.mdx;
  edit there so every page updates together.

  Styling is explicit (not prose) because Tailwind's typography plugin sets
  its own --tw-prose-body palette that does not follow our `data-theme`
  attribute. The selectors below target the MDX children directly so every
  theme reaches WCAG AA contrast.
*/
export function RecruiterSummary() {
  return (
    <aside
      aria-label="Recruiter summary"
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4 text-sm text-[var(--color-text-muted)] [&_a:hover]:text-[var(--color-accent-hover)] [&_a]:text-[var(--color-accent)] [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-[var(--color-text)]"
    >
      <SummaryBody />
    </aside>
  );
}
