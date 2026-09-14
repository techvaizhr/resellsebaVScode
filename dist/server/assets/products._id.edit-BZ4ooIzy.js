import { r as supabase } from "./client-Be051lUg.js";
import { f as resolveDelivery, l as globalDelivery, p as resolvedCharge, r as areaLabel, s as deliverySettingsSummary } from "./delivery-DY_nRbFK.js";
import { n as confirmAction } from "./confirm-CI5WE9B0.js";
import { t as Route } from "./products._id.edit-BQ2JNrOF.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { r as useCan } from "./use-auth-DJu3SP6g.js";
import { t as ImageUploader } from "./ImageUploader-B63BYQ0O.js";
import { t as AdminProductCalc } from "./price-breakdown-CGuNUtD0.js";
import { t as RichTextEditor } from "./RichTextEditor-D_Oou7aN.js";
import { n as uniqueProductSlug, t as slugify } from "./slug-D6v0iS95.js";
import { t as Hint } from "./Hint-Ph3d-VhV.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/admin/products.$id.edit.tsx?tsr-split=component
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
function EditProduct() {
	const { id } = Route.useParams();
	const nav = useNavigate();
	const can = useCan();
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [name, setName] = useState("");
	const [origName, setOrigName] = useState("");
	const [slug, setSlug] = useState("");
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
	const [isActive, setIsActive] = useState(true);
	const [images, setImages] = useState([]);
	const [metaTitle, setMetaTitle] = useState("");
	const [metaDesc, setMetaDesc] = useState("");
	const [keywords, setKeywords] = useState("");
	const [brands, setBrands] = useState([]);
	const [cats, setCats] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [supplierId, setSupplierId] = useState("");
	useEffect(() => {
		(async () => {
			const [{ data: p }, { data: bs }, { data: cs }, { data: imgs }, { data: sup }] = await Promise.all([
				supabase.from("products").select("*").eq("id", id).maybeSingle(),
				supabase.from("brands").select("id,name").order("name"),
				supabase.from("categories").select("id,name").order("name"),
				supabase.from("product_images").select("url,sort_order").eq("product_id", id).order("sort_order"),
				supabase.from("suppliers").select("id,display_name,code").eq("status", "active").order("display_name")
			]);
			setBrands(bs ?? []);
			setCats(cs ?? []);
			setSuppliers(sup ?? []);
			if (!p) {
				toast.error("Product not found");
				nav({ to: "/admin/products" });
				return;
			}
			const anyP = p;
			setName(p.name ?? "");
			setOrigName(p.name ?? "");
			setSlug(p.slug ?? "");
			setSku(p.sku ?? "");
			setDescription(p.description ?? "");
			setBrandId(p.brand_id ?? "");
			setCategoryId(p.category_id ?? "");
			setSupplierId(anyP.supplier_id ?? "");
			setBuying(String(p.buying_price ?? 0));
			setResellerPrice(String(anyP.reseller_price ?? p.buying_price ?? 0));
			setPackaging(String(p.packaging_cost ?? 0));
			setDeliveryMode(p.delivery_mode ?? "global");
			setDeliveryFlat(String(p.delivery_flat ?? 0));
			setDeliveryIn(String(p.delivery_inside ?? 0));
			setDeliveryOut(String(p.delivery_outside ?? 0));
			setDeliverySub(String(p.delivery_sub ?? p.delivery_outside ?? 0));
			setSuggested(String(p.suggested_price ?? 0));
			setStock(String(p.stock ?? 0));
			setWeight(p.weight_grams == null ? "" : String(p.weight_grams / 1e3));
			setIsActive(!!p.is_active);
			setMetaTitle(p.meta_title ?? "");
			setMetaDesc(p.meta_description ?? "");
			setKeywords(p.keywords ?? "");
			const existing = (imgs ?? []).map((r) => ({
				url: r.url,
				path: "",
				bytes: 0
			}));
			if (existing.length === 0 && p.og_image_url) existing.push({
				url: p.og_image_url,
				path: "",
				bytes: 0
			});
			setImages(existing);
			setLoading(false);
		})();
	}, [id, nav]);
	const calc = useMemo(() => {
		const buy = Number(buying) || 0;
		const rp = Number(resellerPrice) || 0;
		const pkg = Number(packaging) || 0;
		const r = resolveDelivery({
			brand_id: brandId || null,
			category_id: categoryId || null,
			id,
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
		setBusy(true);
		try {
			let finalSlug = slug;
			if (!finalSlug || name !== origName && slugify(name) !== finalSlug) finalSlug = await uniqueProductSlug(name, id);
			if (Number(resellerPrice) < Number(buying)) throw new Error("Reseller price cannot be less than buying price.");
			if (Number(suggested) < calc.resellerMinSell) throw new Error(`Suggested sell must be at least ৳${calc.resellerMinSell} (reseller price + packaging).`);
			const { error } = await supabase.from("products").update({
				name,
				slug: finalSlug,
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
				is_active: isActive,
				og_image_url: images[0]?.url ?? null,
				meta_title: metaTitle || null,
				meta_description: metaDesc || null,
				keywords: keywords || null
			}).eq("id", id);
			if (error) {
				console.error("Database update error:", error);
				throw new Error(error.message || "Failed to update product details");
			}
			const { error: de } = await supabase.from("product_images").delete().eq("product_id", id);
			if (de) console.warn("Failed to clean old images:", de);
			if (images.length) {
				const { error: ie } = await supabase.from("product_images").insert(images.map((im, i) => ({
					product_id: id,
					url: im.url,
					is_primary: i === 0,
					sort_order: i
				})));
				if (ie) {
					console.error("Image insert error:", ie);
					throw new Error(ie.message || "Details updated, but failed to save images");
				}
			}
			toast.success("Product updated successfully");
			nav({
				to: "/admin/products",
				search: { refresh: id }
			});
		} catch (err) {
			console.error("Save product catch block:", err);
			toast.error(err instanceof Error ? err.message : "Failed to update product");
		} finally {
			setBusy(false);
		}
	}
	async function remove() {
		if (!await confirmAction({
			title: "Delete product",
			description: "All related listings may also be removed.",
			detail: name,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("products").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		nav({
			to: "/admin/products",
			search: { refresh: id }
		});
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (!can("products.manage")) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-24",
		children: /* @__PURE__ */ jsx("div", {
			className: "surface-card max-w-md p-8 text-center text-sm text-muted-foreground",
			children: "You do not have permission to edit products."
		})
	});
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Edit product",
		description: "Changes here also reflect in reseller listings.",
		actions: can("products.delete") ? /* @__PURE__ */ jsxs("button", {
			onClick: remove,
			className: "inline-flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/10",
			children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), " Delete"]
		}) : void 0
	}), /* @__PURE__ */ jsxs("form", {
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
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Slug",
							children: /* @__PURE__ */ jsx("input", {
								value: slug,
								onChange: (e) => setSlug(e.target.value),
								className: inputCls,
								placeholder: "Auto from name if empty"
							})
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
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "inline-flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: isActive,
								onChange: (e) => setIsActive(e.target.checked)
							}), "Active (visible to resellers)"]
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
									onChange: (e) => setBuying(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Reseller price (৳)",
								required: true,
								hint: "Resellers see this as the product price.",
								children: /* @__PURE__ */ jsx("input", {
									required: true,
									type: "number",
									min: 0,
									value: resellerPrice,
									onChange: (e) => setResellerPrice(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Packaging cost (৳)",
								hint: "Per-order packaging cost, deducted by admin.",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									min: 0,
									value: packaging,
									onChange: (e) => setPackaging(e.target.value),
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
								hint: "Suggested to resellers, at least reseller price + packaging.",
								children: /* @__PURE__ */ jsx("input", {
									required: true,
									type: "number",
									min: 0,
									value: suggested,
									onChange: (e) => setSuggested(e.target.value),
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
					children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save changes"]
				})]
			})
		]
	})] });
}
//#endregion
export { EditProduct as component };
