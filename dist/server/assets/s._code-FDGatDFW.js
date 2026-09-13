import { t as Route } from "./s._code-CH_lDv7a.js";
import { c as borderc, d as useStore, f as useStoreLoader, l as cx, r as Heading, u as muted } from "./ui-CzBr4gZE.js";
import { l as storeThemeStyle } from "./store-content-BESTlNEf.js";
import { i as menuTarget } from "./store-menu-CSdNL_GO.js";
import { i as useStoreVisitLog } from "./store-visits-DV2cLphM.js";
import { useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, Loader2, Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
//#region src/components/store/chrome.tsx
function Logo() {
	const { code, name, settings, theme } = useStore();
	return /* @__PURE__ */ jsxs(Link, {
		to: "/s/$code",
		params: { code },
		className: "flex min-w-0 items-center gap-2.5",
		children: [settings?.logo_url ? /* @__PURE__ */ jsx("img", {
			src: settings.logo_url,
			alt: name,
			className: "h-10 w-auto max-w-[150px] object-contain"
		}) : /* @__PURE__ */ jsx("span", {
			className: "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--st-radius-sm)] bg-[var(--st-primary)] text-base font-bold text-[var(--st-on-primary)]",
			children: name.charAt(0).toUpperCase()
		}), /* @__PURE__ */ jsxs("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx(Heading, {
				as: "h1",
				className: cx("truncate text-base leading-tight", theme.layout.header === "editorial" && "text-lg"),
				children: name
			}), settings?.tagline && /* @__PURE__ */ jsx("span", {
				className: cx("block truncate text-[11px]", "text-[var(--st-muted)]"),
				children: settings.tagline
			})]
		})]
	});
}
function SearchBox({ className }) {
	const { code } = useStore();
	const nav = useNavigate();
	const [q, setQ] = useState("");
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => {
			e.preventDefault();
			nav({
				to: "/s/$code",
				params: { code },
				search: { q: q || void 0 }
			});
		},
		className: cx("relative", className),
		children: [/* @__PURE__ */ jsx(Search, { className: cx("pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", muted) }), /* @__PURE__ */ jsx("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search products…",
			"aria-label": "Search products",
			className: cx("w-full rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--st-fg)] outline-none placeholder:text-[var(--st-muted)] focus:border-[var(--st-primary)]", borderc)
		})]
	});
}
function CartButton() {
	const { code, cartCount } = useStore();
	return /* @__PURE__ */ jsxs(Link, {
		to: "/s/$code/checkout",
		params: { code },
		"aria-label": "Cart",
		className: cx("relative inline-flex items-center gap-2 rounded-[var(--st-radius-sm)] border px-3 py-2 text-sm", borderc, "hover:border-[var(--st-primary)]"),
		children: [
			/* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" }),
			/* @__PURE__ */ jsx("span", {
				className: "hidden sm:inline",
				children: "Cart"
			}),
			cartCount > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--st-primary)] px-1 text-[10px] font-bold text-[var(--st-on-primary)]",
				children: cartCount
			})
		]
	});
}
/** Renders one menu row as a router link / external anchor / plain span. */
function MenuLabel({ node, className, onClick, children }) {
	const { code } = useStore();
	const target = menuTarget(node, code);
	const body = children ?? node.label;
	if (target.kind === "route") return /* @__PURE__ */ jsx(Link, {
		to: target.to,
		params: target.params,
		className,
		onClick,
		children: body
	});
	if (target.kind === "route-slug") return /* @__PURE__ */ jsx(Link, {
		to: target.to,
		params: target.params,
		className,
		onClick,
		children: body
	});
	if (target.kind === "external") return /* @__PURE__ */ jsx("a", {
		href: target.href,
		target: node.open_new_tab ? "_blank" : void 0,
		rel: node.open_new_tab ? "noreferrer" : void 0,
		className,
		onClick,
		children: body
	});
	return /* @__PURE__ */ jsx("span", {
		className,
		children: body
	});
}
function MenuPanel({ node }) {
	const mega = node.layout === "mega";
	return /* @__PURE__ */ jsx("div", {
		className: cx("invisible absolute left-0 top-full z-50 translate-y-1 opacity-0 transition-all duration-150", "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 focus-within:visible focus-within:opacity-100"),
		children: /* @__PURE__ */ jsx("div", {
			className: cx("mt-1 rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] p-2 shadow-xl", borderc, mega ? "grid w-[min(92vw,760px)] grid-cols-2 gap-4 p-3 md:grid-cols-3" : "w-60"),
			children: node.children.map((child) => /* @__PURE__ */ jsxs("div", {
				className: mega ? "min-w-0" : "group/sub relative min-w-0",
				children: [/* @__PURE__ */ jsxs(MenuLabel, {
					node: child,
					className: cx("flex items-center gap-2 rounded-[var(--st-radius-sm)] px-2 py-1.5 text-sm font-medium hover:bg-[var(--st-bg-alt)] hover:text-[var(--st-primary)]"),
					children: [
						mega && child.image_url && /* @__PURE__ */ jsx("img", {
							src: child.image_url,
							alt: child.label,
							className: "h-10 w-10 shrink-0 rounded-[var(--st-radius-sm)] object-cover"
						}),
						!mega && child.image_url && /* @__PURE__ */ jsx("img", {
							src: child.image_url,
							alt: child.label,
							className: "h-7 w-7 shrink-0 rounded object-cover"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block truncate",
								children: child.label
							}), mega && child.description && /* @__PURE__ */ jsx("span", {
								className: cx("block truncate text-[11px]", "text-[var(--st-muted)]"),
								children: child.description
							})]
						}),
						!mega && child.children.length > 0 && /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 shrink-0 -rotate-90 opacity-70" })
					]
				}), child.children.length > 0 && (mega ? /* @__PURE__ */ jsx("div", {
					className: "mt-1 flex flex-col gap-0.5 pl-2",
					children: child.children.map((leaf) => /* @__PURE__ */ jsx(MenuLabel, {
						node: leaf,
						className: cx("truncate rounded px-2 py-1 text-[12px] hover:text-[var(--st-primary)]", "text-[var(--st-muted)]")
					}, leaf.id))
				}) : /* @__PURE__ */ jsx("div", {
					className: cx("invisible absolute left-full top-0 z-50 -translate-x-1 pl-1 opacity-0 transition-all duration-150", "group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100", "focus-within:visible focus-within:opacity-100"),
					children: /* @__PURE__ */ jsx("div", {
						className: cx("flex w-56 flex-col gap-0.5 rounded-[var(--st-radius-sm)] border bg-[var(--st-surface)] p-2 shadow-xl", "border-[var(--st-border)]"),
						children: child.children.map((leaf) => /* @__PURE__ */ jsx(MenuLabel, {
							node: leaf,
							className: cx("truncate rounded-[var(--st-radius-sm)] px-2 py-1.5 text-[13px] hover:bg-[var(--st-bg-alt)] hover:text-[var(--st-primary)]", "text-[var(--st-muted)]")
						}, leaf.id))
					})
				}))]
			}, child.id))
		})
	});
}
function StoreNav({ variant }) {
	const { code, categories, menu, theme } = useStore();
	const [openId, setOpenId] = useState(null);
	const [openChildId, setOpenChildId] = useState(null);
	/** No custom menu yet -> keep the automatic category list. */
	const items = menu.length ? menu : [{
		id: "__all",
		label: "All products",
		kind: "all_products",
		parent_id: null,
		ref_slug: null,
		url: null,
		image_url: null,
		description: null,
		open_new_tab: false,
		layout: "dropdown",
		sort_order: 0,
		is_active: true,
		children: []
	}, ...categories.map((c, i) => ({
		id: c.id,
		label: c.name,
		kind: "category",
		parent_id: null,
		ref_slug: c.slug,
		url: null,
		image_url: c.image_url,
		description: null,
		open_new_tab: false,
		layout: "dropdown",
		sort_order: i + 1,
		is_active: true,
		children: []
	}))];
	if (!items.length) return null;
	const style = theme.layout.nav;
	const base = cx("text-sm transition-colors", theme.layout.uppercaseNav && "text-xs uppercase tracking-[0.14em]");
	const shape = style === "chips" ? "rounded-full border border-[var(--st-border)] px-3.5 py-1.5 hover:border-[var(--st-primary)] hover:text-[var(--st-primary)]" : style === "pills" ? "px-3 py-1.5 hover:text-[var(--st-primary)]" : style === "tabs" ? "border-b-2 border-transparent px-1 py-2.5 hover:border-[var(--st-primary)] hover:text-[var(--st-primary)]" : "hover:text-[var(--st-primary)]";
	if (variant === "stack") return /* @__PURE__ */ jsx("nav", {
		className: "flex flex-col gap-1",
		children: items.map((node) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1",
			children: [/* @__PURE__ */ jsx(MenuLabel, {
				node,
				className: cx(base, "flex-1 py-2")
			}), node.children.length > 0 && /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": `Toggle ${node.label}`,
				onClick: () => setOpenId((v) => v === node.id ? null : node.id),
				className: "rounded p-1.5 hover:bg-[var(--st-bg-alt)]",
				children: /* @__PURE__ */ jsx(ChevronDown, { className: cx("h-4 w-4 transition-transform", openId === node.id && "rotate-180") })
			})]
		}), openId === node.id && /* @__PURE__ */ jsx("div", {
			className: cx("ml-3 border-l pl-3", "border-[var(--st-border)]"),
			children: node.children.map((child) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(MenuLabel, {
					node: child,
					className: cx("block flex-1 py-1.5 text-sm", "text-[var(--st-muted)]"),
					children: /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-2",
						children: [child.image_url && /* @__PURE__ */ jsx("img", {
							src: child.image_url,
							alt: child.label,
							className: "h-7 w-7 rounded object-cover"
						}), child.label]
					})
				}), child.children.length > 0 && /* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": `Toggle ${child.label}`,
					onClick: () => setOpenChildId((v) => v === child.id ? null : child.id),
					className: "rounded p-1.5 hover:bg-[var(--st-bg-alt)]",
					children: /* @__PURE__ */ jsx(ChevronDown, { className: cx("h-3.5 w-3.5 transition-transform", openChildId === child.id && "rotate-180") })
				})]
			}), openChildId === child.id && child.children.map((leaf) => /* @__PURE__ */ jsx(MenuLabel, {
				node: leaf,
				className: cx("block py-1 pl-4 text-[12px]", "text-[var(--st-muted)]")
			}, leaf.id))] }, child.id))
		})] }, node.id))
	});
	return /* @__PURE__ */ jsx("nav", {
		className: "relative flex flex-wrap items-center gap-x-4 gap-y-2 py-2",
		children: items.map((node) => /* @__PURE__ */ jsxs("div", {
			className: "group relative",
			children: [/* @__PURE__ */ jsxs(MenuLabel, {
				node,
				className: cx(base, shape, "inline-flex items-center gap-1"),
				children: [/* @__PURE__ */ jsx("span", {
					className: "whitespace-nowrap",
					children: node.label
				}), node.children.length > 0 && /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 opacity-70" })]
			}), node.children.length > 0 && /* @__PURE__ */ jsx(MenuPanel, { node })]
		}, node.id))
	});
}
var CategoryNav = StoreNav;
function StoreHeader() {
	const { settings, theme } = useStore();
	const [open, setOpen] = useState(false);
	const v = theme.layout.header;
	const announcement = settings?.announcement?.trim();
	return /* @__PURE__ */ jsxs("div", {
		className: "sticky top-0 z-40",
		children: [announcement && /* @__PURE__ */ jsx("div", {
			className: "bg-[var(--st-primary)] px-4 py-1.5 text-center text-[12px] font-medium text-[var(--st-on-primary)]",
			children: announcement
		}), v === "bar" ? /* @__PURE__ */ jsxs("div", {
			className: "bg-[var(--st-surface)]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "bg-[var(--st-primary)]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "rounded-[var(--st-radius-sm)] bg-[var(--st-surface)] px-2 py-1",
								children: /* @__PURE__ */ jsx(Logo, {})
							}),
							/* @__PURE__ */ jsx(SearchBox, { className: "hidden flex-1 md:block" }),
							/* @__PURE__ */ jsxs("div", {
								className: "ml-auto flex items-center gap-2 text-[var(--st-on-primary)]",
								children: [settings?.support_phone && /* @__PURE__ */ jsxs("a", {
									href: `tel:${settings.support_phone}`,
									className: "hidden items-center gap-1.5 text-sm sm:flex",
									children: [
										/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }),
										" ",
										settings.support_phone
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "rounded-[var(--st-radius-sm)] bg-[var(--st-surface)] text-[var(--st-fg)]",
									children: /* @__PURE__ */ jsx(CartButton, {})
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: cx("border-b", borderc),
					children: /* @__PURE__ */ jsx("div", {
						className: "mx-auto max-w-6xl px-4",
						children: /* @__PURE__ */ jsx(CategoryNav, { variant: "row" })
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto max-w-6xl px-4 py-2 md:hidden",
					children: /* @__PURE__ */ jsx(SearchBox, {})
				})
			]
		}) : v === "classic" ? /* @__PURE__ */ jsxs("header", {
			className: cx("border-b bg-[var(--st-bg)]/95 backdrop-blur", borderc),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex w-full items-center justify-between gap-3",
					children: [
						/* @__PURE__ */ jsx("button", {
							className: "md:hidden",
							"aria-label": "Menu",
							onClick: () => setOpen((o) => !o),
							children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto md:mx-0",
							children: /* @__PURE__ */ jsx(Logo, {})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(SearchBox, { className: "hidden w-64 lg:block" }), /* @__PURE__ */ jsx(CartButton, {})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden md:block",
					children: /* @__PURE__ */ jsx(CategoryNav, { variant: "row" })
				})]
			}), open && /* @__PURE__ */ jsxs("div", {
				className: cx("border-t px-4 py-3 md:hidden", "border-[var(--st-border)]"),
				children: [/* @__PURE__ */ jsx(SearchBox, { className: "mb-3" }), /* @__PURE__ */ jsx(CategoryNav, { variant: "stack" })]
			})]
		}) : v === "editorial" ? /* @__PURE__ */ jsxs("header", {
			className: cx("border-b bg-[var(--st-bg)]", borderc),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5",
				children: [
					/* @__PURE__ */ jsx(Logo, {}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ jsx(CategoryNav, { variant: "row" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(SearchBox, { className: "hidden w-56 lg:block" }),
							/* @__PURE__ */ jsx(CartButton, {}),
							/* @__PURE__ */ jsx("button", {
								className: "md:hidden",
								"aria-label": "Menu",
								onClick: () => setOpen((o) => !o),
								children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
							})
						]
					})
				]
			}), open && /* @__PURE__ */ jsxs("div", {
				className: cx("border-t px-5 py-4 md:hidden", "border-[var(--st-border)]"),
				children: [/* @__PURE__ */ jsx(SearchBox, { className: "mb-3" }), /* @__PURE__ */ jsx(CategoryNav, { variant: "stack" })]
			})]
		}) : /* @__PURE__ */ jsxs("header", {
			className: cx("border-b bg-[var(--st-bg)]/80 backdrop-blur-xl", borderc),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ jsx(Logo, {}),
						/* @__PURE__ */ jsx(SearchBox, { className: "mx-auto hidden max-w-md flex-1 md:block" }),
						/* @__PURE__ */ jsxs("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(CartButton, {}), /* @__PURE__ */ jsx("button", {
								className: "md:hidden",
								"aria-label": "Menu",
								onClick: () => setOpen((o) => !o),
								children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: cx("mx-auto hidden max-w-6xl px-4 pb-3 md:block"),
					children: /* @__PURE__ */ jsx(CategoryNav, { variant: "row" })
				}),
				open && /* @__PURE__ */ jsxs("div", {
					className: cx("border-t px-4 py-3 md:hidden", "border-[var(--st-border)]"),
					children: [/* @__PURE__ */ jsx(SearchBox, { className: "mb-3" }), /* @__PURE__ */ jsx(CategoryNav, { variant: "stack" })]
				})
			]
		})]
	});
}
function StoreFooter() {
	const { code, name, settings, categories } = useStore();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const socials = [
		settings?.facebook_url && {
			label: "Facebook",
			href: settings.facebook_url
		},
		settings?.instagram_url && {
			label: "Instagram",
			href: settings.instagram_url
		},
		settings?.tiktok_url && {
			label: "TikTok",
			href: settings.tiktok_url
		}
	].filter(Boolean);
	return /* @__PURE__ */ jsxs("footer", {
		className: cx("mt-16 border-t bg-[var(--st-bg-alt)]", borderc),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "md:col-span-2",
					children: [
						/* @__PURE__ */ jsx(Heading, {
							className: "text-lg",
							children: name
						}),
						/* @__PURE__ */ jsx("p", {
							className: cx("mt-2 max-w-md text-sm leading-relaxed", muted),
							children: settings?.about_text || settings?.meta_description || `${name} — genuine products, honest pricing and cash-on-delivery across Bangladesh.`
						}),
						socials.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: socials.map((s) => /* @__PURE__ */ jsx("a", {
								href: s.href,
								target: "_blank",
								rel: "noreferrer",
								className: cx("rounded-[var(--st-radius-sm)] border px-3 py-1.5 text-xs hover:border-[var(--st-primary)]", "border-[var(--st-border)]"),
								children: s.label
							}, s.label))
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--st-fg)]",
					children: "Shop"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/s/$code",
						params: { code },
						className: cx("text-sm hover:text-[var(--st-primary)]", muted),
						children: "All products"
					}), categories.slice(0, 6).map((c) => /* @__PURE__ */ jsx(Link, {
						to: "/s/$code/c/$slug",
						params: {
							code,
							slug: c.slug
						},
						className: cx("text-sm hover:text-[var(--st-primary)]", muted),
						children: c.name
					}, c.id))]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--st-fg)]",
					children: "Support"
				}), /* @__PURE__ */ jsxs("div", {
					className: cx("flex flex-col gap-2 text-sm", muted),
					children: [
						settings?.support_phone && /* @__PURE__ */ jsxs("a", {
							href: `tel:${settings.support_phone}`,
							children: ["Call ", settings.support_phone]
						}),
						settings?.whatsapp && /* @__PURE__ */ jsx("a", {
							href: `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`,
							target: "_blank",
							rel: "noreferrer",
							children: "WhatsApp chat"
						}),
						/* @__PURE__ */ jsx("span", { children: "Cash on delivery available" }),
						/* @__PURE__ */ jsx("span", { children: "Delivery: 1–3 days (Dhaka), 2–5 days (outside)" })
					]
				})] })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: cx("border-t px-4 py-5 text-center text-xs", borderc, muted),
			children: settings?.footer_text || `© ${year} ${name}. All rights reserved.`
		})]
	});
}
//#endregion
//#region src/routes/s.$code.tsx?tsr-split=component
function StoreLayout() {
	const { code } = Route.useParams();
	/** `?theme=` / `?palette=` let the reseller panel preview any combination. */
	const searchStr = useRouterState({ select: (s) => s.location.searchStr });
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const params = new URLSearchParams(searchStr);
	const previewTheme = params.get("theme");
	const previewPalette = params.get("palette");
	const { state, store, Provider } = useStoreLoader(code, previewTheme, previewPalette);
	/** Panel previews (?theme / ?palette) are not counted as customer visits. */
	useStoreVisitLog(code, pathname.replace(`/s/${code}`, "") || "/", Boolean(previewTheme || previewPalette));
	if (state === "loading") return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (state === "closed") return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center p-6 text-center",
		children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold",
			children: "Store temporarily unavailable"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "This shop is not accepting orders right now. Please check back soon."
		})] })
	});
	if (state === "missing" || !store) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center p-6 text-center",
		children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold",
			children: "Store not found"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "No active store exists for this address."
		})] })
	});
	const style = storeThemeStyle(store.theme, store.palette.id);
	return /* @__PURE__ */ jsx(Provider, {
		value: store,
		children: /* @__PURE__ */ jsxs("div", {
			"data-store-theme": store.theme.id,
			style: {
				...style,
				fontFamily: "var(--st-font-body)"
			},
			className: "min-h-screen bg-[var(--st-bg)] text-[var(--st-fg)] antialiased",
			children: [
				/* @__PURE__ */ jsx(StoreHeader, {}),
				/* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Outlet, {}) }),
				/* @__PURE__ */ jsx(StoreFooter, {})
			]
		})
	});
}
//#endregion
export { StoreLayout as component };
