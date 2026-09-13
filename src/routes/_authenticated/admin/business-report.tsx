import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/laravel/client";
import { PageHeader, StatCard } from "@/components/ui-kit";
import {
  OrderFilterBar,
  applyOrderFilters,
  DEFAULT_ORDER_FILTERS,
  resolveDateRange,
  type OrderFilterState,
} from "@/components/order-filters";
import { ReportCard, ReportTabs, SortTh, toneOf } from "@/components/report-blocks";
import { Pagination, usePaginated } from "@/components/data-list";
import { ResellerAvatar } from "@/components/reseller-avatar";
import { bdt, toCsv, downloadCsv } from "@/lib/finance-report";
import { agentCommission, AGENT_COMMISSION_HINT } from "@/lib/agents";
import {
  ADMIN_PROFIT_HINT,
  adminDeliverySpend,
  buildCourierRows,
  buildDailyTrend,
  buildPnL,
  buildPotential,
  buildProductRows,
  buildSupplierRows,
  finalProfit,
  finalAdminReceived,
  finalReceived,
  groupItems,
  isMoneyFinal,
  scopeOrders,
  shipmentCostMap,
  withKeptCost,
  buildResellerRows,
  orderBuyingCost,
  sortRows,
  SCOPE_OPTIONS,
  type BizItem,
  type BizOrder,
  type BizProduct,
  type CourierRow,
  type DailyPoint,
  type Expense,
  type ProductRow,
  type ReportScope,
  type ResellerRow,
  type SortDir,
  type SupplierLite,
  type SupplierRow,
} from "@/lib/business-report";
import { ORDER_TABS } from "@/lib/courier-status";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Loader2,
  Download,
  Wallet,
  Boxes,
  TrendingUp,
  Receipt,
  Package,
  Users,
  Truck,
  Target,
  LayoutGrid,
  Factory,
  ArrowRight,
  Sparkles,
  Percent,
  Send,
  ClipboardCheck,
  PackageCheck,
  PackageSearch,
  Undo2,
  Ban,
  AlertTriangle,
  CircleDot,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/business-report")({
  component: BusinessReportPage,
  head: () => ({
    meta: [
      { title: "Business report — Admin" },
      {
        name: "description",
        content:
          "Most selling products, reseller and courier performance, agent targets and the admin profit & loss.",
      },
      { property: "og:title", content: "Business report — Admin" },
      {
        property: "og:description",
        content: "Five simple reports: products, resellers, couriers, agents, profit & loss.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Tab = "overview" | "products" | "resellers" | "suppliers" | "couriers" | "agents" | "pnl";
const TABS: { key: Tab; label: string; hint?: string }[] = [
  { key: "overview", label: "Overview", hint: "Trend, money flow and top performers at a glance" },
  { key: "products", label: "Most selling products" },
  { key: "resellers", label: "Reseller report" },
  {
    key: "suppliers",
    label: "Supplier report",
    hint: "Cost owed to each supplier for the kept items",
  },
  { key: "couriers", label: "Courier report" },
  { key: "agents", label: "Agent report" },
  { key: "pnl", label: "Profit & loss" },
];

type Agent = {
  id: string;
  display_name: string;
  sale_target: number | string;
  commission_rate: number | string;
  is_active: boolean;
};
type ResellerLite = {
  id: string;
  business_name: string;
  code: string;
  agent_id: string | null;
  avatar_url?: string | null;
};
type AgentRow = {
  key: string;
  name: string;
  resellers: number;
  orders: number;
  sales: number;
  target: number;
  achieved: number;
  rate: number;
  commission: number;
  adminProfit: number;
  netAdminProfit: number;
};

const th = "px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

function BusinessReportPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<BizOrder[]>([]);
  const [items, setItems] = useState<BizItem[]>([]);
  const [products, setProducts] = useState<BizProduct[]>([]);
  const [shipments, setShipments] = useState<
    { order_id: string; provider: string; cost: number | null }[]
  >([]);
  const [resellers, setResellers] = useState<ResellerLite[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; display_name: string; code: string }[]>(
    [],
  );

  const [filters, setFilters] = useState<OrderFilterState>(DEFAULT_ORDER_FILTERS);
  const [scope, setScope] = useState<ReportScope>("completed");
  const [tab, setTab] = useState<Tab>("overview");
  const [page, setPage] = useState(1);

  const [prodSort, setProdSort] = useState<{ key: keyof ProductRow; dir: SortDir }>({
    key: "saleQty",
    dir: "desc",
  });
  const [resSort, setResSort] = useState<{ key: keyof ResellerRow; dir: SortDir }>({
    key: "orders",
    dir: "desc",
  });
  const [supSort, setSupSort] = useState<{ key: keyof SupplierRow; dir: SortDir }>({
    key: "buyCost",
    dir: "desc",
  });
  const [couSort, setCouSort] = useState<{ key: keyof CourierRow; dir: SortDir }>({
    key: "parcels",
    dir: "desc",
  });
  const [agtSort, setAgtSort] = useState<{ key: keyof AgentRow; dir: SortDir }>({
    key: "sales",
    dir: "desc",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [o, it, p, s, r, a, e, sup] = await Promise.all([
        supabase
          .from("orders")
          .select(
            "id,order_number,reseller_id,status,created_at,customer_name,customer_phone,address_line,subtotal,shipping_cost,total,sa_cost_total,reseller_profit,received_amount,packaging_total,delivery_cost,advance_amount,advance_by,resellers(business_name,code)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("order_items")
          .select(
            "order_id,product_id,product_name,quantity,returned_qty,sa_price,line_total,profit,buying_price,packaging_cost,supplier_id",
          ),
        supabase
          .from("products")
          .select("id,name,product_code,buying_price,packaging_cost,og_image_url,supplier_id"),
        supabase.from("shipments").select("order_id,provider,cost"),
        supabase.from("resellers").select("id,business_name,code,agent_id,avatar_url"),
        supabase.from("agents").select("id,display_name,sale_target,commission_rate,is_active"),
        supabase.from("expenses").select("*"),
        supabase.from("suppliers").select("id,display_name,code"),
      ]);
      setOrders((o.data ?? []) as unknown as BizOrder[]);
      setItems((it.data ?? []) as unknown as BizItem[]);
      setProducts((p.data ?? []) as unknown as BizProduct[]);
      setShipments(
        (s.data ?? []) as unknown as { order_id: string; provider: string; cost: number | null }[],
      );
      setResellers((r.data ?? []) as unknown as ResellerLite[]);
      setAgents((a.data ?? []) as unknown as Agent[]);
      setExpenses((e.data ?? []) as unknown as Expense[]);
      setSuppliers(
        (sup.data ?? []) as unknown as { id: string; display_name: string; code: string }[],
      );
      setLoading(false);
    })();
  }, []);

  useEffect(() => setPage(1), [tab, filters, scope]);

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const supplierMap = useMemo(
    () => new Map(suppliers.map((s) => [s.id, s as SupplierLite])),
    [suppliers],
  );
  const filtered = useMemo(
    () =>
      applyOrderFilters(
        orders as unknown as (BizOrder & { customer_name: string; customer_phone: string })[],
        filters,
      ),
    [orders, filters],
  ) as unknown as BizOrder[];
  const scoped = useMemo(() => scopeOrders(filtered, scope), [filtered, scope]);
  const scopedIds = useMemo(() => new Set(scoped.map((o) => o.id)), [scoped]);
  const scopedItems = useMemo(
    () => items.filter((i) => scopedIds.has(i.order_id)),
    [items, scopedIds],
  );
  const filteredIds = useMemo(() => new Set(filtered.map((o) => o.id)), [filtered]);
  const filteredItems = useMemo(
    () => items.filter((i) => filteredIds.has(i.order_id)),
    [items, filteredIds],
  );
  const potential = useMemo(
    () => buildPotential(filtered, filteredItems, productMap),
    [filtered, filteredItems, productMap],
  );
  const statusBreakdown = useMemo(() => {
    return ORDER_TABS.filter((t) => t.key !== "all").map((t) => {
      const rows = filtered.filter((o) => (t.statuses as string[]).includes(o.status));
      return {
        key: t.key,
        label: t.label,
        count: rows.length,
        value: rows.reduce((s, o) => s + Number(o.total ?? 0), 0),
      };
    });
  }, [filtered]);
  const scopeCount = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of SCOPE_OPTIONS) c[s.value] = scopeOrders(filtered, s.value).length;
    return c;
  }, [filtered]);

  const scopedExpenses = useMemo(() => {
    const { fromTs, toTs } = resolveDateRange(filters);
    return expenses.filter((e) => {
      const ts = new Date(`${e.spent_on}T12:00:00`).getTime();
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      return true;
    });
  }, [expenses, filters]);

  const productRows = useMemo(
    () => sortRows(buildProductRows(scoped, scopedItems, productMap), prodSort.key, prodSort.dir),
    [scoped, scopedItems, productMap, prodSort],
  );
  const resellerRows = useMemo(
    () =>
      sortRows(
        buildResellerRows(scoped, scopedItems, productMap, shipments),
        resSort.key,
        resSort.dir,
      ),
    [scoped, scopedItems, productMap, shipments, resSort],
  );
  const courierRows = useMemo(
    () =>
      sortRows(
        buildCourierRows(scoped, scopedItems, productMap, shipments),
        couSort.key,
        couSort.dir,
      ),
    [scoped, scopedItems, productMap, shipments, couSort],
  );
  const supplierRows = useMemo(
    () =>
      sortRows(
        buildSupplierRows(scoped, scopedItems, productMap, supplierMap),
        supSort.key,
        supSort.dir,
      ),
    [scoped, scopedItems, productMap, supplierMap, supSort],
  );
  const trend = useMemo(
    () => buildDailyTrend(scoped, scopedItems, productMap, shipments),
    [scoped, scopedItems, productMap, shipments],
  );

  const agentRows = useMemo(() => {
    const itemsByOrder = groupItems(scopedItems);
    const shipCost = shipmentCostMap(shipments);
    const rows: AgentRow[] = agents.map((ag) => {
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
        achieved: target > 0 ? (sales / target) * 100 : 0,
        rate,
        commission,
        adminProfit,
        netAdminProfit: adminProfit - commission,
      };
    });
    return sortRows(rows, agtSort.key, agtSort.dir);
  }, [agents, resellers, scoped, scopedItems, productMap, shipments, agtSort]);

  const agentCommissionTotal = useMemo(
    () => agentRows.reduce((t, a) => t + a.commission, 0),
    [agentRows],
  );
  const pnl = useMemo(
    () =>
      buildPnL(scoped, scopedItems, productMap, scopedExpenses, agentCommissionTotal, shipments),
    [scoped, scopedItems, productMap, scopedExpenses, agentCommissionTotal, shipments],
  );

  const perPage = filters.perPage;
  const pagedProducts = usePaginated(productRows, page, perPage);
  const pagedResellers = usePaginated(resellerRows, page, perPage);
  const avatarByReseller = useMemo(
    () => new Map(resellers.map((r) => [r.id, r.avatar_url ?? null])),
    [resellers],
  );
  const pagedAgents = usePaginated(agentRows, page, perPage);
  const pagedSuppliers = usePaginated(supplierRows, page, perPage);

  const sortP = (k: keyof ProductRow) =>
    setProdSort((s) => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }));
  const sortR = (k: keyof ResellerRow) =>
    setResSort((s) => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }));
  const sortS = (k: keyof SupplierRow) =>
    setSupSort((s) => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }));
  const sortC = (k: keyof CourierRow) =>
    setCouSort((s) => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }));
  const sortA = (k: keyof AgentRow) =>
    setAgtSort((s) => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }));

  const exportCurrent = () => {
    if (tab === "products")
      return downloadCsv(
        "most-selling-products.csv",
        toCsv(
          [
            "Product",
            "Code",
            "Orders",
            "Sale qty",
            "Returned qty",
            "Sell value",
            "Admin revenue",
            "Buying cost",
            "Admin profit",
          ],
          productRows.map((r) => [
            r.name,
            r.code,
            r.orders,
            r.saleQty,
            r.returnedQty,
            r.sellValue,
            r.adminRevenue,
            r.buyCost,
            r.adminProfit,
          ]),
        ),
      );
    if (tab === "resellers")
      return downloadCsv(
        "reseller-report.csv",
        toCsv(
          [
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
            "Admin profit",
          ],
          resellerRows.map((r) => [
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
            r.adminProfit,
          ]),
        ),
      );
    if (tab === "couriers")
      return downloadCsv(
        "courier-report.csv",
        toCsv(
          [
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
            "Admin profit",
          ],
          courierRows.map((r) => [
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
            r.adminProfit,
          ]),
        ),
      );
    if (tab === "suppliers")
      return downloadCsv(
        "supplier-report.csv",
        toCsv(
          ["Supplier", "Code", "Orders", "Sale qty", "Returned qty", "Amount owed"],
          supplierRows.map((r) => [r.name, r.code, r.orders, r.qty, r.returnedQty, r.buyCost]),
        ),
      );
    if (tab === "agents")
      return downloadCsv(
        "agent-report.csv",
        toCsv(
          [
            "Agent",
            "Resellers",
            "Orders",
            "Sales",
            "Target",
            "Achieved %",
            "Rate %",
            "Commission",
            "Admin profit",
            "Net after commission",
          ],
          agentRows.map((r) => [
            r.name,
            r.resellers,
            r.orders,
            r.sales,
            r.target,
            r.achieved.toFixed(1),
            r.rate,
            r.commission,
            r.adminProfit,
            r.netAdminProfit,
          ]),
        ),
      );
    return downloadCsv(
      "admin-profit-loss.csv",
      toCsv(
        ["Line", "Amount"],
        [
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
          ["Net profit", pnl.netProfit],
        ],
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Business report"
        description="Five simple reports — products, resellers, couriers, agents and your own profit & loss."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/expenses"
              className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent"
            >
              <Receipt className="mr-1.5 h-3.5 w-3.5" /> Expenses
            </Link>
            <button
              type="button"
              onClick={exportCurrent}
              className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </button>
          </div>
        }
      />

      <OrderFilterBar
        value={filters}
        onChange={setFilters}
        resellerOptions={resellers.map((r) => ({
          value: r.id,
          label: `${r.business_name} (${r.code})`,
        }))}
        total={orders.length}
        shown={scoped.length}
        showPerPage
        variant="report"
      />

      <div className="surface-card mb-4 p-3 sm:p-4">
        <div className="mb-2 text-[11px] font-medium text-muted-foreground">
          Which orders to count — money is only counted once a parcel is finished
        </div>
        <div className="flex flex-wrap gap-2">
          {SCOPE_OPTIONS.map((s) => {
            const scopeColors: Record<string, string> = {
              completed: "border-primary bg-primary text-primary-foreground",
              delivered: "border-emerald-500 bg-emerald-500 text-white",
              partial: "border-amber-500 bg-amber-500 text-white",
              failed: "border-rose-500 bg-rose-500 text-white",
              running: "border-sky-500 bg-sky-500 text-white",
              all: "border-slate-600 bg-slate-600 text-white",
            };
            const active = scope === s.value;
            return (
              <button
                key={s.value}
                type="button"
                title={s.hint}
                onClick={() => setScope(s.value)}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition " +
                  (active ? (scopeColors[s.value] ?? scopeColors.completed) : "hover:bg-accent")
                }
              >
                {s.label}
                <span
                  className={
                    "ml-1.5 tabular-nums " + (active ? "opacity-90" : "text-muted-foreground")
                  }
                >
                  {scopeCount[s.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          {SCOPE_OPTIONS.find((s) => s.value === scope)?.hint}
        </div>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Received money"
          value={bdt(pnl.received)}
          hint={`${pnl.deliveredOrders} delivered · ${pnl.partialOrders} partial · ${pnl.failedOrders} returned/cancelled · advance ${bdt(pnl.advance)} included`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Reseller payout"
          value={bdt(pnl.resellerPayout)}
          hint="What the resellers finally earn from these finished orders"
          icon={<Users className="h-4 w-4" />}
          tone="sky"
        />
        <StatCard
          label="Delivery cost (admin)"
          value={bdt(pnl.deliverySpend)}
          hint={`Charged to customers ${bdt(pnl.deliveryCharged)} · ${pnl.deliveryMargin >= 0 ? "gain" : "loss"} ${bdt(Math.abs(pnl.deliveryMargin))}`}
          icon={<Truck className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Net admin profit"
          value={bdt(pnl.netProfit)}
          hint={`Gross ${bdt(pnl.grossProfit)} − expenses ${bdt(pnl.expenses)} − agent commission ${bdt(pnl.agentCommission)}`}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="emerald"
        />
      </div>
      {pnl.runningOrders > 0 && (
        <div className="mb-6 rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {pnl.runningOrders} order(s) worth {bdt(pnl.runningValue)} are still in progress — their
          money is not counted as earned anywhere above.
        </div>
      )}

      <ReportTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="space-y-4">
          {/* Potential profit + achievement — the pipeline, at a glance */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-amber-700">
                    Potential admin profit
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {potential.orders} order(s) in the pipeline, worth {bdt(potential.value)}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-black tabular-nums text-amber-700">
                {bdt(potential.adminProfit)}
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                If every in-progress order gets delivered in full — not a promise, just the ceiling
              </div>
            </div>

            <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 text-sky-600">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-sky-700">
                    Potential reseller profit
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Same {potential.orders} pending order(s)
                  </div>
                </div>
              </div>
              <div className="text-2xl font-black tabular-nums text-sky-700">
                {bdt(potential.resellerProfit)}
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                What resellers stand to earn once these are confirmed delivered
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600">
                  <Percent className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
                    Achievement
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Delivery success rate, this range
                  </div>
                </div>
              </div>
              {(() => {
                const finished = pnl.deliveredOrders + pnl.partialOrders + pnl.failedOrders;
                const rate =
                  finished > 0 ? ((pnl.deliveredOrders + pnl.partialOrders) / finished) * 100 : 0;
                return (
                  <>
                    <div className="text-2xl font-black tabular-nums text-emerald-700">
                      {rate.toFixed(0)}%
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/10">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, rate)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {pnl.deliveredOrders + pnl.partialOrders} delivered/partial out of {finished}{" "}
                      finished order(s)
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Order status breakdown — every status, with count and value */}
          <ReportCard
            title="Order status overview"
            hint="Every order in the current filter, grouped by exact status — count and order value"
          >
            <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3 lg:grid-cols-5">
              {statusBreakdown.map((s) => {
                const style = STATUS_STYLES[s.key] ?? STATUS_STYLES.default;
                return (
                  <div key={s.key} className={"rounded-lg border p-3 " + style.bg}>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className={style.text}>{style.icon}</span>
                      <span className="truncate text-[11px] font-semibold text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <div className={"text-lg font-black tabular-nums " + style.text}>{s.count}</div>
                    <div className="text-[10px] text-muted-foreground">{bdt(s.value)}</div>
                  </div>
                );
              })}
            </div>
          </ReportCard>

          <ReportCard
            title="Revenue & profit trend"
            hint="Only settled orders (delivered / partial / returned / cancelled) move this chart — running orders haven't earned anything yet"
          >
            {trend.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                No settled orders in this range yet
              </div>
            ) : (
              <div className="h-64 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ov-received" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ov-profit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      width={36}
                    />
                    <Tooltip
                      formatter={(v: number, key: string) => [
                        bdt(v),
                        key === "received" ? "Received" : "Admin profit",
                      ]}
                      labelFormatter={(l) => `Date: ${l}`}
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    />
                    <Legend
                      formatter={(v) => (v === "received" ? "Received" : "Admin profit")}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="received"
                      stroke="hsl(var(--primary))"
                      fill="url(#ov-received)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="adminProfit"
                      stroke="#10b981"
                      fill="url(#ov-profit)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </ReportCard>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ReportCard
                title="Where the money goes"
                hint="Out of every taka received, in this range"
              >
                <div className="p-4">
                  <MoneyFlowBar
                    label="Reseller payout"
                    value={pnl.resellerPayout}
                    of={pnl.received}
                    tone="sky"
                  />
                  <MoneyFlowBar
                    label="Product buying cost"
                    value={pnl.buyCost}
                    of={pnl.received}
                    tone="amber"
                  />
                  <MoneyFlowBar
                    label="Delivery cost (courier)"
                    value={pnl.deliverySpend}
                    of={pnl.received}
                    tone="violet"
                  />
                  <MoneyFlowBar
                    label="Packaging cost"
                    value={pnl.packaging}
                    of={pnl.received}
                    tone="rose"
                  />
                  <MoneyFlowBar
                    label="Other expenses"
                    value={pnl.expenses}
                    of={pnl.received}
                    tone="orange"
                  />
                  <MoneyFlowBar
                    label="Agent commission"
                    value={pnl.agentCommission}
                    of={pnl.received}
                    tone="indigo"
                  />
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold">
                    <span>Net profit kept</span>
                    <span className={pnl.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}>
                      {bdt(pnl.netProfit)}
                    </span>
                  </div>
                </div>
              </ReportCard>
            </div>

            <div className="lg:col-span-1">
              <ReportCard
                title="Top products"
                hint="By admin profit in this range"
                right={
                  <button
                    type="button"
                    onClick={() => setTab("products")}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    All products <ArrowRight className="h-3 w-3" />
                  </button>
                }
              >
                <div className="p-4">
                  <TopList
                    empty="No product sales yet"
                    rows={[...productRows]
                      .sort((a, b) => b.adminProfit - a.adminProfit)
                      .slice(0, 5)
                      .map((r) => ({
                        key: r.key,
                        name: r.name,
                        sub: `${r.saleQty} sold · ${r.orders} orders`,
                        value: r.adminProfit,
                      }))}
                  />
                </div>
              </ReportCard>
            </div>

            <div className="lg:col-span-1">
              <ReportCard
                title="Top resellers"
                hint="By admin profit in this range"
                right={
                  <button
                    type="button"
                    onClick={() => setTab("resellers")}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    All resellers <ArrowRight className="h-3 w-3" />
                  </button>
                }
              >
                <div className="p-4">
                  <TopList
                    empty="No reseller orders yet"
                    rows={[...resellerRows]
                      .sort((a, b) => b.adminProfit - a.adminProfit)
                      .slice(0, 5)
                      .map((r) => ({
                        key: r.key,
                        name: r.name,
                        sub: `${r.delivered} delivered · ${r.orders} orders`,
                        value: r.adminProfit,
                      }))}
                  />
                </div>
              </ReportCard>
            </div>
          </div>

          {supplierRows.length > 0 && (
            <ReportCard
              title="Top suppliers by cost"
              hint="How much of your buying cost goes to each supplier"
              right={
                <button
                  type="button"
                  onClick={() => setTab("suppliers")}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  All suppliers <ArrowRight className="h-3 w-3" />
                </button>
              }
            >
              <div className="p-4">
                <TopList
                  tone="amber"
                  empty="No supplier-linked sales yet"
                  rows={supplierRows.slice(0, 5).map((r) => ({
                    key: r.key,
                    name: r.name,
                    sub: `${r.qty} pcs · ${r.orders} orders`,
                    value: r.buyCost,
                  }))}
                />
              </div>
            </ReportCard>
          )}
        </div>
      )}

      {tab === "products" && (
        <>
          <ReportCard
            title="Most selling products"
            hint="Default: highest sale count first. Click any column arrow to sort."
          >
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className={th + " text-left"}>Product</th>
                  <SortTh
                    label="Orders"
                    sortKey="orders"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                  />
                  <SortTh
                    label="Sale count"
                    sortKey="saleQty"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                    hint="Quantity the customer kept"
                  />
                  <SortTh
                    label="Returned"
                    sortKey="returnedQty"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                  />
                  <SortTh
                    label="Sell value"
                    sortKey="sellValue"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                  />
                  <SortTh
                    label="Admin revenue"
                    sortKey="adminRevenue"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                  />
                  <SortTh
                    label="Buying cost"
                    sortKey="buyCost"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                  />
                  <SortTh
                    label="Total profit"
                    sortKey="adminProfit"
                    active={prodSort.key}
                    dir={prodSort.dir}
                    onSort={sortP}
                    hint="Admin revenue − buying cost"
                  />
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((r) => (
                  <tr key={r.key} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted">
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{r.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            #{r.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{r.orders}</td>
                    <td className="px-3 py-2 text-center font-semibold tabular-nums">
                      {r.saleQty}
                    </td>
                    <td className="px-3 py-2 text-center text-muted-foreground">
                      {r.returnedQty || "—"}
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums">{bdt(r.sellValue)}</td>
                    <td className="px-3 py-2 text-center tabular-nums">{bdt(r.adminRevenue)}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                      {bdt(r.buyCost)}
                    </td>
                    <td
                      className={
                        "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit)
                      }
                    >
                      {bdt(r.adminProfit)}
                    </td>
                  </tr>
                ))}
                {pagedProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-xs text-muted-foreground"
                    >
                      No product sold in this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ReportCard>
          <Pagination page={page} perPage={perPage} total={productRows.length} onPage={setPage} />
        </>
      )}

      {tab === "resellers" && (
        <>
          <ReportCard title="Reseller report" hint={ADMIN_PROFIT_HINT}>
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className={th + " text-left"}>Reseller</th>
                  <SortTh
                    label="Orders"
                    sortKey="orders"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Delivered"
                    sortKey="delivered"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Partial"
                    sortKey="partial"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Failed"
                    sortKey="failed"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Running"
                    sortKey="running"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                    hint="Still in progress — money not counted"
                  />
                  <SortTh
                    label="Order value"
                    sortKey="value"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Received"
                    sortKey="received"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                    hint="Courier collection + advance already taken"
                  />
                  <SortTh
                    label="Delivery cost"
                    sortKey="deliverySpend"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                    hint="What the courier actually charged us"
                  />
                  <SortTh
                    label="Reseller profit"
                    sortKey="resellerProfit"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                  <SortTh
                    label="Admin profit"
                    sortKey="adminProfit"
                    active={resSort.key}
                    dir={resSort.dir}
                    onSort={sortR}
                  />
                </tr>
              </thead>
              <tbody>
                {pagedResellers.map((r) => (
                  <tr key={r.key} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <ResellerAvatar
                          url={avatarByReseller.get(r.key) ?? null}
                          name={r.name}
                          size={28}
                        />
                        <div className="min-w-0">
                          <div className="font-medium">{r.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {r.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-semibold">{r.orders}</td>
                    <td className="px-3 py-2 text-center text-success">{r.delivered}</td>
                    <td className="px-3 py-2 text-center text-amber-600">{r.partial || "—"}</td>
                    <td className="px-3 py-2 text-center text-destructive">{r.failed || "—"}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">
                      {r.running || "—"}
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums">{bdt(r.value)}</td>
                    <td className="px-3 py-2 text-center tabular-nums">
                      {bdt(r.received)}
                      {r.advance > 0 && (
                        <div className="text-[9px] text-primary">adv {bdt(r.advance)} included</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                      {bdt(r.deliverySpend)}
                    </td>
                    <td
                      className={"px-3 py-2 text-center tabular-nums " + toneOf(r.resellerProfit)}
                    >
                      {bdt(r.resellerProfit)}
                    </td>
                    <td
                      className={
                        "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit)
                      }
                    >
                      {bdt(r.adminProfit)}
                    </td>
                  </tr>
                ))}
                {pagedResellers.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-3 py-10 text-center text-xs text-muted-foreground"
                    >
                      No reseller order in this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ReportCard>
          <Pagination page={page} perPage={perPage} total={resellerRows.length} onPage={setPage} />
        </>
      )}

      {tab === "suppliers" && (
        <>
          <ReportCard
            title="Supplier report"
            hint="Money owed to each supplier for the items customers actually kept — attributed from the supplier frozen on each order line at booking time"
          >
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className={th + " text-left"}>Supplier</th>
                  <SortTh
                    label="Orders"
                    sortKey="orders"
                    active={supSort.key}
                    dir={supSort.dir}
                    onSort={sortS}
                  />
                  <SortTh
                    label="Sold qty"
                    sortKey="qty"
                    active={supSort.key}
                    dir={supSort.dir}
                    onSort={sortS}
                    hint="Kept quantity across finished orders"
                  />
                  <SortTh
                    label="Returned qty"
                    sortKey="returnedQty"
                    active={supSort.key}
                    dir={supSort.dir}
                    onSort={sortS}
                  />
                  <SortTh
                    label="Amount owed"
                    sortKey="buyCost"
                    active={supSort.key}
                    dir={supSort.dir}
                    onSort={sortS}
                    hint="Buying cost × kept quantity, at the price on record when each order was placed"
                  />
                </tr>
              </thead>
              <tbody>
                {pagedSuppliers.map((s) => (
                  <tr key={s.key} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500/10 text-amber-600">
                          <Factory className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium">{s.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {s.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-semibold">{s.orders}</td>
                    <td className="px-3 py-2 text-center">{s.qty}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">
                      {s.returnedQty || "—"}
                    </td>
                    <td className="px-3 py-2 text-center font-semibold tabular-nums">
                      {bdt(s.buyCost)}
                    </td>
                  </tr>
                ))}
                {pagedSuppliers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-10 text-center text-xs text-muted-foreground"
                    >
                      No supplier-linked sale in this range. Set each product's supplier under Admin
                      → Products to see this report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ReportCard>
          <Pagination page={page} perPage={perPage} total={supplierRows.length} onPage={setPage} />
        </>
      )}

      {tab === "couriers" && (
        <ReportCard
          title="Courier report"
          hint="Parcel count, parcel value and admin profit per courier."
        >
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/20">
              <tr>
                <th className={th + " text-left"}>Courier</th>
                <SortTh
                  label="Parcels"
                  sortKey="parcels"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Delivered"
                  sortKey="delivered"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                  hint="Delivered + partial parcels"
                />
                <SortTh
                  label="Returned"
                  sortKey="returned"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Running"
                  sortKey="running"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Parcel value"
                  sortKey="value"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Received"
                  sortKey="received"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Charged"
                  sortKey="deliveryCharged"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                  hint="Delivery charge taken from customers"
                />
                <SortTh
                  label="Courier bill"
                  sortKey="courierBill"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                  hint="Actual courier cost"
                />
                <SortTh
                  label="Delivery gain"
                  sortKey="deliveryMargin"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
                <SortTh
                  label="Admin profit"
                  sortKey="adminProfit"
                  active={couSort.key}
                  dir={couSort.dir}
                  onSort={sortC}
                />
              </tr>
            </thead>
            <tbody>
              {courierRows.map((r) => (
                <tr key={r.key} className="border-t">
                  <td className="px-3 py-2 font-medium capitalize">{r.name}</td>
                  <td className="px-3 py-2 text-center font-semibold">{r.parcels}</td>
                  <td className="px-3 py-2 text-center text-success">{r.delivered}</td>
                  <td className="px-3 py-2 text-center text-destructive">{r.returned || "—"}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">
                    {r.running || "—"}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">{bdt(r.value)}</td>
                  <td className="px-3 py-2 text-center tabular-nums">{bdt(r.received)}</td>
                  <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                    {bdt(r.deliveryCharged)}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                    {bdt(r.courierBill)}
                  </td>
                  <td className={"px-3 py-2 text-center tabular-nums " + toneOf(r.deliveryMargin)}>
                    {bdt(r.deliveryMargin)}
                  </td>
                  <td
                    className={
                      "px-3 py-2 text-center font-semibold tabular-nums " + toneOf(r.adminProfit)
                    }
                  >
                    {bdt(r.adminProfit)}
                  </td>
                </tr>
              ))}
              {courierRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-xs text-muted-foreground">
                    No parcel in this range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ReportCard>
      )}

      {tab === "agents" && (
        <>
          <ReportCard title="Agent report" hint={AGENT_COMMISSION_HINT}>
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className={th + " text-left"}>Agent</th>
                  <SortTh
                    label="Resellers"
                    sortKey="resellers"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Orders"
                    sortKey="orders"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Sales"
                    sortKey="sales"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Target"
                    sortKey="target"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Achieved"
                    sortKey="achieved"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Commission"
                    sortKey="commission"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Admin profit"
                    sortKey="adminProfit"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                  <SortTh
                    label="Net after commission"
                    sortKey="netAdminProfit"
                    active={agtSort.key}
                    dir={agtSort.dir}
                    onSort={sortA}
                  />
                </tr>
              </thead>
              <tbody>
                {pagedAgents.map((r) => (
                  <tr key={r.key} className="border-t">
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{r.resellers}</td>
                    <td className="px-3 py-2 text-center">{r.orders}</td>
                    <td className="px-3 py-2 text-center tabular-nums">{bdt(r.sales)}</td>
                    <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
                      {r.target ? bdt(r.target) : "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {r.target ? (
                        <div className="mx-auto w-24">
                          <div className="mb-1 text-[11px] font-semibold">
                            {r.achieved.toFixed(0)}%
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={
                                "h-full rounded-full " +
                                (r.achieved >= 100 ? "bg-success" : "bg-primary")
                              }
                              style={{ width: `${Math.min(r.achieved, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No target</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums">
                      {bdt(r.commission)}
                      <div className="text-[9px] text-muted-foreground">{r.rate}% rate</div>
                    </td>
                    <td className={"px-3 py-2 text-center tabular-nums " + toneOf(r.adminProfit)}>
                      {bdt(r.adminProfit)}
                    </td>
                    <td
                      className={
                        "px-3 py-2 text-center font-semibold tabular-nums " +
                        toneOf(r.netAdminProfit)
                      }
                    >
                      {bdt(r.netAdminProfit)}
                    </td>
                  </tr>
                ))}
                {pagedAgents.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-10 text-center text-xs text-muted-foreground"
                    >
                      No agent yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ReportCard>
          <Pagination page={page} perPage={perPage} total={agentRows.length} onPage={setPage} />
        </>
      )}

      {tab === "pnl" && (
        <>
          <ReportCard
            title="Admin profit & loss"
            hint={ADMIN_PROFIT_HINT}
            right={
              <Link
                to="/admin/expenses"
                className="inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent"
              >
                <Receipt className="mr-1.5 h-3.5 w-3.5" /> Manage expenses
              </Link>
            }
          >
            <table className="w-full min-w-[560px] text-sm">
              <tbody>
                {[
                  {
                    label: "Order value",
                    value: pnl.value,
                    muted: true,
                    note: `${pnl.orders} orders counted · ${pnl.deliveredOrders} delivered, ${pnl.partialOrders} partial, ${pnl.failedOrders} returned/cancelled`,
                  },
                  {
                    label: "Received (incl. advance)",
                    value: pnl.received,
                    note: `advance ${bdt(pnl.advance)} counted as received — same as the transaction report`,
                  },
                  {
                    label: "Reseller final payout",
                    value: -pnl.resellerPayout,
                    note: "what the resellers earn from these orders",
                  },
                  {
                    label: "Product buying cost",
                    value: -pnl.buyCost,
                    note: "your buying price of the kept items",
                  },
                  {
                    label: "Delivery cost paid to courier",
                    value: -pnl.deliverySpend,
                    note: `customers were charged ${bdt(pnl.deliveryCharged)} — ${pnl.deliveryMargin >= 0 ? "gain" : "loss"} ${bdt(Math.abs(pnl.deliveryMargin))}`,
                  },
                  {
                    label: "Packaging cost",
                    value: -pnl.packaging,
                    note: "packaging of the parcels in this range",
                  },
                ].map((r) => (
                  <tr key={r.label} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[11px] text-muted-foreground">{r.note}</div>
                    </td>
                    <td
                      className={
                        "px-3 py-2 text-right font-semibold tabular-nums " +
                        (r.muted ? "text-muted-foreground" : toneOf(r.value))
                      }
                    >
                      {bdt(r.value)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-muted/30">
                  <td className="px-3 py-2 font-bold">Gross profit</td>
                  <td
                    className={
                      "px-3 py-2 text-right font-bold tabular-nums " + toneOf(pnl.grossProfit)
                    }
                  >
                    {bdt(pnl.grossProfit)}
                  </td>
                </tr>
                {pnl.expenseByCategory.map((c) => (
                  <tr key={c.category} className="border-t">
                    <td className="px-3 py-2 pl-8 capitalize text-muted-foreground">
                      Expense · {c.category}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-destructive">
                      −{bdt(c.amount)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">Other expenses</div>
                    <div className="text-[11px] text-muted-foreground">
                      Delivery, courier and packaging expense entries are skipped here because every
                      order already carries its real delivery and packaging cost above
                      {pnl.skippedExpenses > 0 ? ` (${bdt(pnl.skippedExpenses)} skipped)` : ""}.
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-destructive">
                    −{bdt(pnl.expenses)}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">Agent commission</div>
                    <div className="text-[11px] text-muted-foreground">
                      Earned commission of all agents on these orders
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-destructive">
                    −{bdt(pnl.agentCommission)}
                  </td>
                </tr>
                <tr className="border-t bg-primary/5">
                  <td className="px-3 py-3 text-base font-black">Net admin profit</td>
                  <td
                    className={
                      "px-3 py-3 text-right text-base font-black tabular-nums " +
                      toneOf(pnl.netProfit)
                    }
                  >
                    {bdt(pnl.netProfit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </ReportCard>

          <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Other expenses"
              value={bdt(pnl.expenses)}
              hint={`${scopedExpenses.length} expense entries in this range`}
              icon={<Receipt className="h-4 w-4" />}
              tone="rose"
            />
            <StatCard
              label="Delivery gain/loss"
              value={bdt(pnl.deliveryMargin)}
              hint={`Charged ${bdt(pnl.deliveryCharged)} − paid ${bdt(pnl.deliverySpend)}`}
              icon={<Truck className="h-4 w-4" />}
              tone="sky"
            />
            <StatCard
              label="Packaging cost"
              value={bdt(pnl.packaging)}
              hint="Already deducted in the statement above"
              icon={<Boxes className="h-4 w-4" />}
              tone="violet"
            />
            <StatCard
              label="Agent commission"
              value={bdt(pnl.agentCommission)}
              hint="Deducted from the net profit"
              icon={<Target className="h-4 w-4" />}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------- overview bits -------------------------------- */

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: ReactNode }> = {
  new: {
    bg: "bg-slate-500/5 border-slate-500/15",
    text: "text-slate-600",
    icon: <CircleDot className="h-3.5 w-3.5" />,
  },
  forwarded: {
    bg: "bg-indigo-500/5 border-indigo-500/15",
    text: "text-indigo-600",
    icon: <Send className="h-3.5 w-3.5" />,
  },
  confirmed: {
    bg: "bg-blue-500/5 border-blue-500/15",
    text: "text-blue-600",
    icon: <ClipboardCheck className="h-3.5 w-3.5" />,
  },
  packaging: {
    bg: "bg-violet-500/5 border-violet-500/15",
    text: "text-violet-600",
    icon: <Package className="h-3.5 w-3.5" />,
  },
  handover: {
    bg: "bg-purple-500/5 border-purple-500/15",
    text: "text-purple-600",
    icon: <PackageSearch className="h-3.5 w-3.5" />,
  },
  courier: {
    bg: "bg-cyan-500/5 border-cyan-500/15",
    text: "text-cyan-600",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  delivered: {
    bg: "bg-emerald-500/5 border-emerald-500/15",
    text: "text-emerald-600",
    icon: <PackageCheck className="h-3.5 w-3.5" />,
  },
  pending_partial: {
    bg: "bg-amber-500/5 border-amber-500/15",
    text: "text-amber-600",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  partial_full: {
    bg: "bg-amber-500/5 border-amber-500/15",
    text: "text-amber-600",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  partial_item: {
    bg: "bg-amber-500/5 border-amber-500/15",
    text: "text-amber-600",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  partial_delivery: {
    bg: "bg-amber-500/5 border-amber-500/15",
    text: "text-amber-600",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  pending_return: {
    bg: "bg-orange-500/5 border-orange-500/15",
    text: "text-orange-600",
    icon: <Undo2 className="h-3.5 w-3.5" />,
  },
  returned: {
    bg: "bg-rose-500/5 border-rose-500/15",
    text: "text-rose-600",
    icon: <Undo2 className="h-3.5 w-3.5" />,
  },
  damaged: {
    bg: "bg-red-500/5 border-red-500/15",
    text: "text-red-600",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  cancelled: {
    bg: "bg-gray-500/8 border-gray-500/20",
    text: "text-gray-600",
    icon: <Ban className="h-3.5 w-3.5" />,
  },
  default: {
    bg: "bg-muted/30 border-border",
    text: "text-muted-foreground",
    icon: <CircleDot className="h-3.5 w-3.5" />,
  },
};

const FLOW_TONES: Record<string, string> = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  indigo: "bg-indigo-500",
};

function MoneyFlowBar({
  label,
  value,
  of,
  tone,
}: {
  label: string;
  value: number;
  of: number;
  tone: keyof typeof FLOW_TONES;
}) {
  const pct = of > 0 ? Math.max(0, Math.min(100, (value / of) * 100)) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{bdt(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={"h-full rounded-full " + FLOW_TONES[tone]} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TopList({
  rows,
  empty,
  tone = "primary",
}: {
  rows: { key: string; name: string; sub: string; value: number }[];
  empty: string;
  tone?: "primary" | "amber";
}) {
  if (rows.length === 0) {
    return <div className="py-6 text-center text-xs text-muted-foreground">{empty}</div>;
  }
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={r.key} className="flex items-center gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium">{r.name}</span>
              <span className={"shrink-0 text-xs font-semibold tabular-nums " + toneOf(r.value)}>
                {bdt(r.value)}
              </span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={
                  "h-full rounded-full " + (tone === "amber" ? "bg-amber-500" : "bg-primary")
                }
                style={{ width: `${Math.max(4, (Math.abs(r.value) / max) * 100)}%` }}
              />
            </div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{r.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
