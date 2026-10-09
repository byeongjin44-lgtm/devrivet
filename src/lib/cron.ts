import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

export class CronError extends Error {}

export type CronPreset = {
  label: string;
  expression: string;
};

export const CRON_PRESETS: CronPreset[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every 5 minutes", expression: "*/5 * * * *" },
  { label: "Every 15 minutes", expression: "*/15 * * * *" },
  { label: "Every hour", expression: "0 * * * *" },
  { label: "Every day", expression: "0 0 * * *" },
  { label: "Every weekday", expression: "0 0 * * 1-5" },
  { label: "Every week", expression: "0 0 * * 0" },
  { label: "Every month", expression: "0 0 1 * *" },
];

export type CronFields = {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
};

export const DEFAULT_CRON_FIELDS: CronFields = {
  minute: "*",
  hour: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

export function buildCronExpression(fields: CronFields): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;
  return [minute, hour, dayOfMonth, month, dayOfWeek]
    .map((field) => (field.trim() === "" ? "*" : field.trim()))
    .join(" ");
}

function assertFiveFields(expression: string): void {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5) {
    throw new CronError("A cron expression must have exactly 5 fields: minute hour day-of-month month day-of-week.");
  }
}

export function validateCronExpression(expression: string): { valid: true } | { valid: false; message: string } {
  try {
    assertFiveFields(expression);
    CronExpressionParser.parse(expression);
    return { valid: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid cron expression.";
    return { valid: false, message };
  }
}

export function explainCronExpression(expression: string): string {
  assertFiveFields(expression);
  try {
    return cronstrue.toString(expression, { throwExceptionOnParseError: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid cron expression.";
    throw new CronError(message);
  }
}

export function getNextRuns(expression: string, count: number, timezone: string): Date[] {
  assertFiveFields(expression);
  try {
    const interval = CronExpressionParser.parse(expression, { tz: timezone });
    return interval.take(count).map((cronDate) => cronDate.toDate());
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid cron expression.";
    throw new CronError(message);
  }
}
