import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Contact — ${SITE_NAME}`,
  description: `Contact information for ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Contact</h1>
      <p>
        Found a bug, have feedback, or want to suggest a new developer tool? We&apos;d like to hear from
        you.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:contact@example.com" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          contact@example.com
        </a>
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This address is a placeholder — update it in {`src/app/contact/page.tsx`} once {SITE_NAME}&apos;s
        real contact details are finalized.
      </p>
    </Container>
  );
}
