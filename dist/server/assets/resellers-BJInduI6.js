import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { D as formatDate, r as supabase, s as createSsrRpc } from "./client-D4WgG89C.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CwgILtb5.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { At as LogIn, F as ShieldOff, Gt as KeyRound, Hn as CircleUser, I as ShieldCheck, Nt as LoaderCircle, Ot as MailCheck, Sn as ExternalLink, St as MessageCircle, Z as Receipt, Zt as IdCard, a as Wallet, at as PhoneCall, bn as Eye, h as TriangleAlert, ht as PackageSearch, it as Phone, jn as Copy, jt as Lock, k as SmartphoneNfc, r as X, rt as Play, st as Pencil, tr as Check, tt as Plus, ut as Pause, v as Trash2, wn as Ellipsis } from "./vendor-icons-DF2A5Z8S.js";
import { n as confirmAction } from "./confirm-CRVKAosm.js";
import { t as Route } from "./resellers-Bcg4Odom.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { o as useAdvancedSettings } from "./advanced-settings-SDPYXO11.js";
import { t as SearchableSelect } from "./searchable-select-BnAjxEDw.js";
import { r as useCan } from "./use-auth-BlN5jsui.js";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-B_of1R8h.js";
import { i as usePaginated, r as Pagination } from "./data-list-D-TkvXUz.js";
import { t as ResellerAvatar } from "./reseller-avatar-C6dusfCe.js";
import { t as DepositLedger } from "./deposit-ledger-DDOyCjiF.js";
import { n as deleteAuthUser, r as listResellerEmailStatus, t as confirmUserEmail } from "./admin-users.functions-B82-bui_.js";
import { a as startImpersonation } from "./impersonation-EQSAKKoR.js";
import { i as resellerStatusLabel, n as resellerStatusActions, r as resellerStatusClass } from "./reseller-status-Cim1Uohp.js";
import { n as VerifyBadges, r as verifyPending, t as ResellerProfile } from "./ResellerProfile-CO7eES6t.js";
import { t as PasswordResetModal } from "./password-reset-modal-B6rpWbQi.js";
//#region src/lib/reseller-access.functions.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Sets an easy, readable password for a reseller and returns it once to the admin. */
var resetResellerPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	userId: stringType().min(1),
	password: stringType().min(6).max(64).optional()
}).parse(d)).handler(createSsrRpc("c41a7d0b1f28e54b9c352b35533fa84681a2c8fb53baa30b0239472d18099044"));
/**
* Mints a one-time magic-link token for the reseller account so an admin can
* enter the reseller panel. Requires reseller management permission.
*/
var impersonateReseller = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ userId: stringType().min(1) }).parse(d)).handler(createSsrRpc("f850d332dd0e3b844c6b95e0be03c053ad6d2dfe841a14c555f128a49f6957dc"));
//#endregion
//#region src/routes/_authenticated/admin/resellers.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"all",
	"pending",
	"active",
	"suspended",
	"rejected",
	"email_unverified"
];
var FILTER_LABELS = {
	pending: resellerStatusLabel("pending"),
	active: resellerStatusLabel("active"),
	suspended: resellerStatusLabel("suspended"),
	rejected: resellerStatusLabel("rejected"),
	email_unverified: "Unverified",
	all: "All"
};
function ResellersPage() {
	useNavigate();
	const confirmEmailFn = useServerFn(confirmUserEmail);
	const listEmailStatusFn = useServerFn(listResellerEmailStatus);
	const deleteAuthUserFn = useServerFn(deleteAuthUser);
	const resetPasswordFn = useServerFn(resetResellerPassword);
	const impersonateFn = useServerFn(impersonateReseller);
	const searchParams = Route.useSearch();
	const [items, setItems] = (0, import_react.useState)([]);
	const [emailStatus, setEmailStatus] = (0, import_react.useState)({});
	/** profiles.email_verified_at / phone_verified_at keyed by user_id */
	const [profileVerify, setProfileVerify] = (0, import_react.useState)({});
	const [summaries, setSummaries] = (0, import_react.useState)({});
	const [orderCounts, setOrderCounts] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)(FILTERS.includes(searchParams.status ?? "") ? searchParams.status : "all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [depositFor, setDepositFor] = (0, import_react.useState)(null);
	const [profileFor, setProfileFor] = (0, import_react.useState)(null);
	const [resetFor, setResetFor] = (0, import_react.useState)(null);
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [agentFilter, setAgentFilter] = (0, import_react.useState)("");
	const { settings: advanced } = useAdvancedSettings();
	const autoApprove = advanced.resellerAutoApprove;
	const can = useCan();
	const canManage = can("resellers.manage");
	const canImpersonate = can("resellers.impersonate");
	async function load() {
		setLoading(true);
		const [listRes, metricsRes] = await Promise.all([supabase.from("resellers").select("id,user_id,avatar_url,business_name,code,contact_phone,address,nid_number,status,commission_rate,leader_id,agent_id,notes,approved_at,created_at,payout_method,payout_account_name,payout_account_number,payout_bank_name,payout_branch,payout_routing,deposit_required,deposit_required_amount,frozen_amount").order("created_at", { ascending: false }), supabase.rpc("admin_reseller_metrics")]);
		const rows = listRes.data ?? [];
		setItems(rows);
		const ids = Array.from(new Set(rows.flatMap((r) => [r.user_id, r.id]).filter(Boolean)));
		if (ids.length) {
			const [profRes, usersRes] = await Promise.all([supabase.from("profiles").select("id,email_verified_at,phone_verified_at,is_phone_verified").in("id", ids), supabase.from("users").select("id,email,email_verified_at,is_phone_verified,phone_verified_at").in("id", ids)]);
			const verifyMap = {};
			for (const p of profRes.data ?? []) verifyMap[p.id] = {
				email: Boolean(p.email_verified_at),
				phone: Boolean(p.phone_verified_at || p.is_phone_verified)
			};
			for (const u of usersRes.data ?? []) {
				const prev = verifyMap[u.id] || {
					email: false,
					phone: false
				};
				verifyMap[u.id] = {
					email: Boolean(prev.email || u.email_verified_at),
					phone: Boolean(prev.phone || u.is_phone_verified || u.phone_verified_at)
				};
			}
			for (const r of rows) {
				const pV = verifyMap[r.user_id] || verifyMap[r.id];
				const isPhone = Boolean(pV?.phone || r.is_phone_verified || r.phone_verified_at);
				const isEmail = Boolean(pV?.email || r.is_email_verified || r.email_verified_at);
				verifyMap[r.user_id] = {
					email: isEmail,
					phone: isPhone
				};
				verifyMap[r.id] = {
					email: isEmail,
					phone: isPhone
				};
			}
			setProfileVerify(verifyMap);
		}
		const { data: agentRows } = await supabase.from("agents").select("id,display_name").order("display_name");
		setAgents(agentRows ?? []);
		const metrics = metricsRes.data ?? [];
		setSummaries(Object.fromEntries(metrics.map((m) => [m.reseller_id, {
			delivered_profit: Number(m.delivered_profit ?? 0),
			pending_payout: Number(m.pending_payout ?? 0),
			paid_out: Number(m.paid_out ?? 0),
			available: Number(m.available ?? 0),
			deposit_balance: Number(m.deposit_balance ?? 0),
			frozen_amount: Number(m.frozen_amount ?? 0)
		}])));
		setOrderCounts(Object.fromEntries(metrics.map((m) => [m.reseller_id, Number(m.orders ?? 0)])));
		setLoading(false);
	}
	async function loadEmailStatus() {
		try {
			const { data } = await supabase.rpc("admin_auth_users");
			const list = data ?? [];
			if (list && list.length > 0) {
				const map = {};
				for (const u of list) map[u.user_id] = {
					email: u.email,
					verified: Boolean(u.email_confirmed)
				};
				setEmailStatus(map);
				return;
			}
		} catch {}
		try {
			const list = await listEmailStatusFn();
			const map = {};
			for (const u of list) map[u.user_id] = {
				email: u.email,
				verified: u.email_confirmed
			};
			setEmailStatus(map);
		} catch {}
	}
	(0, import_react.useEffect)(() => {
		load();
		loadEmailStatus();
	}, []);
	(0, import_react.useEffect)(() => {
		const s = searchParams.status;
		if (s && FILTERS.includes(s)) {
			setFilter(s);
			setPage(1);
		}
	}, [searchParams.status]);
	/** Verification truth for one reseller: profiles/users first, auth confirm as fallback. */
	const verifyFor = (r) => {
		const uId = r.user_id;
		const rId = r.id;
		return {
			emailVerified: Boolean(profileVerify[uId]?.email || profileVerify[rId]?.email || emailStatus[uId]?.verified || emailStatus[rId]?.verified || r.is_email_verified || r.email_verified_at),
			phoneVerified: Boolean(profileVerify[uId]?.phone || profileVerify[rId]?.phone || r.is_phone_verified || r.phone_verified_at),
			hasPhone: Boolean(r.contact_phone || r.phone),
			requireEmail: advanced.verifyEnabled && advanced.verifyEmail,
			requirePhone: advanced.verifyEnabled && advanced.verifySms
		};
	};
	const filtered = (0, import_react.useMemo)(() => {
		let out = items;
		if (filter === "email_unverified") out = out.filter((r) => {
			const f = verifyFor(r);
			return verifyPending(f) || !f.emailVerified;
		});
		else if (filter !== "all") out = out.filter((r) => r.status === filter);
		if (agentFilter) out = out.filter((r) => agentFilter === "none" ? !r.agent_id : r.agent_id === agentFilter);
		const q = query.trim().toLowerCase();
		if (q) out = out.filter((r) => r.business_name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || (r.contact_phone ?? "").toLowerCase().includes(q) || (emailStatus[r.user_id]?.email ?? "").toLowerCase().includes(q));
		return out;
	}, [
		items,
		filter,
		query,
		emailStatus,
		profileVerify,
		advanced,
		agentFilter
	]);
	const counts = (0, import_react.useMemo)(() => {
		return {
			pending: items.filter((r) => r.status === "pending").length,
			active: items.filter((r) => r.status === "active").length,
			suspended: items.filter((r) => r.status === "suspended").length,
			rejected: items.filter((r) => r.status === "rejected").length,
			email_unverified: items.filter((r) => {
				const f = verifyFor(r);
				return verifyPending(f) || !f.emailVerified;
			}).length,
			all: items.length
		};
	}, [
		items,
		emailStatus,
		profileVerify,
		advanced
	]);
	async function setStatus(r, status) {
		if (status === r.status) return;
		const patch = { status };
		if (status === "active") patch.approved_at = (/* @__PURE__ */ new Date()).toISOString();
		setItems((prev) => prev.map((item) => item.id === r.id ? {
			...item,
			status,
			approved_at: patch.approved_at || item.approved_at
		} : item));
		const { error } = await supabase.from("resellers").update(patch).eq("id", r.id);
		if (error) {
			toast.error(error.message);
			load();
			return;
		}
		toast.success(status === "active" ? `${r.business_name} activated` : `Status set to ${resellerStatusLabel(status)}`);
	}
	async function applyPasswordReset(r, password) {
		try {
			await resetPasswordFn({ data: {
				userId: r.user_id || r.id,
				password
			} });
			toast.success(`Password updated for ${r.business_name}`);
			setResetFor(null);
		} catch (e) {
			toast.error(e?.message ?? "Failed to reset password");
		}
	}
	async function loginAsReseller(r) {
		try {
			const res = await impersonateFn({ data: { userId: r.user_id || r.id } });
			if (!res?.accessToken) throw new Error("No session token returned");
			await startImpersonation({
				accessToken: res.accessToken,
				refreshToken: res.refreshToken || res.accessToken,
				label: r.business_name,
				returnTo: window.location.pathname + window.location.search
			});
			toast.success(`Logged in as ${r.business_name}`);
			window.location.href = "/dashboard";
		} catch (e) {
			toast.error(e?.message ?? "Could not log in as reseller");
		}
	}
	async function confirmEmail(r) {
		const uId = r.user_id || r.id;
		setProfileVerify((prev) => ({
			...prev,
			[r.user_id]: {
				email: true,
				phone: Boolean(prev[r.user_id]?.phone || prev[r.id]?.phone)
			},
			[r.id]: {
				email: true,
				phone: Boolean(prev[r.id]?.phone || prev[r.user_id]?.phone)
			}
		}));
		setEmailStatus((prev) => ({
			...prev,
			[r.user_id]: {
				email: prev[r.user_id]?.email || `${r.code}@resellseba.com`,
				verified: true
			},
			[r.id]: {
				email: prev[r.id]?.email || `${r.code}@resellseba.com`,
				verified: true
			}
		}));
		try {
			const { data, error } = await supabase.rpc("admin_confirm_user_email", { _user_id: uId });
			if (error) {
				const res = await confirmEmailFn({ data: { userId: uId } });
				if (res.alreadyConfirmed) toast.info("Email already confirmed");
				else toast.success(`Email confirmed for ${res.email ?? r.business_name}`);
			} else {
				const row = Array.isArray(data) ? data[0] : data;
				toast.success(`Email confirmed for ${row?.email ?? r.business_name}`);
			}
			loadEmailStatus();
			load();
		} catch (e) {
			toast.error(e?.message ?? "Failed to confirm email");
			load();
		}
	}
	/** Manual mobile verification (no OTP) — admin vouches for the number. */
	async function setPhoneVerified(r, verified) {
		const uId = r.user_id || r.id;
		setProfileVerify((prev) => ({
			...prev,
			[r.user_id]: {
				email: Boolean(prev[r.user_id]?.email || prev[r.id]?.email),
				phone: verified
			},
			[r.id]: {
				email: Boolean(prev[r.id]?.email || prev[r.user_id]?.email),
				phone: verified
			}
		}));
		const { error } = await supabase.rpc("admin_set_phone_verified", {
			_user_id: uId,
			_verified: verified
		});
		if (error) {
			toast.error(error.message);
			load();
			return false;
		}
		toast.success(verified ? `${r.business_name} mobile marked verified` : "Mobile verification cleared");
		load();
		return true;
	}
	async function remove(r) {
		if (!await confirmAction({
			title: "Delete reseller",
			description: "This also deletes the login account and may remove related listings/orders.",
			detail: r.business_name,
			confirmText: "Delete reseller"
		})) return;
		const { error } = await supabase.from("resellers").delete().eq("id", r.id);
		if (error) return toast.error(error.message);
		try {
			await deleteAuthUserFn({ data: { userId: r.user_id } });
		} catch {}
		toast.success("Deleted");
		load();
		loadEmailStatus();
	}
	function copyStoreLink(r) {
		const url = `${window.location.origin}/s/${r.code}`;
		navigator.clipboard.writeText(url);
		toast.success("Store link copied");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reseller Network",
			description: "Monitor and manage all storefront applications, email verifications, and partner status."
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => {
					setQuery(e.target.value);
					setPage(1);
				},
				placeholder: "Search name, code, phone, email…",
				className: "w-full min-w-0 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-40 sm:w-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableSelect, {
						value: agentFilter,
						onChange: (v) => {
							setAgentFilter(v);
							setPage(1);
						},
						placeholder: "All agents",
						options: [
							{
								value: "",
								label: "All agents"
							},
							{
								value: "none",
								label: "No agent assigned"
							},
							...agents.map((a) => ({
								value: a.id,
								label: a.display_name
							}))
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: perPage,
					onChange: (e) => {
						setPerPage(Number(e.target.value));
						setPage(1);
					},
					className: "shrink-0 rounded-md border bg-background px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
					title: "Per page",
					children: [[
						10,
						20,
						50,
						100
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: n,
						children: [n, " / page"]
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: -1,
						children: "All"
					})]
				})]
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nothing here",
			description: "No resellers match this filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: usePaginated(filtered, page, perPage).map((r) => {
				const s = summaries[r.id];
				emailStatus[r.user_id];
				const vf = verifyFor(r);
				const emailVerified = vf.emailVerified;
				const phone = (r.contact_phone ?? "").trim();
				const waPhone = phone.replace(/[^0-9]/g, "").replace(/^0/, "880");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-3 shadow-sm transition hover:shadow-md sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAvatar, {
									url: r.avatar_url,
									name: r.business_name,
									size: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 flex-1 flex-wrap items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate min-w-0 font-medium",
										children: r.business_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "hidden sm:contents",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerInfoBadges, {
											r,
											vf,
											phone,
											waPhone,
											onSetStatus: setStatus,
											onConfirmEmail: confirmEmail,
											onSetPhoneVerified: setPhoneVerified
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/transactions",
											search: { reseller: r.id },
											title: "Transaction report",
											"aria-label": `Transaction report for ${r.business_name}`,
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/orders",
											search: {
												reseller: r.id,
												tab: "all"
											},
											title: "Order list",
											"aria-label": `Orders for ${r.business_name}`,
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											title: "View profile",
											onClick: () => setProfileFor(r),
											className: "grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											className: "grid h-8 w-8 shrink-0 place-items-center rounded-md border hover:bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "w-56",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: r.business_name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												canManage && resellerStatusActions(r.status, autoApprove).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setStatus(r, a.status),
													className: a.tone === "danger" ? "text-destructive focus:text-destructive" : "",
													children: [a.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-4 w-4" }) : a.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-4 w-4" }) : a.status === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-2 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), a.label]
												}, a.status)),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												canManage && !emailVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => confirmEmail(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "mr-2 h-4 w-4" }), " Confirm email"]
												}),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													onClick: () => void setPhoneVerified(r, !vf.phoneVerified),
													children: vf.phoneVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "mr-2 h-4 w-4" }), " Clear mobile verification"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "mr-2 h-4 w-4" }), " Mark mobile verified"] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setProfileFor(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "mr-2 h-4 w-4" }), " View profile"]
												}),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setEditing(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), " Edit details"]
												}),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setDepositFor(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mr-2 h-4 w-4" }), " Deposit & freeze"]
												}),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => setResetFor(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 h-4 w-4" }), " Reset password"]
												}),
												canImpersonate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => void loginAsReseller(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-2 h-4 w-4" }), " Login as reseller"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => copyStoreLink(r),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), " Copy store link"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: `/s/${r.code}`,
														target: "_blank",
														rel: "noreferrer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-2 h-4 w-4" }), " Visit storefront"]
													})
												}),
												canManage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => remove(r),
													className: "text-destructive focus:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), " Delete reseller"]
												})] })
											]
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap items-center gap-1.5 sm:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerInfoBadges, {
								r,
								vf,
								phone,
								waPhone,
								onSetStatus: setStatus,
								onConfirmEmail: confirmEmail,
								onSetPhoneVerified: setPhoneVerified
							})
						}),
						r.deposit_required && Number(r.deposit_required_amount) > 0 || Number(r.frozen_amount) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-1.5",
							children: [r.deposit_required && Number(r.deposit_required_amount) > 0 && ((s?.deposit_balance ?? 0) >= Number(r.deposit_required_amount) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Deposit ok"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-medium text-destructive",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
									" Deposit due ৳",
									(Number(r.deposit_required_amount) - (s?.deposit_balance ?? 0)).toLocaleString()
								]
							})), Number(r.frozen_amount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }),
									" Frozen ৳",
									Number(r.frozen_amount).toLocaleString()
								]
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-4 gap-2 lg:grid-cols-4 xl:grid-cols-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Orders",
									value: orderCounts[r.id] ?? 0,
									plain: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Delivered profit",
									value: s?.delivered_profit,
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Available",
									value: s?.available
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Paid out",
									value: s?.paid_out
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Payout pending",
									value: s?.pending_payout,
									muted: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Deposit paid",
									value: s?.deposit_balance
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Deposit due",
									value: r.deposit_required ? Math.max(Number(r.deposit_required_amount ?? 0) - (s?.deposit_balance ?? 0), 0) : 0,
									muted: !r.deposit_required || Math.max(Number(r.deposit_required_amount ?? 0) - (s?.deposit_balance ?? 0), 0) === 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
									label: "Frozen",
									value: Number(r.frozen_amount ?? 0),
									muted: true
								})
							]
						})
					]
				}, r.id);
			})
		}),
		!loading && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: filtered.length,
			onPage: setPage
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditModal, {
			reseller: editing,
			agents,
			email: emailStatus[editing.user_id],
			verify: verifyFor(editing),
			onSetPhoneVerified: (v) => setPhoneVerified(editing, v),
			others: items.filter((i) => i.id !== editing.id && i.status === "active"),
			onClose: () => setEditing(null),
			onSaved: () => {
				setEditing(null);
				load();
			}
		}),
		profileFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileModal, {
			reseller: profileFor,
			summary: summaries[profileFor.id] ?? null,
			orders: orderCounts[profileFor.id],
			email: emailStatus[profileFor.user_id],
			verify: verifyFor(profileFor),
			agentName: agents.find((a) => a.id === profileFor.agent_id)?.display_name ?? null,
			leaderName: profileFor.leader_id ? (() => {
				const l = items.find((i) => i.id === profileFor.leader_id);
				return l ? `${l.business_name} (#${l.code})` : "Leader linked";
			})() : null,
			onClose: () => setProfileFor(null)
		}),
		resetFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordResetModal, {
			label: resetFor.business_name,
			onClose: () => setResetFor(null),
			onReset: (pw) => applyPasswordReset(resetFor, pw)
		}),
		depositFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositModal, {
			reseller: depositFor,
			onClose: () => setDepositFor(null),
			onSaved: () => {
				setDepositFor(null);
				load();
			}
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
			children: value == null ? "—" : plain ? value.toLocaleString() : `৳${value.toLocaleString()}`
		})]
	});
}
function StatusBadge({ status, onSetStatus }) {
	if (!onSetStatus) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-[10px] font-medium ${resellerStatusClass(status)}`,
		children: resellerStatusLabel(status)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
		className: `cursor-pointer rounded-full px-2.5 py-0.5 text-[10px] font-medium transition hover:opacity-80 ${resellerStatusClass(status)}`,
		children: [resellerStatusLabel(status), " ▾"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "start",
		className: "w-40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
				className: "text-xs",
				children: "Change Status"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => onSetStatus("active"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-3.5 w-3.5 text-success" }), " Active"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => onSetStatus("suspended"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mr-2 h-3.5 w-3.5 text-amber-600" }), " Inactive"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => onSetStatus("pending"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-2 h-3.5 w-3.5 text-sky-600" }), " Pending"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => onSetStatus("rejected"),
				className: "text-destructive focus:text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 h-3.5 w-3.5" }), " Rejected"]
			})
		]
	})] });
}
/** Status + verification + ID + phone badges, reused inline (desktop) and below (mobile). */
function ResellerInfoBadges({ r, vf, phone, waPhone, onSetStatus, onConfirmEmail, onSetPhoneVerified }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
			status: r.status,
			onSetStatus: onSetStatus ? (s) => onSetStatus(r, s) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex flex-nowrap items-center gap-1.5",
			children: [vf.emailVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-inset ring-success/25",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-3 w-3" }), " Email verified"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				title: "Click to confirm email",
				onClick: () => onConfirmEmail && onConfirmEmail(r),
				className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-500/30 transition hover:bg-amber-500/25 dark:text-amber-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-3 w-3" }), " Verify email"]
			}), phone ? vf.phoneVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				title: "Click to clear phone verification",
				onClick: () => onSetPhoneVerified && onSetPhoneVerified(r, false),
				className: "inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ring-1 ring-inset ring-success/25 transition hover:opacity-80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "h-3 w-3" }), " Mobile verified"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				title: "Click to mark mobile verified",
				onClick: () => onSetPhoneVerified && onSetPhoneVerified(r, true),
				className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-500/30 transition hover:bg-amber-500/25 dark:text-amber-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "h-3 w-3" }), " Verify mobile"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-inset ring-border",
				children: "No mobile"
			})]
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
					children: r.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: "Copy reseller ID",
					onClick: () => {
						navigator.clipboard.writeText(r.code);
						toast.success("Reseller ID copied");
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
		})
	] });
}
function ReadOnlyBit({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "truncate text-xs font-medium capitalize " + (mono ? "font-mono uppercase" : ""),
			title: value,
			children: value
		})]
	});
}
function EditModal({ reseller, agents, others, email, verify, onSetPhoneVerified, onClose, onSaved }) {
	const [businessName, setBusinessName] = (0, import_react.useState)(reseller.business_name);
	const [status, setStatusState] = (0, import_react.useState)(reseller.status);
	const [code, setCode] = (0, import_react.useState)(reseller.code);
	const [phone, setPhone] = (0, import_react.useState)(reseller.contact_phone ?? "");
	const [phoneVerified, setPhoneVerified] = (0, import_react.useState)(Boolean(verify?.phoneVerified));
	const [phoneBusy, setPhoneBusy] = (0, import_react.useState)(false);
	const [address, setAddress] = (0, import_react.useState)(reseller.address ?? "");
	const [commission, setCommission] = (0, import_react.useState)(String(reseller.commission_rate));
	const [leaderId, setLeaderId] = (0, import_react.useState)(reseller.leader_id ?? "");
	const [agentId, setAgentId] = (0, import_react.useState)(reseller.agent_id ?? "");
	const [nid, setNid] = (0, import_react.useState)(reseller.nid_number ?? "");
	const [notes, setNotes] = (0, import_react.useState)(reseller.notes ?? "");
	const [payoutMethod, setPayoutMethod] = (0, import_react.useState)(reseller.payout_method ?? "");
	const [payoutAccountName, setPayoutAccountName] = (0, import_react.useState)(reseller.payout_account_name ?? "");
	const [payoutAccountNumber, setPayoutAccountNumber] = (0, import_react.useState)(reseller.payout_account_number ?? "");
	const [payoutBankName, setPayoutBankName] = (0, import_react.useState)(reseller.payout_bank_name ?? "");
	const [payoutBranch, setPayoutBranch] = (0, import_react.useState)(reseller.payout_branch ?? "");
	const [payoutRouting, setPayoutRouting] = (0, import_react.useState)(reseller.payout_routing ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		const isBank = payoutMethod === "bank";
		const { error } = await supabase.from("resellers").update({
			business_name: businessName,
			code: code.trim(),
			status,
			approved_at: status === "active" ? reseller.approved_at || (/* @__PURE__ */ new Date()).toISOString() : reseller.approved_at,
			contact_phone: phone || null,
			address: address || null,
			nid_number: nid || null,
			commission_rate: Number(commission),
			leader_id: leaderId || null,
			agent_id: agentId || null,
			notes: notes || null,
			payout_method: payoutMethod || null,
			payout_account_name: payoutAccountName || null,
			payout_account_number: payoutAccountNumber || null,
			payout_bank_name: isBank ? payoutBankName || null : null,
			payout_branch: isBank ? payoutBranch || null : null,
			payout_routing: isBank ? payoutRouting || null : null
		}).eq("id", reseller.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Saved");
		onSaved();
	}
	const cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 p-0 sm:items-center sm:p-4",
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
						children: "Edit reseller"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "shrink-0 rounded-md p-1 hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Reseller ID",
									value: reseller.code,
									mono: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Login email",
									value: email?.email ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Status",
									value: resellerStatusLabel(status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Joined",
									value: formatDate(reseller.created_at, "—", {
										day: "2-digit",
										month: "short",
										year: "numeric"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Security deposit",
									value: reseller.deposit_required && Number(reseller.deposit_required_amount) > 0 ? `৳${Number(reseller.deposit_required_amount).toLocaleString()}` : "Not required"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Frozen",
									value: `৳${Number(reseller.frozen_amount ?? 0).toLocaleString()}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyBit, {
									label: "Approved",
									value: formatDate(reseller.approved_at)
								})
							]
						}),
						verify && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border bg-muted/30 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1.5 text-[10px] uppercase tracking-wide text-muted-foreground",
									children: "Verification"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifyBadges, {
									...verify,
									phoneVerified
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: phoneBusy,
									onClick: async () => {
										setPhoneBusy(true);
										const next = !phoneVerified;
										if (await onSetPhoneVerified(next)) setPhoneVerified(next);
										setPhoneBusy(false);
									},
									className: "mt-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium hover:bg-muted disabled:opacity-60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "h-3.5 w-3.5" }), phoneVerified ? "Clear mobile verification" : "Mark mobile verified"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Business name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: businessName,
								onChange: (e) => setBusinessName(e.target.value),
								className: cls
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Account Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: status,
								onChange: (e) => setStatusState(e.target.value),
								className: cls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "suspended",
										children: "Inactive / Suspended"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rejected",
										children: "Rejected"
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Store code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: code,
								onChange: (e) => setCode(e.target.value),
								className: cls
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Commission %"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "0.1",
								min: 0,
								max: 100,
								value: commission,
								onChange: (e) => setCommission(e.target.value),
								className: cls
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: cls
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Leader (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: leaderId,
								onChange: (e) => setLeaderId(e.target.value),
								className: cls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "— None —"
								}), others.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: o.id,
									children: [
										o.business_name,
										" (#",
										o.code,
										")"
									]
								}, o.id))]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Commission agent (optional)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: agentId,
								onChange: (e) => setAgentId(e.target.value),
								className: cls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "— None —"
								}), agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: a.id,
									children: a.display_name
								}, a.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "The agent follows up with this reseller and sees their orders in the agent report."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: address,
								onChange: (e) => setAddress(e.target.value),
								className: cls
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "NID number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: nid,
								onChange: (e) => setNid(e.target.value),
								className: cls
							})] })]
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Payout information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: payoutMethod,
										onChange: (e) => setPayoutMethod(e.target.value),
										className: cls,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "— Not set —"
											}),
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
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Account holder"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: payoutAccountName,
										onChange: (e) => setPayoutAccountName(e.target.value),
										className: cls
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: payoutMethod === "bank" ? "Account number" : "Mobile number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: payoutAccountNumber,
											onChange: (e) => setPayoutAccountNumber(e.target.value),
											className: cls
										})]
									}),
									payoutMethod === "bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: "Bank"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: payoutBankName,
											onChange: (e) => setPayoutBankName(e.target.value),
											className: cls
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: "Branch"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: payoutBranch,
											onChange: (e) => setPayoutBranch(e.target.value),
											className: cls
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-medium",
												children: "Routing"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: payoutRouting,
												onChange: (e) => setPayoutRouting(e.target.value),
												className: cls
											})]
										})
									] })
								]
							})]
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
						className: "btn-brand inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save"]
					})]
				})
			]
		})
	});
}
function DepositModal({ reseller, onClose, onSaved }) {
	const [required, setRequired] = (0, import_react.useState)(Boolean(reseller.deposit_required));
	const [requiredAmount, setRequiredAmount] = (0, import_react.useState)(String(reseller.deposit_required_amount ?? 0));
	const [frozen, setFrozen] = (0, import_react.useState)(String(reseller.frozen_amount ?? 0));
	const [rows, setRows] = (0, import_react.useState)([]);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("bkash");
	const [reference, setReference] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const balance = rows.reduce((n, r) => n + Number(r.amount), 0);
	const due = required ? Math.max(Number(requiredAmount || 0) - balance, 0) : 0;
	const cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
	async function loadRows() {
		const { data, error } = await supabase.from("reseller_deposits").select("id,amount,method,reference,note,created_at").eq("reseller_id", reseller.id).order("created_at", { ascending: false });
		if (error) toast.error(error.message);
		setRows(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		loadRows();
	}, [reseller.id]);
	async function saveRules() {
		setBusy(true);
		const { error } = await supabase.from("resellers").update({
			deposit_required: required,
			deposit_required_amount: Number(requiredAmount) || 0,
			frozen_amount: Number(frozen) || 0
		}).eq("id", reseller.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Deposit settings saved");
		onSaved();
	}
	async function addEntry(e) {
		e.preventDefault();
		const amt = Number(amount);
		if (!amt) return toast.error("Enter amount (use − for adjustment)");
		setBusy(true);
		const { error } = await supabase.from("reseller_deposits").insert({
			reseller_id: reseller.id,
			amount: amt,
			method: method || null,
			reference: reference || null,
			note: note || null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		setAmount("");
		setNote("");
		setReference("");
		toast.success("Ledger entry added");
		loadRows();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-3",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border bg-background shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate text-sm font-semibold",
						children: ["Deposit & freeze — ", reseller.business_name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "If a deposit is due the reseller cannot confirm orders. Frozen amount cannot be withdrawn."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-md p-1 hover:bg-muted",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-muted/30 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wide text-muted-foreground",
									children: "Balance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold",
									children: ["৳", balance.toLocaleString()]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-muted/30 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wide text-muted-foreground",
									children: "Due"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold " + (due > 0 ? "text-destructive" : "text-success"),
									children: ["৳", due.toLocaleString()]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-muted/30 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wide text-muted-foreground",
									children: "Frozen"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold",
									children: ["৳", (Number(frozen) || 0).toLocaleString()]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-md border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: required,
									onChange: (e) => setRequired(e.target.checked),
									className: "h-4 w-4"
								}), "Enable deposit trigger"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Required deposit (৳)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: requiredAmount,
									onChange: (e) => setRequiredAmount(e.target.value),
									className: cls
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Freeze amount (৳)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: frozen,
									onChange: (e) => setFrozen(e.target.value),
									className: cls
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: saveRules,
									disabled: busy,
									className: "btn-brand rounded-md px-4 py-1.5 text-xs font-medium disabled:opacity-50",
									children: "Save settings"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: addEntry,
						className: "space-y-3 rounded-md border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold",
								children: "New entry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Amount (৳) — use − for refund"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: amount,
										onChange: (e) => setAmount(e.target.value),
										type: "number",
										className: cls
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: method,
										onChange: (e) => setMethod(e.target.value),
										className: cls,
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
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cash",
												children: "Cash"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "adjustment",
												children: "Adjustment"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Reference / TrxID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: reference,
										onChange: (e) => setReference(e.target.value),
										className: cls
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Note"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: note,
										onChange: (e) => setNote(e.target.value),
										className: cls
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: busy,
									className: "inline-flex items-center gap-1.5 rounded-md border px-4 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add entry"]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: "Deposit transactions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositLedger, {
							compact: true,
							resellerId: reseller.id,
							onChanged: loadRows
						})]
					})
				]
			})]
		})
	});
}
function ProfileModal({ reseller, summary, orders, email, verify, leaderName, agentName, onClose }) {
	const data = {
		...reseller,
		commission_rate: Number(reseller.commission_rate),
		deposit_required_amount: Number(reseller.deposit_required_amount),
		frozen_amount: Number(reseller.frozen_amount),
		leader_name: leaderName,
		agent_name: agentName,
		email: email?.email ?? null,
		email_verified: verify ? verify.emailVerified : email ? email.verified : null,
		phone_verified: verify?.phoneVerified ?? null,
		require_email_verify: verify?.requireEmail,
		require_phone_verify: verify?.requirePhone
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/40 p-0 sm:items-center sm:p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "surface-card flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-b-none sm:max-h-[88dvh] sm:rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6 sm:py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "truncate text-base font-semibold",
					children: "Reseller profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "shrink-0 rounded-md p-1 hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto bg-muted/20 px-4 py-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerProfile, {
					reseller: data,
					summary,
					orders,
					admin: true
				})
			})]
		})
	});
}
//#endregion
export { ResellersPage as component };
