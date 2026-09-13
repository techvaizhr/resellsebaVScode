import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { D as formatDate } from "./client-BAn7XKYw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Dt as MailX, Et as Mail, I as ShieldCheck, O as Smartphone, Ot as MailCheck, Sn as ExternalLink, Tt as MapPin, Zt as IdCard, br as ArrowUpRight, h as TriangleAlert, it as Phone, jn as Copy, jt as Lock, k as SmartphoneNfc } from "./vendor-icons-DF2A5Z8S.js";
import { t as ResellerAvatar } from "./reseller-avatar-C6dusfCe.js";
import { i as resellerStatusLabel, r as resellerStatusClass } from "./reseller-status-Cim1Uohp.js";
//#region src/components/verify-badges.tsx
var import_jsx_runtime = require_jsx_runtime();
var base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap";
var okCls = "bg-success/10 text-success ring-1 ring-inset ring-success/25";
var dueCls = "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/25";
var offCls = "bg-muted text-muted-foreground ring-1 ring-inset ring-border";
function Chip({ verified, required, label, icon, iconOff }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `${base} ${verified ? okCls : required ? dueCls : offCls}`,
		title: verified ? `${label} verified` : required ? `${label} not verified — required, reseller stays blocked` : `${label} not verified — verification is off in Advanced settings`,
		children: [
			verified ? icon : iconOff,
			label,
			" ",
			verified ? "verified" : "unverified"
		]
	});
}
function VerifyBadges({ emailVerified, phoneVerified, hasPhone = true, requireEmail = false, requirePhone = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex flex-nowrap items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				verified: emailVerified,
				required: requireEmail,
				label: "Email",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-3 w-3" }),
				iconOff: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailX, { className: "h-3 w-3" })
			}),
			hasPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				verified: phoneVerified,
				required: requirePhone,
				label: "Mobile",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartphoneNfc, { className: "h-3 w-3" }),
				iconOff: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `${base} ${offCls}`,
				title: "No phone number saved",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }), " No mobile"]
			}),
			emailVerified && (phoneVerified || !hasPhone) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `${base} ${okCls}`,
				title: "Every verification step is done",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Fully verified"]
			})
		]
	});
}
/** true when this reseller still owes a verification step that is switched on */
function verifyPending(f) {
	if (f.requireEmail && !f.emailVerified) return true;
	if (f.requirePhone && (f.hasPhone ?? true) && !f.phoneVerified) return true;
	return false;
}
//#endregion
//#region src/components/ResellerProfile.tsx
function copy(value, label) {
	navigator.clipboard.writeText(value);
	toast.success(`${label} copied`);
}
function money(v) {
	return v == null ? "—" : `৳${Number(v).toLocaleString()}`;
}
function date(v) {
	return formatDate(v, "—", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function Row({ label, value, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 border-b py-2 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex min-w-0 items-center gap-1.5 text-right text-sm font-medium break-words",
			children: [value, action]
		})]
	});
}
function IconBtn({ onClick, children, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title,
		onClick,
		className: "grid h-6 w-6 shrink-0 place-items-center rounded border text-muted-foreground transition hover:bg-muted hover:text-foreground",
		children
	});
}
function Stat({ label, value, tone, to, search }) {
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), to && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm font-semibold tabular-nums " + (tone === "success" ? "text-success" : tone === "muted" ? "text-muted-foreground" : ""),
		children: value
	})] });
	if (to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: "group rounded-lg border bg-muted/30 px-3 py-2 transition hover:border-primary/50 hover:bg-primary/5",
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border bg-muted/30 px-3 py-2",
		children: body
	});
}
function ResellerProfile({ reseller: r, summary: s, orders, admin = false }) {
	const ordersLink = (tab) => admin ? {
		to: "/admin/orders",
		search: {
			reseller: r.id,
			...tab ? { tab } : {}
		}
	} : {};
	const payoutsLink = (status) => admin ? {
		to: "/admin/payouts",
		search: {
			reseller: r.id,
			...status ? { status } : {}
		}
	} : {};
	const earningLink = () => admin ? {
		to: "/admin/transactions",
		search: { reseller: r.id }
	} : {};
	const storeUrl = typeof window !== "undefined" ? `${window.location.origin}/s/${r.code}` : `/s/${r.code}`;
	/** A deposit only exists when it is switched on AND an amount is set. */
	const depositAmount = Number(r.deposit_required_amount ?? 0);
	const depositActive = Boolean(r.deposit_required) && depositAmount > 0;
	const depositDue = depositActive ? Math.max(depositAmount - (s?.deposit_balance ?? 0), 0) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAvatar, {
						url: r.avatar_url,
						name: r.business_name,
						size: 56
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-lg font-semibold",
									children: r.business_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-medium ${resellerStatusClass(r.status)}`,
									children: resellerStatusLabel(r.status)
								}),
								r.email_verified != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifyBadges, {
									emailVerified: Boolean(r.email_verified),
									phoneVerified: Boolean(r.phone_verified),
									hasPhone: Boolean(r.contact_phone),
									requireEmail: Boolean(r.require_email_verify),
									requirePhone: Boolean(r.require_phone_verify)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-wide text-muted-foreground",
											children: "Reseller ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-sm font-bold tracking-wider text-primary",
											children: r.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
											title: "Copy reseller ID",
											onClick: () => copy(r.code, "Reseller ID"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/s/${r.code}`,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " Visit store"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
									title: "Copy store link",
									onClick: () => copy(storeUrl, "Store link"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 text-sm font-semibold",
						children: "Finance snapshot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Orders",
								value: orders == null ? "—" : orders.toLocaleString(),
								...ordersLink("all")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Delivered profit",
								value: money(s?.delivered_profit),
								tone: "success",
								...earningLink()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Withdrawable",
								value: money(s?.available),
								...payoutsLink()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Paid out",
								value: money(s?.paid_out),
								...payoutsLink("paid")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Payout pending",
								value: money(s?.pending_payout),
								tone: "muted",
								...payoutsLink("pending")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Deposit paid",
								value: money(s?.deposit_balance),
								...payoutsLink()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Deposit due",
								value: money(depositDue),
								tone: depositDue > 0 ? void 0 : "muted",
								...payoutsLink()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Frozen",
								value: money(Number(r.frozen_amount ?? 0)),
								tone: "muted",
								...payoutsLink()
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [depositActive ? depositDue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
								" Deposit due ",
								money(depositDue)
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Deposit complete"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " No security deposit required"]
						}), Number(r.frozen_amount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }),
								" ",
								money(Number(r.frozen_amount)),
								" frozen — not withdrawable"
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold",
							children: "Account information"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Business name",
							value: r.business_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Reseller ID",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: r.code
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Email",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }),
									" ",
									r.email ?? "—"
								]
							}),
							action: r.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Copy email",
								onClick: () => copy(r.email, "Email"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							}) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Phone",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 text-muted-foreground" }),
									" ",
									r.contact_phone ?? "—"
								]
							}),
							action: r.contact_phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Copy phone",
								onClick: () => copy(r.contact_phone, "Phone"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							}) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Address",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-start gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									" ",
									r.address ?? "—"
								]
							})
						}),
						r.nid_number !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "NID",
							value: r.nid_number ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Commission rate",
							value: `${r.commission_rate}%`
						}),
						r.leader_name !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Leader",
							value: r.leader_name ?? "No leader"
						}),
						r.agent_name !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Commission agent",
							value: r.agent_name ?? "No agent assigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: resellerStatusLabel(r.status) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Security deposit",
							value: r.deposit_required ? `Required ${money(Number(r.deposit_required_amount ?? 0))}` : "Not required"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Frozen amount",
							value: money(Number(r.frozen_amount ?? 0))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Store link",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs break-all",
								children: storeUrl
							}),
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Copy store link",
								onClick: () => copy(storeUrl, "Store link"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Joined",
							value: date(r.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Approved",
							value: date(r.approved_at)
						}),
						r.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Notes",
							value: r.notes
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-sm font-semibold",
						children: "Payout details"
					}), r.payout_method ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Method",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: r.payout_method
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Account number",
							value: r.payout_account_number ?? "—",
							action: r.payout_account_number ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								title: "Copy account number",
								onClick: () => copy(r.payout_account_number, "Account number"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							}) : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Account name",
							value: r.payout_account_name ?? "—"
						}),
						r.payout_method === "bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Bank",
								value: r.payout_bank_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Branch",
								value: r.payout_branch ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Routing",
								value: r.payout_routing ?? "—"
							})
						] })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-6 text-center text-sm text-destructive",
						children: "Payout method not set yet — withdrawals stay blocked until it is added."
					})]
				})]
			})
		]
	});
}
//#endregion
export { VerifyBadges as n, verifyPending as r, ResellerProfile as t };
