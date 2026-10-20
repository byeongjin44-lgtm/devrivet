import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { TimestampConverterTool } from "@/components/tools/TimestampConverterTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "timestamp-converter")!;

export const metadata = toolMetadata(tool);

export default function TimestampConverterPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<TimestampConverterTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is a Unix timestamp?
            </h2>
            <p>
              A Unix timestamp counts the number of seconds (or milliseconds) since January 1, 1970,
              00:00:00 UTC — the &quot;Unix epoch&quot;. It&apos;s timezone-independent: the number itself
              represents one exact instant, and only its human-readable display depends on which
              timezone you choose to view it in.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Use Timestamp → Date to convert a Unix timestamp into a readable UTC and local date — the
              unit (seconds or milliseconds) is auto-detected from the number of digits, or you can pick
              it explicitly. Use Date → Timestamp to pick a date and time in your browser&apos;s local
              timezone and get both Unix seconds and milliseconds. The Current Unix Timestamp section
              shows right now&apos;s timestamp, refreshed on demand.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              The timestamp{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">0</code> converts
              to <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">1970-01-01 00:00:00 UTC</code>.
            </p>
            <p className="mt-2">
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">1704067200</code> (10
              digits, read as seconds) and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">1704067200000</code> (13
              digits, read as milliseconds) are the same instant:{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">2024-01-01 00:00:00 UTC</code>.
              The Local field shows that instant in your browser&apos;s timezone — for example 09:00 on
              January 1, 2024 in Seoul (UTC+9), or 19:00 on December 31, 2023 in New York (UTC−5).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  How does the tool know if my timestamp is seconds or milliseconds?
                </p>
                <p>
                  By digit count: 10 digits or fewer is treated as seconds (covers dates up to the year
                  2286), anything longer as milliseconds. You can override this with the unit selector.
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Which timezone is the Date → Timestamp input in?
                </p>
                <p>Your browser&apos;s local timezone, shown underneath the date picker.</p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
