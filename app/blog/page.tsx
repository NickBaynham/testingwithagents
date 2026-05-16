import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogIndexBrowser } from "@/components/BlogIndexBrowser";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { POST_CATEGORIES, getAllPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on AI-augmented software testing, agentic workflows, QA strategy, and tooling - from Nick Baynham.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Blog
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        Notes on testing with agents.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
        Short, practical posts on AI-augmented testing, agentic workflows, QA strategy, and the ways
        automation actually pays off.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        <Link
          href="/rss.xml"
          className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
        >
          RSS feed
        </Link>
        <Link
          href="/feed.json"
          className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
        >
          JSON feed
        </Link>
      </div>

      <div className="mt-8">
        <RecruiterSummary />
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-[var(--color-text-muted)]">No posts yet.</p>
      ) : (
        <Suspense fallback={null}>
          <BlogIndexBrowser posts={posts} categories={POST_CATEGORIES} tags={tags} />
        </Suspense>
      )}
    </div>
  );
}
