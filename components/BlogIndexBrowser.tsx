"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Post } from "@/lib/content/blog";

/*
  Client component for the /blog index. Same URL-state filter pattern as
  ProjectsBrowser: a filtered view is shareable via `?category=...&tag=...`,
  and without JavaScript the full chronological list still renders.
*/

type Props = {
  posts: Post[];
  categories: readonly string[];
  tags: readonly string[];
};

const ALL = "All";

function matches(post: Post, category: string, tag: string): boolean {
  const okCategory = category === ALL || post.categories.includes(category as never);
  const okTag = tag === ALL || post.tags.includes(tag);
  return okCategory && okTag;
}

function formatDate(iso: string): string {
  // YYYY-MM-DD -> "May 12, 2026". Pure to keep server / client output identical.
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

export function BlogIndexBrowser({ posts, categories, tags }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = params?.get("category") ?? ALL;
  const tag = params?.get("tag") ?? ALL;

  const visible = useMemo(
    () => posts.filter((p) => matches(p, category, tag)),
    [posts, category, tag],
  );

  function setFilter(key: "category" | "tag", value: string) {
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
        legend="Tag"
        active={tag}
        options={[ALL, ...tags]}
        onPick={(v) => setFilter("tag", v)}
      />

      {visible.length === 0 ? (
        <p className="mt-8 text-[var(--color-text-muted)]">
          No posts match these filters. Reset by selecting <strong>All</strong> in both rows.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {visible.map((p) => (
            <li key={p.slug} className="py-6">
              <Link href={`/blog/${p.slug}/`} className="group block">
                <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{p.excerpt}</p>
                <p className="mt-2 text-xs text-[var(--color-text-subtle)]">
                  {formatDate(p.publishedAt)} &middot; {p.readingTimeMinutes} min read &middot;{" "}
                  {p.categories.join(", ")}
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
