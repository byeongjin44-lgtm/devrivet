import { describe, expect, it } from "vitest";
import { Base64Error, decodeBase64, encodeBase64 } from "./base64";

describe("base64 encode/decode", () => {
  it.each([
    ["ASCII", "Hello, World!"],
    ["Unicode/Korean", "안녕하세요"],
    ["Emoji", "🚀✨😀"],
    ["Mixed", "Hello 안녕 🚀 123"],
    ["Empty string", ""],
    ["Multiline", "line1\nline2\nline3"],
  ])("round-trips %s", (_label, input) => {
    const encoded = encodeBase64(input);
    expect(decodeBase64(encoded)).toBe(input);
  });

  it("encodes known ASCII value", () => {
    expect(encodeBase64("hello")).toBe("aGVsbG8=");
  });

  it("decodes known Base64 value", () => {
    expect(decodeBase64("aGVsbG8=")).toBe("hello");
  });

  it("decodes empty string to empty string", () => {
    expect(decodeBase64("")).toBe("");
  });

  it("throws Base64Error for invalid characters", () => {
    expect(() => decodeBase64("not valid base64!!!")).toThrow(Base64Error);
  });

  it("throws Base64Error for incorrect padding length", () => {
    expect(() => decodeBase64("abc")).toThrow(Base64Error);
  });
});
