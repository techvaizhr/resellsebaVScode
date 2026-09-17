import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type SupplierPayoutReportRow = {
  supplier_id: string;
  code: string | null;
  display_name: string | null;
  status: string | null;
  payout_method: string | null;
  payout_account_name: string | null;
  payout_account_number: string | null;
  payout_bank_name: string | null;
  payout_branch: string | null;
  earned_amount: number;
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
  | "display_name"
  | "earned_amount"
  | "pending_payout"
  | "approved_payout"
  | "paid_out"
  | "due_balance"
  | "request_count"
  | "last_request_at";

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "display_name", label: "Supplier" },
  { key: "earned_amount", label: "Total earning", numeric: true },
  { key: "pending_payout", label: "Pending request", numeric: true },
  { key: "approved_payout", label: "Approved", numeric: true },
  { key: "paid_out", label: "Withdrawn", numeric: true },
  { key: "due_balance", label: "Due balance", numeric: true },
  { key: "request_count", label: "Requests", numeric: true },
  { key: "last_request_at", label: "Last request", numeric: true },
];

const bdt = (value: number) =>
  `৳${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export function PayoutSupplierReport({ search }: { search: string }) {
  const [rows, setRows] = useState<SupplierPayoutReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "due_balance",
    dir: "desc",
  });

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("admin_supplier_payout_report");
      if (error) toast.error(error.message);
      setRows(
        ((data ?? []) as SupplierPayoutReportRow[]).map((row) => ({
          ...row,
          earned_amount: Number(row.earned_amount || 0),
          pending_payout: Number(row.pending_payout || 0),
          approved_payout: Number(row.approved_payout || 0),
          paid_out: Number(row.paid_out || 0),
          rejected_payout: Number(row.rejected_payout || 0),
          due_balance: Number(row.due_balance || 0),
          request_count: Number(row.request_count || 0),
        })),
      );
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = query
      ? rows.filter((row) =>
          [row.display_name, row.code, row.payout_account_number, row.payout_method]
            .join(" ")
            .toLowerCase()
            .includes(query),
        )
      : rows;
    const multiplier = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (sort.key === "display_name") return multiplier * String(av ?? "").localeCompare(String(bv ?? ""));
      if (sort.key === "last_request_at") {
        return multiplier * ((av ? new Date(String(av)).getTime() : 0) - (bv ? new Date(String(bv)).getTime() : 0));
      }
      return multiplier * (Number(av || 0) - Number(bv || 0));
    });
  }, [rows, search, sort]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (sum, row) => ({
          earned: sum.earned + row.earned_amount,
          paid: sum.paid + row.paid_out,
          requested: sum.requested + row.pending_payout + row.approved_payout,
          due: sum.due + row.due_balance,
        }),
        { earned: 0, paid: 0, requested: 0, due: 0 },
      ),
    [filtered],
  );

  function toggle(key: SortKey) {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "display_name" ? "asc" : "desc" },
    );
  }

  function exportCsv() {
    const header = ["Supplier", "Code", "Total earning", "Pending", "Approved", "Withdrawn", "Due balance", "Requests", "Last request"];
    const lines = filtered.map((row) => [
      row.display_name ?? "",
      row.code ?? "",
      row.earned_amount,
      row.pending_payout,
      row.approved_payout,
      row.paid_out,
      row.due_balance,
      row.request_count,
      row.last_request_at ? new Date(row.last_request_at).toLocaleDateString() : "",
    ]);
    const csv = [header, ...lines]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "supplier-payout-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="grid place-items-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!filtered.length) {
    return (
      <div className="surface-card p-12 text-center">
        <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No supplier balance data yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total earning" value={totals.earned} tone="bg-primary/10 text-primary" />
        <Stat label="Withdrawn" value={totals.paid} tone="bg-success/15 text-success" />
        <Stat label="In request" value={totals.requested} tone="bg-warning/20 text-warning-foreground" />
        <Stat label="Due balance" value={totals.due} tone="bg-accent/15 text-accent-foreground" />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="space-y-3 lg:hidden">
        {filtered.map((row) => (
          <div key={row.supplier_id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-semibold">{row.display_name ?? "—"}</div>
                <div className="text-[11px] text-muted-foreground">{row.code}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-muted-foreground">Due</div>
                <div className="font-bold tabular-nums text-primary">{bdt(row.due_balance)}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Cell label="Total earning" value={bdt(row.earned_amount)} />
              <Cell label="Withdrawn" value={bdt(row.paid_out)} />
              <Cell label="Pending" value={bdt(row.pending_payout)} />
              <Cell label="Approved" value={bdt(row.approved_payout)} />
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead className="bg-primary/10 text-left text-xs uppercase text-primary">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} className={`p-3 ${column.numeric ? "text-right" : ""}`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggle(column.key)}
                    className={`h-auto p-0 hover:bg-transparent ${sort.key === column.key ? "font-bold" : ""}`}
                  >
                    {column.label}
                    {sort.key === column.key ? (
                      sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.supplier_id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{row.display_name ?? "—"}</div>
                  <div className="text-[11px] text-muted-foreground">{row.code}{row.payout_method ? ` · ${row.payout_method}` : ""}</div>
                </td>
                <td className="p-3 text-right tabular-nums">{bdt(row.earned_amount)}</td>
                <td className="p-3 text-right tabular-nums">{row.pending_payout ? <span className="rounded-md bg-warning/20 px-1.5 py-0.5 text-warning-foreground">{bdt(row.pending_payout)}</span> : "—"}</td>
                <td className="p-3 text-right tabular-nums">{row.approved_payout ? bdt(row.approved_payout) : "—"}</td>
                <td className="p-3 text-right tabular-nums text-success">{bdt(row.paid_out)}</td>
                <td className="p-3 text-right font-semibold tabular-nums text-primary">{bdt(row.due_balance)}</td>
                <td className="p-3 text-right tabular-nums text-muted-foreground">{row.request_count}</td>
                <td className="p-3 text-right text-xs text-muted-foreground">{row.last_request_at ? new Date(row.last_request_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-muted/40 text-xs font-semibold">
            <tr>
              <td className="p-3">Total ({filtered.length})</td>
              <td className="p-3 text-right tabular-nums">{bdt(totals.earned)}</td>
              <td className="p-3" />
              <td className="p-3" />
              <td className="p-3 text-right tabular-nums">{bdt(totals.paid)}</td>
              <td className="p-3 text-right tabular-nums text-primary">{bdt(totals.due)}</td>
              <td className="p-3" />
              <td className="p-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
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