import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { CronTool } from "@/components/tools/CronTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "cron-generator")!;

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

export default function CronGeneratorPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<CronTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is a cron expression?
            </h2>
            <p>
              A cron expression is a compact way to describe a recurring schedule, used by cron jobs,
              CI/CD pipelines, and task schedulers. It has five fields — minute, hour, day of month,
              month, and day of week — each of which can be a specific value, a range, a step
              (<code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">*/5</code>), or
              a wildcard (<code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">*</code>).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Pick a preset, or fill in the custom minute/hour/day/month/weekday fields to build an
              expression. The generated expression is explained in plain English below, validated
              automatically, and its next upcoming run times are listed using your browser&apos;s local
              timezone. You can also paste an existing cron expression directly into the expression field
              to explain and validate it.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">0 9 * * 1-5</code>{" "}
              means &quot;every weekday at 9:00 AM&quot;.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  What timezone are the next run times in?
                </p>
                <p>
                  Your browser&apos;s local timezone, shown above the results. Cron schedulers running on
                  a server may use a different timezone — check your scheduler&apos;s configuration.
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Does this support 6-field cron with seconds?
                </p>
                <p>This tool supports the standard 5-field cron format (minute hour day month weekday).</p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
