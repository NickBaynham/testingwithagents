import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { breadcrumbListJsonLd, creativeWorkJsonLd } from "@/lib/seo/structured-data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Dynamic MDX import. Slug list is enumerated at build time via
  // generateStaticParams, so every import path is resolvable.
  const { default: Body } = (await import(`@/content/projects/${slug}.mdx`)) as {
    default: React.ComponentType;
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <JsonLd
        items={[
          creativeWorkJsonLd(project),
          breadcrumbListJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        <Link href="/projects/" className="hover:text-[var(--color-accent-hover)]">
          Projects
        </Link>
        <span aria-hidden> / </span>
        <span>{project.status}</span>
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        {project.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
        {project.summary}
      </p>

      <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">
          Categories
        </dt>
        <dd className="text-[var(--color-text-muted)]">{project.categories.join(", ")}</dd>
        <dt className="font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">
          Technologies
        </dt>
        <dd className="text-[var(--color-text-muted)]">{project.technologies.join(", ")}</dd>
        {project.repoUrl ? (
          <>
            <dt className="font-medium uppercase tracking-widest text-[var(--color-text-subtle)]">
              Repository
            </dt>
            <dd>
              <a
                href={project.repoUrl}
                rel="me noopener"
                className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
              >
                {project.repoUrl.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </>
        ) : null}
      </dl>

      <article className="prose prose-slate mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--color-text)] prose-p:text-[var(--color-text-muted)] prose-li:text-[var(--color-text-muted)] prose-strong:text-[var(--color-text)] prose-a:text-[var(--color-accent)] hover:prose-a:text-[var(--color-accent-hover)]">
        <Body />
      </article>
    </div>
  );
}
