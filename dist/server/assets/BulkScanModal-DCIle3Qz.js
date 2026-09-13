import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-CI2ZnE4F.js";
import { l as orderStatusLabel } from "./courier-status-BxiQVHJB.js";
import { G as ScanLine, Nt as LoaderCircle, Vn as CircleX, ar as Camera, o as VolumeX, or as CameraOff, qn as CircleCheck, r as X, s as Volume2 } from "./vendor-icons-DF2A5Z8S.js";
import { t as cn } from "./utils-UzdMQEyF.js";
//#region src/components/BulkScanModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MODES = {
	handover: {
		title: "Bulk scan · Courier Handover",
		hint: "Packaging → Courier Handover",
		from: "packaging",
		to: "ready_to_ship",
		note: "Bulk scan handover"
	},
	return: {
		title: "Bulk scan · Return received",
		hint: "Pending Return → Returned",
		from: "pending_return",
		to: "returned",
		note: "Bulk scan return received"
	}
};
var audioCtx = null;
function ctx() {
	if (typeof window === "undefined") return null;
	const AC = window.AudioContext ?? window.webkitAudioContext;
	if (!AC) return null;
	if (!audioCtx) audioCtx = new AC();
	if (audioCtx.state === "suspended") audioCtx.resume();
	return audioCtx;
}
function tone(freq, start, dur, type = "sine", gain = .5) {
	const ac = ctx();
	if (!ac) return;
	const t0 = ac.currentTime + start;
	const osc = ac.createOscillator();
	const g = ac.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t0);
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(gain, t0 + .02);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
	osc.connect(g).connect(ac.destination);
	osc.start(t0);
	osc.stop(t0 + dur + .05);
}
/** Note + soft octave shimmer so it sounds like a chime, not a beep. */
function chime(freq, start, dur, gain = .5) {
	tone(freq, start, dur, "triangle", gain);
	tone(freq * 2, start, dur * .7, "sine", gain * .35);
	tone(freq / 2, start, dur * .5, "sine", gain * .2);
}
function beepSuccess() {
	chime(523.25, 0, .45, .55);
	chime(659.25, .12, .45, .55);
	chime(783.99, .24, .5, .55);
	chime(1046.5, .38, .7, .6);
}
function beepError() {
	const t = 0;
	tone(220, t, .38, "square", .5);
	tone(207, t, .38, "sawtooth", .35);
	tone(110, t, .38, "sine", .4);
	tone(175, .42, .38, "square", .5);
	tone(165, .42, .38, "sawtooth", .35);
	tone(82, .42, .38, "sine", .4);
}
function cleanCode(raw) {
	return raw.trim().replace(/^#/, "").replace(/\s+/g, "");
}
async function findOrder(code) {
	const c = cleanCode(code);
	if (!c) return null;
	const { data: byNumber } = await supabase.from("orders").select("id, order_number, status, customer_name").ilike("order_number", c).limit(1).maybeSingle();
	if (byNumber) return byNumber;
	const { data: ship } = await supabase.from("shipments").select("order_id").or(`tracking_id.eq.${c},consignment_id.eq.${c}`).limit(1).maybeSingle();
	if (!ship?.order_id) return null;
	const { data: byShip } = await supabase.from("orders").select("id, order_number, status, customer_name").eq("id", ship.order_id).maybeSingle();
	return byShip ?? null;
}
function nextStatus(mode, current) {
	const m = MODES[mode];
	if (current === m.from) return { to: m.to };
	if (current === m.to) return { error: `Already in ${orderStatusLabel(m.to)}` };
	return { error: `Not allowed — order is in ${orderStatusLabel(current)} (needs ${orderStatusLabel(m.from)})` };
}
function BulkScanButton({ compact = false, mode = "handover", onDone, className, resolve, apply, modes }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		title: MODES[mode].hint,
		className: cn("inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4 w-4" }), (() => {
			const label = mode === "return" ? "Bulk return" : "Bulk scan";
			return compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: label
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label });
		})()]
	}), open && mounted ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkScanModal, {
		mode,
		resolve,
		apply,
		modes,
		onClose: () => {
			setOpen(false);
			onDone?.();
		}
	}), document.body) : null] });
}
function BulkScanModal({ mode: initialMode, onClose, resolve, apply, modes }) {
	const [mode, setMode] = (0, import_react.useState)(initialMode);
	const cfg = MODES[mode];
	const modeList = modes && modes.length ? modes : ["handover", "return"];
	const [sound, setSound] = (0, import_react.useState)(true);
	const [camOn, setCamOn] = (0, import_react.useState)(false);
	const [camError, setCamError] = (0, import_react.useState)(null);
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [last, setLast] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const controlsRef = (0, import_react.useRef)(null);
	const seenRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const doneRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const busyRef = (0, import_react.useRef)(false);
	const counts = (0, import_react.useMemo)(() => ({
		ok: logs.filter((l) => l.ok).length,
		fail: logs.filter((l) => !l.ok).length
	}), [logs]);
	const push = (0, import_react.useCallback)((row) => {
		setLogs((prev) => [{
			...row,
			id: crypto.randomUUID(),
			at: Date.now()
		}, ...prev].slice(0, 200));
	}, []);
	const handleCode = (0, import_react.useCallback)(async (raw) => {
		const code = cleanCode(raw);
		if (!code || busyRef.current) return;
		const nowTs = Date.now();
		const seenAt = seenRef.current.get(code);
		if (seenAt && nowTs - seenAt < 900) return;
		seenRef.current.set(code, nowTs);
		busyRef.current = true;
		setBusy(true);
		try {
			const order = resolve ? await resolve(code) : await findOrder(code);
			if (!order) {
				if (sound) beepError();
				setLast({
					ok: false,
					text: "Order not found",
					sub: code
				});
				push({
					code,
					ok: false,
					message: "Order not found"
				});
				return;
			}
			const already = doneRef.current.get(order.id);
			if (already) {
				if (sound) beepError();
				setLast({
					ok: false,
					text: `Duplicate scan · ${order.order_number}`,
					sub: `Already scanned (${already})`
				});
				push({
					code: order.order_number,
					ok: false,
					message: `Duplicate — already scanned (${already})`
				});
				return;
			}
			const step = nextStatus(mode, order.status);
			if ("error" in step) {
				if (sound) beepError();
				setLast({
					ok: false,
					text: step.error,
					sub: order.order_number
				});
				push({
					code: order.order_number,
					ok: false,
					message: step.error
				});
				return;
			}
			if (apply) try {
				await apply(order, step.to);
			} catch (e) {
				const msg = e?.message ?? "Status change failed";
				if (sound) beepError();
				setLast({
					ok: false,
					text: msg,
					sub: order.order_number
				});
				push({
					code: order.order_number,
					ok: false,
					message: msg
				});
				return;
			}
			else {
				const { error } = await supabase.from("orders").update(mode === "return" ? {
					status: step.to,
					received_amount: 0,
					settled_at: (/* @__PURE__ */ new Date()).toISOString()
				} : { status: step.to }).eq("id", order.id);
				if (error) {
					if (sound) beepError();
					setLast({
						ok: false,
						text: error.message,
						sub: order.order_number
					});
					push({
						code: order.order_number,
						ok: false,
						message: error.message
					});
					return;
				}
				await supabase.from("order_status_history").insert({
					order_id: order.id,
					status: step.to,
					note: cfg.note
				});
			}
			doneRef.current.set(order.id, orderStatusLabel(step.to));
			if (sound) beepSuccess();
			setLast({
				ok: true,
				text: `${order.order_number} → ${orderStatusLabel(step.to)}`,
				sub: order.customer_name ?? void 0
			});
			push({
				code: order.order_number,
				ok: true,
				message: orderStatusLabel(step.to)
			});
		} finally {
			busyRef.current = false;
			setBusy(false);
		}
	}, [
		push,
		sound,
		mode,
		cfg.note,
		resolve,
		apply
	]);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			const el = document.activeElement;
			if (el === inputRef.current) return;
			const tag = el?.tagName;
			if (tag === "SELECT" || tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA" || tag === "OPTION") return;
			inputRef.current?.focus();
		}, 1200);
		inputRef.current?.focus();
		return () => clearInterval(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function start() {
			setCamError(null);
			try {
				const { BrowserMultiFormatReader } = await import("./vendor-barcode-CVWVXWYQ.js").then((n) => n.n);
				const controls = await new BrowserMultiFormatReader(void 0, { delayBetweenScanAttempts: 250 }).decodeFromVideoDevice(void 0, videoRef.current ?? void 0, (result) => {
					if (result) handleCode(result.getText());
				});
				if (cancelled) controls.stop();
				else controlsRef.current = controls;
			} catch (e) {
				if (!cancelled) {
					setCamError(e?.message ?? "Camera unavailable");
					setCamOn(false);
				}
			}
		}
		if (camOn) {
			ctx();
			start();
		}
		return () => {
			cancelled = true;
			controlsRef.current?.stop();
			controlsRef.current = null;
		};
	}, [camOn, handleCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-background/80 p-3 backdrop-blur-sm sm:items-center sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b bg-muted/40 px-4 py-3 sm:px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-base font-bold",
								children: cfg.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: cfg.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSound((s) => !s),
							title: sound ? "Mute beeps" : "Enable beeps",
							className: "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
							children: sound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 sm:p-5 md:grid-cols-[1.1fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-muted-foreground",
								children: "Scan mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("grid gap-2", modeList.length > 1 ? "grid-cols-2" : "grid-cols-1"),
								children: modeList.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setMode(m),
									className: cn("rounded-md border px-3 py-2 text-left text-xs font-semibold transition-colors", mode === m ? "border-primary bg-primary/10 text-primary" : "bg-background text-muted-foreground hover:bg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block",
										children: m === "return" ? "Return received" : "Courier handover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-[10px] font-normal opacity-80",
										children: MODES[m].hint
									})]
								}, m))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary",
								children: cfg.hint
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									const v = value;
									setValue("");
									handleCode(v);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium text-muted-foreground",
										children: "Scanner / manual entry"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: inputRef,
											value,
											onChange: (e) => setValue(e.target.value),
											placeholder: "Scan barcode or type order number…",
											autoComplete: "off",
											className: "h-11 w-full rounded-md border bg-background pl-3 pr-10 text-sm font-mono outline-none focus:ring-2 focus:ring-primary"
										}), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute right-3 top-3.5 h-4 w-4 animate-spin text-muted-foreground" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "USB/Bluetooth scanner works directly — this box stays focused."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setCamOn((v) => !v),
								className: cn("inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors", camOn ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20" : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"),
								children: [camOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), camOn ? "Stop camera" : "Use mobile camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("overflow-hidden rounded-xl border bg-black/90", camOn ? "aspect-video" : "hidden"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									ref: videoRef,
									className: "h-full w-full object-cover",
									muted: true,
									playsInline: true
								})
							}),
							camError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: camError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-emerald-500/10 p-3 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-extrabold text-emerald-600",
										children: counts.ok
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-medium text-emerald-700/80",
										children: "Success scans"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-destructive/10 p-3 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-extrabold text-destructive",
										children: counts.fail
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-medium text-destructive/80",
										children: "Errors"
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-xl border p-4 transition-colors", last == null ? "bg-muted/40" : last.ok ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"),
							children: [last == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-6 w-6 text-muted-foreground" }) : last.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-6 w-6 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-bold",
									children: last?.text ?? "Waiting for first scan…"
								}), last?.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: last.sub
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b px-3 py-2 text-xs font-semibold text-muted-foreground",
								children: "Scan history"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-72 overflow-y-auto no-scrollbar divide-y",
								children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-3 text-xs text-muted-foreground",
									children: "No scans yet."
								}) : logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 px-3 py-2",
									children: [
										l.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 shrink-0 text-destructive" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-medium",
											children: l.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto truncate text-[11px] text-muted-foreground",
											children: l.message
										})
									]
								}, l.id))
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-t bg-muted/30 px-4 py-3 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							counts.ok,
							" updated · ",
							counts.fail,
							" failed"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
						children: "Done"
					})]
				})
			]
		})
	});
}
//#endregion
export { BulkScanButton as t };
