import { r as supabase } from "./client-BpJCBCUq.js";
import { n as confirmAction } from "./confirm-CI5WE9B0.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { r as useCan } from "./use-auth-BPiZPMVq.js";
import { t as ImageUploader } from "./ImageUploader-Ba09wYF1.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
//#region src/routes/_authenticated/admin/brands.tsx?tsr-split=component
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function BrandsPage() {
	const canManage = useCan()("brands.manage");
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [logo, setLogo] = useState([]);
	const [busy, setBusy] = useState(false);
	const [search, setSearch] = useState("");
	const [edit, setEdit] = useState(null);
	const [editLogo, setEditLogo] = useState([]);
	async function openEdit(b) {
		const { data, error } = await supabase.from("brands").select("id,name,slug,description,logo_url,sort_order,meta_title,meta_description").eq("id", b.id).maybeSingle();
		if (error || !data) return toast.error(error?.message ?? "Brand not found");
		setEdit(data);
		setEditLogo(data.logo_url ? [{ url: data.logo_url }] : []);
	}
	async function saveEdit(e) {
		e.preventDefault();
		if (!edit) return;
		setBusy(true);
		const { error } = await supabase.from("brands").update({
			name: edit.name,
			slug: slugify(edit.slug || edit.name),
			description: edit.description || null,
			logo_url: editLogo[0]?.url ?? null,
			sort_order: Number(edit.sort_order ?? 0),
			meta_title: edit.meta_title || null,
			meta_description: edit.meta_description || null
		}).eq("id", edit.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Brand updated");
		setEdit(null);
		load();
	}
	async function load() {
		setLoading(true);
		const { data } = await supabase.from("brands").select("id,name,slug,is_active,logo_url,sort_order").order("sort_order").order("name");
		setItems(data ?? []);
		setLoading(false);
	}
	useEffect(() => {
		if (items.length === 0) load();
	}, []);
	async function create(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { error } = await supabase.from("brands").insert({
				name,
				slug: slugify(name),
				description: description || null,
				logo_url: logo[0]?.url ?? null
			});
			if (error) throw error;
			toast.success("Brand added");
			setName("");
			setDescription("");
			setLogo([]);
			setOpen(false);
			load();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function toggle(b) {
		await supabase.from("brands").update({ is_active: !b.is_active }).eq("id", b.id);
		load();
	}
	async function remove(b) {
		if (!await confirmAction({
			title: "Delete brand",
			description: "This brand will be permanently deleted.",
			detail: b.name,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("brands").delete().eq("id", b.id);
		if (error) toast.error(error.message);
		else load();
	}
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Brands",
			description: "Organize products under brands.",
			actions: canManage ? /* @__PURE__ */ jsxs("button", {
				onClick: () => setOpen((o) => !o),
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New brand"]
			}) : void 0
		}),
		canManage && open && /* @__PURE__ */ jsxs("form", {
			onSubmit: create,
			className: "surface-card mb-6 space-y-3 p-6",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Name"
				}), /* @__PURE__ */ jsx("input", {
					required: true,
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Description"
				}), /* @__PURE__ */ jsx("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 2,
					className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Logo"
				}), /* @__PURE__ */ jsx(ImageUploader, {
					bucket: "branding",
					folder: "brands",
					value: logo,
					onChange: setLogo,
					square: true
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save"]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setOpen(false),
						className: "rounded-md border px-4 py-2 text-sm",
						children: "Cancel"
					})]
				})
			]
		}),
		!loading && items.length > 0 && /* @__PURE__ */ jsx("div", {
			className: "mb-3",
			children: /* @__PURE__ */ jsx("input", {
				value: search,
				onChange: (e) => setSearch(e.target.value),
				placeholder: "Search brands…",
				className: "w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
			})
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : items.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			title: "No brands yet",
			description: "Add a brand to start organizing products."
		}) : /* @__PURE__ */ jsx("div", {
			className: "surface-card divide-y",
			children: items.filter((b) => {
				const q = search.trim().toLowerCase();
				if (!q) return true;
				return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
			}).map((b) => /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4 p-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "h-10 w-10 overflow-hidden rounded-md border bg-muted",
						children: b.logo_url && /* @__PURE__ */ jsx("img", {
							src: b.logo_url,
							className: "h-full w-full object-cover",
							alt: ""
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("div", {
							className: "truncate font-medium",
							children: b.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "truncate text-xs text-muted-foreground",
							children: ["/", b.slug]
						})]
					}),
					canManage ? /* @__PURE__ */ jsxs("button", {
						onClick: () => toggle(b),
						title: b.is_active ? "Click to hide" : "Click to activate",
						className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${b.is_active ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90" : "border border-border bg-muted text-muted-foreground hover:bg-muted/70"}`,
						children: [/* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${b.is_active ? "bg-primary-foreground" : "bg-muted-foreground/60"}` }), b.is_active ? "Active" : "Hidden"]
					}) : /* @__PURE__ */ jsxs("span", {
						className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${b.is_active ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-muted text-muted-foreground"}`,
						children: [/* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${b.is_active ? "bg-primary-foreground" : "bg-muted-foreground/60"}` }), b.is_active ? "Active" : "Hidden"]
					}),
					canManage && /* @__PURE__ */ jsx("button", {
						onClick: () => openEdit(b),
						title: "Edit brand",
						className: "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
						children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
					}),
					canManage && /* @__PURE__ */ jsx("button", {
						onClick: () => remove(b),
						className: "rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
						children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
					})
				]
			}, b.id))
		}),
		canManage && edit && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
			onClick: () => setEdit(null),
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: saveEdit,
				onClick: (e) => e.stopPropagation(),
				className: "max-h-[90vh] w-full max-w-lg space-y-3 modal-scroll rounded-xl border bg-card p-5 shadow-xl",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold",
							children: "Edit brand"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEdit(null),
							className: "rounded-md p-1 hover:bg-muted",
							children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Name",
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								value: edit.name,
								onChange: (e) => setEdit({
									...edit,
									name: e.target.value
								}),
								className: inp
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: "Slug",
							children: /* @__PURE__ */ jsx("input", {
								value: edit.slug,
								onChange: (e) => setEdit({
									...edit,
									slug: e.target.value
								}),
								className: inp
							})
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Description",
						children: /* @__PURE__ */ jsx("textarea", {
							rows: 2,
							value: edit.description ?? "",
							onChange: (e) => setEdit({
								...edit,
								description: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: "Meta title (SEO)",
							children: /* @__PURE__ */ jsx("input", {
								value: edit.meta_title ?? "",
								onChange: (e) => setEdit({
									...edit,
									meta_title: e.target.value
								}),
								className: inp
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: "Sort order",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								value: edit.sort_order ?? 0,
								onChange: (e) => setEdit({
									...edit,
									sort_order: Number(e.target.value)
								}),
								className: inp
							})
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Meta description (SEO)",
						children: /* @__PURE__ */ jsx("textarea", {
							rows: 2,
							value: edit.meta_description ?? "",
							onChange: (e) => setEdit({
								...edit,
								meta_description: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Logo",
						children: /* @__PURE__ */ jsx(ImageUploader, {
							bucket: "branding",
							folder: "brands",
							value: editLogo,
							onChange: setEditLogo,
							square: true
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEdit(null),
							className: "rounded-md border px-4 py-2 text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
							children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save changes"]
						})]
					})
				]
			})
		})
	] });
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
//#endregion
export { BrandsPage as component };
