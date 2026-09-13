import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { I as DEFAULT_LANDING_CONTENT, L as mergeLandingContent } from "./client-CiD-puKw.js";
import "./dist-D98gQi4U.js";
import { $n as ChevronDown, D as Sparkles, Hn as CircleQuestionMark, Ht as Layers, N as ShoppingBag, br as ArrowRight, c as Users, er as Check, lr as Boxes } from "./vendor-icons-BEaCFqaT.js";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2 } from "./vendor-ui-C-fytv-F.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { i as getLpBootstrap } from "./bootstrap-jHyL9xCR.js";
import { t as APP_ICONS } from "./icons-0G413atF.js";
import { t as PwaInstallButton } from "./pwa-install-BspPSAwd.js";
import { n as PublicHeader, t as Brand } from "./public-header-Do79qgo5.js";
//#region src/components/ui/accordion.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
//#endregion
//#region src/components/count-up.tsx
/**
* Animates the numeric portion of a stat value (e.g. "27+", "1200", "24/7")
* from 0 to target once it scrolls into view. Non-numeric values render as-is.
*/
function CountUp({ value, duration = 1400 }) {
	const ref = (0, import_react.useRef)(null);
	const match = /^(\D*)(\d[\d,]*)(.*)$/.exec(value?.trim() ?? "");
	const target = match ? Number(match[2].replace(/,/g, "")) : null;
	const [n, setN] = (0, import_react.useState)(0);
	const [started, setStarted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (target === null || started) return;
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				setStarted(true);
				io.disconnect();
			}
		}, { threshold: .3 });
		io.observe(el);
		return () => io.disconnect();
	}, [target, started]);
	(0, import_react.useEffect)(() => {
		if (!started || target === null) return;
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setN(target);
			return;
		}
		let raf = 0;
		const start = performance.now();
		const tick = (now) => {
			const p = Math.min(1, Math.max(0, (now - start) / duration));
			const eased = 1 - Math.pow(1 - p, 3);
			setN(Math.round(target * eased));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		started,
		target,
		duration
	]);
	if (target === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref,
		children: value
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className: "tabular-nums",
		children: [
			match[1],
			n.toLocaleString("en-US"),
			match[3]
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var ICON_MAP = APP_ICONS;
function RootResolver() {
	const nav = useNavigate();
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [content, setContent] = (0, import_react.useState)(DEFAULT_LANDING_CONTENT);
	const [siteName, setSiteName] = (0, import_react.useState)("Reseller");
	const [logoUrl, setLogoUrl] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const host = typeof window !== "undefined" ? window.location.hostname : "";
			const isPlatformHost = !host || host === "localhost" || host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com");
			const data = await getLpBootstrap(isPlatformHost ? "" : host);
			if (!alive) return;
			const store = data?.store;
			if (!isPlatformHost && store && store.status === "active") {
				nav({
					to: "/s/$code",
					params: { code: store.code },
					replace: true
				});
				return;
			}
			const s = data?.settings;
			if (s) {
				setSiteName(s.site_name ?? "Reseller");
				setLogoUrl(s.logo_url ?? null);
				if (s.landing_content) setContent(mergeLandingContent(s.landing_content));
			}
			setStats(data ? {
				...data.stats,
				categories: data.categories ?? [],
				products: data.products ?? []
			} : null);
			setChecking(false);
		})();
		return () => {
			alive = false;
		};
	}, [nav]);
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-full bg-primary/20" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, {
		c: content,
		siteName,
		logoUrl,
		stats
	});
}
function Landing({ c, siteName, logoUrl, stats }) {
	const [bannerError, setBannerError] = (0, import_react.useState)(false);
	const banner = c.hero.bannerImage?.url || "/uploads/branding/1746e3c9-7c6f-49cb-95a3-a18724e47970.webp";
	const statIcons = [
		Boxes,
		Layers,
		ShoppingBag,
		Users
	];
	const customStats = c.stats?.items?.filter((s) => s.value?.trim() || s.label?.trim()) ?? [];
	const autoStats = stats ? [
		{
			value: `${stats.totalProducts}+`,
			label: "Products"
		},
		{
			value: `${stats.totalCategories}+`,
			label: "Categories"
		},
		{
			value: `${stats.totalSales}+`,
			label: "Total sales"
		},
		{
			value: "24/7",
			label: "Support"
		}
	] : [];
	const statItems = customStats.length ? customStats : autoStats;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {
				siteName,
				logoUrl,
				content: c
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-40 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-blob-drift" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-40 -right-24 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-blob-drift-slow" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center lg:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold text-primary sm:text-xs animate-fade-in-up animation-delay-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: c.hero.badge
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-5 text-balance text-[30px] font-black leading-[1.22] tracking-tight sm:text-5xl sm:leading-[1.12] lg:text-[56px] animate-fade-in-up animation-delay-200",
									children: [
										c.hero.titleStart,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-[image:var(--gradient-brand)] bg-clip-text text-transparent",
											children: c.hero.titleHighlight
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base lg:mx-0 lg:text-lg animate-fade-in-up animation-delay-300",
									children: c.hero.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start animate-fade-in-up animation-delay-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/login",
										search: { mode: "signup" },
										className: "btn-brand btn-live inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold sm:text-base",
										children: [
											c.hero.ctaPrimary,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										className: "btn-live inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-bold transition hover:border-primary/50 hover:text-primary sm:text-base",
										children: c.hero.ctaSecondary
									})]
								}),
								c.hero.badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-7 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold sm:text-xs lg:justify-start animate-fade-in-up animation-delay-500",
									children: c.hero.badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0 text-primary" }),
											" ",
											b
										]
									}, b))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative animate-scale-in-slow animation-delay-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[image:var(--gradient-brand)] opacity-20 blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "animate-float relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]",
								children: [banner && !bannerError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: banner,
									alt: siteName,
									className: "aspect-[4/3] w-full object-cover",
									onError: () => setBannerError(true)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-linear-to-t from-background/35 via-transparent to-background/10" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid aspect-[4/3] w-full place-items-center bg-[image:var(--gradient-brand)] text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-16 w-16 opacity-80" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" })]
							})]
						})]
					})
				]
			}),
			statItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border/60 bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 md:py-12",
					children: statItems.slice(0, 4).map((s, i) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(statIcons[i] ?? Sparkles, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground sm:text-sm",
									children: s.label
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-2xl font-black sm:text-3xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value: s.value ?? "" })
							})]
						}, i);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "features",
				className: "border-t border-border/60 bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [c.features.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold sm:text-3xl",
							children: c.features.title
						}), c.features.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: c.features.subtitle
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: c.features.items.map((f, i) => {
							const Icon = ICON_MAP[f.icon] ?? Sparkles;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card surface-card-hover group relative flex flex-col overflow-hidden p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-brand)] text-primary-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "flex-1 pt-0.5 text-[13px] font-bold leading-tight",
											children: f.title
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "relative mt-2 text-xs leading-relaxed text-muted-foreground",
										children: f.desc
									})
								]
							}, i);
						})
					})]
				})
			}),
			((c.about?.flow?.length ?? 0) > 0 || c.about?.title || c.about?.body) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "about",
				className: "relative overflow-hidden py-14 sm:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[image:var(--gradient-brand)] opacity-[0.06]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-2xl text-center",
							children: [c.about?.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-xl font-extrabold leading-snug sm:text-3xl",
								children: c.about.title
							}), c.about?.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: c.about.body
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-10 sm:mt-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-10 left-0 right-0 hidden h-1 rounded-full flow-line lg:block" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-5 bottom-5 left-5 hidden w-1 rounded-full flow-line-vertical lg:hidden" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "relative flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-4",
									children: (c.about?.flow ?? []).map((f, i) => {
										const Icon = ICON_MAP[f.icon] ?? Sparkles;
										const stepLabel = [
											"01",
											"02",
											"03",
											"04",
											"05"
										][i] ?? String(i + 1).padStart(2, "0");
										const iconClass = [
											"flow-icon-1",
											"flow-icon-2",
											"flow-icon-3",
											"flow-icon-4",
											"flow-icon-5"
										][i] ?? "flow-icon-1";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "group relative z-10 flex w-full items-start gap-3 lg:w-[18%] lg:max-w-[240px] lg:flex-col lg:items-center lg:gap-0",
											style: { animationDelay: `${(i + 1) * 100}ms` },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `grid h-10 w-10 shrink-0 place-items-center rounded-2xl shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-105 lg:h-20 lg:w-20 lg:group-hover:-translate-y-2 ${iconClass}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 lg:h-9 lg:w-9" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flow-card flex-1 px-4 py-4 text-left transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-elegant lg:mt-6 lg:w-full lg:px-5 lg:py-5 lg:text-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `mb-1 block text-[11px] font-bold uppercase tracking-wider`,
														style: { color: `var(--flow-step-${i + 1})` },
														children: ["Step ", stepLabel]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-sm font-bold leading-tight sm:text-[15px]",
														children: f.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1.5 text-xs leading-relaxed text-muted-foreground",
														children: f.desc
													})
												]
											})]
										}, i);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								search: { mode: "signup" },
								className: "btn-brand btn-live inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold",
								children: [
									c.hero.ctaPrimary,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalog",
								search: {},
								className: "btn-live inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold hover:bg-muted",
								children: "View Master Catalog"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "how",
				className: "relative overflow-hidden border-t border-border/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [c.how.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold sm:text-3xl",
							children: c.how.title
						}), c.how.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: c.how.subtitle
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mt-10 grid gap-6 md:grid-cols-3",
						children: c.how.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card surface-card-hover relative p-6 pt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-5 left-6 grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-base font-black text-primary-foreground ring-4 ring-background",
									children: String(i + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-bold sm:text-lg",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: s.desc
								})
							]
						}, i))
					})]
				})
			}),
			!!stats?.categories?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "categories",
				className: "border-y border-border/60 bg-muted/30 py-10 sm:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold sm:text-3xl",
							children: "Categories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Pick a category that matches your niche and start listing products"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid grid-cols-5 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8 lg:grid-cols-10",
						children: (stats?.categories ?? []).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryCardItem, { cat }, cat.id))
					})]
				})
			}),
			stats?.products && stats.products.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "products",
				className: "border-y border-border/60 bg-muted/30 py-10 sm:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-2xl text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-extrabold sm:text-3xl",
								children: "Featured Products"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "The best-selling products of the month"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
							children: stats.products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group surface-card surface-card-hover flex flex-col overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative aspect-square overflow-hidden bg-primary/5",
									children: p.main_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.main_image,
										alt: p.name,
										loading: "lazy",
										className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-full w-full place-items-center text-2xl font-black text-primary",
										children: p.name.charAt(0)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "line-clamp-2 text-sm font-bold leading-tight",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
											children: p.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-auto pt-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-black text-primary",
												children: bdt(p.price)
											})
										})
									]
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/catalog",
								search: {},
								className: "btn-live inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-bold hover:border-primary/50 hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " View all products"]
							})
						})
					]
				})
			}),
			c.faq && c.faq.items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "faq",
				className: "border-t border-border/60 bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [c.faq.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold sm:text-3xl",
							children: c.faq.title
						}), c.faq.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: c.faq.subtitle
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "w-full",
							children: c.faq.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: `item-${i}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-sm font-semibold sm:text-base",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4 shrink-0 text-primary" }), item.q]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: item.a
								})]
							}, i))
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "pricing",
				className: "px-4 pb-16 sm:px-6 sm:pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[image:var(--gradient-brand)] px-6 py-12 text-center sm:px-12 sm:py-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary-foreground/10 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto max-w-2xl",
							children: [c.cta.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-extrabold text-primary-foreground sm:text-3xl",
								children: c.cta.title
							}), c.cta.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-primary-foreground/85",
								children: c.cta.subtitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-7 flex flex-wrap justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								search: { mode: "signup" },
								className: "btn-live inline-flex items-center gap-2 rounded-xl bg-background px-7 py-3.5 text-sm font-bold text-foreground sm:text-base",
								children: [
									c.cta.button,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/catalog",
								search: {},
								className: "btn-live inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-7 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 sm:text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }), " Products"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border/60 bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
								siteName,
								logoUrl,
								size: "sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
								children: c.footer.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallButton, {
								variant: "inline",
								className: "mt-4",
								label: "Install app"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Platform"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#about",
									className: "text-muted-foreground hover:text-primary",
									children: "How we work"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#features",
									className: "text-muted-foreground hover:text-primary",
									children: c.nav.features
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how",
									className: "text-muted-foreground hover:text-primary",
									children: c.nav.how
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#faq",
									className: "text-muted-foreground hover:text-primary",
									children: c.nav.faq || "FAQ"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: { mode: "signup" },
									className: "text-muted-foreground hover:text-primary",
									children: c.nav.cta
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "text-muted-foreground hover:text-primary",
									children: c.nav.signIn
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalog",
									search: {},
									className: "text-muted-foreground hover:text-primary",
									children: "Products"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/tutorials",
									className: "text-muted-foreground hover:text-primary",
									children: "Video tutorials"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "text-muted-foreground hover:text-primary",
									children: "Privacy Policy"
								}) })
							]
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						siteName,
						". All rights reserved."
					]
				})]
			})
		]
	});
}
function CategoryCardItem({ cat }) {
	const [imgFailed, setImgFailed] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/catalog",
		search: { category: cat.slug },
		className: "group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-2 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative aspect-square w-full overflow-hidden rounded-xl bg-primary/5",
			children: cat.image_url && !imgFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: cat.image_url,
				alt: cat.name,
				loading: "lazy",
				className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
				onError: () => setImgFailed(true)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-full w-full place-items-center bg-primary/10 text-lg font-black text-primary",
				children: (cat.name || "C").charAt(0).toUpperCase()
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "line-clamp-2 min-w-0 text-[11px] font-bold leading-tight group-hover:text-primary sm:text-xs",
			children: cat.name
		})]
	});
}
//#endregion
export { RootResolver as component };
