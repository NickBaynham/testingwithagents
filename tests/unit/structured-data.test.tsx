import { describe, it, expect } from "vitest";
import {
  blogPostingJsonLd,
  breadcrumbListJsonLd,
  creativeWorkJsonLd,
  personJsonLd,
} from "@/lib/seo/structured-data";
import type { Post } from "@/lib/content/blog";
import type { Project } from "@/lib/content/projects";

describe("personJsonLd", () => {
  it("emits a Person with name, url, sameAs, and email", () => {
    const ld = personJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Nick Baynham");
    expect(ld.url).toContain("testingwithagents.com");
    expect(Array.isArray(ld.sameAs)).toBe(true);
    expect((ld.sameAs as string[]).some((s) => s.includes("linkedin"))).toBe(true);
    expect((ld.sameAs as string[]).some((s) => s.includes("github"))).toBe(true);
    expect((ld.email as string).startsWith("mailto:")).toBe(true);
  });
});

describe("breadcrumbListJsonLd", () => {
  it("emits a BreadcrumbList with absolute URLs and 1-indexed positions", () => {
    const ld = breadcrumbListJsonLd([
      { name: "Blog", path: "/blog" },
      { name: "A post", path: "/blog/a-post" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    const items = ld.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect((items[0].item as string).endsWith("/blog/")).toBe(true);
    expect((items[1].item as string).endsWith("/blog/a-post/")).toBe(true);
  });
});

describe("blogPostingJsonLd", () => {
  const post: Post = {
    title: "Example",
    slug: "example",
    excerpt: "A post about testing.",
    publishedAt: "2026-05-10",
    updatedAt: "2026-05-12",
    categories: ["Agentic Testing"],
    tags: ["ai", "testing"],
    filenameSlug: "example",
    readingTimeMinutes: 3,
  };

  it("emits a BlogPosting with headline, dates, keywords, author, and url", () => {
    const ld = blogPostingJsonLd(post);
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.headline).toBe("Example");
    expect(ld.datePublished).toBe("2026-05-10");
    expect(ld.dateModified).toBe("2026-05-12");
    expect(ld.keywords).toContain("Agentic Testing");
    expect(ld.keywords).toContain("ai");
    expect((ld.url as string).endsWith("/blog/example/")).toBe(true);
    const author = ld.author as Record<string, string>;
    expect(author["@type"]).toBe("Person");
  });

  it("falls back to publishedAt for dateModified when updatedAt is absent", () => {
    const ld = blogPostingJsonLd({ ...post, updatedAt: undefined });
    expect(ld.dateModified).toBe("2026-05-10");
  });
});

describe("creativeWorkJsonLd", () => {
  const project: Project = {
    title: "UTL",
    slug: "utl",
    summary: "A test DSL.",
    categories: ["Automation Frameworks"],
    technologies: ["TypeScript", "Playwright"],
    status: "Concept",
    order: 1,
    featured: true,
    repoUrl: "https://github.com/example/utl",
    filenameSlug: "utl",
  };

  it("emits a CreativeWork with name, description, creator, status, url, and codeRepository", () => {
    const ld = creativeWorkJsonLd(project);
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld.name).toBe("UTL");
    expect(ld.creativeWorkStatus).toBe("Concept");
    expect(ld.codeRepository).toBe("https://github.com/example/utl");
    expect((ld.url as string).endsWith("/projects/utl/")).toBe(true);
    expect(ld.keywords).toContain("Automation Frameworks");
    expect(ld.keywords).toContain("TypeScript");
  });

  it("omits codeRepository when repoUrl is absent", () => {
    const ld = creativeWorkJsonLd({ ...project, repoUrl: undefined });
    expect(ld).not.toHaveProperty("codeRepository");
  });
});
