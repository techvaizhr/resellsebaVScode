import { r as supabase } from "./client-Be051lUg.js";
import { n as getPanelBootstrapPayload } from "./panel-bootstrap-BpYrFvi8.js";
import { useCallback, useEffect, useState } from "react";
//#region src/lib/deposit.ts
var emptyDepositStatus = {
	required: false,
	requiredAmount: 0,
	frozenAmount: 0,
	balance: 0,
	due: 0,
	blocked: false,
	rows: []
};
function buildDepositStatus(reseller, rows) {
	const requiredAmount = Number(reseller?.deposit_required_amount ?? 0);
	const required = Boolean(reseller?.deposit_required) && requiredAmount > 0;
	const balance = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
	const due = required ? Math.max(requiredAmount - balance, 0) : 0;
	return {
		required,
		requiredAmount,
		frozenAmount: Number(reseller?.frozen_amount ?? 0),
		balance,
		due,
		blocked: required && due > 0,
		rows
	};
}
/** Loads the deposit rule + ledger for one reseller (own row for resellers, any row for admins). */
function useDepositStatus(resellerId) {
	const [status, setStatus] = useState(emptyDepositStatus);
	const [loading, setLoading] = useState(false);
	const reload = useCallback(async (force = true) => {
		if (!resellerId) return;
		const boot = force ? null : getPanelBootstrapPayload();
		if (boot?.reseller && boot.reseller.id === resellerId) {
			setStatus(buildDepositStatus(boot.reseller, boot.deposits));
			setLoading(false);
			return;
		}
		setLoading(true);
		const [rRes, dRes] = await Promise.all([supabase.from("resellers").select("deposit_required,deposit_required_amount,frozen_amount").eq("id", resellerId).maybeSingle(), supabase.from("reseller_deposits").select("id,amount,method,reference,note,created_at").eq("reseller_id", resellerId).order("created_at", { ascending: false })]);
		setStatus(buildDepositStatus(rRes.data, dRes.data ?? []));
		setLoading(false);
	}, [resellerId]);
	useEffect(() => {
		reload(false);
	}, [reload]);
	return {
		status,
		loading,
		reload
	};
}
//#endregion
export { useDepositStatus as t };
