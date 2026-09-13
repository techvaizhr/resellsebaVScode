import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { G as Save, Mt as LoaderCircle, Ut as KeyRound, gn as EyeOff, hn as Eye } from "./vendor-icons-BWIzFOtW.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { n as useSupplier } from "./supplier-context-BEx8Svyo.js";
//#region src/routes/_authenticated/supplier/profile.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function SupplierProfilePage() {
	const { data, reload } = useSupplier();
	const s = data.supplier;
	const [form, setForm] = (0, import_react.useState)({
		display_name: s.display_name ?? "",
		contact_phone: s.contact_phone ?? "",
		whatsapp: s.whatsapp ?? "",
		address: s.address ?? "",
		payout_method: s.payout_method ?? "bkash",
		payout_account_name: s.payout_account_name ?? "",
		payout_account_number: s.payout_account_number ?? "",
		payout_bank_name: s.payout_bank_name ?? "",
		payout_branch: s.payout_branch ?? "",
		payout_notes: s.payout_notes ?? ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPass, setShowPass] = (0, import_react.useState)(false);
	const [savingPass, setSavingPass] = (0, import_react.useState)(false);
	const isBank = form.payout_method === "bank";
	function set(k, v) {
		setForm((f) => ({
			...f,
			[k]: v
		}));
	}
	async function savePassword(e) {
		e.preventDefault();
		if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
		if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
		setSavingPass(true);
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		setSavingPass(false);
		if (error) return toast.error(error.message);
		setNewPassword("");
		setConfirmPassword("");
		toast.success("Password updated successfully");
	}
	async function save(e) {
		e.preventDefault();
		if (!form.display_name.trim()) return toast.error("Please enter a name");
		setBusy(true);
		const { error } = await supabase.from("suppliers").update({
			display_name: form.display_name,
			contact_phone: form.contact_phone || null,
			whatsapp: form.whatsapp || null,
			address: form.address || null,
			payout_method: form.payout_method,
			payout_account_name: form.payout_account_name || null,
			payout_account_number: form.payout_account_number || null,
			payout_bank_name: isBank ? form.payout_bank_name || null : null,
			payout_branch: isBank ? form.payout_branch || null : null,
			payout_notes: form.payout_notes || null
		}).eq("id", s.id);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Profile saved");
		await reload();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My profile",
			description: "Your contact and payout information."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Basic info"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium",
							children: ["Code: ", s.code]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
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
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: s.email ?? "",
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
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "Payout information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Method",
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
									label: "Note (optional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.payout_notes,
										onChange: (e) => set("payout_notes", e.target.value),
										className: inp
									})
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save profile"]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: savePassword,
			className: "surface-card mt-6 space-y-3 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-amber-500" }), " Change password"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Choose a strong password with at least 6 characters."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "New password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showPass ? "text" : "password",
								className: `${inp} pr-10`,
								placeholder: "At least 6 characters",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								minLength: 6,
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPass((v) => !v),
								className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground",
								"aria-label": showPass ? "Hide password" : "Show password",
								tabIndex: -1,
								children: showPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Confirm new password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: showPass ? "text" : "password",
							className: inp,
							placeholder: "Repeat new password",
							value: confirmPassword,
							onChange: (e) => setConfirmPassword(e.target.value),
							minLength: 6,
							required: true
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: savingPass || !newPassword,
						className: "inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50",
						children: [savingPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), "Update password"]
					})
				})
			]
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-medium",
		children: label
	}), children] });
}
//#endregion
export { SupplierProfilePage as component };
