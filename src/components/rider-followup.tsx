import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bike, Clock, AlertTriangle, RefreshCw, Loader2, ExternalLink, Search, Copy as CopyIcon, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { courierStatusLabel, elapsedLabel } from "@/lib/courier-status";
import { courierTrackingUrl } from "@/lib/courier-tracking";
import { getRiderFollowup, bulkRecheckCourierStatus } from "@/lib/order-details.functions";

type Row = {
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  city: string | null;
  area: string | null;
  status: string;
  total: number | string;
  cod_amount: number | string;
  reseller_name: string | null;
  reseller_code: string | null;
  reseller_phone: string | null;
  provider: string;
  consignment_id: string | null;
  tracking_id: string | null;
  tracking_url: string | null;
  courier_status: string | null;
  rider_assigned_at: string | null;
  last_event_at: string | null;
};

const bdt = (n: number | string) => `৳${Math.round(Number(n ?? 0)).toLocaleString("en-BD")}`;

function hoursSince(iso: string | null) {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

function ageTone(hours: number) {
  if (hours >= 48) return "bg-destructive/15 text-destructive";
  if (hours >= 24) return "bg-amber-500/15 text-amber-600";
  return "bg-primary/15 text-primary";
}

async function copyToClipboard(text: string | null | undefined) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  } catch {
    toast.error("Copy failed");
  }
}

function CopyButton({ value, label }: { value: string | null | undefined; label?: string }) {
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => copyToClipboard(value)}
      title={label ? `Copy ${label}` : "Copy"}
      className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <CopyIcon className="h-3.5 w-3.5" />
    </button>
  );
}

function CallButton({ phone }: { phone: string | null | undefined }) {
  if (!phone) return null;
  return (
    <a
      href={`tel:${phone}`}
      title={`Call ${phone}`}
      className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Phone className="h-3.5 w-3.5" />
    </a>
  );
}

/**
 * Orders that a courier has already handed to a delivery rider.
 * Same view for admin, reseller and supplier — the database scopes the rows.
 */
export function RiderFollowupView({ role }: { role: "admin" | "reseller" | "supplier" }) {
  const load = useServerFn(getRiderFollowup);
  const recheck = useServerFn(bulkRecheckCourierStatus);
  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("all");
  const [busy, setBusy] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rider-followup", role],
    queryFn: () => load({}),
    refetchInterval: 120000,
  });

  const rows = useMemo(() => ((data?.orders ?? []) as Row[]), [data]);

  const providers = useMemo(
    () => Array.from(new Set(rows.map((r) => r.provider).filter(Boolean))),
    [rows],
  );

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (provider !== "all" && r.provider !== provider) return false;
      if (!term) return true;
      return [
        r.order_number,
        r.customer_name,
        r.customer_phone,
        r.consignment_id,
        r.tracking_id,
        r.reseller_name,
        r.reseller_code,
        r.reseller_phone,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [rows, q, provider]);

  const over24 = visible.filter((r) => hoursSince(r.rider_assigned_at) >= 24).length;
  const over48 = visible.filter((r) => hoursSince(r.rider_assigned_at) >= 48).length;
  const codTotal = visible.reduce((s, r) => s + Number(r.cod_amount ?? 0), 0);

  async function checkAll() {
    if (visible.length === 0) return;
    setBusy(true);
    try {
      const res = await recheck({ data: { orderIds: visible.slice(0, 200).map((r) => r.order_id) } });
      toast.success(`${res.checked} parcel checked, ${res.changed} status updated`);
      if (res.errors?.length) toast.error(res.errors[0]!);
      await refetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Status check failed");
    } finally {
      setBusy(false);
    }
  }

  async function checkOne(orderId: string) {
    setBusy(true);
    try {
      const res = await recheck({ data: { orderIds: [orderId] } });
      toast.success(res.changed > 0 ? "Status updated" : "No change yet");
      await refetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Status check failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rider Followup"
        description="Parcels that are with a delivery rider right now — with how long they have been waiting."
        actions={
          <button
            type="button"
            onClick={checkAll}
            disabled={busy || visible.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Check courier status
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="With rider" value={String(visible.length)} icon={<Bike className="h-4 w-4" />} />
        <StatCard label="Over 24 hours" value={String(over24)} tone="amber" icon={<Clock className="h-4 w-4" />} />
        <StatCard
          label="Over 48 hours"
          value={String(over48)}
          tone="rose"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard label="COD to collect" value={bdt(codTotal)} tone="emerald" />
      </div>

      <div className="surface-card p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Order, customer, phone or consignment id"
              className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All couriers</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : visible.length === 0 ? (
          <div className="grid place-items-center gap-2 py-16 text-center">
            <Bike className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No parcel is with a rider right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((r) => {
              const hrs = hoursSince(r.rider_assigned_at);
              const link = courierTrackingUrl(r.provider, r, r.customer_phone);
              return (
                <div
                  key={r.order_id}
                  className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-0.5 font-semibold">
                        #{r.order_number}
                        <CopyButton value={r.order_number} label="order number" />
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
                        {r.provider}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                        {courierStatusLabel(r.courier_status, r.provider)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${ageTone(hrs)}`}>
                        {elapsedLabel(r.rider_assigned_at)} with rider
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span>
                        <span className="font-medium">Customer:</span>{" "}
                        <span className="text-muted-foreground">{r.customer_name}</span>
                      </span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-muted-foreground">{r.customer_phone}</span>
                        <CopyButton value={r.customer_phone} label="customer number" />
                        <CallButton phone={r.customer_phone} />
                      </div>
                    </div>

                    {role === "admin" && r.reseller_name ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span>
                          <span className="font-medium">Reseller:</span>{" "}
                          <span className="text-muted-foreground">{r.reseller_name}</span>
                        </span>
                        {r.reseller_code ? (
                          <div className="flex items-center gap-0.5">
                            <span className="text-muted-foreground">ID {r.reseller_code}</span>
                            <CopyButton value={r.reseller_code} label="reseller code" />
                          </div>
                        ) : null}
                        {r.reseller_phone ? (
                          <div className="flex items-center gap-0.5">
                            <span className="text-muted-foreground">{r.reseller_phone}</span>
                            <CopyButton value={r.reseller_phone} label="reseller number" />
                            <CallButton phone={r.reseller_phone} />
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Assigned:{" "}
                        {r.rider_assigned_at
                          ? new Date(r.rider_assigned_at).toLocaleString("en-GB", { hour12: true })
                          : "—"}
                      </span>
                      {r.consignment_id ? (
                        <div className="flex items-center gap-0.5">
                          <span>CN {r.consignment_id}</span>
                          <CopyButton value={r.consignment_id} label="booking id" />
                        </div>
                      ) : null}
                      {r.tracking_id && r.tracking_id !== r.consignment_id ? (
                        <div className="flex items-center gap-0.5">
                          <span>Track ID {r.tracking_id}</span>
                          <CopyButton value={r.tracking_id} label="tracking id" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                    <div className="text-sm font-semibold text-success">{bdt(r.cod_amount)}</div>
                    <div className="flex gap-2">
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Track
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => checkOne(r.order_id)}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Check
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
