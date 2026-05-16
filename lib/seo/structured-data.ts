import type { Post } from "@/lib/content/blog";
import type { Project } from "@/lib/content/projects";
import { site } from "@/lib/site-config";

/*
  JSON-LD builders for schema.org structured data.

  - Pure functions: each takes the minimum it needs and returns a JSON-LD
    object. Pages render the result via <JsonLd> (components/seo/JsonLd.tsx).
  - URLs are absolute and built against `site.url` so the schema works in
    isolation when crawlers pull it.
*/

export type JsonLdObject = Record<string, unknown>;

export function personJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: `mailto:${site.contactEmail}`,
    sameAs: [site.social.linkedin, site.social.github],
    description:
      "Software testing and automation engineer focused on AI-augmented quality engineering.",
    jobTitle: "Software testing and quality engineering",
  };
}

export type BreadcrumbItem = {
  name: string;
  /** Path relative to the site root, e.g. "/blog/foo". A trailing slash is added if missing. */
  path: string;
};

export function breadcrumbListJsonLd(items: readonly BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: new URL(item.path.endsWith("/") ? item.path : `${item.path}/`, site.url).toString(),
    })),
  };
}

export function blogPostingJsonLd(post: Post): JsonLdObject {
  const url = new URL(`/blog/${post.slug}/`, site.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    keywords: [...post.categories, ...post.tags].join(", "),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}

export function creativeWorkJsonLd(project: Project): JsonLdObject {
  const url = new URL(`/projects/${project.slug}/`, site.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    keywords: [...project.categories, ...project.technologies].join(", "),
    creativeWorkStatus: project.status,
    url,
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
  };
}
