# ResellSeba cPanel Maintenance & Deployment Quick Links

Whenever you need to update code, seed database, or restart the server on cPanel, you can use these **1-Click Web Links** directly from your browser.

---

## ⚡ 1-Click Master Fix & Update
Runs Git Pull, runs database migrations, seeds categories/products/admin, clears cache, and restarts Node.js:
> 👉 **https://petzavo.com/api/setup_vendor.php?action=fix_all**

---

## 🛠️ Individual 1-Click Operations

| Operation | Direct URL |
| :--- | :--- |
| **🗄️ Run Migrations & Seed Demo Data** | `https://petzavo.com/api/setup_vendor.php?action=migrate_seed` |
| **📥 Pull Latest Code from GitHub** | `https://petzavo.com/api/setup_vendor.php?action=git_pull` |
| **🔄 Restart Node.js Server (Passenger)** | `https://petzavo.com/api/setup_vendor.php?action=restart_node` |
| **📦 Run Composer Install / Update** | `https://petzavo.com/api/setup_vendor.php?action=composer` |
| **🧪 Test API & Database Status** | `https://petzavo.com/api/test` |
| **🏠 Main Website** | `https://petzavo.com/` |
| **🔐 Admin Login** | `https://petzavo.com/login` |

---

## 👤 Default Super Admin Credentials

- **Email:** `admin@resellseba.com`
- **Password:** `password`

---

## 📁 Where to Find These Links in Code

1. Root Documentation: `CPANEL_TOOLS.md`
2. Backend Environment: `backend/.env` (lines 1-20)
3. Backend Environment Example: `backend/.env.example` (lines 1-20)
