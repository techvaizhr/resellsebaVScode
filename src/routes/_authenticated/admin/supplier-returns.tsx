import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, PackageCheck, Undo2, LogIn, ImageIcon, Search, ChevronDown } from "lucide-react";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";
import { toast } from "sonner";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-kit";
import {
  bdtNum,
  handoverSupplierReturns,
  loadAdminSupplierOverview,
  orderStatusLabel,
  type AdminSupplierOverview,
  type SupplierReturnRow,
} from "@/lib/supplier";
import { impersonateSupplier } from "@/lib/supplier-access.functions";
import { startImpersonation } from "@/lib/impersonation";
import { useCan } from "@/lib/use-auth";
import { SearchableSelect } from "@/components/searchable-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/supplier-returns")({
  component: AdminSupplierReturnsPage,
  head: () => ({
    meta: [
      { title: "Supplier returns handover · Admin" },
      { name: "description", content: "Hand over returned items to each supplier — in bulk or one at a time." },
      { property: "og:title", content: "Supplier returns handover" },
      { property: "og:description", content: "Hand returned items back to each supplier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const TABS = [
  { key: "pending_handover", label: "Waiting handover" },
  { key: "handed_over", label: "Handed over" },
  { key: "all", label: "All" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const value = (r: SupplierReturnRow) => Number(r.quantity) * Number(r.unit_price);

type OrderGroup = { order_id: string; order_number: string; rows: SupplierReturnRow[] };

/** Group one supplier's return rows by order so multi-product orders stay together. */
function groupByOrder(rows: SupplierReturnRow[]): OrderGroup[] {
  const map = new Map<string, OrderGroup>();
  for (const r of rows) {
    const key = r.order_id;
    if (!map.has(key)) map.set(key, { order_id: key, order_number: r.order_number, rows: [] });
    map.get(key)!.rows.push(r);
  }
  return [...map.values()];
}

function AdminSupplierReturnsPage() {
  const nav = useNavigate();
  const impersonateFn = useServerFn(impersonateSupplier);
  const [data, setData] = useState<AdminSupplierOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<TabKey>("pending_handover");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [undoTarget, setUndoTarget] = useState<string[] | null>(null);
  const can = useCan();
  const canManage = can("suppliers.manage");

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
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

  const all = data?.returns ?? [];
  const needle = q.trim().toLowerCase();

  const rows = useMemo(
    () =>
      all.filter(
        (r) =>
          (tab === "all" || r.status === tab) &&
          (!supplierFilter || r.supplier_id === supplierFilter) &&
          (!needle ||
            r.order_number.toLowerCase().includes(needle) ||
            r.product_name.toLowerCase().includes(needle) ||
            (r.supplier_name ?? "").toLowerCase().includes(needle)),
      ),
    [all, tab, needle, supplierFilter],
  );

  const groups = useMemo(() => {
    const map = new Map<string, { id: string; name: string; rows: SupplierReturnRow[] }>();
    for (const r of rows) {
      const id = r.supplier_id ?? "unknown";
      if (!map.has(id)) map.set(id, { id, name: r.supplier_name ?? "Supplier", rows: [] });
      map.get(id)!.rows.push(r);
    }
    return [...map.values()].sort((a, b) => b.rows.length - a.rows.length);
  }, [rows]);

  /** How many distinct suppliers have returns on each order (handover stays per supplier). */
  const supplierCountByOrder = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const r of all) {
      if (!m.has(r.order_id)) m.set(r.order_id, new Set());
      m.get(r.order_id)!.add(r.supplier_id ?? "unknown");
    }
    return new Map([...m].map(([k, v]) => [k, v.size]));
  }, [all]);

  const supplierOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of all) if (r.supplier_id) seen.set(r.supplier_id, r.supplier_name ?? "Supplier");
    return [
      { value: "", label: "All suppliers" },
      ...[...seen].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [all]);

  const pending = all.filter((r) => r.status === "pending_handover");
  const handed = all.filter((r) => r.status === "handed_over");
  const sum = (list: SupplierReturnRow[]) => list.reduce((s, r) => s + value(r), 0);

  const act = async (ids: string[], undo = false) => {
    if (!ids.length) return;
    setBusy(true);
    try {
      await handoverSupplierReturns(ids, undo);
      toast.success(
        undo
          ? `Handover of ${ids.length} item(s) cancelled — back to "Waiting handover"`
          : `${ids.length} item(s) handed over to the supplier`,
      );
      setSel([]);
      await load(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  const loginAs = async (supplierId: string, name: string) => {
    const s = data?.suppliers.find((x) => x.id === supplierId);
    const targetUserId = s?.user_id || s?.id || supplierId;
    if (!targetUserId) {
      toast.error("Could not find an account for this supplier");
      return;
    }
    setBusy(true);
    try {
      const res = await impersonateFn({ data: { userId: targetUserId } });
      if (!res?.accessToken) {
        throw new Error("No session token returned");
      }
      await startImpersonation({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken || res.accessToken,
        label: name,
        returnTo: window.location.pathname + window.location.search,
      });
      window.location.href = "/supplier/returns";
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not log in as supplier");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Return handover"
        description="Items returned per supplier — hand over in bulk or one at a time."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        <StatCard label="Waiting handover" value={bdtNum(sum(pending))} hint={`${pending.length} items`} tone="amber" />
        <StatCard label="Handed over" value={bdtNum(sum(handed))} hint={`${handed.length} items`} tone="emerald" />
        <StatCard label="Suppliers involved" value={groups.length} hint="in current view" tone="violet" />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const n = t.key === "all" ? all.length : t.key === "pending_handover" ? pending.length : handed.length;
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSel([]);
              }}
              className={
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
                (tab === t.key ? "border-transparent bg-primary text-primary-foreground" : "hover:bg-muted")
              }
            >
              {t.label} ({n})
            </button>
          );
        })}
        <SearchableSelect
          className="ml-auto w-52"
          options={supplierOptions}
          value={supplierFilter}
          onChange={(v) => {
            setSupplierFilter(v);
            setSel([]);
          }}
          placeholder="All suppliers"
          searchPlaceholder="Search supplier…"
        />
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order / product / supplier"
            className="w-56 rounded-md border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {canManage && sel.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <span className="text-xs font-semibold">{sel.length} selected</span>
          <button
            onClick={() => act(sel)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            <PackageCheck className="h-3.5 w-3.5" /> Hand over
          </button>
          <button
            onClick={() => setUndoTarget(sel)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
          >
            <Undo2 className="h-3.5 w-3.5" /> Undo handover
          </button>
          <button onClick={() => setSel([])} className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            Clear
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <EmptyState title="No returns" description="No returns match this filter." />
      ) : (
        <div className="space-y-4">
          {groups.map((g) => {
            const gPending = g.rows.filter((r) => r.status !== "handed_over");
            const gSel = g.rows.filter((r) => sel.includes(r.id));
            const allSel = g.rows.length > 0 && g.rows.every((r) => sel.includes(r.id));
            return (
              <div key={g.id} className="surface-card overflow-hidden p-0">
                <div className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-4 py-3">
                  {canManage && (
                    <input
                      type="checkbox"
                      checked={allSel}
                      onChange={(e) =>
                        setSel((p) =>
                          e.target.checked
                            ? [...new Set([...p, ...g.rows.map((r) => r.id)])]
                            : p.filter((id) => !g.rows.some((r) => r.id === id)),
                        )
                      }
                      className="h-3.5 w-3.5"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{g.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {g.rows.length} items · {bdtNum(sum(g.rows))}
                      {gPending.length > 0 ? ` · ${gPending.length} waiting` : ""}
                      {gSel.length > 0 ? ` · ${gSel.length} selected` : ""}
                    </div>
                  </div>
                  <div className="ml-auto flex flex-wrap gap-2">
                    {canManage && gPending.length > 0 && (
                      <button
                        onClick={() => act(gPending.map((r) => r.id))}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        <PackageCheck className="h-3.5 w-3.5" /> Hand over all ({gPending.length})
                      </button>
                    )}
                    {canManage && (
                      <button
                        onClick={() => loginAs(g.id, g.name)}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-500/20 disabled:opacity-50"
                      >
                        <LogIn className="h-3.5 w-3.5" /> Login as supplier
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y">
                  {groupByOrder(g.rows).map((ord) => {
                    const key = g.id + ":" + ord.order_id;
                    const expanded = open.includes(key) || ord.rows.length === 1;
                    const shown = expanded ? ord.rows : ord.rows.slice(0, 1);
                    const oPending = ord.rows.filter((r) => r.status !== "handed_over");
                    const others = (supplierCountByOrder.get(ord.order_id) ?? 1) - 1;
                    return (
                      <div key={key}>
                        <div className="flex flex-wrap items-center gap-2 bg-muted/15 px-4 py-2">
                          {canManage && (
                            <input
                              type="checkbox"
                              checked={ord.rows.every((r) => sel.includes(r.id))}
                              onChange={(e) =>
                                setSel((p) =>
                                  e.target.checked
                                    ? [...new Set([...p, ...ord.rows.map((r) => r.id)])]
                                    : p.filter((id) => !ord.rows.some((r) => r.id === id)),
                                )
                              }
                              className="h-3.5 w-3.5"
                            />
                          )}
                          <CopyOrderNumber orderNumber={ord.order_number} className="text-xs font-semibold" />
                          <span className="text-[11px] text-muted-foreground">
                            {ord.rows.length} product{ord.rows.length > 1 ? "s" : ""} · {bdtNum(sum(ord.rows))}
                          </span>
                          {others > 0 && (
                            <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-600">
                              +{others} other supplier{others > 1 ? "s" : ""}
                            </span>
                          )}
                          <div className="ml-auto flex items-center gap-2">
                            {canManage && oPending.length > 0 && (
                              <button
                                onClick={() => act(oPending.map((r) => r.id))}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
                              >
                                <PackageCheck className="h-3 w-3" /> Hand over ({oPending.length})
                              </button>
                            )}
                            {ord.rows.length > 1 && (
                              <button
                                onClick={() =>
                                  setOpen((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]))
                                }
                                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-accent"
                              >
                                <ChevronDown
                                  className={"h-3 w-3 transition-transform " + (expanded ? "rotate-180" : "")}
                                />
                                {expanded ? "Hide" : `+${ord.rows.length - 1} more`}
                              </button>
                            )}
                          </div>
                        </div>

                        {shown.map((r) => {
                          const done = r.status === "handed_over";
                          const when = new Date(r.updated_at ?? r.created_at);
                          return (
                            <div key={r.id} className="flex flex-wrap items-center gap-3 border-t px-4 py-2.5 pl-8">
                              {canManage && (
                                <input
                                  type="checkbox"
                                  checked={sel.includes(r.id)}
                                  onChange={(e) =>
                                    setSel((p) => (e.target.checked ? [...p, r.id] : p.filter((x) => x !== r.id)))
                                  }
                                  className="h-3.5 w-3.5"
                                />
                              )}
                              {r.product_image ? (
                                <img
                                  src={r.product_image}
                                  alt={r.product_name}
                                  loading="lazy"
                                  className="h-10 w-10 shrink-0 rounded-md border object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-medium">{r.product_name}</div>
                                <div className="text-[11px] text-muted-foreground">
                                  Qty {r.quantity} · {orderStatusLabel(r.order_status)}
                                </div>
                              </div>
                              <div className="text-right text-[11px] text-muted-foreground">
                                <div>{when.toLocaleDateString()}</div>
                                <div>{when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                              </div>
                              <div className="w-20 text-right text-xs font-semibold tabular-nums">{bdtNum(value(r))}</div>
                              {!canManage ? (
                                <span className="text-[11px] text-muted-foreground">
                                  {done ? "Handed over" : "Waiting handover"}
                                </span>
                              ) : done ? (
                                <button
                                  onClick={() => setUndoTarget([r.id])}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 hover:bg-emerald-500/20 disabled:opacity-50"
                                  title="Click to cancel the handover"
                                >
                                  <PackageCheck className="h-3 w-3" /> Handed over
                                </button>
                              ) : (
                                <button
                                  onClick={() => act([r.id])}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
                                >
                                  <PackageCheck className="h-3 w-3" /> Hand over
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <AlertDialog open={undoTarget !== null} onOpenChange={(o) => !o && setUndoTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Cancel handover? ({undoTarget?.length ?? 0} item(s))
            </AlertDialogTitle>
            <AlertDialogDescription>
              These items are currently marked as handed over to the supplier. Cancelling will move them back to
              &ldquo;Waiting handover&rdquo; status and clear the Received status on the supplier's panel as well.
              Do not do this unless the product has not actually been returned physically. This only affects the selected items for this supplier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const ids = undoTarget ?? [];
                setUndoTarget(null);
                void act(ids, true);
              }}
            >
              Yes, cancel handover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
