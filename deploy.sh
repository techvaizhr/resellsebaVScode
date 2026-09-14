#!/bin/bash
set -e

echo "🚀 Starting ResellSeba Automated Deployment..."

# 1. Pull latest changes from Git
echo "📥 Pulling latest code..."
git pull origin main

# Ensure .env files exist from templates
[ ! -f .env ] && cp .env.example .env && echo "Created root .env from template"
[ ! -f backend/.env ] && cp backend/.env.example backend/.env && echo "Created backend/.env from template"

# 2. Update Backend
if command -v php >/dev/null 2>&1; then
    echo "🐘 Updating Backend..."
    if [ -f backend/composer.json ] && command -v composer >/dev/null 2>&1; then
        cd backend
        composer install --no-dev --optimize-autoloader || true
        php artisan config:clear || true
        cd ..
    fi
fi

chmod -R 775 public/uploads backend/storage 2>/dev/null || true

# 3. Update Frontend (if npm is available)
if command -v npm >/dev/null 2>&1; then
    echo "⚛️ Building Frontend SPA..."
    npm install --production=false
    npm run build
fi

echo "✅ Deployment completed successfully!"
