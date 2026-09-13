import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Mt as LoaderCircle } from "./vendor-icons-BWIzFOtW.js";
import { r as getMyReseller } from "./app-data-DwbOGY7V.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BsApJ5EH.js";
import { t as CustomersReport } from "./customers-report-BE1DHvLE.js";
//#region src/routes/_authenticated/reseller/customers.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResellerCustomersPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const data = await getMyReseller(user.id);
			setResellerId(data?.id ?? null);
			setLoading(false);
		})();
	}, [user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "My customers",
		description: "Your own buyers only — order history, value and quick contact."
	}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : !resellerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No store yet",
		description: "Your store is not ready, so there are no customers yet."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersReport, { resellerId })] });
}
//#endregion
export { ResellerCustomersPage as component };
