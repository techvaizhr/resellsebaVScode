import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { D as Sparkles, I as ShieldCheck, Q as Quote, _r as BadgeCheck, er as ChevronDown, m as Truck, p as Undo2, w as Star, xr as ArrowRight } from "./vendor-icons-DF2A5Z8S.js";
import { t as Route } from "./s._code.index-j5KnJKcs.js";
import { a as PrimaryButton, c as borderc, d as useStore, l as cx, n as GhostButton, o as ProductGrid, r as Heading, s as SectionHead, t as EmptyState, u as muted } from "./ui-CDxWr1ot.js";
//#region src/components/store/sections.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function whatsappHref(n) {
	return n ? `https://wa.me/${n.replace(/[^\d]/g, "")}` : void 0;
}
function useHeroMedia() {
	const { content, listings, image } = useStore();
	const custom = content.text("hero_image");
	const spotlight = listings[0];
	return custom || (spotlight ? image(spotlight) : void 0);
}
function Hero() {
	const { code, theme, content, settings, listings, name } = useStore();
	const media = useHeroMedia();
	const firstSlug = listings[0]?.product?.slug;
	const wa = whatsappHref(settings?.whatsapp);
	if (!content.flag("hero_show")) return null;
	const badge = content.text("hero_badge");
	const headline = content.text("hero_headline");
	const sub = content.text("hero_sub");
	const cta = content.text("hero_cta");
	const cta2 = content.text("hero_cta2");
	const note = content.text("hero_note");
	const buttons = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3",
		children: [firstSlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/s/$code/p/$slug",
			params: {
				code,
				slug: firstSlug
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, { children: [
				cta,
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
			] })
		}) : null, wa && cta2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: wa,
			target: "_blank",
			rel: "noreferrer",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, { children: cta2 })
		}) : null]
	});
	if (theme.layout.hero === "banner") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx("overflow-hidden rounded-2xl border-2 bg-[var(--st-surface)] shadow-md", borderc),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between bg-gradient-to-r from-[var(--st-primary)] to-amber-600 px-4 py-2 text-xs font-bold text-white tracking-wide",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " 🔥 আজকের সেরা অফার — স্টক শেষ হওয়ার আগেই অর্ডার করুন!"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[11px]",
					children: "সারা দেশে ক্যাশ অন ডেলিভারি"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-[1.2fr_1fr] items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 md:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-[var(--st-primary)]/15 px-3 py-1 text-xs font-bold text-[var(--st-primary)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5" }),
									" ",
									badge || "সারা দেশে ক্যাশ অন ডেলিভারি"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }), " দ্রুততম ডেলিভারি"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							as: "h2",
							className: "mt-4 text-2xl font-extrabold leading-tight md:text-4xl text-[var(--st-fg)]",
							children: headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx("mt-3 max-w-md text-sm md:text-base leading-relaxed", muted),
							children: sub
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: buttons
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--st-border)] pt-4 text-xs font-medium text-[var(--st-fg)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), " পণ্য দেখে মূল্য পরিশোধ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[var(--st-primary)]" }), " ২৪-৭২ ঘণ্টায় ডেলিভারি"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative min-h-[260px] md:min-h-[340px] bg-[var(--st-bg-alt)] overflow-hidden",
					children: media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: media,
						alt: name,
						loading: "eager",
						decoding: "async",
						className: "h-full w-full object-cover transition-transform duration-500 hover:scale-105"
					})
				})]
			})]
		})
	});
	if (theme.layout.hero === "spotlight") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden border-b border-[var(--st-border)]",
		children: [
			media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: media,
				alt: name,
				loading: "eager",
				decoding: "async",
				className: "absolute inset-0 h-full w-full object-cover opacity-30 filter brightness-90"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[var(--st-bg)] via-[var(--st-bg)]/80 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-3xl px-4 py-24 text-center md:py-32",
				children: [
					badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block rounded-xs border border-[var(--st-border)] bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#d9c08a] backdrop-blur-md",
						children: badge
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						as: "h2",
						className: "mt-5 font-serif text-4xl leading-[1.1] md:text-6xl text-[var(--st-fg)]",
						children: headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx("mx-auto mt-5 max-w-xl text-sm md:text-base leading-relaxed tracking-wide", muted),
						children: sub
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-center",
						children: buttons
					}),
					note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx("mt-4 text-xs font-serif italic", "text-[var(--st-muted)]"),
						children: note
					})
				]
			})
		]
	});
	if (theme.layout.hero === "split") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full bg-[var(--st-surface)] border border-[var(--st-border)] px-3 py-1 text-xs font-medium text-[var(--st-primary)] shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5 text-emerald-600" }),
					" ",
					badge
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				as: "h2",
				className: "mt-4 text-3xl font-serif leading-[1.15] md:text-5xl text-[var(--st-fg)]",
				children: headline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx("mt-4 max-w-md text-base leading-relaxed", muted),
				children: sub
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: buttons
			}),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx("mt-3 text-xs", "text-[var(--st-muted)]"),
				children: note
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--st-border)] bg-[var(--st-bg-alt)] shadow-lg",
			children: media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: media,
				alt: name,
				loading: "eager",
				decoding: "async",
				className: "h-full w-full object-cover transition-transform duration-700 hover:scale-105"
			})
		})]
	});
	const stat1 = content.text("aurora_stat1");
	const stat2 = content.text("aurora_stat2");
	const offer = content.text("aurora_offer");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-[0.18]",
			style: { background: "radial-gradient(1000px 420px at 12% -10%, var(--st-primary), transparent 60%), radial-gradient(820px 420px at 92% 0%, var(--st-accent), transparent 62%)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-[var(--st-border)] bg-[var(--st-surface)] px-3 py-1.5 text-[11px] font-medium shadow-xs backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-[var(--st-primary)]" }),
						" ",
						badge
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
					as: "h2",
					className: "mt-4 text-3xl font-extrabold leading-[1.12] md:text-5xl text-[var(--st-fg)]",
					children: headline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("mt-4 max-w-md text-sm md:text-base leading-relaxed", muted),
					children: sub
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7",
					children: buttons
				}),
				note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("mt-3 text-xs", "text-[var(--st-muted)]"),
					children: note
				}),
				(stat1 || stat2) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7 flex flex-wrap items-center gap-6",
					children: [stat1, stat2].filter(Boolean).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-4 w-4 text-[var(--st-primary)]" }),
							" ",
							s
						]
					}, s))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-square overflow-hidden rounded-3xl border border-[var(--st-border)] bg-[var(--st-bg-alt)] shadow-xl",
				children: [media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media,
					alt: name,
					loading: "eager",
					decoding: "async",
					className: "h-full w-full object-cover transition-transform duration-700 hover:scale-105"
				}), offer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -bottom-3 left-4 rounded-full bg-[var(--st-primary)] px-4 py-2 text-xs font-bold text-[var(--st-on-primary)] shadow-lg",
					children: offer
				})]
			})]
		})]
	});
}
function BenefitStrip() {
	const { content } = useStore();
	if (!content.flag("usp_show")) return null;
	const icons = [
		Truck,
		ShieldCheck,
		BadgeCheck,
		Undo2
	];
	const items = [
		1,
		2,
		3,
		4
	].map((i, n) => ({
		t: content.text(`usp${i}_t`),
		d: content.text(`usp${i}_d`),
		Icon: icons[n]
	})).filter((i) => i.t);
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx("border-y bg-[var(--st-bg-alt)]", borderc),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4",
			children: items.map(({ t, d, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--st-primary)]/12 text-[var(--st-primary)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-[var(--st-fg)]",
						children: t
					}), d && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("text-xs", "text-[var(--st-muted)]"),
						children: d
					})]
				})]
			}, t))
		})
	});
}
function CategoryStrip() {
	const { code, categories, content, theme } = useStore();
	if (!content.flag("cat_show") || !categories.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
			title: content.text("cat_title"),
			subtitle: content.text("cat_sub")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx("grid gap-4", theme.layout.grid === "dense" ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"),
			children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/s/$code/c/$slug",
				params: {
					code,
					slug: c.slug
				},
				className: cx("group overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)] transition-all hover:-translate-y-0.5 hover:border-[var(--st-primary)]", borderc),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3] bg-[var(--st-bg-alt)]",
					children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image_url,
						alt: c.name,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("grid h-full w-full place-items-center text-2xl font-semibold", muted),
						children: c.name.charAt(0)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-3 py-2.5 text-sm font-medium",
					children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" })]
				})]
			}, c.id))
		})]
	});
}
function PromoBanner() {
	const { code, content, settings } = useStore();
	if (!content.flag("promo_show")) return null;
	const title = content.text("promo_title");
	const text = content.text("promo_text");
	const cta = content.text("promo_cta");
	const image = content.text("promo_image");
	if (!title && !text) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx("grid overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)] md:grid-cols-[1.2fr_1fr]", borderc),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative p-6 md:p-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 opacity-[0.12]",
					style: { background: "radial-gradient(600px 240px at 0% 0%, var(--st-primary), transparent 60%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							className: "text-xl md:text-2xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx("mt-2 max-w-md text-sm leading-relaxed", muted),
							children: text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-3",
							children: [cta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/s/$code",
								params: { code },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, { children: cta })
							}), settings?.support_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `tel:${settings.support_phone}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, { children: ["Call ", settings.support_phone] })
							})]
						})
					]
				})]
			}), image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-[180px] bg-[var(--st-bg-alt)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: title,
					loading: "lazy",
					className: "h-full w-full object-cover"
				})
			})]
		})
	});
}
function WhyUs() {
	const { content } = useStore();
	if (!content.flag("why_show")) return null;
	const items = [
		1,
		2,
		3
	].map((i) => ({
		t: content.text(`why${i}_t`),
		d: content.text(`why${i}_d`)
	})).filter((i) => i.t);
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx("border-y bg-[var(--st-bg-alt)]", borderc),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, { title: content.text("why_title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: items.map((i, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx("rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-5", borderc),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-full bg-[var(--st-primary)] text-sm font-bold text-[var(--st-on-primary)]",
							children: n + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-base font-semibold text-[var(--st-fg)]",
							children: i.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx("mt-1.5 text-sm leading-relaxed", muted),
							children: i.d
						})
					]
				}, i.t))
			})]
		})
	});
}
function Reviews() {
	const { content } = useStore();
	if (!content.flag("review_show")) return null;
	const items = [
		1,
		2,
		3
	].map((i) => ({
		text: content.text(`review${i}_text`),
		name: content.text(`review${i}_name`)
	})).filter((i) => i.text);
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, { title: content.text("review_title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: cx("rounded-[var(--st-radius)] border bg-[var(--st-surface)] p-5", borderc),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 text-[var(--st-primary)]",
						children: [
							0,
							1,
							2,
							3,
							4
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-current" }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: cx("mt-3 h-4 w-4", muted) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
						className: "mt-2 text-sm leading-relaxed text-[var(--st-fg)]",
						children: i.text
					}),
					i.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: cx("mt-3 text-xs font-medium", "text-[var(--st-muted)]"),
						children: i.name
					})
				]
			}, i.name + i.text))
		})]
	});
}
function Faq() {
	const { content } = useStore();
	const [open, setOpen] = (0, import_react.useState)(0);
	if (!content.flag("faq_show")) return null;
	const items = [
		1,
		2,
		3
	].map((i) => ({
		q: content.text(`faq${i}_q`),
		a: content.text(`faq${i}_a`)
	})).filter((i) => i.q);
	if (!items.length) return null;
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((i) => ({
			"@type": "Question",
			name: i.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: i.a
			}
		}))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx("border-t bg-[var(--st-bg-alt)]", borderc),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, { title: content.text("faq_title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx("divide-y overflow-hidden rounded-[var(--st-radius)] border bg-[var(--st-surface)]", borderc),
				children: items.map((i, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpen(open === n ? -1 : n),
					className: "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium",
					children: [i.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cx("h-4 w-4 transition-transform", open === n && "rotate-180") })]
				}), open === n && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("px-4 pb-4 text-sm leading-relaxed", "text-[var(--st-muted)]"),
					children: i.a
				})] }, i.q))
			})]
		})]
	});
}
/**
* Renders the active theme's own content fields, so every field shown in the
* panel has a matching place on the storefront.
*/
function ThemeSignature({ slot = "mid" }) {
	const { theme, content } = useStore();
	if (theme.id === "bazaar" && slot === "top") {
		const title = content.text("bazaar_deal_title") || "আজকের সেরা ধামাকা ডিল";
		const note = content.text("bazaar_deal_note") || "সীমিত সময়ের স্টক — আগে আসলে আগে পাবেন!";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-4 pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-4 py-3 text-white shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-bold uppercase tracking-wide",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-pulse" }),
						" ",
						title
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold opacity-95",
						children: note
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden md:inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-bold",
						children: "ক্যাশ অন ডেলিভারি"
					})]
				})]
			})
		});
	}
	if (slot === "top") return null;
	if (theme.id === "aurora") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-[var(--st-border)] bg-[var(--st-surface)] p-6 shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--st-primary)]/10 text-[var(--st-primary)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-[var(--st-fg)]",
						children: "১০০% অথেনটিক গ্যাজেট"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("text-xs mt-0.5", muted),
						children: "প্রতিটি পণ্য ল্যাব পরীক্ষিত ও ভেরিফাইড"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-[var(--st-fg)]",
						children: "সুপারফাস্ট হোম ডেলিভারি"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("text-xs mt-0.5", muted),
						children: "সারা দেশে দ্রুততম সময়ে ডেলিভারি"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold text-[var(--st-fg)]",
						children: "ক্যাশ অন ডেলিভারি"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx("text-xs mt-0.5", muted),
						children: "পণ্য হাতে পেয়ে চেক করে টাকা দিন"
					})] })]
				})
			]
		})
	});
	if (theme.id === "noir") {
		const eyebrow = content.text("noir_eyebrow") || "THE SIGNATURE COLLECTION";
		const story = content.text("noir_story") || "Curated luxury pieces crafted for those who appreciate distinction, elegance, and superior quality.";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: cx("border-y bg-[var(--st-bg-alt)]", borderc),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block rounded-xs border border-[#d9c08a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-[#d9c08a]",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
						as: "h2",
						className: "mt-5 font-serif text-2xl leading-snug md:text-3xl text-[var(--st-fg)]",
						children: [
							"“",
							story,
							"”"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-6 h-px w-16 bg-[#d9c08a]/40" })
				]
			})
		});
	}
	if (theme.id === "atelier") {
		const quote = content.text("atelier_quote") || "প্রকৃতির নিখাদ দান — প্রতিটি পণ্যে সততা ও শুদ্ধতার ছোঁয়া।";
		const credit = content.text("atelier_credit") || "— আমাদের পারিবারিক প্রতিশ্রুতি";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-4xl px-4 py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
				as: "h2",
				className: "font-serif text-2xl leading-relaxed md:text-4xl text-[var(--st-fg)]",
				children: quote
			}), credit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx("mt-4 text-xs font-medium uppercase tracking-[0.25em]", "text-[var(--st-muted)]"),
				children: credit
			})]
		});
	}
	return null;
}
//#endregion
//#region src/routes/s.$code.index.tsx?tsr-split=component
function StoreHome() {
	const { q } = Route.useSearch();
	const store = useStore();
	const { code, listings, theme, name, content } = store;
	const results = (0, import_react.useMemo)(() => {
		if (!q) return listings;
		const term = q.toLowerCase();
		return listings.filter((l) => store.title(l).toLowerCase().includes(term) || String(l.product?.product_code ?? "").toLowerCase().includes(term));
	}, [
		q,
		listings,
		store
	]);
	const featured = listings.filter((l) => l.product?.is_featured).slice(0, 8);
	const latest = listings.slice(0, theme.layout.grid === "dense" ? 10 : 8);
	if (q) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
			title: `Search: “${q}”`,
			subtitle: `${results.length} product${results.length === 1 ? "" : "s"} found`,
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/s/$code",
				params: { code },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, { children: "Clear" })
			})
		}), results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { listings: results }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nothing matched",
			hint: "Try a different keyword."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSignature, { slot: "top" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitStrip, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryStrip, {}),
		content.flag("featured_show") && featured.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: cx("border-y bg-[var(--st-bg-alt)]", "border-[var(--st-border)]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					title: content.text("featured_title"),
					subtitle: content.text("featured_sub")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { listings: featured })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSignature, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				title: content.text("latest_title"),
				subtitle: content.text("latest_sub")
			}), latest.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, { listings: latest }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No products listed yet",
				hint: "Come back soon."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyUs, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {}),
		content.text("footer_about") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: cx("border-t", "border-[var(--st-border)]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl px-4 py-14 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
					className: "text-2xl md:text-3xl",
					children: ["About ", name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("mt-4 whitespace-pre-wrap text-sm leading-relaxed", "text-[var(--st-muted)]"),
					children: content.text("footer_about")
				})]
			})
		})
	] });
}
//#endregion
export { StoreHome as component };
