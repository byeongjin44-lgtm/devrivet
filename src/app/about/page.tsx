import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { CONTACT_EMAIL, SITE_NAME, TOOLS } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `About — ${SITE_NAME}`,
  description: `About ${SITE_NAME}, a free collection of ${TOOLS.length} browser-based developer tools and practical guides.`,
  path: "/about",
});

const linkClass = "font-medium text-zinc-900 underline dark:text-zinc-50";
const h2Class = "pt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50";

export default function AboutPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">About {SITE_NAME}</h1>
      <p>
        {SITE_NAME} is a free collection of {TOOLS.length} focused, fast developer tools that run entirely in
        your browser:
      </p>
      <ul className="list-disc pl-5">
        {TOOLS.map((tool) => (
          <li key={tool.slug}>
            <Link href={tool.path} className={linkClass}>
              {tool.name}
            </Link>{" "}
            — {tool.shortDescription}
          </li>
        ))}
      </ul>

      <h2 className={h2Class}>How the tools work</h2>
      <p>
        There is no sign-up, no login, and no backend processing of your input. Everything you paste —
        JSON, SQL, tokens, regular expressions — is processed by JavaScript in your own browser and is
        never sent to our servers. Each tool is built to load quickly and work the same on desktop and
        mobile.
      </p>
      <p>
        The site stays focused on everyday developer tasks: encoding, formatting, identifiers, hashing and
        time. We would rather keep a small set of tools correct and fast than add many half-finished ones.
      </p>

      <h2 className={h2Class}>Guides</h2>
      <p>
        The{" "}
        <Link href="/blog" className={linkClass}>
          blog
        </Link>{" "}
        publishes short, practical guides tied to these tools — cron schedules, JSON errors, regex patterns
        and similar questions that come up while coding. Each guide is reviewed before it is published and
        links to the tool it is about, so you can try the example right away.
      </p>

      <h2 className={h2Class}>Corrections and feedback</h2>
      <p>
        If you find a mistake in a tool or a guide, or a case a tool does not handle, please tell us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
          {CONTACT_EMAIL}
        </a>{" "}
        or through the{" "}
        <Link href="/contact" className={linkClass}>
          contact page
        </Link>
        . We fix confirmed errors, and corrected guides show an &quot;Updated&quot; date.
      </p>
    </Container>
  );
}
