import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Ln as Clock, Rn as ClipboardList, a as Wallet, g as TrendingUp, gt as PackageCheck, mt as Package, p as Undo2, qn as CircleCheck } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { n as ReportCard } from "./report-blocks-D0S7vpGP.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { c as orderStatusLabel, n as bdtNum, p as supplierAvailable } from "./supplier-DEkC81t8.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/routes/_authenticated/supplier/index.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function SupplierDashboard() {
	const { data } = useSupplier();
	const t = data.totals;
	const available = supplierAvailable(t);
	const recent = data.sold.slice(0, 8);
	const upcoming = data.upcoming.slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Welcome, ${data.supplier?.display_name ?? "Supplier"}`,
			description: "All your delivered sales, returns, and payouts in one place.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/supplier/products",
					className: "inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:bg-muted active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), " My products"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/supplier/report",
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), " Reports"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total earning",
						to: "/supplier/report",
						tone: "primary",
						value: bdtNum(t.earning),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						hint: "Delivered + kept items"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Available balance",
						to: "/supplier/payouts",
						tone: "emerald",
						value: bdtNum(available),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						hint: "Ready to withdraw"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total paid",
						to: "/supplier/payouts",
						tone: "sky",
						value: bdtNum(t.paid),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
						hint: `${bdtNum(t.pending_payout)} in request`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In progress",
						to: "/supplier/orders",
						tone: "amber",
						value: bdtNum(t.upcoming_amount),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
						hint: `${t.upcoming_qty} pcs on the way`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Sold (kept) qty",
						to: "/supplier/report",
						tone: "violet",
						value: t.sold_qty,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-4 w-4" }),
						hint: "Delivered pieces"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Returned value",
					to: "/supplier/returns",
					tone: "rose",
					value: bdtNum(t.returned_amount),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" }),
					hint: `${t.returned_qty} pcs`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Return to receive",
					to: "/supplier/returns",
					tone: "amber",
					value: t.returns_pending_handover,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" }),
					hint: "Waiting for hand over"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Orders in pipeline",
					to: "/supplier/orders",
					tone: "sky",
					value: upcoming.length,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4" }),
					hint: "Needs processing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending payout",
					to: "/supplier/payouts",
					value: bdtNum(t.pending_payout),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
					hint: "Awaiting admin approval"
				})
			]
		}),
		t.returns_pending_handover > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.returns_pending_handover }),
				" return item(s) are waiting for you to hand over.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/supplier/returns",
					className: "font-medium text-primary hover:underline",
					children: "View returns"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
				title: "Recent sales",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/supplier/report",
					className: "inline-flex items-center gap-1.5 text-xs text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), " Full report"]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemTable, {
					rows: recent,
					qtyKey: "kept_qty",
					empty: "No delivered sales yet."
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
				title: "In progress orders",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/supplier/orders",
					className: "inline-flex items-center gap-1.5 text-xs text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5" }), " All orders"]
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemTable, {
					rows: upcoming,
					qtyKey: "quantity",
					empty: "No orders in the pipeline."
				})
			})]
		})
	] });
}
function ItemTable({ rows, qtyKey, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-xs text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/40 text-left uppercase text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Product"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Qty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Unit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-2",
						children: "Status"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
				const qty = r[qtyKey];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, { orderNumber: r.order_number })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 text-muted-foreground",
							children: r.product_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 tabular-nums",
							children: qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 tabular-nums",
							children: bdtNum(r.unit_price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 font-semibold tabular-nums",
							children: bdtNum(qty * r.unit_price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 capitalize text-muted-foreground",
							children: orderStatusLabel(r.status)
						})
					]
				}, r.id);
			}) })]
		})
	});
}
//#endregion
export { SupplierDashboard as component };
