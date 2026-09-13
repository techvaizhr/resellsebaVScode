<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CrudController extends Controller
{
    public function handle(Request $request, $table)
    {
        $operation = $request->input('operation', 'select');
        $filters = $request->input('filters', []);
        $selectCols = $request->input('select', '*');
        $payload = $request->input('payload');
        $order = $request->input('order', []);
        $limit = $request->input('limit');
        $offset = $request->input('offset');
        $isSingle = $request->input('single', false);
        $isMaybeSingle = $request->input('maybeSingle', false);
        $onConflict = $request->input('onConflict');

        $blockedTables = [
            'personal_access_tokens', 'migrations', 'password_resets', 'password_reset_tokens'
        ];
        if (in_array($table, $blockedTables)) {
            return response()->json(['data' => null, 'error' => "Access denied to table $table"], 403);
        }

        if (!DB::getSchemaBuilder()->hasTable($table)) {
            return response()->json(['data' => null, 'error' => "Table $table does not exist"], 404);
        }

        $user = $request->user('sanctum') ?? $request->user();

        // Enforce authentication for write operations
        $isWriteOp = in_array($operation, ['insert', 'update', 'delete', 'upsert']);
        $publicWritable = ['store_visits', 'verification_codes'];
        if ($operation === 'insert' && in_array($table, ['orders', 'order_items'])) {
            // Guest checkout is allowed for new order creation
        } elseif ($isWriteOp && !in_array($table, $publicWritable) && !$user) {
            return response()->json(['data' => null, 'error' => "Unauthenticated. Please log in."], 401);
        }

        // Never expose password hash or remember tokens from users table
        if ($table === 'users' && $operation === 'select') {
            if ($selectCols === '*') {
                $cols = DB::getSchemaBuilder()->getColumnListing('users');
                $selectCols = implode(',', array_diff($cols, ['password', 'remember_token']));
            } else {
                $requestedCols = array_map('trim', explode(',', $selectCols));
                $selectCols = implode(',', array_diff($requestedCols, ['password', 'remember_token']));
            }
        }

        // Special handling for global_settings table (key-value structure)
        if ($table === 'global_settings') {
            return $this->handleGlobalSettings($operation, $selectCols, $payload, $isSingle, $isMaybeSingle);
        }

        $query = DB::table($table);

        // Apply filters
        foreach ($filters as $filter) {
            $col = $filter['column'] ?? null;
            $op = $filter['operator'] ?? 'eq';
            $val = $filter['value'] ?? null;

            if (!$col) continue;

            match ($op) {
                'eq' => $query->where($col, '=', $val),
                'neq' => $query->where($col, '!=', $val),
                'gt' => $query->where($col, '>', $val),
                'gte' => $query->where($col, '>=', $val),
                'lt' => $query->where($col, '<', $val),
                'lte' => $query->where($col, '<=', $val),
                'like' => $query->where($col, 'like', $val),
                'ilike' => $query->where($col, 'like', $val),
                'is' => is_null($val) ? $query->whereNull($col) : $query->where($col, '=', $val),
                'in' => $query->whereIn($col, (array) $val),
                default => $query->where($col, '=', $val),
            };
        }

        return match ($operation) {
            'select' => $this->handleSelect($query, $table, $selectCols, $order, $limit, $offset, $isSingle, $isMaybeSingle),
            'insert' => $this->handleInsert($table, $payload),
            'update' => $this->handleUpdate($query, $payload),
            'delete' => $this->handleDelete($query),
            'upsert' => $this->handleUpsert($table, $payload, $onConflict),
            default => response()->json(['error' => 'Invalid operation'], 400),
        };
    }

    private function handleSelect($query, $table, $selectCols, $order, $limit, $offset, $isSingle, $isMaybeSingle)
    {
        if ($selectCols && $selectCols !== '*') {
            $tableCols = DB::getSchemaBuilder()->getColumnListing($table);
            $requested = array_map('trim', explode(',', $selectCols));
            $validCols = [];
            foreach ($requested as $col) {
                // Ignore nested relation select syntax like "role_permissions (permission_id)"
                if (str_contains($col, '(') || str_contains($col, ':') || str_contains($col, ' ') || str_contains($col, "\n")) {
                    continue;
                }
                if ($col === '*' || in_array($col, $tableCols)) {
                    $validCols[] = $col;
                }
            }
            if (!empty($validCols) && !in_array('*', $validCols)) {
                $query->select($validCols);
            }
        }

        foreach ($order as $o) {
            if (!empty($o['column'])) {
                $query->orderBy($o['column'], ($o['ascending'] ?? true) ? 'asc' : 'desc');
            }
        }

        if ($limit) $query->limit($limit);
        if ($offset) $query->offset($offset);

        $attachRelations = function ($rows) use ($table) {
            if ($rows->isEmpty()) return $rows;

            if ($table === 'roles') {
                $roleIds = $rows->pluck('id')->filter()->toArray();
                if (!empty($roleIds) && DB::getSchemaBuilder()->hasTable('role_permissions')) {
                    $rp = DB::table('role_permissions')
                        ->whereIn('role_id', $roleIds)
                        ->select('role_id', 'permission_id')
                        ->get()
                        ->groupBy('role_id');
                    foreach ($rows as $row) {
                        $row->role_permissions = $rp[$row->id] ?? [];
                    }
                }
            }

            if ($table === 'user_roles') {
                $customRoleIds = $rows->pluck('custom_role_id')->filter()->toArray();
                if (!empty($customRoleIds) && DB::getSchemaBuilder()->hasTable('roles')) {
                    $rolesMap = DB::table('roles')->whereIn('id', $customRoleIds)->pluck('name', 'id')->toArray();
                    foreach ($rows as $row) {
                        $row->roles = !empty($row->custom_role_id) && isset($rolesMap[$row->custom_role_id])
                            ? ['name' => $rolesMap[$row->custom_role_id]]
                            : null;
                    }
                }
            }

            if ($table === 'resellers') {
                $agentIds = $rows->pluck('agent_id')->filter()->toArray();
                if (!empty($agentIds) && DB::getSchemaBuilder()->hasTable('agents')) {
                    $agents = DB::table('agents')->whereIn('id', $agentIds)->get()->keyBy('id');
                    foreach ($rows as $row) {
                        $row->agents = !empty($row->agent_id) && isset($agents[$row->agent_id])
                            ? ['display_name' => $agents[$row->agent_id]->display_name ?? $agents[$row->agent_id]->name ?? 'Agent']
                            : null;
                    }
                }
            }

            if ($table === 'deposit_requests') {
                $resellerIds = $rows->pluck('reseller_id')->filter()->toArray();
                if (!empty($resellerIds) && DB::getSchemaBuilder()->hasTable('resellers')) {
                    $resellers = DB::table('resellers')->whereIn('id', $resellerIds)->get()->keyBy('id');
                    foreach ($rows as $row) {
                        $row->resellers = !empty($row->reseller_id) && isset($resellers[$row->reseller_id])
                            ? [
                                'code' => $resellers[$row->reseller_id]->code,
                                'business_name' => $resellers[$row->reseller_id]->business_name,
                              ]
                            : null;
                    }
                }
            }

            return $rows;
        };

        if ($isSingle || $isMaybeSingle) {
            $row = $query->first();
            if ($row) {
                foreach ($row as $k => $v) {
                    if (is_string($v) && (str_starts_with($v, '{') || str_starts_with($v, '['))) {
                        $decoded = json_decode($v, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            $row->$k = $decoded;
                        }
                    }
                }
                $collection = collect([$row]);
                $attachRelations($collection);
                $row = $collection->first();
            }
            return response()->json(['data' => $row]);
        }

        $results = $query->get()->map(function ($row) {
            foreach ($row as $k => $v) {
                if (is_string($v) && (str_starts_with($v, '{') || str_starts_with($v, '['))) {
                    $decoded = json_decode($v, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $row->$k = $decoded;
                    }
                }
            }
            return $row;
        });

        $results = $attachRelations($results);

        return response()->json(['data' => $results, 'count' => count($results)]);
    }

    private function handleInsert($table, $payload)
    {
        if (empty($payload)) {
            return response()->json(['data' => null]);
        }

        $rows = isset($payload[0]) && is_array($payload[0]) ? $payload : [$payload];
        $inserted = [];

        foreach ($rows as $row) {
            if (empty($row['id'])) {
                $row['id'] = (string) Str::uuid();
            }
            if (!isset($row['created_at'])) $row['created_at'] = now();
            if (!isset($row['updated_at'])) $row['updated_at'] = now();

            // Encode JSON fields if needed
            foreach ($row as $k => $v) {
                if (is_array($v) || is_object($v)) {
                    $row[$k] = json_encode($v);
                }
            }

            DB::table($table)->insert($row);
            $inserted[] = $row;
        }

        return response()->json([
            'data' => count($inserted) === 1 ? $inserted[0] : $inserted
        ], 201);
    }

    private function handleUpdate($query, $payload)
    {
        if (empty($payload)) {
            return response()->json(['data' => null]);
        }

        if (!isset($payload['updated_at'])) {
            $payload['updated_at'] = now();
        }

        foreach ($payload as $k => $v) {
            if (is_array($v) || is_object($v)) {
                $payload[$k] = json_encode($v);
            }
        }

        $query->update($payload);
        return response()->json(['data' => $payload]);
    }

    private function handleDelete($query)
    {
        if (empty($query->wheres)) {
            return response()->json(['error' => 'Bulk deletion without filters is not allowed.'], 400);
        }
        $deleted = $query->delete();
        return response()->json(['data' => $deleted]);
    }

    private function handleUpsert($table, $payload, $onConflict = null)
    {
        if (empty($payload)) {
            return response()->json(['data' => null]);
        }

        $rows = isset($payload[0]) && is_array($payload[0]) ? $payload : [$payload];

        foreach ($rows as $row) {
            $conflictCol = $onConflict;
            if (!$conflictCol) {
                if ($table === 'reseller_settings' && !empty($row['reseller_id'])) {
                    $conflictCol = 'reseller_id';
                } elseif ($table === 'cloudflare_config') {
                    $conflictCol = 'id';
                } elseif (!empty($row['id'])) {
                    $conflictCol = 'id';
                }
            }

            $matchCriteria = [];
            if ($conflictCol && !empty($row[$conflictCol])) {
                $matchCriteria = [$conflictCol => $row[$conflictCol]];
            } elseif (!empty($row['id'])) {
                $matchCriteria = ['id' => $row['id']];
            } else {
                $row['id'] = (string) Str::uuid();
                $matchCriteria = ['id' => $row['id']];
            }

            if (empty($row['id'])) {
                $existing = DB::table($table)->where($matchCriteria)->first();
                $row['id'] = $existing ? $existing->id : (string) Str::uuid();
            }

            if (!isset($row['created_at'])) $row['created_at'] = now();
            if (!isset($row['updated_at'])) $row['updated_at'] = now();

            foreach ($row as $k => $v) {
                if (is_array($v) || is_object($v)) {
                    $row[$k] = json_encode($v);
                }
            }

            DB::table($table)->updateOrInsert($matchCriteria, $row);
        }

        return response()->json(['data' => $payload]);
    }

    private function handleGlobalSettings($operation, $selectCols, $payload, $isSingle, $isMaybeSingle)
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
            'logo_url' => null,
            'favicon_url' => null,
            'og_image_url' => null,
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
            $res = ($isSingle || $isMaybeSingle) ? $defaults : [$defaults];
            return response()->json(['data' => $res]);
        }

        $cols = DB::getSchemaBuilder()->getColumnListing('global_settings');
        $isKeyValue = in_array('key', $cols);

        if ($operation === 'select') {
            if ($isKeyValue) {
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

            if ($selectCols && $selectCols !== '*') {
                $requested = array_map('trim', explode(',', $selectCols));
                $filtered = [];
                foreach ($requested as $col) {
                    if (array_key_exists($col, $defaults)) {
                        $filtered[$col] = $defaults[$col];
                    }
                }
                if (!empty($filtered)) {
                    $defaults = $filtered;
                }
            }

            $res = ($isSingle || $isMaybeSingle) ? $defaults : [$defaults];
            return response()->json(['data' => $res]);
        }

        // Upsert / Update / Insert operations
        if (empty($payload)) {
            return response()->json(['data' => null]);
        }

        $row = isset($payload[0]) && is_array($payload[0]) ? $payload[0] : (array) $payload;

        if ($isKeyValue) {
            foreach ($row as $k => $v) {
                if ($k === 'id' || $k === 'created_at' || $k === 'updated_at') continue;
                $val = is_array($v) || is_object($v) ? json_encode($v) : $v;
                DB::table('global_settings')->updateOrInsert(
                    ['key' => $k],
                    [
                        'id' => (string) Str::uuid(),
                        'value' => $val,
                        'updated_at' => now(),
                    ]
                );
            }
        } else {
            $updateRow = [];
            foreach ($row as $k => $v) {
                if (in_array($k, $cols)) {
                    $updateRow[$k] = is_array($v) || is_object($v) ? json_encode($v) : $v;
                }
            }
            if (!empty($updateRow)) {
                $updateRow['updated_at'] = now();
                DB::table('global_settings')->updateOrInsert(['id' => 1], $updateRow);
            }
        }

        return response()->json(['data' => $payload]);
    }
}
