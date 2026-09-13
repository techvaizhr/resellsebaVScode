import { r as getMyReseller } from "./app-data-tJP6g7R4.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { n as useAuth } from "./use-auth-L4LMIQqu.js";
import { t as CustomersReport } from "./customers-report-K0X8KKM3.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
//#region src/routes/_authenticated/reseller/customers.tsx?tsr-split=component
function ResellerCustomersPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!user) return;
		(async () => {
			const data = await getMyReseller(user.id);
			setResellerId(data?.id ?? null);
			setLoading(false);
		})();
	}, [user]);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "My customers",
		description: "Your own buyers only — order history, value and quick contact."
	}), loading ? /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : !resellerId ? /* @__PURE__ */ jsx(EmptyState, {
		title: "No store yet",
		description: "Your store is not ready, so there are no customers yet."
	}) : /* @__PURE__ */ jsx(CustomersReport, { resellerId })] });
}
//#endregion
export { ResellerCustomersPage as component };
