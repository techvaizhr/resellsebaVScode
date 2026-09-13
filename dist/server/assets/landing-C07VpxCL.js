import { I as DEFAULT_LANDING_CONTENT, L as mergeLandingContent, r as supabase } from "./client-BpJCBCUq.js";
import { t as clearAppDataCache } from "./app-data-DxwZMsmL.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as ImageUploader } from "./ImageUploader-Ba09wYF1.js";
import { n as APP_ICON_NAMES } from "./icons-ozeGSJfP.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ExternalLink, HelpCircle, Image, Layers, Loader2, Menu, Plus, RotateCcw, Save, Sparkles, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/admin/landing.tsx?tsr-split=component
var ICONS = APP_ICON_NAMES;
function LandingEditor() {
	const [c, setC] = useState(DEFAULT_LANDING_CONTENT);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		(async () => {
			try {
				const { data } = await supabase.from("global_settings").select("landing_content").eq("id", 1).maybeSingle();
				const raw = data?.landing_content;
				setC(mergeLandingContent(raw));
			} catch (err) {
				console.error("Failed to load landing content:", err);
				setC(DEFAULT_LANDING_CONTENT);
			} finally {
				setLoading(false);
			}
		})();
	}, []);
	async function save() {
		if (!c) return;
		setBusy(true);
		try {
			const { error } = await supabase.from("global_settings").upsert({
				id: 1,
				landing_content: c
			});
			clearAppDataCache("settings");
			if (error) toast.error("Save failed: " + error.message);
			else toast.success("Landing page content saved successfully!");
		} catch (err) {
			toast.error("Failed to save: " + (err?.message || "Unknown error"));
		} finally {
			setBusy(false);
		}
	}
	const resetToDefault = () => {
		if (window.confirm("Are you sure you want to reset all landing page content to default values?")) {
			setC(JSON.parse(JSON.stringify(DEFAULT_LANDING_CONTENT)));
			toast.info("Landing content reset to defaults (click Save to apply)");
		}
	};
	const update = (fn) => {
		const next = JSON.parse(JSON.stringify(c));
		fn(next);
		setC(next);
	};
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "grid place-items-center py-20",
		children: [/* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ jsx("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: "Loading landing page editor..."
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 max-w-5xl mx-auto pb-16",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Landing Page Editor",
				description: "Customize the homepage content, hero banner, features, FAQs, and workflow shown on your main domain.",
				actions: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "/",
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all active:scale-95",
							children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" }), " View Live Page"]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: resetToDefault,
							className: "inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all active:scale-95",
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset Defaults"]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: save,
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-md disabled:opacity-50 transition-all active:scale-95",
							children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save Landing Page"]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs(Tabs, {
				defaultValue: "hero",
				className: "w-full space-y-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto pb-1",
						children: /* @__PURE__ */ jsxs(TabsList, {
							className: "h-auto p-1.5 bg-muted/60 border border-border/70 rounded-2xl flex flex-nowrap md:flex-wrap gap-1.5 w-max md:w-full",
							children: [
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "hero",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " Hero Banner"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "nav",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Menu, { className: "h-3.5 w-3.5" }), " Navigation & Menu"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "stats",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5" }), " Statistics"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "features",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " Features Grid"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "workflow",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5" }), " How It Works"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "faq",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-3.5 w-3.5" }), " FAQs"]
								}),
								/* @__PURE__ */ jsxs(TabsTrigger, {
									value: "cta_footer",
									className: "flex items-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all",
									children: [/* @__PURE__ */ jsx(Image, { className: "h-3.5 w-3.5" }), " CTA & Footer"]
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "hero",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsxs(Section, {
							title: "Hero Section & Banner",
							icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
							desc: "Main visual banner and heading seen first by visitors on your home page",
							children: [
								/* @__PURE__ */ jsx(F, {
									label: "Top Badge Label",
									children: /* @__PURE__ */ jsx(I, {
										value: c.hero?.badge ?? "",
										onChange: (v) => update((d) => {
											d.hero.badge = v;
										})
									})
								}),
								/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
									label: "Main Headline (Start)",
									children: /* @__PURE__ */ jsx(I, {
										value: c.hero?.titleStart ?? "",
										onChange: (v) => update((d) => {
											d.hero.titleStart = v;
										})
									})
								}), /* @__PURE__ */ jsx(F, {
									label: "Highlighted Headline Part (Gradient)",
									children: /* @__PURE__ */ jsx(I, {
										value: c.hero?.titleHighlight ?? "",
										onChange: (v) => update((d) => {
											d.hero.titleHighlight = v;
										})
									})
								})] }),
								/* @__PURE__ */ jsx(F, {
									label: "Subtitle / Description",
									children: /* @__PURE__ */ jsx(T, {
										value: c.hero?.subtitle ?? "",
										onChange: (v) => update((d) => {
											d.hero.subtitle = v;
										})
									})
								}),
								/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
									label: "Primary CTA Button Text",
									children: /* @__PURE__ */ jsx(I, {
										value: c.hero?.ctaPrimary ?? "",
										onChange: (v) => update((d) => {
											d.hero.ctaPrimary = v;
										})
									})
								}), /* @__PURE__ */ jsx(F, {
									label: "Secondary CTA Button Text",
									children: /* @__PURE__ */ jsx(I, {
										value: c.hero?.ctaSecondary ?? "",
										onChange: (v) => update((d) => {
											d.hero.ctaSecondary = v;
										})
									})
								})] }),
								/* @__PURE__ */ jsx(F, {
									label: "Trust Badges (comma separated)",
									children: /* @__PURE__ */ jsx(I, {
										value: (c.hero?.badges ?? []).join(", "),
										onChange: (v) => update((d) => {
											d.hero.badges = v.split(",").map((s) => s.trim()).filter(Boolean);
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "Hero Banner Image (WebP supported)",
									children: /* @__PURE__ */ jsx(ImageUploader, {
										bucket: "branding",
										folder: "branding",
										value: c.hero?.bannerImage?.url ? [{
											path: c.hero.bannerImage.path || "",
											url: c.hero.bannerImage.url,
											bytes: c.hero.bannerImage.bytes || 0
										}] : [],
										onChange: (v) => update((d) => {
											d.hero.bannerImage = v[0] ? {
												url: v[0].url,
												path: v[0].path,
												bytes: v[0].bytes
											} : null;
										}),
										label: "Upload Hero Banner",
										variant: "hero"
									})
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "nav",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsx(Section, {
							title: "Navigation & Header Menu",
							icon: /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4 text-primary" }),
							desc: "Text labels and buttons displayed in the top navigation bar",
							children: /* @__PURE__ */ jsxs(Grid, { children: [
								/* @__PURE__ */ jsx(F, {
									label: "Features Link",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.features ?? "",
										onChange: (v) => update((d) => {
											d.nav.features = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "How it works Link",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.how ?? "",
										onChange: (v) => update((d) => {
											d.nav.how = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "Categories Link",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.categories ?? "",
										onChange: (v) => update((d) => {
											d.nav.categories = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "FAQ Link",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.faq ?? "",
										onChange: (v) => update((d) => {
											d.nav.faq = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "Sign In Button",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.signIn ?? "",
										onChange: (v) => update((d) => {
											d.nav.signIn = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "Primary CTA Button",
									children: /* @__PURE__ */ jsx(I, {
										value: c.nav?.cta ?? "",
										onChange: (v) => update((d) => {
											d.nav.cta = v;
										})
									})
								})
							] })
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "stats",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsxs(Section, {
							title: "Platform Statistics",
							icon: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-primary" }),
							desc: "Highlight numbers, verified products, active suppliers, or custom counters",
							children: [/* @__PURE__ */ jsx(F, {
								label: "Section Title",
								children: /* @__PURE__ */ jsx(I, {
									value: c.stats?.title ?? "",
									onChange: (v) => update((d) => {
										d.stats = {
											...d.stats ?? { items: [] },
											title: v
										};
									})
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [(c.stats?.items ?? []).map((s, i) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-xs font-semibold text-muted-foreground",
											children: ["Stat Item #", i + 1]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => update((d) => {
												d.stats.items.splice(i, 1);
											}),
											className: "p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all",
											title: "Remove Stat",
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
										})]
									}), /* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
										label: "Value (e.g. 10,000+)",
										children: /* @__PURE__ */ jsx(I, {
											value: s.value,
											onChange: (v) => update((d) => {
												d.stats.items[i].value = v;
											})
										})
									}), /* @__PURE__ */ jsx(F, {
										label: "Label (e.g. Verified Products)",
										children: /* @__PURE__ */ jsx(I, {
											value: s.label,
											onChange: (v) => update((d) => {
												d.stats.items[i].label = v;
											})
										})
									})] })]
								}, i)), (c.stats?.items?.length ?? 0) < 6 && /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => update((d) => {
										d.stats = { items: [...d.stats?.items ?? [], {
											value: "1,000+",
											label: "New Stat"
										}] };
									}),
									className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5 text-primary" }), " Add Stat Item"]
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "features",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsxs(Section, {
							title: "Features & Benefits Grid",
							icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
							desc: "Highlight core platform features that attract resellers and suppliers",
							children: [/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
								label: "Section Title",
								children: /* @__PURE__ */ jsx(I, {
									value: c.features?.title ?? "",
									onChange: (v) => update((d) => {
										d.features.title = v;
									})
								})
							}), /* @__PURE__ */ jsx(F, {
								label: "Section Subtitle",
								children: /* @__PURE__ */ jsx(I, {
									value: c.features?.subtitle ?? "",
									onChange: (v) => update((d) => {
										d.features.subtitle = v;
									})
								})
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 mt-4",
								children: [(c.features?.items ?? []).map((f, i) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-xs font-semibold text-muted-foreground",
												children: ["Feature #", i + 1]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => update((d) => {
													d.features.items.splice(i, 1);
												}),
												className: "p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all",
												title: "Remove Feature",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid gap-3 sm:grid-cols-3",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "mb-1 block text-xs font-medium",
												children: "Icon"
											}), /* @__PURE__ */ jsx("select", {
												value: f.icon,
												onChange: (e) => update((d) => {
													d.features.items[i].icon = e.target.value;
												}),
												className: inp,
												children: ICONS.map((ic) => /* @__PURE__ */ jsx("option", {
													value: ic,
													children: ic
												}, ic))
											})] }), /* @__PURE__ */ jsx("div", {
												className: "sm:col-span-2",
												children: /* @__PURE__ */ jsx(F, {
													label: "Title",
													children: /* @__PURE__ */ jsx(I, {
														value: f.title,
														onChange: (v) => update((d) => {
															d.features.items[i].title = v;
														})
													})
												})
											})]
										}),
										/* @__PURE__ */ jsx(F, {
											label: "Description",
											children: /* @__PURE__ */ jsx(T, {
												value: f.desc,
												onChange: (v) => update((d) => {
													d.features.items[i].desc = v;
												})
											})
										})
									]
								}, i)), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => update((d) => {
										d.features.items.push({
											icon: "Sparkles",
											title: "New Platform Feature",
											desc: "Detailed description of feature and advantage."
										});
									}),
									className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5 text-primary" }), " Add Feature Card"]
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "workflow",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsxs(Section, {
							title: "Reseller Workflow (How It Works)",
							icon: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-primary" }),
							desc: "Visual step-by-step pipeline illustrating how an order flows from placement to payout",
							children: [
								/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
									label: "Badge Label",
									children: /* @__PURE__ */ jsx(I, {
										value: c.about?.badge ?? "",
										onChange: (v) => update((d) => {
											d.about = {
												...d.about ?? {
													badge: "",
													title: "",
													body: "",
													points: []
												},
												badge: v
											};
										})
									})
								}), /* @__PURE__ */ jsx(F, {
									label: "Title",
									children: /* @__PURE__ */ jsx(I, {
										value: c.about?.title ?? "",
										onChange: (v) => update((d) => {
											d.about = {
												...d.about ?? {
													badge: "",
													title: "",
													body: "",
													points: []
												},
												title: v
											};
										})
									})
								})] }),
								/* @__PURE__ */ jsx(F, {
									label: "Intro Summary Text",
									children: /* @__PURE__ */ jsx(T, {
										value: c.about?.body ?? "",
										onChange: (v) => update((d) => {
											d.about = {
												...d.about ?? {
													badge: "",
													title: "",
													body: "",
													points: []
												},
												body: v
											};
										})
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [(c.about?.flow ?? []).map((f, i) => /* @__PURE__ */ jsxs("div", {
										className: "rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "text-xs font-semibold text-muted-foreground",
													children: ["Workflow Step #", i + 1]
												}), /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => update((d) => {
														d.about.flow.splice(i, 1);
													}),
													className: "p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all",
													children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid gap-3 sm:grid-cols-3",
												children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
													className: "mb-1 block text-xs font-medium",
													children: "Icon"
												}), /* @__PURE__ */ jsx("select", {
													value: f.icon,
													onChange: (e) => update((d) => {
														d.about.flow[i].icon = e.target.value;
													}),
													className: inp,
													children: ICONS.map((ic) => /* @__PURE__ */ jsx("option", {
														value: ic,
														children: ic
													}, ic))
												})] }), /* @__PURE__ */ jsx("div", {
													className: "sm:col-span-2",
													children: /* @__PURE__ */ jsx(F, {
														label: "Step Title",
														children: /* @__PURE__ */ jsx(I, {
															value: f.title,
															onChange: (v) => update((d) => {
																d.about.flow[i].title = v;
															})
														})
													})
												})]
											}),
											/* @__PURE__ */ jsx(F, {
												label: "Step Description",
												children: /* @__PURE__ */ jsx(T, {
													value: f.desc,
													onChange: (v) => update((d) => {
														d.about.flow[i].desc = v;
													})
												})
											})
										]
									}, i)), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => update((d) => {
											d.about = {
												...d.about ?? {
													badge: "",
													title: "",
													body: "",
													points: []
												},
												flow: [...d.about?.flow ?? [], {
													icon: "ClipboardList",
													title: "New Step",
													desc: "Step description"
												}]
											};
										}),
										className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all",
										children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5 text-primary" }), " Add Workflow Step"]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ jsx(TabsContent, {
						value: "faq",
						className: "space-y-4 focus-visible:outline-none",
						children: /* @__PURE__ */ jsxs(Section, {
							title: "Frequently Asked Questions (FAQ)",
							icon: /* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4 text-primary" }),
							desc: "Answer common questions regarding margins, courier delivery, payments and refunds",
							children: [/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
								label: "FAQ Section Title",
								children: /* @__PURE__ */ jsx(I, {
									value: c.faq?.title ?? "",
									onChange: (v) => update((d) => {
										d.faq = {
											...d.faq ?? {
												title: "",
												subtitle: "",
												items: []
											},
											title: v
										};
									})
								})
							}), /* @__PURE__ */ jsx(F, {
								label: "FAQ Subtitle",
								children: /* @__PURE__ */ jsx(I, {
									value: c.faq?.subtitle ?? "",
									onChange: (v) => update((d) => {
										d.faq = {
											...d.faq ?? {
												title: "",
												subtitle: "",
												items: []
											},
											subtitle: v
										};
									})
								})
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "space-y-3 mt-3",
								children: [(c.faq?.items ?? []).map((item, i) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-xs font-semibold text-muted-foreground",
												children: ["FAQ #", i + 1]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => update((d) => {
													d.faq.items.splice(i, 1);
												}),
												className: "p-1 text-destructive hover:bg-destructive/10 rounded-md transition-all",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
											})]
										}),
										/* @__PURE__ */ jsx(F, {
											label: "Question",
											children: /* @__PURE__ */ jsx(I, {
												value: item.q,
												onChange: (v) => update((d) => {
													d.faq.items[i].q = v;
												})
											})
										}),
										/* @__PURE__ */ jsx(F, {
											label: "Answer",
											children: /* @__PURE__ */ jsx(T, {
												value: item.a,
												onChange: (v) => update((d) => {
													d.faq.items[i].a = v;
												})
											})
										})
									]
								}, i)), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => update((d) => {
										d.faq = {
											...d.faq ?? {
												title: "",
												subtitle: "",
												items: []
											},
											items: [...d.faq?.items ?? [], {
												q: "New Question?",
												a: "Detailed answer."
											}]
										};
									}),
									className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold hover:bg-muted transition-all",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5 text-primary" }), " Add FAQ Item"]
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsxs(TabsContent, {
						value: "cta_footer",
						className: "space-y-6 focus-visible:outline-none",
						children: [/* @__PURE__ */ jsxs(Section, {
							title: "Bottom Call-to-Action (CTA)",
							icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
							desc: "Final conversion block at the bottom of the landing page",
							children: [
								/* @__PURE__ */ jsxs(Grid, { children: [/* @__PURE__ */ jsx(F, {
									label: "Badge Label",
									children: /* @__PURE__ */ jsx(I, {
										value: c.cta?.badge ?? "",
										onChange: (v) => update((d) => {
											d.cta.badge = v;
										})
									})
								}), /* @__PURE__ */ jsx(F, {
									label: "CTA Button Text",
									children: /* @__PURE__ */ jsx(I, {
										value: c.cta?.button ?? "",
										onChange: (v) => update((d) => {
											d.cta.button = v;
										})
									})
								})] }),
								/* @__PURE__ */ jsx(F, {
									label: "Headline",
									children: /* @__PURE__ */ jsx(I, {
										value: c.cta?.title ?? "",
										onChange: (v) => update((d) => {
											d.cta.title = v;
										})
									})
								}),
								/* @__PURE__ */ jsx(F, {
									label: "Subtitle",
									children: /* @__PURE__ */ jsx(T, {
										value: c.cta?.subtitle ?? "",
										onChange: (v) => update((d) => {
											d.cta.subtitle = v;
										})
									})
								})
							]
						}), /* @__PURE__ */ jsx(Section, {
							title: "Footer Brand Tagline",
							icon: /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4 text-primary" }),
							desc: "Closing statement displayed in the website footer",
							children: /* @__PURE__ */ jsx(F, {
								label: "Footer Tagline",
								children: /* @__PURE__ */ jsx(I, {
									value: c.footer?.tagline ?? "",
									onChange: (v) => update((d) => {
										d.footer.tagline = v;
									})
								})
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: "Remember to save your changes to update the live homepage."
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: resetToDefault,
						className: "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-all active:scale-95",
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset"]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: save,
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md disabled:opacity-50 transition-all active:scale-95",
						children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), "Save Landing Page"]
					})]
				})]
			})
		]
	});
}
var inp = "w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
function I({ value, onChange }) {
	return /* @__PURE__ */ jsx("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: inp
	});
}
function T({ value, onChange }) {
	return /* @__PURE__ */ jsx("textarea", {
		rows: 3,
		value,
		onChange: (e) => onChange(e.target.value),
		className: inp
	});
}
function F({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ jsx("label", {
			className: "block text-xs font-semibold text-foreground/80",
			children: label
		}), children]
	});
}
function Grid({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-4 md:grid-cols-2",
		children
	});
}
function Section({ title, icon, desc, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "surface-card space-y-4 p-6 border border-border/70 rounded-2xl shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2.5",
			children: [icon, /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-sm font-bold text-foreground",
				children: title
			}), desc && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: desc
			})] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "pt-2",
			children
		})]
	});
}
//#endregion
export { LandingEditor as component };
