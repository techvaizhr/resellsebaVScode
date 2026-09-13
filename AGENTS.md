# ResellSeba Agent Instructions

This is a reseller platform project with a React frontend (TanStack Start) and Laravel API backend.

## Architecture

- Frontend: `src/` — React 19 + TanStack Start + Tailwind CSS 4
- Backend: `backend/` — Laravel 11 API with Sanctum auth
- Database: MySQL with UUID primary keys

## Key Conventions

- All API calls from frontend go through `src/lib/api-client.ts`
- Auth is managed via Laravel Sanctum tokens stored in localStorage
- No Supabase, no Lovable dependencies
- All backend logic lives in Laravel controllers and services
