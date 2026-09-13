import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { r as supabase } from "./client-CI2ZnE4F.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { At as LogIn, F as ShieldOff, Gt as KeyRound, K as Save, Nt as LoaderCircle, St as MessageCircle, Z as Receipt, Zt as IdCard, a as Wallet, at as PhoneCall, ht as PackageSearch, it as Phone, jn as Copy, r as X, rt as Play, st as Pencil, v as Trash2, wn as Ellipsis } from "./vendor-icons-DF2A5Z8S.js";
import { n as confirmAction } from "./confirm-CRVKAosm.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { r as useCan } from "./use-auth-CygHuric.js";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-B_of1R8h.js";
import { i as usePaginated, n as DataToolbar, r as Pagination } from "./data-list-D-TkvXUz.js";
import { t as ResellerAvatar } from "./reseller-avatar-C6dusfCe.js";
import { i as loadAdminSupplierOverview, n as bdtNum } from "./supplier-BTXPGr2I.js";
import { a as startImpersonation } from "./impersonation-BwCyUj37.js";
import { t as PasswordResetModal } from "./password-reset-modal-B6rpWbQi.js";
import { n as impersonateSupplier, r as resetSupplierPassword, t as deleteSupplier } from "./supplier-access.functions-DGFRlBQH.js";
//#region src/routes/_authenticated/admin/suppliers.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var FILTERS = [
	"all",
	"pending",
	"active",
	"suspended",
	"rejected"
];
var FILTER_LABELS = {
	all: "All",
	pending: "Pending",
	active: "Active",
	suspended: "Suspended",
	rejected: "Rejected"
};
var STATUS_TONE = {
	pending: "bg-amber-500/10 text-amber-600",
	active: "bg-emerald-500/10 text-emerald-600",
	suspended: "bg-muted text-muted-foreground",
	rejected: "bg-destructive/10 text-destructive"
};
function AdminSuppliersPage() {
	useNavigate();
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [editFor, setEditFor] = (0, import_react.useState)(null);
	const [resetFor, setResetFor] = (0, import_react.useState)(null);
	const resetPasswordFn = useServerFn(resetSupplierPassword);
	const impersonateFn = useServerFn(impersonateSupplier);
	const deleteFn = useServerFn(deleteSupplier);
	const canManage = useCan()("suppliers.manage");
	const load = (0, import_react.useCallback)(async () => {
		try {
			setData(await loadAdminSupplierOverview());
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Load failed");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const items = data?.suppliers ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		let out = items;
		if (filter !== "all") out = out.filter((s) => s.status === filter);
		const q = query.trim().toLowerCase();
		if (q) out = out.filter((s) => s.display_name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || (s.email ?? "").toLowerCase().includes(q) || (s.contact_phone ?? "").toLowerCase().includes(q));
		return out;
	}, [
		items,
		filter,
		query
	]);
	const counts = (0, import_react.useMemo)(() => ({
		all: items.length,
		pending: items.filter((s) => s.status === "pending").length,
		active: items.filter((s) => s.status === "active").length,
		suspended: items.filter((s) => s.status === "suspended").length,
		rejected: items.filter((s) => s.status === "rejected").length
	}), [items]);
	const paged = usePaginated(filtered, page, perPage);
	async function setStatus(s, status) {
		if (status === s.status) return;
		setBusyId(s.id);
		const patch = { status };
		if (status === "active") patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
		const { error } = await supabase.from("suppliers").update(patch).eq("id", s.id);
		setBusyId(null);
		if (error) return toast.error(error.message);
		toast.success(status === "active" ? `${s.display_name} is now active` : `Status set to ${status}`);
		load();
	}
	async function applyPasswordReset(s, password) {
		try {
			await resetPasswordFn({ data: {
				userId: s.user_id,
				password
			} });
			toast.success(`Password updated for ${s.display_name}`);
			setResetFor(null);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to reset password");
		}
	}
	async function removeSupplier(s) {
		if (!await confirmAction({
			title: `Delete ${s.display_name}?`,
			description: "The supplier account and login will be permanently deleted. Order history and products stay, but lose the supplier link. This cannot be undone.",
			confirmText: "Delete supplier",
			variant: "danger"
		})) return;
		setBusyId(s.id);
		try {
			await deleteFn({ data: { supplierId: s.id } });
			toast.success(`${s.display_name} deleted`);
			load();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Delete failed");
		} finally {
			setBusyId(null);
		}
	}
	async function loginAsSupplier(s) {
		setBusyId(s.id);
		try {
			const res = await impersonateFn({ data: { userId: s.user_id || s.id } });
			if (!res?.accessToken) throw new Error("No session token returned");
			await startImpersonation({
				accessToken: res.accessToken,
				refreshToken: res.refreshToken || res.accessToken,
				label: s.display_name,
				returnTo: window.location.pathname + window.location.search
			});
			window.location.href = "/supplier";
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not log in as supplier");
		} finally {
			setBusyId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Supplier Network",
			description: "Supplier accounts, their sales, returns, and payouts in one place."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					setFilter(f);
					setPage(1);
				},
				className: "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " + (filter === f ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
				children: [FILTER_LABELS[f], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums " + (filter === f ? "opacity-80" : "text-muted-foreground"),
					children: counts[f]
				})]
			}, f))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataToolbar, {
			search: query,
			onSearch: (v) => {
				setQuery(v);
				setPage(1);
			},
			searchPlaceholder: "Search name, code, phone, email…",
			perPage,
			onPerPage: (n) => {
				setPerPage(n);
				setPage(1);
			}
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nothing here",
			description: "No suppliers match this filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: paged.map((s) => {
				const payable = Math.max(s.earning - s.paid - s.pending_payout, 0);
				const phone = (s.contact_phone ?? "").trim();
				const waPhone = (s.whatsapp || phone).replace(/[^0-9]/g, "").replace(/^0/, "880");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-3 shadow-sm transition hover:shadow-md sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAvatar, {
									url: null,
									name: s.display_name,
									size: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 flex-1 flex-wrap items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate min-w-0 font-medium",
										children: s.display_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "hidden sm:contents",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierInfoBadges, {
											s,
											phone,
											waPhone
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/supplier-report",
											title: "Supplier report",
											"aria-label": `Report for ${s.display_name}`,
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/supplier-payouts",
											title: "Payouts",
											"aria-label": `Payouts for ${s.display_name}`,
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/products",
											search: { supplier: s.id },
											title: "Products",
											"aria-label": `Products of ${s.display_name}`,
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-4 w-4" })
										}),
										canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-md border hover:bg-muted",
											children: busyId === s.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "w-56",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: s.display_name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												s.status !== "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setStatus(s, "active"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-4 w-4" }), " Approve / activate"]
												}),
												s.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setStatus(s, "suspended"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-2 h-4 w-4" }), " Suspend"]
												}),
												s.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setStatus(s, "rejected"),
													className: "text-destructive focus:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-4 w-4" }), " Reject"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setEditFor(s),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit details"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setResetFor(s),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 h-4 w-4" }), " Reset password"]
												}),
												s.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => void loginAsSupplier(s),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-2 h-4 w-4" }), " Login as supplier"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => void removeSupplier(s),
													className: "text-destructive focus:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete supplier"]
												})
											]
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap items-center gap-1.5 sm:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierInfoBadges, {
								s,
								phone,
								waPhone
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-4 gap-2 lg:grid-cols-4 xl:grid-cols-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Products",
									value: s.products,
									plain: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Sold qty",
									value: s.sold_qty,
									plain: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Earning",
									value: s.earning,
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Returned qty",
									value: s.returned_qty,
									plain: true,
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Returned value",
									value: s.returned_amount,
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Paid",
									value: s.paid
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Payable",
									value: payable
								})
							]
						})
					]
				}, s.id);
			})
		}),
		!loading && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: filtered.length,
			onPage: setPage
		}),
		editFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierEditModal, {
			supplier: editFor,
			onClose: () => setEditFor(null),
			onSaved: () => {
				setEditFor(null);
				load();
			}
		}),
		resetFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordResetModal, {
			label: resetFor.display_name,
			onClose: () => setResetFor(null),
			onReset: (pw) => applyPasswordReset(resetFor, pw)
		})
	] });
}
/** Status + returns + ID + phone + email badges, reused inline (desktop) and below (mobile). */
function SupplierInfoBadges({ s, phone, waPhone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " + (STATUS_TONE[s.status] ?? "bg-muted"),
			children: s.status
		}),
		s.pending_returns > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600",
			children: [s.pending_returns, " return to hand over"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "h-3 w-3 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-wide text-muted-foreground",
					children: "ID"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] font-bold tracking-wider text-primary",
					children: s.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: "Copy supplier ID",
					onClick: () => {
						navigator.clipboard.writeText(s.code);
						toast.success("Supplier ID copied");
					},
					className: "text-muted-foreground transition hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
				})
			]
		}),
		phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[11px] font-medium",
					children: phone
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: "Copy phone",
					onClick: () => {
						navigator.clipboard.writeText(phone);
						toast.success("Phone copied");
					},
					className: "text-muted-foreground transition hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `tel:${phone}`,
					title: "Call",
					className: "text-muted-foreground transition hover:text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "h-3 w-3" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `https://wa.me/${waPhone}`,
					target: "_blank",
					rel: "noreferrer",
					title: "WhatsApp",
					className: "text-muted-foreground transition hover:text-success",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3 w-3" })
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground",
			children: "no phone"
		}),
		s.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 truncate rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground",
			children: s.email
		})
	] });
}
function Metric({ label, value, accent, muted, plain }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-muted/30 px-2 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold tabular-nums " + (accent ? "text-success" : muted ? "text-muted-foreground" : ""),
			children: value == null ? "—" : plain ? value.toLocaleString() : bdtNum(value)
		})]
	});
}
function SupplierEditModal({ supplier, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({
		display_name: supplier.display_name ?? "",
		contact_phone: supplier.contact_phone ?? "",
		whatsapp: supplier.whatsapp ?? "",
		address: supplier.address ?? "",
		status: supplier.status,
		notes: supplier.notes ?? "",
		payout_method: supplier.payout_method ?? "bkash",
		payout_account_name: supplier.payout_account_name ?? "",
		payout_account_number: supplier.payout_account_number ?? "",
		payout_bank_name: supplier.payout_bank_name ?? "",
		payout_branch: supplier.payout_branch ?? ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const isBank = form.payout_method === "bank";
	function set(k, v) {
		setForm((f) => ({
			...f,
			[k]: v
		}));
	}
	async function save(e) {
		e.preventDefault();
		if (!form.display_name.trim()) return toast.error("Please enter a name");
		setBusy(true);
		const patch = {
			display_name: form.display_name.trim(),
			contact_phone: form.contact_phone || null,
			whatsapp: form.whatsapp || null,
			address: form.address || null,
			status: form.status,
			notes: form.notes || null,
			payout_method: form.payout_method,
			payout_account_name: form.payout_account_name || null,
			payout_account_number: form.payout_account_number || null,
			payout_bank_name: isBank ? form.payout_bank_name || null : null,
			payout_branch: isBank ? form.payout_branch || null : null
		};
		if (form.status === "active" && supplier.status !== "active") patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
		const { error } = await supabase.from("suppliers").update(patch).eq("id", supplier.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Supplier updated");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4",
		onClick: busy ? void 0 : onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			onClick: (e) => e.stopPropagation(),
			className: "surface-card modal-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-b-none sm:rounded-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-semibold",
						children: ["Edit supplier · ", supplier.code]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 px-4 py-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Supplier / business name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.display_name,
								onChange: (e) => set("display_name", e.target.value),
								className: inp
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email (login)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: supplier.email ?? "",
								disabled: true,
								className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring opacity-60"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.contact_phone,
								onChange: (e) => set("contact_phone", e.target.value),
								className: inp
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "WhatsApp",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.whatsapp,
								onChange: (e) => set("whatsapp", e.target.value),
								className: inp
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Status",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.status,
								onChange: (e) => set("status", e.target.value),
								className: inp,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "suspended",
										children: "Suspended"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rejected",
										children: "Rejected"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Payout method",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.payout_method,
								onChange: (e) => set("payout_method", e.target.value),
								className: inp,
								children: [
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
										value: "bank",
										children: "Bank"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Account holder name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.payout_account_name,
								onChange: (e) => set("payout_account_name", e.target.value),
								className: inp
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: isBank ? "Account number" : "Mobile number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.payout_account_number,
								onChange: (e) => set("payout_account_number", e.target.value),
								className: inp
							})
						}),
						isBank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bank name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.payout_bank_name,
								onChange: (e) => set("payout_bank_name", e.target.value),
								className: inp
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Branch",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.payout_branch,
								onChange: (e) => set("payout_branch", e.target.value),
								className: inp
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: form.address,
									onChange: (e) => set("address", e.target.value),
									className: inp
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Admin note (internal)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: form.notes,
									onChange: (e) => set("notes", e.target.value),
									className: inp
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 flex justify-end gap-2 border-t bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						disabled: busy,
						className: "rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold disabled:opacity-50",
						children: [
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }),
							" ",
							"Save"
						]
					})]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
//#endregion
export { AdminSuppliersPage as component };
