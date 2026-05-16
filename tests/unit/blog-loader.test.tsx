import { describe, it, expect } from "vitest";
import {
  findPrevNext,
  findRelatedPosts,
  parsePostSource,
  postFrontmatterSchema,
  type Post,
} from "@/lib/content/blog";

const validFrontmatter = `---
title: "Example Post"
slug: "example-post"
excerpt: "A short excerpt."
publishedAt: "2026-05-15"
categories:
  - "Agentic Testing"
tags:
  - "ai"
  - "testing"
---

This is the body of the example post.
It has multiple sentences for reading-time math.
The reading-time package counts the words and converts to minutes.
`;

function fixture(slug: string, publishedAt: string, tags: string[]): Post {
  return {
    title: slug,
    slug,
    excerpt: "x",
    publishedAt,
    categories: ["Agentic Testing"],
    tags,
    filenameSlug: slug,
    readingTimeMinutes: 1,
  };
}

describe("postFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    const result = postFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      excerpt: "x",
      publishedAt: "2026-05-15",
      categories: ["Agentic Testing"],
      tags: ["ai"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid publishedAt format", () => {
    const result = postFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      excerpt: "x",
      publishedAt: "May 15, 2026",
      categories: ["Agentic Testing"],
      tags: ["ai"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown category", () => {
    const result = postFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      excerpt: "x",
      publishedAt: "2026-05-15",
      categories: ["UX Design"],
      tags: ["ai"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty tags array", () => {
    const result = postFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      excerpt: "x",
      publishedAt: "2026-05-15",
      categories: ["Agentic Testing"],
      tags: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown frontmatter keys (strict)", () => {
    const result = postFrontmatterSchema.safeParse({
      title: "T",
      slug: "t",
      excerpt: "x",
      publishedAt: "2026-05-15",
      categories: ["Agentic Testing"],
      tags: ["ai"],
      surprise: "nope",
    });
    expect(result.success).toBe(false);
  });
});

describe("parsePostSource", () => {
  it("parses a valid MDX file and computes reading time", () => {
    const post = parsePostSource(validFrontmatter, "example-post");
    expect(post.title).toBe("Example Post");
    expect(post.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });

  it("throws when the filename slug does not match the frontmatter slug", () => {
    expect(() => parsePostSource(validFrontmatter, "different-name")).toThrow(/Slug mismatch/i);
  });

  it("throws with a helpful message on invalid frontmatter", () => {
    const bad = validFrontmatter.replace("2026-05-15", "May 15, 2026");
    expect(() => parsePostSource(bad, "example-post")).toThrow(/Invalid frontmatter/i);
  });
});

describe("findPrevNext", () => {
  const posts = [
    fixture("c", "2026-05-15", []), // newest
    fixture("b", "2026-05-10", []),
    fixture("a", "2026-05-05", []), // oldest
  ];

  it("returns null next for the newest post", () => {
    expect(findPrevNext(posts, "c")).toEqual({ next: null, prev: posts[1] });
  });

  it("returns both neighbors for a middle post", () => {
    expect(findPrevNext(posts, "b")).toEqual({ next: posts[0], prev: posts[2] });
  });

  it("returns null prev for the oldest post", () => {
    expect(findPrevNext(posts, "a")).toEqual({ next: posts[1], prev: null });
  });

  it("returns nulls for an unknown slug", () => {
    expect(findPrevNext(posts, "missing")).toEqual({ next: null, prev: null });
  });
});

describe("findRelatedPosts", () => {
  const posts: Post[] = [
    fixture("target", "2026-05-15", ["ai", "testing"]),
    fixture("a", "2026-05-10", ["ai", "testing", "agents"]),
    fixture("b", "2026-05-05", ["ai"]),
    fixture("c", "2026-05-01", ["unrelated"]),
  ];

  it("ranks by tag overlap, then recency", () => {
    const related = findRelatedPosts(posts, "target");
    expect(related.map((p) => p.slug)).toEqual(["a", "b"]);
  });

  it("returns an empty list for an unknown slug", () => {
    expect(findRelatedPosts(posts, "missing")).toEqual([]);
  });

  it("excludes the target itself even if it would otherwise rank highest", () => {
    const related = findRelatedPosts(posts, "target");
    expect(related.find((p) => p.slug === "target")).toBeUndefined();
  });
});
