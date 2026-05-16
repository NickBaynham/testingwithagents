import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { findPrevNext, findRelatedPosts, getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { blogPostingJsonLd, breadcrumbListJsonLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const ogImage = `/og/blog/${post.slug}.png`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [site.name],
      tags: [...post.tags],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

function formatDate(iso: string): string {
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

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const related = findRelatedPosts(allPosts, slug);
  const { prev, next } = findPrevNext(allPosts, slug);

  const { default: Body } = (await import(`@/content/blog/${slug}.mdx`)) as {
    default: React.ComponentType;
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <JsonLd
        items={[
          blogPostingJsonLd(post),
          breadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        <Link href="/blog/" className="hover:text-[var(--color-accent-hover)]">
          Blog
        </Link>
        <span aria-hidden> / </span>
        <span>{post.categories[0]}</span>
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-[var(--color-text-subtle)]">
        By {site.name} &middot;{" "}
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> &middot;{" "}
        {post.readingTimeMinutes} min read
      </p>

      <article className="prose prose-slate mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)] prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-accent)] hover:prose-a:text-[var(--color-accent-hover)] prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:text-[var(--color-text-muted)] prose-code:text-[var(--color-text)] prose-hr:border-[var(--color-border)]">
        <Body />
      </article>

      {related.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          className="mt-16 border-t border-[var(--color-border)] pt-8"
        >
          <h2
            id="related-heading"
            className="text-lg font-semibold tracking-tight text-[var(--color-text)]"
          >
            Related posts
          </h2>
          <ul className="mt-4 space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}/`}
                  className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
                >
                  {r.title}
                </Link>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{r.excerpt}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav
        aria-label="Post navigation"
        className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-sm sm:flex-row sm:justify-between"
      >
        {prev ? (
          <Link
            href={`/blog/${prev.slug}/`}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="block text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">
              Previous
            </span>
            <span className="mt-1 block text-[var(--color-text)]">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}/`}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-right transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="block text-xs uppercase tracking-widest text-[var(--color-text-subtle)]">
              Next
            </span>
            <span className="mt-1 block text-[var(--color-text)]">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
