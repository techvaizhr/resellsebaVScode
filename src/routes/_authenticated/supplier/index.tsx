import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PackageCheck,
  Undo2,
  Wallet,
  Clock,
  TrendingUp,
  CheckCircle2,
  Package,
  ClipboardList,
} from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { ReportCard } from "@/components/report-blocks";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, orderStatusLabel, supplierAvailable } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/")({
  component: SupplierDashboard,
  head: () => ({
    meta: [
      { title: "Supplier dashboard — Sales & payouts" },
      {
        name: "description",
        content:
          "Delivered sales, in-progress orders, returns and withdrawable balance for your products.",
      },
      { property: "og:title", content: "Supplier dashboard — Sales & payouts" },
      {
        property: "og:description",
        content: "Track your product sales, returns and payouts in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SupplierDashboard() {
  const { data } = useSupplier();
  const t = data.totals;
  const available = supplierAvailable(t);
  const recent = data.sold.slice(0, 8);
  const upcoming = data.upcoming.slice(0, 8);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${data.supplier?.display_name ?? "Supplier"}`}
        description="All your delivered sales, returns, and payouts in one place."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/supplier/products"
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:bg-muted active:scale-95"
            >
              <Package className="h-4 w-4" /> My products
            </Link>
            <Link
              to="/supplier/report"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95"
            >
              <Wallet className="h-4 w-4" /> Reports
            </Link>
          </div>
        }
      />

      <section className="mb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <StatCard
            label="Total earning"
            to="/supplier/report"
            tone="primary"
            value={bdtNum(t.earning)}
            icon={<TrendingUp className="h-4 w-4" />}
            hint="Delivered + kept items"
          />
          <StatCard
            label="Available balance"
            to="/supplier/payouts"
            tone="emerald"
            value={bdtNum(available)}
            icon={<Wallet className="h-4 w-4" />}
            hint="Ready to withdraw"
          />
          <StatCard
            label="Total paid"
            to="/supplier/payouts"
            tone="sky"
            value={bdtNum(t.paid)}
            icon={<CheckCircle2 className="h-4 w-4" />}
            hint={`${bdtNum(t.pending_payout)} in request`}
          />
          <StatCard
            label="In progress"
            to="/supplier/orders"
            tone="amber"
            value={bdtNum(t.upcoming_amount)}
            icon={<Clock className="h-4 w-4" />}
            hint={`${t.upcoming_qty} pcs on the way`}
          />
          <StatCard
            label="Sold (kept) qty"
            to="/supplier/report"
            tone="violet"
            value={t.sold_qty}
            icon={<PackageCheck className="h-4 w-4" />}
            hint="Delivered pieces"
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Returned value"
          to="/supplier/returns"
          tone="rose"
          value={bdtNum(t.returned_amount)}
          icon={<Undo2 className="h-4 w-4" />}
          hint={`${t.returned_qty} pcs`}
        />
        <StatCard
          label="Return to receive"
          to="/supplier/returns"
          tone="amber"
          value={t.returns_pending_handover}
          icon={<Undo2 className="h-4 w-4" />}
          hint="Waiting for hand over"
        />
        <StatCard
          label="Orders in pipeline"
          to="/supplier/orders"
          tone="sky"
          value={upcoming.length}
          icon={<ClipboardList className="h-4 w-4" />}
          hint="Needs processing"
        />
        <StatCard
          label="Pending payout"
          to="/supplier/payouts"
          value={bdtNum(t.pending_payout)}
          icon={<Clock className="h-4 w-4" />}
          hint="Awaiting admin approval"
        />
      </div>

      {t.returns_pending_handover > 0 && (
        <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm">
          <b>{t.returns_pending_handover}</b> return item(s) are waiting for you to hand over.{" "}
          <Link to="/supplier/returns" className="font-medium text-primary hover:underline">
            View returns
          </Link>
        </div>
      )}

      <div className="mt-6">
        <ReportCard
          title="Recent sales"
          right={
            <Link
              to="/supplier/report"
              className="inline-flex items-center gap-1.5 text-xs text-primary"
            >
              <Package className="h-3.5 w-3.5" /> Full report
            </Link>
          }
        >
          <ItemTable rows={recent} qtyKey="kept_qty" empty="No delivered sales yet." />
        </ReportCard>

        <ReportCard
          title="In progress orders"
          right={
            <Link
              to="/supplier/orders"
              className="inline-flex items-center gap-1.5 text-xs text-primary"
            >
              <ClipboardList className="h-3.5 w-3.5" /> All orders
            </Link>
          }
        >
          <ItemTable rows={upcoming} qtyKey="quantity" empty="No orders in the pipeline." />
        </ReportCard>
      </div>
    </div>
  );
}

function ItemTable({
  rows,
  qtyKey,
  empty,
}: {
  rows: {
    id: string;
    order_number: string;
    product_name: string;
    quantity: number;
    kept_qty: number;
    unit_price: number;
    status: string;
  }[];
  qtyKey: "kept_qty" | "quantity";
  empty: string;
}) {
  if (rows.length === 0)
    return <div className="p-8 text-center text-xs text-muted-foreground">{empty}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
          <tr>
            <th className="p-2">Order</th>
            <th className="p-2">Product</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const qty = r[qtyKey];
            return (
              <tr key={r.id} className="border-t">
                <td className="p-2 font-medium"><CopyOrderNumber orderNumber={r.order_number} /></td>
                <td className="p-2 text-muted-foreground">{r.product_name}</td>
                <td className="p-2 tabular-nums">{qty}</td>
                <td className="p-2 tabular-nums">{bdtNum(r.unit_price)}</td>
                <td className="p-2 font-semibold tabular-nums">{bdtNum(qty * r.unit_price)}</td>
                <td className="p-2 capitalize text-muted-foreground">
                  {orderStatusLabel(r.status)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
