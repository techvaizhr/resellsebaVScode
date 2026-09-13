import { n as getGlobalSettings } from "./app-data-DxwZMsmL.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { useCallback, useEffect, useState } from "react";
//#region src/lib/deposit-settings.ts
var DEFAULT_DEPOSIT_TEXTS = {
	sectionTitle: "Security Deposit",
	dueTitle: "Security deposit due — {due}",
	dueBody: "A {required} security deposit is required to cover delivery charges if a delivery fails. Orders cannot be confirmed until the deposit is paid. Current balance: {balance}.",
	okText: "Deposit paid · {balance}",
	frozenText: "{frozen} frozen — this amount cannot be withdrawn",
	howToDeposit: "You cannot add the deposit yourself — send it via bKash/Nagad/Bank and share the TrxID with admin. Admin will verify and add it to your ledger.",
	withdrawWarning: "To withdraw your deposit or frozen amount you must contact admin first — taking this money back will close your reseller account and stop new orders.",
	orderBlockToast: "Security deposit due — {due}. Orders cannot be confirmed until the deposit is paid.",
	payoutFrozenHint: "{frozen} is frozen — this amount cannot be withdrawn."
};
var DEFAULT_DEPOSIT_DEFAULTS = {
	triggerOn: false,
	amount: 0,
	frozen: 0
};
function mergeTexts(raw) {
	const src = raw ?? {};
	const out = { ...DEFAULT_DEPOSIT_TEXTS };
	for (const key of Object.keys(DEFAULT_DEPOSIT_TEXTS)) {
		const v = src[key];
		if (typeof v === "string" && v.trim()) out[key] = v;
	}
	return out;
}
/** Fills {due} {required} {balance} {frozen} placeholders with formatted BDT amounts. */
function fillText(template, vars) {
	return template.replace(/\{(due|required|balance|frozen)\}/g, (_m, key) => bdt(Number(vars[key] ?? 0)));
}
function useDepositSettings() {
	const [texts, setTexts] = useState(DEFAULT_DEPOSIT_TEXTS);
	const [defaults, setDefaults] = useState(DEFAULT_DEPOSIT_DEFAULTS);
	const [loading, setLoading] = useState(true);
	const reload = useCallback(async () => {
		setLoading(true);
		const row = await getGlobalSettings();
		setTexts(mergeTexts(row?.deposit_texts));
		setDefaults({
			triggerOn: Boolean(row?.deposit_trigger_default_on),
			amount: Number(row?.deposit_default_amount ?? 0),
			frozen: Number(row?.deposit_default_frozen ?? 0)
		});
		setLoading(false);
	}, []);
	useEffect(() => {
		reload();
	}, [reload]);
	return {
		texts,
		defaults,
		loading,
		reload
	};
}
//#endregion
export { useDepositSettings as i, fillText as n, mergeTexts as r, DEFAULT_DEPOSIT_TEXTS as t };
