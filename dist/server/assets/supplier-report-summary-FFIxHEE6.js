import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Dn as Coins, Gt as Info, H as Search, Zt as Hourglass, a as Wallet, hr as ArrowRight, ht as PackageCheck, ir as Boxes, p as Undo2 } from "./vendor-icons-BWIzFOtW.js";
import { n as bdtNum } from "./supplier-CsU73uC9.js";
//#region src/components/supplier-report-summary.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var qtyLabel = (n) => `${Math.round(n).toLocaleString()} pcs`;
/** Money flow: supplied → delivered → returned → payable → paid → due. */
function SupplierMoneyFlow({ totals }) {
	const t = totals;
	const payable = t.earning;
	const due = Math.max(payable - t.paid - t.pending_payout, 0);
	const steps = [
		{
			key: "supplied",
			label: "Total product supplied",
			hint: `${qtyLabel(t.supplied_qty)} · all live orders`,
			value: bdtNum(t.supplied_value),
			accent: "text-primary",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" })
		},
		{
			key: "delivered",
			label: "Delivered (earned)",
			hint: `${qtyLabel(t.sold_qty)} · kept by customer`,
			value: bdtNum(t.earning),
			accent: "text-emerald-500",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-4 w-4" })
		},
		{
			key: "progress",
			label: "In progress (potential)",
			hint: `${qtyLabel(t.upcoming_qty)} · not settled yet`,
			value: bdtNum(t.upcoming_amount),
			accent: "text-amber-500",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hourglass, { className: "h-4 w-4" })
		},
		{
			key: "returned",
			label: "Returned (deducted)",
			hint: `${qtyLabel(t.returned_qty)} · ${qtyLabel(t.returns_received_qty)} received back`,
			value: `− ${bdtNum(t.returned_amount)}`,
			accent: "text-rose-500",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
		}
	];
	const ledger = [
		{
			label: "Payable on delivered items",
			value: bdtNum(payable),
			strong: true,
			accent: "text-foreground"
		},
		{
			label: "Already withdrawn (paid)",
			value: `− ${bdtNum(t.paid)}`,
			accent: "text-muted-foreground"
		},
		{
			label: "Withdraw request pending",
			value: `− ${bdtNum(t.pending_payout)}`,
			accent: "text-amber-600"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b bg-primary/10 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Full money flow"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-px bg-border sm:grid-cols-2",
					children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: s.accent,
									children: s.icon
								}), s.label]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mt-1 text-lg font-bold tabular-nums ${s.accent}`,
								children: s.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: s.hint
							})
						]
					}, s.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 border-t bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), "Every line uses the price saved at order time, so later price changes never rewrite old sales."]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card overflow-hidden p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b bg-primary/10 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Payout ledger"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y",
					children: ledger.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-2.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: l.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-semibold tabular-nums ${l.accent} ${l.strong ? "text-sm" : ""}`,
							children: l.value
						})]
					}, l.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 text-xs font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), " Payable now"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold tabular-nums",
						children: bdtNum(due)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-px bg-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "Returns received"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold tabular-nums",
							children: [
								t.returns_received_qty,
								" pcs · ",
								bdtNum(t.returns_received_amount)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card p-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "Returns to collect"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold tabular-nums text-rose-500",
							children: [
								t.returns_pending_qty,
								" pcs · ",
								bdtNum(t.returns_pending_amount)
							]
						})]
					})]
				})
			]
		})]
	});
}
/** Product × price breakdown — one row per price the product was sold at. */
function SupplierProductBreakdown({ products }) {
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return products;
		return products.filter((p) => p.product_name.toLowerCase().includes(needle));
	}, [products, q]);
	const sum = (0, import_react.useMemo)(() => rows.reduce((a, p) => ({
		supplied_qty: a.supplied_qty + p.supplied_qty,
		supplied_value: a.supplied_value + p.supplied_value,
		delivered_qty: a.delivered_qty + p.delivered_qty,
		delivered_value: a.delivered_value + p.delivered_value,
		pending_qty: a.pending_qty + p.pending_qty,
		pending_value: a.pending_value + p.pending_value,
		returned_qty: a.returned_qty + p.returned_qty,
		returned_value: a.returned_value + p.returned_value
	}), {
		supplied_qty: 0,
		supplied_value: 0,
		delivered_qty: 0,
		delivered_value: 0,
		pending_qty: 0,
		pending_value: 0,
		returned_qty: 0,
		returned_value: 0
	}), [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card overflow-hidden p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b bg-primary/10 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: "Product-wise supply & value"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Same product with a different price is listed separately, so old sales keep their old rate."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Product…",
					className: "w-56 rounded-md border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			})]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-8 text-center text-xs text-muted-foreground",
			children: "No product records in this range."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Unit price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Supplied"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Total value"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Delivered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Earned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "In progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Returned"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.product_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: [p.orders, " order(s)"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right tabular-nums",
									children: bdtNum(p.unit_price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right tabular-nums",
									children: p.supplied_qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right font-semibold tabular-nums",
									children: bdtNum(p.supplied_value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right tabular-nums text-emerald-600",
									children: p.delivered_qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right font-semibold tabular-nums text-emerald-600",
									children: bdtNum(p.delivered_value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2 text-right tabular-nums text-amber-600",
									children: [
										p.pending_qty,
										" · ",
										bdtNum(p.pending_value)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2 text-right tabular-nums text-rose-500",
									children: [
										p.returned_qty,
										" · ",
										bdtNum(p.returned_value)
									]
								})
							]
						}, `${p.product_name}-${p.unit_price}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-primary/10 font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "p-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums",
								children: sum.supplied_qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums",
								children: bdtNum(sum.supplied_value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums",
								children: sum.delivered_qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums text-emerald-600",
								children: bdtNum(sum.delivered_value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums text-amber-600",
								children: bdtNum(sum.pending_value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 text-right tabular-nums text-rose-500",
								children: bdtNum(sum.returned_value)
							})
						]
					}) })
				]
			})
		})]
	});
}
//#endregion
export { SupplierProductBreakdown as n, SupplierMoneyFlow as t };
