import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { StatusTabs } from "@/components/status-tabs";
import { SupplierMoneyFlow, SupplierProductBreakdown } from "@/components/supplier-report-summary";

import { useSupplier } from "@/components/supplier-context";
import {
  bdtNum,
  loadSupplierReport,
  orderStatusLabel,
  type SupplierReport,
} from "@/lib/supplier";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/supplier/report")({
  component: SupplierReportPage,
  head: () => ({
    meta: [
      { title: "Supplier sales report · earnings breakdown" },
      { name: "description", content: "View earnings from delivered items and in-progress order values." },
      { property: "og:title", content: "Supplier sales report" },
      { property: "og:description", content: "Delivered earnings and in-progress order values." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});


const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function SupplierReportPage() {
  const { data: base } = useSupplier();
  const [data, setData] = useState<SupplierReport>(base);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"products" | "sold" | "upcoming">("products");
  const [busy, setBusy] = useState(false);

  async function applyFilter() {
    setBusy(true);
    try {
      const res = await loadSupplierReport(null, from || null, to || null);
      if (res) setData(res);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Report load failed");
    } finally {
      setBusy(false);
    }
  }

  const rows = useMemo(() => {
    const list = tab === "upcoming" ? data.upcoming : data.sold;
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (r) =>
        r.product_name.toLowerCase().includes(needle) ||
        String(r.order_number).toLowerCase().includes(needle),
    );
  }, [data, tab, q]);

  const t = data.totals;

  return (
    <div>
      <PageHeader
        title="Sales report"
        description="Accounting of delivered (kept) items — this is your due earning."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <StatCard label="Supplied value" value={bdtNum(t.supplied_value)} hint={`${t.supplied_qty} pcs`} />
        <StatCard label="Sold qty" value={t.sold_qty} tone="sky" />
        <StatCard label="Earning" value={bdtNum(t.earning)} tone="emerald" />
        <StatCard label="In progress" value={bdtNum(t.upcoming_amount)} hint={`${t.upcoming_qty} pcs`} tone="amber" />
        <StatCard label="Returned" value={bdtNum(t.returned_amount)} hint={`${t.returned_qty} pcs`} tone="rose" />
      </div>

      <div className="mb-4">
        <SupplierMoneyFlow totals={t} />
      </div>

      <div className="surface-card mb-4 grid gap-3 p-4 sm:grid-cols-[repeat(3,1fr)_auto]">
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
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order / product" className={inp} />
        </div>
        <div className="flex items-end">
          <button
            onClick={applyFilter}
            disabled={busy}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Apply
          </button>
        </div>
      </div>

      <StatusTabs
        tabs={[
          { key: "products", label: "Product-wise" },
          { key: "sold", label: "Sold" },
          { key: "upcoming", label: "In progress" },
        ]}
        tab={tab}
        onChange={(k) => setTab(k as typeof tab)}
        count={(k) =>
          k === "products" ? data.products.length : k === "sold" ? data.sold.length : data.upcoming.length
        }
        className="mb-3 w-full min-w-0"
      />

      {tab === "products" ? (
        <SupplierProductBreakdown products={data.products} />
      ) : (
      <div className="surface-card p-4">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            No records found.
          </div>
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
              <tbody>
                {rows.map((r) => {
                  const qty = tab === "sold" ? r.kept_qty : r.quantity;
                  return (
                    <tr key={r.id} className="border-t">
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
