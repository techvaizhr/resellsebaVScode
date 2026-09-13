import { r as supabase } from "./client-BpJCBCUq.js";
import { r as getMyReseller } from "./app-data-DxwZMsmL.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { n as useAuth } from "./use-auth-BPiZPMVq.js";
import { t as ImageUploader } from "./ImageUploader-Ba09wYF1.js";
import { t as clearBootstrapCache } from "./bootstrap-CakIfe6a.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";
//#region src/routes/_authenticated/reseller/settings.tsx?tsr-split=component
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({ label, hint, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("label", {
			className: "mb-1 block text-xs font-medium",
			children: label
		}),
		children,
		hint && /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-[11px] text-muted-foreground",
			children: hint
		})
	] });
}
function SettingsPage() {
	const { user } = useAuth();
	const [rid, setRid] = useState(null);
	const [code, setCode] = useState("");
	const [storeName, setStoreName] = useState("");
	const [tagline, setTagline] = useState("");
	/** Store colors are managed per theme in the Theme page. */
	const [whatsapp, setWhatsapp] = useState("");
	const [supportPhone, setSupportPhone] = useState("");
	const [fb, setFb] = useState("");
	const [insta, setInsta] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [announcement, setAnnouncement] = useState("");
	const [metaDesc, setMetaDesc] = useState("");
	const [footer, setFooter] = useState("");
	const [logo, setLogo] = useState([]);
	const [favicon, setFavicon] = useState([]);
	const [og, setOg] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
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
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(PageHeader, {
		title: "Store Configuration",
		description: "Configure your storefront identity, branding assets, and SEO parameters.",
		actions: code ? /* @__PURE__ */ jsxs("a", {
			href: `/s/${code}`,
			target: "_blank",
			rel: "noreferrer",
			className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
			children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }), " View store"]
		}) : void 0
	}), /* @__PURE__ */ jsxs("form", {
		onSubmit: save,
		className: "grid gap-4 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold",
						children: "Identity"
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Store name",
						children: /* @__PURE__ */ jsx("input", {
							required: true,
							value: storeName,
							onChange: (e) => setStoreName(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Tagline",
						children: /* @__PURE__ */ jsx("input", {
							value: tagline,
							onChange: (e) => setTagline(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Announcement bar",
						hint: "Shown at the very top of the storefront.",
						children: /* @__PURE__ */ jsx("input", {
							value: announcement,
							onChange: (e) => setAnnouncement(e.target.value),
							className: inp,
							placeholder: "Free delivery over ৳2000"
						})
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground",
						children: [
							"Store colors live in ",
							/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: "Theme"
							}),
							" — pick a theme and one of its ready-made color palettes there."
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold",
						children: "Brand assets"
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Logo",
						children: /* @__PURE__ */ jsx(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/logo`,
							value: logo,
							onChange: setLogo
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Favicon",
						children: /* @__PURE__ */ jsx(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/favicon`,
							value: favicon,
							onChange: setFavicon
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "OG share image",
						children: /* @__PURE__ */ jsx(ImageUploader, {
							bucket: "stores",
							folder: `stores/${rid}/og`,
							value: og,
							onChange: setOg
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold",
						children: "Contact & social"
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Support phone",
						children: /* @__PURE__ */ jsx("input", {
							value: supportPhone,
							onChange: (e) => setSupportPhone(e.target.value),
							className: inp,
							placeholder: "01XXXXXXXXX"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "WhatsApp",
						children: /* @__PURE__ */ jsx("input", {
							value: whatsapp,
							onChange: (e) => setWhatsapp(e.target.value),
							className: inp,
							placeholder: "8801XXXXXXXXX"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Facebook page URL",
						children: /* @__PURE__ */ jsx("input", {
							value: fb,
							onChange: (e) => setFb(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Instagram URL",
						children: /* @__PURE__ */ jsx("input", {
							value: insta,
							onChange: (e) => setInsta(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "TikTok URL",
						children: /* @__PURE__ */ jsx("input", {
							value: tiktok,
							onChange: (e) => setTiktok(e.target.value),
							className: inp
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card space-y-3 p-6",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold",
						children: "SEO & footer"
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Meta description",
						children: /* @__PURE__ */ jsx("textarea", {
							rows: 3,
							value: metaDesc,
							onChange: (e) => setMetaDesc(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: "Footer bottom text",
						children: /* @__PURE__ */ jsx("input", {
							value: footer,
							onChange: (e) => setFooter(e.target.value),
							className: inp
						})
					}),
					/* @__PURE__ */ jsxs("button", {
						disabled: busy,
						className: "btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: [busy && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Save settings"]
					})
				]
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
