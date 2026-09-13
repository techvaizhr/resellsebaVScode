import { r as supabase } from "./client-CdRSQB5v.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { r as useCan } from "./use-auth-L4LMIQqu.js";
import { t as CustomersReport } from "./customers-report-K0X8KKM3.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/_authenticated/admin/customers.tsx?tsr-split=component
function AdminCustomersPage() {
	const canExport = useCan()("customers.view", "orders.view");
	const [names, setNames] = useState(/* @__PURE__ */ new Map());
	useEffect(() => {
		(async () => {
			const { data } = await supabase.from("resellers").select("id, code, business_name").order("business_name");
			const m = /* @__PURE__ */ new Map();
			for (const r of data ?? []) m.set(r.id, `${r.business_name} (${r.code})`);
			setNames(m);
		})();
	}, []);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Customers",
		description: "Every customer across all stores — order history, value and contact. Export to Excel or CSV anytime."
	}), /* @__PURE__ */ jsx(CustomersReport, {
		resellerNames: names,
		showStore: true,
		allowExport: canExport
	})] });
}
//#endregion
export { AdminCustomersPage as component };
