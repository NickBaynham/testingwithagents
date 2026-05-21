import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

// `remark-frontmatter` strips the YAML `---...---` block from the MDX AST.
// Without it, the MDX compiler renders the frontmatter as a thematic-break +
// paragraph + thematic-break and the YAML literal leaks into the page body.
// Frontmatter values are still consumed separately via gray-matter in the
// content loaders (lib/content/blog.ts, lib/content/projects.ts).
// Turbopack requires plugins as serializable [name, options] tuples rather
// than function references.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: { remarkPlugins: [["remark-frontmatter", { type: "yaml", marker: "-" }]] },
});

export default withMDX(nextConfig);
