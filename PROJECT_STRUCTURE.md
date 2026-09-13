# ResellSeba — Project Architecture & File Organization Guide 📁

এই ডকুমেন্টে প্রজেক্টের সকল ফাইল, ফোল্ডার এবং ইমেজ অ্যাসেটের সহজ গঠন বিস্তারিতভাবে দেওয়া হলো যাতে যে কেউ সহজে বুঝতে পারে।

---

## 🖼️ ইমেজ ও মিডিয়া অ্যাসেট কোথায় থাকবে? (Image Asset Directory)

সমস্ত ছবি ও মিডিয়া ফাইল ক্যাটাগরি অনুযায়ী **`uploads/`** ফোল্ডারে সুসজ্জিতভাবে থাকবে:

```text
public/uploads/  (এবং  backend/public/uploads/)
│
├── 📦 products/      👉 সকল প্রোডাক্টের মূল ছবি এবং গ্যালারি ছবি
├── 🏷️ branding/      👉 প্ল্যাটফর্মের মূল লোগো (Logo), ফেভিকন (Favicon) ও সাইট ব্যানার
├── 🏪 stores/        👉 রিসেলারদের নিজস্ব দোকানের লোগো, থিম ব্যানার ও কাভার ফটো
├── 👤 avatars/       👉 ইউজার, অ্যাডমিন, সাপ্লায়ার ও স্টাফদের প্রোফাইল ছবি
├── 📢 notices/       👉 অ্যাডমিন নোটিশ ও ব্রডকাস্ট এলার্ট ব্যানার
└── 🎓 tutorials/     👉 ভিডিও টিউটোরিয়াল থাম্বনেইল ও গাইড ইমেজ
```

> 💡 **টিপস**: আপনি যখনই নতুন কোনো প্রোডাক্ট বা সাইটের লোগো যুক্ত করবেন, তা স্বয়ংক্রিয়ভাবে তার নির্দিষ্ট ফোল্ডারে চলে যাবে। ম্যানুয়ালি ছবি দিতে চাইলে উপরের ফোল্ডারে রেখে সরাসরি লিঙ্কে ব্যবহার করতে পারবেন।

---

## 🏗️ মূল প্রজেক্ট ডিরেক্টরি ম্যাপ (Project Root Structure)

