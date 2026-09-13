import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Nt as LoaderCircle } from "./vendor-icons-DF2A5Z8S.js";
import { r as getMyReseller } from "./app-data-Cb5ROche.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-CygHuric.js";
import { n as StoreVisitsReport, t as RangeTabs } from "./store-visits-report-D2pMwR2F.js";
//#region src/routes/_authenticated/reseller/visitors.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResellerVisitorsPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [range, setRange] = (0, import_react.useState)("today");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			let rId = user?.reseller?.id;
			if (!rId) rId = (await getMyReseller(user.id))?.id ?? null;
			setResellerId(rId ?? null);
			setLoading(false);
		})();
	}, [user]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Store visitors",
		description: "Live traffic on your storefront — pageviews, unique visitors and top pages."
	}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : !resellerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No store yet",
		description: "Your store is not ready, so there is no traffic to show."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreVisitsReport, {
		resellerId,
		range,
		extraHeader: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeTabs, {
			value: range,
			onChange: setRange
		})
	})] });
}
//#endregion
export { ResellerVisitorsPage as component };
