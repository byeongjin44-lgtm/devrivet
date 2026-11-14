import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "url-encoder")!;

export const metadata = toolMetadata(tool);

const code = "rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800";

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
              What is URL percent encoding?
            </h2>
            <p>
              URL encoding (percent-encoding) replaces characters that aren&apos;t safe inside a URL —
              spaces, &amp;, =, and others — with a % followed by their hex code. This lets arbitrary text
              be safely embedded as a query parameter value or path segment.
            </p>
            <p className="mt-2">
              The rules come from RFC 3986. Letters, digits and{" "}
              <code className={code}>- . _ ~</code> are <em>unreserved</em> and never need encoding.
              Characters such as <code className={code}>: / ? # &amp; = +</code> are <em>reserved</em>:
              they have a structural meaning in a URL, so they must be encoded when they appear inside a
              value. Every other character is first converted to its UTF-8 bytes, and each byte is written
              as <code className={code}>%</code> plus two hex digits — <code className={code}>é</code>{" "}
              becomes <code className={code}>%C3%A9</code> and a space becomes{" "}
              <code className={code}>%20</code>.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              encodeURIComponent vs encodeURI
            </h2>
            <p>
              JavaScript has two built-in percent-encoding functions. The difference is which reserved
              characters they leave alone.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-1.5 pr-3 font-medium text-zinc-900 dark:text-zinc-50"></th>
                    <th className="py-1.5 pr-3 font-medium text-zinc-900 dark:text-zinc-50">encodeURIComponent</th>
                    <th className="py-1.5 font-medium text-zinc-900 dark:text-zinc-50">encodeURI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <td className="py-1.5 pr-3">Use for</td>
                    <td className="py-1.5 pr-3">One value: a query parameter or path segment</td>
                    <td className="py-1.5">A whole URL whose structure must survive</td>
                  </tr>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <td className="py-1.5 pr-3">Leaves unencoded</td>
                    <td className="py-1.5 pr-3 font-mono">A–Z a–z 0–9 - _ . ! ~ * &apos; ( )</td>
                    <td className="py-1.5 font-mono">the same, plus ; , / ? : @ &amp; = + $ #</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-3">Decoder</td>
                    <td className="py-1.5 pr-3 font-mono">decodeURIComponent</td>
                    <td className="py-1.5 font-mono">decodeURI</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Given <code className={`${code} break-all`}>https://example.com/a b?q=1&amp;r=a/b#top</code>:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <code className={code}>encodeURI</code> gives{" "}
                <code className={`${code} break-all`}>https://example.com/a%20b?q=1&amp;r=a/b#top</code> —
                only the space changes, so the URL still works.
              </li>
              <li>
                <code className={code}>encodeURIComponent</code> gives{" "}
                <code className={`${code} break-all`}>
                  https%3A%2F%2Fexample.com%2Fa%20b%3Fq%3D1%26r%3Da%2Fb%23top
                </code>{" "}
                — everything is escaped, which is what you want when this whole URL is itself the value of a
                parameter, such as a <code className={code}>?redirect=</code> target.
              </li>
            </ul>
            <p className="mt-2">
              The common bug is using <code className={code}>encodeURI</code> on a single value: a value of{" "}
              <code className={code}>a&amp;b</code> stays <code className={code}>a&amp;b</code> and splits
              into two query parameters. Build query strings with{" "}
              <code className={code}>encodeURIComponent</code> for each value, or with{" "}
              <code className={code}>URLSearchParams</code> — note that{" "}
              <code className={code}>URLSearchParams</code> writes spaces as{" "}
              <code className={code}>+</code> (form encoding), not <code className={code}>%20</code>.
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
              <code className="break-all rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                name%3DJohn%20Doe%26city%3DNew%20York
              </code>
              .
            </p>
            <p className="mt-2">
              Non-ASCII text is encoded as its UTF-8 bytes:{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">안녕하세요</code>{" "}
              becomes{" "}
              <code className="break-all rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                %EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94
              </code>
              , and decoding that string gives back the original Korean text.
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
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why is a space encoded as %20 and not +?
                </p>
                <p>
                  Percent-encoding writes a space as{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">%20</code>. Using{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">+</code> for a space
                  is a separate convention from HTML form encoding (
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">application/x-www-form-urlencoded</code>
                  ). This tool follows <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">encodeURIComponent</code>,
                  so a literal plus sign is escaped:{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">a b+c</code> encodes to{" "}
                  <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">a%20b%2Bc</code>. When
                  decoding, a <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">+</code> is
                  kept as a plus sign, not turned into a space.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
