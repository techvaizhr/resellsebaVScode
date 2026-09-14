import { r as supabase } from "./client-Be051lUg.js";
import { f as resolveDelivery, l as globalDelivery, p as resolvedCharge, r as areaLabel, s as deliverySettingsSummary } from "./delivery-DY_nRbFK.js";
import { t as Route } from "./products.new-BVhs3Mt1.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { c as pricingRuleSummary, o as useAdvancedSettings, s as applyPricingRule } from "./advanced-settings-D6Wtuz1Q.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { r as useCan } from "./use-auth-DJu3SP6g.js";
import { t as ImageUploader } from "./ImageUploader-B63BYQ0O.js";
import { t as AdminProductCalc } from "./price-breakdown-CGuNUtD0.js";
import { t as RichTextEditor } from "./RichTextEditor-D_Oou7aN.js";
import { n as uniqueProductSlug } from "./slug-D6v0iS95.js";
import { t as Hint } from "./Hint-Ph3d-VhV.js";
import { r as takeImportDraft } from "./product-import-D01Cy8N8.js";
import { t as ProductImportModal } from "./ProductImportModal-DpAvA9gX.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CloudDownload, Loader2, Wand2 } from "lucide-react";
//#region src/routes/_authenticated/admin/products.new.tsx?tsr-split=component
function NewProduct() {
	const nav = useNavigate();
	const { from } = Route.useSearch();
	const can = useCan();
	const [name, setName] = useState("");
	const [sku, setSku] = useState("");
	const [description, setDescription] = useState("");
	const [brandId, setBrandId] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [buying, setBuying] = useState("");
	const [resellerPrice, setResellerPrice] = useState("");
	const [packaging, setPackaging] = useState("0");
	const [deliveryMode, setDeliveryMode] = useState("global");
	const [deliveryFlat, setDeliveryFlat] = useState("0");
	const [deliveryIn, setDeliveryIn] = useState("60");
	const [deliveryOut, setDeliveryOut] = useState("130");
	const [deliverySub, setDeliverySub] = useState("90");
	const [suggested, setSuggested] = useState("");
	const [stock, setStock] = useState("0");
	const [weight, setWeight] = useState("");
	const [images, setImages] = useState([]);
	const [metaTitle, setMetaTitle] = useState("");
	const [metaDesc, setMetaDesc] = useState("");
	const [keywords, setKeywords] = useState("");
	const [brands, setBrands] = useState([]);
	const [cats, setCats] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [supplierId, setSupplierId] = useState("");
	const { settings: advanced } = useAdvancedSettings();
	const rule = advanced.pricing;
	/** Fields the admin typed by hand — auto pricing never overwrites them. */
	const [priceTouched, setPriceTouched] = useState(false);
	const [busy, setBusy] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const [source, setSource] = useState(null);
	/** Prefill from an "Import from URL" draft (edit-before-save mode). */
	useEffect(() => {
		const d = takeImportDraft();
		if (!d) return;
		setName(d.name);
		if (d.sku) setSku(d.sku);
		if (d.description) setDescription(d.description);
		const admin = d.adminPrice ?? d.price;
		const buy = d.buyingPrice ?? admin;
		if (buy) setBuying(String(buy));
		if (admin) setResellerPrice(String(admin));
		if (d.price || admin) setSuggested(String(d.price || admin));
		if (d.images.length) setImages(d.images);
		if (d.metaTitle) setMetaTitle(d.metaTitle);
		if (d.metaDescription) setMetaDesc(d.metaDescription);
		setSource({
			label: d.source,
			url: d.url
		});
		toast.message(`${d.source} theke data prefilled — check kore save korun.`);
	}, []);
	/** Duplicate: copy every field of the source product except SKU / slug. */
	useEffect(() => {
		if (!from) return;
		let cancelled = false;
		(async () => {
			const { data: p } = await supabase.from("products").select("name, description, brand_id, category_id, supplier_id, buying_price, reseller_price, packaging_cost, delivery_mode, delivery_flat, delivery_inside, delivery_outside, delivery_sub, suggested_price, stock, weight_grams, meta_title, meta_description, keywords, product_images(url, is_primary, sort_order)").eq("id", from).maybeSingle();
			if (!p || cancelled) return;
			const row = p;
			setName(row.name ?? "");
			setSku("");
			setDescription(row.description ?? "");
			setBrandId(row.brand_id ?? "");
			setCategoryId(row.category_id ?? "");
			setSupplierId(row.supplier_id ?? "");
			setBuying(String(row.buying_price ?? ""));
			setResellerPrice(String(row.reseller_price ?? ""));
			setPackaging(String(row.packaging_cost ?? 0));
			setDeliveryMode(row.delivery_mode ?? "global");
			setDeliveryFlat(String(row.delivery_flat ?? 0));
			setDeliveryIn(String(row.delivery_inside ?? 0));
			setDeliveryOut(String(row.delivery_outside ?? 0));
			setDeliverySub(String(row.delivery_sub ?? 0));
			setSuggested(String(row.suggested_price ?? ""));
			setStock(String(row.stock ?? 0));
			setWeight(row.weight_grams == null ? "" : String(row.weight_grams / 1e3));
			setMetaTitle(row.meta_title ?? "");
			setMetaDesc(row.meta_description ?? "");
			setKeywords(row.keywords ?? "");
			const imgs = [...row.product_images ?? []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0));
			setImages(imgs.map((i) => ({
				url: i.url,
				path: "",
				bytes: 0
			})));
			toast.message("Duplicated — a new SKU and link will be generated on save.");
		})();
		return () => {
			cancelled = true;
		};
	}, [from]);
	useEffect(() => {
		supabase.from("brands").select("id,name").order("name").then(({ data }) => setBrands(data ?? []));
		supabase.from("categories").select("id,name").order("name").then(({ data }) => setCats(data ?? []));
		supabase.from("suppliers").select("id,display_name,code").eq("status", "active").order("display_name").then(({ data }) => setSuppliers(data ?? []));
	}, []);
	/** Fill reseller / suggested / packaging from the global rule. */
	function autoFill(cost) {
		if (!rule.enabled || !(cost > 0)) return;
		const r = applyPricingRule(cost, rule);
		setResellerPrice(String(r.resellerPrice));
		setSuggested(String(r.suggestedPrice));
		setPackaging(String(r.packaging));
	}
	const calc = useMemo(() => {
		const buy = Number(buying) || 0;
		const rp = Number(resellerPrice) || 0;
		const pkg = Number(packaging) || 0;
		const r = resolveDelivery({
			brand_id: brandId || null,
			category_id: categoryId || null,
			delivery_mode: deliveryMode,
			delivery_flat: Number(deliveryFlat) || 0,
			delivery_inside: Number(deliveryIn) || 0,
			delivery_outside: Number(deliveryOut) || 0,
			delivery_sub: Number(deliverySub) || 0
		}, globalDelivery());
		const di = resolvedCharge(r, "inside_dhaka");
		const dOut = resolvedCharge(r, "outside_dhaka");
		const sug = Number(suggested) || 0;
		return {
			saProfit: rp - buy,
			resellerMinSell: rp + pkg,
			resellerBaseIn: rp + pkg + di,
			resellerBaseOut: rp + pkg + dOut,
			resellerProfitAtSuggested: sug - rp - pkg
		};
	}, [
		buying,
		resellerPrice,
		packaging,
		deliveryIn,
		deliveryOut,
		deliveryMode,
		deliveryFlat,
		deliverySub,
		suggested
	]);
	async function save(e) {
		e.preventDefault();
		if (Number(resellerPrice) < Number(buying)) {
			toast.error("Reseller price cannot be less than buying price.");
			return;
		}
		if (Number(suggested) < calc.resellerMinSell) {
			toast.error(`Suggested sell price must be ≥ ৳${calc.resellerMinSell} (reseller price + packaging).`);
			return;
		}
		setBusy(true);
		try {
			const slug = await uniqueProductSlug(name);
			const { data: p, error } = await supabase.from("products").insert({
				name,
				slug,
				sku: sku || null,
				description: description || null,
				brand_id: brandId || null,
				category_id: categoryId || null,
				supplier_id: supplierId || null,
				buying_price: Number(buying),
				supplier_price: Number(buying),
				reseller_price: Number(resellerPrice),
				packaging_cost: Number(packaging),
				delivery_mode: deliveryMode,
				delivery_flat: deliveryMode === "flat" || deliveryMode === "custom" ? Number(deliveryFlat) || 0 : 0,
				delivery_inside: deliveryMode === "area" ? Number(deliveryIn) || 0 : 0,
				delivery_outside: deliveryMode === "area" ? Number(deliveryOut) || 0 : 0,
				delivery_sub: deliveryMode === "area" ? Number(deliverySub) || 0 : 0,
				suggested_price: Number(suggested),
				stock: Number(stock),
				weight_grams: weight === "" ? null : Math.max(0, Math.round((Number(weight) || 0) * 1e3)),
				og_image_url: images[0]?.url ?? null,
				meta_title: metaTitle || null,
				meta_description: metaDesc || null,
				keywords: keywords || null
			}).select("id").single();
			if (error) {
				console.error("Database insert error:", error);
				throw new Error(error.message || "Failed to create product in database");
			}
			if (images.length && p) {
				const { error: ie } = await supabase.from("product_images").insert(images.map((im, i) => ({
					product_id: p.id,
					url: im.url,
					is_primary: i === 0,
					sort_order: i
				})));
				if (ie) {
					console.error("Image insert error:", ie);
					throw new Error(ie.message || "Product created, but failed to save images");
				}
			}
			toast.success("Product created successfully");
			nav({
				to: "/admin/products",
				search: { refresh: p?.id ?? "all" }
			});
		} catch (err) {
			console.error("Save product catch block:", err);
			toast.error(err instanceof Error ? err.message : "Failed to create product");
		} finally {
			setBusy(false);
		}
	}
	if (!can("products.manage")) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-24",
		children: /* @__PURE__ */ jsx("div", {
			className: "surface-card max-w-md p-8 text-center text-sm text-muted-foreground",
			children: "You do not have permission to edit products."
		})
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "New product",
			description: "Resellers will create listings from this product.",
			actions: /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setImportOpen(true),
				className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
				children: [/* @__PURE__ */ jsx(CloudDownload, { className: "h-4 w-4" }), " Import from URL"]
			})
		}),
		/* @__PURE__ */ jsx(ProductImportModal, {
			open: importOpen,
			onClose: () => setImportOpen(false)
		}),
		source && /* @__PURE__ */ jsxs("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs",
			children: [
				/* @__PURE__ */ jsx(CloudDownload, { className: "h-3.5 w-3.5 text-primary" }),
				"Imported from ",
				/* @__PURE__ */ jsx("b", { children: source.label }),
				/* @__PURE__ */ jsx("a", {
					href: source.url,
					target: "_blank",
					rel: "noreferrer",
					className: "underline",
					children: "view source"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: "— prices are source values, adjust before saving."
				})
			]
		}),
		/* @__PURE__ */ jsxs("form", {
			onSubmit: save,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "surface-card p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-4 text-sm font-semibold",
						children: "Basics"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ jsx(Field, {
									label: "Product name",
									required: true,
									children: /* @__PURE__ */ jsx("input", {
										required: true,
										value: name,
										onChange: (e) => setName(e.target.value),
										className: inputCls
									})
								}), /* @__PURE__ */ jsx(Field, {
									label: "SKU (optional)",
									children: /* @__PURE__ */ jsx("input", {
										value: sku,
										onChange: (e) => setSku(e.target.value),
										className: inputCls,
										placeholder: "Auto if empty"
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ jsx(Field, {
									label: "Brand",
									children: /* @__PURE__ */ jsx(SearchableSelect, {
										options: brands.map((b) => ({
											value: b.id,
											label: b.name
										})),
										value: brandId,
										onChange: setBrandId,
										placeholder: "— None —",
										searchPlaceholder: "Search brand…"
									})
								}), /* @__PURE__ */ jsx(Field, {
									label: "Category",
									children: /* @__PURE__ */ jsx(SearchableSelect, {
										options: cats.map((c) => ({
											value: c.id,
											label: c.name
										})),
										value: categoryId,
										onChange: setCategoryId,
										placeholder: "— None —",
										searchPlaceholder: "Search category…"
									})
								})]
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Description",
								children: /* @__PURE__ */ jsx(RichTextEditor, {
									value: description,
									onChange: setDescription
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "surface-card p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "Images"
					}), /* @__PURE__ */ jsx(ImageUploader, {
						bucket: "product-images",
						folder: "products",
						value: images,
						onChange: setImages,
						multiple: true,
						square: true,
						maxImages: 8,
						variant: "square",
						label: "Add image"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "surface-card p-6",
					children: [
						/* @__PURE__ */ jsxs("h3", {
							className: "mb-1 flex items-center gap-1.5 text-sm font-semibold",
							children: ["Pricing & delivery", /* @__PURE__ */ jsxs(Hint, {
								side: "right",
								children: [
									/* @__PURE__ */ jsx("b", { children: "Buying" }),
									" is your cost. ",
									/* @__PURE__ */ jsx("b", { children: "Reseller price" }),
									" is what you charge the reseller.",
									" ",
									/* @__PURE__ */ jsx("b", { children: "Packaging" }),
									" is the pack cost. ",
									/* @__PURE__ */ jsx("b", { children: "Delivery" }),
									" is the courier charge, paid separately by the customer. Reseller's minimum sell price is ",
									/* @__PURE__ */ jsx("b", { children: "reseller price + packaging" }),
									", on top of delivery."
								]
							})]
						}),
						rule.enabled && /* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ jsx(Wand2, { className: "h-3.5 w-3.5 shrink-0 text-primary" }),
								/* @__PURE__ */ jsx("span", {
									className: "min-w-0",
									children: pricingRuleSummary(rule)
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => {
										setPriceTouched(false);
										autoFill(Number(buying) || 0);
									},
									className: "ml-auto rounded-md border bg-background px-2 py-1 text-[11px] font-medium hover:bg-muted",
									children: "Apply rule"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 md:grid-cols-3",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Supplier",
									hint: "Supplier select korle buying price = oi supplier er prapya. Admin er nijer product hole — None — rakhun.",
									children: /* @__PURE__ */ jsx(SearchableSelect, {
										options: suppliers.map((s) => ({
											value: s.id,
											label: `${s.display_name} (${s.code})`
										})),
										value: supplierId,
										onChange: setSupplierId,
										placeholder: "— None (admin's own product) —",
										searchPlaceholder: "Search supplier…"
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: supplierId ? "Supplier price / Admin cost (৳)" : "Buying price / Admin cost (৳)",
									required: true,
									hint: supplierId ? "Supplier ei amount ta pabe (per unit, delivered item)." : "Your cost. Resellers do not see this.",
									children: /* @__PURE__ */ jsx("input", {
										required: true,
										type: "number",
										min: 0,
										value: buying,
										onChange: (e) => {
											setBuying(e.target.value);
											if (!priceTouched) autoFill(Number(e.target.value) || 0);
										},
										className: inputCls
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Reseller price (৳)",
									required: true,
									hint: "Resellers see this as the product price and cannot sell below it.",
									children: /* @__PURE__ */ jsx("input", {
										required: true,
										type: "number",
										min: 0,
										value: resellerPrice,
										onChange: (e) => {
											setPriceTouched(true);
											setResellerPrice(e.target.value);
										},
										className: inputCls
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Packaging cost (৳)",
									hint: "Per-order packaging cost, deducted from the reseller.",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										value: packaging,
										onChange: (e) => {
											setPriceTouched(true);
											setPackaging(e.target.value);
										},
										className: inputCls
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Delivery type",
									hint: `Global rule (default) — ${deliverySettingsSummary(globalDelivery())}. Onno kichu select korle ei product er nijer charge priority pabe.`,
									children: /* @__PURE__ */ jsxs("select", {
										value: deliveryMode,
										onChange: (e) => setDeliveryMode(e.target.value),
										className: inputCls,
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "global",
												children: "Global setting (default)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "area",
												children: "Area-wise (3 areas)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "free",
												children: "Free shipping"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "flat",
												children: "Flat rate (same everywhere)"
											})
										]
									})
								}),
								deliveryMode === "flat" && /* @__PURE__ */ jsx(Field, {
									label: "Flat delivery charge (৳)",
									hint: "Same delivery charge for every area.",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										value: deliveryFlat,
										onChange: (e) => setDeliveryFlat(e.target.value),
										className: inputCls
									})
								}),
								deliveryMode === "area" && /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx(Field, {
										label: `Delivery ${areaLabel("inside_dhaka")} (৳)`,
										hint: "Courier charge, paid by customer.",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 0,
											value: deliveryIn,
											onChange: (e) => setDeliveryIn(e.target.value),
											className: inputCls
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: `Delivery ${areaLabel("sub_dhaka")} (৳)`,
										hint: "Courier charge, paid by customer.",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 0,
											value: deliverySub,
											onChange: (e) => setDeliverySub(e.target.value),
											className: inputCls
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: `Delivery ${areaLabel("outside_dhaka")} (৳)`,
										hint: "Courier charge, paid by customer.",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 0,
											value: deliveryOut,
											onChange: (e) => setDeliveryOut(e.target.value),
											className: inputCls
										})
									})
								] }),
								deliveryMode === "custom" && /* @__PURE__ */ jsx(Field, {
									label: "Custom delivery charge (৳)",
									hint: "Order add / edit e manual change kora jabe.",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										value: deliveryFlat,
										onChange: (e) => setDeliveryFlat(e.target.value),
										className: inputCls
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Stock",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										value: stock,
										onChange: (e) => setStock(e.target.value),
										className: inputCls
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Weight (kg)",
									hint: "Used for courier booking weight. Decimals allowed, e.g. 0.5 = 500 g.",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										min: 0,
										step: .1,
										value: weight,
										onChange: (e) => setWeight(e.target.value),
										className: inputCls,
										placeholder: "e.g. 0.5"
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Suggested sell price (৳)",
									required: true,
									hint: "Suggested to resellers. Must be at least reseller price + packaging.",
									children: /* @__PURE__ */ jsx("input", {
										required: true,
										type: "number",
										min: 0,
										value: suggested,
										onChange: (e) => {
											setPriceTouched(true);
											setSuggested(e.target.value);
										},
										className: inputCls
									})
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-5",
							children: /* @__PURE__ */ jsx(AdminProductCalc, { input: {
								buying: Number(buying) || 0,
								resellerPrice: Number(resellerPrice) || 0,
								packaging: Number(packaging) || 0,
								deliveryMode,
								deliveryFlat: Number(deliveryFlat) || 0,
								deliveryInside: Number(deliveryIn) || 0,
								deliveryOutside: Number(deliveryOut) || 0,
								deliverySub: Number(deliverySub) || 0,
								sellPrice: Number(suggested) || 0
							} })
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "surface-card p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "mb-1 text-sm font-semibold",
						children: "SEO"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Meta title (≤ 60 chars)",
								children: /* @__PURE__ */ jsx("input", {
									maxLength: 60,
									value: metaTitle,
									onChange: (e) => setMetaTitle(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Meta description (≤ 160 chars)",
								children: /* @__PURE__ */ jsx("textarea", {
									maxLength: 160,
									rows: 2,
									value: metaDesc,
									onChange: (e) => setMetaDesc(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Keywords (comma separated)",
								children: /* @__PURE__ */ jsx("input", {
									value: keywords,
									onChange: (e) => setKeywords(e.target.value),
									className: inputCls
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap justify-end gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => nav({ to: "/admin/products" }),
						className: "rounded-md border px-5 py-2.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save product"]
					})]
				})
			]
		})
	] });
}
var inputCls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children, required, hint }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
		className: "mb-1 flex items-center gap-1 text-xs font-medium",
		children: [
			label,
			" ",
			required && /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: "*"
			}),
			hint && /* @__PURE__ */ jsx(Hint, { children: hint })
		]
	}), children] });
}
//#endregion
export { NewProduct as component };
