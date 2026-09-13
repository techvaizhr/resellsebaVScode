//#region src/lib/store-theme.ts
/**
* Device font stacks. No webfont is downloaded — every theme uses fonts that
* already exist on the visitor's device (including Bengali system fonts), so
* the storefront never calls Google Fonts or any external font server.
*/
var SYS_SANS = "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans Bengali\", \"Hind Siliguri\", \"Helvetica Neue\", Arial, sans-serif";
var SYS_SERIF = "Georgia, \"Times New Roman\", \"Noto Serif Bengali\", \"Noto Serif\", serif";
/** Builds a border color from the ink color so borders never clash. */
var pal = (id, name, dark, c) => ({
	id,
	name,
	dark,
	...c
});
var STORE_THEMES = [
	{
		id: "aurora",
		name: "Aurora (মডার্ন ও ট্রেন্ডি)",
		description: "আধুনিক গ্যাজেট ও লাইফস্টাইল স্টোর — সফট কার্ড, গ্লাস হেডার ও ট্রেন্ডিং ব্যাজ।",
		vars: {
			"--st-radius": "18px",
			"--st-radius-sm": "12px",
			"--st-font-head": SYS_SANS,
			"--st-font-body": SYS_SANS,
			"--st-head-weight": "700",
			"--st-track": "-0.02em"
		},
		layout: {
			header: "glass",
			hero: "gradient",
			card: "soft",
			nav: "chips",
			grid: "cozy",
			uppercaseNav: false,
			trustBar: true
		},
		palettes: [
			pal("indigo", "Indigo Glow", false, {
				bg: "#f7f8fc",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#0f1729",
				muted: "#64748b",
				border: "rgba(15,23,41,0.10)",
				primary: "#5b5bd6",
				accent: "#06b6d4"
			}),
			pal("emerald", "Fresh Mint", false, {
				bg: "#f4faf7",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#0b1f19",
				muted: "#587268",
				border: "rgba(11,31,25,0.10)",
				primary: "#0f9d67",
				accent: "#0ea5a5"
			}),
			pal("sunset", "Sunset Coral", false, {
				bg: "#fff7f3",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#25120b",
				muted: "#7c5b4d",
				border: "rgba(37,18,11,0.10)",
				primary: "#ef5b2b",
				accent: "#e11d48"
			}),
			pal("midnight", "Midnight Neon", true, {
				bg: "#0a1020",
				bgAlt: "#101a30",
				surface: "#141e37",
				fg: "#eef2ff",
				muted: "#9aa8c7",
				border: "rgba(238,242,255,0.14)",
				primary: "#7c8cff",
				accent: "#22d3ee"
			})
		]
	},
	{
		id: "noir",
		name: "Noir Luxe (লাক্সারি বুটিক)",
		description: "ডার্ক প্রিমিয়াম ফ্যাশন ও কসমেটিকস — গোল্ড অ্যাকসেন্ট, সেরিফ ফন্ট ও সিগনেচার স্পটলাইট।",
		vars: {
			"--st-radius": "6px",
			"--st-radius-sm": "3px",
			"--st-font-head": SYS_SERIF,
			"--st-font-body": SYS_SANS,
			"--st-head-weight": "600",
			"--st-track": "0.02em"
		},
		layout: {
			header: "classic",
			hero: "spotlight",
			card: "frame",
			nav: "links",
			grid: "airy",
			uppercaseNav: true,
			trustBar: false
		},
		palettes: [
			pal("gold", "Black & Gold", true, {
				bg: "#0b0b0d",
				bgAlt: "#111114",
				surface: "#15151b",
				fg: "#f4f2ee",
				muted: "#a09d95",
				border: "rgba(244,242,238,0.14)",
				primary: "#c9a84c",
				accent: "#e6d9b4"
			}),
			pal("champagne", "Champagne", true, {
				bg: "#100e0c",
				bgAlt: "#171410",
				surface: "#1c1814",
				fg: "#f6efe4",
				muted: "#a89c8a",
				border: "rgba(246,239,228,0.14)",
				primary: "#d9c08a",
				accent: "#b98b5e"
			}),
			pal("emerald", "Deep Emerald", true, {
				bg: "#07100d",
				bgAlt: "#0c1713",
				surface: "#101d18",
				fg: "#eaf5ef",
				muted: "#8aa79a",
				border: "rgba(234,245,239,0.14)",
				primary: "#2fae7f",
				accent: "#c9e8d8"
			}),
			pal("ivory", "Ivory Luxe", false, {
				bg: "#f7f5f0",
				bgAlt: "#f1eee6",
				surface: "#fffdf9",
				fg: "#15130f",
				muted: "#6f6a60",
				border: "rgba(21,19,15,0.14)",
				primary: "#9a7b3f",
				accent: "#2f2a22"
			})
		]
	},
	{
		id: "bazaar",
		name: "Bazaar (হাটবাজার ও সুপার ডিল)",
		description: "হাই-কনভার্সন বাংলাদেশি মার্কেটপ্লেস — ধামাকা অফার ব্যানার ও সরাসরি ১-ক্লিকে অর্ডার।",
		vars: {
			"--st-radius": "10px",
			"--st-radius-sm": "6px",
			"--st-font-head": SYS_SANS,
			"--st-font-body": SYS_SANS,
			"--st-head-weight": "700",
			"--st-track": "0"
		},
		layout: {
			header: "bar",
			hero: "banner",
			card: "compact",
			nav: "tabs",
			grid: "dense",
			uppercaseNav: false,
			trustBar: true
		},
		palettes: [
			pal("orange", "Deal Orange", false, {
				bg: "#f2f4f7",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#16202c",
				muted: "#5b6875",
				border: "rgba(22,32,44,0.12)",
				primary: "#e8590c",
				accent: "#1f3b5c"
			}),
			pal("crimson", "Bazaar Red", false, {
				bg: "#f6f3f3",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#1d1618",
				muted: "#6b5c60",
				border: "rgba(29,22,24,0.12)",
				primary: "#d61f36",
				accent: "#2c1d20"
			}),
			pal("royal", "Royal Blue", false, {
				bg: "#f1f4f9",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#101c30",
				muted: "#5a6880",
				border: "rgba(16,28,48,0.12)",
				primary: "#1266d6",
				accent: "#0b2545"
			}),
			pal("forest", "Market Green", false, {
				bg: "#f1f6f2",
				bgAlt: "#ffffff",
				surface: "#ffffff",
				fg: "#122019",
				muted: "#556b5e",
				border: "rgba(18,32,25,0.12)",
				primary: "#128c4a",
				accent: "#14342a"
			})
		]
	},
	{
		id: "atelier",
		name: "Atelier (অর্গানিক ও ক্রাফট)",
		description: "ন্যাচারাল, হেলথ ও বুক স্টোর — ওয়ার্ম ক্যানভাস টোন, ১০০% খাঁটি ট্রাস্ট সিল ও স্টোরিটেলিং।",
		vars: {
			"--st-radius": "14px",
			"--st-radius-sm": "8px",
			"--st-font-head": SYS_SERIF,
			"--st-font-body": SYS_SANS,
			"--st-head-weight": "500",
			"--st-track": "-0.01em"
		},
		layout: {
			header: "editorial",
			hero: "split",
			card: "bare",
			nav: "pills",
			grid: "airy",
			uppercaseNav: true,
			trustBar: false
		},
		palettes: [
			pal("clay", "Warm Clay", false, {
				bg: "#f6f4ef",
				bgAlt: "#efece4",
				surface: "#fffdf8",
				fg: "#1d1b18",
				muted: "#736d63",
				border: "rgba(29,27,24,0.14)",
				primary: "#a9714a",
				accent: "#1d1b18"
			}),
			pal("ink", "Paper & Ink", false, {
				bg: "#f5f5f3",
				bgAlt: "#ecebe7",
				surface: "#ffffff",
				fg: "#151513",
				muted: "#6d6d68",
				border: "rgba(21,21,19,0.14)",
				primary: "#1f1f1c",
				accent: "#8a8579"
			}),
			pal("olive", "Olive Studio", false, {
				bg: "#f4f5ec",
				bgAlt: "#eceee1",
				surface: "#fbfcf6",
				fg: "#1e2118",
				muted: "#6b7060",
				border: "rgba(30,33,24,0.14)",
				primary: "#5f6b3c",
				accent: "#2b2f22"
			}),
			pal("noirpaper", "Charcoal Paper", true, {
				bg: "#171614",
				bgAlt: "#1e1c19",
				surface: "#232120",
				fg: "#f4f1ea",
				muted: "#a29c91",
				border: "rgba(244,241,234,0.16)",
				primary: "#d8b48c",
				accent: "#f4f1ea"
			})
		]
	}
];
var DEFAULT_THEME_ID = "aurora";
function getStoreTheme(id) {
	return STORE_THEMES.find((t) => t.id === id) ?? STORE_THEMES[0];
}
function getPalette(theme, id) {
	return theme.palettes.find((p) => p.id === id) ?? theme.palettes[0];
}
/** Relative luminance of a hex color (0 = black, 1 = white). */
function luminance(hex) {
	const h = hex.trim().replace("#", "");
	const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
	if (full.length < 6) return 0;
	const [r, g, b] = [
		0,
		2,
		4
	].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
	const lin = (c) => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
	return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
}
/** Readable ink for text sitting on top of an arbitrary palette color. */
function onColor(bg, palette) {
	return luminance(bg) > .55 ? palette.dark ? "#111114" : palette.fg : palette.dark ? palette.fg : "#ffffff";
}
/** Swatches used by the theme / palette pickers. */
function paletteSwatches(p) {
	return [
		p.bg,
		p.surface,
		p.primary,
		p.accent
	];
}
/** CSS custom properties for the storefront root element. */
function storeThemeStyle(theme, paletteId) {
	const p = getPalette(theme, paletteId);
	return {
		...theme.vars,
		"--st-bg": p.bg,
		"--st-bg-alt": p.bgAlt,
		"--st-surface": p.surface,
		"--st-fg": p.fg,
		"--st-muted": p.muted,
		"--st-border": p.border,
		"--st-primary": p.primary,
		"--st-accent": p.accent,
		"--st-on-primary": onColor(p.primary, p),
		"--st-on-accent": onColor(p.accent, p),
		"--st-on-surface": onColor(p.surface, p),
		"--st-shadow": p.dark ? "0 24px 60px -32px rgba(0,0,0,0.85)" : "0 18px 40px -28px rgba(15,23,41,0.30)",
		/** legacy var kept for older components */
		"--store-primary": p.primary
	};
}
/**
* Kept for backwards compatibility: themes now use device fonts only, so
* there is no external stylesheet to load.
*/
function ensureThemeFont(_theme) {}
//#endregion
//#region src/lib/store-content.ts
var t = (key, label, def, placeholder) => ({
	key,
	label,
	type: "text",
	def,
	placeholder
});
var area = (key, label, def) => ({
	key,
	label,
	type: "textarea",
	def
});
var img = (key, label, hint) => ({
	key,
	label,
	type: "image",
	hint
});
var on = (key, label, def = true) => ({
	key,
	label,
	type: "toggle",
	def
});
/** Groups shared by every theme. */
function baseGroups() {
	return [
		{
			id: "hero",
			title: "Hero section",
			description: "First screen customers see — the strongest conversion spot.",
			fields: [
				on("hero_show", "Show hero banner", true),
				t("hero_badge", "Small badge above headline", "Cash on delivery all over Bangladesh"),
				t("hero_headline", "Headline", "Shop smart at {store}"),
				area("hero_sub", "Sub headline", "Handpicked products, honest prices and delivery to your door. Pay only when you receive."),
				t("hero_cta", "Primary button text", "Shop now"),
				t("hero_cta2", "Secondary button text", "Order on WhatsApp"),
				img("hero_image", "Hero image", "Leave empty to use your top product image."),
				t("hero_note", "Small note under buttons", "Delivery in 1–3 days • Easy return within 24h")
			]
		},
		{
			id: "usp",
			title: "Benefit strip",
			description: "Four short promises right under the hero. Builds instant trust.",
			fields: [
				on("usp_show", "Show benefit strip"),
				t("usp1_t", "Benefit 1 title", "Cash on Delivery"),
				t("usp1_d", "Benefit 1 detail", "Pay after you receive"),
				t("usp2_t", "Benefit 2 title", "Nationwide delivery"),
				t("usp2_d", "Benefit 2 detail", "All 64 districts"),
				t("usp3_t", "Benefit 3 title", "100% genuine"),
				t("usp3_d", "Benefit 3 detail", "Verified products only"),
				t("usp4_t", "Benefit 4 title", "Easy returns"),
				t("usp4_d", "Benefit 4 detail", "Report within 24 hours")
			]
		},
		{
			id: "sections",
			title: "Home sections",
			description: "Titles and visibility of the product sections.",
			fields: [
				on("cat_show", "Show category section"),
				t("cat_title", "Category section title", "Shop by category"),
				t("cat_sub", "Category section subtitle", "Find what you need faster"),
				on("featured_show", "Show featured section"),
				t("featured_title", "Featured section title", "Best sellers"),
				t("featured_sub", "Featured section subtitle", "Most ordered products this month"),
				t("latest_title", "New arrivals title", "New arrivals"),
				t("latest_sub", "New arrivals subtitle", "Freshly added to the store")
			]
		},
		{
			id: "promo",
			title: "Promo banner",
			description: "Offer strip between sections — great for discounts or bundles.",
			fields: [
				on("promo_show", "Show promo banner", true),
				t("promo_title", "Promo title", "Order today, pay on delivery"),
				area("promo_text", "Promo text", "No advance payment needed. Confirm your order and pay the courier when the parcel reaches you."),
				t("promo_cta", "Promo button text", "Browse products"),
				img("promo_image", "Promo image")
			]
		},
		{
			id: "why",
			title: "Why shop with us",
			description: "Three reasons that remove buying hesitation.",
			fields: [
				on("why_show", "Show this section", true),
				t("why_title", "Section title", "Why customers choose {store}"),
				t("why1_t", "Reason 1", "Real product, real photos"),
				area("why1_d", "Reason 1 detail", "Every item is checked before it leaves our warehouse."),
				t("why2_t", "Reason 2", "Fast, tracked delivery"),
				area("why2_d", "Reason 2 detail", "Courier tracking is shared right after your order is booked."),
				t("why3_t", "Reason 3", "Support that replies"),
				area("why3_d", "Reason 3 detail", "Call or WhatsApp us any day between 10am and 9pm.")
			]
		},
		{
			id: "reviews",
			title: "Customer reviews",
			description: "Social proof. Use real customer feedback.",
			fields: [
				on("review_show", "Show reviews", true),
				t("review_title", "Section title", "What customers say"),
				area("review1_text", "Review 1", "Product exactly matched the photos and delivery was quick. Highly recommended."),
				t("review1_name", "Review 1 name", "Rakib, Dhaka"),
				area("review2_text", "Review 2", "I paid after checking the parcel. Very comfortable shopping experience."),
				t("review2_name", "Review 2 name", "Sumaiya, Chattogram"),
				area("review3_text", "Review 3", "Support answered on WhatsApp within minutes. Will order again."),
				t("review3_name", "Review 3 name", "Tanvir, Sylhet")
			]
		},
		{
			id: "faq",
			title: "FAQ",
			description: "Answer the questions that stop people from ordering.",
			fields: [
				on("faq_show", "Show FAQ", true),
				t("faq_title", "Section title", "Frequently asked questions"),
				t("faq1_q", "Question 1", "How do I pay?"),
				area("faq1_a", "Answer 1", "Cash on delivery — you pay the courier when the parcel arrives."),
				t("faq2_q", "Question 2", "How long is delivery?"),
				area("faq2_a", "Answer 2", "1–3 days inside Dhaka and 2–5 days outside Dhaka."),
				t("faq3_q", "Question 3", "Can I return a product?"),
				area("faq3_a", "Answer 3", "Yes. If the product is wrong or damaged, report within 24 hours of delivery.")
			]
		},
		{
			id: "product",
			title: "Product page",
			description: "Trust lines and urgency shown next to the buy button.",
			fields: [
				t("pdp_trust1", "Trust line 1", "Cash on delivery available"),
				t("pdp_trust2", "Trust line 2", "Genuine product guarantee"),
				t("pdp_trust3", "Trust line 3", "Delivery within 1–5 days"),
				t("pdp_urgency", "Urgency line", "Limited stock — order today to secure yours"),
				area("pdp_returns", "Return / warranty note", "Wrong or damaged item? Report within 24 hours for a free replacement."),
				on("pdp_sticky", "Show sticky mobile buy bar", true)
			]
		},
		{
			id: "checkout",
			title: "Checkout page",
			description: "Copy that reassures customers on the final step.",
			fields: [
				t("co_headline", "Checkout headline", "Complete your order"),
				area("co_note", "Note above the form", "Fill in your delivery details. Our team will call to confirm before dispatch."),
				t("co_trust", "Trust line under the button", "No advance payment • Pay the courier on delivery"),
				t("co_success", "Thank-you headline", "Order received!"),
				area("co_success_note", "Thank-you note", "We will call you shortly to confirm the order and share courier tracking.")
			]
		},
		{
			id: "footer",
			title: "Footer",
			description: "Closing message and store story in the footer.",
			fields: [area("footer_about", "About text in footer", ""), t("footer_note", "Bottom note", "")]
		}
	];
}
/**
* Theme-specific groups. Only the active theme's group is shown in the panel,
* and every field here is rendered by that theme on the storefront.
*/
var THEME_GROUP = {
	aurora: {
		id: "theme-aurora",
		title: "Aurora highlights",
		description: "Trust highlights and the offer chip on the gradient hero.",
		fields: [
			t("aurora_stat1", "Highlight 1 (next to hero buttons)", "10k+ orders delivered"),
			t("aurora_stat2", "Highlight 2 (next to hero buttons)", "4.8★ average rating"),
			t("aurora_offer", "Offer chip on hero image", "Free delivery over ৳2000")
		]
	},
	noir: {
		id: "theme-noir",
		title: "Noir brand story",
		description: "Eyebrow line above the hero headline and the boutique story band.",
		fields: [t("noir_eyebrow", "Collection eyebrow text", "The signature collection"), area("noir_story", "Brand story paragraph", "Curated pieces, made for people who notice the details.")]
	},
	bazaar: {
		id: "theme-bazaar",
		title: "Bazaar deal strip",
		description: "Colored deal strip shown between the hero and the product sections.",
		fields: [t("bazaar_deal_title", "Flash deal strip title", "Today's deals"), t("bazaar_deal_note", "Flash deal note", "Limited stock — first come, first served")]
	},
	atelier: {
		id: "theme-atelier",
		title: "Atelier editorial quote",
		description: "Large editorial quote band placed between the product sections.",
		fields: [t("atelier_quote", "Editorial quote", "Fewer, better things."), t("atelier_credit", "Quote credit", "— our studio promise")]
	}
};
function themeContentGroups(themeId) {
	const groups = baseGroups();
	const extra = THEME_GROUP[themeId];
	if (!extra) return groups;
	/** theme group sits right after the hero group */
	const i = groups.findIndex((g) => g.id === "hero");
	return [
		...groups.slice(0, i + 1),
		extra,
		...groups.slice(i + 1)
	];
}
function contentFieldMap(themeId) {
	const map = {};
	for (const g of themeContentGroups(themeId)) for (const f of g.fields) map[f.key] = f;
	return map;
}
function createContentReader(themeId, values, legacy, storeName) {
	const fields = contentFieldMap(themeId);
	const legacyMap = {
		hero_headline: legacy?.hero_headline,
		hero_sub: legacy?.hero_subheadline,
		hero_image: legacy?.hero_image_url,
		footer_about: legacy?.about_text,
		footer_note: legacy?.footer_text
	};
	const fill = (s) => s.replace(/\{store\}/g, storeName);
	return {
		text: (key) => {
			const raw = values?.[key];
			if (typeof raw === "string" && raw.trim()) return fill(raw.trim());
			const lg = legacyMap[key];
			if (typeof lg === "string" && lg.trim()) return fill(lg.trim());
			const def = fields[key]?.def;
			return typeof def === "string" ? fill(def) : "";
		},
		flag: (key) => {
			const raw = values?.[key];
			if (typeof raw === "boolean") return raw;
			const def = fields[key]?.def;
			return typeof def === "boolean" ? def : true;
		}
	};
}
//#endregion
export { ensureThemeFont as a, paletteSwatches as c, STORE_THEMES as i, storeThemeStyle as l, themeContentGroups as n, getPalette as o, DEFAULT_THEME_ID as r, getStoreTheme as s, createContentReader as t };
