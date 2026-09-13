# ResellSeba — Project Structure & Safety Guide

> **⚠️ IMPORTANT: Read this before making ANY changes to the backend structure.**
> This document protects the project's core architecture from accidental breakage.

---

## 1. Database Schema (51 Tables)

All table definitions live in `backend/database/migrations/` and are mirrored in `database.sql`.
**NEVER rename or delete a migration file.** Always create a new migration if you need to alter a table.

### Table Registry (Canonical Order)

| # | Table Name | Migration File | Model |
|---|-----------|---------------|-------|
| 1 | `users` | `000001_create_users_table` | `User.php` |
| 2 | `profiles` | `000002_create_profiles_table` | `Profile.php` |
| 3 | `roles` | `000003_create_roles_table` | `Role.php` |
| 4 | `permissions` | `000004_create_permissions_table` | `Permission.php` |
| 5 | `role_permissions` | `000005_create_role_permissions_table` | `RolePermission.php` |
| 6 | `user_roles` | `000006_create_user_roles_table` | `UserRole.php` |
| 7 | `brands` | `000007_create_brands_table` | `Brand.php` |
| 8 | `categories` | `000008_create_categories_table` | `Category.php` |
| 9 | `suppliers` | `000009_create_suppliers_table` | `Supplier.php` |
| 10 | `products` | `000010_create_products_table` | `Product.php` |
| 11 | `product_images` | `000011_create_product_images_table` | `ProductImage.php` |
| 12 | `agents` | `000012_create_agents_table` | `Agent.php` |
| 13 | `resellers` | `000013_create_resellers_table` | `Reseller.php` |
| 14 | `orders` | `000014_create_orders_table` | `Order.php` |
| 15 | `reseller_settings` | `000014_create_reseller_settings_table` | `ResellerSetting.php` |
| 16 | `order_items` | `000015_create_order_items_table` | `OrderItem.php` |
| 17 | `reseller_listings` | `000015_create_reseller_listings_table` | `ResellerListing.php` |
| 18 | `reseller_domains` | `000016_create_reseller_domains_table` | `ResellerDomain.php` |
| 19 | `reseller_menu_items` | `000017_create_reseller_menu_items_table` | `ResellerMenuItem.php` |
| 20 | `reseller_policies` | `000018_create_reseller_policies_table` | `ResellerPolicy.php` |
| 21 | `reseller_deposits` | `000019_create_reseller_deposits_table` | `ResellerDeposit.php` |
| 22 | `subscription_plans` | `000020_create_subscription_plans_table` | `SubscriptionPlan.php` |
| 23 | `reseller_subscriptions` | `000021_create_reseller_subscriptions_table` | `ResellerSubscription.php` |
| 24 | `subscription_payments` | `000022_create_subscription_payments_table` | `SubscriptionPayment.php` |
| 25 | `order_status_history` | `000025_create_order_status_history_table` | `OrderStatusHistory.php` |
| 26 | `order_notes` | `000026_create_order_notes_table` | `OrderNote.php` |
| 27 | `shipments` | `000027_create_shipments_table` | `Shipment.php` |
| 28 | `courier_configs` | `000028_create_courier_configs_table` | `CourierConfig.php` |
| 29 | `courier_events` | `000029_create_courier_events_table` | `CourierEvent.php` |
| 30 | `payment_configs` | `000030_create_payment_configs_table` | `PaymentConfig.php` |
| 31 | `payment_gateway_configs` | `000031_create_payment_gateway_configs_table` | `PaymentGatewayConfig.php` |
| 32 | `deposit_requests` | `000032_create_deposit_requests_table` | `DepositRequest.php` |
| 33 | `agent_payouts` | `000033_create_agent_payouts_table` | `AgentPayout.php` |
| 34 | `leader_commissions` | `000034_create_leader_commissions_table` | `LeaderCommission.php` |
| 35 | `payouts` | `000035_create_payouts_table` | `Payout.php` |
| 36 | `expenses` | `000036_create_expenses_table` | `Expense.php` |
| 37 | `admin_notices` | `000037_create_admin_notices_table` | `AdminNotice.php` |
| 38 | `admin_notice_dismissals` | `000038_create_admin_notice_dismissals_table` | `AdminNoticeDismissal.php` |
| 39 | `system_notifications` | `000039_create_system_notifications_table` | `SystemNotification.php` |
| 40 | `notification_configs` | `000040_create_notification_configs_table` | `NotificationConfig.php` |
| 41 | `notification_logs` | `000041_create_notification_logs_table` | `NotificationLog.php` |
| 42 | `marketing_configs` | `000042_create_marketing_configs_table` | `MarketingConfig.php` |
| 43 | `global_settings` | `000043_create_global_settings_table` | `GlobalSetting.php` |
| 44 | `cloudflare_config` | `000044_create_cloudflare_config_table` | `CloudflareConfig.php` |
| 45 | `store_visits` | `000045_create_store_visits_table` | `StoreVisit.php` |
| 46 | `audit_log` | `000046_create_audit_log_table` | `AuditLog.php` |
| 47 | `supplier_returns` | `000047_create_supplier_returns_table` | `SupplierReturn.php` |
| 48 | `supplier_payouts` | `000048_create_supplier_payouts_table` | `SupplierPayout.php` |
| 49 | `tutorial_topics` | `000049_create_tutorial_topics_table` | `TutorialTopic.php` |
| 50 | `tutorials` | `000050_create_tutorials_table` | `Tutorial.php` |
| 51 | `verification_codes` | `000051_create_verification_codes_table` | `VerificationCode.php` |

