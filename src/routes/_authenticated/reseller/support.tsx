import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/laravel/client";
import { getGlobalSettings } from "@/lib/app-data";
import { PageHeader } from "@/components/ui-kit";
import { Phone, MessageCircle, Mail, Copy, Loader2, Headphones, UserCheck } from "lucide-react";
import type { Agent } from "@/lib/agents";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reseller/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support & Contact — Reseller Panel" },
      {
        name: "description",
        content:
          "Reseller support: call, WhatsApp or email the admin team directly for orders, payouts and product help.",
      },
      { property: "og:title", content: "Support & Contact — Reseller Panel" },
      {
        property: "og:description",
        content: "Call, WhatsApp or email the admin team for any reseller support need.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Settings = {
  site_name: string | null;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
};

function digits(v: string) {
  return v.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function waNumber(phone: string) {
  let d = digits(phone);
  if (d.startsWith("0")) d = "88" + d;
  if (d.startsWith("1") && d.length === 10) d = "880" + d;
  return d;
}

function SupportPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getGlobalSettings();
      setS((data ?? null) as Settings | null);

      // My agent: the follow-up contact assigned to this reseller (if any).
      const { data: rid } = await supabase.rpc("current_reseller_id");
      if (rid) {
        const { data: row } = await supabase
          .from("resellers")
          .select("agent_id")
          .eq("id", rid as string)
          .maybeSingle();
        const agentId = (row as any)?.agent_id as string | null | undefined;
        if (agentId) {
          const { data: a } = await supabase
            .from("agents")
            .select("*")
            .eq("id", agentId)
            .eq("is_active", true)
            .maybeSingle();
          setAgent((a ?? null) as Agent | null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const copy = async (v: string, label: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const phone = s?.contact_phone?.trim() || "";
  const email = s?.contact_email?.trim() || "";
  const brand = s?.site_name?.trim() || "Admin";
  const waText = encodeURIComponent("Assalamu Alaikum, I am a reseller. I need assistance.");

  const cards = [
    phone && {
      key: "call",
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Call",
      desc: "Talk directly during office hours",
      value: phone,
      href: `tel:${digits(phone)}`,
      action: "Call",
      tone: "from-primary/15 to-primary/5 text-primary",
    },
    phone && {
      key: "wa",
      icon: <MessageCircle className="h-5 w-5" />,
      title: "WhatsApp",
      desc: "Message about orders, payments, or products",
      value: phone,
      href: `https://wa.me/${waNumber(phone)}?text=${waText}`,
      action: "Send Message",
      tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    },
    email && {
      key: "mail",
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      desc: "For detailed issues or sending documents",
      value: email,
      href: `mailto:${email}?subject=${encodeURIComponent("Reseller support")}`,
      action: "Send Email",
      tone: "from-sky-500/15 to-sky-500/5 text-sky-600",
    },
  ].filter(Boolean) as Array<{
    key: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    value: string;
    href: string;
    action: string;
    tone: string;
  }>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Contact"
        description={`Get in touch with the ${brand} team directly for any need`}
      />

      {agent && (
        <div className="surface-card overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 border-b bg-primary/5 px-4 py-3 sm:px-5">
            <UserCheck className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">My agent</h2>
          </div>
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary">
                {agent.display_name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <div className="truncate font-bold">{agent.display_name}</div>
                <p className="text-xs text-muted-foreground">
                  Your dedicated business follow-up person. Contact for growth, product or order guidance.
                </p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs">
                  {agent.phone && <span className="font-mono">{agent.phone}</span>}
                  {agent.email && <span className="break-all font-mono">{agent.email}</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {agent.phone && (
                <>
                  <a
                    href={`tel:${digits(agent.phone)}`}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${waNumber(agent.whatsapp || agent.phone)}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-muted"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(agent.phone!, "Agent number")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                    aria-label="Copy agent number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold hover:bg-muted"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <Headphones className="mx-auto mb-3 h-6 w-6" />
          No contact information has been added yet. Please check back later.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.key}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${c.tone}`}
              >
                {c.icon}
              </div>
              <h3 className="text-sm font-semibold">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              <p className="mt-3 break-all font-mono text-sm">{c.value}</p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  {c.action}
                </a>
                <button
                  type="button"
                  onClick={() => copy(c.value, c.title)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border transition hover:bg-muted"
                  aria-label={`Copy ${c.title}`}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">For faster support</p>
        <p className="mt-1">
          When messaging, please mention your reseller code, order number, or payment TrxID — this helps resolve issues faster.
        </p>
      </div>
    </div>
  );
}
