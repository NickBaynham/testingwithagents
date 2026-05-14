import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        Page not found.
      </h1>
      <p className="max-w-xl text-lg text-[var(--color-text-muted)]">
        That link doesn&rsquo;t match anything on the site. It may have moved, or the URL may be
        wrong. Try the home page or the project index.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
        >
          Projects
        </Link>
      </div>
    </div>
  );
}
