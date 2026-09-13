import { supabase } from "@/integrations/laravel/client";
import type { OrderTabKey } from "@/lib/courier-status";

export type SupplierOrderItem = {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  returned_qty: number;
  unit_price: number;
  line_total: number;
};

export type SupplierOrderShipment = {
  provider: string | null;
  tracking_id: string | null;
  consignment_id: string | null;
  tracking_url: string | null;
  status: string | null;
  courier_status: string | null;
  booked_at: string | null;
} | null;

export type SupplierOrderRow = {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_phone: string;
  address_line: string;
  city: string | null;
  area: string;
  payment_method: string;
  my_qty: number;
  my_amount: number;
  items: SupplierOrderItem[];
  shipment: SupplierOrderShipment;
};

export type SupplierOrdersPage = {
  orders: SupplierOrderRow[];
  counts: Record<string, number>;
};

/** ONE call: supplier's orders (only their own items and amounts). */
export async function loadSupplierOrders(q?: string): Promise<SupplierOrdersPage> {
  const { data, error } = await supabase.rpc("supplier_orders_page" as never, {
    _status: null,
    _q: q ?? null,
    _limit: 300,
  } as never);
  if (error) throw error;
  const raw = (data ?? {}) as any;
  return {
    orders: ((raw.orders ?? []) as SupplierOrderRow[]).map((o) => ({
      ...o,
      my_qty: Number(o.my_qty ?? 0),
      my_amount: Number(o.my_amount ?? 0),
      items: (o.items ?? []).map((i) => ({
        ...i,
        quantity: Number(i.quantity ?? 0),
        returned_qty: Number(i.returned_qty ?? 0),
        unit_price: Number(i.unit_price ?? 0),
        line_total: Number(i.line_total ?? 0),
      })),
    })),
    counts: (raw.counts ?? {}) as Record<string, number>,
  };
}

export async function setSupplierOrderStatus(orderId: string, status: string) {
  const { error } = await supabase.rpc("supplier_set_order_status" as never, {
    _order: orderId,
    _status: status,
  } as never);
  if (error) throw error;
}

/** Supplier-facing labels — "forwarded" is shown as Pending, no admin wording. */
export const SUPPLIER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  forwarded: "Pending",
  confirmed: "Confirmed",
  packaging: "Packaging",
  ready_to_ship: "Courier handover",
  processing: "To courier",
  shipped: "To courier",
  delivered: "Delivered",
  pending_partial: "Pending partial",
  partial: "Partial",
  partial_full: "Partial (full item)",
  partial_item: "Partial (item)",
  partial_delivery: "Partial (delivery charge)",
  pending_return: "Pending return",
  returned: "Returned",
  damaged: "Damaged",
  cancelled: "Cancelled",
};

export function supplierStatusLabel(status: string) {
  return SUPPLIER_STATUS_LABEL[status] ?? status.replace(/_/g, " ");
}

export function supplierStatusTone(status: string) {
  if (status === "delivered") return "bg-emerald-500/10 text-emerald-600";
  if (["returned", "cancelled", "damaged"].includes(status)) return "bg-destructive/10 text-destructive";
  if (status.startsWith("partial")) return "bg-emerald-500/10 text-emerald-600";
  if (["pending_return", "pending_partial"].includes(status)) return "bg-amber-500/10 text-amber-600";
  if (["shipped", "processing"].includes(status)) return "bg-blue-500/10 text-blue-600";
  if (status === "packaging") return "bg-violet-500/10 text-violet-600";
  if (status === "ready_to_ship") return "bg-sky-500/10 text-sky-600";
  return "bg-primary/10 text-primary";
}

/** One-way flow only. Nothing is editable after courier handover. */
export function supplierNextStatus(status: string): string | null {
  if (status === "confirmed") return "packaging";
  if (status === "packaging") return "ready_to_ship";
  return null;
}

/** Supplier flow tabs — same keys/colours as the admin order tabs, minus the admin-only ones. */
export const SUPPLIER_ORDER_TABS: { key: OrderTabKey; label: string; statuses: string[] }[] = [
  { key: "all", label: "All Orders", statuses: [] },
  { key: "confirmed", label: "Confirmed", statuses: ["confirmed"] },
  { key: "packaging", label: "Packaging", statuses: ["packaging"] },
  { key: "handover", label: "Courier Handover", statuses: ["ready_to_ship"] },
  { key: "courier", label: "To Courier", statuses: ["shipped", "processing"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
  { key: "pending_partial", label: "Pending Partial", statuses: ["pending_partial"] },
  { key: "partial_full", label: "Partial (Full item)", statuses: ["partial_full", "partial"] },
  { key: "partial_item", label: "Partial (Item)", statuses: ["partial_item"] },
  { key: "partial_delivery", label: "Partial (Delivery Charge)", statuses: ["partial_delivery"] },
  { key: "pending_return", label: "Pending Return", statuses: ["pending_return"] },
  { key: "returned", label: "Returned", statuses: ["returned"] },
  { key: "damaged", label: "Damaged", statuses: ["damaged"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

