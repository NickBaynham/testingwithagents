"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Project } from "@/lib/content/projects";

/*
  Client component. Renders the filter chips and the project grid together.
  Filter state lives in the URL (`?category=...&tech=...`) so a filtered view
  is shareable. Without JavaScript, the URL params do nothing but the full
  grid still renders — the page degrades to "see everything" rather than
  hiding content behind an inactive control.
*/

type Props = {
  projects: Project[];
  categories: readonly string[];
  technologies: readonly string[];
};

const ALL = "All";

function matches(project: Project, category: string, tech: string): boolean {
  const okCategory = category === ALL || project.categories.includes(category as never);
  const okTech = tech === ALL || project.technologies.includes(tech);
  return okCategory && okTech;
}

export function ProjectsBrowser({ projects, categories, technologies }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = params?.get("category") ?? ALL;
  const tech = params?.get("tech") ?? ALL;

  const visible = useMemo(
    () => projects.filter((p) => matches(p, category, tech)),
    [projects, category, tech],
  );

  function setFilter(key: "category" | "tech", value: string) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (value === ALL) next.delete(key);
    else next.set(key, value);
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <div>
      <FilterRow
        legend="Category"
        active={category}
        options={[ALL, ...categories]}
        onPick={(v) => setFilter("category", v)}
      />
      <FilterRow
        legend="Technology"
        active={tech}
        options={[ALL, ...technologies]}
        onPick={(v) => setFilter("tech", v)}
      />

      {visible.length === 0 ? (
        <p className="mt-8 text-[var(--color-text-muted)]">
          No projects match these filters. Reset by selecting <strong>All</strong> in both rows.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}/`}
                className="block h-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)]"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
                    {p.title}
                  </h2>
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-accent)]">
                    {p.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{p.summary}</p>
                <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
                  {p.technologies.join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow({
  legend,
  active,
  options,
  onPick,
}: {
  legend: string;
  active: string;
  options: readonly string[];
  onPick: (value: string) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">
        {legend}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => onPick(option)}
              className={
                "rounded-full border px-3 py-1 text-sm transition-colors " +
                (isActive
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]")
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
