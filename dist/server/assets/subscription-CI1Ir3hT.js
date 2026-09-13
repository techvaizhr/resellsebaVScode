import { r as supabase } from "./client-B8ZbbxaQ.js";
import { t as formatDate } from "./date-zfkEdx3e.js";
//#region src/lib/subscription.ts
/**
* Reseller subscription — one source of truth for the client side.
*
* The database decides everything (status, price, store access) through
* `subscription_state()`, so panel, storefront and admin always agree. This
* module types that payload, provides calculation utilities and wraps RPCs.
*/
var DEFAULT_SUBSCRIPTION_PLANS = [{
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
	sort_order: 1
}, {
	id: "65b24f28-da11-4524-88ba-be1f492e4a40",
	code: "panel_store",
	name: "Panel + Storefront Use",
	description: "Everything in Panel plus your public storefront and custom domain.",
	includes_store: true,
	price_1m: 500,
	price_3m: 1200,
	price_6m: 2200,
	price_12m: 4e3,
	trial_days: 30,
	grace_days: 7,
	is_active: true,
	is_default: true,
	sort_order: 2
}];
var CYCLES = [
	1,
	3,
	6,
	12
];
var cycleLabel = (m) => m === 1 ? "1 month" : `${m} months`;
var planPrice = (plan, months) => months === 1 ? Number(plan.price_1m) : months === 3 ? Number(plan.price_3m) : months === 6 ? Number(plan.price_6m) : Number(plan.price_12m);
/** Per-month price, so the longer cycles can show their saving. */
var perMonth = (plan, months) => planPrice(plan, months) / months;
var savingPercent = (plan, months) => {
	const base = Number(plan.price_1m);
	if (!base || months === 1) return 0;
	return Math.max(0, Math.round((1 - perMonth(plan, months) / base) * 100));
};
var STATUS_LABEL = {
	none: "No plan",
	trial: "Free trial",
	active: "Active",
	grace: "Grace period",
	expired: "Expired",
	exempt: "Free access"
};
var STATUS_CLASS = {
	none: "bg-muted text-muted-foreground",
	trial: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
	active: "bg-success/15 text-success",
	grace: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
	expired: "bg-destructive/15 text-destructive",
	exempt: "bg-violet-500/15 text-violet-600 dark:text-violet-400"
};
var statusLabel = (s) => STATUS_LABEL[s ?? "none"] ?? "Unknown";
var statusClass = (s) => STATUS_CLASS[s ?? "none"] ?? "bg-muted text-muted-foreground";
var fmtDate = (v) => formatDate(v, "—", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
/** Pure computation of subscription state given a subscription record and plan */
function computeSubscriptionState(sub, plan) {
	if (!sub && !plan) return {
		has_subscription: false,
		status: "none",
		locked: true,
		store_enabled: false,
		days_left: 0,
		grace_days_left: 0
	};
	const now = Date.now();
	const includesStore = Boolean(plan?.includes_store ?? true);
	const isExempt = Boolean(sub?.is_exempt);
	const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : null;
	const currentPeriodEnd = sub?.current_period_end ? new Date(sub.current_period_end).getTime() : null;
	const graceDays = typeof sub?.override_grace_days === "number" ? sub.override_grace_days : plan?.grace_days ?? 7;
	let status = "none";
	let endsAt = null;
	let daysLeft = 0;
	let graceDaysLeft = 0;
	let graceEndsAt = null;
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
		daysLeft = Math.max(0, Math.ceil((currentPeriodEnd - now) / (1e3 * 60 * 60 * 24)));
		locked = false;
		storeEnabled = includesStore;
	} else if (trialEndsAt && trialEndsAt > now) {
		status = "trial";
		endsAt = new Date(trialEndsAt).toISOString();
		daysLeft = Math.max(0, Math.ceil((trialEndsAt - now) / (1e3 * 60 * 60 * 24)));
		locked = false;
		storeEnabled = includesStore;
	} else {
		const expiry = currentPeriodEnd || trialEndsAt;
		if (expiry) {
			const graceEnd = expiry + graceDays * 24 * 60 * 60 * 1e3;
			graceEndsAt = new Date(graceEnd).toISOString();
			if (graceEnd > now) {
				status = "grace";
				endsAt = new Date(expiry).toISOString();
				graceDaysLeft = Math.max(0, Math.ceil((graceEnd - now) / (1e3 * 60 * 60 * 24)));
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
	const price12m = sub?.override_price_12m ?? plan?.price_12m ?? 4e3;
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
			"12": price12m
		}
	};
}
async function rpc(fn, args) {
	try {
		return await supabase.rpc(fn, args);
	} catch (err) {
		return {
			data: null,
			error: { message: err?.message || String(err) }
		};
	}
}
async function fetchMySubscription() {
	try {
		const { data, error } = await rpc("my_subscription");
		if (!error && data) return data;
	} catch {}
	const defaultPlan = DEFAULT_SUBSCRIPTION_PLANS[1];
	return {
		reseller_id: "current-reseller",
		state: computeSubscriptionState({
			trial_ends_at: new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString(),
			cycle_months: 1
		}, defaultPlan),
		balance: 0,
		frozen: 0,
		plans: DEFAULT_SUBSCRIPTION_PLANS,
		payments: [],
		methods: []
	};
}
async function fetchSubscriptionOverview() {
	try {
		const { data, error } = await rpc("subscription_overview");
		if (!error && data && data.subscribers?.length > 0) return data;
	} catch {}
	return {
		plans: DEFAULT_SUBSCRIPTION_PLANS,
		subscribers: [],
		payments: []
	};
}
async function payFromEarning(planId, months) {
	const { data, error } = await rpc("subscription_pay_from_earning", {
		_plan_id: planId,
		_months: months
	});
	if (error) throw new Error(error.message);
	return data;
}
async function requestManualPayment(input) {
	const { data, error } = await rpc("subscription_request_manual", {
		_plan_id: input.planId,
		_months: input.months,
		_payment_config_id: input.paymentConfigId,
		_reference: input.reference,
		_note: input.note
	});
	if (error) throw new Error(error.message);
	return data;
}
async function reviewSubscriptionPayment(id, approve, adminNote = "") {
	const { error } = await rpc("subscription_review_payment", {
		_payment_id: id,
		_approve: approve,
		_admin_note: adminNote
	});
	if (error) throw new Error(error.message);
}
async function setResellerSubscription(resellerId, patch) {
	const { data, error } = await rpc("admin_set_subscription", {
		_reseller_id: resellerId,
		_patch: patch
	});
	if (error) throw new Error(error.message);
	return data;
}
async function savePlan(plan) {
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
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (plan.is_default) await supabase.from("subscription_plans").update({ is_default: false }).eq("is_default", true);
	const { error } = await (plan.id ? supabase.from("subscription_plans").update(row).eq("id", plan.id) : supabase.from("subscription_plans").insert(row));
	if (error) throw new Error(error.message);
}
//#endregion
export { fmtDate as a, requestManualPayment as c, savingPercent as d, setResellerSubscription as f, fetchSubscriptionOverview as i, reviewSubscriptionPayment as l, statusLabel as m, cycleLabel as n, payFromEarning as o, statusClass as p, fetchMySubscription as r, planPrice as s, CYCLES as t, savePlan as u };
