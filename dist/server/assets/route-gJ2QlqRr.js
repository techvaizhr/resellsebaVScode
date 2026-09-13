import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { n as Outlet } from "./Match-D8nEIile.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { t as useLocation } from "./useLocation-CVRlTV0S.js";
import { f as ROUTE_PERMISSIONS, r as supabase } from "./client-CiD-puKw.js";
import { i as useBrandingTheme } from "./platform-branding-DO8pd0Ly.js";
import { A as SlidersVertical, Ct as Megaphone, I as ShieldCheck, M as ShoppingCart, Mt as LoaderCircle, Nn as Cog, On as Database, P as Shield, R as Settings, S as Store, Sn as Eraser, Tr as Activity, U as ScrollText, Vt as LayoutDashboard, X as Receipt, Zt as House, a as Wallet, at as Percent, b as Tag, c as Users, cn as Globe, d as UserCheck, dr as Bell, gr as BadgeCheck, in as Handshake, jn as Contact, m as Truck, mn as FileText, nr as ChartLine, p as Undo2, pt as Package, q as Rocket, sn as GraduationCap, tr as ChartPie, un as FolderTree, y as Target } from "./vendor-icons-BEaCFqaT.js";
import { n as getGlobalSettings } from "./app-data-CF0v-2hN.js";
import { n as useAuth } from "./use-auth-BphzVqAU.js";
import { t as BulkScanButton } from "./BulkScanModal-BJn0C8BD.js";
import { n as useOrderNavCount, r as AppShell, t as applyOrderBadge } from "./use-order-nav-count-BkKJYHl-.js";
//#region src/routes/_authenticated/admin/route.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Which permission unlocks each admin route (see src/lib/permissions.ts). */
var NAV = [
	{
		label: "Dashboard",
		to: "/admin",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }),
		end: true
	},
	{
		label: "Catalog",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
		items: [
			{
				label: "Products",
				to: "/admin/products",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
			},
			{
				label: "Brands",
				to: "/admin/brands",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
			},
			{
				label: "Categories",
				to: "/admin/categories",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "h-4 w-4" })
			},
			{
				label: "Media Library",
				to: "/admin/media",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4 rotate-12" })
			}
		]
	},
	{
		label: "Orders",
		to: "/admin/orders",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" })
	},
	{
		label: "Customers",
		to: "/admin/customers",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, { className: "h-4 w-4" })
	},
	{
		label: "Finance",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
		items: [
			{
				label: "Transaction Report",
				to: "/admin/transactions",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4" })
			},
			{
				label: "Business report",
				to: "/admin/business-report",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "h-4 w-4" })
			},
			{
				label: "Expenses",
				to: "/admin/expenses",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" })
			},
			{
				label: "Payouts",
				to: "/admin/payouts",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
			},
			{
				label: "Commissions",
				to: "/admin/commissions",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" })
			},
			{
				label: "Subscriptions",
				to: "/admin/subscriptions",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4" })
			},
			{
				label: "Deposit transactions",
				to: "/admin/deposit-transactions",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "Resellers",
		to: "/admin/resellers",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-4 w-4" })
	},
	{
		label: "Suppliers",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }),
		items: [
			{
				label: "Supplier accounts",
				to: "/admin/suppliers",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
			},
			{
				label: "Supplier report",
				to: "/admin/supplier-report",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" })
			},
			{
				label: "Return handover",
				to: "/admin/supplier-returns",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
			},
			{
				label: "Supplier payouts",
				to: "/admin/supplier-payouts",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "Agents",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }),
		items: [
			{
				label: "Commission Agents",
				to: "/admin/agents",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" })
			},
			{
				label: "Agent report",
				to: "/admin/agent-report",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" })
			},
			{
				label: "Commission payout",
				to: "/admin/agent-payouts",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "Store visitors",
		to: "/admin/visitors",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
	},
	{
		label: "Growth",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-4 w-4" }),
		items: [
			{
				label: "Marketing",
				to: "/admin/marketing",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" })
			},
			{
				label: "Notifications",
				to: "/admin/notifications",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
			},
			{
				label: "Reseller notices",
				to: "/admin/notices",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" })
			},
			{
				label: "Video tutorials",
				to: "/admin/tutorials",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4" })
			}
		]
	},
	{
		label: "System",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cog, { className: "h-4 w-4" }),
		items: [
			{
				label: "Landing page",
				to: "/admin/landing",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
			},
			{
				label: "Couriers",
				to: "/admin/couriers",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
			},
			{
				label: "Payment methods",
				to: "/admin/payments",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
			},
			{
				label: "Staff & Permissions",
				to: "/admin/staff",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
			},
			{
				label: "Custom domains",
				to: "/admin/domains",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" })
			},
			{
				label: "Cache & cleanup",
				to: "/admin/maintenance",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "h-4 w-4" })
			},
			{
				label: "Backup & Restore",
				to: "/admin/backup",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" })
			},
			{
				label: "Advanced settings",
				to: "/admin/advanced",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4" })
			},
			{
				label: "Reseller policies",
				to: "/admin/policies",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-4 w-4" })
			},
			{
				label: "Privacy policy",
				to: "/admin/privacy",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
			},
			{
				label: "Settings",
				to: "/admin/settings",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
			}
		]
	}
];
function allowed(to, permissions, isSuperAdmin) {
	if (isSuperAdmin) return true;
	if (!to) return true;
	const needed = ROUTE_PERMISSIONS[to];
	if (!needed) return true;
	return needed.some((p) => permissions.includes(p));
}
function filterNav(nav, permissions, isSuperAdmin) {
	if (isSuperAdmin) return nav;
	const out = [];
	for (const entry of nav) {
		const group = entry;
		if (group.items) {
			const items = group.items.filter((i) => allowed(i.to, permissions, isSuperAdmin));
			if (items.length > 0) out.push({
				...entry,
				items
			});
			continue;
		}
		if (allowed(entry.to, permissions, isSuperAdmin)) out.push(entry);
	}
	return out;
}
/** First admin route this permission set can actually open (nav order). */
function firstAllowedRoute(nav, permissions) {
	for (const entry of nav) {
		const group = entry;
		if (group.items) {
			for (const item of group.items) if (item.to && allowed(item.to, permissions, false)) return item.to;
			continue;
		}
		const to = entry.to;
		if (to && allowed(to, permissions, false)) return to;
	}
	return null;
}
function AdminLayout() {
	const { user, roles, permissions, loading } = useAuth();
	const orderNavCount = useOrderNavCount();
	const nav = useNavigate();
	const pathname = useLocation({ select: (location) => location.pathname });
	const isSuperAdmin = roles.includes("super_admin");
	const navWithBadge = (0, import_react.useMemo)(() => applyOrderBadge(filterNav(NAV, permissions, isSuperAdmin), "/admin/orders", orderNavCount), [
		orderNavCount,
		permissions,
		isSuperAdmin
	]);
	const isStaff = roles.includes("staff");
	const canEnter = isSuperAdmin || isStaff;
	const routePermission = Object.entries(ROUTE_PERMISSIONS).sort(([a], [b]) => b.length - a.length).find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1];
	const canViewRoute = isSuperAdmin || isStaff && routePermission != null && routePermission.some((permission) => permissions.includes(permission));
	const landing = isSuperAdmin ? "/admin" : firstAllowedRoute(NAV, permissions);
	const canCatalog = isSuperAdmin || permissions.includes("products.view") || permissions.includes("products.manage");
	const canScan = isSuperAdmin || permissions.includes("orders.status");
	const [brand, setBrand] = (0, import_react.useState)({
		name: "Admin",
		logoUrl: null,
		primary: null,
		accent: null,
		radius: null
	});
	(0, import_react.useEffect)(() => {
		if (loading || !user) return;
		if (canEnter && canViewRoute) return;
		if (!isSuperAdmin && !isStaff && (roles.includes("reseller") || roles.includes("leader"))) {
			nav({
				to: "/reseller",
				replace: true
			});
			return;
		}
		if (!canEnter) {
			nav({
				to: "/dashboard",
				replace: true
			});
			return;
		}
		if (landing && landing !== pathname) nav({
			to: landing,
			replace: true
		});
	}, [
		loading,
		user,
		canEnter,
		canViewRoute,
		roles,
		permissions,
		pathname,
		nav,
		isStaff,
		isSuperAdmin,
		landing
	]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const loadBrand = () => {
			getGlobalSettings(true).then((data) => {
				if (!alive || !data) return;
				setBrand({
					name: data.site_name ?? "Admin",
					logoUrl: data.logo_url ?? null,
					primary: data.primary_color ?? null,
					accent: data.accent_color ? String(data.accent_color) : null,
					radius: data?.border_radius ? String(data.border_radius) : null
				});
			});
		};
		loadBrand();
		const onBrandUpdate = (e) => {
			const detail = e?.detail;
			if (detail) setBrand((prev) => ({
				...prev,
				name: detail.site_name || prev.name,
				logoUrl: detail.logo_url !== void 0 ? detail.logo_url : prev.logoUrl,
				primary: detail.primary_color || prev.primary,
				accent: detail.accent_color || prev.accent,
				radius: detail.border_radius || prev.radius
			}));
			else loadBrand();
		};
		window.addEventListener("brand_settings_updated", onBrandUpdate);
		return () => {
			alive = false;
			window.removeEventListener("brand_settings_updated", onBrandUpdate);
		};
	}, []);
	useBrandingTheme(brand.primary, brand.accent, { radius: brand.radius });
	if (!loading && user && canEnter && !canViewRoute && !landing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-w-sm p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: "No panel access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Your account does not have permission for any page yet. Please contact the super admin."
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
	if (loading || !user || !canEnter || !canViewRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: isSuperAdmin ? "Super Admin" : "Staff Panel",
		homeTo: "/admin",
		bottomNav: {
			homeTo: "/admin",
			left: {
				label: "Orders",
				to: "/admin/orders",
				icon: ShoppingCart,
				badge: orderNavCount
			},
			right: {
				label: "Catalog",
				to: "/admin/products",
				icon: Package
			}
		},
		mobileFooterLinks: canCatalog ? [{
			label: "Public catalog",
			to: "/catalog",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }),
			external: true
		}, {
			label: "Homepage",
			to: "/",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }),
			external: true
		}] : void 0,
		headerRight: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [canCatalog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "/catalog",
			target: "_blank",
			rel: "noreferrer",
			title: "Open public catalog",
			className: "hidden md:inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Catalog"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "/",
			target: "_blank",
			rel: "noreferrer",
			title: "Open homepage",
			className: "hidden md:inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium transition hover:bg-muted sm:px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Home"
			})]
		})] }) : null, canScan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkScanButton, { compact: true }) : null] }),
		brand: {
			name: brand.name,
			sub: isSuperAdmin ? "Admin panel" : "Staff panel",
			logoUrl: brand.logoUrl
		},
		nav: navWithBadge,
		user: {
			name: user.user_metadata?.full_name ?? user.name ?? (isSuperAdmin ? "Admin" : "Staff"),
			email: user.email ?? ""
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AdminLayout as component };
