import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import {
  fetchAllPolicies,
  pointsFromText,
  pointsToText,
  type ResellerPolicy,
} from "@/lib/policies";
import { Loader2, Plus, Save, Trash2, ScrollText, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/policies")({
  component: PoliciesAdmin,
});

type Draft = {
  id: string | null;
  title: string;
  summary: string;
  pointsText: string;
  sort_order: number;
  is_active: boolean;
};

function toDraft(p: ResellerPolicy): Draft {
  return {
    id: p.id,
    title: p.title,
    summary: p.summary ?? "",
    pointsText: pointsToText(p.points),
    sort_order: p.sort_order,
    is_active: p.is_active,
  };
}

function PoliciesAdmin() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const list = await fetchAllPolicies();
      setRows(list.map(toDraft));
    } catch (e: any) {
      toast.error(e.message ?? "Could not load policies");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function patch(index: number, next: Partial<Draft>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...next } : r)));
  }

  function addNew() {
    setRows((prev) => [
      ...prev,
      {
        id: null,
        title: "New policy",
        summary: "",
        pointsText: "",
        sort_order: (prev.at(-1)?.sort_order ?? 0) + 1,
        is_active: true,
      },
    ]);
  }

  async function save(index: number) {
    const row = rows[index];
    if (!row.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setBusy(row.id ?? `new-${index}`);
    const payload = {
      title: row.title.trim(),
      summary: row.summary.trim() || null,
      points: pointsFromText(row.pointsText),
      sort_order: Number(row.sort_order) || 0,
      is_active: row.is_active,
      updated_at: new Date().toISOString(),
    };
    if (row.id) {
      const { error } = await supabase.from("reseller_policies").update(payload).eq("id", row.id);
      setBusy(null);
      if (error) return toast.error(error.message);
      toast.success("Policy saved");
    } else {
      const { data, error } = await supabase
        .from("reseller_policies")
        .insert(payload)
        .select("id")
        .single();
      setBusy(null);
      if (error) return toast.error(error.message);
      patch(index, { id: (data as any).id });
      toast.success("Policy added");
    }
  }

  async function remove(index: number) {
    const row = rows[index];
    if (!confirm("Delete this policy?")) return;
    if (row.id) {
      const { error } = await supabase.from("reseller_policies").delete().eq("id", row.id);
      if (error) return toast.error(error.message);
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
    toast.success("Policy deleted");
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reseller policies"
        description="Short, point-wise rules shown to every reseller in their panel — delivery charge, profit, failed delivery and more."
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addNew}
          className="btn-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
        >
          <Plus className="h-4 w-4" /> Add policy
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No policies yet"
          description="Add your first policy section so resellers know the rules."
        />
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => (
            <div key={row.id ?? `new-${index}`} className="surface-card space-y-3 p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={row.title}
                  onChange={(e) => patch(index, { title: e.target.value })}
                  placeholder="Policy title"
                  className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  type="number"
                  value={row.sort_order}
                  onChange={(e) => patch(index, { sort_order: Number(e.target.value) })}
                  className="w-20 rounded-lg border bg-background px-3 py-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-primary/40"
                  title="Sort order"
                />
                <button
                  type="button"
                  onClick={() => patch(index, { is_active: !row.is_active })}
                  className={
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold " +
                    (row.is_active
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-muted bg-muted/40 text-muted-foreground")
                  }
                >
                  {row.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {row.is_active ? "Visible" : "Hidden"}
                </button>
              </div>

              <input
                value={row.summary}
                onChange={(e) => patch(index, { summary: e.target.value })}
                placeholder="One-line summary (optional)"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Points — one per line
                </label>
                <textarea
                  value={row.pointsText}
                  onChange={(e) => patch(index, { pointsText: e.target.value })}
                  rows={6}
                  placeholder={"Delivery charge follows the platform rule.\nProduct level rule overrides the platform rule."}
                  className="w-full rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button
                  type="button"
                  onClick={() => save(index)}
                  disabled={busy === (row.id ?? `new-${index}`)}
                  className="btn-brand inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  {busy === (row.id ?? `new-${index}`) ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
