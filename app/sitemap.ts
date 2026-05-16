import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/blog";
import { getAllProjects } from "@/lib/content/projects";
import { site } from "@/lib/site-config";

// Required when `output: "export"` is set in next.config.ts.
export const dynamic = "force-static";

/*
  Static-export sitemap. Static routes are listed explicitly so a new
  page only ships once it is intentional; project detail and blog post
  routes are enumerated dynamically from content/. CI build emits
  /sitemap.xml.
*/
const staticRoutes = ["/", "/about", "/resume", "/contact", "/projects", "/blog"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);

  return [
    ...staticRoutes.map((path) => ({
      url: new URL(path, site.url).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: new URL(`/projects/${p.slug}`, site.url).toString(),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: new URL(`/blog/${p.slug}`, site.url).toString(),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
