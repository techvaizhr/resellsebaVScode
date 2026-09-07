-- Steadfast returns a real, working per-consignment tracking URL in its
-- create_order response as `consignment.tracking_link`
-- (e.g. https://steadfast.com.bd/tl/<token>), but our booking code was
-- discarding it and reconstructing a broken URL from tracking_code
-- (https://steadfast.com.bd/t/<tracking_code>), which shows "Link
-- Unavailable" on Steadfast's site.
--
-- This adds a column to persist the real link going forward, and backfills
-- it for already-booked Steadfast shipments from the original "booking"
-- courier_events row, where the full create_order response is still stored.

ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS tracking_url text;

-- Pass 1: match via shipment_id (set on every booking event since it was introduced).
UPDATE public.shipments s
SET tracking_url = ce.payload->'consignment'->>'tracking_link'
FROM public.courier_events ce
WHERE ce.shipment_id = s.id
  AND ce.provider = 'steadfast'
  AND ce.notification_type = 'booking'
  AND s.provider = 'steadfast'
  AND s.tracking_url IS NULL
  AND ce.payload->'consignment'->>'tracking_link' IS NOT NULL;

-- Pass 2: fallback for any older rows where shipment_id wasn't set on the event,
-- matched by order + consignment id instead.
UPDATE public.shipments s
SET tracking_url = ce.payload->'consignment'->>'tracking_link'
FROM public.courier_events ce
WHERE ce.shipment_id IS NULL
  AND ce.order_id = s.order_id
  AND ce.consignment_id = s.consignment_id
  AND ce.provider = 'steadfast'
  AND ce.notification_type = 'booking'
  AND s.provider = 'steadfast'
  AND s.tracking_url IS NULL
  AND ce.payload->'consignment'->>'tracking_link' IS NOT NULL;
