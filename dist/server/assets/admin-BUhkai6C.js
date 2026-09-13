import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { a as Area, d as Tooltip, f as Legend, i as XAxis, l as Cell, m as require_react, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart, u as ResponsiveContainer } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { In as Clock, M as ShoppingCart, _r as Award, a as Wallet, et as Plus, g as TrendingUp } from "./vendor-icons-BEaCFqaT.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { i as buildFinanceReport, p as orderProfit, r as bdt, s as isRealizedStatus } from "./finance-report-Dwy2dA23.js";
import { n as useAuth } from "./use-auth-zbqaYCVZ.js";
import { a as resolveRange, n as DateRangeBar, t as DEFAULT_DATE_RANGE } from "./date-range-filter-CPGJUhYb.js";
import { n as getAdminDashboard, r as getAdminLookups, t as clearBootstrapCache } from "./bootstrap-C_eam0yT.js";
import { t as NewOrderModal } from "./NewOrderModal-Bm_jUMzY.js";
//#region src/routes/_authenticated/admin/index.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function AdminDashboard() {
	const { user } = useAuth();
	const welcomeName = user?.user_metadata?.full_name ?? user?.name ?? "Admin";
	const [range, setRange] = (0, import_react.useState)(DEFAULT_DATE_RANGE);
	const [orderOpen, setOrderOpen] = (0, import_react.useState)(false);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const modalDataLoaded = (0, import_react.useRef)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [counts, setCounts] = (0, import_react.useState)({
		products: 0,
		resellers: 0,
		pendingResellers: 0,
		brands: 0
	});
	const [rows, setRows] = (0, import_react.useState)([]);
	const [catalog, setCatalog] = (0, import_react.useState)({
		products: 0,
		active: 0,
		inactive: 0,
		featured: 0,
		low: 0,
		out: 0,
		categories: 0,
		activeCategories: 0,
		activeBrands: 0
	});
	const [orderReport, setOrderReport] = (0, import_react.useState)(() => buildFinanceReport([], []));
	const [resellerReport, setResellerReport] = (0, import_react.useState)({
		total: 0,
		active: 0,
		pending: 0,
		suspended: 0,
		rejected: 0,
		withStore: 0,
		depositBalance: 0,
		frozen: 0,
		withdrawable: 0
	});
	const [lifetime, setLifetime] = (0, import_react.useState)({
		orders: 0,
		revenue: 0,
		profit: 0,
		saCost: 0,
		deliveredOrders: 0,
		payoutPaid: 0,
		payoutDue: 0
	});
	const load = (0, import_react.useCallback)(async (r) => {
		setLoading(true);
		const { fromTs, toTs } = resolveRange(r);
		const data = await getAdminDashboard(fromTs, toTs, true);
		setRows(data?.range_orders ?? []);
		const all = data?.all_orders ?? [];
		const d = all.filter((o) => ["delivered", "partial"].includes(String(o.status ?? "")));
		setOrderReport(buildFinanceReport(all, []));
		const cat = data?.catalog ?? {};
		setCatalog({
			products: Number(cat.products ?? 0),
			active: Number(cat.active ?? 0),
			inactive: Number(cat.inactive ?? 0),
			featured: Number(cat.featured ?? 0),
			low: Number(cat.low ?? 0),
			out: Number(cat.out ?? 0),
			categories: Number(cat.categories ?? 0),
			activeCategories: Number(cat.activeCategories ?? 0),
			activeBrands: Number(cat.activeBrands ?? 0)
		});
		const rs = data?.resellers ?? {};
		setCounts({
			products: Number(cat.products ?? 0),
			resellers: Number(rs.active ?? 0),
			pendingResellers: Number(rs.pending ?? 0),
			brands: Number(cat.brands ?? 0)
		});
		const m = data?.metrics;
		setResellerReport({
			total: Number(rs.total ?? 0),
			active: Number(rs.active ?? 0),
			pending: Number(rs.pending ?? 0),
			suspended: Number(rs.suspended ?? 0),
			rejected: Number(rs.rejected ?? 0),
			withStore: Number(m?.withStore ?? 0),
			depositBalance: Number(m?.depositBalance ?? 0),
			frozen: Number(m?.frozen ?? 0),
			withdrawable: Number(m?.withdrawable ?? 0)
		});
		setLifetime({
			orders: all.length,
			deliveredOrders: d.length,
			revenue: d.reduce((s, o) => s + Number(o.total), 0),
			profit: d.reduce((s, o) => s + orderProfit(o), 0),
			saCost: d.reduce((s, o) => s + Number(o.sa_cost_total), 0),
			payoutPaid: Number(data?.payouts?.paid ?? 0),
			payoutDue: Number(data?.payouts?.due ?? 0)
		});
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!orderOpen || modalDataLoaded.current) return;
		modalDataLoaded.current = true;
		(async () => {
			const data = await getAdminLookups();
			setResellers(data?.resellers ?? []);
			setAllProducts(data?.products ?? []);
		})();
	}, [orderOpen]);
	(0, import_react.useEffect)(() => {
		load(range);
	}, [load, range]);
	const { stats, daily, top } = (0, import_react.useMemo)(() => {
		const dayMap = /* @__PURE__ */ new Map();
		const bySeller = /* @__PURE__ */ new Map();
		let orders = 0;
		let revenue = 0;
		let profit = 0;
		let saCost = 0;
		let deliveredOrders = 0;
		for (const o of rows) {
			orders += 1;
			const key = o.created_at.slice(0, 10);
			const d = dayMap.get(key) ?? {
				day: key.slice(5),
				orders: 0,
				revenue: 0,
				profit: 0
			};
			d.orders += 1;
			d.revenue += Number(o.total);
			d.profit += orderProfit(o);
			dayMap.set(key, d);
			if (isRealizedStatus(o.status)) {
				deliveredOrders += 1;
				revenue += Number(o.total);
				profit += orderProfit(o);
				saCost += Number(o.sa_cost_total);
			}
			const name = o.resellers?.business_name ?? "—";
			bySeller.set(name, (bySeller.get(name) ?? 0) + Number(o.total));
		}
		return {
			stats: {
				orders,
				revenue,
				profit,
				saCost,
				deliveredOrders
			},
			daily: Array.from(dayMap.entries()).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([, v]) => v),
			top: Array.from(bySeller.entries()).map(([name, sales]) => ({
				name,
				sales
			})).sort((a, b) => b.sales - a.sales).slice(0, 6)
		};
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Welcome, ${welcomeName}`,
			description: "Monitor platform performance, resellers, and financial health.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateRangeBar, {
					value: range,
					onChange: setRange,
					compact: true,
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOrderOpen(true),
						className: "btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-elegant transition-all hover:opacity-90 active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add order"]
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Revenue",
						tone: "primary",
						to: "/admin/orders",
						search: { tab: "delivered" },
						value: bdt(lifetime.revenue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						hint: "Total from delivered orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Platform Earnings",
						tone: "emerald",
						to: "/admin/business-report",
						value: bdt(lifetime.saCost),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
						hint: "Admin share after payouts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Reseller Profits",
						tone: "violet",
						to: "/admin/commissions",
						value: bdt(lifetime.profit),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }),
						hint: "Total minus delivery, product & packaging cost"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Payouts",
						tone: "amber",
						to: "/admin/payouts",
						value: bdt(lifetime.payoutDue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
						hint: "Funds requested by resellers"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
				children: "Order status (lifetime)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: ORDER_TABS.map((t) => {
					const b = orderReport.byStatusTab[t.key];
					const bucket = t.key === "all" ? orderReport.all : b;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
						to: "/admin/orders",
						search: { tab: t.key },
						label: t.label,
						value: bucket?.orders ?? 0,
						hint: bdt(bucket?.customerTotal ?? 0),
						tone: t.key === "delivered" ? "emerald" : t.key === "returned" || t.key === "cancelled" ? "rose" : t.key === "pending_return" ? "amber" : t.key === "forwarded" ? "sky" : void 0
					}, t.key);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
					children: "Reseller report"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "all" },
							label: "Total resellers",
							value: resellerReport.total
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "active" },
							label: "Active",
							value: resellerReport.active,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "pending" },
							label: "Applicants",
							value: resellerReport.pending,
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "suspended" },
							label: "Deactivated",
							value: resellerReport.suspended,
							tone: "rose"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "rejected" },
							label: "Rejected",
							value: resellerReport.rejected,
							tone: "rose"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/resellers",
							search: { status: "active" },
							label: "Selling resellers",
							value: resellerReport.withStore,
							hint: "With at least 1 order",
							tone: "violet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/advanced",
							label: "Deposit balance",
							value: bdt(resellerReport.depositBalance)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/advanced",
							label: "Frozen",
							value: bdt(resellerReport.frozen),
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/payouts",
							label: "Withdrawable",
							value: bdt(resellerReport.withdrawable),
							tone: "emerald"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
					children: "Product report"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							label: "Total",
							value: catalog.products
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							search: { status: "active" },
							label: "Active",
							value: catalog.active,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							search: { status: "hidden" },
							label: "Inactive",
							value: catalog.inactive,
							tone: "rose"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							search: { status: "featured" },
							label: "Featured",
							value: catalog.featured,
							tone: "violet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							search: { stock: "low" },
							label: "Low stock (≤5)",
							value: catalog.low,
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/products",
							search: { stock: "out" },
							label: "Out of stock",
							value: catalog.out,
							tone: "rose"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/categories",
							label: "Categories",
							value: catalog.categories
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/categories",
							label: "Active categories",
							value: catalog.activeCategories,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/brands",
							label: "Brands",
							value: counts.brands
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							to: "/admin/brands",
							label: "Active brands",
							value: catalog.activeBrands,
							tone: "emerald"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Orders",
					value: stats.orders,
					tone: "sky",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }),
					hint: "Range er sob order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Revenue (delivered)",
					tone: "primary",
					value: bdt(stats.revenue),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Reseller profit",
					value: bdt(stats.profit),
					tone: "violet",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }),
					hint: "Delivered order theke reseller profit"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Admin earning (delivered)",
					tone: "emerald",
					value: bdt(stats.saCost),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card group p-6 hover:border-primary/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex items-center justify-between border-b pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold uppercase tracking-wider text-muted-foreground/80",
						children: "Activity & Revenue"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: daily,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "gradRevenue",
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
									dataKey: "revenue",
									stroke: "#6366f1",
									strokeWidth: 2.5,
									fill: "url(#gradRevenue)",
									name: "Revenue ৳"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "profit",
									stroke: "#22c55e",
									strokeWidth: 2.5,
									fill: "url(#gradProfit)",
									name: "Reseller profit ৳"
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: top,
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
									children: top.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: BAR_COLORS[i % BAR_COLORS.length] }, i))
								})
							]
						})
					})
				})]
			})]
		}),
		orderOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewOrderModal, {
			listings: [],
			allProducts,
			resellers,
			isAdmin: true,
			onClose: () => setOrderOpen(false),
			onCreated: () => {
				setOrderOpen(false);
				clearBootstrapCache("adash:");
				load(range);
			}
		})
	] });
}
var TONES = {
	emerald: "border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
	rose: "border-rose-500/25 bg-rose-500/5 text-rose-600 dark:text-rose-400",
	amber: "border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400",
	violet: "border-violet-500/25 bg-violet-500/5 text-violet-600 dark:text-violet-400",
	sky: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300"
};
/** Small clickable report tile — always links to the page (with filter) it reports on. */
function MiniCard({ to, search, label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		search,
		className: `surface-card px-3 py-2.5 text-center transition hover:-translate-y-0.5 hover:border-primary/50 ${tone ? TONES[tone] : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `text-lg font-black leading-tight break-words sm:text-2xl ${tone ? "" : "text-primary"}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[10px] font-bold uppercase leading-tight tracking-widest text-muted-foreground/70",
				children: label
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[11px] font-semibold text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
