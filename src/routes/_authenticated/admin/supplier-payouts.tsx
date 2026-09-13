import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Wallet, CheckCircle2, XCircle, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { DataToolbar, Pagination, usePaginated } from "@/components/data-list";
import { StatusTabs } from "@/components/status-tabs";
import { supabase } from "@/integrations/laravel/client";
import { bdtNum, loadAdminSupplierOverview, type AdminSupplierOverview } from "@/lib/supplier";
import { useCan } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/admin/supplier-payouts")({
  component: AdminSupplierPayoutsPage,
  head: () => ({
    meta: [
      { title: "Supplier payouts — Admin" },
      {
        name: "description",
        content: "Approve, reject or record supplier withdrawals and track payable balance.",
      },
      { property: "og:title", content: "Supplier payouts — Admin" },
      { property: "og:description", content: "Supplier withdrawal requests and manual payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const inp =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-sky-500/10 text-sky-600",
  paid: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "paid", label: "Paid" },
  { key: "rejected", label: "Rejected" },
];

function AdminSupplierPayoutsPage() {
  const [data, setData] = useState<AdminSupplierOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [creating, setCreating] = useState(false);
  const can = useCan();
  const canManage = can("suppliers.manage", "payouts.manage");

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
  const all = data?.payouts ?? [];

  const scoped = useMemo(() => {
    let out = all;
    if (supplierFilter) out = out.filter((p) => p.supplier_id === supplierFilter);
    const q = search.trim().toLowerCase();
    if (q)
      out = out.filter(
        (p) =>
          (p.supplier_name ?? "").toLowerCase().includes(q) ||
          (p.method ?? "").toLowerCase().includes(q) ||
          (p.reference ?? "").toLowerCase().includes(q),
      );
    return out;
  }, [all, supplierFilter, search]);

  const rows = useMemo(
    () => (tab === "all" ? scoped : scoped.filter((p) => p.status === tab)),
    [scoped, tab],
  );
  const count = useCallback(
    (k: string) => (k === "all" ? scoped.length : scoped.filter((p) => p.status === k).length),
    [scoped],
  );

  const totals = useMemo(
    () => ({
      pending: all.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0),
      approved: all
        .filter((p) => p.status === "approved")
        .reduce((s, p) => s + Number(p.amount), 0),
      paid: all.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0),
      due: suppliers.reduce((s, r) => s + Math.max(r.earning - r.paid - r.pending_payout, 0), 0),
    }),
    [all, suppliers],
  );

  const paged = usePaginated(rows, page, perPage);

  async function setStatus(id: string, status: "approved" | "paid" | "rejected") {
    setBusyId(id);
    const patch: Record<string, unknown> = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (status === "paid") {
      patch.approved_at = new Date().toISOString();
      patch.paid_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from("supplier_payouts")
      .update(patch as never)
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Payout updated");
    void load();
  }

  async function createPayout(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) return toast.error("Please select a supplier");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Please enter a valid amount");
    setCreating(true);
    const { error } = await supabase.from("supplier_payouts").insert({
      supplier_id: supplierId,
      amount: amt,
      method: method || null,
      reference: reference || null,
      status: "paid",
      approved_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    } as never);
    setCreating(false);
    if (error) return toast.error(error.message);
    setAmount("");
    setReference("");
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
  const available = selected
    ? Math.max(selected.earning - selected.paid - selected.pending_payout, 0)
    : 0;

  return (
    <div>
      <PageHeader
        title="Supplier payouts"
        description="Approve/pay supplier withdrawal requests, or record a payment directly."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Payable now"
          value={bdtNum(totals.due)}
          tone="violet"
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Pending requests"
          value={bdtNum(totals.pending)}
          tone="amber"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Approved"
          value={bdtNum(totals.approved)}
          tone="sky"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          label="Paid"
          value={bdtNum(totals.paid)}
          tone="emerald"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      {canManage && (
      <form
        onSubmit={createPayout}
        className="surface-card mb-4 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
      >
        <div>
          <label className="mb-1 block text-xs font-medium">Supplier</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className={inp}
          >
            <option value="">— Select —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.display_name} ({s.code})
              </option>
            ))}
          </select>
          {selected && (
            <p className="mt-1 text-[11px] text-muted-foreground">Payable: {bdtNum(available)}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Amount (৳)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min={0}
            className={inp}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Method</label>
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="bkash / bank"
            className={inp}
          />
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
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{" "}
            Record payment
          </button>
        </div>
      </form>
      )}

      <StatusTabs
        tabs={TABS}
        tab={tab}
        onChange={(k) => {
          setTab(k);
          setPage(1);
        }}
        count={count}
      />

      <DataToolbar
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search supplier, method, reference…"
        filters={[
          {
            key: "supplier",
            label: "Supplier",
            value: supplierFilter,
            onChange: (v) => {
              setSupplierFilter(v);
              setPage(1);
            },
            options: [
              { value: "", label: "All suppliers" },
              ...suppliers.map((s) => ({ value: s.id, label: s.display_name })),
            ],
          },
        ]}
        perPage={perPage}
        onPerPage={(n) => {
          setPerPage(n);
          setPage(1);
        }}
      />

      {rows.length === 0 ? (
        <EmptyState title="No payouts" description="No payout records." />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {paged.map((p) => (
              <div key={p.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.supplier_name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()} · {p.method ?? "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">{bdtNum(Number(p.amount))}</div>
                    <span
                      className={
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " +
                        (TONE[p.status] ?? "bg-muted")
                      }
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
                {(p.reference || p.note) && (
                  <p className="mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground">
                    {p.reference ?? p.note}
                  </p>
                )}
                <Actions
                  p={p}
                  busy={busyId === p.id}
                  setStatus={setStatus}
                  canManage={canManage}
                  className="mt-3 justify-end"
                />
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="surface-card hidden overflow-x-auto md:block">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-left uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paged.map((p) => (
                  <tr key={p.id}>
                    <td className="whitespace-nowrap p-3">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-medium">{p.supplier_name}</td>
                    <td className="p-3 font-semibold tabular-nums">{bdtNum(Number(p.amount))}</td>
                    <td className="p-3 capitalize text-muted-foreground">{p.method ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{p.reference ?? p.note ?? "—"}</td>
                    <td className="p-3">
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize " +
                          (TONE[p.status] ?? "bg-muted")
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Actions
                        p={p}
                        busy={busyId === p.id}
                        setStatus={setStatus}
                        canManage={canManage}
                        className="justify-end"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} perPage={perPage} total={rows.length} onPage={setPage} />
        </>
      )}
    </div>
  );
}

function Actions({
  p,
  busy,
  setStatus,
  canManage,
  className = "",
}: {
  p: { id: string; status: string };
  busy: boolean;
  setStatus: (id: string, status: "approved" | "paid" | "rejected") => void;
  canManage: boolean;
  className?: string;
}) {
  if (p.status === "paid" || p.status === "rejected" || !canManage)
    return <span className="text-[11px] text-muted-foreground">—</span>;
  return (
    <div className={"inline-flex flex-wrap gap-1 " + className}>
      {p.status === "pending" && (
        <>
          <Btn
            busy={busy}
            onClick={() => setStatus(p.id, "approved")}
            label="Approve"
            icon={<CheckCircle2 className="h-3 w-3" />}
          />
          <Btn
            busy={busy}
            onClick={() => setStatus(p.id, "rejected")}
            label="Reject"
            danger
            icon={<XCircle className="h-3 w-3" />}
          />
        </>
      )}
      <Btn
        busy={busy}
        onClick={() => setStatus(p.id, "paid")}
        label="Mark paid"
        icon={<Wallet className="h-3 w-3" />}
      />
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
        (danger
          ? "border-destructive/40 text-destructive hover:bg-destructive/10"
          : "hover:bg-muted")
      }
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : icon} {label}
    </button>
  );
}
