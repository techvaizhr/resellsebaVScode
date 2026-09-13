import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Jn as CircleAlert, Nt as LoaderCircle, Y as RefreshCw, jn as Copy, ln as Globe, qn as CircleCheck, tt as Plus, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { i as getDnsGuide, n as disconnectDomain, o as listDomains, s as refreshDomain, t as connectDomain, u as setPrimaryDomain } from "./cloudflare.functions-D77o9EWL.js";
//#region src/routes/_authenticated/reseller/domain.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function errorText(err) {
	if (err instanceof Response) return `Failed (${err.status})`;
	return err instanceof Error ? err.message : "Something went wrong";
}
function CopyChip({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => {
			navigator.clipboard.writeText(value);
			toast.success("Copied");
		},
		className: "inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs font-mono hover:bg-muted/70",
		children: [
			value,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
		]
	});
}
function DomainPage() {
	const load = useServerFn(listDomains);
	const guideFn = useServerFn(getDnsGuide);
	const connect = useServerFn(connectDomain);
	const refresh = useServerFn(refreshDomain);
	const makePrimaryFn = useServerFn(setPrimaryDomain);
	const remove = useServerFn(disconnectDomain);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [guide, setGuide] = (0, import_react.useState)(null);
	const [hostname, setHostname] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("cloudflare");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			try {
				const [d, g] = await Promise.all([load({ data: {} }).catch((e) => {
					console.warn("loadDomains failed", e);
					return [];
				}), guideFn({ data: {} }).catch((e) => {
					console.warn("getDnsGuide failed", e);
					return null;
				})]);
				if (!alive) return;
				setRows(d || []);
				if (g) {
					setGuide(g);
					setMode(g.cfReady ? "cloudflare" : g.dnsReady ? "dns" : "cloudflare");
				} else setGuide({
					cnameTarget: "cname.resellseba.com",
					aRecordIp: "",
					zoneName: "resellseba.com",
					active: true,
					mode: "both",
					serverIp: "103.174.152.20",
					serverCname: "stores.resellseba.com",
					serverNote: "Point your domain A record to our server IP or add a CNAME record.",
					cfReady: true,
					dnsReady: true
				});
			} catch (err) {
				toast.error(errorText(err));
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, []);
	async function add(e) {
		e.preventDefault();
		setBusy("add");
		try {
			const row = await connect({ data: {
				hostname,
				mode
			} });
			setRows((rs) => [...rs, row]);
			setHostname("");
			toast.success("Domain connected — now add the DNS records below");
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function check(row) {
		setBusy(row.id);
		try {
			const updated = await refresh({ data: { id: row.id } });
			setRows((rs) => rs.map((r) => r.id === updated.id ? updated : r));
			toast.success(updated.verified_at ? "Domain is live" : `Still ${updated.ownership_status ?? "pending"} · SSL ${updated.ssl_status}`);
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	async function makePrimary(row) {
		setBusy(row.id);
		try {
			await makePrimaryFn({ data: { id: row.id } });
			setRows((rs) => rs.map((r) => ({
				...r,
				is_primary: r.id === row.id
			})));
			toast.success("Primary domain updated");
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
			toast.success("Domain removed");
			setConfirm(null);
		} catch (err) {
			toast.error(errorText(err));
		} finally {
			setBusy(null);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const cname = guide?.cnameTarget || guide?.zoneName || "";
	const both = !!guide?.cfReady && !!guide?.dnsReady;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Custom domain",
			description: "Connect your own domain (e.g. shop.brand.com). Free SSL is issued automatically after DNS points to us."
		}),
		!guide?.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm",
			children: "Custom domain connection is not enabled yet. Please contact the admin team."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: add,
			className: "surface-card mb-5 space-y-3 p-4",
			children: [both && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [{
					key: "cloudflare",
					label: "Cloudflare (auto SSL)"
				}, {
					key: "dns",
					label: "Server DNS"
				}].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(o.key),
					className: `rounded-md border px-3 py-1.5 text-xs font-medium transition ${mode === o.key ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted"}`,
					children: o.label
				}, o.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[220px] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Hostname"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: hostname,
						onChange: (e) => setHostname(e.target.value),
						className: "w-full rounded-md border bg-background px-3 py-2 text-sm",
						placeholder: "shop.yourbrand.com"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy === "add" || !guide?.active,
					className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-60",
					children: [busy === "add" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Connect"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mb-5 p-5 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }), " DNS setup instructions"]
			}), mode === "cloudflare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "ml-4 list-decimal space-y-1.5 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open your domain provider's DNS settings (GoDaddy, Namecheap, Cloudflare…)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Subdomain: add a ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1 text-xs",
							children: "CNAME"
						}),
						" record pointing to",
						" ",
						cname ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: cname }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "italic",
							children: "target will appear once admin sets it up"
						})
					] }),
					guide?.aRecordIp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Root domain: add an ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1 text-xs",
							children: "A"
						}),
						" record to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: guide.aRecordIp })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "DNS can take 5–60 minutes. Then press “Check status” — SSL is issued automatically." })
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "ml-4 list-decimal space-y-1.5 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Open your domain provider's DNS settings." }),
					guide?.serverIp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Root domain: add an ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1 text-xs",
							children: "A"
						}),
						" record to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: guide.serverIp })
					] }),
					guide?.serverCname && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Subdomain: add a ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-muted px-1 text-xs",
							children: "CNAME"
						}),
						" record to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: guide.serverCname })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep the record un-proxied (grey cloud) if your provider is Cloudflare." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "DNS can take 5–60 minutes. Then press “Check status” — we verify the record live." }),
					guide?.serverNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-foreground",
						children: guide.serverNote
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[200px] flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground",
									children: r.verified_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-success" }),
										" Live · SSL ",
										r.ssl_status
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 text-warning" }),
										" ",
										r.ownership_status ?? "pending",
										" · SSL ",
										r.ssl_status
									] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => check(r),
								disabled: busy === r.id,
								className: "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted",
								children: [busy === r.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Check status"]
							}),
							!r.is_primary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => makePrimary(r),
								className: "rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted",
								children: "Make primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setConfirm(r),
								className: "rounded-md border p-1.5 text-muted-foreground hover:bg-muted",
								"aria-label": "Remove domain",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					r.verification_txt_name && !r.verified_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-md bg-muted/50 p-3 text-xs",
						children: [
							"Ownership check pending. Add TXT record ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: r.verification_txt_name }),
							" with value",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyChip, { value: r.verification_txt_value ?? "" })
						]
					}),
					r.last_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-[11px] text-destructive",
						children: r.last_error
					})
				]
			}, r.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border p-8 text-center text-sm text-muted-foreground",
				children: "No custom domains yet."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
			isOpen: !!confirm,
			title: "Remove this domain?",
			description: "Your store will stop working on this domain and the SSL certificate will be deleted.",
			detail: confirm?.hostname,
			confirmText: "Remove",
			isLoading: busy === confirm?.id,
			onClose: () => setConfirm(null),
			onConfirm: onDelete
		})
	] });
}
//#endregion
export { DomainPage as component };
