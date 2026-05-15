type Props = {
  href: string;
  label?: string;
};

/*
  Styled repository link for use in project case studies.
*/
export function RepoLink({ href, label = "View repository on GitHub" }: Props) {
  return (
    <p className="my-6 not-prose">
      <a
        href={href}
        rel="me noopener"
        className="inline-flex items-center rounded-md border border-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-fg)]"
      >
        {label} &rarr;
      </a>
    </p>
  );
}
