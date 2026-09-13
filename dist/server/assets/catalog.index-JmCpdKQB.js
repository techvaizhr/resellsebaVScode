import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { D as Sparkles, Nt as LoaderCircle, U as Search, Ut as Layers, b as Tag, er as ChevronDown, ur as Boxes } from "./vendor-icons-DF2A5Z8S.js";
import { t as Route } from "./catalog.index-B8rrgXpw.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { i as usePaginated, r as Pagination } from "./data-list-D-TkvXUz.js";
import { t as ProductCodeChip } from "./product-code-B20IPlwq.js";
import { t as ImagePickerButton } from "./image-picker-DunuMcLn.js";
import { t as getCatalog } from "./catalog.functions-CqjLaxx_.js";
import { a as useCatalogPrices, i as useCatalogBrand, r as CopyBtn } from "./shell-Cq667yN7.js";
//#region src/routes/catalog.index.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogIndex() {
	const { category, brand, q, page, sort } = Route.useSearch();
	const { banner, siteName, logoUrl } = useCatalogBrand();
	const navigate = useNavigate();
	const fetchCatalog = useServerFn(getCatalog);
	const [data, setData] = (0, import_react.useState)({
		categories: [],
		brands: [],
		products: []
	});
	const [term, setTerm] = (0, import_react.useState)(q ?? "");
	const [showSuggest, setShowSuggest] = (0, import_react.useState)(false);
	const [catOpen, setCatOpen] = (0, import_react.useState)(false);
	const showPrices = useCatalogPrices();
	const perPage = 100;
	const currentPage = page ?? 1;
	(0, import_react.useEffect)(() => {
		let mounted = true;
		fetchCatalog().then((d) => {
			if (mounted && d) setData(d);
		}).catch(async () => {
			try {
				const { data: res } = await supabase.rpc("reseller_catalog_page");
				if (mounted && res) {
					const prods = (res.products ?? []).filter((p) => p.is_active !== false);
					const cats = (res.categories ?? []).filter((c) => c.is_active !== false);
					const brands = (res.brands ?? []).filter((b) => b.is_active !== false);
					setData({
						categories: cats.map((c) => ({
							...c,
							count: prods.filter((p) => p.category_id === c.id).length
						})),
						brands,
						products: prods.map((p) => ({
							id: p.id,
							name: p.name,
							slug: p.slug,
							code: p.product_code || "",
							short: p.short_description || "",
							price: Number(p.suggested_price ?? 0),
							resellerPrice: Number(p.reseller_price ?? 0),
							categoryId: p.category_id,
							brandId: p.brand_id,
							createdAt: p.created_at || null,
							image: p.main_image || p.image_url || p.og_image_url || null,
							images: p.product_images?.map((i) => i.url) || (p.main_image ? [p.main_image] : [])
						}))
					});
				}
			} catch {}
		});
		return () => {
			mounted = false;
		};
	}, []);
	const activeCat = data?.categories.find((c) => c.slug === category) ?? null;
	const activeBrand = data?.brands.find((b) => b.slug === brand) ?? null;
	const rows = (0, import_react.useMemo)(() => {
		let list = data?.products ?? [];
		if (activeCat) list = list.filter((p) => p.categoryId === activeCat.id);
		if (activeBrand) list = list.filter((p) => p.brandId === activeBrand.id);
		const t = (q ?? "").trim().toLowerCase();
		if (t) list = list.filter((p) => p.name.toLowerCase().includes(t) || p.code.includes(t));
		if (sort === "oldest") list = [...list].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
		return list;
	}, [
		data,
		activeCat,
		activeBrand,
		q,
		sort
	]);
	const searchSuggestions = (0, import_react.useMemo)(() => {
		const t = term.trim().toLowerCase();
		if (!t || !data) return [];
		return data.products.filter((p) => p.name.toLowerCase().includes(t) || p.code.toLowerCase().includes(t)).slice(0, 6);
	}, [term, data]);
	const pagedRows = usePaginated(rows, currentPage, perPage);
	const setPage = (p) => void navigate({
		to: "/catalog",
		search: {
			category,
			brand,
			q,
			sort,
			page: p > 1 ? p : void 0
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate border-b border-border/60",
		children: [banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 z-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: banner,
				alt: "",
				"aria-hidden": true,
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur ${banner ? "border-white/30 bg-white/15 text-white" : "border-primary/25 bg-primary/10 text-primary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Master Catalog"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: `mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl ${banner ? "text-white" : ""}`,
					style: banner ? { textShadow: "0 2px 20px rgba(0,0,0,.55)" } : void 0,
					children: activeCat ? activeCat.name : `${siteName} Product Catalog`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `mx-auto mt-3 max-w-xl text-sm sm:text-base ${banner ? "text-white/90" : "text-muted-foreground"}`,
					children: activeCat ? `${rows.length} products in this category` : "See images, descriptions, and resell prices — get the full picture before you list."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "relative mx-auto mt-7 max-w-md",
					onSubmit: (e) => {
						e.preventDefault();
						setShowSuggest(false);
						navigate({
							to: "/catalog",
							search: {
								category,
								brand,
								q: term.trim() || void 0,
								sort,
								page: void 0
							}
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: term,
								onChange: (e) => {
									setTerm(e.target.value);
									setShowSuggest(true);
								},
								onFocus: () => term.trim() && setShowSuggest(true),
								onBlur: () => setTimeout(() => setShowSuggest(false), 150),
								placeholder: "Search products…",
								"aria-label": "Search products",
								autoComplete: "off",
								className: "w-full rounded-xl border bg-card/95 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "btn-brand rounded-xl px-4 py-2.5 text-sm font-semibold",
							children: "Search"
						})]
					}), showSuggest && term.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-card text-left shadow-elegant",
						children: [searchSuggestions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 py-4 text-center text-xs text-muted-foreground",
							children: "No matching products"
						}) : searchSuggestions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/catalog/$slug",
							params: { slug: p.slug },
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => setShowSuggest(false),
							className: "flex items-center gap-3 border-b px-3 py-2.5 text-sm last:border-b-0 hover:bg-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted",
								children: p.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: "",
									className: "h-full w-full object-cover"
								}) : logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: logoUrl,
									alt: "",
									className: "h-6 w-6 object-contain opacity-60"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold text-foreground",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: p.code
								})]
							})]
						}, p.id)), searchSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => {
								setShowSuggest(false);
								navigate({
									to: "/catalog",
									search: {
										category,
										brand,
										q: term.trim() || void 0,
										sort,
										page: void 0
									}
								});
							},
							className: "block w-full px-3 py-2.5 text-center text-xs font-semibold text-primary hover:bg-accent",
							children: [
								"See all results for \"",
								term.trim(),
								"\""
							]
						})]
					})]
				})
			]
		})]
	}), !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 pt-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" }),
						label: "Products",
						value: data.products.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }),
						label: "Categories",
						value: data.categories.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }),
						label: "Brands",
						value: data.brands.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
						label: "Showing",
						value: rows.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					search: {
						category,
						brand,
						q,
						sort: void 0,
						page: void 0
					},
					className: `rounded-full border px-3 py-1.5 text-xs font-semibold ${!sort ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"}`,
					children: "Newest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog",
					search: {
						category,
						brand,
						q,
						sort: "oldest",
						page: void 0
					},
					className: `rounded-full border px-3 py-1.5 text-xs font-semibold ${sort === "oldest" ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"}`,
					children: "Oldest"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mt-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCatOpen((v) => !v),
						className: "flex w-full items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }),
								" Categories",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground",
									children: data.categories.length
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}` })]
					}),
					catOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2 border-t pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/catalog",
							search: {
								sort,
								page: void 0
							},
							className: `rounded-full border px-3 py-1.5 text-xs font-semibold ${!category ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"}`,
							children: [
								"All (",
								data.products.length,
								")"
							]
						}), data.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/catalog",
							search: {
								category: c.slug,
								sort,
								page: void 0
							},
							className: `rounded-full border px-3 py-1.5 text-xs font-semibold ${category === c.slug ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"}`,
							children: [
								c.name,
								" (",
								c.count,
								")"
							]
						}, c.id))]
					}),
					!catOpen && activeCat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 border-t pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
							children: [
								activeCat.name,
								" (",
								activeCat.count,
								")"
							]
						})
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card grid place-items-center p-16 text-center text-sm text-muted-foreground",
			children: "No products found."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
			children: pagedRows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group surface-card flex flex-col overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalog/$slug",
					params: { slug: p.slug },
					className: "relative block aspect-square overflow-hidden bg-muted",
					children: p.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full w-full place-items-center text-xs text-muted-foreground",
						children: "No image"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.code }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalog/$slug",
								params: { slug: p.slug },
								className: "rounded-lg border px-2.5 py-1 text-[11px] font-semibold hover:border-primary/50 hover:text-primary",
								children: "Details"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog/$slug",
							params: { slug: p.slug },
							className: "mt-2 line-clamp-2 text-sm font-bold leading-tight hover:text-primary",
							children: p.name
						}),
						showPrices ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-3 gap-2 rounded-xl border bg-muted/40 p-2.5 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Wholesale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold",
									children: bdt(p.resellerPrice)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Sale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-black text-primary",
									children: bdt(p.price)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Profit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-bold text-emerald-600",
									children: bdt(Math.max(0, p.price - p.resellerPrice))
								})] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-xl border border-dashed bg-muted/30 p-2.5 text-[11px] font-semibold text-muted-foreground",
							children: "Log in as a reseller to see prices"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-1.5 border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
									text: p.name,
									title: "Title",
									label: "Title copied"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
									text: showPrices ? `${p.name}\n\n${p.short}\n\nPrice: ${bdt(p.price)}` : `${p.name}\n\n${p.short}`,
									title: "Details",
									label: "Details copied"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePickerButton, {
									images: p.images ?? (p.image ? [p.image] : []),
									baseName: p.name
								})
							]
						})
					]
				})]
			}, p.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page: currentPage,
			perPage,
			total: rows.length,
			onPage: setPage
		})] })
	})] })] });
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-black leading-none",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
				children: label
			})]
		})]
	});
}
//#endregion
export { CatalogIndex as component };
