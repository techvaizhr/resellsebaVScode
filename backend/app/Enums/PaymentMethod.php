<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case COD = 'cod';
    case BKASH = 'bkash';
    case NAGAD = 'nagad';
    case ROCKET = 'rocket';
    case CARD = 'card';
    case SSLCOMMERZ = 'sslcommerz';
    case EPS = 'eps';
    case OTHER = 'other';
    case SHURJOPAY = 'shurjopay';
    case AAMARPAY = 'aamarpay';
    case EPAYSEBA = 'epayseba';
}
