import { getAllPosts } from "@/lib/content/blog";
import { site } from "@/lib/site-config";

// Required when `output: "export"` is set in next.config.ts.
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();
  const lastBuildDate = new Date().toUTCString();
  const blogUrl = new URL("/blog", site.url).toString();
  const rssUrl = new URL("/rss.xml", site.url).toString();

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.slug}/`, site.url).toString();
      const pubDate = new Date(`${post.publishedAt}T12:00:00Z`).toUTCString();
      const categories = [...post.categories, ...post.tags]
        .map((c) => `<category>${escapeXml(c)}</category>`)
        .join("");
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${escapeXml(post.excerpt)}</description>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} - ${site.tagline}`)}</title>
    <link>${blogUrl}</link>
    <atom:link href="${rssUrl}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml("Notes on AI-augmented software testing and agentic workflows.")}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
