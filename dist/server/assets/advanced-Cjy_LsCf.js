import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-fziyWHNw.js";
import { c as emptyDeliveryRule, m as setGlobalDelivery, n as DELIVERY_AREAS, r as areaLabel, s as deliverySettingsSummary } from "./delivery-DY_nRbFK.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Cr as ArrowDown, Et as Mail, I as ShieldCheck, K as Save, Lt as ListFilter, Nt as LoaderCircle, O as Smartphone, b as Tag, d as UserCheck, er as ChevronDown, m as Truck, mt as Package, q as RotateCcw, qt as Info, r as X, sn as GripVertical, tt as Plus, ur as Boxes, v as Trash2, yr as ArrowUp } from "./vendor-icons-DF2A5Z8S.js";
import { t as clearAppDataCache } from "./app-data-BQmaYNJc.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { c as pricingRuleSummary, i as mergeAdvanced, n as clearAdvancedSettingsCache, s as applyPricingRule, t as DEFAULT_ADVANCED_SETTINGS } from "./advanced-settings-VndvKEQI.js";
import { n as fillText, r as mergeTexts, t as DEFAULT_DEPOSIT_TEXTS } from "./deposit-settings-D9QKMna6.js";
//#region src/components/delivery-rules-card.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		value: "area",
		label: "Area-wise"
	},
	{
		value: "flat",
		label: "Flat"
	},
	{
		value: "free",
		label: "Free"
	},
	{
		value: "custom",
		label: "Custom"
	}
];
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
/**
* Custom delivery rules — target one or many products, brands or categories.
* Priority: product's own delivery setting > first matching rule > global rule.
*/
function DeliveryRulesCard({ value, onChange }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [brands, setBrands] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const [p, b, c] = await Promise.all([
				supabase.from("products").select("id,name,product_code").order("name").limit(2e3),
				supabase.from("brands").select("id,name").order("name"),
				supabase.from("categories").select("id,name").order("name")
			]);
			setProducts((p.data ?? []).map((r) => ({
				id: r.id,
				label: r.product_code ? `${r.name} · ${r.product_code}` : r.name
			})));
			setBrands((b.data ?? []).map((r) => ({
				id: r.id,
				label: r.name
			})));
			setCategories((c.data ?? []).map((r) => ({
				id: r.id,
				label: r.name
			})));
		})();
	}, []);
	const rules = value.rules ?? [];
	function setRules(next) {
		onChange({
			...value,
			rules: next
		});
	}
	function patch(id, p) {
		setRules(rules.map((r) => r.id === id ? {
			...r,
			...p
		} : r));
	}
	function move(index, dir) {
		const next = [...rules];
		const to = index + dir;
		if (to < 0 || to >= next.length) return;
		[next[index], next[to]] = [next[to], next[index]];
		setRules(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Custom delivery rules"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Product, brand ba category select kore alada delivery charge set korun. Ekadhik rule banano jabe — upor theke niche check hobe, first match kaj korbe."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setRules([...rules, emptyDeliveryRule()]),
				className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add rule"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
					children: "Priority: 1) product edit e set kora delivery charge, 2) ei custom rule, 3) global rule."
				}),
				rules.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground",
					children: "Kono custom rule nai. “Add rule” diye shuru korun."
				}),
				rules.map((rule, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-lg border p-3 ${rule.enabled ? "" : "opacity-60"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold",
								children: ["#", i + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: rule.name,
								onChange: (e) => patch(rule.id, { name: e.target.value }),
								placeholder: "Rule name",
								className: "min-w-[10rem] flex-1 rounded-md border bg-background px-2.5 py-1.5 text-sm font-medium outline-none focus:border-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => move(i, -1),
										disabled: i === 0,
										className: "rounded-md border p-1.5 disabled:opacity-40",
										"aria-label": "Move up",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => move(i, 1),
										disabled: i === rules.length - 1,
										className: "rounded-md border p-1.5 disabled:opacity-40",
										"aria-label": "Move down",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => patch(rule.id, { enabled: !rule.enabled }),
										className: `rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${rule.enabled ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground"}`,
										children: rule.enabled ? "Active" : "Off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setRules(rules.filter((r) => r.id !== rule.id)),
										className: "rounded-md border p-1.5 text-destructive hover:bg-destructive/10",
										"aria-label": "Delete rule",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Charge" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => patch(rule.id, { mode: m.value }),
										"aria-pressed": rule.mode === m.value,
										className: `rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${rule.mode === m.value ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50"}`,
										children: m.label
									}, m.value))
								}),
								rule.mode === "area" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2 sm:grid-cols-3",
									children: DELIVERY_AREAS.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1 text-[11px] text-muted-foreground",
										children: areaLabel(area, value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										value: rule.areas[area],
										onChange: (e) => patch(rule.id, { areas: {
											...rule.areas,
											[area]: Number(e.target.value) || 0
										} }),
										className: inp
									})] }, area))
								}),
								rule.mode === "flat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: rule.flat,
									onChange: (e) => patch(rule.id, { flat: Number(e.target.value) || 0 }),
									className: inp,
									placeholder: "Flat charge"
								}),
								rule.mode === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: rule.custom,
									onChange: (e) => patch(rule.id, { custom: Number(e.target.value) || 0 }),
									className: inp,
									placeholder: "Default charge (order e change kora jabe)"
								}),
								rule.mode === "free" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
									children: "Ei rule er product gulote free delivery."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Apply on" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiPicker, {
									placeholder: "Products search (name / code)",
									options: products,
									selected: rule.target.products,
									onChange: (products) => patch(rule.id, { target: {
										...rule.target,
										products
									} })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiPicker, {
									placeholder: "Brands",
									options: brands,
									selected: rule.target.brands,
									onChange: (brands) => patch(rule.id, { target: {
										...rule.target,
										brands
									} })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiPicker, {
									placeholder: "Categories",
									options: categories,
									selected: rule.target.categories,
									onChange: (categories) => patch(rule.id, { target: {
										...rule.target,
										categories
									} })
								}),
								!rule.target.products.length && !rule.target.brands.length && !rule.target.categories.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-amber-600",
									children: "Kichu select kora nai — ei rule apply hobe na."
								})
							]
						})]
					})]
				}, rule.id))
			]
		})]
	});
}
function Label({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children
	});
}
function MultiPicker({ placeholder, options, selected, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const box = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			if (box.current && !box.current.contains(e.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);
	const chosen = (0, import_react.useMemo)(() => selected.map((id) => options.find((o) => o.id === id) ?? {
		id,
		label: id.slice(0, 8)
	}), [selected, options]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return options.filter((o) => !selected.includes(o.id)).filter((o) => needle ? o.label.toLowerCase().includes(needle) : true).slice(0, 50);
	}, [
		options,
		selected,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-background px-2 py-1.5",
			onClick: () => setOpen(true),
			children: [
				chosen.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex max-w-full items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: o.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							onChange(selected.filter((id) => id !== o.id));
						},
						"aria-label": `Remove ${o.label}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})]
				}, o.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => {
						setQ(e.target.value);
						setOpen(true);
					},
					placeholder: chosen.length ? "" : placeholder,
					className: "min-w-[6rem] flex-1 bg-transparent text-sm outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg",
			children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 py-2 text-xs text-muted-foreground",
				children: "No match"
			}) : filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					onChange([...selected, o.id]);
					setQ("");
				},
				className: "block w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-muted",
				children: o.label
			}, o.id))
		})]
	});
}
//#endregion
//#region src/components/deposit-settings-panel.tsx
var FIELDS = [
	{
		key: "sectionTitle",
		label: "Section title (reseller panel)",
		help: "No variable"
	},
	{
		key: "dueTitle",
		label: "Deposit due — notice title",
		help: "{due}"
	},
	{
		key: "dueBody",
		label: "Deposit due — notice body",
		help: "{required} {balance} {due}",
		long: true
	},
	{
		key: "okText",
		label: "Deposit paid — text",
		help: "{balance}"
	},
	{
		key: "frozenText",
		label: "Frozen amount — text",
		help: "{frozen}"
	},
	{
		key: "howToDeposit",
		label: "How to deposit — hint",
		help: "No variable",
		long: true
	},
	{
		key: "withdrawWarning",
		label: "Deposit/frozen withdraw warning",
		help: "No variable",
		long: true
	},
	{
		key: "orderBlockToast",
		label: "Order confirm block — toast",
		help: "{due}"
	},
	{
		key: "payoutFrozenHint",
		label: "Payout form — frozen hint",
		help: "{frozen}"
	}
];
/** Security deposit rules + reseller-facing texts. Rendered as a tab inside Advanced settings. */
function DepositSettingsPanel() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [triggerOn, setTriggerOn] = (0, import_react.useState)(false);
	const [amount, setAmount] = (0, import_react.useState)("0");
	const [frozen, setFrozen] = (0, import_react.useState)("0");
	const [texts, setTexts] = (0, import_react.useState)(DEFAULT_DEPOSIT_TEXTS);
	const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data, error } = await supabase.from("global_settings").select("deposit_texts,deposit_trigger_default_on,deposit_default_amount,deposit_default_frozen").eq("id", 1).maybeSingle();
			if (error) toast.error(error.message);
			const row = data;
			setTriggerOn(Boolean(row?.deposit_trigger_default_on));
			setAmount(String(row?.deposit_default_amount ?? 0));
			setFrozen(String(row?.deposit_default_frozen ?? 0));
			setTexts(mergeTexts(row?.deposit_texts));
			setLoading(false);
		})();
	}, []);
	async function save() {
		setBusy(true);
		const { error } = await supabase.from("global_settings").update({
			deposit_trigger_default_on: triggerOn,
			deposit_default_amount: Number(amount) || 0,
			deposit_default_frozen: Number(frozen) || 0,
			deposit_texts: texts
		}).eq("id", 1);
		clearAppDataCache("settings");
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Deposit settings saved");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const preview = {
		due: Math.max((Number(amount) || 0) - 0, 0),
		required: Number(amount) || 0,
		balance: 0,
		frozen: Number(frozen) || 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Default rule (new reseller)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "New resellers will get these values on signup — you can override each reseller later from their “Deposit & freeze” modal."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex cursor-pointer items-start gap-3 rounded-md border bg-muted/30 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: triggerOn,
							onChange: (e) => setTriggerOn(e.target.checked),
							className: "mt-0.5 h-4 w-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: "Enable deposit trigger by default"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "If off, new resellers can work without a deposit."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Default deposit amount (৳)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: inp
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Default freeze amount (৳)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: frozen,
							onChange: (e) => setFrozen(e.target.value),
							className: inp
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Live preview"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-amber-700 dark:text-amber-300",
							children: fillText(texts.dueTitle, preview)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-amber-700/80 dark:text-amber-200/80",
							children: fillText(texts.dueBody, preview)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-muted/30 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-success",
							children: fillText(texts.okText, { balance: preview.required })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-muted-foreground",
							children: fillText(texts.frozenText, preview)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", texts.howToDeposit] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", texts.withdrawWarning] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-4 p-6 lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Reseller-facing text (dynamic)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Use ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{due}" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{required}" }),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{balance}" }),
								",",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "{frozen}" }),
								" and the matching amount will be inserted automatically."
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTexts(DEFAULT_DEPOSIT_TEXTS),
							className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset to default"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: f.long ? "md:col-span-2" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1 flex items-center justify-between text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-normal text-muted-foreground",
									children: f.help
								})]
							}), f.long ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: texts[f.key],
								onChange: (e) => setTexts({
									...texts,
									[f.key]: e.target.value
								}),
								className: inp
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: texts[f.key],
								onChange: (e) => setTexts({
									...texts,
									[f.key]: e.target.value
								}),
								className: inp
							})]
						}, f.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: save,
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save deposit settings"]
						})
					})
				]
			})
		]
	});
}
//#endregion
//#region src/routes/_authenticated/admin/advanced.tsx?tsr-split=component
var TABS = [
	{
		key: "delivery",
		label: "Delivery",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
	},
	{
		key: "pricing",
		label: "Product pricing",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
	},
	{
		key: "orders",
		label: "Orders",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" })
	},
	{
		key: "resellers",
		label: "Resellers",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" })
	},
	{
		key: "deposit",
		label: "Security deposit",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
	}
];
var GROUPS = [
	{
		tab: "resellers",
		title: "New reseller approval",
		hint: "Manual approval na automatic — ekhan theke niyontron.",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }),
		rows: [{
			key: "resellerAutoApprove",
			label: "Automatic approval",
			help: "ON = notun registration sathe sathe active hoye jabe, 3 dot theke approve korte hobe na. OFF = manual process, admin approve dile access pabe. Dui khetrei admin chaile pore deactivate / reject korte parbe.",
			master: true
		}]
	},
	{
		tab: "resellers",
		title: "Reseller catalog",
		hint: "What resellers can see on the catalog grid.",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
		rows: [{
			key: "resellerCatalogShowStock",
			label: "Show stock on product grid",
			help: "Off korle reseller catalog grid e stock number dekhabe na."
		}]
	},
	{
		tab: "orders",
		title: "Order packaging charge",
		hint: "Ek parcel e ekadhik product hole packaging charge kivabe hisab hobe.",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" }),
		rows: [{
			key: "packagingChargeSum",
			label: "Add up every product's packaging charge",
			help: "ON = protita product er packaging charge × quantity jog hobe (ekhon jemon ache). OFF = ekadhik product hole sob gulor moddhe jetar packaging charge sob theke besi, sudhu setai ekbar dhora hobe. Single product hole dui khetrei ek e."
		}]
	},
	{
		tab: "resellers",
		title: "Reseller registration verification",
		hint: "Master switch off thakle verify na korei registration complete hoye jabe.",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }),
		rows: [
			{
				key: "verifyEnabled",
				label: "Verification required (master)",
				help: "Off = kono verification lagbe na, signup korei panel e dhukbe.",
				master: true
			},
			{
				key: "verifyEmail",
				label: "Email code verification",
				help: "Email e 6 digit code pathabe (active email sender lagbe).",
				dependsOn: "verifyEnabled"
			},
			{
				key: "verifySms",
				label: "SMS code verification",
				help: "Phone number e 6 digit code pathabe (active SMS sender lagbe).",
				dependsOn: "verifyEnabled"
			}
		]
	}
];
function AdvancedSettingsPage() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("delivery");
	const [settings, setSettings] = (0, import_react.useState)(DEFAULT_ADVANCED_SETTINGS);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data, error } = await supabase.from("global_settings").select("advanced_settings").eq("id", 1).maybeSingle();
			if (error) toast.error(error.message);
			setSettings(mergeAdvanced(data?.advanced_settings));
			setLoading(false);
		})();
	}, []);
	async function save() {
		setBusy(true);
		const { error } = await supabase.from("global_settings").update({ advanced_settings: settings }).eq("id", 1);
		clearAppDataCache("settings");
		setBusy(false);
		if (error) return toast.error(error.message);
		clearAdvancedSettingsCache();
		setGlobalDelivery(settings.delivery);
		toast.success("Advanced settings saved");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-64 place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const groups = GROUPS.filter((g) => g.tab === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Advanced settings",
				description: "Platform logic switches — notun logic ekhane jog hote thakbe.",
				actions: tab === "deposit" ? void 0 : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: save,
					disabled: busy,
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save changes"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(t.key),
					"aria-pressed": tab === t.key,
					className: `inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${tab === t.key ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"}`,
					children: [t.icon, t.label]
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab === "deposit" ? "Deposit rule o reseller-facing text ekhan theke change korle sathe sathe reseller panel e apply hobe. Ei tab er nijer Save button ache." : "Ei switch gulo sathe sathe sob jaigai apply hoy — reseller panel, registration, login o dashboard." })]
			}),
			tab === "deposit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositSettingsPanel, {}),
			tab === "pricing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingCard, {
				value: settings.pricing,
				onChange: (pricing) => setSettings((s) => ({
					...s,
					pricing
				}))
			}),
			tab === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryCard, {
					value: settings.delivery,
					onChange: (delivery) => setSettings((s) => ({
						...s,
						delivery
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryRulesCard, {
					value: settings.delivery,
					onChange: (delivery) => setSettings((s) => ({
						...s,
						delivery
					}))
				})]
			}),
			groups.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 lg:grid-cols-2",
				children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "surface-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center gap-2 border-b bg-muted/30 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary",
							children: group.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: group.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: group.hint
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y",
						children: group.rows.map((row) => {
							const disabled = row.dependsOn ? !settings[row.dependsOn] : false;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `flex items-start justify-between gap-4 px-4 py-3.5 transition ${disabled ? "opacity-50" : "hover:bg-muted/30"} ${row.master ? "bg-primary/5" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm font-medium",
										children: [
											row.key === "verifyEmail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }),
											row.key === "verifySms" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5 text-muted-foreground" }),
											row.label,
											row.master && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary",
												children: "master"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: row.help
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: Boolean(settings[row.key]),
									disabled,
									onChange: (v) => setSettings((s) => ({
										...s,
										[row.key]: v
									}))
								})]
							}, row.key);
						})
					})]
				}, group.title))
			})
		]
	});
}
/** Global auto-pricing rule used when a product is uploaded. */
function PricingCard({ value, onChange }) {
	const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	const set = (key, v) => onChange({
		...value,
		[key]: v
	});
	const preview = applyPricingRule(100, value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-2 border-b bg-muted/30 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Auto pricing rule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Admin product upload e ei rule onujai price auto fill hobe (change kora jabe). Supplier product upload korle rule chup chap apply hoye save hobe — approve er somoy verify korlei hobe."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start justify-between gap-4 rounded-lg border bg-primary/5 px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Auto pricing on"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "Off thakle kono price auto fill hobe na, sob hate likhte hobe."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					checked: value.enabled,
					onChange: (v) => set("enabled", v)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: value.enabled ? "space-y-4" : "space-y-4 opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkupField, {
							label: "Reseller price",
							help: "Admin cost (buying / supplier price) er upore markup.",
							mode: value.resellerMode,
							amount: value.resellerValue,
							disabled: !value.enabled,
							onMode: (m) => set("resellerMode", m),
							onAmount: (n) => set("resellerValue", n)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkupField, {
							label: "Suggested sell price",
							help: "Reseller price er upore markup (packaging jog hobe).",
							mode: value.suggestedMode,
							amount: value.suggestedValue,
							disabled: !value.enabled,
							onMode: (m) => set("suggestedMode", m),
							onAmount: (n) => set("suggestedValue", n)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-medium",
							children: ["Default packaging charge (৳)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								disabled: !value.enabled,
								value: value.packaging,
								onChange: (e) => set("packaging", Number(e.target.value) || 0),
								className: `${inp} mt-1`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-medium",
							children: [
								"Round money to nearest (৳)",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									disabled: !value.enabled,
									value: value.roundTo,
									onChange: (e) => set("roundTo", Number(e.target.value) || 0),
									className: `${inp} mt-1`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-[11px] font-normal text-muted-foreground",
									children: "0 dile rounding hobe na."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-muted/40 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: pricingRuleSummary(value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-muted-foreground",
							children: [
								"Example — cost ৳100 → reseller ৳",
								preview.resellerPrice,
								" · suggested ৳",
								preview.suggestedPrice,
								" · packaging ৳",
								preview.packaging
							]
						})]
					})
				]
			})]
		})]
	});
}
function MarkupField({ label, help, mode, amount, disabled, onMode, onAmount }) {
	const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] text-muted-foreground",
				children: help
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-[minmax(0,1fr)_7rem] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					disabled,
					value: mode,
					onChange: (e) => onMode(e.target.value),
					className: inp,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "pct",
						children: "Percent markup (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "fixed",
						children: "Fixed amount (৳)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 0,
					disabled,
					value: amount,
					onChange: (e) => onAmount(Number(e.target.value) || 0),
					className: inp
				})]
			})
		]
	});
}
var DELIVERY_MODES = [
	{
		value: "area",
		label: "Area-wise",
		help: "3 ta area, protita area er alada charge."
	},
	{
		value: "flat",
		label: "Flat rate",
		help: "Sob area te ek e charge."
	},
	{
		value: "free",
		label: "Free shipping",
		help: "Customer delivery charge dibe na."
	},
	{
		value: "custom",
		label: "Custom",
		help: "Ekta default amount, order e manual change kora jabe."
	}
];
/** Global delivery charge rule. A product can still override it from product edit. */
function DeliveryCard({ value, onChange }) {
	const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
	function setArea(area, patch) {
		onChange({
			...value,
			areas: {
				...value.areas,
				[area]: {
					...value.areas[area],
					...patch
				}
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center gap-2 border-b bg-muted/30 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Delivery charge (global)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Ei rule sob product e apply hobe. Product edit e delivery charge set kora thakle sei product er nijer setting priority pabe (priority 1)."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-4",
					children: DELIVERY_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onChange({
							...value,
							mode: m.value
						}),
						"aria-pressed": value.mode === m.value,
						className: `rounded-lg border p-3 text-left transition ${value.mode === m.value ? "border-primary bg-primary/5" : "hover:bg-muted/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] leading-snug text-muted-foreground",
							children: m.help
						})]
					}, m.value))
				}),
				value.mode === "area" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Areas (name change kora jabe)"
					}), DELIVERY_AREAS.map((area) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-[2fr_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: value.areas[area].label,
							onChange: (e) => setArea(area, { label: e.target.value }),
							className: inp,
							placeholder: "Area name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: value.areas[area].charge,
							onChange: (e) => setArea(area, { charge: Number(e.target.value) || 0 }),
							className: inp,
							placeholder: "Charge"
						})]
					}, area))]
				}),
				value.mode === "flat" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block max-w-xs text-xs font-medium",
					children: ["Flat charge (all areas)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						value: value.flat,
						onChange: (e) => onChange({
							...value,
							flat: Number(e.target.value) || 0
						}),
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary mt-1"
					})]
				}),
				value.mode === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block max-w-xs text-xs font-medium",
					children: [
						"Default custom charge",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: value.custom,
							onChange: (e) => onChange({
								...value,
								custom: Number(e.target.value) || 0
							}),
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary mt-1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[11px] font-normal text-muted-foreground",
							children: "Order add / edit e ei charge manual change kora jabe."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
					children: deliverySettingsSummary(value)
				})
			]
		})]
	});
}
function Toggle({ checked, disabled, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		disabled,
		onClick: () => onChange(!checked),
		className: `relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition disabled:cursor-not-allowed ${checked ? "border-primary bg-primary" : "bg-muted"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `absolute top-0.5 h-4.5 w-4.5 rounded-full bg-background shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`,
			style: {
				height: 18,
				width: 18
			}
		})
	});
}
//#endregion
export { AdvancedSettingsPage as component };
