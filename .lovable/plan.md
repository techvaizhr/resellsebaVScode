# Supplier role, supplier report & payout

Notun ekta portion: **Supplier** — jara product supply kore. Admin nijeo supplier hote pare (product-e supplier na select korle seta admin-er nijer product). Flow reseller-er moto: signup → verify → admin approve → nijer dashboard.

## 1. Supplier account

- Notun role `supplier` (login/registration reseller-er moto, same verify process: email/SMS).
- `suppliers` table: user, code, display name, phone/whatsapp, status (pending / active / suspended / rejected), payout account info, notes.
- Signup korle status `pending` — admin approve na kora porjonto dashboard-e "approval pending" screen (reseller-er `canAccessResellerPanel` er moto)।
- Supplier-er access khub limited: nijer dashboard, nijer product sale report, return list, payout — onno kichu na.

## 2. Product-e supplier trigger

- `products.supplier_id` (nullable). Admin product create/edit-e ekta **Supplier** select box: "Admin's own product" (default) othoba ekta supplier.
- Price input ekta-i: **Supplier price** = admin-er cost (bortoman `buying_price` field-tai supplier select korle "Supplier price" label pabe, ar `products.supplier_price` e mirror hobe report-er jonno). Baki flow (reseller price, packaging, delivery) ojotha bodlabe na.
- Supplier chaile nijer product list korte parbe — status `draft/inactive`, admin approve + reseller price boshiye active korbe.

## 3. Order-e snapshot

- `order_items` e `supplier_id` + `supplier_price` snapshot hobe (order create-er somoy, bortoman `snapshot_order_item_costs` trigger extend kore). Fole product-er supplier pore bodlalèo purono order-er hisab thik thakbe.

## 4. Supplier earning math (profit nai, just price × qty)

Kept qty (supplier ja pabe) order status onujayi:

| Order status | Supplier kept qty |
| --- | --- |
| delivered, partial_full | full quantity |
| partial_item | quantity − returned_qty |
| partial_delivery, returned, damaged (full loss), cancelled | 0 |
| baki sob (pending/shipped ityadi) | 0 (upcoming hisabe dekhabe) |

Supplier earning = Σ (kept qty × supplier_price)। Kono profit/loss calculation nai — delivery/packaging supplier-er sathe jorito na.

## 5. Return flow — order ek jaigate, return alada ledger

Order-er status duplicate na kore ekta alada **supplier return** ledger banabo (tate reseller/supplier calculation-e conflict hobe na, ar order-o nijer status-e thakbe):

- Order jokhon `returned` / `partial_item` / `partial_delivery` hoy, trigger `supplier_returns` e row toiri kore: order, item, supplier, qty, supplier_price, status `pending_handover`.
- Admin oi row-ke **"Handed over to supplier"** mark korte parbe (status `handed_over`, timestamp + note). Supplier nijer panel-e dekhbe kon return tar kache eseche, kon ta ekhono admin-er kache।
- Partial order-e ja deliver hoyeche seta earning-e, ja ferot eseche seta return ledger-e — ekoi order duitatei thakbe, kintu amount double hobe na.

## 6. Supplier payout (withdraw)

- `supplier_payouts` table — reseller payout-er moto: request → admin approve → paid, method/reference/note, partial payment support.
- Available balance = total earning − (approved + paid payout)। Supplier request debe, admin approve/paid korbe.

## 7. Pages

**Supplier panel** (`/supplier/*`, notun layout + nav):
- Dashboard — total sold qty, total earning, paid, pending balance, recent orders
- Sales report — order onujayi row: order #, date, product, kept qty, supplier price, total, status; date filter + search + CSV export
- Returns — pending handover / handed over tab
- Payouts — balance + withdraw request + history
- Profile — nijer info, payout account, verify badge
- (optional) My products — nijer supply kora product list

**Admin**:
- `/admin/suppliers` — list, approve/suspend, payout info, impersonate-style view
- `/admin/supplier-report` — per supplier: sold qty, earning, return, paid, due; supplier filter + date range + CSV
- `/admin/supplier-payouts` — approve/pay flow (agent-payouts page-er moto)
- Product create/edit + product list-e supplier column/select
- Order settle modal-e return hole supplier return row auto toiri

## 8. Technical notes

- Ek page = ek bootstrap RPC (project rule): `supplier_bootstrap`, `supplier_report_page`, `admin_supplier_report` — sob SECURITY DEFINER + role check.
- Notun table-e GRANT + RLS: supplier nijer row-i dekhbe, admin sob।
- Permissions catalog-e `suppliers.view` / `suppliers.manage` add hobe, staff-o pabe।
- Math ekta jaigate: `src/lib/supplier.ts` (`supplierKeptQty`, `supplierEarning`) — DB trigger same formula rakhbe।
- Sob kichu dynamic thakbe, kono hardcode host/branding na।
