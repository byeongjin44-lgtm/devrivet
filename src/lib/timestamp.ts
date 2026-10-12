export class TimestampError extends Error {}

export type TimestampUnit = "seconds" | "milliseconds";

/**
 * Timestamps up to 10 digits (≈ year 2286 in seconds) are assumed to be
 * seconds; anything longer is assumed to be milliseconds. This matches the
 * common convention used by most Unix timestamp tools.
 */
export function detectTimestampUnit(raw: string): TimestampUnit {
  const digits = raw.trim().replace(/^-/, "");
  return digits.length > 10 ? "milliseconds" : "seconds";
}

export function parseTimestamp(raw: string, unit: TimestampUnit): Date {
  const trimmed = raw.trim();
  if (trimmed === "" || !/^-?\d+$/.test(trimmed)) {
    throw new TimestampError("Enter a whole number Unix timestamp.");
  }
  const value = Number(trimmed);
  const milliseconds = unit === "seconds" ? value * 1000 : value;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    throw new TimestampError("Timestamp is out of range.");
  }
  return date;
}

export function dateToTimestamp(date: Date): { seconds: number; milliseconds: number } {
  const milliseconds = date.getTime();
  return { seconds: Math.floor(milliseconds / 1000), milliseconds };
}

export function getCurrentTimestamp(): { seconds: number; milliseconds: number } {
  return dateToTimestamp(new Date());
}

export function parseLocalDateTimeInput(value: string): Date {
  if (!value) {
    throw new TimestampError("Pick a date and time.");
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TimestampError("Invalid date/time.");
  }
  return date;
}

export function formatUtc(date: Date): string {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}

export function formatLocal(date: Date, timezone: string): string {
  return date.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
