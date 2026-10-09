"use client";

import { useState } from "react";
import { SQL_DIALECTS, SqlFormatError, formatSql, type KeywordCase, type SqlDialect } from "@/lib/sql-format";
import { CopyButton } from "@/components/CopyButton";

const SAMPLE_SQL =
  "SELECT u.id, u.name, o.total FROM users u JOIN orders o ON o.user_id = u.id WHERE o.total > 100 ORDER BY o.total DESC;";

export function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleFormat() {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(formatSql(input, dialect, keywordCase));
      setError(null);
    } catch (err) {
      setOutput("");
      setError(err instanceof SqlFormatError ? "Unable to format this SQL. Check for syntax errors." : "Unexpected error.");
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
  }

  function handleSample() {
    setInput(SAMPLE_SQL);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sql-dialect" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Dialect
          </label>
          <select
            id="sql-dialect"
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlDialect)}
            className="rounded-md border border-zinc-300 bg-white p-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {SQL_DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sql-case" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Keyword case
          </label>
          <select
            id="sql-case"
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
            className="rounded-md border border-zinc-300 bg-white p-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handleSample}
          className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Load sample
        </button>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleFormat}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sql-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          SQL input
        </label>
        <textarea
          id="sql-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a SQL query to format…"
          rows={10}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="sql-output" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Formatted SQL
          </label>
          <CopyButton getText={() => output} disabled={!output} />
        </div>
        <textarea
          id="sql-output"
          value={output}
          readOnly
          rows={12}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
