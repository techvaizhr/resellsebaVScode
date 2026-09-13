import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { a as Area, d as Tooltip, f as Legend, i as XAxis, l as Cell, m as require_react, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart, u as ResponsiveContainer } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-BZQd8T2B.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { Ln as Clock, N as ShoppingBag, Nt as LoaderCircle, Rn as ClipboardList, Wt as Landmark, a as Wallet, er as ChevronDown, g as TrendingUp, h as TriangleAlert, jn as Copy, m as Truck, mt as Package, qn as CircleCheck, qt as Info, tt as Plus, vr as Award } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { i as buildFinanceReport, r as bdt } from "./finance-report-Dwy2dA23.js";
import { n as useAuth } from "./use-auth-YXxreIiP.js";
import { a as resolveRange, n as DateRangeBar, t as DEFAULT_DATE_RANGE } from "./date-range-filter-BjhwFpTl.js";
import { a as StatusReportTable, n as ReportCard, o as TrendReportTable, t as ProductReportTable } from "./report-blocks-D0S7vpGP.js";
import { a as getResellerDashboard, t as clearBootstrapCache } from "./bootstrap-ANnhliKL.js";
import { i as fetchDepositMethods, r as cfgString } from "./payment-methods-DogjUk3P.js";
import { t as PaymentLogo } from "./payment-brand-DOxAYgjm.js";
import { t as NewOrderModal } from "./NewOrderModal-iQ0QzH7V.js";
import { n as useLiveNotices, r as AdminNoticePopup } from "./admin-notices-Bsgx1IkG.js";
import { t as useDepositStatus } from "./deposit-TQubUckw.js";
import { t as DepositNotice } from "./deposit-notice-DLAofv29.js";
//#region src/components/admin-payment-numbers-card.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
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
	const [methods, setMethods] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 overflow-hidden rounded-xl border bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-semibold",
						children: "Payment numbers (advance / delivery charge)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-[10px] text-muted-foreground",
						children: open ? "Tap a number to copy it" : `${methods.length} active — tap to view`
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2 border-t p-3 sm:grid-cols-2 lg:grid-cols-3",
			children: methods.map((m) => {
				const account = cfgString(m.config, "account");
				const accountType = cfgString(m.config, "account_type");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5 rounded-lg border bg-background p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md border bg-background p-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentLogo, {
									method: m.method,
									size: 18
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs font-semibold",
									children: m.label
								}), accountType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[10px] uppercase tracking-wide text-muted-foreground",
									children: accountType
								})]
							})]
						}),
						account && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								navigator.clipboard.writeText(account);
								toast.success("Number copied");
							},
							className: "flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-2 py-1.5 text-left hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs font-medium tabular-nums",
								children: account
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 shrink-0 text-muted-foreground" })]
						}),
						m.instructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-1 text-[10px] leading-snug text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 h-2.5 w-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
	const [range, setRange] = (0, import_react.useState)(DEFAULT_DATE_RANGE);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [rid, setRid] = (0, import_react.useState)(null);
	const [bizName, setBizName] = (0, import_react.useState)(null);
	const [listings, setListings] = (0, import_react.useState)([]);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [orderOpen, setOrderOpen] = (0, import_react.useState)(false);
	const [listingsReport, setListingsReport] = (0, import_react.useState)({
		total: 0,
		active: 0
	});
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	const [payouts, setPayouts] = (0, import_react.useState)([]);
	const [commissions, setCommissions] = (0, import_react.useState)([]);
	const [lifetime, setLifetime] = (0, import_react.useState)({
		delivered: 0,
		pendingPayout: 0,
		paidOut: 0,
		available: 0
	});
	const [toCourierCount, setToCourierCount] = (0, import_react.useState)(0);
	const [topResellers, setTopResellers] = (0, import_react.useState)([]);
	const { status: deposit } = useDepositStatus(rid);
	const { notices: adminNotices, dismiss: dismissNotice } = useLiveNotices(user?.id, rid);
	const uid = user?.id;
	const load = (0, import_react.useCallback)(async (r) => {
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
	(0, import_react.useEffect)(() => {
		load(range);
	}, [load, range]);
	const report = (0, import_react.useMemo)(() => buildFinanceReport(orders, items, { trend: "day" }), [orders, items]);
	const inR = (0, import_react.useCallback)((created) => {
		const { fromTs, toTs } = resolveRange(range);
		const ts = new Date(created).getTime();
		if (fromTs != null && ts < fromTs) return false;
		if (toTs != null && ts > toTs) return false;
		return true;
	}, [range]);
	const paidInRange = (0, import_react.useMemo)(() => payouts.filter((p) => p.status === "paid" && inR(p.created_at)).reduce((s, p) => s + Number(p.amount), 0), [payouts, inR]);
	(0, import_react.useMemo)(() => payouts.filter((p) => ["pending", "approved"].includes(p.status) && inR(p.created_at)).reduce((s, p) => s + Number(p.amount), 0), [payouts, inR]);
	const commissionInRange = (0, import_react.useMemo)(() => commissions.filter((c) => inR(c.created_at)).reduce((s, c) => s + Number(c.amount), 0), [commissions, inR]);
	const commissionLifetime = (0, import_react.useMemo)(() => commissions.reduce((s, c) => s + Number(c.amount), 0), [commissions]);
	const chart = (0, import_react.useMemo)(() => report.trend.slice(0, 60).map((t) => ({
		day: t.key.slice(5),
		orders: t.orders,
		profit: Math.round(t.deliveredProfit)
	})).reverse(), [report.trend]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Welcome, ${bizName ?? user?.user_metadata?.full_name ?? user?.name ?? "Reseller"}`,
			description: "Track your earnings, orders, and business growth.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOrderOpen(true),
					className: "btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add order"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/reseller/catalog",
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), " Catalog"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepositNotice, {
			status: deposit,
			place: "dashboard"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPaymentNumbersCard, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNoticePopup, {
			notices: adminNotices,
			onDismiss: dismissNotice
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Profit",
						to: "/reseller/transactions",
						tone: "primary",
						value: bdt(lifetime.delivered + commissionLifetime),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						hint: "Total − delivery − product − packaging"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Available Balance",
						to: "/reseller/payouts",
						tone: "emerald",
						value: bdt(lifetime.available),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						hint: "Ready for payout"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Paid",
						to: "/reseller/payouts",
						tone: "sky",
						value: bdt(lifetime.paidOut),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
						hint: "Sent to your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Outstanding",
						to: "/reseller/transactions",
						tone: "amber",
						value: bdt(Math.max(lifetime.delivered + commissionLifetime - lifetime.paidOut, 0)),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
						hint: "Unpaid profit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Live Products",
						to: "/reseller/listings",
						tone: "violet",
						value: listingsReport.active,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
						hint: "Active listings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "To Courier",
						to: "/reseller/orders",
						search: { tab: "courier" },
						tone: "sky",
						value: toCourierCount,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }),
						hint: "Orders with courier"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeBar, {
				value: range,
				onChange: setRange,
				compact: true
			})
		}),
		loading && !orders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid place-items-center py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Orders",
						to: "/reseller/orders",
						search: { tab: "all" },
						tone: "sky",
						value: report.all.orders,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Earned profit",
						to: "/reseller/orders",
						search: { tab: "delivered" },
						tone: "emerald",
						value: bdt(report.realized.profit),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending profit",
						to: "/reseller/orders",
						search: { tab: "confirmed" },
						tone: "amber",
						value: bdt(report.pipeline.profit),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Paid out (range)",
						to: "/reseller/payouts",
						tone: "primary",
						value: bdt(paidInRange),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "On the way (courier)",
						to: "/reseller/orders",
						search: { tab: "courier" },
						tone: "sky",
						value: bdt(report.byStatusTab.courier?.customerTotal ?? 0),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Return risk",
						to: "/reseller/orders",
						search: { tab: "pending_return" },
						tone: "amber",
						value: bdt(report.risk.profit),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Lost (return + cancel)",
						to: "/reseller/orders",
						search: { tab: "returned" },
						tone: "rose",
						value: bdt(report.lost.profit),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Delivery rate",
						to: "/reseller/orders",
						search: { tab: "delivered" },
						tone: "emerald",
						value: `${report.deliveryRate.toFixed(1)}%`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" })
					})
				]
			}),
			commissionLifetime > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Team commission (range)",
					to: "/reseller/commissions",
					tone: "violet",
					value: bdt(commissionInRange),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card group p-6 hover:border-primary/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-center justify-between border-b pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
							children: "Profit & Order Insights"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: chart,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gradOrders",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#6366f1",
											stopOpacity: .5
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#6366f1",
											stopOpacity: .02
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gradProfit",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#22c55e",
											stopOpacity: .5
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#22c55e",
											stopOpacity: .02
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "hsl(var(--border))"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "orders",
										stroke: "#6366f1",
										strokeWidth: 2.5,
										fill: "url(#gradOrders)",
										name: "Orders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card group p-6 hover:border-primary/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-center justify-between border-b pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
							children: "Top Reseller Performance"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: topResellers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: topResellers,
								layout: "vertical",
								margin: { left: 20 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										tick: { fontSize: 11 },
										width: 100
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										radius: [
											0,
											6,
											6,
											0
										],
										children: topResellers.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: BAR_COLORS[i % BAR_COLORS.length] }, i))
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-full place-items-center text-sm text-muted-foreground",
							children: "No reseller data for this range."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Status wise money",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusReportTable, {
							report,
							showAdminCost: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Top products",
						right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/reseller/listings",
							className: "inline-flex items-center gap-1.5 text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), " Manage listings"]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductReportTable, {
							products: report.products,
							limit: 10,
							showCost: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						title: "Day wise trend",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendReportTable, {
							trend: report.trend,
							limit: 31
						})
					})
				]
			}),
			!rid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Reseller profile pawa jaini."
			})
		] }),
		orderOpen && rid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOrderModal, {
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
