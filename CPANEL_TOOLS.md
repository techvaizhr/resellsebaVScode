# ResellSeba cPanel Maintenance & Deployment Quick Links

ResellSeba is now a **Pure Static Single Page Application (SPA) + Laravel API**.
**Node.js and Phusion Passenger are completely disabled on cPanel!**
Everything runs natively on standard **Apache + PHP 8.3 + MySQL**.

---

## ⚡ 1-Click Master Fix & Update
Runs Git Pull, runs database migrations, seeds categories/products/admin, and clears cache:
> 👉 **https://petzavo.com/api/setup_vendor.php?action=fix_all**

---

## 🛠️ Individual 1-Click Operations

| Operation | Direct URL |
| :--- | :--- |
| **🗄️ Run Migrations & Seed Demo Data** | `https://petzavo.com/api/setup_vendor.php?action=migrate_seed` |
| **📥 Pull Latest Code from GitHub** | `https://petzavo.com/api/setup_vendor.php?action=git_pull` |
| **📦 Run Composer Install / Update** | `https://petzavo.com/api/setup_vendor.php?action=composer` |
| **🧪 Test API & Database Status** | `https://petzavo.com/api/test` |
| **🏠 Main Website** | `https://petzavo.com/` |
| **🔐 Admin Login** | `https://petzavo.com/login` |

---

## 👤 Default Super Admin Credentials

- **Email:** `admin@resellseba.com`
- **Password:** `password`

---

## 🛑 How to Turn Off Node.js in cPanel (No Longer Needed!)

1. Go to cPanel -> **"Setup Node.js App"**.
2. Find the application for `petzavo.com` (if running) and click **Delete** or **Stop**.
3. That's it! Apache will now serve the static `dist/index.html` and PHP API directly without any Node server running.
