import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `Privacy Policy — ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
      <p>Last updated: 2026-10-09</p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Tool input</h2>
      <p>
        Tool inputs are processed locally in your browser and are not intentionally transmitted to or
        stored on our servers.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No accounts, no database</h2>
      <p>
        {SITE_NAME} does not require account creation and does not operate a database of user content.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Analytics and advertising
      </h2>
      {/* TODO(analytics): Cloudflare Web Analytics is planned but NOT enabled yet (see ANALYTICS.md).
          When it is actually switched on, update this section to disclose it and what it collects. */}
      <p>
        We do not currently run analytics or advertising on this site. If we enable these in the future
        (for example, Google AdSense), this policy will be updated beforehand to describe what data is
        collected and how it is used.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Hosting logs</h2>
      <p>
        Like most websites, our hosting provider may collect standard server logs (such as IP address
        and request metadata) for security and operational purposes. This is separate from the content
        you type into our tools.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Contact</h2>
      <p>Questions about this policy can be sent via the Contact page.</p>
    </Container>
  );
}
