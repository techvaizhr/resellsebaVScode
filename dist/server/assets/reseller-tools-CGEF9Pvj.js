import { r as supabase } from "./client-BpJCBCUq.js";
import { c as borderc, l as cx, u as muted } from "./ui-CzBr4gZE.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, Copy, Download, ImageDown, Loader2 } from "lucide-react";
//#region src/components/store/reseller-tools.tsx
/**
* Reseller tools are hidden from normal customers.
* They appear only when the visitor has a platform session (reseller / admin),
* or when the URL carries ?tools=1 (handy for sharing a copy-ready link).
*/
function useResellerTools() {
	const [on, setOn] = useState(false);
	useEffect(() => {
		let alive = true;
		try {
			if (new URLSearchParams(window.location.search).get("tools") === "1") {
				setOn(true);
				return;
			}
		} catch {}
		supabase.auth.getSession().then(({ data }) => {
			if (alive) setOn(Boolean(data.session));
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			if (alive) setOn(Boolean(s));
		});
		return () => {
			alive = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	return on;
}
function fileNameFor(url, base, i) {
	const clean = base.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "product";
	const ext = (url.split("?")[0].match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1] ?? "jpg").toLowerCase();
	return `${clean}-${i + 1}.${ext}`;
}
/** Messenger/Facebook can't handle WebP — re-encode downloads as JPEG. */
async function toJpegBlob(blob) {
	if (blob.type === "image/jpeg") return blob;
	try {
		const bmp = await createImageBitmap(blob);
		const canvas = document.createElement("canvas");
		canvas.width = bmp.width;
		canvas.height = bmp.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return blob;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(bmp, 0, 0);
		bmp.close?.();
		return await new Promise((r) => canvas.toBlob(r, "image/jpeg", .92)) ?? blob;
	} catch {
		return blob;
	}
}
async function downloadOne(url, name) {
	try {
		const res = await fetch(url, { mode: "cors" });
		if (!res.ok) throw new Error("fetch failed");
		const blob = await toJpegBlob(await res.blob());
		if (blob.type === "image/jpeg") name = name.replace(/\.\w+$/, ".jpg");
		const href = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = href;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(href), 4e3);
	} catch {
		window.open(url, "_blank", "noopener,noreferrer");
	}
}
var toolBtn = "inline-flex items-center gap-1.5 rounded-[var(--st-radius-sm)] border px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-[var(--st-primary)] hover:text-[var(--st-primary)]";
function CopyButton({ value, label, className }) {
	const [done, setDone] = useState(false);
	async function copy() {
		const text = value.trim();
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
		}
		setDone(true);
		toast.success(`${label ?? "Text"} copied`);
		setTimeout(() => setDone(false), 1600);
	}
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: copy,
		title: `Copy ${label ?? "text"}`,
		"aria-label": `Copy ${label ?? "text"}`,
		className: cx(toolBtn, borderc, muted, "justify-center", className),
		children: [done ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }), label && !className?.includes("rounded-full") ? /* @__PURE__ */ jsx("span", { children: done ? "Copied" : `Copy ${label}` }) : null]
	});
}
function ImageDownloadTools({ images, activeUrl, baseName, compact }) {
	const [busy, setBusy] = useState(null);
	const list = images.filter(Boolean);
	if (list.length === 0) return null;
	async function one() {
		const url = activeUrl || list[0];
		setBusy("one");
		await downloadOne(url, fileNameFor(url, baseName, Math.max(0, list.indexOf(url))));
		setBusy(null);
	}
	async function all() {
		setBusy("all");
		for (let i = 0; i < list.length; i++) {
			await downloadOne(list[i], fileNameFor(list[i], baseName, i));
			await new Promise((r) => setTimeout(r, 350));
		}
		setBusy(null);
		toast.success(`${list.length} image downloaded`);
	}
	if (compact) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: one,
			title: "Download this image",
			"aria-label": "Download this image",
			className: "grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/80 bg-destructive text-destructive-foreground shadow-lg transition hover:brightness-110 active:scale-95",
			children: busy === "one" ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" })
		}), list.length > 1 && /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: all,
			title: `Download all ${list.length} images`,
			"aria-label": `Download all ${list.length} images`,
			className: "grid h-9 w-9 place-items-center rounded-full border-2 border-foreground/80 bg-card text-foreground shadow-lg transition hover:brightness-110 active:scale-95",
			children: busy === "all" ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ImageDown, { className: "h-4 w-4" })
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-2",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: one,
			className: cx(toolBtn, borderc, muted),
			children: [busy === "one" ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "This image" })]
		}), list.length > 1 && /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: all,
			className: cx("inline-flex items-center gap-1.5 rounded-[var(--st-radius-sm)] border px-2.5 py-1.5 text-[11px] font-semibold transition hover:border-[var(--st-primary)] hover:text-[var(--st-primary)]", "border-[var(--st-border)]", "text-[var(--st-muted)]"),
			children: [busy === "all" ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(ImageDown, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
				"All ",
				list.length,
				" images"
			] })]
		})]
	});
}
function stripHtml(html) {
	return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h[1-6])>/gi, "\n").replace(/<li[^>]*>/gi, "• ").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
export { useResellerTools as i, ImageDownloadTools as n, stripHtml as r, CopyButton as t };
