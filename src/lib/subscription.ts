/**
 * Reseller subscription — one source of truth for the client side.
 *
 * The database decides everything (status, price, store access) through
 * `subscription_state()`, so panel, storefront and admin always agree. This
 * module types that payload, provides calculation utilities and wraps RPCs.
 */
import { supabase } from "@/integrations/laravel/client";
import { formatDate } from "@/lib/date";

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

export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "265f1728-3f23-4677-92c7-9adeee24696b",
    code: "panel",
    name: "Only Panel Use",
    description: "Reseller panel access only - catalog, orders, customers and finance.",
    includes_store: false,
    price_1m: 200,
    price_3m: 500,
    price_6m: 800,
    price_12m: 1500,
    trial_days: 30,
    grace_days: 7,
    is_active: true,
    is_default: false,
    sort_order: 1,
  },
  {
    id: "65b24f28-da11-4524-88ba-be1f492e4a40",
    code: "panel_store",
    name: "Panel + Storefront Use",
    description: "Everything in Panel plus your public storefront and custom domain.",
    includes_store: true,
    price_1m: 500,
    price_3m: 1200,
    price_6m: 2200,
    price_12m: 4000,
    trial_days: 30,
    grace_days: 7,
    is_active: true,
    is_default: true,
    sort_order: 2,
  },
];

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
  formatDate(v, "—", { day: "2-digit", month: "short", year: "numeric" });

/** Pure computation of subscription state given a subscription record and plan */
export function computeSubscriptionState(sub: any, plan: any): SubscriptionState {
  if (!sub && !plan) {
    return {
      has_subscription: false,
      status: "none",
      locked: true,
      store_enabled: false,
      days_left: 0,
      grace_days_left: 0,
    };
  }

  const now = Date.now();
  const includesStore = Boolean(plan?.includes_store ?? true);
  const isExempt = Boolean(sub?.is_exempt);
  const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : null;
  const currentPeriodEnd = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  const graceDays = typeof sub?.override_grace_days === "number" ? sub.override_grace_days : (plan?.grace_days ?? 7);

  let status: SubscriptionStatus = "none";
  let endsAt: string | null = null;
  let daysLeft = 0;
  let graceDaysLeft = 0;
  let graceEndsAt: string | null = null;
  let locked = false;
  let storeEnabled = false;

  if (isExempt) {
    status = "exempt";
    locked = false;
    storeEnabled = includesStore;
    daysLeft = 999;
  } else if (currentPeriodEnd && currentPeriodEnd > now) {
    status = "active";
    endsAt = new Date(currentPeriodEnd).toISOString();
    daysLeft = Math.max(0, Math.ceil((currentPeriodEnd - now) / (1000 * 60 * 60 * 24)));
    locked = false;
    storeEnabled = includesStore;
  } else if (trialEndsAt && trialEndsAt > now) {
    status = "trial";
    endsAt = new Date(trialEndsAt).toISOString();
    daysLeft = Math.max(0, Math.ceil((trialEndsAt - now) / (1000 * 60 * 60 * 24)));
    locked = false;
    storeEnabled = includesStore;
  } else {
    // Grace period check
    const expiry = currentPeriodEnd || trialEndsAt;
    if (expiry) {
      const graceEnd = expiry + graceDays * 24 * 60 * 60 * 1000;
      graceEndsAt = new Date(graceEnd).toISOString();
      if (graceEnd > now) {
        status = "grace";
        endsAt = new Date(expiry).toISOString();
        graceDaysLeft = Math.max(0, Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24)));
        locked = false;
        storeEnabled = includesStore;
      } else {
        status = "expired";
        endsAt = new Date(expiry).toISOString();
        locked = true;
        storeEnabled = false;
      }
    } else {
      status = "none";
      locked = true;
      storeEnabled = false;
    }
  }

  const price1m = sub?.override_price_1m ?? plan?.price_1m ?? 500;
  const price3m = sub?.override_price_3m ?? plan?.price_3m ?? 1200;
  const price6m = sub?.override_price_6m ?? plan?.price_6m ?? 2200;
  const price12m = sub?.override_price_12m ?? plan?.price_12m ?? 4000;

  return {
    has_subscription: Boolean(sub),
    status,
    locked,
    plan_id: plan?.id ?? sub?.plan_id ?? null,
    plan_code: plan?.code ?? (includesStore ? "panel_store" : "panel"),
    plan_name: plan?.name ?? (includesStore ? "Panel + Storefront Use" : "Only Panel Use"),
    includes_store: includesStore,
    store_enabled: storeEnabled,
    cycle_months: sub?.cycle_months ?? 1,
    trial_ends_at: sub?.trial_ends_at ?? null,
    current_period_end: sub?.current_period_end ?? null,
    ends_at: endsAt,
    grace_ends_at: graceEndsAt,
    grace_days: graceDays,
    days_left: daysLeft,
    grace_days_left: graceDaysLeft,
    is_exempt: isExempt,
    price: {
      "1": price1m,
      "3": price3m,
      "6": price6m,
      "12": price12m,
    },
  };
}

/* ------------------------------ data access ------------------------------ */

async function rpc(fn: string, args?: Record<string, unknown>): Promise<{ data: unknown; error: { message: string } | null }> {
  try {
    return await supabase.rpc(fn, args);
  } catch (err: any) {
    return { data: null, error: { message: err?.message || String(err) } };
  }
}

export async function fetchMySubscription(): Promise<MySubscription> {
  try {
    const { data, error } = await rpc("my_subscription");
    if (!error && data) return data as MySubscription;
  } catch {}

  // Fallback direct builder
  const defaultPlan = DEFAULT_SUBSCRIPTION_PLANS[1];
  const state = computeSubscriptionState(
    {
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cycle_months: 1,
    },
    defaultPlan
  );

  return {
    reseller_id: "current-reseller",
    state,
    balance: 0,
    frozen: 0,
    plans: DEFAULT_SUBSCRIPTION_PLANS,
    payments: [],
    methods: [],
  };
}

export async function fetchSubscriptionOverview(): Promise<SubscriptionOverview> {
  try {
    const { data, error } = await rpc("subscription_overview");
    if (!error && data && (data as any).subscribers?.length > 0) {
      return data as SubscriptionOverview;
    }
  } catch {}

  return {
    plans: DEFAULT_SUBSCRIPTION_PLANS,
    subscribers: [],
    payments: [],
  };
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
    await supabase
      .from("subscription_plans")
      .update({ is_default: false } as never)
      .eq("is_default", true);
  }

  const q = plan.id
    ? supabase.from("subscription_plans").update(row as never).eq("id", plan.id)
    : supabase.from("subscription_plans").insert(row as never);
  const { error } = await q;
  if (error) throw new Error(error.message);
}
