import type { MetadataRoute } from "next";
import { SITE_URL, TOOLS } from "@/lib/site-config";

// Required by `output: "export"` so sitemap.xml is generated once at build time.
export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/about", "/privacy", "/terms", "/contact"];

// No lastModified: a build-time timestamp would change on every deploy without the content
// changing, which makes lastmod untrustworthy to search engines. Add real per-page dates only
// if they are ever tracked.
export default function sitemap(): MetadataRoute.Sitemap {
  const toolPaths = TOOLS.map((tool) => tool.path);
  return [...STATIC_PATHS, ...toolPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
}
