"use client";

import { useMemo, useState } from "react";
import {
  TimestampError,
  type TimestampUnit,
  dateToTimestamp,
  detectTimestampUnit,
  formatLocal,
  formatUtc,
  getCurrentTimestamp,
  parseLocalDateTimeInput,
  parseTimestamp,
} from "@/lib/timestamp";
import { CopyButton } from "@/components/CopyButton";

type UnitChoice = "auto" | TimestampUnit;

function useLocalTimezone() {
  return useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  }, []);
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function TimestampConverterTool() {
  const timezone = useLocalTimezone();

  const [now, setNow] = useState(() => getCurrentTimestamp());

  const [tsInput, setTsInput] = useState("");
  const [unitChoice, setUnitChoice] = useState<UnitChoice>("auto");
  const effectiveUnit: TimestampUnit = unitChoice === "auto" ? detectTimestampUnit(tsInput || "0") : unitChoice;

  const tsResult = useMemo(() => {
    if (!tsInput.trim()) return { date: null as Date | null, error: null as string | null };
    try {
      return { date: parseTimestamp(tsInput, effectiveUnit), error: null as string | null };
    } catch (err) {
      return { date: null, error: err instanceof TimestampError ? err.message : "Invalid timestamp." };
    }
  }, [tsInput, effectiveUnit]);

  const [dateInput, setDateInput] = useState(() => toDateTimeLocalValue(new Date()));

  const dateResult = useMemo(() => {
    try {
      return { date: parseLocalDateTimeInput(dateInput), error: null as string | null };
    } catch (err) {
      return { date: null as Date | null, error: err instanceof TimestampError ? err.message : "Invalid date." };
    }
  }, [dateInput]);

  const dateTimestamp = dateResult.date ? dateToTimestamp(dateResult.date) : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Current Unix Timestamp</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-sm text-zinc-500 sm:w-28 dark:text-zinc-400">Seconds</span>
            <input
              readOnly
              value={now.seconds}
              aria-label="Current Unix timestamp in seconds"
              className="w-40 min-w-0 rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <CopyButton getText={() => String(now.seconds)} />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-sm text-zinc-500 sm:w-28 dark:text-zinc-400">Milliseconds</span>
            <input
              readOnly
              value={now.milliseconds}
              aria-label="Current Unix timestamp in milliseconds"
              className="w-40 min-w-0 rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <CopyButton getText={() => String(now.milliseconds)} />
          </div>
          <button
            type="button"
            onClick={() => setNow(getCurrentTimestamp())}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Timestamp → Date</h3>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ts-input" className="sr-only">
            Unix timestamp
          </label>
          <input
            id="ts-input"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="e.g. 1700000000"
            spellCheck={false}
            className="w-48 rounded-md border border-zinc-300 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <fieldset className="flex items-center gap-1 text-sm">
            <legend className="sr-only">Unit</legend>
            {(["auto", "seconds", "milliseconds"] as const).map((u) => (
              <label
                key={u}
                className={`cursor-pointer rounded-md border px-2.5 py-1 capitalize transition-colors ${
                  unitChoice === u
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="ts-unit"
                  value={u}
                  checked={unitChoice === u}
                  onChange={() => setUnitChoice(u)}
                  className="sr-only"
                />
                {u}
              </label>
            ))}
          </fieldset>
          {tsInput.trim() && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Interpreted as {effectiveUnit}
            </span>
          )}
        </div>

        {tsResult.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {tsResult.error}
          </p>
        )}

        {tsResult.date && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-16 text-sm text-zinc-500 dark:text-zinc-400">UTC</span>
              <input
                readOnly
                value={formatUtc(tsResult.date)}
                aria-label="Date in UTC"
                className="w-full max-w-sm rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <CopyButton getText={() => formatUtc(tsResult.date!)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-sm text-zinc-500 dark:text-zinc-400">Local</span>
              <input
                readOnly
                value={`${formatLocal(tsResult.date, timezone)} (${timezone})`}
                aria-label="Date in browser local time"
                className="w-full max-w-sm rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <CopyButton getText={() => `${formatLocal(tsResult.date!, timezone)} (${timezone})`} />
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Date → Timestamp</h3>
        <label htmlFor="date-input" className="sr-only">
          Date and time (browser local time)
        </label>
        <input
          id="date-input"
          type="datetime-local"
          step={1}
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-64 rounded-md border border-zinc-300 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Interpreted in your browser&apos;s local timezone: {timezone}
        </p>

        {dateResult.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {dateResult.error}
          </p>
        )}

        {dateTimestamp && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-sm text-zinc-500 sm:w-28 dark:text-zinc-400">Unix Seconds</span>
              <input
                readOnly
                value={dateTimestamp.seconds}
                aria-label="Unix timestamp in seconds"
                className="w-48 min-w-0 rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <CopyButton getText={() => String(dateTimestamp.seconds)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-sm text-zinc-500 sm:w-28 dark:text-zinc-400">Unix Milliseconds</span>
              <input
                readOnly
                value={dateTimestamp.milliseconds}
                aria-label="Unix timestamp in milliseconds"
                className="w-48 min-w-0 rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <CopyButton getText={() => String(dateTimestamp.milliseconds)} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
