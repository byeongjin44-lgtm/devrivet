import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "jwt-decoder")!;

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
