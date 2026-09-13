import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Jt as Image, gt as PackageCheck } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { c as orderStatusLabel, l as receiveSupplierReturns, n as bdtNum } from "./supplier-DNTiAzo8.js";
import { t as StatusTabs } from "./status-tabs-D7uTuby3.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/routes/_authenticated/supplier/returns.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupplierReturnsPage() {
	const { data, reload } = useSupplier();
	const [tab, setTab] = (0, import_react.useState)("all");
	const [sel, setSel] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const rows = (0, import_react.useMemo)(() => tab === "all" ? data.returns : data.returns.filter((r) => r.status === tab), [data.returns, tab]);
	const pending = data.returns.filter((r) => r.status === "pending_handover");
	const handed = data.returns.filter((r) => r.status === "handed_over");
	const sum = (list) => list.reduce((s, r) => s + Number(r.quantity) * Number(r.unit_price), 0);
	const selectable = rows.filter((r) => r.status !== "handed_over");
	const allSelected = selectable.length > 0 && selectable.every((r) => sel.includes(r.id));
	const receive = async (ids) => {
		if (!ids.length) return;
		setBusy(true);
		try {
			await receiveSupplierReturns(ids);
			toast.success(`${ids.length} return(s) received`);
			setSel([]);
			await reload();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Returns",
			description: "Returned items — once handed over by admin, they will show as 'Handed over' here."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total returned",
					value: bdtNum(sum(data.returns)),
					hint: `${data.returns.length} items`,
					tone: "rose"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Waiting handover",
					value: bdtNum(sum(pending)),
					hint: `${pending.length} items`,
					tone: "amber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Handed over",
					value: bdtNum(sum(handed)),
					hint: `${handed.length} items`,
					tone: "emerald"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTabs, {
			tabs: [
				{
					key: "all",
					label: "All"
				},
				{
					key: "pending_handover",
					label: "Waiting"
				},
				{
					key: "handed_over",
					label: "Handed over"
				}
			],
			tab,
			onChange: (k) => setTab(k),
			count: (k) => k === "all" ? data.returns.length : k === "pending_handover" ? pending.length : handed.length,
			className: "mb-3 w-full min-w-0"
		}),
		sel.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold",
					children: [sel.length, " selected"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => receive(sel),
					disabled: busy,
					className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" }), " Receive returns"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSel([]),
					className: "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent",
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card p-4",
			children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground",
				children: "No returns found."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-md border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 w-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: allSelected,
									disabled: selectable.length === 0,
									onChange: (e) => setSel(e.target.checked ? selectable.map((r) => r.id) : []),
									className: "h-3.5 w-3.5 align-middle"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Updated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Value" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Handover" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 text-right",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
						const done = r.status === "handed_over";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2",
									children: !done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: sel.includes(r.id),
										onChange: (e) => setSel((p) => e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)),
										className: "h-3.5 w-3.5 align-middle"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-2 whitespace-nowrap",
									children: [new Date(r.updated_at ?? r.created_at).toLocaleDateString(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: new Date(r.updated_at ?? r.created_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, { orderNumber: r.order_number })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [r.product_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: r.product_image,
										alt: r.product_name,
										loading: "lazy",
										className: "h-9 w-9 shrink-0 rounded-md border object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-muted-foreground" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: r.product_name
									})]
								}) }),
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600",
									children: ["Received", r.handed_over_at ? ` · ${new Date(r.handed_over_at).toLocaleDateString()}` : ""]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600",
									children: "Waiting"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-2 text-right",
									children: !done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => receive([r.id]),
										disabled: busy,
										className: "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3 w-3" }), " Receive"]
									})
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
export { SupplierReturnsPage as component };
