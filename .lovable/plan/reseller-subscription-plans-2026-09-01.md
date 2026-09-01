# Reseller subscription plans

Two products, four billing cycles, access enforced everywhere, and payment either from earnings or through the admin's payment methods.

## 1. Plans

Global plan catalog (admin editable):

| Plan | What it unlocks |
| --- | --- |
| Panel | Reseller panel only (catalog, orders, customers, finance). Public storefront `/s/<code>` + custom domain OFF. |
| Panel + Store | Everything, storefront and domain included. |

Each plan stores a price per cycle: 1 / 3 / 6 / 12 months, plus a free-trial length (days) and a grace period (days). Any single reseller can get an override: different price per cycle, extra trial, extra grace, or "exempt / lifetime free".

## 2. Lifecycle

```text
signup ──> trial (free_days)
trial end / period end ──> due
due (unpaid) ──> grace (grace_days, full access, warning banner)
grace end ──> expired  (access locked)
pay (earning or manual) ──> active until = max(now, current_end) + cycle months
```

- Trial and grace lengths come from the plan, overridable per reseller.
- Status is computed from dates in one place so admin, reseller and storefront always agree.

## 3. Access enforcement

- Reseller panel layout: expired → locked screen with "Renew" (only Subscription + Profile + Support reachable). Grace → dismissible warning bar with days left.
- Storefront route and custom-domain resolution: reseller on the Panel plan, or expired, → store not served (clean "store unavailable" page); no orders can be placed.
- Order create/confirm paths (panel and public checkout) reject when expired, same as the existing deposit gate.
- Store/domain/theme/menu pages in the panel are hidden for Panel-only plans.
- Admin, staff and supplier roles are never affected.

## 4. Paying

Reseller side (`/reseller/subscription`): current plan, days left, cycle picker with prices, and two ways to pay.

1. **From earnings** — deducts the amount from the reseller balance immediately, writes a `subscription` transaction (money out) so the transaction report and running balance stay correct. Blocked if balance (minus frozen deposit) is short.
2. **Manual payment** — pick any active admin payment method, send money, submit TrxID. Admin approves in `/admin/subscriptions` → period extends. Same shape as the existing deposit-request flow.

Admin can also extend/renew or mark paid for any reseller by hand.

## 5. Reports

- `/admin/subscriptions`: tabs for Plans (edit prices, trial, grace), Subscribers (status, plan, expiry, per-reseller override, renew/extend), Payment requests (approve/reject), and a Revenue report (filter by date, plan, cycle, payment source; CSV export).
- `/reseller/subscription` keeps its own payment history.
- Earning-paid subscriptions appear in the existing transaction report as an `out` row so balance math stays consistent; manually paid ones do not touch the balance.

## 6. Technical notes

- New tables: `subscription_plans`, `reseller_subscriptions` (one row per reseller: plan, cycle, trial/period ends, status), `subscription_payments` (paid/pending/rejected, source `earning` | `manual` | `admin`, method, trxid, period covered), plus override columns on `resellers`.
- Grants + RLS: reseller reads own rows and inserts own payment requests; admin/staff full access via `has_role` / permission checks.
- Balance deduction and period extension happen in one security-definer RPC (`subscription_pay_from_earning`, `subscription_review_payment`) so balance and period can never drift apart.
- `reseller_ledger` / transaction report source gains the subscription rows; `panel_bootstrap` and `store_bootstrap` return subscription status so no extra fetch is needed per page.
- New permission keys under a "Subscriptions" group in the role editor.
