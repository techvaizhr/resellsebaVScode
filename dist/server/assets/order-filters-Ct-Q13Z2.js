import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { H as Search, j as SlidersHorizontal, nr as CalendarDays, r as X } from "./vendor-icons-BWIzFOtW.js";
import { t as SearchableSelect } from "./searchable-select-Tf5ZWsr9.js";
//#region src/components/order-filters.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_ORDER_FILTERS = {
	q: "",
	reseller: "",
	supplier: "",
	datePreset: "lifetime",
	from: "",
	to: "",
	sort: "newest",
	area: "",
	courier: "",
	perPage: 20
};
var AREA_FILTER_OPTIONS = [
	{
		value: "",
		label: "All areas"
	},
	{
		value: "inside_dhaka",
		label: "Inside Dhaka"
	},
	{
		value: "sub_dhaka",
		label: "Sub Dhaka"
	},
	{
		value: "outside_dhaka",
		label: "Outside Dhaka"
	}
];
var COURIER_FILTER_OPTIONS = [
	{
		value: "",
		label: "All couriers"
	},
	{
		value: "steadfast",
		label: "Steadfast"
	},
	{
		value: "pathao",
		label: "Pathao"
	},
	{
		value: "carrybee",
		label: "Carrybee"
	},
	{
		value: "none",
		label: "Not booked"
	}
];
var DATE_PRESET_OPTIONS = [
	{
		value: "today",
		label: "Today"
	},
	{
		value: "yesterday",
		label: "Yesterday"
	},
	{
		value: "last7",
		label: "Last 7 days"
	},
	{
		value: "last30",
		label: "Last 30 days"
	},
	{
		value: "this_month",
		label: "This month"
	},
	{
		value: "last_month",
		label: "Last month"
	},
	{
		value: "this_year",
		label: "This year"
	},
	{
		value: "last_year",
		label: "Last year"
	},
	{
		value: "lifetime",
		label: "Life time"
	},
	{
		value: "custom",
		label: "Custom range"
	}
];
var SORT_OPTIONS = [
	{
		value: "newest",
		label: "Newest first"
	},
	{
		value: "oldest",
		label: "Oldest first"
	},
	{
		value: "updated",
		label: "Last updated"
	},
	{
		value: "high",
		label: "Amount: high → low"
	},
	{
		value: "low",
		label: "Amount: low → high"
	}
];
var startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
var endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
/** Resolve a preset (or custom range) into a timestamp window. */
function resolveDateRange(f) {
	const now = /* @__PURE__ */ new Date();
	switch (f.datePreset) {
		case "today": return {
			fromTs: startOfDay(now),
			toTs: endOfDay(now)
		};
		case "yesterday": {
			const y = new Date(now);
			y.setDate(y.getDate() - 1);
			return {
				fromTs: startOfDay(y),
				toTs: endOfDay(y)
			};
		}
		case "last7": {
			const s = new Date(now);
			s.setDate(s.getDate() - 6);
			return {
				fromTs: startOfDay(s),
				toTs: endOfDay(now)
			};
		}
		case "last30": {
			const s = new Date(now);
			s.setDate(s.getDate() - 29);
			return {
				fromTs: startOfDay(s),
				toTs: endOfDay(now)
			};
		}
		case "this_month": return {
			fromTs: new Date(now.getFullYear(), now.getMonth(), 1).getTime(),
			toTs: endOfDay(now)
		};
		case "last_month": return {
			fromTs: new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
			toTs: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime()
		};
		case "this_year": return {
			fromTs: new Date(now.getFullYear(), 0, 1).getTime(),
			toTs: endOfDay(now)
		};
		case "last_year": return {
			fromTs: new Date(now.getFullYear() - 1, 0, 1).getTime(),
			toTs: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999).getTime()
		};
		case "custom": return {
			fromTs: f.from ? (/* @__PURE__ */ new Date(`${f.from}T00:00:00`)).getTime() : null,
			toTs: f.to ? (/* @__PURE__ */ new Date(`${f.to}T23:59:59`)).getTime() : null
		};
		default: return {
			fromTs: null,
			toTs: null
		};
	}
}
/** Shared filter + sort logic so admin & reseller lists behave identically. */
function applyOrderFilters(rows, f) {
	const q = f.q.trim().toLowerCase();
	const { fromTs, toTs } = resolveDateRange(f);
	return rows.filter((o) => {
		if (q) {
			if (![
				o.order_number,
				o.customer_name,
				o.customer_phone,
				o.address_line ?? "",
				o.resellers?.business_name ?? "",
				o.resellers?.code ?? ""
			].join(" ").toLowerCase().includes(q)) return false;
		}
		if (f.reseller) {
			if (f.reseller === "__direct__") {
				if (o.reseller_id) return false;
			} else if (o.reseller_id !== f.reseller) return false;
		}
		if (f.area && o.area !== f.area) return false;
		const ts = new Date(o.created_at).getTime();
		if (fromTs != null && ts < fromTs) return false;
		if (toTs != null && ts > toTs) return false;
		return true;
	}).sort((a, b) => {
		if (f.sort === "high" || f.sort === "low") {
			const diff = Number(a.total) - Number(b.total);
			return f.sort === "high" ? -diff : diff;
		}
		if (f.sort === "updated") {
			const au = new Date(a.updated_at ?? a.created_at).getTime();
			return new Date(b.updated_at ?? b.created_at).getTime() - au;
		}
		const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
		return f.sort === "oldest" ? diff : -diff;
	});
}
/** Keep only orders whose shipment matches the courier filter (or has none). */
function filterByCourier(rows, courier, shipments) {
	if (!courier) return rows;
	const byOrder = /* @__PURE__ */ new Map();
	for (const s of shipments) {
		if (!s.provider || !s.order_id) continue;
		let set = byOrder.get(s.order_id);
		if (!set) {
			set = /* @__PURE__ */ new Set();
			byOrder.set(s.order_id, set);
		}
		set.add(s.provider);
	}
	return rows.filter((o) => {
		const hasOrder = byOrder.has(o.id) || (o.order_number ? byOrder.has(o.order_number) : false);
		if (courier === "none") return !hasOrder;
		const provs1 = byOrder.get(o.id);
		const provs2 = o.order_number ? byOrder.get(o.order_number) : void 0;
		return (provs1?.has(courier) || provs2?.has(courier)) ?? false;
	});
}
/** How many filters (excluding search & per-page) differ from the defaults. */
function activeFilterCount(f) {
	let n = 0;
	if (f.reseller) n += 1;
	if (f.supplier) n += 1;
	if (f.area) n += 1;
	if (f.courier) n += 1;
	if (f.datePreset !== "lifetime") n += 1;
	if (f.sort !== "newest") n += 1;
	return n;
}
function Select({ label, value, onChange, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-0 flex-col gap-1 " + className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring",
			children
		})]
	});
}
/**
* Global order filter bar. Used by both SA admin and reseller order pages so
* the UI/behaviour stays identical everywhere.
*/
function OrderFilterBar({ value, onChange, resellerOptions, total, shown, right, showPerPage = false, hideSearch = false, variant = "default", trailing }) {
	const set = (patch) => onChange({
		...value,
		...patch
	});
	const dirty = (0, import_react.useMemo)(() => activeFilterCount(value) > 0 || !hideSearch && value.q !== "", [value, hideSearch]);
	const isReport = variant === "report";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card mb-4 space-y-3 p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 lg:flex-row lg:items-end",
				children: [
					!hideSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `relative min-w-0 lg:pb-[1px] ${isReport ? "lg:w-[40%]" : "flex-1"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: value.q,
								onChange: (e) => set({ q: e.target.value }),
								placeholder: "Order no, customer name, phone, address…",
								className: "h-9 w-full rounded-md border bg-background pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring"
							}),
							value.q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => set({ q: "" }),
								className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `grid grid-cols-2 gap-2 lg:flex lg:shrink-0 lg:items-end ${isReport ? "lg:w-[60%]" : "lg:flex-1 lg:justify-end"} ${hideSearch ? "w-full" : ""}`,
						children: [
							resellerOptions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
								label: "Reseller",
								options: resellerOptions.map((r) => ({
									value: r.value,
									label: r.label
								})),
								value: value.reseller,
								onChange: (v) => set({ reseller: v }),
								placeholder: "All resellers",
								searchPlaceholder: "Search reseller…",
								className: isReport ? "lg:w-[130px]" : "lg:w-[150px]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Date",
								value: value.datePreset,
								className: isReport ? "lg:w-[130px]" : "lg:w-[150px]",
								onChange: (v) => set(v === "custom" ? { datePreset: "custom" } : {
									datePreset: v,
									from: "",
									to: ""
								}),
								children: DATE_PRESET_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o.value,
									children: o.label
								}, o.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Area",
								value: value.area,
								className: isReport ? "lg:w-[130px]" : "lg:w-[150px]",
								onChange: (v) => set({ area: v }),
								children: AREA_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o.value,
									children: o.label
								}, o.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Courier",
								value: value.courier,
								className: isReport ? "lg:w-[130px]" : "lg:w-[150px]",
								onChange: (v) => set({ courier: v }),
								children: COURIER_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o.value,
									children: o.label
								}, o.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Sort",
								value: value.sort,
								className: isReport ? "lg:w-[130px]" : "lg:w-[150px]",
								onChange: (v) => set({ sort: v }),
								children: SORT_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: o.value,
									children: o.label
								}, o.value))
							}),
							trailing,
							showPerPage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								label: "Per page",
								value: String(value.perPage),
								className: isReport ? "lg:w-[70px]" : "lg:w-[80px]",
								onChange: (v) => set({ perPage: Number(v) }),
								children: [[
									10,
									20,
									50,
									100
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: n,
									children: n
								}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: -1,
									children: "All"
								})]
							})
						]
					}),
					right
				]
			}),
			value.datePreset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 rounded-md border border-dashed p-2 sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3 w-3" }), " From"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: value.from,
						max: value.to || void 0,
						onChange: (e) => set({ from: e.target.value }),
						className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3 w-3" }), " To"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: value.to,
						min: value.from || void 0,
						onChange: (e) => set({ to: e.target.value }),
						className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
						shown,
						" of ",
						total,
						" order",
						total === 1 ? "" : "s"
					]
				}), dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange({
						...DEFAULT_ORDER_FILTERS,
						perPage: value.perPage,
						q: hideSearch ? value.q : ""
					}),
					className: "rounded-md border px-2 py-1 hover:bg-accent",
					children: "Reset filters"
				})]
			})
		]
	});
}
//#endregion
export { OrderFilterBar as a, filterByCourier as c, DEFAULT_ORDER_FILTERS as i, resolveDateRange as l, COURIER_FILTER_OPTIONS as n, activeFilterCount as o, DATE_PRESET_OPTIONS as r, applyOrderFilters as s, AREA_FILTER_OPTIONS as t };
