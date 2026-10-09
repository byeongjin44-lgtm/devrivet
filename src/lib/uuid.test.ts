import { describe, expect, it } from "vitest";
import { MAX_BULK_COUNT, generateBulkUuids, generateUuid, validateUuid } from "./uuid";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("uuid generation", () => {
  it("generates a well-formed UUID v4", () => {
    const id = generateUuid("v4");
    expect(id).toMatch(UUID_RE);
    expect(validateUuid(id)).toEqual({ valid: true, version: 4 });
  });

  it("generates a well-formed UUID v7", () => {
    const id = generateUuid("v7");
    expect(id).toMatch(UUID_RE);
    expect(validateUuid(id)).toEqual({ valid: true, version: 7 });
  });

  it("generates the requested bulk amount", () => {
    const ids = generateBulkUuids("v4", 50);
    expect(ids).toHaveLength(50);
  });

  it("clamps bulk amount to the maximum", () => {
    const ids = generateBulkUuids("v4", 5000);
    expect(ids).toHaveLength(MAX_BULK_COUNT);
  });

  it("clamps bulk amount to the minimum of 1", () => {
    const ids = generateBulkUuids("v4", -10);
    expect(ids).toHaveLength(1);
  });

  it("produces no duplicates within a bulk sample", () => {
    const ids = generateBulkUuids("v7", 500);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("uuid validation", () => {
  it("validates a correct UUID v4", () => {
    expect(validateUuid("9b2f1e3a-7c4d-4a1b-8f3e-1234567890ab")).toEqual({
      valid: true,
      version: 4,
    });
  });

  it("rejects an invalid UUID", () => {
    expect(validateUuid("not-a-uuid")).toEqual({ valid: false });
  });

  it("rejects an empty string", () => {
    expect(validateUuid("")).toEqual({ valid: false });
  });

  it("trims whitespace before validating", () => {
    const id = generateUuid("v4");
    expect(validateUuid(`  ${id}  `)).toEqual({ valid: true, version: 4 });
  });
});
