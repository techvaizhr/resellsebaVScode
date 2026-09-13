import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-KjQ-na90.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Mt as LoaderCircle, _n as ExternalLink } from "./vendor-icons-BWIzFOtW.js";
import { r as getMyReseller } from "./app-data-DdK5ZzvO.js";
import { n as PageHeader } from "./ui-kit-QFWJ0cl0.js";
import { n as useAuth } from "./use-auth-BdX1T6s2.js";
import { t as ImageUploader } from "./ImageUploader-BO6d8Jye.js";
import { t as clearBootstrapCache } from "./bootstrap-AadClqhq.js";
//#region src/routes/_authenticated/reseller/settings.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mb-1 block text-xs font-medium",
			children: label
		}),
		children,
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] text-muted-foreground",
			children: hint
		})
	] });
}
function SettingsPage() {
	const { user } = useAuth();
	const [rid, setRid] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [storeName, setStoreName] = (0, import_react.useState)("");
	const [tagline, setTagline] = (0, import_react.useState)("");
	/** Store colors are managed per theme in the Theme page. */
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [supportPhone, setSupportPhone] = (0, import_react.useState)("");
	const [fb, setFb] = (0, import_react.useState)("");
	const [insta, setInsta] = (0, import_react.useState)("");
	const [tiktok, setTiktok] = (0, import_react.useState)("");
	const [announcement, setAnnouncement] = (0, import_react.useState)("");
	const [metaDesc, setMetaDesc] = (0, import_react.useState)("");
	const [footer, setFooter] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)([]);
	const [favicon, setFavicon] = (0, import_react.useState)([]);
	const [og, setOg] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const r = await getMyReseller(user.id);
			if (!r) return setLoading(false);
			setRid(r.id);
			setCode(r.code);
			const { data: s } = await supabase.from("reseller_settings").select("*").eq("reseller_id", r.id).maybeSingle();
			if (s) {
				setStoreName(s.store_name);
				setTagline(s.tagline ?? "");
				setWhatsapp(s.whatsapp ?? "");
				setSupportPhone(s.support_phone ?? "");
				setFb(s.facebook_url ?? "");
				setInsta(s.instagram_url ?? "");
				setTiktok(s.tiktok_url ?? "");
				setAnnouncement(s.announcement ?? "");
				setMetaDesc(s.meta_description ?? "");
				setFooter(s.footer_text ?? "");
				if (s.logo_url) setLogo([{
					path: "",
					url: s.logo_url,
					bytes: 0
				}]);
				if (s.favicon_url) setFavicon([{
					path: "",
					url: s.favicon_url,
					bytes: 0
				}]);
				if (s.og_image_url) setOg([{
					path: "",
					url: s.og_image_url,
					bytes: 0
				}]);
			} else setStoreName(r.business_name);
			setLoading(false);
		})();
	}, [user]);
	async function save(e) {
		e.preventDefault();
		if (!rid) return;
		setBusy(true);
		const { error } = await supabase.from("reseller_settings").upsert({
			reseller_id: rid,
			store_name: storeName,
			tagline: tagline || null,
			/** colors are theme palette driven now */
			primary_color: null,
			accent_color: null,
			whatsapp: whatsapp || null,
			support_phone: supportPhone || null,
			facebook_url: fb || null,
			instagram_url: insta || null,
			tiktok_url: tiktok || null,
			announcement: announcement || null,
			meta_description: metaDesc || null,
			footer_text: footer || null,
			logo_url: logo[0]?.url ?? null,
			favicon_url: favicon[0]?.url ?? null,
			og_image_url: og[0]?.url ?? null
		}, { onConflict: "reseller_id" });
		setBusy(false);
		if (error) toast.error(error.message);
		else {
			clearBootstrapCache("store:");
			toast.success("Settings saved");
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Store Configuration",
		description: "Configure your storefront identity, branding assets, and SEO parameters.",
		actions: code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: `/s/${code}`,
			target: "_blank",
			rel: "noreferrer",
			className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " View store"]
		}) : void 0
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: save,
		className: "grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Identity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Store name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: storeName,
							onChange: (e) => setStoreName(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tagline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tagline,
							onChange: (e) => setTagline(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Announcement bar",
						hint: "Shown at the very top of the storefront.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: announcement,
							onChange: (e) => setAnnouncement(e.target.value),
							className: inp,
							placeholder: "Free delivery over ৳2000"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground",
						children: [
							"Store colors live in ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Theme"
							}),
							" — pick a theme and one of its ready-made color palettes there."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Brand assets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/logo`,
							value: logo,
							onChange: setLogo
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Favicon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/favicon`,
							value: favicon,
							onChange: setFavicon
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "OG share image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/og`,
							value: og,
							onChange: setOg
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Contact & social"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Support phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: supportPhone,
							onChange: (e) => setSupportPhone(e.target.value),
							className: inp,
							placeholder: "01XXXXXXXXX"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "WhatsApp",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: whatsapp,
							onChange: (e) => setWhatsapp(e.target.value),
							className: inp,
							placeholder: "8801XXXXXXXXX"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Facebook page URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: fb,
							onChange: (e) => setFb(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Instagram URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: insta,
							onChange: (e) => setInsta(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "TikTok URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tiktok,
							onChange: (e) => setTiktok(e.target.value),
							className: inp
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "SEO & footer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Meta description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: metaDesc,
							onChange: (e) => setMetaDesc(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Footer bottom text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: footer,
							onChange: (e) => setFooter(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Save settings"]
					})
				]
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
