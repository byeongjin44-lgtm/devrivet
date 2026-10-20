import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "json-formatter")!;

// Formatted output is the tool's actual Format result for this input (verified in src/app/seo.test.tsx).
const JSON_EXAMPLE_MINIFIED = '{"name":"DevRivet","tools":10,"private":true,"tags":["json","regex","hash"]}';
const JSON_EXAMPLE_FORMATTED = `{
  "name": "DevRivet",
  "tools": 10,
  "private": true,
  "tags": [
    "json",
    "regex",
    "hash"
  ]
}`;

export const metadata = toolMetadata(tool);

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
            <p>Formatting this minified API response:</p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-800">
              {JSON_EXAMPLE_MINIFIED}
            </pre>
            <p className="mt-2">produces JSON indented with 2 spaces:</p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-800">
              {JSON_EXAMPLE_FORMATTED}
            </pre>
            <p className="mt-2">Minify turns the formatted version back into the single line above.</p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Common error: trailing comma
            </h2>
            <p>
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                {`{"name":"DevRivet","tools":10,}`}
              </code>{" "}
              is invalid because JSON does not allow a comma before the closing brace. In Chrome the tool
              reports the problem at Line 1, Column 31 — the <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">{"}"}</code>{" "}
              right after the comma. The exact error wording comes from your browser&apos;s JSON engine, so it
              differs between browsers, and some browsers don&apos;t report a position. Remove the comma
              and the JSON validates.
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
