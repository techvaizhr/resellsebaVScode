import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CiD-puKw.js";
import { a as deliveryLabel, d as productDeliveryCharge, l as globalDelivery, n as DELIVERY_AREAS, r as areaLabel } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { G as Save, Mt as LoaderCircle, b as Tag, g as TrendingUp, r as X, v as Trash2, yn as Eye } from "./vendor-icons-BEaCFqaT.js";
import { n as confirmAction } from "./confirm-BTmyn8ng.js";
import { n as getGlobalSettings, r as getMyReseller } from "./app-data-CF0v-2hN.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BphzVqAU.js";
import { r as DropdownMenuItem } from "./dropdown-menu-DIpdXuPg.js";
import { i as usePaginated, n as DataToolbar, r as Pagination, t as ActionMenu } from "./data-list-BIvUbfJ8.js";
import { t as ProductCodeChip } from "./product-code-BsvmZrFA.js";
import { n as ImageDownloadTools, r as stripHtml, t as CopyButton } from "./reseller-tools-BmgHPnmH.js";
//#region src/components/listing-pricing-modal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var taka = (n) => `৳${Math.round(n * 100) / 100}`;
function ListingPricingModal({ id, onClose, onSaved }) {
	const [row, setRow] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [price, setPrice] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [settingsTick, setSettingsTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			setLoading(true);
			const [{ data, error }] = await Promise.all([supabase.from("reseller_listings").select("id,selling_price,is_active,products(id,name,product_code,og_image_url,reseller_price,packaging_cost,suggested_price,stock,brand_id,category_id,delivery_mode,delivery_flat,delivery_inside,delivery_outside,delivery_sub)").eq("id", id).maybeSingle(), getGlobalSettings().catch(() => null)]);
			if (!alive) return;
			if (error) toast.error(error.message);
			const l = data ?? null;
			setRow(l);
			setPrice(l ? String(l.selling_price) : "");
			setSettingsTick((t) => t + 1);
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [id]);
	const p = row?.products ?? null;
	const g = globalDelivery();
	const calc = (0, import_react.useMemo)(() => {
		const productCost = Number(p?.reseller_price ?? 0);
		const packaging = Number(p?.packaging_cost ?? 0);
		const cost = productCost + packaging;
		const sell = Number(price);
		const valid = price.trim() !== "" && Number.isFinite(sell) && sell >= 0;
		const profit = valid ? sell - cost : 0;
		return {
			productCost,
			packaging,
			cost,
			sell,
			valid,
			profit,
			margin: valid && sell > 0 ? profit / sell * 100 : 0,
			delivery: p ? DELIVERY_AREAS.map((area) => ({
				area,
				label: areaLabel(area, g),
				charge: productDeliveryCharge(p, area, {}, g)
			})) : []
		};
	}, [
		p,
		price,
		g,
		settingsTick
	]);
	async function save() {
		if (!row || !p) return;
		if (!calc.valid) return toast.error("Enter a valid selling price");
		if (calc.sell < calc.cost) return toast.error(`Selling price must be at least ${taka(calc.cost)} (product + packaging). Delivery is charged to the customer separately.`);
		setBusy(true);
		const { error } = await supabase.from("reseller_listings").update({ selling_price: calc.sell }).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`Selling price updated to ${taka(calc.sell)}`);
		onSaved?.();
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card max-h-[90vh] w-full max-w-lg modal-scroll",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-5 py-4 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold",
					children: "Pricing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-2 hover:bg-muted",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid place-items-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}) : !p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6 text-sm text-muted-foreground",
				children: "Listing not found."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted",
							children: p.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.og_image_url,
								alt: "",
								className: "h-full w-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: p.product_code }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-[11px] font-semibold ${row?.is_active ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`,
									children: row?.is_active ? "Live" : "Paused"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/30 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
								children: "Your cost breakdown"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "space-y-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted-foreground",
											children: "Product cost (admin price)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: taka(calc.productCost)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted-foreground",
											children: "Packaging cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium",
											children: taka(calc.packaging)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-t pt-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-semibold",
											children: "Total cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-bold",
											children: taka(calc.cost)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "The customer pays the delivery charge separately — it is not deducted from your profit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-medium",
							htmlFor: "listing-selling-price",
							children: "Selling price (৳)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "listing-selling-price",
							type: "number",
							min: calc.cost,
							step: "1",
							value: price,
							onChange: (e) => setPrice(e.target.value),
							className: "w-full rounded-lg border bg-background px-3 py-2 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary/40"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Minimum ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: taka(calc.cost) })] }),
								p.suggested_price != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPrice(String(p.suggested_price)),
									className: "font-medium text-primary hover:underline",
									children: ["Use suggested ", taka(Number(p.suggested_price))]
								}),
								p.stock != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Stock ", p.stock] })
							]
						}),
						calc.valid && calc.sell < calc.cost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs font-medium text-destructive",
							children: "Selling price is below cost — cannot save."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-muted/30 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
								children: "Your profit / unit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `text-xl font-bold ${calc.profit < 0 ? "text-destructive" : "text-success"}`,
								children: taka(calc.profit)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-muted/30 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
								children: "Margin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xl font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-muted-foreground" }),
									calc.margin.toFixed(1),
									"%"
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
								children: "Customer pays (with delivery)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: deliveryLabel(p, g)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 text-sm",
							children: calc.delivery.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										d.label,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs",
											children: [
												"(+",
												taka(d.charge),
												" delivery)"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: taka((calc.valid ? calc.sell : 0) + d.charge)
								})]
							}, d.area))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: save,
							disabled: busy || !calc.valid || calc.sell < calc.cost,
							className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Save price"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/_authenticated/reseller/listings.tsx?tsr-split=component
