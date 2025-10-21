# Sistem Absensi Siswa SMK dengan QR Code

Aplikasi web untuk sistem absensi siswa SMK menggunakan teknologi QR Code. Dibangun dengan Next.js, Supabase, dan Shadcn UI.

## 🚀 Fitur

- ✅ **Registrasi Siswa**: Form untuk mendaftarkan siswa baru dengan NIS, nama, dan kelas
- 📱 **Generate QR Code**: Otomatis generate QR code unik untuk setiap siswa
- 📸 **Scan QR Code**: Scan QR code menggunakan kamera untuk mencatat absensi
- 📊 **Dashboard Absensi**: Lihat data absensi dengan filter tanggal, kelas, dan status
- 📋 **Daftar Siswa**: Kelola dan lihat semua siswa yang terdaftar
- 🎨 **UI Modern**: Menggunakan Shadcn UI untuk tampilan yang clean dan profesional

## 🛠️ Teknologi

- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety
- **Supabase** - Backend dan database PostgreSQL
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **React QR Code** - Generate QR code
- **html5-qrcode** - Scan QR code dari kamera

## 📋 Prasyarat

- Node.js 18+ 
- NPM atau Yarn
- Akun Supabase (gratis)

## 🔧 Setup Database Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Di SQL Editor, jalankan query dari file `supabase-schema.sql`
4. Ambil credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API keys → `anon` `public`

## ⚙️ Instalasi & Konfigurasi

1. Install dependencies:
```bash
npm install
```

2. Edit file `.env.local` dan isi dengan credentials Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di `http://localhost:3000`

## 📱 Cara Penggunaan

### 1. Registrasi Siswa
- Klik "Daftar Siswa" di halaman utama
- Isi form dengan nama, NIS, dan kelas siswa
- Klik "Daftar & Generate QR Code"
- QR Code akan otomatis di-generate dan bisa di-download/print

### 2. Scan Absensi
- Klik "Mulai Scan" di halaman utama
- Izinkan akses kamera
- Arahkan kamera ke QR Code siswa
- Sistem akan otomatis mencatat absensi:
  - **Hadir**: Jika scan sebelum jam 08:00
  - **Telat**: Jika scan setelah jam 08:00

### 3. Lihat Data Absensi
- Klik "Lihat Data" di halaman utama
- Filter berdasarkan tanggal, kelas, atau status
- Lihat statistik total absensi, hadir, dan telat

### 4. Kelola Siswa
- Klik "Lihat Daftar Siswa"
- Lihat semua siswa terdaftar
- Klik "Lihat QR Code" untuk melihat/download QR Code siswa

## 🗂️ Struktur Project

```
absensi-esgriba/
├── src/
│   ├── app/
│   │   ├── attendance/        # Halaman data absensi
│   │   ├── register/          # Halaman registrasi siswa
│   │   ├── scan/              # Halaman scan QR code
│   │   ├── students/          # Halaman daftar siswa
│   │   │   └── [id]/          # Detail siswa & QR code
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ui/                # Shadcn UI components
│   └── lib/
│       ├── supabase.ts        # Supabase client & types
│       └── utils.ts           # Utility functions
├── .env.local                 # Environment variables (edit ini!)
├── supabase-schema.sql        # Database schema
└── package.json
```

## 🎨 Kustomisasi

### Mengubah Jam Batas Keterlambatan
Edit file `src/app/scan/page.tsx` pada line:
```typescript
const status = hour < 8 ? "hadir" : "telat"; // Ubah 8 sesuai kebutuhan
```

### Menambah Kelas
Edit file `src/app/register/page.tsx` dan `src/app/attendance/page.tsx` pada bagian Select options.

## 🐛 Troubleshooting

**Kamera tidak bisa diakses:**
- Pastikan browser mengizinkan akses kamera
- Gunakan HTTPS di production (localhost OK untuk development)

**QR Code tidak terdeteksi:**
- Pastikan QR Code terlihat jelas
- Gunakan pencahayaan yang cukup
- Jarak ideal 20-30 cm dari kamera

**Error koneksi Supabase:**
- Cek credentials di `.env.local`
- Pastikan tabel sudah dibuat di Supabase
- Cek RLS policies

## 📄 License

MIT License

---

Dibuat dengan ❤️ untuk pendidikan di Indonesia
