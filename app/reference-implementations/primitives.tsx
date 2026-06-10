import Link from "next/link";
import type { ReactNode } from "react";

/* Shared layout primitives for the reference-implementation pages. */

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--color-text-muted)]">{intro}</p>
      {children}
    </header>
  );
}

export function Section({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16 scroll-mt-24">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          <span aria-hidden="true">{number} / </span>
          <Link href={`#${id}`} className="hover:underline">
            {title}
          </Link>
        </p>
        <h2
          id={`${id}-heading`}
          className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          {title}
        </h2>
        {intro ? (
          <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">{intro}</p>
        ) : null}
      </header>
      <div className="mt-8 space-y-8">{children}</div>
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">{children}</h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-4 leading-7 text-[var(--color-text-muted)]">{children}</div>
  );
}

const calloutStyles = {
  tip: { label: "Tip", border: "border-l-[var(--color-accent)]" },
  note: { label: "Note", border: "border-l-[var(--color-border)]" },
  warning: { label: "Watch out", border: "border-l-amber-500" },
} as const;

export function Callout({
  kind,
  title,
  children,
}: {
  kind: keyof typeof calloutStyles;
  title?: string;
  children: ReactNode;
}) {
  const style = calloutStyles[kind];
  return (
    <aside
      className={`max-w-3xl rounded-md border border-l-4 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 ${style.border}`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text)]">
        {title ?? style.label}
      </p>
      <div className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{children}</div>
    </aside>
  );
}

export function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-sm">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">{label}</span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code example: ${label}`}
        className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[var(--color-text)] focus:outline focus:outline-2 focus:outline-[var(--color-accent)]"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DataTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold text-[var(--color-text)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border)] last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-[var(--color-text-muted)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  );
}
