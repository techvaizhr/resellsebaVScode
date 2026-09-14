import { r as supabase } from "./client-Be051lUg.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-D-uo76H8.js";
import { i as useDepositSettings, n as fillText } from "./deposit-settings-DoIvJOvV.js";
import { t as formatDate } from "./date-zfkEdx3e.js";
import { t as LedgerTimeline } from "./ledger-timeline-CaHJLpMf.js";
import { n as useAuth } from "./use-auth-DJu3SP6g.js";
import { n as ReportCard } from "./report-blocks-CRm2raRg.js";
import { t as DepositPayPanel } from "./deposit-pay-panel-D_ZDxOQF.js";
import { t as useDepositStatus } from "./deposit-1o-Gh-mE.js";
import { t as DepositNotice } from "./deposit-notice-g5-2ASn-.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Banknote, CheckCircle2, Clock, History, Loader2, Pencil, Save, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
//#region src/routes/_authenticated/reseller/payouts.tsx?tsr-split=component
var emptyProfile = {
	payout_method: null,
	payout_account_name: null,
	payout_account_number: null,
	payout_bank_name: null,
	payout_branch: null,
	payout_routing: null
};
function PayoutsPage() {
	const { user } = useAuth();
	const [rid, setRid] = useState(null);
	const [profile, setProfile] = useState(emptyProfile);
	const [sum, setSum] = useState({
		delivered_profit: 0,
		pending_payout: 0,
		paid_out: 0,
		available: 0,
		deposit_balance: 0,
		frozen_amount: 0
	});
	const [ledger, setLedger] = useState([]);
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [amount, setAmount] = useState("");
	const [busy, setBusy] = useState(false);
	const [editing, setEditing] = useState(false);
	const [tab, setTab] = useState("payout");
	const { status: deposit } = useDepositStatus(rid);
	const { texts: depositTexts } = useDepositSettings();
	useEffect(() => {
		if (user) load();
	}, [user]);
	async function load() {
		setLoading(true);
		const { data: r } = await supabase.from("resellers").select("id,payout_method,payout_account_name,payout_account_number,payout_bank_name,payout_branch,payout_routing").eq("user_id", user.id).maybeSingle();
		if (!r) return setLoading(false);
		setRid(r.id);
		setProfile({
			payout_method: r.payout_method ?? null,
			payout_account_name: r.payout_account_name,
			payout_account_number: r.payout_account_number,
			payout_bank_name: r.payout_bank_name,
			payout_branch: r.payout_branch,
			payout_routing: r.payout_routing
		});
		if (!r.payout_method) setEditing(true);
		const { data: s } = await supabase.rpc("reseller_profit_summary", { _reseller_id: r.id });
		const row = Array.isArray(s) ? s[0] : s;
		if (row) setSum({
			delivered_profit: Number(row.delivered_profit),
			pending_payout: Number(row.pending_payout),
			paid_out: Number(row.paid_out),
			available: Number(row.available),
			deposit_balance: Number(row.deposit_balance ?? 0),
			frozen_amount: Number(row.frozen_amount ?? 0)
		});
		const { data: p } = await supabase.from("payouts").select("*").eq("reseller_id", r.id).order("created_at", { ascending: false });
		setRows(p ?? []);
		const { data: lg } = await supabase.rpc("reseller_ledger", {
			_reseller_id: r.id,
			_limit: 200
		});
		setLedger((lg ?? []).map((x) => ({
			...x,
			amount: Number(x.amount),
			running: Number(x.running)
		})));
		setLoading(false);
	}
	async function saveProfile() {
		if (!rid) return;
		if (!profile.payout_method) return toast.error("Select a method");
		if (!profile.payout_account_number) return toast.error("Enter account/mobile number");
		setBusy(true);
		const isBank = profile.payout_method === "bank";
		const { error } = await supabase.from("resellers").update({
			payout_method: profile.payout_method,
			payout_account_name: profile.payout_account_name,
			payout_account_number: profile.payout_account_number,
			payout_bank_name: isBank ? profile.payout_bank_name : null,
			payout_branch: isBank ? profile.payout_branch : null,
			payout_routing: isBank ? profile.payout_routing : null
		}).eq("id", rid);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Payout information saved");
		setEditing(false);
		load();
	}
	const blockReason = !profile.payout_method ? "Save your payout information first." : deposit.blocked ? "Withdrawal is not allowed while a security deposit is due." : sum.available <= 0 ? sum.delivered_profit <= 0 ? "No delivered orders yet — profit will appear here once orders are delivered." : "No withdrawable balance (previous requests / frozen amount deducted)." : null;
	async function request(e) {
		e.preventDefault();
		if (!rid) return;
		if (blockReason) return toast.error(blockReason);
		const amt = Number(amount);
		if (!amt || amt <= 0) return toast.error("Enter a valid amount");
		if (amt > sum.available) return toast.error(`Maximum withdrawable amount is ৳${sum.available.toLocaleString()}`);
		setBusy(true);
		const enumMethod = profile.payout_method === "bank" ? "other" : profile.payout_method;
		const ref = profile.payout_method === "bank" ? `${profile.payout_bank_name ?? ""} · ${profile.payout_account_number} · ${profile.payout_account_name ?? ""}` : `${profile.payout_account_number} · ${profile.payout_account_name ?? ""}`;
		const { error } = await supabase.from("payouts").insert({
			reseller_id: rid,
			amount: amt,
			method: enumMethod,
			reference: ref,
			status: "pending"
		});
		setBusy(false);
		if (error) return toast.error(error.message);
		setAmount("");
		toast.success("Payout request submitted");
		load();
	}
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid place-items-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const showDepositTab = deposit.required || deposit.frozenAmount > 0 || deposit.rows.length > 0;
	const tabs = [
		...showDepositTab ? [{
			key: "deposit",
			label: "Security deposit",
			icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" })
		}] : [],
		{
			key: "payout",
			label: "Payout",
			icon: /* @__PURE__ */ jsx(Banknote, { className: "h-3.5 w-3.5" })
		},
		{
			key: "timeline",
			label: "Timeline",
			icon: /* @__PURE__ */ jsx(History, { className: "h-3.5 w-3.5" })
		}
	];
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: "Payouts",
			description: "Profit from delivered orders accumulates here. Request a withdrawal to your saved account."
		}),
		/* @__PURE__ */ jsx(DepositNotice, { status: deposit }),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-6",
			children: [
				/* @__PURE__ */ jsx(StatCard, {
					label: "Delivered profit",
					value: `৳${sum.delivered_profit.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Deposit balance",
					value: `৳${sum.deposit_balance.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Frozen",
					value: `৳${sum.frozen_amount.toLocaleString()}`,
					hint: "Not withdrawable",
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Available",
					value: `৳${sum.available.toLocaleString()}`,
					hint: "Ready to request",
					icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Pending",
					value: `৳${sum.pending_payout.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsx(StatCard, {
					label: "Paid out",
					value: `৳${sum.paid_out.toLocaleString()}`,
					icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mb-4 flex gap-2 overflow-x-auto pb-1",
			children: tabs.map((t) => /* @__PURE__ */ jsxs("button", {
				onClick: () => setTab(t.key),
				className: "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " + (tab === t.key ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted"),
				children: [
					t.icon,
					" ",
					t.label
				]
			}, t.key))
		}),
		tab === "deposit" && showDepositTab && /* @__PURE__ */ jsxs("div", {
			className: "surface-card p-4 sm:p-5",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-3 text-sm font-semibold",
					children: depositTexts.sectionTitle
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ jsx(MiniStat, {
							label: "Paid",
							value: deposit.balance
						}),
						/* @__PURE__ */ jsx(MiniStat, {
							label: "Due",
							value: deposit.due,
							tone: deposit.due > 0 ? "bad" : "good"
						}),
						/* @__PURE__ */ jsx(MiniStat, {
							label: "Required",
							value: deposit.requiredAmount
						}),
						/* @__PURE__ */ jsx(MiniStat, {
							label: "Frozen",
							value: deposit.frozenAmount
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-4",
					children: /* @__PURE__ */ jsx(DepositPayPanel, {
						resellerId: rid,
						due: deposit.due,
						onSubmitted: load
					})
				}),
				deposit.rows.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground",
					children: "No deposit records yet."
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-2 sm:hidden",
					children: deposit.rows.map((r) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border p-3 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-semibold tabular-nums",
									children: ["৳", Number(r.amount).toLocaleString()]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: formatDate(r.created_at)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-1 capitalize text-muted-foreground",
								children: [
									r.method ?? "—",
									" · ",
									r.reference ?? "—"
								]
							}),
							r.note && /* @__PURE__ */ jsx("div", {
								className: "mt-1 text-muted-foreground",
								children: r.note
							})
						]
					}, r.id))
				}),
				deposit.rows.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "hidden overflow-hidden rounded-md border sm:block",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-muted/40 text-left uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-2",
									children: "Date"
								}),
								/* @__PURE__ */ jsx("th", { children: "Amount" }),
								/* @__PURE__ */ jsx("th", { children: "Method" }),
								/* @__PURE__ */ jsx("th", { children: "Reference" }),
								/* @__PURE__ */ jsx("th", { children: "Note" })
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: deposit.rows.map((r) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "p-2",
									children: formatDate(r.created_at)
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "font-medium",
									children: ["৳", Number(r.amount).toLocaleString()]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "capitalize",
									children: r.method ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "text-muted-foreground",
									children: r.reference ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "text-muted-foreground",
									children: r.note ?? "—"
								})
							]
						}, r.id)) })]
					})
				})
			]
		}),
		tab === "payout" && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("p", {
				className: "mb-4 rounded-lg border bg-muted/30 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground",
				children: [
					"Calculation: delivered profit (৳",
					sum.delivered_profit.toLocaleString(),
					") + deposit (৳",
					sum.deposit_balance.toLocaleString(),
					") − requested/paid (৳",
					(sum.pending_payout + sum.paid_out).toLocaleString(),
					") − frozen (৳",
					sum.frozen_amount.toLocaleString(),
					") = ",
					/* @__PURE__ */ jsxs("span", {
						className: "font-bold text-foreground",
						children: ["৳", sum.available.toLocaleString()]
					}),
					" withdrawable. Deposit above the frozen amount is also withdrawable."
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card mb-6 p-4 sm:p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-sm font-semibold",
						children: "Payout information"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Admin will send your profit to this account."
					})] }), !editing && /* @__PURE__ */ jsxs("button", {
						onClick: () => setEditing(true),
						className: "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted",
						children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }), " Edit"]
					})]
				}), !editing ? profile.payout_method ? /* @__PURE__ */ jsxs("div", {
					className: "grid gap-2 text-sm sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(Info$1, {
							label: "Method",
							value: /* @__PURE__ */ jsx("span", {
								className: "capitalize",
								children: profile.payout_method
							})
						}),
						/* @__PURE__ */ jsx(Info$1, {
							label: "Account name",
							value: profile.payout_account_name || "—"
						}),
						/* @__PURE__ */ jsx(Info$1, {
							label: profile.payout_method === "bank" ? "Account number" : "Mobile number",
							value: profile.payout_account_number || "—"
						}),
						profile.payout_method === "bank" && /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Info$1, {
								label: "Bank",
								value: profile.payout_bank_name || "—"
							}),
							/* @__PURE__ */ jsx(Info$1, {
								label: "Branch",
								value: profile.payout_branch || "—"
							}),
							/* @__PURE__ */ jsx(Info$1, {
								label: "Routing",
								value: profile.payout_routing || "—"
							})
						] })
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "text-sm text-muted-foreground",
					children: "No payout information saved yet."
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Method"
							}), /* @__PURE__ */ jsxs("select", {
								value: profile.payout_method ?? "bkash",
								onChange: (e) => setProfile({
									...profile,
									payout_method: e.target.value
								}),
								className: inp,
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "bkash",
										children: "bKash"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "nagad",
										children: "Nagad"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "rocket",
										children: "Rocket"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "bank",
										children: "Bank"
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Account holder name"
							}), /* @__PURE__ */ jsx("input", {
								value: profile.payout_account_name ?? "",
								onChange: (e) => setProfile({
									...profile,
									payout_account_name: e.target.value
								}),
								className: inp
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium",
								children: profile.payout_method === "bank" ? "Account number" : "Mobile number"
							}), /* @__PURE__ */ jsx("input", {
								value: profile.payout_account_number ?? "",
								onChange: (e) => setProfile({
									...profile,
									payout_account_number: e.target.value
								}),
								className: inp
							})] }),
							profile.payout_method === "bank" && /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Bank name"
								}), /* @__PURE__ */ jsx("input", {
									value: profile.payout_bank_name ?? "",
									onChange: (e) => setProfile({
										...profile,
										payout_bank_name: e.target.value
									}),
									className: inp
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Branch"
								}), /* @__PURE__ */ jsx("input", {
									value: profile.payout_branch ?? "",
									onChange: (e) => setProfile({
										...profile,
										payout_branch: e.target.value
									}),
									className: inp
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-medium",
									children: "Routing number"
								}), /* @__PURE__ */ jsx("input", {
									value: profile.payout_routing ?? "",
									onChange: (e) => setProfile({
										...profile,
										payout_routing: e.target.value
									}),
									className: inp
								})] })
							] })
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2",
						children: [profile.payout_method && /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setEditing(false);
								load();
							},
							className: "rounded-md border px-3 py-1.5 text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: saveProfile,
							disabled: busy,
							className: "btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium disabled:opacity-50",
							children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), " Save"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: request,
				className: "surface-card mb-6 grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_auto]",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-medium",
						children: "Amount (৳)"
					}),
					/* @__PURE__ */ jsx("input", {
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						type: "number",
						min: 1,
						max: sum.available > 0 ? sum.available : void 0,
						className: inp,
						required: true
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Maximum withdrawable ",
							/* @__PURE__ */ jsxs("span", {
								className: "font-semibold text-foreground",
								children: ["৳", sum.available.toLocaleString()]
							}),
							sum.pending_payout > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [" · in request ৳", sum.pending_payout.toLocaleString()] })
						]
					}),
					deposit.frozenAmount > 0 && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-amber-600 dark:text-amber-400",
						children: fillText(depositTexts.payoutFrozenHint, { frozen: deposit.frozenAmount })
					}),
					blockReason ? /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs font-medium text-destructive",
						children: blockReason
					}) : /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Payout ",
							/* @__PURE__ */ jsx("span", {
								className: "capitalize font-medium",
								children: profile.payout_method
							}),
							" · ",
							profile.payout_account_number
						]
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "flex items-end",
					children: /* @__PURE__ */ jsx("button", {
						disabled: busy,
						className: "btn-brand w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50",
						children: busy ? "Sending…" : "Request payout"
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-2 md:hidden",
				children: rows.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "surface-card p-8 text-center text-sm text-muted-foreground",
					children: "No payouts yet."
				}) : rows.map((p) => /* @__PURE__ */ jsxs("div", {
					className: "surface-card p-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "font-semibold tabular-nums",
							children: ["৳", Number(p.amount).toLocaleString()]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-[11px] capitalize text-muted-foreground",
							children: [
								p.method,
								" · ",
								formatDate(p.created_at)
							]
						})] }), /* @__PURE__ */ jsx("span", {
							className: "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status),
							children: p.status
						})]
					}), p.notes && /* @__PURE__ */ jsxs("p", {
						className: "mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-medium text-foreground",
								children: "Admin note:"
							}),
							" ",
							p.notes
						]
					})]
				}, p.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card hidden overflow-x-auto md:block",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/40 text-left text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Date"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Amount"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Method"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "p-3",
								children: "Admin note"
							})
						] })
					}), /* @__PURE__ */ jsxs("tbody", { children: [rows.map((p) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: formatDate(p.created_at)
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "p-3 font-medium tabular-nums",
								children: ["৳", Number(p.amount).toLocaleString()]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 capitalize",
								children: p.method
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3",
								children: /* @__PURE__ */ jsx("span", {
									className: "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status),
									children: p.status
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "p-3 text-xs text-muted-foreground",
								children: p.notes || p.reference || "—"
							})
						]
					}, p.id)), rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						className: "p-8 text-center text-muted-foreground",
						children: "No payouts yet."
					}) })] })]
				})
			})
		] }),
		tab === "timeline" && /* @__PURE__ */ jsx(ReportCard, {
			title: "Money timeline (Ledger)",
			hint: "How money comes in (deposit + delivered profit) and how it goes out (withdrawals).",
			children: /* @__PURE__ */ jsx("div", {
				className: "p-4",
				children: /* @__PURE__ */ jsx(LedgerTimeline, {
					ledger,
					frozen: sum.frozen_amount,
					available: sum.available
				})
			})
		})
	] });
}
function Info$1({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border bg-muted/30 px-3 py-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "text-sm",
			children: value
		})]
	});
}
function statusStyle(s) {
	return s === "paid" ? "bg-success/20 text-success" : s === "approved" ? "bg-primary/15 text-primary" : s === "rejected" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning-foreground";
}
var inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
function MiniStat({ label, value, tone }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border bg-muted/30 p-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-sm font-bold " + (tone === "bad" ? "text-destructive" : tone === "good" ? "text-success" : ""),
			children: ["৳", Number(value ?? 0).toLocaleString()]
		})]
	});
}
//#endregion
export { PayoutsPage as component };
