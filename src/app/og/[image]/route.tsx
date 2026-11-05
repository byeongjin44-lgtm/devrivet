import { ImageResponse } from "next/og";
import { getAllPosts } from "@/lib/blog";
import { OG_SIZE } from "@/lib/og";
import { SITE_NAME, SITE_URL, TOOLS } from "@/lib/site-config";

// Share-preview images, written to out/og/<key>.png at build time (keys come from `ogImageKey`).
export const dynamic = "force-static";
export const dynamicParams = false;

type Card = { label: string; title: string; subtitle: string };

function cards(): Record<string, Card> {
  const all: Record<string, Card> = {
    home: {
      label: "Free developer tools",
      title: "Format, decode and test in your browser",
      subtitle: `${TOOLS.length} tools: JSON, SQL, Base64, JWT, regex, cron, UUID, hash, URL and timestamps.`,
    },
  };
  for (const t of TOOLS) all[t.slug] = { label: "Tool", title: t.name, subtitle: t.shortDescription };
  for (const p of getAllPosts()) {
    const tool = TOOLS.find((t) => t.slug === p.relatedTool);
    all[`blog-${p.slug}`] = { label: "Guide", title: p.title, subtitle: tool ? `Try it with the free ${tool.name}` : SITE_NAME };
  }
  return all;
}

export function generateStaticParams() {
  return Object.keys(cards()).map((key) => ({ image: `${key}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const key = (await params).image.replace(/\.png$/, "");
  const card = cards()[key] ?? cards().home;
  const domain = SITE_URL.replace(/^https:\/\//, "");
  const titleSize = card.title.length > 60 ? 54 : card.title.length > 35 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#ffffff",
          borderBottom: "16px solid #18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#18181b",
              color: "#fafafa",
              fontSize: 40,
              fontWeight: 700,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            D
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#18181b" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#18181b", textTransform: "uppercase", letterSpacing: 2 }}>
            {card.label}
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, color: "#18181b", lineHeight: 1.1 }}>{card.title}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#52525b", lineHeight: 1.3 }}>{card.subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#71717a" }}>{domain}</div>
      </div>
    ),
    OG_SIZE,
  );
}
