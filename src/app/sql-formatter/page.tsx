import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { SqlFormatterTool } from "@/components/tools/SqlFormatterTool";
import { toolMetadata } from "@/lib/page-metadata";
import { TOOLS } from "@/lib/site-config";

const tool = TOOLS.find((t) => t.slug === "sql-formatter")!;

// Output is the formatter's actual result for this input (verified in src/app/seo.test.tsx).
const SQL_EXAMPLE_INPUT =
  "select u.id,u.name,count(o.id) as order_count from users u left join orders o on u.id=o.user_id where u.active=1 and o.created_at>='2026-01-01' group by u.id,u.name order by order_count desc;";
const SQL_EXAMPLE_OUTPUT = `SELECT
  u.id,
  u.name,
  count(o.id) AS order_count
FROM
  users u
  LEFT JOIN orders o ON u.id = o.user_id
WHERE
  u.active = 1
  AND o.created_at >= '2026-01-01'
GROUP BY
  u.id,
  u.name
ORDER BY
  order_count DESC;`;

export const metadata = toolMetadata(tool);

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
            <p className="mt-2">
              The <strong>Keyword case</strong> option controls how SQL keywords such as{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">SELECT</code>,{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">LEFT JOIN</code> and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">GROUP BY</code> are
              written: UPPERCASE (the default) or lowercase. Table names, column names and function calls like{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">count()</code> keep the
              casing you typed.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Example</h2>
            <p>This single-line query with a join, filter, grouping and sort:</p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-800">
              {SQL_EXAMPLE_INPUT}
            </pre>
            <p className="mt-2">is formatted with the Standard SQL dialect and UPPERCASE keywords as:</p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-800">
              {SQL_EXAMPLE_OUTPUT}
            </pre>
            <p className="mt-2">
              Each clause starts on its own line, the selected columns and grouped columns are listed one per
              line, and the second <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">WHERE</code>{" "}
              condition is moved onto its own <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">AND</code> line.
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
