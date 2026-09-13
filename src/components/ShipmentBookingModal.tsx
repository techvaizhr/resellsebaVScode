import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Truck, AlertTriangle, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { bookSteadfast, bookPathao, bookCarrybee } from "@/lib/couriers.functions";
import { getCourierBookingOptions } from "@/lib/courier-config.functions";
import { COURIER_BRANDS, CourierLogo } from "@/components/courier-brand";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderIds: string[];
  onSuccess: () => void;
}

export function ShipmentBookingModal({
  isOpen,
  onClose,
  orderIds,
  onSuccess,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<"steadfast" | "pathao" | "carrybee">("steadfast");
  const [storeId, setStoreId] = useState<string>("");

  const fetchOptions = useServerFn(getCourierBookingOptions);
  const { data: options = [] } = useQuery({
    queryKey: ["courier-booking-options"],
    queryFn: () => fetchOptions(),
  });

  const activeProviders = useMemo(() => options.map((o) => o.provider), [options]);
  const activeCourierList = useMemo(
    () => activeProviders.map((id) => (COURIER_BRANDS as any)[id]).filter(Boolean),
    [activeProviders],
  );

  const current = useMemo(
    () => options.find((o) => o.provider === provider) ?? null,
    [options, provider],
  );
  const stores = current?.stores ?? [];
  const needsStoreChoice = stores.length > 1;

  useEffect(() => {
    if (activeProviders.length > 0 && !activeProviders.includes(provider)) {
      setProvider(activeProviders[0] as any);
    }
  }, [activeProviders]);

  useEffect(() => {
    if (!current) return;
    const remembered =
      typeof window !== "undefined"
        ? window.localStorage.getItem(`courier-store:${current.provider}`) ?? ""
        : "";
    const fallback =
      (current.stores.some((s) => s.id === remembered) && remembered) ||
      current.defaultStoreId ||
      current.stores[0]?.id ||
      "";
    setStoreId(current.stores.some((s) => s.id === storeId) ? storeId : fallback);
  }, [current]);

  const pickStore = (id: string) => {
    setStoreId(id);
    if (typeof window !== "undefined") window.localStorage.setItem(`courier-store:${provider}`, id);
  };

  const doSteadfast = useServerFn(bookSteadfast);
  const doPathao = useServerFn(bookPathao);
  const doCarrybee = useServerFn(bookCarrybee);

  const handleBook = async () => {
    if (orderIds.length === 0) return;
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    let lastErrorMessage = "";
    for (const id of orderIds) {
      try {
        try {
          const apiRes = await fetch("/api/public/courier/actions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "book",
              provider,
              orderId: id,
              storeId: storeId || undefined,
            }),
          });
          const apiData = await apiRes.json();
          if (apiData && apiData.success) {
            res = apiData;
          }
        } catch {}

        if (!res) {
          if (provider === "steadfast") {
            res = await doSteadfast({ data: { orderId: id } });
          } else if (provider === "pathao") {
            res = await doPathao({ data: { orderId: id, ...(storeId ? { storeId } : {}) } });
          } else if (provider === "carrybee") {
            res = await doCarrybee({ data: { orderId: id, ...(storeId ? { storeId } : {}) } });
          }
        }
        successCount++;
      } catch (err: any) {
        console.error(`Booking failed for ${id}:`, err);
        failCount++;
        if (err instanceof Response) {
          try {
            const txt = await err.text();
            if (txt) lastErrorMessage = txt;
          } catch {}
        } else if (err?.message) {
          lastErrorMessage = err.message;
        }
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully booked ${successCount} order(s) with ${provider}`);
      onSuccess();
      onClose();
    }
    if (failCount > 0) {
      toast.error(
        lastErrorMessage
          ? `Booking failed: ${lastErrorMessage}`
          : `Failed to book ${failCount} order(s). Please check courier settings.`,
      );
    }
    setLoading(false);
  };

  // Single active courier with no store choice → book straight away, no popup.
  const autoBook = activeProviders.length === 1 && !needsStoreChoice;

  useEffect(() => {
    if (isOpen && !loading && autoBook && orderIds.length > 0) {
      handleBook();
    }
  }, [isOpen, autoBook, orderIds]);

  if (autoBook && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-medium">
              Booking {orderIds.length} order(s) with {activeCourierList[0]?.label}...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Courier Booking
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Select a courier provider to book {orderIds.length} selected order(s).
          </p>

          <div className="grid grid-cols-1 gap-3">
            {activeCourierList.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent ${
                  provider === p.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CourierLogo provider={p.id} size={30} />
                  <span className="font-semibold">{p.label}</span>
                </div>
                {provider === p.id && <div className="h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {stores.length > 0 && (
            <div className="mt-4">
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium">
                <Store className="h-3.5 w-3.5" /> Pickup store
                {stores.length > 1 && (
                  <span className="text-muted-foreground">({stores.length} saved)</span>
                )}
              </label>
              <select
                value={storeId}
                onChange={(e) => pickStore(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.id}
                    {current?.defaultStoreId === s.id ? " (default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-800 border border-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-xs leading-relaxed">
              Booking will create live consignments in the courier panel.
              Ensure store configurations are correct before proceeding.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={loading || activeProviders.length === 0}
            onClick={handleBook}
            className="btn-brand flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm {provider ? (COURIER_BRANDS as any)[provider]?.label : "Courier"} Booking
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
