import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { r as supabase, s as createSsrRpc } from "./client-BZQd8T2B.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CuZqyT13.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Et as Mail, H as Send, Nt as LoaderCircle, bt as MessageSquare } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
//#region src/lib/notifications.functions.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	orderId: stringType().uuid(),
	template: stringType().optional()
}).parse(d)).handler(createSsrRpc("6d957b9ba12c3420c9630abe8ef0652bbdf5e9715365b43336be564eb0b88891"));
var sendTestNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	configId: stringType().uuid(),
	to: stringType().min(3)
}).parse(d)).handler(createSsrRpc("b3f65dc7e408d66c19ba4b4808a75ccd758898f7c3060c9742d56016735f0843"));
//#endregion
//#region src/routes/_authenticated/admin/notifications.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var SMS_PROVIDERS = [{
	value: "bulksmsbd",
	label: "BulkSMSBD",
	fields: ["api_key", "sender_id"]
}, {
	value: "sslsms",
	label: "SSL Wireless",
	fields: ["api_token", "sid"]
}];
var EMAIL_PROVIDERS = [{
	value: "resend",
	label: "Resend",
	fields: ["api_key"]
}];
function NotificationsPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const runTest = useServerFn(sendTestNotification);
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function load() {
		setLoading(true);
		const { data } = await supabase.from("notification_configs").select("*").is("reseller_id", null);
		const map = new Map((data ?? []).map((r) => [r.channel, r]));
		setRows([{
			channel: "sms",
			provider: "bulksmsbd",
			is_active: false,
			from_name: "",
			from_value: "",
			config: {}
		}, {
			channel: "email",
			provider: "resend",
			is_active: false,
			from_name: "",
			from_value: "",
			config: {}
		}].map((d) => {
			const f = map.get(d.channel);
			return f ? {
				id: f.id,
				channel: d.channel,
				provider: f.provider,
				is_active: f.is_active,
				from_name: f.from_name || "",
				from_value: f.from_value || "",
				config: f.config || {}
			} : d;
		}));
		setLoading(false);
	}
	async function save(r) {
		const payload = {
			reseller_id: null,
			channel: r.channel,
			provider: r.provider,
			is_active: r.is_active,
			from_name: r.from_name || null,
			from_value: r.from_value || null,
			config: r.config
		};
		const { error } = r.id ? await supabase.from("notification_configs").update(payload).eq("id", r.id) : await supabase.from("notification_configs").insert(payload);
		if (error) toast.error(error.message);
		else {
			toast.success("Saved");
			load();
		}
	}
	async function test(r) {
		if (!r.id) return toast.error("Save first");
		const to = window.prompt(r.channel === "sms" ? "Test phone number:" : "Test email:");
		if (!to) return;
		try {
			await runTest({ data: {
				configId: r.id,
				to
			} });
			toast.success("Test sent");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: "SMS + email providers for order alerts. Resellers can override in their own settings."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: rows.map((r, idx) => {
			const providers = r.channel === "sms" ? SMS_PROVIDERS : EMAIL_PROVIDERS;
			const current = providers.find((p) => p.value === r.provider) || providers[0];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary",
								children: r.channel === "sms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 font-semibold capitalize",
								children: r.channel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: r.is_active,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											is_active: e.target.checked
										};
										setRows(c);
									}
								}), " Active"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Provider",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: r.provider,
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											provider: e.target.value,
											config: {}
										};
										setRows(c);
									},
									className: inp,
									children: providers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.value,
										children: p.label
									}, p.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "From name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: r.from_name,
										onChange: (e) => {
											const c = [...rows];
											c[idx] = {
												...r,
												from_name: e.target.value
											};
											setRows(c);
										},
										className: inp
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: r.channel === "sms" ? "Sender ID (fallback)" : "From email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: r.from_value,
										onChange: (e) => {
											const c = [...rows];
											c[idx] = {
												...r,
												from_value: e.target.value
											};
											setRows(c);
										},
										className: inp
									})
								})]
							}),
							current.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: f,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: f.includes("key") || f.includes("token") ? "password" : "text",
									value: r.config[f] || "",
									onChange: (e) => {
										const c = [...rows];
										c[idx] = {
											...r,
											config: {
												...r.config,
												[f]: e.target.value
											}
										};
										setRows(c);
									},
									className: inp
								})
							}, f))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => save(r),
							className: "btn-brand rounded-md px-3 py-1.5 text-xs font-medium",
							children: "Save"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => test(r),
							className: "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3" }), " Send test"]
						})]
					})
				]
			}, r.channel);
		})
	})] });
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-medium capitalize",
		children: label.replace(/_/g, " ")
	}), children] });
}
//#endregion
export { NotificationsPage as component };
