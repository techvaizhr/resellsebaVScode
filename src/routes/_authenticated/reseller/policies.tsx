import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { fetchActivePolicies, type ResellerPolicy } from "@/lib/policies";
import { Loader2, ScrollText, CheckCircle2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reseller/policies")({
  component: PoliciesPage,
});

function PoliciesPage() {
  const [rows, setRows] = useState<ResellerPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchActivePolicies()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.summary && r.summary.toLowerCase().includes(q)) ||
        r.points.some((p) => p.toLowerCase().includes(q))
    );
  }, [rows, search]);

  if (loading) {
    return (
      <div className="grid min-h-[350px] place-items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Platform Rules & Policies"
          description="ডেলিভারি চার্জ, কমিশন উইথড্র, রিটার্ন ও রিসেলিং সংক্রান্ত অফিসিয়াল নীতিমালা।"
        />
        {rows.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="কোনো পলিসি প্রকাশিত হয়নি"
          description="প্ল্যাটফর্ম অ্যাডমিন পলিসি যোগ করলে তা এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।"
        />
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center rounded-2xl border border-border/80">
          <p className="text-sm font-semibold text-foreground">কোনো ফলাফল পাওয়া যায়নি</p>
          <p className="text-xs text-muted-foreground mt-1">ভিন্ন শব্দ দিয়ে সার্চ করুন।</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((p, i) => (
            <section
              key={p.id}
              className="surface-card rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {p.sort_order || i + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-foreground leading-snug">
                      {p.title}
                    </h2>
                    {p.summary && (
                      <p className="mt-0.5 text-xs text-muted-foreground font-medium">{p.summary}</p>
                    )}
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5 pl-1">
                  {p.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-foreground/90">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>অফিসিয়াল নীতি</span>
                </span>
                <span>{p.points.length}টি নিয়মাবলী</span>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
