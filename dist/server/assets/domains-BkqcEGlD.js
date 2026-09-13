import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { I as ShieldCheck, Jn as CircleAlert, K as Save, Nt as LoaderCircle, V as Server, Y as RefreshCw, ln as Globe, nt as Plug, qn as CircleCheck, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { a as getPlatformOrigins, c as saveCloudflareConfig, d as testCloudflareConfig, l as savePlatformOrigins, n as disconnectDomain, o as listDomains, r as getCloudflareConfig, s as refreshDomain } from "./cloudflare.functions-cio8u1FG.js";
//#region src/routes/_authenticated/admin/domains.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	mode: "both",
	server_a_ip: "",
	server_cname: "",
	server_note: "",
	dns_active: false,
	api_token: "",
	account_id: "",
	zone_id: "",
	zone_name: "",
	worker_name: "",
	cname_target: "",
	a_record_ip: "",
	auto_worker_domain: false,
	is_active: false
};
function errorText(err) {
	if (err instanceof Response) return `Failed (${err.status})`;
	return err instanceof Error ? err.message : "Something went wrong";
}
function DomainsAdmin() {
	const loadConfig = useServerFn(getCloudflareConfig);
	const saveConfig = useServerFn(saveCloudflareConfig);
	const testConfig = useServerFn(testCloudflareConfig);
	const load = useServerFn(listDomains);
	const refresh = useServerFn(refreshDomain);
	const remove = useServerFn(disconnectDomain);
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const [tokenHint, setTokenHint] = (0, import_react.useState)("");
	const [hasToken, setHasToken] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			try {
				const [c, d] = await Promise.all([loadConfig({}), load({ data: { all: true } })]);
				setForm({
					...EMPTY,
					...c,
					api_token: ""
				});
				setTokenHint(c.tokenHint);
				setHasToken(c.hasToken);
				setRows(d);
			} catch (err) {
				toast.error(errorText(err));
			} finally {
				setLoading(false);
			}
		})();
	}, []);
	async function onSave(e) {
		e.preventDefault();
		setBusy("save");
		try {
			const c = await saveConfig({ data: { ...form } });
			setForm({
				...EMPTY,
				...c,
				api_token: ""
			});
			setTokenHint(c.tokenHint);
			setHasToken(c.hasToken);
			toast.success("Cloudflare credentials saved");
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function onTest() {
		setBusy("test");
		try {
			const r = await testConfig({});
			toast.success(`Token OK${r.zone ? ` · Zone: ${r.zone}` : ""}${r.account ? ` · Account: ${r.account}` : ""}`);
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function onRefresh(row) {
		setBusy(row.id);
		try {
			const updated = await refresh({ data: { id: row.id } });
			setRows((rs) => rs.map((r) => r.id === updated.id ? {
				...updated,
				reseller_name: r.reseller_name,
				reseller_code: r.reseller_code
			} : r));
			toast.success(`${updated.hostname}: ${updated.ownership_status ?? "pending"} · SSL ${updated.ssl_status}`);
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function onDelete() {
		if (!confirm) return;
		setBusy(confirm.id);
		try {
			await remove({ data: { id: confirm.id } });
			setRows((rs) => rs.filter((r) => r.id !== confirm.id));
			toast.success("Domain disconnected from Cloudflare");
			setConfirm(null);
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	const field = (key, label, placeholder, type = "text") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-w-[200px] flex-1 flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value: String(form[key] ?? ""),
			placeholder,
			onChange: (e) => setForm((f) => ({
				...f,
				[key]: e.target.value
			})),
			className: "rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
		})]
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Custom domains",
			description: "Choose how reseller domains are served — Cloudflare API automation, plain server DNS, or both — and manage every connected domain."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformOriginsCard, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: onSave,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-3 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Which setup do resellers use?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-3",
						children: [
							{
								key: "cloudflare",
								title: "Cloudflare only",
								note: "Hostnames + SSL created through the Cloudflare API."
							},
							{
								key: "dns",
								title: "Server DNS only",
								note: "Reseller points A/CNAME at your server. No API needed."
							},
							{
								key: "both",
								title: "Both",
								note: "Reseller picks the method that fits their domain."
							}
						].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setForm((f) => ({
								...f,
								mode: o.key
							})),
							className: `rounded-lg border p-3 text-left text-sm transition ${form.mode === o.key ? "border-primary bg-primary-soft" : "hover:bg-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: o.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-[11px] text-muted-foreground",
								children: o.note
							})]
						}, o.key))
					})]
				}),
				form.mode !== "cloudflare" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4 text-primary" }), " Server DNS setup"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [field("server_a_ip", "Server IP (A record)", "203.0.113.10"), field("server_cname", "Server CNAME target", "stores.yourplatform.com")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Instruction note for resellers (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: form.server_note,
								placeholder: "After DNS points here, contact support so SSL can be issued on the server.",
								onChange: (e) => setForm((f) => ({
									...f,
									server_note: e.target.value
								})),
								className: "rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.dns_active,
								onChange: (e) => setForm((f) => ({
									...f,
									dns_active: e.target.checked
								})),
								className: "h-4 w-4 rounded border"
							}), "Server DNS mode active"]
						})
					]
				}),
				form.mode !== "dns" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Cloudflare credentials"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: ["API token ", hasToken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px]",
										children: ["saved: ", tokenHint]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									autoComplete: "new-password",
									value: form.api_token,
									placeholder: hasToken ? "Leave blank to keep the saved token" : "Cloudflare API token",
									onChange: (e) => setForm((f) => ({
										...f,
										api_token: e.target.value
									})),
									className: "rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Needs: Zone → SSL and Certificates (Edit), Zone → Zone (Read), Account → Workers Scripts (Edit)."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [field("account_id", "Account ID", "cf account id"), field("zone_id", "Zone ID", "cf zone id")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [field("zone_name", "Zone name", "yourplatform.com"), field("worker_name", "Worker script name", "resellhub-worker")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [field("cname_target", "CNAME target for resellers", "proxy.yourplatform.com"), field("a_record_ip", "A record IP (root domains)", "203.0.113.10")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.is_active,
									onChange: (e) => setForm((f) => ({
										...f,
										is_active: e.target.checked
									})),
									className: "h-4 w-4 rounded border"
								}), "Integration active"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.auto_worker_domain,
									onChange: (e) => setForm((f) => ({
										...f,
										auto_worker_domain: e.target.checked
									})),
									className: "h-4 w-4 rounded border"
								}), "Auto-attach worker domain (same zone only)"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy === "save",
						className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium",
						children: [busy === "save" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save"]
					}), form.mode !== "dns" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onTest,
						disabled: busy === "test",
						className: "inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
						children: [busy === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plug, { className: "h-4 w-4" }), " Test connection"]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 mt-8 flex items-center gap-2 text-sm font-semibold",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }),
				" Connected domains (",
				rows.length,
				")"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card flex flex-wrap items-center gap-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-[220px] flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-medium",
								children: [
									r.hostname,
									r.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary",
										children: "Primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground",
										children: r.mode === "dns" ? "Server DNS" : "Cloudflare"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: [
									r.reseller_name ?? "—",
									" ",
									r.reseller_code ? `· ${r.reseller_code}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex items-center gap-1 text-xs",
								children: r.verified_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-success",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
										" Active · SSL ",
										r.ssl_status
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-warning",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }),
										" ",
										r.ownership_status ?? "pending",
										" · SSL ",
										r.ssl_status
									]
								})
							}),
							r.last_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-destructive",
								children: r.last_error
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onRefresh(r),
						disabled: busy === r.id,
						className: "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted",
						children: [busy === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Check status"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setConfirm(r),
						className: "rounded-md border p-1.5 text-muted-foreground hover:bg-muted",
						"aria-label": "Disconnect domain",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})
				]
			}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border p-8 text-center text-sm text-muted-foreground",
				children: "No reseller domain connected yet."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: !!confirm,
			title: "Disconnect domain?",
			description: "The hostname will be removed and the store will stop serving on it.",
			detail: confirm?.hostname,
			confirmText: "Disconnect",
			isLoading: busy === confirm?.id,
			onClose: () => setConfirm(null),
			onConfirm: onDelete
		})
	] });
}
/**
* The platform's own live domains. Payment gateways return to the origin that
* holds the privileged key, and the shopper/reseller is then sent back to the
* exact site they started on — only hosts listed here (plus connected reseller
* domains and the hosting URL) are accepted, so nothing can hijack a redirect.
*/
function PlatformOriginsCard() {
	const loadOrigins = useServerFn(getPlatformOrigins);
	const saveOrigins = useServerFn(savePlatformOrigins);
	const [hosts, setHosts] = (0, import_react.useState)("");
	const [callback, setCallback] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadOrigins({}).then((s) => {
			setHosts((s.allowed_origins ?? []).join("\n"));
			setCallback(s.callback_base_url ?? "");
		}).catch(() => void 0).finally(() => setReady(true));
	}, []);
	async function onSave() {
		setSaving(true);
		try {
			const out = await saveOrigins({ data: {
				allowed_origins: hosts.split(/[\s,]+/).filter(Boolean),
				callback_base_url: callback
			} });
			setHosts(out.allowed_origins.join("\n"));
			setCallback(out.callback_base_url);
			toast.success("Payment redirect domains saved");
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-card mb-6 space-y-3 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Payment redirect domains"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Ekhane platform er nijer live domain gulo lekho (ek line e ek ta). Ei domain theke payment korle payment success ba cancel — dutotei user oi domain e-i firbe, onno kothao jabe na."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Platform domains"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: hosts,
						onChange: (e) => setHosts(e.target.value),
						placeholder: "yourbrand.com\nshop.yourbrand.com",
						disabled: !ready,
						className: "rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Payment callback address (gateway return URL base)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: callback,
						onChange: (e) => setCallback(e.target.value),
						placeholder: "https://your-app-host",
						disabled: !ready,
						className: "rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onSave,
				disabled: saving || !ready,
				className: "btn-primary inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm disabled:opacity-60",
				children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save domains"]
			})
		]
	});
}
//#endregion
export { DomainsAdmin as component };
