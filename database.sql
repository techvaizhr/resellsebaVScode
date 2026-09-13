-- ===================================================
-- ResellSeba Clean Production Database
-- Complete Schema (51 Tables) with Essential System Seed Only
-- Zero Demo Products, Zero Demo Orders, Zero Mock Bloat
-- Generated: 2026-09-13T17:46:36.683Z
-- ===================================================
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: profiles
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `profiles_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: permissions
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `key` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `permissions_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: role_permissions
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `role_permissions_role_id_foreign` (`role_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_roles
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `role` varchar(255) NOT NULL,
  `custom_role_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `user_roles_user_id_foreign` (`user_id`),
  KEY `user_roles_custom_role_id_foreign` (`custom_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: brands
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: suppliers
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `code` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `payout_method` varchar(255) DEFAULT NULL,
  `payout_number` varchar(255) DEFAULT NULL,
  `payout_name` varchar(255) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `suppliers_user_id_foreign` (`user_id`),
  UNIQUE KEY `suppliers_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: products
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `product_code` varchar(255) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `buying_price` decimal(12,2) DEFAULT 0,
  `base_price` decimal(12,2) DEFAULT 0,
  `package_cost` decimal(12,2) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `main_image` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `supplier_id` char(36) DEFAULT NULL,
  `supplier_price` decimal(12,2) DEFAULT 0,
  `approval_status` varchar(255) DEFAULT 'approved',
  `pending_changes` json DEFAULT NULL,
  `submitted_by` char(36) DEFAULT NULL,
  `approval_note` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `delivery_charge_override` json DEFAULT NULL,
  `weight` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `products_slug_unique` (`slug`),
  UNIQUE KEY `products_product_code_unique` (`product_code`),
  KEY `products_brand_id_foreign` (`brand_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: product_images
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `product_id` char(36) NOT NULL,
  `url` text,
  `path` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `product_images_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: agents
DROP TABLE IF EXISTS `agents`;
CREATE TABLE `agents` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(12,2) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `agents_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: resellers
DROP TABLE IF EXISTS `resellers`;
CREATE TABLE `resellers` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `code` varchar(255) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `leader_id` char(36) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `agent_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `resellers_user_id_foreign` (`user_id`),
  UNIQUE KEY `resellers_code_unique` (`code`),
  KEY `resellers_leader_id_foreign` (`leader_id`),
  KEY `resellers_agent_id_foreign` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `order_number` varchar(255) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `customer_address` text,
  `customer_email` varchar(255) DEFAULT NULL,
  `delivery_area` varchar(255) DEFAULT 'outside_dhaka',
  `status` varchar(255) DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT 'cod',
  `payment_status` varchar(255) DEFAULT 'unpaid',
  `subtotal` decimal(12,2) DEFAULT 0,
  `delivery_charge` decimal(12,2) DEFAULT 0,
  `discount` decimal(12,2) DEFAULT 0,
  `total` decimal(12,2) DEFAULT 0,
  `advance_amount` decimal(12,2) DEFAULT 0,
  `advance_by` varchar(255) DEFAULT NULL,
  `received_amount` decimal(12,2) DEFAULT 0,
  `package_cost` decimal(12,2) DEFAULT 0,
  `note` text DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT 'panel',
  `is_forwarded` tinyint(1) DEFAULT 0,
  `forwarded_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `stock_restored` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_settings
DROP TABLE IF EXISTS `reseller_settings`;
CREATE TABLE `reseller_settings` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `logo_url` text DEFAULT NULL,
  `banner_url` text DEFAULT NULL,
  `hero_image_url` text DEFAULT NULL,
  `theme_color` varchar(255) DEFAULT '#6366f1',
  `accent_color` varchar(255) DEFAULT NULL,
  `font` varchar(255) DEFAULT NULL,
  `social_links` json DEFAULT NULL,
  `custom_css` text DEFAULT NULL,
  `store_description` text DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `announcement` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_settings_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_items
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL,
  `buying_price` decimal(12,2) DEFAULT 0,
  `total` decimal(12,2) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `supplier_id` char(36) DEFAULT NULL,
  `stock_held` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  KEY `order_items_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_listings
DROP TABLE IF EXISTS `reseller_listings`;
CREATE TABLE `reseller_listings` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_listings_reseller_id_foreign` (`reseller_id`),
  KEY `reseller_listings_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_domains
DROP TABLE IF EXISTS `reseller_domains`;
CREATE TABLE `reseller_domains` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `verification_method` varchar(255) DEFAULT NULL,
  `cf_hostname_id` varchar(255) DEFAULT NULL,
  `cf_status` varchar(255) DEFAULT NULL,
  `ssl_status` varchar(255) DEFAULT NULL,
  `dns_target` varchar(255) DEFAULT NULL,
  `mode` varchar(255) DEFAULT 'cloudflare',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_domains_reseller_id_foreign` (`reseller_id`),
  UNIQUE KEY `reseller_domains_domain_unique` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_menu_items
DROP TABLE IF EXISTS `reseller_menu_items`;
CREATE TABLE `reseller_menu_items` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_menu_items_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_policies
DROP TABLE IF EXISTS `reseller_policies`;
CREATE TABLE `reseller_policies` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_policies_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_deposits
DROP TABLE IF EXISTS `reseller_deposits`;
CREATE TABLE `reseller_deposits` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `type` varchar(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_deposits_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subscription_plans
DROP TABLE IF EXISTS `subscription_plans`;
CREATE TABLE `subscription_plans` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `features` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `max_products` int(11) DEFAULT NULL,
  `max_orders` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `subscription_plans_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reseller_subscriptions
DROP TABLE IF EXISTS `reseller_subscriptions`;
CREATE TABLE `reseller_subscriptions` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `plan_id` char(36) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `starts_at` timestamp NULL NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `reseller_subscriptions_reseller_id_foreign` (`reseller_id`),
  KEY `reseller_subscriptions_plan_id_foreign` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subscription_payments
DROP TABLE IF EXISTS `subscription_payments`;
CREATE TABLE `subscription_payments` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `subscription_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `reference` varchar(255) DEFAULT NULL,
  `reviewed_by` char(36) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `subscription_payments_subscription_id_foreign` (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_status_history
DROP TABLE IF EXISTS `order_status_history`;
CREATE TABLE `order_status_history` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `order_id` char(36) NOT NULL,
  `old_status` varchar(255) DEFAULT NULL,
  `new_status` varchar(255) NOT NULL,
  `changed_by` char(36) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `order_status_history_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_notes
DROP TABLE IF EXISTS `order_notes`;
CREATE TABLE `order_notes` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `order_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `content` text,
  `is_internal` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `order_notes_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: shipments
DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `order_id` char(36) NOT NULL,
  `courier` varchar(255) NOT NULL,
  `consignment_id` varchar(255) DEFAULT NULL,
  `tracking_code` varchar(255) DEFAULT NULL,
  `tracking_url` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `delivery_charge` decimal(12,2) DEFAULT 0,
  `cod_amount` decimal(12,2) DEFAULT 0,
  `weight` decimal(12,2) DEFAULT NULL,
  `pickup_store_id` varchar(255) DEFAULT NULL,
  `booked_by` char(36) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `shipments_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: courier_configs
DROP TABLE IF EXISTS `courier_configs`;
CREATE TABLE `courier_configs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `provider` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `api_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `config` json DEFAULT NULL,
  `webhook_secret` varchar(255) DEFAULT NULL,
  `webhook_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `courier_configs_provider_unique` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: courier_events
DROP TABLE IF EXISTS `courier_events`;
CREATE TABLE `courier_events` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `shipment_id` char(36) DEFAULT NULL,
  `consignment_id` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `raw_payload` json,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `courier_events_shipment_id_foreign` (`shipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payment_configs
DROP TABLE IF EXISTS `payment_configs`;
CREATE TABLE `payment_configs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) DEFAULT NULL,
  `method` varchar(255) NOT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `payment_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payment_gateway_configs
DROP TABLE IF EXISTS `payment_gateway_configs`;
CREATE TABLE `payment_gateway_configs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `credentials` json,
  `is_active` tinyint(1) DEFAULT 1,
  `is_test` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `payment_gateway_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: deposit_requests
DROP TABLE IF EXISTS `deposit_requests`;
CREATE TABLE `deposit_requests` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `gateway_provider` varchar(255) DEFAULT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `reviewed_by` char(36) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `deposit_requests_reseller_id_foreign` (`reseller_id`),
  UNIQUE KEY `deposit_requests_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: agent_payouts
DROP TABLE IF EXISTS `agent_payouts`;
CREATE TABLE `agent_payouts` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `agent_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `method` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `agent_payouts_agent_id_foreign` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: leader_commissions
DROP TABLE IF EXISTS `leader_commissions`;
CREATE TABLE `leader_commissions` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `leader_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `leader_commissions_leader_id_foreign` (`leader_id`),
  KEY `leader_commissions_order_id_foreign` (`order_id`),
  KEY `leader_commissions_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payouts
DROP TABLE IF EXISTS `payouts`;
CREATE TABLE `payouts` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `method` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `payouts_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: expenses
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: admin_notices
DROP TABLE IF EXISTS `admin_notices`;
CREATE TABLE `admin_notices` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `body` text,
  `level` varchar(255) DEFAULT 'info',
  `is_active` tinyint(1) DEFAULT 1,
  `is_dismissible` tinyint(1) DEFAULT 1,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `cta_label` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `target_reseller_ids` json DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: admin_notice_dismissals
DROP TABLE IF EXISTS `admin_notice_dismissals`;
CREATE TABLE `admin_notice_dismissals` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `notice_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `admin_notice_dismissals_notice_id_foreign` (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: system_notifications
DROP TABLE IF EXISTS `system_notifications`;
CREATE TABLE `system_notifications` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `message` text,
  `type` varchar(255) DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `user_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notification_configs
DROP TABLE IF EXISTS `notification_configs`;
CREATE TABLE `notification_configs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `config` json,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `notification_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notification_logs
DROP TABLE IF EXISTS `notification_logs`;
CREATE TABLE `notification_logs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `channel` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `error` text DEFAULT NULL,
  `order_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: marketing_configs
DROP TABLE IF EXISTS `marketing_configs`;
CREATE TABLE `marketing_configs` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `reseller_id` char(36) DEFAULT NULL,
  `platform` varchar(255) NOT NULL,
  `pixel_id` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `marketing_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: global_settings
DROP TABLE IF EXISTS `global_settings`;
CREATE TABLE `global_settings` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `key` varchar(255) NOT NULL,
  `value` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `global_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cloudflare_config
DROP TABLE IF EXISTS `cloudflare_config`;
CREATE TABLE `cloudflare_config` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `api_token` text DEFAULT NULL,
  `zone_id` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `worker_name` varchar(255) DEFAULT NULL,
  `settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: store_visits
DROP TABLE IF EXISTS `store_visits`;
CREATE TABLE `store_visits` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `store_code` varchar(255) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: audit_log
DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `record_id` char(36) DEFAULT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: supplier_returns
DROP TABLE IF EXISTS `supplier_returns`;
CREATE TABLE `supplier_returns` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `supplier_id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `order_item_id` char(36) DEFAULT NULL,
  `product_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(12,2) DEFAULT 0,
  `order_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `handed_over_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `supplier_returns_supplier_id_foreign` (`supplier_id`),
  KEY `supplier_returns_order_id_foreign` (`order_id`),
  KEY `supplier_returns_order_item_id_foreign` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: supplier_payouts
DROP TABLE IF EXISTS `supplier_payouts`;
CREATE TABLE `supplier_payouts` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `supplier_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `method` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `supplier_payouts_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tutorial_topics
DROP TABLE IF EXISTS `tutorial_topics`;
CREATE TABLE `tutorial_topics` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `tutorial_topics_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tutorials
DROP TABLE IF EXISTS `tutorials`;
CREATE TABLE `tutorials` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `topic_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  KEY `tutorials_topic_id_foreign` (`topic_id`),
  UNIQUE KEY `tutorials_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: verification_codes
DROP TABLE IF EXISTS `verification_codes`;
CREATE TABLE `verification_codes` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `channel` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `expires_at` timestamp NULL NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Essential seed data for: roles (6 records)
LOCK TABLES `roles` WRITE;
INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `is_system`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111101', 'Super Admin', 'super_admin', 'Full system control and administration', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z'),
('11111111-1111-1111-1111-111111111102', 'Admin', 'admin', 'Administrator operations', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z'),
('11111111-1111-1111-1111-111111111103', 'Staff', 'staff', 'Staff member order and catalog management', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z'),
('11111111-1111-1111-1111-111111111104', 'Reseller', 'reseller', 'Store reseller partner', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z'),
('11111111-1111-1111-1111-111111111105', 'Supplier', 'supplier', 'Product supplier partner', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z'),
('11111111-1111-1111-1111-111111111106', 'Agent', 'agent', 'Affiliate and onboarding agent', 1, '2026-09-13T17:46:36.702Z', '2026-09-13T17:46:36.702Z');
UNLOCK TABLES;

-- Essential seed data for: users (2 records)
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `avatar_url`, `full_name`, `is_phone_verified`, `created_at`, `updated_at`) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'admin@resellseba.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01700000000', NULL, 'Super Admin', 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('00000000-0000-0000-0000-000000000002', 'Zahid Hasan', 'zhroni3678@gmail.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '01736483638', NULL, 'Zahid Hasan', 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

-- Essential seed data for: user_roles (2 records)
LOCK TABLES `user_roles` WRITE;
INSERT INTO `user_roles` (`id`, `user_id`, `role`, `custom_role_id`, `created_at`, `updated_at`) VALUES
('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000001', 'super_admin', '11111111-1111-1111-1111-111111111101', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('22222222-2222-2222-2222-222222222202', '00000000-0000-0000-0000-000000000002', 'super_admin', '11111111-1111-1111-1111-111111111101', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

-- Essential seed data for: profiles (2 records)
LOCK TABLES `profiles` WRITE;
INSERT INTO `profiles` (`id`, `user_id`, `full_name`, `phone`, `avatar_url`, `is_phone_verified`, `created_at`, `updated_at`) VALUES
('33333333-3333-3333-3333-333333333301', '00000000-0000-0000-0000-000000000001', 'Super Admin', '01700000000', NULL, 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('33333333-3333-3333-3333-333333333302', '00000000-0000-0000-0000-000000000002', 'Zahid Hasan', '01736483638', NULL, 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

-- Essential seed data for: subscription_plans (3 records)
LOCK TABLES `subscription_plans` WRITE;
INSERT INTO `subscription_plans` (`id`, `name`, `code`, `monthly_fee`, `features`, `is_active`, `created_at`, `updated_at`) VALUES
('44444444-4444-4444-4444-444444444401', 'Free Trial / Starter', 'starter', 0, '[\"Up to 50 product listings\",\"Subdomain store\",\"Standard courier integration\",\"Basic analytics\"]', 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('44444444-4444-4444-4444-444444444402', 'Pro Reseller', 'pro', 499, '[\"Unlimited listings\",\"Custom domain support\",\"Priority courier sync\",\"Facebook Pixel & CAPI\",\"Automated invoices\"]', 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('44444444-4444-4444-4444-444444444403', 'Business / VIP', 'business', 999, '[\"Everything in Pro\",\"Zero transaction fees\",\"Dedicated support\",\"Custom themes\",\"Staff accounts\"]', 1, '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

-- Essential seed data for: courier_configs (2 records)
LOCK TABLES `courier_configs` WRITE;
INSERT INTO `courier_configs` (`id`, `provider`, `is_active`, `config`, `created_at`, `updated_at`) VALUES
('55555555-5555-5555-5555-555555555501', 'steadfast', 1, '{\"api_key\":\"\",\"secret_key\":\"\"}', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('55555555-5555-5555-5555-555555555502', 'pathao', 0, '{\"client_id\":\"\",\"client_secret\":\"\"}', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

-- Essential seed data for: global_settings (11 records)
LOCK TABLES `global_settings` WRITE;
INSERT INTO `global_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
('78aadecc-1833-4ec7-a1dd-6d253aeab92f', 'site_name', 'ResellSeba', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('840e20f6-a8bd-4e57-9bce-cabcdc56e444', 'primary_color', '#4f46e5', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('88018ce9-a8d9-4cba-a47d-148ddd9102f4', 'accent_color', '#f59e0b', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('45bffc3f-e471-40ec-9231-d620a5ae4014', 'border_radius', '0.875rem', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('882ad660-4e15-4783-a352-a5c542f4d1ce', 'tagline', 'Launch your own online store with zero investment', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('e2cd38e5-75ff-40cd-9b33-4e4a8c41fc69', 'logo_url', '/uploads/branding/166777d0-f627-4904-8b3d-ae5b024b9b50.webp', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('3864cd41-59a6-4852-bfd6-a5d7e489a043', 'favicon_url', '/uploads/branding/0ab29621-3af4-42ff-96ff-c6ae8aa32b25.webp', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('528398ab-15c9-4ef2-94da-955425df5aba', 'og_image_url', '/uploads/branding/be5ffbde-52a4-4a5f-aaae-2d3c4a9a3836.webp', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('0f5f5921-85f3-4f2e-bf9f-2e85b7319a85', 'currency', 'BDT', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('27c37415-892e-4f98-a99e-dda167a67b57', 'currency_symbol', '৳', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z'),
('2879fbfa-73b3-4bf9-acea-b9c43d6cc024', 'advanced_settings', '{\"delivery\":{\"inside_dhaka\":60,\"outside_dhaka\":120,\"sub_dhaka\":100}}', '2026-09-13T17:46:36.703Z', '2026-09-13T17:46:36.703Z');
UNLOCK TABLES;

COMMIT;
SET FOREIGN_KEY_CHECKS=1;