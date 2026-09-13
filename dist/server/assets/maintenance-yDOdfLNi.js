import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { s as createSsrRpc } from "./client-DipTEthi.js";
import { t as useServerFn } from "./useServerFn-mrQ2htrR.js";
import { t as requireSupabaseAuth } from "./auth-middleware-XRMpJ1R8.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Cn as Eraser, Nt as LoaderCircle, Y as RefreshCw, in as HardDrive, v as Trash2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as ConfirmModal } from "./ConfirmModal-DSu87j9m.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
//#region src/lib/maintenance-targets.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
/** Browser-safe list of the data buckets the cleanup tool can wipe. */
var CLEANUP_TARGETS = [
	{
		key: "audit_log",
		label: "Audit / action log",
		hint: "Every stored audit event — not used anywhere in the app."
	},
	{
		key: "store_visits",
		label: "Old store visits",
		hint: "Visit rows older than 30 days (report only keeps 30 days)."
	},
	{
		key: "courier_events",
		label: "Old courier webhook events",
		hint: "Courier callback payloads older than 60 days."
	},
	{
		key: "notification_logs",
		label: "Old notification logs",
		hint: "SMS / email / WhatsApp send logs older than 60 days."
	}
];
//#endregion
//#region src/lib/maintenance.functions.ts
/** How many junk rows are currently sitting in the database. */
var cleanupStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9206c2c485c931b124bb366ad679dd49c7bf9890ecb6f6df5ad02c908be2c810"));
/** Delete the selected junk data. */
var runCleanup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("68042aec30d5ed0b48916e0d1225d252ef3cba70b07e0d29d468d44d8d5f9d3b"));
//#endregion
//#region src/routes/_authenticated/admin/maintenance.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function MaintenancePage() {
	const stats = useServerFn(cleanupStats);
	const clean = useServerFn(runCleanup);
	const [rows, setRows] = (0, import_react.useState)({});
	const [picked, setPicked] = (0, import_react.useState)(CLEANUP_TARGETS.map((t) => t.key));
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	async function load() {
		setLoading(true);
		try {
			const res = await stats({});
			setRows(Object.fromEntries(res.map((r) => [r.key, r.rows])));
		} catch (e) {
			toast.error(e?.message ?? "Could not read cleanup data");
		}
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const toggle = (key) => setPicked((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]);
	async function doClean() {
		setBusy(true);
		try {
			const total = (await clean({ data: { keys: picked } })).reduce((s, r) => s + r.rows, 0);
			toast.success(`Cleaned ${total.toLocaleString()} row(s)`);
			await load();
		} catch (e) {
			toast.error(e?.message ?? "Cleanup failed");
		}
		setBusy(false);
		setConfirmOpen(false);
	}
	async function clearBrowserCache() {
		try {
			if ("caches" in window) {
				const keys = await caches.keys();
				await Promise.all(keys.map((k) => caches.delete(k)));
			}
			sessionStorage.clear();
			toast.success("Browser cache cleared — reloading");
			setTimeout(() => window.location.reload(), 600);
		} catch (e) {
			toast.error(e?.message ?? "Could not clear browser cache");
		}
	}
	const total = Object.values(rows).reduce((s, n) => s + n, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Cache & cleanup",
				description: "Remove logs, courier webhook payloads and other data the app does not need to keep. Orders, products, resellers and money records are never touched.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: load,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") }), " Refresh"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card flex flex-wrap items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
						children: "Removable rows"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-black",
						children: loading ? "…" : total.toLocaleString()
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: clearBrowserCache,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "h-4 w-4" }), " Clear browser cache"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card divide-y overflow-hidden",
				children: CLEANUP_TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: picked.includes(t.key),
							onChange: () => toggle(t.key),
							className: "mt-1 h-4 w-4 accent-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: t.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: t.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-sm font-black",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : (rows[t.key] ?? 0).toLocaleString()
						})
					]
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => picked.length === 0 ? toast.error("Select at least one item") : setConfirmOpen(true),
				disabled: busy,
				className: "inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground hover:opacity-90 disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Clean selected data"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: confirmOpen,
				onClose: () => setConfirmOpen(false),
				onConfirm: doClean,
				isLoading: busy,
				variant: "danger",
				title: "Clean selected data?",
				description: "This permanently deletes the selected logs and old records. Orders, products, resellers and money records are not affected.",
				detail: `${picked.length} item(s) · ${picked.reduce((s, k) => s + (rows[k] ?? 0), 0).toLocaleString()} row(s)`,
				confirmText: "Clean now"
			})
		]
	});
}
//#endregion
export { MaintenancePage as component };
