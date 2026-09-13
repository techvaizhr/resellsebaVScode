import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, Qn as ChevronRight, r as X, st as Pencil, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { n as confirmAction } from "./confirm-CRVKAosm.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-YXxreIiP.js";
import { t as ImageUploader } from "./ImageUploader-Mujg2ole.js";
//#region src/routes/_authenticated/admin/categories.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function CatsPage() {
	const canManage = useCan()("categories.manage");
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [name, setName] = (0, import_react.useState)("");
	const [parent, setParent] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [expanded, setExpanded] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [search, setSearch] = (0, import_react.useState)("");
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [editImage, setEditImage] = (0, import_react.useState)([]);
	const [newImage, setNewImage] = (0, import_react.useState)([]);
	async function openEdit(c) {
		const { data, error } = await supabase.from("categories").select("id,name,slug,parent_id,description,image_url,sort_order,meta_title,meta_description").eq("id", c.id).maybeSingle();
		if (error || !data) return toast.error(error?.message ?? "Category not found");
		setEdit(data);
		setEditImage(data.image_url ? [{ url: data.image_url }] : []);
	}
	async function saveEdit(e) {
		e.preventDefault();
		if (!edit) return;
		setBusy(true);
		const { error } = await supabase.from("categories").update({
			name: edit.name,
			slug: slugify(edit.slug || edit.name),
			parent_id: edit.parent_id || null,
			description: edit.description || null,
			image_url: editImage[0]?.url ?? null,
			sort_order: Number(edit.sort_order ?? 0),
			meta_title: edit.meta_title || null,
			meta_description: edit.meta_description || null
		}).eq("id", edit.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Category updated");
		setEdit(null);
		load();
	}
	async function load() {
		setLoading(true);
		const { data } = await supabase.from("categories").select("id,name,slug,is_active,parent_id,image_url").order("name");
		setItems(data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		if (items.length === 0) load();
	}, []);
	async function create(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.from("categories").insert({
			name,
			slug: slugify(name),
			parent_id: parent || null,
			image_url: newImage[0]?.url ?? null
		});
		setBusy(false);
		if (error) toast.error(error.message);
		else {
			toast.success("Category added");
			setName("");
			setParent("");
			setNewImage([]);
			if (parent) setExpanded((s) => new Set(s).add(parent));
			load();
		}
	}
	async function toggle(c) {
		const { error } = await supabase.from("categories").update({ is_active: !c.is_active }).eq("id", c.id);
		if (error) toast.error(error.message);
		else load();
	}
	async function remove(c) {
		if (!await confirmAction({
			title: "Delete category",
			description: "This category will be permanently deleted.",
			detail: c.name,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("categories").delete().eq("id", c.id);
		if (error) toast.error(error.message);
		else load();
	}
	const { parents, childrenByParent } = (0, import_react.useMemo)(() => {
		const parents = items.filter((i) => !i.parent_id);
		const map = /* @__PURE__ */ new Map();
		for (const c of items) if (c.parent_id) {
			const arr = map.get(c.parent_id) ?? [];
			arr.push(c);
			map.set(c.parent_id, arr);
		}
		return {
			parents,
			childrenByParent: map
		};
	}, [items]);
	function toggleExpand(id) {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Categories",
			description: "Nested categories supported — pick a parent to create a subcategory."
		}),
		canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: create,
			className: "surface-card mb-6 flex flex-wrap items-end gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Parent (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: parent,
						onChange: (e) => setParent(e.target.value),
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— Top level —"
						}), parents.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: i.id,
							children: i.name
						}, i.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[160px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Image"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
						bucket: "branding",
						folder: "categories",
						value: newImage,
						onChange: setNewImage,
						square: true,
						label: "Add",
						hint: ""
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add"]
				})
			]
		}),
		!loading && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search categories…",
				className: "w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
			})
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "No categories yet" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-card divide-y",
			children: (() => {
				const q = search.trim().toLowerCase();
				const match = (c) => !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
				return (q ? parents.filter((p) => match(p) || (childrenByParent.get(p.id) ?? []).some(match)) : parents).map((p) => {
					const allKids = childrenByParent.get(p.id) ?? [];
					const kids = q && !match(p) ? allKids.filter(match) : allKids;
					const isOpen = q ? true : expanded.has(p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRow, {
						cat: p,
						canManage,
						onEdit: () => openEdit(p),
						onToggleActive: () => toggle(p),
						onDelete: () => remove(p),
						onToggleExpand: kids.length ? () => toggleExpand(p.id) : void 0,
						expanded: isOpen,
						childCount: kids.length
					}), isOpen && kids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y border-t bg-muted/30",
						children: kids.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRow, {
							cat: c,
							indent: true,
							canManage,
							onEdit: () => openEdit(c),
							onToggleActive: () => toggle(c),
							onDelete: () => remove(c)
						}, c.id))
					})] }, p.id);
				});
			})()
		}),
		canManage && edit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
			onClick: () => setEdit(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: saveEdit,
				onClick: (e) => e.stopPropagation(),
				className: "max-h-[90vh] w-full max-w-lg space-y-3 modal-scroll rounded-xl border bg-card p-5 shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold",
							children: "Edit category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEdit(null),
							className: "rounded-md p-1 hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: edit.name,
									onChange: (e) => setEdit({
										...edit,
										name: e.target.value
									}),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Slug",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: edit.slug,
									onChange: (e) => setEdit({
										...edit,
										slug: e.target.value
									}),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Parent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: edit.parent_id ?? "",
									onChange: (e) => setEdit({
										...edit,
										parent_id: e.target.value || null
									}),
									className: inp,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "— Top level —"
									}), parents.filter((p) => p.id !== edit.id).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Sort order",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: edit.sort_order ?? 0,
									onChange: (e) => setEdit({
										...edit,
										sort_order: Number(e.target.value)
									}),
									className: inp
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: edit.description ?? "",
							onChange: (e) => setEdit({
								...edit,
								description: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Meta title (SEO)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: edit.meta_title ?? "",
							onChange: (e) => setEdit({
								...edit,
								meta_title: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Meta description (SEO)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: edit.meta_description ?? "",
							onChange: (e) => setEdit({
								...edit,
								meta_description: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
							bucket: "branding",
							folder: "categories",
							value: editImage,
							onChange: setEditImage,
							square: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEdit(null),
							className: "rounded-md border px-4 py-2 text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save changes"]
						})]
					})
				]
			})
		})
	] });
}
function CategoryRow({ cat, indent, onToggleActive, onDelete, onEdit, onToggleExpand, expanded, childCount, canManage }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-3 p-4 ${indent ? "pl-12" : ""}`,
		children: [
			onToggleExpand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onToggleExpand,
				className: "rounded-md p-1 text-muted-foreground hover:bg-muted",
				title: expanded ? "Collapse" : "Expand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}` })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted",
				children: cat.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: cat.image_url,
					className: "h-full w-full object-cover",
					alt: ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-medium",
					children: [cat.name, childCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground",
						children: childCount
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: ["/", cat.slug]
				})]
			}),
			canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onToggleActive,
				title: cat.is_active ? "Click to hide" : "Click to activate",
				className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${cat.is_active ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90" : "border border-border bg-muted text-muted-foreground hover:bg-muted/70"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cat.is_active ? "bg-primary-foreground" : "bg-muted-foreground/60"}` }), cat.is_active ? "Active" : "Hidden"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cat.is_active ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-muted text-muted-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cat.is_active ? "bg-primary-foreground" : "bg-muted-foreground/60"}` }), cat.is_active ? "Active" : "Hidden"]
			}),
			canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onEdit,
				title: "Edit category",
				className: "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
			}),
			canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDelete,
				className: "rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})
		]
	});
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
//#endregion
export { CatsPage as component };
