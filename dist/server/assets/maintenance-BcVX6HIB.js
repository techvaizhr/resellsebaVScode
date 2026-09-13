import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { s as createSsrRpc } from "./client-CdRSQB5v.js";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.js";
import { t as requireSupabaseAuth } from "./auth-middleware-BK7ADgER.js";
import { t as ConfirmModal } from "./ConfirmModal-CPm0pZdA.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Eraser, HardDrive, Loader2, RefreshCw, Trash2 } from "lucide-react";
//#region src/lib/maintenance-targets.ts
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
function MaintenancePage() {
	const stats = useServerFn(cleanupStats);
	const clean = useServerFn(runCleanup);
	const [rows, setRows] = useState({});
	const [picked, setPicked] = useState(CLEANUP_TARGETS.map((t) => t.key));
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
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
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Cache & cleanup",
				description: "Remove logs, courier webhook payloads and other data the app does not need to keep. Orders, products, resellers and money records are never touched.",
				actions: /* @__PURE__ */ jsxs("button", {
					onClick: load,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted",
					children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") }), " Refresh"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card flex flex-wrap items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ jsx(HardDrive, { className: "h-5 w-5" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
						children: "Removable rows"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xl font-black",
						children: loading ? "…" : total.toLocaleString()
					})] })]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: clearBrowserCache,
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold hover:bg-muted",
					children: [/* @__PURE__ */ jsx(Eraser, { className: "h-4 w-4" }), " Clear browser cache"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card divide-y overflow-hidden",
				children: CLEANUP_TARGETS.map((t) => /* @__PURE__ */ jsxs("label", {
					className: "flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/30",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: picked.includes(t.key),
							onChange: () => toggle(t.key),
							className: "mt-1 h-4 w-4 accent-primary"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: t.label
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: t.hint
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "shrink-0 text-sm font-black",
							children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" }) : (rows[t.key] ?? 0).toLocaleString()
						})
					]
				}, t.key))
			}),
			/* @__PURE__ */ jsxs("button", {
				onClick: () => picked.length === 0 ? toast.error("Select at least one item") : setConfirmOpen(true),
				disabled: busy,
				className: "inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground hover:opacity-90 disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), " Clean selected data"]
			}),
			/* @__PURE__ */ jsx(ConfirmModal, {
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
