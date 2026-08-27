import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, PackageCheck, RefreshCw, Search, Truck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { ConfirmModal } from "@/components/ui-kit/ConfirmModal";
import { ShipmentBookingModal } from "@/components/ShipmentBookingModal";
import { CourierLogo, courierLabel } from "@/components/courier-brand";
import { bdtNum } from "@/lib/supplier";
import {
  loadSupplierOrders,
  setSupplierOrderStatus,
  supplierNextStatus,
  supplierStatusLabel,
  supplierStatusTone,
  SUPPLIER_ORDER_TABS,
  type SupplierOrderRow,
} from "@/lib/supplier-orders";

export const Route = createFileRoute("/_authenticated/supplier/orders")({
  component: SupplierOrdersPage,
  head: () => ({
    meta: [
      { title: "Supplier orders · manage your product orders" },
      {
        name: "description",
        content: "নিজের প্রোডাক্টের অর্ডার দেখুন, কনফার্ম–প্যাকেজিং করুন এবং কুরিয়ার বুকিং দিন।",
      },
      { property: "og:title", content: "Supplier orders" },
      { property: "og:description", content: "Track and process the orders that contain your products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SupplierOrdersPage() {
  const [rows, setRows] = useState<SupplierOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [booking, setBooking] = useState<{ open: boolean; orderIds: string[] }>({ open: false, orderIds: [] });
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const page = await loadSupplierOrders();
      setRows(page.orders);
    } catch (e: any) {
      toast.error(e?.message ?? "Orders load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of SUPPLIER_ORDER_TABS) {
      map[t.key] = t.statuses.length === 0 ? rows.length : rows.filter((o) => t.statuses.includes(o.status)).length;
    }
    return map;
  }, [rows]);

  const filtered = useMemo(() => {
    const t = SUPPLIER_ORDER_TABS.find((x) => x.key === tab);
    const term = q.trim().toLowerCase();
    return rows.filter((o) => {
      if (t && t.statuses.length && !t.statuses.includes(o.status)) return false;
      if (!term) return true;
      return (
        o.order_number.toLowerCase().includes(term) ||
        o.customer_name.toLowerCase().includes(term) ||
        o.customer_phone.includes(term)
      );
    });
  }, [rows, tab, q]);

  useEffect(() => {
    setSelected([]);
  }, [tab, q]);

  const actionable = filtered.filter((o) => supplierNextStatus(o.status));
  const selectedRows = rows.filter((o) => selected.includes(o.id));
  const bulkNext = useMemo(() => {
    if (!selectedRows.length) return null;
    const next = supplierNextStatus(selectedRows[0].status);
    return selectedRows.every((o) => supplierNextStatus(o.status) === next) ? next : null;
  }, [selectedRows]);

  const totals = useMemo(
    () => ({
      orders: rows.length,
      qty: rows.reduce((s, o) => s + o.my_qty, 0),
      value: rows.reduce((s, o) => s + o.my_amount, 0),
    }),
    [rows],
  );

  const applyStatus = async (ids: string[], next: string) => {
    setBusy(true);
    let ok = 0;
    for (const id of ids) {
      try {
        await setSupplierOrderStatus(id, next);
        ok++;
      } catch (e: any) {
        toast.error(e?.message ?? "Status change failed");
      }
    }
    setBusy(false);
    if (ok) {
      toast.success(`${ok} order${ok > 1 ? "s" : ""} → ${supplierStatusLabel(next)}`);
      setSelected([]);
      await load();
      // Courier booking is confirmed the moment an order moves into Packaging.
      if (next === "packaging") setBooking({ open: true, orderIds: ids.slice(0, ok) });
    }
  };

  const askStatus = (ids: string[], next: string) => {
    setConfirm({
      open: true,
      title: `Move to ${supplierStatusLabel(next)}?`,
      description:
        next === "packaging"
          ? `${ids.length} order(s) প্যাকেজিং-এ যাবে এবং সাথে সাথে কুরিয়ার বুকিং কনফার্ম হবে।`
          : next === "ready_to_ship"
            ? `${ids.length} order(s) কুরিয়ার হ্যান্ডওভার হবে। এরপর আর কোনো পরিবর্তন করা যাবে না।`
            : `${ids.length} order(s) ${supplierStatusLabel(next)} করা হবে। এটি একমুখী পরিবর্তন।`,
      onConfirm: async () => {
        setConfirm(null);
        await applyStatus(ids, next);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My orders"
        description="আপনার প্রোডাক্ট আছে এমন অর্ডারগুলো — শুধু নিজের আইটেম ও নিজের হিসাব দেখানো হয়।"
        actions={
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total orders" value={String(totals.orders)} tone="indigo" />
        <StatCard label="My items" value={String(totals.qty)} tone="amber" />
        <StatCard label="My value" value={bdtNum(totals.value)} tone="emerald" />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {SUPPLIER_ORDER_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
              (tab === t.key ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
            }
          >
            {t.label} ({counts[t.key] ?? 0})
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order no / customer / phone"
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {actionable.length > 0 && (
          <button
            onClick={() =>
              setSelected((prev) =>
                prev.length === actionable.length ? [] : actionable.map((o) => o.id),
              )
            }
            className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            {selected.length === actionable.length ? "Clear selection" : "Select all"}
          </button>
        )}

        {bulkNext && (
          <button
            disabled={busy}
            onClick={() => askStatus(selected, bulkNext)}
            className="btn-brand inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
            {selected.length} → {supplierStatusLabel(bulkNext)}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card rounded-lg border border-dashed p-10 text-center text-xs text-muted-foreground">
          এই ট্যাবে কোনো অর্ডার নেই।
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const next = supplierNextStatus(o.status);
            const open = expanded.includes(o.id);
            return (
              <div key={o.id} className="surface-card p-4">
                <div className="flex flex-wrap items-start gap-3">
                  {next && (
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                      checked={selected.includes(o.id)}
                      onChange={(e) =>
                        setSelected((prev) => (e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id)))
                      }
                    />
                  )}

                  <div className="min-w-[180px] flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">#{o.order_number}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${supplierStatusTone(o.status)}`}
                      >
                        {supplierStatusLabel(o.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()} · {o.area.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div className="min-w-[160px] text-xs">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-muted-foreground">{o.customer_phone}</p>
                  </div>

                  <div className="min-w-[130px] text-xs">
                    <p className="text-muted-foreground">My items</p>
                    <p className="font-semibold tabular-nums">
                      {o.my_qty} pcs · {bdtNum(o.my_amount)}
                    </p>
                  </div>

                  <div className="min-w-[150px] text-xs">
                    {o.shipment?.provider ? (
                      <div className="flex items-center gap-2">
                        <CourierLogo provider={o.shipment.provider as any} size={22} />
                        <div>
                          <p className="font-medium">{courierLabel(o.shipment.provider as any)}</p>
                          <p className="text-[11px] text-muted-foreground">{o.shipment.tracking_id || "—"}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">No courier yet</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpanded((prev) => (open ? prev.filter((x) => x !== o.id) : [...prev, o.id]))
                      }
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      {open ? "Hide items" : "View items"}
                    </button>
                    {next ? (
                      <button
                        disabled={busy}
                        onClick={() => askStatus([o.id], next)}
                        className="btn-brand inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold disabled:opacity-50"
                      >
                        {next === "packaging" ? <Truck className="h-3.5 w-3.5" /> : <PackageCheck className="h-3.5 w-3.5" />}
                        {supplierStatusLabel(next)}
                      </button>
                    ) : (
                      <span className="rounded-lg border border-dashed px-3 py-1.5 text-[11px] text-muted-foreground">
                        View only
                      </span>
                    )}
                  </div>
                </div>

                {open && (
                  <div className="mt-3 overflow-x-auto rounded-md border">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                        <tr>
                          <th className="p-2">Product</th>
                          <th>Qty</th>
                          <th>Returned</th>
                          <th>My price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {o.items.map((it) => (
                          <tr key={it.id} className="border-t">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                {it.product_image ? (
                                  <img
                                    src={it.product_image}
                                    alt={it.product_name}
                                    loading="lazy"
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                ) : null}
                                <span className="font-medium">{it.product_name}</span>
                              </div>
                            </td>
                            <td className="tabular-nums">{it.quantity}</td>
                            <td className="tabular-nums">{it.returned_qty || 0}</td>
                            <td className="tabular-nums">{bdtNum(it.unit_price)}</td>
                            <td className="font-semibold tabular-nums">{bdtNum(it.line_total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="border-t bg-muted/20 p-2 text-[11px] text-muted-foreground">
                      এই অর্ডারে অন্য সাপ্লায়ারের প্রোডাক্ট থাকলে তা এখানে দেখানো হয় না।
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ShipmentBookingModal
        isOpen={booking.open}
        orderIds={booking.orderIds}
        onClose={() => setBooking({ open: false, orderIds: [] })}
        onSuccess={() => void load()}
      />

      {confirm?.open && (
        <ConfirmModal
          open
          title={confirm.title}
          description={confirm.description}
          confirmLabel="Confirm"
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
