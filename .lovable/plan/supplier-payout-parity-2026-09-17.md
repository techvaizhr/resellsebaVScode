# Supplier payout parity

## What will change
- Rebuild the admin Supplier payouts screen with the same two tabs and visual structure as Payout Management.
- Tab 1: Supplier payout requests, with supplier filter, search, status counts, mobile cards, desktop table, payout account details, approve/reject/mark-paid actions, admin notes, and pagination.
- Tab 2: Supplier balance report, with supplier earnings, pending/approved requests, withdrawn amount, due balance, sortable columns, summary totals, search, and CSV export.
- Keep the existing direct “Record payment” option within the supplier requests workflow.

## Business rules
- Supplier earnings use the existing delivered/kept-item historical supplier price calculation.
- Withdrawn is the total of paid supplier payouts.
- In request is pending plus approved payouts.
- Due balance is supplier earnings minus paid, pending, and approved payouts, never below zero.
- Rejected payouts remain visible in history but do not reduce due balance.

## Technical details
- Add one admin-only supplier payout report function in the database so the report is calculated consistently and securely.
- Reuse the same request-management interaction pattern and responsive presentation as reseller Payout Management.
- Preserve supplier-specific account fields and existing permissions.
- Verify type safety and the authenticated admin screen on desktop and mobile.
