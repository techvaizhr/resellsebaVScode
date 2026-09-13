import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-D4WgG89C.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Et as Mail, Gt as KeyRound, K as Save, Nt as LoaderCircle, bn as Eye, xn as EyeOff } from "./vendor-icons-DF2A5Z8S.js";
import { t as clearAppDataCache } from "./app-data-BFnvQCHB.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BlN5jsui.js";
import { t as ImageUploader } from "./ImageUploader-D0d80G8O.js";
import { t as ResellerAvatar } from "./reseller-avatar-C6dusfCe.js";
import { t as ResellerProfile } from "./ResellerProfile-CO7eES6t.js";
//#region src/components/reseller-account-form.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var cls = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
/**
* Reseller self-service account editor.
* Info + avatar go straight to the resellers row; email/password go to auth
* with no extra verification step (auto-confirm is enabled project-wide).
*/
function ResellerAccountForm({ reseller, email, onSaved }) {
	const [name, setName] = (0, import_react.useState)(reseller.business_name);
	const [phone, setPhone] = (0, import_react.useState)(reseller.contact_phone ?? "");
	const [address, setAddress] = (0, import_react.useState)(reseller.address ?? "");
	const [nid, setNid] = (0, import_react.useState)(reseller.nid_number ?? "");
	const [avatar, setAvatar] = (0, import_react.useState)(reseller.avatar_url ?? null);
	const [savingInfo, setSavingInfo] = (0, import_react.useState)(false);
	const [newEmail, setNewEmail] = (0, import_react.useState)(email ?? "");
	const [savingEmail, setSavingEmail] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [savingPass, setSavingPass] = (0, import_react.useState)(false);
	async function persistAvatar(url) {
		setAvatar(url);
		const { error } = await supabase.from("resellers").update({ avatar_url: url }).eq("id", reseller.id);
		if (error) return toast.error(error.message);
		const { data: auth } = await supabase.auth.getUser();
		if (auth.user) await supabase.from("profiles").update({ avatar_url: url }).eq("id", auth.user.id);
		toast.success(url ? "Profile picture updated" : "Profile picture removed");
		onSaved();
	}
	async function saveInfo(e) {
		e.preventDefault();
		if (!name.trim()) return toast.error("Name is required");
		setSavingInfo(true);
		const { error } = await supabase.from("resellers").update({
			business_name: name.trim(),
			contact_phone: phone.trim() || null,
			address: address.trim() || null,
			nid_number: nid.trim() || null
		}).eq("id", reseller.id);
		if (!error) {
			const { data: auth } = await supabase.auth.getUser();
			if (auth.user) await supabase.from("profiles").update({
				full_name: name.trim(),
				phone: phone.trim() || null
			}).eq("id", auth.user.id);
		}
		setSavingInfo(false);
		if (error) return toast.error(error.message);
		toast.success("Information updated");
		onSaved();
	}
	async function saveEmail(e) {
		e.preventDefault();
		const next = newEmail.trim().toLowerCase();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) return toast.error("Enter a valid email address");
		if (next === (email ?? "").toLowerCase()) return toast.message("This is already your email");
		setSavingEmail(true);
		const { error } = await supabase.auth.updateUser({ email: next });
		setSavingEmail(false);
		if (error) return toast.error(error.message);
		toast.success("Email updated");
		onSaved();
	}
	async function savePassword(e) {
		e.preventDefault();
		if (password.length < 6) return toast.error("Password must be at least 6 characters");
		if (password !== confirm) return toast.error("Passwords do not match");
		setSavingPass(true);
		const { error } = await supabase.auth.updateUser({ password });
		setSavingPass(false);
		if (error) return toast.error(error.message);
		setPassword("");
		setConfirm("");
		toast.success("Password updated");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: saveInfo,
			className: "surface-card space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Edit my information"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAvatar, {
						url: avatar,
						name,
						size: 64
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
							bucket: "avatars",
							folder: `avatars/${reseller.id}`,
							square: true,
							label: avatar ? "Change picture" : "Upload picture",
							hint: "Square image, auto-compressed",
							value: [],
							onChange: (v) => void persistAvatar(v[0]?.url ?? null)
						}), avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void persistAvatar(null),
							className: "mt-1 text-xs text-destructive underline",
							children: "Remove picture"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Name / business name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					className: cls,
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Mobile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						className: cls,
						placeholder: "01XXXXXXXXX"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "NID (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: nid,
						onChange: (e) => setNid(e.target.value),
						className: cls
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-medium",
					children: "Address"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: address,
					onChange: (e) => setAddress(e.target.value),
					rows: 2,
					className: cls
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: savingInfo,
					className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60",
					children: [savingInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save information"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: saveEmail,
				className: "surface-card space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Login email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						value: newEmail,
						onChange: (e) => setNewEmail(e.target.value),
						className: cls,
						placeholder: "you@example.com"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Changes instantly — no verification link needed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: savingEmail,
						className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60",
						children: [savingEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " Update email"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: savePassword,
				className: "surface-card space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Change password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: showPass ? "text" : "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring pr-10",
							placeholder: "New password",
							autoComplete: "new-password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowPass((v) => !v),
							className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted",
							"aria-label": showPass ? "Hide password" : "Show password",
							children: showPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: showPass ? "text" : "password",
						value: confirm,
						onChange: (e) => setConfirm(e.target.value),
						className: cls,
						placeholder: "Confirm new password",
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: savingPass,
						className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60",
						children: [savingPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), " Update password"]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/_authenticated/reseller/profile.tsx?tsr-split=component
function ResellerProfilePage() {
	const { user } = useAuth();
	const [data, setData] = (0, import_react.useState)(null);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)(void 0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [reload, setReload] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			setLoading(true);
			const { data: r } = await supabase.from("resellers").select("id,code,avatar_url,business_name,status,contact_phone,address,nid_number,commission_rate,leader_id,notes,created_at,approved_at,payout_method,payout_account_name,payout_account_number,payout_bank_name,payout_branch,payout_routing,deposit_required,deposit_required_amount,frozen_amount").eq("user_id", user.id).maybeSingle();
			if (!r) {
				setLoading(false);
				return;
			}
			let leaderName = null;
			if (r.leader_id) {
				const { data: l } = await supabase.from("resellers").select("business_name,code").eq("id", r.leader_id).maybeSingle();
				if (l) leaderName = `${l.business_name} (#${l.code})`;
			}
			const { data: vs } = await supabase.rpc("verify_state");
			const v = Array.isArray(vs) ? vs[0] : vs;
			setData({
				...r,
				commission_rate: Number(r.commission_rate),
				deposit_required_amount: Number(r.deposit_required_amount),
				frozen_amount: Number(r.frozen_amount),
				leader_name: leaderName,
				email: user.email ?? null,
				email_verified: Boolean(v?.email_verified_at),
				phone_verified: Boolean(v?.phone_verified_at)
			});
			const [sumRes, countRes] = await Promise.all([supabase.rpc("reseller_profit_summary", { _reseller_id: r.id }), supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("reseller_id", r.id)]);
			const row = Array.isArray(sumRes.data) ? sumRes.data[0] : sumRes.data;
			if (row) setSummary({
				delivered_profit: Number(row.delivered_profit),
				pending_payout: Number(row.pending_payout),
				paid_out: Number(row.paid_out),
				available: Number(row.available),
				deposit_balance: Number(row.deposit_balance),
				frozen_amount: Number(row.frozen_amount)
			});
			setOrders(countRes.count ?? 0);
			setLoading(false);
		})();
	}, [user, reload]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My profile",
			description: "Your unique reseller ID and full account information."
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Profile not found",
			description: "No reseller account is linked to this login."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAccountForm, {
			reseller: {
				id: data.id,
				business_name: data.business_name,
				contact_phone: data.contact_phone,
				address: data.address,
				nid_number: data.nid_number ?? null,
				avatar_url: data.avatar_url ?? null
			},
			email: data.email ?? null,
			onSaved: () => {
				clearAppDataCache();
				setReload((n) => n + 1);
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerProfile, {
			reseller: data,
			summary,
			orders
		})] })]
	});
}
//#endregion
export { ResellerProfilePage as component };
