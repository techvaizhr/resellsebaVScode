import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { Gn as CirclePlay, Nt as LoaderCircle, U as Search, n as Youtube } from "./vendor-icons-DF2A5Z8S.js";
import { t as AppModal } from "./AppModal-BVNHKlfq.js";
import { a as youtubeThumb, r as youtubeEmbed, t as loadTutorialLibrary } from "./tutorials-QaTTAHF-.js";
//#region src/components/tutorial-library.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function TutorialLibrary({ compact = false }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [topics, setTopics] = (0, import_react.useState)([]);
	const [videos, setVideos] = (0, import_react.useState)([]);
	const [topic, setTopic] = (0, import_react.useState)("all");
	const [term, setTerm] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const data = await loadTutorialLibrary();
			setTopics(data.topics);
			setVideos(data.tutorials);
			setLoading(false);
		})();
	}, []);
	const usedTopics = (0, import_react.useMemo)(() => topics.filter((t) => videos.some((v) => v.topic_id === t.id)), [topics, videos]);
	const list = (0, import_react.useMemo)(() => {
		const q = term.trim().toLowerCase();
		return videos.filter((v) => {
			if (topic !== "all" && v.topic_id !== topic) return false;
			if (!q) return true;
			return `${v.title} ${v.details ?? ""}`.toLowerCase().includes(q);
		});
	}, [
		videos,
		topic,
		term
	]);
	const topicName = (id) => topics.find((t) => t.id === id)?.name ?? "General";
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-16 text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" })
	});
	if (videos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "mx-auto mb-3 h-8 w-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "No tutorial yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Notun video tutorial add hole ekhane dekha jabe."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: term,
						onChange: (e) => setTerm(e.target.value),
						placeholder: "Search tutorial…",
						className: "w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicChip, {
						active: topic === "all",
						onClick: () => setTopic("all"),
						label: `All (${videos.length})`
					}), usedTopics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicChip, {
						active: topic === t.id,
						onClick: () => setTopic(t.id),
						label: `${t.name} (${videos.filter((v) => v.topic_id === t.id).length})`
					}, t.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid gap-4 ${compact ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`,
				children: list.map((v) => {
					const thumb = youtubeThumb(v.youtube_url, v.thumbnail_url);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(v),
						className: "group overflow-hidden rounded-2xl border bg-card text-left shadow-sm transition hover:border-primary/50 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video w-full overflow-hidden bg-muted",
							children: [
								thumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: thumb,
									alt: v.title,
									loading: "lazy",
									className: "h-full w-full object-cover transition group-hover:scale-105"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-0 grid place-items-center bg-black/25 opacity-90",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-11 w-11 text-white drop-shadow" })
								}),
								v.duration_label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-white",
									children: v.duration_label
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary",
									children: topicName(v.topic_id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-sm font-bold",
									children: v.title
								}),
								v.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: v.details
								}) : null
							]
						})]
					}, v.id);
				})
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground",
				children: "Ei filter e kono tutorial nai."
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialModal, {
				video: open,
				topic: topicName(open.topic_id),
				onClose: () => setOpen(null)
			}) : null
		]
	});
}
function TopicChip({ active, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
		children: label
	});
}
function TutorialModal({ video, topic, onClose }) {
	const embed = youtubeEmbed(video.youtube_url);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppModal, {
		size: "lg",
		padded: false,
		onClose,
		title: video.title,
		badge: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary",
			children: topic
		}),
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: video.youtube_url,
				target: "_blank",
				rel: "noreferrer",
				className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" }), " YouTube te dekhun"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-video w-full bg-black",
			children: embed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: embed,
				title: video.title,
				allow: "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen",
				referrerPolicy: "strict-origin-when-cross-origin",
				allowFullScreen: true,
				className: "h-full w-full"
			}, video.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-full place-items-center text-sm text-white/80",
				children: "Invalid YouTube link"
			})
		}), video.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "whitespace-pre-wrap p-4 text-sm text-muted-foreground",
			children: video.details
		}) : null]
	});
}
//#endregion
export { TutorialLibrary as t };