function ListingsPage() {
	const { user } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(1);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [pricingId, setPricingId] = (0, import_react.useState)(null);
	async function load() {
		if (!user) return;
		setLoading(true);
		const r = await getMyReseller(user.id);
		if (!r) return setLoading(false);
		const { data } = await supabase.from("reseller_listings").select("id,selling_price,is_active,products(id,brand_id,category_id,name,slug,product_code,reseller_price,packaging_cost,delivery_inside,delivery_outside,delivery_sub,delivery_mode,delivery_flat,og_image_url)").eq("reseller_id", r.id).order("created_at", { ascending: false });
		setItems(data ?? []);
		setLoading(false);
	}
	const didLoad = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (didLoad.current) return;
		didLoad.current = true;
		load();
	}, [user]);
	async function remove(id) {
		if (!await confirmAction({
			title: "Remove listing",
			description: "Remove this listing from your store?",
			confirmText: "Remove"
		})) return;
		await supabase.from("reseller_listings").delete().eq("id", id);
		toast.success("Removed");
		load();
	}
	const filtered = (0, import_react.useMemo)(() => {
		const term = q.trim().toLowerCase();
		let out = items.filter((l) => {
			const okQ = !term || (l.products?.name ?? "").toLowerCase().includes(term) || String(l.products?.product_code ?? "").toLowerCase().includes(term);
			const okS = !status || (status === "active" ? l.is_active : !l.is_active);
			return okQ && okS;
		});
		const profitOf = (l) => l.selling_price - ((l.products?.reseller_price ?? 0) + (l.products?.packaging_cost ?? 0));
		out = [...out];
		if (sort === "price_high") out.sort((a, b) => b.selling_price - a.selling_price);
		else if (sort === "price_low") out.sort((a, b) => a.selling_price - b.selling_price);
		else if (sort === "profit_high") out.sort((a, b) => profitOf(b) - profitOf(a));
		else if (sort === "name") out.sort((a, b) => (a.products?.name ?? "").localeCompare(b.products?.name ?? ""));
		return out;
	}, [
		items,
		q,
		status,
		sort
	]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		q,
		status,
		sort,
		perPage
	]);
	const paged = usePaginated(filtered, page, perPage);
	const filters = [{
		key: "status",
		label: "Status",
		value: status,
		onChange: setStatus,
		options: [{
			value: "active",
			label: "Live"
		}, {
			value: "paused",
			label: "Paused"
		}]
	}, {
		key: "sort",
		label: "Sort",
		value: sort,
		onChange: setSort,
		options: [
			{
				value: "newest",
				label: "Newest first"
			},
			{
				value: "name",
				label: "Name (A-Z)"
			},
			{
				value: "price_high",
				label: "Price high → low"
			},
			{
				value: "price_low",
				label: "Price low → high"
			},
			{
				value: "profit_high",
				label: "Profit high → low"
			}
		]
	}];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My listings",
			description: "Products currently in your store."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			search: q,
			onSearch: setQ,
			searchPlaceholder: "Search by name or product ID…",
			filters,
			perPage,
			onPerPage: setPerPage,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-muted-foreground",
				children: [
					filtered.length,
					" of ",
					items.length,
					" listings"
				]
			})
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No listings",
			description: "Select products from the Catalog to start listing."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card divide-y",
			children: paged.map((l) => {
				const cost = (l.products?.reseller_price ?? 0) + (l.products?.packaging_cost ?? 0);
				const profit = l.selling_price - cost;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-14 w-14 overflow-hidden rounded-md border bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
							onClick: () => setDetailId(l.id),
							children: l.products?.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: l.products.og_image_url,
								className: "h-full w-full object-cover",
								alt: ""
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCodeChip, { code: l.products?.product_code })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium cursor-pointer hover:text-primary transition-colors",
									onClick: () => setDetailId(l.id),
									children: l.products?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"Sell ৳",
										l.selling_price,
										" · Cost ৳",
										cost,
										" (product + packaging) · Delivery:",
										" ",
										l.products ? deliveryLabel(l.products) : "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm",
										children: ["Profit ৳", profit]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${l.is_active ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`,
							children: l.is_active ? "Live" : "Paused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionMenu, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setDetailId(l.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View Details"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setPricingId(l.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "mr-2 h-4 w-4" }), " Pricing"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								className: "text-destructive focus:text-destructive",
								onSelect: () => remove(l.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete Listing"]
							})
						] })
					]
				}, l.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: filtered.length,
			onPage: setPage
		})] }),
		detailId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingDetailModal, {
			id: detailId,
			onClose: () => setDetailId(null)
		}),
		pricingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingPricingModal, {
			id: pricingId,
			onClose: () => setPricingId(null),
			onSaved: load
		})
	] });
}
function ListingDetailModal({ id, onClose }) {
	const [l, setL] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [active, setActive] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		async function load() {
			setLoading(true);
			const { data } = await supabase.from("reseller_listings").select(`
          id, selling_price,
          products (
            id, name, product_code, description, short_description, og_image_url, stock, reseller_price, packaging_cost,
            delivery_mode, delivery_flat, delivery_inside, delivery_outside, delivery_sub,
            product_images (url),
            brands (name),
            categories (name)
          )
        `).eq("id", id).single();
			if (data) setL(data);
			setLoading(false);
		}
		load();
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-white" })
	});
	const p = l?.products;
	if (!p) return null;
	const images = [...new Set([p.og_image_url, ...p.product_images?.map((i) => i.url) || []].filter(Boolean))];
	const activeUrl = images[Math.min(active, images.length - 1)] ?? null;
	const detailsText = stripHtml([p.short_description, p.description].filter(Boolean).join("\n\n"));
	const myCost = p.reseller_price + p.packaging_cost;
	const myProfit = l.selling_price - myCost;
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
					children: "Listing Details"
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDownloadTools, {
									compact: true,
									images,
									activeUrl,
									baseName: p.name
								})
							})]
						}), images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-2 pt-1 max-w-full no-scrollbar sm:flex-wrap",
							children: images.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
									p.brands?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
										children: p.brands.name
									}),
									p.categories?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
										children: p.categories.name
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border bg-muted/30 p-3.5 sm:p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Selling Price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold",
										children: ["৳", l.selling_price]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Your Profit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold text-success",
										children: ["৳", myProfit]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Base Cost"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs sm:text-sm font-medium",
										children: ["৳", myCost]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Stock"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-xs sm:text-sm font-medium ${p.stock <= 5 ? "text-destructive" : ""}`,
										children: [p.stock, " in stock"]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm",
									children: "Product Description"
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
export { ListingsPage as component };
