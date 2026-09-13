//#region src/lib/courier-status.ts
/** Steadfast delivery statuses (API v1). */
var STEADFAST_STATUS_MAP = {
	in_review: {
		ship: "booked",
		order: "shipped",
		label: "In review"
	},
	pending: {
		ship: "in_transit",
		order: "shipped",
		label: "Pending / on the way"
	},
	hold: {
		ship: "in_transit",
		order: "shipped",
		label: "On hold"
	},
	delivered_approval_pending: {
		ship: "in_transit",
		order: "shipped",
		label: "Delivered (approval pending)"
	},
	partial_delivered_approval_pending: {
		ship: "in_transit",
		order: "shipped",
		label: "Partial delivered (approval pending)"
	},
	cancelled_approval_pending: {
		ship: "in_transit",
		order: "pending_return",
		label: "Cancelled (approval pending)"
	},
	unknown_approval_pending: {
		ship: "in_transit",
		order: "shipped",
		label: "Unknown (approval pending)"
	},
	delivered: {
		ship: "delivered",
		order: "delivered",
		label: "Delivered"
	},
	partial_delivered: {
		ship: "delivered",
		order: "pending_partial",
		label: "Partial delivered"
	},
	cancelled: {
		ship: "returned",
		order: "pending_return",
		label: "Cancelled / returning"
	},
	return_requested: {
		ship: "returned",
		order: "pending_return",
		label: "Return requested"
	},
	unknown: {
		ship: "in_transit",
		order: "shipped",
		label: "Unknown"
	}
};
/** Carrybee webhook events (`order.*`), keyed without the `order.` prefix. */
var CARRYBEE_STATUS_MAP = {
	created: {
		ship: "booked",
		order: "shipped",
		label: "Order created"
	},
	"create-failed": {
		ship: "failed",
		order: "ready_to_ship",
		label: "Create failed"
	},
	updated: {
		ship: "booked",
		order: "shipped",
		label: "Order updated"
	},
	"pickup-requested": {
		ship: "booked",
		order: "shipped",
		label: "Pickup requested"
	},
	"assigned-for-pickup": {
		ship: "booked",
		order: "shipped",
		label: "Assigned for pickup"
	},
	picked: {
		ship: "in_transit",
		order: "shipped",
		label: "Picked"
	},
	"pickup-failed": {
		ship: "booked",
		order: "shipped",
		label: "Pickup failed"
	},
	"pickup-cancelled": {
		ship: "cancelled",
		order: "ready_to_ship",
		label: "Pickup cancelled"
	},
	"at-the-sorting-hub": {
		ship: "in_transit",
		order: "shipped",
		label: "At sorting hub"
	},
	"on-the-way-to-central-warehouse": {
		ship: "in_transit",
		order: "shipped",
		label: "On the way to central warehouse"
	},
	"at-central-warehouse": {
		ship: "in_transit",
		order: "shipped",
		label: "At central warehouse"
	},
	"in-transit": {
		ship: "in_transit",
		order: "shipped",
		label: "In transit"
	},
	"received-at-last-mile-hub": {
		ship: "in_transit",
		order: "shipped",
		label: "Received at last mile hub"
	},
	"assigned-for-delivery": {
		ship: "in_transit",
		order: "shipped",
		label: "Assigned for delivery"
	},
	"delivery-on-hold": {
		ship: "in_transit",
		order: "shipped",
		label: "Delivery on hold"
	},
	delivered: {
		ship: "delivered",
		order: "delivered",
		label: "Delivered"
	},
	"partial-delivery": {
		ship: "delivered",
		order: "pending_partial",
		label: "Partial delivered"
	},
	"delivery-failed": {
		ship: "in_transit",
		order: "pending_return",
		label: "Delivery failed"
	},
	returned: {
		ship: "returned",
		order: "pending_return",
		label: "Returned (courier)"
	},
	"paid-return": {
		ship: "returned",
		order: "pending_return",
		label: "Paid return"
	},
	exchange: {
		ship: "in_transit",
		order: "shipped",
		label: "Exchange"
	},
	paid: {
		ship: "delivered",
		order: "delivered",
		label: "Paid / invoiced"
	},
	"returned-at-sorting": {
		ship: "returned",
		order: "pending_return",
		label: "Returned at sorting"
	},
	"returned-in-transit": {
		ship: "returned",
		order: "pending_return",
		label: "Return in transit"
	},
	"returned-to-merchant": {
		ship: "returned",
		order: "pending_return",
		label: "Returned to merchant"
	}
};
/**
* Pathao webhook events (`order.*` / `store.*`) and API `order_status_slug`
* values, keyed without the prefix and with `_`/spaces normalized to `-`.
*/
var PATHAO_STATUS_MAP = {
	created: {
		ship: "booked",
		order: "shipped",
		label: "Order created"
	},
	pending: {
		ship: "booked",
		order: "shipped",
		label: "Pending"
	},
	updated: {
		ship: "booked",
		order: "shipped",
		label: "Order updated"
	},
	"pickup-requested": {
		ship: "booked",
		order: "shipped",
		label: "Pickup requested"
	},
	"assigned-for-pickup": {
		ship: "booked",
		order: "shipped",
		label: "Assigned for pickup"
	},
	picked: {
		ship: "in_transit",
		order: "shipped",
		label: "Picked"
	},
	"pickup-failed": {
		ship: "booked",
		order: "shipped",
		label: "Pickup failed"
	},
	"pickup-cancelled": {
		ship: "cancelled",
		order: "ready_to_ship",
		label: "Pickup cancelled"
	},
	"at-the-sorting-hub": {
		ship: "in_transit",
		order: "shipped",
		label: "At sorting hub"
	},
	"at-sorting-hub": {
		ship: "in_transit",
		order: "shipped",
		label: "At sorting hub"
	},
	"in-transit": {
		ship: "in_transit",
		order: "shipped",
		label: "In transit"
	},
	"received-at-last-mile-hub": {
		ship: "in_transit",
		order: "shipped",
		label: "Received at last mile hub"
	},
	"assigned-for-delivery": {
		ship: "in_transit",
		order: "shipped",
		label: "Assigned for delivery"
	},
	delivered: {
		ship: "delivered",
		order: "delivered",
		label: "Delivered"
	},
	"partial-delivery": {
		ship: "delivered",
		order: "pending_partial",
		label: "Partial delivered"
	},
	"delivery-failed": {
		ship: "in_transit",
		order: "pending_return",
		label: "Delivery failed"
	},
	"on-hold": {
		ship: "in_transit",
		order: "shipped",
		label: "On hold"
	},
	paid: {
		ship: "delivered",
		order: "delivered",
		label: "Paid / invoiced"
	},
	exchanged: {
		ship: "in_transit",
		order: "shipped",
		label: "Exchanged"
	},
	exchange: {
		ship: "in_transit",
		order: "shipped",
		label: "Exchange"
	},
	returned: {
		ship: "returned",
		order: "pending_return",
		label: "Returned (courier)"
	},
	return: {
		ship: "returned",
		order: "pending_return",
		label: "Returned (courier)"
	},
	"paid-return": {
		ship: "returned",
		order: "pending_return",
		label: "Paid return"
	},
	"return-id-created": {
		ship: "returned",
		order: "pending_return",
		label: "Return id created"
	},
	"return-in-transit": {
		ship: "returned",
		order: "pending_return",
		label: "Return in transit"
	},
	"returned-to-merchant": {
		ship: "returned",
		order: "pending_return",
		label: "Returned to merchant"
	}
};
function normalizeCourierStatus(provider, raw) {
	const key = String(raw ?? "").trim().toLowerCase();
	if (provider === "carrybee") return key.replace(/^order\./, "");
	if (provider === "pathao") return key.replace(/^(order|store)\./, "").replace(/[\s_]+/g, "-");
	return key;
}
function statusTable(provider) {
	if (provider === "carrybee") return CARRYBEE_STATUS_MAP;
	if (provider === "pathao") return PATHAO_STATUS_MAP;
	return STEADFAST_STATUS_MAP;
}
function mapCourierStatus(provider, raw) {
	const key = normalizeCourierStatus(provider, raw);
	return statusTable(provider)[key] ?? {
		ship: "in_transit",
		order: "shipped",
		label: key ? key.replace(/[-_]/g, " ") : "unknown"
	};
}
function courierStatusLabel(raw, provider) {
	if (!raw) return "—";
	const key = normalizeCourierStatus(provider, raw);
	return statusTable(provider)[key]?.label ?? PATHAO_STATUS_MAP[key]?.label ?? CARRYBEE_STATUS_MAP[key]?.label ?? STEADFAST_STATUS_MAP[key]?.label ?? key.replace(/[-_]/g, " ");
}
/** Single source of truth for the order flow — tabs, modals and report filters. */
var ORDER_TABS = [
	{
		key: "all",
		label: "All Orders",
		statuses: []
	},
	{
		key: "new",
		label: "New Order",
		statuses: ["draft", "pending"]
	},
	{
		key: "forwarded",
		label: "Send To admin",
		statuses: ["forwarded"]
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
/** Flow order for status pickers — mirrors ORDER_TABS exactly. */
var ORDER_STATUS_OPTIONS = [
	"pending",
	"forwarded",
	"confirmed",
	"packaging",
	"ready_to_ship",
	"shipped",
	"delivered",
	"pending_partial",
	"partial_full",
	"partial_item",
	"partial_delivery",
	"pending_return",
	"returned",
	"damaged",
	"cancelled"
];
/**
* Partial family — every partial status is settled one order at a time
* (amount / kept items differ per order), so bulk status change is blocked.
*/
var PARTIAL_STATUSES = [
	"pending_partial",
	"partial",
	"partial_full",
	"partial_item",
	"partial_delivery"
];
function isPartialStatus(status) {
	return PARTIAL_STATUSES.includes(status);
}
/**
* Statuses that need admin settlement input (amount / returned items).
* "delivered" is intentionally excluded: a full delivery means nothing changed,
* so the full order total is collected and no settlement popup is needed.
*/
var SETTLEMENT_STATUSES = [
	"partial_full",
	"partial_item",
	"partial_delivery",
	"returned",
	"damaged"
];
/** Reseller can edit / delete / change status only while the order sits in these states. */
var RESELLER_ACTION_STATUSES = [
	"draft",
	"pending",
	"forwarded",
	"cancelled"
];
function resellerCanAct(status) {
	return RESELLER_ACTION_STATUSES.includes(status);
}
/**
* Allowed next statuses.
*  · reseller: pending ↔ send to admin ↔ cancelled only
*  · admin/staff: full flow, but the settlement statuses go through the settle modal
*/
function nextStatuses(current, role) {
	if (role === "reseller") switch (current) {
		case "draft":
		case "pending": return ["forwarded", "cancelled"];
		case "forwarded": return ["pending", "cancelled"];
		case "cancelled": return ["pending", "forwarded"];
		default: return [];
	}
	switch (current) {
		case "draft":
		case "pending": return [
			"forwarded",
			"confirmed",
			"cancelled"
		];
		case "forwarded": return ["confirmed", "cancelled"];
		case "confirmed": return [
			"packaging",
			"ready_to_ship",
			"cancelled"
		];
		case "packaging": return ["ready_to_ship", "cancelled"];
		case "ready_to_ship": return ["shipped", "cancelled"];
		case "processing":
		case "shipped": return [
			"delivered",
			"pending_partial",
			"pending_return"
		];
		case "pending_partial": return [
			"partial_full",
			"partial_item",
			"partial_delivery",
			"damaged"
		];
		case "pending_return": return ["returned", "damaged"];
		case "delivered":
		case "partial":
		case "partial_full":
		case "partial_item":
		case "partial_delivery":
		case "returned": return ["damaged"];
		default: return [];
	}
}
/** Labels match the ORDER_TABS flow wording everywhere (lists, modals, reports). */
var STATUS_LABELS = {
	draft: "New Order",
	pending: "New Order",
	forwarded: "Send To admin",
	confirmed: "Confirmed",
	packaging: "Packaging",
	ready_to_ship: "Courier Handover",
	processing: "To Courier",
	shipped: "To Courier",
	delivered: "Delivered",
	pending_partial: "Pending Partial",
	partial: "Partial (Full item)",
	partial_full: "Partial (Full item)",
	partial_item: "Partial (Item)",
	partial_delivery: "Partial (Delivery Charge)",
	pending_return: "Pending Return",
	returned: "Returned",
	damaged: "Damaged",
	cancelled: "Cancelled"
};
function orderStatusLabel(status) {
	return STATUS_LABELS[status] ?? status.replace(/_/g, " ");
}
function orderStatusTone(status) {
	if (status === "delivered") return "bg-success/15 text-success";
	if (status === "returned" || status === "cancelled" || status === "damaged") return "bg-destructive/15 text-destructive";
	if (status === "partial" || status === "partial_full" || status === "partial_item" || status === "partial_delivery") return "bg-emerald-500/15 text-emerald-600";
	if (status === "pending_return" || status === "pending_partial") return "bg-amber-500/15 text-amber-600";
	if (status === "shipped" || status === "processing") return "bg-blue-500/15 text-blue-600";
	if (status === "packaging") return "bg-violet-500/15 text-violet-600";
	return "bg-primary/15 text-primary";
}
/** Visual grouping for order list tabs. */
function orderTabGroup(key) {
	switch (key) {
		case "delivered": return "delivered";
		case "pending_partial":
		case "partial_full":
		case "partial_item":
		case "partial_delivery": return "partial";
		case "pending_return":
		case "returned":
		case "damaged":
		case "cancelled": return "terminal";
		default: return "processing";
	}
}
/** Tailwind classes for a tab in its group — light tint highlight for active. */
function orderTabClasses(key, active) {
	const group = orderTabGroup(key);
	if (active) {
		if (group === "delivered") return "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm ring-2 ring-emerald-600/30";
		if (group === "partial") return "bg-amber-500 text-white border-amber-500 font-semibold shadow-sm ring-2 ring-amber-500/30";
		if (group === "terminal") return "bg-rose-600 text-white border-rose-600 font-semibold shadow-sm ring-2 ring-rose-600/30";
		return "bg-blue-600 text-white border-blue-600 font-semibold shadow-sm ring-2 ring-blue-600/30";
	}
	if (group === "delivered") return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
	if (group === "partial") return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
	if (group === "terminal") return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
	return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
}
//#endregion
export { isPartialStatus as a, normalizeCourierStatus as c, orderTabClasses as d, orderTabGroup as f, courierStatusLabel as i, orderStatusLabel as l, ORDER_TABS as n, mapCourierStatus as o, resellerCanAct as p, SETTLEMENT_STATUSES as r, nextStatuses as s, ORDER_STATUS_OPTIONS as t, orderStatusTone as u };
