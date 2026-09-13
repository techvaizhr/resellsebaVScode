import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useNavigate } from "./useNavigate-GQPu3B30.js";
import { r as supabase } from "./client-B8ZbbxaQ.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Et as Mail, H as Send, I as ShieldCheck, Nt as LoaderCircle, O as Smartphone, kt as LogOut } from "./vendor-icons-DF2A5Z8S.js";
import { t as useVerification } from "./use-verification-COwSORFz.js";
import { t as sendVerificationCode } from "./verification.functions-BhiEftGu.js";
//#region src/routes/_authenticated/verify.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const nav = useNavigate();
	const send = useServerFn(sendVerificationCode);
	const { pending, loading, refresh } = useVerification();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [codes, setCodes] = (0, import_react.useState)({
		email: "",
		sms: ""
	});
	(0, import_react.useEffect)(() => {
		if (!loading && pending.length === 0) nav({
			to: "/dashboard",
			replace: true
		});
	}, [
		loading,
		pending.length,
		nav
	]);
	async function request(channel) {
		setBusy(`send-${channel}`);
		try {
			const res = await send({ data: { channel } });
			if (!res.ok) toast.error(res.error ?? "Could not send the code");
			else toast.success(`Code sent — ${res.target}`);
			await refresh();
		} catch (e) {
			toast.error(e?.message ?? "Could not send the code");
		} finally {
			setBusy(null);
		}
	}
	async function check(channel) {
		const code = (codes[channel] ?? "").trim();
		if (code.length < 4) return toast.error("Enter the code");
		setBusy(`check-${channel}`);
		const { data, error } = await supabase.rpc("verify_check", {
			_channel: channel,
			_code: code
		});
		setBusy(null);
		if (error) return toast.error(error.message);
		if (!data) return toast.error("Code did not match or expired — request a new one");
		toast.success("Verified!");
		setCodes((c) => ({
			...c,
			[channel]: ""
		}));
		await refresh();
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4 py-10",
		style: { background: "var(--gradient-hero)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-center text-2xl font-semibold tracking-tight",
						children: "Verify your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-center text-sm text-muted-foreground",
						children: "Complete the steps below before entering the panel."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-4",
						children: pending.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-medium",
									children: [channel === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" }), channel === "email" ? "Email verification" : "Mobile (SMS) verification"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "w-full rounded-md border bg-background px-3 py-2 text-sm tracking-[0.3em] outline-none focus:ring-2 focus:ring-ring",
										placeholder: "6-digit code",
										inputMode: "numeric",
										maxLength: 6,
										value: codes[channel] ?? "",
										onChange: (e) => setCodes((c) => ({
											...c,
											[channel]: e.target.value.replace(/\D/g, "")
										}))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => check(channel),
										disabled: busy !== null,
										className: "btn-brand inline-flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
										children: [busy === `check-${channel}` && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Verify"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => request(channel),
									disabled: busy !== null,
									className: "mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50",
									children: [busy === `send-${channel}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3" }), "Send code / resend"]
								})
							]
						}, channel))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await supabase.auth.signOut();
							nav({
								to: "/login",
								replace: true
							});
						},
						className: "mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Log out"]
					})
				]
			})
		})
	});
}
//#endregion
export { VerifyPage as component };