```text
resellseba/
│
├── 📁 backend/                👉 সম্পূর্ণ Laravel 11/12 API ব্যাকএন্ড (PHP 8.2+)
│   ├── 📁 app/
│   │   ├── 📁 Enums/          👉 অর্ডার স্ট্যাটাস, পেমেন্ট ও রোল এনাম্স (9টি Enums)
│   │   ├── 📁 Http/
│   │   │   ├── 📁 Controllers/ 👉 Auth, RPC, CRUD, Upload, Public কন্ট্রোলার
│   │   │   └── 📁 Middleware/  👉 Role & Permission সিকিউরিটি মিডলওয়্যার
│   │   └── 📁 Models/         👉 ৫১টি Eloquent ডাটাবেজ মডেল (HasUuids সহ)
│   ├── 📁 database/
│   │   ├── 📁 migrations/     👉 ৫১টি টেবিলের পূর্ণাঙ্গ MySQL মাইগ্রেশন ফাইল
│   │   └── 📁 seeders/        👉 সুপার অ্যাডমিন, রোল ও পারমিশন সিডার
│   ├── 📁 routes/
│   │   └── 📄 api.php         👉 সমস্ত সুরক্ষিত ও পাবলিক API রাউটিং
│   └── 📄 composer.json       👉 লারাভেল ফ্রেমওয়ার্ক ডিপেন্ডেন্সি কনফিগারেশন
│
├── 📁 src/                    👉 সম্পূর্ণ React 19 + Vite ফ্রন্টএন্ড ওয়েব অ্যাপ
│   ├── 📁 components/         👉 রি-ইউজেবল UI কম্পোনেন্টস (AppShell, Button, Header, ইত্যাদি)
│   ├── 📁 lib/                👉 কোর লজিক ও এপিআই ক্লায়েন্ট (api-client.ts, use-auth.ts)
│   ├── 📁 routes/             👉 সকল পেজ ও স্ক্রিনসমূহ:
│   │   ├── 📄 index.tsx       👉 মূল ল্যান্ডিং পেজ (Homepage)
│   │   ├── 📄 login.tsx       👉 সাইন-ইন ও সাইন-আপ পেজ
│   │   └── 📁 _authenticated/
│   │       ├── 📁 admin/      👉 সুপার অ্যাডমিন ও স্টাফ প্যানেলের সকল পেজ
│   │       ├── 📁 reseller/   👉 রিসেলার স্টোর, ক্যাটালগ ও ড্যাশবোর্ড পেজ
│   │       └── 📁 supplier/   👉 সাপ্লায়ার প্রোডাক্ট, অর্ডার ও রিটার্ন পেজ
│   ├── 📁 types/              👉 টাইপস্ক্রিপ্ট ডাটা টাইপ ও ইন্টারফেস
│   └── 📄 styles.css          👉 আল্ট্রা-ফাস্ট গ্লোবাল সিএসএস, কালার ও অ্যানিমেশন
│
├── 📁 public/                 👉 স্ট্যাটিক ফাইল ও আইকন (uploads/, favicon, manifest)
├── 📄 database.sql            👉 ১-ক্লিকে MySQL ডাটাবেজ ইমপোর্ট করার মূল ফাইল
├── 📄 run-app.bat             👉 পিসিতে ১-ক্লিকে অ্যাপ চালু করার উইন্ডোজ স্ক্রিপ্ট
├── 📄 vite.config.ts          👉 পিওর Vite + React + Tailwind 4 বিল্ড কনফিগারেশন
├── 📄 package.json            👉 নোড প্যাকেজসমূহ ও ফ্রন্টএন্ড স্ক্রিপ্ট
└── 📄 README.md               👉 প্রজেক্ট ওভারভিউ ও ইনস্টলেশন গাইড
```

---

## ⚡ দ্রুত শুরু করার কমান্ডসমূহ (Quick Commands)

### ১. লোকাল পিসিতে এক ক্লিকে চালানো:
- সরাসরি **`run-app.bat`** ফাইলে ডাবল ক্লিক করুন।

### ২. হোস্টিং বা সার্ভারে ডেপ্লয় করা (Production Deployment):
- **Database**: সার্ভার MySQL বা phpMyAdmin এ গিয়ে রুট ফোল্ডারের **`database.sql`** ইমপোর্ট করুন।
- **Backend (Laravel API)**: 
  1. `backend/` ফোল্ডার সার্ভারে আপলোড করুন।
  2. `cp .env.example .env` করে ডাটাবেজ, `APP_ENV=production`, `APP_DEBUG=false`, এবং ডোমেইন URL কনফিগার করুন।
  3. `composer install --no-dev --optimize-autoloader`
  4. `php artisan key:generate`
  5. `chmod -R 775 storage bootstrap/cache public/uploads`
- **Frontend (SSR Node.js App)**:
  1. `.env` ফাইলে `VITE_API_URL` লাইভ ডোমেইনের API URL হিসেবে সেট করুন।
  2. সার্ভারে `npm run build` দিন।
  3. PM2 দিয়ে ফ্রন্টএন্ড সার্বক্ষণিক চালু রাখুন:
     ```bash
     pm2 start dist/server/server.js --name "resellseba-frontend"
     ```
  4. Nginx এ রিভার্স প্রক্সি কনফিগার করে ডোমেইনের ট্রাফিক ফ্রন্টএন্ড এবং `/api` ট্রাফিক ব্যাকএন্ডে (PHP-FPM) ফরোয়ার্ড করুন।

---

### 🔑 ডিফল্ট সুপার অ্যাডমিন লগইন:
- **Email**: `admin@resellseba.com`
- **Password**: `password123`

