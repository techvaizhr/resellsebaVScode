import { r as getMyReseller } from "./app-data-CzwvE8w8.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { n as useAuth } from "./use-auth-DJu3SP6g.js";
import { n as StoreVisitsReport, t as RangeTabs } from "./store-visits-report-C3rwxokL.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
//#region src/routes/_authenticated/reseller/visitors.tsx?tsr-split=component
function ResellerVisitorsPage() {
	const { user } = useAuth();
	const [resellerId, setResellerId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [range, setRange] = useState("today");
	useEffect(() => {
		if (!user) return;
		(async () => {
			let rId = user?.reseller?.id;
			if (!rId) rId = (await getMyReseller(user.id))?.id ?? null;
			setResellerId(rId ?? null);
			setLoading(false);
		})();
	}, [user]);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Store visitors",
		description: "Live traffic on your storefront — pageviews, unique visitors and top pages."
	}), loading ? /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : !resellerId ? /* @__PURE__ */ jsx(EmptyState, {
		title: "No store yet",
		description: "Your store is not ready, so there is no traffic to show."
	}) : /* @__PURE__ */ jsx(StoreVisitsReport, {
		resellerId,
		range,
		extraHeader: /* @__PURE__ */ jsx(RangeTabs, {
			value: range,
			onChange: setRange
		})
	})] });
}
//#endregion
export { ResellerVisitorsPage as component };
