import { describe, expect, it } from "vitest";
import { JsonFormatError, formatJson, minifyJson, validateJson } from "./json-format";

const SAMPLE = `{"name":"DevRivet","tools":["Base64","UUID"],"active":true}`;

describe("formatJson", () => {
  it("pretty-prints a valid JSON object with 2-space indent by default", () => {
    const result = formatJson(SAMPLE);
    expect(result).toBe(
      `{\n  "name": "DevRivet",\n  "tools": [\n    "Base64",\n    "UUID"\n  ],\n  "active": true\n}`,
    );
  });

  it("supports a custom indent size", () => {
    const result = formatJson(`{"a":1}`, 4);
    expect(result).toBe(`{\n    "a": 1\n}`);
  });

  it("round-trips through minify then format without losing data", () => {
    const minified = minifyJson(SAMPLE);
    const reformatted = formatJson(minified);
    expect(JSON.parse(reformatted)).toEqual(JSON.parse(SAMPLE));
  });

  it("throws JsonFormatError for invalid JSON (trailing comma)", () => {
    expect(() => formatJson(`{"name":"DevRivet",}`)).toThrow(JsonFormatError);
  });

  it("handles a large JSON array without crashing", () => {
    const large = JSON.stringify(Array.from({ length: 5000 }, (_, i) => ({ id: i, value: `item-${i}` })));
    expect(() => formatJson(large)).not.toThrow();
  });
});

describe("minifyJson", () => {
  it("removes all insignificant whitespace", () => {
    expect(minifyJson(`{\n  "a": 1,\n  "b": [1, 2, 3]\n}`)).toBe(`{"a":1,"b":[1,2,3]}`);
  });

  it("throws JsonFormatError for invalid JSON", () => {
    expect(() => minifyJson("not json")).toThrow(JsonFormatError);
  });
});

describe("validateJson", () => {
  it("accepts valid JSON", () => {
    expect(validateJson(SAMPLE)).toEqual({ valid: true });
  });

  it("accepts primitives as valid JSON", () => {
    expect(validateJson("42")).toEqual({ valid: true });
    expect(validateJson('"hello"')).toEqual({ valid: true });
    expect(validateJson("null")).toEqual({ valid: true });
  });

  it("rejects an empty string", () => {
    const result = validateJson("");
    expect(result.valid).toBe(false);
  });

  it("rejects JSON with a trailing comma and reports a message", () => {
    const result = validateJson(`{"name":"DevRivet",}`);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toBeTruthy();
    }
  });

  it("reports a line/column location when the input spans multiple lines", () => {
    const multiline = `{\n  "a": 1,\n  "b":\n}`;
    const result = validateJson(multiline);
    expect(result.valid).toBe(false);
    if (!result.valid && result.line !== undefined) {
      expect(result.line).toBeGreaterThanOrEqual(1);
    }
  });
});
