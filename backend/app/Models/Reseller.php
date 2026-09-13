<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reseller extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'user_id', 'shop_name', 'slug', 'status', 'leader_id', 'balance'
    ];

    protected function casts(): array
    {
        return [
            'status' => \App\Enums\ResellerStatus::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function resellerListings()
    {
        return $this->hasMany(ResellerListing::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function resellerSetting()
    {
        return $this->hasOne(ResellerSetting::class);
    }

    public function resellerDomains()
    {
        return $this->hasMany(ResellerDomain::class);
    }

    public function resellerMenuItems()
    {
        return $this->hasMany(ResellerMenuItem::class);
    }

    public function resellerPolicies()
    {
        return $this->hasMany(ResellerPolicy::class);
    }

    public function resellerDeposits()
    {
        return $this->hasMany(ResellerDeposit::class);
    }

    public function depositRequests()
    {
        return $this->hasMany(DepositRequest::class);
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    public function leaderCommissions()
    {
        return $this->hasMany(LeaderCommission::class);
    }

    public function leader()
    {
        return $this->belongsTo(Reseller::class, 'leader_id');
    }

    public function downlines()
    {
        return $this->hasMany(Reseller::class, 'leader_id');
    }

    public function resellerSubscription()
    {
        return $this->hasOne(ResellerSubscription::class);
    }

    public function marketingConfigs()
    {
        return $this->hasMany(MarketingConfig::class);
    }

    public function paymentConfigs()
    {
        return $this->hasMany(PaymentConfig::class);
    }

    public function paymentGatewayConfigs()
    {
        return $this->hasMany(PaymentGatewayConfig::class);
    }
}
