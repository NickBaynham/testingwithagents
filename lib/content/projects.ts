import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/*
  Project content loader.

  - Source of truth: `content/projects/*.mdx`.
  - Frontmatter is validated with Zod at build time; an invalid file fails
    the build (better than a silently malformed card on the live site).
  - Designed for static export: every helper here runs at build time, never
    at request time.
*/

const CATEGORY_VALUES = [
  "AI-Assisted Testing",
  "Automation Frameworks",
  "API Testing",
  "Agentic Workflows",
  "Cloud / AWS Automation",
  "QA Strategy",
] as const;

const STATUS_VALUES = ["Concept", "Prototype", "Active", "Archived"] as const;

export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "slug must be kebab-case"),
    summary: z.string().min(1),
    categories: z.array(z.enum(CATEGORY_VALUES)).min(1),
    technologies: z.array(z.string().min(1)).min(1),
    status: z.enum(STATUS_VALUES),
    repoUrl: z.string().url().optional(),
    coverImage: z.string().min(1).optional(),
    order: z.number().int().nonnegative(),
    featured: z.boolean().default(false),
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  /** Filename minus extension; must match `slug` (enforced by loader). */
  filenameSlug: string;
};

export const CATEGORIES: ReadonlyArray<(typeof CATEGORY_VALUES)[number]> = CATEGORY_VALUES;
export const STATUSES: ReadonlyArray<(typeof STATUS_VALUES)[number]> = STATUS_VALUES;

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

/** Parse and validate a single MDX file. Exported so tests can drive it directly. */
export function parseProjectSource(source: string, filenameSlug: string): Project {
  const { data } = matter(source);
  const result = projectFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid frontmatter in ${filenameSlug}.mdx - ${issues}`);
  }
  if (result.data.slug !== filenameSlug) {
    throw new Error(
      `Slug mismatch in ${filenameSlug}.mdx - frontmatter says "${result.data.slug}"`,
    );
  }
  return { ...result.data, filenameSlug };
}

/** Read every project MDX in `content/projects/` and return validated metadata. */
export async function getAllProjects(): Promise<Project[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
      return parseProjectSource(source, slug);
    }),
  );
  return projects.sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProjectSlugs(): Promise<string[]> {
  const all = await getAllProjects();
  return all.map((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}
