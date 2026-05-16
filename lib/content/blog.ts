import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

/*
  Blog content loader.

  - Source of truth: `content/blog/*.mdx`.
  - Frontmatter validated with Zod at build time. Invalid file fails the
    build with a per-file error message.
  - Reading time and a stripped-MDX excerpt fallback are computed at load
    time using the `reading-time` package.
  - Static export only: every helper runs at build time, never at request.
*/

const CATEGORY_VALUES = [
  "Agentic Testing",
  "Test Automation",
  "Quality Strategy",
  "AI Risk",
  "Career Notes",
  "Project Logs",
  "Tool Reviews",
] as const;

export const postFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "slug must be kebab-case"),
    excerpt: z.string().min(1),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD")
      .optional(),
    categories: z.array(z.enum(CATEGORY_VALUES)).min(1),
    tags: z.array(z.string().min(1)).min(1),
    coverImage: z.string().min(1).optional(),
  })
  .strict();

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = PostFrontmatter & {
  /** Filename minus extension; must match `slug` (enforced by loader). */
  filenameSlug: string;
  /** Minutes to read, rounded up. */
  readingTimeMinutes: number;
};

export const POST_CATEGORIES: ReadonlyArray<(typeof CATEGORY_VALUES)[number]> = CATEGORY_VALUES;

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/** Parse and validate a single MDX file. Exported so tests can drive it directly. */
export function parsePostSource(source: string, filenameSlug: string): Post {
  const parsed = matter(source);
  const result = postFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid frontmatter in ${filenameSlug}.mdx - ${issues}`);
  }
  if (result.data.slug !== filenameSlug) {
    throw new Error(
      `Slug mismatch in ${filenameSlug}.mdx - frontmatter says "${result.data.slug}"`,
    );
  }
  const minutes = Math.max(1, Math.ceil(readingTime(parsed.content).minutes));
  return { ...result.data, filenameSlug, readingTimeMinutes: minutes };
}

/** Read every post MDX in `content/blog/` and return validated metadata, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
      return parsePostSource(source, slug);
    }),
  );
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostSlugs(): Promise<string[]> {
  const all = await getAllPosts();
  return all.map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const all = await getAllPosts();
  return all.slice(0, limit);
}

/** Find the previous (older) and next (newer) post by publishedAt. Pure helper for tests. */
export function findPrevNext(
  posts: readonly Post[],
  slug: string,
): { prev: Post | null; next: Post | null } {
  // Posts are newest first; "next" is the newer post (smaller index), "prev" the older one.
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    next: idx > 0 ? posts[idx - 1] : null,
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

/** Related posts share tags with the target post; ranked by overlap count, then recency. */
export function findRelatedPosts(posts: readonly Post[], slug: string, limit = 3): Post[] {
  const target = posts.find((p) => p.slug === slug);
  if (!target) return [];
  const targetTags = new Set(target.tags);
  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      overlap: p.tags.reduce((sum, t) => sum + (targetTags.has(t) ? 1 : 0), 0),
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.publishedAt.localeCompare(a.post.publishedAt));
  return scored.slice(0, limit).map((s) => s.post);
}

export async function getPrevNext(slug: string) {
  const all = await getAllPosts();
  return findPrevNext(all, slug);
}

export async function getRelatedPosts(slug: string, limit = 3) {
  const all = await getAllPosts();
  return findRelatedPosts(all, slug, limit);
}
