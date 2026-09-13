import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CiD-puKw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { $n as ChevronDown, G as Save, H as Search, Ht as Layers, Jn as ChevronsRight, Mt as LoaderCircle, Yn as ChevronsLeft, Zn as ChevronRight, Zt as House, et as Plus, on as GripVertical, pt as Package, v as Trash2, zt as Link2 } from "./vendor-icons-BEaCFqaT.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
import { r as getMyReseller } from "./app-data-CF0v-2hN.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BphzVqAU.js";
import { t as ImageUploader } from "./ImageUploader-Dp36oC2k.js";
import { t as clearBootstrapCache } from "./bootstrap-jHyL9xCR.js";
import { a as moveMenuItem, c as shiftMenuItem, l as subtreeSize, n as fetchMenuRows, o as newMenuItem, r as flattenMenu, s as saveMenuRows, t as buildMenuTree } from "./store-menu-Cthes4xG.js";
//#region src/routes/_authenticated/reseller/menus.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var DEPTH_LABEL = [
	"Main menu",
	"Sub menu",
	"Child menu"
];
function MenusPage() {
	const { user } = useAuth();
	const uid = user?.id;
	const [rid, setRid] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("categories");
	const [q, setQ] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)({});
	const [customLabel, setCustomLabel] = (0, import_react.useState)("");
	const [customUrl, setCustomUrl] = (0, import_react.useState)("");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [dragIndex, setDragIndex] = (0, import_react.useState)(null);
	const [overIndex, setOverIndex] = (0, import_react.useState)(null);
	const [removeId, setRemoveId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!uid) return;
		let alive = true;
		(async () => {
			const r = await getMyReseller(uid);
			if (!alive) return;
			if (!r) return setLoading(false);
			setRid(r.id);
			setCode(r.code);
			const [menu, cats, listings] = await Promise.all([
				fetchMenuRows(r.id, false),
				supabase.from("categories").select("id,name,slug,image_url,sort_order").eq("is_active", true).order("sort_order"),
				supabase.from("reseller_listings").select("id, custom_title, product:products(name,slug,is_active)").eq("reseller_id", r.id).eq("is_active", true)
			]);
			if (!alive) return;
			setItems(flattenMenu(buildMenuTree(menu)));
			setCategories((cats.data ?? []).map((c) => ({
				key: `cat:${c.slug}`,
				label: c.name,
				kind: "category",
				ref_slug: c.slug,
				image_url: c.image_url
			})));
			setProducts((listings.data ?? []).filter((l) => l.product?.is_active).map((l) => ({
				key: `prod:${l.product.slug}`,
				label: l.custom_title || l.product.name,
				kind: "product",
				ref_slug: l.product.slug
			})));
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [uid]);
	const source = tab === "categories" ? categories : tab === "products" ? products : [];
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return source;
		return source.filter((s) => s.label.toLowerCase().includes(needle));
	}, [source, q]);
	function update(next) {
		setItems(next);
		setDirty(true);
	}
	function patch(id, values) {
		update(items.map((it) => it.id === id ? {
			...it,
			...values
		} : it));
	}
	function addItems(list) {
		if (!list.length) return;
		update([...items, ...list.map((s) => newMenuItem({
			label: s.label,
			kind: s.kind,
			ref_slug: s.ref_slug ?? null,
			image_url: s.image_url ?? null
		}))]);
		setPicked({});
		toast.success(`${list.length} item menu te add hoyeche`);
	}
	function removeItem(id) {
		const index = items.findIndex((it) => it.id === id);
		if (index < 0) return;
		const size = subtreeSize(items, index);
		update([...items.slice(0, index), ...items.slice(index + size)]);
	}
	async function save() {
		if (!rid) return;
		setBusy(true);
		try {
			await saveMenuRows(rid, items);
			const fresh = await fetchMenuRows(rid, false);
			setItems(flattenMenu(buildMenuTree(fresh)));
			setDirty(false);
			clearBootstrapCache("store:");
			toast.success("Menu save hoyeche");
		} catch (e) {
			toast.error(e.message || "Menu save fail");
		} finally {
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[50vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (!rid) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-card p-8 text-center text-sm text-muted-foreground",
		children: "Store profile not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Header menu builder",
			description: "Drag kore menu sajao, sub-menu / child-menu banao ar mega menu on koro — store header ei onujai dekhabe.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `/s/${code}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
					children: "Preview store"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: save,
					disabled: busy || !dirty,
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Save menu"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card h-fit p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Add menu items"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-1 rounded-lg bg-muted p-1 text-xs font-medium",
						children: [
							{
								id: "categories",
								label: "Categories",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" })
							},
							{
								id: "products",
								label: "Products",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" })
							},
							{
								id: "custom",
								label: "Custom",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3.5 w-3.5" })
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setTab(t.id);
								setPicked({});
							},
							className: cn("flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 transition", tab === t.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"),
							children: [
								t.icon,
								" ",
								t.label
							]
						}, t.id))
					}),
					tab === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-muted-foreground",
								children: "Menu name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inp,
								value: customLabel,
								onChange: (e) => setCustomLabel(e.target.value),
								placeholder: "Offer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-muted-foreground",
								children: "Link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: inp,
								value: customUrl,
								onChange: (e) => setCustomUrl(e.target.value),
								placeholder: "https://… or /s/code/checkout"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (!customLabel.trim()) return toast.error("Menu name din");
									update([...items, newMenuItem({
										label: customLabel.trim(),
										kind: "custom",
										url: customUrl.trim() || null
									})]);
									setCustomLabel("");
									setCustomUrl("");
								},
								className: "inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add custom link"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-medium text-muted-foreground",
									children: "Quick links"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => addItems([{
											key: "home",
											label: "Home",
											kind: "home"
										}]),
										className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3.5 w-3.5" }), " Home"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => addItems([{
											key: "all",
											label: "All products",
											kind: "all_products"
										}]),
										className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), " All products"]
									})]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: cn(inp, "pl-9"),
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 max-h-[360px] space-y-1 overflow-y-auto pr-1",
							children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-6 text-center text-xs text-muted-foreground",
								children: "Kichu pawa jayni"
							}), filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-sm hover:bg-muted/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: !!picked[s.key],
										onChange: (e) => setPicked((p) => ({
											...p,
											[s.key]: e.target.checked
										})),
										className: "h-4 w-4 accent-[hsl(var(--primary))]"
									}),
									s.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.image_url,
										alt: "",
										className: "h-7 w-7 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										children: s.label
									})
								]
							}, s.key))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => addItems(filtered.filter((s) => picked[s.key])),
							disabled: !filtered.some((s) => picked[s.key]),
							className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add to menu"]
						})
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Active header menu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Drag kore order & nesting change koro. Arrow diyeo sub/child banate paro (max ",
							3,
							" level)."
						]
					})] }), dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-600",
						children: "Unsaved"
					})]
				}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground",
					children: "Ekhono kono menu nai — bam pash theke item add koro. Menu khali thakle store e category list auto dekhabe."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5",
					children: [items.map((item, index) => {
						const open = openId === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: { marginLeft: item.depth * 26 },
							onDragOver: (e) => {
								e.preventDefault();
								setOverIndex(index);
							},
							onDrop: (e) => {
								e.preventDefault();
								if (dragIndex != null && dragIndex !== index) update(moveMenuItem(items, dragIndex, index));
								setDragIndex(null);
								setOverIndex(null);
							},
							className: cn("rounded-lg border bg-background transition", overIndex === index && dragIndex != null && "border-primary ring-2 ring-primary/30", dragIndex === index && "opacity-50", !item.is_active && "opacity-60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-2 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										draggable: true,
										onDragStart: () => setDragIndex(index),
										onDragEnd: () => {
											setDragIndex(null);
											setOverIndex(null);
										},
										className: "cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing",
										title: "Drag",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
									}),
									item.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.image_url,
										alt: "",
										className: "h-7 w-7 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setOpenId(open ? null : item.id),
										className: "flex min-w-0 flex-1 items-center gap-2 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-sm font-medium",
												children: item.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
												children: DEPTH_LABEL[item.depth]
											}),
											item.depth === 0 && item.layout === "mega" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary",
												children: "Mega"
											}),
											open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "ml-auto h-4 w-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto h-4 w-4 shrink-0" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => update(shiftMenuItem(items, index, -1)),
										disabled: item.depth === 0,
										title: "Outdent",
										className: "rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => update(shiftMenuItem(items, index, 1)),
										disabled: index === 0 || item.depth > (items[index - 1]?.depth ?? 0) || item.depth >= 2,
										title: "Indent (sub menu)",
										className: "rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRemoveId(item.id),
										title: "Remove",
										className: "rounded p-1 text-destructive hover:bg-destructive/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 border-t px-3 py-3 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium text-muted-foreground",
										children: "Menu name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inp,
										value: item.label,
										onChange: (e) => patch(item.id, { label: e.target.value })
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium text-muted-foreground",
										children: item.kind === "custom" ? "Link URL" : "Target"
									}), item.kind === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: inp,
										value: item.url ?? "",
										onChange: (e) => patch(item.id, { url: e.target.value }),
										placeholder: "https://…"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: cn(inp, "bg-muted/50 text-muted-foreground"),
										readOnly: true,
										value: item.kind === "category" ? `Category: ${item.ref_slug}` : item.kind === "product" ? `Product: ${item.ref_slug}` : item.kind === "home" ? "Store home" : "All products"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium text-muted-foreground",
											children: "Short description (mega menu te dekhabe)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: inp,
											value: item.description ?? "",
											onChange: (e) => patch(item.id, { description: e.target.value })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium text-muted-foreground",
											children: "Menu image"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
											bucket: "stores",
											folder: `stores/${rid}/menu`,
											value: item.image_url ? [{
												path: "",
												url: item.image_url,
												bytes: 0
											}] : [],
											onChange: (v) => patch(item.id, { image_url: v[0]?.url ?? null }),
											label: "Upload menu image",
											variant: "square",
											maxImages: 1,
											hint: "Mega menu te thumbnail hisebe dekhabe"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-4 md:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "inline-flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: item.is_active,
													onChange: (e) => patch(item.id, { is_active: e.target.checked }),
													className: "h-4 w-4"
												}), "Active"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "inline-flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: item.open_new_tab,
													onChange: (e) => patch(item.id, { open_new_tab: e.target.checked }),
													className: "h-4 w-4"
												}), "New tab"]
											}),
											item.depth === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "inline-flex items-center gap-2 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: item.layout === "mega",
													onChange: (e) => patch(item.id, { layout: e.target.checked ? "mega" : "dropdown" }),
													className: "h-4 w-4"
												}), "Mega menu"]
											})
										]
									})
								]
							})]
						}, item.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						onDragOver: (e) => {
							e.preventDefault();
							setOverIndex(items.length);
						},
						onDrop: (e) => {
							e.preventDefault();
							if (dragIndex != null) update(moveMenuItem(items, dragIndex, items.length));
							setDragIndex(null);
							setOverIndex(null);
						},
						className: cn("rounded-lg border border-dashed py-3 text-center text-xs text-muted-foreground", overIndex === items.length && dragIndex != null && "border-primary text-primary"),
						children: "Drop here to move to the end"
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: removeId != null,
			title: "Menu item remove?",
			description: "Ei item ar er niche thaka sob sub-menu remove hoye jabe.",
			confirmText: "Remove",
			variant: "danger",
			onClose: () => setRemoveId(null),
			onConfirm: () => {
				if (removeId) removeItem(removeId);
				setRemoveId(null);
			}
		})
	] });
}
//#endregion
export { MenusPage as component };
