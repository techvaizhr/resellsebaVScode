import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { Nt as LoaderCircle, Y as RefreshCw } from "./vendor-icons-DF2A5Z8S.js";
import { n as useAuth } from "./use-auth-CSAYNNFO.js";
import { t as useVerification } from "./use-verification-COwSORFz.js";
//#region src/routes/_authenticated/dashboard.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardRouter() {
	const { roles, permissions, loading, user, accessError } = useAuth();
	const { required: needsVerify, loading: verifyLoading } = useVerification();
	const nav = useNavigate();
	const done = (0, import_react.useRef)(false);
	const [stuck, setStuck] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (loading || verifyLoading || !user || done.current) return;
		if (needsVerify) {
			done.current = true;
			nav({
				to: "/verify",
				replace: true
			});
			return;
		}
		const isSuperAdmin = roles.includes("super_admin");
		const isStaff = roles.includes("staff");
		const isReseller = roles.includes("reseller") || roles.includes("leader");
		const isSupplier = roles.includes("supplier");
		if (isSuperAdmin || isStaff) {
			done.current = true;
			nav({
				to: "/admin",
				replace: true
			});
			return;
		}
		if (isSupplier) {
			done.current = true;
			nav({
				to: "/supplier",
				replace: true
			});
			return;
		}
		if (isReseller) {
			done.current = true;
			nav({
				to: "/reseller",
				replace: true
			});
			return;
		}
		done.current = true;
		(async () => {
			try {
				if (!accessError) {
					try {
						await supabase.rpc("bootstrap_current_user");
					} catch {}
					const { data: sup } = await supabase.from("suppliers").select("id").eq("user_id", user.id).maybeSingle();
					if (sup) {
						nav({
							to: "/supplier",
							replace: true
						});
						return;
					}
					const { data, error } = await supabase.from("resellers").select("status").eq("user_id", user.id).maybeSingle();
					if (!error) {
						if (data?.status === "active") nav({
							to: "/reseller",
							replace: true
						});
						else nav({
							to: "/onboarding",
							replace: true
						});
						return;
					}
				}
			} catch {}
			done.current = false;
			setStuck(true);
		})();
	}, [
		roles,
		permissions,
		loading,
		user,
		nav,
		needsVerify,
		verifyLoading,
		accessError
	]);
	if (stuck) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-w-sm p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: "Could not load your account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "We couldn't find your panel due to a network issue. Please try again."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => window.location.reload(),
					className: "btn-brand mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Try again"]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
}
//#endregion
export { DashboardRouter as component };
