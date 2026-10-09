import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "base64")!;

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

export default function Base64Page() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<Base64Tool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">What is Base64?</h2>
            <p>
              Base64 is a binary-to-text encoding scheme that represents data using 64 printable ASCII
              characters (A–Z, a–z, 0–9, +, /). It is commonly used to embed binary data — such as images
              or files — inside text formats like JSON, HTML, or email, where raw binary bytes aren&apos;t
              safe to transmit directly.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">How to use this tool</h2>
            <p>
              Choose &quot;Encode&quot; to convert plain text into Base64, or &quot;Decode&quot; to convert
              Base64 back into readable text. Paste or type your input, and the result updates
              automatically. Use the Copy button to copy the output, or Clear to start over. This tool
              fully supports UTF-8 text, including Korean and emoji characters.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              Encoding <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">hello</code>{" "}
              produces{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">aGVsbG8=</code>.
              Decoding it returns the original text.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Is my data uploaded anywhere?</p>
                <p>No. Encoding and decoding happen entirely in your browser using built-in Web APIs.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why do I get an &quot;invalid Base64&quot; error?
                </p>
                <p>
                  This happens when the input contains characters outside the Base64 alphabet, or has an
                  incorrect length/padding. Double-check that you copied the full encoded string.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
