export const HASH_ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"] as const;

export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

/** Hex digest length per algorithm (bytes × 2). */
export const HASH_HEX_LENGTH: Record<HashAlgorithm, number> = {
  "SHA-1": 40,
  "SHA-256": 64,
  "SHA-384": 96,
  "SHA-512": 128,
};

export const WEAK_ALGORITHMS: ReadonlySet<HashAlgorithm> = new Set(["SHA-1"]);

export function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Hashes the UTF-8 bytes of `text` with the browser's Web Crypto API; returns lowercase hex. */
export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto is not available in this browser (it requires a secure HTTPS connection).");
  }
  const digest = await globalThis.crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return bytesToHex(digest);
}

export async function hashTextAll(
  text: string,
  algorithms: readonly HashAlgorithm[],
): Promise<{ algorithm: HashAlgorithm; hash: string }[]> {
  return Promise.all(algorithms.map(async (algorithm) => ({ algorithm, hash: await hashText(text, algorithm) })));
}
