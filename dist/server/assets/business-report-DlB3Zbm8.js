import { f as orderPackaging, m as orderReceived, n as adminReceived, p as orderProfit, u as orderDeliveryCost } from "./finance-report-Dwy2dA23.js";
//#region src/lib/business-report.ts
var n = (v) => Number(v ?? 0) || 0;
var EXPENSE_CATEGORIES = [
	"delivery",
	"packaging",
	"salary",
	"marketing",
	"office",
	"courier",
	"refund",
	"other"
];
var ADMIN_PROFIT_HINT = "Admin profit = money received for the order − what the reseller finally earns − admin buying price of the products the customer kept. Advance already collected counts as received (the same way the transaction report does it). Delivery charge and packaging are not deducted twice here — record them once in Expenses and the net profit takes them out.";
/**
* Quantity of an item the customer actually kept.
* Fully failed statuses keep nothing; an in-flight order still counts the full
* quantity, otherwise a pending order would look like it had zero product cost.
*/
function keptQty(item, status) {
	if (status === "cancelled" || status === "returned" || status === "pending_return" || status === "partial_delivery") return 0;
	return Math.max(Number(item.quantity) - Number(item.returned_qty ?? 0), 0);
}
/**
* Reseller-side product cost of the kept items, mirroring the SQL
* `order_kept_product_cost` (proportional share of sa_cost_total) so client math
* and the DB-stored profit never disagree on `partial_item` orders.
*/
function keptProductCost(o, items) {
	const full = items.reduce((s, it) => s + n(it.sa_price) * Number(it.quantity), 0);
	const kept = items.reduce((s, it) => s + n(it.sa_price) * keptQty(it, String(o.status ?? "")), 0);
	const productCost = Math.max(n(o.sa_cost_total) - n(o.packaging_total), 0);
	if (full <= 0) return productCost;
	return Math.round(productCost * (kept / full) * 100) / 100;
}
/** Order object with the kept-product cost attached, ready for orderProfit(). */
function withKeptCost(o, items) {
	return {
		...o,
		kept_product_cost: keptProductCost(o, items)
	};
}
var DELIVERED_STATUSES = ["delivered"];
var PARTIAL_STATUSES = [
	"partial",
	"partial_full",
	"partial_item",
	"partial_delivery",
	"damaged"
];
var COMPLETED_STATUSES = [...DELIVERED_STATUSES, ...PARTIAL_STATUSES];
var FAILED_STATUSES = [
	"returned",
	"pending_return",
	"cancelled"
];
var RUNNING_STATUSES = [
	"draft",
	"pending",
	"confirmed",
	"forwarded",
	"packaging",
	"ready_to_ship",
	"processing",
	"shipped",
	"pending_partial"
];
var SCOPE_STATUSES = {
	completed: COMPLETED_STATUSES,
	delivered: DELIVERED_STATUSES,
	partial: PARTIAL_STATUSES,
	failed: FAILED_STATUSES,
	running: RUNNING_STATUSES,
	all: null
};
var SCOPE_OPTIONS = [
	{
		value: "completed",
		label: "Completed (delivered + partial)",
		hint: "Default — every finished parcel, partial amounts added or subtracted"
	},
	{
		value: "delivered",
		label: "Delivered only",
		hint: "Full delivery, full money collected"
	},
	{
		value: "partial",
		label: "Partial / damaged",
		hint: "Parcels where only part of the money or the items came through"
	},
	{
		value: "failed",
		label: "Returned / cancelled",
		hint: "Money lost — only delivery charge and packaging burned"
	},
	{
		value: "running",
		label: "In progress",
		hint: "Not finished yet — money not counted as earned"
	},
	{
		value: "all",
		label: "All orders",
		hint: "Everything, running orders shown as pipeline only"
	}
];
/** Keep only the orders that belong to the chosen scope. */
function scopeOrders(orders, scope) {
	const allow = SCOPE_STATUSES[scope];
	if (!allow) return orders;
	const set = new Set(allow);
	return orders.filter((o) => set.has(o.status));
}
/**
* True when the parcel is finished, so its money is final.
* A running order has collected nothing yet — counting its expected total as
* "received" is exactly what made the old report wrong.
*/
function isMoneyFinal(status) {
	return !RUNNING_STATUSES.includes(String(status ?? ""));
}
/** Received money that is actually in hand (0 while the order is still running). */
function finalReceived(o) {
	return isMoneyFinal(o.status) ? orderReceived(o) : 0;
}
/** Reseller profit that is actually earned (0 while the order is still running). */
function finalProfit(o) {
	return isMoneyFinal(o.status) ? orderProfit(o) : 0;
}
/**
* Cash that actually reached admin (0 while running). An advance the reseller
* collected stays in the reseller's hand — it is never admin income, it only
* lowers the payout, so it must be excluded from every admin profit line.
*/
function finalAdminReceived(o) {
	return isMoneyFinal(o.status) ? adminReceived(o) : 0;
}
/**
* What admin really paid the courier for this parcel: the booked shipment cost
* when we have it, otherwise the admin-set delivery cost of the order.
* Cancelled orders never went to the courier, so they cost nothing.
*/
function adminDeliverySpend(o, shipmentCost) {
	if (o.status === "cancelled" || !isMoneyFinal(o.status)) return 0;
	const booked = n(shipmentCost);
	return booked > 0 ? booked : orderDeliveryCost(o);
}
/** Map order_id -> booked courier cost (first shipment wins). */
function shipmentCostMap(shipments) {
	const m = /* @__PURE__ */ new Map();
	for (const s of shipments) if (!m.has(s.order_id)) m.set(s.order_id, n(s.cost));
	return m;
}
/** Group order items by order id. */
function groupItems(items) {
	const m = /* @__PURE__ */ new Map();
	for (const it of items) {
		const arr = m.get(it.order_id) ?? [];
		arr.push(it);
		m.set(it.order_id, arr);
	}
	return m;
}
/**
* Buying price used for reporting: always the value frozen on the order line, so
* changing a product's price later never rewrites past orders. Only very old
* lines with no snapshot fall back to the product record.
*/
function lineBuyingPrice(it, products) {
	const snap = n(it.buying_price);
	if (snap > 0) return snap;
	return n((it.product_id ? products.get(it.product_id) : void 0)?.buying_price);
}
/** Admin buying cost of the kept items of one order. */
function orderBuyingCost(items, status, products) {
	let cost = 0;
	for (const it of items) cost += lineBuyingPrice(it, products) * keptQty(it, status);
	return cost;
}
function buildProductRows(orders, items, products) {
	const byId = new Map(orders.map((o) => [o.id, o]));
	const map = /* @__PURE__ */ new Map();
	for (const it of items) {
		const o = byId.get(it.order_id);
		if (!o) continue;
		const p = it.product_id ? products.get(it.product_id) : void 0;
		const key = it.product_id ?? `name:${it.product_name}`;
		let row = map.get(key);
		if (!row) {
			row = {
				key,
				name: p?.name ?? it.product_name,
				code: p?.product_code ?? "—",
				image: p?.og_image_url ?? null,
				orders: 0,
				qty: 0,
				saleQty: 0,
				returnedQty: 0,
				sellValue: 0,
				adminRevenue: 0,
				buyCost: 0,
				adminProfit: 0,
				resellerProfit: 0,
				_orders: /* @__PURE__ */ new Set()
			};
			map.set(key, row);
		}
		const final = isMoneyFinal(o.status);
		const kept = final ? keptQty(it, o.status) : 0;
		row._orders.add(it.order_id);
		row.qty += Number(it.quantity);
		row.saleQty += kept;
		if (final) row.returnedQty += Math.max(Number(it.quantity) - kept, 0);
		row.sellValue += n(it.line_total) / Math.max(Number(it.quantity), 1) * kept;
		row.adminRevenue += n(it.sa_price) * kept;
		row.buyCost += lineBuyingPrice(it, products) * kept;
		if (kept > 0) row.resellerProfit += n(it.profit) / Math.max(Number(it.quantity), 1) * kept;
	}
	return Array.from(map.values()).map(({ _orders, ...r }) => ({
		...r,
		orders: _orders.size,
		adminProfit: r.adminRevenue - r.buyCost
	})).sort((a, b) => b.saleQty - a.saleQty);
}
function buildResellerRows(orders, items, products, shipments = []) {
	const itemsByOrder = groupItems(items);
	const shipCost = shipmentCostMap(shipments);
	const map = /* @__PURE__ */ new Map();
	for (const o of orders) {
		const key = o.reseller_id ?? "none";
		const row = map.get(key) ?? {
			key,
			name: o.resellers?.business_name ?? "Unassigned",
			code: o.resellers?.code ?? "—",
			orders: 0,
			delivered: 0,
			partial: 0,
			failed: 0,
			running: 0,
			value: 0,
			received: 0,
			advance: 0,
			resellerProfit: 0,
			deliverySpend: 0,
			packaging: 0,
			adminMargin: 0,
			adminProfit: 0
		};
		const myItems = itemsByOrder.get(o.id) ?? [];
		const ord = withKeptCost(o, myItems);
		const final = isMoneyFinal(o.status);
		const buy = final ? orderBuyingCost(myItems, o.status, products) : 0;
		const received = finalReceived(ord);
		const adminCash = finalAdminReceived(ord);
		const profit = finalProfit(ord);
		const ship = adminDeliverySpend(o, shipCost.get(o.id));
		const pack = final && o.status !== "cancelled" ? orderPackaging(o) : 0;
		row.orders += 1;
		if (o.status === "delivered") row.delivered += 1;
		if (PARTIAL_STATUSES.includes(o.status)) row.partial += 1;
		if (FAILED_STATUSES.includes(o.status)) row.failed += 1;
		if (!final) row.running += 1;
		row.value += n(o.total);
		row.received += received;
		row.advance += final ? Math.max(n(o.advance_amount), 0) : 0;
		row.resellerProfit += profit;
		row.deliverySpend += ship;
		row.packaging += pack;
		row.adminMargin += adminCash - profit - buy;
		row.adminProfit += adminCash - profit - buy - ship - pack;
		map.set(key, row);
	}
	return Array.from(map.values()).sort((a, b) => b.orders - a.orders);
}
var COURIER_LABEL = {
	steadfast: "Steadfast",
	pathao: "Pathao",
	carrybee: "Carrybee",
	none: "Not booked yet"
};
function buildCourierRows(orders, items, products, shipments) {
	const itemsByOrder = groupItems(items);
	const shipByOrder = /* @__PURE__ */ new Map();
	for (const s of shipments) if (!shipByOrder.has(s.order_id)) shipByOrder.set(s.order_id, {
		provider: s.provider,
		cost: n(s.cost)
	});
	const map = /* @__PURE__ */ new Map();
	for (const o of orders) {
		const sh = shipByOrder.get(o.id);
		const key = sh?.provider ?? "none";
		const row = map.get(key) ?? {
			key,
			name: COURIER_LABEL[key] ?? key,
			parcels: 0,
			delivered: 0,
			returned: 0,
			running: 0,
			value: 0,
			received: 0,
			deliveryCharged: 0,
			courierBill: 0,
			deliveryMargin: 0,
			adminProfit: 0
		};
		const myItems = itemsByOrder.get(o.id) ?? [];
		const ord = withKeptCost(o, myItems);
		const final = isMoneyFinal(o.status);
		const buy = final ? orderBuyingCost(myItems, o.status, products) : 0;
		const received = finalReceived(ord);
		const adminCash = finalAdminReceived(ord);
		const profit = finalProfit(ord);
		const bill = sh ? adminDeliverySpend(o, sh.cost) : adminDeliverySpend(o);
		const charged = final && o.status !== "cancelled" ? orderDeliveryCost(o) : 0;
		const pack = final && o.status !== "cancelled" ? orderPackaging(o) : 0;
		row.parcels += 1;
		if (o.status === "delivered" || PARTIAL_STATUSES.includes(o.status)) row.delivered += 1;
		if (FAILED_STATUSES.includes(o.status)) row.returned += 1;
		if (!final) row.running += 1;
		row.value += n(o.total);
		row.received += received;
		row.deliveryCharged += charged;
		row.courierBill += bill;
		row.deliveryMargin += charged - bill;
		row.adminProfit += adminCash - profit - buy - bill - pack;
		map.set(key, row);
	}
	return Array.from(map.values()).sort((a, b) => b.parcels - a.parcels);
}
/**
* Expense categories that the P&L already deducts from the orders themselves
* (real courier bill + packaging), so counting them again from the expense
* sheet would double-charge admin.
*/
var ORDER_COVERED_EXPENSE_CATEGORIES = [
	"delivery",
	"courier",
	"packaging"
];
function buildPnL(orders, items, products, expenses, agentCommissionTotal = 0, shipments = []) {
	const itemsByOrder = groupItems(items);
	const shipCost = shipmentCostMap(shipments);
	let value = 0;
	let runningValue = 0;
	let received = 0;
	let adminCash = 0;
	let advance = 0;
	let resellerPayout = 0;
	let buyCost = 0;
	let deliveryCharged = 0;
	let deliverySpend = 0;
	let packaging = 0;
	let deliveredOrders = 0;
	let partialOrders = 0;
	let failedOrders = 0;
	let runningOrders = 0;
	for (const o of orders) {
		const myItems = itemsByOrder.get(o.id) ?? [];
		const ord = withKeptCost(o, myItems);
		const final = isMoneyFinal(o.status);
		value += n(o.total);
		if (!final) {
			runningOrders += 1;
			runningValue += n(o.total);
			continue;
		}
		if (o.status === "delivered") deliveredOrders += 1;
		if (PARTIAL_STATUSES.includes(o.status)) partialOrders += 1;
		if (FAILED_STATUSES.includes(o.status)) failedOrders += 1;
		received += orderReceived(ord);
		adminCash += adminReceived(ord);
		advance += Math.max(n(o.advance_amount), 0);
		resellerPayout += orderProfit(ord);
		buyCost += orderBuyingCost(myItems, o.status, products);
		if (o.status !== "cancelled") {
			deliveryCharged += orderDeliveryCost(o);
			packaging += orderPackaging(o);
		}
		deliverySpend += adminDeliverySpend(o, shipCost.get(o.id));
	}
	const catMap = /* @__PURE__ */ new Map();
	let expenseTotal = 0;
	let skippedExpenses = 0;
	for (const e of expenses) {
		if (ORDER_COVERED_EXPENSE_CATEGORIES.includes(e.category)) {
			skippedExpenses += n(e.amount);
			continue;
		}
		expenseTotal += n(e.amount);
		catMap.set(e.category, (catMap.get(e.category) ?? 0) + n(e.amount));
	}
	const grossProfit = adminCash - resellerPayout - buyCost - deliverySpend - packaging;
	return {
		orders: orders.length,
		deliveredOrders,
		partialOrders,
		failedOrders,
		runningOrders,
		value,
		runningValue,
		received,
		advance,
		resellerPayout,
		buyCost,
		grossProfit,
		deliveryCharged,
		deliverySpend,
		deliveryMargin: deliveryCharged - deliverySpend,
		packaging,
		expenses: expenseTotal,
		expenseByCategory: Array.from(catMap.entries()).map(([category, amount]) => ({
			category,
			amount
		})).sort((a, b) => b.amount - a.amount),
		skippedExpenses,
		agentCommission: agentCommissionTotal,
		netProfit: grossProfit - expenseTotal - agentCommissionTotal
	};
}
/**
* Per-supplier cost report. Attribution comes from the order line's own
* frozen supplier_id (stamped once, at order-creation time, by the same
* DB trigger that freezes buying_price — see snapshot_order_item_costs).
* Falls back to the product's current supplier only for the rare legacy
* line saved before that trigger existed.
*/
function buildSupplierRows(orders, items, products, suppliers) {
	const byId = new Map(orders.map((o) => [o.id, o]));
	const map = /* @__PURE__ */ new Map();
	for (const it of items) {
		const o = byId.get(it.order_id);
		if (!o) continue;
		const final = isMoneyFinal(o.status);
		const kept = final ? keptQty(it, o.status) : 0;
		const p = it.product_id ? products.get(it.product_id) : void 0;
		const supplierId = it.supplier_id || p?.supplier_id || null;
		const key = supplierId ?? "none";
		let row = map.get(key);
		if (!row) {
			const s = supplierId ? suppliers.get(supplierId) : void 0;
			row = {
				key,
				name: s?.display_name ?? "No supplier set",
				code: s?.code ?? "—",
				orders: 0,
				qty: 0,
				returnedQty: 0,
				buyCost: 0,
				_orders: /* @__PURE__ */ new Set()
			};
			map.set(key, row);
		}
		row._orders.add(it.order_id);
		row.qty += kept;
		if (final) row.returnedQty += Math.max(Number(it.quantity) - kept, 0);
		row.buyCost += lineBuyingPrice(it, products) * kept;
	}
	return Array.from(map.values()).map(({ _orders, ...r }) => ({
		...r,
		orders: _orders.size
	})).sort((a, b) => b.buyCost - a.buyCost);
}
/**
* Day-by-day admin money flow, built with the exact same per-order formulas
* as buildPnL, so the Overview chart always reconciles with the P&L tab.
* Only settled (money-final) orders move the trend — a running order hasn't
* earned or lost anything yet.
*/
function buildDailyTrend(orders, items, products, shipments = []) {
	const itemsByOrder = groupItems(items);
	const shipCost = shipmentCostMap(shipments);
	const map = /* @__PURE__ */ new Map();
	for (const o of orders) {
		if (!isMoneyFinal(o.status)) continue;
		const myItems = itemsByOrder.get(o.id) ?? [];
		const ord = withKeptCost(o, myItems);
		const received = finalReceived(ord);
		const adminCash = finalAdminReceived(ord);
		const payout = finalProfit(ord);
		const buy = orderBuyingCost(myItems, o.status, products);
		const ship = adminDeliverySpend(o, shipCost.get(o.id));
		const pack = o.status !== "cancelled" ? orderPackaging(o) : 0;
		const key = String(o.created_at).slice(0, 10);
		const row = map.get(key) ?? {
			key,
			label: key.slice(5),
			orders: 0,
			received: 0,
			resellerPayout: 0,
			buyCost: 0,
			deliverySpend: 0,
			packaging: 0,
			adminProfit: 0
		};
		row.orders += 1;
		row.received += received;
		row.resellerPayout += payout;
		row.buyCost += buy;
		row.deliverySpend += ship;
		row.packaging += pack;
		row.adminProfit += adminCash - payout - buy - ship - pack;
		map.set(key, row);
	}
	return Array.from(map.values()).sort((a, b) => a.key < b.key ? -1 : 1);
}
/**
* "If every order currently in progress gets delivered in full" projection —
* uses the exact same formulas as buildPnL, just without the isMoneyFinal
* gate, so it reconciles with the real numbers the moment an order settles.
* Not a probability-weighted forecast — a best-case ceiling on the pipeline.
*/
function buildPotential(orders, items, products) {
	const itemsByOrder = groupItems(items);
	let value = 0;
	let received = 0;
	let adminCash = 0;
	let resellerProfit = 0;
	let buyCost = 0;
	let deliverySpend = 0;
	let packaging = 0;
	let count = 0;
	for (const o of orders) {
		if (isMoneyFinal(o.status)) continue;
		const myItems = itemsByOrder.get(o.id) ?? [];
		const ord = withKeptCost(o, myItems);
		count += 1;
		value += n(o.total);
		received += orderReceived(ord);
		adminCash += adminReceived(ord);
		resellerProfit += orderProfit(ord);
		buyCost += orderBuyingCost(myItems, o.status, products);
		deliverySpend += orderDeliveryCost(ord);
		packaging += orderPackaging(ord);
	}
	const adminProfit = adminCash - resellerProfit - buyCost - deliverySpend - packaging;
	return {
		orders: count,
		value,
		resellerProfit,
		buyCost,
		deliverySpend,
		packaging,
		adminProfit
	};
}
function sortRows(rows, key, dir) {
	return [...rows].sort((a, b) => {
		const av = a[key];
		const bv = b[key];
		if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
		const as = String(av ?? "");
		const bs = String(bv ?? "");
		return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
	});
}
//#endregion
export { withKeptCost as S, keptQty as _, buildCourierRows as a, shipmentCostMap as b, buildPotential as c, buildSupplierRows as d, finalAdminReceived as f, isMoneyFinal as g, groupItems as h, adminDeliverySpend as i, buildProductRows as l, finalReceived as m, EXPENSE_CATEGORIES as n, buildDailyTrend as o, finalProfit as p, SCOPE_OPTIONS as r, buildPnL as s, ADMIN_PROFIT_HINT as t, buildResellerRows as u, orderBuyingCost as v, sortRows as x, scopeOrders as y };
