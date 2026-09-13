/**
 * Safe date parsing and formatting utilities to prevent "Invalid Date" errors
 * across the application.
 */

export function safeDate(val: unknown): Date | null {
  if (val === null || val === undefined || val === "") return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === "string" || typeof val === "number") {
    // If it's a month-year string like "YYYY-MM"
    if (typeof val === "string" && /^\d{4}-\d{2}$/.test(val)) {
      const d = new Date(`${val}-01T00:00:00`);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatDate(
  val: unknown,
  fallback = "—",
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string {
  const d = safeDate(val);
  if (!d) return fallback;
  try {
    return d.toLocaleDateString(locale, options);
  } catch {
    return fallback;
  }
}

export function formatTime(
  val: unknown,
  fallback = "—",
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" },
  locale?: string
): string {
  const d = safeDate(val);
  if (!d) return fallback;
  try {
    return d.toLocaleTimeString(locale, options);
  } catch {
    return fallback;
  }
}

export function formatDateTime(
  val: unknown,
  fallback = "—",
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string {
  const d = safeDate(val);
  if (!d) return fallback;
  try {
    return d.toLocaleString(locale, options);
  } catch {
    return fallback;
  }
}

export function formatMonthYear(val: unknown, fallback = "—"): string {
  const d = safeDate(val);
  if (!d) return fallback;
  try {
    return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  } catch {
    return fallback;
  }
}

export function safeIsoString(val: unknown, fallbackIso = new Date().toISOString()): string {
  const d = safeDate(val);
  return d ? d.toISOString() : fallbackIso;
}

