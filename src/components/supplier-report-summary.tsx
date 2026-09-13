import { useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Coins,
  Hourglass,
  Info,
  PackageCheck,
  Search,
  Undo2,
  Wallet,
} from "lucide-react";
import { bdtNum, type SupplierProductStat, type SupplierTotals } from "@/lib/supplier";

const qtyLabel = (n: number) => `${Math.round(n).toLocaleString()} pcs`;

/** Money flow: supplied → delivered → returned → payable → paid → due. */
export function SupplierMoneyFlow({ totals }: { totals: SupplierTotals }) {
  const t = totals;
  const payable = t.earning;
  const due = Math.max(payable - t.paid - t.pending_payout, 0);

  const steps = [
    {
      key: "supplied",
      label: "Total product supplied",
      hint: `${qtyLabel(t.supplied_qty)} · all live orders`,
      value: bdtNum(t.supplied_value),
      accent: "text-primary",
      icon: <Boxes className="h-4 w-4" />,
    },
    {
      key: "delivered",
      label: "Delivered (earned)",
      hint: `${qtyLabel(t.sold_qty)} · kept by customer`,
      value: bdtNum(t.earning),
      accent: "text-emerald-500",
      icon: <PackageCheck className="h-4 w-4" />,
    },
    {
      key: "progress",
      label: "In progress (potential)",
      hint: `${qtyLabel(t.upcoming_qty)} · not settled yet`,
      value: bdtNum(t.upcoming_amount),
      accent: "text-amber-500",
      icon: <Hourglass className="h-4 w-4" />,
    },
    {
      key: "returned",
      label: "Returned (deducted)",
      hint: `${qtyLabel(t.returned_qty)} · ${qtyLabel(t.returns_received_qty)} received back`,
      value: `− ${bdtNum(t.returned_amount)}`,
      accent: "text-rose-500",
      icon: <Undo2 className="h-4 w-4" />,
    },
  ];

  const ledger = [
    { label: "Payable on delivered items", value: bdtNum(payable), strong: true, accent: "text-foreground" },
    { label: "Already withdrawn (paid)", value: `− ${bdtNum(t.paid)}`, accent: "text-muted-foreground" },
    { label: "Withdraw request pending", value: `− ${bdtNum(t.pending_payout)}`, accent: "text-amber-600" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="surface-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b bg-primary/10 px-4 py-3">
          <Coins className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Full money flow</h3>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {steps.map((s) => (
            <div key={s.key} className="bg-card p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className={s.accent}>{s.icon}</span>
                {s.label}
              </div>
              <div className={`mt-1 text-lg font-bold tabular-nums ${s.accent}`}>{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.hint}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Every line uses the price saved at order time, so later price changes never rewrite old sales.
        </div>
      </div>

      <div className="surface-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b bg-primary/10 px-4 py-3">
          <Wallet className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Payout ledger</h3>
        </div>
        <div className="divide-y">
          {ledger.map((l) => (
            <div key={l.label} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-muted-foreground">{l.label}</span>
              <span className={`font-semibold tabular-nums ${l.accent} ${l.strong ? "text-sm" : ""}`}>{l.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
          <span className="flex items-center gap-2 text-xs font-medium">
            <ArrowRight className="h-4 w-4" /> Payable now
          </span>
          <span className="text-lg font-bold tabular-nums">{bdtNum(due)}</span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          <div className="bg-card p-3 text-center">
            <div className="text-[11px] text-muted-foreground">Returns received</div>
            <div className="text-sm font-semibold tabular-nums">
              {t.returns_received_qty} pcs · {bdtNum(t.returns_received_amount)}
            </div>
          </div>
          <div className="bg-card p-3 text-center">
            <div className="text-[11px] text-muted-foreground">Returns to collect</div>
            <div className="text-sm font-semibold tabular-nums text-rose-500">
              {t.returns_pending_qty} pcs · {bdtNum(t.returns_pending_amount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Product × price breakdown — one row per price the product was sold at. */
export function SupplierProductBreakdown({ products }: { products: SupplierProductStat[] }) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) => p.product_name.toLowerCase().includes(needle));
  }, [products, q]);

  const sum = useMemo(
    () =>
      rows.reduce(
        (a, p) => ({
          supplied_qty: a.supplied_qty + p.supplied_qty,
          supplied_value: a.supplied_value + p.supplied_value,
          delivered_qty: a.delivered_qty + p.delivered_qty,
          delivered_value: a.delivered_value + p.delivered_value,
          pending_qty: a.pending_qty + p.pending_qty,
          pending_value: a.pending_value + p.pending_value,
          returned_qty: a.returned_qty + p.returned_qty,
          returned_value: a.returned_value + p.returned_value,
        }),
        {
          supplied_qty: 0,
          supplied_value: 0,
          delivered_qty: 0,
          delivered_value: 0,
          pending_qty: 0,
          pending_value: 0,
          returned_qty: 0,
          returned_value: 0,
        },
      ),
    [rows],
  );

  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-primary/10 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Product-wise supply &amp; value</h3>
          <p className="text-[11px] text-muted-foreground">
            Same product with a different price is listed separately, so old sales keep their old rate.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Product…"
            className="w-56 rounded-md border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">No product records in this range.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2 text-right">Unit price</th>
                <th className="p-2 text-right">Supplied</th>
                <th className="p-2 text-right">Total value</th>
                <th className="p-2 text-right">Delivered</th>
                <th className="p-2 text-right">Earned</th>
                <th className="p-2 text-right">In progress</th>
                <th className="p-2 text-right">Returned</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((p) => (
                <tr key={`${p.product_name}-${p.unit_price}`} className="hover:bg-muted/40">
                  <td className="p-2">
                    <div className="font-medium">{p.product_name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.orders} order(s)</div>
                  </td>
                  <td className="p-2 text-right tabular-nums">{bdtNum(p.unit_price)}</td>
                  <td className="p-2 text-right tabular-nums">{p.supplied_qty}</td>
                  <td className="p-2 text-right font-semibold tabular-nums">{bdtNum(p.supplied_value)}</td>
                  <td className="p-2 text-right tabular-nums text-emerald-600">{p.delivered_qty}</td>
                  <td className="p-2 text-right font-semibold tabular-nums text-emerald-600">
                    {bdtNum(p.delivered_value)}
                  </td>
                  <td className="p-2 text-right tabular-nums text-amber-600">
                    {p.pending_qty} · {bdtNum(p.pending_value)}
                  </td>
                  <td className="p-2 text-right tabular-nums text-rose-500">
                    {p.returned_qty} · {bdtNum(p.returned_value)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary/10 font-semibold">
                <td className="p-2">Total</td>
                <td className="p-2" />
                <td className="p-2 text-right tabular-nums">{sum.supplied_qty}</td>
                <td className="p-2 text-right tabular-nums">{bdtNum(sum.supplied_value)}</td>
                <td className="p-2 text-right tabular-nums">{sum.delivered_qty}</td>
                <td className="p-2 text-right tabular-nums text-emerald-600">{bdtNum(sum.delivered_value)}</td>
                <td className="p-2 text-right tabular-nums text-amber-600">{bdtNum(sum.pending_value)}</td>
                <td className="p-2 text-right tabular-nums text-rose-500">{bdtNum(sum.returned_value)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
