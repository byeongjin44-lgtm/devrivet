import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "base64")!;

export const metadata = toolMetadata(tool);

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
            <p className="mt-2">
              Text is converted to UTF-8 bytes before encoding, so non-ASCII text round-trips correctly:{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">안녕하세요</code>{" "}
              (Korean for &quot;hello&quot;) encodes to{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">7JWI64WV7ZWY7IS47JqU</code>.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Base64 is not encryption</h2>
            <p>
              Base64 only changes how bytes are written; there is no key and no secret. Anyone can decode a
              Base64 string, so never use it to protect passwords, tokens, or other sensitive data.
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
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Can I decode URL-safe Base64 or a JWT segment here?
                </p>
                <p>
                  Not reliably. This tool decodes standard Base64 (the <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">+</code>{" "}
                  and <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">/</code> alphabet,
                  padded with <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">=</code> to a
                  multiple of 4 characters). JWTs use Base64URL, which replaces those characters with{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">-</code> and{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">_</code> and drops the
                  padding, so those segments are often rejected. To read a token, use the JWT Decoder instead.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
