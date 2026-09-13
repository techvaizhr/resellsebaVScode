import { r as supabase } from "./client-CdRSQB5v.js";
import { r as getMyReseller } from "./app-data-tJP6g7R4.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { n as useAuth } from "./use-auth-L4LMIQqu.js";
import { t as ImageUploader } from "./ImageUploader-D-u3sBaF.js";
import { t as clearBootstrapCache } from "./bootstrap-mAz5ZP06.js";
import { c as paletteSwatches, i as STORE_THEMES, n as themeContentGroups, o as getPalette, r as DEFAULT_THEME_ID, s as getStoreTheme } from "./store-content-BESTlNEf.js";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, ExternalLink, Eye, Loader2, Monitor, Smartphone } from "lucide-react";
//#region src/routes/_authenticated/reseller/theme.tsx?tsr-split=component
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function ThemePage() {
	const { user } = useAuth();
	const [rid, setRid] = useState(null);
	const [code, setCode] = useState("");
	const [theme, setTheme] = useState(DEFAULT_THEME_ID);
	const [savedTheme, setSavedTheme] = useState(DEFAULT_THEME_ID);
	const [all, setAll] = useState({});
	const [openGroup, setOpenGroup] = useState("hero");
	const [device, setDevice] = useState("desktop");
	const [previewKey, setPreviewKey] = useState(0);
	const [previewOn, setPreviewOn] = useState(false);
	const [previewLoaded, setPreviewLoaded] = useState(false);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const values = all[theme] ?? {};
	const activeTheme = useMemo(() => getStoreTheme(theme), [theme]);
	/** only the active theme's own sections are listed */
	const groups = useMemo(() => themeContentGroups(theme), [theme]);
	const palette = getPalette(activeTheme, typeof values.palette === "string" ? values.palette : null);
	const uid = user?.id;
	useEffect(() => {
		if (!uid) return;
		let alive = true;
		(async () => {
			const r = await getMyReseller(uid);
			if (!alive) return;
			if (!r) return setLoading(false);
			setRid(r.id);
			setCode(r.code);
			const { data: s } = await supabase.from("reseller_settings").select("theme,theme_settings").eq("reseller_id", r.id).maybeSingle();
			if (!alive) return;
			const id = s?.theme ?? "aurora";
			setTheme(id);
			setSavedTheme(id);
			setAll(s?.theme_settings ?? {});
			setLoading(false);
		})();
		return () => {
			alive = false;
		};
	}, [uid]);
	function setField(key, value) {
		setAll((prev) => ({
			...prev,
			[theme]: {
				...prev[theme] ?? {},
				[key]: value
			}
		}));
	}
	async function save() {
		if (!rid) return;
		setBusy(true);
		const { error } = await supabase.from("reseller_settings").upsert({
			reseller_id: rid,
			theme,
			theme_settings: all
		}, { onConflict: "reseller_id" });
		setBusy(false);
		if (error) return toast.error(error.message);
		setSavedTheme(theme);
		setPreviewKey((k) => k + 1);
		clearBootstrapCache("store:");
		toast.success("Theme saved and published");
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const previewSrc = code ? `/s/${code}?theme=${theme}&palette=${palette.id}&preview=${previewKey}` : "";
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Visual Appearance",
			description: "Customize your storefront theme, color palettes, and interactive section content.",
			actions: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-2",
				children: [code && /* @__PURE__ */ jsxs("a", {
					href: `/s/${code}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
					children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }), " Live store"]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: save,
					disabled: busy,
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
					children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save & publish"]
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "surface-card space-y-4 p-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-sm font-semibold",
					children: "1. Choose theme"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground",
					children: "Each theme keeps its own content and palette, so switching back never loses your work."
				})] }), theme !== savedTheme && /* @__PURE__ */ jsxs("span", {
					className: "rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary",
					children: [
						"Previewing ",
						activeTheme.name,
						" — not published yet"
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: STORE_THEMES.map((t) => {
					const active = theme === t.id;
					const p = getPalette(t, all[t.id]?.palette ?? null);
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setTheme(t.id),
						className: "group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-all " + (active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50 hover:shadow-md"),
						children: [
							active && /* @__PURE__ */ jsx("span", {
								className: "absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm",
								children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(ThemeMock, { palette: p }), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-1 flex-col p-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold tracking-tight",
										children: t.name
									}), t.id === savedTheme && /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider",
										children: "Live"
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
									children: t.description
								})]
							})
						]
					}, t.id);
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "surface-card mt-4 space-y-4 p-6",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
				className: "text-sm font-semibold",
				children: ["2. Color palette — ", activeTheme.name]
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: "Each palette is a complete, contrast-checked color set (background, text, border, buttons), so the design never breaks — every page of your store repaints together."
			})] }), /* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: activeTheme.palettes.map((p) => {
					const active = palette.id === p.id;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setField("palette", p.id),
						className: "relative overflow-hidden rounded-xl border p-3 text-left transition-colors " + (active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"),
						children: [
							/* @__PURE__ */ jsx(PaletteChip, { palette: p }),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold",
									children: p.name
								}), active && /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-primary" })]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-muted-foreground",
								children: p.dark ? "Dark surfaces" : "Light surfaces"
							})
						]
					}, p.id);
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-1",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-semibold",
						children: ["3. Content of ", activeTheme.name]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Only sections this theme actually renders are listed here."
					})]
				}), groups.map((g) => {
					const open = openGroup === g.id;
					return /* @__PURE__ */ jsxs("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setOpenGroup(open ? "" : g.id),
							className: "flex w-full items-start justify-between gap-3 p-4 text-left",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-sm font-semibold",
								children: g.title
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: g.description
							})] }), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: open ? "Hide" : "Edit"
							})]
						}), open && /* @__PURE__ */ jsxs("div", {
							className: "space-y-3 border-t p-4",
							children: [g.fields.map((f) => {
								const raw = values[f.key];
								if (f.type === "toggle") {
									const checked = typeof raw === "boolean" ? raw : f.def !== false;
									return /* @__PURE__ */ jsxs("label", {
										className: "flex items-center justify-between gap-3 text-sm",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: f.label
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											role: "switch",
											"aria-checked": checked,
											onClick: () => setField(f.key, !checked),
											className: "relative h-6 w-11 shrink-0 rounded-full transition-colors " + (checked ? "bg-primary" : "bg-muted"),
											children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all " + (checked ? "left-[22px]" : "left-0.5") })
										})]
									}, f.key);
								}
								if (f.type === "image") {
									const url = typeof raw === "string" ? raw : "";
									const val = url ? [{
										path: "",
										url,
										bytes: 0
									}] : [];
									return /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "mb-1 block text-xs font-medium",
											children: f.label
										}),
										/* @__PURE__ */ jsx(ImageUploader, {
											bucket: "stores",
											folder: `stores/${rid}/${theme}/${f.key}`,
											value: val,
											onChange: (v) => setField(f.key, v[0]?.url ?? "")
										}),
										f.hint && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: f.hint
										})
									] }, f.key);
								}
								const str = typeof raw === "string" ? raw : "";
								const ph = typeof f.def === "string" ? f.def : f.placeholder;
								return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-medium",
									children: f.label
								}), f.type === "textarea" ? /* @__PURE__ */ jsx("textarea", {
									rows: 3,
									value: str,
									placeholder: ph,
									onChange: (e) => setField(f.key, e.target.value),
									className: inp
								}) : /* @__PURE__ */ jsx("input", {
									value: str,
									placeholder: ph,
									onChange: (e) => setField(f.key, e.target.value),
									className: inp
								})] }, f.key);
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Leave a field empty to use the theme default. Use ",
									"{store}",
									" to insert your store name."
								]
							})]
						})]
					}, g.id);
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "surface-card sticky top-4 h-fit p-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [
								/* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
								" Live preview",
								/* @__PURE__ */ jsxs("span", {
									className: "rounded-full border px-2 py-0.5 text-[11px] font-normal text-muted-foreground",
									children: [
										activeTheme.name,
										" · ",
										palette.name
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setDevice("desktop"),
									className: "rounded-md border p-2 " + (device === "desktop" ? "border-primary text-primary" : "text-muted-foreground"),
									"aria-label": "Desktop preview",
									children: /* @__PURE__ */ jsx(Monitor, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setDevice("mobile"),
									className: "rounded-md border p-2 " + (device === "mobile" ? "border-primary text-primary" : "text-muted-foreground"),
									"aria-label": "Mobile preview",
									children: /* @__PURE__ */ jsx(Smartphone, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setPreviewLoaded(false);
										setPreviewOn(true);
										setPreviewKey((k) => k + 1);
									},
									className: "rounded-md border px-3 py-2 text-xs",
									children: previewOn ? "Refresh" : "Load preview"
								})
							]
						})]
					}),
					!previewSrc ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Preview appears once your store is active."
					}) : previewOn ? /* @__PURE__ */ jsx("div", {
						className: "mx-auto overflow-hidden rounded-lg border",
						style: { maxWidth: device === "mobile" ? 390 : "100%" },
						children: /* @__PURE__ */ jsx("iframe", {
							src: previewSrc,
							title: "Store preview",
							onLoad: () => setPreviewLoaded(true),
							className: "h-[720px] w-full bg-background"
						}, previewKey)
					}) : /* @__PURE__ */ jsx("button", {
						onClick: () => {
							setPreviewLoaded(false);
							setPreviewOn(true);
						},
						className: "grid h-[280px] w-full place-items-center rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/40",
						children: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }), " Load live preview"]
						})
					}),
					previewOn && !previewLoaded && /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }),
							" Loading preview… if it stays blank,",
							/* @__PURE__ */ jsxs("a", {
								href: previewSrc,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1 font-medium text-primary",
								children: ["open it in a new tab ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-[11px] text-muted-foreground",
						children: "Theme and palette changes show instantly after Refresh. Save & publish to apply them for customers — text edits appear in the preview after saving."
					})
				]
			})]
		})
	] });
}
/** Tiny wireframe mock painted with a palette. */
function ThemeMock({ palette }) {
	const { bg, surface, primary, fg } = palette;
	return /* @__PURE__ */ jsxs("div", {
		className: "h-28 w-full p-3",
		style: { background: bg },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "h-2 w-10 rounded",
					style: {
						background: fg,
						opacity: .7
					}
				}), /* @__PURE__ */ jsx("span", {
					className: "h-2 w-6 rounded",
					style: { background: primary }
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-2 h-3 w-2/3 rounded",
				style: {
					background: fg,
					opacity: .85
				}
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-1.5 h-2 w-1/2 rounded",
				style: {
					background: fg,
					opacity: .4
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex gap-1.5",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "h-8 flex-1 rounded",
						style: { background: surface }
					}),
					/* @__PURE__ */ jsx("span", {
						className: "h-8 flex-1 rounded",
						style: { background: surface }
					}),
					/* @__PURE__ */ jsx("span", {
						className: "h-8 w-8 rounded",
						style: { background: primary }
					})
				]
			})
		]
	});
}
/** Palette swatch row plus a text-on-color readability sample. */
function PaletteChip({ palette }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-lg border",
		style: { borderColor: palette.border },
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex",
			children: paletteSwatches(palette).map((c, i) => /* @__PURE__ */ jsx("span", {
				className: "h-8 flex-1",
				style: { background: c }
			}, i))
		}), /* @__PURE__ */ jsxs("div", {
			className: "px-2 py-2",
			style: {
				background: palette.surface,
				color: palette.fg
			},
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-[11px] font-semibold",
				children: "Aa Product title"
			}), /* @__PURE__ */ jsx("div", {
				className: "text-[10px]",
				style: { color: palette.muted },
				children: "৳1,250 · in stock"
			})]
		})]
	});
}
//#endregion
export { ThemePage as component };
