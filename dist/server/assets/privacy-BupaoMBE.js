import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { $ as Printer, D as Sparkles, Et as Mail, I as ShieldCheck, Sr as ArrowLeft, it as Phone, jt as Lock, qn as CircleCheck, sr as Calendar } from "./vendor-icons-DF2A5Z8S.js";
import { n as PublicHeader, t as Brand } from "./public-header-2XmgbAUN.js";
//#region src/routes/privacy.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_POLICY = `<h2>1. Introduction & Overview</h2>
<p>Welcome to our platform. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains what data we collect, why we collect it, how it is secured, and your rights as a reseller or customer.</p>

<h2>2. Information We Collect</h2>
<ul>
  <li><strong>Account Information:</strong> Name, phone number, email address, store name, and login credentials.</li>
  <li><strong>Order & Delivery Data:</strong> Customer full name, delivery address, phone number, and ordered products.</li>
  <li><strong>Financial & Payment Details:</strong> Payout accounts (bKash, Nagad, Bank details) and transaction histories for commission settlements.</li>
  <li><strong>Device & Usage Data:</strong> IP address, device type, browser information, and activity logs to prevent fraud.</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
  <li>To provide, operate, and maintain reseller accounts and storefronts.</li>
  <li>To process and deliver customer orders smoothly through integrated courier services (Steadfast, Pathao, RedX).</li>
  <li>To calculate accurate profit margins, commissions, bonuses, and process payout requests.</li>
  <li>To provide customer support and broadcast platform announcements.</li>
  <li>To monitor security, detect fraud, and protect user accounts.</li>
</ul>

<h2>4. Third-Party Sharing & Couriers</h2>
<p>We do not sell, rent, or trade personal data to third parties for marketing. We only share necessary delivery information (name, address, phone number) with verified courier and logistics partners strictly for parcel delivery.</p>

<h2>5. Data Security & Storage</h2>
<ul>
  <li>All data transmissions are encrypted using standard SSL/TLS protocols.</li>
  <li>Sensitive financial and credential data are securely stored with restricted role-based access control.</li>
  <li>Regular system updates and automated backups ensure high availability and data integrity.</li>
</ul>

<h2>6. Reseller Responsibilities</h2>
<ul>
  <li>Resellers must handle end-customer information with strict confidentiality.</li>
  <li>Resellers agree not to disclose customer phone numbers or addresses to unauthorized parties.</li>
  <li>Keep your login credentials secure and enable two-factor authentication if available.</li>
</ul>

<h2>7. Policy Updates & Contact</h2>
<p>We may update this Privacy Policy periodically. Continued use of our platform constitutes agreement to the updated terms. If you have any questions or feedback, please reach out to our platform support team.</p>`;
function PrivacyPage() {
	const [policy, setPolicy] = (0, import_react.useState)(DEFAULT_POLICY);
	const [siteName, setSiteName] = (0, import_react.useState)("ResellSeba");
	const [tagline, setTagline] = (0, import_react.useState)("Modern Reseller Platform");
	const [logoUrl, setLogoUrl] = (0, import_react.useState)(null);
	const [contactEmail, setContactEmail] = (0, import_react.useState)("support@resellseba.com");
	const [contactPhone, setContactPhone] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("global_settings").select("site_name, tagline, logo_url, privacy_policy, contact_email, contact_phone").eq("id", 1).maybeSingle();
			if (data) {
				if (data.site_name) setSiteName(data.site_name);
				if (data.tagline) setTagline(data.tagline);
				if (data.logo_url) setLogoUrl(data.logo_url);
				if (data.privacy_policy) setPolicy(data.privacy_policy);
				if (data.contact_email) setContactEmail(data.contact_email);
				if (data.contact_phone) setContactPhone(data.contact_phone);
			}
		})();
	}, []);
	const handlePrint = () => {
		if (typeof window !== "undefined") window.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {
				siteName,
				logoUrl
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background py-12 sm:py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Home" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handlePrint,
								className: "inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print Document" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Trust & Security" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground",
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed",
								children: [
									"We are dedicated to safeguarding your personal and business data. This document describes how ",
									siteName,
									" collects, uses, and protects your information."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last Updated: March 2026" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SSL Encrypted & Safe" })]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "surface-card rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
								className: "prose prose-sm max-w-none text-foreground/90\n                  [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-2\n                  [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground\n                  [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2\n                  [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2\n                  [&_li]:text-xs sm:[&_li]:text-sm [&_li]:text-muted-foreground [&_li_strong]:text-foreground [&_li_strong]:font-semibold\n                  [&_p]:my-3.5 [&_p]:text-xs sm:[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_strong]:text-foreground\n                  [&_a]:text-primary [&_a]:underline hover:[&_a]:text-primary/80",
								dangerouslySetInnerHTML: { __html: policy || DEFAULT_POLICY }
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-4 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-bold text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Our Privacy Commitments" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-3 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Zero Data Selling:" }), " We never sell your personal data to marketing brokers."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Encrypted Transactions:" }), " Financial and payout credentials are cryptographically protected."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Verified Logistics:" }), " Delivery addresses are shared solely for courier dispatch."] })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "surface-card rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-5 shadow-2xs space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-sm text-foreground",
										children: "Have Questions?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: "If you need clarification about your data rights or store policies, our support desk is ready to help."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 space-y-2 text-xs",
										children: [contactEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `mailto:${contactEmail}`,
											className: "flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: contactEmail
											})]
										}), contactPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: `tel:${contactPhone}`,
											className: "flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: contactPhone })]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/60 bg-muted/20 p-4 text-[11px] text-muted-foreground space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-foreground",
										children: siteName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tagline }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Operated under official platform governance standards." })
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/60 bg-card mt-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {
							siteName,
							logoUrl,
							size: "sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" ",
							siteName,
							". All rights reserved."
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-5 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-primary transition-colors",
								children: "Home"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalog",
								search: {},
								className: "hover:text-primary transition-colors",
								children: "Catalog"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "font-bold text-primary",
								children: "Privacy Policy"
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { PrivacyPage as component };
