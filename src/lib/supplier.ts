import { supabase } from "@/integrations/supabase/client";

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
  returned_qty: number;
  returned_amount: number;
  returns_pending_handover: number;
  paid: number;
  pending_payout: number;
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
};

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
  returned_qty: 0,
  returned_amount: 0,
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
      ...EMPTY_TOTALS,
      sold_qty: num(t.sold_qty),
      earning: num(t.earning),
      upcoming_qty: num(t.upcoming_qty),
      upcoming_amount: num(t.upcoming_amount),
      returned_qty: num(t.returned_qty),
      returned_amount: num(t.returned_amount),
      returns_pending_handover: num(t.returns_pending_handover),
      paid: num(t.paid),
      pending_payout: num(t.pending_payout),
    },
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
