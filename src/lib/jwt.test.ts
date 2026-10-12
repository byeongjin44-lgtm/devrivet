import { describe, expect, it } from "vitest";
import { JwtError, decodeJwt, extractTimeClaims, isExpired } from "./jwt";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("decodeJwt", () => {
  it("decodes the standard example token's header and payload", () => {
    const result = decodeJwt(SAMPLE_JWT);
    expect(result.header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(result.payload).toEqual({ sub: "1234567890", name: "John Doe", iat: 1516239022 });
    expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  });

  it("trims surrounding whitespace", () => {
    const result = decodeJwt(`  ${SAMPLE_JWT}  `);
    expect(result.header).toEqual({ alg: "HS256", typ: "JWT" });
  });

  it("throws JwtError for an empty string", () => {
    expect(() => decodeJwt("")).toThrow(JwtError);
  });

  it("throws JwtError when there aren't exactly 3 segments", () => {
    expect(() => decodeJwt("only.two")).toThrow(JwtError);
    expect(() => decodeJwt("a.b.c.d")).toThrow(JwtError);
  });

  it("throws JwtError for invalid Base64URL content", () => {
    expect(() => decodeJwt("not-base64!!.not-base64!!.sig")).toThrow(JwtError);
  });

  it("throws JwtError when a segment decodes to non-JSON", () => {
    const notJsonHeader = Buffer.from("not json").toString("base64url");
    expect(() => decodeJwt(`${notJsonHeader}.${notJsonHeader}.sig`)).toThrow(JwtError);
  });
});

describe("extractTimeClaims", () => {
  it("extracts iat as a date claim", () => {
    const { payload } = decodeJwt(SAMPLE_JWT);
    const claims = extractTimeClaims(payload);
    expect(claims).toHaveLength(1);
    expect(claims[0]).toMatchObject({ claim: "iat", value: 1516239022 });
  });

  it("extracts exp and nbf when present", () => {
    const claims = extractTimeClaims({ iat: 100, nbf: 200, exp: 300 });
    expect(claims.map((c) => c.claim)).toEqual(["iat", "nbf", "exp"]);
  });

  it("returns an empty array for a payload with no time claims", () => {
    expect(extractTimeClaims({ sub: "abc" })).toEqual([]);
  });
});

describe("isExpired", () => {
  it("returns true for a token with exp in the past", () => {
    expect(isExpired({ exp: Math.floor(Date.now() / 1000) - 3600 })).toBe(true);
  });

  it("returns false for a token with exp in the future", () => {
    expect(isExpired({ exp: Math.floor(Date.now() / 1000) + 3600 })).toBe(false);
  });

  it("returns null when there is no exp claim", () => {
    expect(isExpired({ sub: "abc" })).toBeNull();
  });
});
