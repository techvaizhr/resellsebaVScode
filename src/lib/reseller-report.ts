import { supabase } from "@/integrations/supabase/client";

/** Same money-report shape as the supplier report, but for resellers. */

export type ResellerReportTotals = {
  sold_qty: number;
  sold_value: number;
  earning: number;
  upcoming_qty: number;
  upcoming_amount: number;
  upcoming_profit: number;
  supplied_qty: number;
  supplied_value: number;
  order_value: number;
  orders: number;
  delivered_orders: number;
  returned_orders: number;
  returned_qty: number;
  returned_amount: number;
  advance_held: number;
  deposit_balance: number;
  paid: number;
  pending_payout: number;
};

export type ResellerProductStat = {
  product_name: string;
  unit_price: number;
  orders: number;
  supplied_qty: number;
  supplied_value: number;
  delivered_qty: number;
  delivered_value: number;
  delivered_profit: number;
  pending_qty: number;
  pending_value: number;
  returned_qty: number;
  returned_value: number;
};

export type ResellerItemRow = {
  id: string;
  order_id: string;
  order_number: string;
  product_name: string;
  quantity: number;
  returned_qty: number;
  kept_qty: number;
  ret_qty: number;
  unit_price: number;
  unit_profit: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ResellerPayoutRow = {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
};

export type ResellerReport = {
  reseller: Record<string, any> | null;
  totals: ResellerReportTotals;
  products: ResellerProductStat[];
  sold: ResellerItemRow[];
  upcoming: ResellerItemRow[];
  returns: ResellerItemRow[];
  payouts: ResellerPayoutRow[];
};

export type AdminResellerRow = {
  id: string;
  user_id: string | null;
  code: string;
  display_name: string;
  status: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  orders: number;
  sold_qty: number;
  sold_value: number;
  earning: number;
  upcoming_profit: number;
  supplied_qty: number;
  supplied_value: number;
  pending_qty: number;
  pending_amount: number;
  returned_qty: number;
  returned_amount: number;
  paid: number;
  pending_payout: number;
  deposit_balance: number;
};

const num = (v: unknown) => Number(v ?? 0) || 0;

export const EMPTY_RESELLER_TOTALS: ResellerReportTotals = {
  sold_qty: 0,
  sold_value: 0,
  earning: 0,
  upcoming_qty: 0,
  upcoming_amount: 0,
  upcoming_profit: 0,
  supplied_qty: 0,
  supplied_value: 0,
  order_value: 0,
  orders: 0,
  delivered_orders: 0,
  returned_orders: 0,
  returned_qty: 0,
  returned_amount: 0,
  advance_held: 0,
  deposit_balance: 0,
  paid: 0,
  pending_payout: 0,
};

function normalize(raw: any): ResellerReport {
  const t = raw?.totals ?? {};
  const totals = { ...EMPTY_RESELLER_TOTALS };
  (Object.keys(totals) as (keyof ResellerReportTotals)[]).forEach((k) => {
    totals[k] = num(t[k]);
  });
  return {
    reseller: raw?.reseller ?? null,
    totals,
    products: ((raw?.products ?? []) as any[]).map((p) => ({
      product_name: String(p.product_name ?? ""),
      unit_price: num(p.unit_price),
      orders: num(p.orders),
      supplied_qty: num(p.supplied_qty),
      supplied_value: num(p.supplied_value),
      delivered_qty: num(p.delivered_qty),
      delivered_value: num(p.delivered_value),
      delivered_profit: num(p.delivered_profit),
      pending_qty: num(p.pending_qty),
      pending_value: num(p.pending_value),
      returned_qty: num(p.returned_qty),
      returned_value: num(p.returned_value),
    })),
    sold: (raw?.sold ?? []) as ResellerItemRow[],
    upcoming: (raw?.upcoming ?? []) as ResellerItemRow[],
    returns: (raw?.returns ?? []) as ResellerItemRow[],
    payouts: (raw?.payouts ?? []) as ResellerPayoutRow[],
  };
}

export async function loadResellerReport(
  resellerId?: string | null,
  from?: string | null,
  to?: string | null,
): Promise<ResellerReport | null> {
  const { data, error } = await supabase.rpc("reseller_report" as never, {
    _reseller: resellerId ?? null,
    _from: from ?? null,
    _to: to ?? null,
  } as never);
  if (error) throw error;
  if (!data) return null;
  return normalize(data);
}

export async function loadAdminResellerOverview(
  from?: string | null,
  to?: string | null,
): Promise<AdminResellerRow[]> {
  const { data, error } = await supabase.rpc("admin_reseller_overview" as never, {
    _from: from ?? null,
    _to: to ?? null,
  } as never);
  if (error) throw error;
  const raw = (data ?? {}) as any;
  return ((raw.resellers ?? []) as any[]).map((r) => ({
    ...r,
    orders: num(r.orders),
    sold_qty: num(r.sold_qty),
    sold_value: num(r.sold_value),
    earning: num(r.earning),
    upcoming_profit: num(r.upcoming_profit),
    supplied_qty: num(r.supplied_qty),
    supplied_value: num(r.supplied_value),
    pending_qty: num(r.pending_qty),
    pending_amount: num(r.pending_amount),
    returned_qty: num(r.returned_qty),
    returned_amount: num(r.returned_amount),
    paid: num(r.paid),
    pending_payout: num(r.pending_payout),
    deposit_balance: num(r.deposit_balance),
  })) as AdminResellerRow[];
}

/** Withdrawable now = settled profit + deposit balance − paid − pending requests. */
export function resellerPayableNow(t: ResellerReportTotals) {
  return Math.max(t.earning + t.deposit_balance - t.paid - t.pending_payout, 0);
}
