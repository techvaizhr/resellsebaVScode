import { r as getMyReseller } from "./app-data-DxwZMsmL.js";
import { n as useAuth } from "./use-auth-BPiZPMVq.js";
import { t as TransactionReport } from "./transaction-report-DSKJ4zPP.js";
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
//#region src/routes/_authenticated/reseller/transactions.tsx?tsr-split=component
function TransactionsPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!user) return;
		getMyReseller(user.id).then((data) => {
			setResellerId(data?.id ?? null);
			setLoading(false);
		});
	}, [user]);
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-5",
		children: loading ? /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center py-16",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" })
		}) : !resellerId ? /* @__PURE__ */ jsx("div", {
			className: "surface-card p-8 text-center text-xs text-muted-foreground",
			children: "No reseller account found."
		}) : /* @__PURE__ */ jsx(TransactionReport, { resellerId })
	});
}
//#endregion
export { TransactionsPage as component };
