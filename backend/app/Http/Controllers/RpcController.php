<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Reseller;
use App\Models\ResellerListing;
use App\Models\GlobalSetting;
use App\Models\Payout;
use App\Models\CourierConfig;
use App\Models\ResellerDeposit;
use App\Models\User;
use App\Models\Supplier;
use App\Models\SupplierReturn;
use App\Models\SupplierPayout;
use App\Models\OrderItem;
use App\Models\Profile;
use App\Models\UserRole;
use App\Models\SubscriptionPlan;
use App\Models\ResellerSubscription;
use App\Models\SubscriptionPayment;
use App\Models\PaymentGatewayConfig;
use App\Models\StoreVisit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RpcController extends Controller
{
    public function handle(Request $request, $name)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $args = $request->all();

        return match ($name) {
            'panel_bootstrap' => $this->panelBootstrap($user),
            'lp_bootstrap' => $this->lpBootstrap($args),
            'store_bootstrap' => $this->storeBootstrap($args),
            'store_seo' => $this->storeSeo($args),
            'admin_dashboard' => $this->adminDashboard($args),
            'admin_reseller_metrics' => $this->adminResellerMetrics(),
            'admin_impersonation_begin' => $this->adminImpersonationBegin($args),
            'admin_impersonation_finish' => response()->json(['ok' => true]),
            'admin_auth_users' => $this->adminAuthUsers(),
            'admin_confirm_user_email' => $this->adminConfirmUserEmail($args),
            'admin_set_phone_verified' => $this->adminSetPhoneVerified($args),
            'admin_set_user_password' => $this->adminSetUserPassword($args),
            'admin_delete_user' => $this->adminDeleteUser($args),
            'admin_update_staff_account' => $this->adminUpdateStaffAccount($args),
            'admin_assign_role' => $this->adminAssignRole($args),
            'admin_create_staff_user' => $this->adminCreateStaffUser($args),
            'reseller_dashboard' => $this->resellerDashboard($user, $args),
            'admin_orders_page' => $this->adminOrdersPage($args),
            'reseller_orders_page' => $this->resellerOrdersPage($user, $args),
            'admin_catalog_page' => $this->adminCatalogPage($args),
            'reseller_catalog_page' => $this->resellerCatalogPage($user, $args),
            'create_public_order' => $this->createPublicOrder($args),
            'order_nav_count' => $this->orderNavCount($user),
            'admin_lookups' => $this->adminLookups(),
            'reseller_profit_summary' => $this->resellerProfitSummary($args),
            'reseller_ledger' => $this->transactionReport($args),
            'transaction_report' => $this->transactionReport($args),
            'admin_supplier_overview' => $this->adminSupplierOverview($args),
            'supplier_report' => $this->supplierReport($args),
            'supplier_bootstrap' => $this->supplierBootstrap($user),
            'admin_handover_returns' => $this->adminHandoverReturns($args),
            'supplier_receive_returns' => $this->supplierReceiveReturns($args),
            'subscription_overview' => $this->subscriptionOverview($args),
            'my_subscription' => $this->mySubscription($user, $args),
            'admin_set_subscription' => $this->adminSetSubscription($args),
            'subscription_pay_from_earning' => $this->subscriptionPayFromEarning($user, $args),
            'subscription_request_manual' => $this->subscriptionRequestManual($user, $args),
            'subscription_review_payment' => $this->subscriptionReviewPayment($args),
            'deposit_request_review' => $this->depositRequestReview($args),
            'log_store_visit' => $this->logStoreVisit($request, $args),
            'store_visit_summary' => $this->storeVisitSummary($args),
            'store_visit_daily' => $this->storeVisitDaily($args),
            'store_visit_pages' => $this->storeVisitPages($args),
            'store_visit_leaderboard' => $this->storeVisitLeaderboard($args),
            'purge_store_visits' => $this->purgeStoreVisits(),
            'get_active_payment_gateways' => $this->getActivePaymentGateways(),
            'courier_booking_options' => $this->courierBookingOptions(),
            'is_super_admin' => $this->isSuperAdminRpc($user, $args),
            'has_permission' => $this->hasPermissionRpc($user, $args),
            'has_any_permission' => $this->hasAnyPermissionRpc($user, $args),
            'has_role' => $this->hasRoleRpc($user, $args),
            'supplier_can_book_order' => $this->supplierCanBookOrderRpc($user, $args),
            'reseller_auto_approve' => $this->resellerAutoApproveRpc($args),
            'verify_issue' => $this->verifyIssueRpc($user, $args),
            'verify_check' => $this->verifyCheckRpc($user, $args),
            'cleanup_counts' => $this->cleanupCountsRpc(),
            'cleanup_purge' => $this->cleanupPurgeRpc($args),
            'supplier_products' => $this->supplierProducts($user),
            'supplier_save_product' => $this->supplierSaveProduct($user, $args),
            'supplier_quick_update' => $this->supplierQuickUpdate($user, $args),
            'supplier_orders_page' => $this->supplierOrdersPage($user, $args),
            'supplier_set_order_status' => $this->supplierSetOrderStatus($user, $args),
            'admin_review_product' => $this->adminReviewProduct($args),
            'admin_delete_supplier' => $this->adminDeleteSupplier($args),
            'admin_set_product_supplier' => $this->adminSetProductSupplier($args),
            'current_reseller_id' => response()->json(['data' => Reseller::where('user_id', $user?->id)->value('id')]),
            'verify_state' => $this->verifyStateRpc($user, $args),
            'cf_config_get' => $this->cfConfigGet(),
            'cf_config_save' => $this->cfConfigSave($args),
            'cf_config_settings' => $this->cfConfigSettings(),
            'cf_dns_guide' => $this->cfDnsGuide(),
            default => $this->fallbackRpc($name, $args, $user),
        };
    }

    private function adminSetUserPassword($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $password = $args['_password'] ?? $args['password'] ?? null;

        if (!$userId || !$password) {
            return response()->json(['error' => 'User ID and password required'], 400);
        }

        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->first();
            if ($reseller && $reseller->user_id) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }
        if (!$user) {
            $supplier = Supplier::where('id', $userId)->first();
            if ($supplier && $supplier->user_id) {
                $user = User::where('id', $supplier->user_id)->first();
            }
        }

        if ($user) {
            $user->password = Hash::make($password);
            $user->save();
            return response()->json(['ok' => true, 'message' => 'Password updated successfully']);
        }

        return response()->json(['error' => 'User not found'], 404);
    }

    private function adminImpersonationBegin($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $password = $args['_password'] ?? null;

        if (!$userId) {
            return response()->json(['error' => 'User ID required'], 400);
        }

        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->first();
            if ($reseller && $reseller->user_id) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }
        if (!$user) {
            $supplier = Supplier::where('id', $userId)->first();
            if ($supplier && $supplier->user_id) {
                $user = User::where('id', $supplier->user_id)->first();
            }
        }

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $prevHash = $user->password;
        if ($password) {
            $user->password = Hash::make($password);
            $user->save();
        }

        $token = $user->createToken('impersonation_token')->plainTextToken;

        return response()->json([
            'email' => $user->email,
            'token' => $token,
            'accessToken' => $token,
            'prev_hash' => $prevHash,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'name' => $user->name,
                'full_name' => $user->full_name ?? $user->name,
            ]
        ]);
    }

    private function adminAuthUsers()
    {
        $users = User::all()->map(function ($u) {
            return [
                'user_id' => $u->id,
                'email' => $u->email,
                'phone' => $u->phone,
                'email_confirmed' => (bool) $u->email_verified_at,
                'created_at' => $u->created_at ? $u->created_at->toIso8601String() : null,
            ];
        });
        return response()->json($users);
    }

    private function adminConfirmUserEmail($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->first();
            if ($reseller && $reseller->user_id) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }
        if ($user) {
            $user->update(['email_verified_at' => now()]);
            Profile::where('user_id', $user->id)->update(['email_verified_at' => now()]);
            return response()->json([
                'ok' => true,
                'email' => $user->email,
                'already_confirmed' => false
            ]);
        }
        return response()->json(['ok' => true]);
    }

    private function adminSetPhoneVerified($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $verified = isset($args['_verified']) ? (bool) $args['_verified'] : (isset($args['verified']) ? (bool) $args['verified'] : true);

        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->first();
            if ($reseller && $reseller->user_id) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }
        if ($user) {
            $user->update([
                'is_phone_verified' => $verified,
                'phone_verified_at' => $verified ? now() : null,
            ]);
            Profile::where('user_id', $user->id)->update([
                'phone_verified_at' => $verified ? now() : null,
            ]);
            return response()->json(['ok' => true, 'verified' => $verified]);
        }
        return response()->json(['ok' => true, 'verified' => $verified]);
    }

    private function adminDeleteUser($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        if ($userId) {
            User::where('id', $userId)->delete();
            Profile::where('user_id', $userId)->delete();
            UserRole::where('user_id', $userId)->delete();
        }
        return response()->json(['ok' => true]);
    }

    private function adminUpdateStaffAccount($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $email = $args['_email'] ?? $args['email'] ?? null;
        $fullName = $args['_full_name'] ?? $args['full_name'] ?? null;
        $phone = $args['_phone'] ?? $args['phone'] ?? null;

        if ($userId) {
            $userUpdates = [];
            if ($email) $userUpdates['email'] = $email;
            if ($fullName) $userUpdates['name'] = $fullName;
            if ($phone !== null) $userUpdates['phone'] = $phone;

            if (!empty($userUpdates)) {
                User::where('id', $userId)->update($userUpdates);
            }
            if ($fullName) {
                Profile::where('user_id', $userId)->update(['full_name' => $fullName]);
            }
        }
        return response()->json(['ok' => true]);
    }

    private function adminAssignRole($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $role = $args['_role'] ?? $args['role'] ?? 'reseller';
        $customRoleId = $args['_custom_role_id'] ?? $args['custom_role_id'] ?? null;

        if ($userId) {
            UserRole::updateOrCreate(
                ['user_id' => $userId],
                ['role' => $role, 'custom_role_id' => $customRoleId]
            );
        }
        return response()->json(['ok' => true]);
    }

    private function adminCreateStaffUser($args)
    {
        $email = $args['_email'] ?? $args['email'] ?? null;
        $password = $args['_password'] ?? $args['password'] ?? 'staff123456';
        $fullName = $args['_full_name'] ?? $args['full_name'] ?? 'Staff';
        $phone = $args['_phone'] ?? $args['phone'] ?? null;
        $role = $args['_role'] ?? $args['role'] ?? 'staff';
        $customRoleId = $args['_custom_role_id'] ?? $args['custom_role_id'] ?? null;

        $userId = (string) Str::uuid();
        User::create([
            'id' => $userId,
            'name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);
        Profile::create([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'full_name' => $fullName,
        ]);
        UserRole::create([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'role' => $role,
            'custom_role_id' => $customRoleId,
        ]);

        return response()->json(['ok' => true, 'data' => $userId]);
    }

    private function panelBootstrap($user)
    {
        $reseller = $user ? Reseller::where('user_id', $user->id)->first() : null;
        $supplier = $user ? Supplier::where('user_id', $user->id)->first() : null;
        $userRole = $user ? UserRole::where('user_id', $user->id)->first() : null;
        $roles = [];
        $permissions = [];

        if ($userRole) {
            $roleVal = is_object($userRole->role) ? $userRole->role->value : $userRole->role;
            $roles[] = $roleVal;
            if ($roleVal === 'super_admin') {
                $permissions = ['*'];
            }
        } elseif ($supplier) {
            $roles[] = 'supplier';
        } elseif ($reseller) {
            $roles[] = 'reseller';
        } else {
            $roles[] = 'reseller';
        }

        $settings = $this->getGlobalSettingsArray();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
            'settings' => $settings,
            'reseller' => $reseller,
            'supplier' => $supplier,
        ]);
    }

    private function getGlobalSettingsArray()
    {
        $defaults = [
            'id' => 1,
            'site_name' => 'ResellSeba',
            'tagline' => 'Launch your own online store with zero investment',
            'primary_color' => '#4f46e5',
            'accent_color' => '#f59e0b',
            'border_radius' => '0.875rem',
            'contact_phone' => null,
            'contact_email' => null,
            'logo_url' => '/uploads/branding/166777d0-f627-4904-8b3d-ae5b024b9b50.webp',
            'favicon_url' => '/uploads/branding/0ab29621-3af4-42ff-96ff-c6ae8aa32b25.webp',
            'og_image_url' => '/uploads/branding/be5ffbde-52a4-4a5f-aaae-2d3c4a9a3836.webp',
            'meta_title_template' => null,
            'meta_description' => null,
            'flagship_reseller_code' => null,
            'label_size' => '3x4',
            'landing_content' => null,
            'advanced_settings' => [
                'delivery' => [
                    'inside_dhaka' => 60,
                    'outside_dhaka' => 120,
                    'sub_dhaka' => 100,
                ],
            ],
        ];

        if (!DB::getSchemaBuilder()->hasTable('global_settings')) {
            return $defaults;
        }

        $cols = DB::getSchemaBuilder()->getColumnListing('global_settings');
        if (in_array('key', $cols)) {
            // Auto-heal missing branding settings directly into DB so user never has to run manual SQL
            try {
                $hasLogo = DB::table('global_settings')->where('key', 'logo_url')->exists();
                if (!$hasLogo) {
                    DB::table('global_settings')->insert([
                        ['id' => (string) Str::uuid(), 'key' => 'logo_url', 'value' => '/uploads/branding/166777d0-f627-4904-8b3d-ae5b024b9b50.webp', 'created_at' => now(), 'updated_at' => now()],
                        ['id' => (string) Str::uuid(), 'key' => 'favicon_url', 'value' => '/uploads/branding/0ab29621-3af4-42ff-96ff-c6ae8aa32b25.webp', 'created_at' => now(), 'updated_at' => now()],
                        ['id' => (string) Str::uuid(), 'key' => 'og_image_url', 'value' => '/uploads/branding/be5ffbde-52a4-4a5f-aaae-2d3c4a9a3836.webp', 'created_at' => now(), 'updated_at' => now()],
                    ]);
                }
                if (DB::getSchemaBuilder()->hasTable('brands')) {
                    DB::table('brands')->where('slug', 'aura')->whereNull('logo_url')->update([
                        'logo_url' => '/uploads/brands/12ebcacf-9aed-4b5c-9425-20c9e98c254a.webp'
                    ]);
                    DB::table('brands')->where('slug', 'novatech')->whereNull('logo_url')->update([
                        'logo_url' => '/uploads/brands/ea035f56-66ae-4482-9b58-bbfbe29dad4e.webp'
                    ]);
                }
            } catch (\Exception $e) {}

            $rows = DB::table('global_settings')->get();
            foreach ($rows as $r) {
                if (!empty($r->key)) {
                    $val = $r->value;
                    if (is_string($val) && (str_starts_with($val, '{') || str_starts_with($val, '['))) {
                        $decoded = json_decode($val, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $val = $decoded;
                        }
                    }
                    $defaults[$r->key] = $val;
                }
            }
        } else {
            $row = (array) (DB::table('global_settings')->where('id', 1)->first() ?? DB::table('global_settings')->first() ?? []);
            foreach ($row as $k => $v) {
                if (is_string($v) && (str_starts_with($v, '{') || str_starts_with($v, '['))) {
                    $decoded = json_decode($v, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $v = $decoded;
                    }
                }
                $defaults[$k] = $v;
            }
        }

        return $defaults;
    }

    private function lpBootstrap($args)
    {
        $data = Cache::remember('lp_bootstrap_cache', 30, function () {
            $products = Product::where('is_active', true)
                ->with('images')
                ->orderBy('created_at', 'desc')
                ->limit(12)
                ->get();

            $categories = Category::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            $settings = $this->getGlobalSettingsArray();

            return [
                'settings' => $settings,
                'store' => null,
                'stats' => [
                    'totalProducts' => Product::count(),
                    'totalCategories' => Category::count(),
                    'totalSales' => Order::where('status', 'delivered')->count(),
                ],
                'categories' => $categories,
                'products' => $products,
            ];
        });

        return response()->json($data);
    }

    private function adminDashboard($args)
    {
        $orders = Order::orderBy('created_at', 'desc')->limit(50)->get();

        return response()->json([
            'range_orders' => $orders,
            'all_orders' => $orders,
            'payouts' => [
                'paid' => Payout::where('status', 'paid')->sum('amount'),
                'due' => Payout::where('status', 'approved')->sum('amount'),
            ],
            'catalog' => [
                'total' => Product::count(),
                'active' => Product::where('is_active', true)->count(),
            ],
            'resellers' => [
                'total' => Reseller::count(),
                'active' => Reseller::where('status', 'active')->count(),
            ],
            'metrics' => [
                'withStore' => Reseller::count(),
                'depositBalance' => 0,
                'frozen' => 0,
                'withdrawable' => 0,
            ],
        ]);
    }

    private function resellerDashboard($user, $args)
    {
        $reseller = $user ? Reseller::where('user_id', $user->id)->first() : null;
        $orders = $reseller ? Order::where('reseller_id', $reseller->id)->orderBy('created_at', 'desc')->get() : [];

        return response()->json([
            'reseller' => $reseller,
            'orders' => $orders,
            'items' => [],
            'payouts' => [],
            'commissions' => [],
            'summary' => [
                'delivered_profit' => 0,
                'pending_payout' => 0,
                'paid_out' => 0,
                'available' => 0,
            ],
            'listings' => [],
            'listings_total' => 0,
            'listings_active' => 0,
            'products' => [],
            'top_resellers' => [],
        ]);
    }

    private function storeBootstrap($args)
    {
        $code = $args['_code'] ?? $args['code'] ?? '';
        $reseller = Reseller::where('code', $code)->first() ?? Reseller::where('id', $code)->first() ?? Reseller::first();

        if (!$reseller) {
            return response()->json([
                'store' => null,
                'listings' => [],
                'categories' => [],
                'menu' => [],
                'delivery' => ['inside_dhaka' => 60, 'outside_dhaka' => 120, 'sub_dhaka' => 100],
                'settings' => null,
                'payment_methods' => [],
                'pixels' => [],
            ]);
        }

        $settings = ResellerSetting::where('reseller_id', $reseller->id)->first();
        $listings = ResellerListing::where('reseller_id', $reseller->id)->where('is_active', true)->with('product')->get();

        if ($listings->isEmpty()) {
            $products = Product::where('is_active', true)->limit(24)->get();
            $listings = $products->map(function ($p) use ($reseller) {
                return [
                    'id' => 'list-' . $reseller->id . '-' . $p->id,
                    'reseller_id' => $reseller->id,
                    'product_id' => $p->id,
                    'custom_title' => $p->name,
                    'custom_description' => $p->description,
                    'selling_price' => (float) ($p->suggested_price ?? $p->price ?? 500),
                    'extra_delivery_inside' => 0,
                    'extra_delivery_outside' => 0,
                    'is_active' => true,
                    'product' => $p,
                ];
            });
        }

        $categories = Category::where('is_active', true)->get();
        $menus = ResellerMenuItem::where('reseller_id', $reseller->id)->where('is_active', true)->orderBy('sort_order')->get();
        $marketing = MarketingConfig::where('reseller_id', $reseller->id)->where('is_active', true)->get();

        $themeSettings = $settings->theme_settings ?? [];
        if (is_string($themeSettings)) {
            $themeSettings = json_decode($themeSettings, true) ?? (object)[];
        }

        $paymentConfigs = PaymentConfig::where(function ($q) use ($reseller) {
            $q->where('reseller_id', $reseller->id)->orWhereNull('reseller_id');
        })->where('is_active', true)->get();

        $paymentMethods = $paymentConfigs->map(function ($p) {
            $config = is_string($p->config) ? json_decode($p->config, true) : ($p->config ?? []);
            $instructions = $p->instructions;
            if (!$instructions && !empty($config['account'])) {
                $instructions = ($config['account_type'] ?? 'Personal') . ' Account: ' . $config['account'];
            }
            return [
                'method' => $p->method?->value ?? (string)$p->method,
                'label' => $p->label ?? ucfirst($p->method?->value ?? (string)$p->method),
                'instructions' => $instructions,
                'reseller_id' => $p->reseller_id,
            ];
        })->toArray();

        if (empty($paymentMethods)) {
            $paymentMethods = [
                ['method' => 'cod', 'label' => 'Cash on Delivery', 'instructions' => 'Pay when you receive the product at home.', 'reseller_id' => null],
            ];
        }

        return response()->json([
            'store' => [
                'id' => $settings->id ?? ('set-' . $reseller->id),
                'reseller_id' => $reseller->id,
                'business_name' => $reseller->business_name,
                'store_name' => $settings->store_name ?? $reseller->business_name,
                'tagline' => $settings->tagline ?? 'Quality products delivered fast across Bangladesh',
                'theme' => $settings->theme ?? 'minimal',
                'theme_settings' => $themeSettings,
                'whatsapp' => $settings->whatsapp ?? $reseller->contact_phone,
                'support_phone' => $settings->support_phone ?? $reseller->contact_phone,
                'facebook_url' => $settings->facebook_url ?? null,
                'instagram_url' => $settings->instagram_url ?? null,
                'tiktok_url' => $settings->tiktok_url ?? null,
                'announcement' => $settings->announcement ?? 'Free delivery over ৳2000',
                'meta_description' => $settings->meta_description ?? '',
                'footer_text' => $settings->footer_text ?? 'All rights reserved.',
                'logo_url' => $settings->logo_url ?? $reseller->avatar_url,
                'favicon_url' => $settings->favicon_url ?? null,
                'og_image_url' => $settings->og_image_url ?? null,
            ],
            'listings' => $listings,
            'categories' => $categories,
            'menu' => $menus,
            'delivery' => [
                'inside_dhaka' => 60,
                'outside_dhaka' => 120,
                'sub_dhaka' => 100,
            ],
            'settings' => [
                'site_name' => 'ResellSeba',
                'primary_color' => '#4f46e5',
                'accent_color' => '#f59e0b',
            ],
            'payment_methods' => $paymentMethods,
            'pixels' => $marketing->map(fn($m) => [
                'platform' => $m->platform,
                'pixel_id' => $m->pixel_id,
                'is_global' => false,
            ]),
        ]);
    }

    private function storeSeo($args)
    {
        $code = $args['_code'] ?? $args['code'] ?? '';
        $slug = $args['_slug'] ?? $args['slug'] ?? null;
        $reseller = Reseller::where('code', $code)->first() ?? Reseller::where('id', $code)->first() ?? Reseller::first();

        if (!$reseller) {
            return response()->json(['store' => null, 'product' => null]);
        }

        $settings = ResellerSetting::where('reseller_id', $reseller->id)->first();
        $product = $slug ? Product::where('slug', $slug)->first() : null;

        return response()->json([
            'store' => [
                'id' => $reseller->id,
                'code' => $reseller->code,
                'name' => $settings->store_name ?? $reseller->business_name ?? $reseller->code,
                'tagline' => $settings->tagline ?? null,
                'meta_description' => $settings->meta_description ?? null,
                'og_image_url' => $settings->og_image_url ?? null,
                'logo_url' => $settings->logo_url ?? $reseller->avatar_url ?? null,
            ],
            'product' => $product ? [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'og_image_url' => $product->og_image_url ?? $product->main_image ?? null,
                'main_image' => $product->main_image ?? null,
            ] : null,
        ]);
    }

    private function cfConfigGet()
    {
        $conf = DB::table('cloudflare_config')->find(1);
        if (!$conf) {
            return response()->json([
                'id' => 1,
                'api_token' => '',
                'account_id' => '',
                'zone_id' => '',
                'zone_name' => 'resellseba.com',
                'worker_name' => 'resellseba-storefront',
                'cname_target' => 'cname.resellseba.com',
                'a_record_ip' => '',
                'auto_worker_domain' => true,
                'is_active' => false,
                'mode' => 'both',
                'server_a_ip' => '103.174.152.20',
                'server_cname' => 'stores.resellseba.com',
                'server_note' => 'Point an A record to our server IP or a CNAME record to stores.resellseba.com. SSL is automatically provisioned.',
                'dns_active' => true,
                'updated_at' => now()->toISOString(),
            ]);
        }
        $settings = json_decode($conf->settings ?? '{}', true) ?: [];
        return response()->json(array_merge((array)$conf, $settings));
    }

    private function cfConfigSave($args)
    {
        $payload = [
            'api_token' => $args['_api_token'] ?? $args['api_token'] ?? '',
            'account_id' => $args['_account_id'] ?? $args['account_id'] ?? '',
            'zone_id' => $args['_zone_id'] ?? $args['zone_id'] ?? '',
            'worker_name' => $args['_worker_name'] ?? $args['worker_name'] ?? '',
            'settings' => json_encode([
                'zone_name' => $args['_zone_name'] ?? $args['zone_name'] ?? 'resellseba.com',
                'cname_target' => $args['_cname_target'] ?? $args['cname_target'] ?? 'cname.resellseba.com',
                'a_record_ip' => $args['_a_record_ip'] ?? $args['a_record_ip'] ?? '',
                'auto_worker_domain' => (bool) ($args['_auto_worker_domain'] ?? $args['auto_worker_domain'] ?? true),
                'is_active' => (bool) ($args['_is_active'] ?? $args['is_active'] ?? false),
                'mode' => $args['_mode'] ?? $args['mode'] ?? 'both',
                'server_a_ip' => $args['_server_a_ip'] ?? $args['server_a_ip'] ?? '',
                'server_cname' => $args['_server_cname'] ?? $args['server_cname'] ?? '',
                'server_note' => $args['_server_note'] ?? $args['server_note'] ?? '',
                'dns_active' => (bool) ($args['_dns_active'] ?? $args['dns_active'] ?? true),
            ]),
            'updated_at' => now(),
        ];

        DB::table('cloudflare_config')->updateOrInsert(['id' => 1], $payload);
        return response()->json(['ok' => true]);
    }

    private function cfConfigSettings()
    {
        $conf = DB::table('cloudflare_config')->find(1);
        $settings = json_decode($conf->settings ?? '{}', true) ?: [];
        return response()->json([
            'account_id' => $conf->account_id ?? '',
            'zone_id' => $conf->zone_id ?? '',
            'zone_name' => $settings['zone_name'] ?? 'resellseba.com',
            'worker_name' => $conf->worker_name ?? 'resellseba-storefront',
            'cname_target' => $settings['cname_target'] ?? 'cname.resellseba.com',
            'a_record_ip' => $settings['a_record_ip'] ?? '',
            'auto_worker_domain' => $settings['auto_worker_domain'] ?? true,
            'is_active' => $settings['is_active'] ?? false,
            'mode' => $settings['mode'] ?? 'both',
            'server_a_ip' => $settings['server_a_ip'] ?? '103.174.152.20',
            'server_cname' => $settings['server_cname'] ?? 'stores.resellseba.com',
            'server_note' => $settings['server_note'] ?? 'Point an A record to our server IP or a CNAME record to stores.resellseba.com.',
            'dns_active' => $settings['dns_active'] ?? true,
        ]);
    }

    private function cfDnsGuide()
    {
        $conf = DB::table('cloudflare_config')->find(1);
        $settings = json_decode($conf->settings ?? '{}', true) ?: [];
        $isActive = (bool)($settings['is_active'] ?? false);
        $isDnsActive = (bool)($settings['dns_active'] ?? true);
        $cnameTarget = $settings['cname_target'] ?? $settings['zone_name'] ?? 'cname.resellseba.com';
        $serverIp = $settings['server_a_ip'] ?? '103.174.152.20';
        $serverCname = $settings['server_cname'] ?? 'stores.resellseba.com';

        return response()->json([
            'cname_target' => $cnameTarget,
            'a_record_ip' => $settings['a_record_ip'] ?? '',
            'zone_name' => $settings['zone_name'] ?? 'resellseba.com',
            'active' => $isActive || $isDnsActive,
            'mode' => $settings['mode'] ?? 'both',
            'server_a_ip' => $serverIp,
            'server_cname' => $serverCname,
            'server_note' => $settings['server_note'] ?? 'Point your domain A record to our server IP or add a CNAME record.',
            'cf_ready' => $isActive && ($cnameTarget || !empty($settings['zone_name'])),
            'dns_ready' => $isDnsActive && ($serverIp || $serverCname),
        ]);
    }

    private function adminOrdersPage($args)
    {
        $orders = Order::with(['items', 'reseller', 'shipments'])->orderBy('created_at', 'desc')->paginate(50);
        return response()->json($orders);
    }

    private function resellerOrdersPage($user, $args)
    {
        $resellerId = Reseller::where('user_id', $user?->id)->value('id');
        $orders = Order::where('reseller_id', $resellerId)->orderBy('created_at', 'desc')->limit(5000)->get();
        $orderIds = $orders->pluck('id')->toArray();
        $items = OrderItem::whereIn('order_id', $orderIds)->get();
        $shipments = Shipment::whereIn('order_id', $orderIds)->get();
        $events = CourierEvent::whereIn('order_id', $orderIds)->get();
        $listings = ResellerListing::where('reseller_id', $resellerId)->with('product')->get();
        $products = Product::where('is_active', true)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'reseller_id' => $resellerId,
            'orders' => $orders,
            'items' => $items,
            'shipments' => $shipments,
            'events' => $events,
            'listings' => $listings,
            'products' => $products,
        ]);
    }

    private function adminCatalogPage($args)
    {
        $products = Product::with(['brand', 'category', 'images'])->orderBy('created_at', 'desc')->get();
        $categories = Category::orderBy('sort_order')->get();
        $brands = Brand::orderBy('name')->get();
        $suppliers = Supplier::orderBy('name')->get();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'suppliers' => $suppliers,
        ]);
    }

    private function resellerCatalogPage($user, $args)
    {
        $products = Cache::remember('reseller_catalog_products', 30, function () {
            return Product::where('is_active', true)
                ->with(['brand', 'category', 'images'])
                ->orderBy('created_at', 'desc')
                ->get();
        });

        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        $brands = Brand::orderBy('name')->get();

        $resellerId = null;
        $listedProductIds = [];
        if ($user) {
            $reseller = Reseller::where('user_id', $user->id)->first();
            if ($reseller) {
                $resellerId = $reseller->id;
                $listedProductIds = ResellerListing::where('reseller_id', $reseller->id)
                    ->where('is_active', true)
                    ->pluck('product_id')
                    ->toArray();
            }
        }

        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'reseller_id' => $resellerId,
            'listed_product_ids' => $listedProductIds,
        ]);
    }

    private function createPublicOrder($args)
    {
        $orderNumber = 'ORD-' . strtoupper(Str::random(8));
        $order = Order::create([
            'id' => (string) Str::uuid(),
            'order_number' => $orderNumber,
            'reseller_id' => $args['reseller_id'] ?? null,
            'customer_name' => $args['customer_name'] ?? 'Customer',
            'customer_phone' => $args['customer_phone'] ?? '',
            'customer_address' => $args['customer_address'] ?? '',
            'delivery_area' => $args['delivery_area'] ?? 'outside_dhaka',
            'status' => 'pending',
            'payment_method' => $args['payment_method'] ?? 'cod',
            'payment_status' => 'unpaid',
            'subtotal' => $args['subtotal'] ?? 0,
            'delivery_charge' => $args['delivery_charge'] ?? 0,
            'total' => $args['total'] ?? 0,
        ]);

        return response()->json(['data' => $order, 'order_number' => $orderNumber]);
    }

    private function orderNavCount($user)
    {
        return response()->json([
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
        ]);
    }

    private function adminLookups()
    {
        return response()->json([
            'resellers' => Reseller::select('id', 'business_name', 'code')->get(),
            'products' => Product::where('is_active', true)->select('id', 'name', 'price')->get(),
        ]);
    }

    private function adminResellerMetrics()
    {
        $resellers = Reseller::all();
        $orders = Order::select('id', 'reseller_id', 'status', 'reseller_profit', 'total')->get();
        $payouts = Payout::select('id', 'reseller_id', 'status', 'amount')->get();
        $deposits = ResellerDeposit::select('id', 'reseller_id', 'amount')->get();

        $metrics = $resellers->map(function ($r) use ($orders, $payouts, $deposits) {
            $rOrders = $orders->where('reseller_id', $r->id);
            $deliveredOrders = $rOrders->filter(fn($o) => in_array($o->status, ['delivered', 'completed']));
            $deliveredProfit = (float) $deliveredOrders->sum(fn($o) => $o->reseller_profit ?? 0);
            $totalSales = (float) $deliveredOrders->sum(fn($o) => $o->total ?? 0);

            $rPayouts = $payouts->where('reseller_id', $r->id);
            $paidOut = (float) $rPayouts->filter(fn($p) => in_array($p->status, ['paid', 'completed']))->sum('amount');
            $pendingPayout = (float) $rPayouts->filter(fn($p) => in_array($p->status, ['pending', 'processing', 'approved']))->sum('amount');

            $rDeposits = $deposits->where('reseller_id', $r->id);
            $depositBalance = $rDeposits->isNotEmpty() ? (float) $rDeposits->sum('amount') : (float) ($r->deposit_balance ?? $r->deposit_paid ?? 0);

            $frozenAmount = (float) ($r->frozen_amount ?? 0);
            $available = max(0, $deliveredProfit - $paidOut - $pendingPayout);
            $withdrawable = max(0, $available - $frozenAmount);

            return [
                'reseller_id' => $r->id,
                'orders' => $rOrders->count(),
                'delivered_profit' => $deliveredProfit,
                'pending_payout' => $pendingPayout,
                'paid_out' => $paidOut,
                'available' => $available,
                'deposit_balance' => $depositBalance,
                'frozen_amount' => $frozenAmount,
                'total_sales' => $totalSales,
                'withdrawable' => $withdrawable,
            ];
        });

        return response()->json($metrics);
    }

    private function resellerProfitSummary($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $reseller = $resellerId ? Reseller::find($resellerId) : null;
        if (!$reseller) {
            return response()->json([
                'delivered_profit' => 0,
                'pending_payout' => 0,
                'paid_out' => 0,
                'available' => 0,
                'deposit_balance' => 0,
                'frozen_deposit' => 0,
                'frozen_amount' => 0,
            ]);
        }

        $deliveredOrders = Order::where('reseller_id', $reseller->id)
            ->whereIn('status', ['delivered', 'completed'])
            ->get();
        $deliveredProfit = (float) $deliveredOrders->sum(fn($o) => $o->reseller_profit ?? 0);

        $paidOut = (float) Payout::where('reseller_id', $reseller->id)
            ->whereIn('status', ['paid', 'completed'])
            ->sum('amount');
        $pendingPayout = (float) Payout::where('reseller_id', $reseller->id)
            ->whereIn('status', ['pending', 'processing', 'approved'])
            ->sum('amount');

        $depositBalance = (float) ResellerDeposit::where('reseller_id', $reseller->id)->sum('amount');
        if ($depositBalance == 0) {
            $depositBalance = (float) ($reseller->deposit_balance ?? $reseller->deposit_paid ?? 0);
        }

        $frozenAmount = (float) ($reseller->frozen_amount ?? 0);
        $available = max(0, $deliveredProfit - $paidOut - $pendingPayout);

        return response()->json([
            'delivered_profit' => $deliveredProfit,
            'pending_payout' => $pendingPayout,
            'paid_out' => $paidOut,
            'available' => $available,
            'deposit_balance' => $depositBalance,
            'frozen_deposit' => 0,
            'frozen_amount' => $frozenAmount,
        ]);
    }

    private function transactionReport($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $from = $args['_from'] ?? $args['from'] ?? null;
        $to = $args['_to'] ?? $args['to'] ?? null;
        $limit = (int) ($args['_limit'] ?? $args['limit'] ?? 1000);

        $fromTs = $from ? strtotime($from) : null;
        $toTs = $to ? strtotime($to) : null;

        $resellers = Reseller::all()->keyBy('id');
        $ordersQuery = Order::with(['items', 'reseller']);
        $depositsQuery = ResellerDeposit::query();
        $payoutsQuery = Payout::query();

        if ($resellerId) {
            $ordersQuery->where('reseller_id', $resellerId);
            $depositsQuery->where('reseller_id', $resellerId);
            $payoutsQuery->where('reseller_id', $resellerId);
        }

        $orders = $ordersQuery->orderBy('created_at', 'desc')->get();
        $deposits = $depositsQuery->orderBy('created_at', 'desc')->get();
        $payouts = $payoutsQuery->orderBy('created_at', 'desc')->get();

        $txs = [];

        foreach ($orders as $o) {
            $status = strtolower($o->status ?? 'pending');
            $isDelivered = in_array($status, ['delivered', 'completed']);
            $isReturn = ($status === 'returned');
            $isPartial = in_array($status, ['partial', 'partial_delivery']) || (!empty($o->settled_at) && str_contains($status, 'partial'));

            // Only include completed financial movements (skip cancelled, active, pending orders)
            if ($status === 'cancelled' || (!$isDelivered && !$isReturn && !$isPartial)) {
                continue;
            }

            $r = $resellers->get($o->reseller_id) ?? $o->reseller;
            $resellerName = $r->business_name ?? ($o->customer_name ? 'Direct Order' : 'Reseller');
            $resellerCode = $r->code ?? 'RS';

            $itemDescriptions = [];
            if ($o->items) {
                foreach ($o->items as $it) {
                    $itemDescriptions[] = ($it->product_name ?: 'Product') . ($it->quantity > 1 ? " x{$it->quantity}" : ' x1');
                }
            }
            $itemSummary = implode(', ', $itemDescriptions);
            $extraNote = $o->settlement_note ?: ($o->reseller_note ?: ($o->damage_note ?: ($o->admin_note ?: ($o->notes ?: ''))));

            $sellSubtotal = (float) ($o->subtotal ?: ($o->total - ($o->delivery_charge ?: 120)));
            $sellDelivery = (float) ($o->shipping_cost ?: ($o->delivery_charge ?: 120));
            $sellTotal = (float) ($o->total ?: ($sellSubtotal + $sellDelivery));

            $buyProduct = (float) ($o->sa_cost_total !== null ? $o->sa_cost_total : ($o->buy_product ?: 0));
            $buyDelivery = (float) ($o->delivery_cost !== null ? $o->delivery_cost : ($o->buy_delivery ?: ($o->area === 'inside_dhaka' ? 75 : 135)));
            $packaging = (float) ($o->packaging_total !== null ? $o->packaging_total : ($o->packaging ?: 20));
            $buyTotal = $buyProduct + $buyDelivery + $packaging;

            $advance = (float) ($o->advance_amount ?? ($o->advance ?? 0));
            $advanceBy = $o->advance_by ?? ($advance > 0 ? 'reseller' : null);
            $received = (float) ($o->received_amount !== null ? $o->received_amount : ($isDelivered ? $sellTotal : $advance));
            $collected = (float) ($o->collected ?? max(0, $received - $advance));

            $at = $o->settled_at ?? ($o->delivered_at ?? ($o->forwarded_at ?? ($o->updated_at ?? ($o->created_at ?? now()))));
            $atIso = is_string($at) ? date('c', strtotime($at)) : $at->toIso8601String();

            $kind = 'profit';
            $direction = 'in';
            $amount = 0;
            $label = 'Order Settlement';

            if ($isDelivered) {
                $profit = (float) ($o->reseller_profit !== null ? $o->reseller_profit : ($received - $buyTotal));
                if ($profit >= 0) {
                    $kind = 'profit';
                    $direction = 'in';
                    $amount = $profit;
                    $label = 'Order Delivered Profit';
                } else {
                    $kind = 'loss';
                    $direction = 'out';
                    $amount = abs($profit);
                    $label = 'Order Settlement Loss';
                }
            } elseif ($isReturn) {
                $loss = (float) ($o->delivery_cost ?: $buyDelivery) + (float) ($o->packaging_total ?: $packaging);
                $kind = 'loss';
                $direction = 'out';
                $amount = abs((float) $o->reseller_profit ?: ($loss ?: 155));
                $label = 'Order Return Loss';
            } elseif ($isPartial) {
                $profit = (float) ($o->reseller_profit !== null ? $o->reseller_profit : ($received - $buyTotal));
                $kind = $profit >= 0 ? 'profit' : 'loss';
                $direction = $profit >= 0 ? 'in' : 'out';
                $amount = abs($profit);
                $label = 'Partial Order Settlement';
            }

            $note = implode(' · ', array_filter([$itemSummary, $extraNote])) ?: ($isDelivered ? 'Delivered & settled' : ($isReturn ? 'Customer return / courier charge' : 'Order settled'));

            $txs[] = [
                'at' => $atIso,
                'kind' => $kind,
                'direction' => $direction,
                'reseller_id' => (string) ($r->id ?? $o->reseller_id),
                'reseller_name' => $resellerName,
                'reseller_code' => $resellerCode,
                'order_id' => (string) $o->id,
                'order_number' => (string) ($o->order_number ?: $o->id),
                'status' => $status,
                'label' => $label,
                'note' => $note,
                'sell_subtotal' => $sellSubtotal,
                'sell_delivery' => $sellDelivery,
                'sell_total' => $sellTotal,
                'buy_product' => $buyProduct,
                'buy_delivery' => $buyDelivery,
                'packaging' => $packaging,
                'buy_total' => $buyTotal,
                'collected' => $collected,
                'received' => $received,
                'advance' => $advance,
                'advance_by' => $advanceBy,
                'amount' => $amount,
                'running' => 0,
            ];
        }

        foreach ($deposits as $d) {
            $r = $resellers->get($d->reseller_id);
            $at = $d->created_at ?? now();
            $atIso = is_string($at) ? date('c', strtotime($at)) : $at->toIso8601String();

            $txs[] = [
                'at' => $atIso,
                'kind' => 'deposit',
                'direction' => 'in',
                'reseller_id' => (string) ($r->id ?? $d->reseller_id),
                'reseller_name' => $r->business_name ?? 'Reseller',
                'reseller_code' => $r->code ?? 'RS',
                'order_id' => null,
                'order_number' => null,
                'status' => $d->status ?? 'approved',
                'label' => 'Security Deposit',
                'note' => $d->notes ?: (strtoupper($d->payment_method ?? 'Deposit') . ' Deposit · TxID: ' . ($d->transaction_id ?? 'N/A')),
                'sell_subtotal' => 0,
                'sell_delivery' => 0,
                'sell_total' => 0,
                'buy_product' => 0,
                'buy_delivery' => 0,
                'packaging' => 0,
                'buy_total' => 0,
                'collected' => 0,
                'received' => 0,
                'advance' => 0,
                'advance_by' => null,
                'amount' => (float) ($d->amount ?? 0),
                'running' => 0,
            ];
        }

        foreach ($payouts as $p) {
            $r = $resellers->get($p->reseller_id);
            $at = $p->paid_at ?? ($p->created_at ?? now());
            $atIso = is_string($at) ? date('c', strtotime($at)) : $at->toIso8601String();
            $isPaid = in_array($p->status, ['paid', 'completed', 'approved']);

            $method = strtoupper($p->method ?: ($p->payment_method ?: 'PAYOUT'));
            $payoutNoteParts = [$method];
            if (!empty($p->reference)) $payoutNoteParts[] = $p->reference;
            if (!empty($p->notes)) $payoutNoteParts[] = $p->notes;
            if (!empty($p->transaction_id)) $payoutNoteParts[] = 'TxID: ' . $p->transaction_id;
            $payoutNote = implode(' · ', $payoutNoteParts);

            $txs[] = [
                'at' => $atIso,
                'kind' => 'withdraw',
                'direction' => $isPaid ? 'out' : 'void',
                'reseller_id' => (string) ($r->id ?? $p->reseller_id),
                'reseller_name' => $r->business_name ?? 'Reseller',
                'reseller_code' => $r->code ?? 'RS',
                'order_id' => null,
                'order_number' => null,
                'status' => $p->status ?? 'paid',
                'label' => $p->status === 'paid' ? 'Withdrawal (Paid)' : 'Withdrawal Request',
                'note' => $payoutNote,
                'sell_subtotal' => 0,
                'sell_delivery' => 0,
                'sell_total' => 0,
                'buy_product' => 0,
                'buy_delivery' => 0,
                'packaging' => 0,
                'buy_total' => 0,
                'collected' => 0,
                'received' => 0,
                'advance' => 0,
                'advance_by' => null,
                'amount' => (float) ($p->amount ?? 0),
                'running' => 0,
            ];
        }

        if ($fromTs || $toTs) {
            $txs = array_values(array_filter($txs, function ($t) use ($fromTs, $toTs) {
                $time = strtotime($t['at']);
                if ($fromTs && $time < $fromTs) return false;
                if ($toTs && $time > $toTs) return false;
                return true;
            }));
        }

        usort($txs, fn($a, $b) => strcmp($b['at'], $a['at']));

        if ($limit > 0) {
            $txs = array_slice($txs, 0, $limit);
        }

        return response()->json(['data' => $txs]);
    }

    private function getActivePaymentGateways()
    {
        return response()->json([
            ['provider' => 'bkash', 'is_active' => true],
            ['provider' => 'nagad', 'is_active' => true],
        ]);
    }

    private function courierBookingOptions()
    {
        $configs = CourierConfig::where('is_active', true)->get();
        return response()->json($configs);
    }

    private function adminImpersonationBegin($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $user = null;
        if ($userId) {
            $user = User::where('id', $userId)->first();
            if (!$user) {
                $reseller = Reseller::where('id', $userId)->orWhere('user_id', $userId)->first();
                if ($reseller) {
                    $user = User::where('id', $reseller->user_id)->first();
                }
            }
            if (!$user) {
                $supplier = Supplier::where('id', $userId)->orWhere('user_id', $userId)->first();
                if ($supplier) {
                    $user = User::where('id', $supplier->user_id)->first();
                }
            }
        }

        if (!$user && $userId) {
            $supplier = Supplier::where('id', $userId)->first();
            if ($supplier) {
                $user = User::firstOrCreate(
                    ['email' => $supplier->email ?: ($supplier->code . '@supplier.resellseba.com')],
                    [
                        'id' => (string) \Illuminate\Support\Str::uuid(),
                        'name' => $supplier->display_name ?: $supplier->name ?: $supplier->code,
                        'full_name' => $supplier->display_name ?: $supplier->name ?: $supplier->code,
                        'phone' => $supplier->contact_phone,
                        'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16)),
                        'is_phone_verified' => true,
                    ]
                );
                $supplier->update(['user_id' => $user->id]);
                \App\Models\UserRole::firstOrCreate(['user_id' => $user->id, 'role' => 'supplier']);
            }
        }

        $email = $user?->email ?? 'user@resellseba.com';
        $token = $user ? $user->createToken('impersonation_token')->plainTextToken : 'local-token-' . \Illuminate\Support\Str::random(32);

        return response()->json([
            'ok' => true,
            'email' => $email,
            'token' => $token,
            'accessToken' => $token,
            'access_token' => $token,
            'refreshToken' => $token,
            'refresh_token' => $token,
            'user' => $user ? [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'full_name' => $user->full_name,
            ] : null,
            'prev_hash' => null,
        ]);
    }

    private function adminAuthUsers()
    {
        $users = User::with('profile')->get();
        return response()->json($users->map(function ($u) {
            return [
                'user_id' => $u->id,
                'email' => $u->email,
                'email_confirmed' => (bool) $u->email_verified_at,
                'phone_confirmed' => (bool) ($u->is_phone_verified || $u->profile?->is_phone_verified),
                'created_at' => $u->created_at?->toISOString(),
            ];
        }));
    }

    private function adminConfirmUserEmail($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->orWhere('user_id', $userId)->first();
            if ($reseller) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }
        
        $alreadyConfirmed = false;
        if ($user) {
            $alreadyConfirmed = (bool) $user->email_verified_at;
            $user->email_verified_at = now();
            $user->save();
        }

        $profile = Profile::where('user_id', $user?->id ?? $userId)->orWhere('id', $userId)->first();
        if ($profile) {
            $profile->email_verified_at = now();
            $profile->save();
        }

        return response()->json([
            'email' => $user?->email,
            'already_confirmed' => $alreadyConfirmed,
        ]);
    }

    private function adminSetPhoneVerified($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $verified = isset($args['_verified']) ? (bool) $args['_verified'] : (isset($args['verified']) ? (bool) $args['verified'] : true);

        $user = User::where('id', $userId)->first();
        if (!$user) {
            $reseller = Reseller::where('id', $userId)->orWhere('user_id', $userId)->first();
            if ($reseller) {
                $user = User::where('id', $reseller->user_id)->first();
            }
        }

        if ($user) {
            $user->is_phone_verified = $verified;
            $user->save();
        }

        $profile = Profile::where('user_id', $user?->id ?? $userId)->orWhere('id', $userId)->first();
        if ($profile) {
            $profile->is_phone_verified = $verified;
            $profile->save();
        }

        $reseller = Reseller::where('id', $userId)->orWhere('user_id', $userId)->first();
        if ($reseller) {
            $reseller->is_phone_verified = $verified;
            $reseller->save();
        }

        return response()->json([
            'ok' => true,
            'verified' => $verified,
        ]);
    }

    private function adminSetUserPassword($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $password = $args['_password'] ?? $args['password'] ?? null;
        if ($userId && $password) {
            $user = User::where('id', $userId)->first();
            if ($user) {
                $user->password = Hash::make($password);
                $user->save();
            }
        }
        return response()->json(['ok' => true]);
    }

    private function adminDeleteUser($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        if ($userId) {
            User::where('id', $userId)->delete();
        }
        return response()->json(['ok' => true]);
    }

    private function adminUpdateStaffAccount($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? null;
        $email = $args['_email'] ?? $args['email'] ?? null;
        $fullName = $args['_full_name'] ?? $args['full_name'] ?? null;

        if ($userId) {
            $user = User::where('id', $userId)->first();
            if ($user) {
                if ($email) $user->email = $email;
                if ($fullName) $user->name = $fullName;
                $user->save();
            }
            $profile = Profile::where('user_id', $userId)->first();
            if ($profile && $fullName) {
                $profile->full_name = $fullName;
                $profile->save();
            }
        }
        return response()->json(['ok' => true]);
    }

    private function adminAssignRole($args)
    {
        $userId = $args['_user_id'] ?? $args['userId'] ?? null;
        $role = $args['_role'] ?? $args['role'] ?? 'staff';
        $customRoleId = $args['_custom_role_id'] ?? $args['custom_role_id'] ?? null;

        if ($userId) {
            UserRole::updateOrCreate(
                ['user_id' => $userId],
                ['role' => $role, 'custom_role_id' => $customRoleId]
            );
        }
        return response()->json(['ok' => true]);
    }

    private function adminCreateStaffUser($args)
    {
        $email = $args['_email'] ?? $args['email'] ?? null;
        $password = $args['_password'] ?? $args['password'] ?? '123456';
        $fullName = $args['_full_name'] ?? $args['full_name'] ?? 'Staff User';
        $role = $args['_role'] ?? $args['role'] ?? 'staff';
        $customRoleId = $args['_custom_role_id'] ?? $args['custom_role_id'] ?? null;

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $fullName,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        Profile::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'full_name' => $fullName,
        ]);

        UserRole::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'role' => $role,
            'custom_role_id' => $customRoleId,
        ]);

        return response()->json(['data' => $user->id]);
    }

    private function adminSupplierOverview($args)
    {
        $suppliers = Supplier::all();
        $orders = Order::with('items')->get();
        $orderItems = OrderItem::all();
        $products = Product::all();
        $returns = SupplierReturn::all();
        $payouts = SupplierPayout::all();

        $fromTs = isset($args['_from']) && $args['_from'] ? strtotime($args['_from']) : null;
        $toTs = isset($args['_to']) && $args['_to'] ? strtotime($args['_to'] . ' 23:59:59') : null;

        $prodMap = $products->keyBy('id');
        $ordersMap = $orders->keyBy('id');

        $supplierRows = $suppliers->map(function ($s) use ($orderItems, $prodMap, $ordersMap, $returns, $payouts, $fromTs, $toTs) {
            $productCount = Product::where('supplier_id', $s->id)->count();
            $myItems = $orderItems->filter(function ($oi) use ($s, $prodMap) {
                $p = $prodMap->get($oi->product_id);
                return ($oi->supplier_id ?: $p?->supplier_id) === $s->id;
            });

            $soldQty = 0;
            $earning = 0;
            $suppliedQty = 0;
            $suppliedValue = 0;
            $pendingQty = 0;
            $pendingAmount = 0;
            $returnedQty = 0;
            $returnedAmount = 0;

            foreach ($myItems as $it) {
                $o = $ordersMap->get($it->order_id);
                if (!$o) continue;

                $createdTs = $o->created_at ? $o->created_at->timestamp : ($it->created_at ? $it->created_at->timestamp : 0);
                if ($fromTs && $createdTs < $fromTs) continue;
                if ($toTs && $createdTs > $toTs) continue;

                $st = (string) ($o->status ?? 'pending');
                if ($st === 'cancelled' || $st === 'draft') continue;

                $p = $prodMap->get($it->product_id);
                $qty = (int) ($it->quantity ?? 1);
                $retQtyInput = (int) ($it->returned_qty ?? 0);
                $unitPrice = (float) ($it->buying_price ?: ($p?->supplier_price ?: ($p?->buying_price ?: ($it->sa_price ?: 0))));

                $suppliedQty += $qty;
                $suppliedValue += $qty * $unitPrice;

                $kept = 0;
                $ret = 0;

                if (in_array($st, ['delivered', 'completed', 'partial_full'])) {
                    $kept = $qty;
                } elseif ($st === 'partial_item') {
                    $ret = $retQtyInput > 0 ? min($retQtyInput, $qty) : 0;
                    $kept = max($qty - $ret, 0);
                } elseif (in_array($st, ['returned', 'damaged', 'partial_delivery'])) {
                    $ret = $qty;
                } else {
                    $pendingQty += $qty;
                    $pendingAmount += $qty * $unitPrice;
                }

                if ($kept > 0) {
                    $soldQty += $kept;
                    $earning += $kept * $unitPrice;
                }
                if ($ret > 0) {
                    $returnedQty += $ret;
                    $returnedAmount += $ret * $unitPrice;
                }
            }

            $paid = $payouts->where('supplier_id', $s->id)->where('status', 'paid')->sum('amount');
            $pendingPayout = $payouts->where('supplier_id', $s->id)->whereIn('status', ['pending', 'approved'])->sum('amount');
            $pendingReturns = $returns->where('supplier_id', $s->id)->where('status', 'pending_handover')->count();

            return [
                'id' => $s->id,
                'user_id' => $s->user_id ?? $s->id,
                'code' => $s->code,
                'display_name' => $s->display_name,
                'status' => $s->status ?? 'active',
                'contact_phone' => $s->contact_phone,
                'email' => $s->email,
                'whatsapp' => $s->whatsapp,
                'address' => $s->address,
                'notes' => $s->notes,
                'payout_method' => $s->payout_method,
                'payout_account_number' => $s->payout_account_number,
                'payout_account_name' => $s->payout_account_name,
                'payout_bank_name' => $s->payout_bank_name,
                'payout_branch' => $s->payout_branch,
                'payout_notes' => $s->payout_notes,
                'created_at' => $s->created_at ? $s->created_at->toIso8601String() : now()->toIso8601String(),
                'products' => $productCount,
                'sold_qty' => $soldQty,
                'earning' => $earning,
                'supplied_qty' => $suppliedQty,
                'supplied_value' => $suppliedValue,
                'pending_qty' => $pendingQty,
                'pending_amount' => $pendingAmount,
                'returned_qty' => $returnedQty,
                'returned_amount' => $returnedAmount,
                'paid' => (float) $paid,
                'pending_payout' => (float) $pendingPayout,
                'pending_returns' => $pendingReturns,
            ];
        });

        $returnRows = $returns->map(function ($r) {
            return [
                'id' => $r->id,
                'supplier_id' => $r->supplier_id,
                'supplier_name' => $r->supplier?->display_name ?? 'Supplier',
                'order_id' => $r->order_id,
                'order_number' => $r->order?->order_number ?? '',
                'order_item_id' => $r->order_item_id,
                'product_id' => $r->product_id,
                'product_name' => $r->product_name ?? 'Product',
                'quantity' => (int) $r->quantity,
                'unit_price' => (float) $r->unit_price,
                'order_status' => $r->order_status ?? 'returned',
                'status' => $r->status ?? 'pending_handover',
                'note' => $r->note,
                'handed_over_at' => $r->handed_over_at ? $r->handed_over_at->toIso8601String() : null,
                'created_at' => $r->created_at ? $r->created_at->toIso8601String() : now()->toIso8601String(),
            ];
        });

        $payoutRows = $payouts->map(function ($p) {
            return [
                'id' => $p->id,
                'supplier_id' => $p->supplier_id,
                'supplier_name' => $p->supplier?->display_name ?? 'Supplier',
                'amount' => (float) $p->amount,
                'status' => $p->status,
                'method' => $p->method,
                'reference' => $p->reference,
                'note' => $p->note,
                'admin_note' => $p->admin_note,
                'created_at' => $p->created_at ? $p->created_at->toIso8601String() : now()->toIso8601String(),
                'approved_at' => $p->approved_at ? $p->approved_at->toIso8601String() : null,
                'paid_at' => $p->paid_at ? $p->paid_at->toIso8601String() : null,
            ];
        });

        return response()->json([
            'suppliers' => $supplierRows,
            'returns' => $returnRows,
            'payouts' => $payoutRows,
        ]);
    }

    private function supplierReport($args)
    {
        $supplierId = $args['_supplier'] ?? $args['supplierId'] ?? null;
        $supplier = $supplierId ? Supplier::find($supplierId) : Supplier::first();
        if (!$supplier) {
            return response()->json(['supplier' => null, 'totals' => [], 'products' => [], 'sold' => [], 'upcoming' => [], 'returns' => [], 'payouts' => []]);
        }

        $orders = Order::all()->keyBy('id');
        $products = Product::all()->keyBy('id');
        $orderItems = OrderItem::all();

        $fromTs = isset($args['_from']) && $args['_from'] ? strtotime($args['_from']) : null;
        $toTs = isset($args['_to']) && $args['_to'] ? strtotime($args['_to'] . ' 23:59:59') : null;

        $myItems = $orderItems->filter(function ($oi) use ($supplier, $products) {
            $p = $products->get($oi->product_id);
            return ($oi->supplier_id ?: $p?->supplier_id) === $supplier->id;
        });

        $soldQty = 0;
        $earning = 0;
        $upcomingQty = 0;
        $upcomingAmount = 0;
        $suppliedQty = 0;
        $suppliedValue = 0;
        $returnedQty = 0;
        $returnedAmount = 0;

        $soldItems = [];
        $upcomingItems = [];
        $productStats = [];

        foreach ($myItems as $it) {
            $o = $orders->get($it->order_id);
            if (!$o) continue;

            $createdTs = $o->created_at ? $o->created_at->timestamp : ($it->created_at ? $it->created_at->timestamp : 0);
            if ($fromTs && $createdTs < $fromTs) continue;
            if ($toTs && $createdTs > $toTs) continue;

            $st = (string) ($o->status ?? 'pending');
            if ($st === 'cancelled' || $st === 'draft') continue;

            $p = $products->get($it->product_id);
            $qty = (int) ($it->quantity ?? 1);
            $retQtyInput = (int) ($it->returned_qty ?? 0);
            $unitPrice = (float) ($it->buying_price ?: ($p?->supplier_price ?: ($p?->buying_price ?: ($it->sa_price ?: 0))));
            $prodName = $it->product_name ?: ($p?->name ?: 'Product');

            $suppliedQty += $qty;
            $suppliedValue += $qty * $unitPrice;

            $kept = 0;
            $ret = 0;

            if (in_array($st, ['delivered', 'completed', 'partial_full'])) {
                $kept = $qty;
            } elseif ($st === 'partial_item') {
                $ret = $retQtyInput > 0 ? min($retQtyInput, $qty) : 0;
                $kept = max($qty - $ret, 0);
            } elseif (in_array($st, ['returned', 'damaged', 'partial_delivery'])) {
                $ret = $qty;
            } else {
                $upcomingQty += $qty;
                $upcomingAmount += $qty * $unitPrice;
            }

            $row = [
                'id' => $it->id,
                'order_id' => $it->order_id,
                'order_number' => $o->order_number ?? '',
                'product_name' => $prodName,
                'quantity' => $qty,
                'returned_qty' => $retQtyInput,
                'kept_qty' => $kept,
                'ret_qty' => $ret,
                'unit_price' => $unitPrice,
                'status' => $st,
                'created_at' => $o->created_at ? $o->created_at->toIso8601String() : now()->toIso8601String(),
                'updated_at' => $o->updated_at ? $o->updated_at->toIso8601String() : now()->toIso8601String(),
            ];

            if ($kept > 0) {
                $soldQty += $kept;
                $earning += $kept * $unitPrice;
                $soldItems[] = $row;
            }
            if ($ret > 0) {
                $returnedQty += $ret;
                $returnedAmount += $ret * $unitPrice;
            }
            if ($kept === 0 && $ret === 0) {
                $upcomingItems[] = $row;
            }

            if (!isset($productStats[$prodName])) {
                $productStats[$prodName] = [
                    'product_name' => $prodName,
                    'unit_price' => $unitPrice,
                    'orders' => 0,
                    'supplied_qty' => 0,
                    'supplied_value' => 0,
                    'delivered_qty' => 0,
                    'delivered_value' => 0,
                    'pending_qty' => 0,
                    'pending_value' => 0,
                    'returned_qty' => 0,
                    'returned_value' => 0,
                ];
            }
            $productStats[$prodName]['orders'] += 1;
            $productStats[$prodName]['supplied_qty'] += $qty;
            $productStats[$prodName]['supplied_value'] += $qty * $unitPrice;
            if ($kept > 0) {
                $productStats[$prodName]['delivered_qty'] += $kept;
                $productStats[$prodName]['delivered_value'] += $kept * $unitPrice;
            }
            if ($ret > 0) {
                $productStats[$prodName]['returned_qty'] += $ret;
                $productStats[$prodName]['returned_value'] += $ret * $unitPrice;
            }
            if ($kept === 0 && $ret === 0) {
                $productStats[$prodName]['pending_qty'] += $qty;
                $productStats[$prodName]['pending_value'] += $qty * $unitPrice;
            }
        }

        $myReturns = SupplierReturn::where('supplier_id', $supplier->id)->orderBy('created_at', 'desc')->get();
        $myPayouts = SupplierPayout::where('supplier_id', $supplier->id)->orderBy('created_at', 'desc')->get();

        $paid = $myPayouts->where('status', 'paid')->sum('amount');
        $pendingPayout = $myPayouts->whereIn('status', ['pending', 'approved'])->sum('amount');
        $returnsHandedOver = $myReturns->where('status', 'handed_over');
        $returnsPending = $myReturns->where('status', 'pending_handover');

        $returnsReceivedQty = $returnsHandedOver->sum('quantity');
        $returnsReceivedAmount = $returnsHandedOver->sum(function ($r) { return $r->quantity * $r->unit_price; });
        $returnsPendingQty = $returnsPending->sum('quantity');
        $returnsPendingAmount = $returnsPending->sum(function ($r) { return $r->quantity * $r->unit_price; });

        return response()->json([
            'supplier' => $supplier,
            'totals' => [
                'sold_qty' => $soldQty,
                'earning' => $earning,
                'upcoming_qty' => $upcomingQty,
                'upcoming_amount' => $upcomingAmount,
                'supplied_qty' => $suppliedQty,
                'supplied_value' => $suppliedValue,
                'returned_qty' => $returnedQty,
                'returned_amount' => $returnedAmount,
                'returns_received_qty' => $returnsReceivedQty,
                'returns_received_amount' => $returnsReceivedAmount,
                'returns_pending_qty' => $returnsPendingQty,
                'returns_pending_amount' => $returnsPendingAmount,
                'returns_pending_handover' => $returnsPending->count(),
                'paid' => (float) $paid,
                'pending_payout' => (float) $pendingPayout,
            ],
            'products' => array_values($productStats),
            'sold' => $soldItems,
            'upcoming' => $upcomingItems,
            'returns' => $myReturns,
            'payouts' => $myPayouts,
            'settings' => [
                'site_name' => $this->getGlobalSettingsArray()['site_name'] ?? 'ResellSeba',
                'logo_url' => $this->getGlobalSettingsArray()['logo_url'] ?? null,
                'primary_color' => $this->getGlobalSettingsArray()['primary_color'] ?? '#4f46e5',
                'accent_color' => $this->getGlobalSettingsArray()['accent_color'] ?? '#f59e0b',
                'border_radius' => $this->getGlobalSettingsArray()['border_radius'] ?? '0.875rem',
            ],
        ]);
    }

    private function supplierBootstrap($user)
    {
        $supplier = $user ? Supplier::where('user_id', $user->id)->first() : Supplier::first();
        return $this->supplierReport(['_supplier' => $supplier?->id]);
    }

    private function adminHandoverReturns($args)
    {
        $ids = $args['_ids'] ?? $args['ids'] ?? [];
        $undo = isset($args['_undo']) ? (bool) $args['_undo'] : (isset($args['undo']) ? (bool) $args['undo'] : false);

        if (!empty($ids)) {
            SupplierReturn::whereIn('id', $ids)->update([
                'status' => $undo ? 'pending_handover' : 'handed_over',
                'handed_over_at' => $undo ? null : now(),
                'updated_at' => now(),
            ]);
        }
        return response()->json(['ok' => true]);
    }

    private function supplierReceiveReturns($args)
    {
        $ids = $args['_ids'] ?? $args['ids'] ?? [];
        if (!empty($ids)) {
            SupplierReturn::whereIn('id', $ids)->update([
                'status' => 'handed_over',
                'handed_over_at' => now(),
                'updated_at' => now(),
            ]);
        }
        return response()->json(['ok' => true]);
    }

    private function computeSubscriptionState($sub, $plan)
    {
        $includesStore = (bool) ($plan['includes_store'] ?? ($plan->includes_store ?? true));
        $isExempt = (bool) ($sub['is_exempt'] ?? ($sub->is_exempt ?? false));
        $trialEndsAt = !empty($sub['trial_ends_at'] ?? $sub?->trial_ends_at) ? strtotime($sub['trial_ends_at'] ?? $sub->trial_ends_at) : null;
        $currentPeriodEnd = !empty($sub['current_period_end'] ?? $sub?->current_period_end) ? strtotime($sub['current_period_end'] ?? $sub->current_period_end) : null;
        $graceDays = isset($sub['override_grace_days']) ? (int)$sub['override_grace_days'] : (int)($plan['grace_days'] ?? ($plan->grace_days ?? 7));
        $now = time();

        $status = 'none';
        $endsAt = null;
        $daysLeft = 0;
        $graceDaysLeft = 0;
        $graceEndsAt = null;
        $locked = false;
        $storeEnabled = false;

        if ($isExempt) {
            $status = 'exempt';
            $locked = false;
            $storeEnabled = $includesStore;
            $daysLeft = 999;
        } elseif ($currentPeriodEnd && $currentPeriodEnd > $now) {
            $status = 'active';
            $endsAt = date('c', $currentPeriodEnd);
            $daysLeft = max(0, (int) ceil(($currentPeriodEnd - $now) / 86400));
            $locked = false;
            $storeEnabled = $includesStore;
        } elseif ($trialEndsAt && $trialEndsAt > $now) {
            $status = 'trial';
            $endsAt = date('c', $trialEndsAt);
            $daysLeft = max(0, (int) ceil(($trialEndsAt - $now) / 86400));
            $locked = false;
            $storeEnabled = $includesStore;
        } else {
            $expiry = $currentPeriodEnd ?: $trialEndsAt;
            if ($expiry) {
                $graceEnd = $expiry + ($graceDays * 86400);
                $graceEndsAt = date('c', $graceEnd);
                if ($graceEnd > $now) {
                    $status = 'grace';
                    $endsAt = date('c', $expiry);
                    $graceDaysLeft = max(0, (int) ceil(($graceEnd - $now) / 86400));
                    $locked = false;
                    $storeEnabled = $includesStore;
                } else {
                    $status = 'expired';
                    $endsAt = date('c', $expiry);
                    $locked = true;
                    $storeEnabled = false;
                }
            } else {
                $status = 'none';
                $locked = true;
                $storeEnabled = false;
            }
        }

        $price1m = (float) ($sub['override_price_1m'] ?? $sub?->override_price_1m ?? $plan['price_1m'] ?? $plan?->price_1m ?? 500);
        $price3m = (float) ($sub['override_price_3m'] ?? $sub?->override_price_3m ?? $plan['price_3m'] ?? $plan?->price_3m ?? 1200);
        $price6m = (float) ($sub['override_price_6m'] ?? $sub?->override_price_6m ?? $plan['price_6m'] ?? $plan?->price_6m ?? 2200);
        $price12m = (float) ($sub['override_price_12m'] ?? $sub?->override_price_12m ?? $plan['price_12m'] ?? $plan?->price_12m ?? 4000);

        return [
            'has_subscription' => (bool) $sub,
            'status' => $status,
            'locked' => $locked,
            'plan_id' => $plan['id'] ?? $plan?->id ?? ($sub['plan_id'] ?? $sub?->plan_id ?? null),
            'plan_code' => $plan['code'] ?? $plan?->code ?? ($includesStore ? 'panel_store' : 'panel'),
            'plan_name' => $plan['name'] ?? $plan?->name ?? ($includesStore ? 'Panel + Storefront Use' : 'Only Panel Use'),
            'includes_store' => $includesStore,
            'store_enabled' => $storeEnabled,
            'cycle_months' => (int) ($sub['cycle_months'] ?? $sub?->cycle_months ?? 1),
            'trial_ends_at' => $sub['trial_ends_at'] ?? $sub?->trial_ends_at ?? null,
            'current_period_end' => $sub['current_period_end'] ?? $sub?->current_period_end ?? null,
            'ends_at' => $endsAt,
            'grace_ends_at' => $graceEndsAt,
            'grace_days' => $graceDays,
            'days_left' => $daysLeft,
            'grace_days_left' => $graceDaysLeft,
            'is_exempt' => $isExempt,
            'price' => [
                '1' => $price1m,
                '3' => $price3m,
                '6' => $price6m,
                '12' => $price12m,
            ],
        ];
    }

    private function subscriptionOverview($args)
    {
        $defaultPlans = [
            [
                'id' => '265f1728-3f23-4677-92c7-9adeee24696b',
                'code' => 'panel',
                'name' => 'Only Panel Use',
                'description' => 'Reseller panel access only - catalog, orders, customers and finance.',
                'includes_store' => false,
                'price_1m' => 200,
                'price_3m' => 500,
                'price_6m' => 800,
                'price_12m' => 1500,
                'trial_days' => 30,
                'grace_days' => 7,
                'is_active' => true,
                'is_default' => false,
                'sort_order' => 1,
            ],
            [
                'id' => '65b24f28-da11-4524-88ba-be1f492e4a40',
                'code' => 'panel_store',
                'name' => 'Panel + Storefront Use',
                'description' => 'Everything in Panel plus your public storefront and custom domain.',
                'includes_store' => true,
                'price_1m' => 500,
                'price_3m' => 1200,
                'price_6m' => 2200,
                'price_12m' => 4000,
                'trial_days' => 30,
                'grace_days' => 7,
                'is_active' => true,
                'is_default' => true,
                'sort_order' => 2,
            ],
        ];

        $plans = $defaultPlans;
        try {
            if (Schema::hasTable('subscription_plans')) {
                $dbPlans = DB::table('subscription_plans')->orderBy('sort_order', 'asc')->get();
                if ($dbPlans->isNotEmpty()) {
                    $plans = $dbPlans->map(fn($p) => (array) $p)->toArray();
                }
            }
        } catch (\Throwable $e) {}

        $plansById = collect($plans)->keyBy('id');
        $defaultPlan = collect($plans)->firstWhere('is_default', true) ?? ($plans[0] ?? null);

        $resellers = Reseller::all();
        $dbSubscriptions = collect();
        try {
            if (Schema::hasTable('reseller_subscriptions')) {
                $dbSubscriptions = DB::table('reseller_subscriptions')->get()->keyBy('reseller_id');
            }
        } catch (\Throwable $e) {}

        $orders = Order::whereIn('status', ['delivered', 'completed'])->get()->groupBy('reseller_id');
        $payouts = Payout::whereIn('status', ['paid', 'completed'])->get()->groupBy('reseller_id');
        $pendingPayouts = Payout::whereIn('status', ['pending', 'processing', 'approved'])->get()->groupBy('reseller_id');

        $subscribers = $resellers->map(function ($r) use ($dbSubscriptions, $plansById, $defaultPlan, $orders, $payouts, $pendingPayouts) {
            $sub = $dbSubscriptions->get($r->id);
            $plan = $sub && isset($sub->plan_id) ? $plansById->get($sub->plan_id) : $defaultPlan;
            $state = $this->computeSubscriptionState($sub ? (array) $sub : null, $plan);

            $deliveredProfit = (float) ($orders->get($r->id)?->sum('reseller_profit') ?? 0);
            $paidOut = (float) ($payouts->get($r->id)?->sum('amount') ?? 0);
            $pending = (float) ($pendingPayouts->get($r->id)?->sum('amount') ?? 0);
            $balance = max(0, $deliveredProfit - $paidOut - $pending);

            return [
                'reseller_id' => $r->id,
                'code' => $r->code ?? 'RS-'.substr($r->id, 0, 4),
                'business_name' => $r->business_name ?? $r->name ?? 'Reseller',
                'status' => $r->status ?? 'active',
                'avatar_url' => $r->avatar_url ?? null,
                'subscription' => $sub ? (array) $sub : null,
                'state' => $state,
                'balance' => $balance,
            ];
        })->values();

        $payments = [];
        try {
            if (Schema::hasTable('subscription_payments')) {
                $payments = DB::table('subscription_payments')
                    ->leftJoin('resellers', 'subscription_payments.reseller_id', '=', 'resellers.id')
                    ->leftJoin('subscription_plans', 'subscription_payments.plan_id', '=', 'subscription_plans.id')
                    ->select(
                        'subscription_payments.*',
                        'resellers.business_name',
                        'resellers.code',
                        'subscription_plans.name as plan_name'
                    )
                    ->orderBy('subscription_payments.created_at', 'desc')
                    ->get();
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'plans' => $plans,
            'subscribers' => $subscribers,
            'payments' => $payments,
        ]);
    }

    private function mySubscription($user, $args)
    {
        $reseller = $user ? Reseller::where('user_id', $user->id)->first() : null;
        if (!$reseller) {
            $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
            if ($resellerId) {
                $reseller = Reseller::find($resellerId);
            }
        }
        if (!$reseller) {
            $reseller = Reseller::first();
        }

        $overview = $this->subscriptionOverview([]);
        $data = $overview->getData(true);
        $plans = $data['plans'] ?? [];

        $sub = null;
        if ($reseller) {
            try {
                if (Schema::hasTable('reseller_subscriptions')) {
                    $sub = DB::table('reseller_subscriptions')->where('reseller_id', $reseller->id)->first();
                }
            } catch (\Throwable $e) {}
        }

        $plan = collect($plans)->firstWhere('id', $sub?->plan_id) ?? collect($plans)->firstWhere('is_default', true) ?? ($plans[0] ?? null);
        $state = $this->computeSubscriptionState($sub ? (array)$sub : null, $plan);

        $deliveredProfit = $reseller ? (float) Order::where('reseller_id', $reseller->id)->whereIn('status', ['delivered', 'completed'])->sum('reseller_profit') : 0;
        $paidOut = $reseller ? (float) Payout::where('reseller_id', $reseller->id)->whereIn('status', ['paid', 'completed'])->sum('amount') : 0;
        $pending = $reseller ? (float) Payout::where('reseller_id', $reseller->id)->whereIn('status', ['pending', 'processing', 'approved'])->sum('amount') : 0;
        $balance = max(0, $deliveredProfit - $paidOut - $pending);

        $payments = [];
        if ($reseller) {
            try {
                if (Schema::hasTable('subscription_payments')) {
                    $payments = DB::table('subscription_payments')
                        ->where('reseller_id', $reseller->id)
                        ->orderBy('created_at', 'desc')
                        ->get();
                }
            } catch (\Throwable $e) {}
        }

        $methods = [];
        try {
            if (Schema::hasTable('payment_gateway_configs')) {
                $methods = DB::table('payment_gateway_configs')->where('is_active', true)->get();
            }
        } catch (\Throwable $e) {}

        return response()->json([
            'reseller_id' => $reseller?->id,
            'state' => $state,
            'balance' => $balance,
            'frozen' => (float) ($reseller?->frozen_amount ?? 0),
            'plans' => $plans,
            'payments' => $payments,
            'methods' => $methods,
        ]);
    }

    private function adminSetSubscription($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $patch = $args['_patch'] ?? $args['patch'] ?? [];

        if (!$resellerId) {
            return response()->json(['error' => 'Reseller ID is required'], 400);
        }

        $now = now();
        $record = null;
        try {
            if (Schema::hasTable('reseller_subscriptions')) {
                $record = DB::table('reseller_subscriptions')->where('reseller_id', $resellerId)->first();
                $updateData = array_merge($patch, ['updated_at' => $now]);
                if ($record) {
                    DB::table('reseller_subscriptions')->where('reseller_id', $resellerId)->update($updateData);
                } else {
                    DB::table('reseller_subscriptions')->insert(array_merge([
                        'id' => (string) Str::uuid(),
                        'reseller_id' => $resellerId,
                        'created_at' => $now,
                    ], $updateData));
                }
                $record = DB::table('reseller_subscriptions')->where('reseller_id', $resellerId)->first();
            }
        } catch (\Throwable $e) {}

        $plan = null;
        if ($record && !empty($record->plan_id)) {
            try {
                $plan = DB::table('subscription_plans')->where('id', $record->plan_id)->first();
            } catch (\Throwable $e) {}
        }

        $state = $this->computeSubscriptionState($record ? (array)$record : $patch, $plan ? (array)$plan : null);
        return response()->json($state);
    }

    private function subscriptionPayFromEarning($user, $args)
    {
        $reseller = $user ? Reseller::where('user_id', $user->id)->first() : Reseller::first();
        if (!$reseller) {
            return response()->json(['error' => 'Reseller not found'], 404);
        }

        $planId = $args['_plan_id'] ?? $args['plan_id'] ?? null;
        $months = (int) ($args['_months'] ?? $args['months'] ?? 1);

        $overview = $this->subscriptionOverview([]);
        $data = $overview->getData(true);
        $plans = $data['plans'] ?? [];
        $plan = collect($plans)->firstWhere('id', $planId) ?? ($plans[0] ?? null);

        if (!$plan) {
            return response()->json(['error' => 'Plan not found'], 404);
        }

        $priceKey = 'price_' . $months . 'm';
        $amount = (float) ($plan[$priceKey] ?? ($plan['price_1m'] * $months));

        // Check reseller balance
        $deliveredProfit = (float) Order::where('reseller_id', $reseller->id)->whereIn('status', ['delivered', 'completed'])->sum('reseller_profit');
        $paidOut = (float) Payout::where('reseller_id', $reseller->id)->whereIn('status', ['paid', 'completed'])->sum('amount');
        $pending = (float) Payout::where('reseller_id', $reseller->id)->whereIn('status', ['pending', 'processing', 'approved'])->sum('amount');
        $balance = max(0, $deliveredProfit - $paidOut - $pending);

        if ($balance < $amount) {
            return response()->json(['error' => 'Insufficient balance to pay from earnings'], 400);
        }

        // Extend subscription
        $sub = DB::table('reseller_subscriptions')->where('reseller_id', $reseller->id)->first();
        $now = time();
        $currentPeriodEnd = !empty($sub?->current_period_end) ? strtotime($sub->current_period_end) : $now;
        $startFrom = max($now, $currentPeriodEnd);
        $newEnd = strtotime("+{$months} months", $startFrom);
        $periodFrom = date('c', $startFrom);
        $periodTo = date('c', $newEnd);

        $subData = [
            'plan_id' => $plan['id'],
            'cycle_months' => $months,
            'current_period_end' => $periodTo,
            'updated_at' => now(),
        ];

        if ($sub) {
            DB::table('reseller_subscriptions')->where('reseller_id', $reseller->id)->update($subData);
        } else {
            DB::table('reseller_subscriptions')->insert(array_merge([
                'id' => (string) Str::uuid(),
                'reseller_id' => $reseller->id,
                'created_at' => now(),
            ], $subData));
        }

        // Record payment
        try {
            DB::table('subscription_payments')->insert([
                'id' => (string) Str::uuid(),
                'reseller_id' => $reseller->id,
                'plan_id' => $plan['id'],
                'cycle_months' => $months,
                'amount' => $amount,
                'source' => 'earning',
                'status' => 'paid',
                'period_from' => $periodFrom,
                'period_to' => $periodTo,
                'created_at' => now(),
                'reviewed_at' => now(),
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'ok' => true,
            'amount' => $amount,
            'period_to' => $periodTo,
        ]);
    }

    private function subscriptionRequestManual($user, $args)
    {
        $reseller = $user ? Reseller::where('user_id', $user->id)->first() : Reseller::first();
        if (!$reseller) {
            return response()->json(['error' => 'Reseller not found'], 404);
        }

        $planId = $args['_plan_id'] ?? $args['plan_id'] ?? null;
        $months = (int) ($args['_months'] ?? $args['months'] ?? 1);
        $methodId = $args['_payment_config_id'] ?? $args['payment_config_id'] ?? null;
        $reference = $args['_reference'] ?? $args['reference'] ?? '';
        $note = $args['_note'] ?? $args['note'] ?? '';

        $overview = $this->subscriptionOverview([]);
        $data = $overview->getData(true);
        $plans = $data['plans'] ?? [];
        $plan = collect($plans)->firstWhere('id', $planId) ?? ($plans[0] ?? null);

        $priceKey = 'price_' . $months . 'm';
        $amount = (float) ($plan[$priceKey] ?? (($plan['price_1m'] ?? 500) * $months));
        $paymentId = (string) Str::uuid();

        try {
            DB::table('subscription_payments')->insert([
                'id' => $paymentId,
                'reseller_id' => $reseller->id,
                'plan_id' => $plan ? $plan['id'] : $planId,
                'cycle_months' => $months,
                'amount' => $amount,
                'source' => 'manual',
                'status' => 'pending',
                'method' => $methodId,
                'reference' => $reference,
                'note' => $note,
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'ok' => true,
            'id' => $paymentId,
            'amount' => $amount,
        ]);
    }

    private function subscriptionReviewPayment($args)
    {
        $paymentId = $args['_payment_id'] ?? $args['payment_id'] ?? null;
        $approve = (bool) ($args['_approve'] ?? $args['approve'] ?? false);
        $adminNote = $args['_admin_note'] ?? $args['admin_note'] ?? '';

        if (!$paymentId) {
            return response()->json(['error' => 'Payment ID is required'], 400);
        }

        $payment = DB::table('subscription_payments')->where('id', $paymentId)->first();
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        if ($approve) {
            $months = (int) ($payment->cycle_months ?? 1);
            $sub = DB::table('reseller_subscriptions')->where('reseller_id', $payment->reseller_id)->first();
            $now = time();
            $currentPeriodEnd = !empty($sub?->current_period_end) ? strtotime($sub->current_period_end) : $now;
            $startFrom = max($now, $currentPeriodEnd);
            $newEnd = strtotime("+{$months} months", $startFrom);
            $periodFrom = date('c', $startFrom);
            $periodTo = date('c', $newEnd);

            DB::table('subscription_payments')->where('id', $paymentId)->update([
                'status' => 'paid',
                'reviewed_at' => now(),
                'admin_note' => $adminNote,
                'period_from' => $periodFrom,
                'period_to' => $periodTo,
            ]);

            $subData = [
                'plan_id' => $payment->plan_id,
                'cycle_months' => $months,
                'current_period_end' => $periodTo,
                'updated_at' => now(),
            ];

            if ($sub) {
                DB::table('reseller_subscriptions')->where('reseller_id', $payment->reseller_id)->update($subData);
            } else {
                DB::table('reseller_subscriptions')->insert(array_merge([
                    'id' => (string) Str::uuid(),
                    'reseller_id' => $payment->reseller_id,
                    'created_at' => now(),
                ], $subData));
            }
        } else {
            DB::table('subscription_payments')->where('id', $paymentId)->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'admin_note' => $adminNote,
            ]);
        }

        return response()->json(['ok' => true]);
    }

    private function depositRequestReview($args)
    {
        $id = $args['_id'] ?? $args['id'] ?? null;
        $approve = (bool) ($args['_approve'] ?? $args['approve'] ?? false);
        $adminNote = $args['_admin_note'] ?? $args['admin_note'] ?? null;

        if (!$id) {
            return response()->json(['error' => 'Deposit request ID required'], 400);
        }

        $req = null;
        try {
            if (Schema::hasTable('deposit_requests')) {
                $req = DB::table('deposit_requests')->where('id', $id)->first();
            }
        } catch (\Throwable $e) {}

        if (!$req) {
            return response()->json(['ok' => true]);
        }

        $now = now();
        if ($approve) {
            try {
                if (Schema::hasTable('deposit_requests')) {
                    DB::table('deposit_requests')->where('id', $id)->update([
                        'status' => 'approved',
                        'admin_note' => $adminNote,
                        'reviewed_at' => $now,
                        'updated_at' => $now,
                    ]);
                }

                if (Schema::hasTable('reseller_deposits')) {
                    DB::table('reseller_deposits')->insert([
                        'id' => (string) Str::uuid(),
                        'reseller_id' => $req->reseller_id,
                        'amount' => $req->amount,
                        'type' => $req->method ?? 'manual',
                        'reference' => $req->reference ?? null,
                        'note' => $req->note ?? 'Approved security deposit',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            } catch (\Throwable $e) {}
        } else {
            try {
                if (Schema::hasTable('deposit_requests')) {
                    DB::table('deposit_requests')->where('id', $id)->update([
                        'status' => 'rejected',
                        'admin_note' => $adminNote,
                        'reviewed_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            } catch (\Throwable $e) {}
        }

        return response()->json(['ok' => true]);
    }

    private function logStoreVisit(Request $request, $args)
    {
        $code = trim($args['_code'] ?? $args['code'] ?? '');
        $path = $args['_path'] ?? $args['path'] ?? '/';
        $referrer = $args['_referrer'] ?? $args['referrer'] ?? null;
        $sessionKey = $args['_session_key'] ?? $args['session_key'] ?? null;
        $device = $args['_device'] ?? $args['device'] ?? 'desktop';

        $reseller = Reseller::where('code', $code)->first();
        if (!$reseller && $code) {
            $reseller = Reseller::where('id', $code)->first();
        }

        if (Schema::hasTable('store_visits')) {
            try {
                StoreVisit::create([
                    'id' => (string) Str::uuid(),
                    'reseller_id' => $reseller?->id,
                    'store_code' => $code ?: ($reseller?->code ?? 'store'),
                    'path' => $path,
                    'referrer' => $referrer,
                    'session_key' => $sessionKey,
                    'device' => $device,
                    'ip' => $request->ip(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'created_at' => now(),
                ]);
            } catch (\Throwable $e) {}
        }

        return response()->json(['data' => true, 'ok' => true]);
    }

    private function storeVisitSummary($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $from = $args['_from'] ?? $args['from'] ?? now()->subDays(30)->toIso8601String();
        $to = $args['_to'] ?? $args['to'] ?? now()->toIso8601String();

        if (!Schema::hasTable('store_visits')) {
            return response()->json(['data' => [[
                'visits' => 0,
                'visitors' => 0,
                'live' => 0,
                'today_visits' => 0,
                'last_at' => null,
            ]]]);
        }

        $query = StoreVisit::whereBetween('created_at', [$from, $to]);
        if ($resellerId) {
            $query->where('reseller_id', $resellerId);
        }

        $visits = (clone $query)->count();
        $visitors = (clone $query)->distinct('session_key')->count('session_key');
        if ($visitors === 0 && $visits > 0) {
            $visitors = ceil($visits * 0.7);
        }

        $liveQuery = StoreVisit::where('created_at', '>=', now()->subMinutes(5));
        if ($resellerId) {
            $liveQuery->where('reseller_id', $resellerId);
        }
        $live = $liveQuery->distinct('session_key')->count('session_key') ?: $liveQuery->count();

        $todayQuery = StoreVisit::whereDate('created_at', now()->toDateString());
        if ($resellerId) {
            $todayQuery->where('reseller_id', $resellerId);
        }
        $todayVisits = $todayQuery->count();

        $lastAt = (clone $query)->latest('created_at')->value('created_at');

        return response()->json(['data' => [[
            'visits' => (int) $visits,
            'visitors' => (int) $visitors,
            'live' => (int) $live,
            'today_visits' => (int) $todayVisits,
            'last_at' => $lastAt ? Carbon::parse($lastAt)->toIso8601String() : null,
        ]]]);
    }

    private function storeVisitDaily($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $from = $args['_from'] ?? $args['from'] ?? now()->subDays(7)->toIso8601String();
        $to = $args['_to'] ?? $args['to'] ?? now()->toIso8601String();

        if (!Schema::hasTable('store_visits')) {
            return response()->json(['data' => []]);
        }

        $query = StoreVisit::whereBetween('created_at', [$from, $to]);
        if ($resellerId) {
            $query->where('reseller_id', $resellerId);
        }

        $visits = $query->get();

        $dayMap = [];
        $cur = Carbon::parse($from)->startOfDay();
        $end = Carbon::parse($to)->endOfDay();
        while ($cur->lte($end)) {
            $dayStr = $cur->toDateString();
            $dayMap[$dayStr] = ['visits' => 0, 'sessions' => []];
            $cur->addDay();
        }

        foreach ($visits as $v) {
            $dayStr = Carbon::parse($v->created_at)->toDateString();
            if (!isset($dayMap[$dayStr])) {
                $dayMap[$dayStr] = ['visits' => 0, 'sessions' => []];
            }
            $dayMap[$dayStr]['visits']++;
            if ($v->session_key) {
                $dayMap[$dayStr]['sessions'][$v->session_key] = true;
            }
        }

        $result = [];
        foreach ($dayMap as $day => $val) {
            $sessCount = count($val['sessions']);
            $result[] = [
                'day' => $day,
                'visits' => $val['visits'],
                'visitors' => $sessCount ?: ($val['visits'] > 0 ? ceil($val['visits'] * 0.7) : 0),
            ];
        }

        return response()->json(['data' => $result]);
    }

    private function storeVisitPages($args)
    {
        $resellerId = $args['_reseller_id'] ?? $args['reseller_id'] ?? null;
        $from = $args['_from'] ?? $args['from'] ?? now()->subDays(30)->toIso8601String();
        $to = $args['_to'] ?? $args['to'] ?? now()->toIso8601String();
        $limit = (int) ($args['_limit'] ?? $args['limit'] ?? 12);

        if (!Schema::hasTable('store_visits')) {
            return response()->json(['data' => []]);
        }

        $query = StoreVisit::whereBetween('created_at', [$from, $to]);
        if ($resellerId) {
            $query->where('reseller_id', $resellerId);
        }

        $visits = $query->get();
        $pageMap = [];
        foreach ($visits as $v) {
            $p = $v->path ?: '/';
            if (!isset($pageMap[$p])) {
                $pageMap[$p] = ['visits' => 0, 'sessions' => []];
            }
            $pageMap[$p]['visits']++;
            if ($v->session_key) {
                $pageMap[$p]['sessions'][$v->session_key] = true;
            }
        }

        $result = [];
        foreach ($pageMap as $path => $val) {
            $sessCount = count($val['sessions']);
            $result[] = [
                'path' => $path,
                'visits' => $val['visits'],
                'visitors' => $sessCount ?: ($val['visits'] > 0 ? ceil($val['visits'] * 0.7) : 0),
            ];
        }

        usort($result, fn($a, $b) => $b['visits'] <=> $a['visits']);

        return response()->json(['data' => array_slice($result, 0, $limit)]);
    }

    private function storeVisitLeaderboard($args)
    {
        $from = $args['_from'] ?? $args['from'] ?? now()->subDays(30)->toIso8601String();
        $to = $args['_to'] ?? $args['to'] ?? now()->toIso8601String();
        $limit = (int) ($args['_limit'] ?? $args['limit'] ?? 100);

        $resellers = Reseller::all();
        if (!Schema::hasTable('store_visits')) {
            $empty = $resellers->map(fn($r) => [
                'reseller_id' => $r->id,
                'code' => $r->code,
                'business_name' => $r->business_name,
                'visits' => 0,
                'visitors' => 0,
                'live' => 0,
                'last_at' => null,
            ])->toArray();
            return response()->json(['data' => array_slice($empty, 0, $limit)]);
        }

        $visits = StoreVisit::whereBetween('created_at', [$from, $to])->get();
        $fiveMinAgo = now()->subMinutes(5);

        $result = $resellers->map(function ($r) use ($visits, $fiveMinAgo) {
            $rVisits = $visits->where('reseller_id', $r->id);
            $uniqueSessions = $rVisits->pluck('session_key')->filter()->unique()->count();
            $liveSessions = $rVisits->filter(fn($v) => Carbon::parse($v->created_at)->gte($fiveMinAgo))
                ->pluck('session_key')->filter()->unique()->count();
            $lastAt = $rVisits->max('created_at');

            return [
                'reseller_id' => $r->id,
                'code' => $r->code ?: '',
                'business_name' => $r->business_name ?: 'Store',
                'visits' => $rVisits->count(),
                'visitors' => $uniqueSessions ?: ($rVisits->count() > 0 ? ceil($rVisits->count() * 0.7) : 0),
                'live' => $liveSessions,
                'last_at' => $lastAt ? Carbon::parse($lastAt)->toIso8601String() : null,
            ];
        })->sortByDesc('visits')->values()->toArray();

        return response()->json(['data' => array_slice($result, 0, $limit)]);
    }

    private function purgeStoreVisits()
    {
        if (!Schema::hasTable('store_visits')) {
            return response()->json(['data' => 0, 'ok' => true]);
        }
        $deleted = StoreVisit::where('created_at', '<', now()->subDays(30))->delete();
        return response()->json(['data' => (int) $deleted, 'ok' => true]);
    }

    private function supplierProducts($user)
    {
        $supplier = Supplier::where('user_id', $user?->id)->first();
        $products = Product::where('supplier_id', $supplier?->id)->get();
        $brands = Brand::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();

        return response()->json([
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    private function supplierSaveProduct($user, $args)
    {
        $supplier = Supplier::where('user_id', $user?->id)->first();
        $id = $args['_id'] ?? $args['id'] ?? null;
        $payload = $args['_payload'] ?? $args['payload'] ?? [];

        if ($id) {
            $product = Product::where('id', $id)->first();
            if ($product) {
                $product->update($payload);
            }
        } else {
            $payload['id'] = (string) Str::uuid();
            $payload['supplier_id'] = $supplier?->id;
            $payload['approval_status'] = 'pending';
            $payload['is_active'] = false;
            Product::create($payload);
        }

        return response()->json(['ok' => true]);
    }

    private function supplierQuickUpdate($user, $args)
    {
        $id = $args['_id'] ?? $args['id'] ?? null;
        $product = Product::where('id', $id)->first();
        if ($product) {
            $patch = [];
            if (isset($args['_price'])) $patch['price'] = $args['_price'];
            if (isset($args['_stock'])) $patch['stock'] = $args['_stock'];
            if (isset($args['_weight'])) $patch['weight'] = $args['_weight'];
            $product->update($patch);
        }
        return response()->json(['price_pending' => false, 'approval_status' => 'approved']);
    }

    private function supplierOrdersPage($user, $args)
    {
        $supplier = Supplier::where('user_id', $user?->id)->first();
        $orders = Order::whereHas('items.product', function ($q) use ($supplier) {
            $q->where('supplier_id', $supplier?->id);
        })->with(['items.product'])->orderBy('created_at', 'desc')->get();

        return response()->json(['orders' => $orders, 'supplier' => $supplier]);
    }

    private function supplierSetOrderStatus($user, $args)
    {
        $orderId = $args['_order'] ?? $args['order'] ?? null;
        $status = $args['_status'] ?? $args['status'] ?? null;
        if ($orderId && $status) {
            Order::where('id', $orderId)->update(['status' => $status]);
        }
        return response()->json(['ok' => true]);
    }

    private function adminReviewProduct($args)
    {
        $id = $args['_id'] ?? $args['id'] ?? null;
        $approve = !empty($args['_approve']);
        if ($id) {
            Product::where('id', $id)->update([
                'approval_status' => $approve ? 'approved' : 'rejected',
                'is_active' => $approve,
            ]);
        }
        return response()->json(['ok' => true]);
    }

    private function adminDeleteSupplier($args)
    {
        $id = $args['_supplier_id'] ?? $args['supplier_id'] ?? null;
        if ($id) {
            Supplier::where('id', $id)->delete();
        }
        return response()->json(['ok' => true]);
    }

    private function adminSetProductSupplier($args)
    {
        $id = $args['_id'] ?? $args['id'] ?? null;
        $supplierId = $args['_supplier'] ?? $args['supplier'] ?? null;
        if ($id) {
            Product::where('id', $id)->update(['supplier_id' => $supplierId]);
        }
        return response()->json(['ok' => true]);
    }

    private function isSuperAdminRpc($user, $args)
    {
        $uid = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? $user?->id;
        if (!$uid) {
            return response()->json(['data' => false]);
        }
        $role = DB::table('user_roles')->where('user_id', $uid)->value('role');
        $isSuper = in_array(strtolower((string)$role), ['super_admin', 'admin']);
        return response()->json(['data' => $isSuper]);
    }

    private function hasRoleRpc($user, $args)
    {
        $uid = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? $user?->id;
        $targetRole = $args['_role'] ?? $args['role'] ?? null;
        if (!$uid || !$targetRole) {
            return response()->json(['data' => false]);
        }
        $userRole = DB::table('user_roles')->where('user_id', $uid)->value('role');
        if (strtolower((string)$userRole) === strtolower($targetRole)) {
            return response()->json(['data' => true]);
        }
        if (in_array(strtolower((string)$userRole), ['super_admin', 'admin'])) {
            return response()->json(['data' => true]);
        }
        return response()->json(['data' => false]);
    }

    private function hasPermissionRpc($user, $args)
    {
        $uid = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? $user?->id;
        $perm = $args['_permission'] ?? $args['permission'] ?? null;
        if (!$uid || !$perm) {
            return response()->json(['data' => false]);
        }
        $userRole = DB::table('user_roles')->where('user_id', $uid)->first();
        if ($userRole && in_array(strtolower((string)$userRole->role), ['super_admin', 'admin'])) {
            return response()->json(['data' => true]);
        }
        if ($userRole && $userRole->custom_role_id) {
            $hasPerm = DB::table('role_permissions')
                ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
                ->where('role_permissions.role_id', $userRole->custom_role_id)
                ->where('permissions.key', $perm)
                ->exists();
            return response()->json(['data' => $hasPerm]);
        }
        return response()->json(['data' => false]);
    }

    private function hasAnyPermissionRpc($user, $args)
    {
        $uid = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? $user?->id;
        $perms = $args['_permissions'] ?? $args['permissions'] ?? [];
        if (!$uid || empty($perms)) {
            return response()->json(['data' => false]);
        }
        $userRole = DB::table('user_roles')->where('user_id', $uid)->first();
        if ($userRole && in_array(strtolower((string)$userRole->role), ['super_admin', 'admin'])) {
            return response()->json(['data' => true]);
        }
        if ($userRole && $userRole->custom_role_id) {
            $hasAny = DB::table('role_permissions')
                ->join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
                ->where('role_permissions.role_id', $userRole->custom_role_id)
                ->whereIn('permissions.key', (array)$perms)
                ->exists();
            return response()->json(['data' => $hasAny]);
        }
        return response()->json(['data' => false]);
    }

    private function supplierCanBookOrderRpc($user, $args)
    {
        $supplierId = $args['_supplier_id'] ?? $args['supplier_id'] ?? null;
        if ($supplierId) {
            $can = DB::table('suppliers')->where('id', $supplierId)->value('can_book_order');
            return response()->json(['data' => (bool)$can]);
        }
        if ($user) {
            $can = DB::table('suppliers')->where('user_id', $user->id)->value('can_book_order');
            return response()->json(['data' => (bool)$can]);
        }
        return response()->json(['data' => false]);
    }

    private function resellerAutoApproveRpc($args)
    {
        $val = DB::table('global_settings')->where('key', 'reseller_auto_approve')->value('value');
        $isAuto = $val ? filter_var(trim($val, '"'), FILTER_VALIDATE_BOOLEAN) : true;
        return response()->json(['data' => $isAuto]);
    }

    private function verifyStateRpc($user, $args)
    {
        $uid = $args['_user_id'] ?? $args['userId'] ?? $args['user_id'] ?? $user?->id;
        if (!$uid) {
            return response()->json(['data' => ['email_verified_at' => null, 'phone_verified_at' => null]]);
        }
        $target = User::find($uid);
        return response()->json([
            'data' => [
                'email_verified_at' => $target?->email_verified_at ? Carbon::parse($target->email_verified_at)->toIso8601String() : null,
                'phone_verified_at' => ($target?->is_phone_verified ? Carbon::parse($target->updated_at)->toIso8601String() : null),
            ]
        ]);
    }

    private function verifyIssueRpc($user, $args)
    {
        $channel = $args['_channel'] ?? $args['channel'] ?? 'email';
        $target = $args['_target'] ?? $args['target'] ?? null;
        $code = $args['_code'] ?? $args['code'] ?? null;

        if (!$code) {
            return response()->json(['error' => 'Code is required'], 400);
        }

        $userId = $user?->id;
        if (!$userId && $target) {
            $userId = User::where('email', $target)->orWhere('phone', $target)->value('id');
        }

        if (!$userId) {
            return response()->json(['error' => 'User not found'], 404);
        }

        DB::table('verification_codes')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'channel' => $channel,
            'code' => (string) $code,
            'expires_at' => Carbon::now()->addMinutes(15),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return response()->json(['ok' => true, 'message' => 'Verification code stored']);
    }

    private function verifyCheckRpc($user, $args)
    {
        $channel = $args['_channel'] ?? $args['channel'] ?? 'email';
        $code = $args['_code'] ?? $args['code'] ?? null;
        $userId = $user?->id ?? $args['_user_id'] ?? null;

        if (!$code || !$userId) {
            return response()->json(['error' => 'Code and user required'], 400);
        }

        $record = DB::table('verification_codes')
            ->where('user_id', $userId)
            ->where('channel', $channel)
            ->where('code', (string) $code)
            ->where('expires_at', '>', Carbon::now())
            ->whereNull('verified_at')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$record) {
            return response()->json(['error' => 'Invalid or expired verification code'], 400);
        }

        DB::table('verification_codes')->where('id', $record->id)->update([
            'verified_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        if ($channel === 'email') {
            User::where('id', $userId)->update(['email_verified_at' => Carbon::now()]);
        } elseif ($channel === 'sms' || $channel === 'phone') {
            User::where('id', $userId)->update(['is_phone_verified' => true]);
        }

        return response()->json(['data' => ['ok' => true]]);
    }

    private function cleanupCountsRpc()
    {
        $now = Carbon::now();
        $ninetyDaysAgo = Carbon::now()->subDays(90);

        $expiredVerifications = DB::getSchemaBuilder()->hasTable('verification_codes')
            ? DB::table('verification_codes')->where('expires_at', '<', $now)->count()
            : 0;

        $oldNotifications = DB::getSchemaBuilder()->hasTable('notification_logs')
            ? DB::table('notification_logs')->where('created_at', '<', $ninetyDaysAgo)->count()
            : 0;

        $oldVisits = DB::getSchemaBuilder()->hasTable('store_visits')
            ? DB::table('store_visits')->where('created_at', '<', $ninetyDaysAgo)->count()
            : 0;

        $oldAudits = DB::getSchemaBuilder()->hasTable('audit_log')
            ? DB::table('audit_log')->where('created_at', '<', $ninetyDaysAgo)->count()
            : 0;

        $stats = [
            ['key' => 'expired_verifications', 'rows' => $expiredVerifications],
            ['key' => 'old_notification_logs', 'rows' => $oldNotifications],
            ['key' => 'old_store_visits', 'rows' => $oldVisits],
            ['key' => 'old_audit_logs', 'rows' => $oldAudits],
        ];

        return response()->json(['data' => $stats]);
    }

    private function cleanupPurgeRpc($args)
    {
        $keys = $args['_keys'] ?? $args['keys'] ?? [];
        $now = Carbon::now();
        $ninetyDaysAgo = Carbon::now()->subDays(90);

        foreach ((array)$keys as $k) {
            if ($k === 'expired_verifications' && DB::getSchemaBuilder()->hasTable('verification_codes')) {
                DB::table('verification_codes')->where('expires_at', '<', $now)->delete();
            }
            if ($k === 'old_notification_logs' && DB::getSchemaBuilder()->hasTable('notification_logs')) {
                DB::table('notification_logs')->where('created_at', '<', $ninetyDaysAgo)->delete();
            }
            if ($k === 'old_store_visits' && DB::getSchemaBuilder()->hasTable('store_visits')) {
                DB::table('store_visits')->where('created_at', '<', $ninetyDaysAgo)->delete();
            }
            if ($k === 'old_audit_logs' && DB::getSchemaBuilder()->hasTable('audit_log')) {
                DB::table('audit_log')->where('created_at', '<', $ninetyDaysAgo)->delete();
            }
        }

        return $this->cleanupCountsRpc();
    }

    private function fallbackRpc($name, $args, $user)
    {
        return response()->json([
            'ok' => true,
            'rpc' => $name,
            'data' => null
        ]);
    }
}

