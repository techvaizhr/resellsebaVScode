import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { i as useBrandingTheme, r as applyBrandingThemeDirectly, t as applyPlatformBranding } from "./platform-branding-DO8pd0Ly.js";
import { D as Sparkles, Mt as LoaderCircle, S as Store, Vt as Layers, dn as FileText, ft as Palette, sn as Globe } from "./vendor-icons-BWIzFOtW.js";
import { t as cn } from "./utils-UzdMQEyF.js";
import { t as clearAppDataCache } from "./app-data-DwbOGY7V.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { t as ImageUploader } from "./ImageUploader-CgwrTYUi.js";
//#region src/routes/_authenticated/admin/settings.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTES = [
	{
		name: "Royal Indigo & Amber",
		primary: "#4f46e5",
		accent: "#f59e0b"
	},
	{
		name: "Emerald & Teal",
		primary: "#059669",
		accent: "#0d9488"
	},
	{
		name: "Crimson & Rose",
		primary: "#e11d48",
		accent: "#fb7185"
	},
	{
		name: "Midnight Violet & Cyan",
		primary: "#7c3aed",
		accent: "#06b6d4"
	},
	{
		name: "Sunset Orange & Indigo",
		primary: "#ea580c",
		accent: "#4f46e5"
	},
	{
		name: "Modern Dark Slate",
		primary: "#334155",
		accent: "#6366f1"
	}
];
var RADII = [
	{
		label: "Compact (8px)",
		value: "0.5rem"
	},
	{
		label: "Modern (14px)",
		value: "0.875rem"
	},
	{
		label: "Pill/Soft (20px)",
		value: "1.25rem"
	}
];
function SettingsPage() {
	const [siteName, setSiteName] = (0, import_react.useState)("");
	const [flagshipCode, setFlagshipCode] = (0, import_react.useState)("");
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [tagline, setTagline] = (0, import_react.useState)("");
	const [metaTitle, setMetaTitle] = (0, import_react.useState)("");
	const [metaDesc, setMetaDesc] = (0, import_react.useState)("");
	const [primary, setPrimary] = (0, import_react.useState)("#4f46e5");
	const [accent, setAccent] = (0, import_react.useState)("#f59e0b");
	const [radius, setRadius] = (0, import_react.useState)("0.875rem");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)([]);
	const [favicon, setFavicon] = (0, import_react.useState)([]);
	const [og, setOg] = (0, import_react.useState)([]);
	const [labelSize, setLabelSize] = (0, import_react.useState)("3x4");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	useBrandingTheme(primary, accent, { radius });
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("global_settings").select("*").eq("id", 1).maybeSingle();
			if (data) {
				setSiteName(data.site_name ?? "");
				setTagline(data.tagline ?? "");
				setMetaTitle(data.meta_title_template ?? "");
				setMetaDesc(data.meta_description ?? "");
				setPrimary(data.primary_color ?? "#4f46e5");
				setAccent(data.accent_color ?? "#f59e0b");
				setRadius(data.border_radius ?? "0.875rem");
				setPhone(data.contact_phone ?? "");
				setEmail(data.contact_email ?? "");
				setFlagshipCode(data.flagship_reseller_code ?? "");
				setLabelSize(data.label_size || "3x4");
				if (data.logo_url) setLogo([{
					path: "",
					url: data.logo_url,
					bytes: 0
				}]);
				if (data.favicon_url) setFavicon([{
					path: "",
					url: data.favicon_url,
					bytes: 0
				}]);
				if (data.og_image_url) setOg([{
					path: "",
					url: data.og_image_url,
					bytes: 0
				}]);
			}
			const { data: rs } = await supabase.from("resellers").select("code,business_name").eq("status", "active").order("business_name");
			setResellers(rs ?? []);
			setLoading(false);
		})();
	}, []);
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.from("global_settings").upsert({
			id: 1,
			site_name: siteName,
			tagline: tagline || null,
			meta_title_template: metaTitle || null,
			meta_description: metaDesc || null,
			primary_color: primary,
			accent_color: accent,
			border_radius: radius,
			contact_phone: phone || null,
			contact_email: email || null,
			logo_url: logo[0]?.url ?? null,
			favicon_url: favicon[0]?.url ?? null,
			og_image_url: og[0]?.url ?? null,
			flagship_reseller_code: flagshipCode || null,
			label_size: labelSize
		});
		clearAppDataCache("settings");
		applyPlatformBranding({
			primary_color: primary,
			accent_color: accent,
			favicon_url: favicon[0]?.url ?? null
		});
		applyBrandingThemeDirectly(primary, accent, { radius });
		if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("brand_settings_updated", { detail: {
				site_name: siteName,
				logo_url: logo[0]?.url ?? null,
				primary_color: primary,
				accent_color: accent,
				border_radius: radius
			} }));
			if (favicon[0]?.url) {
				document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
				const link = document.createElement("link");
				link.rel = "icon";
				link.href = favicon[0].url;
				document.head.appendChild(link);
			}
		}
		setBusy(false);
		if (error) toast.error(error.message);
		else toast.success("Settings saved — Theme & assets updated successfully!");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Global Branding & Settings",
				description: "Customize global brand identity, live themes, SEO, and storefront defaults.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/landing",
					className: "inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Landing Page Content"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card p-5 border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl grid place-items-center text-white font-bold shadow-md",
							style: { background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` },
							children: siteName ? siteName.charAt(0) : "R"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold text-foreground",
							children: siteName || "ResellSeba"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: tagline || "Your Reseller Platform"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all",
							style: {
								backgroundColor: primary,
								borderRadius: radius
							},
							children: "Primary Action"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all",
							style: {
								backgroundColor: accent,
								borderRadius: radius
							},
							children: "Accent Badge"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "grid gap-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-4 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-primary" }), " Theme & Palette Customizer"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-xs font-semibold text-muted-foreground",
								children: "Quick Palette Presets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
								children: PALETTES.map((p) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setPrimary(p.primary);
											setAccent(p.accent);
										},
										className: cn("flex items-center gap-2 rounded-xl p-2 border text-left text-xs transition-all", primary === p.primary && accent === p.accent ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary" : "border-border/60 hover:bg-muted/60"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex -space-x-1 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-4 w-4 rounded-full border border-background shadow-xs",
												style: { backgroundColor: p.primary }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-4 w-4 rounded-full border border-background shadow-xs",
												style: { backgroundColor: p.accent }
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-[11px] font-medium",
											children: p.name.split("&")[0]
										})]
									}, p.name);
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Custom Primary Color",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: primary,
											onChange: (e) => setPrimary(e.target.value),
											className: "h-9 w-12 cursor-pointer rounded-lg border border-border p-0.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: primary,
											onChange: (e) => setPrimary(e.target.value),
											className: inp
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Custom Accent Color",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: accent,
											onChange: (e) => setAccent(e.target.value),
											className: "h-9 w-12 cursor-pointer rounded-lg border border-border p-0.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: accent,
											onChange: (e) => setAccent(e.target.value),
											className: inp
										})]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-xs font-semibold text-muted-foreground",
								children: "Card & Button Corner Style"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: RADII.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRadius(r.value),
									className: cn("rounded-xl py-2 px-3 border text-xs font-medium text-center transition-all", radius === r.value ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary" : "border-border/60 hover:bg-muted"),
									children: r.label
								}, r.value))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-4 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4 text-primary" }), " Identity & Assets"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Platform Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: siteName,
									onChange: (e) => setSiteName(e.target.value),
									className: inp,
									placeholder: "ResellSeba",
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tagline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: tagline,
									onChange: (e) => setTagline(e.target.value),
									className: inp,
									placeholder: "Launch your own online store with zero investment"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Platform Logo (Header & Sidebar)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
										bucket: "branding",
										folder: "branding",
										value: logo,
										onChange: setLogo
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Favicon (Square 1:1)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
										bucket: "branding",
										folder: "branding",
										value: favicon,
										onChange: setFavicon,
										square: true
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-4 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }), " SEO & Social Share (OG)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Meta Title Template",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: metaTitle,
									onChange: (e) => setMetaTitle(e.target.value),
									className: inp,
									placeholder: "%s — ResellSeba Platform"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Meta Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: metaDesc,
									onChange: (e) => setMetaDesc(e.target.value),
									className: inp,
									placeholder: "Complete e-commerce reseller platform in Bangladesh."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "OG Social Share Image",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
									bucket: "branding",
									folder: "branding",
									value: og,
									onChange: setOg
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-4 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), " Store Defaults & Contact"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Flagship Reseller Store",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: flagshipCode,
									onChange: (e) => setFlagshipCode(e.target.value),
									className: inp,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "— None (show platform landing page) —"
									}), resellers.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: r.code,
										children: [
											r.business_name,
											" (",
											r.code,
											")"
										]
									}, r.code))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Shipping Label Default Size",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: labelSize,
									onChange: (e) => setLabelSize(e.target.value),
									className: inp,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "3x3",
										children: "3x3 inch (Thermal)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "3x4",
										children: "3x4 inch (Standard Courier)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Official Phone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										className: inp,
										placeholder: "+8801700000000"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Support Email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: inp,
										placeholder: "support@resellseba.com"
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-2 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Save Global Changes"]
						})
					})
				]
			})
		]
	});
}
var inp = "w-full rounded-xl border border-border/70 bg-background/90 px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "block text-xs font-semibold text-foreground/80",
			children: label
		}), children]
	});
}
//#endregion
export { SettingsPage as component };
