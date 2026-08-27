import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageCheck, Undo2, Wallet, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, orderStatusLabel, supplierAvailable } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/")({
  component: SupplierDashboard,
});

function SupplierDashboard() {
  const { data } = useSupplier();
  const t = data.totals;
  const available = supplierAvailable(t);
  const recent = data.sold.slice(0, 8);

  return (
    <div>
      <PageHeader
        title={`স্বাগতম, ${data.supplier?.display_name ?? "Supplier"}`}
        description="আপনার প্রোডাক্টের ডেলিভারি হওয়া বিক্রি, রিটার্ন ও পেআউট এক জায়গায়।"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Sold (kept) qty" value={t.sold_qty} icon={<PackageCheck className="h-4 w-4" />} tone="emerald" />
        <StatCard label="Total earning" value={bdtNum(t.earning)} hint="Delivered + kept items" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="In progress" value={bdtNum(t.upcoming_amount)} hint={`${t.upcoming_qty} pcs on the way`} icon={<Clock className="h-4 w-4" />} tone="amber" />
        <StatCard label="Returned" value={bdtNum(t.returned_amount)} hint={`${t.returned_qty} pcs`} icon={<Undo2 className="h-4 w-4" />} tone="rose" />
        <StatCard label="Available" value={bdtNum(available)} hint="Ready to withdraw" icon={<Wallet className="h-4 w-4" />} tone="violet" />
        <StatCard label="Paid out" value={bdtNum(t.paid)} hint={`${bdtNum(t.pending_payout)} pending`} icon={<CheckCircle2 className="h-4 w-4" />} tone="sky" />
      </div>

      {t.returns_pending_handover > 0 && (
        <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm">
          <b>{t.returns_pending_handover}</b> টি রিটার্ন আইটেম আপনাকে হ্যান্ডওভারের অপেক্ষায় আছে।{" "}
          <Link to="/supplier/returns" className="font-medium text-primary hover:underline">
            রিটার্ন দেখুন
          </Link>
        </div>
      )}

      <div className="surface-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Recent sales</div>
          <Link to="/supplier/report" className="text-xs font-medium text-primary hover:underline">
            Full report
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            এখনো কোনো ডেলিভারি হওয়া বিক্রি নেই।
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-2">Order</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2 font-medium">#{r.order_number}</td>
                    <td className="text-muted-foreground">{r.product_name}</td>
                    <td className="tabular-nums">{r.kept_qty}</td>
                    <td className="tabular-nums">{bdtNum(r.unit_price)}</td>
                    <td className="font-semibold tabular-nums">{bdtNum(r.kept_qty * r.unit_price)}</td>
                    <td className="capitalize text-muted-foreground">{orderStatusLabel(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
