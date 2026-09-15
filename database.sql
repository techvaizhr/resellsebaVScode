-- ResellSeba Master Database Backup
-- Database: zhroni367_resellseba_site
-- Generated: 2026-09-14 12:31:31

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;
SET NAMES utf8mb4;


-- Table: `admin_notice_dismissals`
DROP TABLE IF EXISTS `admin_notice_dismissals`;
CREATE TABLE `admin_notice_dismissals` (
  `id` char(36) NOT NULL,
  `notice_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_notice_dismissals_notice_id_foreign` (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `admin_notices`
DROP TABLE IF EXISTS `admin_notices`;
CREATE TABLE `admin_notices` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `level` varchar(255) DEFAULT 'info',
  `is_active` tinyint(1) DEFAULT 1,
  `is_dismissible` tinyint(1) DEFAULT 1,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `cta_label` varchar(255) DEFAULT NULL,
  `cta_url` varchar(255) DEFAULT NULL,
  `target_reseller_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_reseller_ids`)),
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `agent_payouts`
DROP TABLE IF EXISTS `agent_payouts`;
CREATE TABLE `agent_payouts` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `agent_payouts_agent_id_foreign` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `agents`
DROP TABLE IF EXISTS `agents`;
CREATE TABLE `agents` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `commission_rate` decimal(12,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agents_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `audit_log`
DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `record_id` char(36) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `ip` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `brands`
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`id`, `name`, `slug`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
('22222222-3333-4444-5555-666666666601', 'Smart Tech', 'smart-tech', NULL, '1', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('22222222-3333-4444-5555-666666666602', 'Apple', 'apple', NULL, '2', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('22222222-3333-4444-5555-666666666603', 'Samsung', 'samsung', NULL, '3', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('22222222-3333-4444-5555-666666666604', 'Xiaomi', 'xiaomi', NULL, '4', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('22222222-3333-4444-5555-666666666605', 'ResellSeba', 'resellseba', NULL, '5', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `categories`
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `image_url`, `parent_id`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
('11111111-2222-3333-4444-555555555501', 'গ্যাজেট ও ইলেকট্রনিক্স', 'gadgets-electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', NULL, '1', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-2222-3333-4444-555555555502', 'ফ্যাশন ও লাইফস্টাইল', 'fashion-lifestyle', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600', NULL, '2', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-2222-3333-4444-555555555503', 'হেলথ ও বিউটি', 'health-beauty', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', NULL, '3', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-2222-3333-4444-555555555504', 'হোম ও কিচেন', 'home-kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600', NULL, '4', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `cloudflare_config`
DROP TABLE IF EXISTS `cloudflare_config`;
CREATE TABLE `cloudflare_config` (
  `id` char(36) NOT NULL,
  `api_token` text DEFAULT NULL,
  `zone_id` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `worker_name` varchar(255) DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `courier_configs`
DROP TABLE IF EXISTS `courier_configs`;
CREATE TABLE `courier_configs` (
  `id` char(36) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `api_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `webhook_secret` varchar(255) DEFAULT NULL,
  `webhook_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courier_configs_provider_unique` (`provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `courier_configs` (`id`, `provider`, `is_active`, `api_key`, `secret_key`, `config`, `webhook_secret`, `webhook_token`, `created_at`, `updated_at`) VALUES
('55555555-5555-5555-5555-555555555501', 'steadfast', '1', NULL, NULL, '{\"api_key\":\"\",\"secret_key\":\"\"}', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('55555555-5555-5555-5555-555555555502', 'pathao', '0', NULL, NULL, '{\"client_id\":\"\",\"client_secret\":\"\"}', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('55555555-5555-5555-5555-555555555503', 'carrybee', '0', NULL, NULL, '{\"api_key\":\"\"}', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `courier_events`
DROP TABLE IF EXISTS `courier_events`;
CREATE TABLE `courier_events` (
  `id` char(36) NOT NULL,
  `shipment_id` char(36) DEFAULT NULL,
  `consignment_id` varchar(255) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `raw_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_payload`)),
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courier_events_shipment_id_foreign` (`shipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `deposit_requests`
DROP TABLE IF EXISTS `deposit_requests`;
CREATE TABLE `deposit_requests` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `deposit_requests_code_unique` (`code`),
  KEY `deposit_requests_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `expenses`
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `global_settings`
DROP TABLE IF EXISTS `global_settings`;
CREATE TABLE `global_settings` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`value`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `global_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `global_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
('0f5f5921-85f3-4f2e-bf9f-2e85b7319a85', 'currency', '\"BDT\"', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('27c37415-892e-4f98-a99e-dda167a67b57', 'currency_symbol', '\"৳\"', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('2879fbfa-73b3-4bf9-acea-b9c43d6cc024', 'advanced_settings', '{\"delivery\":{\"inside_dhaka\":60,\"outside_dhaka\":120,\"sub_dhaka\":100}}', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('33de5ff2-db25-4e5a-9ab4-db2f637a1187', 'og_image_url', NULL, '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('45bffc3f-e471-40ec-9231-d620a5ae4014', 'border_radius', '\"0.875rem\"', '2026-09-14 18:00:00', '2026-09-14 18:07:19'),
('58b74b9e-e9f9-458c-b7fc-0583356a9c71', 'flagship_reseller_code', NULL, '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('7045fa29-3cc6-4aec-997d-d90ca1db24f9', 'label_size', '\"3x4\"', '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('72486b4c-be7f-400d-9d0f-0af901a786f8', 'contact_email', NULL, '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('78aadecc-1833-4ec7-a1dd-6d253aeab92f', 'site_name', '\"ResellSeba\"', '2026-09-14 18:00:00', '2026-09-14 18:07:19'),
('840e20f6-a8bd-4e57-9bce-cabcdc56e444', 'primary_color', '\"#e11d48\"', '2026-09-14 18:00:00', '2026-09-14 18:07:19'),
('88018ce9-a8d9-4cba-a47d-148ddd9102f4', 'accent_color', '\"#fb7185\"', '2026-09-14 18:00:00', '2026-09-14 18:07:19'),
('882ad660-4e15-4783-a352-a5c542f4d1ce', 'tagline', '\"Launch your own online store with zero investment\"', '2026-09-14 18:00:00', '2026-09-14 18:07:19'),
('cad5e71e-d586-4de0-b4eb-ff2fae6a7517', 'logo_url', '\"\\/uploads\\/branding\\/166777d0-f627-4904-8b3d-ae5b024b9b50.webp\"', '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('cd1deb46-555b-4e97-8df3-dc359fd48449', 'meta_title_template', NULL, '2026-09-14 17:20:12', '2026-09-14 18:07:19'),
('d0212db2-11f9-4764-a91a-c76299d74842', 'meta_description', NULL, '2026-09-14 17:20:12', '2026-09-14 18:07:19'),
('eeaf8f9d-60ab-45db-a51d-152e82d5707d', 'favicon_url', '\"\\/uploads\\/branding\\/0ab29621-3af4-42ff-96ff-c6ae8aa32b25.webp\"', '2026-09-14 18:00:11', '2026-09-14 18:07:19'),
('fd11026e-ec82-42a1-a525-ae940a0ba030', 'contact_phone', NULL, '2026-09-14 18:00:11', '2026-09-14 18:07:19');

-- Table: `leader_commissions`
DROP TABLE IF EXISTS `leader_commissions`;
CREATE TABLE `leader_commissions` (
  `id` char(36) NOT NULL,
  `leader_id` char(36) NOT NULL,
  `order_id` char(36) DEFAULT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leader_commissions_leader_id_foreign` (`leader_id`),
  KEY `leader_commissions_order_id_foreign` (`order_id`),
  KEY `leader_commissions_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `marketing_configs`
DROP TABLE IF EXISTS `marketing_configs`;
CREATE TABLE `marketing_configs` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `platform` varchar(255) NOT NULL,
  `pixel_id` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `marketing_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `notification_configs`
DROP TABLE IF EXISTS `notification_configs`;
CREATE TABLE `notification_configs` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `notification_logs`
DROP TABLE IF EXISTS `notification_logs`;
CREATE TABLE `notification_logs` (
  `id` char(36) NOT NULL,
  `channel` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `error` text DEFAULT NULL,
  `order_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `order_items`
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL,
  `buying_price` decimal(12,2) DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `supplier_id` char(36) DEFAULT NULL,
  `stock_held` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  KEY `order_items_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `order_notes`
DROP TABLE IF EXISTS `order_notes`;
CREATE TABLE `order_notes` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_internal` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_notes_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `order_status_history`
DROP TABLE IF EXISTS `order_status_history`;
CREATE TABLE `order_status_history` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `old_status` varchar(255) DEFAULT NULL,
  `new_status` varchar(255) NOT NULL,
  `changed_by` char(36) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_status_history_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `orders`
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` char(36) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `delivery_area` varchar(255) DEFAULT 'outside_dhaka',
  `status` varchar(255) DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT 'cod',
  `payment_status` varchar(255) DEFAULT 'unpaid',
  `subtotal` decimal(12,2) DEFAULT 0.00,
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `total` decimal(12,2) DEFAULT 0.00,
  `advance_amount` decimal(10,2) DEFAULT 0.00,
  `advance_by` varchar(255) DEFAULT NULL,
  `received_amount` decimal(10,2) DEFAULT 0.00,
  `package_cost` decimal(10,2) DEFAULT 0.00,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_reseller_id_foreign` (`reseller_id`),
  KEY `orders_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `payment_configs`
DROP TABLE IF EXISTS `payment_configs`;
CREATE TABLE `payment_configs` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `method` varchar(255) NOT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `payment_gateway_configs`
DROP TABLE IF EXISTS `payment_gateway_configs`;
CREATE TABLE `payment_gateway_configs` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `credentials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`credentials`)),
  `is_active` tinyint(1) DEFAULT 1,
  `is_test` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_gateway_configs_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `payouts`
DROP TABLE IF EXISTS `payouts`;
CREATE TABLE `payouts` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `payouts_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `permissions`
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`id`, `key`, `label`, `group_name`, `created_at`, `updated_at`) VALUES
('66666666-6666-6666-6666-000000000001', 'orders.view', 'View Orders', 'orders', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000002', 'orders.create', 'Create Orders', 'orders', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000003', 'orders.edit', 'Edit Orders', 'orders', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000004', 'orders.delete', 'Delete Orders', 'orders', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000005', 'products.view', 'View Products', 'products', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000006', 'products.create', 'Create Products', 'products', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000007', 'products.edit', 'Edit Products', 'products', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000008', 'products.delete', 'Delete Products', 'products', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000009', 'resellers.view', 'View Resellers', 'resellers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000010', 'resellers.create', 'Create Resellers', 'resellers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000011', 'resellers.edit', 'Edit Resellers', 'resellers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000012', 'resellers.delete', 'Delete Resellers', 'resellers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000013', 'suppliers.view', 'View Suppliers', 'suppliers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000014', 'suppliers.create', 'Create Suppliers', 'suppliers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000015', 'suppliers.edit', 'Edit Suppliers', 'suppliers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000016', 'suppliers.delete', 'Delete Suppliers', 'suppliers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000017', 'staff.view', 'View Staff', 'staff', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000018', 'staff.create', 'Create Staff', 'staff', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000019', 'staff.edit', 'Edit Staff', 'staff', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000020', 'staff.delete', 'Delete Staff', 'staff', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000021', 'settings.view', 'View Settings', 'settings', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000022', 'settings.create', 'Create Settings', 'settings', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000023', 'settings.edit', 'Edit Settings', 'settings', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000024', 'settings.delete', 'Delete Settings', 'settings', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000025', 'reports.view', 'View Reports', 'reports', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000026', 'reports.create', 'Create Reports', 'reports', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000027', 'reports.edit', 'Edit Reports', 'reports', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000028', 'reports.delete', 'Delete Reports', 'reports', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000029', 'couriers.view', 'View Couriers', 'couriers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000030', 'couriers.create', 'Create Couriers', 'couriers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000031', 'couriers.edit', 'Edit Couriers', 'couriers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000032', 'couriers.delete', 'Delete Couriers', 'couriers', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000033', 'payments.view', 'View Payments', 'payments', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000034', 'payments.create', 'Create Payments', 'payments', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000035', 'payments.edit', 'Edit Payments', 'payments', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000036', 'payments.delete', 'Delete Payments', 'payments', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000037', 'agents.view', 'View Agents', 'agents', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000038', 'agents.create', 'Create Agents', 'agents', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000039', 'agents.edit', 'Edit Agents', 'agents', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000040', 'agents.delete', 'Delete Agents', 'agents', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000041', 'catalog.view', 'View Catalog', 'catalog', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000042', 'catalog.create', 'Create Catalog', 'catalog', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000043', 'catalog.edit', 'Edit Catalog', 'catalog', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000044', 'catalog.delete', 'Delete Catalog', 'catalog', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000045', 'notifications.view', 'View Notifications', 'notifications', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000046', 'notifications.create', 'Create Notifications', 'notifications', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000047', 'notifications.edit', 'Edit Notifications', 'notifications', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('66666666-6666-6666-6666-000000000048', 'notifications.delete', 'Delete Notifications', 'notifications', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `personal_access_tokens`
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `product_images`
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `url` text DEFAULT NULL,
  `path` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: `products`
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `product_code` varchar(255) DEFAULT NULL,
  `brand_id` char(36) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `buying_price` decimal(12,2) DEFAULT 0.00,
  `base_price` decimal(12,2) DEFAULT 0.00,
  `package_cost` decimal(10,2) DEFAULT 0.00,
  `stock` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `main_image` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `supplier_id` char(36) DEFAULT NULL,
  `supplier_price` decimal(12,2) DEFAULT 0.00,
  `approval_status` varchar(255) DEFAULT 'approved',
  `pending_changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pending_changes`)),
  `submitted_by` char(36) DEFAULT NULL,
  `approval_note` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `delivery_charge_override` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`delivery_charge_override`)),
  `weight` decimal(8,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  UNIQUE KEY `products_product_code_unique` (`product_code`),
  KEY `products_brand_id_foreign` (`brand_id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: `profiles`
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profiles_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `profiles` (`id`, `user_id`, `full_name`, `phone`, `avatar_url`, `is_phone_verified`, `created_at`, `updated_at`) VALUES
('33333333-3333-3333-3333-333333333301', '00000000-0000-0000-0000-000000000001', 'Super Admin', '01700000000', NULL, '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('33333333-3333-3333-3333-333333333302', '00000000-0000-0000-0000-000000000002', 'Zahid Hasan', '01736483638', NULL, '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `reseller_deposits`
DROP TABLE IF EXISTS `reseller_deposits`;
CREATE TABLE `reseller_deposits` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `type` varchar(255) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_deposits_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `reseller_domains`
DROP TABLE IF EXISTS `reseller_domains`;
CREATE TABLE `reseller_domains` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `reseller_domains_domain_unique` (`domain`),
  KEY `reseller_domains_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `reseller_listings`
DROP TABLE IF EXISTS `reseller_listings`;
CREATE TABLE `reseller_listings` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_listings_reseller_id_foreign` (`reseller_id`),
  KEY `reseller_listings_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `reseller_menu_items`
DROP TABLE IF EXISTS `reseller_menu_items`;
CREATE TABLE `reseller_menu_items` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_menu_items_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `reseller_policies`
DROP TABLE IF EXISTS `reseller_policies`;
CREATE TABLE `reseller_policies` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `points` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`points`)),
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `type` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_policies_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reseller_policies` (`id`, `reseller_id`, `title`, `summary`, `points`, `sort_order`, `is_active`, `type`, `content`, `created_at`, `updated_at`) VALUES
('2438c245-0b09-4449-b613-af2b42014a9a', NULL, 'অর্ডার ফ্লো ও স্ট্যাটাস', 'কে কী পরিবর্তন করতে পারবেন এবং কখন।', '[\"অর্ডার Pending থাকা অবস্থায় আপনি তৈরি, এডিট, ডিলিট ও স্ট্যাটাস পরিবর্তন করতে পারবেন।\",\"Send to admin করার পর অর্ডারটি আপনার জন্য লক হয়ে যায় এবং অ্যাডমিন যাচাই শুরু হয়।\",\"অ্যাডমিন অর্ডারটি Confirmed, Packaging, Ready to ship ও Courier booking ধাপে এগিয়ে নেন।\",\"কুরিয়ার ওয়েবহুক Delivered, Partial ও Return স্ট্যাটাস স্বয়ংক্রিয়ভাবে আপডেট করে।\",\"চূড়ান্ত সেটেলমেন্ট (রিটার্ন রিসিভ, পারশাল টাইপ, ড্যামেজড) শুধু অ্যাডমিন করেন।\"]', '5', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('2c0c2ef2-0ef3-449c-ab7c-ddbaf8cc2eae', NULL, 'ডেলিভারি ব্যর্থ বা রিটার্ন', 'পার্সেল ফিরে এলে কী হয়।', '[\"পার্সেল সম্পূর্ণ রিটার্ন হলে কাস্টমারের কাছ থেকে কোনো টাকা পাওয়া যায় না।\",\"তবুও সেই অর্ডারের ডেলিভারি (রিটার্ন) চার্জ ও প্যাকেজিং খরচ আপনাকে বহন করতে হবে।\",\"অর্থাৎ রিটার্ন অর্ডারে লোকসান = ডেলিভারি + প্যাকেজিং।\",\"বারবার ফেক বা উদাসীন অর্ডার হলে অ্যাকাউন্টে সীমাবদ্ধতা আসতে পারে।\"]', '3', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('3d1b78f8-b305-4b4a-91fc-c7310ace780a', NULL, 'প্রোডাক্ট, প্রাইস ও স্টক', 'আপনার স্টোরের ক্যাটালগ নিয়ম।', '[\"বিক্রয় মূল্য আপনি নিজে ঠিক করবেন, তবে তা অ্যাডমিন প্রাইসের নিচে হতে পারবে না।\",\"লাইভ স্টক অনুযায়ী অর্ডার গৃহীত হয়; স্টক শেষ হলে প্রোডাক্ট স্টোর থেকে স্বয়ংক্রিয়ভাবে হাইড হয়।\",\"আপনার স্টোরে লিস্ট করা না থাকলেও যেকোনো অ্যাক্টিভ ক্যাটালগ প্রোডাক্টের অর্ডার তৈরি করতে পারবেন।\",\"প্রোডাক্টের ছবি ও বিবরণ শুধুমাত্র নিজের স্টোরের মার্কেটিংয়ে ব্যবহার করা যাবে।\"]', '9', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('5c67a413-50d1-414a-9199-592c52a79022', NULL, 'ডেলিভারি চার্জ', 'প্রতিটি অর্ডারে ডেলিভারি চার্জ কীভাবে নির্ধারণ হয়।', '[\"ডিফল্ট ডেলিভারি রুল: সাধারণ ডেলিভারি চার্জ এলাকা অনুযায়ী (Inside Dhaka \\/ Sub Dhaka \\/ Outside Dhaka) নির্ধারিত হবে।\",\"বিশেষ প্রোডাক্ট বা অফার: কিছু প্রোডাক্টে নির্দিষ্ট ডেলিভারি চার্জ বা ফ্রি-শিপিং প্রযোজ্য হতে পারে। অ্যাডমিন ফ্রি-শিপিং দিলে কোনো ডেলিভারি চার্জ লাগবে না।\",\"ফ্লেক্সিবল ডেলিভারি চার্জ: রিসেলার চাইলে প্রফিট মার্জিন হিসাব করে কাস্টমার থেকে ডেলিভারি চার্জ কম-বেশি বা ফ্রি করতে পারেন।\",\"হিসাবের নিয়ম: সিস্টেম থেকে শুধু নির্ধারিত চার্জটিই (যেমন: ৬০ টাকা) কাটা হবে। কাস্টমারের থেকে বেশি চার্জ নিলে (যেমন: ১০০ টাকা) বাড়তি ৪০ টাকা রিসেলারের অতিরিক্ত প্রফিট হবে; আবার ডেলিভারি ফ্রি দিলে সেই অনুযায়ী প্রফিট কমবে।\",\"চার্জ পরিবর্তন: বিশেষ প্রয়োজনে অ্যাডমিন ডেলিভারি চার্জ পরিবর্তন করতে পারেন, যা প্রোডাক্ট নোটে জানিয়ে দেওয়া হবে।\"]', '1', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('82d5dc20-c8ef-475c-aae7-d23952967e56', NULL, 'সাবস্ক্রিপশন ও অ্যাক্সেস', 'প্ল্যান, ট্রায়াল ও গ্রেস পিরিয়ডের নিয়ম।', '[\"প্যানেল (এবং অন্তর্ভুক্ত থাকলে স্টোরফ্রন্ট) চালু রাখতে একটি প্ল্যান প্রয়োজন।\",\"সাবস্ক্রিপশন ফি আপনার আর্নিং থেকে কাটা যায় অথবা উপলভ্য পেমেন্ট মেথডে পরিশোধ করা যায়।\",\"ট্রায়াল পিরিয়ডে কোনো খরচ ছাড়াই পূর্ণ অ্যাক্সেস পাবেন।\",\"মেয়াদ শেষ হলে গ্রেস পিরিয়ড প্রযোজ্য হয়; গ্রেস শেষে অ্যাক্সেস সীমিত হয়ে যায়।\"]', '8', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('87e45039-3afa-4854-a038-ba89ce341630', NULL, 'অ্যাকাউন্ট ও নিরাপত্তা', 'আপনার অ্যাকাউন্ট নিরাপদ রাখার নিয়ম।', '[\"লগইন তথ্য গোপন রাখুন; আপনার অ্যাকাউন্টে হওয়া সব কাজের দায়িত্ব আপনার।\",\"ভুল বা ভুয়া তথ্য দিলে অ্যাকাউন্ট স্থগিত হতে পারে।\",\"প্ল্যাটফর্মের নিয়ম লঙ্ঘন করলে নোটিশ ছাড়াই অ্যাক্সেস বন্ধ হতে পারে।\",\"যেকোনো সমস্যায় সাপোর্টের সাথে যোগাযোগ করুন।\"]', '10', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('9a5b2ad6-b189-4caa-9022-e7c3c03a7b12', NULL, 'প্রফিট হিসাব', 'একটি অর্ডারে আপনার প্রফিট কীভাবে হিসাব হয়।', '[\"প্রফিট = কাস্টমারের কাছ থেকে প্রাপ্ত টাকা - প্রোডাক্ট খরচ - ডেলিভারি খরচ - প্যাকেজিং খরচ।\",\"উদাহরণঃ ১০০০-৫০০-১০০-২০=৩৮০ টাকা প্রফিট\",\"প্রোডাক্ট খরচ হলো কাস্টমার যে প্রোডাক্টগুলো রেখেছে সেগুলোর অ্যাডমিন (রিসেলার) প্রাইস।\",\"প্যাকেজিং খরচ প্রোডাক্ট সেটিংস থেকে আসে এবং প্রতি অর্ডারে যোগ হয়।\",\"আপনি যে ডিস্কাউন্ট দেন তা আপনার নিজের প্রফিট থেকে কাটা হয়, অ্যাডমিন প্রাইস থেকে নয়।\",\"অর্ডার সেটেল (delivered \\/ partial \\/ returned) না হওয়া পর্যন্ত প্রফিট চূড়ান্ত হয় না।\"]', '2', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('a0b8fcb2-f0a0-4251-aa17-b346f42d261c', NULL, 'ড্যামেজড বা হারানো প্রোডাক্ট', 'প্রোডাক্ট ড্যামেজ হয়ে ফিরে এলে যা হয়।', '[\"ডেলিভারি, রিটার্ন বা পারশাল সেটেলমেন্টের পর অর্ডারটি Damaged চিহ্নিত করা যায়।\",\"কাস্টমারের কাছ থেকে যা সংগ্রহ হয়েছে তা প্রাপ্ত হিসেবে ধরা হয়।\",\"এই ক্ষেত্রে রিসেলার কে প্রোডাক্ট এর কোনো ক্ষতি পূরণ দিতে হবে না।\"]', '6', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('adad5568-1191-4188-9ae2-cdc25c672797', NULL, 'আংশিক ডেলিভারি', 'কাস্টমার অর্ডারের অংশ রাখলে যা হয়।', '[\"অ্যাডমিন কাস্টমারের কাছ থেকে প্রাপ্ত প্রকৃত টাকার পরিমাণ রেকর্ড করেন।\",\"ফুল-আইটেম পারশাল: কাস্টমার সব প্রোডাক্ট রাখে কিন্তু কম বা বেশি টাকা দেয়; পুরো খরচ প্রযোজ্য থাকে।\",\"আইটেম পারশাল: শুধু রাখা প্রোডাক্টের টাকা ধরা হয়; ফেরত প্রোডাক্ট স্টকে ফিরে যায়।\",\"ডেলিভারি-অনলি পারশাল: কাস্টমার শুধু ডেলিভারি চার্জ দেয় এবং সব প্রোডাক্ট ফেরত দেয়।\",\"প্রতিটি পারশালে প্রফিট = প্রাপ্ত টাকা - প্রযোজ্য খরচ।\"]', '4', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('cbe66ac6-ce1f-4e9b-a724-4a788f875192', NULL, 'পেমেন্ট, ব্যালেন্স ও পেআউট', 'আপনার টাকা কীভাবে আসে-যায়।', '[\"অর্ডার সেটেল হওয়ার পরই প্রফিট আপনার ব্যালেন্সে যোগ হয়।\",\"রিটার্ন  অর্ডারের লোকসান একই ব্যালেন্স থেকে কাটা হয়।\",\"পেআউট রিকোয়েস্ট অ্যাডমিন রিভিউ করে আপনার সংরক্ষিত পেআউট মেথডে পেমেন্ট করা হয়।\",\"ফ্রোজন বা রিকোয়ার্ড ডিপোজিট অংশ উত্তোলনযোগ্য নয়।\",\"প্রতিটি ক্রেডিট ও ডেবিট Transactions রিপোর্টে দেখা যায়।\"]', '7', '1', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `reseller_settings`
DROP TABLE IF EXISTS `reseller_settings`;
CREATE TABLE `reseller_settings` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) NOT NULL,
  `logo_url` text DEFAULT NULL,
  `banner_url` text DEFAULT NULL,
  `hero_image_url` text DEFAULT NULL,
  `theme_color` varchar(255) DEFAULT '#6366f1',
  `accent_color` varchar(255) DEFAULT NULL,
  `font` varchar(255) DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`)),
  `custom_css` text DEFAULT NULL,
  `store_description` text DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `announcement` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_settings_reseller_id_foreign` (`reseller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `reseller_subscriptions`
DROP TABLE IF EXISTS `reseller_subscriptions`;
CREATE TABLE `reseller_subscriptions` (
  `id` char(36) NOT NULL,
  `reseller_id` char(36) NOT NULL,
  `plan_id` char(36) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `starts_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reseller_subscriptions_reseller_id_foreign` (`reseller_id`),
  KEY `reseller_subscriptions_plan_id_foreign` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `resellers`
DROP TABLE IF EXISTS `resellers`;
CREATE TABLE `resellers` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `resellers_code_unique` (`code`),
  KEY `resellers_user_id_foreign` (`user_id`),
  KEY `resellers_leader_id_foreign` (`leader_id`),
  KEY `resellers_agent_id_foreign` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `role_permissions`
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_permissions_role_id_foreign` (`role_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
('77777777-7777-7777-7777-000000000001', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000001', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000002', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000002', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000003', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000003', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000004', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000004', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000005', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000005', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000006', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000006', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000007', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000007', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000008', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000008', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000009', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000009', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000010', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000010', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000011', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000011', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000012', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000012', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000013', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000013', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000014', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000014', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000015', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000015', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000016', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000016', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000017', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000017', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000018', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000018', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000019', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000019', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000020', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000020', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000021', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000021', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000022', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000022', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000023', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000023', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000024', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000024', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000025', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000025', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000026', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000026', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000027', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000027', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000028', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000028', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000029', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000029', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000030', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000030', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000031', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000031', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000032', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000032', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000033', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000033', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000034', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000034', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000035', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000035', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000036', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000036', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000037', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000037', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000038', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000038', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000039', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000039', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000040', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000040', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000041', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000041', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000042', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000042', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000043', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000043', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000044', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000044', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000045', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000045', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000046', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000046', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000047', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000047', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('77777777-7777-7777-7777-000000000048', '11111111-1111-1111-1111-111111111101', '66666666-6666-6666-6666-000000000048', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `roles`
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `is_system` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `display_name`, `is_system`, `created_at`, `updated_at`) VALUES
('11111111-1111-1111-1111-111111111101', 'super_admin', 'Super Admin', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111102', 'admin', 'Administrator', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111103', 'staff', 'Staff', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111104', 'reseller', 'Reseller', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111105', 'supplier', 'Supplier', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111106', 'agent', 'Agent', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('11111111-1111-1111-1111-111111111107', 'leader', 'Leader', '1', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `shipments`
DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
  `id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `courier` varchar(255) NOT NULL,
  `consignment_id` varchar(255) DEFAULT NULL,
  `tracking_code` varchar(255) DEFAULT NULL,
  `tracking_url` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `delivery_charge` decimal(12,2) DEFAULT 0.00,
  `cod_amount` decimal(12,2) DEFAULT 0.00,
  `weight` decimal(12,2) DEFAULT NULL,
  `pickup_store_id` varchar(255) DEFAULT NULL,
  `booked_by` char(36) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shipments_order_id_foreign` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `store_visits`
DROP TABLE IF EXISTS `store_visits`;
CREATE TABLE `store_visits` (
  `id` char(36) NOT NULL,
  `store_code` varchar(255) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `subscription_payments`
DROP TABLE IF EXISTS `subscription_payments`;
CREATE TABLE `subscription_payments` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `subscription_payments_subscription_id_foreign` (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `subscription_plans`
DROP TABLE IF EXISTS `subscription_plans`;
CREATE TABLE `subscription_plans` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `max_products` int(11) DEFAULT NULL,
  `max_orders` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_plans_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subscription_plans` (`id`, `name`, `slug`, `price`, `duration_days`, `features`, `is_active`, `sort_order`, `max_products`, `max_orders`, `created_at`, `updated_at`) VALUES
('44444444-4444-4444-4444-444444444401', 'Free Trial / Starter', 'starter', '0.00', '30', '[\"Up to 50 product listings\", \"Subdomain store\", \"Standard courier integration\", \"Basic analytics\"]', '1', '1', '50', '100', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('44444444-4444-4444-4444-444444444402', 'Pro Reseller', 'pro', '499.00', '30', '[\"Unlimited listings\", \"Custom domain support\", \"Priority courier sync\", \"Facebook Pixel & CAPI\", \"Automated invoices\"]', '1', '2', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('44444444-4444-4444-4444-444444444403', 'Business / VIP', 'business', '999.00', '30', '[\"Everything in Pro\", \"Zero transaction fees\", \"Dedicated support\", \"Custom themes\", \"Staff accounts\"]', '1', '3', NULL, NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `supplier_payouts`
DROP TABLE IF EXISTS `supplier_payouts`;
CREATE TABLE `supplier_payouts` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  KEY `supplier_payouts_supplier_id_foreign` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `supplier_returns`
DROP TABLE IF EXISTS `supplier_returns`;
CREATE TABLE `supplier_returns` (
  `id` char(36) NOT NULL,
  `supplier_id` char(36) NOT NULL,
  `order_id` char(36) NOT NULL,
  `order_item_id` char(36) DEFAULT NULL,
  `product_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(12,2) DEFAULT 0.00,
  `order_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `handed_over_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_returns_supplier_id_foreign` (`supplier_id`),
  KEY `supplier_returns_order_id_foreign` (`order_id`),
  KEY `supplier_returns_order_item_id_foreign` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `suppliers`
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_code_unique` (`code`),
  KEY `suppliers_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `system_notifications`
DROP TABLE IF EXISTS `system_notifications`;
CREATE TABLE `system_notifications` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `type` varchar(255) DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `user_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `tutorial_topics`
DROP TABLE IF EXISTS `tutorial_topics`;
CREATE TABLE `tutorial_topics` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tutorial_topics_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `tutorials`
DROP TABLE IF EXISTS `tutorials`;
CREATE TABLE `tutorials` (
  `id` char(36) NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `tutorials_slug_unique` (`slug`),
  KEY `tutorials_topic_id_foreign` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: `user_roles`
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `role` varchar(255) NOT NULL,
  `custom_role_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_roles_user_id_foreign` (`user_id`),
  KEY `user_roles_custom_role_id_foreign` (`custom_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_roles` (`id`, `user_id`, `role`, `custom_role_id`, `created_at`, `updated_at`) VALUES
('22222222-2222-2222-2222-222222222201', '00000000-0000-0000-0000-000000000001', 'super_admin', '11111111-1111-1111-1111-111111111101', '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('22222222-2222-2222-2222-222222222202', '00000000-0000-0000-0000-000000000002', 'super_admin', '11111111-1111-1111-1111-111111111101', '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_phone_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_phone_index` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `phone`, `avatar_url`, `full_name`, `is_phone_verified`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'admin@resellseba.com', NULL, '$2y$10$c1LwY.XrK6pZS21.PQnExupt3HtJexyWGEUrU8uXoYQWNIV2LP4Cy', '01700000000', NULL, 'Super Admin', '1', '1', NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00'),
('00000000-0000-0000-0000-000000000002', 'Zahid Hasan', 'zhroni3678@gmail.com', NULL, '$2y$10$c1LwY.XrK6pZS21.PQnExupt3HtJexyWGEUrU8uXoYQWNIV2LP4Cy', '01736483638', NULL, 'Zahid Hasan', '1', '1', NULL, '2026-09-14 18:00:00', '2026-09-14 18:00:00');

-- Table: `verification_codes`
DROP TABLE IF EXISTS `verification_codes`;
CREATE TABLE `verification_codes` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `channel` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


COMMIT;
SET FOREIGN_KEY_CHECKS=1;
