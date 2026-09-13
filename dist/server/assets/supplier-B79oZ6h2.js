import { n as PageHeader, r as StatCard } from "./ui-kit-D-uo76H8.js";
import { n as ReportCard } from "./report-blocks-CRm2raRg.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-CeUzA8ah.js";
import { c as orderStatusLabel, n as bdtNum, p as supplierAvailable } from "./supplier-mecKsJzM.js";
import { n as useSupplier } from "./supplier-context-C2IdSO3T.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ClipboardList, Clock, Package, PackageCheck, TrendingUp, Undo2, Wallet } from "lucide-react";
//#region src/routes/_authenticated/supplier/index.tsx?tsr-split=component
function SupplierDashboard() {
	const { data } = useSupplier();
	const t = data.totals;
	const available = supplierAvailable(t);
	const recent = data.sold.slice(0, 8);
	const upcoming = data.upcoming.slice(0, 8);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: `Welcome, ${data.supplier?.display_name ?? "Supplier"}`,
			description: "All your delivered sales, returns, and payouts in one place.",
			actions: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/supplier/products",
					className: "inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:bg-muted active:scale-95",
					children: [/* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }), " My products"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/supplier/report",
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }), " Reports"]
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mb-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total earning",
						to: "/supplier/report",
						tone: "primary",
						value: bdtNum(t.earning),
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
						hint: "Delivered + kept items"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Available balance",
						to: "/supplier/payouts",
						tone: "emerald",
						value: bdtNum(available),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
						hint: "Ready to withdraw"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total paid",
						to: "/supplier/payouts",
						tone: "sky",
						value: bdtNum(t.paid),
						icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
						hint: `${bdtNum(t.pending_payout)} in request`
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "In progress",
						to: "/supplier/orders",
						tone: "amber",
						value: bdtNum(t.upcoming_amount),
						icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
						hint: `${t.upcoming_qty} pcs on the way`
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Sold (kept) qty",
						to: "/supplier/report",
						tone: "violet",
						value: t.sold_qty,
						icon: /* @__PURE__ */ jsx(PackageCheck, { className: "h-4 w-4" }),
						hint: "Delivered pieces"
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Returned value",
					to: "/supplier/returns",
					tone: "rose",
					value: bdtNum(t.returned_amount),
					icon: /* @__PURE__ */ jsx(Undo2, { className: "h-4 w-4" }),
					hint: `${t.returned_qty} pcs`
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Return to receive",
					to: "/supplier/returns",
					tone: "amber",
					value: t.returns_pending_handover,
					icon: /* @__PURE__ */ jsx(Undo2, { className: "h-4 w-4" }),
					hint: "Waiting for hand over"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Orders in pipeline",
					to: "/supplier/orders",
					tone: "sky",
					value: upcoming.length,
					icon: /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" }),
					hint: "Needs processing"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Pending payout",
					to: "/supplier/payouts",
					value: bdtNum(t.pending_payout),
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
					hint: "Awaiting admin approval"
				})
			]
		}),
		t.returns_pending_handover > 0 && /* @__PURE__ */ jsxs("div", {
			className: "mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm",
			children: [
				/* @__PURE__ */ jsx("b", { children: t.returns_pending_handover }),
				" return item(s) are waiting for you to hand over.",
				" ",
				/* @__PURE__ */ jsx(Link, {
					to: "/supplier/returns",
					className: "font-medium text-primary hover:underline",
					children: "View returns"
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ jsx(ReportCard, {
				title: "Recent sales",
				right: /* @__PURE__ */ jsxs(Link, {
					to: "/supplier/report",
					className: "inline-flex items-center gap-1.5 text-xs text-primary",
					children: [/* @__PURE__ */ jsx(Package, { className: "h-3.5 w-3.5" }), " Full report"]
				}),
				children: /* @__PURE__ */ jsx(ItemTable, {
					rows: recent,
					qtyKey: "kept_qty",
					empty: "No delivered sales yet."
				})
			}), /* @__PURE__ */ jsx(ReportCard, {
				title: "In progress orders",
				right: /* @__PURE__ */ jsxs(Link, {
					to: "/supplier/orders",
					className: "inline-flex items-center gap-1.5 text-xs text-primary",
					children: [/* @__PURE__ */ jsx(ClipboardList, { className: "h-3.5 w-3.5" }), " All orders"]
				}),
				children: /* @__PURE__ */ jsx(ItemTable, {
					rows: upcoming,
					qtyKey: "quantity",
					empty: "No orders in the pipeline."
				})
			})]
		})
	] });
}
function ItemTable({ rows, qtyKey, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "p-8 text-center text-xs text-muted-foreground",
		children: empty
	});
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "bg-muted/40 text-left uppercase text-muted-foreground",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Order"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Product"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Qty"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Unit"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Total"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "p-2",
						children: "Status"
					})
				] })
			}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => {
				const qty = r[qtyKey];
				return /* @__PURE__ */ jsxs("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "p-2 font-medium",
							children: /* @__PURE__ */ jsx(CopyOrderNumber, { orderNumber: r.order_number })
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 text-muted-foreground",
							children: r.product_name
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 tabular-nums",
							children: qty
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 tabular-nums",
							children: bdtNum(r.unit_price)
						}),
						/* @__PURE__ */ jsx("td", {
							className: "p-2 font-semibold tabular-nums",
							children: bdtNum(qty * r.unit_price)
						}),
						/* @__PURE__ */ jsx("td", {
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
