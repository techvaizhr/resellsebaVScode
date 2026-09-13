import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CiD-puKw.js";
import { a as OrderNotePreview, d as OrderProductCell, l as ImageLightbox, n as courierTrackingUrl, o as OrderNotesModal, r as OrderTabs, s as useOrderMeta, t as OrderSearch, u as OrderItemsList } from "./order-search-C8A2wrce.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { $n as ChevronDown, E as SquareCheckBig, J as RefreshCw, Mt as LoaderCircle, Q as Printer, ht as PackageCheck, m as Truck, xn as ExternalLink } from "./vendor-icons-BEaCFqaT.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
import { n as getGlobalSettings } from "./app-data-CF0v-2hN.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { i as DEFAULT_ORDER_FILTERS, l as resolveDateRange, n as COURIER_FILTER_OPTIONS, r as DATE_PRESET_OPTIONS, t as AREA_FILTER_OPTIONS } from "./order-filters-D_b5vi6K.js";
import { i as usePaginated, r as Pagination } from "./data-list-BIvUbfJ8.js";
import { i as courierLabel, n as CourierLogo } from "./courier-brand-I6NqKQ1I.js";
import { t as BulkScanButton } from "./BulkScanModal-BJn0C8BD.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-DXe6BDtJ.js";
import { i as orderSupplierTint, r as ShipmentBookingModal, t as printLabelDocs } from "./labels-8IAEQt72.js";
import { n as bdtNum } from "./supplier-HQqKa1Gs.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/lib/supplier-orders.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
/** ONE call: supplier's orders (only their own items and amounts). */
async function loadSupplierOrders(q) {
	const { data, error } = await supabase.rpc("supplier_orders_page", {
		_status: null,
		_q: q ?? null,
		_limit: 300
	});
	if (error) throw error;
	const raw = data ?? {};
	return {
		orders: (raw.orders ?? []).map((o) => ({
			...o,
			my_qty: Number(o.my_qty ?? 0),
			my_amount: Number(o.my_amount ?? 0),
			items: (o.items ?? []).map((i) => ({
				...i,
				quantity: Number(i.quantity ?? 0),
				returned_qty: Number(i.returned_qty ?? 0),
				unit_price: Number(i.unit_price ?? 0),
				line_total: Number(i.line_total ?? 0)
			}))
		})),
		counts: raw.counts ?? {}
	};
}
async function setSupplierOrderStatus(orderId, status) {
	const { error } = await supabase.rpc("supplier_set_order_status", {
		_order: orderId,
		_status: status
	});
	if (error) throw error;
}
/** Supplier-facing labels — "forwarded" is shown as Pending, no admin wording. */
var SUPPLIER_STATUS_LABEL = {
	pending: "Pending",
	forwarded: "Pending",
	confirmed: "Confirmed",
	packaging: "Packaging",
	ready_to_ship: "Courier handover",
	processing: "To courier",
	shipped: "To courier",
	delivered: "Delivered",
	pending_partial: "Pending partial",
	partial: "Partial",
	partial_full: "Partial (full item)",
	partial_item: "Partial (item)",
	partial_delivery: "Partial (delivery charge)",
	pending_return: "Pending return",
	returned: "Returned",
	damaged: "Damaged",
	cancelled: "Cancelled"
};
function supplierStatusLabel(status) {
	return SUPPLIER_STATUS_LABEL[status] ?? status.replace(/_/g, " ");
}
function supplierStatusTone(status) {
	if (status === "delivered") return "bg-emerald-500/10 text-emerald-600";
	if ([
		"returned",
		"cancelled",
		"damaged"
	].includes(status)) return "bg-destructive/10 text-destructive";
	if (status.startsWith("partial")) return "bg-emerald-500/10 text-emerald-600";
	if (["pending_return", "pending_partial"].includes(status)) return "bg-amber-500/10 text-amber-600";
	if (["shipped", "processing"].includes(status)) return "bg-blue-500/10 text-blue-600";
	if (status === "packaging") return "bg-violet-500/10 text-violet-600";
	if (status === "ready_to_ship") return "bg-sky-500/10 text-sky-600";
	return "bg-primary/10 text-primary";
}
/** One-way flow only. Nothing is editable after courier handover. */
function supplierNextStatus(status) {
	if (status === "confirmed") return "packaging";
	if (status === "packaging") return "ready_to_ship";
	return null;
}
/** Supplier flow tabs — same keys/colours as the admin order tabs, minus the admin-only ones. */
var SUPPLIER_ORDER_TABS = [
	{
		key: "all",
		label: "All Orders",
		statuses: []
	},
	{
		key: "confirmed",
		label: "Confirmed",
		statuses: ["confirmed"]
	},
	{
		key: "packaging",
		label: "Packaging",
		statuses: ["packaging"]
	},
	{
		key: "handover",
		label: "Courier Handover",
		statuses: ["ready_to_ship"]
	},
	{
		key: "courier",
		label: "To Courier",
		statuses: ["shipped", "processing"]
	},
	{
		key: "delivered",
		label: "Delivered",
		statuses: ["delivered"]
	},
	{
		key: "pending_partial",
		label: "Pending Partial",
		statuses: ["pending_partial"]
	},
	{
		key: "partial_full",
		label: "Partial (Full item)",
		statuses: ["partial_full", "partial"]
	},
	{
		key: "partial_item",
		label: "Partial (Item)",
		statuses: ["partial_item"]
	},
	{
		key: "partial_delivery",
		label: "Partial (Delivery Charge)",
		statuses: ["partial_delivery"]
	},
	{
		key: "pending_return",
		label: "Pending Return",
		statuses: ["pending_return"]
	},
	{
		key: "returned",
		label: "Returned",
		statuses: ["returned"]
	},
	{
		key: "damaged",
		label: "Damaged",
		statuses: ["damaged"]
	},
	{
		key: "cancelled",
		label: "Cancelled",
		statuses: ["cancelled"]
	}
];
//#endregion
//#region src/routes/_authenticated/supplier/orders.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function SupplierOrdersPage() {
	const { data: supplierData } = useSupplier();
	const myTint = (0, import_react.useMemo)(() => orderSupplierTint([supplierData.supplier?.id ?? null]), [supplierData.supplier?.id]);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("confirmed");
	const [q, setQ] = (0, import_react.useState)("");
	const [searchMode, setSearchMode] = (0, import_react.useState)("order");
	const [area, setArea] = (0, import_react.useState)("");
	const [courier, setCourier] = (0, import_react.useState)("");
	const [datePreset, setDatePreset] = (0, import_react.useState)("lifetime");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(1);
	const [marked, setMarked] = (0, import_react.useState)([]);
	const [expanded, setExpanded] = (0, import_react.useState)([]);
	const [zoomImage, setZoomImage] = (0, import_react.useState)(null);
	const [notesModal, setNotesModal] = (0, import_react.useState)(null);
	const [booking, setBooking] = (0, import_react.useState)({
		open: false,
		orderIds: []
	});
	const [pendingStatus, setPendingStatus] = (0, import_react.useState)(null);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		try {
			const data = await loadSupplierOrders();
			setRows(data.orders);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Orders load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		setMarked([]);
		setPage(1);
	}, [
		tab,
		q,
		sort,
		perPage,
		area,
		courier,
		datePreset
	]);
	const counts = (0, import_react.useCallback)((key) => {
		const t = SUPPLIER_ORDER_TABS.find((x) => x.key === key);
		if (!t || t.statuses.length === 0) return rows.length;
		return rows.filter((o) => t.statuses.includes(o.status)).length;
	}, [rows]);
	const filtered = (0, import_react.useMemo)(() => {
		const t = SUPPLIER_ORDER_TABS.find((x) => x.key === tab);
		const term = q.trim().toLowerCase();
		const { fromTs, toTs } = resolveDateRange({
			...DEFAULT_ORDER_FILTERS,
			datePreset
		});
		return [...rows.filter((o) => {
			if (t && t.statuses.length && !t.statuses.includes(o.status)) return false;
			if (area && o.area !== area) return false;
			if (courier) {
				const provider = o.shipment?.provider ?? null;
				if (courier === "none" ? !!provider : provider !== courier) return false;
			}
			const ts = new Date(o.created_at).getTime();
			if (fromTs != null && ts < fromTs) return false;
			if (toTs != null && ts > toTs) return false;
			if (!term) return true;
			if (searchMode === "product") return o.items.some((i) => i.product_name.toLowerCase().includes(term));
			if (o.order_number.toLowerCase().includes(term) || (o.customer_name ?? "").toLowerCase().includes(term) || (o.customer_phone ?? "").toLowerCase().includes(term)) return true;
			const sh = o.shipment;
			if (sh) return (sh.consignment_id ?? "").toLowerCase().includes(term) || (sh.tracking_id ?? "").toLowerCase().includes(term) || (sh.provider ?? "").toLowerCase().includes(term);
			return false;
		})].sort((a, b) => {
			if (sort === "high") return b.my_amount - a.my_amount;
			if (sort === "low") return a.my_amount - b.my_amount;
			const ta = new Date(a.created_at).getTime();
			const tb = new Date(b.created_at).getTime();
			return sort === "oldest" ? ta - tb : tb - ta;
		});
	}, [
		rows,
		tab,
		q,
		searchMode,
		sort,
		area,
		courier,
		datePreset
	]);
	const paged = usePaginated(filtered, page, perPage);
	const { meta, refresh: refreshMeta } = useOrderMeta(paged.map((o) => o.id));
	const markedRows = rows.filter((o) => marked.includes(o.id));
	const bulkNext = (0, import_react.useMemo)(() => {
		if (!markedRows.length) return null;
		const next = supplierNextStatus(markedRows[0].status);
		return markedRows.every((o) => supplierNextStatus(o.status) === next) ? next : null;
	}, [markedRows]);
	const isBooked = (o) => Boolean(o.shipment?.provider);
	const unbookedMarked = markedRows.filter((o) => !isBooked(o));
	(0, import_react.useMemo)(() => ({
		orders: rows.length,
		qty: rows.reduce((s, o) => s + o.my_qty, 0),
		value: rows.reduce((s, o) => s + o.my_amount, 0)
	}), [rows]);
	const stripItems = (0, import_react.useCallback)((o) => o.items.map((it) => ({
		id: it.id,
		product_id: null,
		product_name: it.product_name,
		quantity: it.quantity,
		unit_price: it.unit_price,
		line_total: it.line_total,
		image: it.product_image,
		slug: null
	})), []);
	const toggleExpand = (id) => setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	const applyStatus = async (ids, next) => {
		setBusy(true);
		let ok = 0;
		for (const id of ids) try {
			await setSupplierOrderStatus(id, next);
			ok++;
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Status change failed");
		}
		setBusy(false);
		if (ok) {
			toast.success(`${ok} order${ok > 1 ? "s" : ""} → ${supplierStatusLabel(next)}`);
			setMarked([]);
			await load();
		}
	};
	/** Packaging requires a confirmed courier booking first — already booked orders are never re-booked. */
	const askStatus = (ids, next) => {
		if (next === "packaging") {
			const needBooking = rows.filter((o) => ids.includes(o.id)).filter((o) => !isBooked(o)).map((o) => o.id);
			if (needBooking.length > 0) {
				setPendingStatus({
					ids,
					next
				});
				setBooking({
					open: true,
					orderIds: needBooking
				});
				return;
			}
		}
		setConfirm({
			title: `Move to ${supplierStatusLabel(next)}?`,
			description: next === "ready_to_ship" ? `${ids.length} order(s) will be handed over to the courier.` : `${ids.length} order(s) will be moved to ${supplierStatusLabel(next)}.`,
			onConfirm: async () => {
				setConfirm(null);
				await applyStatus(ids, next);
			}
		});
	};
	const bookMarked = () => {
		const ids = unbookedMarked.map((o) => o.id);
		if (!ids.length) {
			toast.info("Selected order(s) are already booked.");
			return;
		}
		setPendingStatus(null);
		setBooking({
			open: true,
			orderIds: ids
		});
	};
	const handleBookingDone = async () => {
		const pending = pendingStatus;
		setPendingStatus(null);
		await load();
		if (pending) await applyStatus(pending.ids, pending.next);
	};
	/** Scan lookup stays inside the supplier's own orders (order no / tracking / consignment). */
	const scanResolve = (0, import_react.useCallback)((code) => {
		const c = code.trim().replace(/^#/, "").toLowerCase();
		const hit = rows.find((o) => o.order_number.toLowerCase() === c || (o.shipment?.tracking_id ?? "").toLowerCase() === c || (o.shipment?.consignment_id ?? "").toLowerCase() === c);
		if (!hit) return null;
		return {
			id: hit.id,
			order_number: hit.order_number,
			status: hit.status,
			customer_name: null
		};
	}, [rows]);
	const scanApply = (0, import_react.useCallback)(async (order, to) => {
		await setSupplierOrderStatus(order.id, to);
	}, []);
	const printMarked = async () => {
		if (!markedRows.length) return;
		let siteName = "Shipping label";
		try {
			siteName = (await getGlobalSettings())?.site_name || siteName;
		} catch {}
		const maskPhone = (raw) => {
			if (!raw) return "";
			if (raw.length <= 4) return "****";
			return raw.slice(0, 3) + "*".repeat(Math.max(raw.length - 5, 4)) + raw.slice(-2);
		};
		printLabelDocs(markedRows.map((o) => ({
			orderNumber: o.order_number,
			storeName: siteName,
			storeLogo: null,
			area: o.area,
			customer: {
				name: o.customer_name,
				phone: maskPhone(o.customer_phone),
				address: o.address_line
			},
			items: o.items.map((it) => ({
				name: it.product_name,
				qty: it.quantity
			})),
			courier: {
				provider: o.shipment?.provider ?? null,
				tracking: o.shipment?.consignment_id || o.shipment?.tracking_id || null
			},
			cod: null
		})));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			className: "flex-row items-center justify-between",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkScanButton, {
					compact: true,
					mode: "handover",
					modes: ["handover"],
					resolve: scanResolve,
					apply: scanApply,
					onDone: () => void load()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => void load(),
					className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Refresh"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderSearch, {
					mode: searchMode,
					onMode: setSearchMode,
					value: q,
					onChange: setQ,
					className: "min-w-0 flex-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: perPage,
					onChange: (e) => setPerPage(Number(e.target.value)),
					className: "h-10 w-[76px] shrink-0 rounded-md border bg-background px-1 text-xs font-medium outline-none focus:ring-1 focus:ring-primary",
					title: "Per page",
					children: [[
						10,
						20,
						50,
						100
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: n,
						children: n
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: -1,
						children: "All"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: area,
						onChange: (e) => setArea(e.target.value),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Delivery area",
						children: AREA_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: courier,
						onChange: (e) => setCourier(e.target.value),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Courier",
						children: COURIER_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: datePreset,
						onChange: (e) => setDatePreset(e.target.value),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Date range",
						children: DATE_PRESET_OPTIONS.filter((o) => o.value !== "custom").map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Sort",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "newest",
								children: "Newest first"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "oldest",
								children: "Oldest first"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "high",
								children: "Amount: high → low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "low",
								children: "Amount: low → high"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTabs, {
							tabs: SUPPLIER_ORDER_TABS,
							tab,
							onChange: setTab,
							count: counts,
							highlight: true,
							className: "w-full min-w-0"
						})
					})
				]
			})]
		}),
		marked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mr-2 text-sm font-medium",
					children: [marked.length, " marked"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMarked(marked.length === paged.length ? [] : paged.map((x) => x.id)),
					className: "inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent",
					title: marked.length === paged.length ? "Deselect all" : "Select all on this page",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-3.5 w-3.5" }), marked.length === paged.length ? "Unselect all" : "Select all"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: printMarked,
							className: "inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print Labels"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: bookMarked,
							disabled: unbookedMarked.length === 0,
							className: "inline-flex h-9 items-center gap-2 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 text-xs font-medium text-violet-600 hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-violet-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }),
								" Book Courier ",
								unbookedMarked.length > 0 ? `(${unbookedMarked.length})` : ""
							]
						}),
						bulkNext && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: busy,
							onClick: () => askStatus(marked, bulkNext),
							className: "inline-flex h-9 items-center gap-2 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 disabled:opacity-50 dark:text-blue-400",
							children: [
								busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" }),
								marked.length,
								" → ",
								supplierStatusLabel(bulkNext)
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMarked([]),
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden sm:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTabs, {
				tabs: SUPPLIER_ORDER_TABS,
				tab,
				onChange: setTab,
				count: counts
			})
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No orders",
			description: "There are no orders in this tab."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[30px_minmax(110px,0.8fr)_minmax(150px,1.1fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(120px,0.85fr)_minmax(130px,0.9fr)] gap-2 rounded-lg border bg-muted/40 px-2 py-2.5 text-xs font-medium text-muted-foreground lg:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "h-4 w-4 accent-[hsl(var(--primary))]",
							checked: marked.length > 0 && marked.length === paged.length,
							onChange: (e) => setMarked(e.target.checked ? paged.map((x) => x.id) : [])
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "My value"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Courier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Status"
					})
				]
			}), paged.map((o) => {
				const next = supplierNextStatus(o.status);
				const open = expanded.includes(o.id);
				const items = stripItems(o);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: myTint?.style,
					className: "border-b last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 p-3 lg:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "mt-1 h-4 w-4 accent-[hsl(var(--primary))]",
											checked: marked.includes(o.id),
											onChange: (e) => setMarked((prev) => e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, {
													orderNumber: o.order_number,
													className: "text-sm font-semibold"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded-full px-2 py-0.5 text-[11px] font-medium ${supplierStatusTone(o.status)}`,
													children: supplierStatusLabel(o.status)
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleString() : "—",
													" · ",
													(o.area || "").replace(/_/g, " ")
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => toggleExpand(o.id),
											className: "rounded-full p-1 hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}` })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 gap-2 rounded-lg bg-muted/30 p-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
												children: "My value"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold tabular-nums",
												children: bdtNum(o.my_amount)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [o.my_qty, " pcs"]
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
										children: "Products"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderProductCell, {
										items,
										expanded: open,
										onZoom: setZoomImage,
										onToggle: () => toggleExpand(o.id)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
										children: "Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotePreview, {
										meta: meta[o.id],
										align: "left",
										onOpenNotes: () => setNotesModal({
											orderId: o.id,
											orderNumber: o.order_number
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [isBooked(o) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierCell, {
										shipment: o.shipment,
										customerPhone: o.customer_phone
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setBooking({
											open: true,
											orderIds: [o.id]
										}),
										className: "inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-600 hover:bg-violet-500/20 dark:text-violet-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), " Book courier"]
									}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: busy,
										onClick: () => askStatus([o.id], next),
										className: "btn-brand inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50",
										children: [next === "packaging" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" }), supplierStatusLabel(next)]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md border border-dashed px-3 py-1.5 text-[11px] text-muted-foreground",
										children: "View only"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `hidden grid-cols-[30px_minmax(110px,0.8fr)_minmax(150px,1.1fr)_minmax(100px,0.7fr)_minmax(110px,0.8fr)_minmax(120px,0.85fr)_minmax(130px,0.9fr)] items-center gap-2 px-2 py-3 text-sm hover:bg-muted/40 lg:grid ${marked.includes(o.id) ? "bg-primary/5" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "h-4 w-4 accent-[hsl(var(--primary))]",
										checked: marked.includes(o.id),
										onChange: (e) => setMarked((prev) => e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleExpand(o.id),
										className: "rounded-full p-1 hover:bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}` })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, {
											orderNumber: o.order_number,
											className: "text-xs font-semibold"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleDateString() : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] capitalize text-muted-foreground",
											children: (o.area || "").replace(/_/g, " ")
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderProductCell, {
										items,
										expanded: open,
										onZoom: setZoomImage,
										onToggle: () => toggleExpand(o.id)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold tabular-nums",
										children: bdtNum(o.my_amount)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [o.my_qty, " pcs"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0 px-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotePreview, {
										meta: meta[o.id],
										onOpenNotes: () => setNotesModal({
											orderId: o.id,
											orderNumber: o.order_number
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: isBooked(o) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierCell, {
										shipment: o.shipment,
										customerPhone: o.customer_phone
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setBooking({
											open: true,
											orderIds: [o.id]
										}),
										className: "inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-600 hover:bg-violet-500/20 dark:text-violet-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }), " Book"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[11px] font-medium ${supplierStatusTone(o.status)}`,
										children: supplierStatusLabel(o.status)
									}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										disabled: busy,
										onClick: () => askStatus([o.id], next),
										className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold disabled:opacity-50",
										children: [next === "packaging" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3 w-3" }), supplierStatusLabel(next)]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] italic text-muted-foreground/70",
										children: "View only"
									})]
								})
							]
						}),
						open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t bg-muted/20 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderItemsList, {
								items,
								onZoom: setZoomImage
							})
						})
					]
				}, o.id);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: filtered.length,
			onPage: setPage
		})] }),
		zoomImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageLightbox, {
			src: zoomImage,
			onClose: () => setZoomImage(null)
		}),
		notesModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotesModal, {
			orderId: notesModal.orderId,
			orderNumber: notesModal.orderNumber,
			authorRole: "supplier",
			authorName: supplierData.supplier?.display_name ?? null,
			canWrite: true,
			onClose: () => {
				const id = notesModal.orderId;
				setNotesModal(null);
				refreshMeta([id]);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShipmentBookingModal, {
			isOpen: booking.open,
			orderIds: booking.orderIds,
			onClose: () => setBooking({
				open: false,
				orderIds: []
			}),
			onSuccess: () => void handleBookingDone()
		}),
		confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: true,
			variant: "info",
			title: confirm.title,
			description: confirm.description,
			confirmText: "Confirm",
			onConfirm: confirm.onConfirm,
			onClose: () => setConfirm(null)
		})
	] });
}
function CourierCell({ shipment, customerPhone }) {
	if (!shipment?.provider) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] italic text-muted-foreground/60",
		children: "Not booked yet"
	});
	const url = courierTrackingUrl(shipment.provider, shipment, customerPhone);
	const label = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-0.5 truncate text-[11px] font-semibold text-primary",
		children: [courierLabel(shipment.provider), url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0 opacity-60" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
			provider: shipment.provider,
			size: 16
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: url,
				target: "_blank",
				rel: "noopener noreferrer",
				title: "Track on courier website",
				onClick: (e) => e.stopPropagation(),
				className: "hover:underline",
				children: label
			}) : label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-[10px] text-muted-foreground",
				children: shipment.consignment_id || shipment.tracking_id || "—"
			})]
		})]
	});
}
//#endregion
export { SupplierOrdersPage as component };
