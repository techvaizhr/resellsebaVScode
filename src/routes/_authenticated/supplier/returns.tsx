import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PackageCheck, ImageIcon } from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { StatusTabs } from "@/components/status-tabs";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, orderStatusLabel, receiveSupplierReturns } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/returns")({
  component: SupplierReturnsPage,
  head: () => ({
    meta: [
      { title: "Supplier returns · handover tracking" },
      { name: "description", content: "View returned items and admin handover status." },
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
      toast.success(`${ids.length} return(s) received`);
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
        description="Returned items — once handed over by admin, they will show as 'Handed over' here."
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


      {sel.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <span className="text-xs font-semibold">{sel.length} selected</span>
          <button
            onClick={() => receive(sel)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            <PackageCheck className="h-3.5 w-3.5" /> Receive returns
          </button>
          <button onClick={() => setSel([])} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            Clear
          </button>
        </div>
      )}

      <div className="surface-card p-4">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            No returns found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-2 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={selectable.length === 0}
                      onChange={(e) => setSel(e.target.checked ? selectable.map((r) => r.id) : [])}
                      className="h-3.5 w-3.5 align-middle"
                    />
                  </th>
                  <th className="p-2">Updated</th>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Value</th>
                  <th>Order status</th>
                  <th>Handover</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const done = r.status === "handed_over";
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="p-2">
                        {!done && (
                          <input
                            type="checkbox"
                            checked={sel.includes(r.id)}
                            onChange={(e) =>
                              setSel((p) => (e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)))
                            }
                            className="h-3.5 w-3.5 align-middle"
                          />
                        )}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(r.updated_at ?? r.created_at).toLocaleDateString()}
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(r.updated_at ?? r.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="font-medium"><CopyOrderNumber orderNumber={r.order_number} /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          {r.product_image ? (
                            <img
                              src={r.product_image}
                              alt={r.product_name}
                              loading="lazy"
                              className="h-9 w-9 shrink-0 rounded-md border object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-muted-foreground">{r.product_name}</span>
                        </div>
                      </td>
                      <td className="tabular-nums">{r.quantity}</td>
                      <td className="font-semibold tabular-nums">
                        {bdtNum(Number(r.quantity) * Number(r.unit_price))}
                      </td>
                      <td className="capitalize text-muted-foreground">{orderStatusLabel(r.order_status)}</td>
                      <td>
                        {done ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                            Received{r.handed_over_at ? ` · ${new Date(r.handed_over_at).toLocaleDateString()}` : ""}
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                            Waiting
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {!done && (
                          <button
                            onClick={() => receive([r.id])}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
                          >
                            <PackageCheck className="h-3 w-3" /> Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
