import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

// Required when `output: "export"` is set in next.config.ts.
export const dynamic = "force-static";

/*
  Static-export sitemap. Routes are listed explicitly so a new page only
  ships once it is intentional. Add an entry when a new route lands; the
  CI build emits /sitemap.xml.
*/
const routes = ["/", "/about", "/resume", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
