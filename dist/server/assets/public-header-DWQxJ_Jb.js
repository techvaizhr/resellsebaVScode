import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useRouterState } from "./useRouterState-N4HScaPp.js";
import { r as supabase } from "./client-BAn7XKYw.js";
import { St as Menu, Zt as House, br as ArrowRight, r as X } from "./vendor-icons-BEaCFqaT.js";
//#region src/components/public-header.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK = { nav: {
	features: "Features",
	how: "How it works",
	categories: "Categories",
	faq: "FAQ",
	signIn: "লগইন",
	cta: "Get started"
} };
function Brand({ siteName, logoUrl, size = "md" }) {
	const [imgError, setImgError] = (0, import_react.useState)(false);
	const effectiveLogo = !imgError ? logoUrl || "/uploads/branding/166777d0-f627-4904-8b3d-ae5b024b9b50.webp" : null;
	const h = size === "md" ? "h-12 sm:h-14" : "h-9";
	if (effectiveLogo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: effectiveLogo,
		alt: siteName,
		className: `${h} max-w-40 shrink-0 object-contain`,
		onError: () => setImgError(true)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `grid ${size === "md" ? "h-11 w-11" : "h-9 w-9"} shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-lg font-black text-primary-foreground`,
		children: siteName.charAt(0).toUpperCase()
	});
}
function PublicHeader({ siteName: siteNameProp, logoUrl: logoUrlProp, content }) {
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [loadedBrand, setLoadedBrand] = (0, import_react.useState)({
		siteName: "Reseller",
		logoUrl: null
	});
	const [loadedContent, setLoadedContent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const needsBrand = siteNameProp === void 0 || logoUrlProp === void 0;
		const needsContent = !content;
		if (!needsBrand && !needsContent) return;
		(async () => {
			const { data } = await supabase.from("global_settings").select("site_name, logo_url, landing_content").eq("id", 1).maybeSingle();
			if (!data) return;
			const d = data;
			if (needsBrand) setLoadedBrand({
				siteName: d.site_name ?? "Reseller",
				logoUrl: d.logo_url ?? null
			});
			if (needsContent && d.landing_content?.nav) setLoadedContent(d.landing_content);
		})();
	}, [
		siteNameProp,
		logoUrlProp,
		content
	]);
	const siteName = siteNameProp ?? loadedBrand.siteName;
	const logoUrl = logoUrlProp ?? loadedBrand.logoUrl;
	const c = { nav: {
		features: content?.nav?.features ?? loadedContent?.nav?.features ?? FALLBACK.nav.features ?? "Features",
		how: content?.nav?.how ?? loadedContent?.nav?.how ?? FALLBACK.nav.how ?? "How it works",
		categories: content?.nav?.categories ?? loadedContent?.nav?.categories ?? FALLBACK.nav.categories ?? "Categories",
		faq: content?.nav?.faq ?? loadedContent?.nav?.faq ?? FALLBACK.nav.faq ?? "FAQ",
		signIn: content?.nav?.signIn ?? loadedContent?.nav?.signIn ?? FALLBACK.nav.signIn ?? "লগইন",
		cta: content?.nav?.cta ?? loadedContent?.nav?.cta ?? FALLBACK.nav.cta ?? "Get started"
	} };
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isCatalog = pathname === "/catalog" || pathname.startsWith("/catalog/");
	const navLinks = isCatalog ? [{
		to: "/tutorials",
		label: "Tutorials"
	}, {
		to: "/",
		label: "Back to home",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" })
	}] : [
		{
			href: "#features",
			label: c.nav.features
		},
		{
			href: "#about",
			label: c.nav.how
		},
		{
			href: "#categories",
			label: c.nav.categories || "Categories"
		},
		{
			to: "/catalog",
			label: "Products"
		},
		{
			to: "/tutorials",
			label: "Tutorials"
		},
		{
			href: "#faq",
			label: c.nav.faq || "FAQ"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex min-w-0 items-center",
					"aria-label": siteName,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
						siteName,
						logoUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-5 text-[13px] font-semibold lg:flex",
					children: navLinks.map((l) => l.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: l.to,
						className: isCatalog ? "inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/50 hover:text-primary" : "font-bold text-primary hover:opacity-80",
						children: [
							l.icon,
							" ",
							l.label
						]
					}, l.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: l.href,
						className: "whitespace-nowrap text-muted-foreground transition-colors hover:text-primary",
						children: [
							l.icon,
							" ",
							l.label
						]
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hidden rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary/50 hover:text-primary sm:inline-flex",
							children: c.nav.signIn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							search: { mode: "signup" },
							className: "btn-brand btn-live inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold",
							children: [
								c.nav.cta,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMenu((v) => !v),
							"aria-label": "Menu",
							className: "grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden",
							children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					]
				})
			]
		}), menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "border-t border-border/60 bg-background px-4 py-3 text-sm lg:hidden",
			children: [navLinks.map((l) => l.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: l.to,
				onClick: () => setMenu(false),
				className: isCatalog ? "flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 font-bold text-primary" : "block rounded-lg px-3 py-2.5 font-bold text-primary hover:bg-primary/10",
				children: [
					l.icon,
					" ",
					l.label
				]
			}, l.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: l.href,
				onClick: () => setMenu(false),
				className: "block rounded-lg px-3 py-2.5 font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
				children: l.label
			}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				onClick: () => setMenu(false),
				className: "block rounded-lg px-3 py-2.5 font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
				children: c.nav.signIn
			})]
		})]
	});
}
//#endregion
export { PublicHeader as n, Brand as t };
