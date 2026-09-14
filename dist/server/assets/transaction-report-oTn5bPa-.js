import { r as supabase } from "./client-Be051lUg.js";
import { l as orderStatusLabel, u as orderStatusTone } from "./courier-status-BxiQVHJB.js";
import { r as StatCard } from "./ui-kit-D-uo76H8.js";
import { _ as toCsv, a as downloadCsv, r as bdt, t as PROFIT_FORMULA_HINT } from "./finance-report-Dwy2dA23.js";
import { t as SearchableSelect } from "./searchable-select-CJDs5oIk.js";
import { r as DATE_PRESET_OPTIONS } from "./order-filters-C0seZ87w.js";
import { a as resolveRange, i as rangeLabel } from "./date-range-filter-d2q19m6O.js";
import { r as Pagination } from "./data-list-Cd6RJIu_.js";
import { t as ResellerAvatar } from "./reseller-avatar-DqxOrq_B.js";
import { t as CopyOrderNumber } from "./CopyOrderNumber-CeUzA8ah.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Download, Loader2, Search, TrendingUp, Wallet, X } from "lucide-react";
//#region src/components/transaction-report.tsx
/**
* Transaction report — single money report for admin and reseller.
* Replaces the old money timeline / earning report: every order settlement,
* security deposit and withdraw request in one running-balance table.
*/
/** Date on top, update time below. */
function DateCell({ at }) {
	const d = new Date(at);
	return /* @__PURE__ */ jsxs("div", {
		className: "whitespace-nowrap leading-tight",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[11px] font-semibold",
			children: d.toLocaleDateString()
		}), /* @__PURE__ */ jsx("div", {
			className: "text-[10px] font-medium tabular-nums text-muted-foreground",
			children: d.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			})
		})]
	});
}
/** Two stacked labelled money values (Buy/Sell, Admin/Reseller). */
function StackCell({ top, bottom }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "whitespace-nowrap text-right leading-tight tabular-nums",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "text-[11px]",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "text-muted-foreground",
				children: [top[0], "-"]
			}), /* @__PURE__ */ jsx("span", {
				className: "font-semibold",
				children: bdt(Number(top[1]))
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "text-[11px]",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "text-muted-foreground",
				children: [bottom[0], "-"]
			}), /* @__PURE__ */ jsx("span", {
				className: "font-semibold",
				children: bdt(Number(bottom[1]))
			})]
		})]
	});
}
var PARTIAL_STATUSES = [
	"partial",
	"partial_full",
	"partial_item",
	"partial_delivery",
	"damaged"
];
/** Product came back — product cost is not charged. */
var NO_PRODUCT_COST_STATUSES = [
	"returned",
	"pending_return",
	"cancelled",
	"partial_delivery"
];
/** At-a-glance partial settlement summary: collected vs order value. */
function PartialSummary({ r }) {
	const total = Number(r.sell_total) || 0;
	const received = Number(r.received) || 0;
	const advance = Number(r.advance) || 0;
	const collected = Number(r.collected ?? received - advance) || 0;
	const gap = Math.max(total - received, 0);
	const pct = total > 0 ? Math.min(100, Math.round(received / total * 100)) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-1 max-w-[240px] rounded-lg border border-amber-500/30 bg-amber-500/5 px-2 py-1.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-[10px] font-semibold",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-amber-600",
					children: ["Collected ", bdt(received)]
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-muted-foreground",
					children: ["of ", bdt(total)]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-1 h-1.5 overflow-hidden rounded-full bg-amber-500/15",
				children: /* @__PURE__ */ jsx("div", {
					className: "h-full rounded-full bg-amber-500",
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-1 flex items-center justify-between text-[10px]",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "font-semibold text-amber-600",
					children: [pct, "% received"]
				}), gap > 0 && /* @__PURE__ */ jsxs("span", {
					className: "text-destructive",
					children: ["short ", bdt(gap)]
				})]
			}),
			advance > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mt-1 border-t border-amber-500/20 pt-1 text-[9px] text-muted-foreground",
				children: [
					"cou ",
					bdt(collected),
					" + adv ",
					bdt(advance),
					" (",
					r.advance_by ?? "reseller",
					")"
				]
			})
		]
	});
}
/**
* Running balance: every in adds, every out subtracts, so Balance is always the
* simple sum of the Amount column above it. When a single reseller is selected the
* balance runs per reseller; with "All resellers" it is one combined balance.
*/
function withRunningBalance(rows, perReseller) {
	const asc = [...rows].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
	const run = /* @__PURE__ */ new Map();
	const balances = /* @__PURE__ */ new Map();
	for (const r of asc) {
		const key = perReseller ? r.reseller_id ?? "-" : "all";
		let bal = run.get(key) ?? 0;
		const amount = Number(r.amount) || 0;
		if (r.direction === "in") bal += amount;
		else if (r.direction === "out") bal -= amount;
		run.set(key, bal);
		balances.set(r, bal);
	}
	return rows.map((r) => ({
		...r,
		running: balances.get(r) ?? (Number(r.running) || 0)
	}));
}
var KIND_OPTIONS = [
	{
		value: "",
		label: "All transactions"
	},
	{
		value: "profit",
		label: "Order profit"
	},
	{
		value: "loss",
		label: "Order loss"
	},
	{
		value: "deposit",
		label: "Security deposit"
	},
	{
		value: "withdraw",
		label: "Withdraw"
	}
];
function TransactionReport({ resellerId, initialReseller, admin = false }) {
	const [range, setRange] = useState({
		preset: "lifetime",
		from: "",
		to: ""
	});
	const [reseller, setReseller] = useState(resellerId ?? initialReseller ?? "");
	const [kind, setKind] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const [rows, setRows] = useState([]);
	const [resellers, setResellers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const avatarById = useMemo(() => new Map(resellers.map((r) => [r.id, r.avatar_url])), [resellers]);
	useEffect(() => {
		if (!admin) return;
		supabase.from("resellers").select("id,business_name,code,avatar_url").order("business_name").then(({ data }) => setResellers(data ?? []));
	}, [admin]);
	useEffect(() => {
		if (!admin && !resellerId) return;
		const { fromTs, toTs } = resolveRange(range);
		setLoading(true);
		setError(null);
		supabase.rpc("transaction_report", {
			_reseller_id: (admin ? reseller : resellerId) || null,
			_from: fromTs != null ? new Date(fromTs).toISOString() : null,
			_to: toTs != null ? new Date(toTs).toISOString() : null,
			_limit: 1e3
		}).then(({ data, error }) => {
			if (error) setError(error.message);
			setRows(withRunningBalance(data ?? [], Boolean((admin ? reseller : resellerId) || "")));
			setLoading(false);
		});
	}, [
		admin,
		reseller,
		resellerId,
		range
	]);
	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return rows.filter((r) => {
			if (kind && r.kind !== kind) return false;
			if (!q) return true;
			return [
				r.reseller_name,
				r.reseller_code,
				r.order_number,
				r.note,
				r.label,
				r.status
			].filter(Boolean).join(" ").toLowerCase().includes(q);
		});
	}, [
		rows,
		kind,
		search
	]);
	const paged = useMemo(() => {
		if (perPage === "all") return filtered;
		const start = (page - 1) * perPage;
		return filtered.slice(start, start + perPage);
	}, [
		filtered,
		page,
		perPage
	]);
	useEffect(() => {
		setPage(1);
	}, [
		kind,
		reseller,
		range,
		search,
		perPage
	]);
	const totals = useMemo(() => {
		let inflow = 0, outflow = 0, deposit = 0, withdraw = 0, profit = 0, loss = 0;
		for (const r of filtered) {
			if (r.kind === "deposit") deposit += Number(r.amount);
			if (r.direction === "in") inflow += Number(r.amount);
			if (r.direction === "out") outflow += Number(r.amount);
			if (r.kind === "withdraw" && r.direction === "out") withdraw += Number(r.amount);
			if (r.kind === "profit") profit += Number(r.amount);
			if (r.kind === "loss") loss += Number(r.amount);
		}
		return {
			inflow,
			outflow,
			deposit,
			withdraw,
			profit,
			loss,
			balance: inflow - outflow
		};
	}, [filtered]);
	const exportCsv = () => {
		const csv = toCsv([
			"Date",
			"Type",
			"Reseller",
			"Order",
			"Status",
			"Note",
			"Sell subtotal",
			"Sell delivery",
			"Sell total",
			"Collected by courier",
			"Received (incl. advance)",
			"Buy product",
			"Buy delivery",
			"Packaging",
			"Buy total",
			"Advance",
			"Advance by",
			"Amount",
			"Direction",
			"Running balance"
		], filtered.map((r) => [
			new Date(r.at).toLocaleString(),
			r.kind,
			`${r.reseller_name} (${r.reseller_code})`,
			r.order_number ?? "",
			r.status,
			r.note ?? "",
			r.sell_subtotal,
			r.sell_delivery,
			r.sell_total,
			r.collected ?? 0,
			r.received,
			r.buy_product,
			r.buy_delivery,
			r.packaging,
			r.buy_total,
			r.advance ?? 0,
			r.advance_by ?? "",
			r.amount,
			r.direction,
			r.running
		]));
		downloadCsv(`transaction-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, csv);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-bold tracking-tight sm:text-2xl",
					children: "Transaction report"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-muted-foreground sm:text-xs",
					children: admin ? "All reseller money movements in one ledger." : "Your profit, loss, deposit and withdraw ledger."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: exportCsv,
					className: "inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-md border px-3 text-xs font-semibold hover:bg-accent sm:self-auto",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), " CSV"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card p-3 sm:p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end gap-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex w-full min-w-[240px] flex-col gap-1 sm:w-[30%]",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Search"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex h-9 items-center rounded-md border bg-background px-2 focus-within:ring-2 focus-within:ring-ring",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
									/* @__PURE__ */ jsx("input", {
										value: search,
										onChange: (e) => setSearch(e.target.value),
										placeholder: "Order, reseller, note…",
										className: "h-full w-full bg-transparent text-sm outline-none"
									}),
									search && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setSearch(""),
										className: "ml-1 rounded p-0.5 text-muted-foreground hover:bg-accent",
										children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
									})
								]
							})]
						}),
						admin && /* @__PURE__ */ jsx(SearchableSelect, {
							label: "Reseller",
							placeholder: "All resellers",
							value: reseller,
							onChange: setReseller,
							options: [{
								value: "",
								label: "All resellers"
							}, ...resellers.map((r) => ({
								value: r.id,
								label: `${r.business_name} · ${r.code}`
							}))],
							className: "min-w-[150px] flex-1"
						}),
						/* @__PURE__ */ jsx(SearchableSelect, {
							label: "Type",
							value: kind,
							onChange: setKind,
							options: KIND_OPTIONS,
							className: "min-w-[130px] flex-1"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-[150px] flex-1 flex-col gap-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Date"
							}), /* @__PURE__ */ jsx("select", {
								value: range.preset,
								onChange: (e) => {
									const p = e.target.value;
									setRange(p === "custom" ? {
										...range,
										preset: "custom"
									} : {
										preset: p,
										from: "",
										to: ""
									});
								},
								className: "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring",
								children: DATE_PRESET_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", {
									value: o.value,
									children: o.value === range.preset ? `${o.label} · ${rangeLabel(range)}` : o.label
								}, o.value))
							})]
						}),
						range.preset === "custom" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex min-w-[130px] flex-1 flex-col gap-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "From"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: range.from,
								max: range.to || void 0,
								onChange: (e) => setRange({
									...range,
									from: e.target.value
								}),
								className: "h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex min-w-[130px] flex-1 flex-col gap-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "To"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: range.to,
								min: range.from || void 0,
								onChange: (e) => setRange({
									...range,
									to: e.target.value
								}),
								className: "h-9 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
							})]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex w-20 shrink-0 flex-col gap-1",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-muted-foreground",
								children: "Per page"
							}), /* @__PURE__ */ jsxs("select", {
								value: String(perPage),
								onChange: (e) => {
									const v = e.target.value;
									setPerPage(v === "all" ? "all" : Number(v));
									setPage(1);
								},
								className: "h-9 rounded-md border bg-background px-1.5 text-xs outline-none focus:ring-2 focus:ring-ring",
								children: [[
									20,
									50,
									100,
									200,
									500,
									1e3
								].map((n) => /* @__PURE__ */ jsx("option", {
									value: n,
									children: n
								}, n)), /* @__PURE__ */ jsx("option", {
									value: "all",
									children: "All"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total in",
						value: bdt(totals.inflow),
						icon: /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total out",
						value: bdt(totals.outflow),
						icon: /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Balance",
						value: bdt(totals.balance),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Order profit / loss",
						value: `${bdt(totals.profit)} / ${bdt(totals.loss)}`,
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Security deposit",
						value: bdt(totals.deposit),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Withdrawn",
						value: bdt(totals.withdraw),
						icon: /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Transactions",
						value: String(filtered.length),
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Loss orders",
						value: String(filtered.filter((r) => r.kind === "loss").length),
						icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "rounded-lg border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground",
				children: PROFIT_FORMULA_HINT
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card overflow-hidden",
				children: [loading ? /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center py-16",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" })
				}) : error ? /* @__PURE__ */ jsx("div", {
					className: "p-6 text-center text-xs text-destructive",
					children: error
				}) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-xs text-muted-foreground",
					children: "No transaction in this range."
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[1120px] text-xs",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-left",
									children: "Type"
								}),
								admin && /* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-left",
									children: "Reseller"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-left",
									children: "Date / update time"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-left",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-left",
									children: "Meta / note"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Order value"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Received (incl. advance)"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Subtotal"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Delivery"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Packaging"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Advance"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Amount"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2 text-right",
									children: "Balance"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y",
							children: paged.map((r, i) => {
								const inflow = r.direction === "in";
								const voided = r.direction === "void";
								const isPartial = !!r.order_id && PARTIAL_STATUSES.includes(r.status);
								return /* @__PURE__ */ jsxs("tr", {
									className: "align-top hover:bg-muted/20",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ jsx("span", {
												className: "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " + (r.kind === "deposit" ? "bg-primary/10 text-primary" : r.kind === "withdraw" ? "bg-amber-500/15 text-amber-600" : inflow ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"),
												children: r.kind
											})
										}),
										admin && /* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(ResellerAvatar, {
													url: r.reseller_id ? avatarById.get(r.reseller_id) ?? null : null,
													name: r.reseller_name,
													size: 24
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("div", {
														className: "max-w-[150px] truncate text-[11px] font-semibold",
														children: r.reseller_name
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[10px] text-muted-foreground",
														children: r.reseller_code
													})]
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ jsx(DateCell, { at: r.at })
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ jsx("span", {
												className: `rounded-full px-2 py-0.5 text-[10px] capitalize ${orderStatusTone(r.status)}`,
												children: orderStatusLabel(r.status)
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "max-w-[280px] px-3 py-2",
											children: [
												r.order_id ? /* @__PURE__ */ jsxs("div", {
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ jsxs(Link, {
														to: admin ? "/admin/orders" : "/reseller/orders",
														search: {
															q: r.order_number ?? "",
															tab: "all"
														},
														className: "font-semibold text-primary hover:underline",
														children: ["#", r.order_number ?? "—"]
													}), /* @__PURE__ */ jsx(CopyOrderNumber, {
														orderNumber: r.order_number ?? "",
														showText: false
													})]
												}) : /* @__PURE__ */ jsx("span", {
													className: "font-semibold",
													children: r.label
												}),
												/* @__PURE__ */ jsx("div", {
													className: "mt-0.5 break-words text-[11px] text-muted-foreground",
													children: r.note || r.label
												}),
												isPartial && /* @__PURE__ */ jsx(PartialSummary, { r })
											]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right tabular-nums",
											children: r.order_id ? /* @__PURE__ */ jsxs("div", {
												className: "whitespace-nowrap leading-tight",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[11px] font-bold",
													children: bdt(Number(r.sell_total))
												}), /* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-muted-foreground",
													children: "customer total"
												})]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right tabular-nums",
											children: r.order_id ? /* @__PURE__ */ jsxs("div", {
												className: "whitespace-nowrap leading-tight",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[11px] font-bold",
													children: bdt(Number(r.received))
												}), Number(r.advance) > 0 && /* @__PURE__ */ jsxs("div", {
													className: "text-[9px] text-muted-foreground",
													children: [
														"cou ",
														bdt(Number(r.collected ?? 0)),
														" + adv ",
														bdt(Number(r.advance))
													]
												})]
											}) : "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right",
											children: r.order_id ? /* @__PURE__ */ jsx(StackCell, {
												top: ["Buy", NO_PRODUCT_COST_STATUSES.includes(r.status) ? 0 : Number(r.buy_product)],
												bottom: ["Sell", Number(r.sell_subtotal)]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right",
											children: r.order_id ? /* @__PURE__ */ jsx(StackCell, {
												top: ["Admin", Number(r.buy_delivery)],
												bottom: ["Reseller", Number(r.sell_delivery)]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right tabular-nums",
											children: r.order_id ? bdt(Number(r.packaging)) : "—"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right",
											children: r.order_id && Number(r.advance) > 0 ? /* @__PURE__ */ jsxs("div", {
												className: "whitespace-nowrap leading-tight",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[11px] font-semibold tabular-nums",
													children: bdt(Number(r.advance))
												}), /* @__PURE__ */ jsx("div", {
													className: "mt-0.5 text-[10px] capitalize text-muted-foreground",
													children: (r.advance_by ?? "reseller") === "admin" ? "by admin" : "by reseller"
												})]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "px-3 py-2 text-right font-bold tabular-nums " + (voided ? "text-muted-foreground line-through" : inflow ? "text-success" : "text-destructive"),
											children: [inflow ? "+" : "−", bdt(Number(r.amount))]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 text-right font-semibold tabular-nums",
											children: bdt(Number(r.running))
										})
									]
								}, `${r.at}-${i}`);
							})
						})]
					})
				}), !loading && !error && filtered.length > 0 && perPage !== "all" && /* @__PURE__ */ jsx("div", {
					className: "border-t px-3 py-2",
					children: /* @__PURE__ */ jsx(Pagination, {
						page,
						perPage,
						total: filtered.length,
						onPage: setPage
					})
				})]
			})
		]
	});
}
//#endregion
export { TransactionReport as t };
