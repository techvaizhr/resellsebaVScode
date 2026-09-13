<?php

namespace App\Enums;

enum ShipmentStatus: string
{
    case PENDING = 'pending';
    case BOOKED = 'booked';
    case IN_TRANSIT = 'in_transit';
    case DELIVERED = 'delivered';
    case RETURNED = 'returned';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';
}
