import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
