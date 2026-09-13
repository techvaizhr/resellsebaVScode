import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { In as CloudDownload, Ln as Clock, Nt as LoaderCircle, bn as Eye, ht as PackageSearch, jn as Copy, qn as CircleCheck, st as Pencil, tt as Plus } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { r as DropdownMenuItem } from "./dropdown-menu-B_of1R8h.js";
import { i as usePaginated, n as DataToolbar, r as Pagination, t as ActionMenu } from "./data-list-D-TkvXUz.js";
import { t as ImageUploader } from "./ImageUploader-Mujg2ole.js";
import { t as AppModal } from "./AppModal-BVNHKlfq.js";
import { t as RichTextEditor } from "./RichTextEditor-CVwPBmAU.js";
import { t as Hint } from "./Hint-B9ZUmBLG.js";
import { a as importProductFromUrl, i as fetchImportImage, t as importImagesToStorage } from "./product-import-CuDRR9CO.js";
import { d as saveSupplierProduct, m as supplierQuickUpdate, n as bdtNum, o as loadSupplierProducts, t as APPROVAL_TONE } from "./supplier-o9xJNQxa.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/components/product-form-modal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var emptyProductForm = {
	name: "",
	sku: "",
	description: "",
	brand_id: "",
	category_id: "",
	price: "",
	stock: "0",
	weight: "",
	meta_title: "",
	meta_description: "",
	keywords: "",
	images: []
};
var inputCls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function ProductFormModal({ role, title, subtitle, submitLabel, imageFolder, brands, categories, initial, notice, onClose, onSubmit }) {
	const [v, setV] = (0, import_react.useState)({
		...emptyProductForm,
		...initial
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const set = (key, value) => setV((p) => ({
		...p,
		[key]: value
	}));
	async function submit(e) {
		e.preventDefault();
		if (!v.name.trim()) return toast.error("Please enter a product name");
		if (!(Number(v.price) > 0)) return toast.error(role === "supplier" ? "Please enter a supplier price" : "Please enter a price");
		setBusy(true);
		try {
			await onSubmit({
				...v,
				name: v.name.trim()
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		open: true,
		onClose,
		size: "xl",
		title,
		subtitle,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				form: "product-form",
				disabled: busy,
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
				children: [
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
					" ",
					submitLabel
				]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			id: "product-form",
			onSubmit: submit,
			className: "space-y-4",
			children: [
				notice,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-sm font-semibold",
						children: "Basics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Product name",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										value: v.name,
										onChange: (e) => set("name", e.target.value),
										className: inputCls
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "SKU (optional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: v.sku,
										onChange: (e) => set("sku", e.target.value),
										className: inputCls,
										placeholder: "Auto if empty"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Brand",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
										options: brands.map((b) => ({
											value: b.id,
											label: b.name
										})),
										value: v.brand_id,
										onChange: (id) => set("brand_id", id),
										placeholder: "— None —",
										searchPlaceholder: "Search brand…"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Category",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
										options: categories.map((c) => ({
											value: c.id,
											label: c.name
										})),
										value: v.category_id,
										onChange: (id) => set("category_id", id),
										placeholder: "— None —",
										searchPlaceholder: "Search category…"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditor, {
									value: v.description,
									onChange: (html) => set("description", html),
									uploadFolder: `${imageFolder}/descriptions`
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "Images"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
						bucket: "product-images",
						folder: imageFolder,
						value: v.images,
						onChange: (imgs) => set("images", imgs),
						multiple: true,
						square: true,
						maxImages: 8,
						variant: "square",
						label: "Add image"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mb-3 flex items-center gap-1.5 text-sm font-semibold",
						children: ["Pricing & stock", role === "supplier" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hint, {
							side: "right",
							children: [
								"The amount you receive per unit is the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Supplier price" }),
								". Customer price, delivery, and packaging will be set by the admin."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: role === "supplier" ? "Supplier price (৳)" : "Buying price (৳)",
								required: true,
								hint: role === "supplier" ? "Your earning per delivered unit." : void 0,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "number",
									min: 0,
									value: v.price,
									onChange: (e) => set("price", e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Stock",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: v.stock,
									onChange: (e) => set("stock", e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Weight (kg)",
								hint: "Used for courier booking weight. You can enter decimals, e.g. 0.5 for 500 g.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									step: .1,
									value: v.weight,
									onChange: (e) => set("weight", e.target.value),
									className: inputCls,
									placeholder: "e.g. 0.5"
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "SEO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Meta title (≤ 60 chars)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									maxLength: 60,
									value: v.meta_title,
									onChange: (e) => set("meta_title", e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Meta description (≤ 160 chars)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									maxLength: 160,
									rows: 2,
									value: v.meta_description,
									onChange: (e) => set("meta_description", e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Keywords (comma separated)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: v.keywords,
									onChange: (e) => set("keywords", e.target.value),
									className: inputCls
								})
							})
						]
					})]
				})
			]
		})
	});
}
function Field({ label, children, required, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-1 flex items-center gap-1 text-xs font-medium",
		children: [
			label,
			" ",
			required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				children: "*"
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hint, { children: hint })
		]
	}), children] });
}
//#endregion
//#region src/routes/_authenticated/supplier/products.tsx?tsr-split=component
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function SupplierProductsPage_() {
	const { data: boot } = useSupplier();
	const supplierId = boot.supplier?.id ?? "";
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [live, setLive] = (0, import_react.useState)("");
	const [stock, setStock] = (0, import_react.useState)("");
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [page, setPage] = (0, import_react.useState)(1);
	const [editing, setEditing] = (0, import_react.useState)(void 0);
	const [prefill, setPrefill] = (0, import_react.useState)(null);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		try {
			setData(await loadSupplierProducts());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [
		q,
		status,
		brand,
		category,
		live,
		stock,
		perPage
	]);
	const products = data?.products ?? [];
	const brands = data?.brands ?? [];
	const categories = data?.categories ?? [];
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return products.filter((p) => {
			if (status && p.approval_status !== status) return false;
			if (brand && p.brand_id !== brand) return false;
			if (category && p.category_id !== category) return false;
			if (live === "active" && !p.is_active) return false;
			if (live === "hidden" && p.is_active) return false;
			if (stock === "in" && Number(p.stock) <= 0) return false;
			if (stock === "low" && Number(p.stock) > 0 && Number(p.stock) < 5) return false;
			if (stock === "out" && Number(p.stock) > 0) return false;
			if (!needle) return true;
			return p.name.toLowerCase().includes(needle) || String(p.product_code).includes(needle);
		});
	}, [
		products,
		q,
		status,
		brand,
		category,
		live,
		stock
	]);
	const paged = usePaginated(rows, page, perPage);
	const stats = (0, import_react.useMemo)(() => ({
		total: products.length,
		pending: products.filter((p) => p.approval_status === "pending" || p.pending_changes).length,
		live: products.filter((p) => p.approval_status === "approved" && p.is_active).length
	}), [products]);
	const filters = [
		{
			key: "approval",
			label: "Approval",
			value: status,
			onChange: setStatus,
			options: [
				{
					value: "pending",
					label: "Pending"
				},
				{
					value: "approved",
					label: "Approved"
				},
				{
					value: "rejected",
					label: "Rejected"
				}
			]
		},
		{
			key: "live",
			label: "Visibility",
			value: live,
			onChange: setLive,
			options: [{
				value: "active",
				label: "Live"
			}, {
				value: "hidden",
				label: "Hidden"
			}]
		},
		{
			key: "stock",
			label: "Stock",
			value: stock,
			onChange: setStock,
			options: [
				{
					value: "in",
					label: "In stock"
				},
				{
					value: "low",
					label: "Low (<5)"
				},
				{
					value: "out",
					label: "Out of stock"
				}
			]
		},
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
		}
	];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: ["Products", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-primary/15 px-2.5 py-0.5 text-sm font-semibold text-primary",
					children: rows.length
				})]
			}),
			description: "Products you have submitted — they go live once approved by admin.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setImportOpen(true),
					className: "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-4 w-4" }), " Import from URL"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setPrefill(null);
						setEditing(null);
					},
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New product"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Products",
					value: stats.total,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Waiting approval",
					value: stats.pending,
					tone: "amber",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Live",
					value: stats.live,
					tone: "emerald",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			search: q,
			onSearch: setQ,
			searchPlaceholder: "Search by name or ID…",
			filters,
			perPage,
			onPerPage: setPerPage
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No products match",
			description: "Change filters or add a new product — once approved by admin, resellers will be able to sell it.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setPrefill(null);
					setEditing(null);
				},
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add product"]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted text-left text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "min-w-[240px] px-3 py-3 text-left",
							children: "Product"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-center",
							children: "Supply price"
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-center",
							children: "Submitted"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: paged.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "min-w-[240px] px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary/50",
										onClick: () => setDetail(p),
										children: p.og_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.og_image_url,
											className: "h-full w-full object-cover",
											alt: ""
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "cursor-pointer font-medium leading-snug line-clamp-2 transition-colors hover:text-primary",
											onClick: () => setDetail(p),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3 text-center tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineNumber, {
									value: Number(p.supplier_price),
									prefix: "৳",
									onSave: async (val) => {
										const res = await supplierQuickUpdate(p.id, { price: val });
										toast.success(res.price_pending ? "Price change sent for admin approval" : "Price updated — awaiting approval");
										await load();
									}
								}), typeof p.pending_changes?.supplier_price !== "undefined" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[10px] text-amber-600",
									children: ["Pending ৳", Number(p.pending_changes.supplier_price)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-center tabular-nums",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineNumber, {
									value: Number(p.stock),
									onSave: async (val) => {
										await supplierQuickUpdate(p.id, { stock: val });
										toast.success("Stock updated");
										await load();
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-center tabular-nums text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineNumber, {
									value: Number(p.weight_grams ?? 0) / 1e3,
									suffix: " kg",
									onSave: async (val) => {
										await supplierQuickUpdate(p.id, { weight: Math.round(val * 1e3) });
										toast.success("Weight updated");
										await load();
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-muted-foreground"}` }), p.is_active ? "Live" : "Hidden"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " + (APPROVAL_TONE[p.approval_status] ?? "bg-muted"),
											children: p.approval_status
										}),
										p.pending_changes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-amber-600",
											children: "Edit waiting"
										}),
										p.approval_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: p.approval_note
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionMenu, {
											vertical: true,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => setDetail(p),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " View details"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => {
														setPrefill(null);
														setEditing(p);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit (needs approval)"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => {
														setPrefill(duplicatePrefill(p));
														setEditing(null);
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), " Duplicate"]
												})
											]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap px-3 py-3 text-xs text-muted-foreground",
								children: new Date(p.created_at).toLocaleDateString()
							})
						]
					}, p.id))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: rows.length,
			onPage: setPage
		})] }),
		detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierProductDetail, {
			product: detail,
			brands,
			categories,
			onClose: () => setDetail(null),
			onEdit: () => {
				setPrefill(null);
				setEditing(detail);
				setDetail(null);
			}
		}),
		importOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
			supplierId,
			onClose: () => setImportOpen(false),
			onReady: (data) => {
				setImportOpen(false);
				setPrefill(data);
				setEditing(null);
			}
		}),
		editing !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
			product: editing,
			prefill,
			supplierId,
			brands,
			categories,
			onClose: () => {
				setEditing(void 0);
				setPrefill(null);
			},
			onSaved: () => {
				setEditing(void 0);
				setPrefill(null);
				load();
			}
		})
	] });
}
/** Read-only product detail — same layout language as the admin product detail modal, without platform pricing. */
function SupplierProductDetail({ product, brands, categories, onClose, onEdit }) {
	const images = (product.pending_changes ?? {}).images ?? product.images ?? [];
	const brandName = brands.find((b) => b.id === product.brand_id)?.name ?? "—";
	const categoryName = categories.find((c) => c.id === product.category_id)?.name ?? "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		open: true,
		onClose,
		title: product.name,
		subtitle: `ID #${product.product_code}`,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
				children: "Close"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onEdit,
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Edit (needs approval)"]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: images.map((im, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: im.url,
						alt: "",
						className: "h-20 w-20 rounded-md border object-cover"
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Supply price",
							value: bdtNum(Number(product.supplier_price))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Stock",
							value: String(product.stock)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Visibility",
							value: product.is_active ? "Live" : "Hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Brand",
							value: brandName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Category",
							value: categoryName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailField, {
							label: "Approval",
							value: product.approval_status
						})
					]
				}),
				product.pending_changes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-700",
					children: "An edit is pending admin approval."
				}),
				product.approval_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border px-3 py-2 text-xs text-muted-foreground",
					children: product.approval_note
				}),
				product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose prose-sm max-w-none text-sm text-muted-foreground",
					dangerouslySetInnerHTML: { __html: product.description }
				})
			]
		})
	});
}
/** Click-to-edit number cell — saves on blur/Enter, reverts on Escape. */
function InlineNumber({ value, prefix, suffix, onSave }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(String(value));
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!editing) setDraft(String(value));
	}, [value, editing]);
	async function commit() {
		setEditing(false);
		const next = Number(draft);
		if (!Number.isFinite(next) || next < 0 || next === value) {
			setDraft(String(value));
			return;
		}
		setBusy(true);
		try {
			await onSave(next);
		} catch (e) {
			setDraft(String(value));
			toast.error(e instanceof Error ? e.message : "Update failed");
		} finally {
			setBusy(false);
		}
	}
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled: busy,
		onClick: () => setEditing(true),
		className: "inline-flex items-center gap-1 whitespace-nowrap rounded border border-transparent px-1.5 py-0.5 text-sm hover:border-border hover:bg-muted disabled:opacity-50",
		children: [
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
			prefix,
			value,
			suffix,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3 shrink-0 text-muted-foreground" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		autoFocus: true,
		type: "number",
		min: 0,
		value: draft,
		onChange: (e) => setDraft(e.target.value),
		onBlur: () => void commit(),
		onKeyDown: (e) => {
			if (e.key === "Enter") commit();
			if (e.key === "Escape") {
				setDraft(String(value));
				setEditing(false);
			}
		},
		className: "w-24 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
	});
}
function DetailField({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-muted/30 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 truncate text-sm font-medium capitalize",
			children: value
		})]
	});
}
/** Copy every field of a product into a new-product draft — SKU is left blank. */
function duplicatePrefill(p) {
	return {
		name: p.name,
		sku: "",
		description: p.description ?? "",
		images: (p.images ?? []).map((i) => ({
			url: i.url,
			path: i.path ?? "",
			bytes: i.bytes ?? 0
		})),
		brand_id: p.brand_id ?? "",
		category_id: p.category_id ?? "",
		price: String(p.supplier_price ?? ""),
		stock: String(p.stock ?? 0),
		weight: p.weight_grams == null ? "" : String(p.weight_grams / 1e3),
		meta_title: p.meta_title ?? "",
		meta_description: p.meta_description ?? "",
		keywords: p.keywords ?? ""
	};
}
function ImportModal({ supplierId, onClose, onReady }) {
	const runImport = useServerFn(importProductFromUrl);
	const pullImage = useServerFn(fetchImportImage);
	const [url, setUrl] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [step, setStep] = (0, import_react.useState)("");
	async function go(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		try {
			setStep("Reading link…");
			const data = await runImport({ data: { url: url.trim() } });
			setStep("Downloading images…");
			const images = await importImagesToStorage(data.images, pullImage, 6, (d, t) => setStep(`Image ${d}/${t}…`), `suppliers/${supplierId}`);
			onReady({
				name: data.name ?? "",
				sku: data.sku ?? "",
				description: data.description ?? data.shortDescription ?? "",
				images
			});
			toast.success("Data ready — submit with your supply price.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Import failed");
		} finally {
			setBusy(false);
			setStep("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		open: true,
		onClose,
		title: "Import product from link",
		subtitle: "Enter any product page link — name, description and images will be fetched automatically.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				form: "supplier-import-form",
				disabled: busy || !url.trim(),
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "h-4 w-4" }), " Fetch"]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			id: "supplier-import-form",
			onSubmit: go,
			className: "space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: url,
				onChange: (e) => setUrl(e.target.value),
				placeholder: "https://…",
				className: inp,
				autoFocus: true
			}), step && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: step
			})]
		})
	});
}
function ProductForm({ product, prefill, supplierId, brands, categories, onClose, onSaved }) {
	const draft = product?.pending_changes ?? {};
	const v = (key, fallback) => draft[key] ?? fallback;
	const initial = {
		name: prefill?.name || v("name", product?.name ?? ""),
		sku: prefill?.sku || (v("sku", product?.sku ?? "") ?? ""),
		description: prefill?.description || (v("description", product?.description ?? "") ?? ""),
		brand_id: prefill?.brand_id ?? v("brand_id", product?.brand_id ?? "") ?? "",
		category_id: prefill?.category_id ?? v("category_id", product?.category_id ?? "") ?? "",
		price: prefill?.price ?? String(v("supplier_price", product?.supplier_price ?? "")),
		stock: prefill?.stock ?? String(v("stock", product?.stock ?? 0)),
		weight: prefill?.weight ?? (() => {
			const w = v("weight_grams", product?.weight_grams ?? null);
			return w == null ? "" : String(w / 1e3);
		})(),
		meta_title: prefill?.meta_title ?? v("meta_title", product?.meta_title ?? "") ?? "",
		meta_description: prefill?.meta_description ?? v("meta_description", product?.meta_description ?? "") ?? "",
		keywords: prefill?.keywords ?? v("keywords", product?.keywords ?? "") ?? "",
		images: (prefill?.images ?? draft.images ?? product?.images ?? []).map((i) => ({
			url: i.url,
			path: i.path ?? "",
			bytes: i.bytes ?? 0
		}))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductFormModal, {
		role: "supplier",
		title: product ? "Edit product" : "New product",
		subtitle: "Changes go live only after admin approval.",
		submitLabel: "Submit for approval",
		imageFolder: `products/suppliers/${supplierId}`,
		brands,
		categories,
		initial,
		onClose,
		onSubmit: async (values) => {
			await saveSupplierProduct(product?.id ?? null, {
				name: values.name,
				sku: values.sku || null,
				description: values.description || null,
				brand_id: values.brand_id || null,
				category_id: values.category_id || null,
				supplier_price: Number(values.price),
				stock: Number(values.stock) || 0,
				weight_grams: values.weight === "" ? null : Math.round(Number(values.weight) * 1e3) || 0,
				meta_title: values.meta_title || null,
				meta_description: values.meta_description || null,
				keywords: values.keywords || null,
				images: values.images.map((i) => ({ url: i.url }))
			});
			toast.success(product ? "Edit submitted — awaiting admin approval" : "Product submitted — awaiting approval");
			onSaved();
		}
	});
}
//#endregion
export { SupplierProductsPage_ as component };
