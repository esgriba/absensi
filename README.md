# Sistem Absensi Siswa SMK dengan QR Code# Sistem Absensi Siswa SMK dengan QR Code



Aplikasi web untuk sistem absensi siswa SMK menggunakan teknologi QR Code. Dibangun dengan Next.js, Supabase, dan Shadcn UI.Aplikasi web untuk sistem absensi siswa SMK menggunakan teknologi QR Code. Dibangun dengan Next.js, Supabase, dan Shadcn UI.



## 🚀 Fitur## 🚀 Fitur



### Sistem Autentikasi (NEW! 🔥)- ✅ **Registrasi Siswa**: Form untuk mendaftarkan siswa baru dengan NIS, nama, dan kelas

- 🔐 **Multi-Role Login**: Admin, Petugas, dan Siswa/Wali Murid- 📱 **Generate QR Code**: Otomatis generate QR code unik untuk setiap siswa

- 👨‍💼 **Dashboard Admin**: Akses penuh untuk kelola semua data- � **Import Excel**: Upload data siswa dalam jumlah banyak menggunakan file Excel

- 👮 **Dashboard Petugas**: Khusus untuk scan QR code absensi- �📸 **Scan QR Code**: Scan QR code menggunakan kamera untuk mencatat absensi

- 👨‍🎓 **Dashboard Siswa**: Lihat data kehadiran pribadi- 📊 **Dashboard Absensi**: Lihat data absensi dengan filter tanggal, kelas, dan status

- 📋 **Daftar Siswa**: Kelola dan lihat semua siswa yang terdaftar

### Manajemen Siswa- 🎨 **UI Modern**: Menggunakan Shadcn UI untuk tampilan yang clean dan profesional

- ✅ **Registrasi Siswa**: Form untuk mendaftarkan siswa baru dengan NIS, nama, dan kelas

- 📱 **Generate QR Code**: Otomatis generate QR code unik untuk setiap siswa## 🛠️ Teknologi

- 📊 **Import Excel**: Upload data siswa dalam jumlah banyak menggunakan file Excel

- 📋 **Daftar Siswa**: Kelola dan lihat semua siswa yang terdaftar- **Next.js 15** - React framework dengan App Router

- **TypeScript** - Type safety

### Absensi- **Supabase** - Backend dan database PostgreSQL

- 📸 **Scan QR Code**: Scan QR code menggunakan kamera untuk mencatat absensi- **Shadcn UI** - Component library

- ⏰ **Deteksi Keterlambatan**: Otomatis tandai "Hadir" atau "Telat" berdasarkan jam scan- **Tailwind CSS** - Styling

- 🚫 **Prevent Duplicate**: Sistem mencegah scan ganda dalam waktu 3 detik- **React QR Code** - Generate QR code

- 📊 **Dashboard Absensi**: Lihat data absensi dengan filter tanggal, kelas, dan status- **html5-qrcode** - Scan QR code dari kamera



### User Management## 📋 Prasyarat

- 👥 **Kelola Users**: Tambah, edit, nonaktifkan akun pengguna

- 🎭 **Role Management**: Assign role admin, petugas, atau siswa- Node.js 18+ 

- 🔗 **Link Siswa**: Hubungkan akun siswa dengan data siswa- NPM atau Yarn

- Akun Supabase (gratis)

### UI/UX

- 🎨 **UI Modern**: Menggunakan Shadcn UI untuk tampilan yang clean dan profesional## 🔧 Setup Database Supabase

- 🎨 **Color-Coded Dashboards**: Setiap role punya warna tema berbeda

