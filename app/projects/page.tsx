import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsBrowser } from "@/components/ProjectsBrowser";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { CATEGORIES, getAllProjects } from "@/lib/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected portfolio projects from Nick Baynham on AI-augmented testing, automation frameworks, API testing, and agentic workflows.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const technologies = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Projects
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        Proof of work.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
        Selected projects across AI-assisted testing, automation frameworks, API testing, and
        agentic workflows. Each card opens a full case study with architecture, testing approach,
        and lessons learned.
      </p>

      <div className="mt-8">
        <RecruiterSummary />
      </div>

      {projects.length === 0 ? (
        <p className="mt-12 text-[var(--color-text-muted)]">
          Projects ship later in Phase 2. Until then, this page is the placeholder index.
        </p>
      ) : (
        <Suspense fallback={null}>
          <ProjectsBrowser
            projects={projects}
            categories={CATEGORIES}
            technologies={technologies}
          />
        </Suspense>
      )}
    </div>
  );
}
