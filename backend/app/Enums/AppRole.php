<?php

namespace App\Enums;

enum AppRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case RESELLER = 'reseller';
    case LEADER = 'leader';
    case STAFF = 'staff';
    case SUPPLIER = 'supplier';
}
