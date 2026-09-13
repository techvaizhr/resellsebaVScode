import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Nt as LoaderCircle } from "./vendor-icons-DF2A5Z8S.js";
import { r as getMyReseller } from "./app-data-DrOhMwcy.js";
import { n as useAuth } from "./use-auth-zbqaYCVZ.js";
import { t as TransactionReport } from "./transaction-report-Br_Yc7sU.js";
//#region src/routes/_authenticated/reseller/transactions.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TransactionsPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyReseller(user.id).then((data) => {
			setResellerId(data?.id ?? null);
			setLoading(false);
		});
	}, [user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
		}) : !resellerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card p-8 text-center text-xs text-muted-foreground",
			children: "No reseller account found."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionReport, { resellerId })
	});
}
//#endregion
export { TransactionsPage as component };
