"use client";

import { useMemo, useState } from "react";
import { JwtError, decodeJwt, extractTimeClaims, isExpired } from "@/lib/jwt";
import { CopyButton } from "@/components/CopyButton";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoderTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return { decoded: null, error: null as string | null };
    try {
      return { decoded: decodeJwt(input), error: null as string | null };
    } catch (err) {
      return { decoded: null, error: err instanceof JwtError ? err.message : "Invalid JWT." };
    }
  }, [input]);

  const timeClaims = result.decoded ? extractTimeClaims(result.decoded.payload) : [];
  const expired = result.decoded ? isExpired(result.decoded.payload) : null;

  function handleClear() {
    setInput("");
  }

  function handleSample() {
    setInput(SAMPLE_JWT);
  }

  const headerJson = result.decoded ? JSON.stringify(result.decoded.header, null, 2) : "";
  const payloadJson = result.decoded ? JSON.stringify(result.decoded.payload, null, 2) : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
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
        <label htmlFor="jwt-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          JWT
        </label>
        <textarea
          id="jwt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a JWT (header.payload.signature)…"
          rows={4}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-base text-zinc-900 outline-none focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 break-all"
        />
      </div>

      {result.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {result.error}
        </p>
      )}

      {result.decoded && (
        <>
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            This tool only decodes the token. It does not verify the signature — a decoded token is not
            proof that it was issued by a trusted server.
          </p>

          {timeClaims.length > 0 && (
            <div className="flex flex-col gap-1">
              {expired !== null && (
                <p className={expired ? "text-sm text-red-600 dark:text-red-400" : "text-sm text-emerald-600 dark:text-emerald-400"}>
                  {expired ? "This token is expired." : "This token is not expired."}
                </p>
              )}
              <ul className="flex flex-col gap-0.5 text-sm text-zinc-700 dark:text-zinc-300">
                {timeClaims.map(({ claim, date }) => (
                  <li key={claim}>
                    <span className="font-mono">{claim}</span>: {date.toISOString().replace("T", " ").replace(".000Z", " UTC")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="jwt-header" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Header
                </label>
                <CopyButton getText={() => headerJson} />
              </div>
              <textarea
                id="jwt-header"
                value={headerJson}
                readOnly
                rows={6}
                spellCheck={false}
                className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-base text-zinc-900 outline-none sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="jwt-payload" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Payload
                </label>
                <CopyButton getText={() => payloadJson} />
              </div>
              <textarea
                id="jwt-payload"
                value={payloadJson}
                readOnly
                rows={6}
                spellCheck={false}
                className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-base text-zinc-900 outline-none sm:text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
