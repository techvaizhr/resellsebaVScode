import {
  adminReceived,
  isFailedOrder,
  isRealizedStatus,
  orderProfit,
  orderReceived,
  orderPackaging,
  orderDeliveryCost,
  type ProfitOrder,
} from "@/lib/finance-report";

const n = (v: number | string | null | undefined) => Number(v ?? 0) || 0;

export type BizOrder = ProfitOrder & {
  id: string;
  order_number: string;
  reseller_id: string | null;
  status: string;
  created_at: string;
  total: number | string;
  resellers?: { business_name: string; code: string } | null;
};

export type BizItem = {
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  returned_qty?: number | null;
  sa_price: number | string;
  line_total: number | string;
  profit: number | string;
  /** Cost snapshot frozen when the line was created (see snapshotCost). */
  buying_price?: number | string | null;
  packaging_cost?: number | string | null;
  /** Supplier snapshot frozen when the line was created. */
  supplier_id?: string | null;
};

export type BizProduct = {
  id: string;
  name: string;
  product_code: string;
  buying_price: number | string;
  packaging_cost: number | string;
  og_image_url: string | null;
  /** Fallback only — real per-order attribution uses BizItem.supplier_id (frozen on the line). */
  supplier_id?: string | null;
};

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number | string;
  spent_on: string;
  method: string | null;
  reference: string | null;
  note: string | null;
  created_at: string;
};

export const EXPENSE_CATEGORIES = [
  "delivery",
  "packaging",
  "salary",
  "marketing",
  "office",
  "courier",
  "refund",
  "other",
] as const;

export const ADMIN_PROFIT_HINT =
  "Admin profit = money received for the order − what the reseller finally earns − admin buying price of the products the customer kept. Advance already collected counts as received (the same way the transaction report does it). Delivery charge and packaging are not deducted twice here — record them once in Expenses and the net profit takes them out.";

/**
 * Quantity of an item the customer actually kept.
 * Fully failed statuses keep nothing; an in-flight order still counts the full
 * quantity, otherwise a pending order would look like it had zero product cost.
 */
export function keptQty(item: BizItem, status: string) {
  if (
    status === "cancelled" ||
    status === "returned" ||
    status === "pending_return" ||
    status === "partial_delivery"
  )
    return 0;
  return Math.max(Number(item.quantity) - Number(item.returned_qty ?? 0), 0);
}

/**
 * Reseller-side product cost of the kept items, mirroring the SQL
 * `order_kept_product_cost` (proportional share of sa_cost_total) so client math
 * and the DB-stored profit never disagree on `partial_item` orders.
 */
export function keptProductCost(o: BizOrder | ProfitOrder, items: BizItem[]) {
  const full = items.reduce((s, it) => s + n(it.sa_price) * Number(it.quantity), 0);
  const kept = items.reduce((s, it) => s + n(it.sa_price) * keptQty(it, String(o.status ?? "")), 0);
  const productCost = Math.max(n(o.sa_cost_total) - n(o.packaging_total), 0);
  if (full <= 0) return productCost;
  return Math.round(productCost * (kept / full) * 100) / 100;
}

/** Order object with the kept-product cost attached, ready for orderProfit(). */
export function withKeptCost<T extends BizOrder | ProfitOrder>(o: T, items: BizItem[]): T {
  return { ...o, kept_product_cost: keptProductCost(o, items) };
}

/* ---------------------------- settlement scope --------------------------- */

/**
 * Which orders a report should count. Money is only real once a parcel is
 * finished, so the default scope is the completed (delivered + partial) set —
 * running orders and cancel/return no longer pollute the profit numbers.
 */
export type ReportScope = "completed" | "delivered" | "partial" | "failed" | "running" | "all";

export const DELIVERED_STATUSES = ["delivered"];
export const PARTIAL_STATUSES = [
  "partial",
  "partial_full",
  "partial_item",
  "partial_delivery",
  "damaged",
];
export const COMPLETED_STATUSES = [...DELIVERED_STATUSES, ...PARTIAL_STATUSES];
export const FAILED_STATUSES = ["returned", "pending_return", "cancelled"];
export const RUNNING_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "forwarded",
  "packaging",
  "ready_to_ship",
  "processing",
  "shipped",
  "pending_partial",
];

export const SCOPE_STATUSES: Record<ReportScope, string[] | null> = {
  completed: COMPLETED_STATUSES,
  delivered: DELIVERED_STATUSES,
  partial: PARTIAL_STATUSES,
  failed: FAILED_STATUSES,
  running: RUNNING_STATUSES,
  all: null,
};

