# 🔧 FIX: Login Error "Username atau Password Salah"

## Masalah
Login dengan `admin@esgriba.sch.id` dan password `password123` gagal dengan error "Email atau password salah"

## Penyebab
Ada 2 kemungkinan:
1. **Akun belum dibuat** di database Supabase
2. **Password hash tidak cocok** dengan yang ada di database

## ✅ Solusi: Buat Ulang Akun dengan Hash yang Benar

### Langkah 1: Generate Password Hash Baru

Jalankan command ini di terminal:

```bash
node generate-password.js
```

Output akan menampilkan SQL yang sudah benar. **Copy SQL yang muncul!**

### Langkah 2: Jalankan di Supabase SQL Editor

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. **PENTING**: Hapus user lama dulu (jika ada):

```sql
-- Hapus user lama jika sudah ada
DELETE FROM users WHERE email IN ('admin@esgriba.sch.id', 'petugas@esgriba.sch.id');
```

5. Klik **RUN** untuk hapus user lama

6. Kemudian paste SQL dari hasil generate-password.js:

```sql
-- Akun Admin
INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Admin Sekolah', 'admin');

-- Akun Petugas
INSERT INTO users (email, password, full_name, role) VALUES
('petugas@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Petugas Absensi', 'petugas');
```

7. Klik **RUN**

### Langkah 3: Verifikasi User Sudah Dibuat

Jalankan query ini untuk cek:

```sql
SELECT email, full_name, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;
```

Harusnya muncul 2 user:
- ✓ admin@esgriba.sch.id
- ✓ petugas@esgriba.sch.id

### Langkah 4: Test Login

1. Buka `http://localhost:3000/login`
2. Masukkan:
   - **Email**: `admin@esgriba.sch.id`
   - **Password**: `password123`
3. Klik **Login**
4. Harusnya redirect ke `/admin` dashboard

## 🔍 Troubleshooting Lanjutan

### Cek 1: User Ada di Database?

```sql
SELECT * FROM users WHERE email = 'admin@esgriba.sch.id';
```

Jika **tidak ada hasil**: User belum dibuat, ulangi Langkah 2.

### Cek 2: User Aktif?

```sql
SELECT email, is_active FROM users WHERE email = 'admin@esgriba.sch.id';
```

Jika `is_active = false`, aktifkan:

```sql
UPDATE users SET is_active = true WHERE email = 'admin@esgriba.sch.id';
```

### Cek 3: Password Hash Benar?

Hash harus dimulai dengan `$2a$` atau `$2b$` (bcrypt format).

Contoh hash yang **benar**:
```
$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.
```

Jika hash berbeda, generate ulang dengan `node generate-password.js`

### Cek 4: Browser Console Error

1. Buka DevTools (F12)
2. Tab **Console**
3. Coba login lagi
4. Lihat error message

Common errors:
- `User tidak ditemukan`: Email salah atau user belum dibuat
- `Password salah`: Hash tidak cocok
- `Network error`: Supabase credentials salah di `.env.local`

### Cek 5: Supabase Credentials

Pastikan `.env.local` sudah benar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Test koneksi:

```sql
-- Di Supabase SQL Editor, harusnya bisa jalan
SELECT NOW();
```

## 🎯 Quick Fix Script

Jika masih gagal, jalankan script lengkap ini di Supabase SQL Editor:

```sql
-- 1. Drop dan recreate table (HATI-HATI: Hapus semua user!)
DROP TABLE IF EXISTS users CASCADE;

-- 2. Buat ulang table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'petugas', 'siswa')),
  student_id UUID REFERENCES students(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 4. Insert admin & petugas (GUNAKAN HASH DARI generate-password.js!)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Admin Sekolah', 'admin'),
('petugas@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Petugas Absensi', 'petugas');

-- 5. Verifikasi
SELECT email, full_name, role, is_active FROM users;
```

## 📞 Masih Error?

Kirim screenshot:
1. Browser console error
2. Network tab request/response
3. Hasil query: `SELECT * FROM users WHERE email = 'admin@esgriba.sch.id'`

---

**Setelah berhasil login, JANGAN LUPA ganti password default!**
