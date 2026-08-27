import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PackageCheck, ImageIcon } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { StatusTabs } from "@/components/status-tabs";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, orderStatusLabel, receiveSupplierReturns } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/returns")({
  component: SupplierReturnsPage,
  head: () => ({
    meta: [
      { title: "Supplier returns · handover tracking" },
      { name: "description", content: "ফেরত আসা আইটেম ও অ্যাডমিন হ্যান্ডওভারের অবস্থা দেখুন।" },
      { property: "og:title", content: "Supplier returns" },
      { property: "og:description", content: "Track returned items and handover status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});


function SupplierReturnsPage() {
  const { data, reload } = useSupplier();
  const [tab, setTab] = useState<"all" | "pending_handover" | "handed_over">("all");
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () => (tab === "all" ? data.returns : data.returns.filter((r) => r.status === tab)),
    [data.returns, tab],
  );

  const pending = data.returns.filter((r) => r.status === "pending_handover");
  const handed = data.returns.filter((r) => r.status === "handed_over");
  const sum = (list: typeof data.returns) => list.reduce((s, r) => s + Number(r.quantity) * Number(r.unit_price), 0);

  const selectable = rows.filter((r) => r.status !== "handed_over");
  const allSelected = selectable.length > 0 && selectable.every((r) => sel.includes(r.id));

  const receive = async (ids: string[]) => {
    if (!ids.length) return;
    setBusy(true);
    try {
      await receiveSupplierReturns(ids);
      toast.success(`${ids.length}টি রিটার্ন receive হয়েছে`);
      setSel([]);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };


  return (
    <div>
      <PageHeader
        title="Returns"
        description="ফেরত আসা আইটেম — অ্যাডমিন হ্যান্ডওভার করলে এখানে 'Handed over' দেখাবে।"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total returned" value={bdtNum(sum(data.returns))} hint={`${data.returns.length} items`} tone="rose" />
        <StatCard label="Waiting handover" value={bdtNum(sum(pending))} hint={`${pending.length} items`} tone="amber" />
        <StatCard label="Handed over" value={bdtNum(sum(handed))} hint={`${handed.length} items`} tone="emerald" />
      </div>

      <StatusTabs
        tabs={[
          { key: "all", label: "All" },
          { key: "pending_handover", label: "Waiting" },
          { key: "handed_over", label: "Handed over" },
        ]}
        tab={tab}
        onChange={(k) => setTab(k as typeof tab)}
        count={(k) =>
          k === "all"
            ? data.returns.length
            : k === "pending_handover"
              ? pending.length
              : handed.length
        }
        className="mb-3 w-full min-w-0"
      />


      <div className="surface-card p-4">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            কোনো রিটার্ন নেই।
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
                  <th>Value</th>
                  <th>Order status</th>
                  <th>Handover</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="font-medium">#{r.order_number}</td>
                    <td className="text-muted-foreground">{r.product_name}</td>
                    <td className="tabular-nums">{r.quantity}</td>
                    <td className="font-semibold tabular-nums">{bdtNum(Number(r.quantity) * Number(r.unit_price))}</td>
                    <td className="capitalize text-muted-foreground">{orderStatusLabel(r.order_status)}</td>
                    <td>
                      {r.status === "handed_over" ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                          Handed over{r.handed_over_at ? ` · ${new Date(r.handed_over_at).toLocaleDateString()}` : ""}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                          Waiting
                        </span>
                      )}
                    </td>
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
