import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { a as deliveryLabel, f as resolveDelivery } from "./delivery-DY_nRbFK.js";
import { D as Sparkles, M as ShoppingCart, Vt as Leaf, m as Truck, mn as Flame, qn as CircleCheck, t as Zap, w as Star, xr as ArrowRight } from "./vendor-icons-DF2A5Z8S.js";
import { o as getStoreBootstrap } from "./bootstrap-CcAKnQ8I.js";
import { o as getPalette, s as getStoreTheme, t as createContentReader } from "./store-content-uAaIXYBj.js";
import { t as buildMenuTree } from "./store-menu-XDCjdryQ.js";
//#region src/lib/store-cart.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
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
var Ctx = (0, import_react.createContext)(null);
function useStore() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
function useStoreLoader(code, themeOverride, paletteOverride) {
	const [state, setState] = (0, import_react.useState)("loading");
	const [data, setData] = (0, import_react.useState)(null);
	const [cart, setCart] = (0, import_react.useState)([]);
	const refreshCart = (0, import_react.useCallback)(() => setCart(readCart(code)), [code]);
	(0, import_react.useEffect)(() => {
		refreshCart();
		return onCartChange(refreshCart);
	}, [refreshCart]);
	(0, import_react.useEffect)(() => {
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
		store: (0, import_react.useMemo)(() => {
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
var import_jsx_runtime = require_jsx_runtime();
var cx = (...c) => c.filter(Boolean).join(" ");
var muted = "text-[var(--st-muted)]";
var borderc = "border-[var(--st-border)]";
function Heading({ children, className, as: As = "h2" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(As, {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
			className: theme.id === "noir" || theme.id === "atelier" ? "text-2xl md:text-3xl font-serif" : "text-xl md:text-2xl font-bold",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx("mt-1.5 text-sm", "text-[var(--st-muted)]"),
			children: subtitle
		})] }), action]
	});
}
function PrimaryButton({ children, className, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...rest,
		className: cx("inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 shadow-sm", "rounded-[var(--st-radius-sm)] bg-[var(--st-primary)] text-[var(--st-on-primary)] hover:brightness-105", className),
		children
	});
}
function GhostButton({ children, className, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...rest,
		className: cx("inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-medium transition-colors", "rounded-[var(--st-radius-sm)]", borderc, "hover:bg-[var(--st-bg-alt)] hover:border-[var(--st-primary)]", className),
		children
	});
}
function Price({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx("text-[var(--st-primary)] font-bold tracking-tight", className),
		style: { fontFamily: "var(--st-font-head)" },
		children: bdt(value)
	});
}
function ProductCard({ listing }) {
	const { code, theme, title, image } = useStore();
	const img = image(listing);
	const p = listing.product;
	const free = resolveDelivery(p).mode === "free";
	const saleCount = (0, import_react.useMemo)(() => {
		let hash = 0;
		const str = p.id;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		return Math.abs(hash % 240) + 25;
	}, [p.id]);
	const rating = (0, import_react.useMemo)(() => {
		const r = 4.7 + saleCount % 4 * .08;
		return Math.min(5, r).toFixed(1);
	}, [saleCount]);
	const sellingPrice = Number(listing.selling_price);
	const regularPrice = Math.round(sellingPrice * 1.25);
	if (theme.id === "bazaar") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[var(--st-border)] bg-[var(--st-surface)] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--st-primary)] hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/s/$code/p/$slug",
			params: {
				code,
				slug: p.slug
			},
			className: "block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-square overflow-hidden bg-[var(--st-bg-alt)]",
				children: [
					img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: img,
						alt: title(listing),
						loading: "lazy",
						decoding: "async",
						className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("grid h-full w-full place-items-center text-xs", muted),
						children: "ছবি নেই"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute left-2 top-2 flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3 animate-pulse" }), " স্পেশাল অফার"]
						}), free && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-2.5 w-2.5" }), " ফ্রি ডেলিভারি"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs",
						children: [
							"★ ",
							rating,
							" (",
							saleCount,
							"+ বিক্রয়)"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "line-clamp-2 text-xs font-semibold leading-snug text-[var(--st-fg)] sm:text-sm group-hover:text-[var(--st-primary)] transition-colors",
						children: title(listing)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
							value: sellingPrice,
							className: "text-base sm:text-lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground line-through opacity-70",
							children: bdt(regularPrice)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 shrink-0" }), " ক্যাশ অন ডেলিভারি সুবিধা"]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/s/$code/p/$slug",
				params: {
					code,
					slug: p.slug
				},
				className: "flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--st-primary)] py-2 text-xs font-bold text-[var(--st-on-primary)] transition-all hover:brightness-110 active:scale-95 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 fill-current" }), " অর্ডার করুন"]
			})
		})]
	});
	if (theme.id === "noir") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/s/$code/p/$slug",
		params: {
			code,
			slug: p.slug
		},
		className: "group block overflow-hidden rounded-md border border-[var(--st-border)] bg-[var(--st-surface)] p-2 transition-all duration-300 hover:border-[#d9c08a] hover:shadow-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[3/4] overflow-hidden rounded-xs bg-[var(--st-bg-alt)]",
			children: [img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: img,
				alt: title(listing),
				loading: "lazy",
				decoding: "async",
				className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx("grid h-full w-full place-items-center text-xs", muted),
				children: "No image"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-2.5 top-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-xs border border-[var(--st-border)] bg-black/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d9c08a] backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-2.5 w-2.5" }), " SIGNATURE"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 font-serif text-sm font-medium tracking-wide text-[var(--st-fg)] transition-colors group-hover:text-[#d9c08a]",
					children: title(listing)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex items-center justify-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
						value: sellingPrice,
						className: "text-sm font-semibold tracking-wider text-[#d9c08a]"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase text-muted-foreground group-hover:text-[var(--st-fg)] transition-colors",
					children: ["কালেকশন দেখুন ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-1" })]
				})
			]
		})]
	});
	if (theme.id === "atelier") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/s/$code/p/$slug",
		params: {
			code,
			slug: p.slug
		},
		className: "group block overflow-hidden rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square overflow-hidden rounded-xl bg-[var(--st-bg-alt)]",
			children: [img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: img,
				alt: title(listing),
				loading: "lazy",
				decoding: "async",
				className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx("grid h-full w-full place-items-center text-xs", muted),
				children: "No image"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-2.5 top-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-[var(--st-surface)]/90 px-2.5 py-0.5 text-[10px] font-medium text-[var(--st-primary)] shadow-xs backdrop-blur-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3 w-3" }), " খাঁটি ও অরিজিনাল"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-3.5 pb-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-sm font-medium text-[var(--st-fg)] group-hover:text-[var(--st-primary)] transition-colors",
					children: title(listing)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
						value: sellingPrice,
						className: "text-base font-semibold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "সরাসরি প্রস্তুতকারক"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between border-t border-[var(--st-border)] pt-2 text-xs text-[var(--st-primary)] font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বিস্তারিত দেখুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/s/$code/p/$slug",
		params: {
			code,
			slug: p.slug
		},
		className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--st-primary)] hover:shadow-xl hover:shadow-[var(--st-primary)]/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square overflow-hidden bg-[var(--st-bg-alt)]",
			children: [
				img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img,
					alt: title(listing),
					loading: "lazy",
					decoding: "async",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx("grid h-full w-full place-items-center text-xs", muted),
					children: "No image"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute left-2.5 top-2.5 flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-[var(--st-surface)]/90 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--st-primary)] shadow-xs backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " ট্রেন্ডিং"]
					}), free && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-[var(--st-primary)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--st-on-primary)] shadow-xs",
						children: "ফ্রি ডেলিভারি"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-2.5 w-2.5 fill-amber-400 text-amber-400" }),
						" ",
						rating
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "line-clamp-2 text-sm font-semibold leading-snug text-[var(--st-fg)] transition-colors group-hover:text-[var(--st-primary)]",
				children: title(listing)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
					value: sellingPrice,
					className: "text-lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx("text-[11px]", muted),
					children: free ? "Free Delivery" : deliveryLabel(p)
				})]
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl bg-[var(--st-bg)] px-3 py-2 text-xs font-semibold text-[var(--st-primary)] group-hover:bg-[var(--st-primary)] group-hover:text-[var(--st-on-primary)] transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "অর্ডার করুন" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" })]
			})
		})]
	});
}
function ProductGrid({ listings }) {
	const { theme } = useStore();
	const cols = theme.id === "bazaar" ? "grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : theme.id === "noir" ? "grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4" : theme.id === "atelier" ? "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx("grid", cols),
		children: listings.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { listing: l }, l.id))
	});
}
function EmptyState({ title, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx("grid place-items-center rounded-[var(--st-radius)] border border-dashed py-20 text-center", borderc),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center",
			children: [
				icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3",
					children: icon
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					className: "text-lg font-semibold",
					children: title
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("mt-1.5 text-sm", "text-[var(--st-muted)]"),
					children: hint
				})
			]
		})
	});
}
//#endregion
export { bdt as _, PrimaryButton as a, setCartQty as b, borderc as c, useStore as d, useStoreLoader as f, addToCart as g, trackViewContent as h, Price as i, cx as l, trackPurchase as m, GhostButton as n, ProductGrid as o, trackAddToCart as p, Heading as r, SectionHead as s, EmptyState as t, muted as u, clearCart as v, removeFromCart as y };
