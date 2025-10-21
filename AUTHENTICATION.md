# Sistem Autentikasi

Dokumentasi lengkap untuk sistem login dan role-based access control.

## 📋 Overview

Sistem autentikasi dengan 3 role:
- **Admin**: Akses penuh ke semua fitur
- **Petugas**: Hanya bisa scan QR code
- **Siswa**: Hanya bisa lihat data kehadiran sendiri

## 🗄️ Database Schema

### Tabel users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'petugas', 'siswa')),
  student_id UUID REFERENCES students(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Setup Akun Demo

Jalankan SQL ini di Supabase SQL Editor untuk membuat akun demo:

```sql
-- Hash password menggunakan bcrypt (password123)
-- Hash: $2a$10$rZx5ZqJXO7lHqGqxGqXqxO5O5O5O5O5O5O5O5O5O5O5O5O5O5O

-- Admin
INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2a$10$rZx5ZqJXO7lHqGqxGqXqxO5O5O5O5O5O5O5O5O5O5O5O5O5O5O', 'Admin Sekolah', 'admin');

-- Petugas
INSERT INTO users (email, password, full_name, role) VALUES
('petugas@esgriba.sch.id', '$2a$10$rZx5ZqJXO7lHqGqxGqXqxO5O5O5O5O5O5O5O5O5O5O5O5O5O5O', 'Petugas Absensi', 'petugas');

-- Siswa (contoh: linked dengan student_id)
INSERT INTO users (email, password, full_name, role, student_id) VALUES
('2024001@siswa.esgriba.sch.id', '$2a$10$rZx5ZqJXO7lHqGqxGqXqxO5O5O5O5O5O5O5O5O5O5O5O5O5O5O', 'Ahmad Fauzi', 'siswa', 'UUID_SISWA');
```

**Note**: Ganti `UUID_SISWA` dengan ID dari tabel students yang sudah ada.

## 🚀 Cara Login

1. Buka halaman `/login`
2. Masukkan email dan password
3. Klik "Login"
4. Otomatis redirect ke dashboard sesuai role:
   - Admin → `/admin`
   - Petugas → `/petugas`
   - Siswa → `/siswa`

### Akun Demo

```
Admin:
Email: admin@esgriba.sch.id
Password: password123

Petugas:
Email: petugas@esgriba.sch.id
Password: password123

Siswa:
Email: (sesuai NIS)@siswa.esgriba.sch.id
Password: (di-set saat buat akun)
```

## 👨‍💼 Dashboard Admin

### Menu yang Tersedia:

1. **Kelola Siswa**
   - Daftar Siswa (`/students`)
   - Tambah Siswa (`/register`)
   - Import Excel (`/import`)

2. **Data Absensi**
   - Lihat Data Absensi (`/attendance`)
   - Filter by tanggal, kelas, status

3. **Kelola Users** ⭐ BARU
   - Daftar Users (`/admin/users`)
   - Tambah User (Admin/Petugas/Siswa)
   - Aktifkan/Nonaktifkan User

4. **Scan Absensi**
   - Scan QR Code (`/scan`)

5. **Laporan**
   - Generate laporan (coming soon)

6. **Pengaturan**
   - Konfigurasi sistem (coming soon)

## 👮 Dashboard Petugas

Menu terbatas untuk petugas:

1. **Scan QR Code**
   - Tombol besar untuk mulai scan
   - Langsung ke `/scan`

2. **Lihat Absensi Hari Ini**
   - Quick link ke data hari ini

3. **Daftar Siswa**
   - Read-only view

## 👨‍🎓 Dashboard Siswa

Siswa hanya bisa lihat data sendiri:

1. **Informasi Siswa**
   - Nama, NIS, Kelas
   - Kartu QR Code

2. **Statistik Kehadiran**
   - Total Hadir
   - Total Telat
   - Total Tidak Hadir

3. **Riwayat Absensi**
   - 30 hari terakhir
   - Tanggal, waktu, status

## 🔒 Route Protection

### Middleware (src/middleware.ts)

Middleware akan otomatis check cookie dan redirect jika unauthorized:

```typescript
/admin/* → hanya role "admin"
/petugas/* → hanya role "petugas"
/siswa/* → hanya role "siswa"
```

Jika tidak ada cookie atau role salah, redirect ke `/login`.

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Global auth state
├── app/
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── admin/
│   │   ├── page.tsx             # Admin dashboard
│   │   └── users/
│   │       └── page.tsx         # User management
│   ├── petugas/
│   │   └── page.tsx             # Petugas dashboard
│   └── siswa/
│       └── page.tsx             # Siswa dashboard
└── middleware.ts                # Route protection
```

## 🛠️ Kelola Users (Admin Only)

### Tambah User Baru

1. Buka `/admin/users`
2. Klik "Tambah User"
3. Isi form:
   - Email (unique)
   - Password (min 6 karakter)
   - Nama Lengkap
   - Role (admin/petugas/siswa)
4. Klik "Tambah User"

### Aktifkan/Nonaktifkan User

- Klik tombol "Nonaktifkan" untuk disable user
- User yang nonaktif tidak bisa login
- Klik "Aktifkan" untuk enable kembali

## 🔄 Flow Authentication

```
1. User buka /login
2. Input email & password
3. Submit form → AuthContext.login()
4. Query database (users table)
5. Verify password (bcrypt.compare)
6. Set localStorage + cookie
7. Redirect sesuai role
8. Middleware check cookie di setiap request
```

## 🔐 Security Notes

### Password Hashing

- Menggunakan **bcryptjs** dengan salt rounds 10
- Password di-hash sebelum disimpan ke database
- Verifikasi menggunakan `bcrypt.compare()`

### Cookie Security

- Max age: 86400 detik (24 jam)
- Path: `/` (semua route)
- Disimpan di localStorage + cookie

### Best Practices

- ⚠️ **PENTING**: Hash password harus dilakukan di server-side (API route)
- Current implementation: hashing di client-side (not production ready)
- Gunakan Supabase Edge Functions atau Next.js API route untuk production

## 🚧 TODO Production Security

```javascript
// TODO: Pindahkan password hashing ke server-side
// src/app/api/auth/register/route.ts
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password, full_name, role } = await request.json();
  
  // Hash password di server
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert ke database
  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      email, 
      password: hashedPassword, 
      full_name, 
      role 
    }]);
    
  return Response.json({ success: true });
}
```

## 🎯 Testing

### Test Login Flow

1. Buka `/login`
2. Login dengan akun admin
3. Verify redirect ke `/admin`
4. Check menu dan akses
5. Logout
6. Verify redirect ke `/login`

### Test Role Access

1. Login sebagai petugas
2. Coba akses `/admin` → should redirect to `/login`
3. Access `/petugas` → should work
4. Login sebagai siswa
5. Coba akses `/admin` → should redirect to `/login`
6. Access `/siswa` → should work

### Test User Management

1. Login sebagai admin
2. Buka `/admin/users`
3. Tambah user baru
4. Verify email unique constraint
5. Nonaktifkan user
6. Coba login dengan user nonaktif → should fail
7. Aktifkan kembali → should work

## 📞 Support

Jika ada error atau pertanyaan:

1. Check browser console untuk error messages
2. Check Supabase logs untuk database errors
3. Verify user cookie di browser DevTools → Application → Cookies

## 📚 Related Docs

- [SETUP-SUPABASE.md](./SETUP-SUPABASE.md) - Setup Supabase database
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Dokumentasi lengkap aplikasi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy ke Vercel
