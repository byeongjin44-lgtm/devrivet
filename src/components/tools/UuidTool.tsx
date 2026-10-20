"use client";

import { useState } from "react";
import {
  MAX_BULK_COUNT,
  MIN_BULK_COUNT,
  type UuidVersion,
  generateBulkUuids,
  generateUuid,
  validateUuid,
} from "@/lib/uuid";
import { CopyButton } from "@/components/CopyButton";

export function UuidTool() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [single, setSingle] = useState(() => generateUuid("v4"));

  const [bulkCount, setBulkCount] = useState(10);
  const [bulkResult, setBulkResult] = useState<string[]>([]);

  const [validatorInput, setValidatorInput] = useState("");
  const validation = validatorInput.trim() ? validateUuid(validatorInput) : null;

  function handleVersionChange(next: UuidVersion) {
    setVersion(next);
    setSingle(generateUuid(next));
  }

  function handleGenerate() {
    setSingle(generateUuid(version));
  }

  function handleBulkGenerate() {
    setBulkResult(generateBulkUuids(version, bulkCount));
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">UUID version</legend>
            {(["v4", "v7"] as const).map((v) => (
              <label
                key={v}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  version === v
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                    version === v
                      ? "border-white dark:border-zinc-900"
                      : "border-zinc-400 dark:border-zinc-500"
                  }`}
                >
                  {version === v && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-zinc-900" />
                  )}
                </span>
                <input
                  type="radio"
                  name="uuid-version"
                  value={v}
                  checked={version === v}
                  onChange={() => handleVersionChange(v)}
                  className="sr-only"
                />
                UUID {v}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Generate
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={single}
            aria-label="Generated UUID"
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-2.5 font-mono text-base text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <CopyButton getText={() => single} />
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Bulk Generator</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="bulk-count" className="text-sm text-zinc-600 dark:text-zinc-400">
            Count (1–{MAX_BULK_COUNT})
          </label>
          <input
            id="bulk-count"
            type="number"
            min={MIN_BULK_COUNT}
            max={MAX_BULK_COUNT}
            value={bulkCount}
            onChange={(e) => setBulkCount(Number(e.target.value))}
            className="w-24 rounded-md border border-zinc-300 p-1.5 text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            onClick={handleBulkGenerate}
            className="rounded-md border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Generate Bulk
          </button>
        </div>
        {bulkCount > MAX_BULK_COUNT && (
          <p role="alert" className="text-sm text-amber-600 dark:text-amber-400">
            Maximum is {MAX_BULK_COUNT} UUIDs per batch — only {MAX_BULK_COUNT} will be generated.
          </p>
        )}
        {bulkResult.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {bulkResult.length} UUIDs generated
              </span>
              <CopyButton getText={() => bulkResult.join("\n")} label="Copy All" />
            </div>
            <textarea
              readOnly
              value={bulkResult.join("\n")}
              rows={10}
              aria-label="Bulk generated UUIDs"
              spellCheck={false}
              className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-base text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Validator</h2>
        <label htmlFor="uuid-validate-input" className="sr-only">
          UUID to validate
        </label>
        <input
          id="uuid-validate-input"
          value={validatorInput}
          onChange={(e) => setValidatorInput(e.target.value)}
          placeholder="Paste a UUID to validate…"
          className="w-full rounded-md border border-zinc-300 p-2.5 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {validation && (
          <p role="status" className={validation.valid ? "text-sm text-emerald-600 dark:text-emerald-400" : "text-sm text-red-600 dark:text-red-400"}>
            {validation.valid ? `Valid UUID v${validation.version}` : "Invalid UUID"}
          </p>
        )}
      </section>
    </div>
  );
}
