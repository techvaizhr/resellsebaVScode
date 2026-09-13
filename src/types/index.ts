export * from "./enums";

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id?: string;
  brand_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Reseller {
  id: string;
  user_id: string;
  status: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface ResellerSetting {
  id: string;
  reseller_id: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface ResellerListing {
  id: string;
  reseller_id: string;
  product_id: string;
  custom_price?: number;
  created_at: string;
}

export interface ResellerDomain {
  id: string;
  reseller_id: string;
  domain: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  reseller_id?: string;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  note?: string;
  created_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  note: string;
  user_id?: string;
  created_at: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  courier_id: string;
  tracking_number?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CourierConfig {
  id: string;
  provider: string;
  credentials: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourierEvent {
  id: string;
  shipment_id: string;
  status: string;
  description?: string;
  event_time: string;
  created_at: string;
}

export interface PaymentConfig {
  id: string;
  provider: string;
  is_active: boolean;
  created_at: string;
}

export interface PaymentGatewayConfig {
  id: string;
  gateway: string;
  credentials: any;
  is_active: boolean;
  created_at: string;
}

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierReturn {
  id: string;
  supplier_id: string;
  order_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierPayout {
  id: string;
  supplier_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DepositRequest {
  id: string;
  reseller_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ResellerDeposit {
  id: string;
  reseller_id: string;
  amount: number;
  payment_method: string;
  created_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AgentPayout {
  id: string;
  agent_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AdminNotice {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalSetting {
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}
