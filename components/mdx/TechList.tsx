type Props = {
  items: readonly string[];
};

/*
  Renders a list of technologies / tools used in a project as small,
  accent-bordered tags. Used inside project case studies.
*/
export function TechList({ items }: Props) {
  return (
    <ul className="my-4 flex flex-wrap gap-2 not-prose">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
