import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-fziyWHNw.js";
import { a as deliveryLabel, o as deliveryMode } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { E as SquareCheckBig, Nt as LoaderCircle, T as Square, r as X, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { o as useAdvancedSettings } from "./advanced-settings-VndvKEQI.js";
import { n as useAuth } from "./use-auth-CZk9c9LM.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-D-TkvXUz.js";
import { t as ProductCodeChip } from "./product-code-B20IPlwq.js";
import { i as ResellerProductCalc } from "./price-breakdown-BEjHLHM-.js";
import { t as Hint } from "./Hint-B9ZUmBLG.js";
import { r as stripHtml, t as CopyButton } from "./reseller-tools-C638GKlf.js";
import { t as ImagePickerButton } from "./image-picker-DunuMcLn.js";
//#region src/routes/_authenticated/reseller/catalog.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Card image picker needs every image of one product — fetched only on click. */
async function loadProductImages(p) {
	const { data } = await supabase.from("product_images").select("url, is_primary, sort_order").eq("product_id", p.id);
	const urls = [...data ?? []].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order).map((i) => i.url);
	return [.../* @__PURE__ */ new Set([...p.og_image_url ? [p.og_image_url] : [], ...urls])];
}
function CatalogPage() {
	const { user } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [brands, setBrands] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [listed, setListed] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [price, setPrice] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [picked, setPicked] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkBusy, setBulkBusy] = (0, import_react.useState)(false);
	const [confirmDelist, setConfirmDelist] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [avail, setAvail] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("");
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(1);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const { settings: adv } = useAdvancedSettings();
	const didLoad = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!user || didLoad.current) return;
		didLoad.current = true;
		(async () => {
			const { data } = await supabase.rpc("reseller_catalog_page");
			const payload = data ?? {};
			if (payload.reseller_id) setResellerId(payload.reseller_id);
			setListed(new Set(payload.listed_product_ids ?? []));
			setItems(payload.products ?? []);
			setBrands(payload.brands ?? []);
			setCategories(payload.categories ?? []);
			setLoading(false);
		})();
	}, [user]);
	(0, import_react.useEffect)(() => setPage(1), [
		q,
		brand,
		category,
		avail,
		sort,
		perPage
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const list = items.filter((i) => {
			if (q) {
				const t = q.toLowerCase();
				if (!i.name.toLowerCase().includes(t) && !i.slug.includes(t) && !String(i.product_code ?? "").toLowerCase().includes(t)) return false;
			}
			if (brand && i.brand_id !== brand) return false;
			if (category && i.category_id !== category) return false;
			if (avail === "listed" && !listed.has(i.id)) return false;
			if (avail === "unlisted" && listed.has(i.id)) return false;
			if (avail === "instock" && i.stock <= 0) return false;
			return true;
		});
		if (sort === "oldest") list.sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
		return list;
	}, [
		items,
		q,
		brand,
		category,
		avail,
		sort,
		listed
	]);
	const paged = usePaginated(filtered, page, perPage);
	const filters = [
		{
			key: "brand",
			label: "Brand",
			value: brand,
			onChange: setBrand,
			options: brands.map((b) => ({
				value: b.id,
				label: b.name
			}))
		},
		{
			key: "category",
			label: "Category",
			value: category,
			onChange: setCategory,
			options: categories.map((c) => ({
				value: c.id,
				label: c.name
			}))
		},
		{
			key: "avail",
			label: "Show",
			value: avail,
			onChange: setAvail,
			options: [
				{
					value: "unlisted",
					label: "Not listed yet"
				},
				{
					value: "listed",
					label: "Already listed"
				},
				{
					value: "instock",
					label: "In stock"
				}
			]
		},
		{
			key: "sort",
			label: "Added",
			value: sort,
			onChange: setSort,
			options: [{
				value: "newest",
				label: "Newest first"
			}, {
				value: "oldest",
				label: "Oldest first"
			}]
		}
	];
	const openList = (p) => {
		setSelected(p);
		setPrice(String(p.suggested_price));
	};
	async function addListing() {
		if (!selected || !resellerId) return;
		const priceNum = Number(price);
		const minPrice = selected.reseller_price + selected.packaging_cost;
		if (priceNum < minPrice) {
			toast.error(`Selling price must be at least ৳${minPrice} (product + packaging). Delivery is charged separately.`);
			return;
		}
		setBusy(true);
		const { error } = await supabase.from("reseller_listings").insert({
			reseller_id: resellerId,
			product_id: selected.id,
			selling_price: priceNum,
			extra_delivery_inside: 0,
			extra_delivery_outside: 0
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		listed.add(selected.id);
		setListed(new Set(listed));
		toast.success("Listed in your store!");
		setSelected(null);
	}
	async function bulkList() {
		if (!resellerId) return;
		const ids = Array.from(picked).filter((id) => !listed.has(id));
		if (!ids.length) return toast.error("Selected products already listed");
		setBulkBusy(true);
		const rows = items.filter((i) => ids.includes(i.id)).map((i) => ({
			reseller_id: resellerId,
			product_id: i.id,
			selling_price: i.suggested_price && i.suggested_price >= i.reseller_price + i.packaging_cost ? i.suggested_price : i.reseller_price + i.packaging_cost,
			extra_delivery_inside: 0,
			extra_delivery_outside: 0
		}));
		const { error } = await supabase.from("reseller_listings").insert(rows);
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		const next = new Set(listed);
		ids.forEach((id) => next.add(id));
		setListed(next);
		setPicked(/* @__PURE__ */ new Set());
		toast.success(`${ids.length} product listed at suggested price. Edit prices on the Listings page.`);
	}
	async function delistOne(p) {
		if (!resellerId) return;
		setBusy(true);
		const { error } = await supabase.from("reseller_listings").delete().eq("reseller_id", resellerId).eq("product_id", p.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		const next = new Set(listed);
		next.delete(p.id);
		setListed(next);
		toast.success(`"${p.name}" removed from your store`);
	}
	async function bulkDelist() {
		if (!resellerId) return;
		const ids = Array.from(picked).filter((id) => listed.has(id));
		if (!ids.length) return toast.error("Selected products not listed");
		setBulkBusy(true);
		const { error } = await supabase.from("reseller_listings").delete().eq("reseller_id", resellerId).in("product_id", ids);
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		const next = new Set(listed);
		ids.forEach((id) => next.delete(id));
		setListed(next);
		setPicked(/* @__PURE__ */ new Set());
		setConfirmDelist(false);
		toast.success(`${ids.length} listing removed`);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const priceNum = Number(price) || 0;
	selected && priceNum - selected.reseller_price - selected.packaging_cost;
	const minSell = selected ? selected.reseller_price + selected.packaging_cost : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: "Catalog" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "-mt-4 mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground",
			children: ["How are charges calculated?", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hint, {
				side: "bottom",
				children: [
					"Per order, admin deducts ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "(reseller price + packaging) × quantity" }),
					" plus the courier delivery charge. With multiple products, only the highest delivery charge is applied once. The rest is your profit."
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			search: q,
			onSearch: setQ,
			searchPlaceholder: "Search by name or product ID…",
			filters,
			perPage,
			onPerPage: setPerPage,
			inline: true
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No products match",
			description: "Change filters or wait for admin to add new products."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			picked.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-primary/5 px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium",
					children: [picked.size, " selected"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: bulkBusy,
							onClick: bulkList,
							className: "btn-brand inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " List (suggested price)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: bulkBusy,
							onClick: () => setConfirmDelist(true),
							className: "inline-flex items-center gap-1 rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delist"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPicked(/* @__PURE__ */ new Set()),
							className: "rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
							children: "Clear"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex items-center gap-2 text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						const ids = paged.map((p) => p.id);
						const all = ids.every((id) => picked.has(id));
						setPicked((s) => {
							const n = new Set(s);
							if (all) ids.forEach((id) => n.delete(id));
							else ids.forEach((id) => n.add(id));
							return n;
						});
					},
					className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-muted",
					children: [paged.length > 0 && paged.every((p) => picked.has(p.id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3.5 w-3.5" }), "Select page"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4",
				children: paged.map((p) => {
					const myCost = p.reseller_price + p.packaging_cost;
					const isListed = listed.has(p.id);
					const isPicked = picked.has(p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `surface-card overflow-hidden relative ${isPicked ? "ring-2 ring-primary" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPicked((s) => {
									const n = new Set(s);
									if (n.has(p.id)) n.delete(p.id);
									else n.add(p.id);
									return n;
								}),
								className: "absolute left-2 top-2 z-10 rounded-md bg-background/90 p-1 shadow-sm backdrop-blur",
								"aria-label": "Select",
								children: isPicked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-square bg-muted cursor-pointer hover:opacity-90 transition-opacity",
									onClick: () => setDetailId(p.id),
									children: p.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.og_image_url,
										className: "h-full w-full object-cover",
										alt: ""
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-2 right-2 z-10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePickerButton, {
										baseName: p.name,
										loadImages: () => loadProductImages(p)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 sm:p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.product_code })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium cursor-pointer hover:text-primary transition-colors",
										onClick: () => setDetailId(p.id),
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Product ৳",
											p.reseller_price,
											" + Pack ৳",
											p.packaging_cost,
											" = ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["৳", myCost] }),
											" (your cost)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Delivery: ",
											deliveryLabel(p),
											" · customer pays"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Suggested ৳",
											p.suggested_price,
											adv.resellerCatalogShowStock ? ` · Stock ${p.stock}` : ""
										]
									}),
									isListed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: busy,
										onClick: () => delistOne(p),
										title: "Remove from my store",
										className: "mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow-sm transition hover:brightness-110 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Delist"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => openList(p),
										className: "mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:brightness-110",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " List in my store"]
									})
								]
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
				page,
				perPage,
				total: filtered.length,
				onPage: setPage
			})
		] }),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 p-0 sm:items-center sm:p-4",
			onClick: () => setSelected(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md surface-card max-h-[92dvh] overflow-y-auto rounded-b-none rounded-t-2xl p-4 sm:rounded-2xl sm:p-6",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "pr-6 text-base font-semibold sm:text-lg break-words",
						children: [
							"List \"",
							selected.name,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1 flex items-center gap-1 text-xs font-medium",
							children: [
								"Your selling price (minimum ৳",
								minSell,
								")",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hint, { children: "Customer pays this for the product; delivery is added on top." })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: minSell,
							value: price,
							onChange: (e) => setPrice(e.target.value),
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerProductCalc, { input: {
							buying: 0,
							resellerPrice: Number(selected.reseller_price) || 0,
							packaging: Number(selected.packaging_cost) || 0,
							deliveryMode: deliveryMode(selected),
							deliveryFlat: Number(selected.delivery_flat ?? 0),
							deliveryInside: Number(selected.delivery_inside) || 0,
							deliveryOutside: Number(selected.delivery_outside) || 0,
							deliverySub: Number(selected.delivery_sub ?? selected.delivery_outside) || 0,
							sellPrice: priceNum || 0
						} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] text-muted-foreground",
							children: "Delivery is collected from the customer and goes to the courier. With multiple products only the highest delivery charge applies."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col-reverse gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: addListing,
							disabled: busy,
							className: "btn-brand flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Add to my store"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelected(null),
							className: "rounded-md border px-4 py-2 text-sm sm:w-auto",
							children: "Cancel"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: confirmDelist,
			onClose: () => setConfirmDelist(false),
			onConfirm: async () => {
				await bulkDelist();
			},
			isLoading: bulkBusy,
			variant: "danger",
			title: "Delist products",
			description: `Remove ${Array.from(picked).filter((id) => listed.has(id)).length} listing(s) from your store? Customers will no longer see them.`,
			confirmText: "Delist"
		}),
		detailId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetailModal, {
			id: detailId,
			onClose: () => setDetailId(null),
			brands,
			categories
		})
	] });
}
function ProductDetailModal({ id, onClose, brands, categories }) {
	const { settings: adv } = useAdvancedSettings();
	const [p, setP] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [active, setActive] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		async function load() {
			setLoading(true);
			const { data } = await supabase.from("products").select("*, product_images(url)").eq("id", id).single();
			if (data) setP(data);
			setLoading(false);
		}
		load();
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-white" })
	});
	if (!p) return null;
	const brandName = brands.find((b) => b.id === p.brand_id)?.name;
	const categoryName = categories.find((c) => c.id === p.category_id)?.name;
	const imageUrls = [...new Set([p.og_image_url, ...p.product_images?.map((i) => i.url) || []].filter(Boolean))];
	const activeUrl = imageUrls[Math.min(active, imageUrls.length - 1)] ?? null;
	const detailsText = stripHtml([p.short_description, p.description].filter(Boolean).join("\n\n"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 md:p-6",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-4xl surface-card max-h-[90dvh] sm:max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 flex items-center justify-between border-b bg-card/95 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base sm:text-lg font-bold",
					children: "Product Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto modal-scroll p-4 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-square w-full max-w-[420px] mx-auto overflow-hidden rounded-xl border bg-muted/40",
							children: [activeUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: activeUrl,
								className: "h-full w-full object-contain sm:object-cover",
								alt: ""
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-full w-full place-items-center text-muted-foreground",
								children: "No image"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-3 top-3 flex flex-col gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePickerButton, {
									images: imageUrls,
									baseName: p.name
								})
							})]
						}), imageUrls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-2 pt-1 max-w-full no-scrollbar sm:flex-wrap",
							children: imageUrls.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActive(i),
								className: `h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition ${i === active ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-primary/40 opacity-80 hover:opacity-100"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: url,
									className: "h-full w-full object-cover",
									alt: ""
								})
							}, i))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-bold leading-tight break-words",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: p.name })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, {
										code: p.product_code,
										size: "md"
									}),
									brandName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
										children: brandName
									}),
									categoryName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
										children: categoryName
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border bg-muted/30 p-3.5 sm:p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Your Cost"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold",
										children: ["৳", p.reseller_price + p.packaging_cost]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Suggested Sell"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold",
										children: ["৳", p.suggested_price]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-medium",
										children: deliveryLabel(p)
									})] }),
									adv.resellerCatalogShowStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Stock"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-xs sm:text-sm font-medium ${p.stock <= 5 ? "text-destructive" : ""}`,
										children: [p.stock, " units"]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
									value: detailsText,
									label: "details"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "prose prose-sm max-w-none text-muted-foreground break-words",
								dangerouslySetInnerHTML: { __html: p.description || p.short_description || "No description provided." }
							})] })
						]
					})]
				})
			})]
		})
	});
}
//#endregion
export { CatalogPage as component };
