import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, Download, PackageCheck, Undo2, Wallet, TrendingUp } from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { ResellerMoneyFlow, ResellerProductBreakdown } from "@/components/reseller-report-summary";
import { bdtNum, orderStatusLabel } from "@/lib/supplier";
import {
  loadAdminResellerOverview,
  loadResellerReport,
  type AdminResellerRow,
  type ResellerReport,
} from "@/lib/reseller-report";

export const Route = createFileRoute("/_authenticated/admin/reseller-report")({
  component: AdminResellerReportPage,
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

function AdminResellerReportPage() {
  const [resellers, setResellers] = useState<AdminResellerRow[]>([]);
  const [resellerId, setResellerId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<ResellerReport | null>(null);
  const [tab, setTab] = useState<"products" | "sold" | "upcoming" | "returns">("products");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setResellers(await loadAdminResellerOverview(from || null, to || null));
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
    if (!resellerId) {
      setDetail(null);
      return;
    }
    setBusy(true);
    loadResellerReport(resellerId, from || null, to || null)
      .then((r) => setDetail(r))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Load failed"))
      .finally(() => setBusy(false));
  }, [resellerId, from, to]);

  const totals = useMemo(
    () => ({
      earning: resellers.reduce((s, r) => s + r.earning, 0),
      sold: resellers.reduce((s, r) => s + r.sold_qty, 0),
      supplied: resellers.reduce((s, r) => s + r.supplied_value, 0),
      suppliedQty: resellers.reduce((s, r) => s + r.supplied_qty, 0),
      pending: resellers.reduce((s, r) => s + r.pending_amount, 0),
      paid: resellers.reduce((s, r) => s + r.paid, 0),
      returned: resellers.reduce((s, r) => s + r.returned_amount, 0),
      due: resellers.reduce(
        (s, r) => s + Math.max(r.earning + r.deposit_balance - r.paid - r.pending_payout, 0),
        0,
      ),
    }),
    [resellers],
  );

  const needle = q.trim().toLowerCase();
  const listed = resellers.filter(
    (r) =>
      !needle ||
      (r.display_name ?? "").toLowerCase().includes(needle) ||
      (r.code ?? "").toLowerCase().includes(needle),
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
      <PageHeader title="Reseller report" description="Sales, profit, returns, paid, and outstanding amounts per reseller." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6">
        <StatCard label="Sold value" value={bdtNum(totals.supplied)} hint={`${totals.suppliedQty} pcs`} icon={<PackageCheck className="h-4 w-4" />} />
        <StatCard label="Delivered qty" value={totals.sold} tone="sky" icon={<PackageCheck className="h-4 w-4" />} />
        <StatCard label="Reseller profit" value={bdtNum(totals.earning)} tone="emerald" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="In progress" value={bdtNum(totals.pending)} tone="amber" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Returned value" value={bdtNum(totals.returned)} tone="rose" icon={<Undo2 className="h-4 w-4" />} />
        <StatCard label="Payable now" value={bdtNum(totals.due)} tone="violet" icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="surface-card mb-4 grid gap-3 p-4 sm:grid-cols-[repeat(4,1fr)_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium">Reseller</label>
          <select value={resellerId} onChange={(e) => setResellerId(e.target.value)} className={inp}>
            <option value="">All resellers</option>
            {resellers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.display_name} ({r.code})
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
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reseller…" className={inp + " pl-8"} />
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
                        "Sold qty",
                        "Sold value",
                        "Delivered qty",
                        "Delivered value",
                        "Profit",
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
                        p.delivered_profit,
                        p.pending_qty,
                        p.pending_value,
                        p.returned_qty,
                        p.returned_value,
                      ]),
                    ]
                  : [
                      [
                        "Reseller",
                        "Code",
                        "Orders",
                        "Sold qty",
                        "Sold value",
                        "Delivered qty",
                        "Profit",
                        "In progress",
                        "Returned qty",
                        "Returned amount",
                        "Paid",
                        "Pending payout",
                        "Payable",
                      ],
                      ...listed.map((r) => [
                        r.display_name,
                        r.code,
                        r.orders,
                        r.supplied_qty,
                        r.supplied_value,
                        r.sold_qty,
                        r.earning,
                        r.pending_amount,
                        r.returned_qty,
                        r.returned_amount,
                        r.paid,
                        r.pending_payout,
                        Math.max(r.earning + r.deposit_balance - r.paid - r.pending_payout, 0),
                      ]),
                    ],
                detail ? "reseller-products.csv" : "reseller-report.csv",
              )
            }
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {!resellerId ? (
        listed.length === 0 ? (
          <EmptyState title="No resellers" description="No resellers found." />
        ) : (
          <div className="surface-card overflow-x-auto p-4">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-2">Reseller</th>
                  <th>Orders</th>
                  <th>Sold</th>
                  <th>Sold value</th>
                  <th>Delivered qty</th>
                  <th>Profit</th>
                  <th>In progress</th>
                  <th>Returned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listed.map((r) => (
                  <tr key={r.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setResellerId(r.id)}>
                    <td className="p-2">
                      <div className="font-medium">{r.display_name}</div>
                      <div className="text-[10px] text-muted-foreground">{r.code}</div>
                    </td>
                    <td className="tabular-nums">{r.orders}</td>
                    <td className="tabular-nums">{r.supplied_qty}</td>
                    <td className="tabular-nums">{bdtNum(r.supplied_value)}</td>
                    <td className="tabular-nums text-emerald-600">{r.sold_qty}</td>
                    <td className="font-semibold tabular-nums text-emerald-600">{bdtNum(r.earning)}</td>
                    <td className="tabular-nums text-amber-600">
                      {r.pending_qty} · {bdtNum(r.pending_amount)}
                    </td>
                    <td className="tabular-nums text-muted-foreground">
                      {r.returned_qty} · {bdtNum(r.returned_amount)}
                    </td>
                    <td className="tabular-nums">{bdtNum(r.paid)}</td>
                    <td className="tabular-nums text-amber-600">{bdtNum(r.pending_payout)}</td>
                    <td className="font-semibold tabular-nums text-primary">
                      {bdtNum(Math.max(r.earning + r.deposit_balance - r.paid - r.pending_payout, 0))}
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
              <ResellerMoneyFlow totals={detail.totals} />
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
                    ? `Delivered (${detail?.sold.length ?? 0})`
                    : k === "upcoming"
                      ? `In progress (${detail?.upcoming.length ?? 0})`
                      : `Returns (${detail?.returns.length ?? 0})`}
              </button>
            ))}
          </div>

          {tab === "products" ? (
            <ResellerProductBreakdown products={detail?.products ?? []} />
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
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {detail!.returns.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td><CopyOrderNumber orderNumber={r.order_number} /></td>
                        <td className="text-muted-foreground">{r.product_name}</td>
                        <td className="tabular-nums">{r.ret_qty}</td>
                        <td className="font-semibold tabular-nums">{bdtNum(Number(r.ret_qty) * Number(r.unit_price))}</td>
                        <td className="capitalize text-muted-foreground">{orderStatusLabel(r.status)}</td>
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
                    <th>Profit</th>
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
                        <td className="font-semibold tabular-nums">{bdtNum(qty * Number(r.unit_price))}</td>
                        <td className="tabular-nums text-emerald-600">{bdtNum(qty * Number(r.unit_profit ?? 0))}</td>
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
