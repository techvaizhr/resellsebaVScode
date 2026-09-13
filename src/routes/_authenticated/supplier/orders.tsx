import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  ExternalLink,
  Loader2,
  PackageCheck,
  Printer,
  RefreshCw,
  Truck,
} from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { ConfirmModal } from "@/components/ui-kit/ConfirmModal";
import { ShipmentBookingModal } from "@/components/ShipmentBookingModal";
import { CourierLogo, courierLabel } from "@/components/courier-brand";
import { courierTrackingUrl } from "@/lib/courier-tracking";
import { OrderSearch, type OrderSearchMode } from "@/components/order-search";
import { OrderTabs } from "@/components/OrderTabs";
import { OrderNotePreview, OrderNotesModal, useOrderMeta } from "@/components/order-last-update";
import { BulkScanButton, type ScanOrder } from "@/components/BulkScanModal";
import type { OrderTabKey } from "@/lib/courier-status";


import {
  AREA_FILTER_OPTIONS,
  COURIER_FILTER_OPTIONS,
  DATE_PRESET_OPTIONS,
  resolveDateRange,
  DEFAULT_ORDER_FILTERS,
  type DatePreset,
} from "@/components/order-filters";

import { Pagination, usePaginated } from "@/components/data-list";
import {
  ImageLightbox,
  OrderItemsList,
  OrderProductCell,
  type StripItem,
} from "@/components/order-items-strip";
import { bdtNum } from "@/lib/supplier";
import { useSupplier } from "@/components/supplier-context";
import { orderSupplierTint } from "@/lib/supplier-colors";
import { printLabelDocs, type LabelDoc } from "@/lib/labels";
import { getGlobalSettings } from "@/lib/app-data";
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
        content: "View your product orders, confirm and package them, and book courier shipments.",
      },
      { property: "og:title", content: "Supplier orders" },
      { property: "og:description", content: "Track and process the orders that contain your products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SupplierOrdersPage() {
  const { data: supplierData } = useSupplier();
  const myTint = useMemo(
    () => orderSupplierTint([supplierData.supplier?.id ?? null]),
    [supplierData.supplier?.id],
  );
  const [rows, setRows] = useState<SupplierOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<OrderTabKey>("confirmed");
  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState<OrderSearchMode>("order");
  const [area, setArea] = useState("");
  const [courier, setCourier] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("lifetime");
  const [sort, setSort] = useState<"newest" | "oldest" | "high" | "low">("newest");

  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [marked, setMarked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [notesModal, setNotesModal] = useState<{ orderId: string; orderNumber: string } | null>(null);
  const [booking, setBooking] = useState<{ open: boolean; orderIds: string[] }>({ open: false, orderIds: [] });
  const [pendingStatus, setPendingStatus] = useState<{ ids: string[]; next: string } | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await loadSupplierOrders();
      setRows(data.orders);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Orders load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setMarked([]);
    setPage(1);
  }, [tab, q, sort, perPage, area, courier, datePreset]);

  const counts = useCallback(
    (key: string) => {
      const t = SUPPLIER_ORDER_TABS.find((x) => x.key === key);
      if (!t || t.statuses.length === 0) return rows.length;
      return rows.filter((o) => t.statuses.includes(o.status)).length;
    },
    [rows],
  );

  const filtered = useMemo(() => {
    const t = SUPPLIER_ORDER_TABS.find((x) => x.key === tab);
    const term = q.trim().toLowerCase();
    const { fromTs, toTs } = resolveDateRange({
      ...DEFAULT_ORDER_FILTERS,
      datePreset,
    });
    const list = rows.filter((o) => {
      if (t && t.statuses.length && !t.statuses.includes(o.status)) return false;
      if (area && o.area !== area) return false;
      if (courier) {
        const provider = o.shipment?.provider ?? null;
        if (courier === "none" ? !!provider : provider !== courier) return false;
      }
      const ts = new Date(o.created_at).getTime();
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      if (!term) return true;
      if (searchMode === "product") return o.items.some((i) => i.product_name.toLowerCase().includes(term));
      const isOrderMatch =
        o.order_number.toLowerCase().includes(term) ||
        (o.customer_name ?? "").toLowerCase().includes(term) ||
        (o.customer_phone ?? "").toLowerCase().includes(term);
      if (isOrderMatch) return true;
      const sh = o.shipment;
      if (sh) {
        return (
          (sh.consignment_id ?? "").toLowerCase().includes(term) ||
          (sh.tracking_id ?? "").toLowerCase().includes(term) ||
          (sh.provider ?? "").toLowerCase().includes(term)
        );
      }
      return false;
    });
    return [...list].sort((a, b) => {
      if (sort === "high") return b.my_amount - a.my_amount;
      if (sort === "low") return a.my_amount - b.my_amount;
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sort === "oldest" ? ta - tb : tb - ta;
    });
  }, [rows, tab, q, searchMode, sort, area, courier, datePreset]);


  const paged = usePaginated(filtered, page, perPage);
  const { meta, refresh: refreshMeta } = useOrderMeta(paged.map((o) => o.id));
  const markedRows = rows.filter((o) => marked.includes(o.id));
  const bulkNext = useMemo(() => {
    if (!markedRows.length) return null;
    const next = supplierNextStatus(markedRows[0]!.status);
    return markedRows.every((o) => supplierNextStatus(o.status) === next) ? next : null;
  }, [markedRows]);

  const isBooked = (o: SupplierOrderRow) => Boolean(o.shipment?.provider);
  const unbookedMarked = markedRows.filter((o) => !isBooked(o));

  const totals = useMemo(
    () => ({
      orders: rows.length,
      qty: rows.reduce((s, o) => s + o.my_qty, 0),
      value: rows.reduce((s, o) => s + o.my_amount, 0),
    }),
    [rows],
  );

  const stripItems = useCallback(
    (o: SupplierOrderRow): StripItem[] =>
      o.items.map((it) => ({
        id: it.id,
        product_id: null,
        product_name: it.product_name,
        quantity: it.quantity,
        unit_price: it.unit_price,
        line_total: it.line_total,
        image: it.product_image,
        slug: null,
      })),
    [],
  );

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const applyStatus = async (ids: string[], next: string) => {
    setBusy(true);
    let ok = 0;
    for (const id of ids) {
      try {
        await setSupplierOrderStatus(id, next);
        ok++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Status change failed");
      }
    }
    setBusy(false);
    if (ok) {
      toast.success(`${ok} order${ok > 1 ? "s" : ""} → ${supplierStatusLabel(next)}`);
      setMarked([]);
      await load();
    }
  };

  /** Packaging requires a confirmed courier booking first — already booked orders are never re-booked. */
  const askStatus = (ids: string[], next: string) => {
    if (next === "packaging") {
      const targets = rows.filter((o) => ids.includes(o.id));
      const needBooking = targets.filter((o) => !isBooked(o)).map((o) => o.id);
      if (needBooking.length > 0) {
        setPendingStatus({ ids, next });
        setBooking({ open: true, orderIds: needBooking });
        return;
      }
    }
    setConfirm({
      title: `Move to ${supplierStatusLabel(next)}?`,
      description:
        next === "ready_to_ship"
          ? `${ids.length} order(s) will be handed over to the courier.`
          : `${ids.length} order(s) will be moved to ${supplierStatusLabel(next)}.`,
      onConfirm: async () => {
        setConfirm(null);
        await applyStatus(ids, next);
      },
    });
  };

  const bookMarked = () => {
    const ids = unbookedMarked.map((o) => o.id);
    if (!ids.length) {
      toast.info("Selected order(s) are already booked.");
      return;
    }
    setPendingStatus(null);
    setBooking({ open: true, orderIds: ids });
  };

  const handleBookingDone = async () => {
    const pending = pendingStatus;
    setPendingStatus(null);
    await load();
    if (pending) await applyStatus(pending.ids, pending.next);
  };

  /** Scan lookup stays inside the supplier's own orders (order no / tracking / consignment). */
  const scanResolve = useCallback(
    (code: string): ScanOrder | null => {
      const c = code.trim().replace(/^#/, "").toLowerCase();
      const hit = rows.find(
        (o) =>
          o.order_number.toLowerCase() === c ||
          (o.shipment?.tracking_id ?? "").toLowerCase() === c ||
          (o.shipment?.consignment_id ?? "").toLowerCase() === c,
      );
      if (!hit) return null;
      return { id: hit.id, order_number: hit.order_number, status: hit.status, customer_name: null };
    },
    [rows],
  );

  const scanApply = useCallback(async (order: ScanOrder, to: string) => {
    await setSupplierOrderStatus(order.id, to);
  }, []);

  const printMarked = async () => {

    if (!markedRows.length) return;
    let siteName = "Shipping label";
    try {
      const settings = await getGlobalSettings();
      siteName = settings?.site_name || siteName;
    } catch {
      /* branding is optional on the label */
    }
    const maskPhone = (raw: string) => {
      if (!raw) return "";
      if (raw.length <= 4) return "****";
      return raw.slice(0, 3) + "*".repeat(Math.max(raw.length - 5, 4)) + raw.slice(-2);
    };
    const docs: LabelDoc[] = markedRows.map((o) => ({
      orderNumber: o.order_number,
      storeName: siteName,
      storeLogo: null,
      area: o.area,
      customer: {
        name: o.customer_name,
        phone: maskPhone(o.customer_phone),
        address: o.address_line,
      },
      items: o.items.map((it) => ({ name: it.product_name, qty: it.quantity })),
      courier: {
        provider: o.shipment?.provider ?? null,
        tracking: o.shipment?.consignment_id || o.shipment?.tracking_id || null,
      },
      cod: null,
    }));
    printLabelDocs(docs);
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        className="flex-row items-center justify-between"
        actions={
          <div className="flex items-center gap-2">
            <BulkScanButton
              compact
              mode="handover"
              modes={["handover"]}
              resolve={scanResolve}
              apply={scanApply}
              onDone={() => void load()}
            />
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        }
      />


      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <OrderSearch mode={searchMode} onMode={setSearchMode} value={q} onChange={setQ} className="min-w-0 flex-1" />
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="h-10 w-[76px] shrink-0 rounded-md border bg-background px-1 text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
            title="Per page"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value={-1}>All</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center">
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]"
            title="Delivery area"
          >
            {AREA_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]"
            title="Courier"
          >
            {COURIER_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as DatePreset)}
            className="h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]"
            title="Date range"
          >
            {DATE_PRESET_OPTIONS.filter((o) => o.value !== "custom").map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]"
            title="Sort"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="high">Amount: high → low</option>
            <option value="low">Amount: low → high</option>
          </select>
          {/* Mobile: status filter sits inside the filter grid, same as admin */}
          <div className="sm:hidden">
            <OrderTabs
              tabs={SUPPLIER_ORDER_TABS}
              tab={tab}
              onChange={setTab}
              count={counts}
              highlight
              className="w-full min-w-0"
            />
          </div>
        </div>
      </div>

      {marked.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2">
          <span className="mr-2 text-sm font-medium">{marked.length} marked</span>
          <button
            type="button"
            onClick={() =>
              setMarked(marked.length === paged.length ? [] : paged.map((x) => x.id))
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent"
            title={marked.length === paged.length ? "Deselect all" : "Select all on this page"}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            {marked.length === paged.length ? "Unselect all" : "Select all"}
          </button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={printMarked}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Printer className="h-3.5 w-3.5" /> Print Labels
            </button>
            <button
              onClick={bookMarked}
              disabled={unbookedMarked.length === 0}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 text-xs font-medium text-violet-600 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-400"
            >
              <Truck className="h-3.5 w-3.5" /> Book Courier {unbookedMarked.length > 0 ? `(${unbookedMarked.length})` : ""}
            </button>
            {bulkNext && (
              <button
                disabled={busy}
                onClick={() => askStatus(marked, bulkNext)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 disabled:opacity-50 dark:text-blue-400"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                {marked.length} → {supplierStatusLabel(bulkNext)}
              </button>
            )}
          </div>
          <button
            onClick={() => setMarked([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* Desktop: status tabs below filters — identical look to admin */}
      <div className="hidden sm:block">
        <OrderTabs tabs={SUPPLIER_ORDER_TABS} tab={tab} onChange={setTab} count={counts} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No orders" description="There are no orders in this tab." />
      ) : (
        <>
          <div className="surface-card overflow-hidden">
            {/* Desktop header */}
            <div className="hidden grid-cols-[30px_minmax(110px,0.8fr)_minmax(150px,1.1fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(120px,0.85fr)_minmax(130px,0.9fr)] gap-2 rounded-lg border bg-muted/40 px-2 py-2.5 text-xs font-medium text-muted-foreground lg:grid">
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                  checked={marked.length > 0 && marked.length === paged.length}
                  onChange={(e) => setMarked(e.target.checked ? paged.map((x) => x.id) : [])}
                />
              </div>
              <div className="text-center">Order</div>
              <div className="text-center">Products</div>
              <div className="text-center">My value</div>
              <div className="text-center">Notes</div>
              <div className="text-center">Courier</div>
              <div className="text-center">Status</div>
            </div>

            {paged.map((o) => {
              const next = supplierNextStatus(o.status);
              const open = expanded.includes(o.id);
              const items = stripItems(o);
              return (
                <div key={o.id} style={myTint?.style} className="border-b last:border-b-0">
                  {/* Mobile card */}
                  <div className="space-y-2.5 p-3 lg:hidden">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                        checked={marked.includes(o.id)}
                        onChange={(e) =>
                          setMarked((prev) => (e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id)))
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CopyOrderNumber orderNumber={o.order_number} className="text-sm font-semibold" />
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${supplierStatusTone(o.status)}`}>
                            {supplierStatusLabel(o.status)}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleString() : "—"} · {(o.area || "").replace(/_/g, " ")}
                        </div>
                      </div>
                      <button onClick={() => toggleExpand(o.id)} className="rounded-full p-1 hover:bg-muted">
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 rounded-lg bg-muted/30 p-2">
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">My value</div>
                        <div className="text-sm font-semibold tabular-nums">{bdtNum(o.my_amount)}</div>
                        <div className="text-[11px] text-muted-foreground">{o.my_qty} pcs</div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">Products</div>
                      <OrderProductCell items={items} expanded={open} onZoom={setZoomImage} onToggle={() => toggleExpand(o.id)} />
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">Notes</div>
                      <OrderNotePreview
                        meta={meta[o.id]}
                        align="left"
                        onOpenNotes={() => setNotesModal({ orderId: o.id, orderNumber: o.order_number })}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {isBooked(o) ? (
                        <CourierCell shipment={o.shipment} customerPhone={o.customer_phone} />
                      ) : (
                        <button
                          onClick={() => setBooking({ open: true, orderIds: [o.id] })}
                          className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-600 hover:bg-violet-500/20 dark:text-violet-400"
                        >
                          <Truck className="h-3.5 w-3.5" /> Book courier
                        </button>
                      )}

                      {next ? (
                        <button
                          disabled={busy}
                          onClick={() => askStatus([o.id], next)}
                          className="btn-brand inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                        >
                          {next === "packaging" ? <Truck className="h-3.5 w-3.5" /> : <PackageCheck className="h-3.5 w-3.5" />}
                          {supplierStatusLabel(next)}
                        </button>
                      ) : (
                        <span className="rounded-md border border-dashed px-3 py-1.5 text-[11px] text-muted-foreground">View only</span>
                      )}
                    </div>
                  </div>

                  {/* Desktop row */}
                  <div className={`hidden grid-cols-[30px_minmax(110px,0.8fr)_minmax(150px,1.1fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(120px,0.85fr)_minmax(130px,0.9fr)] items-center gap-2 px-2 py-3 text-sm hover:bg-muted/40 lg:grid ${marked.includes(o.id) ? "bg-primary/5" : ""}`}>
                    <div className="flex flex-col items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[hsl(var(--primary))]"
                        checked={marked.includes(o.id)}
                        onChange={(e) =>
                          setMarked((prev) => (e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id)))
                        }
                      />
                      <button onClick={() => toggleExpand(o.id)} className="rounded-full p-1 hover:bg-muted">
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <div className="min-w-0 text-center">
                      <CopyOrderNumber orderNumber={o.order_number} className="text-xs font-semibold" />
                      <div className="text-[11px] text-muted-foreground">
                        {o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleDateString() : "—"}
                      </div>
                      <div className="text-[11px] capitalize text-muted-foreground">{(o.area || "").replace(/_/g, " ")}</div>
                    </div>

                    <div className="flex justify-center">
                      <OrderProductCell items={items} expanded={open} onZoom={setZoomImage} onToggle={() => toggleExpand(o.id)} />
                    </div>

                    <div className="min-w-0 text-center">
                      <div className="text-sm font-semibold tabular-nums">{bdtNum(o.my_amount)}</div>
                      <div className="text-[11px] text-muted-foreground">{o.my_qty} pcs</div>
                    </div>

                    <div className="min-w-0 px-1">
                      <OrderNotePreview
                        meta={meta[o.id]}
                        onOpenNotes={() => setNotesModal({ orderId: o.id, orderNumber: o.order_number })}
                      />
                    </div>

                    <div className="flex justify-center">
                      {isBooked(o) ? (
                        <CourierCell shipment={o.shipment} customerPhone={o.customer_phone} />
                      ) : (
                        <button
                          onClick={() => setBooking({ open: true, orderIds: [o.id] })}
                          className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-500/20 dark:text-violet-400"
                        >
                          <Truck className="h-3 w-3" /> Book
                        </button>
                      )}
                    </div>


                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${supplierStatusTone(o.status)}`}>
                        {supplierStatusLabel(o.status)}
                      </span>
                      {next ? (
                        <button
                          disabled={busy}
                          onClick={() => askStatus([o.id], next)}
                          className="btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold disabled:opacity-50"
                        >
                          {next === "packaging" ? <Truck className="h-3 w-3" /> : <PackageCheck className="h-3 w-3" />}
                          {supplierStatusLabel(next)}
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-muted-foreground/70">View only</span>
                      )}
                    </div>
                  </div>

                  {open && (
                    <div className="border-t bg-muted/20 px-4 py-3">
                      <OrderItemsList items={items} onZoom={setZoomImage} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
        </>
      )}

      {zoomImage && <ImageLightbox src={zoomImage} onClose={() => setZoomImage(null)} />}

      {notesModal && (
        <OrderNotesModal
          orderId={notesModal.orderId}
          orderNumber={notesModal.orderNumber}
          authorRole="supplier"
          authorName={supplierData.supplier?.display_name ?? null}
          canWrite
          onClose={() => {
            const id = notesModal.orderId;
            setNotesModal(null);
            void refreshMeta([id]);
          }}
        />
      )}

      <ShipmentBookingModal
        isOpen={booking.open}
        orderIds={booking.orderIds}
        onClose={() => setBooking({ open: false, orderIds: [] })}
        onSuccess={() => void handleBookingDone()}
      />

      {confirm && (
        <ConfirmModal
          isOpen
          variant="info"
          title={confirm.title}
          description={confirm.description}
          confirmText="Confirm"
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

function CourierCell({
  shipment,
  customerPhone,
}: {
  shipment: SupplierOrderRow["shipment"];
  customerPhone?: string | null;
}) {
  if (!shipment?.provider) {
    return <span className="text-[10px] italic text-muted-foreground/60">Not booked yet</span>;
  }
  const url = courierTrackingUrl(shipment.provider, shipment, customerPhone);
  const label = (
    <span className="inline-flex items-center gap-0.5 truncate text-[11px] font-semibold text-primary">
      {courierLabel(shipment.provider as never)}
      {url && <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />}
    </span>
  );
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <CourierLogo provider={shipment.provider as never} size={16} />
      <div className="min-w-0">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Track on courier website"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {label}
          </a>
        ) : (
          label
        )}
        <div className="truncate text-[10px] text-muted-foreground">
          {shipment.consignment_id || shipment.tracking_id || "—"}
        </div>
      </div>
    </div>
  );
}
