import { Platform } from "@prisma/client";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parsePlatform(value: unknown): Platform | null {
  if (typeof value !== "string") return null;
  return Object.values(Platform).includes(value as Platform) ? (value as Platform) : null;
}

export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseBoundedInteger(
  value: unknown,
  options: { min: number; max: number; fallback?: number }
): number | null {
  if (value === undefined || value === null || value === "") {
    return options.fallback ?? null;
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < options.min || number > options.max) return null;
  return number;
}
