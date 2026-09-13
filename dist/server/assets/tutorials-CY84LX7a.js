import { r as supabase } from "./client-CdRSQB5v.js";
import { n as confirmAction } from "./confirm-CI5WE9B0.js";
import { n as PageHeader, t as EmptyState } from "./ui-kit-D-uo76H8.js";
import { t as AppModal } from "./AppModal-C8qUvQNk.js";
import { a as youtubeThumb, i as youtubeId, n as slugify } from "./tutorials-C48WrWlU.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ExternalLink, FolderTree, Loader2, Pencil, Plus, Power, Trash2, Youtube } from "lucide-react";
//#region src/routes/_authenticated/admin/tutorials.tsx?tsr-split=component
var inp = "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
var EMPTY_VIDEO = {
	topic_id: "",
	title: "",
	details: "",
	youtube_url: "",
	duration_label: "",
	sort_order: 0,
	is_active: true,
	reseller_only: false
};
var EMPTY_TOPIC = {
	name: "",
	description: "",
	sort_order: 0,
	is_active: true
};
function AdminTutorialsPage() {
	const [tab, setTab] = useState("videos");
	const [topics, setTopics] = useState([]);
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [videoDraft, setVideoDraft] = useState(null);
	const [topicDraft, setTopicDraft] = useState(null);
	const [saving, setSaving] = useState(false);
	const [filter, setFilter] = useState("all");
	useEffect(() => {
		load();
	}, []);
	async function load() {
		setLoading(true);
		const [t, v] = await Promise.all([supabase.from("tutorial_topics").select("*").order("sort_order").order("name"), supabase.from("tutorials").select("*").order("sort_order").order("created_at", { ascending: false })]);
		setTopics(t.data ?? []);
		setVideos(v.data ?? []);
		setLoading(false);
	}
	const shown = useMemo(() => filter === "all" ? videos : videos.filter((v) => filter === "none" ? !v.topic_id : v.topic_id === filter), [videos, filter]);
	const topicName = (id) => topics.find((t) => t.id === id)?.name ?? "General";
	async function saveVideo() {
		if (!videoDraft) return;
		if (!videoDraft.title.trim()) return toast.error("Title dorkar");
		if (!youtubeId(videoDraft.youtube_url)) return toast.error("Valid YouTube link dao");
		setSaving(true);
		const payload = {
			topic_id: videoDraft.topic_id || null,
			title: videoDraft.title.trim(),
			details: videoDraft.details.trim() || null,
			youtube_url: videoDraft.youtube_url.trim(),
			duration_label: videoDraft.duration_label.trim() || null,
			sort_order: Number(videoDraft.sort_order) || 0,
			is_active: videoDraft.is_active,
			reseller_only: videoDraft.reseller_only
		};
		const res = videoDraft.id ? await supabase.from("tutorials").update(payload).eq("id", videoDraft.id) : await supabase.from("tutorials").insert(payload);
		setSaving(false);
		if (res.error) return toast.error(res.error.message);
		toast.success(videoDraft.id ? "Tutorial updated" : "Tutorial added");
		setVideoDraft(null);
		load();
	}
	async function saveTopic() {
		if (!topicDraft) return;
		if (!topicDraft.name.trim()) return toast.error("Topic name dorkar");
		setSaving(true);
		const payload = {
			name: topicDraft.name.trim(),
			slug: slugify(topicDraft.name),
			description: topicDraft.description.trim() || null,
			sort_order: Number(topicDraft.sort_order) || 0,
			is_active: topicDraft.is_active
		};
		const res = topicDraft.id ? await supabase.from("tutorial_topics").update(payload).eq("id", topicDraft.id) : await supabase.from("tutorial_topics").insert(payload);
		setSaving(false);
		if (res.error) return toast.error(res.error.message);
		toast.success(topicDraft.id ? "Topic updated" : "Topic added");
		setTopicDraft(null);
		load();
	}
	async function toggleVideo(v) {
		const { error } = await supabase.from("tutorials").update({ is_active: !v.is_active }).eq("id", v.id);
		if (error) return toast.error(error.message);
		load();
	}
	async function removeVideo(v) {
		if (!await confirmAction({
			title: "Delete tutorial?",
			description: `"${v.title}" delete hoye jabe. Ei kaj undo kora jabe na.`,
			confirmText: "Delete",
			variant: "danger"
		})) return;
		const { error } = await supabase.from("tutorials").delete().eq("id", v.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		load();
	}
	async function removeTopic(t) {
		if (!await confirmAction({
			title: "Delete topic?",
			description: `"${t.name}" delete hobe. Er video gulo "General" e chole jabe.`,
			confirmText: "Delete",
			variant: "danger"
		})) return;
		const { error } = await supabase.from("tutorial_topics").delete().eq("id", t.id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		load();
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Video tutorials",
				description: "Topic onujai YouTube tutorial add koro — landing page o reseller panel e dekha jabe.",
				actions: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => tab === "videos" ? setVideoDraft({ ...EMPTY_VIDEO }) : setTopicDraft({ ...EMPTY_TOPIC }),
					className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold",
					children: [
						/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
						" ",
						tab === "videos" ? "Add video" : "Add topic"
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex gap-2",
				children: ["videos", "topics"].map((t) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setTab(t),
					className: `inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-bold capitalize ${tab === t ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
					children: [
						t === "videos" ? /* @__PURE__ */ jsx(Youtube, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(FolderTree, { className: "h-4 w-4" }),
						" ",
						t
					]
				}, t))
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "grid place-items-center py-16 text-muted-foreground",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" })
			}) : tab === "topics" ? topics.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				title: "No topic yet",
				description: "Topic banao, tarpor video gulo topic onujai sajao."
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: topics.map((t) => /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-bold",
							children: [
								t.name,
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "ml-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
									children: [videos.filter((v) => v.topic_id === t.id).length, " video"]
								}),
								!t.is_active ? /* @__PURE__ */ jsx("span", {
									className: "ml-1 text-[11px] font-bold text-amber-600",
									children: "hidden"
								}) : null
							]
						}), t.description ? /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: t.description
						}) : null]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-1.5",
						children: [/* @__PURE__ */ jsx(IconBtn, {
							label: "Edit",
							onClick: () => setTopicDraft({
								id: t.id,
								name: t.name,
								description: t.description ?? "",
								sort_order: t.sort_order,
								is_active: t.is_active
							}),
							children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsx(IconBtn, {
							label: "Delete",
							danger: true,
							onClick: () => void removeTopic(t),
							children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}, t.id))
			}) : videos.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				title: "No tutorial yet",
				description: "YouTube link diye prothom tutorial add koro."
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1",
				children: [
					/* @__PURE__ */ jsx(Chip, {
						active: filter === "all",
						onClick: () => setFilter("all"),
						label: `All (${videos.length})`
					}),
					topics.map((t) => /* @__PURE__ */ jsx(Chip, {
						active: filter === t.id,
						onClick: () => setFilter(t.id),
						label: `${t.name} (${videos.filter((v) => v.topic_id === t.id).length})`
					}, t.id)),
					/* @__PURE__ */ jsx(Chip, {
						active: filter === "none",
						onClick: () => setFilter("none"),
						label: `General (${videos.filter((v) => !v.topic_id).length})`
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: shown.map((v) => {
					const thumb = youtubeThumb(v.youtube_url, v.thumbnail_url);
					return /* @__PURE__ */ jsxs("div", {
						className: "overflow-hidden rounded-xl border bg-card",
						children: [/* @__PURE__ */ jsx("div", {
							className: "aspect-video w-full bg-muted",
							children: thumb ? /* @__PURE__ */ jsx("img", {
								src: thumb,
								alt: v.title,
								loading: "lazy",
								className: "h-full w-full object-cover"
							}) : null
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2 p-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary",
											children: topicName(v.topic_id)
										}),
										!v.is_active ? /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600",
											children: "hidden"
										}) : null,
										v.reseller_only ? /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-bold text-sky-600",
											children: "reseller only"
										}) : null
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "line-clamp-2 text-sm font-bold",
									children: v.title
								}),
								v.details ? /* @__PURE__ */ jsx("p", {
									className: "line-clamp-2 text-xs text-muted-foreground",
									children: v.details
								}) : null,
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-1.5 pt-1",
									children: [
										/* @__PURE__ */ jsx(IconBtn, {
											label: "Edit",
											onClick: () => setVideoDraft({
												id: v.id,
												topic_id: v.topic_id ?? "",
												title: v.title,
												details: v.details ?? "",
												youtube_url: v.youtube_url,
												duration_label: v.duration_label ?? "",
												sort_order: v.sort_order,
												is_active: v.is_active,
												reseller_only: v.reseller_only
											}),
											children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ jsx(IconBtn, {
											label: v.is_active ? "Hide" : "Show",
											onClick: () => void toggleVideo(v),
											children: /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ jsx("a", {
											href: v.youtube_url,
											target: "_blank",
											rel: "noreferrer",
											title: "Open on YouTube",
											className: "grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted",
											children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ jsx(IconBtn, {
											label: "Delete",
											danger: true,
											onClick: () => void removeVideo(v),
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
										})
									]
								})
							]
						})]
					}, v.id);
				})
			})] }),
			videoDraft ? /* @__PURE__ */ jsx(AppModal, {
				title: videoDraft.id ? "Edit tutorial" : "Add tutorial",
				onClose: () => setVideoDraft(null),
				footer: /* @__PURE__ */ jsx(ModalActions, {
					saving,
					onCancel: () => setVideoDraft(null),
					onSave: () => void saveVideo()
				}),
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Title",
							children: /* @__PURE__ */ jsx("input", {
								className: inp,
								value: videoDraft.title,
								onChange: (e) => setVideoDraft({
									...videoDraft,
									title: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "YouTube link",
							children: /* @__PURE__ */ jsx("input", {
								className: inp,
								placeholder: "https://www.youtube.com/watch?v=…",
								value: videoDraft.youtube_url,
								onChange: (e) => setVideoDraft({
									...videoDraft,
									youtube_url: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Topic",
							children: /* @__PURE__ */ jsxs("select", {
								className: inp,
								value: videoDraft.topic_id,
								onChange: (e) => setVideoDraft({
									...videoDraft,
									topic_id: e.target.value
								}),
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "General (no topic)"
								}), topics.map((t) => /* @__PURE__ */ jsx("option", {
									value: t.id,
									children: t.name
								}, t.id))]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Details",
							children: /* @__PURE__ */ jsx("textarea", {
								rows: 4,
								className: inp,
								value: videoDraft.details,
								onChange: (e) => setVideoDraft({
									...videoDraft,
									details: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Duration label (optional)",
								children: /* @__PURE__ */ jsx("input", {
									className: inp,
									placeholder: "8:24",
									value: videoDraft.duration_label,
									onChange: (e) => setVideoDraft({
										...videoDraft,
										duration_label: e.target.value
									})
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Sort order",
								children: /* @__PURE__ */ jsx("input", {
									type: "number",
									className: inp,
									value: videoDraft.sort_order,
									onChange: (e) => setVideoDraft({
										...videoDraft,
										sort_order: Number(e.target.value)
									})
								})
							})]
						}),
						/* @__PURE__ */ jsx(Toggle, {
							label: "Active (show publicly)",
							checked: videoDraft.is_active,
							onChange: (v) => setVideoDraft({
								...videoDraft,
								is_active: v
							})
						}),
						/* @__PURE__ */ jsx(Toggle, {
							label: "Reseller only (landing page e dekhabe na)",
							checked: videoDraft.reseller_only,
							onChange: (v) => setVideoDraft({
								...videoDraft,
								reseller_only: v
							})
						})
					]
				})
			}) : null,
			topicDraft ? /* @__PURE__ */ jsx(AppModal, {
				title: topicDraft.id ? "Edit topic" : "Add topic",
				size: "sm",
				onClose: () => setTopicDraft(null),
				footer: /* @__PURE__ */ jsx(ModalActions, {
					saving,
					onCancel: () => setTopicDraft(null),
					onSave: () => void saveTopic()
				}),
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Topic name",
							children: /* @__PURE__ */ jsx("input", {
								className: inp,
								value: topicDraft.name,
								onChange: (e) => setTopicDraft({
									...topicDraft,
									name: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Description",
							children: /* @__PURE__ */ jsx("textarea", {
								rows: 3,
								className: inp,
								value: topicDraft.description,
								onChange: (e) => setTopicDraft({
									...topicDraft,
									description: e.target.value
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Sort order",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								className: inp,
								value: topicDraft.sort_order,
								onChange: (e) => setTopicDraft({
									...topicDraft,
									sort_order: Number(e.target.value)
								})
							})
						}),
						/* @__PURE__ */ jsx(Toggle, {
							label: "Active",
							checked: topicDraft.is_active,
							onChange: (v) => setTopicDraft({
								...topicDraft,
								is_active: v
							})
						})
					]
				})
			}) : null
		]
	});
}
function Chip({ active, label, onClick }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick,
		className: `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${active ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
		children: label
	});
}
function IconBtn({ children, label, onClick, danger }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		title: label,
		"aria-label": label,
		onClick,
		className: `grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted ${danger ? "text-destructive" : ""}`,
		children
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block space-y-1.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs font-bold text-muted-foreground",
			children: label
		}), children]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex items-center gap-2 text-sm font-semibold",
		children: [/* @__PURE__ */ jsx("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "h-4 w-4"
		}), label]
	});
}
function ModalActions({ saving, onCancel, onSave }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-end gap-2",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: onCancel,
			className: "rounded-lg border px-3.5 py-2 text-sm font-bold hover:bg-muted",
			children: "Cancel"
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			disabled: saving,
			onClick: onSave,
			className: "btn-brand inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold disabled:opacity-60",
			children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : null, " Save"]
		})]
	});
}
//#endregion
export { AdminTutorialsPage as component };
