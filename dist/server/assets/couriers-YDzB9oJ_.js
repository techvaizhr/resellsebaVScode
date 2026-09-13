import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CLBrUPi_.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, S as Store, Y as RefreshCw, a as Wallet, jn as Copy } from "./vendor-icons-DF2A5Z8S.js";
import { N as Switch$1, P as SwitchThumb } from "./vendor-ui-C-fytv-F.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { d as steadfastBalance, i as courierLabel, l as carrybeeStores, n as CourierLogo, u as pathaoStores } from "./courier-brand-CUjZM-4C.js";
//#region src/components/ui/switch.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
//#endregion
//#region src/routes/_authenticated/admin/couriers.tsx?tsr-split=component
/** Server fns reject with a raw Response; read its body so the toast is useful. */
async function errText(e, fallback) {
	if (e instanceof Response) try {
		const t = await e.text();
		if (t) return t;
	} catch {}
	return e instanceof Error && e.message ? e.message : fallback;
}
/** Pickup stores already saved in courier_configs.config.stores_json. */
function savedStores(config) {
	try {
		const raw = config?.stores_json;
		const list = typeof raw === "string" ? JSON.parse(raw) : raw;
		if (!Array.isArray(list)) return [];
		return list.map((s) => ({
			id: String(s?.id ?? ""),
			name: String(s?.name ?? s?.id ?? ""),
			address: "",
			isActive: true,
			isApproved: true,
			isDefaultPickup: false
		})).filter((s) => s.id);
	} catch {
		return [];
	}
}
var PROVIDER_ORDER = [
	"steadfast",
	"pathao",
	"carrybee"
];
var FIELDS = {
	steadfast: [{
		key: "api_key",
		label: "API Key"
	}, {
		key: "secret_key",
		label: "Secret Key"
	}],
	pathao: [
		{
			key: "client_id",
			label: "Client ID"
		},
		{
			key: "client_secret",
			label: "Client Secret"
		},
		{
			key: "username",
			label: "Username"
		},
		{
			key: "password",
			label: "Password"
		},
		{
			key: "store_id",
			label: "Default Store ID",
			hint: "Load stores, then set default"
		}
	],
	carrybee: [
		{
			key: "client_id",
			label: "Client ID"
		},
		{
			key: "client_secret",
			label: "Client Secret"
		},
		{
			key: "client_context",
			label: "Client Context"
		},
		{
			key: "store_id",
			label: "Default Pickup Store ID",
			hint: "Copy from store list"
		}
	]
};
function CouriersPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function load() {
		const { data } = await supabase.from("courier_configs").select("*").order("display_name");
		const sorted = [...data ?? []].filter((r) => PROVIDER_ORDER.includes(r.provider)).sort((a, b) => PROVIDER_ORDER.indexOf(a.provider) - PROVIDER_ORDER.indexOf(b.provider));
		setRows(sorted);
		setLoading(false);
	}
	async function save(row) {
		const { error } = await supabase.from("courier_configs").update({
			is_active: row.is_active,
			config: row.config
		}).eq("id", row.id);
		if (error) toast.error(error.message);
		else toast.success(`${row.display_name} saved`);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Courier providers",
		description: "Save credentials to enable direct booking from the admin panel."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: (rows ?? []).map((r, idx) => {
			const fields = FIELDS[r.provider] ?? [];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-md border bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourierLogo, {
									provider: r.provider,
									size: 26
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: courierLabel(r.provider) || r.display_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wide text-muted-foreground",
									children: r.provider
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: r.is_active,
									onCheckedChange: (v) => {
										const copy = [...rows];
										copy[idx] = {
											...r,
											is_active: v
										};
										setRows(copy);
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: r.is_active ? "Active" : "Inactive"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: f.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: f.type || "text",
							value: r.config?.[f.key] ?? "",
							placeholder: f.hint,
							onChange: (e) => {
								const copy = [...rows];
								copy[idx] = {
									...r,
									config: {
										...r.config,
										[f.key]: e.target.value
									}
								};
								setRows(copy);
							},
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] }, f.key))
					}),
					r.provider === "steadfast" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteadfastExtras, {
						token: r.config?.webhook_token ?? "",
						onToken: (t) => {
							const copy = [...rows];
							copy[idx] = {
								...r,
								config: {
									...r.config,
									webhook_token: t
								}
							};
							setRows(copy);
						}
					}),
					r.provider === "pathao" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathaoExtras, {
						config: r.config ?? {},
						onConfig: (patch) => {
							const copy = [...rows];
							copy[idx] = {
								...r,
								config: {
									...r.config,
									...patch
								}
							};
							setRows(copy);
						}
					}),
					r.provider === "carrybee" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarrybeeExtras, {
						config: r.config ?? {},
						onConfig: (patch) => {
							const copy = [...rows];
							copy[idx] = {
								...r,
								config: {
									...r.config,
									...patch
								}
							};
							setRows(copy);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => save(r),
						className: "btn-brand mt-4 rounded-md px-3 py-1.5 text-xs font-medium",
						children: "Save"
					})
				]
			}, r.id);
		})
	})] });
}
function SteadfastExtras({ token, onToken }) {
	const [balance, setBalance] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const getBalance = useServerFn(steadfastBalance);
	const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/public/courier/steadfast?token=${token || "<generate-token-first>"}`;
	function generate() {
		const bytes = /* @__PURE__ */ new Uint8Array(24);
		crypto.getRandomValues(bytes);
		onToken(Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""));
		toast.success("Token generated — remember to save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3 rounded-lg border bg-muted/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook Token"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						readOnly: true,
						value: token,
						placeholder: "Click generate button",
						className: "min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 font-mono text-[11px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: generate,
						className: "shrink-0 rounded-md border px-2 py-1.5 text-xs hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (!token) return;
							navigator.clipboard.writeText(token);
							toast.success("Token copied");
						},
						className: "shrink-0 rounded-md border p-1.5 hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook URL (set in Steadfast panel)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "flex-1 truncate rounded-md border bg-background px-2 py-1.5 text-[11px]",
					children: webhookUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						navigator.clipboard.writeText(webhookUrl);
						toast.success("Webhook URL copied");
					},
					className: "rounded-md border p-1.5 hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							const data = await (await fetch("/api/public/courier/actions?action=steadfast-balance")).json();
							if (data && data.success && typeof data.balance === "number") {
								setBalance(data.balance);
								toast.success(`Steadfast Balance: ৳${data.balance.toFixed(2)}`);
							} else {
								const r = await getBalance();
								setBalance(r?.balance ?? 0);
								toast.success(`Steadfast Balance: ৳${(r?.balance ?? 0).toFixed(2)}`);
							}
						} catch (e) {
							try {
								const r = await getBalance();
								setBalance(r?.balance ?? 0);
							} catch (e2) {
								toast.error(await errText(e2, "Balance fetch failed"));
							}
						} finally {
							setBusy(false);
						}
					},
					className: "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), "Check balance"]
				}), balance !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold",
					children: ["৳", balance.toFixed(2)]
				})]
			})
		]
	});
}
function CarrybeeExtras({ config, onConfig }) {
	const [stores, setStores] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const loadStores = useServerFn(carrybeeStores);
	(0, import_react.useEffect)(() => {
		if (stores.length === 0) setStores(savedStores(config));
	}, [config?.stores_json]);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const secret = config?.webhook_secret ?? "";
	const webhookUrl = `${origin}/api/public/courier/carrybee`;
	function generate() {
		const bytes = /* @__PURE__ */ new Uint8Array(24);
		crypto.getRandomValues(bytes);
		onConfig({ webhook_secret: Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("") });
		toast.success("Secret generated — remember to save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3 rounded-lg border bg-muted/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook Secret"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: secret,
						onChange: (e) => onConfig({ webhook_secret: e.target.value }),
						placeholder: "Generate or paste secret from Carrybee panel",
						className: "min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 font-mono text-[11px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: generate,
						className: "shrink-0 rounded-md border px-2 py-1.5 text-xs hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (!secret) return;
							navigator.clipboard.writeText(secret);
							toast.success("Secret copied");
						},
						className: "shrink-0 rounded-md border p-1.5 hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook URL (Carrybee → Webhook Integration)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "flex-1 truncate rounded-md border bg-background px-2 py-1.5 text-[11px]",
					children: webhookUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						navigator.clipboard.writeText(webhookUrl);
						toast.success("Webhook URL copied");
					},
					className: "rounded-md border p-1.5 hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							let list = [];
							let defStore = "";
							const data = await (await fetch("/api/public/courier/actions?action=carrybee-stores")).json();
							if (data && data.success && Array.isArray(data.stores)) {
								list = data.stores;
								defStore = data.defaultStoreId || "";
							} else {
								const r = await loadStores();
								list = r?.stores ?? [];
								defStore = r?.defaultStoreId || "";
							}
							setStores(list);
							const saved = list.map((s) => ({
								id: String(s.id),
								name: String(s.name)
							}));
							onConfig({
								stores_json: JSON.stringify(saved),
								...defStore ? { store_id: String(defStore) } : {}
							});
							if (list.length === 0) toast.info("No stores — create one in the Carrybee panel");
							else toast.success(`${list.length} Carrybee stores loaded`);
						} catch (e) {
							try {
								const list = (await loadStores())?.stores ?? [];
								setStores(list);
								if (list.length > 0) toast.success(`${list.length} Carrybee stores loaded`);
							} catch (e2) {
								toast.error(await errText(e2, "Failed to load store list"));
							}
						} finally {
							setBusy(false);
						}
					},
					className: "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }), "Load pickup stores"]
				})
			}),
			(stores ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y rounded-md border bg-background",
				children: (stores ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 px-2 py-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-[10px] text-muted-foreground",
							children: s.id
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							s.isDefaultPickup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary",
								children: "default"
							}),
							!s.isApproved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-600",
								children: "unapproved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									onConfig({ store_id: s.id });
									toast.success("Default store set — remember to save");
								},
								className: `rounded-md border px-2 py-0.5 text-[10px] hover:bg-accent ${config?.store_id === s.id ? "border-primary bg-primary/10 text-primary" : ""}`,
								children: config?.store_id === s.id ? "Default" : "Set default"
							})
						]
					})]
				}, s.id))
			})
		]
	});
}
function PathaoExtras({ config, onConfig }) {
	const [stores, setStores] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const loadStores = useServerFn(pathaoStores);
	(0, import_react.useEffect)(() => {
		if (stores.length === 0) setStores(savedStores(config));
	}, [config?.stores_json]);
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const secret = config?.webhook_secret ?? "";
	const webhookUrl = `${origin}/api/public/courier/pathao`;
	function generate() {
		const bytes = /* @__PURE__ */ new Uint8Array(24);
		crypto.getRandomValues(bytes);
		onConfig({ webhook_secret: Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("") });
		toast.success("Secret generated — remember to save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 space-y-3 rounded-lg border bg-muted/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook Secret"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: secret,
						onChange: (e) => onConfig({ webhook_secret: e.target.value }),
						placeholder: "Generate or paste secret from Pathao panel",
						className: "min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 font-mono text-[11px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: generate,
						className: "shrink-0 rounded-md border px-2 py-1.5 text-xs hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (!secret) return;
							navigator.clipboard.writeText(secret);
							toast.success("Secret copied");
						},
						className: "shrink-0 rounded-md border p-1.5 hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-xs font-medium",
				children: "Webhook URL (Pathao → Webhook Integration)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "flex-1 truncate rounded-md border bg-background px-2 py-1.5 text-[11px]",
					children: webhookUrl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						navigator.clipboard.writeText(webhookUrl);
						toast.success("Webhook URL copied");
					},
					className: "rounded-md border p-1.5 hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							let list = [];
							let defStore = "";
							const data = await (await fetch("/api/public/courier/actions?action=pathao-stores")).json();
							if (data && data.success && Array.isArray(data.stores)) {
								list = data.stores;
								defStore = data.defaultStoreId || "";
							} else {
								const r = await loadStores();
								list = r?.stores ?? [];
								defStore = r?.defaultStoreId || "";
							}
							setStores(list);
							const saved = list.map((s) => ({
								id: String(s.id),
								name: String(s.name)
							}));
							onConfig({
								stores_json: JSON.stringify(saved),
								...defStore ? { store_id: String(defStore) } : {}
							});
							if (list.length === 0) toast.info("No stores — create one in the Pathao panel");
							else toast.success(`${list.length} Pathao stores loaded`);
						} catch (e) {
							try {
								const list = (await loadStores())?.stores ?? [];
								setStores(list);
								if (list.length > 0) toast.success(`${list.length} Pathao stores loaded`);
							} catch (e2) {
								toast.error(await errText(e2, "Failed to load store list"));
							}
						} finally {
							setBusy(false);
						}
					},
					className: "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5" }), "Load stores"]
				})
			}),
			(stores ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y rounded-md border bg-background",
				children: (stores ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 px-2 py-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate font-mono text-[10px] text-muted-foreground",
							children: [
								s.id,
								" · ",
								s.address
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [!s.isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-600",
							children: "inactive"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								onConfig({ store_id: s.id });
								toast.success("Default store set — remember to save");
							},
							className: `rounded-md border px-2 py-0.5 text-[10px] hover:bg-accent ${config?.store_id === s.id ? "border-primary bg-primary/10 text-primary" : ""}`,
							children: config?.store_id === s.id ? "Default" : "Set default"
						})]
					})]
				}, s.id))
			})
		]
	});
}
//#endregion
export { CouriersPage as component };
