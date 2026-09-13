import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { a as Area, d as Tooltip, f as Legend, i as XAxis, m as require_react, o as CartesianGrid, r as YAxis, t as AreaChart, u as ResponsiveContainer } from "./vendor-charts-kQ5QBPqu.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-D4WgG89C.js";
import { n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { D as Sparkles, Dn as Download, H as Send, Kn as CircleDot, Nt as LoaderCircle, Z as Receipt, a as Wallet, c as Users, g as TrendingUp, gr as Ban, gt as PackageCheck, h as TriangleAlert, ht as PackageSearch, m as Truck, mt as Package, ot as Percent, p as Undo2, ur as Boxes, vn as Factory, xr as ArrowRight, y as Target, zn as ClipboardCheck } from "./vendor-icons-DF2A5Z8S.js";
import { n as PageHeader, r as StatCard } from "./ui-kit-QFWJ0cl0.js";
import { _ as toCsv, a as downloadCsv, r as bdt } from "./finance-report-Dwy2dA23.js";
import { r as agentCommission } from "./agents-Ccr1OgrO.js";
import { a as OrderFilterBar, i as DEFAULT_ORDER_FILTERS, l as resolveDateRange, s as applyOrderFilters } from "./order-filters-CRizD8DF.js";
import { i as usePaginated, r as Pagination } from "./data-list-D-TkvXUz.js";
import { i as SortTh, n as ReportCard, r as ReportTabs, s as toneOf } from "./report-blocks-D0S7vpGP.js";
import { t as ResellerAvatar } from "./reseller-avatar-C6dusfCe.js";
import { S as withKeptCost, a as buildCourierRows, b as shipmentCostMap, c as buildPotential, d as buildSupplierRows, f as finalAdminReceived, g as isMoneyFinal, h as groupItems, i as adminDeliverySpend, l as buildProductRows, m as finalReceived, o as buildDailyTrend, p as finalProfit, r as SCOPE_OPTIONS, s as buildPnL, u as buildResellerRows, v as orderBuyingCost, x as sortRows, y as scopeOrders } from "./business-report-DlB3Zbm8.js";
//#region src/routes/_authenticated/admin/business-report.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "overview",
		label: "Overview",
		hint: "Trend, money flow and top performers at a glance"
	},
	{
		key: "products",
		label: "Most selling products"
	},
	{
		key: "resellers",
		label: "Reseller report"
	},
	{
		key: "suppliers",
		label: "Supplier report",
		hint: "Cost owed to each supplier for the kept items"
	},
	{
		key: "couriers",
		label: "Courier report"
	},
	{
		key: "agents",
		label: "Agent report"
	},
	{
		key: "pnl",
		label: "Profit & loss"
	}
];
function BusinessReportPage() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [shipments, setShipments] = (0, import_react.useState)([]);
	const [resellers, setResellers] = (0, import_react.useState)([]);
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [suppliers, setSuppliers] = (0, import_react.useState)([]);
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_ORDER_FILTERS);
	const [scope, setScope] = (0, import_react.useState)("completed");
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [page, setPage] = (0, import_react.useState)(1);
	const [prodSort, setProdSort] = (0, import_react.useState)({
		key: "saleQty",
		dir: "desc"
	});
	const [resSort, setResSort] = (0, import_react.useState)({
		key: "orders",
		dir: "desc"
	});
	const [supSort, setSupSort] = (0, import_react.useState)({
		key: "buyCost",
		dir: "desc"
	});
	const [couSort, setCouSort] = (0, import_react.useState)({
		key: "parcels",
		dir: "desc"
	});
	const [agtSort, setAgtSort] = (0, import_react.useState)({
		key: "sales",
		dir: "desc"
	});
	(0, import_react.useEffect)(() => {
		(async () => {
			setLoading(true);
			const [o, it, p, s, r, a, e, sup] = await Promise.all([
				supabase.from("orders").select("id,order_number,reseller_id,status,created_at,customer_name,customer_phone,address_line,subtotal,shipping_cost,total,sa_cost_total,reseller_profit,received_amount,packaging_total,delivery_cost,advance_amount,advance_by,resellers(business_name,code)").order("created_at", { ascending: false }),
				supabase.from("order_items").select("order_id,product_id,product_name,quantity,returned_qty,sa_price,line_total,profit,buying_price,packaging_cost,supplier_id"),
				supabase.from("products").select("id,name,product_code,buying_price,packaging_cost,og_image_url,supplier_id"),
				supabase.from("shipments").select("order_id,provider,cost"),
				supabase.from("resellers").select("id,business_name,code,agent_id,avatar_url"),
				supabase.from("agents").select("id,display_name,sale_target,commission_rate,is_active"),
				supabase.from("expenses").select("*"),
				supabase.from("suppliers").select("id,display_name,code")
			]);
			setOrders(o.data ?? []);
			setItems(it.data ?? []);
			setProducts(p.data ?? []);
			setShipments(s.data ?? []);
			setResellers(r.data ?? []);
			setAgents(a.data ?? []);
			setExpenses(e.data ?? []);
			setSuppliers(sup.data ?? []);
			setLoading(false);
		})();
	}, []);
	(0, import_react.useEffect)(() => setPage(1), [
		tab,
		filters,
		scope
	]);
	const productMap = (0, import_react.useMemo)(() => new Map(products.map((p) => [p.id, p])), [products]);
	const supplierMap = (0, import_react.useMemo)(() => new Map(suppliers.map((s) => [s.id, s])), [suppliers]);
	const filtered = (0, import_react.useMemo)(() => applyOrderFilters(orders, filters), [orders, filters]);
	const scoped = (0, import_react.useMemo)(() => scopeOrders(filtered, scope), [filtered, scope]);
	const scopedIds = (0, import_react.useMemo)(() => new Set(scoped.map((o) => o.id)), [scoped]);
	const scopedItems = (0, import_react.useMemo)(() => items.filter((i) => scopedIds.has(i.order_id)), [items, scopedIds]);
	const filteredIds = (0, import_react.useMemo)(() => new Set(filtered.map((o) => o.id)), [filtered]);
	const filteredItems = (0, import_react.useMemo)(() => items.filter((i) => filteredIds.has(i.order_id)), [items, filteredIds]);
	const potential = (0, import_react.useMemo)(() => buildPotential(filtered, filteredItems, productMap), [
		filtered,
		filteredItems,
		productMap
	]);
	const statusBreakdown = (0, import_react.useMemo)(() => {
		return ORDER_TABS.filter((t) => t.key !== "all").map((t) => {
			const rows = filtered.filter((o) => t.statuses.includes(o.status));
			return {
				key: t.key,
				label: t.label,
				count: rows.length,
				value: rows.reduce((s, o) => s + Number(o.total ?? 0), 0)
			};
		});
	}, [filtered]);
	const scopeCount = (0, import_react.useMemo)(() => {
		const c = {};
		for (const s of SCOPE_OPTIONS) c[s.value] = scopeOrders(filtered, s.value).length;
		return c;
	}, [filtered]);
	const scopedExpenses = (0, import_react.useMemo)(() => {
		const { fromTs, toTs } = resolveDateRange(filters);
		return expenses.filter((e) => {
			const ts = (/* @__PURE__ */ new Date(`${e.spent_on}T12:00:00`)).getTime();
			if (fromTs != null && ts < fromTs) return false;
			if (toTs != null && ts > toTs) return false;
			return true;
		});
	}, [expenses, filters]);
	const productRows = (0, import_react.useMemo)(() => sortRows(buildProductRows(scoped, scopedItems, productMap), prodSort.key, prodSort.dir), [
		scoped,
		scopedItems,
		productMap,
		prodSort
	]);
	const resellerRows = (0, import_react.useMemo)(() => sortRows(buildResellerRows(scoped, scopedItems, productMap, shipments), resSort.key, resSort.dir), [
		scoped,
		scopedItems,
		productMap,
		shipments,
		resSort
	]);
	const courierRows = (0, import_react.useMemo)(() => sortRows(buildCourierRows(scoped, scopedItems, productMap, shipments), couSort.key, couSort.dir), [
		scoped,
		scopedItems,
		productMap,
		shipments,
		couSort
	]);
	const supplierRows = (0, import_react.useMemo)(() => sortRows(buildSupplierRows(scoped, scopedItems, productMap, supplierMap), supSort.key, supSort.dir), [
		scoped,
		scopedItems,
		productMap,
		supplierMap,
		supSort
	]);
	const trend = (0, import_react.useMemo)(() => buildDailyTrend(scoped, scopedItems, productMap, shipments), [
		scoped,
		scopedItems,
		productMap,
		shipments
	]);
	const agentRows = (0, import_react.useMemo)(() => {
		const itemsByOrder = groupItems(scopedItems);
		const shipCost = shipmentCostMap(shipments);
		return sortRows(agents.map((ag) => {
			const mine = new Set(resellers.filter((r) => r.agent_id === ag.id).map((r) => r.id));
			const mineOrders = scoped.filter((o) => o.reseller_id && mine.has(o.reseller_id));
			let sales = 0;
			let base = 0;
			let adminProfit = 0;
			for (const o of mineOrders) {
				const myItems = itemsByOrder.get(o.id) ?? [];
				const ord = withKeptCost(o, myItems);
				const final = isMoneyFinal(o.status);
				const received = finalReceived(ord);
				const adminCash = finalAdminReceived(ord);
				const profit = finalProfit(ord);
				const buy = final ? orderBuyingCost(myItems, o.status, productMap) : 0;
				const ship = adminDeliverySpend(o, shipCost.get(o.id));
				const pack = final && o.status !== "cancelled" ? Number(o.packaging_total ?? 0) || 0 : 0;
				sales += received;
				base += profit;
				adminProfit += adminCash - profit - buy - ship - pack;
			}
			const target = Number(ag.sale_target ?? 0) || 0;
			const rate = Number(ag.commission_rate ?? 0) || 0;
			const commission = agentCommission(base, rate);
			return {
				key: ag.id,
				name: ag.display_name,
				resellers: mine.size,
				orders: mineOrders.length,
				sales,
				target,
				achieved: target > 0 ? sales / target * 100 : 0,
				rate,
				commission,
				adminProfit,
				netAdminProfit: adminProfit - commission
			};
		}), agtSort.key, agtSort.dir);
	}, [
		agents,
		resellers,
		scoped,
		scopedItems,
		productMap,
		shipments,
		agtSort
	]);
	const agentCommissionTotal = (0, import_react.useMemo)(() => agentRows.reduce((t, a) => t + a.commission, 0), [agentRows]);
	const pnl = (0, import_react.useMemo)(() => buildPnL(scoped, scopedItems, productMap, scopedExpenses, agentCommissionTotal, shipments), [
		scoped,
		scopedItems,
		productMap,
		scopedExpenses,
		agentCommissionTotal,
		shipments
	]);
	const perPage = filters.perPage;
	const pagedProducts = usePaginated(productRows, page, perPage);
	const pagedResellers = usePaginated(resellerRows, page, perPage);
	const avatarByReseller = (0, import_react.useMemo)(() => new Map(resellers.map((r) => [r.id, r.avatar_url ?? null])), [resellers]);
	const pagedAgents = usePaginated(agentRows, page, perPage);
	const pagedSuppliers = usePaginated(supplierRows, page, perPage);
	const sortP = (k) => setProdSort((s) => ({
		key: k,
		dir: s.key === k && s.dir === "desc" ? "asc" : "desc"
	}));
	const sortR = (k) => setResSort((s) => ({
		key: k,
		dir: s.key === k && s.dir === "desc" ? "asc" : "desc"
	}));
	const sortS = (k) => setSupSort((s) => ({
		key: k,
		dir: s.key === k && s.dir === "desc" ? "asc" : "desc"
	}));
	const sortC = (k) => setCouSort((s) => ({
		key: k,
		dir: s.key === k && s.dir === "desc" ? "asc" : "desc"
	}));
	const sortA = (k) => setAgtSort((s) => ({
		key: k,
		dir: s.key === k && s.dir === "desc" ? "asc" : "desc"
	}));
	const exportCurrent = () => {
		if (tab === "products") return downloadCsv("most-selling-products.csv", toCsv([
			"Product",
			"Code",
			"Orders",
			"Sale qty",
			"Returned qty",
			"Sell value",
			"Admin revenue",
			"Buying cost",
			"Admin profit"
		], productRows.map((r) => [
			r.name,
			r.code,
			r.orders,
			r.saleQty,
			r.returnedQty,
			r.sellValue,
			r.adminRevenue,
			r.buyCost,
			r.adminProfit
		])));
		if (tab === "resellers") return downloadCsv("reseller-report.csv", toCsv([
			"Reseller",
			"Code",
			"Orders",
			"Delivered",
			"Partial",
			"Failed",
			"Running",
			"Order value",
			"Received",
			"Advance",
			"Delivery cost",
			"Packaging",
			"Reseller profit",
			"Admin profit"
		], resellerRows.map((r) => [
			r.name,
			r.code,
			r.orders,
			r.delivered,
			r.partial,
			r.failed,
			r.running,
			r.value,
			r.received,
			r.advance,
			r.deliverySpend,
			r.packaging,
			r.resellerProfit,
			r.adminProfit
		])));
		if (tab === "couriers") return downloadCsv("courier-report.csv", toCsv([
			"Courier",
			"Parcels",
			"Delivered",
			"Returned",
			"Running",
			"Parcel value",
			"Received",
			"Delivery charged",
			"Courier bill",
			"Delivery gain",
			"Admin profit"
		], courierRows.map((r) => [
			r.name,
			r.parcels,
			r.delivered,
			r.returned,
			r.running,
			r.value,
			r.received,
			r.deliveryCharged,
			r.courierBill,
			r.deliveryMargin,
			r.adminProfit
		])));
		if (tab === "suppliers") return downloadCsv("supplier-report.csv", toCsv([
			"Supplier",
			"Code",
			"Orders",
			"Sale qty",
			"Returned qty",
			"Amount owed"
		], supplierRows.map((r) => [
			r.name,
			r.code,
			r.orders,
			r.qty,
			r.returnedQty,
			r.buyCost
		])));
		if (tab === "agents") return downloadCsv("agent-report.csv", toCsv([
			"Agent",
			"Resellers",
			"Orders",
			"Sales",
			"Target",
			"Achieved %",
			"Rate %",
			"Commission",
			"Admin profit",
			"Net after commission"
		], agentRows.map((r) => [
			r.name,
			r.resellers,
			r.orders,
			r.sales,
			r.target,
			r.achieved.toFixed(1),
			r.rate,
			r.commission,
			r.adminProfit,
			r.netAdminProfit
		])));
		return downloadCsv("admin-profit-loss.csv", toCsv(["Line", "Amount"], [
			["Order value", pnl.value],
			["Received (incl. advance)", pnl.received],
			["Reseller payout", pnl.resellerPayout],
			["Product buying cost", pnl.buyCost],
			["Delivery charged to customers", pnl.deliveryCharged],
			["Delivery cost paid to courier", pnl.deliverySpend],
			["Packaging cost", pnl.packaging],
			["Gross profit", pnl.grossProfit],
			["Other expenses", pnl.expenses],
			["Agent commission", pnl.agentCommission],
			["Net profit", pnl.netProfit]
		]));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-64 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Business report",
			description: "Five simple reports — products, resellers, couriers, agents and your own profit & loss.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/expenses",
					className: "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 h-3.5 w-3.5" }), " Expenses"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: exportCurrent,
					className: "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), " Export"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderFilterBar, {
			value: filters,
			onChange: setFilters,
			resellerOptions: resellers.map((r) => ({
				value: r.id,
				label: `${r.business_name} (${r.code})`
			})),
			total: orders.length,
			shown: scoped.length,
			showPerPage: true,
			variant: "report"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card mb-4 p-3 sm:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[11px] font-medium text-muted-foreground",
					children: "Which orders to count — money is only counted once a parcel is finished"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: SCOPE_OPTIONS.map((s) => {
						const scopeColors = {
							completed: "border-primary bg-primary text-primary-foreground",
							delivered: "border-emerald-500 bg-emerald-500 text-white",
							partial: "border-amber-500 bg-amber-500 text-white",
							failed: "border-rose-500 bg-rose-500 text-white",
							running: "border-sky-500 bg-sky-500 text-white",
							all: "border-slate-600 bg-slate-600 text-white"
						};
						const active = scope === s.value;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							title: s.hint,
							onClick: () => setScope(s.value),
							className: "rounded-full border px-3 py-1.5 text-xs font-semibold transition " + (active ? scopeColors[s.value] ?? scopeColors.completed : "hover:bg-accent"),
							children: [s.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1.5 tabular-nums " + (active ? "opacity-90" : "text-muted-foreground"),
								children: scopeCount[s.value] ?? 0
							})]
						}, s.value);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-[11px] text-muted-foreground",
					children: SCOPE_OPTIONS.find((s) => s.value === scope)?.hint
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Received money",
					value: bdt(pnl.received),
					hint: `${pnl.deliveredOrders} delivered · ${pnl.partialOrders} partial · ${pnl.failedOrders} returned/cancelled · advance ${bdt(pnl.advance)} included`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Reseller payout",
					value: bdt(pnl.resellerPayout),
					hint: "What the resellers finally earn from these finished orders",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
					tone: "sky"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Delivery cost (admin)",
					value: bdt(pnl.deliverySpend),
					hint: `Charged to customers ${bdt(pnl.deliveryCharged)} · ${pnl.deliveryMargin >= 0 ? "gain" : "loss"} ${bdt(Math.abs(pnl.deliveryMargin))}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }),
					tone: "violet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Net admin profit",
					value: bdt(pnl.netProfit),
					hint: `Gross ${bdt(pnl.grossProfit)} − expenses ${bdt(pnl.expenses)} − agent commission ${bdt(pnl.agentCommission)}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
					tone: "emerald"
				})
			]
		}),
		pnl.runningOrders > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground",
			children: [
				pnl.runningOrders,
				" order(s) worth ",
				bdt(pnl.runningValue),
				" are still in progress — their money is not counted as earned anywhere above."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportTabs, {
			tabs: TABS,
			active: tab,
			onChange: setTab
		}),
		tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-black uppercase tracking-widest text-amber-700",
										children: "Potential admin profit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: [
											potential.orders,
											" order(s) in the pipeline, worth ",
											bdt(potential.value)
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-black tabular-nums text-amber-700",
									children: bdt(potential.adminProfit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] text-muted-foreground",
									children: "If every in-progress order gets delivered in full — not a promise, just the ceiling"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 text-sky-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-black uppercase tracking-widest text-sky-700",
										children: "Potential reseller profit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: [
											"Same ",
											potential.orders,
											" pending order(s)"
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-black tabular-nums text-sky-700",
									children: bdt(potential.resellerProfit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] text-muted-foreground",
									children: "What resellers stand to earn once these are confirmed delivered"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black uppercase tracking-widest text-emerald-700",
									children: "Achievement"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: "Delivery success rate, this range"
								})] })]
							}), (() => {
								const finished = pnl.deliveredOrders + pnl.partialOrders + pnl.failedOrders;
								const rate = finished > 0 ? (pnl.deliveredOrders + pnl.partialOrders) / finished * 100 : 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl font-black tabular-nums text-emerald-700",
										children: [rate.toFixed(0), "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-emerald-500",
											style: { width: `${Math.min(100, rate)}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[10px] text-muted-foreground",
										children: [
											pnl.deliveredOrders + pnl.partialOrders,
											" delivered/partial out of ",
											finished,
											" ",
											"finished order(s)"
										]
									})
								] });
							})()]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
					title: "Order status overview",
					hint: "Every order in the current filter, grouped by exact status — count and order value",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3 lg:grid-cols-5",
						children: statusBreakdown.map((s) => {
							const style = STATUS_STYLES[s.key] ?? STATUS_STYLES.default;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 " + style.bg,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1.5 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: style.text,
											children: style.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-[11px] font-semibold text-muted-foreground",
											children: s.label
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black tabular-nums " + style.text,
										children: s.count
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: bdt(s.value)
									})
								]
							}, s.key);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
					title: "Revenue & profit trend",
					hint: "Only settled orders (delivered / partial / returned / cancelled) move this chart — running orders haven't earned anything yet",
					children: trend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-56 items-center justify-center text-sm text-muted-foreground",
						children: "No settled orders in this range yet"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 w-full p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: trend,
								margin: {
									left: 0,
									right: 8,
									top: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ov-received",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "hsl(var(--primary))",
											stopOpacity: .35
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "hsl(var(--primary))",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ov-profit",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "#10b981",
											stopOpacity: .4
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "#10b981",
											stopOpacity: 0
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										className: "stroke-border"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: { fontSize: 11 },
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 11 },
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => `${Math.round(v / 1e3)}k`,
										width: 36
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v, key) => [bdt(v), key === "received" ? "Received" : "Admin profit"],
										labelFormatter: (l) => `Date: ${l}`,
										contentStyle: {
											fontSize: 12,
											borderRadius: 8
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										formatter: (v) => v === "received" ? "Received" : "Admin profit",
										wrapperStyle: { fontSize: 12 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "received",
										stroke: "hsl(var(--primary))",
										fill: "url(#ov-received)",
										strokeWidth: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "adminProfit",
										stroke: "#10b981",
										fill: "url(#ov-profit)",
										strokeWidth: 2
									})
								]
							})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
								title: "Where the money goes",
								hint: "Out of every taka received, in this range",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Reseller payout",
											value: pnl.resellerPayout,
											of: pnl.received,
											tone: "sky"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Product buying cost",
											value: pnl.buyCost,
											of: pnl.received,
											tone: "amber"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Delivery cost (courier)",
											value: pnl.deliverySpend,
											of: pnl.received,
											tone: "violet"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Packaging cost",
											value: pnl.packaging,
											of: pnl.received,
											tone: "rose"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Other expenses",
											value: pnl.expenses,
											of: pnl.received,
											tone: "orange"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyFlowBar, {
											label: "Agent commission",
											value: pnl.agentCommission,
											of: pnl.received,
											tone: "indigo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net profit kept" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: pnl.netProfit >= 0 ? "text-emerald-600" : "text-red-600",
												children: bdt(pnl.netProfit)
											})]
										})
									]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
								title: "Top products",
								hint: "By admin profit in this range",
								right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTab("products"),
									className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground",
									children: ["All products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopList, {
										empty: "No product sales yet",
										rows: [...productRows].sort((a, b) => b.adminProfit - a.adminProfit).slice(0, 5).map((r) => ({
											key: r.key,
											name: r.name,
											sub: `${r.saleQty} sold · ${r.orders} orders`,
											value: r.adminProfit
										}))
									})
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
								title: "Top resellers",
								hint: "By admin profit in this range",
								right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTab("resellers"),
									className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground",
									children: ["All resellers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopList, {
										empty: "No reseller orders yet",
										rows: [...resellerRows].sort((a, b) => b.adminProfit - a.adminProfit).slice(0, 5).map((r) => ({
											key: r.key,
											name: r.name,
											sub: `${r.delivered} delivered · ${r.orders} orders`,
											value: r.adminProfit
										}))
									})
								})
							})
						})
					]
				}),
				supplierRows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
					title: "Top suppliers by cost",
					hint: "How much of your buying cost goes to each supplier",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("suppliers"),
						className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground",
						children: ["All suppliers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopList, {
							tone: "amber",
							empty: "No supplier-linked sales yet",
							rows: supplierRows.slice(0, 5).map((r) => ({
								key: r.key,
								name: r.name,
								sub: `${r.qty} pcs · ${r.orders} orders`,
								value: r.buyCost
							}))
						})
					})
				})
			]
		}),
		tab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Most selling products",
			hint: "Default: highest sale count first. Click any column arrow to sort.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[880px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left",
							children: "Product"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Orders",
							sortKey: "orders",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Sale count",
							sortKey: "saleQty",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP,
							hint: "Quantity the customer kept"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Returned",
							sortKey: "returnedQty",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Sell value",
							sortKey: "sellValue",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Admin revenue",
							sortKey: "adminRevenue",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Buying cost",
							sortKey: "buyCost",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Total profit",
							sortKey: "adminProfit",
							active: prodSort.key,
							dir: prodSort.dir,
							onSort: sortP,
							hint: "Admin revenue − buying cost"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pagedProducts.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted",
									children: r.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: r.image,
										alt: r.name,
										loading: "lazy",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full w-full items-center justify-center text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: ["#", r.code]
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: r.orders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums",
							children: r.saleQty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: r.returnedQty || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.sellValue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.adminRevenue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums text-muted-foreground",
							children: bdt(r.buyCost)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit),
							children: bdt(r.adminProfit)
						})
					]
				}, r.key)), pagedProducts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "px-3 py-10 text-center text-xs text-muted-foreground",
					children: "No product sold in this range."
				}) })] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: productRows.length,
			onPage: setPage
		})] }),
		tab === "resellers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Reseller report",
			hint: "Admin profit = money received for the order − what the reseller finally earns − admin buying price of the products the customer kept. Advance already collected counts as received (the same way the transaction report does it). Delivery charge and packaging are not deducted twice here — record them once in Expenses and the net profit takes them out.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left",
							children: "Reseller"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Orders",
							sortKey: "orders",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Delivered",
							sortKey: "delivered",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Partial",
							sortKey: "partial",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Failed",
							sortKey: "failed",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Running",
							sortKey: "running",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR,
							hint: "Still in progress — money not counted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Order value",
							sortKey: "value",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Received",
							sortKey: "received",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR,
							hint: "Courier collection + advance already taken"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Delivery cost",
							sortKey: "deliverySpend",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR,
							hint: "What the courier actually charged us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Reseller profit",
							sortKey: "resellerProfit",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Admin profit",
							sortKey: "adminProfit",
							active: resSort.key,
							dir: resSort.dir,
							onSort: sortR
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pagedResellers.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResellerAvatar, {
									url: avatarByReseller.get(r.key) ?? null,
									name: r.name,
									size: 28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: r.code
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold",
							children: r.orders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-success",
							children: r.delivered
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-amber-600",
							children: r.partial || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-destructive",
							children: r.failed || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: r.running || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: [bdt(r.received), r.advance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[9px] text-primary",
								children: [
									"adv ",
									bdt(r.advance),
									" included"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums text-muted-foreground",
							children: bdt(r.deliverySpend)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums " + toneOf(r.resellerProfit),
							children: bdt(r.resellerProfit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit),
							children: bdt(r.adminProfit)
						})
					]
				}, r.key)), pagedResellers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 11,
					className: "px-3 py-10 text-center text-xs text-muted-foreground",
					children: "No reseller order in this range."
				}) })] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: resellerRows.length,
			onPage: setPage
		})] }),
		tab === "suppliers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Supplier report",
			hint: "Money owed to each supplier for the items customers actually kept — attributed from the supplier frozen on each order line at booking time",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left",
							children: "Supplier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Orders",
							sortKey: "orders",
							active: supSort.key,
							dir: supSort.dir,
							onSort: sortS
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Sold qty",
							sortKey: "qty",
							active: supSort.key,
							dir: supSort.dir,
							onSort: sortS,
							hint: "Kept quantity across finished orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Returned qty",
							sortKey: "returnedQty",
							active: supSort.key,
							dir: supSort.dir,
							onSort: sortS
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Amount owed",
							sortKey: "buyCost",
							active: supSort.key,
							dir: supSort.dir,
							onSort: sortS,
							hint: "Buying cost × kept quantity, at the price on record when each order was placed"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pagedSuppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500/10 text-amber-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factory, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: s.code
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold",
							children: s.orders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center",
							children: s.qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: s.returnedQty || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums",
							children: bdt(s.buyCost)
						})
					]
				}, s.key)), pagedSuppliers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "px-3 py-10 text-center text-xs text-muted-foreground",
					children: "No supplier-linked sale in this range. Set each product's supplier under Admin → Products to see this report."
				}) })] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: supplierRows.length,
			onPage: setPage
		})] }),
		tab === "couriers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Courier report",
			hint: "Parcel count, parcel value and admin profit per courier.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[820px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left",
							children: "Courier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Parcels",
							sortKey: "parcels",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Delivered",
							sortKey: "delivered",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC,
							hint: "Delivered + partial parcels"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Returned",
							sortKey: "returned",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Running",
							sortKey: "running",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Parcel value",
							sortKey: "value",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Received",
							sortKey: "received",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Charged",
							sortKey: "deliveryCharged",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC,
							hint: "Delivery charge taken from customers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Courier bill",
							sortKey: "courierBill",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC,
							hint: "Actual courier cost"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Delivery gain",
							sortKey: "deliveryMargin",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Admin profit",
							sortKey: "adminProfit",
							active: couSort.key,
							dir: couSort.dir,
							onSort: sortC
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [courierRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-medium capitalize",
							children: r.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold",
							children: r.parcels
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-success",
							children: r.delivered
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-destructive",
							children: r.returned || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: r.running || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.received)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums text-muted-foreground",
							children: bdt(r.deliveryCharged)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums text-muted-foreground",
							children: bdt(r.courierBill)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums " + toneOf(r.deliveryMargin),
							children: bdt(r.deliveryMargin)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit),
							children: bdt(r.adminProfit)
						})
					]
				}, r.key)), courierRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 11,
					className: "px-3 py-10 text-center text-xs text-muted-foreground",
					children: "No parcel in this range."
				}) })] })]
			})
		}),
		tab === "agents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Agent report",
			hint: "Commission = agent rate % × settled net profit of the assigned resellers' orders. Net profit uses the same formula everywhere: final delivered (received) amount − delivery charge − product cost − packaging cost. Returned / cancelled orders reduce the base, so commission is always paid on real delivered money.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[920px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left",
							children: "Agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Resellers",
							sortKey: "resellers",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Orders",
							sortKey: "orders",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Sales",
							sortKey: "sales",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Target",
							sortKey: "target",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Achieved",
							sortKey: "achieved",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Commission",
							sortKey: "commission",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Admin profit",
							sortKey: "adminProfit",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, {
							label: "Net after commission",
							sortKey: "netAdminProfit",
							active: agtSort.key,
							dir: agtSort.dir,
							onSort: sortA
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pagedAgents.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-medium",
							children: r.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center text-muted-foreground",
							children: r.resellers
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center",
							children: r.orders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: bdt(r.sales)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums text-muted-foreground",
							children: r.target ? bdt(r.target) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center",
							children: r.target ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mx-auto w-24",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 text-[11px] font-semibold",
									children: [r.achieved.toFixed(0), "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full " + (r.achieved >= 100 ? "bg-success" : "bg-primary"),
										style: { width: `${Math.min(r.achieved, 100)}%` }
									})
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "No target"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-center tabular-nums",
							children: [bdt(r.commission), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[9px] text-muted-foreground",
								children: [r.rate, "% rate"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center tabular-nums " + toneOf(r.adminProfit),
							children: bdt(r.adminProfit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.netAdminProfit),
							children: bdt(r.netAdminProfit)
						})
					]
				}, r.key)), pagedAgents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 9,
					className: "px-3 py-10 text-center text-xs text-muted-foreground",
					children: "No agent yet."
				}) })] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
			page,
			perPage,
			total: agentRows.length,
			onPage: setPage
		})] }),
		tab === "pnl" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
			title: "Admin profit & loss",
			hint: "Admin profit = money received for the order − what the reseller finally earns − admin buying price of the products the customer kept. Advance already collected counts as received (the same way the transaction report does it). Delivery charge and packaging are not deducted twice here — record them once in Expenses and the net profit takes them out.",
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/expenses",
				className: "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "mr-1.5 h-3.5 w-3.5" }), " Manage expenses"]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
				className: "w-full min-w-[560px] text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					[
						{
							label: "Order value",
							value: pnl.value,
							muted: true,
							note: `${pnl.orders} orders counted · ${pnl.deliveredOrders} delivered, ${pnl.partialOrders} partial, ${pnl.failedOrders} returned/cancelled`
						},
						{
							label: "Received (incl. advance)",
							value: pnl.received,
							note: `advance ${bdt(pnl.advance)} counted as received — same as the transaction report`
						},
						{
							label: "Reseller final payout",
							value: -pnl.resellerPayout,
							note: "what the resellers earn from these orders"
						},
						{
							label: "Product buying cost",
							value: -pnl.buyCost,
							note: "your buying price of the kept items"
						},
						{
							label: "Delivery cost paid to courier",
							value: -pnl.deliverySpend,
							note: `customers were charged ${bdt(pnl.deliveryCharged)} — ${pnl.deliveryMargin >= 0 ? "gain" : "loss"} ${bdt(Math.abs(pnl.deliveryMargin))}`
						},
						{
							label: "Packaging cost",
							value: -pnl.packaging,
							note: "packaging of the parcels in this range"
						}
					].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: r.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: r.note
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-right font-semibold tabular-nums " + (r.muted ? "text-muted-foreground" : toneOf(r.value)),
							children: bdt(r.value)
						})]
					}, r.label)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t bg-muted/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 font-bold",
							children: "Gross profit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 text-right font-bold tabular-nums " + toneOf(pnl.grossProfit),
							children: bdt(pnl.grossProfit)
						})]
					}),
					pnl.expenseByCategory.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 pl-8 capitalize text-muted-foreground",
							children: ["Expense · ", c.category]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-right tabular-nums text-destructive",
							children: ["−", bdt(c.amount)]
						})]
					}, c.category)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "Other expenses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Delivery, courier and packaging expense entries are skipped here because every order already carries its real delivery and packaging cost above",
									pnl.skippedExpenses > 0 ? ` (${bdt(pnl.skippedExpenses)} skipped)` : "",
									"."
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-right font-semibold tabular-nums text-destructive",
							children: ["−", bdt(pnl.expenses)]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "Agent commission"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Earned commission of all agents on these orders"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2 text-right font-semibold tabular-nums text-destructive",
							children: ["−", bdt(pnl.agentCommission)]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t bg-primary/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 text-base font-black",
							children: "Net admin profit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 text-right text-base font-black tabular-nums " + toneOf(pnl.netProfit),
							children: bdt(pnl.netProfit)
						})]
					})
				] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Other expenses",
					value: bdt(pnl.expenses),
					hint: `${scopedExpenses.length} expense entries in this range`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4" }),
					tone: "rose"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Delivery gain/loss",
					value: bdt(pnl.deliveryMargin),
					hint: `Charged ${bdt(pnl.deliveryCharged)} − paid ${bdt(pnl.deliverySpend)}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }),
					tone: "sky"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Packaging cost",
					value: bdt(pnl.packaging),
					hint: "Already deducted in the statement above",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-4 w-4" }),
					tone: "violet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Agent commission",
					value: bdt(pnl.agentCommission),
					hint: "Deducted from the net profit",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" })
				})
			]
		})] })
	] });
}
var STATUS_STYLES = {
	new: {
		bg: "bg-slate-500/5 border-slate-500/15",
		text: "text-slate-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "h-3.5 w-3.5" })
	},
	forwarded: {
		bg: "bg-indigo-500/5 border-indigo-500/15",
		text: "text-indigo-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
	},
	confirmed: {
		bg: "bg-blue-500/5 border-blue-500/15",
		text: "text-blue-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-3.5 w-3.5" })
	},
	packaging: {
		bg: "bg-violet-500/5 border-violet-500/15",
		text: "text-violet-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" })
	},
	handover: {
		bg: "bg-purple-500/5 border-purple-500/15",
		text: "text-purple-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageSearch, { className: "h-3.5 w-3.5" })
	},
	courier: {
		bg: "bg-cyan-500/5 border-cyan-500/15",
		text: "text-cyan-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" })
	},
	delivered: {
		bg: "bg-emerald-500/5 border-emerald-500/15",
		text: "text-emerald-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5" })
	},
	pending_partial: {
		bg: "bg-amber-500/5 border-amber-500/15",
		text: "text-amber-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
	},
	partial_full: {
		bg: "bg-amber-500/5 border-amber-500/15",
		text: "text-amber-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
	},
	partial_item: {
		bg: "bg-amber-500/5 border-amber-500/15",
		text: "text-amber-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
	},
	partial_delivery: {
		bg: "bg-amber-500/5 border-amber-500/15",
		text: "text-amber-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
	},
	pending_return: {
		bg: "bg-orange-500/5 border-orange-500/15",
		text: "text-orange-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3.5 w-3.5" })
	},
	returned: {
		bg: "bg-rose-500/5 border-rose-500/15",
		text: "text-rose-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-3.5 w-3.5" })
	},
	damaged: {
		bg: "bg-red-500/5 border-red-500/15",
		text: "text-red-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
	},
	cancelled: {
		bg: "bg-gray-500/8 border-gray-500/20",
		text: "text-gray-600",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" })
	},
	default: {
		bg: "bg-muted/30 border-border",
		text: "text-muted-foreground",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "h-3.5 w-3.5" })
	}
};
var FLOW_TONES = {
	sky: "bg-sky-500",
	amber: "bg-amber-500",
	violet: "bg-violet-500",
	rose: "bg-rose-500",
	orange: "bg-orange-500",
	indigo: "bg-indigo-500"
};
function MoneyFlowBar({ label, value, of, tone }) {
	const pct = of > 0 ? Math.max(0, Math.min(100, value / of * 100)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 last:mb-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold tabular-nums",
				children: bdt(value)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full " + FLOW_TONES[tone],
				style: { width: `${pct}%` }
			})
		})]
	});
}
function TopList({ rows, empty, tone = "primary" }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-6 text-center text-xs text-muted-foreground",
		children: empty
	});
	const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground",
				children: i + 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-xs font-medium",
							children: r.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs font-semibold tabular-nums " + toneOf(r.value),
							children: bdt(r.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full " + (tone === "amber" ? "bg-amber-500" : "bg-primary"),
							style: { width: `${Math.max(4, Math.abs(r.value) / max * 100)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-[10px] text-muted-foreground",
						children: r.sub
					})
				]
			})]
		}, r.key))
	});
}
//#endregion
export { BusinessReportPage as component };
