import { r as supabase } from "./client-CdRSQB5v.js";
import { i as useBrandingTheme } from "./platform-branding-rd6YH8OY.js";
import { n as getGlobalSettings } from "./app-data-tJP6g7R4.js";
import { n as useAuth } from "./use-auth-L4LMIQqu.js";
import { a as loadSupplierBootstrap } from "./supplier-Iwv2PE9u.js";
import { n as useOrderNavCount, r as AppShell, t as applyOrderBadge } from "./use-order-nav-count-BGU9oeiD.js";
import { t as useVerification } from "./use-verification-Dg4xBakf.js";
import { t as ImpersonationBanner } from "./impersonation-banner-pxYhYT55.js";
import { t as SupplierProvider } from "./supplier-context-C2IdSO3T.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Image, LayoutDashboard, Loader2, Package, PackageSearch, ShieldAlert, ShoppingCart, Undo2, UserCircle, Wallet } from "lucide-react";
//#region src/routes/_authenticated/supplier/route.tsx?tsr-split=component
var NAV = [
	{
		label: "Dashboard",
		to: "/supplier",
		icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" }),
		end: true
	},
	{
		label: "My products",
		to: "/supplier/products",
		icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" })
	},
	{
		label: "Media Library",
		to: "/supplier/media",
		icon: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
	},
	{
		label: "My orders",
		to: "/supplier/orders",
		icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4" })
	},
	{
		label: "Sales report",
		to: "/supplier/report",
		icon: /* @__PURE__ */ jsx(PackageSearch, { className: "h-4 w-4" })
	},
	{
		label: "Returns",
		to: "/supplier/returns",
		icon: /* @__PURE__ */ jsx(Undo2, { className: "h-4 w-4" })
	},
	{
		label: "Payouts",
		to: "/supplier/payouts",
		icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
	},
	{
		label: "My profile",
		to: "/supplier/profile",
		icon: /* @__PURE__ */ jsx(UserCircle, { className: "h-4 w-4" })
	}
];
function SupplierLayout() {
	const { user, roles, loading } = useAuth();
	const orderNavCount = useOrderNavCount();
	const navWithBadge = useMemo(() => applyOrderBadge(NAV, "/supplier/orders", orderNavCount), [orderNavCount]);
	const { required: needsVerify, loading: verifyLoading } = useVerification();
	const nav = useNavigate();
	const [data, setData] = useState(null);
	const [state, setState] = useState("loading");
	const [reloading, setReloading] = useState(false);
	const [primary, setPrimary] = useState(null);
	const [accent, setAccent] = useState(null);
	const [radius, setRadius] = useState(null);
	const load = useCallback(async () => {
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
	const reload = useCallback(async () => {
		setReloading(true);
		try {
			await load();
		} finally {
			setReloading(false);
		}
	}, [load]);
	useEffect(() => {
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
	useEffect(() => {
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
	if (loading || verifyLoading || !user || state === "loading" || !data?.supplier) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const supplier = data.supplier;
	if (supplier.status !== "active") return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "surface-card max-w-md p-8 text-center",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-500/10 text-amber-500",
					children: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-lg font-semibold",
					children: supplier.status === "pending" ? "Account pending approval" : "Account suspended"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: supplier.status === "pending" ? "Your supplier account is under review. The dashboard will be enabled once the admin approves it." : "Your supplier account is currently inactive. Please contact the admin."
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: ["Supplier code: ", supplier.code]
				}),
				/* @__PURE__ */ jsx("button", {
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
	return /* @__PURE__ */ jsx(SupplierProvider, {
		value: {
			data,
			reload,
			reloading
		},
		children: /* @__PURE__ */ jsxs(AppShell, {
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
			children: [/* @__PURE__ */ jsx(ImpersonationBanner, {}), /* @__PURE__ */ jsx(Outlet, {})]
		})
	});
}
//#endregion
export { SupplierLayout as component };
