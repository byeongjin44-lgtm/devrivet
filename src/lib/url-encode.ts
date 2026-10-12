export class UrlEncodeError extends Error {}

/**
 * Uses encodeURIComponent/decodeURIComponent (not encodeURI/decodeURI) because
 * this tool is for encoding individual query parameter values or URL path
 * segments, where characters like & and = must themselves be escaped.
 * encodeURI would leave those structural characters untouched, which is
 * correct for encoding a whole URL but wrong for a single component.
 */
export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrlComponent(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new UrlEncodeError("Invalid percent-encoding in input.");
  }
}
