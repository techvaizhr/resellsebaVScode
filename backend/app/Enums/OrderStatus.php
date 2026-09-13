<?php

namespace App\Enums;

enum OrderStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case FORWARDED = 'forwarded';
    case PROCESSING = 'processing';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case PARTIAL = 'partial';
    case RETURNED = 'returned';
    case CANCELLED = 'cancelled';
    case READY_TO_SHIP = 'ready_to_ship';
    case PENDING_RETURN = 'pending_return';
    case PACKAGING = 'packaging';
    case PENDING_PARTIAL = 'pending_partial';
    case PARTIAL_FULL = 'partial_full';
    case PARTIAL_ITEM = 'partial_item';
    case PARTIAL_DELIVERY = 'partial_delivery';
    case DAMAGED = 'damaged';
}
