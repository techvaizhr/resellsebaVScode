import { n as ORDER_TABS, u as orderStatusTone } from "./courier-status-BxiQVHJB.js";
import { r as bdt, t as PROFIT_FORMULA_HINT } from "./finance-report-Dwy2dA23.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/report-blocks.tsx
/** Shared money table shell so every report block looks identical. */
function ReportCard({ title, hint, right, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "surface-card mb-6 overflow-hidden border-none shadow-elegant",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex flex-wrap items-center gap-2 border-b bg-muted/20 px-5 py-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xs font-black uppercase tracking-widest text-muted-foreground",
				children: title
			}), hint && /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-[11px] font-medium text-muted-foreground/60",
				children: hint
			})] }), /* @__PURE__ */ jsx("div", {
				className: "ml-auto flex items-center gap-2",
				children: right
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto",
			children
		})]
	});
}
/** Shared section-tab strip for report pages (keeps long reports out of one scroll). */
function ReportTabs({ tabs, active, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "surface-card mb-6 overflow-x-auto p-1.5",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex min-w-max items-center gap-1",
			children: tabs.map((t) => {
				const on = t.key === active;
				return /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => onChange(t.key),
					title: t.hint,
					className: "rounded-lg px-3 py-2 text-xs font-medium transition-colors " + (on ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"),
					children: t.label
				}, t.key);
			})
		})
	});
}
var th = "px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground";
/** Status-tab wise money breakdown — same buckets as the order list tabs. */
function StatusReportTable({ report, showAdminCost = true }) {
	const rows = ORDER_TABS.filter((t) => t.key !== "all").map((t) => ({
		key: t.key,
		label: t.label,
		b: report.byStatusTab[t.key]
	}));
	return /* @__PURE__ */ jsxs("table", {
		className: "w-full text-sm " + (showAdminCost ? "min-w-[900px]" : "min-w-[780px]"),
		children: [
			/* @__PURE__ */ jsx("thead", {
				className: "bg-muted/20 text-center",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: th,
						children: "Status"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						children: "Orders"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						children: "Sell value"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						title: "Money the courier actually collected",
						children: "Received"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						title: "Order value that was never collected (partial / failed delivery)",
						children: "Not received"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						children: "Delivery"
					}),
					showAdminCost && /* @__PURE__ */ jsx("th", {
						className: th,
						children: "Product cost"
					}),
					showAdminCost && /* @__PURE__ */ jsx("th", {
						className: th,
						children: "Packaging cost"
					}),
					/* @__PURE__ */ jsx("th", {
						className: th,
						title: PROFIT_FORMULA_HINT,
						children: "Profit / loss"
					})
				] })
			}),
			/* @__PURE__ */ jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
				className: "border-t",
				children: [
					/* @__PURE__ */ jsxs("td", {
						className: "px-2 py-2 text-center",
						children: [/* @__PURE__ */ jsx("span", {
							className: "rounded-full px-2 py-0.5 text-[11px] capitalize " + orderStatusTone(statusOfTab(r.key)),
							children: r.label
						}), r.b.partialOrders > 0 && /* @__PURE__ */ jsxs("span", {
							className: "ml-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600",
							children: [r.b.partialOrders, " partial"]
						})]
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: r.b.orders
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: bdt(r.b.gross)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums",
						children: bdt(r.b.received)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums text-destructive",
						children: r.b.shortfall ? `−${bdt(r.b.shortfall)}` : "—"
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center text-muted-foreground",
						children: bdt(r.b.delivery)
					}),
					showAdminCost && /* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums",
						children: bdt(r.b.adminCost - r.b.packaging)
					}),
					showAdminCost && /* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums text-violet-500",
						children: bdt(r.b.packaging)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center font-medium " + toneOf(r.b.profit),
						children: bdt(r.b.profit)
					})
				]
			}, r.key)) }),
			/* @__PURE__ */ jsx("tfoot", {
				className: "border-t bg-muted/30 font-medium",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: "Total"
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: report.all.orders
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: bdt(report.all.gross)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: bdt(report.all.received)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center text-destructive",
						children: report.all.shortfall ? `−${bdt(report.all.shortfall)}` : "—"
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center",
						children: bdt(report.all.delivery)
					}),
					showAdminCost && /* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums",
						children: bdt(report.all.adminCost - report.all.packaging)
					}),
					showAdminCost && /* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center tabular-nums text-violet-500",
						children: bdt(report.all.packaging)
					}),
					/* @__PURE__ */ jsx("td", {
						className: "px-2 py-2 text-center " + toneOf(report.all.profit),
						children: bdt(report.all.profit)
					})
				] })
			})
		]
	});
}
/** Green for profit, red for loss. */
function toneOf(v) {
	return v < 0 ? "text-destructive" : v > 0 ? "text-success" : "";
}
function statusOfTab(key) {
	return ORDER_TABS.find((x) => x.key === key)?.statuses[0] ?? "pending";
}
/** Product-wise profit report. */
function ProductReportTable({ products, limit, showCost = true }) {
	const rows = limit ? products.slice(0, limit) : products;
	return /* @__PURE__ */ jsxs("table", {
		className: "w-full min-w-[860px] text-sm",
		children: [/* @__PURE__ */ jsx("thead", {
			className: "bg-muted/20 text-center",
			children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Product"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Orders"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Qty"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Delivered qty"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					title: "Quantity in returned / cancelled orders",
					children: "Lost qty"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Sell value"
				}),
				showCost && /* @__PURE__ */ jsx("th", {
					className: th,
					children: "Cost"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Profit"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					title: "Delivered profit minus not-received amount and failed-delivery loss share",
					children: "Settled net"
				})
			] })
		}), /* @__PURE__ */ jsxs("tbody", { children: [rows.map((p) => /* @__PURE__ */ jsxs("tr", {
			className: "border-t",
			children: [
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center font-medium",
					children: p.name
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center text-muted-foreground",
					children: p.orders
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center",
					children: p.qty
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center text-muted-foreground",
					children: p.deliveredQty
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center text-muted-foreground",
					children: p.lostQty || "—"
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center",
					children: bdt(p.gross)
				}),
				showCost && /* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center text-muted-foreground",
					children: bdt(p.cost)
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center",
					children: bdt(p.profit)
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center font-semibold " + toneOf(p.deliveredProfit),
					children: bdt(p.deliveredProfit)
				})
			]
		}, p.key)), rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
			colSpan: 9,
			className: "px-2 py-8 text-center text-muted-foreground",
			children: "No products match this filter."
		}) })] })]
	});
}
/** Day/month trend report. */
function TrendReportTable({ trend, limit = 30 }) {
	const rows = trend.slice(0, limit);
	return /* @__PURE__ */ jsxs("table", {
		className: "w-full min-w-[640px] text-sm",
		children: [/* @__PURE__ */ jsx("thead", {
			className: "bg-muted/20 text-center",
			children: /* @__PURE__ */ jsxs("tr", { children: [
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Period"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Orders"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Sell value"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Received"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					children: "Profit"
				}),
				/* @__PURE__ */ jsx("th", {
					className: th,
					title: "Delivered/partial profit minus failed-delivery loss",
					children: "Settled net"
				})
			] })
		}), /* @__PURE__ */ jsxs("tbody", { children: [rows.map((t) => /* @__PURE__ */ jsxs("tr", {
			className: "border-t",
			children: [
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center font-mono text-xs",
					children: t.key
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center",
					children: t.orders
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center",
					children: bdt(t.gross)
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center tabular-nums",
					children: bdt(t.received)
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center " + toneOf(t.profit),
					children: bdt(t.profit)
				}),
				/* @__PURE__ */ jsx("td", {
					className: "px-2 py-2 text-center font-medium " + toneOf(t.deliveredProfit),
					children: bdt(t.deliveredProfit)
				})
			]
		}, t.key)), rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
			colSpan: 6,
			className: "px-2 py-8 text-center text-muted-foreground",
			children: "No data available."
		}) })] })]
	});
}
/** Sortable table header cell — click to toggle asc/desc, arrow shows direction. */
function SortTh({ label, sortKey, active, dir, onSort, hint, align = "center" }) {
	const on = active === sortKey;
	return /* @__PURE__ */ jsx("th", {
		className: "px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground " + (align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"),
		title: hint,
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort(sortKey),
			className: "inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground " + (on ? "text-primary" : ""),
			children: [/* @__PURE__ */ jsx("span", { children: label }), /* @__PURE__ */ jsx("span", {
				className: "text-[9px] leading-none",
				children: on ? dir === "asc" ? "▲" : "▼" : "↕"
			})]
		})
	});
}
//#endregion
export { StatusReportTable as a, SortTh as i, ReportCard as n, TrendReportTable as o, ReportTabs as r, toneOf as s, ProductReportTable as t };
