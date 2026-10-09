import type { MetadataRoute } from "next";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const STATIC_PATHS = ["/", "/about", "/privacy", "/terms", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPaths = TOOLS.map((tool) => tool.path);
  return [...STATIC_PATHS, ...toolPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
}
