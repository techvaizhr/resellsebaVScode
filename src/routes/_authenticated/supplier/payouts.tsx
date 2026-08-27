import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Wallet, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { supabase } from "@/integrations/supabase/client";
import { useSupplier } from "@/components/supplier-context";
import { bdtNum, supplierAvailable } from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/supplier/payouts")({
  component: SupplierPayoutsPage,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-sky-500/10 text-sky-600",
  paid: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

function SupplierPayoutsPage() {
  const { data, reload } = useSupplier();
  const supplier = data.supplier!;
  const t = data.totals;
  const available = supplierAvailable(t);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const hasAccount = Boolean(supplier.payout_method && supplier.payout_account_number);

  async function request(e: React.FormEvent) {
    e.preventDefault();
    if (!hasAccount) return toast.error("প্রোফাইলে পেআউট তথ্য আগে সেভ করুন।");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("সঠিক পরিমাণ দিন");
    if (amt > available) return toast.error(`সর্বোচ্চ ${bdtNum(available)} তোলা যাবে`);
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
      <PageHeader title="Payouts" description="ডেলিভারি হওয়া আইটেমের টাকা এখান থেকে উইথড্র করুন।" />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total earning" value={bdtNum(t.earning)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Available" value={bdtNum(available)} hint="Ready to request" icon={<Wallet className="h-4 w-4" />} tone="violet" />
        <StatCard label="Pending" value={bdtNum(t.pending_payout)} icon={<Clock className="h-4 w-4" />} tone="amber" />
        <StatCard label="Paid out" value={bdtNum(t.paid)} icon={<CheckCircle2 className="h-4 w-4" />} tone="emerald" />
      </div>

      <p className="mb-4 rounded-lg border bg-muted/30 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
        হিসাব: মোট আর্নিং ({bdtNum(t.earning)}) − পরিশোধিত ({bdtNum(t.paid)}) − অপেক্ষমান রিকোয়েস্ট ({bdtNum(t.pending_payout)}) ={" "}
        <span className="font-bold text-foreground">{bdtNum(available)}</span> উইথড্র করা যাবে।
      </p>

      {!hasAccount && (
        <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs">
          পেআউট রিকোয়েস্ট করার আগে <b>My profile</b> পেজে ব্যাংক/মোবাইল অ্যাকাউন্ট তথ্য সেভ করুন।
        </div>
      )}

      <form onSubmit={request} className="surface-card mb-6 grid gap-3 p-4 sm:p-5 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="mb-1 block text-xs font-medium">Amount (৳)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={0} className={inp} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Note (optional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inp} />
        </div>
        <div className="flex items-end">
          <button
            disabled={busy || available <= 0}
            className="btn-brand inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Request payout
          </button>
        </div>
      </form>

      <div className="surface-card p-4">
        <div className="mb-3 text-sm font-semibold">Payout history</div>
        {data.payouts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            কোনো পেআউট রিকোয়েস্ট নেই।
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-2">Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Paid at</th>
                  <th>Admin note</th>
                </tr>
              </thead>
              <tbody>
                {data.payouts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="font-semibold tabular-nums">{bdtNum(Number(p.amount))}</td>
                    <td className="capitalize text-muted-foreground">{p.method ?? "—"}</td>
                    <td>
                      <span className={"rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (STATUS_TONE[p.status] ?? "bg-muted")}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}</td>
                    <td className="text-muted-foreground">{p.admin_note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
