const HANDLE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,38}$/;

export function normalizeExternalHandle(input: string): string {
  return input.trim().replace(/^@+/, "");
}

export function parseExternalHandle(input: string): string | null {
  const handle = normalizeExternalHandle(input);
  if (!HANDLE_PATTERN.test(handle)) return null;
  return handle;
}

export function clampRefreshMinutes(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.floor(value), 60), 7 * 24 * 60);
}
