"use client";

import { useState } from "react";
import { JsonFormatError, formatJson, minifyJson, validateJson } from "@/lib/json-format";
import { CopyButton } from "@/components/CopyButton";

const SAMPLE_JSON = `{"name":"DevRivet","tools":["Base64","UUID"],"active":true}`;

type Status = { kind: "valid" } | { kind: "error"; message: string; line?: number; column?: number };

function formatErrorMessage(status: Status): string {
  if (status.kind !== "error") return "";
  if (status.line !== undefined && status.column !== undefined) {
    return `Line ${status.line}, Column ${status.column}: ${status.message}`;
  }
  return status.message;
}

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status | null>(null);

  function handleFormat() {
    try {
      setOutput(formatJson(input));
      setStatus({ kind: "valid" });
    } catch (err) {
      setOutput("");
      setStatus(toStatus(err));
    }
  }

  function handleMinify() {
    try {
      setOutput(minifyJson(input));
      setStatus({ kind: "valid" });
    } catch (err) {
      setOutput("");
      setStatus(toStatus(err));
    }
  }

  function handleValidate() {
    const result = validateJson(input);
    setStatus(result.valid ? { kind: "valid" } : { kind: "error", ...result });
  }

  function toStatus(err: unknown): Status {
    if (err instanceof JsonFormatError) {
      return { kind: "error", message: err.message, line: err.line, column: err.column };
    }
    return { kind: "error", message: "Invalid JSON." };
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setStatus(null);
  }

  function handleSample() {
    setInput(SAMPLE_JSON);
    setStatus(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleFormat}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Format
        </button>
        <button
          type="button"
          onClick={handleMinify}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Minify
        </button>
        <button
          type="button"
          onClick={handleValidate}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleSample}
          className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="json-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          JSON input
        </label>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON to format, minify, or validate…"
          rows={10}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-base text-zinc-900 outline-none focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {status?.kind === "valid" && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          Valid JSON
        </p>
      )}
      {status?.kind === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {formatErrorMessage(status)}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="json-output" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Output
          </label>
          <CopyButton getText={() => output} disabled={!output} />
        </div>
        <textarea
          id="json-output"
          value={output}
          readOnly
          rows={12}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-base text-zinc-900 outline-none sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>
    </div>
  );
}
