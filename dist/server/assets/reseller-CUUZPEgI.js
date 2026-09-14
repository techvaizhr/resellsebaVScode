import { r as supabase } from "./client-Be051lUg.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-D-uo76H8.js";
import { i as buildFinanceReport, r as bdt } from "./finance-report-Dwy2dA23.js";
import { n as useAuth } from "./use-auth-DJu3SP6g.js";
import { a as resolveRange, n as DateRangeBar, t as DEFAULT_DATE_RANGE } from "./date-range-filter-d2q19m6O.js";
import { a as StatusReportTable, n as ReportCard, o as TrendReportTable, t as ProductReportTable } from "./report-blocks-CRm2raRg.js";
import { a as getResellerDashboard, t as clearBootstrapCache } from "./bootstrap-DBQz0zB2.js";
import { i as fetchDepositMethods, r as cfgString } from "./payment-methods-riM5eEMo.js";
import { t as PaymentLogo } from "./payment-brand-ChxX82bm.js";
import { t as NewOrderModal } from "./NewOrderModal-BgYUG1_b.js";
import { n as useLiveNotices, r as AdminNoticePopup } from "./admin-notices-iwAJZsYa.js";
import { t as useDepositStatus } from "./deposit-1o-Gh-mE.js";
import { t as DepositNotice } from "./deposit-notice-g5-2ASn-.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, Award, CheckCircle2, ChevronDown, ClipboardList, Clock, Copy, Info, Landmark, Loader2, Package, Plus, ShoppingBag, TrendingUp, Truck, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/components/admin-payment-numbers-card.tsx
/**
* Compact reseller-dashboard card showing the admin's global bKash / Nagad /
* Rocket numbers (Personal, Agent, Payment) so a reseller can quickly share
* one with a customer for an advance / delivery-charge collection, without
* using their own personal number.
*
* Source of truth: the same `payment_configs` rows (reseller_id = null,
* mode = "manual", is_active = true) that admin manages under
* Admin → Payments → Manual, and that already power checkout + security
* deposit. Nothing new to configure — set it once there.
*
* Renders nothing when no active method exists, so it never eats space on a
* store that hasn't set this up yet. Collapsed by default; expands to a
* small chip grid so it never crowds the rest of the dashboard.
*/
function AdminPaymentNumbersCard() {
	const [methods, setMethods] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		let alive = true;
		fetchDepositMethods().then((list) => {
			if (!alive) return;
			setMethods(list);
			setLoading(false);
		});
		return () => {
			alive = false;
		};
	}, []);
	if (loading || methods.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-6 overflow-hidden rounded-xl border bg-muted/30",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
			"aria-expanded": open,
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ jsx(Landmark, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ jsxs("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block text-xs font-semibold",
						children: "Payment numbers (advance / delivery charge)"
					}), /* @__PURE__ */ jsx("span", {
						className: "block truncate text-[10px] text-muted-foreground",
						children: open ? "Tap a number to copy it" : `${methods.length} active — tap to view`
					})]
				})]
			}), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ jsx("div", {
			className: "grid gap-2 border-t p-3 sm:grid-cols-2 lg:grid-cols-3",
			children: methods.map((m) => {
				const account = cfgString(m.config, "account");
				const accountType = cfgString(m.config, "account_type");
				return /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1.5 rounded-lg border bg-background p-2.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md border bg-background p-0.5",
								children: /* @__PURE__ */ jsx(PaymentLogo, {
									method: m.method,
									size: 18
								})
							}), /* @__PURE__ */ jsxs("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block truncate text-xs font-semibold",
									children: m.label
								}), accountType && /* @__PURE__ */ jsx("span", {
									className: "block text-[10px] uppercase tracking-wide text-muted-foreground",
									children: accountType
								})]
							})]
						}),
						account && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								navigator.clipboard.writeText(account);
								toast.success("Number copied");
							},
							className: "flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted",
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate text-xs font-medium tabular-nums",
								children: account
							}), /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3 shrink-0 text-muted-foreground" })]
						}),
						m.instructions && /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-1 text-[10px] leading-snug text-muted-foreground",
							children: [/* @__PURE__ */ jsx(Info, { className: "mt-0.5 h-2.5 w-2.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
								className: "line-clamp-2",
								children: m.instructions
							})]
						})
					]
				}, m.id);
			})
		})]
	});
}
//#endregion
//#region src/routes/_authenticated/reseller/index.tsx?tsr-split=component
var BAR_COLORS = [
	"#6366f1",
	"#22c55e",
	"#f59e0b",
	"#ec4899",
	"#06b6d4",
	"#a855f7",
	"#f97316",
	"#14b8a6"
];
function ResellerDashboard() {
	const { user } = useAuth();
	const [range, setRange] = useState(DEFAULT_DATE_RANGE);
	const [loading, setLoading] = useState(true);
	const [rid, setRid] = useState(null);
	const [bizName, setBizName] = useState(null);
	const [listings, setListings] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [orderOpen, setOrderOpen] = useState(false);
	const [listingsReport, setListingsReport] = useState({
		total: 0,
		active: 0
	});
	const [orders, setOrders] = useState([]);
	const [items, setItems] = useState([]);
	const [payouts, setPayouts] = useState([]);
	const [commissions, setCommissions] = useState([]);
	const [lifetime, setLifetime] = useState({
		delivered: 0,
		pendingPayout: 0,
		paidOut: 0,
		available: 0
	});
	const [toCourierCount, setToCourierCount] = useState(0);
	const [topResellers, setTopResellers] = useState([]);
	const { status: deposit } = useDepositStatus(rid);
	const { notices: adminNotices, dismiss: dismissNotice } = useLiveNotices(user?.id, rid);
	const uid = user?.id;
	const load = useCallback(async (r) => {
		if (!uid) return;
		setLoading(true);
		const { fromTs, toTs } = resolveRange(r);
		const data = await getResellerDashboard(uid, fromTs, toTs, true);
		if (!data?.reseller) {
			setLoading(false);
			return;
		}
		setRid(data.reseller.id);
		setBizName(data.reseller.business_name);
		setOrders(data.orders ?? []);
		setItems(data.items ?? []);
		setListingsReport({
			total: data.listings_total ?? 0,
			active: data.listings_active ?? 0
		});
		setPayouts(data.payouts ?? []);
		setCommissions(data.commissions ?? []);
		setListings(data.listings ?? []);
		setAllProducts(data.products ?? []);
		setTopResellers(data.top_resellers ?? []);
		const s = data.summary;
		setLifetime({
			delivered: Number(s?.delivered_profit ?? 0),
			pendingPayout: Number(s?.pending_payout ?? 0),
			paidOut: Number(s?.paid_out ?? 0),
			available: Number(s?.available ?? 0)
		});
		const { count } = await supabase.from("orders").select("id", {
			count: "exact",
			head: true
		}).eq("reseller_id", data.reseller.id).in("status", ["shipped", "processing"]);
		setToCourierCount(count ?? 0);
		setLoading(false);
	}, [uid]);
	useEffect(() => {
		load(range);
	}, [load, range]);
	const report = useMemo(() => buildFinanceReport(orders, items, { trend: "day" }), [orders, items]);
	const inR = useCallback((created) => {
		const { fromTs, toTs } = resolveRange(range);
		const ts = new Date(created).getTime();
		if (fromTs != null && ts < fromTs) return false;
		if (toTs != null && ts > toTs) return false;
		return true;
	}, [range]);
	const paidInRange = useMemo(() => payouts.filter((p) => p.status === "paid" && inR(p.created_at)).reduce((s, p) => s + Number(p.amount), 0), [payouts, inR]);
	useMemo(() => payouts.filter((p) => ["pending", "approved"].includes(p.status) && inR(p.created_at)).reduce((s, p) => s + Number(p.amount), 0), [payouts, inR]);
	const commissionInRange = useMemo(() => commissions.filter((c) => inR(c.created_at)).reduce((s, c) => s + Number(c.amount), 0), [commissions, inR]);
	const commissionLifetime = useMemo(() => commissions.reduce((s, c) => s + Number(c.amount), 0), [commissions]);
	const chart = useMemo(() => report.trend.slice(0, 60).map((t) => ({
		day: t.key.slice(5),
		orders: t.orders,
		profit: Math.round(t.deliveredProfit)
	})).reverse(), [report.trend]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(PageHeader, {
			title: `Welcome, ${bizName ?? user?.user_metadata?.full_name ?? user?.name ?? "Reseller"}`,
			description: "Track your earnings, orders, and business growth.",
			actions: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ jsxs("button", {
					onClick: () => setOrderOpen(true),
					className: "btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add order"]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/reseller/catalog",
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }), " Catalog"]
				})]
			})
		}),
		/* @__PURE__ */ jsx(DepositNotice, {
			status: deposit,
			place: "dashboard"
		}),
		/* @__PURE__ */ jsx(AdminPaymentNumbersCard, {}),
		/* @__PURE__ */ jsx(AdminNoticePopup, {
			notices: adminNotices,
			onDismiss: dismissNotice
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mb-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total Profit",
						to: "/reseller/transactions",
						tone: "primary",
						value: bdt(lifetime.delivered + commissionLifetime),
						icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
						hint: "Total − delivery − product − packaging"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Available Balance",
						to: "/reseller/payouts",
						tone: "emerald",
						value: bdt(lifetime.available),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
						hint: "Ready for payout"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total Paid",
						to: "/reseller/payouts",
						tone: "sky",
						value: bdt(lifetime.paidOut),
						icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
						hint: "Sent to your account"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Outstanding",
						to: "/reseller/transactions",
						tone: "amber",
						value: bdt(Math.max(lifetime.delivered + commissionLifetime - lifetime.paidOut, 0)),
						icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
						hint: "Unpaid profit"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Live Products",
						to: "/reseller/listings",
						tone: "violet",
						value: listingsReport.active,
						icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4" }),
						hint: "Active listings"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "To Courier",
						to: "/reseller/orders",
						search: { tab: "courier" },
						tone: "sky",
						value: toCourierCount,
						icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" }),
						hint: "Orders with courier"
					})
				]
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mb-4 flex justify-end",
			children: /* @__PURE__ */ jsx(DateRangeBar, {
				value: range,
				onChange: setRange,
				compact: true
			})
		}),
		loading && !orders.length ? /* @__PURE__ */ jsx("div", {
			className: "grid place-items-center py-16",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Orders",
						to: "/reseller/orders",
						search: { tab: "all" },
						tone: "sky",
						value: report.all.orders,
						icon: /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Earned profit",
						to: "/reseller/orders",
						search: { tab: "delivered" },
						tone: "emerald",
						value: bdt(report.realized.profit),
						icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Pending profit",
						to: "/reseller/orders",
						search: { tab: "confirmed" },
						tone: "amber",
						value: bdt(report.pipeline.profit),
						icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Paid out (range)",
						to: "/reseller/payouts",
						tone: "primary",
						value: bdt(paidInRange),
						icon: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "On the way (courier)",
						to: "/reseller/orders",
						search: { tab: "courier" },
						tone: "sky",
						value: bdt(report.byStatusTab.courier?.customerTotal ?? 0),
						icon: /* @__PURE__ */ jsx(Truck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Return risk",
						to: "/reseller/orders",
						search: { tab: "pending_return" },
						tone: "amber",
						value: bdt(report.risk.profit),
						icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Lost (return + cancel)",
						to: "/reseller/orders",
						search: { tab: "returned" },
						tone: "rose",
						value: bdt(report.lost.profit),
						icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Delivery rate",
						to: "/reseller/orders",
						search: { tab: "delivered" },
						tone: "emerald",
						value: `${report.deliveryRate.toFixed(1)}%`,
						icon: /* @__PURE__ */ jsx(Award, { className: "h-4 w-4" })
					})
				]
			}),
			commissionLifetime > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: /* @__PURE__ */ jsx(StatCard, {
					label: "Team commission (range)",
					to: "/reseller/commissions",
					tone: "violet",
					value: bdt(commissionInRange),
					icon: /* @__PURE__ */ jsx(Award, { className: "h-4 w-4" })
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "surface-card group p-6 hover:border-primary/50",
					children: [/* @__PURE__ */ jsx("div", {
						className: "mb-4 flex items-center justify-between border-b pb-2",
						children: /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
							children: "Profit & Order Insights"
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "h-72",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(AreaChart, {
								data: chart,
								children: [
									/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
										id: "gradOrders",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: "#6366f1",
											stopOpacity: .5
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: "#6366f1",
											stopOpacity: .02
										})]
									}), /* @__PURE__ */ jsxs("linearGradient", {
										id: "gradProfit",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ jsx("stop", {
											offset: "0%",
											stopColor: "#22c55e",
											stopOpacity: .5
										}), /* @__PURE__ */ jsx("stop", {
											offset: "100%",
											stopColor: "#22c55e",
											stopOpacity: .02
										})]
									})] }),
									/* @__PURE__ */ jsx(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "hsl(var(--border))"
									}),
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "day",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))"
									} }),
									/* @__PURE__ */ jsx(Legend, {}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "orders",
										stroke: "#6366f1",
										strokeWidth: 2.5,
										fill: "url(#gradOrders)",
										name: "Orders"
									}),
									/* @__PURE__ */ jsx(Area, {
										type: "monotone",
										dataKey: "profit",
										stroke: "#22c55e",
										strokeWidth: 2.5,
										fill: "url(#gradProfit)",
										name: "Profit ৳"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "surface-card group p-6 hover:border-primary/50",
					children: [/* @__PURE__ */ jsx("div", {
						className: "mb-4 flex items-center justify-between border-b pb-2",
						children: /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
							children: "Top Reseller Performance"
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "h-72",
						children: topResellers.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(BarChart, {
								data: topResellers,
								layout: "vertical",
								margin: { left: 20 },
								children: [
									/* @__PURE__ */ jsx(XAxis, {
										type: "number",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ jsx(YAxis, {
										type: "category",
										dataKey: "name",
										tick: { fontSize: 11 },
										width: 100
									}),
									/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))"
									} }),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "sales",
										radius: [
											0,
											6,
											6,
											0
										],
										children: topResellers.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: BAR_COLORS[i % BAR_COLORS.length] }, i))
									})
								]
							})
						}) : /* @__PURE__ */ jsx("div", {
							className: "grid h-full place-items-center text-sm text-muted-foreground",
							children: "No reseller data for this range."
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ jsx(ReportCard, {
						title: "Status wise money",
						children: /* @__PURE__ */ jsx(StatusReportTable, {
							report,
							showAdminCost: true
						})
					}),
					/* @__PURE__ */ jsx(ReportCard, {
						title: "Top products",
						right: /* @__PURE__ */ jsxs(Link, {
							to: "/reseller/listings",
							className: "inline-flex items-center gap-1.5 text-xs text-primary",
							children: [/* @__PURE__ */ jsx(Package, { className: "h-3.5 w-3.5" }), " Manage listings"]
						}),
						children: /* @__PURE__ */ jsx(ProductReportTable, {
							products: report.products,
							limit: 10,
							showCost: true
						})
					}),
					/* @__PURE__ */ jsx(ReportCard, {
						title: "Day wise trend",
						children: /* @__PURE__ */ jsx(TrendReportTable, {
							trend: report.trend,
							limit: 31
						})
					})
				]
			}),
			!rid && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Reseller profile pawa jaini."
			})
		] }),
		orderOpen && rid && /* @__PURE__ */ jsx(NewOrderModal, {
			listings,
			allProducts,
			resellerId: rid,
			onClose: () => setOrderOpen(false),
			onCreated: () => {
				setOrderOpen(false);
				clearBootstrapCache("rdash:");
				load(range);
			}
		})
	] });
}
//#endregion
export { ResellerDashboard as component };
