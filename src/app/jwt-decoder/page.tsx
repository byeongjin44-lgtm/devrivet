import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "jwt-decoder")!;

export const metadata = toolMetadata(tool);

export default function JwtDecoderPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<JwtDecoderTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">What is a JWT?</h2>
            <p>
              A JSON Web Token (JWT) is a compact, URL-safe token format commonly used for authentication
              and authorization. It has three Base64URL-encoded parts separated by dots: a header
              (algorithm and token type), a payload (claims, such as the subject and expiration), and a
              signature.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Paste a JWT to see its decoded header and payload as readable JSON, along with any{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">iat</code>,{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">nbf</code>, and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">exp</code> claims
              converted to human-readable dates. This tool only decodes — it never checks the signature,
              since that would require the issuer&apos;s secret or public key.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              Click <strong>Load sample</strong> to decode a well-known example token. Its header is{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                {`{"alg":"HS256","typ":"JWT"}`}
              </code>{" "}
              — an HMAC-SHA256 signed JWT — and its payload is{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
                {`{"sub":"1234567890","name":"John Doe","iat":1516239022}`}
              </code>
              . The tool shows <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">iat</code>{" "}
              as <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">2018-01-18 01:30:22 UTC</code>.
              The sample has no <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">exp</code>{" "}
              claim, so no expiry status is shown.
            </p>
            <p className="mt-2">The three time claims are Unix timestamps in seconds:</p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              <li>
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">iat</code> (issued at) —
                when the token was created.
              </li>
              <li>
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">nbf</code> (not before) —
                the token must not be accepted before this time.
              </li>
              <li>
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">exp</code> (expiration) —
                the token must not be accepted after this time. When it is present, the tool tells you whether
                the token is already expired, based on your device&apos;s clock.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Does this verify the token is valid/trusted?
                </p>
                <p>
                  No. Decoding only reveals the claims a token carries — it does not prove the token
                  wasn&apos;t tampered with. Signature verification requires the issuer&apos;s secret key
                  and should happen on your server, not in a public browser tool.
                </p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Is my token sent anywhere?
                </p>
                <p>
                  No. Decoding happens entirely in your browser. That said, treat real tokens as
                  sensitive — avoid pasting production tokens into any tool you don&apos;t fully trust.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
