# Courier status automation + Rider Followup

## 1. Courier status → order status (one shared table)

Correct the mapping in `src/lib/courier-status.ts` so webhook, manual "recheck" and bulk check all
produce the same result:

| Courier state | Our order status |
| --- | --- |
| Picked / Sorted / In transit / hub movements (all 3 couriers, Steadfast "pending") | To Courier |
| Assigned for delivery / Assigned to rider / Ready for delivery | To Courier **+ Rider Followup flag** |
| Delivered | Delivered |
| Paid return, partial delivery, partial delivered (amount changed, parcel not fully returned) | Pending Partial |
| Return / Return initiated / Returned to merchant / delivery failed | Pending Return |

Rules kept as they are today: a courier event never sets the final `Returned`, `Cancelled` or the
settled partial statuses — an admin still confirms those after receiving the parcel/money.

## 2. Status changes apply everywhere

- Webhook (all three couriers) — already routed through one update function; it will use the new map.
- Single order "Recheck status" from the order view.
- **New:** bulk select on the order list → "Check courier status" runs the same sync for every
  selected order and reports how many changed.

## 3. Full status history (no more "only Delivered")

Every courier event is already stored; the order view will show the complete courier timeline
(each courier state with its time) merged with our own status history, newest first — so an order
that ends Delivered still shows Picked → In transit → Assigned to rider → Delivered.
To keep intermediate states for orders checked manually, each sync writes its event even when the
order status itself does not move.

## 4. Rider Followup menu

New page for admin, reseller and supplier (each sees only their own orders):

- Lists only orders whose courier state is Assigned for delivery / Assigned to rider /
  Ready for delivery.
- Columns: order, customer, courier + rider state, COD amount, **assigned at** and **time elapsed**
  (e.g. "4h 20m"), with colour warning when it crosses 24h / 48h.
- Search + courier filter, click-through to the order, and a "Check status" button (single and bulk).
- Summary strip: total waiting with rider, over 24h, over 48h.

## Technical notes

- Migration adds `shipments.rider_assigned_at` (nullable, set on the first rider-stage event) and a
  role-aware `rider_followup_orders()` RPC used by all three panels; grants for `authenticated`.
- Mapping lives only in `src/lib/courier-status.ts`; `applyCourierUpdate` in `couriers.server.ts`
  stamps `rider_assigned_at` and keeps the existing final-state lock.
- New route files `admin/rider-followup.tsx`, `reseller/rider-followup.tsx`,
  `supplier/rider-followup.tsx` plus one shared branded component, nav entries in each role layout.
- Existing tabs, reports, settlement and profit logic are untouched.
