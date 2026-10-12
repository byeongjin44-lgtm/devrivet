import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "json-formatter")!;

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

export default function JsonFormatterPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<JsonFormatterTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Why format or validate JSON?
            </h2>
            <p>
              JSON produced by APIs or config files is often minified or hard to scan. Pretty-printing
              adds consistent indentation so nested objects and arrays are easy to read, while minifying
              strips whitespace for a compact payload. Validation catches syntax mistakes — like trailing
              commas or missing quotes — before they break your application.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Paste JSON into the input box, then click Format to pretty-print it, Minify to compact it,
              or Validate to check it without changing the output. If the JSON is invalid, the line and
              column of the problem are shown whenever the browser provides that information.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              Formatting{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                {`{"name":"DevRivet","active":true}`}
              </code>{" "}
              produces indented, readable JSON.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Is my JSON uploaded anywhere?
                </p>
                <p>No. Formatting, minifying, and validation all run locally using your browser&apos;s built-in JSON engine.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why does my JSON say invalid but looks fine?
                </p>
                <p>
                  Common causes are trailing commas, single quotes instead of double quotes, or unquoted
                  property names — none of which are valid JSON, even though they&apos;re valid in
                  JavaScript object literals.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
