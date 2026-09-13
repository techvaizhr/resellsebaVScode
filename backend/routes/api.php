<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RpcController;
use App\Http\Controllers\CrudController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\BackupController;

// Universal RPC endpoint (used by bootstrap, dashboards, action triggers)
Route::post('/rpc/{name}', [RpcController::class, 'handle']);

// Dynamic CRUD endpoint (used by frontend query builder)
Route::post('/crud/{table}', [CrudController::class, 'handle']);

// File Upload endpoints
Route::post('/upload/image', [UploadController::class, 'uploadImage']);
Route::get('/upload/list', [UploadController::class, 'listImages']);
Route::post('/upload/delete', [UploadController::class, 'deleteImage']);

// Admin Backup & Restore endpoints
Route::prefix('admin/backup')->group(function () {
    Route::get('/list', [BackupController::class, 'listBackups']);
    Route::post('/create-db', [BackupController::class, 'createDbBackup']);
    Route::post('/create-files', [BackupController::class, 'createFilesBackup']);
    Route::get('/download/{filename}', [BackupController::class, 'downloadBackup']);
    Route::post('/restore-db', [BackupController::class, 'restoreDbBackup']);
    Route::post('/restore-files', [BackupController::class, 'restoreFilesBackup']);
    Route::post('/delete', [BackupController::class, 'deleteBackup']);
});

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/bootstrap', [AuthController::class, 'bootstrap']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update', [AuthController::class, 'updateUser'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/verify', [AuthController::class, 'verify']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Public Routes
Route::prefix('public')->group(function () {
    Route::get('/landing', [PublicController::class, 'landing']);
    Route::get('/store/{code?}', [PublicController::class, 'store']);
    Route::get('/catalog', [PublicController::class, 'catalog']);
    Route::get('/manifest', [PublicController::class, 'manifest']);
    Route::get('/sitemap/{code?}', [PublicController::class, 'sitemap']);
    Route::get('/robots', [PublicController::class, 'robots']);
    Route::get('/seo', [PublicController::class, 'seo']);
    Route::get('/product-feed', [PublicController::class, 'productFeed']);
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [RpcController::class, 'handle'])->defaults('name', 'admin_dashboard');
    });

    // Reseller Routes
    Route::prefix('reseller')->group(function () {
        Route::get('/dashboard', [RpcController::class, 'handle'])->defaults('name', 'reseller_dashboard');
    });

    // Supplier Routes
    Route::prefix('supplier')->group(function () {
        Route::get('/dashboard', [RpcController::class, 'handle'])->defaults('name', 'supplier_dashboard');
    });
});
