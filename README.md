# Task-Todo App

Aplikasi manajemen task berbasis web dengan autentikasi JWT, CRUD user/jabatan/tugas, dan audit log.

## Fitur

- Login & register
- Manajemen **Task** (todo, tanggal mulai/selesai, assign user)
- Manajemen **User** (dengan konfirmasi password)
- Manajemen **Position** (jabatan)
- Assign **User Position** (user ke jabatan)
- Audit log request ke MongoDB
- Notifikasi sukses/error via Sonner toast

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, shadcn/ui, TanStack Table, Axios, Sonner |
| Backend | Go 1.26, Fiber v3, GORM, JWT, bcrypt |
| Database | PostgreSQL (data utama), MongoDB (audit log) |
| DevOps | Docker, Docker Compose, Nginx |

## Struktur Project

```
.
├── backend/                 # API Go (Fiber)
│   ├── cmd/api/main.go      # Entry point
│   ├── internal/
│   │   ├── config/          # Koneksi PostgreSQL & MongoDB
│   │   ├── handlers/        # HTTP handlers
│   │   ├── middleware/      # Auth & audit log
│   │   ├── models/          # Model database
│   │   ├── repository/      # Akses database
│   │   └── service/         # Business logic
│   ├── Dockerfile
│   └── .env.example
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api/             # Konfigurasi Axios
│   │   ├── components/      # UI components
│   │   └── pages/           # Halaman aplikasi
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── .env.example             # Env untuk Docker Compose
```

---

## Prasyarat

### Untuk development lokal

