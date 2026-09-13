import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Et as Mail, Nt as LoaderCircle, S as Store } from "./vendor-icons-DF2A5Z8S.js";
import { n as getGlobalSettings } from "./app-data-CvK0k1d4.js";
import { n as useAuth } from "./use-auth-CSAYNNFO.js";
import { t as clearImpersonation } from "./impersonation-BCIusdjz.js";
import { i as resellerStatusLabel, r as resellerStatusClass } from "./reseller-status-Cim1Uohp.js";
import { t as useVerification } from "./use-verification-COwSORFz.js";
//#region src/routes/_authenticated/onboarding.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, roles, permissions, loading } = useAuth();
	const { required: needsVerify, loading: verifyLoading } = useVerification();
	const nav = useNavigate();
	const [businessName, setBusinessName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [payoutMethod, setPayoutMethod] = (0, import_react.useState)("bkash");
	const [payoutAccountName, setPayoutAccountName] = (0, import_react.useState)("");
	const [payoutAccountNumber, setPayoutAccountNumber] = (0, import_react.useState)("");
	const [payoutBankName, setPayoutBankName] = (0, import_react.useState)("");
	const [payoutBranch, setPayoutBranch] = (0, import_react.useState)("");
	const [payoutRouting, setPayoutRouting] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("none");
	const [storePrefix, setStorePrefix] = (0, import_react.useState)("/s/");
	(0, import_react.useEffect)(() => {
		if (!verifyLoading && needsVerify) nav({
			to: "/verify",
			replace: true
		});
	}, [
		needsVerify,
		verifyLoading,
		nav
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") setStorePrefix(`${window.location.host}/s/`);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const { data } = await supabase.from("resellers").select("status").eq("user_id", user.id).maybeSingle();
			if (!data) return;
			if (data.status === "pending") {
				const { data: auto } = await supabase.rpc("reseller_auto_approve");
				if (auto === true) {
					const { data: promoted } = await supabase.from("resellers").update({
						status: "active",
						approved_at: (/* @__PURE__ */ new Date()).toISOString()
					}).eq("user_id", user.id).select("status").maybeSingle();
					if (promoted?.status === "active") {
						setStatus("active");
						return;
					}
				}
			}
			setStatus(data.status);
		})();
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		const isSuperAdmin = roles.includes("super_admin");
		const isStaff = roles.includes("staff");
		if (isSuperAdmin || isStaff) nav({
			to: "/admin",
			replace: true
		});
		else if (status === "active") nav({
			to: "/reseller",
			replace: true
		});
	}, [
		loading,
		roles,
		permissions,
		status,
		nav
	]);
	async function signOut() {
		clearImpersonation();
		await supabase.auth.signOut();
		nav({
			to: "/login",
			replace: true
		});
	}
	async function submit(e) {
		e.preventDefault();
		if (!user) return;
		setBusy(true);
		try {
			const isBank = payoutMethod === "bank";
			const payload = {
				business_name: businessName,
				code: code.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
				contact_phone: phone,
				status: "pending",
				payout_method: payoutMethod,
				payout_account_name: payoutAccountName || null,
				payout_account_number: payoutAccountNumber || null,
				payout_bank_name: isBank ? payoutBankName || null : null,
				payout_branch: isBank ? payoutBranch || null : null,
				payout_routing: isBank ? payoutRouting || null : null
			};
			const { data: existing } = await supabase.from("resellers").select("id").eq("user_id", user.id).maybeSingle();
			const { error } = existing ? await supabase.from("resellers").update(payload).eq("user_id", user.id) : await supabase.from("resellers").insert({
				user_id: user.id,
				...payload
			});
			if (error) throw error;
			const { data: saved } = await supabase.from("resellers").select("status").eq("user_id", user.id).maybeSingle();
			const next = saved?.status ?? "pending";
			setStatus(next);
			if (next === "active") {
				toast.success("Your store is approved — welcome!");
				nav({
					to: "/reseller",
					replace: true
				});
			} else toast.success("Application submitted! Admin will review and approve it.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	if (status === "pending" || status === "suspended" || status === "rejected") {
		const info = status === "pending" ? {
			title: "Approval pending",
			text: "Your registration was successful. You will get access to the reseller panel once the super admin reviews and approves your store."
		} : status === "suspended" ? {
			title: "Account deactivated",
			text: "Your reseller account is currently deactivated. Contact the admin to reactivate it."
		} : {
			title: "Application rejected",
			text: "Your reseller application could not be approved at this time. Contact support for details."
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-h-screen place-items-center px-4",
			style: { background: "var(--gradient-hero)" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-8 text-center shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
							children: status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-6 w-6 opacity-40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight",
							children: info.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[11px] font-medium ${resellerStatusClass(status)}`,
								children: resellerStatusLabel(status)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: info.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactButton, { variant: "whatsapp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactButton, { variant: "email" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 border-t pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void signOut(),
								className: "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
								children: "Sign out from this account"
							})
						})
					]
				})
			})
		});
	}
	function ContactButton({ variant }) {
		const [contact, setContact] = (0, import_react.useState)(null);
		(0, import_react.useEffect)(() => {
			getGlobalSettings().then((data) => setContact({
				phone: data?.contact_phone ?? null,
				email: data?.contact_email ?? null
			}));
		}, []);
		if (variant === "whatsapp") {
			const phone = contact?.phone?.replace(/\D/g, "");
			if (!phone) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `https://wa.me/${phone}`,
				target: "_blank",
				rel: "noreferrer",
				className: "flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 py-2.5 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					className: "h-4 w-4 fill-current",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
				}), "WhatsApp"]
			});
		}
		if (variant === "email") {
			if (!contact?.email) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `mailto:${contact.email}`,
				className: "flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), "Email Support"]
			});
		}
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		style: { background: "var(--gradient-hero)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-semibold tracking-tight",
							children: "Become a reseller"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Set up your store in 2 minutes"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Business name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
								value: businessName,
								onChange: (e) => setBusinessName(e.target.value),
								placeholder: "My Fashion Store"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Store code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "border-r bg-muted px-3 py-2 text-xs text-muted-foreground",
									children: storePrefix
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									className: "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
									value: code,
									onChange: (e) => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")),
									placeholder: "my-store",
									pattern: "[a-z0-9-]+"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Contact phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "01XXXXXXXXX"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 text-sm font-semibold",
										children: "Payout information"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-xs text-muted-foreground",
										children: "We will send your earnings to this account. You can change it later in settings."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium",
										children: "Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: payoutMethod,
										onChange: (e) => setPayoutMethod(e.target.value),
										className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
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
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid gap-2 md:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: "Account holder name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: payoutAccountName,
											onChange: (e) => setPayoutAccountName(e.target.value),
											className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
											placeholder: "Full name"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: payoutMethod === "bank" ? "Account number" : "Mobile number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: payoutAccountNumber,
											onChange: (e) => setPayoutAccountNumber(e.target.value),
											className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring",
											placeholder: payoutMethod === "bank" ? "1234567890" : "01XXXXXXXXX"
										})] })]
									}),
									payoutMethod === "bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid gap-2 md:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-medium",
												children: "Bank name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: payoutBankName,
												onChange: (e) => setPayoutBankName(e.target.value),
												className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-medium",
												children: "Branch"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: payoutBranch,
												onChange: (e) => setPayoutBranch(e.target.value),
												className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "mb-1 block text-xs font-medium",
												children: "Routing"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: payoutRouting,
												onChange: (e) => setPayoutRouting(e.target.value),
												className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
											})] })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: busy,
								className: "btn-brand mt-4 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-50",
								children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Submit application"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 border-t pt-4 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void signOut(),
							className: "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
							children: "Sign out from this account"
						})
					})
				]
			})
		})
	});
}
//#endregion
export { Onboarding as component };
