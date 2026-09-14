<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'super_admin' => 'Super Admin',
            'reseller' => 'Reseller',
            'leader' => 'Leader',
            'staff' => 'Staff',
            'supplier' => 'Supplier'
        ];

        $rolesIds = [];
        foreach ($roles as $key => $displayName) {
            $existing = DB::table('roles')->where('name', $key)->first();
            if ($existing) {
                $rolesIds[$key] = $existing->id;
            } else {
                $rolesIds[$key] = (string) Str::uuid();
                DB::table('roles')->insert([
                    'id' => $rolesIds[$key],
                    'name' => $key,
                    'display_name' => $displayName,
                    'is_system' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $modules = ['orders', 'products', 'resellers', 'suppliers', 'staff', 'settings', 'reports', 'couriers', 'payments', 'agents', 'catalog', 'notifications'];
        $actions = ['view', 'create', 'edit', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $keyName = "{$module}.{$action}";
                $perm = DB::table('permissions')->where('key', $keyName)->first();
                if (!$perm) {
                    $permissionId = (string) Str::uuid();
                    DB::table('permissions')->insert([
                        'id' => $permissionId,
                        'key' => $keyName,
                        'label' => ucfirst($action) . ' ' . ucfirst($module),
                        'group_name' => $module,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    $permissionId = $perm->id;
                }

                if (isset($rolesIds['super_admin'])) {
                    $rp = DB::table('role_permissions')
                        ->where('role_id', $rolesIds['super_admin'])
                        ->where('permission_id', $permissionId)
                        ->first();
                    if (!$rp) {
                        DB::table('role_permissions')->insert([
                            'id' => (string) Str::uuid(),
                            'role_id' => $rolesIds['super_admin'],
                            'permission_id' => $permissionId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
