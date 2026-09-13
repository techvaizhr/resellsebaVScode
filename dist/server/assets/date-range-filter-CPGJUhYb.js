import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { i as DEFAULT_ORDER_FILTERS, l as resolveDateRange, r as DATE_PRESET_OPTIONS } from "./order-filters-D_b5vi6K.js";
//#region src/components/date-range-filter.tsx
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_DATE_RANGE = {
	preset: "last30",
	from: "",
	to: ""
};
/** Same preset math as the order filter bar — single source of truth. */
function resolveRange(v) {
	return resolveDateRange({
		...DEFAULT_ORDER_FILTERS,
		datePreset: v.preset,
		from: v.from,
		to: v.to
	});
}
function inRange(createdAt, v) {
	const { fromTs, toTs } = resolveRange(v);
	const ts = new Date(createdAt).getTime();
	if (fromTs != null && ts < fromTs) return false;
	if (toTs != null && ts > toTs) return false;
	return true;
}
var fmt = (ts) => new Date(ts).toLocaleDateString("en-GB", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
function rangeLabel(v) {
	const { fromTs, toTs } = resolveRange(v);
	if (fromTs == null && toTs == null) return "Life time";
	if (fromTs != null && toTs != null) {
		const a = fmt(fromTs);
		const b = fmt(toTs);
		return a === b ? a : `${a} → ${b}`;
	}
	return fromTs != null ? `From ${fmt(fromTs)}` : `Until ${fmt(toTs)}`;
}
/** Compact dropdown-only date filter — no label, icon, or resolved range text. */
function DateRangeBar({ value, onChange, right, note, label = "Date filter", compact = false }) {
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center justify-end gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: value.preset,
				onChange: (e) => {
					const p = e.target.value;
					onChange(p === "custom" ? {
						...value,
						preset: "custom"
					} : {
						preset: p,
						from: "",
						to: ""
					});
				},
				className: "h-9 w-44 rounded-lg border bg-background px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring",
				"aria-label": label,
				children: DATE_PRESET_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: o.value,
					children: o.label
				}, o.value))
			}),
			value.preset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: value.from,
					max: value.to || void 0,
					onChange: (e) => onChange({
						...value,
						from: e.target.value
					}),
					className: "h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "→"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: value.to,
					min: value.from || void 0,
					onChange: (e) => onChange({
						...value,
						to: e.target.value
					}),
					className: "h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				})
			] }),
			right
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card mb-6 p-3 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: value.preset,
					onChange: (e) => {
						const p = e.target.value;
						onChange(p === "custom" ? {
							...value,
							preset: "custom"
						} : {
							preset: p,
							from: "",
							to: ""
						});
					},
					className: "h-9 w-56 rounded-lg border bg-background px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-ring",
					"aria-label": label,
					children: DATE_PRESET_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: o.value,
						children: o.label
					}, o.value))
				}),
				value.preset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: value.from,
						max: value.to || void 0,
						onChange: (e) => onChange({
							...value,
							from: e.target.value
						}),
						className: "h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: value.to,
						min: value.from || void 0,
						onChange: (e) => onChange({
							...value,
							to: e.target.value
						}),
						className: "h-9 rounded-lg border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto flex items-center gap-2",
					children: right
				})
			]
		}), note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[11px] text-muted-foreground",
			children: note
		})]
	});
}
//#endregion
export { resolveRange as a, rangeLabel as i, DateRangeBar as n, inRange as r, DEFAULT_DATE_RANGE as t };
