import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CLBrUPi_.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-DCG8c37g.js";
import { t as CustomersReport } from "./customers-report-CIcAaim4.js";
//#region src/routes/_authenticated/admin/customers.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomersPage() {
	const canExport = useCan()("customers.view", "orders.view");
	const [names, setNames] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("resellers").select("id, code, business_name").order("business_name");
			const m = /* @__PURE__ */ new Map();
			for (const r of data ?? []) m.set(r.id, `${r.business_name} (${r.code})`);
			setNames(m);
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Customers",
		description: "Every customer across all stores — order history, value and contact. Export to Excel or CSV anytime."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersReport, {
		resellerNames: names,
		showStore: true,
		allowExport: canExport
	})] });
}
//#endregion
export { AdminCustomersPage as component };
