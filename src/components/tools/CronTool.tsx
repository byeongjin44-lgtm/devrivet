"use client";

import { useMemo, useState } from "react";
import {
  CRON_PRESETS,
  DEFAULT_CRON_FIELDS,
  type CronFields,
  buildCronExpression,
  explainCronExpression,
  getNextRuns,
  validateCronExpression,
} from "@/lib/cron";
import { CopyButton } from "@/components/CopyButton";

function useLocalTimezone() {
  return useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  }, []);
}

const FIELD_CONFIG: { key: keyof CronFields; label: string; placeholder: string }[] = [
  { key: "minute", label: "Minute", placeholder: "0-59" },
  { key: "hour", label: "Hour", placeholder: "0-23" },
  { key: "dayOfMonth", label: "Day of month", placeholder: "1-31" },
  { key: "month", label: "Month", placeholder: "1-12" },
  { key: "dayOfWeek", label: "Day of week", placeholder: "0-6" },
];

export function CronTool() {
  const timezone = useLocalTimezone();
  const [fields, setFields] = useState<CronFields>(DEFAULT_CRON_FIELDS);
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [nextRunCount, setNextRunCount] = useState(5);

  const builderExpression = useMemo(() => buildCronExpression(fields), [fields]);

  function applyPreset(presetExpression: string) {
    setExpression(presetExpression);
    const parts = presetExpression.split(" ");
    setFields({
      minute: parts[0] ?? "*",
      hour: parts[1] ?? "*",
      dayOfMonth: parts[2] ?? "*",
      month: parts[3] ?? "*",
      dayOfWeek: parts[4] ?? "*",
    });
  }

  function handleFieldChange(key: keyof CronFields, value: string) {
    const next = { ...fields, [key]: value };
    setFields(next);
    setExpression(buildCronExpression(next));
  }

  const validation = expression.trim() ? validateCronExpression(expression) : null;

  const explanation = useMemo(() => {
    if (!validation?.valid) return null;
    try {
      return explainCronExpression(expression);
    } catch {
      return null;
    }
  }, [expression, validation]);

  const nextRuns = useMemo(() => {
    if (!validation?.valid) return [];
    try {
      return getNextRuns(expression, nextRunCount, timezone);
    } catch {
      return [];
    }
  }, [expression, nextRunCount, timezone, validation]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Presets</h3>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.expression)}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Custom</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {FIELD_CONFIG.map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <label htmlFor={`cron-${f.key}`} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {f.label}
              </label>
              <input
                id={`cron-${f.key}`}
                value={fields[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
                className="rounded-md border border-zinc-300 p-2 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          ))}
        </div>
        {builderExpression !== expression && (
          <button
            type="button"
            onClick={() => setExpression(builderExpression)}
            className="self-start rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Use builder expression
          </button>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Cron Expression</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="cron-expression" className="sr-only">
            Cron expression
          </label>
          <input
            id="cron-expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            spellCheck={false}
            className="w-full rounded-md border border-zinc-300 bg-white p-2.5 font-mono text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <CopyButton getText={() => expression} />
        </div>

        {validation && !validation.valid && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Invalid cron expression
          </p>
        )}

        {explanation && (
          <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">
            {explanation}
          </p>
        )}
      </section>

      {validation?.valid && (
        <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Next Runs</h3>
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              Show
              <select
                value={nextRunCount}
                onChange={(e) => setNextRunCount(Number(e.target.value))}
                className="rounded-md border border-zinc-300 p-1 text-base sm:text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                {[5, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Times shown in your local timezone: {timezone}
          </p>
          <ol className="flex flex-col gap-1 font-mono text-sm text-zinc-800 dark:text-zinc-200">
            {nextRuns.map((run, i) => (
              <li key={i} className="rounded-md bg-zinc-50 px-3 py-1.5 dark:bg-zinc-950">
                {run.toLocaleString(undefined, { timeZone: timezone })}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
