import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

export type PayoutReportRow = {
  reseller_id: string;
  code: string | null;
  business_name: string | null;
  status: string | null;
  payout_method: string | null;
  payout_account_number: string | null;
  earned_profit: number;
  deposit_balance: number;
  frozen_amount: number;
  pending_payout: number;
  approved_payout: number;
  paid_out: number;
  rejected_payout: number;
  due_balance: number;
  last_request_at: string | null;
  last_paid_at: string | null;
  request_count: number;
};

type SortKey =
  | "business_name"
  | "earned_profit"
  | "deposit_balance"
  | "frozen_amount"
  | "pending_payout"
  | "approved_payout"
  | "paid_out"
  | "due_balance"
  | "last_request_at"
  | "request_count";

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "business_name", label: "Reseller" },
  { key: "earned_profit", label: "Total profit", numeric: true },
  { key: "deposit_balance", label: "Deposit", numeric: true },
  { key: "pending_payout", label: "Pending request", numeric: true },
  { key: "approved_payout", label: "Approved", numeric: true },
  { key: "paid_out", label: "Withdrawn", numeric: true },
  { key: "frozen_amount", label: "Frozen", numeric: true },
  { key: "due_balance", label: "Due balance", numeric: true },
  { key: "request_count", label: "Requests", numeric: true },
  { key: "last_request_at", label: "Last request", numeric: true },
];

const bdt = (n: number) => "৳" + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export function PayoutResellerReport({ search }: { search: string }) {
  const [rows, setRows] = useState<PayoutReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "due_balance", dir: "desc" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("admin_payout_report");
      if (error) toast.error(error.message);
      setRows(((data ?? []) as any[]).map((r) => ({
        ...r,
        earned_profit: Number(r.earned_profit || 0),
        deposit_balance: Number(r.deposit_balance || 0),
        frozen_amount: Number(r.frozen_amount || 0),
        pending_payout: Number(r.pending_payout || 0),
        approved_payout: Number(r.approved_payout || 0),
        paid_out: Number(r.paid_out || 0),
        rejected_payout: Number(r.rejected_payout || 0),
        due_balance: Number(r.due_balance || 0),
        request_count: Number(r.request_count || 0),
      })));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? rows.filter((r) => [r.business_name, r.code, r.payout_account_number, r.payout_method].join(" ").toLowerCase().includes(q))
      : rows;
    const { key, dir } = sort;
    const mul = dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (key === "business_name") return mul * String(av ?? "").localeCompare(String(bv ?? ""));
      if (key === "last_request_at") {
        return mul * ((av ? new Date(av as string).getTime() : 0) - (bv ? new Date(bv as string).getTime() : 0));
      }
      return mul * (Number(av || 0) - Number(bv || 0));
    });
  }, [rows, search, sort]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          earned: acc.earned + r.earned_profit,
          paid: acc.paid + r.paid_out,
          pending: acc.pending + r.pending_payout + r.approved_payout,
          due: acc.due + r.due_balance,
        }),
        { earned: 0, paid: 0, pending: 0, due: 0 },
      ),
    [filtered],
  );

  function toggle(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "business_name" ? "asc" : "desc" }));
  }

  function exportCsv() {
    const head = ["Reseller", "Code", "Total profit", "Deposit", "Pending", "Approved", "Withdrawn", "Frozen", "Due balance", "Requests", "Last request"];
    const lines = filtered.map((r) => [
      r.business_name ?? "", r.code ?? "", r.earned_profit, r.deposit_balance, r.pending_payout,
      r.approved_payout, r.paid_out, r.frozen_amount, r.due_balance, r.request_count,
      r.last_request_at ? new Date(r.last_request_at).toLocaleDateString() : "",
    ]);
    const csv = [head, ...lines].map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "reseller-payout-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="grid place-items-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!filtered.length) {
    return (
      <div className="surface-card p-12 text-center">
        <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No reseller balance data yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total profit" value={totals.earned} tone="bg-primary/10 text-primary" />
        <Stat label="Withdrawn" value={totals.paid} tone="bg-success/15 text-success" />
        <Stat label="In request" value={totals.pending} tone="bg-warning/20 text-warning-foreground" />
        <Stat label="Due balance" value={totals.due} tone="bg-accent/15 text-accent-foreground" />
      </div>

      <div className="flex justify-end">
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((r) => (
          <div key={r.reseller_id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{r.business_name ?? "—"}</div>
                <div className="text-[11px] text-muted-foreground">{r.code}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-muted-foreground">Due</div>
                <div className="font-bold tabular-nums text-primary">{bdt(r.due_balance)}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Cell label="Total profit" value={bdt(r.earned_profit)} />
              <Cell label="Withdrawn" value={bdt(r.paid_out)} />
              <Cell label="Pending" value={bdt(r.pending_payout)} />
              <Cell label="Approved" value={bdt(r.approved_payout)} />
              <Cell label="Deposit" value={bdt(r.deposit_balance)} />
              <Cell label="Frozen" value={bdt(r.frozen_amount)} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="surface-card hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 text-left text-xs uppercase text-primary">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className={"p-3 " + (c.numeric ? "text-right" : "")}>
                  <button onClick={() => toggle(c.key)} className={"inline-flex items-center gap-1 hover:opacity-80 " + (sort.key === c.key ? "font-bold" : "")}>
                    {c.label}
                    {sort.key === c.key ? (
                      sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.reseller_id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{r.business_name ?? "—"}</div>
                  <div className="text-[11px] text-muted-foreground">{r.code}{r.payout_method ? ` · ${r.payout_method}` : ""}</div>
                </td>
                <td className="p-3 text-right tabular-nums">{bdt(r.earned_profit)}</td>
                <td className="p-3 text-right tabular-nums text-muted-foreground">{bdt(r.deposit_balance)}</td>
                <td className="p-3 text-right tabular-nums">{r.pending_payout ? <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-warning-foreground">{bdt(r.pending_payout)}</span> : "—"}</td>
                <td className="p-3 text-right tabular-nums">{r.approved_payout ? bdt(r.approved_payout) : "—"}</td>
                <td className="p-3 text-right tabular-nums text-success">{bdt(r.paid_out)}</td>
                <td className="p-3 text-right tabular-nums text-muted-foreground">{r.frozen_amount ? bdt(r.frozen_amount) : "—"}</td>
                <td className="p-3 text-right font-semibold tabular-nums text-primary">{bdt(r.due_balance)}</td>
                <td className="p-3 text-right tabular-nums text-muted-foreground">{r.request_count}</td>
                <td className="p-3 text-right text-xs text-muted-foreground">
                  {r.last_request_at ? new Date(r.last_request_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-muted/40 text-xs font-semibold">
            <tr>
              <td className="p-3">Total ({filtered.length})</td>
              <td className="p-3 text-right tabular-nums">{bdt(totals.earned)}</td>
              <td className="p-3"></td>
              <td className="p-3"></td>
              <td className="p-3"></td>
              <td className="p-3 text-right tabular-nums">{bdt(totals.paid)}</td>
              <td className="p-3"></td>
              <td className="p-3 text-right tabular-nums text-primary">{bdt(totals.due)}</td>
              <td className="p-3"></td>
              <td className="p-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={"rounded-xl border p-3 " + tone}>
      <div className="text-[11px] uppercase opacity-80">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{bdt(value)}</div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}
