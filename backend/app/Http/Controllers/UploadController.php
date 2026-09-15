<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Handles categorized image uploads:
     * - products   : Product catalog & gallery images
     * - branding   : Platform logo, favicon, hero banners
     * - brands     : Brand logos
     * - categories : Category icons & images
     * - stores     : Reseller storefront banners & logos
     * - avatars    : User & Staff profile pictures
     * - notices    : Broadcast alert banners
     * - tutorials  : Tutorial thumbnails & banners
     */
    public function uploadImage(Request $request)
    {
        Cache::forget('media_library_scanned_index');
        Cache::forget('media_library_used_tokens');

        $bucket = $request->input('bucket', $request->input('folder', 'products'));

        $folder = match (strtolower($bucket)) {
            'product-images', 'products', 'master' => 'products',
            'branding', 'brand' => 'branding',
            'brands' => 'brands',
            'categories', 'category' => 'categories',
            'stores', 'store', 'reseller' => 'stores',
            'avatars', 'avatar', 'profiles' => 'avatars',
            'notices', 'notice' => 'notices',
            'tutorials' => 'tutorials',
            default => 'products',
        };

        // Partition high-volume media (products, uploads, stores) by Year and Month (e.g. products/2026/09)
        $dateSub = '';
        if (in_array($folder, ['products', 'uploads', 'stores'])) {
            $dateSub = '/' . date('Y') . '/' . date('m');
        }

        $subPath = $folder . $dateSub;
        $uploadDir = $this->getUploadBasePath($subPath);
        if (!File::isDirectory($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true, true);
        }

        $filename = '';
        $rawBytes = null;
        $extension = 'webp';

        // Check if uploaded as base64 string
        if ($request->has('base64')) {
            $base64Data = $request->input('base64');
            $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $base64Data);
            $rawBytes = base64_decode($base64Data);
        } else {
            $request->validate([
                'file' => 'required|file|max:10240', // Max 10MB
            ]);
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension()) ?: 'webp';
            $rawBytes = file_get_contents($file->getRealPath());
        }

        // Automatic WebP compression if GD library is available
        $saved = false;
        if (function_exists('imagecreatefromstring') && function_exists('imagewebp') && $rawBytes) {
            $gdImg = @imagecreatefromstring($rawBytes);
            if ($gdImg !== false) {
                imagepalettetotruecolor($gdImg);
                imagealphablending($gdImg, true);
                imagesavealpha($gdImg, true);
                $filename = Str::uuid() . '.webp';
                $destPath = $uploadDir . '/' . $filename;
                if (@imagewebp($gdImg, $destPath, 85)) {
                    $saved = true;
                }
                imagedestroy($gdImg);
            }
        }

        if (!$saved && $rawBytes) {
            $filename = Str::uuid() . '.' . $extension;
            File::put($uploadDir . '/' . $filename, $rawBytes);
        }

        $relativePath = 'uploads/' . $subPath . '/' . $filename;
        $url = '/' . $relativePath;

        return response()->json([
            'path' => $relativePath,
            'url' => $url,
            'fullPath' => $url,
            'filename' => $filename,
            'folder' => $folder,
            'size' => File::exists($uploadDir . '/' . $filename) ? File::size($uploadDir . '/' . $filename) : 0,
            'created_at' => now()->toIso8601String(),
        ]);
    }

    /**
     * Helper to get the canonical upload directory.
     */
    private function getUploadBasePath($subpath = '')
    {
        $rootPath = base_path('../public/uploads' . ($subpath ? '/' . ltrim($subpath, '/') : ''));
        if (File::isDirectory(base_path('../public'))) {
            return $rootPath;
        }
        return public_path('uploads' . ($subpath ? '/' . ltrim($subpath, '/') : ''));
    }

    /**
     * Lists uploaded media files with filtering, category breakdown, and unused detection.
     * Uses high-speed caching for ultra-responsive gallery rendering.
     */
    public function listImages(Request $request)
    {
        $folderFilter = $request->input('folder');
        $unusedOnly = filter_var($request->input('unused_only', false), FILTER_VALIDATE_BOOLEAN);
        $search = strtolower($request->input('search', ''));

        $cachedData = Cache::remember('media_library_scanned_index', 60, function () {
            $baseDir = $this->getUploadBasePath();
            if (!File::isDirectory($baseDir)) {
                File::makeDirectory($baseDir, 0755, true, true);
            }

            // Collect all active image references from DB to detect unused images
            $usedUrls = collect();
            try {
                if (DB::getSchemaBuilder()->hasTable('product_images')) {
                    $usedUrls = $usedUrls->concat(DB::table('product_images')->pluck('url'));
                }
                if (DB::getSchemaBuilder()->hasTable('products')) {
                    $usedUrls = $usedUrls->concat(DB::table('products')->whereNotNull('og_image_url')->pluck('og_image_url'));
                    $usedUrls = $usedUrls->concat(DB::table('products')->whereNotNull('main_image')->pluck('main_image'));
                    $usedUrls = $usedUrls->concat(DB::table('products')->whereNotNull('description')->pluck('description'));
                }
                if (DB::getSchemaBuilder()->hasTable('categories')) {
                    $usedUrls = $usedUrls->concat(DB::table('categories')->whereNotNull('image_url')->pluck('image_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('brands')) {
                    $usedUrls = $usedUrls->concat(DB::table('brands')->whereNotNull('logo_url')->pluck('logo_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('resellers')) {
                    $usedUrls = $usedUrls->concat(DB::table('resellers')->whereNotNull('avatar_url')->pluck('avatar_url'));
                    $usedUrls = $usedUrls->concat(DB::table('resellers')->whereNotNull('logo_url')->pluck('logo_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('reseller_settings')) {
                    $usedUrls = $usedUrls->concat(DB::table('reseller_settings')->pluck('value'));
                }
                if (DB::getSchemaBuilder()->hasTable('profiles')) {
                    $usedUrls = $usedUrls->concat(DB::table('profiles')->whereNotNull('avatar_url')->pluck('avatar_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('users')) {
                    $usedUrls = $usedUrls->concat(DB::table('users')->whereNotNull('avatar_url')->pluck('avatar_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('admin_notices')) {
                    $usedUrls = $usedUrls->concat(DB::table('admin_notices')->whereNotNull('image_url')->pluck('image_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('tutorials')) {
                    $usedUrls = $usedUrls->concat(DB::table('tutorials')->whereNotNull('thumbnail_url')->pluck('thumbnail_url'));
                }
                if (DB::getSchemaBuilder()->hasTable('global_settings')) {
                    $usedUrls = $usedUrls->concat(DB::table('global_settings')->pluck('value'));
                }
            } catch (\Exception $e) {
                // ignore db read errors
            }

            $usedTokens = [];
            foreach ($usedUrls as $val) {
                if (!is_string($val) || empty(trim($val))) continue;
                $s = trim($val);
                $usedTokens[strtolower(basename(parse_url($s, PHP_URL_PATH) ?? $s))] = true;
                $usedTokens[strtolower($s)] = true;

                if (preg_match_all('/\/uploads\/[a-zA-Z0-9_\-\.\/]+/i', $s, $matches)) {
                    foreach ($matches[0] as $m) {
                        $usedTokens[strtolower(basename($m))] = true;
                        $usedTokens[strtolower($m)] = true;
                    }
                }
            }

            $allFiles = [];
            $categories = ['products', 'branding', 'brands', 'categories', 'stores', 'avatars', 'notices', 'tutorials'];
            $folderCounts = [
                'all' => 0,
                'products' => 0,
                'branding' => 0,
                'brands' => 0,
                'categories' => 0,
                'stores' => 0,
                'avatars' => 0,
                'notices' => 0,
                'tutorials' => 0,
            ];
            $totalUnusedCount = 0;

            foreach ($categories as $cat) {
                $catDir = $baseDir . '/' . $cat;
                if (!File::isDirectory($catDir)) continue;

                $files = File::allFiles($catDir);
                foreach ($files as $file) {
                    $filename = $file->getFilename();
                    if ($filename === '.gitkeep') continue;

                    $folderCounts[$cat] = ($folderCounts[$cat] ?? 0) + 1;
                    $folderCounts['all']++;

                    $lowerName = strtolower($filename);
                    $subRelative = str_replace('\\', '/', $file->getRelativePathname());
                    $relUpload = 'uploads/' . $cat . '/' . $subRelative;
                    $slashUpload = '/' . $relUpload;

                    $isSystemAsset = in_array($cat, ['branding', 'brands', 'categories', 'stores', 'avatars', 'notices', 'tutorials']);
                    $isUsed = $isSystemAsset || isset($usedTokens[$lowerName]) || isset($usedTokens[strtolower($relUpload)]) || isset($usedTokens[strtolower($slashUpload)]);
                    if (!$isUsed) {
                        $totalUnusedCount++;
                    }

                    $url = asset($relUpload);

                    $allFiles[] = [
                        'filename' => $filename,
                        'path' => $slashUpload,
                        'url' => $url,
                        'folder' => $cat,
                        'size' => $file->getSize(),
                        'last_modified' => date('c', $file->getMTime()),
                        'is_used' => $isUsed,
                    ];
                }
            }

            usort($allFiles, fn($a, $b) => strcmp($b['last_modified'], $a['last_modified']));

            return [
                'all_files' => $allFiles,
                'folder_counts' => $folderCounts,
                'unused_count' => $totalUnusedCount,
                'total' => $folderCounts['all'],
            ];
        });

        $filtered = $cachedData['all_files'];
        if ($folderFilter && $folderFilter !== 'all') {
            $filtered = array_values(array_filter($filtered, fn($f) => $f['folder'] === $folderFilter));
        }
        if ($search) {
            $filtered = array_values(array_filter($filtered, fn($f) => str_contains(strtolower($f['filename']), $search)));
        }
        if ($unusedOnly) {
            $filtered = array_values(array_filter($filtered, fn($f) => !$f['is_used']));
        }

        return response()->json([
            'data' => $filtered,
            'total' => $cachedData['total'],
            'unused_count' => $cachedData['unused_count'],
            'folder_counts' => $cachedData['folder_counts'],
        ]);
    }

    /**
     * Deletes one or multiple images from uploads.
     */
    public function deleteImage(Request $request)
    {
        Cache::forget('media_library_scanned_index');
        Cache::forget('media_library_used_tokens');

        $paths = (array) $request->input('paths', $request->input('path', []));

        $deleted = [];
        foreach ($paths as $path) {
            $cleanPath = str_replace([url('/'), asset('')], '', $path);
            $cleanPath = ltrim($cleanPath, '/');

            $targetPath = base_path('../public/' . $cleanPath);
            if (!File::exists($targetPath)) {
                $targetPath = public_path($cleanPath);
            }
            if (File::exists($targetPath)) {
                File::delete($targetPath);
                $deleted[] = $path;
            }
        }

        return response()->json([
            'ok' => true,
            'deleted' => $deleted,
        ]);
    }
}
