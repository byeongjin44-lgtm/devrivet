import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { UuidTool } from "@/components/tools/UuidTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "uuid-generator")!;

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

export default function UuidGeneratorPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<UuidTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is a UUID?
            </h2>
            <p>
              A UUID (Universally Unique Identifier) is a 128-bit identifier that is virtually guaranteed
              to be unique across time and systems, with no central coordination required. UUID v4 is
              fully random, while UUID v7 is time-ordered — it embeds a timestamp, so newly generated
              IDs sort chronologically. This makes v7 a good fit for database primary keys where index
              locality matters.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Pick UUID v4 or v7 and click Generate for a single identifier, or use the Bulk Generator to
              create up to 1,000 at once. Paste any UUID into the Validator to check whether it is
              well-formed and which version it is.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              A UUID v4 looks like{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                9b2f1e3a-7c4d-4a1b-8f3e-1234567890ab
              </code>
              .
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Which version should I use?
                </p>
                <p>
                  Use v4 for general-purpose random IDs. Use v7 when you want IDs that sort by creation
                  time, such as database primary keys.
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Are these UUIDs cryptographically secure?
                </p>
                <p>
                  Yes. Generation uses the RFC 9562 compliant <code>uuid</code> library backed by your
                  browser&apos;s cryptographically secure random number generator.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
