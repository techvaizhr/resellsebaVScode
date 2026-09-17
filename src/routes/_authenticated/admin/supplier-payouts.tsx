import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Wallet, CheckCircle2, XCircle, Plus, Clock, Copy, Phone, Landmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import { DataToolbar, Pagination, usePaginated } from "@/components/data-list";
import { StatusTabs } from "@/components/status-tabs";
import { supabase } from "@/integrations/supabase/client";
import { bdtNum, loadAdminSupplierOverview, type AdminSupplierOverview } from "@/lib/supplier";
import { useCan } from "@/lib/use-auth";
import { PayoutSupplierReport } from "@/components/payout-supplier-report";
import { SearchableSelect } from "@/components/searchable-select";
import { ConfirmModal } from "@/components/ui-kit/ConfirmModal";
import { useAuth } from "@/lib/use-auth";

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
  const [viewTab, setViewTab] = useState<"requests" | "report">("requests");
  const [statusTab, setStatusTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [supplierId, setSupplierId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [reference, setReference] = useState("");
  const [creating, setCreating] = useState(false);
  const [action, setAction] = useState<{ id: string; supplier: string; amount: number; status: "approved" | "paid" | "rejected" } | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [toDelete, setToDelete] = useState<{ id: string; supplier: string; amount: number; status: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const can = useCan();
  const canManage = can("suppliers.manage", "payouts.manage");
  const { roles } = useAuth();
  const isSuperAdmin = roles.includes("super_admin");

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
    () => (statusTab === "all" ? scoped : scoped.filter((p) => p.status === statusTab)),
    [scoped, statusTab],
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

  async function submitAction() {
    if (!action) return;
    if (action.status === "rejected" && !adminNote.trim()) return toast.error("Please write a reason for rejection");
    setBusyId(action.id);
    const { id, status } = action;
    const patch: Record<string, unknown> = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (status === "paid") {
      patch.approved_at = new Date().toISOString();
      patch.paid_at = new Date().toISOString();
    }
    if (adminNote.trim()) patch.admin_note = adminNote.trim();
    const { error } = await supabase
      .from("supplier_payouts")
      .update(patch as never)
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Payout updated");
    setAction(null);
    setAdminNote("");
    void load();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("supplier_payouts").delete().eq("id", toDelete.id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Payout deleted");
    setToDelete(null);
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
        title="Supplier Payout Management"
        description="Review withdrawal requests, check payout accounts and process supplier payments."
      />

      <div className="mb-4 inline-flex rounded-lg border bg-muted/40 p-1">
        {(["requests", "report"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setViewTab(item)}
            className={
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors " +
              (viewTab === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")
            }
          >
            {item === "requests" ? "Payout requests" : "Supplier balance report"}
          </button>
        ))}
      </div>

      {viewTab === "report" ? (
        <>
          <DataToolbar
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search supplier, code, account…"
            perPage={perPage}
            onPerPage={setPerPage}
          />
          <PayoutSupplierReport search={search} />
        </>
      ) : (
      <>

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
        tab={statusTab}
        onChange={(k) => {
          setStatusTab(k);
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
        perPage={perPage}
        onPerPage={(n) => {
          setPerPage(n);
          setPage(1);
        }}
        right={
          <SearchableSelect
            options={suppliers.map((s) => ({ value: s.id, label: `${s.display_name} (${s.code})` }))}
            value={supplierFilter}
            onChange={(value) => { setSupplierFilter(value); setPage(1); }}
            placeholder="All suppliers"
            searchPlaceholder="Search supplier…"
            className="w-full sm:w-[240px]"
            align="end"
          />
        }
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
                <div className="mt-3 rounded-md border bg-muted/30 p-3">
                  <SupplierPayoutAccount supplier={suppliers.find((s) => s.id === p.supplier_id)} fallback={p.reference} />
                </div>
                {p.admin_note && <p className="mt-2 rounded-md border border-dashed p-2 text-[11px] text-muted-foreground"><span className="font-medium text-foreground">Admin note:</span> {p.admin_note}</p>}
                <Actions
                  p={p}
                  busy={busyId === p.id}
                  open={(status) => { setAction({ id: p.id, supplier: p.supplier_name ?? "Supplier", amount: Number(p.amount), status }); setAdminNote(p.admin_note ?? ""); }}
                  canManage={canManage}
                  canDelete={isSuperAdmin}
                  onDelete={() => setToDelete({ id: p.id, supplier: p.supplier_name ?? "Supplier", amount: Number(p.amount), status: p.status })}
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
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Amount</th>
                   <th className="p-3">Payout account</th>
                  <th className="p-3">Status</th>
                   <th className="p-3">Admin note</th>
                   <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paged.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-medium">{p.supplier_name}</td>
                    <td className="p-3 font-semibold tabular-nums">{bdtNum(Number(p.amount))}</td>
                    <td className="p-3"><SupplierPayoutAccount supplier={suppliers.find((s) => s.id === p.supplier_id)} fallback={p.reference} /></td>
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
                    <td className="max-w-[220px] p-3 text-xs text-muted-foreground">{p.admin_note || "—"}</td>
                    <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Actions
                        p={p}
                        busy={busyId === p.id}
                        open={(status) => { setAction({ id: p.id, supplier: p.supplier_name ?? "Supplier", amount: Number(p.amount), status }); setAdminNote(p.admin_note ?? ""); }}
                        canManage={canManage}
                        canDelete={isSuperAdmin}
                        onDelete={() => setToDelete({ id: p.id, supplier: p.supplier_name ?? "Supplier", amount: Number(p.amount), status: p.status })}
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
      </>
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={deleting}
        variant="danger"
        title="Delete this payout?"
        description={toDelete ? `${toDelete.supplier} · BDT ${toDelete.amount.toLocaleString()} (${toDelete.status}). This permanently removes the payout record and returns the amount to the supplier balance.` : ""}
        confirmText="Delete payout"
      />

      {action && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => !busyId && setAction(null)}>
          <div className="w-full max-w-md rounded-xl border bg-card p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="text-sm font-semibold capitalize">Mark payout {action.status}</div>
            <p className="mt-1 text-xs text-muted-foreground">{action.supplier} · {bdtNum(action.amount)}</p>
            <label className="mb-1 mt-4 block text-xs font-medium">Admin note {action.status === "rejected" ? "(reason — required)" : "(optional)"}</label>
            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              rows={3}
              placeholder={action.status === "rejected" ? "Why is this request rejected?" : "Transaction ID or remarks…"}
              className={inp}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">The supplier will see this note in their payout list.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setAction(null)} disabled={!!busyId} className="rounded-md border px-3 py-1.5 text-xs">Cancel</button>
              <button type="button" onClick={submitAction} disabled={!!busyId} className="btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium disabled:opacity-50">
                {busyId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Actions({
  p,
  busy,
  open,
  canManage,
  canDelete,
  onDelete,
  className = "",
}: {
  p: { id: string; status: string };
  busy: boolean;
  open: (status: "approved" | "paid" | "rejected") => void;
  canManage: boolean;
  canDelete: boolean;
  onDelete: () => void;
  className?: string;
}) {
  return (
    <div className={"inline-flex flex-wrap gap-1 " + className}>
      {canManage && p.status === "pending" && (
        <>
          <Btn
            busy={busy}
            onClick={() => open("approved")}
            label="Approve"
            icon={<CheckCircle2 className="h-3 w-3" />}
          />
          <Btn
            busy={busy}
            onClick={() => open("rejected")}
            label="Reject"
            danger
            icon={<XCircle className="h-3 w-3" />}
          />
        </>
      )}
      {canManage && p.status === "approved" && <>
        <Btn busy={busy} onClick={() => open("paid")} label="Mark paid" icon={<Wallet className="h-3 w-3" />} />
        <Btn busy={busy} onClick={() => open("rejected")} label="Reject" danger icon={<XCircle className="h-3 w-3" />} />
      </>}
      {canDelete && <Btn busy={busy} onClick={onDelete} label="Delete" danger icon={<Trash2 className="h-3 w-3" />} />}
      {!canManage && !canDelete && <span className="text-[11px] text-muted-foreground">—</span>}
    </div>
  );
}

async function copyValue(value: string, label: string) {
  try { await navigator.clipboard.writeText(value); toast.success(`${label} copied`); }
  catch { toast.error("Copy failed"); }
}

function SupplierPayoutAccount({ supplier, fallback }: { supplier?: AdminSupplierOverview["suppliers"][number]; fallback: string | null }) {
  if (!supplier?.payout_account_number) return <span className="text-xs text-muted-foreground">{fallback || "No account saved"}</span>;
  const isBank = supplier.payout_method === "bank";
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium capitalize">
        {isBank ? <Landmark className="h-3.5 w-3.5 opacity-70" /> : <Phone className="h-3.5 w-3.5 opacity-70" />}
        {supplier.payout_method ?? "—"}
      </div>
      <button type="button" onClick={() => copyValue(supplier.payout_account_number!, "Account number")} className="inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] hover:bg-muted">
        <span className="truncate">{supplier.payout_account_number}</span><Copy className="h-3 w-3 shrink-0 opacity-70" />
      </button>
      <div className="text-[11px] text-muted-foreground">{supplier.payout_account_name || "—"}{isBank && supplier.payout_bank_name ? ` · ${supplier.payout_bank_name}` : ""}{isBank && supplier.payout_branch ? ` · ${supplier.payout_branch}` : ""}</div>
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
