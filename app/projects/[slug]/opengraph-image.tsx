import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";

export const alt = "Project case study on testingwithagents.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Project case study";
  const summary = project?.summary ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#22d3ee",
          }}
        >
          testingwithagents.com / Projects
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#ffffff",
            display: "flex",
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: 28,
          lineHeight: 1.4,
          maxWidth: 1000,
          color: "#cbd5e1",
          display: "flex",
        }}
      >
        {summary}
      </div>
    </div>,
    size,
  );
}
