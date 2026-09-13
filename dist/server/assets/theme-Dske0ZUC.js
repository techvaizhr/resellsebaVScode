import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-KjQ-na90.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, O as Smartphone, Yn as Check, _n as ExternalLink, _t as Monitor, hn as Eye } from "./vendor-icons-BWIzFOtW.js";
import { r as getMyReseller } from "./app-data-DdK5ZzvO.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BdX1T6s2.js";
import { t as ImageUploader } from "./ImageUploader-BO6d8Jye.js";
import { t as clearBootstrapCache } from "./bootstrap-AadClqhq.js";
import { c as paletteSwatches, i as STORE_THEMES, n as themeContentGroups, o as getPalette, r as DEFAULT_THEME_ID, s as getStoreTheme } from "./store-content-BESTlNEf.js";
//#region src/routes/_authenticated/reseller/theme.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function ThemePage() {
	const { user } = useAuth();
	const [rid, setRid] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [theme, setTheme] = (0, import_react.useState)(DEFAULT_THEME_ID);
	const [savedTheme, setSavedTheme] = (0, import_react.useState)(DEFAULT_THEME_ID);
	const [all, setAll] = (0, import_react.useState)({});
	const [openGroup, setOpenGroup] = (0, import_react.useState)("hero");
	const [device, setDevice] = (0, import_react.useState)("desktop");
	const [previewKey, setPreviewKey] = (0, import_react.useState)(0);
	const [previewOn, setPreviewOn] = (0, import_react.useState)(false);
	const [previewLoaded, setPreviewLoaded] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const values = all[theme] ?? {};
	const activeTheme = (0, import_react.useMemo)(() => getStoreTheme(theme), [theme]);
	/** only the active theme's own sections are listed */
	const groups = (0, import_react.useMemo)(() => themeContentGroups(theme), [theme]);
	const palette = getPalette(activeTheme, typeof values.palette === "string" ? values.palette : null);
	const uid = user?.id;
	(0, import_react.useEffect)(() => {
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
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const previewSrc = code ? `/s/${code}?theme=${theme}&palette=${palette.id}&preview=${previewKey}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Visual Appearance",
			description: "Customize your storefront theme, color palettes, and interactive section content.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `/s/${code}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " Live store"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: save,
					disabled: busy,
					className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save & publish"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card space-y-4 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "1. Choose theme"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Each theme keeps its own content and palette, so switching back never loses your work."
				})] }), theme !== savedTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary",
					children: [
						"Previewing ",
						activeTheme.name,
						" — not published yet"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: STORE_THEMES.map((t) => {
					const active = theme === t.id;
					const p = getPalette(t, all[t.id]?.palette ?? null);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTheme(t.id),
						className: "group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-all " + (active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50 hover:shadow-md"),
						children: [
							active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeMock, { palette: p }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold tracking-tight",
										children: t.name
									}), t.id === savedTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider",
										children: "Live"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
									children: t.description
								})]
							})
						]
					}, t.id);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mt-4 space-y-4 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-sm font-semibold",
				children: ["2. Color palette — ", activeTheme.name]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Each palette is a complete, contrast-checked color set (background, text, border, buttons), so the design never breaks — every page of your store repaints together."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: activeTheme.palettes.map((p) => {
					const active = palette.id === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setField("palette", p.id),
						className: "relative overflow-hidden rounded-xl border p-3 text-left transition-colors " + (active ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteChip, { palette: p }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold",
									children: p.name
								}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: p.dark ? "Dark surfaces" : "Light surfaces"
							})
						]
					}, p.id);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-semibold",
						children: ["3. Content of ", activeTheme.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Only sections this theme actually renders are listed here."
					})]
				}), groups.map((g) => {
					const open = openGroup === g.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpenGroup(open ? "" : g.id),
							className: "flex w-full items-start justify-between gap-3 p-4 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: g.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: g.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: open ? "Hide" : "Edit"
							})]
						}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 border-t p-4",
							children: [g.fields.map((f) => {
								const raw = values[f.key];
								if (f.type === "toggle") {
									const checked = typeof raw === "boolean" ? raw : f.def !== false;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center justify-between gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: f.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											role: "switch",
											"aria-checked": checked,
											onClick: () => setField(f.key, !checked),
											className: "relative h-6 w-11 shrink-0 rounded-full transition-colors " + (checked ? "bg-primary" : "bg-muted"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all " + (checked ? "left-[22px]" : "left-0.5") })
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
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-1 block text-xs font-medium",
											children: f.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
											bucket: "stores",
											folder: `stores/${rid}/${theme}/${f.key}`,
											value: val,
											onChange: (v) => setField(f.key, v[0]?.url ?? "")
										}),
										f.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: f.hint
										})
									] }, f.key);
								}
								const str = typeof raw === "string" ? raw : "";
								const ph = typeof f.def === "string" ? f.def : f.placeholder;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-medium",
									children: f.label
								}), f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: str,
									placeholder: ph,
									onChange: (e) => setField(f.key, e.target.value),
									className: inp
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: str,
									placeholder: ph,
									onChange: (e) => setField(f.key, e.target.value),
									className: inp
								})] }, f.key);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card sticky top-4 h-fit p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }),
								" Live preview",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border px-2 py-0.5 text-[11px] font-normal text-muted-foreground",
									children: [
										activeTheme.name,
										" · ",
										palette.name
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDevice("desktop"),
									className: "rounded-md border p-2 " + (device === "desktop" ? "border-primary text-primary" : "text-muted-foreground"),
									"aria-label": "Desktop preview",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDevice("mobile"),
									className: "rounded-md border p-2 " + (device === "mobile" ? "border-primary text-primary" : "text-muted-foreground"),
									"aria-label": "Mobile preview",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
					!previewSrc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Preview appears once your store is active."
					}) : previewOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto overflow-hidden rounded-lg border",
						style: { maxWidth: device === "mobile" ? 390 : "100%" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: previewSrc,
							title: "Store preview",
							onLoad: () => setPreviewLoaded(true),
							className: "h-[720px] w-full bg-background"
						}, previewKey)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setPreviewLoaded(false);
							setPreviewOn(true);
						},
						className: "grid h-[280px] w-full place-items-center rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), " Load live preview"]
						})
					}),
					previewOn && !previewLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
							" Loading preview… if it stays blank,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: previewSrc,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1 font-medium text-primary",
								children: ["open it in a new tab ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-28 w-full p-3",
		style: { background: bg },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-10 rounded",
					style: {
						background: fg,
						opacity: .7
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-6 rounded",
					style: { background: primary }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-3 w-2/3 rounded",
				style: {
					background: fg,
					opacity: .85
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 h-2 w-1/2 rounded",
				style: {
					background: fg,
					opacity: .4
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-8 flex-1 rounded",
						style: { background: surface }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-8 flex-1 rounded",
						style: { background: surface }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg border",
		style: { borderColor: palette.border },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex",
			children: paletteSwatches(palette).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-8 flex-1",
				style: { background: c }
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-2 py-2",
			style: {
				background: palette.surface,
				color: palette.fg
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-semibold",
				children: "Aa Product title"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px]",
				style: { color: palette.muted },
				children: "৳1,250 · in stock"
			})]
		})]
	});
}
//#endregion
export { ThemePage as component };
