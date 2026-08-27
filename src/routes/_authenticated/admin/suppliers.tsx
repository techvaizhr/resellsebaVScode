import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, Truck, Undo2, Wallet, CheckCircle2, XCircle, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { supabase } from "@/integrations/supabase/client";
import {
  bdtNum,
  loadAdminSupplierOverview,
  orderStatusLabel,
  type AdminSupplierOverview,
} from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/admin/suppliers")({
  component: AdminSuppliersPage,
});

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  active: "bg-emerald-500/10 text-emerald-600",
  suspended: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
  approved: "bg-sky-500/10 text-sky-600",
  paid: "bg-emerald-500/10 text-emerald-600",
};

type Tab = "suppliers" | "returns" | "payouts";

function AdminSuppliersPage() {
  const [data, setData] = useState<AdminSupplierOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("suppliers");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const totals = useMemo(() => {
    const list = data?.suppliers ?? [];
    return {
      count: list.length,
      pending: list.filter((s) => s.status === "pending").length,
      earning: list.reduce((s, r) => s + r.earning, 0),
      due: list.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0),
      returns: (data?.returns ?? []).filter((r) => r.status === "pending_handover").length,
    };
  }, [data]);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    const patch: { status: string; approved_at?: string } = { status };
    if (status === "active") patch.approved_at = new Date().toISOString();
    const { error } = await supabase.from("suppliers").update(patch as never).eq("id", id);

    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Supplier updated");
    void load();
  }

  async function handover(id: string, next: "handed_over" | "pending_handover") {
    setBusyId(id);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("supplier_returns")
      .update({
        status: next,
        handed_over_at: next === "handed_over" ? new Date().toISOString() : null,
        handed_over_by: next === "handed_over" ? u.user?.id ?? null : null,
      })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(next === "handed_over" ? "Marked handed over" : "Reverted");
    void load();
  }

  async function payoutStatus(id: string, status: "approved" | "paid" | "rejected") {
    setBusyId(id);
    const patch: { status: string; approved_at?: string; paid_at?: string } = { status };
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

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const needle = q.trim().toLowerCase();
  const suppliers = (data?.suppliers ?? []).filter(
    (s) =>
      !needle ||
      s.display_name.toLowerCase().includes(needle) ||
      s.code.toLowerCase().includes(needle) ||
      (s.email ?? "").toLowerCase().includes(needle) ||
      (s.contact_phone ?? "").includes(needle),
  );
  const returns = (data?.returns ?? []).filter(
    (r) =>
      !needle ||
      (r.supplier_name ?? "").toLowerCase().includes(needle) ||
      r.product_name.toLowerCase().includes(needle) ||
      String(r.order_number).toLowerCase().includes(needle),
  );
  const payouts = (data?.payouts ?? []).filter(
    (p) => !needle || (p.supplier_name ?? "").toLowerCase().includes(needle),
  );

  return (
    <div>
      <PageHeader title="Suppliers" description="সাপ্লায়ার অ্যাকাউন্ট, তাদের বিক্রির হিসাব, রিটার্ন হ্যান্ডওভার ও পেআউট।" />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Suppliers" value={totals.count} icon={<Truck className="h-4 w-4" />} />
        <StatCard label="Pending approval" value={totals.pending} tone="amber" />
        <StatCard label="Supplier earning" value={bdtNum(totals.earning)} icon={<PackageCheck className="h-4 w-4" />} tone="emerald" />
        <StatCard label="Payable now" value={bdtNum(totals.due)} icon={<Wallet className="h-4 w-4" />} tone="violet" />
        <StatCard label="Returns to hand over" value={totals.returns} icon={<Undo2 className="h-4 w-4" />} tone="rose" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {([
          ["suppliers", `Suppliers (${data?.suppliers.length ?? 0})`],
          ["returns", `Returns (${data?.returns.length ?? 0})`],
          ["payouts", `Payouts (${data?.payouts.length ?? 0})`],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
              (tab === k ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
            }
          >
            {label}
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={inp + " pl-8"} />
        </div>
      </div>

      {tab === "suppliers" && (
        <div className="surface-card p-4">
          {suppliers.length === 0 ? (
            <Empty text="কোনো সাপ্লায়ার নেই।" />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2">Supplier</th>
                    <th>Contact</th>
                    <th>Products</th>
                    <th>Sold</th>
                    <th>Earning</th>
                    <th>Returned</th>
                    <th>Paid</th>
                    <th>Payable</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => {
                    const payable = Math.max(s.earning - s.paid - s.pending_payout, 0);
                    return (
                      <tr key={s.id} className="border-t">
                        <td className="p-2">
                          <div className="font-medium">{s.display_name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.code}</div>
                        </td>
                        <td className="text-muted-foreground">
                          <div>{s.contact_phone ?? "—"}</div>
                          <div className="text-[11px]">{s.email ?? ""}</div>
                        </td>
                        <td className="tabular-nums">{s.products}</td>
                        <td className="tabular-nums">{s.sold_qty}</td>
                        <td className="font-semibold tabular-nums">{bdtNum(s.earning)}</td>
                        <td className="tabular-nums text-muted-foreground">
                          {s.returned_qty} · {bdtNum(s.returned_amount)}
                        </td>
                        <td className="tabular-nums">{bdtNum(s.paid)}</td>
                        <td className="font-semibold tabular-nums text-primary">{bdtNum(payable)}</td>
                        <td>
                          <span className={"rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (STATUS_TONE[s.status] ?? "bg-muted")}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-1">
                            {s.status !== "active" && (
                              <Action busy={busyId === s.id} onClick={() => setStatus(s.id, "active")} label="Approve" />
                            )}
                            {s.status === "active" && (
                              <Action busy={busyId === s.id} onClick={() => setStatus(s.id, "suspended")} label="Suspend" />
                            )}
                            {s.status === "pending" && (
                              <Action busy={busyId === s.id} onClick={() => setStatus(s.id, "rejected")} label="Reject" danger />
                            )}
                            <Action onClick={() => setEditFor(s)} label="Edit" icon={<Pencil className="h-3 w-3" />} />
                            <Action onClick={() => setResetFor(s)} label="Password" icon={<KeyRound className="h-3 w-3" />} />
                            {s.status === "active" && (
                              <Action
                                busy={busyId === s.id}
                                onClick={() => void loginAsSupplier(s)}
                                label="Login as"
                                icon={<LogIn className="h-3 w-3" />}
                              />
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "returns" && (
        <div className="surface-card p-4">
          {returns.length === 0 ? (
            <Empty text="কোনো সাপ্লায়ার রিটার্ন নেই।" />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2">Date</th>
                    <th>Supplier</th>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Value</th>
                    <th>Order status</th>
                    <th>Handover</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="font-medium">{r.supplier_name}</td>
                      <td>#{r.order_number}</td>
                      <td className="text-muted-foreground">{r.product_name}</td>
                      <td className="tabular-nums">{r.quantity}</td>
                      <td className="font-semibold tabular-nums">{bdtNum(Number(r.quantity) * Number(r.unit_price))}</td>
                      <td className="capitalize text-muted-foreground">{orderStatusLabel(r.order_status)}</td>
                      <td>
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                            (r.status === "handed_over" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")
                          }
                        >
                          {r.status === "handed_over" ? "Handed over" : "Waiting"}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        {r.status === "handed_over" ? (
                          <Action busy={busyId === r.id} onClick={() => handover(r.id, "pending_handover")} label="Undo" />
                        ) : (
                          <Action busy={busyId === r.id} onClick={() => handover(r.id, "handed_over")} label="Hand over" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "payouts" && (
        <div className="surface-card p-4">
          {payouts.length === 0 ? (
            <Empty text="কোনো পেআউট রিকোয়েস্ট নেই।" />
          ) : (
            <div className="overflow-x-auto rounded-md border">
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
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="font-medium">{p.supplier_name}</td>
                      <td className="font-semibold tabular-nums">{bdtNum(Number(p.amount))}</td>
                      <td className="capitalize text-muted-foreground">{p.method ?? "—"}</td>
                      <td className="text-muted-foreground">{p.reference ?? "—"}</td>
                      <td>
                        <span className={"rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " + (STATUS_TONE[p.status] ?? "bg-muted")}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1">
                          {p.status === "pending" && (
                            <>
                              <Action busy={busyId === p.id} onClick={() => payoutStatus(p.id, "approved")} label="Approve" icon={<CheckCircle2 className="h-3 w-3" />} />
                              <Action busy={busyId === p.id} onClick={() => payoutStatus(p.id, "rejected")} label="Reject" danger icon={<XCircle className="h-3 w-3" />} />
                            </>
                          )}
                          {(p.status === "pending" || p.status === "approved") && (
                            <Action busy={busyId === p.id} onClick={() => payoutStatus(p.id, "paid")} label="Mark paid" />
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
      )}
    </div>
  );
}

function Action({
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

function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">{text}</div>;
}
