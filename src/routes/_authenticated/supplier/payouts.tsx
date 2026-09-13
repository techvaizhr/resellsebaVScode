import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Wallet, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { supabase } from "@/integrations/laravel/client";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, supplierAvailable } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/payouts")({
  component: SupplierPayoutsPage,
  head: () => ({
    meta: [
      { title: "Payouts — Supplier panel" },
      {
        name: "description",
        content: "Withdraw the money earned from delivered items and follow every payout request.",
      },
      { property: "og:title", content: "Payouts — Supplier panel" },
      {
        property: "og:description",
        content: "Supplier earning, available balance and withdrawal history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const inp =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function statusStyle(s: string) {
  return s === "paid"
    ? "bg-success/20 text-success"
    : s === "approved"
      ? "bg-primary/15 text-primary"
      : s === "rejected"
        ? "bg-destructive/20 text-destructive"
        : "bg-warning/20 text-warning-foreground";
}

function SupplierPayoutsPage() {
  const { data, reload } = useSupplier();
  const supplier = data.supplier!;
  const t = data.totals;
  const available = supplierAvailable(t);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const hasAccount = Boolean(supplier.payout_method && supplier.payout_account_number);
  const rows = data.payouts;

  async function request(e: React.FormEvent) {
    e.preventDefault();
    if (!hasAccount) return toast.error("Please save your payout details in your profile first.");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Please enter a valid amount");
    if (amt > available) return toast.error(`Maximum withdrawable is ${bdtNum(available)}`);
    setBusy(true);
    const reference =
      supplier.payout_method === "bank"
        ? `${supplier.payout_bank_name ?? ""} · ${supplier.payout_account_number} · ${supplier.payout_account_name ?? ""}`
        : `${supplier.payout_account_number} · ${supplier.payout_account_name ?? ""}`;
    const { error } = await supabase.from("supplier_payouts").insert({
      supplier_id: supplier.id,
      amount: amt,
      method: supplier.payout_method,
      reference,
      note: note || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setAmount("");
    setNote("");
    toast.success("Payout request submitted");
    await reload();
  }

  return (
    <div>
      <PageHeader
        title="Payouts"
        description="Withdraw money earned from delivered items here."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total earning"
          value={bdtNum(t.earning)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Available"
          value={bdtNum(available)}
          hint="Ready to request"
          icon={<Wallet className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="In request"
          value={bdtNum(t.pending_payout)}
          icon={<Clock className="h-4 w-4" />}
          tone="amber"
        />
        <StatCard
          label="Paid out"
          value={bdtNum(t.paid)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          tone="emerald"
        />
      </div>

      <div className="surface-card mb-4 grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Method"
          value={<span className="capitalize">{supplier.payout_method ?? "—"}</span>}
        />
        <Info label="Account name" value={supplier.payout_account_name ?? "—"} />
        <Info label="Account number" value={supplier.payout_account_number ?? "—"} />
        <Info
          label="Bank / branch"
          value={
            [supplier.payout_bank_name, supplier.payout_branch].filter(Boolean).join(" · ") || "—"
          }
        />
      </div>

      <p className="mb-4 rounded-lg border bg-muted/30 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
        Calculation: Total earning ({bdtNum(t.earning)}) − Paid ({bdtNum(t.paid)}) − Pending request
        ({bdtNum(t.pending_payout)}) ={" "}
        <span className="font-bold text-foreground">{bdtNum(available)}</span> is withdrawable.
      </p>

      {!hasAccount && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs">
          Please save your bank/mobile account details on the <b>My profile</b> page before requesting a payout.
        </div>
      )}

      <form
        onSubmit={request}
        className="surface-card mb-6 grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label className="mb-1 block text-xs font-medium">Amount (৳)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min={1}
            max={available > 0 ? available : undefined}
            className={inp}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Maximum withdrawable{" "}
            <span className="font-semibold text-foreground">{bdtNum(available)}</span>
            {t.pending_payout > 0 && <> · in request {bdtNum(t.pending_payout)}</>}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Note (optional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inp} />
        </div>
        <div className="flex items-end">
          <button
            disabled={busy || available <= 0}
            className="btn-brand inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Request payout
          </button>
        </div>
      </form>

      {/* Payout history — mobile cards */}
      <div className="space-y-2 md:hidden">
        {rows.length === 0 ? (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            No payouts yet.
          </div>
        ) : (
          rows.map((p) => (
            <div key={p.id} className="surface-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold tabular-nums">{bdtNum(Number(p.amount))}</div>
                  <div className="text-[11px] capitalize text-muted-foreground">
                    {p.method ?? "—"} · {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status)
                  }
                >
                  {p.status}
                </span>
              </div>
              {p.admin_note && (
                <p className="mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">Admin note:</span> {p.admin_note}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="surface-card hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Status</th>
              <th className="p-3">Paid at</th>
              <th className="p-3">Admin note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="p-3 font-medium tabular-nums">{bdtNum(Number(p.amount))}</td>
                <td className="p-3 capitalize">{p.method ?? "—"}</td>
                <td className="p-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[10px] capitalize " + statusStyle(p.status)
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {p.admin_note || p.reference || "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No payouts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
