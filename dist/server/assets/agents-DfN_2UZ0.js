import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { r as supabase, s as createSsrRpc } from "./client-BAn7XKYw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { t as requireSupabaseAuth } from "./auth-middleware-COl73A2L.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { $ as Power, H as Search, Mt as LoaderCircle, Tt as Mail, c as Users, d as UserCheck, et as Plus, ot as Pencil, r as X, rt as Phone, v as Trash2, y as Target } from "./vendor-icons-BEaCFqaT.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { a as bdt } from "./agents-BjKc5KSO.js";
import { r as useCan } from "./use-auth-zbqaYCVZ.js";
//#region src/lib/agents.functions.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Staff / admin accounts that can be turned into commission agents.
* Emails live in the auth schema, so they need the privileged key; if it is
* unavailable the list still renders (names only).
*/
var listAgentCandidates = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d8978ff6672fba1f7d9bfef74a7e9a0a679ddbc8c54dad6e4c22e2039f485e49"));
//#endregion
//#region src/routes/_authenticated/admin/agents.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function AgentsPage() {
	const candidatesFn = useServerFn(listAgentCandidates);
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [candidates, setCandidates] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [assignFor, setAssignFor] = (0, import_react.useState)(null);
	const [removing, setRemoving] = (0, import_react.useState)(null);
	const canManage = useCan()("agents.manage");
	async function load() {
		setLoading(true);
		const [agentsRes, resellerRes] = await Promise.all([supabase.from("agents").select("*").order("display_name"), supabase.from("resellers").select("id,business_name,code,status,contact_phone,agent_id").order("business_name")]);
		if (agentsRes.error) toast.error(agentsRes.error.message);
		setAgents(agentsRes.data ?? []);
		setResellers(resellerRes.data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
		candidatesFn().then((rows) => setCandidates(rows)).catch(() => setCandidates([]));
	}, []);
	const counts = (0, import_react.useMemo)(() => {
		const map = {};
		for (const r of resellers) if (r.agent_id) map[r.agent_id] = (map[r.agent_id] ?? 0) + 1;
		return map;
	}, [resellers]);
	async function toggleActive(a) {
		const { error } = await supabase.from("agents").update({ is_active: !a.is_active }).eq("id", a.id);
		if (error) return toast.error(error.message);
		toast.success(a.is_active ? "Agent deactivated" : "Agent activated");
		load();
	}
	async function remove(a) {
		const { error } = await supabase.from("agents").delete().eq("id", a.id);
		setRemoving(null);
		if (error) return toast.error(error.message);
		toast.success("Agent removed");
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Commission Agents",
			description: "Assign resellers to agents, set their sales target and let them follow up on business growth.",
			actions: canManage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setEditing("new"),
				className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add agent"]
			}) : void 0
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : agents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No agents yet",
			description: "Create an agent from a staff account, then assign the resellers they will follow up with."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5 shadow-sm transition hover:shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary",
								children: a.display_name.slice(0, 2)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-bold",
									children: a.display_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground",
									children: [a.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 truncate",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
											" ",
											a.email
										]
									}), a.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
											" ",
											a.phone
										]
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " + (a.is_active ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"),
							children: a.is_active ? "Active" : "Off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground",
									children: "Sale target"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-black text-primary",
									children: bdt(Number(a.sale_target))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/40 p-2.5",
								title: "Commission = this % × settled net profit of the assigned resellers' delivered orders.",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground",
									children: "Commission"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black",
									children: [Number(a.commission_rate ?? 0), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/40 p-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground",
									children: "Resellers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-black",
									children: counts[a.id] ?? 0
								})]
							})
						]
					}),
					a.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 line-clamp-2 text-xs text-muted-foreground",
						children: a.notes
					}),
					canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setAssignFor(a),
								className: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }), " Assign resellers"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEditing(a),
								className: "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Edit"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleActive(a),
								title: a.is_active ? "Deactivate" : "Activate",
								className: "inline-flex items-center justify-center rounded-md border px-2.5 py-2 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRemoving(a),
								title: "Remove agent",
								className: "inline-flex items-center justify-center rounded-md border border-destructive/40 px-2.5 py-2 text-destructive hover:bg-destructive/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					})
				]
			}, a.id))
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentModal, {
			agent: editing === "new" ? null : editing,
			candidates,
			taken: agents.map((a) => a.user_id),
			onClose: () => setEditing(null),
			onSaved: () => {
				setEditing(null);
				load();
			}
		}),
		assignFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignModal, {
			agent: assignFor,
			resellers,
			onClose: () => setAssignFor(null),
			onSaved: () => {
				setAssignFor(null);
				load();
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: !!removing,
			title: "Remove this agent?",
			description: `${removing?.display_name ?? ""} will be unassigned from every reseller. The staff account itself is not deleted.`,
			confirmText: "Remove agent",
			variant: "danger",
			onClose: () => setRemoving(null),
			onConfirm: async () => {
				if (removing) await remove(removing);
			}
		})
	] });
}
function AgentModal({ agent, candidates, taken, onClose, onSaved }) {
	const [userId, setUserId] = (0, import_react.useState)(agent?.user_id ?? "");
	const [name, setName] = (0, import_react.useState)(agent?.display_name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(agent?.phone ?? "");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)(agent?.whatsapp ?? "");
	const [email, setEmail] = (0, import_react.useState)(agent?.email ?? "");
	const [target, setTarget] = (0, import_react.useState)(String(agent?.sale_target ?? 0));
	const [rate, setRate] = (0, import_react.useState)(String(agent?.commission_rate ?? 0));
	const [active, setActive] = (0, import_react.useState)(agent?.is_active ?? true);
	const [notes, setNotes] = (0, import_react.useState)(agent?.notes ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const available = candidates.filter((c) => c.user_id === agent?.user_id || !taken.includes(c.user_id));
	function pickUser(id) {
		setUserId(id);
		const c = candidates.find((x) => x.user_id === id);
		if (c) {
			if (!name) setName(c.full_name || c.email || "Agent");
			if (!email) setEmail(c.email ?? "");
		}
	}
	async function save(e) {
		e.preventDefault();
		if (!userId) return toast.error("Select the staff account for this agent");
		setBusy(true);
		const payload = {
			user_id: userId,
			display_name: name.trim(),
			phone: phone.trim() || null,
			whatsapp: whatsapp.trim() || null,
			email: email.trim() || null,
			sale_target: Number(target) || 0,
			commission_rate: Number(rate) || 0,
			is_active: active,
			notes: notes.trim() || null
		};
		const { error } = agent ? await supabase.from("agents").update(payload).eq("id", agent.id) : await supabase.from("agents").insert(payload);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(agent ? "Agent updated" : "Agent created");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 sm:items-center sm:p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onClick: (e) => e.stopPropagation(),
			onSubmit: save,
			className: "surface-card flex max-h-[92dvh] w-full max-w-lg flex-col rounded-b-none sm:max-h-[88dvh] sm:rounded-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate text-base font-semibold",
						children: agent ? "Edit agent" : "New agent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Staff account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: userId,
								onChange: (e) => pickUser(e.target.value),
								className: cls,
								disabled: !!agent,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "— Select staff / admin user —"
								}), available.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.user_id,
									children: (c.full_name || "Unnamed") + (c.email ? ` · ${c.email}` : "")
								}, c.user_id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "The agent logs in with this account. Give the account a role that includes the agent report permission."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Display name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: name,
									onChange: (e) => setName(e.target.value),
									className: cls
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Sale target (৳)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: target,
									onChange: (e) => setTarget(e.target.value),
									className: cls
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: "Commission rate (%)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											max: 100,
											step: "0.01",
											value: rate,
											onChange: (e) => setRate(e.target.value),
											className: cls
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: "Commission = this % × settled net profit of the assigned resellers' orders (final delivered amount − delivery charge − product cost − packaging cost). Returned / cancelled orders reduce the base."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									className: cls
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "WhatsApp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: whatsapp,
									onChange: (e) => setWhatsapp(e.target.value),
									className: cls
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Contact email (shown to resellers)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: cls
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Internal notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							className: cls
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: active,
								onChange: (e) => setActive(e.target.checked)
							}), "Active agent (resellers can see the contact info)"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border px-4 py-2 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save"]
					})]
				})
			]
		})
	});
}
function AssignModal({ agent, resellers, onClose, onSaved }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(resellers.filter((r) => r.agent_id === agent.id).map((r) => r.id));
	const [busy, setBusy] = (0, import_react.useState)(false);
	const list = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		return [...t ? resellers.filter((r) => r.business_name.toLowerCase().includes(t) || r.code.toLowerCase().includes(t) || (r.contact_phone ?? "").includes(t)) : resellers].sort((a, b) => Number(selected.includes(b.id)) - Number(selected.includes(a.id)));
	}, [resellers, q]);
	function toggle(id) {
		setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
	}
	async function save() {
		setBusy(true);
		const before = resellers.filter((r) => r.agent_id === agent.id).map((r) => r.id);
		const toAdd = selected.filter((id) => !before.includes(id));
		const toRemove = before.filter((id) => !selected.includes(id));
		try {
			if (toAdd.length) {
				const { error } = await supabase.from("resellers").update({ agent_id: agent.id }).in("id", toAdd);
				if (error) throw error;
			}
			if (toRemove.length) {
				const { error } = await supabase.from("resellers").update({ agent_id: null }).in("id", toRemove);
				if (error) throw error;
			}
			toast.success(`${selected.length} reseller(s) assigned to ${agent.display_name}`);
			onSaved();
		} catch (err) {
			toast.error(err?.message || "Could not save assignments");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 sm:items-center sm:p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "surface-card flex max-h-[92dvh] w-full max-w-lg flex-col rounded-b-none sm:max-h-[88dvh] sm:rounded-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-base font-semibold",
							children: "Assign resellers"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								agent.display_name,
								" · ",
								selected.length,
								" selected"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b px-4 py-3 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search reseller name, ID or phone…",
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring pl-9"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 sm:px-6",
					children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-center text-sm text-muted-foreground",
						children: "No reseller found."
					}), list.map((r) => {
						const other = r.agent_id && r.agent_id !== agent.id;
						const on = selected.includes(r.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggle(r.id),
							className: "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition " + (on ? "border-primary bg-primary/5" : "hover:bg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-5 w-5 shrink-0 place-items-center rounded border " + (on ? "border-primary bg-primary text-primary-foreground" : ""),
								children: on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3 w-3" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold",
									children: r.business_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-[11px] text-muted-foreground",
									children: [
										"#",
										r.code,
										" · ",
										r.status,
										other ? " · assigned to another agent" : ""
									]
								})]
							})]
						}, r.id);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border px-4 py-2 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: save,
						disabled: busy,
						className: "btn-brand inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" }), " Save assignments"]
					})]
				})
			]
		})
	});
}
//#endregion
export { AgentsPage as component };
