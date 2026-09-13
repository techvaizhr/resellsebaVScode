import { r as supabase } from "./client-CdRSQB5v.js";
import { n as confirmAction } from "./confirm-CI5WE9B0.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { r as AdminNoticePopup, t as NOTICE_LEVELS } from "./admin-notices-CMK6fpT7.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Eye, Loader2, Pencil, Plus, Power, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/admin/notices.tsx?tsr-split=component
var EMPTY = {
	title: "",
	body: "",
	level: "info",
	is_active: true,
	is_dismissible: true,
	starts_at: "",
	ends_at: "",
	cta_label: "",
	cta_url: "",
	image_url: "",
	target_reseller_ids: []
};
var inp = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function toLocalInput(v) {
	if (!v) return "";
	const d = new Date(v);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function AdminNoticesPage() {
	const [rows, setRows] = useState([]);
	const [resellers, setResellers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [draft, setDraft] = useState(null);
	const [saving, setSaving] = useState(false);
	const [preview, setPreview] = useState(null);
	useEffect(() => {
		load();
	}, []);
	async function load() {
		setLoading(true);
		const [n, r] = await Promise.all([supabase.from("admin_notices").select("*").order("created_at", { ascending: false }), supabase.from("resellers").select("id,business_name,code").order("business_name")]);
		setRows(n.data ?? []);
		setResellers(r.data ?? []);
		setLoading(false);
	}
	async function save() {
		if (!draft) return;
		if (!draft.title.trim()) return toast.error("Title dorkar");
		setSaving(true);
		const payload = {
			title: draft.title.trim(),
			body: draft.body,
			level: draft.level,
			is_active: draft.is_active,
			is_dismissible: draft.is_dismissible,
			starts_at: draft.starts_at ? new Date(draft.starts_at).toISOString() : null,
			ends_at: draft.ends_at ? new Date(draft.ends_at).toISOString() : null,
			cta_label: draft.cta_label.trim() || null,
			cta_url: draft.cta_url.trim() || null,
			image_url: draft.image_url.trim() || null,
			target_reseller_ids: draft.target_reseller_ids
		};
		const { error } = draft.id ? await supabase.from("admin_notices").update(payload).eq("id", draft.id) : await supabase.from("admin_notices").insert(payload);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success(draft.id ? "Notice updated" : "Notice published");
		setDraft(null);
		load();
	}
	async function toggle(n) {
		const { error } = await supabase.from("admin_notices").update({ is_active: !n.is_active }).eq("id", n.id);
		if (error) return toast.error(error.message);
		load();
	}
	async function remove(n) {
		if (!await confirmAction({
			title: "Delete notice?",
			description: `"${n.title}" will disappear from every reseller dashboard.`,
			confirmText: "Delete",
			variant: "danger"
		})) return;
		const { error } = await supabase.from("admin_notices").delete().eq("id", n.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		load();
	}
	const liveCount = useMemo(() => rows.filter((r) => r.is_active).length, [rows]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Admin notices",
			description: "Publish a popup that greets resellers on their dashboard.",
			actions: /* @__PURE__ */ jsxs("button", {
				onClick: () => setDraft({ ...EMPTY }),
				className: "btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-elegant transition hover:opacity-90 active:scale-95",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New notice"]
			})
		}),
		loading ? /* @__PURE__ */ jsx("div", {
			className: "grid place-items-center py-16",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			title: "No notices yet",
			description: "Create your first notice — resellers will see it as a popup on their dashboard."
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", {
			className: "mb-3 text-xs text-muted-foreground",
			children: [
				liveCount,
				" live of ",
				rows.length,
				" total"
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: rows.map((n) => {
				return /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-start gap-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-1 flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary",
											children: NOTICE_LEVELS.find((l) => l.value === n.level)?.label ?? n.level
										}),
										/* @__PURE__ */ jsx("span", {
											className: `rounded-full px-2 py-0.5 text-[11px] font-bold ${n.is_active ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`,
											children: n.is_active ? "Live" : "Off"
										}),
										n.target_reseller_ids?.length ? /* @__PURE__ */ jsxs("span", {
											className: "rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground",
											children: [n.target_reseller_ids.length, " reseller targeted"]
										}) : /* @__PURE__ */ jsx("span", {
											className: "rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground",
											children: "All resellers"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "truncate font-bold",
									children: n.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-2 text-[11px] text-muted-foreground/80",
									children: [n.starts_at ? `From ${new Date(n.starts_at).toLocaleString()}` : "From now", n.ends_at ? ` · until ${new Date(n.ends_at).toLocaleString()}` : " · no end date"]
								})
							]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setPreview(n),
								className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" }), " Preview"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setDraft({
									id: n.id,
									title: n.title,
									body: n.body ?? "",
									level: n.level,
									is_active: n.is_active,
									is_dismissible: n.is_dismissible,
									starts_at: toLocalInput(n.starts_at),
									ends_at: toLocalInput(n.ends_at),
									cta_label: n.cta_label ?? "",
									cta_url: n.cta_url ?? "",
									image_url: n.image_url ?? "",
									target_reseller_ids: n.target_reseller_ids ?? []
								}),
								className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }), " Edit"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => toggle(n),
								className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
								children: [
									/* @__PURE__ */ jsx(Power, { className: "h-3.5 w-3.5" }),
									" ",
									n.is_active ? "Turn off" : "Turn on"
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => remove(n),
								className: "inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
							})
						]
					})]
				}, n.id);
			})
		})] }),
		draft && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-[80] grid place-items-center bg-background/70 p-4 backdrop-blur-sm",
			onClick: () => setDraft(null),
			children: /* @__PURE__ */ jsxs("div", {
				onClick: (e) => e.stopPropagation(),
				className: "max-h-[90vh] w-full max-w-xl modal-scroll rounded-2xl border bg-card p-6 shadow-elegant",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-4 text-lg font-extrabold",
						children: draft.id ? "Edit notice" : "New notice"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-semibold",
								children: "Title"
							}), /* @__PURE__ */ jsx("input", {
								className: inp,
								value: draft.title,
								onChange: (e) => setDraft({
									...draft,
									title: e.target.value
								})
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-semibold",
								children: "Message"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 5,
								className: inp,
								value: draft.body,
								onChange: (e) => setDraft({
									...draft,
									body: e.target.value
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Type"
									}), /* @__PURE__ */ jsx("select", {
										className: inp,
										value: draft.level,
										onChange: (e) => setDraft({
											...draft,
											level: e.target.value
										}),
										children: NOTICE_LEVELS.map((l) => /* @__PURE__ */ jsx("option", {
											value: l.value,
											children: l.label
										}, l.value))
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Image URL (optional)"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										value: draft.image_url,
										onChange: (e) => setDraft({
											...draft,
											image_url: e.target.value
										})
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Button label"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										value: draft.cta_label,
										onChange: (e) => setDraft({
											...draft,
											cta_label: e.target.value
										})
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Button link"
									}), /* @__PURE__ */ jsx("input", {
										className: inp,
										placeholder: "/reseller/catalog",
										value: draft.cta_url,
										onChange: (e) => setDraft({
											...draft,
											cta_url: e.target.value
										})
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Show from"
									}), /* @__PURE__ */ jsx("input", {
										type: "datetime-local",
										className: inp,
										value: draft.starts_at,
										onChange: (e) => setDraft({
											...draft,
											starts_at: e.target.value
										})
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold",
										children: "Show until"
									}), /* @__PURE__ */ jsx("input", {
										type: "datetime-local",
										className: inp,
										value: draft.ends_at,
										onChange: (e) => setDraft({
											...draft,
											ends_at: e.target.value
										})
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-semibold",
								children: "Target resellers (none selected = everyone)"
							}), /* @__PURE__ */ jsx("div", {
								className: "max-h-40 space-y-1 overflow-y-auto rounded-lg border p-2",
								children: resellers.map((r) => {
									const on = draft.target_reseller_ids.includes(r.id);
									return /* @__PURE__ */ jsxs("label", {
										className: "flex items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-muted",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: on,
											onChange: () => setDraft({
												...draft,
												target_reseller_ids: on ? draft.target_reseller_ids.filter((id) => id !== r.id) : [...draft.target_reseller_ids, r.id]
											})
										}), /* @__PURE__ */ jsxs("span", {
											className: "truncate",
											children: [
												r.business_name,
												" ",
												/* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground",
													children: ["/", r.code]
												})
											]
										})]
									}, r.id);
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-4 text-sm",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: draft.is_active,
										onChange: (e) => setDraft({
											...draft,
											is_active: e.target.checked
										})
									}), "Live now"]
								}), /* @__PURE__ */ jsxs("label", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: draft.is_dismissible,
										onChange: (e) => setDraft({
											...draft,
											is_dismissible: e.target.checked
										})
									}), "Reseller can mark as read"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setDraft(null),
							className: "rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: save,
							disabled: saving,
							className: "btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold disabled:opacity-60",
							children: [
								saving && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
								" ",
								draft.id ? "Save" : "Publish"
							]
						})]
					})
				]
			})
		}),
		preview && /* @__PURE__ */ jsx(AdminNoticePopup, {
			notices: [preview],
			onDismiss: () => setPreview(null)
		})
	] });
}
//#endregion
export { AdminNoticesPage as component };
