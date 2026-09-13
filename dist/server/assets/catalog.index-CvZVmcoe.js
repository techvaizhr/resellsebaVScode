import { R as initial_data_default, r as supabase } from "./client-BpJCBCUq.js";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.js";
import { t as Route } from "./catalog.index-B0hNQpCS.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { i as usePaginated, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { t as ProductCodeChip } from "./product-code-DC0CHuVs.js";
import { t as ImagePickerButton } from "./image-picker-CaGqC7bW.js";
import { t as getCatalog } from "./catalog.functions-hdxahShJ.js";
import { a as useCatalogPrices, i as useCatalogBrand, r as CopyBtn } from "./shell-slrd2iP8.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Boxes, ChevronDown, Layers, Loader2, Search, Sparkles, Tag } from "lucide-react";
//#region src/routes/catalog.index.tsx?tsr-split=component
function CatalogIndex() {
	const { category, brand, q, page, sort } = Route.useSearch();
	const { banner, siteName, logoUrl } = useCatalogBrand();
	const navigate = useNavigate();
	const fetchCatalog = useServerFn(getCatalog);
	const [data, setData] = useState(() => {
		let prods = (initial_data_default.products || []).filter((p) => p.is_active !== false);
		let cats = (initial_data_default.categories || []).filter((c) => c.is_active !== false);
		let brandsList = (initial_data_default.brands || []).filter((b) => b.is_active !== false);
		try {
			if (typeof window !== "undefined") {
				const sP = localStorage.getItem("mock:products");
				if (sP) prods = JSON.parse(sP).filter((p) => p.is_active !== false);
				const sC = localStorage.getItem("mock:categories");
				if (sC) cats = JSON.parse(sC).filter((c) => c.is_active !== false);
				const sB = localStorage.getItem("mock:brands");
				if (sB) brandsList = JSON.parse(sB).filter((b) => b.is_active !== false);
			}
		} catch {}
		const mappedProds = prods.map((row) => {
			const sortedImgs = [...row.product_images || row.images || []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
			const primaryImg = (typeof sortedImgs[0] === "string" ? sortedImgs[0] : sortedImgs[0]?.url) || row.main_image || row.image_url || row.og_image_url || null;
			const allImgUrls = [.../* @__PURE__ */ new Set([
				...primaryImg ? [primaryImg] : [],
				...sortedImgs.map((i) => typeof i === "string" ? i : i.url),
				...row.og_image_url ? [row.og_image_url] : [],
				...row.main_image ? [row.main_image] : []
			])].filter(Boolean);
			return {
				id: row.id,
				name: row.name,
				slug: row.slug,
				code: row.product_code || "",
				short: row.short_description || "",
				price: Number(row.suggested_price ?? 0),
				resellerPrice: Number(row.reseller_price ?? 0),
				categoryId: row.category_id || null,
				brandId: row.brand_id || null,
				createdAt: row.created_at || null,
				image: primaryImg,
				images: allImgUrls
			};
		});
		return {
			categories: cats.map((c) => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
				image_url: c.image_url || null,
				count: mappedProds.filter((p) => p.categoryId === c.id).length
			})),
			brands: brandsList.map((b) => ({
				id: b.id,
				name: b.name,
				slug: b.slug
			})),
			products: mappedProds
		};
	});
	const [term, setTerm] = useState(q ?? "");
	const [showSuggest, setShowSuggest] = useState(false);
	const [catOpen, setCatOpen] = useState(false);
	const showPrices = useCatalogPrices();
	const perPage = 100;
	const currentPage = page ?? 1;
	useEffect(() => {
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
	const rows = useMemo(() => {
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
	const searchSuggestions = useMemo(() => {
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
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("section", {
		className: "relative isolate border-b border-border/60",
		children: [banner ? /* @__PURE__ */ jsxs("div", {
			className: "pointer-events-none absolute inset-0 z-0",
			children: [/* @__PURE__ */ jsx("img", {
				src: banner,
				alt: "",
				"aria-hidden": true,
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" })]
		}) : /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" }), /* @__PURE__ */ jsxs("div", {
			className: "relative z-10 mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-20",
			children: [
				/* @__PURE__ */ jsxs("span", {
					className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur ${banner ? "border-white/30 bg-white/15 text-white" : "border-primary/25 bg-primary/10 text-primary"}`,
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), " Master Catalog"]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: `mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl ${banner ? "text-white" : ""}`,
					style: banner ? { textShadow: "0 2px 20px rgba(0,0,0,.55)" } : void 0,
					children: activeCat ? activeCat.name : `${siteName} Product Catalog`
				}),
				/* @__PURE__ */ jsx("p", {
					className: `mx-auto mt-3 max-w-xl text-sm sm:text-base ${banner ? "text-white/90" : "text-muted-foreground"}`,
					children: activeCat ? `${rows.length} products in this category` : "See images, descriptions, and resell prices — get the full picture before you list."
				}),
				/* @__PURE__ */ jsxs("form", {
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
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
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
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn-brand rounded-xl px-4 py-2.5 text-sm font-semibold",
							children: "Search"
						})]
					}), showSuggest && term.trim() && /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border bg-card text-left shadow-elegant",
						children: [searchSuggestions.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "px-4 py-4 text-center text-xs text-muted-foreground",
							children: "No matching products"
						}) : searchSuggestions.map((p) => /* @__PURE__ */ jsxs(Link, {
							to: "/catalog/$slug",
							params: { slug: p.slug },
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => setShowSuggest(false),
							className: "flex items-center gap-3 border-b px-3 py-2.5 text-sm last:border-b-0 hover:bg-accent",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted",
								children: p.image ? /* @__PURE__ */ jsx("img", {
									src: p.image,
									alt: "",
									className: "h-full w-full object-cover"
								}) : logoUrl ? /* @__PURE__ */ jsx("img", {
									src: logoUrl,
									alt: "",
									className: "h-6 w-6 object-contain opacity-60"
								}) : /* @__PURE__ */ jsx(Boxes, { className: "h-4 w-4 text-muted-foreground" })
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate font-semibold text-foreground",
									children: p.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground",
									children: p.code
								})]
							})]
						}, p.id)), searchSuggestions.length > 0 && /* @__PURE__ */ jsxs("button", {
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
	}), !data ? /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-24",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-6xl px-4 pt-10 sm:px-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						icon: /* @__PURE__ */ jsx(Boxes, { className: "h-4 w-4" }),
						label: "Products",
						value: data.products.length
					}),
					/* @__PURE__ */ jsx(Stat, {
						icon: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" }),
						label: "Categories",
						value: data.categories.length
					}),
					/* @__PURE__ */ jsx(Stat, {
						icon: /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
						label: "Brands",
						value: data.brands.length
					}),
					/* @__PURE__ */ jsx(Stat, {
						icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
						label: "Showing",
						value: rows.length
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ jsx(Link, {
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
				}), /* @__PURE__ */ jsx(Link, {
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
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card mt-4 p-4",
				children: [
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setCatOpen((v) => !v),
						className: "flex w-full items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5" }),
								" Categories",
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground",
									children: data.categories.length
								})
							]
						}), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${catOpen ? "rotate-180" : ""}` })]
					}),
					catOpen && /* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap gap-2 border-t pt-3",
						children: [/* @__PURE__ */ jsxs(Link, {
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
						}), data.categories.map((c) => /* @__PURE__ */ jsxs(Link, {
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
					!catOpen && activeCat && /* @__PURE__ */ jsx("div", {
						className: "mt-3 border-t pt-3",
						children: /* @__PURE__ */ jsxs("span", {
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
	}), /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: rows.length === 0 ? /* @__PURE__ */ jsx("div", {
			className: "surface-card grid place-items-center p-16 text-center text-sm text-muted-foreground",
			children: "No products found."
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
			children: pagedRows.map((p) => /* @__PURE__ */ jsxs("div", {
				className: "group surface-card flex flex-col overflow-hidden",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/catalog/$slug",
					params: { slug: p.slug },
					className: "relative block aspect-square overflow-hidden bg-muted",
					children: p.image ? /* @__PURE__ */ jsx("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid h-full w-full place-items-center text-xs text-muted-foreground",
						children: "No image"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-1 flex-col p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsx(ProductCodeChip, { code: p.code }), /* @__PURE__ */ jsx(Link, {
								to: "/catalog/$slug",
								params: { slug: p.slug },
								className: "rounded-lg border px-2.5 py-1 text-[11px] font-semibold hover:border-primary/50 hover:text-primary",
								children: "Details"
							})]
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/catalog/$slug",
							params: { slug: p.slug },
							className: "mt-2 line-clamp-2 text-sm font-bold leading-tight hover:text-primary",
							children: p.name
						}),
						showPrices ? /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid grid-cols-3 gap-2 rounded-xl border bg-muted/40 p-2.5 text-[11px]",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Wholesale"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold",
									children: bdt(p.resellerPrice)
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Sale"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm font-black text-primary",
									children: bdt(p.price)
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-bold uppercase tracking-wide text-muted-foreground",
									children: "Profit"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold text-emerald-600",
									children: bdt(Math.max(0, p.price - p.resellerPrice))
								})] })
							]
						}) : /* @__PURE__ */ jsx("div", {
							className: "mt-3 rounded-xl border border-dashed bg-muted/30 p-2.5 text-[11px] font-semibold text-muted-foreground",
							children: "Log in as a reseller to see prices"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex flex-wrap gap-1.5 border-t pt-3",
							children: [
								/* @__PURE__ */ jsx(CopyBtn, {
									text: p.name,
									title: "Title",
									label: "Title copied"
								}),
								/* @__PURE__ */ jsx(CopyBtn, {
									text: showPrices ? `${p.name}\n\n${p.short}\n\nPrice: ${bdt(p.price)}` : `${p.name}\n\n${p.short}`,
									title: "Details",
									label: "Details copied"
								}),
								/* @__PURE__ */ jsx(ImagePickerButton, {
									images: p.images ?? (p.image ? [p.image] : []),
									baseName: p.name
								})
							]
						})
					]
				})]
			}, p.id))
		}), /* @__PURE__ */ jsx(Pagination, {
			page: currentPage,
			perPage,
			total: rows.length,
			onPage: setPage
		})] })
	})] })] });
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "surface-card flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ jsx("span", {
			className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
			children: icon
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-lg font-black leading-none",
				children: value
			}), /* @__PURE__ */ jsx("div", {
				className: "truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
				children: label
			})]
		})]
	});
}
//#endregion
export { CatalogIndex as component };
