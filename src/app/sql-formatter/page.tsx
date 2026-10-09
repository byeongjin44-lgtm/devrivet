import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { SqlFormatterTool } from "@/components/tools/SqlFormatterTool";
import { SITE_URL, TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "sql-formatter")!;

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

export default function SqlFormatterPage() {
  return (
    <ToolPageLayout
      title={tool.name}
      description={tool.shortDescription}
      path={tool.path}
      tool={<SqlFormatterTool />}
      info={
        <>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Why format SQL?
            </h2>
            <p>
              Consistent indentation and keyword casing make SQL queries far easier to read, review, and
              debug — especially long queries with multiple joins, subqueries, or conditions. A formatter
              removes the need to manually align clauses.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              How to use this tool
            </h2>
            <p>
              Paste your SQL query, choose the dialect that matches your database (Standard SQL, MySQL,
              PostgreSQL, SQL Server, or SQLite), and click Format. The formatted result appears below,
              ready to copy. Dialect-specific syntax such as PostgreSQL&apos;s{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">::type</code>{" "}
              casts or SQL Server&apos;s{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">TOP</code>{" "}
              clause is handled correctly.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">FAQ</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Is my SQL sent to a server?
                </p>
                <p>No. Formatting runs entirely in your browser using a local JavaScript library.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  What if my query has a syntax error?
                </p>
                <p>The tool shows a clear error message instead of crashing, so you can fix the query and try again.</p>
              </div>
            </div>
          </section>
        </>
      }
    />
  );
}
