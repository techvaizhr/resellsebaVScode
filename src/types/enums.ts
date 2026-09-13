export enum AppRole {
  SUPER_ADMIN = "super_admin",
  RESELLER = "reseller",
  LEADER = "leader",
  STAFF = "staff",
  SUPPLIER = "supplier",
}

export enum CourierProvider {
  PATHAO = "pathao",
  STEADFAST = "steadfast",
  REDX = "redx",
  PAPERFLY = "paperfly",
  ECURIER = "ecurier",
}

export enum DeliveryArea {
  INSIDE_DHAKA = "inside_dhaka",
  OUTSIDE_DHAKA = "outside_dhaka",
  SUB_DHAKA = "sub_dhaka",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  FAILED = "failed",
}

export enum PaymentMethod {
  COD = "cod",
  BKASH = "bkash",
  NAGAD = "nagad",
  ROCKET = "rocket",
  BANK = "bank",
  SSLCOMMERZ = "sslcommerz",
  AAMARPAY = "aamarpay",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PayoutStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum ResellerStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}

export enum ShipmentStatus {
  PENDING = "pending",
  READY_TO_PICK = "ready_to_pick",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  RETURNED = "returned",
  FAILED = "failed",
}
