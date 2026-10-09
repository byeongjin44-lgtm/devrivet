import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `About — ${SITE_NAME}`,
  description: `About ${SITE_NAME}, a free collection of browser-based developer tools.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} is a free collection of focused, fast developer utilities — Base64 encoding, UUID
        generation, SQL formatting, and cron expression building — that run entirely in your browser.
      </p>
      <p>
        There is no sign-up, no login, and no backend processing of your input. Each tool is built to
        load quickly and work the same on desktop and mobile.
      </p>
      <p>
        We intentionally keep this site focused on developer utilities. We do not mix in unrelated
        categories like image editing, timers, or calculators — those may become separate, dedicated
        sites in the future.
      </p>
    </Container>
  );
}
