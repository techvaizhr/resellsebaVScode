import { r as supabase } from "./client-BpJCBCUq.js";
import { n as getPanelBootstrapPayload } from "./panel-bootstrap-BcAwhCIE.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowRight, BellRing, CheckCircle2, ChevronRight, Megaphone, X } from "lucide-react";
//#region src/components/admin-notice-popup.tsx
var LEVEL_STYLE = {
	info: {
		ring: "border-primary/35",
		chip: "bg-primary-soft text-primary",
		icon: /* @__PURE__ */ jsx(Megaphone, { className: "h-5 w-5" }),
		label: "Notice",
		glow: "from-primary/25"
	},
	success: {
		ring: "border-emerald-500/40",
		chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }),
		label: "Good news",
		glow: "from-emerald-500/25"
	},
	warning: {
		ring: "border-amber-500/45",
		chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
		icon: /* @__PURE__ */ jsx(BellRing, { className: "h-5 w-5" }),
		label: "Warning",
		glow: "from-amber-500/25"
	},
	critical: {
		ring: "border-rose-500/45",
		chip: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
		icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }),
		label: "Urgent",
		glow: "from-rose-500/25"
	}
};
/** Full-screen popup that walks the reseller through every unseen admin notice. */
function AdminNoticePopup({ notices, onDismiss }) {
	const [index, setIndex] = useState(0);
	const [closed, setClosed] = useState([]);
	const queue = useMemo(() => notices.filter((n) => !closed.includes(n.id)), [notices, closed]);
	const current = queue[Math.min(index, queue.length - 1)];
	useEffect(() => {
		if (index > 0 && index >= queue.length) setIndex(0);
	}, [index, queue.length]);
	useEffect(() => {
		if (!current) return;
		const onKey = (e) => {
			if (e.key === "Escape") setClosed((c) => [...c, current.id]);
		};
		window.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [current]);
	if (!current) return null;
	const style = LEVEL_STYLE[current.level] ?? LEVEL_STYLE.info;
	const hide = () => setClosed((c) => [...c, current.id]);
	const next = () => {
		if (queue.length > 1) setIndex((i) => (i + 1) % queue.length);
		else hide();
	};
	const acknowledge = () => {
		onDismiss(current.id);
		setIndex(0);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[90] grid place-items-center bg-background/70 p-4 backdrop-blur-sm animate-in fade-in duration-200",
		onClick: hide,
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: `relative w-full max-w-lg overflow-hidden rounded-2xl border ${style.ring} bg-card shadow-elegant animate-in zoom-in-95 slide-in-from-bottom-2 duration-200`,
			children: [
				/* @__PURE__ */ jsx("div", { className: `pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b ${style.glow} to-transparent` }),
				/* @__PURE__ */ jsx("button", {
					onClick: hide,
					"aria-label": "Close",
					className: "absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border bg-background/80 text-muted-foreground transition hover:bg-muted",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				}),
				current.image_url ? /* @__PURE__ */ jsx("img", {
					src: current.image_url,
					alt: "",
					className: "h-40 w-full object-cover",
					loading: "lazy"
				}) : null,
				/* @__PURE__ */ jsxs("div", {
					className: "relative p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: `grid h-10 w-10 place-items-center rounded-xl ${style.chip}`,
									children: style.icon
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: style.label
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-muted-foreground/80",
										children: new Date(current.created_at).toLocaleDateString("en-GB", {
											day: "2-digit",
											month: "short",
											year: "numeric"
										})
									})]
								}),
								queue.length > 1 && /* @__PURE__ */ jsxs("span", {
									className: "ml-auto mr-9 rounded-full border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
									children: [
										Math.min(index, queue.length - 1) + 1,
										" / ",
										queue.length
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-extrabold leading-snug",
							children: current.title
						}),
						current.body ? /* @__PURE__ */ jsx("p", {
							className: "mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground",
							children: current.body
						}) : null,
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 flex flex-wrap items-center gap-2",
							children: [
								current.cta_url ? /* @__PURE__ */ jsxs("a", {
									href: current.cta_url,
									target: current.cta_url.startsWith("http") ? "_blank" : void 0,
									rel: "noreferrer",
									className: "btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-elegant transition hover:opacity-90 active:scale-95",
									children: [
										current.cta_label || "Learn more",
										" ",
										/* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
									]
								}) : null,
								current.is_dismissible ? /* @__PURE__ */ jsxs("button", {
									onClick: acknowledge,
									className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 active:scale-95",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), " Got it"]
								}) : null,
								queue.length > 1 ? /* @__PURE__ */ jsxs("button", {
									onClick: next,
									className: "inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted",
									children: ["Next ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
								}) : /* @__PURE__ */ jsx("button", {
									onClick: hide,
									className: "inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-muted",
									children: "Later"
								})
							]
						}),
						!current.is_dismissible && /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-[11px] text-muted-foreground",
							children: "This notice stays until the admin turns it off."
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/lib/admin-notices.ts
var NOTICE_LEVELS = [
	{
		value: "info",
		label: "Info"
	},
	{
		value: "success",
		label: "Good news"
	},
	{
		value: "warning",
		label: "Warning"
	},
	{
		value: "critical",
		label: "Urgent"
	}
];
function isLive(n, now = Date.now()) {
	if (!n.is_active) return false;
	if (n.starts_at && new Date(n.starts_at).getTime() > now) return false;
	if (n.ends_at && new Date(n.ends_at).getTime() < now) return false;
	return true;
}
/**
* Live admin notices for the signed-in user, minus the ones they already dismissed.
* Targeted notices only surface for the listed resellers.
*/
function useLiveNotices(userId, resellerId) {
	const [notices, setNotices] = useState([]);
	const [loading, setLoading] = useState(true);
	const load = useCallback(async (force = true) => {
		if (!userId) return;
		const primed = force ? null : getPanelBootstrapPayload()?.notices;
		if (primed) {
			setNotices(primed);
			setLoading(false);
			return;
		}
		setLoading(true);
		const [noticeRes, seenRes] = await Promise.all([supabase.from("admin_notices").select("*").order("created_at", { ascending: false }).limit(50), supabase.from("admin_notice_dismissals").select("notice_id").eq("user_id", userId)]);
		const seen = new Set((seenRes.data ?? []).map((d) => d.notice_id));
		const rows = (noticeRes.data ?? []).filter((n) => {
			if (!isLive(n)) return false;
			if (seen.has(n.id)) return false;
			const targets = n.target_reseller_ids ?? [];
			if (targets.length && (!resellerId || !targets.includes(resellerId))) return false;
			return true;
		});
		setNotices(rows);
		setLoading(false);
	}, [userId, resellerId]);
	useEffect(() => {
		load(false);
	}, [load]);
	return {
		notices,
		loading,
		dismiss: useCallback(async (id) => {
			setNotices((prev) => prev.filter((n) => n.id !== id));
			const boot = getPanelBootstrapPayload();
			if (boot) boot.notices = (boot.notices ?? []).filter((n) => n?.id !== id);
			if (!userId) return;
			await supabase.from("admin_notice_dismissals").upsert({
				notice_id: id,
				user_id: userId
			}, { onConflict: "notice_id,user_id" });
		}, [userId]),
		reload: load
	};
}
//#endregion
export { useLiveNotices as n, AdminNoticePopup as r, NOTICE_LEVELS as t };
