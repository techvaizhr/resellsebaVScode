import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { m as setGlobalDelivery, t as DEFAULT_DELIVERY_SETTINGS, u as mergeDeliverySettings } from "./delivery-DY_nRbFK.js";
import { n as getGlobalSettings, t as clearAppDataCache } from "./app-data-DwbOGY7V.js";
//#region src/lib/pricing-rule.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var DEFAULT_PRICING_RULE = {
	enabled: false,
	resellerMode: "pct",
	resellerValue: 20,
	suggestedMode: "pct",
	suggestedValue: 25,
	packaging: 0,
	roundTo: 5
};
function mergePricingRule(raw) {
	const r = raw ?? {};
	const num = (v, fb) => Number.isFinite(Number(v)) ? Number(v) : fb;
	const mode = (v, fb) => v === "pct" || v === "fixed" ? v : fb;
	return {
		enabled: typeof r.enabled === "boolean" ? r.enabled : DEFAULT_PRICING_RULE.enabled,
		resellerMode: mode(r.resellerMode, DEFAULT_PRICING_RULE.resellerMode),
		resellerValue: num(r.resellerValue, DEFAULT_PRICING_RULE.resellerValue),
		suggestedMode: mode(r.suggestedMode, DEFAULT_PRICING_RULE.suggestedMode),
		suggestedValue: num(r.suggestedValue, DEFAULT_PRICING_RULE.suggestedValue),
		packaging: num(r.packaging, DEFAULT_PRICING_RULE.packaging),
		roundTo: num(r.roundTo, DEFAULT_PRICING_RULE.roundTo)
	};
}
/** Same math as the database function `public.pricing_rule_apply`. */
function applyPricingRule(cost, rule) {
	const c = Number.isFinite(cost) ? Math.max(0, cost) : 0;
	const reseller = rule.resellerMode === "pct" ? c * (1 + rule.resellerValue / 100) : c + rule.resellerValue;
	const packaging = Math.max(0, rule.packaging);
	const suggestedBase = rule.suggestedMode === "pct" ? reseller * (1 + rule.suggestedValue / 100) : reseller + rule.suggestedValue;
	const round = (n) => rule.roundTo > 0 ? Math.round(n / rule.roundTo) * rule.roundTo : Math.round(n * 100) / 100;
	return {
		resellerPrice: Math.max(0, round(reseller)),
		suggestedPrice: Math.max(0, round(suggestedBase + packaging)),
		packaging
	};
}
function pricingRuleSummary(rule) {
	if (!rule.enabled) return "Auto pricing is off — every price is typed by hand.";
	return `Reseller price = ${rule.resellerMode === "pct" ? `cost + ${rule.resellerValue}%` : `cost + ৳${rule.resellerValue}`} · Suggested price = ${rule.suggestedMode === "pct" ? `reseller price + ${rule.suggestedValue}%` : `reseller price + ৳${rule.suggestedValue}`}${rule.packaging ? ` + ৳${rule.packaging} packaging` : ""}${rule.roundTo > 0 ? ` · rounded to ৳${rule.roundTo}` : ""}`;
}
//#endregion
//#region src/lib/advanced-settings.ts
var DEFAULT_ADVANCED_SETTINGS = {
	resellerCatalogShowStock: true,
	packagingChargeSum: true,
	resellerAutoApprove: false,
	verifyEnabled: false,
	verifyEmail: true,
	verifySms: false,
	depositPayEnabled: true,
	delivery: DEFAULT_DELIVERY_SETTINGS,
	pricing: DEFAULT_PRICING_RULE
};
function mergeAdvanced(raw) {
	const r = raw ?? {};
	const out = { ...DEFAULT_ADVANCED_SETTINGS };
	for (const k of Object.keys(out)) if (typeof out[k] === "boolean" && typeof r[k] === "boolean") out[k] = r[k];
	out.delivery = mergeDeliverySettings(r.delivery);
	out.pricing = mergePricingRule(r.pricing);
	setGlobalDelivery(out.delivery);
	return out;
}
/** True when the signed-in user still has to complete a verification step. */
function pendingChannels(s, state) {
	if (!s.verifyEnabled) return [];
	const out = [];
	if (s.verifyEmail && !state.emailVerified) out.push("email");
	if (s.verifySms && !state.phoneVerified) out.push("sms");
	return out;
}
async function fetchAdvancedSettings() {
	return mergeAdvanced((await getGlobalSettings())?.advanced_settings);
}
var cache = null;
/** Read-only hook for feature switches; cached for the session. */
function useAdvancedSettings() {
	const [settings, setSettings] = (0, import_react.useState)(cache ?? DEFAULT_ADVANCED_SETTINGS);
	const [loading, setLoading] = (0, import_react.useState)(cache === null);
	(0, import_react.useEffect)(() => {
		if (cache) return;
		let alive = true;
		fetchAdvancedSettings().then((s) => {
			cache = s;
			if (!alive) return;
			setSettings(s);
			setLoading(false);
		});
		return () => {
			alive = false;
		};
	}, []);
	return {
		settings,
		loading
	};
}
function clearAdvancedSettingsCache() {
	cache = null;
	clearAppDataCache("settings");
}
//#endregion
export { pendingChannels as a, pricingRuleSummary as c, mergeAdvanced as i, clearAdvancedSettingsCache as n, useAdvancedSettings as o, fetchAdvancedSettings as r, applyPricingRule as s, DEFAULT_ADVANCED_SETTINGS as t };
