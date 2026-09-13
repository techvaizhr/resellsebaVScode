import { r as supabase } from "./client-CdRSQB5v.js";
import { n as getGlobalSettings } from "./app-data-tJP6g7R4.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Copy, Headphones, Loader2, Mail, MessageCircle, Phone, UserCheck } from "lucide-react";
//#region src/routes/_authenticated/reseller/support.tsx?tsr-split=component
function digits(v) {
	return v.replace(/[^\d+]/g, "").replace(/^\+/, "");
}
function waNumber(phone) {
	let d = digits(phone);
	if (d.startsWith("0")) d = "88" + d;
	if (d.startsWith("1") && d.length === 10) d = "880" + d;
	return d;
}
function SupportPage() {
	const [s, setS] = useState(null);
	const [agent, setAgent] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			const data = await getGlobalSettings();
			setS(data ?? null);
			const { data: rid } = await supabase.rpc("current_reseller_id");
			if (rid) {
				const { data: row } = await supabase.from("resellers").select("agent_id").eq("id", rid).maybeSingle();
				const agentId = row?.agent_id;
				if (agentId) {
					const { data: a } = await supabase.from("agents").select("*").eq("id", agentId).eq("is_active", true).maybeSingle();
					setAgent(a ?? null);
				}
			}
			setLoading(false);
		})();
	}, []);
	const copy = async (v, label) => {
		try {
			await navigator.clipboard.writeText(v);
			toast.success(`${label} copied`);
		} catch {
			toast.error("Failed to copy");
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-[40vh] place-items-center",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const phone = s?.contact_phone?.trim() || "";
	const email = s?.contact_email?.trim() || "";
	const brand = s?.site_name?.trim() || "Admin";
	const waText = encodeURIComponent("Assalamu Alaikum, I am a reseller. I need assistance.");
	const cards = [
		phone && {
			key: "call",
			icon: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }),
			title: "Phone Call",
			desc: "Talk directly during office hours",
			value: phone,
			href: `tel:${digits(phone)}`,
			action: "Call",
			tone: "from-primary/15 to-primary/5 text-primary"
		},
		phone && {
			key: "wa",
			icon: /* @__PURE__ */ jsx(MessageCircle, { className: "h-5 w-5" }),
			title: "WhatsApp",
			desc: "Message about orders, payments, or products",
			value: phone,
			href: `https://wa.me/${waNumber(phone)}?text=${waText}`,
			action: "Send Message",
			tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600"
		},
		email && {
			key: "mail",
			icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
			title: "Email",
			desc: "For detailed issues or sending documents",
			value: email,
			href: `mailto:${email}?subject=${encodeURIComponent("Reseller support")}`,
			action: "Send Email",
			tone: "from-sky-500/15 to-sky-500/5 text-sky-600"
		}
	].filter(Boolean);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Support & Contact",
				description: `Get in touch with the ${brand} team directly for any need`
			}),
			agent && /* @__PURE__ */ jsxs("div", {
				className: "surface-card overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b bg-primary/5 px-4 py-3 sm:px-5",
					children: [/* @__PURE__ */ jsx(UserCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("h2", {
						className: "text-sm font-bold",
						children: "My agent"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary",
							children: agent.display_name.slice(0, 2)
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "truncate font-bold",
									children: agent.display_name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Your dedicated business follow-up person. Contact for growth, product or order guidance."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex flex-wrap gap-3 text-xs",
									children: [agent.phone && /* @__PURE__ */ jsx("span", {
										className: "font-mono",
										children: agent.phone
									}), agent.email && /* @__PURE__ */ jsx("span", {
										className: "break-all font-mono",
										children: agent.email
									})]
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [agent.phone && /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("a", {
								href: `tel:${digits(agent.phone)}`,
								className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
								children: [/* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }), " Call"]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: `https://wa.me/${waNumber(agent.whatsapp || agent.phone)}?text=${waText}`,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-muted",
								children: [/* @__PURE__ */ jsx(MessageCircle, { className: "h-3.5 w-3.5" }), " WhatsApp"]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => copy(agent.phone, "Agent number"),
								className: "inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted",
								"aria-label": "Copy agent number",
								children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
							})
						] }), agent.email && /* @__PURE__ */ jsxs("a", {
							href: `mailto:${agent.email}`,
							className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted",
							children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }), " Email"]
						})]
					})]
				})]
			}),
			cards.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground",
				children: [/* @__PURE__ */ jsx(Headphones, { className: "mx-auto mb-3 h-6 w-6" }), "No contact information has been added yet. Please check back later."]
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: cards.map((c) => /* @__PURE__ */ jsxs("div", {
					className: "group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: `mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${c.tone}`,
							children: c.icon
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold",
							children: c.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: c.desc
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 break-all font-mono text-sm",
							children: c.value
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("a", {
								href: c.href,
								target: c.href.startsWith("http") ? "_blank" : void 0,
								rel: "noreferrer",
								className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90",
								children: c.action
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => copy(c.value, c.title),
								className: "inline-flex h-8 w-8 items-center justify-center rounded-md border transition hover:bg-muted",
								"aria-label": `Copy ${c.title}`,
								children: /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				}, c.key))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium text-foreground",
					children: "For faster support"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1",
					children: "When messaging, please mention your reseller code, order number, or payment TrxID — this helps resolve issues faster."
				})]
			})
		]
	});
}
//#endregion
export { SupportPage as component };
