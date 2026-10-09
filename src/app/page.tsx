import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL, TOOLS } from "@/lib/site-config";

export default function Home() {
  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {SITE_NAME}
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">{SITE_TAGLINE}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </Container>
  );
}