---

## 2. System Roles (Fixed UUIDs — DO NOT CHANGE)

| UUID | Name | Slug |
|------|------|------|
| `11111111-1111-1111-1111-111111111101` | Super Admin | `super_admin` |
| `11111111-1111-1111-1111-111111111102` | Admin | `admin` |
| `11111111-1111-1111-1111-111111111103` | Staff | `staff` |
| `11111111-1111-1111-1111-111111111104` | Reseller | `reseller` |
| `11111111-1111-1111-1111-111111111105` | Supplier | `supplier` |
| `11111111-1111-1111-1111-111111111106` | Agent | `agent` |

---

## 3. Enums (Backend Constants)

| Enum File | Values |
|-----------|--------|
| `AppRole.php` | `super_admin`, `admin`, `staff`, `reseller`, `supplier`, `agent` |
| `OrderStatus.php` | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `returned`, `cancelled` |
| `PaymentStatus.php` | `unpaid`, `partial`, `paid`, `refunded` |
| `PaymentMethod.php` | `cod`, `bkash`, `nagad`, `bank`, `online` |
| `DeliveryArea.php` | `inside_dhaka`, `outside_dhaka`, `sub_dhaka` |
| `CourierProvider.php` | `steadfast`, `pathao`, `redx`, `manual` |
| `ShipmentStatus.php` | `in_review`, `pending`, `picked`, `in_transit`, `delivered`, `returned`, `cancelled` |
| `ResellerStatus.php` | `active`, `inactive`, `suspended`, `pending` |
| `PayoutStatus.php` | `pending`, `approved`, `paid`, `rejected` |

---

## 4. Default Admin Users (Seeded in database.sql)

| UUID | Email | Role |
|------|-------|------|
| `00000000-0000-0000-0000-000000000001` | `admin@resellseba.com` | `super_admin` |
| `00000000-0000-0000-0000-000000000002` | `zhroni3678@gmail.com` | `super_admin` |

**Password for all seeded users:** `password123`

---

## 5. Critical Safety Rules

### ❌ NEVER DO

1. **Never rename or delete** any existing migration file
2. **Never change** the UUID format (all tables use `char(36)` UUIDs)
3. **Never remove** the `id`, `created_at`, `updated_at` columns from any table
4. **Never change** the system role UUIDs or slugs
5. **Never delete** `backend/app/Models/*.php` files — the frontend depends on these structures
6. **Never modify** the `$fillable` array in models without updating related frontend code
7. **Never change** the `.env` key names (`DB_DATABASE`, `DB_USERNAME`, etc.)

