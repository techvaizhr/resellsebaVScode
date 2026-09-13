import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-BAn7XKYw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, Tt as Mail, bn as EyeOff, xr as ArrowLeft, yn as Eye } from "./vendor-icons-BEaCFqaT.js";
import { t as Route } from "./login-DcSbyM5U.js";
import { r as fetchAdvancedSettings } from "./advanced-settings-E7mGKUEJ.js";
import { t as sendVerificationCode } from "./verification.functions-BW-55SYq.js";
import { t as Brand } from "./public-header-DWQxJ_Jb.js";
//#region src/routes/login.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Makes sure the signed-in user has a reseller/supplier record + role. Safe to call repeatedly. */
async function ensureAccount() {
	try {
		await supabase.rpc("bootstrap_current_user");
	} catch {}
}
function AuthPage() {
	const nav = useNavigate();
	const search = Route.useSearch();
	const [mode, setMode] = (0, import_react.useState)(search.mode === "signup" ? "signup" : "signin");
	const [accountType, setAccountType] = (0, import_react.useState)("reseller");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sentEmail, setSentEmail] = (0, import_react.useState)(null);
	const [brand, setBrand] = (0, import_react.useState)({
		siteName: "Reseller",
		logoUrl: null
	});
	const sendCode = useServerFn(sendVerificationCode);
	(0, import_react.useEffect)(() => {
		supabase.from("global_settings").select("site_name, logo_url").eq("id", 1).maybeSingle().then(({ data }) => {
			if (data) setBrand({
				siteName: data.site_name ?? "Reseller",
				logoUrl: data.logo_url ?? null
			});
		});
	}, []);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				let defaultTarget = "/dashboard";
				const u = data.session.user;
				const role = u?.role;
				const roles = u?.roles || [];
				if (role === "supplier" || roles.includes("supplier") || u?.supplier) defaultTarget = "/supplier";
				else if (role === "super_admin" || roles.includes("super_admin") || role === "staff" || roles.includes("staff")) defaultTarget = "/admin";
				const target = search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("/login") ? search.redirect : defaultTarget;
				nav({
					to: target,
					replace: true
				});
			}
		});
	}, [nav, search.redirect]);
	(0, import_react.useEffect)(() => {
		if (search.mode && (search.mode === "signin" || search.mode === "signup")) setMode(search.mode);
	}, [search.mode]);
	async function onForgotSubmit(e) {
		e.preventDefault();
		if (!email.trim() && !phone.trim()) return toast.error("Please enter your email or phone number");
		if (password.length < 6) return toast.error("Password must be at least 6 characters");
		if (password !== confirmPassword) return toast.error("Passwords do not match");
		setBusy(true);
		try {
			const payload = { password };
			if (email.includes("@")) payload.email = email.trim().toLowerCase();
			else payload.phone = email.trim() || phone.trim();
			const { error } = await supabase.rpc("admin_set_user_password", {
				_user_id: email.trim(),
				_password: password
			}).catch(() => ({ error: null }));
			if (error) throw new Error(error.message);
			toast.success("Password reset successfully! Please log in.");
			setPassword("");
			setConfirmPassword("");
			setMode("signin");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to reset password");
		} finally {
			setBusy(false);
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (mode === "forgot") return onForgotSubmit(e);
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/login`,
						data: {
							full_name: name,
							phone,
							account_type: accountType
						}
					}
				});
				if (error) throw error;
				if (!data.session) setSentEmail(email);
				else {
					await ensureAccount();
					const adv = await fetchAdvancedSettings();
					if (adv.verifyEnabled && (adv.verifyEmail || adv.verifySms)) {
						if (adv.verifyEmail) await sendCode({ data: { channel: "email" } }).catch(() => null);
						if (adv.verifySms) await sendCode({ data: { channel: "sms" } }).catch(() => null);
						toast.success("Account created — now verify it");
						nav({
							to: "/verify",
							replace: true
						});
					} else {
						toast.success("Account created!");
						nav({
							to: accountType === "supplier" ? "/supplier" : "/dashboard",
							replace: true
						});
					}
				}
			} else {
				const { data: signInData, error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				await ensureAccount();
				toast.success("Welcome!");
				let defaultTarget = "/dashboard";
				const role = signInData?.user?.role;
				const roles = signInData?.user?.roles || [];
				if (role === "supplier" || roles.includes("supplier") || signInData?.user?.supplier) defaultTarget = "/supplier";
				else if (role === "super_admin" || roles.includes("super_admin") || role === "staff" || roles.includes("staff")) defaultTarget = "/admin";
				const target = search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("/login") ? search.redirect : defaultTarget;
				nav({
					to: target,
					replace: true
				});
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	if (sentEmail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		style: { background: "var(--gradient-hero)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold",
						children: "Verify your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: [
							"We sent a verification link to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: sentEmail
							}),
							". Open the email and click the link, then come back here to log in."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "(If you don't see it, check your spam / promotions folder)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setSentEmail(null);
							setMode("signin");
						},
						className: "btn-brand mt-6 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium",
						children: "Go to login page"
					})
				]
			})
		})
	});
	const isSignup = mode === "signup";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4",
		style: { background: "var(--gradient-hero)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to homepage"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-5 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
								siteName: brand.siteName,
								logoUrl: brand.logoUrl
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: mode === "forgot" ? "Reset your password" : isSignup ? "Create a new account" : "Log in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: mode === "forgot" ? "Enter your email or phone number and set a new password." : isSignup ? "Register with the details below — it only takes a few seconds." : "Sign in with your email and password."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "mt-6 space-y-3",
							children: [
								isSignup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Account type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [[
												"reseller",
												"Reseller",
												"I will run my own store"
											], [
												"supplier",
												"Supplier",
												"I will supply products"
											]].map(([key, label, hint]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setAccountType(key),
												className: "rounded-md border px-3 py-2 text-left text-xs transition-colors " + (accountType === key ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-sm font-medium",
													children: label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: hint
												})]
											}, key))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Your name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: inp,
											placeholder: "e.g. John Doe",
											value: name,
											onChange: (e) => setName(e.target.value),
											required: true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone number",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: inp,
											placeholder: "01XXXXXXXXX",
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											required: true
										})
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: mode === "forgot" ? "Email or phone number" : "Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: mode === "forgot" ? "text" : "email",
										className: inp,
										placeholder: mode === "forgot" ? "you@example.com or 01XXXXXXXXX" : "you@example.com",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: mode === "forgot" ? "New password" : "Password",
									hint: isSignup || mode === "forgot" ? "At least 6 characters" : void 0,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: showPassword ? "text" : "password",
											className: `${inp} pr-10`,
											placeholder: "••••••••",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											minLength: 6,
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPassword((v) => !v),
											className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
											"aria-label": showPassword ? "Hide password" : "Show password",
											tabIndex: -1,
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										})]
									})
								}),
								mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Confirm new password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showPassword ? "text" : "password",
										className: inp,
										placeholder: "••••••••",
										value: confirmPassword,
										onChange: (e) => setConfirmPassword(e.target.value),
										minLength: 6,
										required: true
									})
								}),
								mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMode("forgot"),
										className: "text-xs font-medium text-muted-foreground hover:text-primary hover:underline",
										children: "Forgot password?"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: busy,
									className: "btn-brand flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-50",
									children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), mode === "forgot" ? "Reset password" : isSignup ? "Register" : "Log in"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-center text-sm text-muted-foreground",
							children: mode === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Remember your password?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMode("signin"),
									className: "font-medium text-primary hover:underline",
									children: "Log in"
								})
							] }) : isSignup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMode("signin"),
									className: "font-medium text-primary hover:underline",
									children: "Log in"
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"New here?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMode("signup"),
									className: "font-medium text-primary hover:underline",
									children: "Register"
								})
							] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: "By signing in, you agree to our terms and privacy policy."
				})
			]
		})
	});
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-1 flex items-center justify-between text-xs font-medium",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: hint
		})]
	}), children] });
}
//#endregion
export { AuthPage as component };
