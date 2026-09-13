import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BAn7XKYw.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, Tn as Earth, a as Wallet, et as Plus, t as Zap, v as Trash2 } from "./vendor-icons-BEaCFqaT.js";
import { n as confirmAction } from "./confirm-BTmyn8ng.js";
import { r as getMyReseller } from "./app-data-DrOhMwcy.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as clearBootstrapCache } from "./bootstrap-C_eam0yT.js";
import { a as methodLabel, n as cfgBool, r as cfgString, t as MANUAL_METHODS } from "./payment-methods-0ydQ3cgd.js";
import { n as listDepositGateways, t as listActiveGateways } from "./gateways.functions-DhCIEyA_.js";
import { n as paymentLogo, t as PaymentLogo } from "./payment-brand-DOxAYgjm.js";
import { t as AppModal } from "./AppModal-N3LLz6cE.js";
import { a as field, i as Switch, n as Label, r as StatusDot, t as GatewayGrid } from "./gateway-grid-DIon31hk.js";
//#region src/routes/_authenticated/reseller/payments.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function ResellerPaymentsPage() {
	const [resellerId, setResellerId] = (0, import_react.useState)(null);
	const [globalManual, setGlobalManual] = (0, import_react.useState)([]);
	const [gateways, setGateways] = (0, import_react.useState)([]);
	const [platformGateways, setPlatformGateways] = (0, import_react.useState)([]);
	const [myGw, setMyGw] = (0, import_react.useState)([]);
	const [mine, setMine] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [tab, setTab] = (0, import_react.useState)("manual");
	const [draft, setDraft] = (0, import_react.useState)(null);
	const loadGateways = useServerFn(listActiveGateways);
	const loadPlatformGateways = useServerFn(listDepositGateways);
	async function loadMyGateways(rid) {
		const { data } = await supabase.from("payment_gateway_configs").select("id,provider,is_active,mode").eq("reseller_id", rid);
		setMyGw(data ?? []);
	}
	/**
	* Global automatic gateways are on by default. Turning one off writes an
	* inactive platform-mode row for this store; turning it back on removes that
	* row (unless the reseller runs the gateway on their own credentials).
	*/
	async function toggleGlobalGateway(g, show) {
		if (!resellerId) return;
		const row = myGw.find((r) => r.provider === g.provider);
		if (show) {
			if (!row) return;
			const { error } = await supabase.from("payment_gateway_configs").delete().eq("id", row.id);
			if (error) return toast.error(error.message);
			toast.success(`${g.label} is back on your store`);
		} else {
			const payload = {
				is_active: false,
				mode: "platform"
			};
			const { error } = row ? await supabase.from("payment_gateway_configs").update(payload).eq("id", row.id) : await supabase.from("payment_gateway_configs").insert({
				...payload,
				reseller_id: resellerId,
				provider: g.provider,
				label: g.label
			});
			if (error) return toast.error(error.message);
			toast.success(`${g.label} removed from your store checkout`);
		}
		await loadMyGateways(resellerId);
		const me = await getMyReseller();
		if (me?.code) try {
			setGateways(await loadGateways({ data: { code: me.code } }));
		} catch {}
	}
	async function loadMine(rid) {
		const { data, error } = await supabase.from("payment_configs").select("id,method,label,mode,is_active,instructions,config").eq("reseller_id", rid).order("created_at");
		if (error) toast.error(error.message);
		setMine(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		(async () => {
			const me = await getMyReseller();
			setResellerId(me?.id ?? null);
			const [{ data: globals }] = await Promise.all([supabase.from("payment_configs").select("id,method,label,mode,is_active,instructions,config").is("reseller_id", null).eq("is_active", true).order("created_at"), me?.id ? loadMine(me.id) : Promise.resolve()]);
			const list = (globals ?? []).filter((r) => r.mode === "manual");
			setGlobalManual(list);
			if (me?.code) try {
				setGateways(await loadGateways({ data: { code: me.code } }));
			} catch {
				setGateways([]);
			}
			if (me?.id) {
				loadMyGateways(me.id);
				try {
					setPlatformGateways(await loadPlatformGateways());
				} catch {
					setPlatformGateways([]);
				}
			}
			setLoading(false);
		})();
	}, []);
	async function toggle(row, is_active) {
		setMine((prev) => prev.map((r) => r.id === row.id ? {
			...r,
			is_active
		} : r));
		const { error } = await supabase.from("payment_configs").update({ is_active }).eq("id", row.id);
		if (error) {
			toast.error(error.message);
			if (resellerId) loadMine(resellerId);
		} else clearBootstrapCache("store:");
	}
	/**
	* A reseller entry for a method always wins over the platform one, so hiding a
	* global method is simply an inactive marker row for that method. Showing it
	* again deletes the marker.
	*/
	const hiddenRow = (method) => mine.find((m) => m.method === method && cfgBool(m.config, "hidden_global")) ?? null;
	const ownRow = (method) => mine.find((m) => m.method === method && !cfgBool(m.config, "hidden_global")) ?? null;
	const myMethods = mine.filter((m) => !cfgBool(m.config, "hidden_global"));
	async function toggleGlobal(row, show) {
		if (!resellerId) return;
		const marker = hiddenRow(row.method);
		if (show) {
			if (!marker) return;
			const { error } = await supabase.from("payment_configs").delete().eq("id", marker.id);
			if (error) return toast.error(error.message);
			clearBootstrapCache("store:");
			toast.success(`${row.label} is back on your store`);
		} else {
			const { error } = await supabase.from("payment_configs").insert({
				reseller_id: resellerId,
				method: row.method,
				label: row.label,
				mode: "manual",
				is_active: false,
				config: { hidden_global: true }
			});
			if (error) return toast.error(error.message);
			clearBootstrapCache("store:");
			toast.success(`${row.label} removed from your store checkout`);
		}
		loadMine(resellerId);
	}
	async function remove(row) {
		if (!await confirmAction({
			title: "Delete payment method",
			description: `"${row.label}" will be removed from your store checkout.`,
			confirmText: "Delete"
		})) return;
		const { error } = await supabase.from("payment_configs").delete().eq("id", row.id);
		if (error) return toast.error(error.message);
		clearBootstrapCache("store:");
		toast.success("Deleted");
		if (resellerId) loadMine(resellerId);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Payment methods",
			description: "Global methods stay ready for your store automatically. Use your own wallet numbers or your own gateway credentials whenever you want the money to come to you instead."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 inline-flex rounded-xl border bg-muted/30 p-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab("manual"),
				className: "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors " + (tab === "manual" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Manual"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab("api"),
				className: "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors " + (tab === "api" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5" }),
					" Automatic gateways",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-muted px-1.5 text-[10px]",
						children: gateways.length
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: tab === "api" ? "" : "hidden",
			children: resellerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GatewayGrid, {
				resellerId,
				platformActive: platformGateways.map((g) => g.provider)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground",
				children: "Your reseller account is still being set up."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: tab === "manual" ? "" : "hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-2 flex items-center gap-1.5 text-sm font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-4 w-4 text-primary" }),
						" Global methods",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-1.5 text-[10px] font-semibold",
							children: globalManual.length + platformGateways.length
						})
					]
				}), globalManual.length + platformGateways.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground",
					children: "No global method is active right now — Cash on delivery still works on your store."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
					children: [globalManual.map((row) => {
						const own = ownRow(row.method);
						const overridden = Boolean(own?.is_active);
						const hidden = Boolean(hiddenRow(row.method));
						const shown = !hidden && !overridden;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card flex flex-col p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-0 flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
											method: row.method,
											label: row.label,
											tag: "Manual · verified by admin"
										})
									}), !own && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: !hidden,
										onChange: (v) => void toggleGlobal(row, v),
										label: `Show ${row.label} on my store`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-3 space-y-1 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Account",
										v: cfgString(row.config, "account") || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										k: "Type",
										v: cfgString(row.config, "account_type") || "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold " + (shown ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
									children: overridden ? "Replaced by your own method" : hidden ? "Off on your store" : "Live on your store"
								})
							]
						}, row.id);
					}), platformGateways.map((g) => {
						const row = myGw.find((r) => r.provider === g.provider);
						const own = row && row.mode === "own";
						const overridden = Boolean(own && row?.is_active);
						const hidden = Boolean(row && !row.is_active);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface-card flex flex-col p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-0 flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
											method: g.provider,
											label: g.label,
											tag: "Automatic gateway",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" })
										})
									}), !own && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: !hidden,
										onChange: (v) => void toggleGlobalGateway(g, v),
										label: `Show ${g.label} on my store`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] leading-relaxed text-muted-foreground",
									children: "Customers pay online and the gateway confirms it instantly — the order is marked paid without any manual check."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-3 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold " + (!hidden && !overridden ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
									children: overridden ? "Running on your own credentials" : hidden ? "Off on your store" : "Live on your store"
								})
							]
						}, g.provider);
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-1.5 text-sm font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }),
						" My own methods",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-muted px-1.5 text-[10px] font-semibold",
							children: myMethods.length
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDraft(emptyDraft()),
					className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add method"]
				})]
			}), myMethods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Using global methods only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Add your own bKash, Nagad, Rocket or bank number to collect that money yourself."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: myMethods.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card flex flex-col p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { method: row.method }),
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Account",
								v: cfgString(row.config, "account") || "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Type",
								v: cfgString(row.config, "account_type") || "—"
							})]
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
			})] })]
		}),
		draft && resellerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyMethodModal, {
			draft,
			resellerId,
			onClose: () => setDraft(null),
			onSaved: () => {
				setDraft(null);
				loadMine(resellerId);
			}
		})
	] });
}
function Logo({ method }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid h-11 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border bg-background",
		children: paymentLogo(method) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentLogo, {
			method,
			width: 96,
			height: 44,
			fit: "cover",
			alt: `${methodLabel(method)} logo`
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-muted-foreground" })
	});
}
function Head({ method, label, tag, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { method }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-sm font-semibold",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground",
				children: [
					icon,
					" ",
					tag
				]
			})]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate font-medium",
			children: v
		})]
	});
}
function MyMethodModal({ draft, resellerId, onClose, onSaved }) {
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
			reseller_id: resellerId
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		clearBootstrapCache("store:");
		toast.success(row.id ? "Saved" : "Payment method added");
		onSaved();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		title: row.id ? row.label || "Edit method" : "Add my payment method",
		subtitle: "Your own wallet or bank — replaces the global method of the same type on your store.",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: cfgString(row.config, "account_type"),
					onChange: (e) => setConfig("account_type", e.target.value),
					className: field,
					placeholder: "Personal / Agent / Merchant"
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
						placeholder: "Send Money to 01700XXXXXXX (Personal), then paste the TrxID."
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
export { ResellerPaymentsPage as component };
