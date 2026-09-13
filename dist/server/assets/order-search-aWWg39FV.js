import { r as supabase } from "./client-BpJCBCUq.js";
import { d as orderTabClasses, f as orderTabGroup, n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { n as useAuth } from "./use-auth-BPiZPMVq.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, ChevronDown, ExternalLink, Loader2, MessageSquarePlus, Pencil, Search, ShoppingCart, StickyNote, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
//#region src/components/order-items-strip.tsx
/** Light-background supplier badge — only rendered for supplier-sourced items. */
function SupplierBadge({ name }) {
	if (!name) return null;
	return /* @__PURE__ */ jsx("span", {
		className: "inline-flex max-w-[110px] items-center truncate rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
		children: name
	});
}
function ImageLightbox({ src, onClose }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in",
		onClick: onClose,
		children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "absolute right-4 top-4 rounded-full bg-background/90 p-2 text-foreground shadow-lg transition-transform hover:scale-105",
			"aria-label": "Close",
			children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
		}), /* @__PURE__ */ jsx("img", {
			src,
			alt: "",
			onClick: (e) => e.stopPropagation(),
			className: "max-h-[85vh] max-w-full rounded-xl border border-white/10 object-contain shadow-2xl animate-in zoom-in-95"
		})]
	});
}
/**
* Compact product cell used inside an order list row.
* Always renders exactly ONE product so the table row height stays stable.
* The "+N more" chip toggles the row collapse (same action as the row chevron),
* and the full item list is rendered inside that collapse via `OrderItemsList`.
*/
function OrderProductCell({ items, expanded, onZoom, onToggle }) {
	const hidden = Math.max(items.length - 1, 0);
	if (items.length === 0) return /* @__PURE__ */ jsx("span", {
		className: "text-[10px] text-muted-foreground/60 italic",
		children: "No items"
	});
	const it = items[0];
	const unit = Number(it.unit_price ?? 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-w-0 py-1",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 items-center gap-2",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => it.image && onZoom(it.image),
				className: "h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-background transition-transform hover:scale-105",
				title: it.image ? "Click to zoom" : void 0,
				children: it.image ? /* @__PURE__ */ jsx("img", {
					src: it.image,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ jsx("span", {
					className: "flex h-full w-full items-center justify-center",
					children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-muted-foreground/40" })
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [
					it.slug ? /* @__PURE__ */ jsxs("a", {
						href: `/catalog/${it.slug}`,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-foreground hover:text-primary hover:underline",
						children: [/* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: it.product_name
						}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 shrink-0 opacity-60" })]
					}) : /* @__PURE__ */ jsx("span", {
						className: "block truncate text-xs font-semibold",
						children: it.product_name
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 text-[10px] text-muted-foreground tabular-nums",
						children: [
							"x",
							it.quantity,
							" ",
							unit > 0 && /* @__PURE__ */ jsxs("span", {
								className: "ml-1",
								children: ["৳", unit.toFixed(0)]
							})
						]
					}),
					it.supplier_name && /* @__PURE__ */ jsx("span", {
						className: "mt-0.5 block",
						children: /* @__PURE__ */ jsx(SupplierBadge, { name: it.supplier_name })
					})
				]
			})]
		}), hidden > 0 && /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: onToggle,
			className: "mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/20",
			children: [/* @__PURE__ */ jsx(ChevronDown, { className: `h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}` }), expanded ? "Hide items" : `+${hidden} more`]
		})]
	});
}
/** Full item list rendered inside an expanded order row. */
function OrderItemsList({ items, onZoom, className = "" }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [/* @__PURE__ */ jsxs("h4", {
			className: "mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground",
			children: [
				"Products (",
				items.length,
				")"
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "divide-y divide-dashed rounded-xl border bg-background",
			children: items.map((it, idx) => {
				const unit = Number(it.unit_price ?? 0);
				const total = Number(it.line_total ?? unit * it.quantity);
				return /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 px-3 py-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => it.image && onZoom(it.image),
							className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-background transition-transform hover:scale-105",
							title: it.image ? "Click to zoom" : void 0,
							children: it.image ? /* @__PURE__ */ jsx("img", {
								src: it.image,
								alt: "",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ jsx("span", {
								className: "flex h-full w-full items-center justify-center",
								children: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-4 w-4 text-muted-foreground/40" })
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								it.slug ? /* @__PURE__ */ jsxs("a", {
									href: `/catalog/${it.slug}`,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-foreground hover:text-primary hover:underline",
									children: [/* @__PURE__ */ jsx("span", {
										className: "truncate",
										children: it.product_name
									}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 shrink-0 opacity-60" })]
								}) : /* @__PURE__ */ jsx("span", {
									className: "block truncate text-xs font-semibold",
									children: it.product_name
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 text-[10px] text-muted-foreground tabular-nums",
									children: [
										"x",
										it.quantity,
										" ",
										unit > 0 && /* @__PURE__ */ jsxs("span", {
											className: "ml-1",
											children: ["৳", unit.toFixed(0)]
										})
									]
								}),
								it.supplier_name && /* @__PURE__ */ jsx("span", {
									className: "mt-0.5 block",
									children: /* @__PURE__ */ jsx(SupplierBadge, { name: it.supplier_name })
								})
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "shrink-0 text-xs font-bold tabular-nums",
							children: ["৳", total.toFixed(0)]
						})
					]
				}, it.id ?? idx);
			})
		})]
	});
}
function countWords(text) {
	const t = text.trim();
	return t ? t.split(/\s+/).length : 0;
}
/** Trim input down to the word limit so users simply cannot type more. */
function clampWords(text) {
	const parts = text.split(/(\s+)/);
	let words = 0;
	let out = "";
	for (const p of parts) {
		if (/^\s+$/.test(p)) {
			out += p;
			continue;
		}
		if (p === "") continue;
		if (words >= 20) return out.replace(/\s+$/, "");
		words++;
		out += p;
	}
	return out;
}
function roleBadge(role) {
	if (role === "reseller") return "bg-primary/10 text-primary";
	if (role === "admin" || role === "super_admin") return "bg-emerald-500/10 text-emerald-600";
	if (role === "supplier") return "bg-amber-500/10 text-amber-600";
	return "bg-muted text-muted-foreground";
}
function roleLabel(role) {
	if (role === "reseller") return "Reseller";
	if (role === "super_admin" || role === "admin") return "Admin";
	if (role === "supplier") return "Supplier";
	return "Staff";
}
function OrderNotes({ orderId, canWrite, authorRole, authorName, lockedHint, title = "Order notes" }) {
	const { user } = useAuth();
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [draft, setDraft] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editDraft, setEditDraft] = useState("");
	const [orderNotes, setOrderNotes] = useState([]);
	const load = useCallback(async () => {
		setLoading(true);
		const [{ data, error }, { data: ord }] = await Promise.all([supabase.from("order_notes").select("*").eq("order_id", orderId).order("created_at", { ascending: false }), supabase.from("orders").select("reseller_note,admin_note,notes,created_at,updated_at,reseller:resellers(business_name)").eq("id", orderId).maybeSingle()]);
		if (error) console.error("[order_notes]", error);
		setNotes(data ?? []);
		const o = ord;
		const pinned = [];
		if (o) {
			const at = o.updated_at ?? o.created_at;
			if (o.reseller_note) pinned.push({
				role: "reseller",
				name: o.reseller?.business_name ?? null,
				body: o.reseller_note,
				at
			});
			if (o.admin_note) pinned.push({
				role: "admin",
				name: null,
				body: o.admin_note,
				at
			});
			if (o.notes) pinned.push({
				role: "staff",
				name: null,
				body: o.notes,
				at
			});
		}
		setOrderNotes(pinned);
		setLoading(false);
	}, [orderId]);
	useEffect(() => {
		load();
	}, [load]);
	const canEdit = (n) => canWrite && (authorRole === "admin" || authorRole === "staff" || n.author_id === user?.id);
	async function add() {
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const { error } = await supabase.from("order_notes").insert({
			order_id: orderId,
			author_id: user?.id ?? null,
			author_name: authorName ?? null,
			author_role: authorRole,
			body
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setDraft("");
		toast.success("Note added");
		load();
	}
	async function saveEdit(id) {
		const body = editDraft.trim();
		if (!body) return;
		setBusy(true);
		const { error } = await supabase.from("order_notes").update({ body }).eq("id", id).select("id");
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setEditingId(null);
		toast.success("Note updated");
		load();
	}
	async function remove(id) {
		setBusy(true);
		const { data, error } = await supabase.from("order_notes").delete().eq("id", id).select("id");
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (!data || data.length === 0) {
			toast.error("You do not have permission to delete this note.");
			return;
		}
		toast.success("Note deleted");
		load();
	}
	const words = countWords(draft);
	return /* @__PURE__ */ jsxs("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b bg-muted/30 px-4 py-3",
			children: [/* @__PURE__ */ jsxs("h3", {
				className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
				children: [/* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-3.5 w-3.5" }), title]
			}), /* @__PURE__ */ jsxs("span", {
				className: "text-[10px] font-semibold text-muted-foreground",
				children: [
					notes.length,
					" note",
					notes.length === 1 ? "" : "s",
					" · max ",
					20,
					" words"
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4 p-4",
			children: [
				canWrite ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border bg-background p-2.5",
					children: [/* @__PURE__ */ jsx("textarea", {
						rows: 2,
						value: draft,
						onChange: (e) => setDraft(clampWords(e.target.value)),
						placeholder: "Write a short note (max 20 words)…",
						className: "w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-1.5 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("span", {
							className: `text-[11px] font-semibold ${words >= 20 ? "text-amber-600" : "text-muted-foreground"}`,
							children: [
								words,
								"/",
								20,
								" words"
							]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							disabled: busy || !draft.trim(),
							onClick: () => void add(),
							className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50",
							children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin" }), "Add note"]
						})]
					})]
				}) : /* @__PURE__ */ jsx("p", {
					className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
					children: lockedHint ?? "Notes are read-only for this order status."
				}),
				orderNotes.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: orderNotes.map((p, i) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-dashed bg-muted/20 px-3 py-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${roleBadge(p.role)}`,
									children: roleLabel(p.role)
								}),
								p.name && /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-foreground/70",
									children: p.name
								}),
								/* @__PURE__ */ jsx("span", { children: "·" }),
								/* @__PURE__ */ jsx("span", { children: new Date(p.at).toLocaleString() }),
								/* @__PURE__ */ jsx("span", {
									className: "rounded bg-background px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
									children: "Order form"
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-sm text-foreground/90",
							children: p.body
						})]
					}, i))
				}),
				loading ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Loading notes…"]
				}) : notes.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: orderNotes.length > 0 ? "No timeline notes yet." : "No notes yet."
				}) : /* @__PURE__ */ jsx("ol", {
					className: "relative space-y-4 border-l pl-4",
					children: notes.map((n) => /* @__PURE__ */ jsxs("li", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsx("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${roleBadge(n.author_role)}`,
										children: roleLabel(n.author_role)
									}),
									n.author_name && /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground/70",
										children: n.author_name
									}),
									/* @__PURE__ */ jsx("span", { children: "·" }),
									/* @__PURE__ */ jsx("span", { children: new Date(n.created_at).toLocaleString() }),
									n.updated_at !== n.created_at && /* @__PURE__ */ jsx("span", { children: "· edited" })
								]
							}),
							editingId === n.id ? /* @__PURE__ */ jsxs("div", {
								className: "mt-1.5 rounded-lg border bg-background p-2",
								children: [/* @__PURE__ */ jsx("textarea", {
									rows: 2,
									value: editDraft,
									onChange: (e) => setEditDraft(clampWords(e.target.value)),
									className: "w-full resize-none bg-transparent text-sm outline-none"
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: [
											countWords(editDraft),
											"/",
											20,
											" words"
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setEditingId(null),
											className: "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
											children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Cancel"]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											disabled: busy || !editDraft.trim(),
											onClick: () => void saveEdit(n.id),
											className: "inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground disabled:opacity-50",
											children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), " Save"]
										})]
									})]
								})]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "mt-0.5 flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm text-foreground/90",
									children: n.body
								}), canEdit(n) && /* @__PURE__ */ jsxs("div", {
									className: "flex shrink-0 gap-1",
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Edit note",
										onClick: () => {
											setEditingId(n.id);
											setEditDraft(n.body);
										},
										className: "grid h-6 w-6 place-items-center rounded-md border text-muted-foreground transition hover:bg-muted",
										children: /* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" })
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Delete note",
										onClick: () => void remove(n.id),
										className: "grid h-6 w-6 place-items-center rounded-md border text-destructive transition hover:bg-destructive/10",
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
									})]
								})]
							})
						]
					}, n.id))
				})
			]
		})]
	});
}
//#endregion
//#region src/components/order-last-update.tsx
var empty = () => ({
	statusAt: null,
	noteBody: null,
	noteRole: null,
	noteName: null,
	noteAt: null,
	noteCount: 0
});
/** Latest status-change time + latest note for a batch of orders (2 queries total). */
async function fetchOrderMeta(ids) {
	const list = ids.filter(Boolean);
	if (list.length === 0) return {};
	const [{ data: hist }, { data: notes }, { data: ords }] = await Promise.all([
		supabase.from("order_status_history").select("order_id,created_at").in("order_id", list).order("created_at", { ascending: false }),
		supabase.from("order_notes").select("order_id,body,author_role,author_name,created_at").in("order_id", list).order("created_at", { ascending: false }),
		supabase.from("orders").select("id,reseller_note,admin_note,notes,created_at,updated_at").in("id", list)
	]);
	const out = {};
	for (const id of list) out[id] = empty();
	for (const h of hist ?? []) {
		const m = out[h.order_id];
		if (m && !m.statusAt) m.statusAt = h.created_at;
	}
	for (const n of notes ?? []) {
		const m = out[n.order_id];
		if (!m) continue;
		m.noteCount += 1;
		if (!m.noteBody) {
			m.noteBody = n.body;
			m.noteRole = n.author_role;
			m.noteName = n.author_name ?? null;
			m.noteAt = n.created_at;
		}
	}
	for (const o of ords ?? []) {
		const m = out[o.id];
		if (!m) continue;
		const form = [];
		if (o.reseller_note) form.push({
			role: "reseller",
			body: o.reseller_note
		});
		if (o.admin_note) form.push({
			role: "admin",
			body: o.admin_note
		});
		if (o.notes) form.push({
			role: "staff",
			body: o.notes
		});
		m.noteCount += form.length;
		if (!m.noteBody && form[0]) {
			m.noteBody = form[0].body;
			m.noteRole = form[0].role;
			m.noteAt = o.updated_at ?? o.created_at;
		}
	}
	return out;
}
function roleTag(role) {
	if (role === "reseller") return "Reseller";
	if (role === "admin" || role === "super_admin") return "Admin";
	if (role === "supplier") return "Supplier";
	if (role) return "Staff";
	return "";
}
function OrderNotePreview({ meta, onOpenNotes, className = "", align = "center" }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: onOpenNotes,
		title: "View / add notes",
		className: `w-full rounded-md border border-dashed bg-background px-1.5 py-1 text-left transition hover:border-primary/50 hover:bg-primary/5 ${className}`,
		children: meta?.noteBody ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
			className: "mt-0.5 block line-clamp-4 text-[10px] leading-snug text-foreground/80",
			children: meta.noteBody
		}), /* @__PURE__ */ jsxs("span", {
			className: "mt-0.5 flex flex-wrap items-center gap-x-1 text-[9px] text-muted-foreground/80",
			children: [
				meta.noteAt && !isNaN(new Date(meta.noteAt).getTime()) && /* @__PURE__ */ jsx("span", {
					className: "tabular-nums text-muted-foreground/70",
					children: new Date(meta.noteAt).toLocaleString([], {
						day: "2-digit",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit"
					})
				}),
				/* @__PURE__ */ jsx("span", { children: "by" }),
				meta.noteName ? /* @__PURE__ */ jsx("span", {
					className: "font-semibold text-foreground/70",
					children: meta.noteName
				}) : /* @__PURE__ */ jsx("span", {
					className: "font-medium",
					children: roleTag(meta.noteRole) || "Unknown"
				}),
				meta.noteCount > 1 && /* @__PURE__ */ jsxs("span", {
					className: "text-muted-foreground",
					children: ["+", meta.noteCount - 1]
				})
			]
		})] }) : /* @__PURE__ */ jsxs("span", {
			className: `flex items-center gap-1 text-[10px] text-muted-foreground ${align === "center" ? "justify-center" : ""}`,
			children: [/* @__PURE__ */ jsx(StickyNote, { className: "h-2.5 w-2.5" }), " Add note"]
		})
	});
}
function LastUpdateCell({ meta, fallbackAt, onOpenNotes, hideNote = false }) {
	const at = meta?.statusAt ?? fallbackAt ?? null;
	const d = at ? new Date(at) : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-w-0 text-center",
		children: [Boolean(d && !isNaN(d.getTime())) && d ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "text-[11px] font-medium text-foreground",
			children: d.toLocaleDateString()
		}), /* @__PURE__ */ jsx("div", {
			className: "text-[10px] tabular-nums text-muted-foreground/80",
			children: d.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		})] }) : /* @__PURE__ */ jsx("div", {
			className: "text-[10px] italic text-muted-foreground/60",
			children: "No update yet"
		}), !hideNote && /* @__PURE__ */ jsx(OrderNotePreview, {
			meta,
			onOpenNotes,
			className: "mt-1"
		})]
	});
}
function OrderNotesModal({ orderId, orderNumber, authorRole, authorName, canWrite, lockedHint, onClose }) {
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[70] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-sm font-bold",
					children: ["Notes ", orderNumber ? /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: ["· #", orderNumber]
					}) : null]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close notes",
					className: "grid h-7 w-7 place-items-center rounded-md border text-muted-foreground hover:bg-muted",
					children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "max-h-[70vh] modal-scroll p-3",
				children: /* @__PURE__ */ jsx(OrderNotes, {
					orderId,
					canWrite,
					authorRole,
					authorName,
					lockedHint
				})
			})]
		})
	});
}
/** Small helper hook: keeps a meta map in sync for the current rows. */
function useOrderMeta(ids) {
	const [meta, setMeta] = useState({});
	useEffect(() => {
		let alive = true;
		if (ids.length === 0) {
			setMeta({});
			return;
		}
		fetchOrderMeta(ids).then((m) => {
			if (alive) setMeta((prev) => ({
				...prev,
				...m
			}));
		});
		return () => {
			alive = false;
		};
	}, [ids.join(",")]);
	const refresh = async (list) => {
		const m = await fetchOrderMeta(list);
		setMeta((prev) => ({
			...prev,
			...m
		}));
	};
	return {
		meta,
		refresh
	};
}
//#endregion
//#region src/components/OrderTabs.tsx
/** Light tint classes for the mobile status dropdown, based on the active tab's group. */
function tabTint(key) {
	const group = orderTabGroup(key);
	if (group === "delivered") return "bg-emerald-600 border-emerald-600 text-white font-semibold shadow-sm ring-2 ring-emerald-600/30";
	if (group === "partial") return "bg-amber-500 border-amber-500 text-white font-semibold shadow-sm ring-2 ring-amber-500/30";
	if (group === "terminal") return "bg-rose-600 border-rose-600 text-white font-semibold shadow-sm ring-2 ring-rose-600/30";
	return "bg-blue-600 border-blue-600 text-white font-semibold shadow-sm ring-2 ring-blue-600/30";
}
/**
* Responsive order status tabs.
* - Mobile: compact dropdown that sits inside the filter grid (lighter highlight).
* - Desktop: wraps into multiple rows, never overflows horizontally.
*/
function OrderTabs({ tab, onChange, count, className = "mb-4 w-full min-w-0", highlight = false, tabs = ORDER_TABS }) {
	const [open, setOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState(null);
	const ref = useRef(null);
	const menuRef = useRef(null);
	const active = tabs.find((t) => t.key === tab);
	const updateMenuPosition = () => {
		const trigger = ref.current?.getBoundingClientRect();
		if (!trigger || typeof window === "undefined") return;
		const margin = 16;
		const gap = 6;
		const desiredWidth = Math.min(window.innerWidth - margin * 2, 360);
		const width = Math.max(trigger.width, desiredWidth);
		const left = Math.min(Math.max(margin, trigger.right - width), window.innerWidth - width - margin);
		const availableBelow = window.innerHeight - trigger.bottom - margin;
		const availableAbove = trigger.top - margin;
		const openUp = availableBelow < 260 && availableAbove > availableBelow;
		const maxHeight = Math.max(180, Math.min(360, openUp ? availableAbove - gap : availableBelow - gap));
		const top = openUp ? trigger.top - gap - maxHeight : trigger.bottom + gap;
		setMenuPosition({
			top,
			left,
			width,
			maxHeight
		});
	};
	useEffect(() => {
		function onDoc(e) {
			const target = e.target;
			if (ref.current?.contains(target) || menuRef.current?.contains(target)) return;
			setOpen(false);
		}
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, []);
	useEffect(() => {
		if (!open) {
			setMenuPosition(null);
			return;
		}
		updateMenuPosition();
		window.addEventListener("resize", updateMenuPosition);
		window.addEventListener("scroll", updateMenuPosition, true);
		return () => {
			window.removeEventListener("resize", updateMenuPosition);
			window.removeEventListener("scroll", updateMenuPosition, true);
		};
	}, [open]);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [/* @__PURE__ */ jsxs("div", {
			ref,
			className: "relative sm:hidden",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				"aria-expanded": open,
				className: `flex h-10 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-ring ${highlight ? tabTint(tab) : "bg-background"}`,
				children: [/* @__PURE__ */ jsxs("span", {
					className: "min-w-0 truncate font-medium",
					children: [active?.label ?? "Orders", /* @__PURE__ */ jsx("span", {
						className: "ml-1.5 text-xs opacity-70",
						children: count(tab)
					})]
				}), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}` })]
			}), open && menuPosition && createPortal(/* @__PURE__ */ jsx("div", {
				ref: menuRef,
				className: "fixed z-[100] rounded-md border bg-popover p-2 shadow-lg",
				style: {
					top: menuPosition.top,
					left: menuPosition.left,
					width: menuPosition.width
				},
				children: /* @__PURE__ */ jsx("div", {
					className: "no-scrollbar grid grid-cols-2 gap-1.5 overflow-y-auto overscroll-contain",
					style: { maxHeight: menuPosition.maxHeight },
					children: tabs.map((t) => {
						const isActive = tab === t.key;
						return /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								onChange(t.key);
								setOpen(false);
							},
							className: `min-w-0 rounded-md border px-2 py-1.5 text-center text-xs transition-colors ${orderTabClasses(t.key, isActive)}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "block truncate font-medium",
								children: t.label
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] opacity-70",
								children: count(t.key)
							})]
						}, t.key);
					})
				})
			}), document.body)]
		}), /* @__PURE__ */ jsx("div", {
			className: "hidden flex-wrap gap-2 sm:flex",
			children: tabs.map((t) => {
				const isActive = tab === t.key;
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onChange(t.key),
					className: `min-w-0 rounded-md border px-2.5 py-1.5 text-center text-xs transition-colors sm:px-3 sm:text-sm ${orderTabClasses(t.key, isActive)}`,
					children: [/* @__PURE__ */ jsx("span", {
						className: "truncate font-medium",
						children: t.label
					}), /* @__PURE__ */ jsx("span", {
						className: `ml-1.5 text-[11px] ${isActive ? "opacity-80" : "text-muted-foreground"}`,
						children: count(t.key)
					})]
				}, t.key);
			})
		})]
	});
}
//#endregion
//#region src/lib/courier-tracking.ts
/**
* External (courier website) tracking links.
* Steadfast : the real per-consignment link Steadfast returns at booking time
*             (https://steadfast.com.bd/tl/<token>), saved on shipments.tracking_url.
*             There is no way to derive this from tracking_code — a URL built as
*             https://steadfast.com.bd/t/<tracking_code> looks plausible but 404s
*             ("Link Unavailable") on Steadfast's own site, so it's only used as a
*             last-resort fallback for the rare shipment saved before this existed.
* Pathao    : https://merchant.pathao.com/tracking?consignment_id=<id>&phone=<customer phone>
* Carrybee  : https://merchant.carrybee.com/order-track/<tracking_id>
*/
function courierTrackingUrl(provider, shipment, customerPhone) {
	if (!provider || !shipment) return null;
	const tracking = (shipment.tracking_id || "").toString().trim();
	const consignment = (shipment.consignment_id || "").toString().trim();
	if (!(tracking || consignment)) return null;
	switch (provider) {
		case "steadfast": return (shipment.tracking_url || "").toString().trim() || null;
		case "pathao": {
			const id = consignment || tracking;
			const phone = (customerPhone || "").replace(/[^0-9]/g, "");
			const qs = new URLSearchParams({ consignment_id: id });
			if (phone) qs.set("phone", phone);
			return `https://merchant.pathao.com/tracking?${qs.toString()}`;
		}
		case "carrybee": return `https://merchant.carrybee.com/order-track/${encodeURIComponent(tracking || consignment)}`;
		default: return null;
	}
}
//#endregion
//#region src/components/order-search.tsx
/** Search box with dynamic button-styled mode selector (Order / Booking combined, and Product separate). */
function OrderSearch({ mode, onMode, value, onChange, className = "" }) {
	const placeholder = mode === "product" ? "Search by product name…" : "Order no, booking ID, phone, customer…";
	return /* @__PURE__ */ jsxs("div", {
		className: `flex h-10 min-w-0 w-full flex-1 items-center rounded-lg border bg-background shadow-xs transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${className}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative shrink-0 flex items-center h-full border-r border-primary/20 bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25 transition-colors rounded-l-lg",
				children: [/* @__PURE__ */ jsxs("select", {
					value: mode,
					onChange: (e) => onMode(e.target.value),
					className: "h-full w-auto pl-2.5 sm:pl-3 pr-6 text-[11px] sm:text-xs font-semibold bg-transparent text-primary outline-none cursor-pointer appearance-none truncate",
					title: "Search type",
					children: [/* @__PURE__ */ jsx("option", {
						value: "order",
						className: "bg-background text-foreground font-medium",
						children: "Order"
					}), /* @__PURE__ */ jsx("option", {
						value: "product",
						className: "bg-background text-foreground font-medium",
						children: "Product"
					})]
				}), /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" })]
			}),
			/* @__PURE__ */ jsx(Search, { className: "ml-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground/70" }),
			/* @__PURE__ */ jsx("input", {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder,
				className: "h-full min-w-0 w-full bg-transparent px-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 outline-none"
			}),
			value && /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => onChange(""),
				className: "mr-1.5 shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
				title: "Clear search",
				children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
//#endregion
export { OrderNotePreview as a, OrderNotes as c, OrderProductCell as d, LastUpdateCell as i, ImageLightbox as l, courierTrackingUrl as n, OrderNotesModal as o, OrderTabs as r, useOrderMeta as s, OrderSearch as t, OrderItemsList as u };
