import { describe, expect, it } from "vitest";
import { MAX_MATCHES, captureGroupNames, splitHighlights, testRegex } from "./regex";

function matchesOf(pattern: string, flags: string, input: string) {
  const result = testRegex(pattern, flags, input);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe("testRegex", () => {
  it("finds a simple match with its index", () => {
    const { matches } = matchesOf("[a-z]+", "", "123 abc");
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ text: "abc", index: 4, end: 7 });
  });

  it("returns no matches when the pattern does not match", () => {
    const { matches, truncated } = matchesOf("xyz", "g", "abc");
    expect(matches).toEqual([]);
    expect(truncated).toBe(false);
  });

  it("finds multiple matches with the global flag", () => {
    const { matches } = matchesOf("\\d+", "g", "Order 123, Order 456");
    expect(matches.map((m) => m.text)).toEqual(["123", "456"]);
    expect(matches.map((m) => m.index)).toEqual([6, 17]);
  });

  it("returns only the first match without the global flag", () => {
    const { matches } = matchesOf("\\d+", "", "Order 123, Order 456");
    expect(matches.map((m) => m.text)).toEqual(["123"]);
  });

  it("supports the case-insensitive flag", () => {
    expect(matchesOf("hello", "g", "Hello HELLO hello").matches).toHaveLength(1);
    expect(matchesOf("hello", "gi", "Hello HELLO hello").matches).toHaveLength(3);
  });

  it("supports the multiline flag for ^ and $", () => {
    const input = "first line\nsecond line\nthird";
    expect(matchesOf("^\\w+", "g", input).matches.map((m) => m.text)).toEqual(["first"]);
    expect(matchesOf("^\\w+", "gm", input).matches.map((m) => m.text)).toEqual(["first", "second", "third"]);
  });

  it("supports the dotAll flag", () => {
    expect(matchesOf("a.b", "", "a\nb").matches).toHaveLength(0);
    expect(matchesOf("a.b", "s", "a\nb").matches).toHaveLength(1);
  });

  it("supports the unicode flag for astral characters and property escapes", () => {
    const { matches } = matchesOf("\\p{Emoji_Presentation}", "gu", "hi 🚀 there 🎉");
    expect(matches.map((m) => m.text)).toEqual(["🚀", "🎉"]);
    // Without `u`, `.` matches one UTF-16 code unit of the surrogate pair.
    expect(matchesOf("^.$", "", "🚀").matches).toHaveLength(0);
    expect(matchesOf("^.$", "u", "🚀").matches).toHaveLength(1);
    expect(matchesOf("[가-힣]+", "gu", "안녕 hello 세계").matches.map((m) => m.text)).toEqual(["안녕", "세계"]);
  });

  it("reports numbered and named capture groups", () => {
    const { matches } = matchesOf("(?<year>\\d{4})-(\\d{2})(?:-(\\d{2}))?", "g", "2024-01-15 and 2025-06");
    expect(matches).toHaveLength(2);
    expect(matches[0].groups).toEqual([
      { index: 1, name: "year", value: "2024" },
      { index: 2, name: undefined, value: "01" },
      { index: 3, name: undefined, value: "15" },
    ]);
    // An optional group that did not participate is undefined.
    expect(matches[1].groups[2]).toEqual({ index: 3, name: undefined, value: undefined });
  });

  it("returns an error instead of throwing for an invalid regex", () => {
    const result = testRegex("[abc", "g", "abc");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/^Invalid regular expression/);
  });

  it("rejects unsupported and duplicate flags", () => {
    expect(testRegex("a", "x", "a").ok).toBe(false);
    expect(testRegex("a", "gg", "a").ok).toBe(false);
  });

  it("does not loop forever on zero-length matches", () => {
    expect(matchesOf("^", "gm", "a\nb\nc").matches.map((m) => m.index)).toEqual([0, 2, 4]);
    const lazy = matchesOf(".*?", "g", "abc").matches;
    expect(lazy).toHaveLength(4);
    expect(lazy.every((m) => m.text === "")).toBe(true);
    // Zero-length matches with `u` advance by whole code points, not into a surrogate pair.
    expect(matchesOf("", "gu", "🚀🚀").matches.map((m) => m.index)).toEqual([0, 2, 4]);
  });

  it("caps the number of matches and flags truncation", () => {
    const input = "a".repeat(MAX_MATCHES + 500);
    const result = matchesOf("a", "g", input);
    expect(result.matches).toHaveLength(MAX_MATCHES);
    expect(result.truncated).toBe(true);

    const exact = matchesOf("a", "g", "a".repeat(MAX_MATCHES));
    expect(exact.matches).toHaveLength(MAX_MATCHES);
    expect(exact.truncated).toBe(false);
  });

  it("caps zero-length matches on long input too", () => {
    const result = matchesOf("", "g", "x".repeat(5000));
    expect(result.matches).toHaveLength(MAX_MATCHES);
    expect(result.truncated).toBe(true);
  });
});

describe("captureGroupNames", () => {
  it("ignores non-capturing groups, lookarounds, escaped parens and parens in classes", () => {
    expect(captureGroupNames("(a)(?:b)(?=c)(?!d)(?<=e)(?<!f)\\((?<g>h)[(]")).toEqual([undefined, "g"]);
  });
});

describe("splitHighlights", () => {
  it("splits input into plain and matched segments", () => {
    const input = "Order 123, Order 456";
    const { matches } = matchesOf("\\d+", "g", input);
    expect(splitHighlights(input, matches)).toEqual([
      { text: "Order ", matchIndex: null },
      { text: "123", matchIndex: 0 },
      { text: ", Order ", matchIndex: null },
      { text: "456", matchIndex: 1 },
    ]);
  });

  it("skips zero-length matches and keeps text intact", () => {
    const input = "a\nb";
    const { matches } = matchesOf("^", "gm", input);
    expect(splitHighlights(input, matches)).toEqual([{ text: "a\nb", matchIndex: null }]);
  });

  it("keeps HTML-like input as plain text segments", () => {
    const input = "<img src=x onerror=alert(1)>";
    const { matches } = matchesOf("img", "g", input);
    expect(splitHighlights(input, matches).map((s) => s.text).join("")).toBe(input);
  });
});
