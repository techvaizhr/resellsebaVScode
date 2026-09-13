import { r as supabase } from "./client-CdRSQB5v.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-BkEeRci-.js";
import { t as ResellerAvatar } from "./reseller-avatar-DqxOrq_B.js";
import { t as clearImpersonation } from "./impersonation-RVNBaeX4.js";
import { t as PwaInstallButton } from "./pwa-install-Bjfh-Odh.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronRight, ExternalLink, Home, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
//#region src/components/BottomNav.tsx
function Badge({ count }) {
	if (!count) return null;
	return /* @__PURE__ */ jsx("span", {
		className: "absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-destructive-foreground shadow",
		children: count > 99 ? "99+" : count
	});
}
function isActive(currentPath, to, end) {
	if (end) return currentPath === to;
	return currentPath === to || currentPath.startsWith(to + "/");
}
function BottomNav({ homeTo, left, right }) {
	const currentPath = useRouterState({ select: (r) => r.location.pathname });
	const leftActive = isActive(currentPath, left.to, left.end);
	const rightActive = isActive(currentPath, right.to, right.end);
	const homeActive = isActive(currentPath, homeTo, true);
	const LeftIcon = left.icon;
	const RightIcon = right.icon;
	return /* @__PURE__ */ jsx("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 md:hidden",
		children: /* @__PURE__ */ jsx("div", {
			className: "border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto flex h-12 max-w-md items-stretch justify-between px-6",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						to: left.to,
						className: "flex flex-1 flex-col items-center justify-center gap-0.5 pt-1",
						activeProps: { "data-active": true },
						children: [/* @__PURE__ */ jsxs("span", {
							className: cn("relative grid h-8 w-8 place-items-center rounded-lg transition-colors", leftActive ? "bg-primary/15 text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ jsx(LeftIcon, { className: "h-5 w-5" }), /* @__PURE__ */ jsx(Badge, { count: left.badge ?? 0 })]
						}), /* @__PURE__ */ jsx("span", {
							className: cn("text-[11px] font-medium leading-none transition-colors", leftActive ? "text-primary" : "text-muted-foreground"),
							children: left.label
						})]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: homeTo,
						className: "flex w-16 flex-col items-center justify-end",
						activeProps: { "data-active": true },
						children: /* @__PURE__ */ jsx("span", {
							className: cn("absolute -top-4 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg ring-4 ring-background transition-transform", homeActive ? "scale-105" : "scale-100"),
							style: { boxShadow: "0 6px 18px -4px color-mix(in oklab, var(--primary) 55%, transparent)" },
							children: /* @__PURE__ */ jsx(Home, { className: "h-5 w-5" })
						})
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: right.to,
						className: "flex flex-1 flex-col items-center justify-center gap-0.5 pt-1",
						activeProps: { "data-active": true },
						children: [/* @__PURE__ */ jsxs("span", {
							className: cn("relative grid h-8 w-8 place-items-center rounded-lg transition-colors", rightActive ? "bg-primary/15 text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ jsx(RightIcon, { className: "h-5 w-5" }), /* @__PURE__ */ jsx(Badge, { count: right.badge ?? 0 })]
						}), /* @__PURE__ */ jsx("span", {
							className: cn("text-[11px] font-medium leading-none transition-colors", rightActive ? "text-primary" : "text-muted-foreground"),
							children: right.label
						})]
					})
				]
			})
		})
	});
}
//#endregion
//#region src/components/AppShell.tsx
function isGroup(entry) {
	return entry.items !== void 0;
}
function AppShell({ title, brand, nav, user, headerRight, homeTo = "/dashboard", bottomNav, mobileFooterLinks, children }) {
	const currentPath = useRouterState({ select: (r) => r.location.pathname });
	const [searchQuery, setSearchQuery] = useState("");
	const activeGroupIdx = useMemo(() => {
		for (let i = 0; i < nav.length; i++) {
			const e = nav[i];
			if (isGroup(e) && e.items.some((it) => currentPath === it.to || !it.end && currentPath.startsWith(it.to + "/"))) return i;
		}
		return -1;
	}, [nav, currentPath]);
	const [openIdx, setOpenIdx] = useState(activeGroupIdx);
	useEffect(() => {
		if (activeGroupIdx !== -1) setOpenIdx(activeGroupIdx);
	}, [activeGroupIdx]);
	const [mobileOpen, setMobileOpen] = useState(false);
	useEffect(() => {
		setMobileOpen(false);
	}, [currentPath]);
	const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.localStorage.getItem("appshell:collapsed") === "1";
	});
	useEffect(() => {
		if (typeof window !== "undefined") window.localStorage.setItem("appshell:collapsed", desktopCollapsed ? "1" : "0");
	}, [desktopCollapsed]);
	const filteredNav = useMemo(() => {
		if (!searchQuery.trim()) return nav;
		const q = searchQuery.toLowerCase();
		return nav.map((entry) => {
			if (!isGroup(entry)) return entry.label.toLowerCase().includes(q) ? entry : null;
			const matchedItems = entry.items.filter((it) => it.label.toLowerCase().includes(q));
			if (matchedItems.length > 0) return {
				...entry,
				items: matchedItems
			};
			return entry.label.toLowerCase().includes(q) ? entry : null;
		}).filter(Boolean);
	}, [nav, searchQuery]);
	const renderSidebar = (collapsed, isMobile = false) => /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col bg-card/95 backdrop-blur-xl border-r border-border/60",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex h-16 items-center gap-3 border-b border-border/50 px-4 transition-all", collapsed && "justify-center px-2"),
				children: [/* @__PURE__ */ jsxs(Link, {
					to: homeTo,
					title: brand.name,
					className: cn("flex min-w-0 flex-1 items-center gap-3 group", collapsed && "justify-center"),
					children: [brand.logoUrl ? /* @__PURE__ */ jsx("img", {
						src: brand.logoUrl,
						alt: brand.name,
						className: cn("object-contain transition-transform group-hover:scale-105", collapsed ? "h-8 w-8" : "h-9 max-h-10 w-auto max-w-[140px]")
					}) : /* @__PURE__ */ jsx("div", {
						className: cn("grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 font-bold text-primary-foreground shadow-md shadow-primary/20", collapsed ? "h-9 w-9 text-base" : "h-9 w-9 text-base"),
						children: brand.name.charAt(0)
					}), !collapsed && /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "truncate text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors",
							children: brand.name
						}), brand.sub && /* @__PURE__ */ jsx("div", {
							className: "truncate text-[11px] font-medium text-muted-foreground uppercase tracking-wider",
							children: brand.sub
						})]
					})]
				}), !collapsed && isMobile && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setMobileOpen(false),
					className: "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
					"aria-label": "Close menu",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}),
			!collapsed && /* @__PURE__ */ jsx("div", {
				className: "px-3 pt-3 pb-1",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative flex items-center",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Quick search...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "w-full rounded-lg border border-border/60 bg-muted/40 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
						}),
						searchQuery && /* @__PURE__ */ jsx("button", {
							onClick: () => setSearchQuery(""),
							className: "absolute right-2 text-xs text-muted-foreground hover:text-foreground",
							children: "×"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("nav", {
				className: cn("flex-1 overflow-y-auto px-3 py-2 space-y-1 no-scrollbar"),
				children: filteredNav.map((entry, idx) => {
					if (!isGroup(entry)) return /* @__PURE__ */ jsx(LeafLink, {
						item: entry,
						collapsed
					}, entry.to);
					const isOpen = openIdx === idx && !collapsed;
					const hasActive = entry.items.some((it) => currentPath === it.to || !it.end && currentPath.startsWith(it.to + "/"));
					if (collapsed) return /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setDesktopCollapsed(false);
							setOpenIdx(idx);
						},
						title: entry.label,
						className: cn("mb-1 flex w-full items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all", hasActive && "bg-primary/15 text-primary font-semibold shadow-sm"),
						children: entry.icon
					}, entry.label);
					return /* @__PURE__ */ jsxs("div", {
						className: "mb-0.5",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setOpenIdx(isOpen ? -1 : idx),
							className: cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-foreground/80 transition-all hover:bg-muted/70 hover:text-foreground", hasActive && "bg-primary/10 text-primary font-bold shadow-xs"),
							"aria-expanded": isOpen,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: cn("transition-colors", hasActive ? "text-primary" : "text-muted-foreground"),
									children: entry.icon
								}),
								/* @__PURE__ */ jsx("span", {
									className: "flex-1 text-left truncate",
									children: entry.label
								}),
								/* @__PURE__ */ jsx(ChevronDown, { className: cn("h-3.5 w-3.5 transition-transform duration-200", hasActive ? "text-primary" : "text-muted-foreground/70", isOpen ? "rotate-0" : "-rotate-90") })
							]
						}), isOpen && /* @__PURE__ */ jsx("div", {
							className: "mt-0.5 ml-3 border-l-2 border-primary/20 pl-2 space-y-0.5 py-0.5",
							children: entry.items.map((it) => /* @__PURE__ */ jsx(LeafLink, {
								item: it,
								nested: true,
								collapsed: false
							}, it.to))
						})]
					}, entry.label);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("border-t border-border/50 p-3 bg-muted/20"),
				children: [
					isMobile && !collapsed && mobileFooterLinks && mobileFooterLinks.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "mb-2 space-y-1 border-b border-border/40 pb-2",
						children: mobileFooterLinks.map((l) => l.external ? /* @__PURE__ */ jsxs("a", {
							href: l.to,
							target: "_blank",
							rel: "noreferrer",
							onClick: () => setMobileOpen(false),
							className: "flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
							children: [
								l.icon,
								/* @__PURE__ */ jsx("span", {
									className: "flex-1",
									children: l.label
								}),
								/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 opacity-40" })
							]
						}, l.to) : /* @__PURE__ */ jsxs(Link, {
							to: l.to,
							onClick: () => setMobileOpen(false),
							className: "flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
							children: [l.icon, /* @__PURE__ */ jsx("span", {
								className: "flex-1",
								children: l.label
							})]
						}, l.to))
					}),
					!collapsed && /* @__PURE__ */ jsxs("div", {
						className: "mb-2 flex items-center gap-2.5 rounded-xl bg-card/60 p-2 border border-border/40 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(ResellerAvatar, {
								url: user.avatarUrl,
								name: user.name,
								size: 34
							}), /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "truncate text-xs font-bold text-foreground",
								children: user.name
							}), /* @__PURE__ */ jsx("div", {
								className: "truncate text-[11px] text-muted-foreground",
								children: user.email
							})]
						})]
					}),
					/* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						title: "Sign out",
						onClick: async () => {
							clearImpersonation();
							await supabase.auth.signOut();
							window.location.href = "/login";
						},
						className: cn("rounded-lg text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors", collapsed ? "w-full justify-center px-0 h-9" : "flex w-full justify-start gap-2"),
						children: [
							/* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }),
							" ",
							!collapsed && "Sign out"
						]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ jsx("aside", {
					className: cn("fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-250 ease-in-out md:flex shadow-xs", desktopCollapsed ? "w-16" : "w-64"),
					children: renderSidebar(desktopCollapsed)
				}),
				mobileOpen && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 bg-background/80 backdrop-blur-md transition-opacity md:hidden",
					onClick: () => setMobileOpen(false),
					"aria-hidden": true
				}),
				/* @__PURE__ */ jsx("aside", {
					className: cn("fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col shadow-2xl transition-transform duration-250 ease-out md:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full"),
					children: renderSidebar(false, true)
				}),
				/* @__PURE__ */ jsxs("main", {
					className: cn("min-w-0 max-w-full flex-1 overflow-x-hidden transition-[margin] duration-250 ease-in-out", desktopCollapsed ? "md:ml-16" : "md:ml-64"),
					children: [/* @__PURE__ */ jsxs("header", {
						className: "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl md:px-6 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 items-center gap-2 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setMobileOpen(true),
									className: "md:hidden -ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setDesktopCollapsed((v) => !v),
									className: "hidden md:inline-flex -ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
									"aria-label": desktopCollapsed ? "Expand sidebar" : "Collapse sidebar",
									title: desktopCollapsed ? "Expand sidebar" : "Collapse sidebar",
									children: desktopCollapsed ? /* @__PURE__ */ jsx(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(PanelLeftClose, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx(Link, {
									to: homeTo,
									title: "Go to dashboard",
									className: "flex min-w-0 items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60",
									children: brand.logoUrl ? /* @__PURE__ */ jsx("img", {
										src: brand.logoUrl,
										alt: brand.name,
										className: "md:hidden h-7 w-auto max-w-[130px] object-contain"
									}) : /* @__PURE__ */ jsx("span", {
										className: "truncate text-sm font-bold tracking-tight md:hidden",
										children: title
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(PwaInstallButton, {}), headerRight]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-4 pb-24 md:p-6 md:pb-8 max-w-7xl mx-auto",
						children
					})]
				})
			]
		}), bottomNav && /* @__PURE__ */ jsx(BottomNav, {
			homeTo: bottomNav.homeTo,
			left: bottomNav.left,
			right: bottomNav.right
		})]
	});
}
function LeafLink({ item, nested = false, collapsed = false }) {
	if (item.external) return /* @__PURE__ */ jsxs("a", {
		href: item.to,
		target: "_blank",
		rel: "noreferrer",
		title: item.label,
		className: cn("group mb-0.5 flex items-center rounded-xl text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground", collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2 text-xs font-medium", !collapsed && nested && "py-1.5 text-[12px]"),
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-current shrink-0",
			children: item.icon
		}), collapsed ? null : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
			className: "flex-1 truncate",
			children: item.label
		}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" })] })]
	});
	if (collapsed) return /* @__PURE__ */ jsxs(Link, {
		to: item.to,
		activeOptions: { exact: item.end },
		title: item.label,
		className: "relative mb-0.5 flex items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
		activeProps: { className: "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" },
		children: [item.icon, !!item.badge && /* @__PURE__ */ jsx("span", {
			className: "absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-destructive-foreground shadow-xs",
			children: item.badge > 99 ? "99+" : item.badge
		})]
	});
	return /* @__PURE__ */ jsxs(Link, {
		to: item.to,
		activeOptions: { exact: item.end },
		className: cn("group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all", nested ? "py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground" : "font-semibold text-foreground/80 hover:bg-muted/70 hover:text-foreground"),
		activeProps: { className: nested ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-2" : "bg-primary/10 text-primary font-bold shadow-xs" },
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-current shrink-0 transition-transform group-hover:scale-105",
				children: item.icon
			}),
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 truncate",
				children: item.label
			}),
			!!item.badge && /* @__PURE__ */ jsx("span", {
				className: "grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-5 text-destructive-foreground shadow-xs animate-pulse",
				children: item.badge > 99 ? "99+" : item.badge
			}),
			/* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity" })
		]
	});
}
//#endregion
//#region src/lib/use-order-nav-count.ts
/**
* Live "actionable orders" badge for the panel nav (sidebar + bottom nav).
* The meaning is role-based (resolved in the DB function `order_nav_count`):
* - admin/staff → orders sent to admin (forwarded)
* - reseller    → new orders (draft/pending)
* - supplier    → confirmed orders containing their products
* Refreshes on mount, on window focus, and every 60s.
*/
function useOrderNavCount(enabled = true) {
	const [count, setCount] = useState(0);
	const timer = useRef(null);
	const load = useCallback(async () => {
		const { data, error } = await supabase.rpc("order_nav_count");
		if (!error && typeof data === "number") setCount(data);
	}, []);
	useEffect(() => {
		if (!enabled) return;
		load();
		const onFocus = () => void load();
		window.addEventListener("focus", onFocus);
		timer.current = setInterval(load, 6e4);
		return () => {
			window.removeEventListener("focus", onFocus);
			if (timer.current) clearInterval(timer.current);
		};
	}, [enabled, load]);
	return count;
}
/** Returns a copy of the nav with the count badge attached to the orders entry. */
function applyOrderBadge(nav, ordersTo, count) {
	if (!count) return nav;
	return nav.map((entry) => {
		if ("items" in entry) return {
			...entry,
			items: entry.items.map((it) => it.to === ordersTo ? {
				...it,
				badge: count
			} : it)
		};
		return entry.to === ordersTo ? {
			...entry,
			badge: count
		} : entry;
	});
}
//#endregion
export { useOrderNavCount as n, AppShell as r, applyOrderBadge as t };
