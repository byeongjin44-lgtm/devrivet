export class JwtError extends Error {}

function base64UrlToBase64(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  return base64 + "=".repeat(padLength);
}

function decodeBase64UrlSegment(segment: string): string {
  let binary: string;
  try {
    binary = atob(base64UrlToBase64(segment));
  } catch {
    throw new JwtError("Invalid Base64URL segment.");
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new JwtError("Decoded segment is not valid UTF-8.");
  }
}

export type DecodedJwt = {
  header: unknown;
  payload: unknown;
  headerRaw: string;
  payloadRaw: string;
  signature: string;
};

/**
 * Decodes a JWT's header and payload. This does NOT verify the signature —
 * client-side signature verification would require the server's secret or
 * public key, which this tool never has (and shouldn't ask for).
 */
export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new JwtError("Enter a JWT to decode.");
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new JwtError("A JWT must have 3 dot-separated parts: header.payload.signature.");
  }

  const [headerSeg, payloadSeg, signature] = parts;
  if (!headerSeg || !payloadSeg) {
    throw new JwtError("Header and payload segments cannot be empty.");
  }

  const headerRaw = decodeBase64UrlSegment(headerSeg);
  const payloadRaw = decodeBase64UrlSegment(payloadSeg);

  let header: unknown;
  try {
    header = JSON.parse(headerRaw);
  } catch {
    throw new JwtError("Header is not valid JSON.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    throw new JwtError("Payload is not valid JSON.");
  }

  return { header, payload, headerRaw, payloadRaw, signature };
}

export type JwtTimeClaim = {
  claim: "iat" | "nbf" | "exp";
  value: number;
  date: Date;
};

const TIME_CLAIMS = ["iat", "nbf", "exp"] as const;

export function extractTimeClaims(payload: unknown): JwtTimeClaim[] {
  if (typeof payload !== "object" || payload === null) return [];
  const record = payload as Record<string, unknown>;
  return TIME_CLAIMS.filter((claim) => typeof record[claim] === "number" && Number.isFinite(record[claim])).map(
    (claim) => {
      const value = record[claim] as number;
      return { claim, value, date: new Date(value * 1000) };
    },
  );
}

export function isExpired(payload: unknown): boolean | null {
  if (typeof payload !== "object" || payload === null) return null;
  const exp = (payload as Record<string, unknown>).exp;
  if (typeof exp !== "number") return null;
  return Date.now() >= exp * 1000;
}
