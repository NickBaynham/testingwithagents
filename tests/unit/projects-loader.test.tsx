import { describe, it, expect } from "vitest";
import { parseProjectSource, projectFrontmatterSchema } from "@/lib/content/projects";

const validFrontmatter = `---
title: "Example Project"
slug: "example-project"
summary: "A short summary."
categories:
  - "API Testing"
technologies:
  - "Playwright"
  - "TypeScript"
status: "Prototype"
order: 1
featured: true
---

# Body
`;

describe("projectFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      summary: "s",
      categories: ["API Testing"],
      technologies: ["Playwright"],
      status: "Prototype",
      order: 1,
    });
    expect(result.success).toBe(true);
    // featured defaults to false
    if (result.success) expect(result.data.featured).toBe(false);
  });

  it("rejects an unknown category", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      summary: "s",
      categories: ["Frontend Framework"],
      technologies: ["X"],
      status: "Prototype",
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty technologies array", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      summary: "s",
      categories: ["API Testing"],
      technologies: [],
      status: "Prototype",
      order: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid slug (uppercase, spaces, leading dash)", () => {
    for (const slug of ["Bad Slug", "bad_slug", "-leading", "trailing-", "UPPER"]) {
      const result = projectFrontmatterSchema.safeParse({
        title: "T",
        slug,
        summary: "s",
        categories: ["API Testing"],
        technologies: ["X"],
        status: "Prototype",
        order: 1,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects unknown frontmatter keys (strict)", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      summary: "s",
      categories: ["API Testing"],
      technologies: ["X"],
      status: "Prototype",
      order: 1,
      surpriseExtra: "not allowed",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL repoUrl", () => {
    const result = projectFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      summary: "s",
      categories: ["API Testing"],
      technologies: ["X"],
      status: "Prototype",
      order: 1,
      repoUrl: "not a url",
    });
    expect(result.success).toBe(false);
  });
});

describe("parseProjectSource", () => {
  it("parses valid MDX and returns the validated project", () => {
    const project = parseProjectSource(validFrontmatter, "example-project");
    expect(project.title).toBe("Example Project");
    expect(project.featured).toBe(true);
    expect(project.filenameSlug).toBe("example-project");
  });

  it("throws when the filename slug does not match the frontmatter slug", () => {
    expect(() => parseProjectSource(validFrontmatter, "different-name")).toThrow(/Slug mismatch/i);
  });

  it("throws with a helpful message on invalid frontmatter", () => {
    const bad = validFrontmatter.replace("Prototype", "Imaginary");
    expect(() => parseProjectSource(bad, "example-project")).toThrow(/Invalid frontmatter/i);
  });
});
