import { site } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-[var(--color-text-subtle)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {year} {site.name}. {site.tagline}
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a
              href={site.social.linkedin}
              className="hover:text-[var(--color-accent)]"
              rel="me noopener"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={site.social.github}
              className="hover:text-[var(--color-accent)]"
              rel="me noopener"
            >
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-[var(--color-accent)]">
              Email
            </a>
          </li>
          <li>
            <a href="/rss.xml" className="hover:text-[var(--color-accent)]">
              RSS
            </a>
          </li>
          <li>
            <a href="/privacy/" className="hover:text-[var(--color-accent)]">
              Privacy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
