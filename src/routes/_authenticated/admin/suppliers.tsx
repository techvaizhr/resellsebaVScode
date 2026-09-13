import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Play,
  ShieldOff,
  X,
  Pencil,
  KeyRound,
  LogIn,
  Save,
  MoreHorizontal,
  Copy,
  IdCard,
  Phone,
  PhoneCall,
  MessageCircle,
  Receipt,
  PackageSearch,
  Wallet,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { DataToolbar, Pagination, usePaginated } from "@/components/data-list";
import { ResellerAvatar } from "@/components/reseller-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/laravel/client";
import { useCan } from "@/lib/use-auth";
import { PasswordResetModal } from "@/components/password-reset-modal";
import { startImpersonation } from "@/lib/impersonation";
import { confirmAction } from "@/lib/confirm";
import {
  deleteSupplier,
  impersonateSupplier,
  resetSupplierPassword,
} from "@/lib/supplier-access.functions";
import {
  bdtNum,
  loadAdminSupplierOverview,
  type AdminSupplierOverview,
  type AdminSupplierRow,
} from "@/lib/supplier";

export const Route = createFileRoute("/_authenticated/admin/suppliers")({
  component: AdminSuppliersPage,
  head: () => ({
    meta: [
      { title: "Supplier network — Admin" },
      {
        name: "description",
        content: "Approve suppliers, track their sales, payable balance and account access.",
      },
      { property: "og:title", content: "Supplier network — Admin" },
      {
        property: "og:description",
        content: "Supplier accounts, earnings and payouts in one list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const inp =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const FILTERS = ["all", "pending", "active", "suspended", "rejected"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  pending: "Pending",
  active: "Active",
  suspended: "Suspended",
  rejected: "Rejected",
};

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  active: "bg-emerald-500/10 text-emerald-600",
  suspended: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

function AdminSuppliersPage() {
  const nav = useNavigate();
  const [data, setData] = useState<AdminSupplierOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editFor, setEditFor] = useState<AdminSupplierRow | null>(null);
  const [resetFor, setResetFor] = useState<AdminSupplierRow | null>(null);
  const resetPasswordFn = useServerFn(resetSupplierPassword);
  const impersonateFn = useServerFn(impersonateSupplier);
  const deleteFn = useServerFn(deleteSupplier);
  const can = useCan();
  const canManage = can("suppliers.manage");

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

  const items = data?.suppliers ?? [];

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== "all") out = out.filter((s) => s.status === filter);
    const q = query.trim().toLowerCase();
    if (q)
      out = out.filter(
        (s) =>
          s.display_name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.email ?? "").toLowerCase().includes(q) ||
          (s.contact_phone ?? "").toLowerCase().includes(q),
      );
    return out;
  }, [items, filter, query]);

  const counts = useMemo(
    () =>
      ({
        all: items.length,
        pending: items.filter((s) => s.status === "pending").length,
        active: items.filter((s) => s.status === "active").length,
        suspended: items.filter((s) => s.status === "suspended").length,
        rejected: items.filter((s) => s.status === "rejected").length,
      }) as Record<Filter, number>,
    [items],
  );

  const paged = usePaginated(filtered, page, perPage);

  async function setStatus(s: AdminSupplierRow, status: string) {
    if (status === s.status) return;
    setBusyId(s.id);
    const patch: { status: string; approved_at?: string } = { status };
    if (status === "active") patch.approved_at = new Date().toISOString();
    const { error } = await supabase
      .from("suppliers")
      .update(patch as never)
      .eq("id", s.id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(
      status === "active" ? `${s.display_name} is now active` : `Status set to ${status}`,
    );
    void load();
  }

  async function applyPasswordReset(s: AdminSupplierRow, password: string) {
    try {
      await resetPasswordFn({ data: { userId: s.user_id, password } });
      toast.success(`Password updated for ${s.display_name}`);
      setResetFor(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reset password");
    }
  }

  async function removeSupplier(s: AdminSupplierRow) {
    const ok = await confirmAction({
      title: `Delete ${s.display_name}?`,
      description:
        "The supplier account and login will be permanently deleted. Order history and products stay, but lose the supplier link. This cannot be undone.",
      confirmText: "Delete supplier",
      variant: "danger",
    });
    if (!ok) return;
    setBusyId(s.id);
    try {
      await deleteFn({ data: { supplierId: s.id } });
      toast.success(`${s.display_name} deleted`);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function loginAsSupplier(s: AdminSupplierRow) {
    setBusyId(s.id);
    try {
      const res = await impersonateFn({ data: { userId: s.user_id || s.id } });
      if (!res?.accessToken) {
        throw new Error("No session token returned");
      }
      await startImpersonation({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken || res.accessToken,
        label: s.display_name,
        returnTo: window.location.pathname + window.location.search,
      });
      window.location.href = "/supplier";
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not log in as supplier");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Supplier Network"
        description="Supplier accounts, their sales, returns, and payouts in one place."
      />

      <div className="mb-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
              (filter === f
                ? "border-transparent bg-primary text-primary-foreground"
                : "hover:bg-muted")
            }
          >
            {FILTER_LABELS[f]}
            <span
              className={"tabular-nums " + (filter === f ? "opacity-80" : "text-muted-foreground")}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <DataToolbar
        search={query}
        onSearch={(v) => {
          setQuery(v);
          setPage(1);
        }}
        searchPlaceholder="Search name, code, phone, email…"
        perPage={perPage}
        onPerPage={(n) => {
          setPerPage(n);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing here" description="No suppliers match this filter." />
      ) : (
        <div className="space-y-3">
          {paged.map((s) => {
            const payable = Math.max(s.earning - s.paid - s.pending_payout, 0);
            const phone = (s.contact_phone ?? "").trim();
            const waPhone = (s.whatsapp || phone).replace(/[^0-9]/g, "").replace(/^0/, "880");
            return (
              <div key={s.id} className="surface-card p-3 shadow-sm transition hover:shadow-md sm:p-4">
                <div className="flex items-center gap-3">
                  <ResellerAvatar url={null} name={s.display_name} size={40} />
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                    <span className="truncate min-w-0 font-medium">{s.display_name}</span>
                    <div className="hidden sm:contents">
                      <SupplierInfoBadges s={s} phone={phone} waPhone={waPhone} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      to="/admin/supplier-report"
                      title="Supplier report"
                      aria-label={`Report for ${s.display_name}`}
                      className="grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted"
                    >
                      <Receipt className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/admin/supplier-payouts"
                      title="Payouts"
                      aria-label={`Payouts for ${s.display_name}`}
                      className="grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted"
                    >
                      <Wallet className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/admin/products"
                      search={{ supplier: s.id } as never}
                      title="Products"
                      aria-label={`Products of ${s.display_name}`}
                      className="grid h-8 w-8 place-items-center rounded-md border transition hover:bg-muted"
                    >
                      <PackageSearch className="h-4 w-4" />
                    </Link>
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="grid h-8 w-8 shrink-0 place-items-center rounded-md border hover:bg-muted">
                          {busyId === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>{s.display_name}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {s.status !== "active" && (
                            <DropdownMenuItem onClick={() => setStatus(s, "active")}>
                              <Play className="mr-2 h-4 w-4" /> Approve / activate
                            </DropdownMenuItem>
                          )}
                          {s.status === "active" && (
                            <DropdownMenuItem onClick={() => setStatus(s, "suspended")}>
                              <ShieldOff className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                          )}
                          {s.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => setStatus(s, "rejected")}
                              className="text-destructive focus:text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditFor(s)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setResetFor(s)}>
                            <KeyRound className="mr-2 h-4 w-4" /> Reset password
                          </DropdownMenuItem>
                          {s.status === "active" && (
                            <DropdownMenuItem onClick={() => void loginAsSupplier(s)}>
                              <LogIn className="mr-2 h-4 w-4" /> Login as supplier
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => void removeSupplier(s)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete supplier
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:hidden">
                  <SupplierInfoBadges s={s} phone={phone} waPhone={waPhone} />
                </div>



                <div className="mt-3 grid grid-cols-4 gap-2 lg:grid-cols-4 xl:grid-cols-7">
                  <Metric label="Products" value={s.products} plain />
                  <Metric label="Sold qty" value={s.sold_qty} plain />
                  <Metric label="Earning" value={s.earning} accent />
                  <Metric label="Returned qty" value={s.returned_qty} plain muted />
                  <Metric label="Returned value" value={s.returned_amount} muted />
                  <Metric label="Paid" value={s.paid} />
                  <Metric label="Payable" value={payable} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
      )}

      {editFor && (
        <SupplierEditModal
          supplier={editFor}
          onClose={() => setEditFor(null)}
          onSaved={() => {
            setEditFor(null);
            void load();
          }}
        />
      )}

      {resetFor && (
        <PasswordResetModal
          label={resetFor.display_name}
          onClose={() => setResetFor(null)}
          onReset={(pw) => applyPasswordReset(resetFor, pw)}
        />
      )}
    </div>
  );
}

/** Status + returns + ID + phone + email badges, reused inline (desktop) and below (mobile). */
function SupplierInfoBadges({
  s,
  phone,
  waPhone,
}: {
  s: AdminSupplierRow;
  phone: string;
  waPhone: string;
}) {
  return (
    <>
      <span
        className={
          "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize " +
          (STATUS_TONE[s.status] ?? "bg-muted")
        }
      >
        {s.status}
      </span>
      {s.pending_returns > 0 && (
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
          {s.pending_returns} return to hand over
        </span>
      )}
      <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5">
        <IdCard className="h-3 w-3 text-primary" />
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">ID</span>
        <span className="font-mono text-[11px] font-bold tracking-wider text-primary">{s.code}</span>
        <button
          type="button"
          title="Copy supplier ID"
          onClick={() => {
            navigator.clipboard.writeText(s.code);
            toast.success("Supplier ID copied");
          }}
          className="text-muted-foreground transition hover:text-foreground"
        >
          <Copy className="h-3 w-3" />
        </button>
      </span>
      {phone ? (
        <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-[11px] font-medium">{phone}</span>
          <button
            type="button"
            title="Copy phone"
            onClick={() => {
              navigator.clipboard.writeText(phone);
              toast.success("Phone copied");
            }}
            className="text-muted-foreground transition hover:text-foreground"
          >
            <Copy className="h-3 w-3" />
          </button>
          <a href={`tel:${phone}`} title="Call" className="text-muted-foreground transition hover:text-primary">
            <PhoneCall className="h-3 w-3" />
          </a>
          <a
            href={`https://wa.me/${waPhone}`}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
            className="text-muted-foreground transition hover:text-success"
          >
            <MessageCircle className="h-3 w-3" />
          </a>
        </span>
      ) : (
        <span className="rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground">no phone</span>
      )}
      {s.email && (
        <span className="min-w-0 truncate rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground">
          {s.email}
        </span>
      )}
    </>
  );
}

function Metric({
  label,
  value,
  accent,
  muted,
  plain,
}: {
  label: string;
  value: number | undefined;
  accent?: boolean;
  muted?: boolean;
  plain?: boolean;
}) {
  return (
    <div className="rounded-md border bg-muted/30 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={
          "text-sm font-semibold tabular-nums " +
          (accent ? "text-success" : muted ? "text-muted-foreground" : "")
        }
      >
        {value == null ? "—" : plain ? value.toLocaleString() : bdtNum(value)}
      </div>
    </div>
  );
}

function SupplierEditModal({
  supplier,
  onClose,
  onSaved,
}: {
  supplier: AdminSupplierRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    display_name: supplier.display_name ?? "",
    contact_phone: supplier.contact_phone ?? "",
    whatsapp: supplier.whatsapp ?? "",
    address: supplier.address ?? "",
    status: supplier.status as string,
    notes: supplier.notes ?? "",
    payout_method: supplier.payout_method ?? "bkash",
    payout_account_name: supplier.payout_account_name ?? "",
    payout_account_number: supplier.payout_account_number ?? "",
    payout_bank_name: supplier.payout_bank_name ?? "",
    payout_branch: supplier.payout_branch ?? "",
  });
  const [busy, setBusy] = useState(false);
  const isBank = form.payout_method === "bank";

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.display_name.trim()) return toast.error("Please enter a name");
    setBusy(true);
    const patch: Record<string, unknown> = {
      display_name: form.display_name.trim(),
      contact_phone: form.contact_phone || null,
      whatsapp: form.whatsapp || null,
      address: form.address || null,
      status: form.status,
      notes: form.notes || null,
      payout_method: form.payout_method,
      payout_account_name: form.payout_account_name || null,
      payout_account_number: form.payout_account_number || null,
      payout_bank_name: isBank ? form.payout_bank_name || null : null,
      payout_branch: isBank ? form.payout_branch || null : null,
    };
    if (form.status === "active" && supplier.status !== "active")
      patch.approved_at = new Date().toISOString();
    const { error } = await supabase
      .from("suppliers")
      .update(patch as never)
      .eq("id", supplier.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Supplier updated");
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={busy ? undefined : onClose}
    >
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="surface-card modal-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-b-none sm:rounded-lg"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-card px-4 py-3">
          <h3 className="text-base font-semibold">Edit supplier · {supplier.code}</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
          <Field label="Supplier / business name">
            <input
              value={form.display_name}
              onChange={(e) => set("display_name", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Email (login)">
            <input value={supplier.email ?? ""} disabled className={inp + " opacity-60"} />
          </Field>
          <Field label="Phone">
            <input
              value={form.contact_phone}
              onChange={(e) => set("contact_phone", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="WhatsApp">
            <input
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inp}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </Field>
          <Field label="Payout method">
            <select
              value={form.payout_method}
              onChange={(e) => set("payout_method", e.target.value)}
              className={inp}
            >
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="bank">Bank</option>
            </select>
          </Field>
          <Field label="Account holder name">
            <input
              value={form.payout_account_name}
              onChange={(e) => set("payout_account_name", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label={isBank ? "Account number" : "Mobile number"}>
            <input
              value={form.payout_account_number}
              onChange={(e) => set("payout_account_number", e.target.value)}
              className={inp}
            />
          </Field>
          {isBank && (
            <>
              <Field label="Bank name">
                <input
                  value={form.payout_bank_name}
                  onChange={(e) => set("payout_bank_name", e.target.value)}
                  className={inp}
                />
              </Field>
              <Field label="Branch">
                <input
                  value={form.payout_branch}
                  onChange={(e) => set("payout_branch", e.target.value)}
                  className={inp}
                />
              </Field>
            </>
          )}
          <div className="sm:col-span-2">
            <Field label="Address">
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className={inp}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Admin note (internal)">
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={inp}
              />
            </Field>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-card px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={busy}
            className="btn-brand inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}{" "}
            Save
          </button>
        </div>
      </form>
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
