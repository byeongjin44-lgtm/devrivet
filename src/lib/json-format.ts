export type JsonErrorLocation = {
  message: string;
  line?: number;
  column?: number;
};

export class JsonFormatError extends Error {
  line?: number;
  column?: number;

  constructor(location: JsonErrorLocation) {
    super(location.message);
    this.line = location.line;
    this.column = location.column;
  }
}

function locateError(input: string, message: string): { line?: number; column?: number } {
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { line: Number(lineColMatch[1]), column: Number(lineColMatch[2]) };
  }

  const positionMatch = message.match(/position (\d+)/i);
  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const upToError = input.slice(0, position);
    const lines = upToError.split("\n");
    return { line: lines.length, column: lines[lines.length - 1].length + 1 };
  }

  return {};
}

function toJsonFormatError(input: string, err: unknown): JsonFormatError {
  const message = err instanceof Error ? err.message : "Invalid JSON.";
  return new JsonFormatError({ message, ...locateError(input, message) });
}

export function formatJson(input: string, indent = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (err) {
    throw toJsonFormatError(input, err);
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (err) {
    throw toJsonFormatError(input, err);
  }
}

export type JsonValidationResult =
  | { valid: true }
  | { valid: false; message: string; line?: number; column?: number };

export function validateJson(input: string): JsonValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (err) {
    const formatError = toJsonFormatError(input, err);
    return { valid: false, message: formatError.message, line: formatError.line, column: formatError.column };
  }
}