export const SCOPE_OPTIONS: { value: ReportScope; label: string; hint: string }[] = [
  {
    value: "completed",
    label: "Completed (delivered + partial)",
    hint: "Default — every finished parcel, partial amounts added or subtracted",
  },
  { value: "delivered", label: "Delivered only", hint: "Full delivery, full money collected" },
  {
    value: "partial",
    label: "Partial / damaged",
    hint: "Parcels where only part of the money or the items came through",
  },
  {
    value: "failed",
    label: "Returned / cancelled",
    hint: "Money lost — only delivery charge and packaging burned",
  },
  {
    value: "running",
    label: "In progress",
    hint: "Not finished yet — money not counted as earned",
  },
  { value: "all", label: "All orders", hint: "Everything, running orders shown as pipeline only" },
];

/** Keep only the orders that belong to the chosen scope. */
export function scopeOrders<T extends { status: string }>(orders: T[], scope: ReportScope): T[] {
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
export function isMoneyFinal(status?: string | null) {
  return !RUNNING_STATUSES.includes(String(status ?? ""));
}

/** Received money that is actually in hand (0 while the order is still running). */
export function finalReceived(o: BizOrder | ProfitOrder) {
  return isMoneyFinal(o.status) ? orderReceived(o) : 0;
}

/** Reseller profit that is actually earned (0 while the order is still running). */
export function finalProfit(o: BizOrder | ProfitOrder) {
  return isMoneyFinal(o.status) ? orderProfit(o) : 0;
}

/**
 * Cash that actually reached admin (0 while running). An advance the reseller
 * collected stays in the reseller's hand — it is never admin income, it only
 * lowers the payout, so it must be excluded from every admin profit line.
 */
export function finalAdminReceived(o: BizOrder | ProfitOrder) {
  return isMoneyFinal(o.status) ? adminReceived(o) : 0;
}

/**
 * What admin really paid the courier for this parcel: the booked shipment cost
 * when we have it, otherwise the admin-set delivery cost of the order.
 * Cancelled orders never went to the courier, so they cost nothing.
 */
export function adminDeliverySpend(o: BizOrder | ProfitOrder, shipmentCost?: number | null) {
  if (o.status === "cancelled" || !isMoneyFinal(o.status)) return 0;
  const booked = n(shipmentCost);
  return booked > 0 ? booked : orderDeliveryCost(o);
}

/** Map order_id -> booked courier cost (first shipment wins). */
export function shipmentCostMap(shipments: { order_id: string; cost: number | string | null }[]) {
  const m = new Map<string, number>();
  for (const s of shipments) if (!m.has(s.order_id)) m.set(s.order_id, n(s.cost));
  return m;
}

/** Group order items by order id. */
export function groupItems(items: BizItem[]) {
  const m = new Map<string, BizItem[]>();
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
export function lineBuyingPrice(it: BizItem, products: Map<string, BizProduct>) {
  const snap = n(it.buying_price);
  if (snap > 0) return snap;
  const p = it.product_id ? products.get(it.product_id) : undefined;
  return n(p?.buying_price);
}

/** Admin buying cost of the kept items of one order. */
export function orderBuyingCost(
  items: BizItem[],
  status: string,
  products: Map<string, BizProduct>,
) {
  let cost = 0;
  for (const it of items) cost += lineBuyingPrice(it, products) * keptQty(it, status);
  return cost;
}

/** Admin profit of one order (see ADMIN_PROFIT_HINT). */
export function adminOrderProfit(o: BizOrder, buyingCost: number) {
  return adminReceived(o) - orderProfit(o) - buyingCost;
}

/* ----------------------------- product report ---------------------------- */

export type ProductRow = {
  key: string;
  name: string;
  code: string;
  image: string | null;
  orders: number;
  qty: number;
  saleQty: number;
  returnedQty: number;
  sellValue: number;
  adminRevenue: number;
  buyCost: number;
  adminProfit: number;
  resellerProfit: number;
};

export function buildProductRows(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
): ProductRow[] {
  const byId = new Map(orders.map((o) => [o.id, o]));
  const map = new Map<string, ProductRow & { _orders: Set<string> }>();
  for (const it of items) {
    const o = byId.get(it.order_id);
    if (!o) continue;
    const p = it.product_id ? products.get(it.product_id) : undefined;
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
        _orders: new Set<string>(),
      };
      map.set(key, row);
    }

    const final = isMoneyFinal(o.status);
    // A running parcel has sold nothing yet — it only counts as pipeline quantity.
    const kept = final ? keptQty(it, o.status) : 0;
    row._orders.add(it.order_id);
    row.qty += Number(it.quantity);
    row.saleQty += kept;
    if (final) row.returnedQty += Math.max(Number(it.quantity) - kept, 0);
    row.sellValue += (n(it.line_total) / Math.max(Number(it.quantity), 1)) * kept;
    row.adminRevenue += n(it.sa_price) * kept;
    row.buyCost += lineBuyingPrice(it, products) * kept;
    if (kept > 0) row.resellerProfit += (n(it.profit) / Math.max(Number(it.quantity), 1)) * kept;
  }
  return Array.from(map.values())
    .map(({ _orders, ...r }) => ({
      ...r,
      orders: _orders.size,
      adminProfit: r.adminRevenue - r.buyCost,
    }))
    .sort((a, b) => b.saleQty - a.saleQty);
}

