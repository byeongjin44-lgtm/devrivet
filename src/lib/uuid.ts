import { v4 as uuidv4, v7 as uuidv7, validate as uuidValidate, version as uuidVersion } from "uuid";

export type UuidVersion = "v4" | "v7";

export const MAX_BULK_COUNT = 1000;
export const MIN_BULK_COUNT = 1;

export function generateUuid(version: UuidVersion): string {
  return version === "v4" ? uuidv4() : uuidv7();
}

export function generateBulkUuids(version: UuidVersion, count: number): string[] {
  const clamped = Math.min(Math.max(Math.trunc(count), MIN_BULK_COUNT), MAX_BULK_COUNT);
  return Array.from({ length: clamped }, () => generateUuid(version));
}

export type UuidValidationResult =
  | { valid: true; version: 4 | 7 | number }
  | { valid: false };

export function validateUuid(input: string): UuidValidationResult {
  const trimmed = input.trim();
  if (!uuidValidate(trimmed)) {
    return { valid: false };
  }
  return { valid: true, version: uuidVersion(trimmed) };
}
