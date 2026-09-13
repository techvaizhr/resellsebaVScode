import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Download, Pencil, Check, X, Plus, Wallet, Users, BadgeCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { AppModal } from "@/components/ui-kit/AppModal";
import { Pagination, usePaginated } from "@/components/data-list";
import { bdt, toCsv, downloadCsv } from "@/lib/finance-report";
import { useCan } from "@/lib/use-auth";
import {
  CYCLES,
  cycleLabel,
  fetchSubscriptionOverview,
  fmtDate,
  planPrice,
  reviewSubscriptionPayment,
  savePlan,
  setResellerSubscription,
  statusClass,
  statusLabel,
  type SubscriptionOverview,
  type SubscriptionPayment,
  type SubscriptionPlan,
  type Subscriber,
} from "@/lib/subscription";

export const Route = createFileRoute("/_authenticated/admin/subscriptions")({
  component: AdminSubscriptionsPage,
  head: () => ({
    meta: [
      { title: "Subscriptions — Plans, subscribers and billing" },
      {
        name: "description",
        content:
          "Manage reseller subscription plans, per-reseller pricing and trials, approve payment requests and track subscription revenue.",
      },
      { property: "og:title", content: "Subscriptions — Plans, subscribers and billing" },
      { property: "og:description", content: "Plans, subscribers, payment requests and revenue in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Tab = "plans" | "subscribers" | "payments" | "revenue";

function PerPage({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-md border bg-background px-2 py-2 text-xs"
      title="Per page"
    >
      {[10, 20, 50, 100].map((n) => (
        <option key={n} value={n}>
          {n} / page
        </option>
      ))}
      <option value={-1}>All</option>
    </select>
  );
}

function AdminSubscriptionsPage() {
  const can = useCan();
  const canManage = can("subscriptions.manage");
  const [tab, setTab] = useState<Tab>("subscribers");
  const [data, setData] = useState<SubscriptionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [editSub, setEditSub] = useState<Subscriber | null>(null);

  async function load() {
    try {
      setData(await fetchSubscriptionOverview());
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  const plans = data?.plans ?? [];
  const subscribers = data?.subscribers ?? [];
  const payments = data?.payments ?? [];
  const pending = payments.filter((p) => p.status === "pending");
  const paid = payments.filter((p) => p.status === "paid");
  const revenue = paid.reduce((a, p) => a + Number(p.amount), 0);
  const activeCount = subscribers.filter((s) => ["active", "trial", "exempt"].includes(s.state?.status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Subscriptions"
        description="Plans decide what a reseller can use — the panel alone, or the panel plus a public storefront."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Subscribers" value={String(subscribers.length)} hint="Reseller accounts" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active access" value={String(activeCount)} hint="Active, trial or free access" icon={<BadgeCheck className="h-4 w-4" />} />
        <StatCard label="Pending payments" value={String(pending.length)} hint="Waiting for your review" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Collected" value={bdt(revenue)} hint="All approved subscription payments" icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="inline-flex flex-wrap rounded-xl border bg-muted/30 p-1">
        {(
          [
            ["subscribers", `Subscribers (${subscribers.length})`],
            ["payments", `Payment requests (${pending.length})`],
            ["plans", `Plans (${plans.length})`],
            ["revenue", "Revenue"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              "rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors " +
              (tab === key ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "subscribers" ? (
        <SubscribersTab rows={subscribers} plans={plans} canManage={canManage} onEdit={setEditSub} />
      ) : tab === "payments" ? (
        <PaymentsTab rows={payments} canManage={canManage} onReload={load} />
      ) : tab === "plans" ? (
        <PlansTab plans={plans} canManage={canManage} onEdit={setEditPlan} />
      ) : (
        <RevenueTab rows={paid} />
      )}

      {editPlan ? (
        <PlanModal
          plan={editPlan}
          onClose={() => setEditPlan(null)}
          onSaved={() => {
            setEditPlan(null);
            void load();
          }}
        />
      ) : null}
      {editSub ? (
        <SubscriberModal
          row={editSub}
          plans={plans}
          onClose={() => setEditSub(null)}
          onSaved={() => {
            setEditSub(null);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}

function SubscribersTab({
  rows,
  plans,
  canManage,
  onEdit,
}: {
  rows: Subscriber[];
  plans: SubscriptionPlan[];
  canManage: boolean;
  onEdit: (r: Subscriber) => void;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const term = q.trim().toLowerCase();
        const okQ = !term || r.business_name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term);
        const okS = status === "all" || r.state?.status === status;
        const okP = plan === "all" || r.state?.plan_id === plan;
        return okQ && okS && okP;
      }),
    [rows, q, status, plan],
  );
  useEffect(() => setPage(1), [q, status, plan, perPage]);
  const pageRows = usePaginated(filtered, page, perPage);

  if (rows.length === 0) return <EmptyState title="No resellers yet" description="Subscriptions appear once resellers sign up." />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search reseller or code"
          className="w-full rounded-md border bg-background px-3 py-2 text-xs sm:w-64"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-xs">
          <option value="all">All statuses</option>
          {["trial", "active", "grace", "expired", "exempt", "none"].map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-xs">
          <option value="all">All plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <PerPage value={perPage} onChange={setPerPage} />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_auto_auto_auto_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid">
          <div className="text-left">Reseller</div>
          <div className="text-left">Plan</div>
          <div>Status</div>
          <div>Ends</div>
          <div>Balance</div>
          <div></div>
        </div>
        {pageRows.map((r) => (
          <div
            key={r.reseller_id}
            className="grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.4fr_1fr_auto_auto_auto_auto] md:gap-4 md:text-center"
          >
            <div className="text-left">
              <div className="text-xs font-semibold">{r.business_name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{r.code}</div>
            </div>
            <div className="text-left text-xs">
              {r.state?.plan_name ?? "—"}
              <div className="text-[10px] text-muted-foreground">{r.state?.includes_store ? "Panel + store" : "Panel only"}</div>
            </div>
            <div>
              <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold " + statusClass(r.state?.status)}>
                {statusLabel(r.state?.status)}
              </span>
            </div>
            <div className="text-xs tabular-nums text-muted-foreground">{fmtDate(r.state?.ends_at)}</div>
            <div className="text-xs font-medium tabular-nums">{bdt(Number(r.balance ?? 0))}</div>
            <div>
              {canManage ? (
                <button
                  type="button"
                  onClick={() => onEdit(r)}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted"
                >
                  <Pencil className="h-3 w-3" /> Manage
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
    </div>
  );
}

function PaymentsTab({
  rows,
  canManage,
  onReload,
}: {
  rows: SubscriptionPayment[];
  canManage: boolean;
  onReload: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((p) =>
      [p.business_name, p.code, p.plan_name, p.reference]
        .some((v) => v?.toLowerCase().includes(term)),
    );
  }, [rows, q]);
  useEffect(() => setPage(1), [q, perPage]);
  const pageRows = usePaginated(filtered, page, perPage);

  async function review(id: string, approve: boolean) {
    setBusy(id);
    try {
      await reviewSubscriptionPayment(id, approve);
      toast.success(approve ? "Payment approved and plan extended" : "Payment rejected");
      await onReload();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) return <EmptyState title="No payments yet" description="Reseller subscription payments show up here." />;

  return (
    <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search reseller, plan or reference"
        className="w-full rounded-md border bg-background px-3 py-2 text-xs sm:w-64"
      />
      <PerPage value={perPage} onChange={setPerPage} />
    </div>
    <div className="surface-card overflow-hidden">
      <div className="hidden grid-cols-[1.2fr_1fr_1fr_auto_auto_auto] gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid">
        <div className="text-left">Reseller</div>
        <div className="text-left">Plan</div>
        <div className="text-left">Paid with</div>
        <div>Amount</div>
        <div>Status</div>
        <div></div>
      </div>
      {pageRows.map((p) => (
        <div
          key={p.id}
          className="grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.2fr_1fr_1fr_auto_auto_auto] md:gap-4 md:text-center"
        >
          <div className="text-left text-xs font-semibold">
            {p.business_name ?? "—"} <span className="font-mono text-[10px] text-muted-foreground">{p.code ?? ""}</span>
          </div>
          <div className="text-left text-xs">
            {p.plan_name ?? "—"} <span className="text-muted-foreground">· {cycleLabel(p.cycle_months)}</span>
          </div>
          <div className="text-left text-xs text-muted-foreground">
            {p.source === "earning" ? "From earnings" : p.source === "admin" ? "Added by admin" : p.method ?? "Manual"}
            {p.reference ? ` · ${p.reference}` : ""}
          </div>
          <div className="text-xs font-semibold tabular-nums">{bdt(Number(p.amount))}</div>
          <div>
            <span
              className={
                "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                (p.status === "paid"
                  ? "bg-success/15 text-success"
                  : p.status === "rejected"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-400")
              }
            >
              {p.status}
            </span>
          </div>
          <div className="flex justify-end gap-1.5 md:justify-center">
            {p.status === "pending" && canManage ? (
              <>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => review(p.id, true)}
                  className="inline-flex items-center gap-1 rounded-md bg-success px-2 py-1 text-[11px] font-semibold text-success-foreground disabled:opacity-60"
                >
                  <Check className="h-3 w-3" /> Approve
                </button>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => review(p.id, false)}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[11px] font-semibold text-destructive disabled:opacity-60"
                >
                  <X className="h-3 w-3" /> Reject
                </button>
              </>
            ) : (
              <span className="text-[11px] text-muted-foreground">{fmtDate(p.reviewed_at ?? p.created_at)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
    <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
    </div>
  );
}

function PlansTab({
  plans,
  canManage,
  onEdit,
}: {
  plans: SubscriptionPlan[];
  canManage: boolean;
  onEdit: (p: Partial<SubscriptionPlan>) => void;
}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  useEffect(() => setPage(1), [perPage]);
  const pagePlans = usePaginated(plans, page, perPage);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {canManage ? (
          <button
            type="button"
            onClick={() => onEdit({ includes_store: false, trial_days: 14, grace_days: 7, is_active: true })}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </button>
        ) : null}
        <PerPage value={perPage} onChange={setPerPage} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {pagePlans.map((p) => (
          <div key={p.id} className="surface-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  {p.name}
                  {p.is_default ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>
                  ) : null}
                </h3>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {p.includes_store ? "Panel + storefront" : "Panel only"} · {p.trial_days}d trial · {p.grace_days}d grace ·{" "}
                  {p.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              {canManage ? (
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              ) : null}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {CYCLES.map((m) => (
                <div key={m} className="rounded-lg border p-2">
                  <div className="text-[10px] text-muted-foreground">{cycleLabel(m)}</div>
                  <div className="text-xs font-semibold tabular-nums">{bdt(planPrice(p, m))}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} perPage={perPage} total={plans.length} onPage={setPage} />
    </div>
  );
}

function RevenueTab({ rows }: { rows: SubscriptionPayment[] }) {
  const byMonth = useMemo(() => {
    const map = new Map<string, { earning: number; manual: number; total: number }>();
    for (const p of rows) {
      const key = new Date(p.created_at).toISOString().slice(0, 7);
      const cur = map.get(key) ?? { earning: 0, manual: 0, total: 0 };
      const amt = Number(p.amount);
      if (p.source === "earning") cur.earning += amt;
      else cur.manual += amt;
      cur.total += amt;
      map.set(key, cur);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [rows]);

  function exportCsv() {
    const csv = toCsv(
      ["Month", "From earnings", "Wallet / bank", "Total"],
      byMonth.map(([m, v]) => [m, v.earning, v.manual, v.total]),
    );
    downloadCsv("subscription-revenue.csv", csv);
  }

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  useEffect(() => setPage(1), [perPage]);
  const pageRows = usePaginated(byMonth, page, perPage);

  if (byMonth.length === 0) return <EmptyState title="No revenue yet" description="Approved subscription payments are summarised here." />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
        <PerPage value={perPage} onChange={setPerPage} />
      </div>
      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-4 gap-4 border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground">
          <div className="text-left">Month</div>
          <div>From earnings</div>
          <div>Wallet / bank</div>
          <div>Total</div>
        </div>
        {pageRows.map(([m, v]) => (
          <div key={m} className="grid grid-cols-4 gap-4 border-b px-4 py-3 text-center text-sm last:border-b-0">
            <div className="text-left text-xs font-medium">{m}</div>
            <div className="text-xs tabular-nums">{bdt(v.earning)}</div>
            <div className="text-xs tabular-nums">{bdt(v.manual)}</div>
            <div className="text-xs font-semibold tabular-nums">{bdt(v.total)}</div>
          </div>
        ))}
      </div>
      <Pagination page={page} perPage={perPage} total={byMonth.length} onPage={setPage} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-md border bg-background px-3 py-2 text-xs";

function PlanModal({
  plan,
  onClose,
  onSaved,
}: {
  plan: Partial<SubscriptionPlan>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<SubscriptionPlan>>({ ...plan });
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<SubscriptionPlan>) => setForm((f) => ({ ...f, ...patch }));

  async function submit() {
    setBusy(true);
    try {
      if (!form.code?.trim() || !form.name?.trim()) throw new Error("Code and name are required");
      await savePlan(form);
      toast.success("Plan saved");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppModal
      title={plan.id ? "Edit plan" : "New plan"}
      subtitle="Prices apply to every reseller unless a per-reseller override is set."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-3 py-1.5 text-xs font-medium">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save plan
          </button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Code">
          <input className={inputCls} value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
        </Field>
        <Field label="Name">
          <input className={inputCls} value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <input className={inputCls} value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </Field>
        </div>
        {(
          [
            ["price_1m", "Price · 1 month"],
            ["price_3m", "Price · 3 months"],
            ["price_6m", "Price · 6 months"],
            ["price_12m", "Price · 12 months"],
            ["trial_days", "Trial days"],
            ["grace_days", "Grace days"],
            ["sort_order", "Sort order"],
          ] as [keyof SubscriptionPlan, string][]
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              type="number"
              className={inputCls}
              value={String(form[key] ?? 0)}
              onChange={(e) => set({ [key]: Number(e.target.value) } as Partial<SubscriptionPlan>)}
            />
          </Field>
        ))}
        <label className="flex items-center gap-2 text-xs font-medium">
          <input type="checkbox" checked={Boolean(form.includes_store)} onChange={(e) => set({ includes_store: e.target.checked })} />
          Includes public storefront
        </label>
        <label className="flex items-center gap-2 text-xs font-medium">
          <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set({ is_active: e.target.checked })} />
          Plan is active
        </label>
        <label className="flex items-center gap-2 text-xs font-medium">
          <input type="checkbox" checked={Boolean(form.is_default)} onChange={(e) => set({ is_default: e.target.checked })} />
          Default plan for new signups
        </label>
      </div>
    </AppModal>
  );
}

function SubscriberModal({
  row,
  plans,
  onClose,
  onSaved,
}: {
  row: Subscriber;
  plans: SubscriptionPlan[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const sub = (row.subscription ?? {}) as Record<string, unknown>;
  const [planId, setPlanId] = useState<string>((sub.plan_id as string) ?? row.state?.plan_id ?? plans[0]?.id ?? "");
  const [isExempt, setIsExempt] = useState(Boolean(sub.is_exempt));
  const [extendMonths, setExtendMonths] = useState(0);
  const [note, setNote] = useState((sub.admin_note as string) ?? "");
  const [overrides, setOverrides] = useState({
    override_price_1m: (sub.override_price_1m as number | null) ?? null,
    override_price_3m: (sub.override_price_3m as number | null) ?? null,
    override_price_6m: (sub.override_price_6m as number | null) ?? null,
    override_price_12m: (sub.override_price_12m as number | null) ?? null,
    override_grace_days: (sub.override_grace_days as number | null) ?? null,
  });
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await setResellerSubscription(row.reseller_id, {
        plan_id: planId,
        is_exempt: isExempt,
        admin_note: note,
        ...overrides,
        ...(extendMonths > 0 ? { extend_months: extendMonths } : {}),
      });
      toast.success("Subscription updated");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const num = (v: number | null) => (v === null || v === undefined ? "" : String(v));

  return (
    <AppModal
      title={row.business_name}
      subtitle={`${statusLabel(row.state?.status)} · ends ${fmtDate(row.state?.ends_at)}`}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-3 py-1.5 text-xs font-medium">
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save changes
          </button>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Plan">
          <select className={inputCls} value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Extend by">
          <select className={inputCls} value={extendMonths} onChange={(e) => setExtendMonths(Number(e.target.value))}>
            <option value={0}>Do not extend</option>
            {CYCLES.map((m) => (
              <option key={m} value={m}>
                {cycleLabel(m)}
              </option>
            ))}
          </select>
        </Field>
        {(
          [
            ["override_price_1m", "Custom price · 1 month"],
            ["override_price_3m", "Custom price · 3 months"],
            ["override_price_6m", "Custom price · 6 months"],
            ["override_price_12m", "Custom price · 12 months"],
            ["override_grace_days", "Custom grace days"],
          ] as [keyof typeof overrides, string][]
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              type="number"
              placeholder="Global value"
              className={inputCls}
              value={num(overrides[key])}
              onChange={(e) => setOverrides((o) => ({ ...o, [key]: e.target.value === "" ? null : Number(e.target.value) }))}
            />
          </Field>
        ))}
        <div className="sm:col-span-2">
          <Field label="Admin note">
            <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium sm:col-span-2">
          <input type="checkbox" checked={isExempt} onChange={(e) => setIsExempt(e.target.checked)} />
          Free access — never lock this reseller out
        </label>
      </div>
    </AppModal>
  );
}
