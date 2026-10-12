import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "url-encoder")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.metaDescription,
  alternates: { canonical: `${SITE_URL}${tool.path}` },
  openGraph: {
    title: tool.title,
    description: tool.metaDescription,
    url: `${SITE_URL}${tool.path}`,
  },
};

export default function UrlEncoderPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<UrlEncoderTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is URL encoding?
            </h2>
            <p>
              URL encoding (percent-encoding) replaces characters that aren&apos;t safe inside a URL —
              spaces, &amp;, =, and others — with a % followed by their hex code. This lets arbitrary text
              be safely embedded as a query parameter value or path segment.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Choose Encode or Decode, then type or paste your text. This tool uses JavaScript&apos;s{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">encodeURIComponent</code>{" "}
              / <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">decodeURIComponent</code>{" "}
              — the right choice for encoding a single value (like a query parameter), since it escapes{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">&amp;</code> and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">=</code> too. If
              you needed to encode an entire URL while keeping its structure (like{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">://</code> and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">?</code>) intact,
              you&apos;d want <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">encodeURI</code>{" "}
              instead, which this tool does not use.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              Encoding{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                name=John Doe&amp;city=New York
              </code>{" "}
              produces{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                name%3DJohn%20Doe%26city%3DNew%20York
              </code>
              .
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why do I get an error when decoding?
                </p>
                <p>
                  Decoding fails when the input contains invalid percent-encoding, such as{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">%ZZ</code>{" "}
                  or a truncated <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">%</code>{" "}
                  sequence. Double-check you copied the full encoded string.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
