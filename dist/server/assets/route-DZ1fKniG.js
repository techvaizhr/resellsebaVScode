import { i as useBrandingTheme } from "./platform-branding-rd6YH8OY.js";
import { n as getPanelBootstrapPayload } from "./panel-bootstrap-BpYrFvi8.js";
import { n as getGlobalSettings, r as getMyReseller } from "./app-data-CzwvE8w8.js";
import { n as useAuth } from "./use-auth-DJu3SP6g.js";
import { n as consumeImpersonationReturnTarget } from "./impersonation-C-f1jb02.js";
import { t as canAccessResellerPanel } from "./reseller-status-Cim1Uohp.js";
import { n as useOrderNavCount, r as AppShell, t as applyOrderBadge } from "./use-order-nav-count-DcQbTRuX.js";
import { a as fmtDate, m as statusLabel } from "./subscription-SIvaJJhk.js";
import { t as useVerification } from "./use-verification-DBvCp0RV.js";
import { t as ImpersonationBanner } from "./impersonation-banner-BbdnRakU.js";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Activity, Award, BadgeCheck, ClipboardList, CreditCard, ExternalLink, Globe, GraduationCap, Headphones, LayoutDashboard, ListTree, Loader2, Lock, Megaphone, Package, Palette, Rocket, ScrollText, ShoppingBag, Store, TrendingUp, UserCircle, Users, Wallet } from "lucide-react";
//#region src/routes/_authenticated/reseller/route.tsx?tsr-split=component
var NAV = [
	{
		label: "Dashboard",
		to: "/reseller",
		icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" }),
		end: true
	},
	{
		label: "Products",
		icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }),
		items: [{
			label: "Catalog",
			to: "/reseller/catalog",
			icon: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" })
		}, {
			label: "My listings",
			to: "/reseller/listings",
			icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" })
		}]
	},
	{
		label: "Orders",
		to: "/reseller/orders",
		icon: /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" })
	},
	{
		label: "Customers",
		to: "/reseller/customers",
		icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
	},
	{
		label: "Finance",
		icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
		items: [
			{
				label: "Transactions",
				to: "/reseller/transactions",
				icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
			},
			{
				label: "Payouts",
				to: "/reseller/payouts",
				icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
			},
			{
				label: "Leader commissions",
				to: "/reseller/commissions",
				icon: /* @__PURE__ */ jsx(Award, { className: "h-4 w-4" })
			},
			{
				label: "My subscription",
				to: "/reseller/subscription",
				icon: /* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "Growth",
		icon: /* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4" }),
		items: [{
			label: "Marketing",
			to: "/reseller/marketing",
			icon: /* @__PURE__ */ jsx(Megaphone, { className: "h-4 w-4" })
		}, {
			label: "Video tutorials",
			to: "/reseller/tutorials",
			icon: /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" })
		}]
	},
	{
		label: "Store",
		icon: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }),
		items: [
			{
				label: "General settings",
				to: "/reseller/settings",
				icon: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" })
			},
			{
				label: "Payment methods",
				to: "/reseller/payments",
				icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" })
			},
			{
				label: "Theme",
				to: "/reseller/theme",
				icon: /* @__PURE__ */ jsx(Palette, { className: "h-4 w-4" })
			},
			{
				label: "Header menu",
				to: "/reseller/menus",
				icon: /* @__PURE__ */ jsx(ListTree, { className: "h-4 w-4" })
			},
			{
				label: "Domain",
				to: "/reseller/domain",
				icon: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" })
			},
			{
				label: "Visitors",
				to: "/reseller/visitors",
				icon: /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "My profile",
		to: "/reseller/profile",
		icon: /* @__PURE__ */ jsx(UserCircle, { className: "h-4 w-4" })
	},
	{
		label: "Policies",
		to: "/reseller/policies",
		icon: /* @__PURE__ */ jsx(ScrollText, { className: "h-4 w-4" })
	},
	{
		label: "Support",
		to: "/reseller/support",
		icon: /* @__PURE__ */ jsx(Headphones, { className: "h-4 w-4" })
	}
];
function ResellerLayout() {
	const { user, roles, loading } = useAuth();
	const orderNavCount = useOrderNavCount();
	const [subscription, setSubscription] = useState(null);
	const navWithBadge = useMemo(() => {
		return applyOrderBadge(subscription && subscription.store_enabled === false ? NAV.filter((n) => n.label !== "Store") : NAV, "/reseller/orders", orderNavCount);
	}, [orderNavCount, subscription]);
	const { required: needsVerify, loading: verifyLoading } = useVerification();
	const location = useLocation();
	const nav = useNavigate();
	const [storeName, setStoreName] = useState("My store");
	const [logoUrl, setLogoUrl] = useState(null);
	const [storeCode, setStoreCode] = useState(null);
	const [primary, setPrimary] = useState(null);
	const [accent, setAccent] = useState(null);
	const [radius, setRadius] = useState(null);
	const [avatarUrl, setAvatarUrl] = useState(null);
	const [approved, setApproved] = useState(null);
	useEffect(() => {
		if (loading || verifyLoading || !user) return;
		if (needsVerify) {
			nav({
				to: "/verify",
				replace: true
			});
			return;
		}
		if (roles.includes("super_admin") || roles.includes("staff")) {
			nav({
				to: consumeImpersonationReturnTarget() ?? "/admin",
				replace: true
			});
			return;
		}
		if (approved === null) return;
		if (approved === false) nav({
			to: "/onboarding",
			replace: true
		});
	}, [
		approved,
		loading,
		roles,
		nav,
		needsVerify,
		verifyLoading,
		user
	]);
	useEffect(() => {
		if (approved === false) nav({
			to: "/onboarding",
			replace: true
		});
	}, [approved, nav]);
	useEffect(() => {
		if (!user) return;
		let alive = true;
		const loadBranding = async () => {
			const [g, r] = await Promise.all([getGlobalSettings(), getMyReseller(user.id)]);
			if (!alive) return;
			let logo = g?.logo_url ?? null;
			let color = g?.primary_color ?? null;
			let acc = g?.accent_color ?? null;
			let rad = g?.border_radius ?? null;
			if (r) {
				setApproved(canAccessResellerPanel(r.status));
				setStoreName(r.business_name);
				setStoreCode(r.code);
				setAvatarUrl(r.avatar_url ?? null);
				const boot = getPanelBootstrapPayload();
				setSubscription(boot?.subscription ?? null);
				const s = boot?.reseller_settings ?? null;
				if (s?.logo_url) logo = s.logo_url;
				if (s?.primary_color) color = s.primary_color;
			} else setApproved(false);
			setLogoUrl(logo);
			setPrimary(color);
			setAccent(acc);
			setRadius(rad);
		};
		loadBranding();
		const onBrandUpdate = (e) => {
			const detail = e?.detail;
			if (detail) {
				if (detail.primary_color) setPrimary(detail.primary_color);
				if (detail.accent_color) setAccent(detail.accent_color);
				if (detail.border_radius) setRadius(detail.border_radius);
				if (detail.logo_url !== void 0) setLogoUrl(detail.logo_url);
			} else loadBranding();
		};
		window.addEventListener("brand_settings_updated", onBrandUpdate);
		return () => {
			alive = false;
			window.removeEventListener("brand_settings_updated", onBrandUpdate);
		};
	}, [user]);
	useBrandingTheme(primary, accent, { radius });
	if (loading || !user || verifyLoading || approved !== true) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const locked = Boolean(subscription?.locked) && ![
		"/reseller/subscription",
		"/reseller/profile",
		"/reseller/support"
	].some((p) => location.pathname.startsWith(p));
	return /* @__PURE__ */ jsxs(AppShell, {
		title: "Reseller panel",
		homeTo: "/reseller",
		bottomNav: {
			homeTo: "/reseller",
			left: {
				label: "Orders",
				to: "/reseller/orders",
				icon: ClipboardList,
				badge: orderNavCount
			},
			right: {
				label: "Catalog",
				to: "/reseller/catalog",
				icon: Package
			}
		},
		brand: {
			name: storeName,
			sub: storeCode ? `/${storeCode}` : "Reseller",
			logoUrl
		},
		nav: navWithBadge,
		user: {
			name: storeName || user.user_metadata?.full_name || user.name || "Reseller",
			email: user.email ?? "",
			avatarUrl
		},
		headerRight: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
			to: "/reseller/catalog",
			title: "Catalog",
			className: "hidden md:inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3",
			children: [/* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
				className: "hidden sm:inline",
				children: "Catalog"
			})]
		}), storeCode ? /* @__PURE__ */ jsxs("a", {
			href: `/s/${storeCode}`,
			target: "_blank",
			rel: "noreferrer",
			title: "Visit store",
			className: "inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3",
			children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
				className: "hidden sm:inline",
				children: "Visit store"
			})]
		}) : null] }),
		children: [
			/* @__PURE__ */ jsx(ImpersonationBanner, {}),
			subscription?.status === "grace" ? /* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-400",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"Your subscription ended on ",
					fmtDate(subscription.current_period_end ?? subscription.ends_at),
					" —",
					" ",
					subscription.grace_days_left ?? 0,
					" day(s) of grace access left."
				] }), /* @__PURE__ */ jsx(Link, {
					to: "/reseller/subscription",
					className: "rounded-md bg-amber-500 px-2.5 py-1 font-semibold text-white",
					children: "Renew now"
				})]
			}) : null,
			locked ? /* @__PURE__ */ jsx(SubscriptionLock, { state: subscription }) : /* @__PURE__ */ jsx(Outlet, {})
		]
	});
}
/** Shown instead of the page when the plan has expired past its grace period. */
function SubscriptionLock({ state }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-lg py-16 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-semibold",
				children: "Your subscription has ended"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					statusLabel(state?.status),
					" · ",
					state?.plan_name ?? "No plan",
					" — the panel, your storefront and new orders stay paused until the plan is renewed."
				]
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/reseller/subscription",
				className: "mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
				children: "Renew subscription"
			})
		]
	});
}
//#endregion
export { ResellerLayout as component };
