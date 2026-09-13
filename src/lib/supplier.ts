import { supabase } from "@/integrations/laravel/client";

export type SupplierStatus = "pending" | "active" | "suspended" | "rejected";

export type SupplierRow = {
  id: string;
  user_id: string;
  code: string;
  display_name: string;
  contact_phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  status: SupplierStatus;
  notes: string | null;
  payout_method: string | null;
  payout_account_name: string | null;
  payout_account_number: string | null;
  payout_bank_name: string | null;
  payout_branch: string | null;
  payout_notes: string | null;
  created_at: string;
};

export type SupplierTotals = {
  sold_qty: number;
  earning: number;
  upcoming_qty: number;
  upcoming_amount: number;
  supplied_qty: number;
  supplied_value: number;
  returned_qty: number;
  returned_amount: number;
  returns_received_qty: number;
  returns_received_amount: number;
  returns_pending_qty: number;
  returns_pending_amount: number;
  returns_pending_handover: number;
  paid: number;
  pending_payout: number;
};

export type SupplierProductStat = {
  product_name: string;
  unit_price: number;
  orders: number;
  supplied_qty: number;
  supplied_value: number;
  delivered_qty: number;
  delivered_value: number;
  pending_qty: number;
  pending_value: number;
  returned_qty: number;
  returned_value: number;
};

