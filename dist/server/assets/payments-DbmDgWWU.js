import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BAn7XKYw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Nt as LoaderCircle, a as Wallet, on as Hand, t as Zap, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { n as confirmAction } from "./confirm-CRVKAosm.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { a as methodLabel, r as cfgString, t as MANUAL_METHODS } from "./payment-methods-0ydQ3cgd.js";
import { n as paymentLogo, t as PaymentLogo } from "./payment-brand-DOxAYgjm.js";
import { t as AppModal } from "./AppModal-BVNHKlfq.js";
import { a as field, i as Switch, n as Label, r as StatusDot, t as GatewayGrid } from "./gateway-grid-CfSu8AXs.js";
//#region src/components/payments/manual-methods.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/** Standard account types — shown here and on the reseller dashboard's payment-numbers card. */
var ACCOUNT_TYPES = [
	"Personal",
	"Agent",
	"Payment"
];
var emptyDraft = () => ({
	id: "",
	method: MANUAL_METHODS[0].value,
	label: "",
	mode: "manual",
	is_active: true,
	instructions: null,
	config: {
		account: "",
		account_type: ""
	}
});
function ManualMethods({ onCountChange }) {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [draft, setDraft] = (0, import_react.useState)(null);
	async function load() {
		const { data, error } = await supabase.from("payment_configs").select("id,method,label,mode,is_active,instructions,config").is("reseller_id", null).eq("mode", "manual").order("created_at");
		if (error) toast.error(error.message);
		const list = data ?? [];
		setRows(list);
		onCountChange?.(list.length);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function toggle(row, is_active) {
		setRows((prev) => prev.map((r) => r.id === row.id ? {
			...r,
			is_active
		} : r));
		const { error } = await supabase.from("payment_configs").update({ is_active }).eq("id", row.id);
		if (error) {
			toast.error(error.message);
			load();
		}
	}
	async function remove(row) {
		if (!await confirmAction({
			title: "Delete payment method",
			description: `"${row.label}" will be removed from checkout and from reseller deposit options.`,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("payment_configs").delete().eq("id", row.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		load();
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "max-w-[62ch] text-[11px] leading-relaxed text-muted-foreground",
					children: [
						"The customer sends money to your number and types the transaction ID. Every",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "active" }),
						" method here also accepts reseller security-deposit payments — those wait for your approval in Finance → Deposit transactions."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDraft(emptyDraft()),
					className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add method"]
				})]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "No manual method yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Add bKash, Nagad, Rocket or a bank account."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex flex-col p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border bg-background",
									children: paymentLogo(row.method) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentLogo, {
										method: row.method,
										width: 96,
										height: 44,
										fit: "cover",
										alt: `${methodLabel(row.method)} logo`
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-muted-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-semibold",
										children: row.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { on: row.is_active }),
											methodLabel(row.method),
											" · ",
											row.is_active ? "active" : "off"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: row.is_active,
									onChange: (v) => void toggle(row, v),
									label: `Toggle ${row.label}`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 space-y-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate font-medium",
									children: cfgString(row.config, "account") || "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate font-medium",
									children: cfgString(row.config, "account_type") || "—"
								})]
							})]
						}),
						row.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success",
							children: "Accepts deposits"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto flex gap-2 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraft({
									...row,
									config: row.config ?? {}
								}),
								className: "flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void remove(row),
								className: "rounded-lg border p-2 text-destructive hover:bg-destructive/10",
								"aria-label": `Delete ${row.label}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				}, row.id))
			}),
			draft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodModal, {
				draft,
				onClose: () => setDraft(null),
				onSaved: () => {
					setDraft(null);
					load();
				}
			})
		]
	});
}
function MethodModal({ draft, onClose, onSaved }) {
	const [row, setRow] = (0, import_react.useState)(draft);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const setConfig = (key, value) => setRow((r) => ({
		...r,
		config: {
			...r.config,
			[key]: value
		}
	}));
	const meta = MANUAL_METHODS.find((m) => m.value === row.method);
	async function save() {
		if (!row.label.trim()) return toast.error("Display label is required");
		setBusy(true);
		const payload = {
			method: row.method,
			label: row.label.trim(),
			mode: "manual",
			is_active: row.is_active,
			instructions: row.instructions?.trim() || null,
			config: row.config
		};
		const { error } = row.id ? await supabase.from("payment_configs").update(payload).eq("id", row.id) : await supabase.from("payment_configs").insert({
			...payload,
			reseller_id: null
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(row.id ? "Saved" : "Payment method added");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		title: row.id ? row.label || "Edit method" : "Add manual method",
		subtitle: "Wallet, bank or cash — verified by your team.",
		size: "md",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "rounded-lg border px-4 py-2 text-xs font-semibold hover:bg-muted",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				onClick: () => void save(),
				className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50",
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Save"]
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						required: true,
						children: "Provider"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: row.method,
						onChange: (e) => setRow((r) => ({
							...r,
							method: e.target.value
						})),
						className: field,
						children: MANUAL_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.value,
							children: m.label
						}, m.value))
					}),
					meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] text-muted-foreground",
						children: meta.hint
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					required: true,
					children: "Display label"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: row.label,
					onChange: (e) => setRow((r) => ({
						...r,
						label: e.target.value
					})),
					className: field,
					placeholder: `${meta?.label ?? "bKash"} Personal`
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account / number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: cfgString(row.config, "account"),
					onChange: (e) => setConfig("account", e.target.value),
					className: field,
					placeholder: "01700000000"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: cfgString(row.config, "account_type"),
					onChange: (e) => setConfig("account_type", e.target.value),
					className: field,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— Select —"
						}),
						ACCOUNT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t,
							children: t
						}, t)),
						(() => {
							const v = cfgString(row.config, "account_type");
							return v && !ACCOUNT_TYPES.includes(v) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v,
								children: v
							}) : null;
						})()
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment instructions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: row.instructions ?? "",
						onChange: (e) => setRow((r) => ({
							...r,
							instructions: e.target.value
						})),
						className: field,
						placeholder: "Send Money to 01700XXXXXXX (Personal). Use the order number as reference, then paste the TrxID."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between gap-3 rounded-xl border p-3 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-semibold",
						children: "Show at checkout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Turn off to hide without deleting."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: row.is_active,
						onChange: (v) => setRow((r) => ({
							...r,
							is_active: v
						})),
						label: "Show at checkout"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/_authenticated/admin/payments.tsx?tsr-split=component
function PaymentsPage() {
	const [tab, setTab] = (0, import_react.useState)("manual");
	const [manualCount, setManualCount] = (0, import_react.useState)(0);
	const [activeGateways, setActiveGateways] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Payment methods",
			description: "Two families, kept apart on purpose: manual methods your team verifies by hand, and automatic gateways that confirm payments themselves."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 inline-flex rounded-xl border bg-muted/30 p-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabButton, {
				active: tab === "manual",
				onClick: () => setTab("manual"),
				count: manualCount,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "h-3.5 w-3.5" }), " Manual"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabButton, {
				active: tab === "api",
				onClick: () => setTab("api"),
				count: activeGateways,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }), " Automatic"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: tab === "manual" ? "" : "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualMethods, { onCountChange: setManualCount })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: tab === "api" ? "" : "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GatewayGrid, { onCountChange: setActiveGateways })
		})
	] });
}
function TabButton({ active, onClick, count, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors " + (active ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"),
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full px-1.5 text-[10px] " + (active ? "bg-primary/10 text-primary" : "bg-muted"),
			children: count
		})]
	});
}
//#endregion
export { PaymentsPage as component };
