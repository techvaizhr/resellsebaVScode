import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { R as initial_data_default } from "./client-BAn7XKYw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { r as areaLabel } from "./delivery-DY_nRbFK.js";
import { Mt as LoaderCircle, m as Truck, xr as ArrowLeft } from "./vendor-icons-BEaCFqaT.js";
import { t as Route } from "./catalog._slug-C8l42-sE.js";
import { r as bdt } from "./finance-report-Dwy2dA23.js";
import { t as ImagePickerButton } from "./image-picker-BBUQqYuc.js";
import { n as getCatalogProduct } from "./catalog.functions-8KSC5dcO.js";
import { a as useCatalogPrices, r as CopyBtn } from "./shell-CuLWGsd9.js";
//#region src/routes/catalog.$slug.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogDetails() {
	const { slug } = Route.useParams();
	const fetchProduct = useServerFn(getCatalogProduct);
	const [p, setP] = (0, import_react.useState)(() => {
		let prods = initial_data_default.products || [];
		let cats = initial_data_default.categories || [];
		let brandsList = initial_data_default.brands || [];
		try {
			if (typeof window !== "undefined") {
				const sP = localStorage.getItem("mock:products");
				if (sP) prods = JSON.parse(sP);
			}
		} catch {}
		const row = prods.find((x) => x.slug === slug || x.id === slug);
		if (!row) return null;
		const sortedImgs = [...row.product_images || row.images || []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
		const primaryImg = (typeof sortedImgs[0] === "string" ? sortedImgs[0] : sortedImgs[0]?.url) || row.main_image || row.image_url || row.og_image_url || null;
		const allImgUrls = [.../* @__PURE__ */ new Set([
			...primaryImg ? [primaryImg] : [],
			...sortedImgs.map((i) => typeof i === "string" ? i : i.url),
			...row.og_image_url ? [row.og_image_url] : [],
			...row.main_image ? [row.main_image] : []
		])].filter(Boolean);
		const cat = cats.find((c) => c.id === row.category_id);
		const brand = brandsList.find((b) => b.id === row.brand_id);
		return {
			id: row.id,
			name: row.name,
			slug: row.slug,
			code: row.product_code || "",
			short: row.short_description || "",
			description: row.description || "",
			price: Number(row.suggested_price ?? 0),
			resellerPrice: Number(row.reseller_price ?? 0),
			stock: Number(row.stock ?? 0),
			weight: row.weight_grams ?? null,
			deliveryMode: row.delivery_mode || "manual",
			deliverySource: "product",
			deliveryInside: Number(row.delivery_inside ?? 60),
			deliverySub: Number(row.delivery_sub ?? 100),
			deliveryOutside: Number(row.delivery_outside ?? 120),
			deliveryFlat: Number(row.delivery_flat ?? 0),
			category: cat?.name ?? null,
			categorySlug: cat?.slug ?? null,
			brand: brand?.name ?? null,
			images: allImgUrls
		};
	});
	const [state, setState] = (0, import_react.useState)(() => p ? "done" : "loading");
	const [idx, setIdx] = (0, import_react.useState)(0);
	const showPrices = useCatalogPrices();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		setState("loading");
		fetchProduct({ data: { slug } }).then((d) => {
			if (mounted) {
				setP(d);
				setIdx(0);
				setState("done");
			}
		}).catch(() => {
			if (mounted) setState("done");
		});
		return () => {
			mounted = false;
		};
	}, [slug]);
	if (state === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Product not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/catalog",
			search: {},
			className: "mt-4 inline-block text-sm font-semibold text-primary hover:underline",
			children: "← Back to catalog"
		})]
	});
	const detailText = [
		p.name,
		p.short,
		p.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
		showPrices ? `Price: ${bdt(p.price)}` : "",
		`Code: #${p.code}`
	].filter(Boolean).join("\n\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/catalog",
				search: p.categorySlug ? { category: p.categorySlug } : {},
				className: "inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Catalog"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card aspect-square overflow-hidden",
					children: p.images[idx] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.images[idx],
						alt: p.name,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full w-full place-items-center text-sm text-muted-foreground",
						children: "No image"
					})
				}), p.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: p.images.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIdx(i),
						className: `h-16 w-16 overflow-hidden rounded-lg border-2 ${i === idx ? "border-primary" : "border-transparent"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: u,
							alt: `${p.name} ${i + 1}`,
							className: "h-full w-full object-cover"
						})
					}, u))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 text-[11px] font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-muted px-2.5 py-1",
								children: ["#", p.code]
							}),
							p.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/10 px-2.5 py-1 text-primary",
								children: p.category
							}),
							p.brand && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent/15 px-2.5 py-1",
								children: p.brand
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-1 ${p.stock > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`,
								children: p.stock > 0 ? `Stock ${p.stock}` : "Stock out"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl",
						children: p.name
					}),
					p.short && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: p.short
					}),
					showPrices ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-6 flex flex-wrap items-end gap-6 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Sale price (suggested)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-primary",
								children: bdt(p.price)
							})] }),
							showPrices && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Wholesale price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-black",
								children: bdt(p.resellerPrice)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Your profit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-black text-emerald-600",
								children: bdt(Math.max(0, p.price - p.resellerPrice))
							})] })] }),
							p.weight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Weight"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-base font-bold",
								children: [p.weight, " g"]
							})] }) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" }), " Delivery charge"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2",
							children: p.deliveryMode === "free" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-emerald-600",
								children: "Free delivery"
							}) : p.deliveryMode === "flat" || p.deliveryMode === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								p.deliveryMode === "flat" ? "Flat" : "Custom",
								": ",
								bdt(p.deliveryFlat)
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									areaLabel("inside_dhaka"),
									": ",
									bdt(p.deliveryInside)
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									areaLabel("sub_dhaka"),
									": ",
									bdt(p.deliverySub)
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									areaLabel("outside_dhaka"),
									": ",
									bdt(p.deliveryOutside)
								] })
							] })
						})]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-6 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Log in to see prices and delivery charges"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Sign in with a reseller account to see the admin price, sale price, profit, and delivery charge."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "signup" },
								className: "btn-brand mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold",
								children: "Reseller signup / login"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-5 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold uppercase tracking-widest text-muted-foreground",
							children: "Reseller tools"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
									text: p.name,
									title: "Title",
									label: "Title copied"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBtn, {
									text: detailText,
									title: "Details",
									label: "Details copied"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePickerButton, {
									images: p.images,
									baseName: p.name
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card mt-6 p-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Want to sell this product?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: "Sign up as a reseller and list it in your own store."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								search: { mode: "signup" },
								className: "btn-brand mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold",
								children: "Reseller signup"
							})
						]
					})
				] })]
			}),
			p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 lg:mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Product details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose prose-sm mt-4 max-w-none text-sm leading-relaxed text-foreground/90 [&_img]:rounded-lg",
					dangerouslySetInnerHTML: { __html: p.description }
				})]
			})
		]
	});
}
//#endregion
export { CatalogDetails as component };
