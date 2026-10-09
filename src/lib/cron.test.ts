import { describe, expect, it } from "vitest";
import {
  CronError,
  buildCronExpression,
  explainCronExpression,
  getNextRuns,
  validateCronExpression,
} from "./cron";

describe("buildCronExpression", () => {
  it("joins fields with spaces", () => {
    expect(
      buildCronExpression({
        minute: "0",
        hour: "9",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "1-5",
      }),
    ).toBe("0 9 * * 1-5");
  });

  it("defaults empty fields to *", () => {
    expect(
      buildCronExpression({ minute: "", hour: "", dayOfMonth: "", month: "", dayOfWeek: "" }),
    ).toBe("* * * * *");
  });
});

describe("validateCronExpression", () => {
  it("accepts a valid expression", () => {
    expect(validateCronExpression("0 9 * * 1-5")).toEqual({ valid: true });
  });

  it("accepts every-minute wildcard", () => {
    expect(validateCronExpression("* * * * *")).toEqual({ valid: true });
  });

  it("rejects an expression with the wrong number of fields", () => {
    const result = validateCronExpression("* * * *");
    expect(result.valid).toBe(false);
  });

  it("rejects an out-of-range value", () => {
    const result = validateCronExpression("60 * * * *");
    expect(result.valid).toBe(false);
  });

  it("rejects garbage input", () => {
    const result = validateCronExpression("not a cron");
    expect(result.valid).toBe(false);
  });
});

describe("explainCronExpression", () => {
  it("explains a weekday schedule in plain English", () => {
    expect(explainCronExpression("0 9 * * 1-5")).toMatch(/monday through friday/i);
  });

  it("explains every 5 minutes", () => {
    expect(explainCronExpression("*/5 * * * *")).toMatch(/5 minutes/i);
  });

  it("throws CronError for invalid expressions", () => {
    expect(() => explainCronExpression("not a cron")).toThrow(CronError);
  });
});

describe("getNextRuns", () => {
  it("returns the requested number of upcoming run times in order", () => {
    const runs = getNextRuns("*/5 * * * *", 5, "UTC");
    expect(runs).toHaveLength(5);
    for (let i = 1; i < runs.length; i++) {
      expect(runs[i].getTime()).toBeGreaterThan(runs[i - 1].getTime());
    }
  });

  it("throws CronError for invalid expressions", () => {
    expect(() => getNextRuns("not a cron", 5, "UTC")).toThrow(CronError);
  });
});