- [Go](https://go.dev/dl/) 1.26+
- [Node.js](https://nodejs.org/) 20+ & npm
- [PostgreSQL](https://www.postgresql.org/) 16+
- [MongoDB](https://www.mongodb.com/try/download/community) 7+ (opsional, untuk audit log)

### Untuk Docker

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) atau Docker Engine + Docker Compose

---

## Port Mapping

Port Docker **sengaja berbeda** dari local agar keduanya bisa jalan bersamaan.

| Service | Local | Docker |
|---------|-------|--------|
| Frontend | `5173` | `8080` |
| Backend API | `3000` | `3100` |
| PostgreSQL | `5432` | `5433` |
| MongoDB | `27017` | `27018` |

---

## Instalasi — Local Development

### 1. Clone repository

```bash
git clone <url-repository>
cd case-test
```

### 2. Setup PostgreSQL

Buat database di PostgreSQL:

```sql
CREATE DATABASE taskdb;
```

### 3. Setup Backend

```bash
cd backend
copy .env.example .env   # Windows
# cp .env.example .env   # Linux / macOS
```

Edit `backend/.env` sesuai konfigurasi PostgreSQL & MongoDB kamu:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=taskdb
DB_PORT=5432
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=task_logs
```

Install dependency & jalankan:

```bash
go mod download
go run ./cmd/api
```

Backend berjalan di **http://localhost:3000**

> **Hot reload (opsional):** Jika sudah install [Air](https://github.com/air-verse/air), jalankan `air` di folder `backend/`.

Verifikasi:

```bash
curl http://localhost:3000/ping
# Output: pong
```

### 4. Setup Frontend

Buka terminal baru:

```bash
cd frontend
copy .env.example .env.local   # Windows
# cp .env.example .env.local     # Linux / macOS
npm install
npm run dev
```

Frontend berjalan di **http://localhost:5173**

Isi `frontend/.env.local`:

```env
VITE_API_URL=http://127.0.0.1:3000
```

### 5. Akses aplikasi

1. Buka http://localhost:5173
2. Daftar akun baru via **Register**, atau login jika sudah punya akun
3. Mulai kelola task, user, dan jabatan

---

## Instalasi — Docker

Cara tercepat menjalankan seluruh stack tanpa install Go, Node, PostgreSQL, atau MongoDB di mesin lokal.

### 1. Siapkan environment

Di root project:

```bash
copy .env.example .env   # Windows
# cp .env.example .env     # Linux / macOS
```

Isi default `.env.example`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskdb
DB_PORT=5433
MONGO_PORT=27018
BACKEND_PORT=3100
FRONTEND_PORT=8080
MONGO_DB_NAME=task_logs
VITE_API_URL=http://localhost:3100
```

### 2. Build & jalankan

```bash
docker compose up -d --build
```

Docker akan:
1. Pull image PostgreSQL & MongoDB
2. Build image backend (Go) & frontend (React + Nginx)
3. Menjalankan semua service
4. Auto-migrate tabel database saat backend start

### 3. Cek status

```bash
docker compose ps
```

Semua service harus berstatus **Up** / **healthy**.

### 4. Akses aplikasi

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3100 |
| Health check | http://localhost:3100/ping |

### 5. Perintah Docker yang berguna

```bash
# Lihat log semua service
docker compose logs -f

# Log service tertentu
docker compose logs -f backend
docker compose logs -f frontend

# Stop semua container
docker compose down

# Stop + hapus data database
docker compose down -v

# Rebuild setelah perubahan kode
docker compose up -d --build
```

> **Catatan:** Jika mengubah `VITE_API_URL`, frontend perlu di-rebuild karena variabel ini di-inject saat build time:
> ```bash
> docker compose up -d --build frontend
> ```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `PORT` | Port API server | `3000` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_USER` | Username PostgreSQL | `postgres` |
| `DB_PASSWORD` | Password PostgreSQL | — |
| `DB_NAME` | Nama database | `taskdb` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `MONGO_URI` | Connection string MongoDB | `mongodb://localhost:27017` |
| `MONGO_DB_NAME` | Nama database MongoDB | `task_logs` |

### Frontend (`frontend/.env.local`)

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL backend API | `http://127.0.0.1:3000` |

### Docker Compose (`.env` di root)

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `DB_USER` | Username PostgreSQL | `postgres` |
| `DB_PASSWORD` | Password PostgreSQL | `postgres` |
| `DB_NAME` | Nama database | `taskdb` |
| `DB_PORT` | Port PostgreSQL (host) | `5433` |
| `MONGO_PORT` | Port MongoDB (host) | `27018` |
| `BACKEND_PORT` | Port backend (host) | `3100` |
| `FRONTEND_PORT` | Port frontend (host) | `8080` |
| `VITE_API_URL` | URL API untuk build frontend | `http://localhost:3100` |
| `MONGO_DB_NAME` | Nama database MongoDB | `task_logs` |

---

## API Endpoints

### Public

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/login` | Login user |
| `POST` | `/register` | Registrasi user baru |
| `GET` | `/ping` | Health check |

### Protected (butuh header `Authorization: Bearer <token>`)

| Resource | Endpoint |
|----------|----------|
| Tasks | `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/:uuid` |
| Positions | `GET/POST /api/positions`, `GET/PUT/DELETE /api/positions/:uuid` |
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:uuid` |
| User Positions | `GET/POST /api/user-positions`, `GET/PUT/DELETE /api/user-positions/:uuid` |

---

## Troubleshooting

### Backend gagal connect ke PostgreSQL (local)

- Pastikan PostgreSQL service sudah running
- Cek `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` di `backend/.env`
- Pastikan database `taskdb` sudah dibuat

### Backend gagal connect ke MongoDB (local)

- MongoDB bersifat opsional — backend tetap jalan, hanya audit log yang tidak aktif
- Pastikan MongoDB service running di port `27017`

### Port sudah dipakai

**Local:** Stop service yang bentrok, atau ubah port di `.env`

**Docker:** Ubah port di `.env` root, contoh:
```env
BACKEND_PORT=3101
FRONTEND_PORT=8081
```

### Frontend tidak bisa hit API (Docker)

- Pastikan `VITE_API_URL` mengarah ke port backend Docker (`http://localhost:3100`)
- Rebuild frontend setelah mengubah env: `docker compose up -d --build frontend`

### Login gagal setelah migrasi ke Docker

- Database Docker terpisah dari database local
- Daftar ulang via halaman Register di http://localhost:8080

### Reset database Docker

```bash
docker compose down -v
docker compose up -d --build
```

---

## Scripts Frontend

```bash
npm run dev       # Development server (port 5173)
npm run build     # Build production
npm run preview   # Preview build production
npm run lint      # ESLint
```

## Scripts Backend

```bash
go run ./cmd/api          # Jalankan server
go build -o api ./cmd/api   # Build binary
air                       # Hot reload (perlu install Air)
```

---

## Lisensi

Project ini dibuat untuk keperluan development dan testing.
