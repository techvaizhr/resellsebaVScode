/**
 * Reseller subscription — one source of truth for the client side.
 *
 * The database decides everything (status, price, store access) through
 * `subscription_state()`, so panel, storefront and admin always agree. This
 * module only types that payload and wraps the RPCs.
 */
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionStatus = "none" | "trial" | "active" | "grace" | "expired" | "exempt";

export type SubscriptionState = {
  has_subscription: boolean;
  status: SubscriptionStatus;
  locked: boolean;
  plan_id?: string | null;
  plan_code?: string | null;
  plan_name?: string | null;
  includes_store?: boolean;
  store_enabled: boolean;
  cycle_months?: number;
  trial_ends_at?: string | null;
  current_period_end?: string | null;
  ends_at?: string | null;
  grace_ends_at?: string | null;
  grace_days?: number;
  days_left?: number;
  grace_days_left?: number;
  is_exempt?: boolean;
  price?: Record<string, number>;
};

export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  includes_store: boolean;
  price_1m: number;
  price_3m: number;
  price_6m: number;
  price_12m: number;
  trial_days: number;
  grace_days: number;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
};

export type SubscriptionPayment = {
  id: string;
  reseller_id: string;
  plan_id: string | null;
  plan_name?: string | null;
  business_name?: string | null;
  code?: string | null;
  cycle_months: number;
  amount: number;
  source: "earning" | "manual" | "admin";
  status: "pending" | "paid" | "rejected";
  method: string | null;
  reference: string | null;
  note: string | null;
  admin_note: string | null;
  period_from: string | null;
  period_to: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type MySubscription = {
  reseller_id: string | null;
  state?: SubscriptionState;
  balance?: number;
  frozen?: number;
  plans?: SubscriptionPlan[];
  payments?: SubscriptionPayment[];
  methods?: {
    id: string;
    method: string;
    label: string;
    instructions: string | null;
    config: Record<string, unknown> | null;
  }[];
};

export type Subscriber = {
  reseller_id: string;
  code: string;
  business_name: string;
  status: string;
  avatar_url: string | null;
  subscription: Record<string, unknown> | null;
  state: SubscriptionState;
  balance: number;
};

export type SubscriptionOverview = {
  plans: SubscriptionPlan[];
  subscribers: Subscriber[];
  payments: SubscriptionPayment[];
};

export const CYCLES = [1, 3, 6, 12] as const;
export type Cycle = (typeof CYCLES)[number];

export const cycleLabel = (m: number) => (m === 1 ? "1 month" : `${m} months`);

export const planPrice = (plan: SubscriptionPlan, months: number): number =>
  months === 1 ? Number(plan.price_1m)
  : months === 3 ? Number(plan.price_3m)
  : months === 6 ? Number(plan.price_6m)
  : Number(plan.price_12m);

/** Per-month price, so the longer cycles can show their saving. */
export const perMonth = (plan: SubscriptionPlan, months: number) => planPrice(plan, months) / months;

export const savingPercent = (plan: SubscriptionPlan, months: number) => {
  const base = Number(plan.price_1m);
  if (!base || months === 1) return 0;
  return Math.max(0, Math.round((1 - perMonth(plan, months) / base) * 100));
};

export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  none: "No plan",
  trial: "Free trial",
  active: "Active",
  grace: "Grace period",
  expired: "Expired",
  exempt: "Free access",
};

export const STATUS_CLASS: Record<SubscriptionStatus, string> = {
  none: "bg-muted text-muted-foreground",
  trial: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  active: "bg-success/15 text-success",
  grace: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  expired: "bg-destructive/15 text-destructive",
  exempt: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
};

export const statusLabel = (s?: string | null) => STATUS_LABEL[(s ?? "none") as SubscriptionStatus] ?? "Unknown";
export const statusClass = (s?: string | null) =>
  STATUS_CLASS[(s ?? "none") as SubscriptionStatus] ?? "bg-muted text-muted-foreground";

export const fmtDate = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ------------------------------ data access ------------------------------ */

const rpc = supabase.rpc.bind(supabase) as unknown as (
  fn: string,
  args?: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export async function fetchMySubscription(): Promise<MySubscription> {
  const { data, error } = await rpc("my_subscription");
  if (error) throw new Error(error.message);
  return (data ?? { reseller_id: null }) as MySubscription;
}

export async function fetchSubscriptionOverview(): Promise<SubscriptionOverview> {
  const { data, error } = await rpc("subscription_overview");
  if (error) throw new Error(error.message);
  return (data ?? { plans: [], subscribers: [], payments: [] }) as SubscriptionOverview;
}

export async function payFromEarning(planId: string, months: number) {
  const { data, error } = await rpc("subscription_pay_from_earning", { _plan_id: planId, _months: months });
  if (error) throw new Error(error.message);
  return data as { ok: boolean; amount: number; period_to: string };
}

export async function requestManualPayment(input: {
  planId: string;
  months: number;
  paymentConfigId: string | null;
  reference: string;
  note: string;
}) {
  const { data, error } = await rpc("subscription_request_manual", {
    _plan_id: input.planId,
    _months: input.months,
    _payment_config_id: input.paymentConfigId,
    _reference: input.reference,
    _note: input.note,
  });
  if (error) throw new Error(error.message);
  return data as { ok: boolean; id: string; amount: number };
}

export async function reviewSubscriptionPayment(id: string, approve: boolean, adminNote = "") {
  const { error } = await rpc("subscription_review_payment", {
    _payment_id: id,
    _approve: approve,
    _admin_note: adminNote,
  });
  if (error) throw new Error(error.message);
}

export async function setResellerSubscription(resellerId: string, patch: Record<string, unknown>) {
  const { data, error } = await rpc("admin_set_subscription", { _reseller_id: resellerId, _patch: patch });
  if (error) throw new Error(error.message);
  return data as SubscriptionState;
}

export async function savePlan(plan: Partial<SubscriptionPlan> & { id?: string }) {
  const row = {
    code: plan.code,
    name: plan.name,
    description: plan.description ?? null,
    includes_store: Boolean(plan.includes_store),
    price_1m: Number(plan.price_1m ?? 0),
    price_3m: Number(plan.price_3m ?? 0),
    price_6m: Number(plan.price_6m ?? 0),
    price_12m: Number(plan.price_12m ?? 0),
    trial_days: Number(plan.trial_days ?? 0),
    grace_days: Number(plan.grace_days ?? 0),
    is_active: plan.is_active ?? true,
    is_default: Boolean(plan.is_default),
    sort_order: Number(plan.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };
  if (plan.is_default) {
    const { error: clearErr } = await supabase
      .from("subscription_plans")
      .update({ is_default: false } as never)
      .eq("is_default", true);
    if (clearErr) throw new Error(clearErr.message);
  }
  const q = plan.id
    ? supabase.from("subscription_plans").update(row as never).eq("id", plan.id)
    : supabase.from("subscription_plans").insert(row as never);
  const { error } = await q;
  if (error) throw new Error(error.message);
}
