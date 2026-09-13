import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, U as Search } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { c as orderStatusLabel, n as bdtNum, s as loadSupplierReport } from "./supplier-Dj490J4B.js";
import { t as StatusTabs } from "./status-tabs-D7uTuby3.js";
import { n as SupplierProductBreakdown, t as SupplierMoneyFlow } from "./supplier-report-summary-B--iCZ8g.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/routes/_authenticated/supplier/report.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function SupplierReportPage() {
	const { data: base } = useSupplier();
	const [data, setData] = (0, import_react.useState)(base);
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("products");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function applyFilter() {
		setBusy(true);
		try {
			const res = await loadSupplierReport(null, from || null, to || null);
			if (res) setData(res);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Report load failed");
		} finally {
			setBusy(false);
		}
	}
	const rows = (0, import_react.useMemo)(() => {
		const list = tab === "upcoming" ? data.upcoming : data.sold;
		const needle = q.trim().toLowerCase();
		if (!needle) return list;
		return list.filter((r) => r.product_name.toLowerCase().includes(needle) || String(r.order_number).toLowerCase().includes(needle));
	}, [
		data,
		tab,
		q
	]);
	const t = data.totals;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Sales report",
			description: "Accounting of delivered (kept) items — this is your due earning."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Supplied value",
					value: bdtNum(t.supplied_value),
					hint: `${t.supplied_qty} pcs`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Sold qty",
					value: t.sold_qty,
					tone: "sky"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Earning",
					value: bdtNum(t.earning),
					tone: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In progress",
					value: bdtNum(t.upcoming_amount),
					hint: `${t.upcoming_qty} pcs`,
					tone: "amber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Returned",
					value: bdtNum(t.returned_amount),
					hint: `${t.returned_qty} pcs`,
					tone: "rose"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierMoneyFlow, { totals: t })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mb-4 grid gap-3 p-4 sm:grid-cols-[repeat(3,1fr)_auto]",
			children: [
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Order / product",
					className: inp
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: applyFilter,
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), " Apply"]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
			tabs: [
				{
					key: "products",
					label: "Product-wise"
				},
				{
					key: "sold",
					label: "Sold"
				},
				{
					key: "upcoming",
					label: "In progress"
				}
			],
			tab,
			onChange: (k) => setTab(k),
			count: (k) => k === "products" ? data.products.length : k === "sold" ? data.sold.length : data.upcoming.length,
			className: "mb-3 w-full min-w-0"
		}),
		tab === "products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierProductBreakdown, { products: data.products }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card p-4",
			children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground",
				children: "No records found."
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
						const qty = tab === "sold" ? r.kept_qty : r.quantity;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
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
							]
						}, r.id);
					}) })]
				})
			})
		})
	] });
}
//#endregion
export { SupplierReportPage as component };
