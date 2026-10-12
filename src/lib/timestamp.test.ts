import { describe, expect, it } from "vitest";
import {
  TimestampError,
  dateToTimestamp,
  detectTimestampUnit,
  formatUtc,
  getCurrentTimestamp,
  parseLocalDateTimeInput,
  parseTimestamp,
} from "./timestamp";

describe("detectTimestampUnit", () => {
  it("detects a 10-digit value as seconds", () => {
    expect(detectTimestampUnit("1700000000")).toBe("seconds");
  });

  it("detects a 13-digit value as milliseconds", () => {
    expect(detectTimestampUnit("1700000000000")).toBe("milliseconds");
  });

  it("detects 0 as seconds", () => {
    expect(detectTimestampUnit("0")).toBe("seconds");
  });
});

describe("parseTimestamp", () => {
  it("parses 0 seconds as the Unix epoch", () => {
    const date = parseTimestamp("0", "seconds");
    expect(formatUtc(date)).toBe("1970-01-01 00:00:00 UTC");
  });

  it("parses seconds correctly", () => {
    const date = parseTimestamp("1700000000", "seconds");
    expect(date.getTime()).toBe(1700000000000);
  });

  it("parses milliseconds correctly", () => {
    const date = parseTimestamp("1700000000000", "milliseconds");
    expect(date.getTime()).toBe(1700000000000);
  });

  it("accepts negative timestamps (before 1970)", () => {
    const date = parseTimestamp("-86400", "seconds");
    expect(formatUtc(date)).toBe("1969-12-31 00:00:00 UTC");
  });

  it("throws TimestampError for non-numeric input", () => {
    expect(() => parseTimestamp("not a number", "seconds")).toThrow(TimestampError);
  });

  it("throws TimestampError for empty input", () => {
    expect(() => parseTimestamp("", "seconds")).toThrow(TimestampError);
  });
});

describe("dateToTimestamp / getCurrentTimestamp", () => {
  it("converts a date to matching seconds and milliseconds", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    expect(dateToTimestamp(date)).toEqual({ seconds: 1767225600, milliseconds: 1767225600000 });
  });

  it("returns a current timestamp close to Date.now()", () => {
    const { seconds, milliseconds } = getCurrentTimestamp();
    expect(Math.abs(milliseconds - Date.now())).toBeLessThan(1000);
    expect(Math.abs(seconds - Math.floor(Date.now() / 1000))).toBeLessThanOrEqual(1);
  });
});

describe("parseLocalDateTimeInput", () => {
  it("round-trips a datetime-local value through dateToTimestamp", () => {
    const date = parseLocalDateTimeInput("2026-01-01T00:00");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
  });

  it("throws TimestampError for an empty value", () => {
    expect(() => parseLocalDateTimeInput("")).toThrow(TimestampError);
  });
});