### ✅ SAFE TO DO

1. **Add new columns** — create a new migration file (e.g., `000052_add_xyz_to_orders.php`)
2. **Add new tables** — create a new migration + model file
3. **Add new enum values** — append to existing enums (never remove existing values)
4. **Add new controllers/routes** — these are safe to add
5. **Update frontend components** — these don't affect DB structure

### ⚠️ CAUTION

1. **Adding foreign keys** — ensure the referenced table exists in migration order
2. **Changing column types** — may cause data loss; test on staging first
3. **Removing columns** — old data will be lost; frontend may break

---

## 6. File Structure Map

```
resellseba-main/
├── .env                          # Frontend + DB config
├── database.sql                  # Clean importable DB (51 tables + seeds)
├── AGENTS.md                     # Agent instructions
├── PROJECT_STRUCTURE.md          # THIS FILE
│
├── src/                          # Frontend (React + TanStack Start)
│   ├── lib/
│   │   ├── api-client.ts         # All API calls + mock fallback
│   │   └── initial-data.json     # Frontend mock/seed data
│   ├── routes/                   # Route-based pages
│   └── components/               # Reusable UI components
│
├── backend/                      # Laravel 11 API
│   ├── .env                      # Laravel environment config
│   ├── app/
│   │   ├── Models/               # 51 Eloquent models (1:1 with tables)
│   │   ├── Enums/                # 9 PHP enums
│   │   └── Http/Controllers/     # API controllers
│   ├── database/migrations/      # 51 migration files (source of truth)
│   └── config/                   # Laravel config files
│
├── api/                          # PHP entry point for cPanel
│   ├── index.php                 # Routes to Laravel
│   ├── .htaccess                 # Apache URL rewriting
│   └── standalone_backup.php     # Backup/restore engine (no Composer needed)
│
├── public/uploads/               # User-uploaded files
│   ├── branding/                 # Logo, favicon, OG images
│   ├── products/                 # Product images (git-ignored)
│   └── */                        # Other upload directories
│
└── dist/                         # Built frontend (deployment output)
```

---

## 7. How to Safely Add a New Feature

### Example: Adding a "Coupons" feature

1. **Create migration:** `backend/database/migrations/2026_09_14_000052_create_coupons_table.php`
2. **Create model:** `backend/app/Models/Coupon.php`
3. **Create controller:** `backend/app/Http/Controllers/CouponController.php`
4. **Add route:** in `backend/routes/api.php`
5. **Update database.sql:** Re-run the generator script or add the CREATE TABLE manually
6. **Update this document:** Add the new table to the Table Registry above

### Example: Adding a column to `orders`

1. **Create migration:** `backend/database/migrations/2026_09_14_000053_add_coupon_id_to_orders.php`
2. **Update model:** Add `'coupon_id'` to `$fillable` in `Order.php`
3. **Update database.sql:** Re-generate or manually add the column to the CREATE TABLE
4. **NEVER modify** the original `000014_create_orders_table.php`

---

## 8. Environment Variables Reference

### Root `.env`
```
VITE_API_URL=/api         # Frontend API base URL
VITE_APP_NAME=ResellSeba  # App display name
VITE_USE_MOCK=false       # Mock mode toggle
DB_DATABASE=              # MySQL database name
DB_USERNAME=              # MySQL username  
DB_PASSWORD=              # MySQL password
```

### `backend/.env`
```
APP_URL=                  # Production URL (e.g., https://petzavo.com)
FRONTEND_URL=             # Same as APP_URL for single-domain setup
DB_DATABASE=              # Same as root .env
DB_USERNAME=              # Same as root .env
DB_PASSWORD=              # Same as root .env
```

---

*Last updated: 2026-09-13*
*Total Tables: 51 | Total Models: 51 | Total Enums: 9*
