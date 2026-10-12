import { describe, expect, it } from "vitest";
import { UrlEncodeError, decodeUrlComponent, encodeUrlComponent } from "./url-encode";

describe("encodeUrlComponent", () => {
  it("encodes spaces as %20", () => {
    expect(encodeUrlComponent("hello world")).toBe("hello%20world");
  });

  it("encodes reserved query-string characters like & and =", () => {
    expect(encodeUrlComponent("name=John Doe&city=New York")).toBe(
      "name%3DJohn%20Doe%26city%3DNew%20York",
    );
  });

  it("encodes Unicode text", () => {
    expect(encodeUrlComponent("안녕")).toBe("%EC%95%88%EB%85%95");
  });

  it("leaves unreserved characters untouched", () => {
    expect(encodeUrlComponent("abc-123_ABC.~")).toBe("abc-123_ABC.~");
  });
});

describe("decodeUrlComponent", () => {
  it("round-trips encoded text back to the original", () => {
    const original = "name=John Doe&city=New York";
    expect(decodeUrlComponent(encodeUrlComponent(original))).toBe(original);
  });

  it("decodes %20 back to a space", () => {
    expect(decodeUrlComponent("hello%20world")).toBe("hello world");
  });

  it("round-trips Unicode text", () => {
    const original = "한국어 emoji 🚀";
    expect(decodeUrlComponent(encodeUrlComponent(original))).toBe(original);
  });

  it("throws UrlEncodeError for malformed percent-encoding", () => {
    expect(() => decodeUrlComponent("%ZZ")).toThrow(UrlEncodeError);
  });

  it("throws UrlEncodeError for a truncated percent sequence", () => {
    expect(() => decodeUrlComponent("abc%2")).toThrow(UrlEncodeError);
  });

  it("decodes an empty string to an empty string", () => {
    expect(decodeUrlComponent("")).toBe("");
  });
});
