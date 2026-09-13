//#region src/lib/delivery.ts
var DELIVERY_AREAS = [
	"inside_dhaka",
	"sub_dhaka",
	"outside_dhaka"
];
var DEFAULT_DELIVERY_SETTINGS = {
	mode: "area",
	flat: 80,
	custom: 0,
	areas: {
		inside_dhaka: {
			label: "Inside Dhaka",
			charge: 60
		},
		sub_dhaka: {
			label: "Sub Dhaka",
			charge: 90
		},
		outside_dhaka: {
			label: "Outside Dhaka",
			charge: 130
		}
	},
	rules: []
};
function emptyDeliveryRule() {
	return {
		id: `r${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
		name: "New rule",
		enabled: true,
		mode: "flat",
		flat: 0,
		custom: 0,
		areas: {
			inside_dhaka: 0,
			sub_dhaka: 0,
			outside_dhaka: 0
		},
		target: {
			products: [],
			brands: [],
			categories: []
		}
	};
}
function idList(v) {
	return Array.isArray(v) ? v.filter((x) => typeof x === "string" && !!x) : [];
}
function mergeDeliveryRule(raw) {
	const r = raw ?? {};
	const base = emptyDeliveryRule();
	const mode = [
		"area",
		"free",
		"flat",
		"custom"
	].includes(r.mode) ? r.mode : base.mode;
	return {
		id: typeof r.id === "string" && r.id ? r.id : base.id,
		name: typeof r.name === "string" && r.name.trim() ? r.name.trim() : base.name,
		enabled: r.enabled !== false,
		mode,
		flat: num(r.flat, 0),
		custom: num(r.custom, 0),
		areas: {
			inside_dhaka: num(r.areas?.inside_dhaka, 0),
			sub_dhaka: num(r.areas?.sub_dhaka, 0),
			outside_dhaka: num(r.areas?.outside_dhaka, 0)
		},
		target: {
			products: idList(r.target?.products),
			brands: idList(r.target?.brands),
			categories: idList(r.target?.categories)
		}
	};
}
function mergeDeliverySettings(raw) {
	const r = raw ?? {};
	const mode = [
		"area",
		"free",
		"flat",
		"custom"
	].includes(r.mode) ? r.mode : DEFAULT_DELIVERY_SETTINGS.mode;
	const areas = { ...DEFAULT_DELIVERY_SETTINGS.areas };
	for (const key of DELIVERY_AREAS) {
		const src = r.areas?.[key] ?? {};
		areas[key] = {
			label: typeof src.label === "string" && src.label.trim() ? src.label.trim() : DEFAULT_DELIVERY_SETTINGS.areas[key].label,
			charge: num(src.charge, DEFAULT_DELIVERY_SETTINGS.areas[key].charge)
		};
	}
	return {
		mode,
		flat: num(r.flat, DEFAULT_DELIVERY_SETTINGS.flat),
		custom: num(r.custom, DEFAULT_DELIVERY_SETTINGS.custom),
		areas,
		rules: Array.isArray(r.rules) ? r.rules.map(mergeDeliveryRule) : []
	};
}
function num(v, fallback = 0) {
	const n = Number(v);
	return Number.isFinite(n) && n >= 0 ? n : fallback;
}
var active = DEFAULT_DELIVERY_SETTINGS;
/** Called once per session from the shared settings cache. */
function setGlobalDelivery(s) {
	active = s;
}
function globalDelivery() {
	return active;
}
function areaLabel(area, g = active) {
	return g.areas[area]?.label ?? DEFAULT_DELIVERY_SETTINGS.areas[area].label;
}
function areaOptions(g = active) {
	return DELIVERY_AREAS.map((value) => ({
		value,
		label: areaLabel(value, g)
	}));
}
function productDeliveryMode(p) {
	const m = p.delivery_mode ?? "global";
	return m === "free" || m === "flat" || m === "area" || m === "custom" ? m : "global";
}
/** First enabled custom rule that targets this product / its brand / its category. */
function matchDeliveryRule(p, g = active) {
	for (const rule of g.rules ?? []) {
		if (!rule.enabled) continue;
		const t = rule.target;
		if (!t.products.length && !t.brands.length && !t.categories.length) continue;
		if (p.id && t.products.includes(p.id)) return rule;
		if (p.brand_id && t.brands.includes(p.brand_id)) return rule;
		if (p.category_id && t.categories.includes(p.category_id)) return rule;
	}
	return null;
}
/**
* Merge product override → custom rule → global.
* Priority: 1) product's own setting, 2) matching custom rule, 3) global rule.
*/
function resolveDelivery(p, g = active) {
	const own = productDeliveryMode(p);
	if (own === "global") {
		const rule = matchDeliveryRule(p, g);
		if (rule) return {
			source: "rule",
			ruleName: rule.name,
			mode: rule.mode,
			flat: rule.flat,
			custom: rule.custom,
			charges: { ...rule.areas }
		};
		return {
			source: "global",
			mode: g.mode,
			flat: g.flat,
			custom: g.custom,
			charges: {
				inside_dhaka: g.areas.inside_dhaka.charge,
				sub_dhaka: g.areas.sub_dhaka.charge,
				outside_dhaka: g.areas.outside_dhaka.charge
			}
		};
	}
	const inside = num(p.delivery_inside, 0);
	const outside = num(p.delivery_outside, 0);
	return {
		source: "product",
		mode: own,
		flat: num(p.delivery_flat, 0),
		custom: num(p.delivery_flat, 0),
		charges: {
			inside_dhaka: inside,
			sub_dhaka: p.delivery_sub == null ? outside : num(p.delivery_sub, outside),
			outside_dhaka: outside
		}
	};
}
/** Base charge (before reseller extras) for one resolved config in one area. */
function resolvedCharge(r, area) {
	if (r.mode === "free") return 0;
	if (r.mode === "flat") return r.flat;
	if (r.mode === "custom") return r.custom;
	return r.charges[area] ?? 0;
}
/** Back-compat: legacy callers pass the raw product row. */
function deliveryMode(p, g = active) {
	return resolveDelivery(p, g).mode;
}
/**
* Customer-facing delivery charge for one product.
* `extra` = reseller's own extra delivery add-on (ignored for free shipping).
*/
function productDeliveryCharge(p, area, extra = {}, g = active) {
	const r = resolveDelivery(p, g);
	if (r.mode === "free") return 0;
	const add = area === "inside_dhaka" ? num(extra.inside, 0) : num(extra.outside, 0);
	return resolvedCharge(r, area) + add;
}
/** Short label like "Free shipping", "Flat ৳80", "৳60 / ৳90 / ৳130". */
function deliveryLabel(p, g = active) {
	const r = resolveDelivery(p, g);
	const suffix = r.source === "global" ? " (g)" : r.source === "rule" ? ` (${r.ruleName})` : "";
	if (r.mode === "free") return `Free shipping${suffix}`;
	if (r.mode === "flat") return `Flat ৳${r.flat}${suffix}`;
	if (r.mode === "custom") return `Custom ৳${r.custom}${suffix}`;
	return `${r.charges.inside_dhaka}/${r.charges.sub_dhaka}/${r.charges.outside_dhaka}${suffix}`;
}
/** One-line description of the global rule, for hints. */
function deliverySettingsSummary(g = active) {
	if (g.mode === "free") return "Global: free shipping everywhere";
	if (g.mode === "flat") return `Global: flat ৳${g.flat} for every area`;
	if (g.mode === "custom") return `Global: custom ৳${g.custom} (editable per order)`;
	return DELIVERY_AREAS.map((a) => `${areaLabel(a, g)} ৳${g.areas[a].charge}`).join(" · ");
}
//#endregion
export { deliveryLabel as a, emptyDeliveryRule as c, productDeliveryCharge as d, resolveDelivery as f, areaOptions as i, globalDelivery as l, setGlobalDelivery as m, DELIVERY_AREAS as n, deliveryMode as o, resolvedCharge as p, areaLabel as r, deliverySettingsSummary as s, DEFAULT_DELIVERY_SETTINGS as t, mergeDeliverySettings as u };
