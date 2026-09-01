import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui-kit";
import { fetchActivePolicies, type ResellerPolicy } from "@/lib/policies";
import { Loader2, ScrollText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reseller/policies")({
  component: PoliciesPage,
});

function PoliciesPage() {
  const [rows, setRows] = useState<ResellerPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePolicies()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

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
        title="Policies"
        description="Platform rules in short points — delivery charge, profit, failed delivery, payout and more."
      />

      {rows.length === 0 ? (
        <EmptyState title="No policies published yet" description="Policies will appear here once the admin adds them." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((p, i) => (
            <section key={p.id} className="surface-card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ScrollText className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold leading-tight">
                    <span className="mr-1 text-muted-foreground tabular-nums">{i + 1}.</span>
                    {p.title}
                  </h2>
                  {p.summary && <p className="mt-0.5 text-xs text-muted-foreground">{p.summary}</p>}
                </div>
              </div>

              <ul className="mt-3 space-y-2">
                {p.points.map((point, idx) => (
                  <li key={idx} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
