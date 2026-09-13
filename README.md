# ResellSeba

Bangladesh's first-class reseller platform. Product listing, courier, payment, marketing — all in one panel.

## Tech Stack

- **Frontend**: React 19, TanStack Start/Router, Tailwind CSS 4, Radix UI
- **Backend**: Laravel 11 (API), MySQL, Laravel Sanctum
- **Build**: Vite 8, Bun
- **Charts**: Recharts
- **Rich Text**: Tiptap
- **PWA**: vite-plugin-pwa

## Project Structure

```
resellseba-main/
├── src/              # React frontend (TanStack Start)
├── backend/          # Laravel API backend
├── public/           # Static assets
└── ...
```

## Development

### Frontend

```sh
npm install
npm run dev
```

### Backend

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=ResellSeba
```

**Backend** (`backend/.env`):
See `backend/.env.example` for all required variables.

## Features

- **Super Admin Panel**: Full product, order, reseller, supplier management
- **Reseller Panel**: Product listing, store customization, order management
- **Supplier Panel**: Product management, order fulfillment, returns
- **Courier Integration**: Steadfast, CarryBee, Pathao
- **Payment Gateways**: bKash, Nagad, SSLCommerz, ePaySeba, and more
- **Custom Domains**: Cloudflare DNS integration
- **PWA Support**: Installable on mobile devices
