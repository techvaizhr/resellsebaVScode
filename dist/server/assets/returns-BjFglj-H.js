import { n as PageHeader, r as StatCard } from "./ui-kit-D-uo76H8.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-CeUzA8ah.js";
import { c as orderStatusLabel, l as receiveSupplierReturns, n as bdtNum } from "./supplier-BI6E4snM.js";
import { t as StatusTabs } from "./status-tabs-CgmdNN1k.js";
import { n as useSupplier } from "./supplier-context-C2IdSO3T.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ImageIcon, PackageCheck } from "lucide-react";
//#region src/routes/_authenticated/supplier/returns.tsx?tsr-split=component
function SupplierReturnsPage() {
	const { data, reload } = useSupplier();
	const [tab, setTab] = useState("all");
	const [sel, setSel] = useState([]);
	const [busy, setBusy] = useState(false);
	const rows = useMemo(() => tab === "all" ? data.returns : data.returns.filter((r) => r.status === tab), [data.returns, tab]);
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
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Returns",
			description: "Returned items — once handed over by admin, they will show as 'Handed over' here."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Total returned",
					value: bdtNum(sum(data.returns)),
					hint: `${data.returns.length} items`,
					tone: "rose"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Waiting handover",
					value: bdtNum(sum(pending)),
					hint: `${pending.length} items`,
					tone: "amber"
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Handed over",
					value: bdtNum(sum(handed)),
					hint: `${handed.length} items`,
					tone: "emerald"
				})
			]
		}),
		/* @__PURE__ */ jsx(StatusTabs, {
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
		sel.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2",
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: "text-xs font-semibold",
					children: [sel.length, " selected"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => receive(sel),
					disabled: busy,
					className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
					children: [/* @__PURE__ */ jsx(PackageCheck, { className: "h-3.5 w-3.5" }), " Receive returns"]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => setSel([]),
					className: "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent",
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "surface-card p-4",
			children: rows.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground",
				children: "No returns found."
			}) : /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-md border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/40 text-left uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-2 w-8",
								children: /* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: allSelected,
									disabled: selectable.length === 0,
									onChange: (e) => setSel(e.target.checked ? selectable.map((r) => r.id) : []),
									className: "h-3.5 w-3.5 align-middle"
								})
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-2",
								children: "Updated"
							}),
							/* @__PURE__ */ jsx("th", { children: "Order" }),
							/* @__PURE__ */ jsx("th", { children: "Product" }),
							/* @__PURE__ */ jsx("th", { children: "Qty" }),
							/* @__PURE__ */ jsx("th", { children: "Value" }),
							/* @__PURE__ */ jsx("th", { children: "Order status" }),
							/* @__PURE__ */ jsx("th", { children: "Handover" }),
							/* @__PURE__ */ jsx("th", {
								className: "p-2 text-right",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: rows.map((r) => {
						const done = r.status === "handed_over";
						return /* @__PURE__ */ jsxs("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "p-2",
									children: !done && /* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: sel.includes(r.id),
										onChange: (e) => setSel((p) => e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)),
										className: "h-3.5 w-3.5 align-middle"
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "p-2 whitespace-nowrap",
									children: [new Date(r.updated_at ?? r.created_at).toLocaleDateString(), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground",
										children: new Date(r.updated_at ?? r.created_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "font-medium",
									children: /* @__PURE__ */ jsx(CopyOrderNumber, { orderNumber: r.order_number })
								}),
								/* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [r.product_image ? /* @__PURE__ */ jsx("img", {
										src: r.product_image,
										alt: r.product_name,
										loading: "lazy",
										className: "h-9 w-9 shrink-0 rounded-md border object-cover"
									}) : /* @__PURE__ */ jsx("div", {
										className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/40",
										children: /* @__PURE__ */ jsx(ImageIcon, { className: "h-4 w-4 text-muted-foreground" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: r.product_name
									})]
								}) }),
								/* @__PURE__ */ jsx("td", {
									className: "tabular-nums",
									children: r.quantity
								}),
								/* @__PURE__ */ jsx("td", {
									className: "font-semibold tabular-nums",
									children: bdtNum(Number(r.quantity) * Number(r.unit_price))
								}),
								/* @__PURE__ */ jsx("td", {
									className: "capitalize text-muted-foreground",
									children: orderStatusLabel(r.order_status)
								}),
								/* @__PURE__ */ jsx("td", { children: done ? /* @__PURE__ */ jsxs("span", {
									className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600",
									children: ["Received", r.handed_over_at ? ` · ${new Date(r.handed_over_at).toLocaleDateString()}` : ""]
								}) : /* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600",
									children: "Waiting"
								}) }),
								/* @__PURE__ */ jsx("td", {
									className: "p-2 text-right",
									children: !done && /* @__PURE__ */ jsxs("button", {
										onClick: () => receive([r.id]),
										disabled: busy,
										className: "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50",
										children: [/* @__PURE__ */ jsx(PackageCheck, { className: "h-3 w-3" }), " Receive"]
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
