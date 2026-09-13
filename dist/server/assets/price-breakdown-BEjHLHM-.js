import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { f as resolveDelivery, l as globalDelivery, p as resolvedCharge, r as areaLabel } from "./delivery-DY_nRbFK.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
//#region src/components/price-breakdown.tsx
var import_jsx_runtime = require_jsx_runtime();
/** One line of a per-unit money breakdown. Used by product create/edit and reseller catalog. */
function CalcRow({ label, value, strong, tone, muted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between py-1 " + (strong ? "border-t pt-2 font-semibold" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: muted ? "text-xs text-muted-foreground" : "text-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm tabular-nums " + (tone === "success" ? "text-success " : tone === "danger" ? "text-destructive " : "") + (strong ? "font-semibold" : ""),
			children: value
		})]
	});
}
function CalcPanel({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-muted/30 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
				children: title
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: hint
			})]
		}), children]
	});
}
/** Merge product delivery config over the global rule. */
function resolved(i) {
	return resolveDelivery({
		delivery_mode: i.deliveryMode,
		delivery_flat: i.deliveryFlat,
		delivery_inside: i.deliveryInside,
		delivery_outside: i.deliveryOutside,
		delivery_sub: i.deliverySub ?? null
	}, globalDelivery());
}
function productCalc(i) {
	const r = resolved(i);
	const dIn = resolvedCharge(r, "inside_dhaka");
	const dSub = resolvedCharge(r, "sub_dhaka");
	const dOut = resolvedCharge(r, "outside_dhaka");
	const resellerCost = i.resellerPrice + i.packaging;
	return {
		mode: r.mode,
		source: r.source,
		dIn,
		dSub,
		dOut,
		adminProfit: i.resellerPrice - i.buying,
		adminReceives: resellerCost,
		resellerCost,
		minSell: resellerCost,
		resellerProfit: i.sellPrice - resellerCost,
		customerInside: i.sellPrice + dIn,
		customerSub: i.sellPrice + dSub,
		customerOutside: i.sellPrice + dOut,
		margin: i.sellPrice > 0 ? (i.sellPrice - resellerCost) / i.sellPrice * 100 : 0
	};
}
function deliveryLabel(i, c) {
	const tag = c.source === "global" ? " · global rule" : "";
	if (c.mode === "free") return `Free shipping (customer pays ৳0)${tag}`;
	if (c.mode === "flat") return `Flat ${bdt(c.dIn)} (all areas)${tag}`;
	if (c.mode === "custom") return `Custom ${bdt(c.dIn)} (editable per order)${tag}`;
	return `${areaLabel("inside_dhaka")} ${bdt(c.dIn)} · ${areaLabel("sub_dhaka")} ${bdt(c.dSub)} · ${areaLabel("outside_dhaka")} ${bdt(c.dOut)}${tag}`;
}
/** Admin-side + reseller-side calculation, side by side. Shown on product create/edit. */
function AdminProductCalc({ input }) {
	const c = productCalc(input);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalcPanel, {
			title: "Admin calculation",
			hint: "Per unit, on a delivered order",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "Reseller price (charged to reseller)",
					value: bdt(input.resellerPrice)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "− Buying price",
					value: bdt(input.buying),
					muted: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "Admin profit / unit",
					value: bdt(c.adminProfit),
					strong: true,
					tone: c.adminProfit >= 0 ? "success" : "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 border-t pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: "+ Packaging collected",
							value: bdt(input.packaging),
							muted: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: "Admin receives / unit",
							value: bdt(c.adminReceives)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: "Delivery charge",
							value: deliveryLabel(input, c),
							muted: true
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalcPanel, {
			title: "Reseller calculation",
			hint: "Product + packaging is the reseller cost",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "Product price",
					value: bdt(input.resellerPrice)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "+ Packaging",
					value: bdt(input.packaging),
					muted: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
					label: "Reseller cost / minimum sell",
					value: bdt(c.minSell),
					strong: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 border-t pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: `Sell price ${bdt(input.sellPrice)} → profit`,
							value: bdt(c.resellerProfit),
							tone: c.resellerProfit >= 0 ? "success" : "danger",
							strong: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: "Margin",
							value: `${c.margin.toFixed(1)}%`,
							muted: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: `Customer pays (${areaLabel("inside_dhaka")})`,
							value: bdt(c.customerInside),
							muted: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: `Customer pays (${areaLabel("sub_dhaka")})`,
							value: bdt(c.customerSub),
							muted: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
							label: `Customer pays (${areaLabel("outside_dhaka")})`,
							value: bdt(c.customerOutside),
							muted: true
						})
					]
				})
			]
		})]
	});
}
/** Reseller-only view — never exposes admin buying price. */
function ResellerProductCalc({ input }) {
	const c = productCalc(input);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalcPanel, {
		title: "Your calculation",
		hint: "Per unit, on a delivered order",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
				label: "Product price (paid to admin)",
				value: bdt(input.resellerPrice)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
				label: "+ Packaging (paid to admin)",
				value: bdt(input.packaging),
				muted: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
				label: "Your cost / minimum sell",
				value: bdt(c.minSell),
				strong: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 border-t pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: `Your sell price ${bdt(input.sellPrice)} → profit`,
						value: bdt(c.resellerProfit),
						strong: true,
						tone: c.resellerProfit >= 0 ? "success" : "danger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: "Margin",
						value: `${c.margin.toFixed(1)}%`,
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: "Delivery (collected from customer)",
						value: deliveryLabel(input, c),
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: `Customer pays (${areaLabel("inside_dhaka")})`,
						value: bdt(c.customerInside),
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: `Customer pays (${areaLabel("sub_dhaka")})`,
						value: bdt(c.customerSub),
						muted: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
						label: `Customer pays (${areaLabel("outside_dhaka")})`,
						value: bdt(c.customerOutside),
						muted: true
					})
				]
			})
		]
	});
}
//#endregion
export { ResellerProductCalc as i, CalcPanel as n, CalcRow as r, AdminProductCalc as t };
