import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getResellerDashboard, clearBootstrapCache } from "@/lib/bootstrap";
import { useDepositStatus } from "@/lib/deposit";
import { DepositNotice } from "@/components/deposit-notice";
import { AdminPaymentNumbersCard } from "@/components/admin-payment-numbers-card";
import { AdminNoticePopup } from "@/components/admin-notice-popup";
import { useLiveNotices } from "@/lib/admin-notices";
import { useAuth } from "@/lib/use-auth";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { DateRangeBar, DEFAULT_DATE_RANGE, resolveRange, type DateRangeState } from "@/components/date-range-filter";
import {
  ReportCard,
  StatusReportTable,
  ProductReportTable,
  TrendReportTable,
} from "@/components/report-blocks";
import { buildFinanceReport, bdt, type ReportItem, type ReportOrder } from "@/lib/finance-report";
import { NewOrderModal } from "@/components/NewOrderModal";
import { supabase } from "@/integrations/laravel/client";
import {
  ShoppingBag,
  TrendingUp,
  ClipboardList,
  Wallet,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Award,
  Package,
  Plus,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, Cell } from "recharts";

type Listing = {
  id: string;
  selling_price: number;
  products: {
    id: string;
    name: string;
    product_code: string;
    reseller_price: number;
    packaging_cost: number;
    delivery_inside: number;
    delivery_outside: number;
    delivery_mode: string | null;
    delivery_flat: number | null;
    og_image_url: string | null;
  } | null;
};


export const Route = createFileRoute("/_authenticated/reseller/")({
  component: ResellerDashboard,
});

const BAR_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4", "#a855f7", "#f97316", "#14b8a6"];

type PayoutRow = { amount: number | string; status: string; created_at: string };
type CommissionRow = { amount: number | string; status: string; created_at: string };

