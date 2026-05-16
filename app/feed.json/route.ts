import { getAllPosts } from "@/lib/content/blog";
import { site } from "@/lib/site-config";

// Required when `output: "export"` is set in next.config.ts.
export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.name} - ${site.tagline}`,
    home_page_url: new URL("/blog", site.url).toString(),
    feed_url: new URL("/feed.json", site.url).toString(),
    description: "Notes on AI-augmented software testing and agentic workflows.",
    language: "en-US",
    authors: [{ name: site.name, url: site.url }],
    items: posts.map((post) => ({
      id: new URL(`/blog/${post.slug}/`, site.url).toString(),
      url: new URL(`/blog/${post.slug}/`, site.url).toString(),
      title: post.title,
      summary: post.excerpt,
      content_text: post.excerpt,
      date_published: new Date(`${post.publishedAt}T12:00:00Z`).toISOString(),
      date_modified: post.updatedAt
        ? new Date(`${post.updatedAt}T12:00:00Z`).toISOString()
        : new Date(`${post.publishedAt}T12:00:00Z`).toISOString(),
      authors: [{ name: site.name, url: site.url }],
      tags: [...post.categories, ...post.tags],
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
