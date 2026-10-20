import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PrivacyNote } from "@/components/PrivacyNote";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, getRelatedTools } from "@/lib/site-config";

type ToolPageLayoutProps = {
  title: string;
  description: string;
  path: string;
  tool: ReactNode;
  info: ReactNode;
};

export function ToolPageLayout({ title, description, path, tool, info }: ToolPageLayoutProps) {
  const relatedTools = getRelatedTools(path);
  return (
    <Container className="flex flex-1 flex-col gap-8 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: title,
          description,
          url: `${SITE_URL}${path}`,
          applicationCategory: "DeveloperApplication",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {title}
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">{description}</p>
        <PrivacyNote />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {tool}
      </div>

      <AdSlot id="tool-bottom" />

      <article className="prose-sm flex max-w-none flex-col gap-6 text-sm text-zinc-700 dark:text-zinc-300">
        {info}
      </article>

      {relatedTools.length > 0 && (
        <nav aria-labelledby="related-tools" className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <h2 id="related-tools" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Related tools
          </h2>
          <ul className="flex flex-col gap-1">
            {relatedTools.map((related) => (
              <li key={related.slug}>
                <Link href={related.path} className="font-medium text-zinc-900 underline dark:text-zinc-50">
                  {related.name}
                </Link>{" "}
                — {related.shortDescription}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Container>
  );
}
