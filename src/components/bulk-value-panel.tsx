import { useState } from "react";
import { ChevronDown, ChevronRight, Wand2, Loader2 } from "lucide-react";

/**
 * Admin-only bulk value setter for the product list.
 *
 * Lets an admin set reseller price, suggested price, packaging cost, stock and
 * weight for every selected product at once — as a fixed value, or as a
 * percentage of the admin buying cost / the product's current value. Anything
 * set here can still be fine-tuned inline in the table afterwards.
 */
export type BulkTargetRow = {
  id: string;
  buying_price: number;
  reseller_price: number;
  suggested_price: number;
  packaging_cost: number;
  stock: number;
  weight_grams: number | null;
};

type Mode = "fixed" | "pct_cost" | "pct_current";

type FieldKey = "reseller_price" | "suggested_price" | "packaging_cost" | "stock" | "weight_kg";

type FieldState = { on: boolean; mode: Mode; value: string };

const FIELDS: { key: FieldKey; label: string; unit: string; percent: boolean }[] = [
  { key: "reseller_price", label: "Reseller price", unit: "৳", percent: true },
  { key: "suggested_price", label: "Suggested price", unit: "৳", percent: true },
  { key: "packaging_cost", label: "Packaging", unit: "৳", percent: true },
  { key: "stock", label: "Stock", unit: "pcs", percent: false },
  { key: "weight_kg", label: "Weight", unit: "kg", percent: false },
];

const EMPTY: Record<FieldKey, FieldState> = {
  reseller_price: { on: false, mode: "fixed", value: "" },
  suggested_price: { on: false, mode: "fixed", value: "" },
  packaging_cost: { on: false, mode: "fixed", value: "" },
  stock: { on: false, mode: "fixed", value: "" },
  weight_kg: { on: false, mode: "fixed", value: "" },
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function round5(n: number) {
  return Math.round(n / 5) * 5;
}

export function computeBulkPatch(
  row: BulkTargetRow,
  state: Record<FieldKey, FieldState>,
): Record<string, number> {
  const patch: Record<string, number> = {};
  for (const f of FIELDS) {
    const s = state[f.key];
    if (!s.on) continue;
    const v = Number(s.value);
    if (!Number.isFinite(v) || s.value.trim() === "") continue;

    if (f.key === "stock") {
      patch.stock = Math.max(0, Math.round(v));
      continue;
    }
    if (f.key === "weight_kg") {
      patch.weight_grams = Math.max(0, Math.round(v * 1000));
      continue;
    }
    const current =
      f.key === "reseller_price"
        ? Number(row.reseller_price ?? 0)
        : f.key === "suggested_price"
          ? Number(row.suggested_price ?? 0)
          : Number(row.packaging_cost ?? 0);
    const cost = Number(row.buying_price ?? 0);
    const next =
      s.mode === "fixed" ? v : s.mode === "pct_cost" ? cost * (1 + v / 100) : current * (1 + v / 100);
    patch[f.key] = Math.max(0, round5(next));
  }
  return patch;
}

export function BulkValuePanel({
  count,
  busy,
  onApply,
}: {
  count: number;
  busy: boolean;
  onApply: (state: Record<FieldKey, FieldState>) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Record<FieldKey, FieldState>>(EMPTY);

  function set(key: FieldKey, patch: Partial<FieldState>) {
    setState((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }

  const active = FIELDS.filter((f) => state[f.key].on && state[f.key].value.trim() !== "");

  return (
    <div className="mt-2 w-full rounded-md border bg-background">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Wand2 className="h-3.5 w-3.5 text-primary" />
        Bulk set values
        <span className="text-muted-foreground">
          — reseller, suggested, packaging, stock, weight
        </span>
        {active.length > 0 && !open && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {active.length} field{active.length > 1 ? "s" : ""} ready
          </span>
        )}
      </button>

      {open && (
        <div className="space-y-2 border-t px-3 py-3">
          {FIELDS.map((f) => {
            const s = state[f.key];
            return (
              <div
                key={f.key}
                className="grid grid-cols-[auto_minmax(0,7rem)_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[auto_9rem_11rem_minmax(0,1fr)]"
              >
                <input
                  type="checkbox"
                  checked={s.on}
                  onChange={(e) => set(f.key, { on: e.target.checked })}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                <span className={`text-xs font-medium ${s.on ? "" : "text-muted-foreground"}`}>
                  {f.label}
                </span>
                {f.percent ? (
                  <select
                    disabled={!s.on}
                    value={s.mode}
                    onChange={(e) => set(f.key, { mode: e.target.value as Mode })}
                    className="h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50"
                  >
                    <option value="fixed">Fixed amount</option>
                    <option value="pct_cost">% of admin cost</option>
                    <option value="pct_current">% change on current</option>
                  </select>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Fixed value</span>
                )}
                <div className="relative">
                  <input
                    disabled={!s.on}
                    inputMode="decimal"
                    value={s.value}
                    onChange={(e) => set(f.key, { value: e.target.value })}
                    placeholder={s.mode === "fixed" ? `Value in ${f.unit}` : "Percent"}
                    className="h-8 w-full rounded-md border bg-background px-2 pr-9 text-xs disabled:opacity-50"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    {f.percent && s.mode !== "fixed" ? "%" : f.unit}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              disabled={busy || !active.length || !count}
              onClick={() => onApply(state)}
              className="btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
              Apply to {count} product{count === 1 ? "" : "s"}
            </button>
            <button
              onClick={() => setState(EMPTY)}
              className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
            <span className="text-[11px] text-muted-foreground">
              Values can still be edited inline in the table afterwards.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
