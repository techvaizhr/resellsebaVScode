import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { R as initial_data_default, r as supabase } from "./client-CiD-puKw.js";
import { d as productDeliveryCharge, i as areaOptions, o as deliveryMode } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { H as Search, Mt as LoaderCircle, cr as Building2, er as Check, et as Plus, r as X, v as Trash2, vt as Minus } from "./vendor-icons-BEaCFqaT.js";
import { o as useAdvancedSettings } from "./advanced-settings-D5OP57K8.js";
import { a as sanitizeName, i as phoneError, n as nameError, r as normalizePhone, t as addressError } from "./checkout-validate-C4SpuEI3.js";
import { t as ProductCodeChip } from "./product-code-BsvmZrFA.js";
//#region src/components/order-form-fields.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** Shared, prettier form primitives used by the add / edit order modals. */
function SectionLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-1.5 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[13px] font-bold uppercase tracking-[0.08em] text-foreground/80",
			children
		})]
	});
}
function MoneyField({ label, hint, value, onChange, placeholder, disabled, invalid }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex items-baseline gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[13px] font-semibold",
			children: label
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-medium text-muted-foreground/70",
			children: hint
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center overflow-hidden rounded-xl border bg-background transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 ${invalid ? "border-destructive" : ""} ${disabled ? "opacity-70" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-10 w-9 shrink-0 place-items-center border-r bg-muted/40 text-[13px] font-bold text-muted-foreground",
			children: "৳"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			inputMode: "numeric",
			disabled,
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "h-10 w-full bg-transparent px-3 text-[13px] font-semibold tabular-nums outline-none placeholder:font-normal placeholder:text-muted-foreground/50"
		})]
	})] });
}
/** Advance receiver toggle (admin vs reseller). */
function AdvanceByToggle({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-1.5 text-[13px] font-semibold",
		children: "Who received the advance?"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: [["admin", "Admin"], ["reseller", "Reseller"]].map(([v, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(v),
			className: `rounded-xl border-2 px-3 py-2.5 text-[13px] font-bold transition-all ${value === v ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-muted bg-background text-muted-foreground hover:border-primary/40"}`,
			children: label
		}, v))
	})] });
}
//#endregion
//#region src/lib/packaging.ts
function packagingTotal(lines, sumMode) {
	if (sumMode) return lines.reduce((s, l) => s + Math.max(Number(l.packaging) || 0, 0) * Math.max(l.qty, 0), 0);
	return lines.reduce((m, l) => Math.max(m, Math.max(Number(l.packaging) || 0, 0)), 0);
}
function packagingModeHint(sumMode) {
	return sumMode ? "Sum mode: each product's packaging charge × quantity is added together." : "Highest mode: when there are multiple products, only the highest packaging charge among them is applied once.";
}
//#endregion
//#region src/components/NewOrderModal.tsx
/** Minimum allowed selling price = SA base cost (product cost + packaging). */
function minSellPrice(p) {
	return Number(p?.reseller_price ?? 0) + Number(p?.packaging_cost ?? 0);
}
function NewOrderModal({ listings, allProducts, resellerId: initialResellerId, resellers = [], onClose, onCreated, isAdmin = false }) {
	const [resellerId, setResellerId] = (0, import_react.useState)(initialResellerId || null);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [area, setArea] = (0, import_react.useState)("outside_dhaka");
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("cod");
	const [note, setNote] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [showPicker, setShowPicker] = (0, import_react.useState)(false);
	const [resellerSearch, setResellerSearch] = (0, import_react.useState)("");
	/** Order level adjustments — "" means keep the automatic/default value. */
	const [discount, setDiscount] = (0, import_react.useState)("");
	const [shipOverride, setShipOverride] = (0, import_react.useState)("");
	const [packagingOverride, setPackagingOverride] = (0, import_react.useState)("");
	const [deliveryCostOverride, setDeliveryCostOverride] = (0, import_react.useState)("");
	/** Advance already collected from the customer + who is holding that cash. */
	const [advance, setAdvance] = (0, import_react.useState)("");
	const [advanceBy, setAdvanceBy] = (0, import_react.useState)("reseller");
	/** Packaging charge rule from Admin → System → Advanced settings. */
	const { settings: advanced } = useAdvancedSettings();
	const packagingSum = advanced.packagingChargeSum;
	const effectiveProducts = (0, import_react.useMemo)(() => {
		return allProducts && allProducts.length > 0 ? allProducts : initial_data_default.products || [];
	}, [allProducts]);
	const effectiveResellers = (0, import_react.useMemo)(() => {
		return resellers && resellers.length > 0 ? resellers : initial_data_default.resellers || [];
	}, [resellers]);
	const selectedReseller = (0, import_react.useMemo)(() => {
		if (!resellerId) return null;
		return effectiveResellers.find((r) => String(r.id) === String(resellerId)) || null;
	}, [effectiveResellers, resellerId]);
	const trendingResellers = (0, import_react.useMemo)(() => {
		return effectiveResellers.slice(0, 6);
	}, [effectiveResellers]);
	const filteredResellers = (0, import_react.useMemo)(() => {
		const q = resellerSearch.trim().toLowerCase();
		if (!q) return [];
		return effectiveResellers.filter((r) => r.business_name && String(r.business_name).toLowerCase().includes(q) || r.code && String(r.code).toLowerCase().includes(q) || r.contact_phone && String(r.contact_phone).toLowerCase().includes(q)).slice(0, 10);
	}, [effectiveResellers, resellerSearch]);
	const results = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) {
			const topListings = (listings || []).filter((l) => l.products).map((l) => ({
				type: "listing",
				data: l
			}));
			const topProducts = effectiveProducts.filter((p) => !(listings || []).some((l) => l.products?.id === p.id)).map((p) => ({
				type: "product",
				data: p
			}));
			return [...topListings, ...topProducts].slice(0, 15);
		}
		const hit = (p) => String(p?.name ?? "").toLowerCase().includes(q) || String(p?.product_code ?? "").toLowerCase().includes(q);
		const listingMatches = (listings || []).filter((l) => l.products && hit(l.products)).map((l) => ({
			type: "listing",
			data: l
		}));
		const productMatches = effectiveProducts.filter((p) => hit(p) && !(listings || []).some((l) => l.products?.id === p.id)).map((p) => ({
			type: "product",
			data: p
		}));
		return [...listingMatches, ...productMatches].slice(0, 20);
	}, [
		listings,
		effectiveProducts,
		query
	]);
	const picked = (0, import_react.useMemo)(() => {
		return lines.map((line, index) => {
			if (line.listing_id) {
				const l = (listings || []).find((x) => x.id === line.listing_id);
				if (l?.products) {
					const min = minSellPrice(l.products);
					return {
						line,
						index,
						p: l.products,
						sellPrice: Number(line.price ?? l.selling_price),
						minPrice: min,
						listingId: l.id
					};
				}
			}
			if (line.product_id) {
				const p = effectiveProducts.find((x) => x.id === line.product_id);
				if (p) {
					const min = minSellPrice(p);
					return {
						line,
						index,
						p,
						sellPrice: Number(line.price ?? p.suggested_price ?? min),
						minPrice: min,
						listingId: null
					};
				}
			}
			return null;
		}).filter(Boolean);
	}, [
		lines,
		listings,
		effectiveProducts
	]);
	const totals = (0, import_react.useMemo)(() => {
		let subtotal = 0;
		let productCost = 0;
		let autoShipping = 0;
		let shipFrom = null;
		let isUniversalFree = true;
		let isUniversalFlat = true;
		for (const { line, p, sellPrice } of picked) {
			subtotal += Number(sellPrice) * line.qty;
			productCost += Number(p.reseller_price) * line.qty;
			const mode = deliveryMode(p);
			if (mode !== "free") isUniversalFree = false;
			if (mode !== "flat") isUniversalFlat = false;
			const dc = productDeliveryCharge(p, area);
			if (dc > autoShipping) {
				autoShipping = dc;
				shipFrom = p.name;
			}
		}
		const packagingDefault = packagingTotal(picked.map(({ line, p }) => ({
			packaging: Number(p.packaging_cost ?? 0),
			qty: line.qty
		})), packagingSum);
		const showAreaPicker = picked.length > 0 && !isUniversalFree && !isUniversalFlat;
		const shipping = shipOverride.trim() === "" ? autoShipping : Math.max(Number(shipOverride) || 0, 0);
		const packaging = packagingOverride.trim() === "" ? packagingDefault : Math.max(Number(packagingOverride) || 0, 0);
		const disc = Math.min(Math.max(Number(discount) || 0, 0), subtotal + shipping);
		const total = subtotal + shipping - disc;
		const saCost = productCost + packaging;
		const deliveryCost = deliveryCostOverride.trim() === "" ? autoShipping : Math.max(Number(deliveryCostOverride) || 0, 0);
		const adv = Math.min(Math.max(Number(advance) || 0, 0), total);
		const resellerAdvance = advanceBy === "reseller" ? adv : 0;
		const grossProfit = total - deliveryCost - saCost;
		return {
			subtotal,
			autoShipping,
			shipping,
			packagingDefault,
			packaging,
			productCost,
			discount: disc,
			total,
			saCost,
			deliveryCost,
			advance: adv,
			resellerAdvance,
			codDue: Math.max(total - adv, 0),
			grossProfit,
			profit: grossProfit - resellerAdvance,
			shipFrom,
			showAreaPicker
		};
	}, [
		picked,
		area,
		shipOverride,
		packagingOverride,
		discount,
		deliveryCostOverride,
		advance,
		advanceBy,
		packagingSum
	]);
	const errors = {
		name: nameError(name),
		phone: phoneError(phone),
		address: addressError(address)
	};
	function pick(item) {
		const prod = item.type === "listing" ? item.data.products : item.data;
		const stock = Number(prod?.stock ?? 0);
		if (stock <= 0) {
			toast.error(`${prod?.name ?? "Product"} is out of stock`);
			return;
		}
		if (item.type === "listing") {
			const l = item.data;
			setLines((prev) => {
				const cur = prev.find((x) => x.listing_id === l.id);
				if (cur) {
					if (cur.qty + 1 > stock) {
						toast.error(`Only ${stock} in stock`);
						return prev;
					}
					toast.success(`Increased ${prod?.name ?? "product"} quantity`);
					return prev.map((x) => x.listing_id === l.id ? {
						...x,
						qty: x.qty + 1
					} : x);
				}
				toast.success(`Added ${prod?.name ?? "product"} to order`);
				return [...prev, {
					listing_id: l.id,
					qty: 1
				}];
			});
		} else {
			const p = item.data;
			setLines((prev) => {
				const cur = prev.find((x) => x.product_id === p.id);
				if (cur) {
					if (cur.qty + 1 > stock) {
						toast.error(`Only ${stock} in stock`);
						return prev;
					}
					toast.success(`Increased ${p?.name ?? "product"} quantity`);
					return prev.map((x) => x.product_id === p.id ? {
						...x,
						qty: x.qty + 1
					} : x);
				}
				toast.success(`Added ${p?.name ?? "product"} to order`);
				return [...prev, {
					product_id: p.id,
					qty: 1,
					price: p.suggested_price || p.reseller_price + p.packaging_cost
				}];
			});
		}
	}
	async function submit(e) {
		e.preventDefault();
		if (picked.length === 0) return toast.error("Select at least one product.");
		const firstError = errors.name || errors.phone || errors.address;
		if (firstError) return toast.error(firstError);
		const low = picked.find((x) => x.sellPrice < x.minPrice);
		if (low) return toast.error(`${low.p.name}: minimum selling price is ৳${low.minPrice} — order cannot be placed below this`);
		const short = picked.find((x) => x.line.qty > Number(x.p?.stock ?? 0));
		if (short) return toast.error(`${short.p.name}: only ${Number(short.p?.stock ?? 0)} in stock`);
		setBusy(true);
		try {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const generatedOrderNumber = String(Math.floor(1e5 + Math.random() * 9e5));
			const { data: order, error } = await supabase.from("orders").insert({
				order_number: generatedOrderNumber,
				reseller_id: resellerId,
				customer_name: sanitizeName(name).trim(),
				customer_phone: normalizePhone(phone),
				address_line: address.trim(),
				area,
				payment_method: paymentMethod,
				reseller_note: !isAdmin ? note : null,
				admin_note: isAdmin ? note : null,
				subtotal: totals.subtotal,
				shipping_cost: totals.shipping,
				discount: totals.discount,
				total: totals.total,
				sa_cost_total: totals.saCost,
				packaging_total: totals.packaging,
				delivery_cost: totals.deliveryCost,
				advance_amount: totals.advance,
				advance_by: totals.advance > 0 ? advanceBy : null,
				reseller_profit: totals.profit,
				status: "pending",
				forwarded_to_admin: true,
				forwarded_at: nowIso,
				created_at: nowIso,
				updated_at: nowIso
			}).select("id, order_number").single();
			if (error) throw error;
			const items = picked.map(({ line, p, sellPrice, listingId }) => {
				const saPrice = Number(p.reseller_price) + Number(p.packaging_cost);
				return {
					order_id: order.id,
					listing_id: listingId,
					product_id: p.id,
					product_name: p.name,
					product_image: p.og_image_url,
					quantity: line.qty,
					sa_price: saPrice,
					reseller_price: sellPrice,
					line_total: Number(sellPrice) * line.qty,
					profit: (Number(sellPrice) - saPrice) * line.qty
				};
			});
			const { error: ie } = await supabase.from("order_items").insert(items);
			if (ie) throw ie;
			const { error: me } = await supabase.from("orders").update({
				packaging_total: totals.packaging,
				sa_cost_total: totals.saCost,
				delivery_cost: totals.deliveryCost,
				advance_amount: totals.advance,
				advance_by: totals.advance > 0 ? advanceBy : null,
				discount: totals.discount,
				shipping_cost: totals.shipping,
				subtotal: totals.subtotal,
				total: totals.total
			}).eq("id", order.id);
			if (me) throw me;
			toast.success(isAdmin ? "Order created successfully" : "Order created and sent to admin");
			onCreated();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4",
		onClick: (e) => {
			if (e.target === e.currentTarget) e.stopPropagation();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl sm:max-h-[90vh] sm:rounded-xl lg:max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-6 bg-muted/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold sm:text-lg",
					children: isAdmin ? "Create New Order (Admin)" : "Add New Order"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground uppercase tracking-tight",
					children: isAdmin ? "Super Admin Portal" : "Reseller Order Placement"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-full p-2 hover:bg-accent transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r",
						children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[13px] font-bold uppercase tracking-wide text-foreground/80",
									children: "Reseller Selection"
								}), selectedReseller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary animate-in zoom-in",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }),
										"Selected: ",
										selectedReseller.business_name
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground",
									children: "Direct Order (No Reseller)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-muted/20 p-3.5 space-y-3",
								children: [
									selectedReseller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3 shadow-xs transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs",
												children: selectedReseller.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: selectedReseller.avatar_url,
													alt: "",
													className: "h-full w-full rounded-lg object-cover"
												}) : selectedReseller.business_name?.slice(0, 2).toUpperCase() || "RS"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-bold text-foreground truncate",
															children: selectedReseller.business_name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary",
															children: selectedReseller.code
														}),
														selectedReseller.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 capitalize",
															children: selectedReseller.status
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground truncate mt-0.5",
													children: selectedReseller.contact_phone ? `Phone: ${selectedReseller.contact_phone}` : "Reseller Account"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5 shrink-0 ml-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setResellerId(null);
													setResellerSearch("");
												},
												className: "inline-flex items-center gap-1 rounded-lg border border-muted-foreground/20 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shadow-2xs cursor-pointer",
												title: "Remove reseller (switch to Direct order)",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remove" })]
											})
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-border/80 bg-background/80 p-2.5 shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-foreground",
													children: "Direct Order"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground",
													children: "In-House"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "Placed directly by Admin (No commission/profit deduction)"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground",
											children: "Direct"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: resellerSearch,
												onChange: (e) => setResellerSearch(e.target.value),
												placeholder: "Search reseller by store name, code (e.g. RS1234), or phone...",
												className: "w-full rounded-lg border bg-background pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
											}),
											resellerSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setResellerSearch(""),
												className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
											})
										]
									}),
									resellerSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-lg border bg-background shadow-md divide-y overflow-hidden max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-1",
										children: filteredResellers.length > 0 ? filteredResellers.map((r) => {
											const isSelected = String(resellerId) === String(r.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setResellerId(r.id);
													setResellerSearch("");
													toast.success(`Reseller selected: ${r.business_name}`);
												},
												className: `flex w-full items-center justify-between p-2.5 text-left transition-colors cursor-pointer ${isSelected ? "bg-primary/10 font-medium" : "hover:bg-accent"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold",
														children: r.business_name?.slice(0, 2).toUpperCase() || "RS"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-xs font-bold text-foreground truncate",
																children: r.business_name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground uppercase",
																children: r.code
															})]
														}), r.contact_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] text-muted-foreground truncate",
															children: r.contact_phone
														})]
													})]
												}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Selected"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-medium text-primary hover:underline",
													children: "Select"
												})]
											}, r.id);
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 text-center text-xs text-muted-foreground",
											children: [
												"No reseller found matching \"",
												resellerSearch,
												"\""
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 pt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-muted-foreground mr-1",
												children: "Quick Select:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setResellerId(null);
													setResellerSearch("");
												},
												className: `rounded-md px-2.5 py-1 text-[10px] font-bold transition-all border cursor-pointer ${!resellerId ? "bg-primary text-primary-foreground border-primary shadow-2xs" : "bg-background hover:bg-accent text-foreground"}`,
												children: "Direct"
											}),
											trendingResellers.map((r) => {
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setResellerId(r.id);
														setResellerSearch("");
													},
													className: `rounded-md px-2.5 py-1 text-[10px] font-bold transition-all border cursor-pointer ${String(resellerId) === String(r.id) ? "bg-primary text-primary-foreground border-primary shadow-2xs" : "bg-background hover:bg-accent text-foreground"}`,
													children: r.business_name
												}, r.id);
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[13px] font-bold uppercase tracking-wide text-foreground/80",
										children: "Customer Information"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-x-4 gap-y-3 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
												label: "Customer Full Name",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													required: true,
													value: name,
													onChange: (e) => setName(sanitizeName(e.target.value)),
													placeholder: "Enter full name",
													className: "w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
												}), name && errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { text: errors.name })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
												label: "Mobile Number",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													required: true,
													value: phone,
													onChange: (e) => setPhone(normalizePhone(e.target.value)),
													inputMode: "numeric",
													placeholder: "01XXXXXXXXX",
													className: "w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
												}), phone && errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { text: errors.phone })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
												label: "Shipping Address",
												className: "sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													required: true,
													value: address,
													onChange: (e) => setAddress(e.target.value),
													rows: 1,
													placeholder: "Complete address (Road, Area, City...)",
													className: "w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20 min-h-[42px]"
												}), address && errors.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldError, { text: errors.address })]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[13px] font-bold uppercase tracking-wide text-foreground/80",
											children: "Order Items"
										}), picked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary animate-in zoom-in",
											children: [
												picked.length,
												" ",
												picked.length === 1 ? "Item" : "Items",
												" Selected"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border bg-background shadow-sm overflow-hidden flex flex-col",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-3 border-b bg-muted/5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: query,
														onChange: (e) => setQuery(e.target.value),
														placeholder: isAdmin ? "Search product by name or ID..." : "Search catalog by name or ID...",
														className: "w-full rounded-xl border bg-background px-9 py-2 text-xs focus:ring-2 focus:ring-primary/20 transition-all"
													})]
												})
											}),
											(query.trim() !== "" || picked.length === 0 || showPicker) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "max-h-72 border-b divide-y overflow-y-auto bg-muted/10 animate-in slide-in-from-top-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "sticky top-0 z-10 flex items-center justify-between px-3 py-1.5 bg-background/95 backdrop-blur border-b shadow-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
														children: query ? `Search Results (${results.length})` : `Available Catalog Products (${results.length})`
													}), picked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => {
															setShowPicker(false);
															setQuery("");
														},
														className: "text-[10px] font-bold text-primary hover:underline",
														children: "Hide catalog"
													})]
												}), results.length > 0 ? results.map((item) => {
													const p = item.type === "listing" ? item.data.products : item.data;
													const price = item.type === "listing" ? item.data.selling_price : p.suggested_price || p.reseller_price + p.packaging_cost;
													const dc = productDeliveryCharge(p, area);
													const inCart = item.type === "listing" ? lines.some((x) => x.listing_id === item.data.id) : lines.some((x) => x.product_id === p.id);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => pick(item),
														className: `flex w-full items-center gap-3 p-3 text-left transition-colors ${inCart ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/60"}`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-sm",
																children: p.og_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																	src: p.og_image_url,
																	alt: "",
																	className: "h-full w-full object-cover"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "m-auto h-full w-1/2 text-muted-foreground/30" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0 flex-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex items-center gap-1.5",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "truncate text-xs font-bold text-foreground",
																		children: p.name
																	}), item.type === "listing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase tracking-tighter",
																		children: "Listing"
																	})]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "mt-1 flex flex-wrap items-center gap-2",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.product_code }),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "text-[11px] font-bold text-primary",
																			children: ["৳", Number(price).toFixed(0)]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "text-[10px] text-muted-foreground",
																			children: ["· Delivery: ৳", dc.toFixed(0)]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: `rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${Number(p.stock ?? 0) <= 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`,
																			children: Number(p.stock ?? 0) <= 0 ? "Out of stock" : `Stock ${Number(p.stock ?? 0)}`
																		})
																	]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: `shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${inCart ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted hover:bg-primary/20 hover:text-primary"}`,
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inCart ? "Added" : "Add" })]
															})
														]
													}, item.type === "listing" ? `l-${item.data.id}` : `p-${p.id}`);
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "p-8 text-center text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs",
														children: [
															"No products found for \"",
															query,
															"\""
														]
													})
												})]
											}),
											picked.length > 0 && !query && !showPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 border-b bg-muted/20 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-semibold text-muted-foreground",
													children: [
														picked.length,
														" ",
														picked.length === 1 ? "item" : "items",
														" added to order"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setShowPicker(true),
													className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Browse / Add more"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex-1 max-h-[300px] overflow-y-auto divide-y bg-background",
												children: picked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col items-center justify-center py-6 text-center text-muted-foreground bg-muted/5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-semibold text-foreground",
														children: "Click any product above or search to add to your order"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] opacity-60 mt-0.5 uppercase tracking-wider",
														children: "No items added yet"
													})]
												}) : picked.map(({ line, p, sellPrice, minPrice, listingId }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "group relative flex flex-wrap items-center gap-4 p-4 hover:bg-muted/5 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm",
															children: p.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: p.og_image_url,
																alt: "",
																className: "h-full w-full object-cover"
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0 flex-1",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "truncate text-xs font-black text-foreground",
																	children: p.name
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "mt-1",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.product_code })
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "mt-1.5 flex items-center gap-2",
																	children: [
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																			className: "text-[9px] font-semibold uppercase text-muted-foreground",
																			children: "Sell ৳"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																			value: sellPrice,
																			inputMode: "numeric",
																			onChange: (e) => {
																				const v = Number(e.target.value) || 0;
																				setLines((prev) => prev.map((l, idx) => idx === i ? {
																					...l,
																					price: v
																				} : l));
																			},
																			onBlur: () => {
																				if (sellPrice < minPrice) {
																					setLines((prev) => prev.map((l, idx) => idx === i ? {
																						...l,
																						price: minPrice
																					} : l));
																					toast.error(`Minimum selling price is ৳${minPrice} — cannot go below this`);
																				}
																			},
																			className: `w-20 rounded-lg border bg-background px-2 py-1 text-[11px] font-bold tabular-nums focus:ring-2 focus:ring-primary/20 ${sellPrice < minPrice ? "border-destructive text-destructive" : ""}`
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "text-[9px] text-muted-foreground/70",
																			children: ["min ৳", minPrice]
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																			className: "text-[10px] text-muted-foreground/60",
																			children: ["× ", line.qty]
																		})
																	]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-4",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center rounded-xl border bg-muted/30 p-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		onClick: () => setLines((prev) => prev.flatMap((l, idx) => idx === i ? l.qty <= 1 ? [] : [{
																			...l,
																			qty: l.qty - 1
																		}] : [l])),
																		className: "h-7 w-7 flex items-center justify-center hover:bg-background rounded-lg transition-all active:scale-90",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "w-8 text-center text-[12px] font-black",
																		children: line.qty
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																		type: "button",
																		onClick: () => setLines((prev) => prev.map((l, idx) => {
																			if (idx !== i) return l;
																			const stock = Number(p?.stock ?? 0);
																			if (l.qty + 1 > stock) {
																				toast.error(`Only ${stock} in stock`);
																				return l;
																			}
																			return {
																				...l,
																				qty: l.qty + 1
																			};
																		})),
																		className: "h-7 w-7 flex items-center justify-center hover:bg-background rounded-lg transition-all active:scale-90",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
																	})
																]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setLines((prev) => prev.filter((_, idx) => idx !== i)),
																className: "h-8 w-8 flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors",
																title: "Remove item",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
															})]
														})
													]
												}, listingId || p.id))
											}),
											totals.showAreaPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-4 border-t bg-muted/10 animate-in fade-in slide-in-from-bottom-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "mb-2.5 block text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest",
													children: "Select Delivery Destination"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-3 gap-2",
													children: areaOptions().map(({ value: v, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => setArea(v),
														className: `flex items-center justify-between rounded-2xl border-2 py-3 px-4 transition-all duration-300 ${area === v ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" : "bg-background border-muted hover:border-primary/30 text-muted-foreground"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11px] font-black uppercase tracking-tight",
															children: label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: `text-[10px] font-bold ${area === v ? "text-primary-foreground/90" : "text-primary"}`,
															children: ["৳", Math.max(...picked.map(({ p }) => productDeliveryCharge(p, v)))]
														})]
													}, v))
												})]
											})
										]
									})]
								}),
								picked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Delivery & Other Charges" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
													label: "Delivery Charge (Customer pays)",
													hint: `Default ৳${totals.autoShipping.toFixed(0)}`,
													value: shipOverride,
													onChange: setShipOverride,
													placeholder: totals.autoShipping.toFixed(0)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
													label: "Discount",
													value: discount,
													onChange: setDiscount,
													placeholder: "0"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
													label: "Packaging Cost",
													hint: packagingSum ? "Sum of all items" : "Highest item only",
													disabled: !isAdmin,
													value: isAdmin ? packagingOverride : "",
													onChange: setPackagingOverride,
													placeholder: totals.packagingDefault.toFixed(0)
												}),
												isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
													label: "Courier Cost (Admin cost)",
													hint: `Default ৳${totals.autoShipping.toFixed(0)}`,
													value: deliveryCostOverride,
													onChange: setDeliveryCostOverride,
													placeholder: totals.autoShipping.toFixed(0)
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[12px] leading-relaxed text-muted-foreground",
											children: [
												"Leave empty to use the default. Delivery charge = paid by customer, courier cost = admin's expense.",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												packagingModeHint(packagingSum)
											]
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "flex flex-col gap-4 bg-muted/20 p-4 sm:p-6 border-t lg:border-t-0",
						children: [
							picked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Advance Payment" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyField, {
												label: "Advance Amount",
												hint: "If already received",
												value: advance,
												onChange: setAdvance,
												placeholder: "0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvanceByToggle, {
												value: advanceBy,
												onChange: setAdvanceBy
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[12px] leading-relaxed text-muted-foreground",
											children: "If taken by admin, it is not deducted from the reseller's account; if taken by the reseller, it will be deducted from the final amount."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Payment Method & Note" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 rounded-2xl border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Payment Method",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: paymentMethod,
												onChange: (e) => setPaymentMethod(e.target.value),
												className: "w-full rounded-lg border bg-background px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "cod",
														children: "Cash on Delivery"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "bkash",
														children: "bKash"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "nagad",
														children: "Nagad"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "rocket",
														children: "Rocket"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "sslcommerz",
														children: "SSLCommerz"
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Order Note (Optional)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: note,
												onChange: (e) => setNote(e.target.value),
												placeholder: "Special instructions...",
												className: "w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Order Summary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto space-y-4 rounded-2xl border-2 border-primary/20 bg-background p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[9px] font-black uppercase tracking-widest text-muted-foreground/60",
													children: "Customer bill"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-medium",
														children: [
															"Subtotal (",
															picked.length,
															" ",
															picked.length === 1 ? "item" : "items",
															")"
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.subtotal.toFixed(0)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium",
															children: "Shipping charge"
														}), picked.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary",
															children: "Max applied"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.shipping.toFixed(0)]
													})]
												}),
												totals.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Discount"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black",
														children: ["−৳", totals.discount.toFixed(0)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-t pt-1.5 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground",
														children: "Payable total"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-primary",
														children: ["৳", totals.total.toFixed(0)]
													})]
												}),
												totals.advance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-medium text-muted-foreground",
														children: ["Advance received", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary",
															children: advanceBy
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["−৳", totals.advance.toFixed(0)]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "COD to collect"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.codDue.toFixed(0)]
													})]
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 border-t pt-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[9px] font-black uppercase tracking-widest text-muted-foreground/60",
													children: isAdmin ? "Cost" : "Your cost"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Product cost"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.productCost.toFixed(0)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Delivery charge"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.deliveryCost.toFixed(0)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Packaging cost"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", totals.packaging.toFixed(0)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between border-t pt-1.5 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground",
														children: "Total cost"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["৳", (totals.productCost + totals.deliveryCost + totals.packaging).toFixed(0)]
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 border-t-2 border-dashed border-muted pt-2.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground",
														children: totals.grossProfit < 0 ? isAdmin ? "Reseller loss" : "Your loss" : isAdmin ? "Reseller profit" : "Your profit"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `font-black ${totals.grossProfit < 0 ? "text-destructive" : "text-success"}`,
														children: ["৳", totals.grossProfit.toFixed(0)]
													})]
												}),
												totals.resellerAdvance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-xs text-muted-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: "Advance already in reseller hand"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-black text-foreground",
														children: ["−৳", totals.resellerAdvance.toFixed(0)]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between border-t pt-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground/70",
														children: "Final amount to receive"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: `text-lg font-black tracking-tight ${totals.profit < 0 ? "text-destructive" : "text-success"}`,
														children: ["৳", totals.profit.toFixed(0)]
													})]
												})] }),
												totals.advance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] leading-snug text-muted-foreground",
													children: advanceBy === "reseller" ? "Advance is already with the reseller, so it is deducted from the final amount." : "Advance is held by admin — no plus/minus on the reseller balance."
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: busy || picked.length === 0,
									className: "w-full flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-black text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none group",
									children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Place Order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 group-hover:rotate-90 transition-transform" })] })
								})]
							})
						]
					})]
				})
			})]
		})
	});
}
function FieldError({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-[11px] font-medium text-destructive",
		children: text
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mb-1.5 block text-[13px] font-semibold",
			children: label
		}), children]
	});
}
//#endregion
export { MoneyField as a, AdvanceByToggle as i, packagingModeHint as n, SectionLabel as o, packagingTotal as r, NewOrderModal as t };
