import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
//#region src/lib/finance-report.ts
var n = (v) => Number(v ?? 0) || 0;
/** Advance money already collected for this order. */
function orderAdvance(o) {
	return Math.max(n(o.advance_amount), 0);
}
/** Advance that sits in the reseller's own hand — deducted from their final amount. */
function resellerHeldAdvance(o) {
	return o.advance_by === "reseller" ? orderAdvance(o) : 0;
}
/** Delivered / partial / damaged — money is realized with received-amount math. */
function isRealizedStatus(status) {
	return status === "delivered" || status === "partial" || status === "partial_full" || status === "partial_item" || status === "partial_delivery" || status === "damaged";
}
/** Failed delivery — parcel came back, so only delivery + packaging is burned. */
function isFailedOrder(o) {
	return o.status === "returned" || o.status === "pending_return" || o.status === "cancelled";
}
/** Packaging cost of the order (already inside sa_cost_total). */
function orderPackaging(o) {
	return n(o.packaging_total);
}
/** Admin delivery cost used in every cost calculation. */
function orderDeliveryCost(o) {
	return n(o.delivery_cost) || n(o.shipping_cost);
}
/** Full product cost (admin price, packaging baade). */
function orderProductCost(o) {
	return Math.max(n(o.sa_cost_total) - orderPackaging(o), 0);
}
/** Product cost of the items the customer actually kept. */
function orderKeptProductCost(o) {
	if (o.status === "returned" || o.status === "cancelled" || o.status === "partial_delivery") return 0;
	if (o.status === "partial_item" && o.kept_product_cost != null && o.kept_product_cost !== "") return n(o.kept_product_cost);
	return orderProductCost(o);
}
/** Admin cost of the order: kept product cost + delivery + packaging. */
function orderCost(o) {
	if (o.status === "cancelled") return 0;
	return orderKeptProductCost(o) + orderDeliveryCost(o) + orderPackaging(o);
}
/**
* Money actually received for this order.
* Return / cancel = 0, otherwise courier collected amount + advance already taken,
* still running = expected customer total.
*/
function orderReceived(o) {
	if (isFailedOrder(o)) return 0;
	if (o.received_amount != null && o.received_amount !== "") return n(o.received_amount) + orderAdvance(o);
	return n(o.total);
}
/**
* Money that actually reached admin for this order.
* An advance the reseller collected never passes through admin's hands, so it is
* not admin cash — it only reduces what admin still owes the reseller. An advance
* held by admin is real admin cash, so nothing is removed there.
*/
function adminReceived(o) {
	if (isFailedOrder(o)) return 0;
	return orderReceived(o) - resellerHeldAdvance(o);
}
/** Partial delivery = courier collected less than the order value. */
function isPartialOrder(o) {
	if (o.status === "partial" || o.status === "partial_full" || o.status === "partial_item" || o.status === "partial_delivery") return true;
	return !isFailedOrder(o) && o.received_amount != null && o.received_amount !== "" && orderReceived(o) < n(o.total);
}
/** How much of the order value was never collected. */
function orderShortfall(o) {
	return Math.max(n(o.total) - orderReceived(o), 0);
}
/**
* Single source of truth for order profit / loss.
*  · delivered / partial_full / damaged → received − (product + delivery + packaging)
*  · partial_item → received − (kept product cost + delivery + packaging)
*  · partial_delivery → received − (delivery + packaging)
*  · returned / pending_return → loss of delivery + packaging
*  · cancelled → 0 (courier e jayni)
*  · still running → expected profit from the order total
* Advance taken by the reseller is deducted at the end (that cash is already with them);
* advance taken by admin stays with admin, so nothing extra is deducted.
*/
function orderProfit(o) {
	if (o.status === "cancelled") return 0;
	if (isFailedOrder(o)) return -(orderDeliveryCost(o) + orderPackaging(o));
	return orderReceived(o) - orderCost(o) - resellerHeldAdvance(o);
}
/** Reusable hint shown on every profit report/card so the math is transparent. */
var PROFIT_FORMULA_HINT = "Profit = received amount − product cost − delivery charge − packaging cost. Any advance already collected counts as received; an advance held by the reseller is deducted from their final amount, while an advance held by admin stays with admin. Partial (full item) uses the amount the courier actually collected against the full cost. Partial (item) charges only the items the customer kept — returned items go back to stock. Partial (delivery charge) means every product came back but the customer still paid the delivery charge, so that collected amount is counted as received and the cost is only delivery charge + packaging — no product cost. A fully returned parcel collects nothing, so it costs delivery charge + packaging, because the product comes back.";
var emptyBucket = () => ({
	orders: 0,
	gross: 0,
	delivery: 0,
	customerTotal: 0,
	adminCost: 0,
	packaging: 0,
	received: 0,
	shortfall: 0,
	partialOrders: 0,
	profit: 0
});
function addOrder(b, o) {
	b.orders += 1;
	b.gross += n(o.subtotal);
	b.delivery += n(o.shipping_cost);
	b.customerTotal += n(o.total);
	b.adminCost += n(o.sa_cost_total);
	b.packaging += orderPackaging(o);
	b.received += orderReceived(o);
	b.shortfall += orderShortfall(o);
	if (isPartialOrder(o)) b.partialOrders += 1;
	b.profit += orderProfit(o);
}
/** status -> order tab key (same buckets as the order list tabs). */
function statusTab(status) {
	for (const t of ORDER_TABS) if (t.key !== "all" && t.statuses.includes(status)) return t.key;
	return "all";
}
var REALIZED_STATUSES = [
	"delivered",
	"partial",
	"partial_full",
	"partial_item",
	"partial_delivery",
	"damaged"
];
var LOST_STATUSES = ["returned", "cancelled"];
var RISK_STATUSES = ["pending_return", "pending_partial"];
function buildFinanceReport(orders, items, opts = {}) {
	const byStatusTab = {};
	for (const t of ORDER_TABS) byStatusTab[t.key] = emptyBucket();
	const byStatus = {};
	const all = emptyBucket();
	const realized = emptyBucket();
	const settled = emptyBucket();
	const pipeline = emptyBucket();
	const risk = emptyBucket();
	const lost = emptyBucket();
	const orderById = /* @__PURE__ */ new Map();
	const trendMap = /* @__PURE__ */ new Map();
	const gran = opts.trend ?? "day";
	for (const o of orders) {
		orderById.set(o.id, o);
		addOrder(all, o);
		addOrder(byStatusTab[statusTab(o.status)] ?? byStatusTab.all, o);
		byStatus[o.status] = byStatus[o.status] ?? emptyBucket();
		addOrder(byStatus[o.status], o);
		if (REALIZED_STATUSES.includes(o.status)) {
			addOrder(realized, o);
			addOrder(settled, o);
		} else if (LOST_STATUSES.includes(o.status)) {
			addOrder(lost, o);
			addOrder(settled, o);
		} else if (RISK_STATUSES.includes(o.status)) addOrder(risk, o);
		else addOrder(pipeline, o);
		const d = new Date(o.created_at);
		const key = gran === "month" ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		const tp = trendMap.get(key) ?? {
			key,
			orders: 0,
			gross: 0,
			received: 0,
			profit: 0,
			deliveredProfit: 0
		};
		tp.orders += 1;
		tp.gross += n(o.subtotal);
		tp.received += orderReceived(o);
		tp.profit += orderProfit(o);
		if (REALIZED_STATUSES.includes(o.status) || LOST_STATUSES.includes(o.status)) tp.deliveredProfit += orderProfit(o);
		trendMap.set(key, tp);
	}
	const prodMap = /* @__PURE__ */ new Map();
	for (const it of items) {
		const order = orderById.get(it.order_id);
		if (!order) continue;
		const st = order.status;
		const key = it.product_id ?? it.product_name;
		let p = prodMap.get(key);
		if (!p) {
			p = {
				key,
				name: it.product_name,
				orders: 0,
				qty: 0,
				deliveredQty: 0,
				lostQty: 0,
				gross: 0,
				cost: 0,
				profit: 0,
				deliveredProfit: 0,
				_orders: /* @__PURE__ */ new Set()
			};
			prodMap.set(key, p);
		}
		p._orders.add(it.order_id);
		p.qty += it.quantity;
		p.gross += n(it.line_total);
		p.cost += n(it.sa_price) * it.quantity;
		p.profit += n(it.profit);
		/** Line share of the order — used to split partial shortfall / failed-delivery loss. */
		const share = n(order.subtotal) > 0 ? n(it.line_total) / n(order.subtotal) : 0;
		if (isFailedOrder(order)) {
			p.lostQty += it.quantity;
			p.deliveredProfit += orderProfit(order) * share;
		} else if (isRealizedStatus(st)) {
			p.deliveredQty += it.quantity;
			p.deliveredProfit += n(it.profit) - orderShortfall(order) * share;
		}
	}
	const products = Array.from(prodMap.values()).map(({ _orders, ...p }) => ({
		...p,
		orders: _orders.size
	})).sort((a, b) => b.gross - a.gross);
	const settledOrders = realized.orders + lost.orders;
	return {
		all,
		byStatusTab,
		byStatus,
		realized,
		settled,
		pipeline,
		risk,
		lost,
		products,
		trend: Array.from(trendMap.values()).sort((a, b) => a.key < b.key ? 1 : -1),
		deliveryRate: settledOrders ? realized.orders / settledOrders * 100 : 0,
		returnRate: settledOrders ? lost.orders / settledOrders * 100 : 0,
		avgOrderValue: all.orders ? all.customerTotal / all.orders : 0
	};
}
var bdt = (v) => `৳${Math.round(v).toLocaleString("en-US")}`;
/** Simple CSV builder used by every report export. */
function toCsv(headers, rows) {
	const esc = (v) => `"${String(v).replace(/"/g, "\"\"")}"`;
	return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}
function downloadCsv(filename, csv) {
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { toCsv as _, downloadCsv as a, orderAdvance as c, orderKeptProductCost as d, orderPackaging as f, resellerHeldAdvance as g, orderShortfall as h, buildFinanceReport as i, orderCost as l, orderReceived as m, adminReceived as n, isFailedOrder as o, orderProfit as p, bdt as r, isRealizedStatus as s, PROFIT_FORMULA_HINT as t, orderDeliveryCost as u };
