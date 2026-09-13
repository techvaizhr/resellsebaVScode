import { a as deliveryLabel, f as resolveDelivery } from "./delivery-DY_nRbFK.js";
import { o as getStoreBootstrap } from "./bootstrap-CakIfe6a.js";
import { o as getPalette, s as getStoreTheme, t as createContentReader } from "./store-content-BESTlNEf.js";
import { t as buildMenuTree } from "./store-menu-CSdNL_GO.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ShoppingBag } from "lucide-react";
//#region src/lib/store-cart.ts
var EVT = "store-cart-change";
var key = (code) => `store-cart:${code}`;
function readCart(code) {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(key(code));
		const arr = raw ? JSON.parse(raw) : [];
		return Array.isArray(arr) ? arr.filter((l) => l && typeof l.listingId === "string" && Number(l.qty) > 0) : [];
	} catch {
		return [];
	}
}
function write(code, lines) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key(code), JSON.stringify(lines));
	window.dispatchEvent(new CustomEvent(EVT, { detail: code }));
}
function addToCart(code, listingId, qty = 1) {
	const lines = readCart(code);
	const found = lines.find((l) => l.listingId === listingId);
	if (found) found.qty += qty;
	else lines.push({
		listingId,
		qty
	});
	write(code, lines);
}
function setCartQty(code, listingId, qty) {
	write(code, readCart(code).map((l) => l.listingId === listingId ? {
		...l,
		qty
	} : l).filter((l) => l.qty > 0));
}
function removeFromCart(code, listingId) {
	write(code, readCart(code).filter((l) => l.listingId !== listingId));
}
function clearCart(code) {
	write(code, []);
}
function onCartChange(cb) {
	if (typeof window === "undefined") return () => {};
	const h = () => cb();
	window.addEventListener(EVT, h);
	window.addEventListener("storage", h);
	return () => {
		window.removeEventListener(EVT, h);
		window.removeEventListener("storage", h);
	};
}
var bdt = (n) => `৳${Number(n || 0).toLocaleString("en-US")}`;
//#endregion
//#region src/lib/tracking.ts
/**
* Injects pixels from rows already fetched by the storefront bootstrap call
* (reseller-owned wins, platform-wide is the fallback) — no extra request.
*/
function injectTrackingFromRows(rows) {
	const list = rows ?? [];
	const pick = (platform) => list.find((r) => r.platform === platform && !r.is_global)?.pixel_id ?? list.find((r) => r.platform === platform)?.pixel_id ?? null;
	const cfg = {
		fb_pixel: pick("facebook"),
		ga4_id: pick("ga4"),
		tiktok_pixel: pick("tiktok")
	};
	injectTracking(cfg);
	return cfg;
}
function injectTracking(cfg) {
	if (typeof window === "undefined") return;
	if (cfg.fb_pixel) {
		(function(f, b, e, v) {
			if (f.fbq) return;
			const n = f.fbq = function(...args) {
				n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
			};
			if (!f._fbq) f._fbq = n;
			n.push = n;
			n.loaded = true;
			n.version = "2.0";
			n.queue = [];
			const t = b.createElement(e);
			t.async = true;
			t.src = v;
			const s = b.getElementsByTagName(e)[0];
			s.parentNode?.insertBefore(t, s);
		})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
		window.fbq?.("init", cfg.fb_pixel, {}, { agent: "resellseba" });
		window.fbq?.("track", "PageView", {}, { eventID: `pv_${Date.now()}` });
	}
	if (cfg.ga4_id) {
		const s = document.createElement("script");
		s.async = true;
		s.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.ga4_id}`;
		document.head.appendChild(s);
		window.dataLayer = window.dataLayer || [];
		window.gtag = function(...args) {
			window.dataLayer.push(args);
		};
		window.gtag("js", /* @__PURE__ */ new Date());
		window.gtag("config", cfg.ga4_id);
	}
	if (cfg.tiktok_pixel) {
		(function(w, d, t) {
			w.TiktokAnalyticsObject = t;
			const ttq = w[t] = w[t] || [];
			ttq.methods = [
				"page",
				"track",
				"identify",
				"instances",
				"debug",
				"on",
				"off",
				"once",
				"ready",
				"alias",
				"group",
				"enableCookie",
				"disableCookie"
			];
			ttq.setAndDefer = function(o, m) {
				o[m] = function(...a) {
					o.push([m, ...a]);
				};
			};
			for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
			ttq.load = function(e) {
				const s = "https://analytics.tiktok.com/i18n/pixel/events.js";
				ttq._i = ttq._i || {};
				ttq._i[e] = [];
				ttq._i[e]._u = s;
				const n = d.createElement("script");
				n.async = true;
				n.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + e + "&lib=" + t;
				const a = d.getElementsByTagName("script")[0];
				a.parentNode?.insertBefore(n, a);
			};
		})(window, document, "ttq");
		window.ttq?.load(cfg.tiktok_pixel);
		window.ttq?.page();
	}
}
function trackViewContent(p) {
	const currency = p.currency ?? "BDT";
	const eventId = `vc_${p.id}_${Date.now()}`;
	window.fbq?.("track", "ViewContent", {
		content_ids: [p.id],
		content_name: p.name,
		content_type: "product",
		value: p.price,
		currency
	}, { eventID: eventId });
	window.gtag?.("event", "view_item", {
		currency,
		value: p.price,
		items: [{
			item_id: p.id,
			item_name: p.name,
			price: p.price
		}]
	});
	window.ttq?.track("ViewContent", {
		content_id: p.id,
		content_name: p.name,
		value: p.price,
		currency,
		event_id: eventId
	});
}
function trackAddToCart(p) {
	const currency = p.currency ?? "BDT";
	const value = p.price * p.qty;
	const eventId = `atc_${p.id}_${Date.now()}`;
	window.fbq?.("track", "AddToCart", {
		content_ids: [p.id],
		content_name: p.name,
		value,
		currency
	}, { eventID: eventId });
	window.gtag?.("event", "add_to_cart", {
		currency,
		value,
		items: [{
			item_id: p.id,
			item_name: p.name,
			price: p.price,
			quantity: p.qty
		}]
	});
	window.ttq?.track("AddToCart", {
		content_id: p.id,
		content_name: p.name,
		value,
		currency,
		event_id: eventId
	});
}
function trackPurchase(p) {
	const currency = p.currency ?? "BDT";
	const eventId = p.eventId ?? `pur_${p.orderNumber}`;
	window.fbq?.("track", "Purchase", {
		value: p.total,
		currency,
		content_ids: p.items?.map((i) => i.id),
		contents: p.items?.map((i) => ({
			id: i.id,
			quantity: i.qty,
			item_price: i.price
		}))
	}, { eventID: eventId });
	window.gtag?.("event", "purchase", {
		transaction_id: p.orderNumber,
		value: p.total,
		currency,
		items: p.items?.map((i) => ({
			item_id: i.id,
			item_name: i.name,
			price: i.price,
			quantity: i.qty
		}))
	});
	window.ttq?.track("CompletePayment", {
		content_id: p.orderNumber,
		value: p.total,
		currency,
		event_id: eventId
	});
}
//#endregion
//#region src/components/store/store-context.tsx
/** reseller-specific method overrides the platform one with the same key */
function dedupePayment(rows) {
	const byMethod = /* @__PURE__ */ new Map();
	for (const r of rows) {
		if (!r.method) continue;
		const existing = byMethod.get(r.method);
		if (!existing || r.reseller_id && !existing.reseller_id) byMethod.set(r.method, r);
	}
	return Array.from(byMethod.values());
}
var Ctx = createContext(null);
function useStore() {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
function useStoreLoader(code, themeOverride, paletteOverride) {
	const [state, setState] = useState("loading");
	const [data, setData] = useState(null);
	const [cart, setCart] = useState([]);
	const refreshCart = useCallback(() => setCart(readCart(code)), [code]);
	useEffect(() => {
		refreshCart();
		return onCartChange(refreshCart);
	}, [refreshCart]);
	useEffect(() => {
		let alive = true;
		(async () => {
			setState("loading");
			const boot = await getStoreBootstrap(code);
			if (!alive) return;
			const r = boot?.store;
			if (!r) return setState(boot?.closed ? "closed" : "missing");
			const rid = r.reseller_id;
			const s = r;
			const listings = (boot?.listings ?? []).filter((l) => l.product && (l.product.stock === null || Number(l.product.stock) > 0)).map((l) => ({
				...l,
				product: l.product ? {
					...l.product,
					product_images: [...l.product.product_images ?? []].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
				} : null
			}));
			const categories = boot?.categories ?? [];
			const menuRows = boot?.menu ?? [];
			injectTrackingFromRows(boot?.pixels);
			const theme = getStoreTheme(themeOverride || s?.theme);
			const storeName = s?.store_name || r.business_name || code;
			const values = s?.theme_settings?.[theme.id];
			const savedPalette = typeof values?.palette === "string" ? values.palette : null;
			const palette = getPalette(theme, paletteOverride || savedPalette);
			if (!alive) return;
			setData({
				code,
				resellerId: rid,
				name: storeName,
				settings: s,
				theme,
				palette,
				content: createContentReader(theme.id, values, s, storeName),
				listings,
				categories,
				menu: buildMenuTree(menuRows),
				paymentMethods: dedupePayment(boot?.payment_methods ?? []),
				byListingId: (id) => listings.find((l) => l.id === id),
				bySlug: (slug) => listings.find((l) => l.product?.slug === slug),
				title: (l) => l.custom_title || l.product?.name || "",
				image: (l) => l.product?.product_images?.find((i) => i.is_primary)?.url ?? l.product?.product_images?.[0]?.url
			});
			setState("ready");
		})();
		return () => {
			alive = false;
		};
	}, [
		code,
		themeOverride,
		paletteOverride
	]);
	return {
		state,
		store: useMemo(() => {
			if (!data) return null;
			return {
				...data,
				cart,
				cartCount: cart.reduce((s, l) => s + l.qty, 0)
			};
		}, [data, cart]),
		Provider: Ctx.Provider
	};
}
//#endregion
//#region src/components/store/ui.tsx
var cx = (...c) => c.filter(Boolean).join(" ");
var muted = "text-[var(--st-muted)]";
var borderc = "border-[var(--st-border)]";
function Heading({ children, className, as: As = "h2" }) {
	return /* @__PURE__ */ jsx(As, {
		className: cx("text-[var(--st-fg)]", className),
		style: {
			fontFamily: "var(--st-font-head)",
			fontWeight: "var(--st-head-weight)",
			letterSpacing: "var(--st-track)"
		},
		children
	});
}
function SectionHead({ title, subtitle, action }) {
	const { theme } = useStore();
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-5 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Heading, {
			className: theme.layout.card === "bare" ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
			children: title
		}), subtitle && /* @__PURE__ */ jsx("p", {
			className: cx("mt-1 text-sm", "text-[var(--st-muted)]"),
			children: subtitle
		})] }), action]
	});
}
function PrimaryButton({ children, className, ...rest }) {
	return /* @__PURE__ */ jsx("button", {
		...rest,
		className: cx("inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0", "rounded-[var(--st-radius-sm)] bg-[var(--st-primary)] text-[var(--st-on-primary)]", className),
		children
	});
}
function GhostButton({ children, className, ...rest }) {
	return /* @__PURE__ */ jsx("button", {
		...rest,
		className: cx("inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-medium", "rounded-[var(--st-radius-sm)]", borderc, "hover:bg-[var(--st-bg-alt)]", className),
		children
	});
}
function Price({ value, className }) {
	return /* @__PURE__ */ jsx("span", {
		className: cx("text-[var(--st-primary)]", className),
		style: {
			fontFamily: "var(--st-font-head)",
			fontWeight: "var(--st-head-weight)"
		},
		children: bdt(value)
	});
}
function ProductCard({ listing }) {
	const { code, theme, title, image } = useStore();
	const variant = theme.layout.card;
	const img = image(listing);
	const p = listing.product;
	const free = resolveDelivery(p).mode === "free";
	const shell = variant === "soft" ? "rounded-[var(--st-radius)] bg-[var(--st-surface)] shadow-[var(--st-shadow)] border border-transparent hover:border-[var(--st-primary)]/40" : variant === "frame" ? "rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)] hover:border-[var(--st-primary)]" : variant === "compact" ? "rounded-[var(--st-radius)] border border-[var(--st-border)] bg-[var(--st-surface)]" : "bg-transparent";
	const saleCount = useMemo(() => {
		let hash = 0;
		const str = p.id;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash % 200) + 15;
	}, [p.id]);
	return /* @__PURE__ */ jsxs(Link, {
		to: "/s/$code/p/$slug",
		params: {
			code,
			slug: p.slug
		},
		className: cx("group block overflow-hidden transition-all", shell, variant === "bare" && "hover:opacity-90"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: cx("relative overflow-hidden bg-[var(--st-bg-alt)]", variant === "bare" ? "aspect-[4/5] rounded-[var(--st-radius)]" : "aspect-square"),
			children: [img ? /* @__PURE__ */ jsx("img", {
				src: img,
				alt: title(listing),
				loading: "lazy",
				className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
			}) : /* @__PURE__ */ jsx("div", {
				className: cx("grid h-full w-full place-items-center text-xs", muted),
				children: "No image"
			}), /* @__PURE__ */ jsxs("div", {
				className: "absolute left-2 top-2 flex flex-col gap-1.5",
				children: [free && /* @__PURE__ */ jsx("span", {
					className: "rounded-full bg-[var(--st-primary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--st-on-primary)]",
					children: "Free delivery"
				}), /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white",
					children: [
						/* @__PURE__ */ jsx(ShoppingBag, { className: "h-2.5 w-2.5" }),
						" ",
						saleCount,
						" Sold"
					]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: cx(variant === "bare" ? "pt-3" : variant === "compact" ? "p-2.5" : "p-4"),
			children: [/* @__PURE__ */ jsx("h3", {
				className: cx("line-clamp-2 text-[var(--st-fg)]", variant === "compact" ? "text-[13px] leading-snug" : "text-sm", variant === "bare" && "text-base"),
				style: variant === "bare" ? { fontFamily: "var(--st-font-head)" } : void 0,
				children: title(listing)
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ jsx(Price, {
					value: Number(listing.selling_price),
					className: variant === "compact" ? "text-sm" : "text-base"
				}), !free && variant !== "compact" && /* @__PURE__ */ jsx("span", {
					className: cx("text-[11px]", "text-[var(--st-muted)]"),
					children: deliveryLabel(p)
				})]
			})]
		})]
	});
}
function ProductGrid({ listings }) {
	const { theme } = useStore();
	return /* @__PURE__ */ jsx("div", {
		className: cx("grid", theme.layout.grid === "dense" ? "grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5" : theme.layout.grid === "airy" ? "grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"),
		children: listings.map((l) => /* @__PURE__ */ jsx(ProductCard, { listing: l }, l.id))
	});
}
function EmptyState({ title, hint }) {
	return /* @__PURE__ */ jsx("div", {
		className: cx("grid place-items-center rounded-[var(--st-radius)] border border-dashed py-24 text-center", borderc),
		children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Heading, {
			className: "text-lg",
			children: title
		}), hint && /* @__PURE__ */ jsx("p", {
			className: cx("mt-1 text-sm", "text-[var(--st-muted)]"),
			children: hint
		})] })
	});
}
//#endregion
export { bdt as _, PrimaryButton as a, setCartQty as b, borderc as c, useStore as d, useStoreLoader as f, addToCart as g, trackViewContent as h, Price as i, cx as l, trackPurchase as m, GhostButton as n, ProductGrid as o, trackAddToCart as p, Heading as r, SectionHead as s, EmptyState as t, muted as u, clearCart as v, removeFromCart as y };
