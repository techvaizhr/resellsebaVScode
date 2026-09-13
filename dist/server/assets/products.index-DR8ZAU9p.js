import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-KjQ-na90.js";
import { a as deliveryLabel } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { An as CloudDownload, At as Lock, E as SquareCheckBig, Jn as ChevronDown, Kn as ChevronRight, Mt as LoaderCircle, T as Square, Tn as Copy, Yn as Check, et as Plus, gn as EyeOff, hn as Eye, i as WandSparkles, jt as LockOpen, m as Truck, ot as Pencil, r as X, v as Trash2 } from "./vendor-icons-BWIzFOtW.js";
import { n as confirmAction } from "./confirm-bFSBJqSt.js";
import { t as Route } from "./products.index-BhTVHgXg.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { o as useAdvancedSettings } from "./advanced-settings-CCTt0vlw.js";
import { r as useCan } from "./use-auth-BdX1T6s2.js";
import { t as Button } from "./button-Dqpngf5l.js";
import { a as DropdownMenuSeparator, r as DropdownMenuItem } from "./dropdown-menu-7F50lnQ7.js";
import { i as usePaginated, n as DataToolbar, r as Pagination, t as ActionMenu } from "./data-list-CbGEMtW0.js";
import { t as AppModal } from "./AppModal-Cs8dgOpL.js";
import { n as ImageDownloadTools, r as stripHtml, t as CopyButton } from "./reseller-tools-BvJgnE8N.js";
import { t as ProductImportModal } from "./ProductImportModal-C2Pkol2a.js";
import { f as setProductSupplier, t as APPROVAL_TONE, u as reviewProduct } from "./supplier-BvhvJoqm.js";
//#region src/components/PendingChangesModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	name: "Product name",
	sku: "SKU",
	short_description: "Short description",
	description: "Description",
	brand_id: "Brand",
	category_id: "Category",
	supplier_price: "Supplier price",
	stock: "Stock",
	weight_grams: "Weight (kg)",
	meta_title: "Meta title",
	meta_description: "Meta description",
	keywords: "Keywords",
	og_image_url: "OG image",
	images: "Images"
};
function PendingChangesModal({ productId, productName, pendingChanges, brands = [], categories = [], onClose, onReviewed }) {
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [currentImages, setCurrentImages] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			const [{ data: p }, { data: imgs }] = await Promise.all([supabase.from("products").select("*").eq("id", productId).maybeSingle(), supabase.from("product_images").select("url,sort_order").eq("product_id", productId).order("sort_order")]);
			if (!alive) return;
			setCurrent(p ?? {});
			setCurrentImages((imgs ?? []).map((i) => i.url));
		})();
		return () => {
			alive = false;
		};
	}, [productId]);
	const changes = pendingChanges ?? {};
	const keys = Object.keys(changes);
	function label(key, value) {
		if (value === null || value === void 0 || value === "") return "—";
		if (key === "brand_id") return brands.find((b) => b.id === value)?.name ?? String(value);
		if (key === "category_id") return categories.find((c) => c.id === value)?.name ?? String(value);
		if (key === "description" || key === "short_description") {
			const text = stripHtml(String(value));
			return text.length > 400 ? `${text.slice(0, 400)}…` : text || "—";
		}
		if (key === "images") {
			const arr = Array.isArray(value) ? value : [];
			return `${arr.length} image${arr.length === 1 ? "" : "s"}`;
		}
		if (key === "weight_grams") return `${Number(value) / 1e3} kg`;
		return String(value);
	}
	function currentValue(key) {
		if (key === "images") return currentImages.map((url) => ({ url }));
		return current?.[key] ?? null;
	}
	async function act(approve) {
		setBusy(approve ? "approve" : "reject");
		try {
			await reviewProduct(productId, approve);
			toast.success(approve ? "Changes approved" : "Changes rejected");
			onReviewed();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppModal, {
		open: true,
		onClose,
		title: "Review supplier changes",
		subtitle: productName,
		size: "lg",
		children: [!current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
		}) : keys.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground",
			children: "This product is waiting for first-time approval — no field-level change list, the whole product is new."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: keys.map((k) => {
				const before = currentValue(k);
				const after = changes[k];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1.5 text-xs font-medium text-muted-foreground",
							children: LABELS[k] ?? k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-muted/40 p-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-0.5 text-[10px] uppercase tracking-wide text-muted-foreground",
									children: "Current"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "break-words line-through decoration-muted-foreground/50",
									children: label(k, before)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-emerald-500/10 p-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-0.5 text-[10px] uppercase tracking-wide text-emerald-700 dark:text-emerald-400",
									children: "Requested"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "break-words font-medium",
									children: label(k, after)
								})]
							})]
						}),
						k === "images" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: (Array.isArray(after) ? after : []).slice(0, 8).map((im, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: im.url,
								alt: "",
								className: "h-14 w-14 rounded border object-cover"
							}, idx))
						})
					]
				}, k);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap justify-end gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: onClose,
					disabled: !!busy,
					children: "Close"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "border-red-500/40 text-red-600 hover:bg-red-500/10",
					onClick: () => act(false),
					disabled: !!busy,
					children: [busy === "reject" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-4 w-4" }), "Reject"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => act(true),
					disabled: !!busy,
					children: [busy === "approve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), "Approve"]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/bulk-value-panel.tsx
var FIELDS = [
	{
		key: "reseller_price",
		label: "Reseller price",
		unit: "৳",
		percent: true
	},
	{
		key: "suggested_price",
		label: "Suggested price",
		unit: "৳",
		percent: true
	},
	{
		key: "packaging_cost",
		label: "Packaging",
		unit: "৳",
		percent: true
	},
	{
		key: "stock",
		label: "Stock",
		unit: "pcs",
		percent: false
	},
	{
		key: "weight_kg",
		label: "Weight",
		unit: "kg",
		percent: false
	}
];
var EMPTY = {
	reseller_price: {
		on: false,
		mode: "fixed",
		value: ""
	},
	suggested_price: {
		on: false,
		mode: "fixed",
		value: ""
	},
	packaging_cost: {
		on: false,
		mode: "fixed",
		value: ""
	},
	stock: {
		on: false,
		mode: "fixed",
		value: ""
	},
	weight_kg: {
		on: false,
		mode: "fixed",
		value: ""
	}
};
function round5(n) {
	return Math.round(n / 5) * 5;
}
function computeBulkPatch(row, state) {
	const patch = {};
	for (const f of FIELDS) {
		const s = state[f.key];
		if (!s.on) continue;
		const v = Number(s.value);
		if (!Number.isFinite(v) || s.value.trim() === "") continue;
		if (f.key === "stock") {
			patch.stock = Math.max(0, Math.round(v));
			continue;
		}
		if (f.key === "weight_kg") {
			patch.weight_grams = Math.max(0, Math.round(v * 1e3));
			continue;
		}
		const current = f.key === "reseller_price" ? Number(row.reseller_price ?? 0) : f.key === "suggested_price" ? Number(row.suggested_price ?? 0) : Number(row.packaging_cost ?? 0);
		const cost = Number(row.buying_price ?? 0);
		const next = s.mode === "fixed" ? v : s.mode === "pct_cost" ? cost * (1 + v / 100) : current * (1 + v / 100);
		patch[f.key] = Math.max(0, round5(next));
	}
	return patch;
}
function BulkValuePanel({ count, busy, onApply }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)(EMPTY);
	function set(key, patch) {
		setState((s) => ({
			...s,
			[key]: {
				...s[key],
				...patch
			}
		}));
	}
	const active = FIELDS.filter((f) => state[f.key].on && state[f.key].value.trim() !== "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 w-full rounded-md border bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			className: "flex w-full items-center gap-2 px-3 py-2 text-xs font-medium",
			children: [
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5 text-primary" }),
				"Bulk set values",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "— reseller, suggested, packaging, stock, weight"
				}),
				active.length > 0 && !open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
					children: [
						active.length,
						" field",
						active.length > 1 ? "s" : "",
						" ready"
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 border-t px-3 py-3",
			children: [FIELDS.map((f) => {
				const s = state[f.key];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[auto_minmax(0,7rem)_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[auto_9rem_11rem_minmax(0,1fr)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.on,
							onChange: (e) => set(f.key, { on: e.target.checked }),
							className: "h-4 w-4 accent-[hsl(var(--primary))]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-medium ${s.on ? "" : "text-muted-foreground"}`,
							children: f.label
						}),
						f.percent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							disabled: !s.on,
							value: s.mode,
							onChange: (e) => set(f.key, { mode: e.target.value }),
							className: "h-8 rounded-md border bg-background px-2 text-xs disabled:opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "fixed",
									children: "Fixed amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pct_cost",
									children: "% of admin cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pct_current",
									children: "% change on current"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Fixed value"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								disabled: !s.on,
								inputMode: "decimal",
								value: s.value,
								onChange: (e) => set(f.key, { value: e.target.value }),
								placeholder: s.mode === "fixed" ? `Value in ${f.unit}` : "Percent",
								className: "h-8 w-full rounded-md border bg-background px-2 pr-9 text-xs disabled:opacity-50"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground",
								children: f.percent && s.mode !== "fixed" ? "%" : f.unit
							})]
						})
					]
				}, f.key);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy || !active.length || !count,
						onClick: () => onApply(state),
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50",
						children: [
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5" }),
							"Apply to ",
							count,
							" product",
							count === 1 ? "" : "s"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setState(EMPTY),
						className: "rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground",
						children: "Reset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Values can still be edited inline in the table afterwards."
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/_authenticated/admin/products.index.tsx?tsr-split=component
var PRODUCT_COLS = "id,product_code,name,buying_price,reseller_price,suggested_price,packaging_cost,stock,weight_grams,is_active,is_featured,og_image_url,brand_id,category_id,supplier_id,supplier_price,approval_status,approval_note,pending_changes,delivery_mode,delivery_flat,delivery_inside,delivery_outside,delivery_sub";
/** Keeps the list alive across navigation so editing one product never reloads the page. */
var catalogCache = null;
var listStateCache = null;
function ProductsPage() {
	const nav = useNavigate();
	const search = Route.useSearch();
	const can = useCan();
	const canManage = can("products.manage");
	const canDelete = can("products.delete");
	const { settings } = useAdvancedSettings();
	const [items, setItems] = (0, import_react.useState)(catalogCache?.products ?? []);
	const [brands, setBrands] = (0, import_react.useState)(catalogCache?.brands ?? []);
	const [categories, setCategories] = (0, import_react.useState)(catalogCache?.categories ?? []);
	const [suppliers, setSuppliers] = (0, import_react.useState)(catalogCache?.suppliers ?? []);
	const [assignFor, setAssignFor] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(!catalogCache);
	const [detailId, setDetailId] = (0, import_react.useState)(null);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [inlineEdit, setInlineEdit] = (0, import_react.useState)(false);
	const [reviewFor, setReviewFor] = (0, import_react.useState)(null);
	const restored = !Boolean(search.brand || search.category || search.status || search.approval || search.stock || search.supplier) ? listStateCache : null;
	const [q, setQ] = (0, import_react.useState)(restored?.q ?? "");
	const [brand, setBrand] = (0, import_react.useState)(restored?.brand ?? search.brand ?? "");
	const [category, setCategory] = (0, import_react.useState)(restored?.category ?? search.category ?? "");
	const [status, setStatus] = (0, import_react.useState)(restored?.status ?? search.status ?? search.approval ?? "");
	const [stockFilter, setStockFilter] = (0, import_react.useState)(restored?.stockFilter ?? search.stock ?? "");
	const [supplierFilter, setSupplierFilter] = (0, import_react.useState)(restored?.supplierFilter ?? search.supplier ?? "");
	const [sort, setSort] = (0, import_react.useState)(restored?.sort ?? "");
	const [perPage, setPerPage] = (0, import_react.useState)(restored?.perPage ?? 20);
	const [page, setPage] = (0, import_react.useState)(restored?.page ?? 1);
	async function load() {
		setLoading(true);
		const { data } = await supabase.rpc("admin_catalog_page");
		const pl = data ?? {};
		setItems(pl.products ?? []);
		setBrands(pl.brands ?? []);
		setCategories(pl.categories ?? []);
		setSuppliers(pl.suppliers ?? []);
		catalogCache = {
			products: pl.products ?? [],
			brands: pl.brands ?? [],
			categories: pl.categories ?? [],
			suppliers: pl.suppliers ?? []
		};
		setLoading(false);
	}
	/** Re-fetch a single row (or drop it when deleted) — no full page reload. */
	async function refreshOne(id) {
		const { data } = await supabase.from("products").select(PRODUCT_COLS).eq("id", id).maybeSingle();
		setItems((s) => {
			if (!data) return s.filter((i) => i.id !== id);
			const row = data;
			return s.some((i) => i.id === id) ? s.map((i) => i.id === id ? {
				...i,
				...row
			} : i) : [row, ...s];
		});
	}
	const didLoad = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (didLoad.current) return;
		didLoad.current = true;
		if (!catalogCache) load();
		else if (search.refresh === "all") load();
		else if (search.refresh) refreshOne(search.refresh);
		if (search.refresh) nav({
			to: "/admin/products",
			search: {
				...search,
				refresh: void 0
			},
			replace: true
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (catalogCache) catalogCache.products = items;
	}, [items]);
	const firstFilterRun = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (firstFilterRun.current) {
			firstFilterRun.current = false;
			return;
		}
		setPage(1);
	}, [
		q,
		brand,
		category,
		status,
		stockFilter,
		supplierFilter,
		sort,
		perPage
	]);
	(0, import_react.useEffect)(() => {
		listStateCache = {
			q,
			brand,
			category,
			status,
			stockFilter,
			supplierFilter,
			sort,
			perPage,
			page
		};
	}, [
		q,
		brand,
		category,
		status,
		stockFilter,
		supplierFilter,
		sort,
		perPage,
		page
	]);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkBusy, setBulkBusy] = (0, import_react.useState)(false);
	async function toggle(p) {
		const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
		if (error) return toast.error(error.message);
		setItems((s) => s.map((i) => i.id === p.id ? {
			...i,
			is_active: !p.is_active
		} : i));
	}
	async function remove(p) {
		if (!await confirmAction({
			title: "Delete product",
			description: "This product will be permanently deleted.",
			detail: p.name,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("products").delete().eq("id", p.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		setItems((s) => s.filter((i) => i.id !== p.id));
		setSelected((s) => {
			const n = new Set(s);
			n.delete(p.id);
			return n;
		});
	}
	async function review(p, approve) {
		if (!await confirmAction({
			title: approve ? "Approve submission" : "Reject submission",
			description: approve ? "The information submitted by the supplier will go live." : "The submission will be rejected; live data will remain unchanged.",
			detail: p.name,
			confirmText: approve ? "Approve" : "Reject"
		})) return;
		try {
			await reviewProduct(p.id, approve);
			toast.success(approve ? "Approved" : "Rejected");
			await refreshOne(p.id);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	async function bulkSetActive(active) {
		const ids = Array.from(selected);
		if (!ids.length) return;
		setBulkBusy(true);
		const { error } = await supabase.from("products").update({ is_active: active }).in("id", ids);
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		setItems((s) => s.map((i) => ids.includes(i.id) ? {
			...i,
			is_active: active
		} : i));
		toast.success(`${ids.length} product ${active ? "activated" : "hidden"}`);
		setSelected(/* @__PURE__ */ new Set());
	}
	async function bulkDelete() {
		const ids = Array.from(selected);
		if (!ids.length) return;
		if (!await confirmAction({
			title: "Delete products",
			description: "Products used in orders are protected.",
			detail: `${ids.length} selected`,
			confirmText: "Delete"
		})) return;
		setBulkBusy(true);
		const { error } = await supabase.from("products").delete().in("id", ids);
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		setItems((s) => s.filter((i) => !ids.includes(i.id)));
		toast.success(`${ids.length} product deleted`);
		setSelected(/* @__PURE__ */ new Set());
	}
	/** Approve or reject every selected supplier submission in one go. */
	async function bulkReview(approve) {
		const ids = Array.from(selected);
		if (!ids.length) return;
		const targets = items.filter((i) => ids.includes(i.id) && ((i.approval_status ?? "approved") !== "approved" || i.pending_changes));
		if (!targets.length) return toast.error("No pending submission in the selection");
		if (!await confirmAction({
			title: approve ? "Approve submissions" : "Reject submissions",
			description: approve ? "The selected supplier submissions will go live." : "The selected submissions will be rejected; live data stays unchanged.",
			detail: `${targets.length} product${targets.length === 1 ? "" : "s"}`,
			confirmText: approve ? "Approve" : "Reject"
		})) return;
		setBulkBusy(true);
		let ok = 0;
		for (const t of targets) try {
			await reviewProduct(t.id, approve);
			ok += 1;
		} catch {}
		await Promise.all(targets.map((t) => refreshOne(t.id)));
		setBulkBusy(false);
		if (!ok) return toast.error("Failed");
		toast.success(`${ok} product ${approve ? "approved" : "rejected"}`);
		setSelected(/* @__PURE__ */ new Set());
	}
	/** Bulk price / stock / packaging setter (admin only). */
	async function bulkApplyValues(state) {
		const ids = Array.from(selected);
		const targets = items.filter((i) => ids.includes(i.id));
		if (!targets.length) return;
		setBulkBusy(true);
		const updated = {};
		let failed = 0;
		for (const t of targets) {
			const patch = computeBulkPatch(t, state);
			if (!Object.keys(patch).length) continue;
			const { error } = await supabase.from("products").update(patch).eq("id", t.id);
			if (error) failed += 1;
			else updated[t.id] = patch;
		}
		setBulkBusy(false);
		const okCount = Object.keys(updated).length;
		if (okCount) {
			setItems((s) => s.map((i) => updated[i.id] ? {
				...i,
				...updated[i.id]
			} : i));
			toast.success(`${okCount} product updated`);
		}
		if (failed) toast.error(`${failed} product could not be updated`);
	}
	const lowerFiltered = (0, import_react.useMemo)(() => {
		return items.filter((i) => {
			if (q) {
				const t = q.trim().toLowerCase();
				if (t && !i.name.toLowerCase().includes(t) && !i.product_code.toLowerCase().includes(t)) return false;
			}
			if (brand && i.brand_id !== brand) return false;
			if (category && i.category_id !== category) return false;
			if (stockFilter === "out" && i.stock > 0) return false;
			if (stockFilter === "low" && (i.stock === 0 || i.stock > 5)) return false;
			if (stockFilter === "in" && i.stock <= 0) return false;
			if (supplierFilter === "admin" && i.supplier_id) return false;
			if (supplierFilter && supplierFilter !== "admin" && i.supplier_id !== supplierFilter) return false;
			return true;
		});
	}, [
		items,
		q,
		brand,
		category,
		stockFilter,
		supplierFilter
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const list = lowerFiltered.filter((i) => {
			if (status === "active" && !i.is_active) return false;
			if (status === "hidden" && i.is_active) return false;
			if (status === "featured" && !i.is_featured) return false;
			if (status === "pending" && i.approval_status !== "pending") return false;
			if (status === "approved" && (i.approval_status ?? "approved") !== "approved") return false;
			if (status === "rejected" && i.approval_status !== "rejected") return false;
			return true;
		});
		if (sort === "oldest") list.sort((a, b) => String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
		return list;
	}, [
		lowerFiltered,
		status,
		sort
	]);
	const statusCounts = (0, import_react.useMemo)(() => ({
		all: lowerFiltered.length,
		active: lowerFiltered.filter((i) => i.is_active).length,
		hidden: lowerFiltered.filter((i) => !i.is_active).length,
		featured: lowerFiltered.filter((i) => i.is_featured).length,
		pending: lowerFiltered.filter((i) => i.approval_status === "pending").length,
		approved: lowerFiltered.filter((i) => (i.approval_status ?? "approved") === "approved").length,
		rejected: lowerFiltered.filter((i) => i.approval_status === "rejected").length
	}), [lowerFiltered]);
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
			key: "supplier",
			label: "Supplier",
			value: supplierFilter,
			onChange: setSupplierFilter,
			options: [{
				value: "admin",
				label: "Admin's own"
			}, ...suppliers.map((s) => ({
				value: s.id,
				label: s.display_name || s.name || s.code
			}))]
		},
		{
			key: "stock",
			label: "Stock",
			value: stockFilter,
			onChange: setStockFilter,
			options: [
				{
					value: "in",
					label: "In stock"
				},
				{
					value: "low",
					label: "Low (≤5)"
				},
				{
					value: "out",
					label: "Out of stock"
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
	const statusButtons = [
		[
			"",
			"All",
			statusCounts.all
		],
		[
			"active",
			"Active",
			statusCounts.active
		],
		[
			"hidden",
			"Hidden",
			statusCounts.hidden
		],
		[
			"featured",
			"Featured",
			statusCounts.featured
		],
		[
			"pending",
			"Pending",
			statusCounts.pending
		],
		[
			"approved",
			"Approved",
			statusCounts.approved
		],
		[
			"rejected",
			"Rejected",
			statusCounts.rejected
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: ["Products", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-primary",
					children: filtered.length
				})]
			}),
			description: "Master catalog resellers create listings from.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setInlineEdit((v) => !v),
						title: inlineEdit ? "Inline editing is ON — click to lock" : "Inline editing is locked — click to enable",
						className: `inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${inlineEdit ? "border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-400" : "hover:bg-muted"}`,
						children: [inlineEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), inlineEdit ? "Inline edit: ON" : "Inline edit: OFF"]
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setImportOpen(true),
						className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-4 w-4" }), " Import from URL"]
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/products/new",
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New product"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImportModal, {
			open: importOpen,
			onClose: () => setImportOpen(false),
			onSaved: () => load()
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex overflow-x-auto rounded-md border bg-muted/30 p-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-max items-center gap-1 pr-2",
				children: statusButtons.map(([value, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStatus(value),
					className: `inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-semibold transition-colors ${status === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-background hover:text-foreground"}`,
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: status === value ? "opacity-90" : "text-foreground/70",
						children: [
							"(",
							count,
							")"
						]
					})]
				}, `status-${value || "all"}`))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			inline: true,
			search: q,
			onSearch: setQ,
			searchPlaceholder: "Search by name or ID…",
			filters,
			perPage,
			onPerPage: setPerPage
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No products match",
			description: "Try changing filters or add a new product.",
			action: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/products/new",
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add product"]
			}) : void 0
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-primary/5 px-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [selected.size, " selected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex flex-wrap gap-2",
						children: [
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: bulkBusy,
								onClick: () => bulkSetActive(true),
								className: "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-background disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Activate"]
							}),
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: bulkBusy,
								onClick: () => bulkSetActive(false),
								className: "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-background disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }), " Hide"]
							}),
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: bulkBusy,
								onClick: () => bulkReview(true),
								className: "inline-flex items-center gap-1 rounded-md border border-emerald-500/50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Approve"]
							}),
							canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: bulkBusy,
								onClick: () => bulkReview(false),
								className: "inline-flex items-center gap-1 rounded-md border border-amber-500/50 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-500/10 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Reject"]
							}),
							canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: bulkBusy,
								onClick: bulkDelete,
								className: "inline-flex items-center gap-1 rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelected(/* @__PURE__ */ new Set()),
								className: "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
								children: "Clear"
							})
						]
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkValuePanel, {
						count: selected.size,
						busy: bulkBusy,
						onApply: bulkApplyValues
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-left text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-8 px-2 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										const pageIds = paged.map((p) => p.id);
										const allChecked = pageIds.every((id) => selected.has(id));
										setSelected((s) => {
											const n = new Set(s);
											if (allChecked) pageIds.forEach((id) => n.delete(id));
											else pageIds.forEach((id) => n.add(id));
											return n;
										});
									},
									className: "text-muted-foreground hover:text-primary",
									"aria-label": "Select all on page",
									children: paged.length > 0 && paged.every((p) => selected.has(p.id)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "min-w-[240px] px-3 py-3 text-left",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Supplier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Admin cost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Reseller"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Suggested"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Packaging"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Weight"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `hover:bg-muted/50 ${selected.has(p.id) ? "bg-primary/5" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSelected((s) => {
											const n = new Set(s);
											if (n.has(p.id)) n.delete(p.id);
											else n.add(p.id);
											return n;
										}),
										className: "text-muted-foreground hover:text-primary",
										"aria-label": "Select",
										children: selected.has(p.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "min-w-[240px] px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
											onClick: () => setDetailId(p.id),
											children: p.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.og_image_url,
												className: "h-full w-full object-cover",
												alt: ""
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors",
												onClick: () => setDetailId(p.id),
												title: p.name,
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-medium",
														children: ["ID #", p.product_code]
													}),
													p.brand_id && brands.find((b) => b.id === p.brand_id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center rounded bg-muted px-1.5 py-0.5",
														children: brands.find((b) => b.id === p.brand_id).name
													}),
													p.category_id && categories.find((c) => c.id === p.category_id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center rounded bg-muted px-1.5 py-0.5",
														children: categories.find((c) => c.id === p.category_id).name
													})
												]
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierCell, {
											row: p,
											suppliers
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										field: "buying_price",
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											buying_price: v
										} : i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										field: "reseller_price",
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											reseller_price: v
										} : i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										field: "suggested_price",
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											suggested_price: v
										} : i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										field: "packaging_cost",
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											packaging_cost: v
										} : i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											stock: v
										} : i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3 text-center tabular-nums text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightCell, {
										locked: !inlineEdit || !canManage,
										row: p,
										onSaved: (v) => setItems((s) => s.map((i) => i.id === p.id ? {
											...i,
											weight_grams: v
										} : i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 whitespace-nowrap text-[10px] leading-tight text-muted-foreground",
										title: "Applicable delivery charge",
										children: deliveryLabel(p, settings.delivery)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-muted-foreground"}` }), p.is_active ? "Active" : "Hidden"]
											}),
											(p.approval_status ?? "approved") !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " + (APPROVAL_TONE[p.approval_status] ?? "bg-muted"),
												children: p.approval_status
											}),
											canManage && p.pending_changes && Object.keys(p.pending_changes).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setReviewFor(p),
												className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 hover:bg-amber-500/25 dark:text-amber-400",
												children: [
													Object.keys(p.pending_changes).length,
													" change",
													Object.keys(p.pending_changes).length === 1 ? "" : "s",
													" to review"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionMenu, {
												vertical: true,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onSelect: () => setDetailId(p.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View Details"]
													}),
													canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onSelect: () => nav({
															to: "/admin/products/$id/edit",
															params: { id: p.id }
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit"]
													}),
													canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onSelect: () => nav({
															to: "/admin/products/new",
															search: { from: p.id }
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), " Duplicate"]
													}),
													canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onSelect: () => setAssignFor(p),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mr-2 h-4 w-4" }),
															" ",
															p.supplier_id ? "Change / remove supplier" : "Assign supplier"
														]
													}),
													canManage && ((p.approval_status ?? "approved") !== "approved" || p.pending_changes) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
															onSelect: () => setReviewFor(p),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " Review changes"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
															onSelect: () => review(p, true),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), " Approve submission"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
															onSelect: () => review(p, false),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-4 w-4" }), " Reject submission"]
														})
													] }),
													canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onSelect: () => toggle(p),
														children: p.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "mr-2 h-4 w-4" }), " Hide"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " Show"] })
													}),
													canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														className: "text-destructive focus:text-destructive",
														onSelect: () => remove(p),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete"]
													})] })
												]
											})
										]
									})
								})
							]
						}, p.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
				page,
				perPage,
				total: filtered.length,
				onPage: setPage
			})
		] }),
		assignFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignSupplierModal, {
			row: assignFor,
			suppliers,
			onClose: () => setAssignFor(null),
			onSaved: () => {
				const id = assignFor.id;
				setAssignFor(null);
				refreshOne(id);
			}
		}),
		reviewFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingChangesModal, {
			productId: reviewFor.id,
			productName: reviewFor.name,
			pendingChanges: reviewFor.pending_changes,
			brands,
			categories,
			onClose: () => setReviewFor(null),
			onReviewed: () => {
				const id = reviewFor.id;
				setReviewFor(null);
				refreshOne(id);
			}
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
	const { settings } = useAdvancedSettings();
	const [p, setP] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [images, setImages] = (0, import_react.useState)([]);
	const [activeUrl, setActiveUrl] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function load() {
			setLoading(true);
			const { data } = await supabase.from("products").select("*, product_images(url)").eq("id", id).single();
			if (data) {
				setP(data);
				setImages(data.product_images || []);
				setActiveUrl(data.og_image_url ?? data.product_images?.[0]?.url ?? null);
			}
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
	const imageUrls = [p.og_image_url, ...images.map((i) => i.url)].filter(Boolean);
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDownloadTools, {
									compact: true,
									images: imageUrls,
									activeUrl,
									baseName: p.name
								})
							})]
						}), imageUrls.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-2 pt-1 max-w-full no-scrollbar sm:flex-wrap",
							children: imageUrls.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActiveUrl(url),
								className: `h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition ${url === activeUrl ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-primary/40 opacity-80 hover:opacity-100"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: url,
									className: "h-full w-full object-cover",
									alt: ""
								})
							}, url + i))
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-md bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground",
										children: ["ID #", p.product_code]
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
										children: "Buying Price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold",
										children: ["৳", p.buying_price]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Reseller Price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-base sm:text-lg font-bold",
										children: ["৳", p.reseller_price]
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
										children: "Stock Available"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-base sm:text-lg font-bold ${p.stock <= 5 ? "text-destructive" : ""}`,
										children: [p.stock, " units"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Weight"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-base sm:text-lg font-bold",
										children: p.weight_grams ? `${(p.weight_grams / 1e3).toFixed(2)} kg` : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Delivery Charge"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-semibold",
										children: deliveryLabel(p, settings.delivery)
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
function StockCell({ row, onSaved, locked }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [val, setVal] = (0, import_react.useState)(String(row.stock));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (editing) inputRef.current?.select();
	}, [editing]);
	async function save() {
		const n = Math.max(0, Math.floor(Number(val)));
		if (Number.isNaN(n)) return toast.error("Invalid stock");
		if (n === row.stock) return setEditing(false);
		setBusy(true);
		const { error } = await supabase.from("products").update({ stock: n }).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		onSaved(n);
		setEditing(false);
		toast.success("Stock updated");
	}
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `px-2 py-0.5 text-xs ${row.stock === 0 ? "text-destructive" : row.stock <= 5 ? "text-warning" : ""}`,
		title: "Turn on Inline edit to change stock",
		children: row.stock
	});
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => {
			setVal(String(row.stock));
			setEditing(true);
		},
		className: `rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary ${row.stock === 0 ? "text-destructive" : row.stock <= 5 ? "text-warning" : ""}`,
		title: "Click to edit stock",
		children: row.stock
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "number",
				min: 0,
				value: val,
				onChange: (e) => setVal(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") save();
					if (e.key === "Escape") setEditing(false);
				},
				className: "w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				disabled: busy,
				className: "rounded-md p-1 text-primary hover:bg-primary/10",
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setEditing(false),
				className: "rounded-md p-1 text-muted-foreground hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})
		]
	});
}
function WeightCell({ row, onSaved, locked }) {
	const current = row.weight_grams ?? 0;
	const currentKg = current / 1e3;
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [val, setVal] = (0, import_react.useState)(String(currentKg));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (editing) inputRef.current?.select();
	}, [editing]);
	async function save() {
		const kg = Number(val);
		if (Number.isNaN(kg) || kg < 0) return toast.error("Invalid weight");
		const n = Math.round(kg * 1e3);
		if (n === current) return setEditing(false);
		setBusy(true);
		const { error } = await supabase.from("products").update({ weight_grams: n }).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		onSaved(n);
		setEditing(false);
		toast.success("Weight updated");
	}
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap px-2 py-0.5 text-xs",
		title: "Turn on Inline edit to change weight",
		children: current ? `${currentKg} kg` : "—"
	});
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => {
			setVal(String(currentKg));
			setEditing(true);
		},
		className: "whitespace-nowrap rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary",
		title: "Click to edit weight (kg)",
		children: current ? `${currentKg} kg` : "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "number",
				min: 0,
				step: .1,
				value: val,
				onChange: (e) => setVal(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") save();
					if (e.key === "Escape") setEditing(false);
				},
				className: "w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				disabled: busy,
				className: "rounded-md p-1 text-primary hover:bg-primary/10",
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setEditing(false),
				className: "rounded-md p-1 text-muted-foreground hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})
		]
	});
}
function PriceCell({ row, field, onSaved, locked }) {
	const current = row[field] ?? 0;
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [val, setVal] = (0, import_react.useState)(String(current));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (editing) inputRef.current?.select();
	}, [editing]);
	async function save() {
		const n = Math.max(0, Number(val));
		if (Number.isNaN(n)) return toast.error("Invalid price");
		if (n === current) return setEditing(false);
		setBusy(true);
		const payload = {};
		payload[field] = n;
		const { error } = await supabase.from("products").update(payload).eq("id", row.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		onSaved(n);
		setEditing(false);
		toast.success(field === "packaging_cost" ? "Packaging cost updated" : "Price updated");
	}
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2 py-0.5 text-xs",
		title: "Turn on Inline edit to change price",
		children: ["৳", current]
	});
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => {
			setVal(String(current));
			setEditing(true);
		},
		className: "rounded-md border border-dashed px-2 py-0.5 text-xs hover:border-primary hover:text-primary",
		title: "Click to edit price",
		children: ["৳", current]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "number",
				min: 0,
				step: "any",
				value: val,
				onChange: (e) => setVal(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") save();
					if (e.key === "Escape") setEditing(false);
				},
				className: "w-20 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				disabled: busy,
				className: "rounded-md p-1 text-primary hover:bg-primary/10",
				children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setEditing(false),
				className: "rounded-md p-1 text-muted-foreground hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})
		]
	});
}
function SupplierCell({ row, suppliers }) {
	const s = row.supplier_id ? suppliers.find((x) => x.id === row.supplier_id) : null;
	if (!row.supplier_id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "Admin's own"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-medium",
			children: s?.display_name || s?.name || "Supplier"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-[10px] text-muted-foreground",
			children: ["৳", row.supplier_price ?? row.buying_price]
		})]
	});
}
function AssignSupplierModal({ row, suppliers, onClose, onSaved }) {
	const [value, setValue] = (0, import_react.useState)(row.supplier_id ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await setProductSupplier(row.id, value || null);
			toast.success(value ? "Supplier assigned" : "Supplier removed");
			onSaved();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppModal, {
		open: true,
		onClose,
		size: "sm",
		title: "Product supplier",
		subtitle: row.name,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: save,
				disabled: busy,
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save"]
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mb-1 block text-xs font-medium",
				children: "Supplier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value,
				onChange: (e) => setValue(e.target.value),
				className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "— Admin's own product —"
				}), suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: s.id,
					children: [
						s.display_name || s.name,
						" (",
						s.code,
						")",
						s.status !== "active" ? " · " + s.status : ""
					]
				}, s.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-muted-foreground",
				children: "If you select a supplier, the admin cost will be treated as their due amount. Removing it will make the product the admin's own."
			})
		]
	});
}
//#endregion
export { ProductsPage as component };
