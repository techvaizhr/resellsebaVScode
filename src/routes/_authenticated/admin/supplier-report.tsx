import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, Download, PackageCheck, Undo2, Wallet, TrendingUp } from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { SupplierMoneyFlow, SupplierProductBreakdown } from "@/components/supplier-report-summary";
import {
  bdtNum,
  loadAdminSupplierOverview,
  loadSupplierReport,
  orderStatusLabel,
  type AdminSupplierOverview,
  type SupplierReport,
} from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/admin/supplier-report")({
  component: AdminSupplierReportPage,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function csv(rows: (string | number)[][], name: string) {
  const body = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminSupplierReportPage() {
  const [overview, setOverview] = useState<AdminSupplierOverview | null>(null);
  const [supplierId, setSupplierId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<SupplierReport | null>(null);
  const [tab, setTab] = useState<"products" | "sold" | "upcoming" | "returns">("products");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setOverview(await loadAdminSupplierOverview(from || null, to || null));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!supplierId) {
      setDetail(null);
      return;
    }
    setBusy(true);
    loadSupplierReport(supplierId, from || null, to || null)
      .then((r) => setDetail(r))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setBusy(false));
  }, [supplierId, from, to]);

  const suppliers = overview?.suppliers ?? [];
  const totals = useMemo(
    () => ({
      earning: suppliers.reduce((s, r) => s + r.earning, 0),
      sold: suppliers.reduce((s, r) => s + r.sold_qty, 0),
      supplied: suppliers.reduce((s, r) => s + r.supplied_value, 0),
      suppliedQty: suppliers.reduce((s, r) => s + r.supplied_qty, 0),
      pending: suppliers.reduce((s, r) => s + r.pending_amount, 0),
      paid: suppliers.reduce((s, r) => s + r.paid, 0),
      returned: suppliers.reduce((s, r) => s + r.returned_amount, 0),
      due: suppliers.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0),
    }),
    [suppliers],
  );

  const needle = q.trim().toLowerCase();
  const listed = suppliers.filter(
    (s) => !needle || s.display_name.toLowerCase().includes(needle) || s.code.toLowerCase().includes(needle),
  );

  const rows = useMemo(() => {
    if (!detail) return [];
    if (tab === "sold") return detail.sold;
    if (tab === "upcoming") return detail.upcoming;
    return [];
  }, [detail, tab]);

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Supplier report" description="Sales, returns, paid, and outstanding amounts per supplier." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6">
        <StatCard label="Supplied value" value={bdtNum(totals.supplied)} hint={`${totals.suppliedQty} pcs`} icon={<PackageCheck className="h-4 w-4" />} />
        <StatCard label="Sold qty" value={totals.sold} tone="sky" icon={<PackageCheck className="h-4 w-4" />} />
        <StatCard label="Supplier earning" value={bdtNum(totals.earning)} tone="emerald" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="In progress" value={bdtNum(totals.pending)} tone="amber" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Returned value" value={bdtNum(totals.returned)} tone="rose" icon={<Undo2 className="h-4 w-4" />} />
        <StatCard label="Payable now" value={bdtNum(totals.due)} tone="violet" icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="surface-card mb-4 grid gap-3 p-4 sm:grid-cols-[repeat(4,1fr)_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium">Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={inp}>
            <option value="">All suppliers</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name} ({s.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Supplier…" className={inp + " pl-8"} />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() =>
              csv(
                detail
                  ? [
                      [
                        "Product",
                        "Unit price",
                        "Orders",
                        "Supplied qty",
                        "Supplied value",
                        "Delivered qty",
                        "Earned",
                        "In progress qty",
                        "In progress value",
                        "Returned qty",
                        "Returned value",
                      ],
                      ...detail.products.map((p) => [
                        p.product_name,
                        p.unit_price,
                        p.orders,
                        p.supplied_qty,
                        p.supplied_value,
                        p.delivered_qty,
                        p.delivered_value,
                        p.pending_qty,
                        p.pending_value,
                        p.returned_qty,
                        p.returned_value,
                      ]),
                    ]
                  : [
                      [
                        "Supplier",
                        "Code",
                        "Supplied qty",
                        "Supplied value",
                        "Sold qty",
                        "Earning",
                        "In progress",
                        "Returned qty",
                        "Returned amount",
                        "Paid",
                        "Payable",
                      ],
                      ...listed.map((s) => [
                        s.display_name,
                        s.code,
                        s.supplied_qty,
                        s.supplied_value,
                        s.sold_qty,
                        s.earning,
                        s.pending_amount,
                        s.returned_qty,
                        s.returned_amount,
                        s.paid,
                        Math.max(s.earning - s.paid - s.pending_payout, 0),
                      ]),
                    ],
                detail ? "supplier-products.csv" : "supplier-report.csv",
              )
            }
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {!supplierId ? (
        listed.length === 0 ? (
          <EmptyState title="No suppliers" description="No suppliers found." />
        ) : (
          <div className="surface-card overflow-x-auto p-4">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-2">Supplier</th>
                  <th>Products</th>
                  <th>Supplied</th>
                  <th>Supplied value</th>
                  <th>Sold qty</th>
                  <th>Earning</th>
                  <th>In progress</th>
                  <th>Returned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listed.map((s) => (
                  <tr key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSupplierId(s.id)}>
                    <td className="p-2">
                      <div className="font-medium">{s.display_name}</div>
                      <div className="text-[10px] text-muted-foreground">{s.code}</div>
                    </td>
                    <td className="tabular-nums">{s.products}</td>
                    <td className="tabular-nums">{s.supplied_qty}</td>
                    <td className="tabular-nums">{bdtNum(s.supplied_value)}</td>
                    <td className="tabular-nums">{s.sold_qty}</td>
                    <td className="font-semibold tabular-nums text-emerald-600">{bdtNum(s.earning)}</td>
                    <td className="tabular-nums text-amber-600">
                      {s.pending_qty} · {bdtNum(s.pending_amount)}
                    </td>
                    <td className="tabular-nums text-muted-foreground">
                      {s.returned_qty} · {bdtNum(s.returned_amount)}
                    </td>
                    <td className="tabular-nums">{bdtNum(s.paid)}</td>
                    <td className="tabular-nums text-amber-600">{bdtNum(s.pending_payout)}</td>
                    <td className="font-semibold tabular-nums text-primary">
                      {bdtNum(Math.max(s.earning - s.paid - s.pending_payout, 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : busy ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="surface-card p-4">
          {detail && (
            <div className="mb-4">
              <SupplierMoneyFlow totals={detail.totals} />
            </div>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            {(["products", "sold", "upcoming", "returns"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
                  (tab === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
                }
              >
                {k === "products"
                  ? `Product-wise (${detail?.products.length ?? 0})`
                  : k === "sold"
                    ? `Sold (${detail?.sold.length ?? 0})`
                    : k === "upcoming"
                      ? `In progress (${detail?.upcoming.length ?? 0})`
                      : `Returns (${detail?.returns.length ?? 0})`}
              </button>
            ))}
          </div>

          {tab === "products" ? (
            <SupplierProductBreakdown products={detail?.products ?? []} />
          ) : tab === "returns" ? (
            (detail?.returns.length ?? 0) === 0 ? (
              <EmptyState title="No returns" description="No returns." />
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                    <tr>
                      <th className="p-2">Date</th>
                      <th>Order</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Value</th>
                      <th>Order status</th>
                      <th>Handover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {detail!.returns.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td><CopyOrderNumber orderNumber={r.order_number} /></td>
                        <td className="text-muted-foreground">{r.product_name}</td>
                        <td className="tabular-nums">{r.quantity}</td>
                        <td className="font-semibold tabular-nums">{bdtNum(Number(r.quantity) * Number(r.unit_price))}</td>
                        <td className="capitalize text-muted-foreground">{orderStatusLabel(r.order_status)}</td>
                        <td>{r.status === "handed_over" ? "Handed over" : "Waiting"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : rows.length === 0 ? (
            <EmptyState title="No records" description="No records match this filter." />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2">Date</th>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit price</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r) => {
                    const qty = tab === "sold" ? r.kept_qty : r.quantity;
                    return (
                      <tr key={r.id}>
                        <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="font-medium"><CopyOrderNumber orderNumber={r.order_number} /></td>
                        <td className="text-muted-foreground">{r.product_name}</td>
                        <td className="tabular-nums">{qty}</td>
                        <td className="tabular-nums">{bdtNum(r.unit_price)}</td>
                        <td className="font-semibold tabular-nums">{bdtNum(qty * r.unit_price)}</td>
                        <td className="capitalize text-muted-foreground">{orderStatusLabel(r.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
