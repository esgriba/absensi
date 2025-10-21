# Panduan Setup Supabase untuk Absensi SMK

## Langkah 1: Buat Akun Supabase

1. Kunjungi https://supabase.com
2. Klik "Start your project" atau "Sign Up"
3. Login dengan GitHub atau email

## Langkah 2: Buat Project Baru

1. Setelah login, klik "New Project"
2. Isi detail project:
   - **Name**: absensi-esgriba (atau nama lain)
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (Southeast Asia untuk Indonesia)
3. Klik "Create new project"
4. Tunggu beberapa menit hingga project siap

## Langkah 3: Setup Database

1. Di sidebar, klik **SQL Editor**
2. Klik tombol "New query"
3. Copy seluruh isi file `supabase-schema.sql` dari project ini
4. Paste ke SQL Editor
5. Klik tombol "Run" atau tekan Ctrl+Enter
6. Pastikan muncul pesan sukses

## Langkah 4: Ambil API Credentials

1. Di sidebar, klik **Settings** (ikon gear)
2. Klik **API** di menu Settings
3. Catat dua nilai ini:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **API Key (anon/public):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Langkah 5: Konfigurasi di Project

1. Buka file `.env.local` di project
2. Ganti dengan credentials Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save file

## Langkah 6: Verifikasi

1. Di Supabase dashboard, klik **Table Editor**
2. Anda harus melihat 2 tabel:
   - `students` - untuk data siswa
   - `attendance` - untuk data absensi

## Langkah 7: Jalankan Aplikasi

```bash
npm run dev
```

Buka http://localhost:3000 dan coba daftarkan siswa pertama!

## Troubleshooting

### Error: "Failed to fetch"
- Pastikan credentials di `.env.local` sudah benar
- Restart development server setelah mengubah `.env.local`
- Cek koneksi internet

### Error: "relation does not exist"
- Pastikan sudah menjalankan SQL schema
- Cek di Table Editor apakah tabel sudah dibuat

### Error: "new row violates row-level security policy"
- Pastikan RLS policies sudah dibuat dengan benar
- Cek di Authentication → Policies

## Tips

- **Backup Database**: Settings → Database → Database Backups
- **Lihat Data**: Gunakan Table Editor untuk melihat/edit data manual
- **Monitor**: Gunakan Database → Logs untuk debug
- **Free Tier**: Gratis untuk 500MB database + 2GB bandwidth/bulan

## Struktur Database

### Tabel `students`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key (auto) |
| name | VARCHAR | Nama siswa |
| nis | VARCHAR | NIS (unique) |
| class | VARCHAR | Kelas siswa |
| qr_code | TEXT | QR code unik |
| created_at | TIMESTAMP | Waktu dibuat |

### Tabel `attendance`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key (auto) |
| student_id | UUID | Foreign key ke students |
| date | DATE | Tanggal absensi |
| time | TIME | Waktu absensi |
| status | VARCHAR | hadir/telat |
| created_at | TIMESTAMP | Waktu dibuat |

## Keamanan Production

Untuk production, update RLS policies:

```sql
-- Policy untuk students (hanya admin yang bisa edit)
DROP POLICY IF EXISTS "Enable all operations for students" ON students;

CREATE POLICY "Enable read for students" ON students
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated" ON students
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy untuk attendance
DROP POLICY IF EXISTS "Enable all operations for attendance" ON attendance;

CREATE POLICY "Enable read for attendance" ON attendance
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated" ON attendance
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Support

Jika ada masalah:
1. Cek dokumentasi Supabase: https://supabase.com/docs
2. Discord Supabase: https://discord.supabase.com
3. Stack Overflow dengan tag `supabase`
