import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { At as LogIn, Jt as Image, Nt as LoaderCircle, U as Search, er as ChevronDown, gt as PackageCheck, p as Undo2 } from "./vendor-icons-DF2A5Z8S.js";
import { c as Content2, d as Portal2, f as Root2, l as Description2, o as Action, p as Title2, s as Cancel, u as Overlay2 } from "./vendor-ui-C-fytv-F.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { r as useCan } from "./use-auth-CvmMJqkM.js";
import { n as buttonVariants } from "./button-Dqpngf5l.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { c as orderStatusLabel, i as loadAdminSupplierOverview, n as bdtNum, r as handoverSupplierReturns } from "./supplier-Dj490J4B.js";
import { a as startImpersonation } from "./impersonation-BQZW2L5w.js";
import { n as impersonateSupplier } from "./supplier-access.functions-BkYfpsR8.js";
//#region src/components/ui/alert-dialog.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
//#endregion
//#region src/routes/_authenticated/admin/supplier-returns.tsx?tsr-split=component
var TABS = [
	{
		key: "pending_handover",
		label: "Waiting handover"
	},
	{
		key: "handed_over",
		label: "Handed over"
	},
	{
		key: "all",
		label: "All"
	}
];
var value = (r) => Number(r.quantity) * Number(r.unit_price);
/** Group one supplier's return rows by order so multi-product orders stay together. */
function groupByOrder(rows) {
	const map = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const key = r.order_id;
		if (!map.has(key)) map.set(key, {
			order_id: key,
			order_number: r.order_number,
			rows: []
		});
		map.get(key).rows.push(r);
	}
	return [...map.values()];
}
function AdminSupplierReturnsPage() {
	useNavigate();
	const impersonateFn = useServerFn(impersonateSupplier);
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("pending_handover");
	const [q, setQ] = (0, import_react.useState)("");
	const [sel, setSel] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)([]);
	const [supplierFilter, setSupplierFilter] = (0, import_react.useState)("");
	const [undoTarget, setUndoTarget] = (0, import_react.useState)(null);
	const canManage = useCan()("suppliers.manage");
	const load = (0, import_react.useCallback)(async (silent = false) => {
		if (!silent) setLoading(true);
		try {
			setData(await loadAdminSupplierOverview());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const all = data?.returns ?? [];
	const needle = q.trim().toLowerCase();
	const rows = (0, import_react.useMemo)(() => all.filter((r) => (tab === "all" || r.status === tab) && (!supplierFilter || r.supplier_id === supplierFilter) && (!needle || r.order_number.toLowerCase().includes(needle) || r.product_name.toLowerCase().includes(needle) || (r.supplier_name ?? "").toLowerCase().includes(needle))), [
		all,
		tab,
		needle,
		supplierFilter
	]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const id = r.supplier_id ?? "unknown";
			if (!map.has(id)) map.set(id, {
				id,
				name: r.supplier_name ?? "Supplier",
				rows: []
			});
			map.get(id).rows.push(r);
		}
		return [...map.values()].sort((a, b) => b.rows.length - a.rows.length);
	}, [rows]);
	/** How many distinct suppliers have returns on each order (handover stays per supplier). */
	const supplierCountByOrder = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const r of all) {
			if (!m.has(r.order_id)) m.set(r.order_id, /* @__PURE__ */ new Set());
			m.get(r.order_id).add(r.supplier_id ?? "unknown");
		}
		return new Map([...m].map(([k, v]) => [k, v.size]));
	}, [all]);
	const supplierOptions = (0, import_react.useMemo)(() => {
		const seen = /* @__PURE__ */ new Map();
		for (const r of all) if (r.supplier_id) seen.set(r.supplier_id, r.supplier_name ?? "Supplier");
		return [{
			value: "",
			label: "All suppliers"
		}, ...[...seen].map(([value, label]) => ({
			value,
			label
		})).sort((a, b) => a.label.localeCompare(b.label))];
	}, [all]);
	const pending = all.filter((r) => r.status === "pending_handover");
	const handed = all.filter((r) => r.status === "handed_over");
	const sum = (list) => list.reduce((s, r) => s + value(r), 0);
	const act = async (ids, undo = false) => {
		if (!ids.length) return;
		setBusy(true);
		try {
			await handoverSupplierReturns(ids, undo);
			toast.success(undo ? `Handover of ${ids.length} item(s) cancelled — back to "Waiting handover"` : `${ids.length} item(s) handed over to the supplier`);
			setSel([]);
			await load(true);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	};
	const loginAs = async (supplierId, name) => {
		const s = data?.suppliers.find((x) => x.id === supplierId);
		const targetUserId = s?.user_id || s?.id || supplierId;
		if (!targetUserId) {
			toast.error("Could not find an account for this supplier");
			return;
		}
		setBusy(true);
		try {
			const res = await impersonateFn({ data: { userId: targetUserId } });
			if (!res?.accessToken) throw new Error("No session token returned");
			await startImpersonation({
				accessToken: res.accessToken,
				refreshToken: res.refreshToken || res.accessToken,
				label: name,
				returnTo: window.location.pathname + window.location.search
			});
			window.location.href = "/supplier/returns";
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not log in as supplier");
		} finally {
			setBusy(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Return handover",
			description: "Items returned per supplier — hand over in bulk or one at a time."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3",
			children: [
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Suppliers involved",
					value: groups.length,
					hint: "in current view",
					tone: "violet"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				TABS.map((t) => {
					const n = t.key === "all" ? all.length : t.key === "pending_handover" ? pending.length : handed.length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setTab(t.key);
							setSel([]);
						},
						className: "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " + (tab === t.key ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
						children: [
							t.label,
							" (",
							n,
							")"
						]
					}, t.key);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
					className: "ml-auto w-52",
					options: supplierOptions,
					value: supplierFilter,
					onChange: (v) => {
						setSupplierFilter(v);
						setSel([]);
					},
					placeholder: "All suppliers",
					searchPlaceholder: "Search supplier…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Order / product / supplier",
						className: "w-56 rounded-md border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring"
					})]
				})
			]
		}),
		canManage && sel.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold",
					children: [sel.length, " selected"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => act(sel),
					disabled: busy,
					className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" }), " Hand over"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setUndoTarget(sel),
					disabled: busy,
					className: "inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3.5 w-3.5" }), " Undo handover"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSel([]),
					className: "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent",
					children: "Clear"
				})
			]
		}),
		groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No returns",
			description: "No returns match this filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: groups.map((g) => {
				const gPending = g.rows.filter((r) => r.status !== "handed_over");
				const gSel = g.rows.filter((r) => sel.includes(r.id));
				const allSel = g.rows.length > 0 && g.rows.every((r) => sel.includes(r.id));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card overflow-hidden p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-b bg-muted/30 px-4 py-3",
						children: [
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: allSel,
								onChange: (e) => setSel((p) => e.target.checked ? [.../* @__PURE__ */ new Set([...p, ...g.rows.map((r) => r.id)])] : p.filter((id) => !g.rows.some((r) => r.id === id))),
								className: "h-3.5 w-3.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold",
									children: g.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										g.rows.length,
										" items · ",
										bdtNum(sum(g.rows)),
										gPending.length > 0 ? ` · ${gPending.length} waiting` : "",
										gSel.length > 0 ? ` · ${gSel.length} selected` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex flex-wrap gap-2",
								children: [canManage && gPending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => act(gPending.map((r) => r.id)),
									disabled: busy,
									className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" }),
										" Hand over all (",
										gPending.length,
										")"
									]
								}), canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => loginAs(g.id, g.name),
									disabled: busy,
									className: "inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-500/20 disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-3.5 w-3.5" }), " Login as supplier"]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y",
						children: groupByOrder(g.rows).map((ord) => {
							const key = g.id + ":" + ord.order_id;
							const expanded = open.includes(key) || ord.rows.length === 1;
							const shown = expanded ? ord.rows : ord.rows.slice(0, 1);
							const oPending = ord.rows.filter((r) => r.status !== "handed_over");
							const others = (supplierCountByOrder.get(ord.order_id) ?? 1) - 1;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 bg-muted/15 px-4 py-2",
								children: [
									canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: ord.rows.every((r) => sel.includes(r.id)),
										onChange: (e) => setSel((p) => e.target.checked ? [.../* @__PURE__ */ new Set([...p, ...ord.rows.map((r) => r.id)])] : p.filter((id) => !ord.rows.some((r) => r.id === id))),
										className: "h-3.5 w-3.5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, {
										orderNumber: ord.order_number,
										className: "text-xs font-semibold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-muted-foreground",
										children: [
											ord.rows.length,
											" product",
											ord.rows.length > 1 ? "s" : "",
											" · ",
											bdtNum(sum(ord.rows))
										]
									}),
									others > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-600",
										children: [
											"+",
											others,
											" other supplier",
											others > 1 ? "s" : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ml-auto flex items-center gap-2",
										children: [canManage && oPending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => act(oPending.map((r) => r.id)),
											disabled: busy,
											className: "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3 w-3" }),
												" Hand over (",
												oPending.length,
												")"
											]
										}), ord.rows.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setOpen((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]),
											className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 transition-transform " + (expanded ? "rotate-180" : "") }), expanded ? "Hide" : `+${ord.rows.length - 1} more`]
										})]
									})
								]
							}), shown.map((r) => {
								const done = r.status === "handed_over";
								const when = new Date(r.updated_at ?? r.created_at);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3 border-t px-4 py-2.5 pl-8",
									children: [
										canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: sel.includes(r.id),
											onChange: (e) => setSel((p) => e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)),
											className: "h-3.5 w-3.5"
										}),
										r.product_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: r.product_image,
											alt: r.product_name,
											loading: "lazy",
											className: "h-10 w-10 shrink-0 rounded-md border object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-muted-foreground" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs font-medium",
												children: r.product_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Qty ",
													r.quantity,
													" · ",
													orderStatusLabel(r.order_status)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: when.toLocaleDateString() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: when.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											}) })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-20 text-right text-xs font-semibold tabular-nums",
											children: bdtNum(value(r))
										}),
										!canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: done ? "Handed over" : "Waiting handover"
										}) : done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setUndoTarget([r.id]),
											disabled: busy,
											className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50",
											title: "Click to cancel the handover",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3 w-3" }), " Handed over"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => act([r.id]),
											disabled: busy,
											className: "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3 w-3" }), " Hand over"]
										})
									]
								}, r.id);
							})] }, key);
						})
					})]
				}, g.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: undoTarget !== null,
			onOpenChange: (o) => !o && setUndoTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "text-destructive",
				children: [
					"Cancel handover? (",
					undoTarget?.length ?? 0,
					" item(s))"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "These items are currently marked as handed over to the supplier. Cancelling will move them back to “Waiting handover” status and clear the Received status on the supplier's panel as well. Do not do this unless the product has not actually been returned physically. This only affects the selected items for this supplier." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "No, keep it" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				onClick: () => {
					const ids = undoTarget ?? [];
					setUndoTarget(null);
					act(ids, true);
				},
				children: "Yes, cancel handover"
			})] })] })
		})
	] });
}
//#endregion
export { AdminSupplierReturnsPage as component };
