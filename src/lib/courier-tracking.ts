/**
 * External (courier website) tracking links.
 * Steadfast : the real per-consignment link Steadfast returns at booking time
 *             (https://steadfast.com.bd/tl/<token>), saved on shipments.tracking_url.
 *             There is no way to derive this from tracking_code — a URL built as
 *             https://steadfast.com.bd/t/<tracking_code> looks plausible but 404s
 *             ("Link Unavailable") on Steadfast's own site, so it's only used as a
 *             last-resort fallback for the rare shipment saved before this existed.
 * Pathao    : https://merchant.pathao.com/tracking?consignment_id=<id>&phone=<customer phone>
 * Carrybee  : https://merchant.carrybee.com/order-track/<tracking_id>
 */
export function courierTrackingUrl(
  provider: string | null | undefined,
  shipment:
    | { tracking_id?: string | null; consignment_id?: string | null; tracking_url?: string | null }
    | null
    | undefined,
  customerPhone?: string | null,
): string | null {
  if (!provider || !shipment) return null;
  const tracking = (shipment.tracking_id || "").toString().trim();
  const consignment = (shipment.consignment_id || "").toString().trim();
  const any = tracking || consignment;
  if (!any) return null;

  switch (provider) {
    case "steadfast": {
      // Only the real per-consignment link works. A URL built from the tracking
      // code (https://steadfast.com.bd/t/<code>) 404s, so never fall back to it.
      const saved = (shipment.tracking_url || "").toString().trim();
      return saved || null;
    }
    case "pathao": {
      const id = consignment || tracking;
      const phone = (customerPhone || "").replace(/[^0-9]/g, "");
      const qs = new URLSearchParams({ consignment_id: id });
      if (phone) qs.set("phone", phone);
      return `https://merchant.pathao.com/tracking?${qs.toString()}`;
    }
    case "carrybee": {
      const id = tracking || consignment;
      return `https://merchant.carrybee.com/order-track/${encodeURIComponent(id)}`;
    }
    default:
      return null;
  }
}
