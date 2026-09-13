#!/bin/bash
set -e

echo "🚀 Starting ResellSeba Automated Deployment..."

# 1. Pull latest changes from Git
echo "📥 Pulling latest code..."
git pull origin main

# 2. Update Backend
echo "🐘 Updating Laravel Backend..."
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R 775 storage bootstrap/cache public/uploads
cd ..

# 3. Update Frontend
echo "⚛️ Building Frontend SSR..."
npm install --production=false
npm run build

# 4. Restart Frontend via PM2
echo "🔄 Reloading PM2 Service..."
pm2 restart resellseba-frontend || pm2 start dist/server/server.js --name "resellseba-frontend"

echo "✅ Deployment completed successfully!"
