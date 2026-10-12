export const REGEX_FLAGS = [
  { flag: "g", label: "global", description: "Find all matches, not just the first" },
  { flag: "i", label: "ignore case", description: "Case-insensitive matching" },
  { flag: "m", label: "multiline", description: "^ and $ match at line breaks" },
  { flag: "s", label: "dotAll", description: ". also matches newlines" },
  { flag: "u", label: "unicode", description: "Full Unicode matching (code points, \\u{...}, \\p{...})" },
] as const;

export type RegexFlag = (typeof REGEX_FLAGS)[number]["flag"];

/** Upper bound on collected matches so huge inputs can't freeze the UI. */
export const MAX_MATCHES = 1000;

export type RegexGroup = {
  /** 1-based capture group number. */
  index: number;
  name?: string;
  /** `undefined` when the group did not participate in the match. */
  value: string | undefined;
};

export type RegexMatch = {
  index: number;
  end: number;
  text: string;
  groups: RegexGroup[];
};

export type RegexTestResult =
  | { ok: true; matches: RegexMatch[]; truncated: boolean }
  | { ok: false; error: string };

const ALLOWED_FLAGS = new Set<string>(REGEX_FLAGS.map((f) => f.flag));

export function buildRegex(pattern: string, flags: string): RegExp {
  for (const flag of flags) {
    if (!ALLOWED_FLAGS.has(flag)) throw new SyntaxError(`Invalid regular expression: unsupported flag "${flag}"`);
  }
  if (new Set(flags).size !== flags.length) {
    throw new SyntaxError("Invalid regular expression: duplicate flag");
  }
  return new RegExp(pattern, flags);
}

function toMatch(match: RegExpExecArray, namedOrder: (string | undefined)[]): RegexMatch {
  // Only trust parsed names if they line up with the engine's group count.
  const names = namedOrder.length === match.length - 1 ? namedOrder : [];
  const groups: RegexGroup[] = [];
  for (let i = 1; i < match.length; i++) {
    groups.push({ index: i, name: names[i - 1], value: match[i] });
  }
  return { index: match.index, end: match.index + match[0].length, text: match[0], groups };
}

/**
 * Returns, for each capture group in source order, its name (or undefined).
 * Counts unescaped `(` that are not `(?:`, `(?=`, `(?!`, `(?<=`, `(?<!`, and
 * skips character classes.
 */
export function captureGroupNames(pattern: string): (string | undefined)[] {
  const names: (string | undefined)[] = [];
  let inClass = false;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "\\") {
      i++;
      continue;
    }
    if (inClass) {
      if (ch === "]") inClass = false;
      continue;
    }
    if (ch === "[") {
      inClass = true;
      continue;
    }
    if (ch !== "(") continue;
    if (pattern[i + 1] !== "?") {
      names.push(undefined);
      continue;
    }
    const named = /^\(\?<([A-Za-z_$][\w$]*)>/.exec(pattern.slice(i));
    if (named) names.push(named[1]);
  }
  return names;
}

export function testRegex(
  pattern: string,
  flags: string,
  input: string,
  maxMatches: number = MAX_MATCHES,
): RegexTestResult {
  let regex: RegExp;
  try {
    regex = buildRegex(pattern, flags);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: message.startsWith("Invalid regular expression") ? message : `Invalid regular expression: ${message}`,
    };
  }

  const names = captureGroupNames(pattern);

  if (!regex.global) {
    const match = regex.exec(input);
    return { ok: true, matches: match ? [toMatch(match, names)] : [], truncated: false };
  }

  // matchAll advances past zero-length matches (respecting the `u` flag), so
  // patterns like `^` or `.*?` can't loop forever. Stop early at the cap.
  const matches: RegexMatch[] = [];
  let truncated = false;
  for (const match of input.matchAll(regex)) {
    if (matches.length >= maxMatches) {
      truncated = true;
      break;
    }
    matches.push(toMatch(match as RegExpExecArray, names));
  }
  return { ok: true, matches, truncated };
}

export type HighlightSegment = { text: string; matchIndex: number | null };

/**
 * Splits input into plain and matched segments for safe (non-HTML) rendering.
 * Zero-length matches produce no segment. Assumes matches are sorted and
 * non-overlapping, as produced by `testRegex`.
 */
export function splitHighlights(input: string, matches: RegexMatch[]): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;
  matches.forEach((match, i) => {
    if (match.end === match.index) return;
    if (match.index > cursor) segments.push({ text: input.slice(cursor, match.index), matchIndex: null });
    segments.push({ text: input.slice(match.index, match.end), matchIndex: i });
    cursor = match.end;
  });
  if (cursor < input.length) segments.push({ text: input.slice(cursor), matchIndex: null });
  return segments;
}