- 📱 **Responsive Design**: Tampilan optimal di desktop dan mobile1. Buat akun di [Supabase](https://supabase.com)

2. Buat project baru

## 🛠️ Teknologi3. Di SQL Editor, jalankan query dari file `supabase-schema.sql`

4. Ambil credentials:

- **Next.js 15** - React framework dengan App Router   - Project URL: Settings → API → Project URL

- **TypeScript** - Type safety   - Anon Key: Settings → API → Project API keys → `anon` `public`

- **Supabase** - Backend dan database PostgreSQL

- **Shadcn UI** - Component library## ⚙️ Instalasi & Konfigurasi

- **Tailwind CSS** - Styling

- **React QR Code** - Generate QR code1. Install dependencies:

- **html5-qrcode** - Scan QR code dari kamera```bash

- **bcryptjs** - Password hashing untuk keamanannpm install

- **xlsx** - Import/export Excel```



## 📋 Prasyarat2. Edit file `.env.local` dan isi dengan credentials Supabase Anda:

```env

- Node.js 18+ NEXT_PUBLIC_SUPABASE_URL=your-supabase-url

- NPM atau YarnNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

- Akun Supabase (gratis)```



## 🚀 Quick Start3. Jalankan development server:

```bash

### 1. Clone & Installnpm run dev

```bash```

git clone https://github.com/esgriba/absensi.git

cd absensi-esgriba4. Buka browser di `http://localhost:3000`

npm install

```## 📱 Cara Penggunaan



### 2. Setup Database### 1. Registrasi Siswa

Baca dokumentasi lengkap di:- Klik "Daftar Siswa" di halaman utama

- **[SETUP-SUPABASE.md](./SETUP-SUPABASE.md)** - Setup database siswa & absensi- Isi form dengan nama, NIS, dan kelas siswa

- **[SETUP-AUTH.md](./SETUP-AUTH.md)** - Setup sistem autentikasi- Klik "Daftar & Generate QR Code"

- QR Code akan otomatis di-generate dan bisa di-download/print

### 3. Konfigurasi Environment

Edit `.env.local`:### 2. Scan Absensi

```env- Klik "Mulai Scan" di halaman utama

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url- Izinkan akses kamera

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key- Arahkan kamera ke QR Code siswa

```- Sistem akan otomatis mencatat absensi:

  - **Hadir**: Jika scan sebelum jam 08:00

### 4. Jalankan Development  - **Telat**: Jika scan setelah jam 08:00

```bash

npm run dev### 3. Lihat Data Absensi

```- Klik "Lihat Data" di halaman utama

- Filter berdasarkan tanggal, kelas, atau status

Buka `http://localhost:3000`- Lihat statistik total absensi, hadir, dan telat



## 🔐 Login### 4. Kelola Siswa

- Klik "Lihat Daftar Siswa"

### Akun Demo- Lihat semua siswa terdaftar

```- Klik "Lihat QR Code" untuk melihat/download QR Code siswa

Admin:

Email: admin@esgriba.sch.id## 🗂️ Struktur Project

Password: password123

```

Petugas:absensi-esgriba/

Email: petugas@esgriba.sch.id├── src/

Password: password123│   ├── app/

```│   │   ├── attendance/        # Halaman data absensi

│   │   ├── register/          # Halaman registrasi siswa

**Note**: Ganti password setelah login pertama kali!│   │   ├── scan/              # Halaman scan QR code

│   │   ├── students/          # Halaman daftar siswa

## 📱 Cara Penggunaan│   │   │   └── [id]/          # Detail siswa & QR code

│   │   ├── layout.tsx         # Root layout

### Untuk Admin│   │   ├── page.tsx           # Homepage

│   │   └── globals.css        # Global styles

1. **Login** ke `/login` dengan akun admin│   ├── components/

2. **Dashboard Admin** - Akses penuh ke semua fitur:│   │   └── ui/                # Shadcn UI components

   - Kelola Siswa (tambah, edit, import Excel)│   └── lib/

   - Lihat Data Absensi│       ├── supabase.ts        # Supabase client & types

   - Kelola Users (tambah admin/petugas/siswa)│       └── utils.ts           # Utility functions

   - Scan QR Code├── .env.local                 # Environment variables (edit ini!)

   - Generate Laporan├── supabase-schema.sql        # Database schema

└── package.json

### Untuk Petugas```



1. **Login** dengan akun petugas## 🎨 Kustomisasi

2. **Dashboard Petugas** - Fokus pada absensi:

   - Scan QR Code siswa### Mengubah Jam Batas Keterlambatan

   - Lihat absensi hari iniEdit file `src/app/scan/page.tsx` pada line:

   - Lihat daftar siswa (read-only)```typescript

const status = hour < 8 ? "hadir" : "telat"; // Ubah 8 sesuai kebutuhan

### Untuk Siswa/Wali Murid```



1. **Login** dengan akun siswa### Menambah Kelas

2. **Dashboard Siswa** - Lihat data pribadi:Edit file `src/app/register/page.tsx` dan `src/app/attendance/page.tsx` pada bagian Select options.

   - QR Code untuk absensi

   - Statistik kehadiran## 🐛 Troubleshooting

   - Riwayat absensi 30 hari terakhir

**Kamera tidak bisa diakses:**

## 📖 Dokumentasi Lengkap- Pastikan browser mengizinkan akses kamera

- Gunakan HTTPS di production (localhost OK untuk development)

- 📘 **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Dokumentasi aplikasi lengkap

- 🔐 **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Sistem autentikasi & role-based access**QR Code tidak terdeteksi:**

- 🗄️ **[SETUP-SUPABASE.md](./SETUP-SUPABASE.md)** - Setup database Supabase- Pastikan QR Code terlihat jelas

- 🔑 **[SETUP-AUTH.md](./SETUP-AUTH.md)** - Setup sistem login- Gunakan pencahayaan yang cukup

- 🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy ke Vercel- Jarak ideal 20-30 cm dari kamera

- 📦 **[FEATURE-IMPORT-EXCEL.md](./FEATURE-IMPORT-EXCEL.md)** - Panduan import Excel

- ⏰ **[CONFIG-JAM-TELAT.md](./CONFIG-JAM-TELAT.md)** - Konfigurasi jam telat**Error koneksi Supabase:**

- 🐛 **[FIX-DUPLICATE-SCAN.md](./FIX-DUPLICATE-SCAN.md)** - Fix duplicate scan issue- Cek credentials di `.env.local`

- 📝 **[AUTH-CHANGELOG.md](./AUTH-CHANGELOG.md)** - Changelog sistem autentikasi- Pastikan tabel sudah dibuat di Supabase

- Cek RLS policies

## 🗂️ Struktur Project

## 📄 License

```

absensi-esgriba/MIT License

├── src/

│   ├── app/---

│   │   ├── admin/             # Dashboard & pages admin

│   │   │   ├── page.tsx       # Admin dashboardDibuat dengan ❤️ untuk pendidikan di Indonesia

│   │   │   └── users/         # User management
│   │   ├── petugas/           # Dashboard petugas
│   │   ├── siswa/             # Dashboard siswa
│   │   ├── login/             # Login page
│   │   ├── attendance/        # Halaman data absensi
│   │   ├── import/            # Import Excel
│   │   ├── register/          # Registrasi siswa
│   │   ├── scan/              # Scan QR code
│   │   └── students/          # Daftar siswa
│   ├── components/
│   │   └── ui/                # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx    # Global authentication state
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client & types
│   │   └── utils.ts           # Utility functions
│   └── middleware.ts          # Route protection
├── .env.local                 # Environment variables
├── supabase-schema.sql        # Database schema (siswa & absensi)
├── supabase-auth-schema.sql   # Database schema (users)
└── package.json
```

## ⚙️ Konfigurasi

### Ubah Jam Batas Keterlambatan
Default: **Telat setelah jam 07:00**

Edit di `src/app/scan/page.tsx`:
```typescript
const status = hour < 7 ? "hadir" : "telat"; // Ubah 7 sesuai kebutuhan
```

### Tambah Kelas Baru
Edit dropdown di:
- `src/app/register/page.tsx`
- `src/app/attendance/page.tsx`

### Ubah Cooldown Scan
Default: **3 detik**

Edit di `src/app/scan/page.tsx`:
```typescript
if (now - lastScanTimeRef.current < 3000) { // Ubah 3000 (ms)
```

## 🔒 Security Best Practices

1. **Ganti Password Default**
   - Login sebagai admin
   - Buka "Kelola Users"
   - Update password admin & petugas

2. **Backup Database Reguler**
   - Export data dari Supabase
   - Simpan di tempat aman

3. **Enable Row Level Security**
   - RLS sudah aktif di schema
   - Jangan disable untuk keamanan

4. **Production Security**
   - Gunakan HTTPS
   - Set secure cookie flags
   - Implement rate limiting

## 🐛 Troubleshooting

### Login Issues

**"Email atau password salah"**
- Check email di tabel users
- Pastikan is_active = true
- Verify password hash

### Camera Issues

**Kamera tidak bisa diakses:**
- Izinkan akses kamera di browser
- Gunakan HTTPS (required untuk camera access)

### QR Code Issues

**QR Code tidak terdeteksi:**
- Pastikan QR Code jelas
- Pencahayaan cukup
- Jarak 20-30 cm

### Database Issues

**Error koneksi Supabase:**
- Check `.env.local` credentials
- Verify tables sudah dibuat
- Check Supabase logs

## 🚀 Deployment

Deploy ke Vercel (gratis):

```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel --prod
```

Atau gunakan script:
```bash
./deploy.bat
```

Baca panduan lengkap: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🆕 What's New

### v2.0 - Authentication System (Latest)
- ✨ Multi-role authentication
- 🎭 Role-based dashboards
- 👥 User management
- 🔒 Route protection
- 📝 Complete documentation

### v1.3 - Excel Import
- 📦 Bulk upload students
- 📥 Template download
- ✅ Data validation

### v1.2 - Bug Fixes
- 🐛 Fixed duplicate scan
- ⏰ Updated late threshold (07:00)
- 🔧 ESLint/TypeScript fixes

## 🤝 Contributing

Contributions welcome! Silakan:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

## 💬 Support

Ada pertanyaan atau issue?
1. Check dokumentasi di folder docs
2. Buka [GitHub Issues](https://github.com/esgriba/absensi/issues)
3. Email: support@esgriba.sch.id

---

Dibuat dengan ❤️ untuk pendidikan di Indonesia
