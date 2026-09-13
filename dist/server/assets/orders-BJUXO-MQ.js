import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { R as initial_data_default, r as supabase } from "./client-D4WgG89C.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { i as courierStatusLabel, l as orderStatusLabel, n as ORDER_TABS, p as resellerCanAct, s as nextStatuses, u as orderStatusTone } from "./courier-status-BxiQVHJB.js";
import { n as useQueryClient } from "./QueryClientProvider-CF67hjzh.js";
import { a as OrderNotePreview, c as OrderNotes, d as OrderProductCell, f as useQuery, i as LastUpdateCell, l as ImageLightbox, n as courierTrackingUrl, o as OrderNotesModal, r as OrderTabs, s as useOrderMeta, t as OrderSearch, u as OrderItemsList } from "./order-search-5R5h1hil.js";
import { a as AdvanceChip, c as recheckCourierStatus, i as ResellerTotalCell, l as useMutation, n as OrderEditModal, o as OrderMoneyPanel, s as getOrderDetails, t as CourierTimeline } from "./CourierTimeline-D7maiKV3.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { B as Settings2, Dn as Download, E as SquareCheckBig, M as ShoppingCart, Nt as LoaderCircle, Rt as ListChecks, Sn as ExternalLink, Tn as EllipsisVertical, Y as RefreshCw, bn as Eye, er as ChevronDown, g as TrendingUp, gr as Ban, hn as FileText, it as Phone, jn as Copy, m as Truck, qn as CircleCheck, r as X, st as Pencil, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { t as Route } from "./orders-DO5RvJHj.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { p as orderProfit } from "./finance-report-Dwy2dA23.js";
import { i as useDepositSettings, n as fillText, t as DEFAULT_DEPOSIT_TEXTS } from "./deposit-settings-DzNS3eU9.js";
import { n as useAuth } from "./use-auth-BlN5jsui.js";
import { c as filterByCourier, i as DEFAULT_ORDER_FILTERS, n as COURIER_FILTER_OPTIONS, o as activeFilterCount, r as DATE_PRESET_OPTIONS, s as applyOrderFilters, t as AREA_FILTER_OPTIONS } from "./order-filters-CRizD8DF.js";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-B_of1R8h.js";
import { i as usePaginated, r as Pagination } from "./data-list-D-TkvXUz.js";
import { S as withKeptCost } from "./business-report-DlB3Zbm8.js";
import { f as syncPathaoStatus, i as courierLabel, n as CourierLogo, p as syncSteadfastStatus } from "./courier-brand-C51FPfqc.js";
import { t as NewOrderModal } from "./NewOrderModal-PTJWEh_6.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { t as useDepositStatus } from "./deposit-DdmN6ukE.js";
//#region src/components/pick-list-modal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Product pick list popup — works for filtered view or marked orders. */
function PickListModal({ rows, scopeLabel, onPick, onClose }) {
	const totalQty = rows.reduce((s, r) => s + r.qty, 0);
	const printList = () => {
		const w = window.open("", "_blank", "width=720,height=900");
		if (!w) return;
		w.document.write(`<title>Pick list</title><style>body{font-family:system-ui,sans-serif;padding:24px}h1{font-size:18px}table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}th:last-child,td:last-child{text-align:right}</style><h1>Pick list — ${scopeLabel}</h1><table><tr><th>Product</th><th>Orders</th><th>Qty</th></tr>` + rows.map((r) => `<tr><td>${r.name}</td><td>${r.orders}</td><td>${r.qty}</td></tr>`).join("") + `<tr><th>Total</th><th></th><th>${totalQty} pcs</th></tr></table>`);
		w.document.close();
		w.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[85vh] w-full max-w-xl overflow-hidden rounded-lg border bg-background shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-b px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }), " Product pick list"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: scopeLabel
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: printList,
							disabled: rows.length === 0,
							className: "rounded-md border px-2.5 py-1 text-xs hover:bg-accent disabled:opacity-50",
							children: "Print"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-md p-1.5 hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[60vh] modal-scroll",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-10 text-center text-sm text-muted-foreground",
						children: "No products found."
					}) : rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onPick(p.name),
						className: "flex w-full items-center justify-between gap-3 border-b px-4 py-2.5 text-left text-sm last:border-b-0 hover:bg-accent/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex shrink-0 items-center gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [p.orders, " order"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary",
								children: [p.qty, " pcs"]
							})]
						})]
					}, p.name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [rows.length, " product"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground",
						children: [totalQty, " pcs"]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/_authenticated/reseller/orders.tsx?tsr-split=component
var ORDER_COLUMNS = "id,order_number,customer_name,customer_phone,address_line,city,area,subtotal,shipping_cost,discount,total,sa_cost_total,reseller_profit,received_amount,packaging_total,delivery_cost,advance_amount,advance_by,payment_method,status,payment_status,forwarded_to_admin,notes,reseller_note,created_at,updated_at";
function exportCsv(rows) {
	const csv = [[
		"Order",
		"Date",
		"Customer",
		"Phone",
		"Area",
		"Address",
		"Status",
		"Total",
		"Profit"
	].join(",")].concat(rows.map((o) => [
		o.order_number,
		new Date(o.created_at).toISOString().slice(0, 10),
		o.customer_name,
		o.customer_phone,
		o.area,
		`"${(o.address_line ?? "").replace(/"/g, "\"\"")}"`,
		o.status,
		Number(o.total).toFixed(0),
		orderProfit(o).toFixed(0)
	].join(","))).join("\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = `my-orders-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
function OrdersPage() {
	const { user } = useAuth();
	const { tab: tabParam, q: qParam } = Route.useSearch();
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [orderItems, setOrderItems] = (0, import_react.useState)([]);
	const [shipments, setShipments] = (0, import_react.useState)([]);
	const [listings, setListings] = (0, import_react.useState)([]);
	const [allProducts, setAllProducts] = (0, import_react.useState)(initial_data_default.products || []);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)(tabParam ?? (qParam ? "all" : "new"));
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [filters, setFilters] = (0, import_react.useState)({
		...DEFAULT_ORDER_FILTERS,
		q: qParam ?? ""
	});
	const [searchMode, setSearchMode] = (0, import_react.useState)("order");
	const [pickOpen, setPickOpen] = (0, import_react.useState)(false);
	const [pickScope, setPickScope] = (0, import_react.useState)("filtered");
	const [marked, setMarked] = (0, import_react.useState)([]);
	const [expandedOrders, setExpandedOrders] = (0, import_react.useState)([]);
	const [zoomImage, setZoomImage] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [statusModal, setStatusModal] = (0, import_react.useState)(null);
	const { status: deposit } = useDepositStatus(resellerId);
	const { texts: depositTexts } = useDepositSettings();
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		open: false,
		title: "",
		description: "",
		onConfirm: async () => {}
	});
	const lastLoad = (0, import_react.useRef)(null);
	async function load(opts) {
		const loadKey = `${tab}`;
		if (!opts?.silent) {
			const prev = lastLoad.current;
			if (prev && prev.key === loadKey && Date.now() - prev.at < 1500) return;
			lastLoad.current = {
				key: loadKey,
				at: Date.now()
			};
		}
		if (!user) return;
		if (!opts?.silent) setLoading(true);
		const { data } = await supabase.rpc("reseller_orders_page");
		const pl = data ?? {};
		if (!pl.reseller_id) return setLoading(false);
		setResellerId(pl.reseller_id);
		setOrders(pl.orders ?? []);
		setListings(pl.listings ?? []);
		setAllProducts(pl.products ?? []);
		setOrderItems(pl.items ?? []);
		setShipments(pl.shipments ?? []);
		setEvents(pl.events ?? []);
		if (!opts?.silent) setLoading(false);
	}
	async function syncOrders(ids) {
		const list = ids.filter(Boolean);
		if (list.length === 0) return;
		const statuses = ORDER_TABS.find((t) => t.key === tab)?.statuses ?? [];
		const inTab = (st) => statuses.length === 0 || statuses.includes(st);
		const [{ data: rows }, { data: its }, { data: sh }, { data: ev }] = await Promise.all([
			supabase.from("orders").select(ORDER_COLUMNS).in("id", list),
			supabase.from("order_items").select("order_id,product_id,product_name,product_image,quantity,returned_qty,reseller_price,line_total,sa_price").in("order_id", list),
			supabase.from("shipments").select("id,order_id,provider,tracking_id,tracking_url,consignment_id,status,courier_status,last_event_at").in("order_id", list),
			supabase.from("courier_events").select("order_id,provider,courier_status,note,event_at").in("order_id", list)
		]);
		const fetched = rows ?? [];
		setOrders((prev) => {
			let next = prev.map((x) => fetched.find((f) => f.id === x.id) ?? x).filter((x) => !list.includes(x.id) || inTab(x.status));
			for (const f of fetched) if (!next.some((x) => x.id === f.id) && inTab(f.status)) next = [f, ...next];
			return next;
		});
		setOrderItems((prev) => [...prev.filter((i) => !list.includes(i.order_id)), ...its ?? []]);
		setShipments((prev) => [...prev.filter((x) => !list.includes(x.order_id)), ...sh ?? []]);
		setEvents((prev) => [...prev.filter((x) => !list.includes(x.order_id)), ...ev ?? []]);
	}
	function dropOrders(ids) {
		setOrders((prev) => prev.filter((x) => !ids.includes(x.id)));
		setOrderItems((prev) => prev.filter((i) => !ids.includes(i.order_id)));
		setShipments((prev) => prev.filter((x) => !ids.includes(x.order_id)));
		setEvents((prev) => prev.filter((x) => !ids.includes(x.order_id)));
		setMarked((prev) => prev.filter((id) => !ids.includes(id)));
		setExpandedOrders((prev) => prev.filter((id) => !ids.includes(id)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [user, tab]);
	const itemsByOrder = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const it of orderItems) {
			const arr = m.get(it.order_id);
			if (arr) arr.push(it);
			else m.set(it.order_id, [it]);
		}
		return m;
	}, [orderItems]);
	const stripItems = (0, import_react.useCallback)((orderId) => (itemsByOrder.get(orderId) ?? []).map((it, idx) => {
		const p = allProducts.find((x) => x.id === it.product_id);
		return {
			id: `${orderId}-${idx}`,
			product_id: it.product_id,
			product_name: it.product_name,
			quantity: it.quantity,
			unit_price: it.reseller_price,
			line_total: it.line_total,
			image: it.product_image ?? p?.og_image_url ?? null,
			slug: p?.slug ?? null
		};
	}), [itemsByOrder, allProducts]);
	const tabStatuses = ORDER_TABS.find((t) => t.key === tab)?.statuses ?? [];
	const inTab = tabStatuses.length === 0 ? orders : orders.filter((o) => tabStatuses.includes(o.status));
	/** One search box, mode decides target: order fields, product name or shipment IDs. */
	const visible = (0, import_react.useMemo)(() => {
		const base = applyOrderFilters(filterByCourier(inTab, filters.courier, shipments), {
			...filters,
			q: ""
		});
		const q = filters.q.trim().toLowerCase();
		if (!q) return base;
		const has = (v) => (v ?? "").toLowerCase().includes(q);
		return base.filter((o) => {
			if (searchMode === "product") return (itemsByOrder.get(o.id) ?? []).some((it) => it.product_name.toLowerCase().includes(q));
			if (has(o.order_number) || has(o.customer_name) || has(o.customer_phone)) return true;
			return shipments.filter((s) => s.order_id === o.id).some((s) => has(s.consignment_id) || has(s.tracking_id) || has(s.provider));
		});
	}, [
		inTab,
		filters,
		searchMode,
		itemsByOrder,
		shipments
	]);
	const markedOrders = (0, import_react.useMemo)(() => visible.filter((o) => marked.includes(o.id)), [visible, marked]);
	const pickList = (0, import_react.useMemo)(() => {
		const rows = pickScope === "marked" ? markedOrders : visible;
		const m = /* @__PURE__ */ new Map();
		for (const o of rows) for (const it of itemsByOrder.get(o.id) ?? []) {
			const key = it.product_id ?? it.product_name;
			const cur = m.get(key) ?? {
				name: it.product_name,
				qty: 0,
				orders: 0
			};
			cur.qty += Number(it.quantity) || 0;
			cur.orders += 1;
			m.set(key, cur);
		}
		return [...m.values()].sort((a, b) => b.qty - a.qty);
	}, [
		pickScope,
		markedOrders,
		visible,
		itemsByOrder
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		filters,
		tab,
		searchMode
	]);
	const paged = usePaginated(visible, page, filters.perPage);
	const { meta: orderMeta, refresh: refreshMeta } = useOrderMeta(paged.map((o) => o.id));
	const [notesModal, setNotesModal] = (0, import_react.useState)(null);
	(0, import_react.useMemo)(() => visible.reduce((a, o) => ({
		count: a.count + 1,
		total: a.total + (Number(o.total) || 0),
		shipping: a.shipping + (Number(o.shipping_cost) || 0),
		profit: a.profit + orderProfit(o)
	}), {
		count: 0,
		total: 0,
		shipping: 0,
		profit: 0
	}), [visible]);
	const bulkUpdateStatus = async (newStatus) => {
		if (marked.length === 0) return;
		const bookedIds = shipments.map((s) => s.order_id);
		const lockedCount = marked.filter((id) => bookedIds.includes(id)).length;
		if (lockedCount > 0) {
			toast.error(`${lockedCount} orders are already booked in courier and cannot be changed.`);
			return;
		}
		const blocked = visible.filter((o) => marked.includes(o.id) && !nextStatuses(o.status, "reseller").includes(newStatus));
		if (blocked.length > 0) {
			toast.error(`${blocked.length} orders cannot move to this status — only New Order, Send To admin and Cancelled can be switched.`);
			return;
		}
		setConfirmModal({
			open: true,
			title: "Bulk Status Update",
			description: `Are you sure you want to update ${marked.length} orders to ${newStatus}?`,
			variant: "warning",
			onConfirm: async () => {
				setBusy(true);
				const targetIds = [...marked];
				const { error } = await supabase.from("orders").update({ status: newStatus }).in("id", targetIds);
				if (error) toast.error(error.message);
				else {
					toast.success(`${targetIds.length} orders updated successfully`);
					setMarked([]);
					await syncOrders(targetIds);
				}
				setConfirmModal((prev) => ({
					...prev,
					open: false
				}));
				setBusy(false);
			}
		});
	};
	const bulkDeleteOrders = async () => {
		if (marked.length === 0) return;
		const bookedIds = shipments.filter((s) => s.consignment_id || s.tracking_id).map((s) => s.order_id);
		const restricted = visible.filter((o) => marked.includes(o.id) && (!resellerCanAct(o.status) || bookedIds.includes(o.id)));
		if (restricted.length > 0) {
			toast.error(`${restricted.length} orders cannot be deleted (only Pending orders that are not booked).`);
			return;
		}
		setConfirmModal({
			open: true,
			title: "Delete Orders",
			description: `Delete ${marked.length} selected orders? This action cannot be undone.`,
			variant: "danger",
			onConfirm: async () => {
				setBusy(true);
				const { data: gone, error } = await supabase.from("orders").delete().in("id", marked).select("id");
				if (error) toast.error(error.message);
				else {
					toast.success(`${marked.length} orders deleted`);
					dropOrders([...marked]);
				}
				setConfirmModal((prev) => ({
					...prev,
					open: false
				}));
				setBusy(false);
			}
		});
	};
	async function remove(id) {
		const order = orders.find((o) => o.id === id);
		if (!order) return;
		const isBooked = shipments.some((s) => s.order_id === id && (s.consignment_id || s.tracking_id));
		if (!resellerCanAct(order.status) || isBooked) {
			toast.error("Only New Order, Send To admin or Cancelled orders can be deleted.");
			return;
		}
		setConfirmModal({
			open: true,
			title: "Delete Order",
			description: "Are you sure you want to delete this order? This action cannot be undone.",
			variant: "danger",
			onConfirm: async () => {
				setBusy(true);
				const { data: gone, error } = await supabase.from("orders").delete().eq("id", id).select("id");
				if (error) toast.error(error.message);
				else {
					toast.success("Order deleted");
					dropOrders([id]);
				}
				setConfirmModal((prev) => ({
					...prev,
					open: false
				}));
				setBusy(false);
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			className: "flex-row items-center justify-between",
			description: "",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => exportCsv(visible),
					disabled: visible.length === 0,
					className: "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-2 text-xs disabled:opacity-50 sm:px-3 sm:text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden xs:inline",
							children: "Export"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpen(true),
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New order"]
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
					value: filters.q,
					onChange: (v) => setFilters({
						...filters,
						q: v
					}),
					className: "min-w-0 flex-1"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filters.perPage,
					onChange: (e) => setFilters({
						...filters,
						perPage: Number(e.target.value)
					}),
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
						value: filters.area,
						onChange: (e) => setFilters({
							...filters,
							area: e.target.value
						}),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Delivery area",
						children: AREA_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: filters.courier,
						onChange: (e) => setFilters({
							...filters,
							courier: e.target.value
						}),
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Courier",
						children: COURIER_FILTER_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: filters.datePreset,
						onChange: (e) => {
							const v = e.target.value;
							setFilters(v === "custom" ? {
								...filters,
								datePreset: "custom"
							} : {
								...filters,
								datePreset: v,
								from: "",
								to: ""
							});
						},
						className: "h-10 w-full rounded-md border bg-background px-2 text-xs font-medium outline-none focus:ring-1 focus:ring-primary lg:w-[150px]",
						title: "Date range",
						children: DATE_PRESET_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: o.value,
							children: o.label
						}, o.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.sort,
						onChange: (e) => setFilters({
							...filters,
							sort: e.target.value
						}),
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
								value: "updated",
								children: "Last updated"
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
							tab,
							onChange: setTab,
							highlight: true,
							count: (key) => {
								const sts = ORDER_TABS.find((t) => t.key === key)?.statuses ?? [];
								return sts.length === 0 ? orders.length : orders.filter((o) => sts.includes(o.status)).length;
							},
							className: "w-full min-w-0"
						})
					}),
					activeFilterCount(filters) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilters({
							...DEFAULT_ORDER_FILTERS,
							q: filters.q,
							perPage: filters.perPage,
							reseller: filters.reseller,
							supplier: filters.supplier
						}),
						className: "inline-flex h-10 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent lg:w-[150px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Clear filters"]
					})
				]
			})]
		}),
		marked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mr-2 text-sm font-medium",
					children: [marked.length, " marked"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent",
					onClick: () => setMarked(marked.length === paged.length ? [] : paged.map((x) => x.id)),
					title: marked.length === paged.length ? "Deselect all" : "Select all on this page",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-3.5 w-3.5" }), marked.length === paged.length ? "Unselect all" : "Select all"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent",
					onClick: () => setStatusModal({
						open: true,
						orderId: marked[0],
						currentStatus: orders.find((o) => o.id === marked[0])?.status || "pending",
						isBulk: true
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" }), " Change Status"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent",
					onClick: () => {
						setPickScope("marked");
						setPickOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-3.5 w-3.5" }), " Pick list"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-xs font-medium hover:bg-accent",
					onClick: () => exportCsv(markedOrders),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-9 items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20",
					onClick: bulkDeleteOrders,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMarked([]),
					className: "ml-auto text-xs text-muted-foreground hover:underline",
					children: "Clear"
				})
			]
		}),
		pickOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickListModal, {
			rows: pickList,
			scopeLabel: pickScope === "marked" ? `${markedOrders.length} marked order` : `${ORDER_TABS.find((t) => t.key === tab)?.label ?? "All"} — ${visible.length} order`,
			onPick: (name) => {
				setSearchMode("product");
				setFilters((f) => ({
					...f,
					q: name
				}));
				setPickOpen(false);
			},
			onClose: () => setPickOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden sm:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTabs, {
				tab,
				onChange: setTab,
				count: (key) => {
					const sts = ORDER_TABS.find((t) => t.key === key)?.statuses ?? [];
					return sts.length === 0 ? orders.length : orders.filter((o) => sts.includes(o.status)).length;
				}
			})
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : paged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No orders",
			description: "No orders match this filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[30px_minmax(60px,0.7fr)_minmax(120px,1fr)_minmax(100px,1fr)_minmax(100px,1.2fr)_124px_minmax(112px,0.9fr)] items-start gap-2 rounded-lg border bg-muted/40 px-2 py-2.5 text-xs font-medium text-muted-foreground md:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "h-4 w-4 accent-[hsl(var(--primary))]",
							checked: paged.length > 0 && paged.every((o) => marked.includes(o.id)),
							onChange: (e) => {
								const ids = paged.map((o) => o.id);
								setMarked((prev) => e.target.checked ? [.../* @__PURE__ */ new Set([...prev, ...ids])] : prev.filter((id) => !ids.includes(id)));
							},
							title: "Mark all on this page"
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
						children: "Customer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Reseller total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Last update"
					})
				]
			}), paged.map((o) => {
				const items = itemsByOrder.get(o.id) ?? [];
				items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
				items.length && (`${items[0].product_name}`, items.length > 1 && items.length - 1);
				const isMarked = marked.includes(o.id);
				const mark = (checked) => setMarked((prev) => checked ? [...prev, o.id] : prev.filter((id) => id !== o.id));
				const actions = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md border p-1 hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-44",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setSelected(o),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View Details"]
							}),
							resellerCanAct(o.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => setEditId(o.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit Order"]
							}),
							(() => {
								if (!shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id)) && resellerCanAct(o.status) && nextStatuses(o.status, "reseller").length > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setStatusModal({
										open: true,
										orderId: o.id,
										currentStatus: o.status
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "mr-2 h-4 w-4" }), " Change Status"]
								});
								return null;
							})(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/reseller/orders/$id/invoice",
									params: { id: o.id },
									target: "_blank",
									className: "flex w-full items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 h-4 w-4" }), " View Invoice"]
								})
							}),
							resellerCanAct(o.status) && !shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => remove(o.id),
								className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete Order"]
							})] })
						]
					})] })
				});
				const orderShipment = shipments.find((s) => s.order_id === o.id || s.order_id === o.order_number);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md ${isMarked ? "border-primary ring-1 ring-primary/30" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 p-3 md:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]",
											checked: isMarked,
											onChange: (e) => mark(e.target.checked)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, {
												orderNumber: o.order_number,
												className: "text-sm font-bold tracking-tight"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-wide text-muted-foreground tabular-nums",
												children: o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleString([], {
													day: "2-digit",
													month: "short",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit"
												}) : "—"
											})]
										}),
										(() => {
											const canChange = !shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id)) && resellerCanAct(o.status) && nextStatuses(o.status, "reseller").length > 0;
											const cls = `shrink-0 rounded-full px-2 py-0.5 text-[11px] capitalize ${orderStatusTone(o.status)}`;
											return canChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												title: "Change status",
												onClick: () => setStatusModal({
													open: true,
													orderId: o.id,
													currentStatus: o.status
												}),
												className: `${cls} transition-shadow hover:ring-2 hover:ring-primary/30`,
												children: orderStatusLabel(o.status)
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cls,
												children: orderStatusLabel(o.status)
											});
										})(),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0",
											children: actions
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setExpandedOrders((prev) => prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id]),
											className: "shrink-0 rounded-full p-1 transition-colors hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${expandedOrders.includes(o.id) ? "rotate-180" : ""}` })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
												children: "Customer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 items-center gap-1.5 text-xs font-medium",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: o.customer_name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: `tel:${o.customer_phone}`,
														className: "shrink-0 text-primary transition-colors hover:text-primary/80",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															navigator.clipboard.writeText(o.customer_phone);
															toast.success("Phone number copied");
														},
														className: "shrink-0 text-muted-foreground transition-colors hover:text-foreground",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] tabular-nums text-muted-foreground",
												children: o.customer_phone
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] leading-snug text-muted-foreground break-words",
												children: [
													o.address_line,
													o.area ? `, ${o.area.replace("_", " ")}` : "",
													o.city ? `, ${o.city}` : ""
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-1 border-l pl-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
											children: "Payment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded border px-1.5 py-0.5 uppercase text-muted-foreground",
												children: o.payment_method
											}), o.status === "forwarded" && o.forwarded_to_admin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-success/10 px-1.5 py-0.5 text-success",
												children: "Sent to admin"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
										children: "Products"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderProductCell, {
										items: stripItems(o.id),
										expanded: expandedOrders.includes(o.id),
										onZoom: setZoomImage,
										onToggle: () => setExpandedOrders((prev) => prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id])
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
											children: "Courier"
										}), shipments.some((s) => s.order_id === o.id || s.order_id === o.order_number) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1",
											children: shipments.filter((s) => s.order_id === o.id || s.order_id === o.order_number).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex max-w-full items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-inset ring-muted-foreground/10",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
														provider: s.provider,
														size: 12
													}),
													(() => {
														const u = courierTrackingUrl(s.provider, s, o.customer_phone);
														return u ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
															href: u,
															target: "_blank",
															rel: "noopener noreferrer",
															onClick: (e) => e.stopPropagation(),
															title: "Track on courier website",
															className: "inline-flex items-center gap-0.5 font-bold text-primary hover:underline",
															children: [courierLabel(s.provider), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2 w-2" })]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: courierLabel(s.provider) });
													})(),
													s.consignment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "truncate opacity-70",
														children: ["#", s.consignment_id]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: (e) => {
															e.stopPropagation();
															navigator.clipboard.writeText(s.consignment_id || "");
															toast.success("Booking ID copied");
														},
														className: "ml-0.5 shrink-0 opacity-50 hover:opacity-100",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-2.5 w-2.5" })
													})] })
												]
											}, s.id))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] italic text-muted-foreground/60",
											children: "Not booked yet"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-0.5 border-l pl-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
											children: "Last update"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdateCell, {
											meta: orderMeta[o.id],
											fallbackAt: o.created_at,
											hideNote: true,
											onOpenNotes: () => setNotesModal({
												orderId: o.id,
												orderNumber: o.order_number,
												canWrite: resellerCanAct(o.status)
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerTotalCell, { order: withKeptCost(o, itemsByOrder.get(o.id) ?? []) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5 border-t pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
										children: "Note"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotePreview, {
										meta: orderMeta[o.id],
										align: "left",
										onOpenNotes: () => setNotesModal({
											orderId: o.id,
											orderNumber: o.order_number,
											canWrite: resellerCanAct(o.status)
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden grid-cols-[30px_minmax(60px,0.7fr)_minmax(120px,1fr)_minmax(100px,1fr)_minmax(100px,1.2fr)_124px_minmax(112px,0.9fr)] items-start gap-2 border-b bg-muted/30 px-2 py-3 text-sm md:grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "h-4 w-4 accent-[hsl(var(--primary))]",
											checked: isMarked,
											onChange: (e) => mark(e.target.checked)
										}),
										actions,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setExpandedOrders((prev) => prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id]),
											className: "rounded-full p-1 hover:bg-muted transition-colors shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${expandedOrders.includes(o.id) ? "rotate-180" : ""}` })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyOrderNumber, {
											orderNumber: o.order_number,
											prefix: false,
											className: "font-medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleDateString() : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground/70 tabular-nums",
											children: o.created_at && !isNaN(new Date(o.created_at).getTime()) ? new Date(o.created_at).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											}) : ""
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderProductCell, {
										items: stripItems(o.id),
										expanded: expandedOrders.includes(o.id),
										onZoom: (src) => setZoomImage(src),
										onToggle: () => setExpandedOrders((prev) => prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id])
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground truncate",
											children: o.customer_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground",
											children: [
												o.customer_phone,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `tel:${o.customer_phone}`,
													className: "text-primary hover:text-primary/80 transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														navigator.clipboard.writeText(o.customer_phone);
														toast.success("Phone number copied");
													},
													className: "text-muted-foreground hover:text-foreground transition-colors",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 text-center text-[11px] leading-snug text-muted-foreground break-words",
											children: [
												o.address_line,
												o.area ? `, ${o.area.replace("_", " ")}` : "",
												o.city ? `, ${o.city}` : ""
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerTotalCell, { order: withKeptCost(o, itemsByOrder.get(o.id) ?? []) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [
										(() => {
											const canChange = !shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id)) && resellerCanAct(o.status) && nextStatuses(o.status, "reseller").length > 0;
											const cls = `inline-block rounded-full px-2 py-0.5 text-[11px] capitalize whitespace-nowrap ${orderStatusTone(o.status)}`;
											return canChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												title: "Change status",
												onClick: () => setStatusModal({
													open: true,
													orderId: o.id,
													currentStatus: o.status
												}),
												className: `${cls} transition-shadow hover:ring-2 hover:ring-primary/30`,
												children: orderStatusLabel(o.status)
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cls,
												children: orderStatusLabel(o.status)
											});
										})(),
										o.status === "forwarded" && o.forwarded_to_admin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-[9px] text-success font-medium",
											children: "Sent to admin"
										}),
										orderShipment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-col items-center gap-0.5 min-w-0",
											children: [(() => {
												const u = courierTrackingUrl(orderShipment.provider, orderShipment, o.customer_phone);
												const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
														provider: orderShipment.provider,
														size: 12
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: courierLabel(orderShipment.provider)
													}),
													u && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0 opacity-60" })
												] });
												return u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: u,
													target: "_blank",
													rel: "noopener noreferrer",
													title: "Track on courier website",
													className: "flex items-center justify-center gap-1 text-[10px] font-bold text-primary leading-tight hover:underline",
													children: inner
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center justify-center gap-1 text-[10px] font-bold text-primary leading-tight",
													children: inner
												});
											})(), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground tabular-nums font-medium flex items-center justify-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "truncate",
													children: ["#", orderShipment.consignment_id || "N/A"]
												}), orderShipment.consignment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														navigator.clipboard.writeText(orderShipment.consignment_id || "");
														toast.success("Booking ID copied");
													},
													className: "opacity-50 hover:opacity-100 transition-opacity",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-2.5 w-2.5" })
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 inline-block text-[10px] italic text-muted-foreground/60",
											children: "Not booked yet"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdateCell, {
									meta: orderMeta[o.id],
									fallbackAt: o.created_at,
									onOpenNotes: () => setNotesModal({
										orderId: o.id,
										orderNumber: o.order_number,
										canWrite: resellerCanAct(o.status)
									})
								})
							]
						}),
						expandedOrders.includes(o.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t bg-muted/20 px-4 py-4 animate-in slide-in-from-top-2 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderItemsList, {
								items: stripItems(o.id),
								onZoom: setZoomImage,
								className: "mb-6"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2",
											children: "Shipping Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border bg-background p-3 text-sm shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: o.customer_name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground mt-1",
													children: o.address_line
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-muted-foreground",
													children: [
														o.area,
														", ",
														o.city
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 text-xs font-medium inline-block rounded bg-primary/10 px-2 py-1 text-primary uppercase",
													children: ["Payment: ", o.payment_method]
												})
											]
										})] }),
										o.reseller_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2",
											children: "Your Note"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 shadow-sm italic",
											children: o.reseller_note
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderMoneyPanel, {
											order: o,
											role: "reseller"
										})
									]
								})
							})]
						})
					]
				}, o.id);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage: filters.perPage,
			total: visible.length,
			onPage: setPage
		})] }),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDrawer, {
			orderId: selected.id,
			onClose: () => setSelected(null),
			onChanged: () => {
				const id = selected.id;
				setSelected(null);
				syncOrders([id]);
			},
			allProducts,
			depositBlocked: deposit.blocked,
			depositDue: deposit.due,
			depositBlockText: depositTexts.orderBlockToast
		}),
		open && resellerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOrderModal, {
			listings,
			allProducts,
			resellerId,
			onClose: () => setOpen(false),
			onCreated: () => {
				setOpen(false);
				load({ silent: true });
			}
		}),
		editId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderEditModal, {
			orderId: editId,
			allProducts,
			onClose: () => setEditId(null),
			onSaved: () => {
				const id = editId;
				setEditId(null);
				if (id) syncOrders([id]);
			}
		}),
		statusModal && statusModal.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200 sm:max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b px-5 py-4 bg-muted/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Change Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStatusModal(null),
							className: "rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-1.5",
							children: nextStatuses(statusModal.currentStatus, "reseller").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: loading || busy,
								onClick: async () => {
									if (s === "forwarded" && deposit.blocked) {
										toast.error(fillText(depositTexts.orderBlockToast, {
											due: deposit.due,
											required: deposit.requiredAmount,
											balance: deposit.balance,
											frozen: deposit.frozenAmount
										}));
										return;
									}
									if (statusModal.isBulk) {
										await bulkUpdateStatus(s);
										setStatusModal(null);
										return;
									}
									setBusy(true);
									const targetId = statusModal.orderId;
									const { error } = await supabase.from("orders").update({ status: s }).eq("id", targetId);
									if (error) toast.error(error.message);
									else {
										toast.success(`Status updated to ${orderStatusLabel(s)}`);
										setStatusModal(null);
										await syncOrders([targetId]);
									}
									setBusy(false);
								},
								className: `group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-all hover:bg-accent disabled:opacity-50 ${statusModal.currentStatus === s ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-transparent"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-background ${orderStatusTone(s).split(" ")[0]} ${statusModal.currentStatus === s ? "ring-primary/40" : "ring-transparent group-hover:ring-accent-foreground/10"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `flex-1 font-medium capitalize ${statusModal.currentStatus === s ? "text-primary" : "text-foreground/80"}`,
										children: orderStatusLabel(s)
									}),
									statusModal.currentStatus === s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" })
								]
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t bg-muted/10 px-5 py-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStatusModal(null),
							className: "rounded-lg border px-4 py-1.5 text-xs font-semibold transition-colors hover:bg-accent",
							children: "Cancel"
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: confirmModal.open,
			onClose: () => setConfirmModal((prev) => ({
				...prev,
				open: false
			})),
			onConfirm: confirmModal.onConfirm,
			title: confirmModal.title,
			description: confirmModal.description,
			variant: confirmModal.variant,
			isLoading: loading
		}),
		zoomImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageLightbox, {
			src: zoomImage,
			onClose: () => setZoomImage(null)
		}),
		notesModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotesModal, {
			orderId: notesModal.orderId,
			orderNumber: notesModal.orderNumber,
			authorRole: "reseller",
			canWrite: notesModal.canWrite,
			lockedHint: "Notes can only be added or edited while the order is New Order, Send To admin or Cancelled.",
			onClose: () => {
				const id = notesModal.orderId;
				setNotesModal(null);
				refreshMeta([id]);
			}
		})
	] });
}
function OrderDrawer({ orderId, onClose, onChanged, allProducts, depositBlocked, depositDue, depositBlockText }) {
	const fetchDetails = useServerFn(getOrderDetails);
	const recheckStatus = useServerFn(recheckCourierStatus);
	const syncSteadfast = useServerFn(syncSteadfastStatus);
	const syncPathao = useServerFn(syncPathaoStatus);
	useQueryClient();
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["order-details", orderId],
		queryFn: () => fetchDetails({ data: { orderId } })
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const recheckMutation = useMutation({
		mutationFn: async () => {
			const shipment = data?.shipments?.[0];
			if (!shipment) return;
			if (shipment.provider === "steadfast") return syncSteadfast({ data: { shipmentId: shipment.id } });
			else if (shipment.provider === "pathao") return syncPathao({ data: { shipmentId: shipment.id } });
			return recheckStatus({ data: { orderId } });
		},
		onSuccess: () => {
			toast.success("Courier status updated");
			refetch();
			onChanged();
		},
		onError: (err) => toast.error(err.message || "Failed to recheck status")
	});
	async function setStatus(next) {
		if (next === "forwarded" && depositBlocked) {
			toast.error(fillText(depositBlockText ?? DEFAULT_DEPOSIT_TEXTS.orderBlockToast, { due: depositDue ?? 0 }));
			return;
		}
		setBusy(true);
		const patch = next === "forwarded" ? {
			status: "forwarded",
			forwarded_to_admin: true,
			forwarded_at: (/* @__PURE__ */ new Date()).toISOString()
		} : next === "pending" ? {
			status: "pending",
			forwarded_to_admin: false,
			forwarded_at: null
		} : { status: "cancelled" };
		const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
		if (error) {
			toast.error(error.message);
			setBusy(false);
			return;
		}
		await supabase.from("order_status_history").insert({
			order_id: orderId,
			status: next
		});
		toast.success(next === "forwarded" ? "Order sent to admin" : next === "pending" ? "Order moved to New Order" : "Order cancelled");
		setBusy(false);
		onChanged();
		refetch();
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full w-full max-w-2xl bg-background p-8 flex items-center justify-center",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		})
	});
	if (!data?.order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-full w-full max-w-2xl bg-background p-8",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold",
					children: "Order Not Found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-2 hover:bg-muted transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "The requested order details could not be loaded. It might have been deleted or you may not have permission to view it."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "mt-4 btn-brand px-6 py-2 rounded-lg font-bold",
					children: "Close Drawer"
				})]
			})]
		})
	});
	const { order, items, shipments, events } = data;
	orderProfit(order);
	const allowedNext = nextStatuses(order.status, "reseller");
	const canAct = allowedNext.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "h-full w-full max-w-2xl overflow-y-auto bg-background p-6 shadow-2xl animate-in slide-in-from-right duration-300 sm:p-8",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold",
						children: order.order_number
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${orderStatusTone(order.status)}`,
						children: orderStatusLabel(order.status)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: new Date(order.created_at).toLocaleString()
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-2 hover:bg-muted transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					canAct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 surface-card p-4 border-primary/20 bg-primary/5",
						children: [
							allowedNext.includes("pending") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busy,
								onClick: () => setStatus("pending"),
								className: "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:bg-muted disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Move to New Order"]
							}),
							allowedNext.includes("forwarded") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busy,
								onClick: () => setStatus("forwarded"),
								className: "btn-brand inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Send to admin"]
							}),
							allowedNext.includes("cancelled") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busy,
								onClick: () => setStatus("cancelled"),
								className: "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-background px-4 py-2.5 text-sm font-bold text-destructive shadow-sm hover:bg-destructive/5 transition-all disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4" }), " Cancel Order"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Customer Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-base text-foreground",
										children: order.customer_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: order.customer_phone
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary mt-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "leading-relaxed",
											children: [
												order.address_line,
												", ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-primary uppercase text-[10px]",
													children: String(order.area || "").replace("_", " ")
												})
											]
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Order Meta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Payment Mode"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold uppercase text-[10px] bg-muted px-2 py-0.5 rounded",
											children: order.payment_method
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Payment Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold uppercase text-[10px] px-2 py-0.5 rounded ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
											children: order.payment_status
										})]
									}),
									order.forwarded_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Sent to Admin"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium",
											children: new Date(order.forwarded_at).toLocaleDateString()
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden border-amber-200 bg-amber-50/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-amber-100 bg-amber-50 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-[10px] font-bold uppercase tracking-widest text-amber-700 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), "Earnings Summary"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvanceChip, { order }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground",
									children: [
										order.payment_method,
										" · ",
										order.payment_status
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderMoneyPanel, {
								order,
								role: "reseller"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								"Ordered Products (",
								items.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: items.map((it, idx) => {
								const p = allProducts.find((x) => x.id === it.product_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 rounded-xl border bg-muted/20 p-3 transition-colors hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-background shadow-sm",
											children: p?.og_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.og_image_url,
												className: "h-full w-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full w-full items-center justify-center bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6 text-muted-foreground/40" })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-bold text-foreground",
												children: it.product_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex items-center gap-3 text-xs text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "bg-primary/5 text-primary px-1.5 py-0.5 rounded font-bold",
													children: ["Qty: ", it.quantity]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"৳",
													Number(it.reseller_price || 0).toLocaleString(),
													" / unit"
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-bold text-foreground",
												children: ["৳", Number(it.line_total || 0).toLocaleString()]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] font-bold text-green-600",
												children: ["Profit: ৳", Number(it.profit || 0).toLocaleString()]
											})]
										})
									]
								}, idx);
							})
						})]
					}),
					(order.reseller_note || order.notes) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: [order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-muted/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2",
								children: "Customer Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm italic text-foreground/80",
								children: [
									"\"",
									order.notes,
									"\""
								]
							})]
						}), order.reseller_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/10 bg-primary/[0.01] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-primary block mb-2",
								children: "Your Internal Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/80",
								children: order.reseller_note
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotes, {
						orderId: order.id,
						canWrite: resellerCanAct(order.status),
						authorRole: "reseller",
						lockedHint: "Notes can only be added or edited while the order is New Order, Send To admin or Cancelled."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b px-4 py-3 bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), "Delivery Information"]
							}), shipments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => recheckMutation.mutate(),
								disabled: recheckMutation.isPending,
								className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground shadow-sm transition-all hover:bg-accent disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3 w-3 ${recheckMutation.isPending ? "animate-spin" : ""}` }), "Check Updates"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: shipments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [shipments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-primary/20 bg-primary/[0.02] p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-2 rounded-lg bg-background shadow-sm border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
													provider: s.provider,
													size: 24
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [(() => {
												const trackUrl = courierTrackingUrl(s.provider, s, order.customer_phone);
												return trackUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: trackUrl,
													target: "_blank",
													rel: "noopener noreferrer",
													title: "Track on courier website",
													className: "text-sm font-bold flex items-center gap-1 text-primary hover:underline",
													children: [courierLabel(s.provider), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 opacity-70" })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-bold block",
													children: courierLabel(s.provider)
												});
											})(), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-mono text-muted-foreground uppercase tracking-wider",
												children: ["#", s.consignment_id || s.tracking_id]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20",
												children: s.status
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[10px] text-muted-foreground",
												children: ["Courier: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-medium",
													children: courierStatusLabel(s.courier_status, s.provider)
												})]
											})]
										})]
									})
								}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2",
										children: "Status History"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierTimeline, { events })]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center py-10 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5 text-muted-foreground/30" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-muted-foreground italic",
										children: "Awaiting admin booking"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider",
										children: "Tracking starts after courier pickup"
									})
								]
							})
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { OrdersPage as component };
