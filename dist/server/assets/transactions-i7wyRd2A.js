import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as Route } from "./transactions-CFozFlKB.js";
import { t as TransactionReport } from "./transaction-report-DoEtoHXk.js";
//#region src/routes/_authenticated/admin/transactions.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function AdminTransactionReportPage() {
	const { reseller } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionReport, {
			admin: true,
			initialReseller: reseller ?? null
		})
	});
}
//#endregion
export { AdminTransactionReportPage as component };
