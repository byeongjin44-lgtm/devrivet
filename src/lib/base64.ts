export class Base64Error extends Error {}

/**
 * Encodes UTF-8 text to Base64. Uses TextEncoder so multi-byte characters
 * (Korean, emoji, etc.) round-trip correctly, unlike a naive btoa(string) call.
 */
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string back to UTF-8 text.
 * Throws Base64Error if the input is not valid Base64.
 */
export function decodeBase64(input: string): string {
  const sanitized = input.replace(/\s+/g, "");
  if (sanitized === "") return "";

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(sanitized) || sanitized.length % 4 !== 0) {
    throw new Base64Error("Invalid Base64 input.");
  }

  let binary: string;
  try {
    binary = atob(sanitized);
  } catch {
    throw new Base64Error("Invalid Base64 input.");
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Base64Error("Decoded Base64 is not valid UTF-8 text.");
  }
}
