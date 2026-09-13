<?php

namespace App\Enums;

enum CourierProvider: string
{
    case STEADFAST = 'steadfast';
    case PATHAO = 'pathao';
    case CARRYBEE = 'carrybee';
    case REDX = 'redx';
    case PAPERFLY = 'paperfly';
    case MANUAL = 'manual';
}
