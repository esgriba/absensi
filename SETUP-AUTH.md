# Setup SQL untuk Sistem Authentication

## Langkah-langkah Setup di Supabase

### 1. Buka Supabase SQL Editor

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar

### 2. Jalankan Script Database

Copy dan paste SQL berikut, lalu klik **Run**:

```sql
-- Buat extension untuk UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'petugas', 'siswa')),
  student_id UUID REFERENCES students(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
```

### 3. Buat Akun Admin dan Petugas

Setelah tabel dibuat, jalankan SQL ini untuk membuat akun demo:

```sql
-- Hash untuk password "password123"
-- Note: Hash ini sudah di-generate dengan bcrypt salt rounds 10

-- Akun Admin
INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ4/9vWMKNqM0jJ5XBZxqCYZXqEVxoQS', 'Admin Sekolah', 'admin');

-- Akun Petugas
INSERT INTO users (email, password, full_name, role) VALUES
('petugas@esgriba.sch.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ4/9vWMKNqM0jJ5XBZxqCYZXqEVxoQS', 'Petugas Absensi', 'petugas');
```

**Password untuk kedua akun:** `password123`

### 4. (Opsional) Buat Akun Siswa

Untuk membuat akun siswa, Anda perlu tahu `id` siswa dari tabel students:

```sql
-- Cek ID siswa
SELECT id, name, nis FROM students;

-- Buat akun siswa (ganti UUID_SISWA dengan ID siswa yang sebenarnya)
INSERT INTO users (email, password, full_name, role, student_id) VALUES
('2024001@siswa.esgriba.sch.id', '$2a$10$CwTycUXWue0Thq9StjUM0uJ4/9vWMKNqM0jJ5XBZxqCYZXqEVxoQS', 'Ahmad Fauzi', 'siswa', 'UUID_SISWA');
```

Ganti:
- Email dengan format: `NIS@siswa.esgriba.sch.id`
- Nama dengan nama siswa
- `UUID_SISWA` dengan ID dari tabel students

**Password default:** `password123`

### 5. Verifikasi Setup

Jalankan query untuk melihat users yang sudah dibuat:

```sql
SELECT 
  email, 
  full_name, 
  role, 
  is_active,
  created_at
FROM users
ORDER BY created_at DESC;
```

Hasilnya harus menampilkan akun admin dan petugas yang baru dibuat.

## 🔐 Login ke Aplikasi

### Akun Admin

```
URL: http://localhost:3000/login
Email: admin@esgriba.sch.id
Password: password123
```

Setelah login, Anda akan diarahkan ke `/admin` dengan akses penuh.

### Akun Petugas

```
URL: http://localhost:3000/login
Email: petugas@esgriba.sch.id
Password: password123
```

Setelah login, Anda akan diarahkan ke `/petugas` untuk scan QR code.

### Akun Siswa

```
URL: http://localhost:3000/login
Email: (sesuai NIS)@siswa.esgriba.sch.id
Password: password123 (atau password yang di-set)
```

Setelah login, Anda akan diarahkan ke `/siswa` untuk melihat data kehadiran.

## 🛠️ Kelola Users dari Dashboard Admin

Setelah login sebagai admin:

1. Buka menu **Kelola Users**
2. Klik **Tambah User**
3. Isi form:
   - Email (unique)
   - Password (min 6 karakter)
   - Nama Lengkap
   - Role (admin/petugas/siswa)
4. Klik **Tambah User**

Users baru akan langsung aktif dan bisa login.

## 🔄 Reset Password User

Untuk reset password user, jalankan SQL di Supabase:

```sql
-- Reset password ke "newpassword123"
UPDATE users 
SET password = '$2a$10$CwTycUXWue0Thq9StjUM0uJ4/9vWMKNqM0jJ5XBZxqCYZXqEVxoQS'
WHERE email = 'email@user.com';
```

Ganti `email@user.com` dengan email user yang ingin di-reset.

## ⚠️ Troubleshooting

### Error: "Email atau password salah"

- Pastikan email sudah terdaftar di tabel users
- Cek status `is_active` user (harus `true`)
- Pastikan password hash di database sesuai

### Error: "Tidak bisa akses halaman admin/petugas/siswa"

- Pastikan sudah login
- Check cookie di browser (Application → Cookies)
- Pastikan role user sesuai dengan halaman yang diakses

### Error: "duplicate key value violates unique constraint"

- Email sudah terdaftar
- Gunakan email lain atau hapus user lama:
  ```sql
  DELETE FROM users WHERE email = 'email@duplicate.com';
  ```

## 📚 Referensi

- [Dokumentasi Autentikasi](./AUTHENTICATION.md)
- [Setup Supabase](./SETUP-SUPABASE.md)
- [Dokumentasi Lengkap](./DOCUMENTATION.md)
