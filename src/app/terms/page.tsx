import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Terms of Use — ${SITE_NAME}`,
  description: `Terms of use for ${SITE_NAME}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Terms of Use</h1>
      <p>Last updated: 2026-10-09</p>
      <p>
        {SITE_NAME} is provided free of charge, &quot;as is&quot;, without warranty of any kind. You are
        responsible for verifying the correctness of any output (encoded text, generated identifiers,
        formatted SQL, or cron expressions) before relying on it in production systems.
      </p>
      <p>
        You may not use this site to attempt to disrupt its operation, probe it for security
        vulnerabilities without authorization, or use it for any unlawful purpose.
      </p>
      <p>
        We may update these terms or the tools offered on this site at any time. Continued use of the
        site after changes constitutes acceptance of the updated terms.
      </p>
    </Container>
  );
}
