import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { HashGeneratorTool } from "@/components/tools/HashGeneratorTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "hash-generator")!;

export const metadata = toolMetadata(tool);

const code = "rounded bg-zinc-100 px-1 py-0.5 font-mono break-all dark:bg-zinc-800";

export default function HashGeneratorPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<HashGeneratorTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is a cryptographic hash?
            </h2>
            <p>
              A cryptographic hash function turns input of any length into a fixed-length fingerprint.
              The same input always gives the same hash, and changing even one character gives a
              completely different one. Hashes are used to verify file and download integrity, compare
              data without storing it, build cache keys, and inside signatures and protocols. This tool
              hashes the UTF-8 bytes of your text using your browser&apos;s built-in Web Crypto API and
              shows the result as hexadecimal.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Hashing vs encryption
            </h2>
            <p>
              Hashing is one-way: there is no key and no way to turn a hash back into the original text.
              Encryption is two-way: data encrypted with a key can be decrypted with the right key. A
              hash is not encryption, so don&apos;t use it to &quot;hide&quot; data you need to read
              back later.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">SHA-256 example</h2>
            <p>
              The SHA-256 hash of <code className={code}>hello world</code> is{" "}
              <code className={code}>b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9</code>.
              Note that whitespace matters: a trailing newline or a Windows line ending (
              <code className={code}>\r\n</code>) produces a different hash.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Security note</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                SHA-1 is considered cryptographically weak and should not be used for security-sensitive
                purposes. Prefer SHA-256 or stronger.
              </li>
              <li>
                Do not use simple SHA hashes for password storage. Fast hashes can be brute-forced
                quickly; passwords need a slow, salted algorithm such as Argon2, scrypt, or bcrypt, run on
                your server.
              </li>
              <li>MD5 is intentionally not offered: it is broken and not supported by Web Crypto.</li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Is my text uploaded?</h3>
                <p>No. Hashing runs locally with your browser&apos;s Web Crypto API.</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why doesn&apos;t my hash match the one from another tool?
                </h3>
                <p>
                  Usually the input differs invisibly — a trailing newline (common with{" "}
                  <code className={code}>echo</code>; use <code className={code}>printf</code> instead),
                  different line endings, or a different text encoding. This tool always hashes UTF-8.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