function ResellerDashboard() {
  const { user } = useAuth();
  const [range, setRange] = useState<DateRangeState>(DEFAULT_DATE_RANGE);
  const [loading, setLoading] = useState(true);
  const [rid, setRid] = useState<string | null>(null);
  const [bizName, setBizName] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [listingsReport, setListingsReport] = useState({ total: 0, active: 0 });
  const [orders, setOrders] = useState<ReportOrder[]>([]);
  const [items, setItems] = useState<ReportItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [lifetime, setLifetime] = useState({ delivered: 0, pendingPayout: 0, paidOut: 0, available: 0 });
  const [toCourierCount, setToCourierCount] = useState(0);
  const [topResellers, setTopResellers] = useState<{ name: string; sales: number }[]>([]);
  const { status: deposit } = useDepositStatus(rid);
  const { notices: adminNotices, dismiss: dismissNotice } = useLiveNotices(user?.id, rid);

  const uid = user?.id;

  const load = useCallback(
    async (r: DateRangeState) => {
      if (!uid) return;
      setLoading(true);
      const { fromTs, toTs } = resolveRange(r);
      // ONE call: reseller + orders + items + payouts + commissions + listings + catalog.
      const data = await getResellerDashboard(uid, fromTs, toTs, true);
      if (!data?.reseller) {
        setLoading(false);
        return;
      }
      setRid(data.reseller.id);
      setBizName(data.reseller.business_name);
      setOrders((data.orders ?? []) as ReportOrder[]);
      setItems((data.items ?? []) as ReportItem[]);
      setListingsReport({ total: data.listings_total ?? 0, active: data.listings_active ?? 0 });
      setPayouts((data.payouts ?? []) as PayoutRow[]);
      setCommissions((data.commissions ?? []) as CommissionRow[]);
      setListings((data.listings ?? []) as Listing[]);
      setAllProducts((data.products ?? []) as any[]);
      setTopResellers((data.top_resellers ?? []) as { name: string; sales: number }[]);
      const s = data.summary;
      setLifetime({
        delivered: Number(s?.delivered_profit ?? 0),
        pendingPayout: Number(s?.pending_payout ?? 0),
        paidOut: Number(s?.paid_out ?? 0),
        available: Number(s?.available ?? 0),
      });
      // Current "To Courier" count (shipped/processing) — independent of the date range.
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("reseller_id", data.reseller.id)
        .in("status", ["shipped", "processing"]);
      setToCourierCount(count ?? 0);
      setLoading(false);
    },
    [uid],
  );



  useEffect(() => {
    void load(range);
  }, [load, range]);

  const report = useMemo(() => buildFinanceReport(orders, items, { trend: "day" }), [orders, items]);

  const inR = useCallback(
    (created: string) => {
      const { fromTs, toTs } = resolveRange(range);
      const ts = new Date(created).getTime();
      if (fromTs != null && ts < fromTs) return false;
      if (toTs != null && ts > toTs) return false;
      return true;
    },
    [range],
  );

  const paidInRange = useMemo(
    () =>
      payouts
        .filter((p) => p.status === "paid" && inR(p.created_at))
        .reduce((s, p) => s + Number(p.amount), 0),
    [payouts, inR],
  );
  const requestedInRange = useMemo(
    () =>
      payouts
        .filter((p) => ["pending", "approved"].includes(p.status) && inR(p.created_at))
        .reduce((s, p) => s + Number(p.amount), 0),
    [payouts, inR],
  );
  const commissionInRange = useMemo(
    () => commissions.filter((c) => inR(c.created_at)).reduce((s, c) => s + Number(c.amount), 0),
    [commissions, inR],
  );
  const commissionLifetime = useMemo(
    () => commissions.reduce((s, c) => s + Number(c.amount), 0),
    [commissions],
  );

  const chart = useMemo(
    () =>
      report.trend
        .slice(0, 60)
        .map((t) => ({
          day: t.key.slice(5),
          orders: t.orders,
          profit: Math.round(t.deliveredProfit),
        }))
        .reverse(),
    [report.trend],
  );

  return (
    <div>
      <PageHeader
        title={`Welcome, ${bizName ?? (user as any)?.user_metadata?.full_name ?? user?.name ?? "Reseller"}`}
        description="Track your earnings, orders, and business growth."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOrderOpen(true)}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-elegant transition-all hover:opacity-90 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add order
            </button>
            <Link
              to="/reseller/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90 active:scale-95"
            >
              <Package className="h-4 w-4" /> Catalog
            </Link>
          </div>
        }

      />

      <DepositNotice status={deposit} place="dashboard" />

      <AdminPaymentNumbersCard />

      <AdminNoticePopup notices={adminNotices} onDismiss={dismissNotice} />

      <section className="mb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total Profit"
            to="/reseller/transactions"
              tone="primary"
            value={bdt(lifetime.delivered + commissionLifetime)}
            icon={<TrendingUp className="h-4 w-4" />}
            hint="Total − delivery − product − packaging"
          />
          <StatCard
            label="Available Balance"
            to="/reseller/payouts"
              tone="emerald"
            value={bdt(lifetime.available)}
            icon={<Wallet className="h-4 w-4" />}
            hint="Ready for payout"
          />
          <StatCard
            label="Total Paid"
            to="/reseller/payouts"
              tone="sky"
            value={bdt(lifetime.paidOut)}
            icon={<CheckCircle2 className="h-4 w-4" />}
            hint="Sent to your account"
          />
          <StatCard
            label="Outstanding"
            to="/reseller/transactions"
              tone="amber"
            value={bdt(Math.max(lifetime.delivered + commissionLifetime - lifetime.paidOut, 0))}
            icon={<Clock className="h-4 w-4" />}
            hint="Unpaid profit"
          />
          <StatCard
            label="Live Products"
            to="/reseller/listings"
              tone="violet"
            value={listingsReport.active}
            icon={<ShoppingBag className="h-4 w-4" />}
            hint="Active listings"
          />
          <StatCard
            label="To Courier"
            to="/reseller/orders"
            search={{ tab: "courier" }}
            tone="sky"
            value={toCourierCount}
            icon={<Truck className="h-4 w-4" />}
            hint="Orders with courier"
          />
        </div>
      </section>

      <div className="mb-4 flex justify-end">
        <DateRangeBar value={range} onChange={setRange} compact />
      </div>

      {loading && !orders.length ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Orders"
              to="/reseller/orders" search={{ tab: "all" }}
              tone="sky"
              value={report.all.orders}
              icon={<ClipboardList className="h-4 w-4" />}
            />
            <StatCard
              label="Earned profit"
              to="/reseller/orders" search={{ tab: "delivered" }}
              tone="emerald"
              value={bdt(report.realized.profit)}
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <StatCard
              label="Pending profit"
              to="/reseller/orders" search={{ tab: "confirmed" }}
              tone="amber"
              value={bdt(report.pipeline.profit)}
              icon={<Clock className="h-4 w-4" />}
            />
            <StatCard
              label="Paid out (range)"
              to="/reseller/payouts"
              tone="primary"
              value={bdt(paidInRange)}
              icon={<Wallet className="h-4 w-4" />}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="On the way (courier)"
              to="/reseller/orders" search={{ tab: "courier" }}
              tone="sky"
              value={bdt(report.byStatusTab.courier?.customerTotal ?? 0)}
              icon={<Truck className="h-4 w-4" />}
            />
            <StatCard
              label="Return risk"
              to="/reseller/orders" search={{ tab: "pending_return" }}
              tone="amber"
              value={bdt(report.risk.profit)}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <StatCard
              label="Lost (return + cancel)"
              to="/reseller/orders" search={{ tab: "returned" }}
              tone="rose"
              value={bdt(report.lost.profit)}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <StatCard
              label="Delivery rate"
              to="/reseller/orders" search={{ tab: "delivered" }}
              tone="emerald"
              value={`${report.deliveryRate.toFixed(1)}%`}
              icon={<Award className="h-4 w-4" />}
            />
          </div>

          {commissionLifetime > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Team commission (range)"
                to="/reseller/commissions"
              tone="violet"
                value={bdt(commissionInRange)}
                icon={<Award className="h-4 w-4" />}
              />
            </div>
          )}


          <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="surface-card group p-6 hover:border-primary/50">
              <div className="mb-4 flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Profit & Order Insights</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#gradOrders)"
                      name="Orders"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      fill="url(#gradProfit)"
                      name="Profit ৳"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card group p-6 hover:border-primary/50">
              <div className="mb-4 flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Top Reseller Performance</h3>
              </div>
              <div className="h-72">
                {topResellers.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topResellers} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                        {topResellers.map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground">No reseller data for this range.</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ReportCard title="Status wise money">
              <StatusReportTable report={report} showAdminCost />
            </ReportCard>

            <ReportCard
              title="Top products"
              right={
                <Link to="/reseller/listings" className="inline-flex items-center gap-1.5 text-xs text-primary">
                  <Package className="h-3.5 w-3.5" /> Manage listings
                </Link>
              }
            >
              <ProductReportTable products={report.products} limit={10} showCost />
            </ReportCard>

            <ReportCard title="Day wise trend">
              <TrendReportTable trend={report.trend} limit={31} />
            </ReportCard>
          </div>

          {!rid && <p className="text-sm text-muted-foreground">Reseller profile pawa jaini.</p>}
        </>
      )}

      {orderOpen && rid && (
        <NewOrderModal
          listings={listings}
          allProducts={allProducts}
          resellerId={rid}
          onClose={() => setOrderOpen(false)}
          onCreated={() => {
            setOrderOpen(false);
            clearBootstrapCache("rdash:");
            void load(range);
          }}
        />
      )}
    </div>
  );
}

