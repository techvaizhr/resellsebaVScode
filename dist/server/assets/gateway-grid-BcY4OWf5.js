import { r as supabase } from "./client-CdRSQB5v.js";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.js";
import { t as GATEWAYS } from "./registry-UF_sjTj7.js";
import { a as testGatewayConnection } from "./gateways.functions-Ca4Yq9Hr.js";
import { n as paymentLogo, t as PaymentLogo } from "./payment-brand-ChxX82bm.js";
import { t as AppModal } from "./AppModal-C8qUvQNk.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Eye, EyeOff, Loader2, Plug, Settings2, XCircle, Zap } from "lucide-react";
//#region src/components/payments/shared.tsx
/** Small shared primitives for the payment settings screens. */
var field = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";
function Label({ children, required }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children: [
			children,
			" ",
			required && /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: "*"
			})
		]
	});
}
function StatusDot({ on }) {
	return /* @__PURE__ */ jsx("span", {
		className: "inline-block h-2 w-2 rounded-full " + (on ? "bg-success" : "bg-muted-foreground/40"),
		"aria-hidden": true
	});
}
function Switch({ checked, onChange, label }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"aria-label": label,
		onClick: () => onChange(!checked),
		className: "relative h-6 w-11 shrink-0 rounded-full transition-colors " + (checked ? "bg-primary" : "bg-muted-foreground/30"),
		children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all " + (checked ? "left-[22px]" : "left-0.5") })
	});
}
function SecretInput({ value, onChange, placeholder, secret, multiline }) {
	const [show, setShow] = React.useState(false);
	if (multiline) return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("textarea", {
			rows: 3,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			spellCheck: false,
			className: field + (secret && !show ? " [-webkit-text-security:disc]" : "") + " font-mono text-[11px]"
		}), secret && /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			className: "absolute right-2 top-2 text-muted-foreground hover:text-foreground",
			"aria-label": show ? "Hide value" : "Show value",
			children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("input", {
			type: secret && !show ? "password" : "text",
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			autoComplete: "off",
			spellCheck: false,
			className: field + (secret ? " pr-9" : "")
		}), secret && /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
			"aria-label": show ? "Hide value" : "Show value",
			children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
		})]
	});
}
//#endregion
//#region src/components/payments/gateway-grid.tsx
function blank(spec, mode = "own") {
	return {
		id: "",
		provider: spec.provider,
		label: spec.label,
		api_key: "",
		api_secret: "",
		merchant_id: "",
		config: {},
		is_active: false,
		mode
	};
}
function readField(row, spec) {
	if (spec.path.startsWith("config.")) {
		const v = row.config?.[spec.path.slice(7)];
		return typeof v === "string" ? v : "";
	}
	return row[spec.path] ?? "";
}
function writeField(row, spec, value) {
	if (spec.path.startsWith("config.")) return {
		...row,
		config: {
			...row.config ?? {},
			[spec.path.slice(7)]: value
		}
	};
	return {
		...row,
		[spec.path]: value
	};
}
var missingFields = (spec, row) => row.mode === "platform" ? [] : spec.fields.filter((f) => f.required && !readField(row, f).trim());
async function persist(spec, row, is_active, resellerId) {
	const usesPlatform = row.mode === "platform";
	const payload = {
		provider: spec.provider,
		label: (row.label || spec.label).trim(),
		api_key: usesPlatform ? null : row.api_key || null,
		api_secret: usesPlatform ? null : row.api_secret || null,
		merchant_id: usesPlatform ? null : row.merchant_id || null,
		config: {
			...row.config ?? {},
			base_url: String(row.config?.base_url ?? "").trim() || null
		},
		is_active,
		mode: resellerId ? row.mode : "own",
		reseller_id: resellerId
	};
	return row.id ? supabase.from("payment_gateway_configs").update(payload).eq("id", row.id) : supabase.from("payment_gateway_configs").insert(payload);
}
function GatewayGrid({ onCountChange, resellerId = null, platformActive }) {
	const isReseller = Boolean(resellerId);
	const [rows, setRows] = useState({});
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(null);
	async function load() {
		const query = supabase.from("payment_gateway_configs").select("id,provider,label,api_key,api_secret,merchant_id,config,is_active,mode");
		const { data, error } = resellerId ? await query.eq("reseller_id", resellerId) : await query.is("reseller_id", null);
		if (error) toast.error(error.message);
		const next = {};
		for (const spec of GATEWAYS) {
			const found = (data ?? []).find((r) => r.provider === spec.provider);
			next[spec.provider] = found ? {
				...found,
				mode: (found.mode ?? "own") === "platform" ? "platform" : "own",
				config: found.config ?? {}
			} : blank(spec, isReseller ? "platform" : "own");
		}
		setRows(next);
		setLoading(false);
	}
	useEffect(() => {
		load();
	}, [resellerId]);
	const active = useMemo(() => Object.values(rows).filter((r) => r.is_active).length, [rows]);
	useEffect(() => onCountChange?.(active), [active, onCountChange]);
	async function toggle(spec, next) {
		const row = rows[spec.provider] ?? blank(spec, isReseller ? "platform" : "own");
		if (next) {
			if (isReseller && row.mode === "platform" && platformActive && !platformActive.includes(spec.provider)) {
				toast.error(`${spec.label} is not enabled by the platform — add your own credentials instead.`);
				setEditing(spec.provider);
				return;
			}
			const missing = missingFields(spec, row);
			if (missing.length) {
				toast.error(`Add credentials first: ${missing.map((f) => f.label).join(", ")}`);
				setEditing(spec.provider);
				return;
			}
		}
		setRows((prev) => ({
			...prev,
			[spec.provider]: {
				...row,
				is_active: next
			}
		}));
		const { error } = await persist(spec, row, next, resellerId);
		if (error) {
			toast.error(error.message);
			load();
			return;
		}
		toast.success(`${row.label || spec.label} ${next ? "enabled" : "disabled"}`);
		load();
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 " + (loading ? "animate-pulse" : ""),
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "rounded-xl border bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground",
				children: isReseller ? /* @__PURE__ */ jsxs(Fragment, { children: [
					"For every gateway you choose the source: ",
					/* @__PURE__ */ jsx("b", { children: "Platform gateway" }),
					" means the money goes to the platform account the admin already configured, and ",
					/* @__PURE__ */ jsx("b", { children: "My own credentials" }),
					" means the payment lands in your own merchant account. Switch a gateway off and it disappears from your store checkout, even if the platform keeps it on."
				] }) : /* @__PURE__ */ jsx(Fragment, { children: "Fill in the credentials from your merchant panel, then switch the gateway on — only enabled gateways appear at checkout. Payments are always re-verified with the provider on the server before an order is marked paid, and every callback URL is generated from the live site address, so a domain or server change needs no edit here." })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: GATEWAYS.map((spec) => {
					const row = rows[spec.provider] ?? blank(spec, isReseller ? "platform" : "own");
					const missing = missingFields(spec, row);
					const platformOff = isReseller && row.mode === "platform" && platformActive ? !platformActive.includes(spec.provider) : false;
					return /* @__PURE__ */ jsxs("div", {
						className: "surface-card flex flex-col p-4 " + (row.is_active ? "ring-1 ring-primary/30" : ""),
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "grid h-11 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border bg-background " + (row.is_active ? "border-primary/30" : "border-border"),
										children: paymentLogo(spec.provider) ? /* @__PURE__ */ jsx(PaymentLogo, {
											method: spec.provider,
											width: 96,
											height: 44,
											fit: "cover",
											alt: `${spec.label} logo`
										}) : /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5 text-muted-foreground" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("div", {
											className: "truncate text-sm font-semibold",
											children: row.label || spec.label
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground",
											children: [
												/* @__PURE__ */ jsx(StatusDot, { on: row.is_active }),
												row.is_active ? "active" : row.id ? "off" : "not set up",
												/* @__PURE__ */ jsx("span", { children: "·" }),
												isReseller ? /* @__PURE__ */ jsx("span", {
													className: row.mode === "platform" ? "text-primary" : "text-success",
													children: row.mode === "platform" ? "platform gateway" : "own account"
												}) : /* @__PURE__ */ jsx("span", {
													className: "text-success",
													children: "live"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsx(Switch, {
										checked: row.is_active,
										onChange: (v) => void toggle(spec, v),
										label: `Toggle ${spec.label}`
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground",
								children: spec.tagline
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 text-[10px] font-medium",
								children: platformOff ? /* @__PURE__ */ jsx("span", {
									className: "text-amber-600 dark:text-amber-400",
									children: "Not enabled by the platform"
								}) : row.mode === "platform" ? /* @__PURE__ */ jsx("span", {
									className: "text-success",
									children: "Uses the platform account"
								}) : missing.length ? /* @__PURE__ */ jsxs("span", {
									className: "text-amber-600 dark:text-amber-400",
									children: [missing.length, " credential(s) missing"]
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-success",
									children: "Credentials complete"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-auto flex gap-2 pt-3",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setEditing(spec.provider),
									className: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
									children: [/* @__PURE__ */ jsx(Settings2, { className: "h-3.5 w-3.5" }), " Configure"]
								}), spec.docs && /* @__PURE__ */ jsx("a", {
									href: spec.docs,
									target: "_blank",
									rel: "noreferrer",
									className: "rounded-lg border p-2 hover:bg-muted",
									"aria-label": `${spec.label} documentation`,
									children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
								})]
							})
						]
					}, spec.provider);
				})
			}),
			editing && /* @__PURE__ */ jsx(GatewayModal, {
				spec: GATEWAYS.find((g) => g.provider === editing),
				row: rows[editing] ?? blank(GATEWAYS.find((g) => g.provider === editing), isReseller ? "platform" : "own"),
				resellerId,
				platformActive,
				onClose: () => setEditing(null),
				onSaved: () => {
					setEditing(null);
					load();
				}
			})
		]
	});
}
function GatewayModal({ spec, row: initial, resellerId, platformActive, onClose, onSaved }) {
	const [row, setRow] = useState(initial);
	const [busy, setBusy] = useState(false);
	const [testing, setTesting] = useState(false);
	const [result, setResult] = useState(null);
	const runTest = useServerFn(testGatewayConnection);
	const missing = missingFields(spec, row);
	async function save() {
		if (row.is_active && missing.length) return toast.error(`Fill in: ${missing.map((f) => f.label).join(", ")}`);
		if (row.is_active && resellerId && row.mode === "platform" && platformActive && !platformActive.includes(spec.provider)) return toast.error(`${spec.label} is not enabled by the platform right now.`);
		setBusy(true);
		const { error } = await persist(spec, row, row.is_active, resellerId);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`${row.label || spec.label} saved`);
		onSaved();
	}
	async function test() {
		setTesting(true);
		setResult(null);
		try {
			const r = await runTest({ data: {
				provider: spec.provider,
				api_key: row.api_key ?? "",
				api_secret: row.api_secret ?? "",
				merchant_id: row.merchant_id ?? "",
				config: { ...row.config ?? {} }
			} });
			setResult(r.success ? {
				ok: true,
				message: "Credentials accepted by the gateway."
			} : {
				ok: false,
				message: r.error ?? "Connection failed"
			});
		} catch (err) {
			setResult({
				ok: false,
				message: err instanceof Error ? err.message : "Connection failed"
			});
		}
		setTesting(false);
	}
	return /* @__PURE__ */ jsx(AppModal, {
		title: /* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(PaymentLogo, {
				method: spec.provider,
				size: 24
			}), /* @__PURE__ */ jsx("span", { children: spec.label })]
		}),
		subtitle: spec.tagline,
		size: "md",
		onClose,
		footer: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => void test(),
				disabled: testing || missing.length > 0 || row.mode === "platform",
				className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50",
				children: [testing ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Plug, { className: "h-3.5 w-3.5" }), " Test connection"]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-muted",
					children: "Cancel"
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					disabled: busy,
					onClick: () => void save(),
					className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50",
					children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Save"]
				})]
			})]
		}),
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				resellerId && /* @__PURE__ */ jsxs("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ jsx(Label, { children: "Money goes to" }), /* @__PURE__ */ jsx("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [{
							value: "platform",
							title: "Platform gateway",
							hint: platformActive && !platformActive.includes(spec.provider) ? "The platform has not enabled this gateway yet." : "Uses the account the admin already set up."
						}, {
							value: "own",
							title: "My own credentials",
							hint: "Customers pay straight into your merchant account."
						}].map((opt) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setRow({
								...row,
								mode: opt.value
							}),
							className: "rounded-xl border p-3 text-left transition-colors " + (row.mode === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted"),
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold",
								children: opt.title
							}), /* @__PURE__ */ jsx("span", {
								className: "mt-0.5 block text-[10px] leading-relaxed text-muted-foreground",
								children: opt.hint
							})]
						}, opt.value))
					})]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx(Label, { children: "Display label" }), (row.label ?? "") !== spec.label && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setRow({
							...row,
							label: spec.label
						}),
						className: "mb-1 text-[10px] font-semibold text-primary hover:underline",
						children: "Use default"
					})]
				}), /* @__PURE__ */ jsx("input", {
					value: row.label ?? "",
					onChange: (e) => setRow({
						...row,
						label: e.target.value
					}),
					className: field,
					placeholder: spec.label
				})] }),
				row.mode === "own" && /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(Label, { children: "API base URL" }),
					/* @__PURE__ */ jsx("input", {
						value: row.config?.base_url ?? "",
						onChange: (e) => setRow({
							...row,
							config: {
								...row.config ?? {},
								base_url: e.target.value
							}
						}),
						className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring",
						placeholder: spec.hosts.live
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[10px] text-muted-foreground",
						children: "Leave empty to use the provider's standard live API. Fill it in only if your merchant panel gives a different API address."
					})
				] }),
				row.mode === "own" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
					className: "sm:col-span-2 mt-1 text-[11px] font-semibold",
					children: "Credentials"
				}), spec.fields.map((f) => /* @__PURE__ */ jsxs("div", {
					className: f.multiline ? "sm:col-span-2" : "",
					children: [
						/* @__PURE__ */ jsx(Label, {
							required: f.required,
							children: f.label
						}),
						/* @__PURE__ */ jsx(SecretInput, {
							value: readField(row, f),
							onChange: (v) => setRow(writeField(row, f, v)),
							placeholder: f.placeholder,
							secret: f.secret,
							multiline: f.multiline
						}),
						f.hint && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[10px] text-muted-foreground",
							children: f.hint
						})
					]
				}, f.path))] }),
				/* @__PURE__ */ jsxs("label", {
					className: "sm:col-span-2 flex items-center justify-between gap-3 rounded-xl border p-3",
					children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
						className: "block text-xs font-semibold",
						children: "Enabled at checkout"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Needs every required credential filled in."
					})] }), /* @__PURE__ */ jsx(Switch, {
						checked: row.is_active,
						onChange: (v) => setRow({
							...row,
							is_active: v
						}),
						label: "Enable gateway"
					})]
				}),
				result && /* @__PURE__ */ jsxs("div", {
					className: "sm:col-span-2 flex items-start gap-2 rounded-xl border p-3 text-[11px] " + (result.ok ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive"),
					children: [result.ok ? /* @__PURE__ */ jsx(CheckCircle2, { className: "mt-0.5 h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(XCircle, { className: "mt-0.5 h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: result.message })]
				})
			]
		})
	});
}
//#endregion
export { field as a, Switch as i, Label as n, StatusDot as r, GatewayGrid as t };