export type SupplierItemRow = {
  id: string;
  order_id: string;
  order_number: string;
  product_name: string;
  quantity: number;
  returned_qty: number;
  kept_qty: number;
  ret_qty: number;
  unit_price: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SupplierReturnRow = {
  id: string;
  order_id: string;
  order_number: string;
  supplier_id?: string;
  supplier_name?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  order_status: string;
  status: "pending_handover" | "handed_over";
  note: string | null;
  handed_over_at: string | null;
  created_at: string;
  updated_at?: string | null;
  product_image?: string | null;
};

/** Supplier marks returned items as received (single or bulk). */
export async function receiveSupplierReturns(ids: string[]) {
  const { error } = await supabase.rpc("supplier_receive_returns" as never, { _ids: ids } as never);
  if (error) throw error;
}

export type SupplierPayoutRow = {
  id: string;
  supplier_id?: string;
  supplier_name?: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  method: string | null;
  reference: string | null;
  note: string | null;
  admin_note: string | null;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
};

export type SupplierReport = {
  supplier: SupplierRow | null;
  totals: SupplierTotals;
  products: SupplierProductStat[];
  sold: SupplierItemRow[];
  upcoming: SupplierItemRow[];
  returns: SupplierReturnRow[];
  payouts: SupplierPayoutRow[];
  settings?: { site_name: string | null; logo_url: string | null; primary_color: string | null } | null;
};

export type AdminSupplierRow = SupplierRow & {
  products: number;
  sold_qty: number;
  earning: number;
  supplied_qty: number;
  supplied_value: number;
  pending_qty: number;
  pending_amount: number;
  returned_qty: number;
  returned_amount: number;
  paid: number;
  pending_payout: number;
  pending_returns: number;
};

export type AdminSupplierOverview = {
  suppliers: AdminSupplierRow[];
  returns: SupplierReturnRow[];
  payouts: SupplierPayoutRow[];
};

const EMPTY_TOTALS: SupplierTotals = {
  sold_qty: 0,
  earning: 0,
  upcoming_qty: 0,
  upcoming_amount: 0,
  supplied_qty: 0,
  supplied_value: 0,
  returned_qty: 0,
  returned_amount: 0,
  returns_received_qty: 0,
  returns_received_amount: 0,
  returns_pending_qty: 0,
  returns_pending_amount: 0,
  returns_pending_handover: 0,
  paid: 0,
  pending_payout: 0,
};

function num(v: unknown) {
  return Number(v ?? 0) || 0;
}

function normalizeReport(raw: any): SupplierReport {
  const t = raw?.totals ?? {};
  return {
    supplier: (raw?.supplier ?? null) as SupplierRow | null,
    totals: {
      sold_qty: num(t.sold_qty),
      earning: num(t.earning),
      upcoming_qty: num(t.upcoming_qty),
      upcoming_amount: num(t.upcoming_amount),
      supplied_qty: num(t.supplied_qty),
      supplied_value: num(t.supplied_value),
      returned_qty: num(t.returned_qty),
      returned_amount: num(t.returned_amount),
      returns_received_qty: num(t.returns_received_qty),
      returns_received_amount: num(t.returns_received_amount),
      returns_pending_qty: num(t.returns_pending_qty),
      returns_pending_amount: num(t.returns_pending_amount),
      returns_pending_handover: num(t.returns_pending_handover),
      paid: num(t.paid),
      pending_payout: num(t.pending_payout),
    },
    products: ((raw?.products ?? []) as any[]).map((p) => ({
      product_name: String(p.product_name ?? ""),
      unit_price: num(p.unit_price),
      orders: num(p.orders),
      supplied_qty: num(p.supplied_qty),
      supplied_value: num(p.supplied_value),
      delivered_qty: num(p.delivered_qty),
      delivered_value: num(p.delivered_value),
      pending_qty: num(p.pending_qty),
      pending_value: num(p.pending_value),
      returned_qty: num(p.returned_qty),
      returned_value: num(p.returned_value),
    })),
    sold: (raw?.sold ?? []) as SupplierItemRow[],
    upcoming: (raw?.upcoming ?? []) as SupplierItemRow[],
    returns: (raw?.returns ?? []) as SupplierReturnRow[],
    payouts: (raw?.payouts ?? []) as SupplierPayoutRow[],
    settings: raw?.settings ?? null,
  };
}

/** ONE call: supplier profile + totals + sold/upcoming items + returns + payouts. */
export async function loadSupplierBootstrap(): Promise<SupplierReport | null> {
  const { data, error } = await supabase.rpc("supplier_bootstrap" as never);
  if (error) throw error;
  if (!data || !(data as any).supplier) return null;
  return normalizeReport(data);
}

export async function loadSupplierReport(
  supplierId?: string | null,
  from?: string | null,
  to?: string | null,
): Promise<SupplierReport | null> {
  const { data, error } = await supabase.rpc("supplier_report" as never, {
    _supplier: supplierId ?? null,
    _from: from ?? null,
    _to: to ?? null,
  } as never);
  if (error) throw error;
  if (!data) return null;
  return normalizeReport(data);
}

export async function loadAdminSupplierOverview(
  from?: string | null,
  to?: string | null,
): Promise<AdminSupplierOverview> {
  const { data, error } = await supabase.rpc("admin_supplier_overview" as never, {
    _from: from ?? null,
    _to: to ?? null,
  } as never);
  if (error) throw error;
  const raw = (data ?? {}) as any;
  return {
    suppliers: ((raw.suppliers ?? []) as any[]).map((s) => ({
      ...s,
      products: num(s.products),
      sold_qty: num(s.sold_qty),
      earning: num(s.earning),
      supplied_qty: num(s.supplied_qty),
      supplied_value: num(s.supplied_value),
      pending_qty: num(s.pending_qty),
      pending_amount: num(s.pending_amount),
      returned_qty: num(s.returned_qty),
      returned_amount: num(s.returned_amount),
      paid: num(s.paid),
      pending_payout: num(s.pending_payout),
      pending_returns: num(s.pending_returns),
    })) as AdminSupplierRow[],
    returns: (raw.returns ?? []) as SupplierReturnRow[],
    payouts: (raw.payouts ?? []) as SupplierPayoutRow[],
  };
}

/** Admin hands returned items over to the supplier (single or bulk); `undo` reverts. */
export async function handoverSupplierReturns(ids: string[], undo = false) {
  const { error } = await supabase.rpc("admin_handover_returns" as never, {
    _ids: ids,
    _undo: undo,
  } as never);
  if (error) throw error;
}

/** Withdrawable balance = earned on kept items − already paid − pending requests. */
export function supplierAvailable(t: SupplierTotals) {
  return Math.max(t.earning - t.paid - t.pending_payout, 0);
}

export const SUPPLIER_ORDER_LABEL: Record<string, string> = {
  delivered: "Delivered",
  partial_full: "Partial (full item)",
  partial_item: "Partial (item returned)",
  partial_delivery: "Delivery charge only",
  returned: "Returned",
  damaged: "Damaged",
  pending_return: "Pending return",
  pending_partial: "Pending partial",
};

export function orderStatusLabel(status: string) {
  return SUPPLIER_ORDER_LABEL[status] ?? status.replace(/_/g, " ");
}

export const bdtNum = (n: number) => `৳${Math.round(n).toLocaleString()}`;

/* ---------------------------------------------------------------- products */

export type SupplierProductImage = { url: string };

export type SupplierProduct = {
  id: string;
  product_code: string;
  name: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  brand_id: string | null;
  category_id: string | null;
  supplier_price: number;
  stock: number;
  weight_grams: number | null;
  is_active: boolean;
  approval_status: "approved" | "pending" | "rejected";
  approval_note: string | null;
  pending_changes: Record<string, unknown> | null;
  og_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  created_at: string;
  updated_at: string;
  images: SupplierProductImage[];
};

export type SupplierProductPayload = {
  name: string;
  sku?: string | null;
  short_description?: string | null;
  description?: string | null;
  brand_id?: string | null;
  category_id?: string | null;
  supplier_price: number;
  stock: number;
  weight_grams?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  images?: SupplierProductImage[];
};

export type SupplierProductsPage = {
  products: SupplierProduct[];
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
};

/** ONE call: supplier's own products + brand/category options. */
export async function loadSupplierProducts(): Promise<SupplierProductsPage> {
  const { data, error } = await supabase.rpc("supplier_products" as never);
  if (error) throw error;
  const raw = (data ?? {}) as any;
  return {
    products: (raw.products ?? []) as SupplierProduct[],
    brands: (raw.brands ?? []) as { id: string; name: string }[],
    categories: (raw.categories ?? []) as { id: string; name: string }[],
  };
}

export async function saveSupplierProduct(id: string | null, payload: SupplierProductPayload) {
  const { error } = await supabase.rpc("supplier_save_product" as never, {
    _id: id,
    _payload: payload,
  } as never);
  if (error) throw error;
}

/** Inline list edit: stock/weight save instantly, price change waits for admin approval. */
export async function supplierQuickUpdate(
  id: string,
  patch: { price?: number | null; stock?: number | null; weight?: number | null },
): Promise<{ price_pending: boolean; approval_status: string }> {
  const { data, error } = await supabase.rpc("supplier_quick_update" as never, {
    _id: id,
    _price: patch.price ?? null,
    _stock: patch.stock ?? null,
    _weight: patch.weight ?? null,
  } as never);
  if (error) throw error;
  const raw = (data ?? {}) as any;
  return { price_pending: !!raw.price_pending, approval_status: String(raw.approval_status ?? "pending") };
}

export async function reviewProduct(id: string, approve: boolean, note?: string | null) {
  const { error } = await supabase.rpc("admin_review_product" as never, {
    _id: id,
    _approve: approve,
    _note: note ?? null,
  } as never);
  if (error) throw error;
}

export async function setProductSupplier(id: string, supplierId: string | null) {
  const { error } = await supabase.rpc("admin_set_product_supplier" as never, {
    _id: id,
    _supplier: supplierId,
  } as never);
  if (error) throw error;
}

export const APPROVAL_TONE: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  rejected: "bg-destructive/10 text-destructive",
};
