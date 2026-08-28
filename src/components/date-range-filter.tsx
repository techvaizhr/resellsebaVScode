import {
  DATE_PRESET_OPTIONS,
  DEFAULT_ORDER_FILTERS,
  resolveDateRange,
  type DatePreset,
} from "@/components/order-filters";

/** Global date-range state shared by every dashboard / report page. */
export type DateRangeState = {
  preset: DatePreset;
  from: string;
  to: string;
};

export const DEFAULT_DATE_RANGE: DateRangeState = { preset: "last30", from: "", to: "" };

/** Same preset math as the order filter bar — single source of truth. */
export function resolveRange(v: DateRangeState) {
  return resolveDateRange({ ...DEFAULT_ORDER_FILTERS, datePreset: v.preset, from: v.from, to: v.to });
}

export function inRange(createdAt: string, v: DateRangeState) {
  const { fromTs, toTs } = resolveRange(v);
  const ts = new Date(createdAt).getTime();
  if (fromTs != null && ts < fromTs) return false;
  if (toTs != null && ts > toTs) return false;
  return true;
}

const fmt = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function rangeLabel(v: DateRangeState) {
  const { fromTs, toTs } = resolveRange(v);
  if (fromTs == null && toTs == null) return "Life time";
  if (fromTs != null && toTs != null) {
    const a = fmt(fromTs);
    const b = fmt(toTs);
    return a === b ? a : `${a} → ${b}`;
  }
  return fromTs != null ? `From ${fmt(fromTs)}` : `Until ${fmt(toTs!)}`;
}

/** Compact dropdown-only date filter — no label, icon, or resolved range text. */
export function DateRangeBar({
  value,
  onChange,
  right,
  note,
  label = "Date filter",
  compact = false,
}: {
  value: DateRangeState;
  onChange: (v: DateRangeState) => void;
  right?: React.ReactNode;
  note?: string;
  label?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <select
          value={value.preset}
          onChange={(e) => {
            const p = e.target.value as DatePreset;
            onChange(p === "custom" ? { ...value, preset: "custom" } : { preset: p, from: "", to: "" });
          }}
          className="h-9 w-44 rounded-lg border bg-background px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          aria-label={label}
        >
          {DATE_PRESET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {value.preset === "custom" && (
          <>
            <input
              type="date"
              value={value.from}
              max={value.to || undefined}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-xs text-muted-foreground">→</span>
            <input
              type="date"
              value={value.to}
              min={value.from || undefined}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className="h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </>
        )}

        {right}
      </div>
    );
  }

  return (
    <div className="surface-card mb-6 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={value.preset}
          onChange={(e) => {
            const p = e.target.value as DatePreset;
            onChange(p === "custom" ? { ...value, preset: "custom" } : { preset: p, from: "", to: "" });
          }}
          className="h-9 w-56 rounded-lg border bg-background px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          aria-label={label}
        >
          {DATE_PRESET_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {value.preset === "custom" && (
          <>
            <input
              type="date"
              value={value.from}
              max={value.to || undefined}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-xs text-muted-foreground">→</span>
            <input
              type="date"
              value={value.to}
              min={value.from || undefined}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className="h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </>
        )}

        <div className="ml-auto flex items-center gap-2">{right}</div>
      </div>

      {note && <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}
