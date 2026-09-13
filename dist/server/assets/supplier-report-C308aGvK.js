import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Dn as Download, Nt as LoaderCircle, U as Search, a as Wallet, g as TrendingUp, gt as PackageCheck, p as Undo2 } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { c as orderStatusLabel, i as loadAdminSupplierOverview, n as bdtNum, s as loadSupplierReport } from "./supplier-CmLddz-1.js";
import { n as SupplierProductBreakdown, t as SupplierMoneyFlow } from "./supplier-report-summary-BNzZNr2Y.js";
//#region src/routes/_authenticated/admin/supplier-report.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function csv(rows, name) {
	const body = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\n");
	const url = URL.createObjectURL(new Blob([body], { type: "text/csv;charset=utf-8;" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}
function AdminSupplierReportPage() {
	const [overview, setOverview] = (0, import_react.useState)(null);
	const [supplierId, setSupplierId] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("products");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setOverview(await loadAdminSupplierOverview(from || null, to || null));
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, [from, to]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (!supplierId) {
			setDetail(null);
			return;
		}
		setBusy(true);
		loadSupplierReport(supplierId, from || null, to || null).then((r) => setDetail(r)).catch((e) => toast.error(e instanceof Error ? e.message : "Load failed")).finally(() => setBusy(false));
	}, [
		supplierId,
		from,
		to
	]);
	const suppliers = overview?.suppliers ?? [];
	const totals = (0, import_react.useMemo)(() => ({
		earning: suppliers.reduce((s, r) => s + r.earning, 0),
		sold: suppliers.reduce((s, r) => s + r.sold_qty, 0),
		supplied: suppliers.reduce((s, r) => s + r.supplied_value, 0),
		suppliedQty: suppliers.reduce((s, r) => s + r.supplied_qty, 0),
		pending: suppliers.reduce((s, r) => s + r.pending_amount, 0),
		paid: suppliers.reduce((s, r) => s + r.paid, 0),
		returned: suppliers.reduce((s, r) => s + r.returned_amount, 0),
		due: suppliers.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0)
	}), [suppliers]);
	const needle = q.trim().toLowerCase();
	const listed = suppliers.filter((s) => !needle || s.display_name.toLowerCase().includes(needle) || s.code.toLowerCase().includes(needle));
	const rows = (0, import_react.useMemo)(() => {
		if (!detail) return [];
		if (tab === "sold") return detail.sold;
		if (tab === "upcoming") return detail.upcoming;
		return [];
	}, [detail, tab]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Supplier report",
			description: "Sales, returns, paid, and outstanding amounts per supplier."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Supplied value",
					value: bdtNum(totals.supplied),
					hint: `${totals.suppliedQty} pcs`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Sold qty",
					value: totals.sold,
					tone: "sky",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Supplier earning",
					value: bdtNum(totals.earning),
					tone: "emerald",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In progress",
					value: bdtNum(totals.pending),
					tone: "amber",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Returned value",
					value: bdtNum(totals.returned),
					tone: "rose",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Payable now",
					value: bdtNum(totals.due),
					tone: "violet",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mb-4 grid gap-3 p-4 sm:grid-cols-[repeat(4,1fr)_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Supplier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: supplierId,
					onChange: (e) => setSupplierId(e.target.value),
					className: inp,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All suppliers"
					}), suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: s.id,
						children: [
							s.display_name,
							" (",
							s.code,
							")"
						]
					}, s.id))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "From"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: from,
					onChange: (e) => setFrom(e.target.value),
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "To"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: to,
					onChange: (e) => setTo(e.target.value),
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Supplier…",
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring pl-8"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => csv(detail ? [[
							"Product",
							"Unit price",
							"Orders",
							"Supplied qty",
							"Supplied value",
							"Delivered qty",
							"Earned",
							"In progress qty",
							"In progress value",
							"Returned qty",
							"Returned value"
						], ...detail.products.map((p) => [
							p.product_name,
							p.unit_price,
							p.orders,
							p.supplied_qty,
							p.supplied_value,
							p.delivered_qty,
							p.delivered_value,
							p.pending_qty,
							p.pending_value,
							p.returned_qty,
							p.returned_value
						])] : [[
							"Supplier",
							"Code",
							"Supplied qty",
							"Supplied value",
							"Sold qty",
							"Earning",
							"In progress",
							"Returned qty",
							"Returned amount",
							"Paid",
							"Payable"
						], ...listed.map((s) => [
							s.display_name,
							s.code,
							s.supplied_qty,
							s.supplied_value,
							s.sold_qty,
							s.earning,
							s.pending_amount,
							s.returned_qty,
							s.returned_amount,
							s.paid,
							Math.max(s.earning - s.paid - s.pending_payout, 0)
						])], detail ? "supplier-products.csv" : "supplier-report.csv"),
						className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " CSV"]
					})
				})
			]
		}),
		!supplierId ? listed.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No suppliers",
			description: "No suppliers found."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card overflow-x-auto p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/40 text-left uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2",
							children: "Supplier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Products" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Supplied" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Supplied value" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sold qty" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Earning" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "In progress" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Returned" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Paid" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pending" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Payable" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: listed.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer hover:bg-muted/40",
						onClick: () => setSupplierId(s.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: s.display_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: s.code
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: s.products
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: s.supplied_qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: bdtNum(s.supplied_value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: s.sold_qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-semibold tabular-nums text-emerald-600",
								children: bdtNum(s.earning)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "tabular-nums text-amber-600",
								children: [
									s.pending_qty,
									" · ",
									bdtNum(s.pending_amount)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "tabular-nums text-muted-foreground",
								children: [
									s.returned_qty,
									" · ",
									bdtNum(s.returned_amount)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums",
								children: bdtNum(s.paid)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "tabular-nums text-amber-600",
								children: bdtNum(s.pending_payout)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-semibold tabular-nums text-primary",
								children: bdtNum(Math.max(s.earning - s.paid - s.pending_payout, 0))
							})
						]
					}, s.id))
				})]
			})
		}) : busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card p-4",
			children: [
				detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierMoneyFlow, { totals: detail.totals })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex flex-wrap gap-2",
					children: [
						"products",
						"sold",
						"upcoming",
						"returns"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(k),
						className: "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " + (tab === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
						children: k === "products" ? `Product-wise (${detail?.products.length ?? 0})` : k === "sold" ? `Sold (${detail?.sold.length ?? 0})` : k === "upcoming" ? `In progress (${detail?.upcoming.length ?? 0})` : `Returns (${detail?.returns.length ?? 0})`
					}, k))
				}),
				tab === "products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierProductBreakdown, { products: detail?.products ?? [] }) : tab === "returns" ? (detail?.returns.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No returns",
					description: "No returns."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-left uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Value" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Handover" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y",
							children: detail.returns.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 whitespace-nowrap",
									children: new Date(r.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, { orderNumber: r.order_number }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-muted-foreground",
									children: r.product_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "tabular-nums",
									children: r.quantity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-semibold tabular-nums",
									children: bdtNum(Number(r.quantity) * Number(r.unit_price))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "capitalize text-muted-foreground",
									children: orderStatusLabel(r.order_status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.status === "handed_over" ? "Handed over" : "Waiting" })
							] }, r.id))
						})]
					})
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No records",
					description: "No records match this filter."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-left uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-2",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit price" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Total" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y",
							children: rows.map((r) => {
								const qty = tab === "sold" ? r.kept_qty : r.quantity;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-2 whitespace-nowrap",
										children: new Date(r.created_at).toLocaleDateString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "font-medium",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, { orderNumber: r.order_number })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-muted-foreground",
										children: r.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: bdtNum(r.unit_price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "font-semibold tabular-nums",
										children: bdtNum(qty * r.unit_price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "capitalize text-muted-foreground",
										children: orderStatusLabel(r.status)
									})
								] }, r.id);
							})
						})]
					})
				})
			]
		})
	] });
}
//#endregion
export { AdminSupplierReportPage as component };
