import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { n as Outlet } from "./Match-D8nEIile.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-CLBrUPi_.js";
import { i as useBrandingTheme } from "./platform-branding-DO8pd0Ly.js";
import { Hn as CircleUser, Ht as LayoutDashboard, Jt as Image, L as ShieldAlert, M as ShoppingCart, Nt as LoaderCircle, a as Wallet, ht as PackageSearch, mt as Package, p as Undo2 } from "./vendor-icons-DF2A5Z8S.js";
import { n as getGlobalSettings } from "./app-data-YK8UJDGT.js";
import { n as useAuth } from "./use-auth-DCG8c37g.js";
import { a as loadSupplierBootstrap } from "./supplier-CmLddz-1.js";
import { n as useOrderNavCount, r as AppShell, t as applyOrderBadge } from "./use-order-nav-count-BZK4n6oK.js";
import { t as useVerification } from "./use-verification-CurkehSY.js";
import { t as ImpersonationBanner } from "./impersonation-banner-BrO9F5cO.js";
import { t as SupplierProvider } from "./supplier-context-BEx8Svyo.js";
//#region src/routes/_authenticated/supplier/route.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		label: "Dashboard",
		to: "/supplier",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
		end: true
	},
	{
		label: "My products",
		to: "/supplier/products",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
	},
	{
		label: "Media Library",
		to: "/supplier/media",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" })
	},
	{
		label: "My orders",
		to: "/supplier/orders",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" })
	},
	{
		label: "Sales report",
		to: "/supplier/report",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-4 w-4" })
	},
	{
		label: "Returns",
		to: "/supplier/returns",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
	},
	{
		label: "Payouts",
		to: "/supplier/payouts",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
	},
	{
		label: "My profile",
		to: "/supplier/profile",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "h-4 w-4" })
	}
];
function SupplierLayout() {
	const { user, roles, loading } = useAuth();
	const orderNavCount = useOrderNavCount();
	const navWithBadge = (0, import_react.useMemo)(() => applyOrderBadge(NAV, "/supplier/orders", orderNavCount), [orderNavCount]);
	const { required: needsVerify, loading: verifyLoading } = useVerification();
	const nav = useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [state, setState] = (0, import_react.useState)("loading");
	const [reloading, setReloading] = (0, import_react.useState)(false);
	const [primary, setPrimary] = (0, import_react.useState)(null);
	const [accent, setAccent] = (0, import_react.useState)(null);
	const [radius, setRadius] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		try {
			const [boot, g] = await Promise.all([loadSupplierBootstrap(), getGlobalSettings()]);
			if (boot?.supplier) {
				setData(boot);
				setState("ready");
			} else setState("none");
			const prim = g?.primary_color || boot?.settings?.primary_color || null;
			const acc = g?.accent_color || (boot?.settings)?.accent_color || null;
			const rad = g?.border_radius || (boot?.settings)?.border_radius || null;
			setPrimary(prim);
			setAccent(acc);
			setRadius(rad);
		} catch {
			setState("none");
		}
	}, []);
	const reload = (0, import_react.useCallback)(async () => {
		setReloading(true);
		try {
			await load();
		} finally {
			setReloading(false);
		}
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (loading || !user) return;
		load();
		const onBrandUpdate = (e) => {
			const detail = e?.detail;
			if (detail) {
				if (detail.primary_color) setPrimary(detail.primary_color);
				if (detail.accent_color) setAccent(detail.accent_color);
				if (detail.border_radius) setRadius(detail.border_radius);
			} else load();
		};
		window.addEventListener("brand_settings_updated", onBrandUpdate);
		return () => {
			window.removeEventListener("brand_settings_updated", onBrandUpdate);
		};
	}, [
		loading,
		user,
		load
	]);
	(0, import_react.useEffect)(() => {
		if (loading || verifyLoading || !user) return;
		if (needsVerify) {
			nav({
				to: "/verify",
				replace: true
			});
			return;
		}
		if ((roles.includes("super_admin") || roles.includes("staff")) && !roles.includes("supplier") && state === "none") {
			nav({
				to: "/admin",
				replace: true
			});
			return;
		}
		if (state === "none" && !roles.includes("supplier") && !roles.includes("super_admin")) nav({
			to: "/dashboard",
			replace: true
		});
	}, [
		loading,
		verifyLoading,
		user,
		needsVerify,
		roles,
		nav,
		state
	]);
	useBrandingTheme(primary, accent, { radius });
	if (loading || verifyLoading || !user || state === "loading" || !data?.supplier) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const supplier = data.supplier;
	if (supplier.status !== "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-w-md p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-500/10 text-amber-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: supplier.status === "pending" ? "Account pending approval" : "Account suspended"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: supplier.status === "pending" ? "Your supplier account is under review. The dashboard will be enabled once the admin approves it." : "Your supplier account is currently inactive. Please contact the admin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: ["Supplier code: ", supplier.code]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: async () => {
						await supabase.auth.signOut();
						window.location.href = "/login";
					},
					className: "mt-6 text-xs font-medium text-muted-foreground hover:text-foreground",
					children: "Sign out"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierProvider, {
		value: {
			data,
			reload,
			reloading
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
			title: "Supplier panel",
			homeTo: "/supplier",
			bottomNav: {
				homeTo: "/supplier",
				left: {
					label: "Orders",
					to: "/supplier/orders",
					icon: ShoppingCart,
					badge: orderNavCount
				},
				right: {
					label: "Products",
					to: "/supplier/products",
					icon: Package
				}
			},
			brand: {
				name: data.settings?.site_name ?? "Supplier",
				sub: supplier.code,
				logoUrl: data.settings?.logo_url ?? null
			},
			nav: navWithBadge,
			user: {
				name: supplier.display_name,
				email: user.email ?? ""
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpersonationBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
		})
	});
}
//#endregion
export { SupplierLayout as component };
