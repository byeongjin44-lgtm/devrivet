import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { UuidTool } from "@/components/tools/UuidTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "uuid-generator")!;

export const metadata = toolMetadata(tool);

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
              . The <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">4</code> at the
              start of the third group is the version.
            </p>
            <p className="mt-2">
              A UUID v7 looks like{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                01a139bf-b332-75b9-81d3-bcd3cba532f2
              </code>
              . Its first 12 hex digits (<code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">01a139bfb332</code>)
              are a Unix timestamp in milliseconds — here 2026-10-14 09:30:26.994 UTC — which is why v7 IDs
              generated later sort after earlier ones. Pasting either value into the Validator reports{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">Valid UUID v4</code> or{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">Valid UUID v7</code>.
            </p>
            <p className="mt-2">
              To seed test data, set the Bulk Generator count to 1000 and copy all IDs at once — one UUID
              per line.
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
