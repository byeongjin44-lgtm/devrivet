"use client";

import { useMemo, useState } from "react";
import { Base64Error, decodeBase64, encodeBase64 } from "@/lib/base64";
import { CopyButton } from "@/components/CopyButton";

type Mode = "encode" | "decode";

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (input === "") return { output: "", error: null as string | null };
    try {
      const output = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      return { output, error: null as string | null };
    } catch (err) {
      const message = err instanceof Base64Error ? err.message : "Unexpected error.";
      return { output: "", error: message };
    }
  }, [input, mode]);

  function handleModeChange(next: Mode) {
    if (next === mode) return;
    if (result.output) {
      setInput(result.output);
    }
    setMode(next);
  }

  function handleClear() {
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Base64 mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "encode"}
          onClick={() => handleModeChange("encode")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          Encode (Text → Base64)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "decode"}
          onClick={() => handleModeChange("decode")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          Decode (Base64 → Text)
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
        <label htmlFor="base64-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {mode === "encode" ? "Text input" : "Base64 input"}
        </label>
        <textarea
          id="base64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Type or paste text to encode…" : "Paste Base64 to decode…"}
          rows={8}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-base text-zinc-900 outline-none focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="base64-output" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {mode === "encode" ? "Base64 output" : "Decoded text"}
          </label>
          <CopyButton getText={() => result.output} disabled={!result.output} />
        </div>
        <textarea
          id="base64-output"
          value={result.output}
          readOnly
          rows={8}
          spellCheck={false}
          aria-invalid={result.error ? "true" : "false"}
          className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-base text-zinc-900 outline-none sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        {result.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {result.error}
          </p>
        )}
      </div>
    </div>
  );
}
