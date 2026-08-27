import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Wallet, CheckCircle2, XCircle, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { supabase } from "@/integrations/supabase/client";
import { bdtNum, loadAdminSupplierOverview, type AdminSupplierOverview } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/admin/supplier-payouts")({
  component: AdminSupplierPayoutsPage,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-sky-500/10 text-sky-600",
  paid: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

function AdminSupplierPayoutsPage() {
  const [data, setData] = useState<AdminSupplierOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await loadAdminSupplierOverview());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const suppliers = data?.suppliers ?? [];
  const payouts = (data?.payouts ?? []).filter((p) => !filter || p.status === filter);

  const totals = useMemo(
    () => ({
      pending: (data?.payouts ?? []).filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
      approved: (data?.payouts ?? []).filter((p) => p.status === "approved").reduce((s, p) => s + Number(p.amount), 0),
      paid: (data?.payouts ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0),
      due: suppliers.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0),
    }),
    [data, suppliers],
  );

  async function setStatus(id: string, status: "approved" | "paid" | "rejected") {
    setBusyId(id);
    const patch: Record<string, unknown> = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (status === "paid") {
      patch.approved_at = new Date().toISOString();
      patch.paid_at = new Date().toISOString();
    }
    const { error } = await supabase.from("supplier_payouts").update(patch as never).eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Payout updated");
    void load();
  }

  async function createPayout(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) return toast.error("Supplier select করুন");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("সঠিক পরিমাণ দিন");
    setCreating(true);
    const { error } = await supabase.from("supplier_payouts").insert({
      supplier_id: supplierId,
      amount: amt,
      method: method || null,
      reference: reference || null,
      admin_note: note || null,
      status: "paid",
      approved_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    } as never);
    setCreating(false);
    if (error) return toast.error(error.message);
    setAmount("");
    setReference("");
    setNote("");
    toast.success("Payment recorded");
    void load();
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const selected = suppliers.find((s) => s.id === supplierId);
  const available = selected ? Math.max(selected.earning - selected.paid - selected.pending_payout, 0) : 0;

  return (
    <div>
      <PageHeader title="Supplier payouts" description="সাপ্লায়ারের উইথড্র রিকোয়েস্ট অ্যাপ্রুভ/পে করুন, বা সরাসরি পেমেন্ট রেকর্ড করুন।" />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Payable now" value={bdtNum(totals.due)} tone="violet" icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Pending requests" value={bdtNum(totals.pending)} tone="amber" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Approved" value={bdtNum(totals.approved)} />
        <StatCard label="Paid" value={bdtNum(totals.paid)} tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <form onSubmit={createPayout} className="surface-card mb-4 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium">Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={inp}>
            <option value="">— Select —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name} ({s.code})
              </option>
            ))}
          </select>
          {selected && <p className="mt-1 text-[11px] text-muted-foreground">Payable: {bdtNum(available)}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Amount (৳)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={0} className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Method</label>
          <input value={method} onChange={(e) => setMethod(e.target.value)} placeholder="bkash / bank" className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Reference / note</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} className={inp} />
        </div>
        <div className="flex items-end">
          <button
            disabled={creating}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Record payment
          </button>
        </div>
      </form>

      <div className="mb-3 flex flex-wrap gap-2">
        {([["", "All"], ["pending", "Pending"], ["approved", "Approved"], ["paid", "Paid"], ["rejected", "Rejected"]] as const).map(
          ([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
                (filter === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
              }
            >
              {label}
            </button>
          ),
        )}
      </div>

      {payouts.length === 0 ? (
        <EmptyState title="No payouts" description="কোনো পেআউট রেকর্ড নেই।" />
      ) : (
        <div className="surface-card overflow-x-auto p-4">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
              <tr>
                <th className="p-2">Date</th>
                <th>Supplier</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="font-medium">{p.supplier_name}</td>
                  <td className="font-semibold tabular-nums">{bdtNum(Number(p.amount))}</td>
                  <td className="capitalize text-muted-foreground">{p.method ?? "—"}</td>
                  <td className="text-muted-foreground">{p.reference ?? p.note ?? "—"}</td>
                  <td>
                    <span className={"rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (TONE[p.status] ?? "bg-muted")}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <div className="inline-flex flex-wrap justify-end gap-1">
                      {p.status === "pending" && (
                        <>
                          <Btn busy={busyId === p.id} onClick={() => setStatus(p.id, "approved")} label="Approve" icon={<CheckCircle2 className="h-3 w-3" />} />
                          <Btn busy={busyId === p.id} onClick={() => setStatus(p.id, "rejected")} label="Reject" danger icon={<XCircle className="h-3 w-3" />} />
                        </>
                      )}
                      {(p.status === "pending" || p.status === "approved") && (
                        <Btn busy={busyId === p.id} onClick={() => setStatus(p.id, "paid")} label="Mark paid" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Btn({
  label,
  onClick,
  busy,
  danger,
  icon,
}: {
  label: string;
  onClick: () => void;
  busy?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={
        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 " +
        (danger ? "border-destructive/40 text-destructive hover:bg-destructive/10" : "hover:bg-muted")
      }
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : icon} {label}
    </button>
  );
}
