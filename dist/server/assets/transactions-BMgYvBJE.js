import { t as Route } from "./transactions-Cv8UDzpy.js";
import { t as TransactionReport } from "./transaction-report-oTn5bPa-.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_authenticated/admin/transactions.tsx?tsr-split=component
function AdminTransactionReportPage() {
	const { reseller } = Route.useSearch();
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-5",
		children: /* @__PURE__ */ jsx(TransactionReport, {
			admin: true,
			initialReseller: reseller ?? null
		})
	});
}
//#endregion
export { AdminTransactionReportPage as component };
