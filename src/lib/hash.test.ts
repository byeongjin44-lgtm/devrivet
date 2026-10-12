// @vitest-environment node
// Uses Node's built-in Web Crypto (globalThis.crypto.subtle) — the same API the browser provides.
import { describe, expect, it } from "vitest";
import { HASH_ALGORITHMS, HASH_HEX_LENGTH, bytesToHex, hashText, hashTextAll } from "./hash";

describe("hashText", () => {
  it("computes the SHA-256 known vector for 'hello world'", async () => {
    expect(await hashText("hello world", "SHA-256")).toBe(
      "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    );
  });

  it("computes SHA-384 for 'hello world'", async () => {
    expect(await hashText("hello world", "SHA-384")).toBe(
      "fdbd8e75a67f29f701a4e040385e2e23986303ea10239211af907fcbb83578b3e417cb71ce646efd0819dd8c088de1bd",
    );
  });

  it("computes SHA-512 for 'hello world'", async () => {
    expect(await hashText("hello world", "SHA-512")).toBe(
      "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f",
    );
  });

  it("computes SHA-1 for 'hello world'", async () => {
    expect(await hashText("hello world", "SHA-1")).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
  });

  it("hashes the empty string", async () => {
    expect(await hashText("", "SHA-256")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(await hashText("", "SHA-1")).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709");
  });

  it("hashes Korean text as UTF-8", async () => {
    // printf '안녕하세요' | sha256sum
    expect(await hashText("안녕하세요", "SHA-256")).toBe(
      "2c68318e352971113645cbc72861e1ec23f48d5baa5f9b405fed9dddca893eb4",
    );
  });

  it("hashes emoji (astral code points) as UTF-8", async () => {
    // printf '🚀' | sha256sum  (UTF-8 bytes f0 9f 9a 80)
    expect(await hashText("🚀", "SHA-256")).toBe(
      "ebbc0b2870eb323f2b6cffa5c493ceef81ae7eb36afc73d4e0367301631daec5",
    );
  });

  it("preserves newlines in multiline input", async () => {
    const lf = await hashText("line 1\nline 2", "SHA-256");
    const crlf = await hashText("line 1\r\nline 2", "SHA-256");
    expect(lf).toBe(await expectedSha256(new TextEncoder().encode("line 1\nline 2")));
    expect(lf).not.toBe(crlf);
  });

  it("produces lowercase hex of the expected length for every algorithm", async () => {
    for (const algorithm of HASH_ALGORITHMS) {
      const hash = await hashText("DevRivet", algorithm);
      expect(hash).toMatch(/^[0-9a-f]+$/);
      expect(hash).toHaveLength(HASH_HEX_LENGTH[algorithm]);
    }
  });

  it("is deterministic and sensitive to input changes", async () => {
    expect(await hashText("same input", "SHA-512")).toBe(await hashText("same input", "SHA-512"));
    expect(await hashText("same input", "SHA-512")).not.toBe(await hashText("same input.", "SHA-512"));
  });
});

describe("hashTextAll", () => {
  it("returns one result per requested algorithm, in order", async () => {
    const results = await hashTextAll("hello world", ["SHA-1", "SHA-256"]);
    expect(results.map((r) => r.algorithm)).toEqual(["SHA-1", "SHA-256"]);
    expect(results[1].hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });
});

describe("bytesToHex", () => {
  it("zero-pads each byte", () => {
    expect(bytesToHex(new Uint8Array([0, 1, 15, 16, 255]).buffer)).toBe("00010f10ff");
  });
});

async function expectedSha256(bytes: Uint8Array): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(bytes).digest("hex");
}
