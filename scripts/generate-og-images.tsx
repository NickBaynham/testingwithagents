/*
  Build-time Open Graph image generator.

  Replaces the rolled-back app/projects/[slug]/opengraph-image.tsx route
  handler. The Next.js convention emits an extensionless artifact that
  Amplify Hosting's static backend 301-redirects to add a trailing slash,
  breaking the meta-tag URL. This script writes proper *.png files into
  public/og/ at build time so metadata.openGraph.images resolves cleanly.

  Outputs:
    public/og/default.png                   - site-wide default
    public/og/projects/<slug>.png            - one per project
    public/og/blog/<slug>.png                - one per blog post

  Invocation: `npm run build:og` (wired as `prebuild` for `npm run build`).
*/

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { getAllPosts } from "../lib/content/blog";
import { getAllProjects } from "../lib/content/projects";
import { site } from "../lib/site-config";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "og");
const FONT_DIR = path.join(ROOT, "node_modules", "@fontsource", "inter", "files");

const WIDTH = 1200;
const HEIGHT = 630;

async function loadFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(path.join(FONT_DIR, "inter-latin-400-normal.woff")),
    readFile(path.join(FONT_DIR, "inter-latin-600-normal.woff")),
  ]);
  // satori expects Buffer or ArrayBuffer; Buffer is fine in Node.
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

type CardInput = {
  eyebrow: string;
  title: string;
  summary: string;
};

function Card({ eyebrow, title, summary }: CardInput) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0f172a",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          fontSize: 24,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#22d3ee",
          fontWeight: 600,
          display: "flex",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#ffffff",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.4,
            maxWidth: 1000,
            color: "#cbd5e1",
            fontWeight: 400,
            display: "flex",
          }}
        >
          {summary}
        </div>
      </div>
      <div
        style={{
          fontSize: 22,
          color: "#94a3b8",
          fontWeight: 400,
          display: "flex",
        }}
      >
        {`${site.name} — ${site.tagline}`}
      </div>
    </div>
  );
}

async function renderToPng(node: React.ReactElement, fonts: Awaited<ReturnType<typeof loadFonts>>) {
  const svg = await satori(node, { width: WIDTH, height: HEIGHT, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}

async function writePng(filePath: string, png: Buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, png);
}

async function main() {
  console.log("Generating OG images...");
  const fonts = await loadFonts();
  let count = 0;

  // Site default
  const defaultPng = await renderToPng(
    <Card eyebrow="testingwithagents.com" title={site.name} summary={site.tagline} />,
    fonts,
  );
  await writePng(path.join(OUT_DIR, "default.png"), defaultPng);
  count += 1;

  // Per-project
  const projects = await getAllProjects();
  for (const project of projects) {
    const png = await renderToPng(
      <Card
        eyebrow="testingwithagents.com / Projects"
        title={project.title}
        summary={project.summary}
      />,
      fonts,
    );
    await writePng(path.join(OUT_DIR, "projects", `${project.slug}.png`), png);
    count += 1;
  }

  // Per-post
  const posts = await getAllPosts();
  for (const post of posts) {
    const png = await renderToPng(
      <Card eyebrow="testingwithagents.com / Blog" title={post.title} summary={post.excerpt} />,
      fonts,
    );
    await writePng(path.join(OUT_DIR, "blog", `${post.slug}.png`), png);
    count += 1;
  }

  console.log(`Generated ${count} OG image(s) under public/og/.`);
}

main().catch((err) => {
  console.error("OG image generation failed:", err);
  process.exit(1);
});
