import { r as supabase } from "./client-KjQ-na90.js";
//#region src/lib/supplier.ts
/** Supplier marks returned items as received (single or bulk). */
async function receiveSupplierReturns(ids) {
	const { error } = await supabase.rpc("supplier_receive_returns", { _ids: ids });
	if (error) throw error;
}
function num(v) {
	return Number(v ?? 0) || 0;
}
function normalizeReport(raw) {
	const t = raw?.totals ?? {};
	return {
		supplier: raw?.supplier ?? null,
		totals: {
			sold_qty: num(t.sold_qty),
			earning: num(t.earning),
			upcoming_qty: num(t.upcoming_qty),
			upcoming_amount: num(t.upcoming_amount),
			supplied_qty: num(t.supplied_qty),
			supplied_value: num(t.supplied_value),
			returned_qty: num(t.returned_qty),
			returned_amount: num(t.returned_amount),
			returns_received_qty: num(t.returns_received_qty),
			returns_received_amount: num(t.returns_received_amount),
			returns_pending_qty: num(t.returns_pending_qty),
			returns_pending_amount: num(t.returns_pending_amount),
			returns_pending_handover: num(t.returns_pending_handover),
			paid: num(t.paid),
			pending_payout: num(t.pending_payout)
		},
		products: (raw?.products ?? []).map((p) => ({
			product_name: String(p.product_name ?? ""),
			unit_price: num(p.unit_price),
			orders: num(p.orders),
			supplied_qty: num(p.supplied_qty),
			supplied_value: num(p.supplied_value),
			delivered_qty: num(p.delivered_qty),
			delivered_value: num(p.delivered_value),
			pending_qty: num(p.pending_qty),
			pending_value: num(p.pending_value),
			returned_qty: num(p.returned_qty),
			returned_value: num(p.returned_value)
		})),
		sold: raw?.sold ?? [],
		upcoming: raw?.upcoming ?? [],
		returns: raw?.returns ?? [],
		payouts: raw?.payouts ?? [],
		settings: raw?.settings ?? null
	};
}
/** ONE call: supplier profile + totals + sold/upcoming items + returns + payouts. */
async function loadSupplierBootstrap() {
	const { data, error } = await supabase.rpc("supplier_bootstrap");
	if (error) throw error;
	if (!data || !data.supplier) return null;
	return normalizeReport(data);
}
async function loadSupplierReport(supplierId, from, to) {
	const { data, error } = await supabase.rpc("supplier_report", {
		_supplier: supplierId ?? null,
		_from: from ?? null,
		_to: to ?? null
	});
	if (error) throw error;
	if (!data) return null;
	return normalizeReport(data);
}
async function loadAdminSupplierOverview(from, to) {
	const { data, error } = await supabase.rpc("admin_supplier_overview", {
		_from: from ?? null,
		_to: to ?? null
	});
	if (error) throw error;
	const raw = data ?? {};
	return {
		suppliers: (raw.suppliers ?? []).map((s) => ({
			...s,
			products: num(s.products),
			sold_qty: num(s.sold_qty),
			earning: num(s.earning),
			supplied_qty: num(s.supplied_qty),
			supplied_value: num(s.supplied_value),
			pending_qty: num(s.pending_qty),
			pending_amount: num(s.pending_amount),
			returned_qty: num(s.returned_qty),
			returned_amount: num(s.returned_amount),
			paid: num(s.paid),
			pending_payout: num(s.pending_payout),
			pending_returns: num(s.pending_returns)
		})),
		returns: raw.returns ?? [],
		payouts: raw.payouts ?? []
	};
}
/** Admin hands returned items over to the supplier (single or bulk); `undo` reverts. */
async function handoverSupplierReturns(ids, undo = false) {
	const { error } = await supabase.rpc("admin_handover_returns", {
		_ids: ids,
		_undo: undo
	});
	if (error) throw error;
}
/** Withdrawable balance = earned on kept items − already paid − pending requests. */
function supplierAvailable(t) {
	return Math.max(t.earning - t.paid - t.pending_payout, 0);
}
var SUPPLIER_ORDER_LABEL = {
	delivered: "Delivered",
	partial_full: "Partial (full item)",
	partial_item: "Partial (item returned)",
	partial_delivery: "Delivery charge only",
	returned: "Returned",
	damaged: "Damaged",
	pending_return: "Pending return",
	pending_partial: "Pending partial"
};
function orderStatusLabel(status) {
	return SUPPLIER_ORDER_LABEL[status] ?? status.replace(/_/g, " ");
}
var bdtNum = (n) => `৳${Math.round(n).toLocaleString()}`;
/** ONE call: supplier's own products + brand/category options. */
async function loadSupplierProducts() {
	const { data, error } = await supabase.rpc("supplier_products");
	if (error) throw error;
	const raw = data ?? {};
	return {
		products: raw.products ?? [],
		brands: raw.brands ?? [],
		categories: raw.categories ?? []
	};
}
async function saveSupplierProduct(id, payload) {
	const { error } = await supabase.rpc("supplier_save_product", {
		_id: id,
		_payload: payload
	});
	if (error) throw error;
}
/** Inline list edit: stock/weight save instantly, price change waits for admin approval. */
async function supplierQuickUpdate(id, patch) {
	const { data, error } = await supabase.rpc("supplier_quick_update", {
		_id: id,
		_price: patch.price ?? null,
		_stock: patch.stock ?? null,
		_weight: patch.weight ?? null
	});
	if (error) throw error;
	const raw = data ?? {};
	return {
		price_pending: !!raw.price_pending,
		approval_status: String(raw.approval_status ?? "pending")
	};
}
async function reviewProduct(id, approve, note) {
	const { error } = await supabase.rpc("admin_review_product", {
		_id: id,
		_approve: approve,
		_note: note ?? null
	});
	if (error) throw error;
}
async function setProductSupplier(id, supplierId) {
	const { error } = await supabase.rpc("admin_set_product_supplier", {
		_id: id,
		_supplier: supplierId
	});
	if (error) throw error;
}
var APPROVAL_TONE = {
	approved: "bg-emerald-500/10 text-emerald-600",
	pending: "bg-amber-500/10 text-amber-600",
	rejected: "bg-destructive/10 text-destructive"
};
//#endregion
export { loadSupplierBootstrap as a, orderStatusLabel as c, saveSupplierProduct as d, setProductSupplier as f, loadAdminSupplierOverview as i, receiveSupplierReturns as l, supplierQuickUpdate as m, bdtNum as n, loadSupplierProducts as o, supplierAvailable as p, handoverSupplierReturns as r, loadSupplierReport as s, APPROVAL_TONE as t, reviewProduct as u };