/* ---------------------------- reseller report ---------------------------- */

export type ResellerRow = {
  key: string;
  name: string;
  code: string;
  orders: number;
  delivered: number;
  partial: number;
  failed: number;
  running: number;
  value: number;
  received: number;
  advance: number;
  resellerProfit: number;
  deliverySpend: number;
  packaging: number;
  adminMargin: number;
  adminProfit: number;
};

export function buildResellerRows(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
  shipments: { order_id: string; cost: number | string | null }[] = [],
): ResellerRow[] {
  const itemsByOrder = groupItems(items);
  const shipCost = shipmentCostMap(shipments);
  const map = new Map<string, ResellerRow>();
  for (const o of orders) {
    const key = o.reseller_id ?? "none";
    const row =
      map.get(key) ??
      ({
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
        adminProfit: 0,
      } as ResellerRow);
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

/* ----------------------------- courier report ---------------------------- */

export type CourierRow = {
  key: string;
  name: string;
  parcels: number;
  delivered: number;
  returned: number;
  running: number;
  value: number;
  received: number;
  deliveryCharged: number;
  courierBill: number;
  deliveryMargin: number;
  adminProfit: number;
};

export const COURIER_LABEL: Record<string, string> = {
  steadfast: "Steadfast",
  pathao: "Pathao",
  carrybee: "Carrybee",
  none: "Not booked yet",
};

export function buildCourierRows(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
  shipments: { order_id: string; provider: string; cost: number | string | null }[],
): CourierRow[] {
  const itemsByOrder = groupItems(items);
  const shipByOrder = new Map<string, { provider: string; cost: number }>();
  for (const s of shipments) {
    if (!shipByOrder.has(s.order_id))
      shipByOrder.set(s.order_id, { provider: s.provider, cost: n(s.cost) });
  }
  const map = new Map<string, CourierRow>();
  for (const o of orders) {
    const sh = shipByOrder.get(o.id);
    const key = sh?.provider ?? "none";
    const row =
      map.get(key) ??
      ({
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
        adminProfit: 0,
      } as CourierRow);
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

/* ------------------------------ profit & loss ---------------------------- */

/**
 * Expense categories that the P&L already deducts from the orders themselves
 * (real courier bill + packaging), so counting them again from the expense
 * sheet would double-charge admin.
 */
export const ORDER_COVERED_EXPENSE_CATEGORIES = ["delivery", "courier", "packaging"];

export type PnL = {
  orders: number;
  deliveredOrders: number;
  partialOrders: number;
  failedOrders: number;
  runningOrders: number;
  value: number;
  runningValue: number;
  received: number;
  advance: number;
  resellerPayout: number;
  buyCost: number;
  grossProfit: number;
  deliveryCharged: number;
  deliverySpend: number;
  deliveryMargin: number;
  packaging: number;
  expenses: number;
  expenseByCategory: { category: string; amount: number }[];
  skippedExpenses: number;
  agentCommission: number;
  netProfit: number;
};

export function buildPnL(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
  expenses: Expense[],
  agentCommissionTotal = 0,
  shipments: { order_id: string; cost: number | string | null }[] = [],
): PnL {
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
  const catMap = new Map<string, number>();
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
    expenseByCategory: Array.from(catMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    skippedExpenses,
    agentCommission: agentCommissionTotal,
    netProfit: grossProfit - expenseTotal - agentCommissionTotal,
  };
}

/* ----------------------------- supplier report ---------------------------- */

export type SupplierLite = { display_name: string; code: string };

export type SupplierRow = {
  key: string;
  name: string;
  code: string;
  orders: number;
  qty: number;
  returnedQty: number;
  /** What admin owes/paid this supplier for the items customers actually kept. */
  buyCost: number;
};

/**
 * Per-supplier cost report. Attribution comes from the order line's own
 * frozen supplier_id (stamped once, at order-creation time, by the same
 * DB trigger that freezes buying_price — see snapshot_order_item_costs).
 * Falls back to the product's current supplier only for the rare legacy
 * line saved before that trigger existed.
 */
export function buildSupplierRows(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
  suppliers: Map<string, SupplierLite>,
): SupplierRow[] {
  const byId = new Map(orders.map((o) => [o.id, o]));
  const map = new Map<string, SupplierRow & { _orders: Set<string> }>();
  for (const it of items) {
    const o = byId.get(it.order_id);
    if (!o) continue;
    const final = isMoneyFinal(o.status);
    const kept = final ? keptQty(it, o.status) : 0;
    const p = it.product_id ? products.get(it.product_id) : undefined;
    const supplierId = it.supplier_id || p?.supplier_id || null;
    const key = supplierId ?? "none";
    let row = map.get(key);
    if (!row) {
      const s = supplierId ? suppliers.get(supplierId) : undefined;
      row = {
        key,
        name: s?.display_name ?? "No supplier set",
        code: s?.code ?? "—",
        orders: 0,
        qty: 0,
        returnedQty: 0,
        buyCost: 0,
        _orders: new Set<string>(),
      };
      map.set(key, row);
    }
    row._orders.add(it.order_id);
    row.qty += kept;
    if (final) row.returnedQty += Math.max(Number(it.quantity) - kept, 0);
    row.buyCost += lineBuyingPrice(it, products) * kept;
  }
  return Array.from(map.values())
    .map(({ _orders, ...r }) => ({ ...r, orders: _orders.size }))
    .sort((a, b) => b.buyCost - a.buyCost);
}

/* ------------------------------ daily trend ------------------------------- */

export type DailyPoint = {
  key: string; // YYYY-MM-DD
  label: string; // MM-DD, chart x-axis label
  orders: number;
  received: number;
  resellerPayout: number;
  buyCost: number;
  deliverySpend: number;
  packaging: number;
  /** Gross admin profit for the day, before shared expenses/agent commission (matches PnL's gross line when summed). */
  adminProfit: number;
};

/**
 * Day-by-day admin money flow, built with the exact same per-order formulas
 * as buildPnL, so the Overview chart always reconciles with the P&L tab.
 * Only settled (money-final) orders move the trend — a running order hasn't
 * earned or lost anything yet.
 */
export function buildDailyTrend(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
  shipments: { order_id: string; cost: number | string | null }[] = [],
): DailyPoint[] {
  const itemsByOrder = groupItems(items);
  const shipCost = shipmentCostMap(shipments);
  const map = new Map<string, DailyPoint>();
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
    const row =
      map.get(key) ??
      ({
        key,
        label: key.slice(5),
        orders: 0,
        received: 0,
        resellerPayout: 0,
        buyCost: 0,
        deliverySpend: 0,
        packaging: 0,
        adminProfit: 0,
      } satisfies DailyPoint);
    row.orders += 1;
    row.received += received;
    row.resellerPayout += payout;
    row.buyCost += buy;
    row.deliverySpend += ship;
    row.packaging += pack;
    row.adminProfit += adminCash - payout - buy - ship - pack;
    map.set(key, row);
  }
  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? -1 : 1));
}

/* ------------------------------ potential (pipeline) ---------------------- */

export type Potential = {
  orders: number;
  value: number;
  resellerProfit: number;
  buyCost: number;
  deliverySpend: number;
  packaging: number;
  adminProfit: number;
};

/**
 * "If every order currently in progress gets delivered in full" projection —
 * uses the exact same formulas as buildPnL, just without the isMoneyFinal
 * gate, so it reconciles with the real numbers the moment an order settles.
 * Not a probability-weighted forecast — a best-case ceiling on the pipeline.
 */
export function buildPotential(
  orders: BizOrder[],
  items: BizItem[],
  products: Map<string, BizProduct>,
): Potential {
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
  return { orders: count, value, resellerProfit, buyCost, deliverySpend, packaging, adminProfit };
}

/* ------------------------------ sorting helper --------------------------- */

export type SortDir = "asc" | "desc";

export function sortRows<T>(rows: T[], key: keyof T, dir: SortDir) {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return dir === "asc" ? av - bv : bv - av;
    const as = String(av ?? "");
    const bs = String(bv ?? "");
    return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });
}
