import { j as safeIsoString, k as formatMonthYear } from "./client-BpJCBCUq.js";
import { m as orderReceived, p as orderProfit } from "./finance-report-Dwy2dA23.js";
//#region src/lib/agents.ts
var AGENT_SALES_HINT = "Sales = money actually received for the orders of this agent's resellers in the selected period. Profit uses the same formula as every report: received amount − delivery charge − product cost − packaging cost.";
var AGENT_COMMISSION_HINT = "Commission = agent rate % × settled net profit of the assigned resellers' orders. Net profit uses the same formula everywhere: final delivered (received) amount − delivery charge − product cost − packaging cost. Returned / cancelled orders reduce the base, so commission is always paid on real delivered money.";
/** rate % of the settled net profit. */
function agentCommission(base, rate) {
	return base * (Number(rate ?? 0) || 0) / 100;
}
/** Aggregate reseller-level and agent-level performance from raw orders. */
function buildAgentPerformance(agent, resellers, orders) {
	const byReseller = /* @__PURE__ */ new Map();
	for (const r of resellers) byReseller.set(r.id, {
		reseller_id: r.id,
		business_name: r.business_name,
		code: r.code,
		phone: r.contact_phone,
		status: r.status,
		orders: 0,
		delivered: 0,
		failed: 0,
		sales: 0,
		profit: 0,
		lastOrderAt: null
	});
	for (const o of orders) {
		if (!o.reseller_id) continue;
		const row = byReseller.get(o.reseller_id);
		if (!row) continue;
		row.orders += 1;
		if (o.status === "delivered" || o.status === "partial") {
			row.delivered += 1;
			row.sales += orderReceived(o);
			row.profit += orderProfit(o);
		} else if (o.status === "returned" || o.status === "cancelled") {
			row.failed += 1;
			row.profit += orderProfit(o);
		}
		if (!row.lastOrderAt || o.created_at > row.lastOrderAt) row.lastOrderAt = o.created_at;
	}
	const rows = Array.from(byReseller.values()).sort((a, b) => b.sales - a.sales);
	const target = Number(agent.sale_target ?? 0) || 0;
	const sales = rows.reduce((s, r) => s + r.sales, 0);
	const rate = Number(agent.commission_rate ?? 0) || 0;
	const commissionBase = rows.reduce((s, r) => s + r.profit, 0);
	return {
		agentId: agent.id,
		resellers: rows,
		resellerCount: rows.length,
		activeResellers: rows.filter((r) => r.status === "active").length,
		sellingResellers: rows.filter((r) => r.orders > 0).length,
		orders: rows.reduce((s, r) => s + r.orders, 0),
		delivered: rows.reduce((s, r) => s + r.delivered, 0),
		failed: rows.reduce((s, r) => s + r.failed, 0),
		sales,
		profit: commissionBase,
		target,
		achievedPct: target > 0 ? Math.round(sales / target * 100) : 0,
		gap: Math.max(target - sales, 0),
		rate,
		commissionBase,
		commission: agentCommission(commissionBase, rate)
	};
}
var num = (v) => Number(v ?? 0) || 0;
function buildAgentSettlement(earned, payouts) {
	const sum = (s) => payouts.filter((p) => p.status === s).reduce((t, p) => t + num(p.amount), 0);
	const paid = sum("paid");
	const approved = sum("approved");
	const pending = sum("pending");
	const balance = earned - paid;
	return {
		earned,
		pending,
		approved,
		paid,
		advance: Math.max(paid - earned, 0),
		balance,
		payable: Math.max(balance - approved, 0)
	};
}
/** Commission earned per month, from settled orders of the assigned resellers. */
function agentCommissionMonths(orders, rate) {
	const map = /* @__PURE__ */ new Map();
	for (const o of orders) {
		if (![
			"delivered",
			"partial",
			"returned",
			"cancelled"
		].includes(String(o.status))) continue;
		const d = new Date(o.created_at);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		const row = map.get(key) ?? {
			key,
			base: 0,
			commission: 0,
			orders: 0
		};
		row.base += orderProfit(o);
		row.orders += 1;
		row.commission = agentCommission(row.base, rate);
		map.set(key, row);
	}
	return Array.from(map.values()).sort((a, b) => a.key < b.key ? 1 : -1);
}
var monthLabel = (key) => formatMonthYear(key);
/**
* Same timeline format as the reseller money ledger:
* commission earned = money in, admin payments = money out, rejected = void.
*/
function buildAgentLedger(orders, rate, payouts) {
	const rows = [];
	for (const m of agentCommissionMonths(orders, rate)) {
		if (m.commission === 0) continue;
		rows.push({
			at: `${m.key}-28T23:59:00`,
			kind: "commission",
			direction: m.commission >= 0 ? "in" : "out",
			label: `Commission earned · ${monthLabel(m.key)}`,
			reference: `${m.orders} settled order(s) · net profit ৳${Math.round(m.base).toLocaleString()} × ${Number(rate) || 0}%`,
			status: "earned",
			amount: Math.abs(m.commission)
		});
	}
	for (const p of payouts) {
		const advance = p.kind === "advance";
		const at = safeIsoString(p.paid_at || p.approved_at || p.created_at);
		rows.push({
			at,
			kind: "payout",
			direction: p.status === "rejected" ? "void" : "out",
			label: advance ? "Advance payment" : p.status === "paid" ? "Commission paid" : `Payment ${p.status}`,
			reference: [
				p.method,
				p.reference,
				p.note,
				p.admin_note
			].filter(Boolean).join(" · ") || null,
			status: p.status,
			amount: num(p.amount)
		});
	}
	rows.sort((a, b) => a.at < b.at ? -1 : 1);
	let running = 0;
	return rows.map((r) => {
		if (r.direction === "in") running += r.amount;
		else if (r.direction === "out" && r.status === "paid") running -= r.amount;
		return {
			...r,
			running
		};
	}).reverse();
}
function bdt(v) {
	return `৳${Math.round(v).toLocaleString()}`;
}
/** WhatsApp-safe Bangladeshi number. */
function waNumber(phone) {
	let d = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
	if (d.startsWith("0")) d = "88" + d.slice(1);
	if (d.startsWith("1") && d.length === 10) d = "880" + d;
	return d;
}
//#endregion
export { bdt as a, buildAgentSettlement as c, agentCommissionMonths as i, waNumber as l, AGENT_SALES_HINT as n, buildAgentLedger as o, agentCommission as r, buildAgentPerformance as s, AGENT_COMMISSION_HINT as t };
