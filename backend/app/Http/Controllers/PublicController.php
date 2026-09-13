<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Reseller;
use App\Models\GlobalSetting;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function landing(Request $request)
    {
        $products = Product::where('is_active', true)
            ->with(['images', 'brand', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        $settings = GlobalSetting::pluck('value', 'key')->toArray();

        return response()->json([
            'settings' => $settings,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function catalog(Request $request)
    {
        $query = Product::where('is_active', true)->with(['images', 'brand', 'category']);

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('brand')) {
            $query->where('brand_id', $request->brand);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->paginate(24);
        return response()->json($products);
    }

    public function store(Request $request, $code = null)
    {
        $storeCode = $code ?? $request->input('code');
        $reseller = Reseller::where('code', $storeCode)
            ->with(['settings', 'listings.product.images'])
            ->first();

        if (!$reseller) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        return response()->json($reseller);
    }

    public function manifest()
    {
        $settings = GlobalSetting::pluck('value', 'key')->toArray();
        $siteName = $settings['site_name'] ?? 'ResellSeba';
        $favicon = $settings['favicon_url'] ?? '/favicon.ico';
        $iconType = str_ends_with(strtolower($favicon), '.ico') ? 'image/x-icon' : 'image/png';

        return response()->json([
            'short_name' => $siteName,
            'name' => $siteName . ' - Reseller Platform',
            'description' => 'Bangladesh premier reseller platform.',
            'icons' => [
                [
                    'src' => $favicon,
                    'type' => $iconType,
                    'sizes' => '192x192',
                    'purpose' => 'any',
                ],
                [
                    'src' => $favicon,
                    'type' => $iconType,
                    'sizes' => '512x512',
                    'purpose' => 'any',
                ],
                [
                    'src' => $favicon,
                    'type' => $iconType,
                    'sizes' => '512x512',
                    'purpose' => 'maskable',
                ],
                [
                    'src' => '/icon-192.png',
                    'type' => 'image/png',
                    'sizes' => '192x192',
                    'purpose' => 'any',
                ],
                [
                    'src' => '/icon-512.png',
                    'type' => 'image/png',
                    'sizes' => '512x512',
                    'purpose' => 'any',
                ],
            ],
            'start_url' => '/',
            'scope' => '/',
            'background_color' => '#ffffff',
            'theme_color' => '#4f46e5',
            'display' => 'standalone',
        ]);
    }

    public function robots()
    {
        return response("User-agent: *\nAllow: /\n", 200, ['Content-Type' => 'text/plain']);
    }

    public function sitemap(Request $request, $code = null)
    {
        return response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', 200, ['Content-Type' => 'application/xml']);
    }

    public function seo(Request $request)
    {
        $settings = GlobalSetting::pluck('value', 'key')->toArray();
        return response()->json($settings['seo'] ?? []);
    }

    public function productFeed()
    {
        $products = Product::where('is_active', true)->with(['images', 'brand', 'category'])->get();
        return response()->json($products);
    }
}

