"use client";

import { useState } from "react";
import { HASH_ALGORITHMS, WEAK_ALGORITHMS, hashTextAll, type HashAlgorithm } from "@/lib/hash";
import { CopyButton } from "@/components/CopyButton";

const DEFAULT_ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

type HashResult = { algorithm: HashAlgorithm; hash: string };

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<HashAlgorithm[]>(DEFAULT_ALGORITHMS);
  const [uppercase, setUppercase] = useState(false);
  const [results, setResults] = useState<HashResult[] | null>(null);
  const [error, setError] = useState("");

  const display = (hash: string) => (uppercase ? hash.toUpperCase() : hash);

  async function handleGenerate() {
    setError("");
    try {
      setResults(await hashTextAll(input, selected));
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : "Could not generate hashes.");
    }
  }

  function toggleAlgorithm(algorithm: HashAlgorithm) {
    // Keep the canonical order regardless of click order.
    setSelected((current) =>
      HASH_ALGORITHMS.filter((a) => (a === algorithm ? !current.includes(a) : current.includes(a))),
    );
    setResults(null);
  }

  function handleClear() {
    setInput("");
    setResults(null);
    setError("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="hash-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Text to hash (UTF-8)
        </label>
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResults(null);
          }}
          placeholder="hello world"
          rows={6}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-base text-zinc-900 outline-none focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">Algorithms</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {HASH_ALGORITHMS.map((algorithm) => (
            <label key={algorithm} className="inline-flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={selected.includes(algorithm)}
                onChange={() => toggleAlgorithm(algorithm)}
              />
              <span className="font-mono">{algorithm}</span>
              {WEAK_ALGORITHMS.has(algorithm) && <span className="text-zinc-500 dark:text-zinc-400">(weak)</span>}
            </label>
          ))}
          <label className="inline-flex items-center gap-1.5 text-sm text-zinc-700 sm:ml-auto dark:text-zinc-300">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            Uppercase output
          </label>
        </div>
      </fieldset>

      {selected.some((a) => WEAK_ALGORITHMS.has(a)) && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          SHA-1 is considered cryptographically weak and should not be used for security-sensitive purposes.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={selected.length === 0}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Generate
        </button>
        <CopyButton
          getText={() => (results ?? []).map((r) => `${r.algorithm}: ${display(r.hash)}`).join("\n")}
          label="Copy All"
          disabled={!results?.length}
          className="py-2"
        />
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>

      {selected.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Select at least one algorithm.</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {results && (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {results.map(({ algorithm, hash }) => (
            <li key={algorithm} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">{algorithm}</span>
                <CopyButton getText={() => display(hash)} label={`Copy ${algorithm}`} />
              </div>
              <code className="rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm break-all text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                {display(hash)}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
