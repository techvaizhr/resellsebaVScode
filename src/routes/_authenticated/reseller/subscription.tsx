import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Check, Wallet, CreditCard, ShieldCheck, Store, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { AppModal } from "@/components/ui-kit/AppModal";
import { bdt } from "@/lib/finance-report";
import { cfgString } from "@/lib/payment-methods";
import {
  CYCLES,
  cycleLabel,
  fetchMySubscription,
  fmtDate,
  payFromEarning,
  planPrice,
  requestManualPayment,
  savingPercent,
  statusClass,
  statusLabel,
  type MySubscription,
  type SubscriptionPlan,
} from "@/lib/subscription";

export const Route = createFileRoute("/_authenticated/reseller/subscription")({
  component: SubscriptionPage,
  head: () => ({
    meta: [
      { title: "My subscription — Reseller plan & billing" },
      {
        name: "description",
        content: "See your active plan, renew for 1, 3, 6 or 12 months and pay from your earnings or by wallet transfer.",
      },
      { property: "og:title", content: "My subscription — Reseller plan & billing" },
      { property: "og:description", content: "Plan status, renewal prices and payment history in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SubscriptionPage() {
  const [data, setData] = useState<MySubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState<{ plan: SubscriptionPlan; months: number } | null>(null);

  async function load() {
    try {
      setData(await fetchMySubscription());
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  const state = data?.state;
  const available = Math.max(0, Number(data?.balance ?? 0) - Number(data?.frozen ?? 0));

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
        title="My subscription"
        description="Your plan decides what stays open — the panel alone, or the panel plus your public store."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current plan"
          value={state?.plan_name ?? "No plan"}
          hint={state?.includes_store ? "Panel + storefront" : "Panel only"}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Status"
          value={statusLabel(state?.status)}
          hint={
            state?.status === "grace"
              ? `${state.grace_days_left ?? 0} day(s) of grace left`
              : `${state?.days_left ?? 0} day(s) left`
          }
          icon={<Check className="h-4 w-4" />}
        />
        <StatCard label="Renews / expires" value={fmtDate(state?.ends_at)} hint="End of the paid period" icon={<CreditCard className="h-4 w-4" />} />
        <StatCard label="Available balance" value={bdt(available)} hint="Earnings you can spend" icon={<Wallet className="h-4 w-4" />} />
      </div>

      {state?.status === "grace" ? (
        <div className="surface-card border-amber-500/40 bg-amber-500/10 p-4 text-xs font-medium text-amber-700 dark:text-amber-400">
          Your plan ended on {fmtDate(state.current_period_end ?? state.ends_at)}. You have{" "}
          {state.grace_days_left ?? 0} day(s) of grace access left — renew now to avoid losing the panel and your store.
        </div>
      ) : null}
      {state?.status === "expired" ? (
        <div className="surface-card border-destructive/40 bg-destructive/10 p-4 text-xs font-medium text-destructive">
          Your subscription has expired. Renew below to unlock the panel, your storefront and new orders.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {(data?.plans ?? []).map((plan) => {
          const current = state?.plan_id === plan.id;
          return (
            <div key={plan.id} className={"surface-card p-5 " + (current ? "ring-1 ring-primary" : "")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {plan.includes_store ? <Store className="h-4 w-4 text-primary" /> : <LayoutDashboard className="h-4 w-4 text-primary" />}
                    <h3 className="text-sm font-semibold">{plan.name}</h3>
                    {current ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Current</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Reseller panel, catalog and orders</li>
                <li className="flex items-center gap-1.5">
                  <Check className={"h-3.5 w-3.5 " + (plan.includes_store ? "text-success" : "text-muted-foreground/40")} />
                  Public storefront and custom domain {plan.includes_store ? "" : "(not included)"}
                </li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> {plan.trial_days} day free trial · {plan.grace_days} day grace</li>
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {CYCLES.map((m) => {
                  const save = savingPercent(plan, m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCheckout({ plan, months: m })}
                      className="rounded-lg border p-3 text-left transition hover:border-primary hover:bg-muted/40"
                    >
                      <div className="text-[11px] font-medium text-muted-foreground">{cycleLabel(m)}</div>
                      <div className="text-sm font-semibold tabular-nums">{bdt(planPrice(plan, m))}</div>
                      {save > 0 ? <div className="text-[10px] font-semibold text-success">Save {save}%</div> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <PaymentHistory rows={data?.payments ?? []} />

      {checkout ? (
        <CheckoutModal
          plan={checkout.plan}
          months={checkout.months}
          available={available}
          methods={data?.methods ?? []}
          onClose={() => setCheckout(null)}
          onDone={() => {
            setCheckout(null);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}

function PaymentHistory({ rows }: { rows: NonNullable<MySubscription["payments"]> }) {
  if (rows.length === 0) {
    return <EmptyState title="No subscription payments yet" description="Your renewals will be listed here." />;
  }
  return (
    <div className="surface-card overflow-hidden">
      <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-4 rounded-t-lg border-b bg-muted/40 px-4 py-2 text-center text-xs font-medium text-muted-foreground md:grid">
        <div className="text-left">Plan</div>
        <div className="text-left">Paid with</div>
        <div>Period</div>
        <div>Amount</div>
        <div>Status</div>
      </div>
      {rows.map((p) => (
        <div key={p.id} className="grid grid-cols-1 items-center gap-1 border-b px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_auto_auto_auto] md:gap-4 md:text-center">
          <div className="text-left text-xs font-medium">{p.note ?? "Subscription"} <span className="text-muted-foreground">· {cycleLabel(p.cycle_months)}</span></div>
          <div className="text-left text-xs text-muted-foreground">
            {p.source === "earning" ? "From earnings" : p.source === "admin" ? "Added by admin" : p.method ?? "Manual"}
            {p.reference ? ` · ${p.reference}` : ""}
          </div>
          <div className="text-xs tabular-nums text-muted-foreground">{fmtDate(p.period_to)}</div>
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
        </div>
      ))}
    </div>
  );
}

function CheckoutModal({
  plan,
  months,
  available,
  methods,
  onClose,
  onDone,
}: {
  plan: SubscriptionPlan;
  months: number;
  available: number;
  methods: NonNullable<MySubscription["methods"]>;
  onClose: () => void;
  onDone: () => void;
}) {
  const amount = planPrice(plan, months);
  const [tab, setTab] = useState<"earning" | "manual">(available >= amount ? "earning" : "manual");
  const [methodId, setMethodId] = useState<string>(methods[0]?.id ?? "");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const method = useMemo(() => methods.find((m) => m.id === methodId) ?? null, [methods, methodId]);

  async function submit() {
    setBusy(true);
    try {
      if (tab === "earning") {
        await payFromEarning(plan.id, months);
        toast.success("Subscription renewed from your earnings");
      } else {
        if (!reference.trim()) throw new Error("Enter the transaction ID you paid with");
        await requestManualPayment({ planId: plan.id, months, paymentConfigId: methodId || null, reference, note });
        toast.success("Payment submitted — admin will verify it shortly");
      }
      onDone();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppModal
      title={`${plan.name} · ${cycleLabel(months)}`}
      subtitle={`Total payable ${bdt(amount)}`}
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
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {tab === "earning" ? "Pay from earnings" : "Submit payment"}
          </button>
        </div>
      }
    >
      <div className="mb-4 inline-flex rounded-xl border bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setTab("earning")}
          className={"rounded-lg px-3 py-1.5 text-xs font-semibold " + (tab === "earning" ? "bg-card shadow-sm" : "text-muted-foreground")}
        >
          From earnings
        </button>
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={"rounded-lg px-3 py-1.5 text-xs font-semibold " + (tab === "manual" ? "bg-card shadow-sm" : "text-muted-foreground")}
        >
          Wallet / bank payment
        </button>
      </div>

      {tab === "earning" ? (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Available balance</span>
            <span className="font-semibold tabular-nums">{bdt(available)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Subscription fee</span>
            <span className="font-semibold tabular-nums">-{bdt(amount)}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
            <span className="text-muted-foreground">Balance after payment</span>
            <span className="font-semibold tabular-nums">{bdt(available - amount)}</span>
          </div>
          {available < amount ? (
            <p className="text-destructive">
              Not enough balance — pay by wallet / bank instead, or wait until more orders are settled.
            </p>
          ) : (
            <p className="text-muted-foreground">
              The fee is deducted immediately and appears in your transaction report as money out.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block font-medium">Payment method</label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            >
              {methods.length === 0 ? <option value="">No method configured</option> : null}
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          {method ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              {cfgString(method.config as never, "account") ? (
                <div className="font-semibold">
                  {cfgString(method.config as never, "account")}{" "}
                  <span className="text-muted-foreground">{cfgString(method.config as never, "account_type")}</span>
                </div>
              ) : null}
              {method.instructions ? <p className="mt-1 text-muted-foreground">{method.instructions}</p> : null}
            </div>
          ) : null}
          <div>
            <label className="mb-1 block font-medium">Transaction ID</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. 9F7C2K1LMN"
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-xs"
            />
          </div>
          <p className="text-muted-foreground">
            Your plan is extended once admin verifies the payment. Manual payments do not touch your earning balance.
          </p>
        </div>
      )}
    </AppModal>
  );
}
