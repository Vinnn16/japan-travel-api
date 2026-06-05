#  Japan Travel — Backend API

![Azure](https://img.shields.io/badge/Microsoft_Azure-0089D6?style=flat&logo=microsoft-azure&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat&logo=mysql&logoColor=white)

REST API backend untuk website Japan Travel, dibangun dengan Node.js/Express.js dan terhubung ke Azure Database for MySQL. Di-deploy ke Microsoft Azure App Service.

##  Base URL

```
https://japan-travel-api.azurewebsites.net
```

## 📡 API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/` | Health check — status API | ❌ |
| POST | `/api/contact` | Kirim pesan kontak | ❌ |
| GET | `/api/contact` | Ambil semua pesan | ❌ |
| POST | `/api/reviews` | Kirim ulasan baru | ❌ |
| GET | `/api/reviews` | Ambil semua ulasan | ❌ |

##  Request & Response

### POST /api/contact
```json
// Request Body
{
  "firstName": "Budi",
  "lastName": "Santoso",
  "email": "budi@email.com",
  "phone": "+62812345678",
  "topic": "Paket wisata",
  "message": "Saya ingin tahu tentang paket wisata Tokyo"
}

// Response 201
{
  "success": true,
  "message": "Pesan berhasil dikirim!"
}
```

### POST /api/reviews
```json
// Request Body
{
  "name": "Andi Saputra",
  "origin": "Jakarta, Indonesia",
  "destination": "Tokyo",
  "rating": 5,
  "comment": "Perjalanan yang luar biasa!"
}

// Response 201
{
  "success": true,
  "message": "Review berhasil dikirim!"
}
```

##  Skema Database

**Tabel: contact_messages**
```sql
CREATE TABLE contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(20),
  topic       VARCHAR(100),
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabel: customer_reviews**
```sql
CREATE TABLE customer_reviews (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  origin      VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##  Cara Menjalankan Lokal

```bash
# Clone repository
git clone https://github.com/Vinnn16/japan-travel-api.git
cd japan-travel-api

# Install dependencies
npm install

# Salin dan isi environment variables
cp .env.example .env

# Jalankan development server
node server.js
```

##  Teknologi

- **Runtime:** Node.js 22 LTS
- **Framework:** Express.js 4.x
- **Database Driver:** mysql2 (dengan connection pool)
- **Security:** CORS, SSL/TLS untuk koneksi database
- **Config:** dotenv

##  Struktur File

```
japan-travel-api/
├── server.js         # Entry point — routes & database initialization
├── package.json      # Dependencies
├── .env.example      # Template environment variables
├── .gitignore        # File yang tidak di-commit
└── README.md         # Dokumentasi ini
```

##  Deployment ke Azure

```bash
# Login Azure CLI
az login

# Push ke GitHub (auto-deploy via source control)
git add .
git commit -m "update: deskripsi perubahan"
git push origin main

# Sync ke Azure App Service
az webapp deployment source sync \
  --name "japan-travel-api" \
  --resource-group "japan-travel-rg"
```

##  Anggota Kelompok

| Nama | NIM | Peran |
|------|-----|-------|
| Elgi Juldrievin | 213030503170 | Cloud Architect & DevOps Engineer |
| Melisa | - | Backend Developer |
| Yedija | - | Frontend Developer |
| Okta | - | Security Engineer |

**Dosen Pengampu:** Geges Septiawan  
**Program Studi:** Teknik Informatika — Universitas Palangka Raya  
**Tahun:** 2026
