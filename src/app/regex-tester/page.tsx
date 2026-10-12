import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "regex-tester")!;

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

const code = "rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800";

export default function RegexTesterPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description="A JavaScript regular expression tester: see every match, its index and capture groups, highlighted in your text."
      path={tool.path}
      tool={<RegexTesterTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              What is a regular expression?
            </h2>
            <p>
              A regular expression (regex) is a pattern that describes a set of strings. Developers use
              them to validate input, search logs, and extract pieces of text — for example, every number
              in a line or every email-like token in a file. This tester uses your browser&apos;s
              built-in JavaScript <code className={code}>RegExp</code> engine, so results match what
              you&apos;ll get in JavaScript and Node.js. Other engines (PCRE, Python, Java) differ in
              some details.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use the Regex Tester
            </h2>
            <p>
              Type the pattern without the surrounding slashes, pick the flags you need, paste your test
              string, and press Test (or Enter in the pattern field). You&apos;ll see whether it
              matched, how many matches there are, each match&apos;s text and index, and the value of
              every capture group. Up to 1,000 matches are shown.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              JavaScript regex flags
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code className={code}>g</code> — global: find all matches instead of stopping at the first.
              </li>
              <li>
                <code className={code}>i</code> — ignore case: <code className={code}>a</code> also matches{" "}
                <code className={code}>A</code>.
              </li>
              <li>
                <code className={code}>m</code> — multiline: <code className={code}>^</code> and{" "}
                <code className={code}>$</code> match at the start and end of each line.
              </li>
              <li>
                <code className={code}>s</code> — dotAll: <code className={code}>.</code> also matches
                newline characters.
              </li>
              <li>
                <code className={code}>u</code> — unicode: treats emoji and other astral characters as one
                character and enables <code className={code}>\p&#123;...&#125;</code> property escapes.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>
              The pattern <code className={code}>\d+</code> with the <code className={code}>g</code> flag
              on the text <code className={code}>Order 123, Order 456</code> finds 2 matches:{" "}
              <code className={code}>123</code> at index 6 and <code className={code}>456</code> at index
              17. Wrapping part of a pattern in parentheses, like{" "}
              <code className={code}>Order (\d+)</code>, captures just the number as group 1.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">Is my text sent anywhere?</h3>
                <p>No. Patterns and test strings are evaluated entirely in your browser.</p>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                  Why does my pattern show &quot;Invalid regular expression&quot;?
                </h3>
                <p>
                  The pattern has a syntax error, such as an unclosed{" "}
                  <code className={code}>[</code> or <code className={code}>(</code>, or a quantifier with
                  nothing to repeat. The message from the JavaScript engine points to the problem.
                </p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
