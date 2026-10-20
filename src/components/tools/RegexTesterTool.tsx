"use client";

import { useRef, useState, type FormEvent } from "react";
import { MAX_MATCHES, REGEX_FLAGS, splitHighlights, type RegexTestResult } from "@/lib/regex";
import { runRegex } from "@/lib/regex-runner";
import { CopyButton } from "@/components/CopyButton";

type Tested = { input: string; result: RegexTestResult };

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState("");
  const [tested, setTestedState] = useState<Tested | null>(null);
  const [running, setRunning] = useState(false);
  // Bumped on every new run or edit so a slow/stale result is never shown.
  const runId = useRef(0);

  function setTested(value: Tested | null) {
    runId.current++;
    setRunning(false);
    setTestedState(value);
  }

  async function handleTest(e?: FormEvent) {
    e?.preventDefault();
    setTested(null);
    const id = runId.current;
    setRunning(true);
    const result = await runRegex(pattern, flags, input);
    if (id !== runId.current) return;
    setRunning(false);
    setTestedState({ input, result });
  }

  function toggleFlag(flag: string) {
    setFlags((current) =>
      current.includes(flag)
        ? current.replace(flag, "")
        : REGEX_FLAGS.map((f) => f.flag)
            .filter((f) => f === flag || current.includes(f))
            .join(""),
    );
    setTested(null);
  }

  function handleClear() {
    setPattern("");
    setInput("");
    setTested(null);
  }

  return (
    <form onSubmit={handleTest} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="regex-pattern" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Pattern
        </label>
        <div className="flex items-center rounded-md border border-zinc-300 bg-white font-mono focus-within:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
          <span aria-hidden="true" className="pl-3 text-zinc-400">
            /
          </span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setTested(null);
            }}
            placeholder="[a-z]+"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-zinc-900 outline-none sm:text-sm dark:text-zinc-100"
          />
          <span aria-hidden="true" className="pr-3 text-zinc-400">
            /{flags}
          </span>
        </div>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">Flags</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {REGEX_FLAGS.map(({ flag, label, description }) => (
            <label
              key={flag}
              title={description}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input type="checkbox" checked={flags.includes(flag)} onChange={() => toggleFlag(flag)} />
              <span className="font-mono font-semibold">{flag}</span>
              <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="regex-input" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Test string
        </label>
        <textarea
          id="regex-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setTested(null);
          }}
          placeholder="Order 123, Order 456"
          rows={8}
          spellCheck={false}
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-base text-zinc-900 outline-none focus:border-zinc-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={running}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {running ? "Testing…" : "Test"}
        </button>
        <CopyButton getText={() => pattern} label="Copy Pattern" disabled={!pattern} className="py-2" />
        <button
          type="button"
          onClick={handleClear}
          className="ml-auto rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>

      {tested && <RegexResults tested={tested} />}
    </form>
  );
}

function RegexResults({ tested }: { tested: Tested }) {
  const { input, result } = tested;

  if (!result.ok) {
    return (
      <p role="alert" className="text-sm break-words text-red-600 dark:text-red-400">
        {result.error}
      </p>
    );
  }

  const { matches, truncated } = result;
  const segments = splitHighlights(input, matches);

  return (
    <div className="flex flex-col gap-4">
      <p
        role="status"
        className={`text-sm font-medium ${
          matches.length ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
        }`}
      >
        {matches.length
          ? `Match — ${truncated ? `first ${MAX_MATCHES}` : matches.length} ${matches.length === 1 ? "match" : "matches"}`
          : "No match"}
      </p>
      {truncated && (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Showing the first {MAX_MATCHES} matches only. Narrow the pattern or the test string to see the rest.
        </p>
      )}

      {matches.length > 0 && (
        <>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Highlighted</h2>
            <pre className="max-h-80 overflow-auto rounded-md border border-zinc-300 bg-zinc-50 p-3 font-mono text-sm break-all whitespace-pre-wrap text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
              {segments.map((segment, i) =>
                segment.matchIndex === null ? (
                  segment.text
                ) : (
                  <mark
                    key={i}
                    className={`rounded-sm text-zinc-900 ${
                      segment.matchIndex % 2 ? "bg-sky-200 dark:bg-sky-300" : "bg-amber-200 dark:bg-amber-300"
                    }`}
                  >
                    {segment.text}
                  </mark>
                ),
              )}
            </pre>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Matches</h2>
            <ol className="flex max-h-96 flex-col divide-y divide-zinc-200 overflow-auto rounded-md border border-zinc-300 text-sm dark:divide-zinc-800 dark:border-zinc-700">
              {matches.map((match, i) => (
                <li key={i} className="flex flex-col gap-1 p-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-zinc-500 dark:text-zinc-400">#{i + 1}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">index {match.index}</span>
                    <MatchValue value={match.text} />
                  </div>
                  {match.groups.length > 0 && (
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 pl-4">
                      {match.groups.map((group) => (
                        <div key={group.index} className="contents">
                          <dt className="text-zinc-500 dark:text-zinc-400">
                            Group {group.index}
                            {group.name && <span className="font-mono"> &lt;{group.name}&gt;</span>}
                          </dt>
                          <dd>
                            <MatchValue value={group.value} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

function MatchValue({ value }: { value: string | undefined }) {
  if (value === undefined) return <span className="text-zinc-400 italic">undefined</span>;
  if (value === "") return <span className="text-zinc-400 italic">(empty)</span>;
  return (
    <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono break-all whitespace-pre-wrap text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
      {value}
    </code>
  );
}
