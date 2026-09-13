import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
import { R as initial_data_default, r as supabase } from "./client-BAn7XKYw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { a as isPartialStatus, l as orderStatusLabel, n as ORDER_TABS, r as SETTLEMENT_STATUSES, s as nextStatuses, t as ORDER_STATUS_OPTIONS, u as orderStatusTone } from "./courier-status-BxiQVHJB.js";
import { n as useQueryClient } from "./QueryClientProvider-CF67hjzh.js";
import { a as OrderNotePreview, c as OrderNotes, d as OrderProductCell, f as useQuery, i as LastUpdateCell, l as ImageLightbox, n as courierTrackingUrl, o as OrderNotesModal, r as OrderTabs, s as useOrderMeta, t as OrderSearch, u as OrderItemsList } from "./order-search-DA1uRV-E.js";
import { a as AdvanceChip, c as recheckCourierStatus, i as ResellerTotalCell, l as useMutation, n as OrderEditModal, o as OrderMoneyPanel, r as AdminTotalCell, s as getOrderDetails, t as CourierTimeline } from "./CourierTimeline-CMpUs4Av.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { $ as Printer, B as Settings2, E as SquareCheckBig, Hn as CircleUser, M as ShoppingCart, Nt as LoaderCircle, On as DollarSign, Sn as ExternalLink, Tn as EllipsisVertical, Y as RefreshCw, bn as Eye, er as ChevronDown, g as TrendingUp, it as Phone, jn as Copy, m as Truck, qn as CircleCheck, r as X, st as Pencil, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { t as Route } from "./orders-DcNcRILa.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { r as useCan } from "./use-auth-zbqaYCVZ.js";
import { c as filterByCourier, i as DEFAULT_ORDER_FILTERS, n as COURIER_FILTER_OPTIONS, o as activeFilterCount, r as DATE_PRESET_OPTIONS, s as applyOrderFilters, t as AREA_FILTER_OPTIONS } from "./order-filters-CRizD8DF.js";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-B_of1R8h.js";
import { i as usePaginated, r as Pagination } from "./data-list-D-TkvXUz.js";
import { S as withKeptCost, _ as keptQty } from "./business-report-DlB3Zbm8.js";
import { a as autoSyncCourierStatuses, f as syncPathaoStatus, i as courierLabel, n as CourierLogo, p as syncSteadfastStatus, t as COURIER_BRANDS } from "./courier-brand-Q4MwITLk.js";
import { r as getAdminLookups } from "./bootstrap-C_eam0yT.js";
import { t as NewOrderModal } from "./NewOrderModal-BLLsCzGr.js";
import { t as BulkScanButton } from "./BulkScanModal-BCPsLxbH.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-BJXhhGws.js";
import { a as getActiveCouriers, i as orderSupplierTint, n as printShippingLabels, r as ShipmentBookingModal } from "./labels-BWVwTl_O.js";
import { n as CalcPanel, r as CalcRow } from "./price-breakdown-BEjHLHM-.js";
//#region src/components/OrderSettleModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var import_jsx_runtime = require_jsx_runtime();
var num = (v) => Number(v ?? 0) || 0;
/** Partial receive kinds — admin picks one when settling a Pending Partial order. */
var PARTIAL_KINDS = [
	{
		key: "partial_full",
		label: "Partial (Full item)",
		hint: "Customer kept all items, paid less"
	},
	{
		key: "partial_item",
		label: "Partial (Item)",
		hint: "Some items returned"
	},
	{
		key: "partial_delivery",
		label: "Partial (Delivery Charge)",
		hint: "All items returned, delivery paid"
	}
];
function OrderSettleModal({ open, orderId, targetStatus, allowKindSwitch = false, onClose, onSaved }) {
	const [order, setOrder] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [received, setReceived] = (0, import_react.useState)(0);
	const [delivery, setDelivery] = (0, import_react.useState)(0);
	const [packaging, setPackaging] = (0, import_react.useState)(0);
	const [note, setNote] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)(targetStatus);
	(0, import_react.useEffect)(() => {
		if (open) setTarget(targetStatus);
	}, [open, targetStatus]);
	const itemPartial = target === "partial_item";
	const failed = target === "returned";
	const deliveryOnly = target === "partial_delivery";
	(0, import_react.useEffect)(() => {
		if (!open || !orderId) return;
		setLoading(true);
		(async () => {
			const [o, it] = await Promise.all([supabase.from("orders").select("id,order_number,customer_name,status,subtotal,discount,shipping_cost,total,sa_cost_total,packaging_total,delivery_cost,received_amount,settlement_note").eq("id", orderId).maybeSingle(), supabase.from("order_items").select("id,product_name,quantity,returned_qty,sa_price,reseller_price,line_total").eq("order_id", orderId)]);
			const row = o.data;
			setOrder(row);
			setItems((it.data ?? []).map((x) => ({
				...x,
				returned_qty: num(x.returned_qty)
			})));
			if (row) {
				const del = num(row.delivery_cost) || num(row.shipping_cost);
				setDelivery(del);
				setPackaging(num(row.packaging_total));
				setNote(row.settlement_note ?? "");
				setReceived(target === "returned" ? 0 : row.received_amount != null ? num(row.received_amount) : target === "partial_delivery" ? num(row.shipping_cost) : num(row.total));
			}
			setLoading(false);
		})();
	}, [
		open,
		orderId,
		target
	]);
	const calc = (0, import_react.useMemo)(() => {
		const fullProduct = Math.max(num(order?.sa_cost_total) - num(order?.packaging_total), 0);
		const fullItemCost = items.reduce((s, i) => s + num(i.sa_price) * i.quantity, 0);
		const keptItemCost = items.reduce((s, i) => s + num(i.sa_price) * Math.max(i.quantity - num(i.returned_qty), 0), 0);
		const productCost = failed || deliveryOnly ? 0 : itemPartial && fullItemCost > 0 ? Math.round(fullProduct * (keptItemCost / fullItemCost) * 100) / 100 : fullProduct;
		const recv = failed ? 0 : received;
		const cost = productCost + delivery + packaging;
		return {
			productCost,
			cost,
			recv,
			profit: Math.round((recv - cost) * 100) / 100
		};
	}, [
		order,
		items,
		itemPartial,
		failed,
		deliveryOnly,
		received,
		delivery,
		packaging
	]);
	if (!open || typeof document === "undefined") return null;
	const save = async () => {
		if (!order) return;
		if (itemPartial && !items.some((i) => num(i.returned_qty) > 0)) {
			toast.error("Enter which items were returned (returned qty)");
			return;
		}
		setSaving(true);
		const { error } = await supabase.from("orders").update({
			status: target,
			received_amount: failed ? 0 : received,
			delivery_cost: delivery,
			packaging_total: packaging,
			settlement_note: note || null,
			settled_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", order.id);
		if (error) {
			toast.error(error.message);
			setSaving(false);
			return;
		}
		if (itemPartial) for (const i of items) await supabase.from("order_items").update({ returned_qty: num(i.returned_qty) }).eq("id", i.id);
		await supabase.from("order_status_history").insert({
			order_id: order.id,
			status: target,
			note: note ? `Settled: ${note}` : `Settled as ${orderStatusLabel(target)}`
		});
		toast.success(`Order #${order.order_number} settled — ${orderStatusLabel(target)}`);
		setSaving(false);
		onSaved();
		onClose();
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-black/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b bg-muted/30 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-bold",
						children: ["Settle order — ", orderStatusLabel(target)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: order ? `#${order.order_number} · ${order.customer_name}` : "Loading…"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg p-1.5 text-muted-foreground hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				loading || !order ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center py-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 p-5",
					children: [
						allowKindSwitch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Partial receive type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 grid gap-2 sm:grid-cols-3",
							children: PARTIAL_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTarget(k.key),
								className: `rounded-lg border px-3 py-2 text-left transition-colors ${target === k.key ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-accent"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `text-xs font-semibold ${target === k.key ? "text-primary" : ""}`,
									children: k.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: k.hint
								})]
							}, k.key))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: failed ? "Received (return = 0)" : "Received amount",
									value: failed ? 0 : received,
									onChange: setReceived,
									disabled: failed,
									hint: `Customer total ${bdt(num(order.total))}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Delivery charge (cost)",
									value: delivery,
									onChange: setDelivery,
									hint: "Admin cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Packaging cost",
									value: packaging,
									onChange: setPackaging,
									hint: "Admin cost"
								})
							]
						}),
						itemPartial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b bg-muted/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Which items were returned"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y",
								children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 px-3 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs font-medium",
												children: i.product_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Qty ",
													i.quantity,
													" · sell ",
													bdt(num(i.line_total))
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											max: i.quantity,
											value: i.returned_qty,
											onChange: (e) => setItems((prev) => prev.map((x) => x.id === i.id ? {
												...x,
												returned_qty: Math.min(Math.max(num(e.target.value), 0), x.quantity)
											} : x)),
											className: "w-20 rounded-md border bg-background px-2 py-1 text-right text-xs tabular-nums"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "returned"
										})
									]
								}, i.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalcPanel, {
							title: "Reseller calculation",
							hint: "Received − product cost − delivery − packaging",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
									label: "Received from customer",
									value: bdt(calc.recv)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
									label: "− Product cost (kept items)",
									value: bdt(calc.productCost),
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
									label: "− Delivery charge",
									value: bdt(delivery),
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
									label: "− Packaging",
									value: bdt(packaging),
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalcRow, {
									label: "Reseller profit / loss",
									value: bdt(calc.profit),
									strong: true,
									tone: calc.profit >= 0 ? "success" : "danger"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Settlement note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: note,
							onChange: (e) => setNote(e.target.value),
							rows: 2,
							placeholder: "Write a short note — it will show in the transaction report",
							className: "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-xs"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 border-t bg-muted/10 px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border px-4 py-1.5 text-xs font-semibold hover:bg-accent",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						disabled: saving || loading || !order,
						className: "rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50",
						children: saving ? "Saving…" : "Settle order"
					})]
				})
			]
		})
	}), document.body);
}
function Field({ label, value, onChange, hint, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			min: 0,
			value,
			disabled,
			onChange: (e) => onChange(num(e.target.value)),
			className: "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm tabular-nums disabled:opacity-60"
		}),
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-[10px] text-muted-foreground",
			children: hint
		})
	] });
}
//#endregion
//#region src/routes/_authenticated/admin/orders.tsx?tsr-split=component
function AdminOrdersPage() {
	const can = useCan();
	const canCreate = can("orders.create");
	const canEdit = can("orders.edit");
	const canDelete = can("orders.delete");
	const canStatus = can("orders.status", "orders.edit");
	const canShip = can("orders.ship", "couriers.manage");
	const canSettle = can("orders.settle");
	const canBulkAny = canStatus || canShip || canDelete;
	const canOpenStatusFor = (o) => o.status === "pending_partial" ? canSettle : canStatus;
	const openStatusOrSettle = (o) => {
		if (o.status === "pending_partial") {
			if (!canSettle) return;
			setSettleModal({
				orderId: o.id,
				status: "partial_full",
				pickKind: true
			});
		} else {
			if (!canStatus) return;
			setStatusModal({
				open: true,
				orderId: o.id,
				currentStatus: o.status
			});
		}
	};
	const { tab: tabParam, reseller: resellerParam, q: qParam } = Route.useSearch();
	const navigate = Route.useNavigate();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [allOrders, setAllOrders] = (0, import_react.useState)([]);
	const [orderItems, setOrderItems] = (0, import_react.useState)([]);
	const [shipments, setShipments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)(tabParam ?? "all");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [allProducts, setAllProducts] = (0, import_react.useState)(initial_data_default.products || []);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [filters, setFilters] = (0, import_react.useState)({
		...DEFAULT_ORDER_FILTERS,
		reseller: resellerParam ?? "",
		q: qParam ?? ""
	});
	(0, import_react.useEffect)(() => {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					tab: tab === "all" ? void 0 : tab,
					reseller: filters.reseller || void 0
				};
				if (tab === "all") delete next.tab;
				if (!filters.reseller) delete next.reseller;
				return next;
			},
			replace: true
		});
	}, [tab, filters.reseller]);
	const [searchMode, setSearchMode] = (0, import_react.useState)("order");
	const [expandedOrders, setExpandedOrders] = (0, import_react.useState)([]);
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [pickOpen, setPickOpen] = (0, import_react.useState)(false);
	const [marked, setMarked] = (0, import_react.useState)([]);
	const [page, setPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		filters,
		tab,
		searchMode
	]);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [statusModal, setStatusModal] = (0, import_react.useState)(null);
	const [settleModal, setSettleModal] = (0, import_react.useState)(null);
	const [bookingModal, setBookingModal] = (0, import_react.useState)({
		open: false,
		orderIds: []
	});
	const [zoomImage, setZoomImage] = (0, import_react.useState)(null);
	const [notesModal, setNotesModal] = (0, import_react.useState)(null);
	const fetchActive = useServerFn(getActiveCouriers);
	const { data: activeProviders = [] } = useQuery({
		queryKey: ["active-couriers"],
		queryFn: () => fetchActive()
	});
	const runAutoSync = useServerFn(autoSyncCourierStatuses);
	useQuery({
		queryKey: ["courier-auto-sync"],
		queryFn: () => runAutoSync(),
		staleTime: 1800 * 1e3,
		refetchInterval: 1800 * 1e3,
		refetchOnWindowFocus: false
	});
	const activeProviderLabel = (0, import_react.useMemo)(() => {
		if (activeProviders.length === 1) return COURIER_BRANDS[activeProviders[0]]?.label || "Courier";
		return null;
	}, [activeProviders]);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		open: false,
		title: "",
		description: "",
		onConfirm: async () => {}
	});
	const [resellerOptions, setResellerOptions] = (0, import_react.useState)([]);
	const [supplierOptions, setSupplierOptions] = (0, import_react.useState)([]);
	const [suppliers, setSuppliers] = (0, import_react.useState)([]);
	const ORDER_SELECT = "id,reseller_id,order_number,customer_name,customer_phone,address_line,area,city,subtotal,discount,shipping_cost,sa_cost_total,packaging_total,delivery_cost,received_amount,advance_amount,advance_by,total,status,payment_status,payment_method,forwarded_to_admin,created_at,updated_at,reseller_note,admin_note,resellers(business_name,code,contact_phone,agents(display_name))";
	const ITEM_SELECT = "order_id,product_id,product_name,product_image,quantity,returned_qty,reseller_price,line_total,sa_price,buying_price,packaging_cost,supplier_id";
	const SHIPMENT_SELECT = "id,order_id,provider,tracking_id,tracking_url,consignment_id";
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
		if (!opts?.silent) setLoading(true);
		const statuses = ORDER_TABS.find((t) => t.key === tab)?.statuses ?? [];
		const [{ data: page }, lookups] = await Promise.all([supabase.rpc("admin_orders_page", { _statuses: statuses.length > 0 ? statuses : void 0 }), getAdminLookups()]);
		const pl = page ?? {};
		setOrders(pl.orders ?? []);
		setOrderItems(pl.items ?? []);
		setShipments(pl.shipments ?? []);
		setAllOrders(Object.entries(pl.status_counts ?? {}).filter(([status]) => status !== "all").flatMap(([status, count]) => Array.from({ length: Number(count) || 0 }, () => ({ status }))));
		const rs = pl.resellers ?? [];
		setResellerOptions([{
			value: "__direct__",
			label: "Direct (Admin / No Reseller)"
		}, ...rs.map((r) => ({
			value: r.id,
			label: `${r.business_name} (/${r.code})`
		}))]);
		setResellers(rs);
		const sp = pl.suppliers ?? [];
		setSuppliers(sp);
		setSupplierOptions([{
			value: "__admin_only__",
			label: "Admin only"
		}, ...sp.map((s) => ({
			value: s.id,
			label: s.display_name
		}))]);
		setAllProducts(lookups?.products ?? []);
		if (!opts?.silent) setLoading(false);
	}
	async function syncOrders(ids) {
		const list = ids.filter(Boolean);
		if (list.length === 0) return;
		const statuses = ORDER_TABS.find((t) => t.key === tab)?.statuses ?? [];
		const inTab = (s) => statuses.length === 0 || statuses.includes(s);
		const [{ data: rows }, { data: its }, { data: sh }, { data: allStats }] = await Promise.all([
			supabase.from("orders").select(ORDER_SELECT).in("id", list),
			supabase.from("order_items").select(ITEM_SELECT).in("order_id", list),
			supabase.from("shipments").select(SHIPMENT_SELECT).in("order_id", list),
			supabase.from("orders").select("status")
		]);
		const fetched = rows ?? [];
		setAllOrders(allStats ?? []);
		setOrders((prev) => {
			let next = prev.map((o) => fetched.find((f) => f.id === o.id) ?? o).filter((o) => !list.includes(o.id) || inTab(o.status));
			for (const f of fetched) if (!next.some((o) => o.id === f.id) && inTab(f.status)) next = [f, ...next];
			return next;
		});
		setOrderItems((prev) => [...prev.filter((i) => !list.includes(i.order_id)), ...its ?? []]);
		setShipments((prev) => [...prev.filter((s) => !list.includes(s.order_id)), ...sh ?? []]);
	}
	async function dropOrders(ids) {
		setOrders((prev) => prev.filter((o) => !ids.includes(o.id)));
		setOrderItems((prev) => prev.filter((i) => !ids.includes(i.order_id)));
		setShipments((prev) => prev.filter((s) => !ids.includes(s.order_id)));
		setMarked((prev) => prev.filter((id) => !ids.includes(id)));
		setExpandedOrders((prev) => prev.filter((id) => !ids.includes(id)));
		const { data: allStats } = await supabase.from("orders").select("status");
		setAllOrders(allStats ?? []);
	}
	async function removeOrder(id) {
		const order = orders.find((o) => o.id === id);
		if (!order) return;
		const isBooked = shipments.some((s) => (s.order_id === id || s.order_id === order.order_number) && (s.consignment_id || s.tracking_id));
		setConfirmModal({
			open: true,
			title: "Delete Order",
			description: isBooked ? "Warning: This order is already booked with a courier. Deleting it will NOT cancel the parcel in the courier system. Are you sure you want to proceed?" : "Are you sure you want to delete this order? This action cannot be undone.",
			variant: isBooked ? "warning" : "danger",
			onConfirm: async () => {
				setBusy(true);
				const { data: deleted, error } = await supabase.from("orders").delete().eq("id", id).select("id");
				if (error) toast.error(error.message);
				else {
					toast.success("Order deleted");
					await dropOrders([id]);
				}
				setConfirmModal((prev) => ({
					...prev,
					open: false
				}));
				setBusy(false);
			}
		});
	}
	async function bulkUpdateStatus(newStatus) {
		if (marked.length === 0) return;
		if (isPartialStatus(newStatus)) {
			toast.error("Partial statuses can't be set in bulk — settle each order individually.");
			return;
		}
		const blocked = marked.filter((id) => isPartialStatus(orders.find((o) => o.id === id)?.status || ""));
		if (blocked.length > 0) {
			toast.error(`${blocked.length} selected order(s) are in a partial status — bulk status change is blocked.`);
			return;
		}
		setConfirmModal({
			open: true,
			title: "Bulk Status Update",
			description: `Update ${marked.length} orders to ${orderStatusLabel(newStatus)}?`,
			variant: "warning",
			onConfirm: async () => {
				setBusy(true);
				const targetIds = [...marked];
				let error = null;
				if (newStatus === "delivered") for (const id of marked) {
					const o = orders.find((x) => x.id === id);
					const res = await supabase.from("orders").update({
						status: newStatus,
						received_amount: Number(o?.total ?? 0)
					}).eq("id", id);
					if (res.error) {
						error = res.error;
						break;
					}
				}
				else error = (await supabase.from("orders").update({ status: newStatus }).in("id", marked)).error;
				if (error) toast.error(error.message);
				else {
					toast.success(`${targetIds.length} orders updated`);
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
	}
	async function bulkDeleteOrders() {
		if (marked.length === 0) return;
		const bookedShipments = shipments.filter((s) => s.consignment_id || s.tracking_id);
		const bookedCount = marked.filter((id) => {
			const o = orders.find((x) => x.id === id);
			return bookedShipments.some((s) => s.order_id === id || o && s.order_id === o.order_number);
		}).length;
		setConfirmModal({
			open: true,
			title: "Delete Orders",
			description: bookedCount > 0 ? `Warning: ${bookedCount} of ${marked.length} selected orders are already booked with a courier. Deleting them will NOT cancel the parcels in the courier system. Proceed?` : `Delete ${marked.length} selected orders? This action cannot be undone.`,
			variant: bookedCount > 0 ? "warning" : "danger",
			onConfirm: async () => {
				setBusy(true);
				const targetIds = [...marked];
				const { data: deleted, error } = await supabase.from("orders").delete().in("id", targetIds).select("id");
				if (error) toast.error(error.message);
				else {
					toast.success(`${targetIds.length} orders deleted`);
					await dropOrders(targetIds);
				}
				setConfirmModal((prev) => ({
					...prev,
					open: false
				}));
				setBusy(false);
			}
		});
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [tab]);
	const itemsByOrder = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const it of orderItems) {
			const arr = m.get(it.order_id);
			if (arr) arr.push(it);
			else m.set(it.order_id, [it]);
		}
		return m;
	}, [orderItems]);
	const supplierNameById = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const s of suppliers) m.set(s.id, s.display_name);
		return m;
	}, [suppliers]);
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
			slug: p?.slug ?? null,
			supplier_name: it.supplier_name ?? (it.supplier_id ? supplierNameById.get(it.supplier_id) ?? null : null)
		};
	}), [
		itemsByOrder,
		allProducts,
		supplierNameById
	]);
	/**
	* Admin buying cost of the items the customer actually kept. Always the cost
	* frozen on the order line, so later catalog price edits never rewrite an old
	* order; only pre-snapshot legacy lines fall back to the product record.
	*/
	const buyingCostFor = (0, import_react.useCallback)((orderId, status) => {
		let cost = 0;
		for (const it of itemsByOrder.get(orderId) ?? []) {
			const snap = Number(it.buying_price) || 0;
			const unit = snap > 0 ? snap : Number(allProducts.find((x) => x.id === it.product_id)?.buying_price) || 0;
			cost += unit * keptQty({
				...it,
				returned_qty: it.returned_qty ?? 0
			}, status);
		}
		return cost;
	}, [itemsByOrder, allProducts]);
	/** Order with the kept-item product cost attached so partial_item money matches the DB. */
	const moneyOrder = (0, import_react.useCallback)((o) => withKeptCost(o, itemsByOrder.get(o.id) ?? []), [itemsByOrder]);
	const filtered = (0, import_react.useMemo)(() => {
		let base = applyOrderFilters(filterByCourier(orders, filters.courier, shipments), {
			...filters,
			q: ""
		});
		if (filters.supplier) if (filters.supplier === "__admin_only__") base = base.filter((o) => {
			const its = itemsByOrder.get(o.id) ?? [];
			return its.length > 0 && its.every((it) => !it.supplier_id);
		});
		else base = base.filter((o) => (itemsByOrder.get(o.id) ?? []).some((it) => it.supplier_id === filters.supplier));
		const q = filters.q.trim().toLowerCase();
		if (!q) return base;
		const has = (v) => (v ?? "").toLowerCase().includes(q);
		return base.filter((o) => {
			if (searchMode === "product") return (itemsByOrder.get(o.id) ?? []).some((it) => it.product_name.toLowerCase().includes(q));
			if (has(o.order_number) || has(o.customer_name) || has(o.customer_phone)) return true;
			return shipments.filter((s) => s.order_id === o.id).some((s) => has(s.consignment_id) || has(s.tracking_id) || has(s.provider));
		});
	}, [
		orders,
		filters,
		itemsByOrder,
		searchMode,
		shipments
	]);
	const paged = usePaginated(filtered, page, filters.perPage);
	const { meta: orderMeta, refresh: refreshMeta } = useOrderMeta(paged.map((o) => o.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			className: "flex-row items-center justify-between",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [!isPartialStatus(tab) && canStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkScanButton, {
					mode: tab === "pending_return" ? "return" : "handover",
					onDone: () => void load({ silent: true })
				}), canCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpen(true),
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Order"]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
						options: resellerOptions.map((r) => ({
							value: r.value,
							label: r.label
						})),
						value: filters.reseller,
						onChange: (v) => {
							setFilters({
								...filters,
								reseller: v
							});
							if (v) setTab("all");
						},
						placeholder: "All resellers",
						searchPlaceholder: "Search reseller…",
						className: "w-full lg:w-[150px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
						options: supplierOptions.map((s) => ({
							value: s.value,
							label: s.label
						})),
						value: filters.supplier,
						onChange: (v) => {
							setFilters({
								...filters,
								supplier: v
							});
							if (v) setTab("all");
						},
						placeholder: "All suppliers",
						searchPlaceholder: "Search supplier…",
						className: "w-full lg:w-[150px]"
					}),
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
								return sts.length === 0 ? allOrders.length : allOrders.filter((o) => sts.includes(o.status)).length;
							},
							className: "w-full min-w-0"
						})
					}),
					activeFilterCount(filters) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilters({
							...DEFAULT_ORDER_FILTERS,
							perPage: filters.perPage,
							q: filters.q
						}),
						className: "col-span-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 px-3 text-xs font-medium hover:bg-accent lg:col-span-1 lg:w-auto",
						title: "Reset filters",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }),
							" Reset (",
							activeFilterCount(filters),
							")"
						]
					})
				]
			})]
		}),
		filters.datePreset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-2 rounded-md border border-dashed p-2 sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium text-muted-foreground",
					children: "From"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: filters.from,
					max: filters.to || void 0,
					onChange: (e) => setFilters({
						...filters,
						from: e.target.value
					}),
					className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-w-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium text-muted-foreground",
					children: "To"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: filters.to,
					min: filters.from || void 0,
					onChange: (e) => setFilters({
						...filters,
						to: e.target.value
					}),
					className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			})]
		}),
		canBulkAny && marked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				canStatus && (() => {
					const partialMarked = marked.some((id) => isPartialStatus(orders.find((o) => o.id === id)?.status || ""));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: partialMarked,
						title: partialMarked ? "Partial orders must be settled one by one" : void 0,
						onClick: () => {
							if (partialMarked) {
								toast.error("Partial orders can't be changed in bulk — settle each order individually.");
								return;
							}
							setStatusModal({
								open: true,
								orderId: marked[0],
								currentStatus: orders.find((x) => x.id === marked[0])?.status || "confirmed",
								isBulk: true
							});
						},
						className: "inline-flex h-9 items-center gap-2 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 text-xs font-medium text-blue-600 hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" }), " Change Status"]
					});
				})(),
				canShip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => printShippingLabels(marked),
					className: "inline-flex h-9 items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), " Print Labels"]
				}),
				canShip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setBookingModal({
						open: true,
						orderIds: marked
					}),
					className: "inline-flex h-9 items-center gap-2 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 text-xs font-medium text-violet-600 hover:bg-violet-500/20 dark:text-violet-400",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }),
						" ",
						activeProviderLabel ? `Book ${activeProviderLabel}` : "Book Courier"
					]
				}),
				canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: bulkDeleteOrders,
					className: "inline-flex h-9 items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMarked([]),
					className: "ml-auto text-xs text-muted-foreground hover:text-foreground",
					children: "Clear"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden sm:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTabs, {
				tab,
				onChange: setTab,
				count: (key) => {
					const sts = ORDER_TABS.find((t) => t.key === key)?.statuses ?? [];
					return sts.length === 0 ? allOrders.length : allOrders.filter((o) => sts.includes(o.status)).length;
				}
			})
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-12 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[30px_minmax(66px,0.6fr)_minmax(110px,0.9fr)_minmax(110px,0.9fr)_minmax(110px,1fr)_96px_104px_124px_minmax(112px,0.9fr)] items-start gap-2 rounded-lg border bg-muted/40 px-2 py-2.5 text-xs font-medium text-muted-foreground lg:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: canBulkAny && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Reseller"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Products"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Customer"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Reseller total"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Admin total"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Status"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: "Last update"
					})
				]
			}), paged.map((o) => {
				const tint = orderSupplierTint((itemsByOrder.get(o.id) ?? []).map((it) => it.supplier_id));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: tint?.style,
					title: tint ? tint.mixed ? "Multiple suppliers" : "Supplier order" : void 0,
					className: `overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40 ${marked.includes(o.id) ? "border-primary ring-1 ring-primary/30" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 p-3 lg:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [
										canBulkAny && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]",
											checked: marked.includes(o.id),
											onChange: (e) => setMarked((prev) => e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id))
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
										canOpenStatusFor(o) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											title: "Change status",
											onClick: () => openStatusOrSettle(o),
											className: `shrink-0 rounded-full px-2 py-0.5 text-[11px] transition-shadow hover:ring-2 hover:ring-primary/30 ${orderStatusTone(o.status)}`,
											children: orderStatusLabel(o.status)
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `shrink-0 rounded-full px-2 py-0.5 text-[11px] ${orderStatusTone(o.status)}`,
											children: orderStatusLabel(o.status)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "shrink-0 rounded-md border p-0.5 transition-colors hover:bg-accent",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setSelected(o),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View Details"]
												}),
												canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setEditId(o.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit Order"]
												}),
												canOpenStatusFor(o) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => openStatusOrSettle(o),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "mr-2 h-4 w-4" }), " Change Status"]
												}),
												canShip && !shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id)) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setBookingModal({
														open: true,
														orderIds: [o.id]
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mr-2 h-4 w-4" }),
														" ",
														activeProviderLabel ? `Book ${activeProviderLabel}` : "Book Courier"
													]
												}),
												canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => removeOrder(o.id),
													className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete Order"]
												})
											]
										})] }),
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
														className: "shrink-0 text-primary hover:text-primary/80",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => {
															navigator.clipboard.writeText(o.customer_phone);
															toast.success("Copied");
														},
														className: "shrink-0 text-muted-foreground hover:text-foreground",
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
										className: "min-w-0 space-y-0.5 border-l pl-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70",
												children: "Reseller"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs font-medium",
												children: o.resellers?.business_name || "Direct"
											}),
											o.resellers?.contact_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 items-center gap-1 text-[11px] tabular-nums text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: o.resellers.contact_phone
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `tel:${o.resellers.contact_phone}`,
													className: "shrink-0 text-primary hover:text-primary/80",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: o.resellers?.agents?.display_name || "No agent"
												})]
											})
										]
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
										}), shipments.filter((s) => s.order_id === o.id || s.order_id === o.order_number).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1",
											children: shipments.filter((s) => s.order_id === o.id || s.order_id === o.order_number).map((s) => {
												const url = courierTrackingUrl(s.provider, s, o.customer_phone);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex max-w-full items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ring-muted-foreground/10",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
															provider: s.provider,
															size: 12
														}),
														url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
															href: url,
															target: "_blank",
															rel: "noopener noreferrer",
															className: "inline-flex items-center gap-0.5 font-bold text-primary hover:underline",
															children: [courierLabel(s.provider), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2 w-2" })]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-primary",
															children: courierLabel(s.provider)
														}),
														s.consignment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "truncate text-muted-foreground",
															children: ["#", s.consignment_id]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => {
																navigator.clipboard.writeText(s.consignment_id || "");
																toast.success("Booking ID copied");
															},
															className: "shrink-0 opacity-50 hover:opacity-100",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-2.5 w-2.5" })
														})] })
													]
												}, s.id);
											})
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
												orderNumber: o.order_number
											})
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerTotalCell, { order: moneyOrder(o) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTotalCell, {
										order: moneyOrder(o),
										buyingCost: buyingCostFor(o.id, o.status)
									})]
								}),
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
											orderNumber: o.order_number
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden grid-cols-[30px_minmax(66px,0.6fr)_minmax(110px,0.9fr)_minmax(110px,0.9fr)_minmax(110px,1fr)_96px_104px_124px_minmax(112px,0.9fr)] items-start gap-2 border-b bg-muted/30 px-2 py-3 text-sm lg:grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5",
									children: [
										canBulkAny && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "h-4 w-4 accent-[hsl(var(--primary))]",
											checked: marked.includes(o.id),
											onChange: (e) => setMarked((prev) => e.target.checked ? [...prev, o.id] : prev.filter((x) => x !== o.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "rounded-md border p-0.5 hover:bg-accent transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "start",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setSelected(o),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View Details"]
												}),
												canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setEditId(o.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit Order"]
												}),
												canOpenStatusFor(o) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => openStatusOrSettle(o),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "mr-2 h-4 w-4" }), " Change Status"]
												}),
												canShip && (() => {
													if (!shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id))) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => setBookingModal({
															open: true,
															orderIds: [o.id]
														}),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mr-2 h-4 w-4" }),
															" ",
															activeProviderLabel ? `Book ${activeProviderLabel}` : "Book Courier"
														]
													});
													return null;
												})(),
												canDelete && (() => {
													shipments.some((s) => (s.order_id === o.id || s.order_id === o.order_number) && (s.consignment_id || s.tracking_id));
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => removeOrder(o.id),
														className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete Order"]
													});
												})()
											]
										})] }),
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium truncate",
											children: o.resellers?.business_name || "Direct"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground",
											children: [o.resellers?.contact_phone || "—", o.resellers?.contact_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `tel:${o.resellers.contact_phone}`,
												className: "text-primary hover:text-primary/80",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													navigator.clipboard.writeText(o.resellers?.contact_phone || "");
													toast.success("Copied");
												},
												className: "hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground/70 truncate",
											children: o.resellers?.agents?.display_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "h-2.5 w-2.5" }), o.resellers.agents.display_name]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "italic",
												children: "no agent"
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderProductCell, {
									items: stripItems(o.id),
									expanded: expandedOrders.includes(o.id),
									onZoom: setZoomImage,
									onToggle: () => setExpandedOrders((prev) => prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium truncate",
											children: o.customer_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground",
											children: [
												o.customer_phone,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `tel:${o.customer_phone}`,
													className: "text-primary hover:text-primary/80",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														navigator.clipboard.writeText(o.customer_phone);
														toast.success("Copied");
													},
													className: "hover:text-foreground",
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
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerTotalCell, { order: moneyOrder(o) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTotalCell, {
										order: moneyOrder(o),
										buyingCost: buyingCostFor(o.id, o.status)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 text-center",
									children: [canOpenStatusFor(o) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										title: "Change status",
										onClick: () => openStatusOrSettle(o),
										className: `px-2 py-0.5 rounded-full text-[11px] transition-shadow hover:ring-2 hover:ring-primary/30 ${orderStatusTone(o.status)}`,
										children: orderStatusLabel(o.status)
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded-full text-[11px] ${orderStatusTone(o.status)}`,
										children: orderStatusLabel(o.status)
									}), shipments.filter((s) => s.order_id === o.id || s.order_id === o.order_number).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 space-y-0.5",
										children: shipments.filter((s) => s.order_id === o.id || s.order_id === o.order_number).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-0.5 min-w-0",
											children: [(() => {
												const url = courierTrackingUrl(s.provider, s, o.customer_phone);
												const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
														provider: s.provider,
														size: 12
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: courierLabel(s.provider)
													}),
													url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5 shrink-0 opacity-60" })
												] });
												return url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: url,
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
													children: ["#", s.consignment_id || "N/A"]
												}), s.consignment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														navigator.clipboard.writeText(s.consignment_id);
														toast.success("Booking ID copied");
													},
													className: "opacity-50 hover:opacity-100 transition-opacity",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-2.5 w-2.5" })
												})]
											})]
										}, s.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 inline-block text-[10px] italic text-muted-foreground/60",
										children: "Not booked yet"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastUpdateCell, {
									meta: orderMeta[o.id],
									fallbackAt: o.created_at,
									onOpenNotes: () => setNotesModal({
										orderId: o.id,
										orderNumber: o.order_number
									})
								})
							]
						}),
						expandedOrders.includes(o.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-muted/30 px-4 py-5 md:px-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderItemsList, {
									items: stripItems(o.id),
									onZoom: setZoomImage
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Shipping Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border bg-background p-3 text-sm shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: o.customer_name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-0.5 font-mono text-xs text-muted-foreground",
													children: o.customer_phone
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 text-muted-foreground",
													children: o.address_line
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-muted-foreground",
													children: [o.area?.replace("_", " "), o.city ? `, ${o.city}` : ""]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-2 inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium uppercase text-primary",
													children: ["Payment: ", o.payment_method]
												}),
												(() => {
													if (shipments.some((s) => s.order_id === o.id && (s.consignment_id || s.tracking_id))) return null;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-3 border-t pt-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															onClick: () => setBookingModal({
																open: true,
																orderIds: [o.id]
															}),
															className: "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }),
																" ",
																activeProviderLabel ? `Book ${activeProviderLabel}` : "Book Courier"
															]
														})
													});
												})()
											]
										})] }),
										o.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1 block text-[10px] font-bold uppercase",
												children: "Admin Note"
											}), o.admin_note]
										}),
										o.reseller_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border bg-background p-3 text-sm italic text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-[10px] font-bold uppercase not-italic",
													children: "Reseller Note"
												}),
												"\"",
												o.reseller_note,
												"\""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderMoneyPanel, {
											order: o,
											role: "admin"
										})
									]
								})]
							})
						})
					]
				}, o.id);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage: filters.perPage,
			total: filtered.length,
			onPage: setPage
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
		statusModal && statusModal.open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-2xl overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200",
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
						className: "max-h-[70vh] modal-scroll p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
							children: (() => {
								const recommended = statusModal.isBulk ? [] : nextStatuses(statusModal.currentStatus, "admin");
								const list = Array.from(/* @__PURE__ */ new Set([
									...recommended,
									statusModal.currentStatus,
									...ORDER_STATUS_OPTIONS
								]));
								const rank = (s) => {
									const i = ORDER_STATUS_OPTIONS.indexOf(s);
									return i === -1 ? 999 : i;
								};
								return list.slice().sort((a, b) => rank(a) - rank(b));
							})().map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: loading || busy,
								onClick: async () => {
									if (statusModal.isBulk) {
										await bulkUpdateStatus(s);
										setStatusModal(null);
										return;
									}
									if (SETTLEMENT_STATUSES.includes(s)) {
										if (!canSettle) {
											toast.error("You don't have permission to settle orders.");
											return;
										}
										setSettleModal({
											orderId: statusModal.orderId,
											status: s
										});
										setStatusModal(null);
										return;
									}
									setBusy(true);
									const targetId = statusModal.orderId;
									const curr = orders.find((o) => o.id === targetId);
									const patch = { status: s };
									if (s === "delivered") patch.received_amount = Number(curr?.total ?? 0);
									const { error } = await supabase.from("orders").update(patch).eq("id", statusModal.orderId);
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderSettleModal, {
			open: !!settleModal,
			orderId: settleModal?.orderId ?? null,
			targetStatus: settleModal?.status ?? "delivered",
			allowKindSwitch: !!settleModal?.pickKind,
			onClose: () => setSettleModal(null),
			onSaved: () => {
				const id = settleModal?.orderId;
				if (id) syncOrders([id]);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShipmentBookingModal, {
			isOpen: bookingModal.open,
			onClose: () => setBookingModal({
				open: false,
				orderIds: []
			}),
			orderIds: bookingModal.orderIds,
			onSuccess: () => {
				const ids = [...bookingModal.orderIds];
				setMarked([]);
				syncOrders(ids);
			}
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOrderModal, {
			listings: [],
			allProducts,
			resellers,
			isAdmin: true,
			onClose: () => setOpen(false),
			onCreated: () => {
				setOpen(false);
				load({ silent: true });
			}
		}),
		editId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderEditModal, {
			orderId: editId,
			allProducts,
			isAdmin: true,
			onClose: () => setEditId(null),
			onSaved: () => {
				const id = editId;
				setEditId(null);
				if (id) syncOrders([id]);
			}
		}),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDrawer, {
			orderId: selected.id,
			onClose: () => setSelected(null),
			allProducts
		}),
		zoomImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageLightbox, {
			src: zoomImage,
			onClose: () => setZoomImage(null)
		}),
		notesModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotesModal, {
			orderId: notesModal.orderId,
			orderNumber: notesModal.orderNumber,
			authorRole: "admin",
			canWrite: true,
			onClose: () => {
				const id = notesModal.orderId;
				setNotesModal(null);
				refreshMeta([id]);
			}
		})
	] });
}
function OrderDrawer({ orderId, onClose, allProducts }) {
	const fetchDetails = useServerFn(getOrderDetails);
	const recheckStatus = useServerFn(recheckCourierStatus);
	const syncSteadfast = useServerFn(syncSteadfastStatus);
	const syncPathao = useServerFn(syncPathaoStatus);
	const queryClient = useQueryClient();
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["order-details", orderId],
		queryFn: () => fetchDetails({ data: { orderId } })
	});
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
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (err) => toast.error(err.message || "Failed to recheck status")
	});
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
													children: order.area.replace("_", " ")
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
								children: "Source / Reseller"
							}), order.resellers ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-foreground",
										children: order.resellers.business_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-mono bg-muted/50 px-2 py-0.5 rounded inline-block",
										children: ["ID: ", order.resellers.code]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.resellers.contact_phone || "—" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: order.resellers.agents?.display_name || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "italic text-muted-foreground/60",
												children: "No agent assigned"
											})
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 py-2 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: "Direct Platform Sale"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden border-primary/20 bg-primary/[0.02]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-primary/10 bg-primary/5 px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-3.5 w-3.5" }), "Financial Breakdown"]
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
								role: "admin"
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
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-bold text-foreground",
												children: ["৳", Number(it.line_total || 0).toLocaleString()]
											})
										})
									]
								}, idx);
							})
						})]
					}),
					(order.reseller_note || order.admin_note) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: [order.reseller_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-muted/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2",
								children: "Reseller Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm italic text-foreground/80",
								children: [
									"\"",
									order.reseller_note,
									"\""
								]
							})]
						}), order.admin_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-primary/10 bg-primary/[0.01] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-primary block mb-2",
								children: "Admin Internal Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/80",
								children: order.admin_note
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotes, {
						orderId: order.id,
						canWrite: true,
						authorRole: "admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b px-4 py-3 bg-muted/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), "Courier Logistics"]
							}), shipments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => recheckMutation.mutate(),
								disabled: recheckMutation.isPending,
								className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-[10px] font-bold text-foreground shadow-sm transition-all hover:bg-accent disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3 w-3 ${recheckMutation.isPending ? "animate-spin" : ""}` }), "Recheck Status"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: shipments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [shipments.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-primary/20 bg-primary/[0.02] p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
													children: s.courier_status || "Processing"
												})]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4 border-t pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center p-2 rounded-lg bg-background/50 border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold text-muted-foreground uppercase block mb-1",
												children: "COD Amount"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-bold",
												children: ["৳", Number(s.cod_amount || 0).toLocaleString()]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center p-2 rounded-lg bg-background/50 border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-bold text-muted-foreground uppercase block mb-1",
												children: "Shipping Charge"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-bold",
												children: ["৳", Number(s.delivery_charge || 0).toLocaleString()]
											})]
										})]
									})]
								}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2",
										children: "Status Timeline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierTimeline, { events })]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center py-12 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-6 w-6 text-muted-foreground/30" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-muted-foreground italic",
										children: "Order not yet booked with any courier"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider",
										children: "Booking required to start tracking"
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
export { AdminOrdersPage as component };
