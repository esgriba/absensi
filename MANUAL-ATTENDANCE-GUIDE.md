# 📝 Panduan Input Absensi Manual (Alpha/Ijin/Sakit)

## Overview

Sistem absensi sekarang mendukung **5 status**:
- ✅ **Hadir** - Siswa scan QR sebelum jam 07:00
- ⏰ **Telat** - Siswa scan QR setelah jam 07:00  
- ❌ **Alpha** - Tidak hadir tanpa keterangan
- 📝 **Ijin** - Tidak hadir dengan surat ijin
- 🏥 **Sakit** - Tidak hadir karena sakit

## 🚀 Setup Database

Sebelum menggunakan fitur ini, jalankan SQL di Supabase:

```sql
-- Update constraint untuk support status baru
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('hadir', 'telat', 'alpha', 'ijin', 'sakit'));

-- Tambah kolom keterangan (jika belum ada)
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS keterangan TEXT;
```

**Copy dari file**: `update-attendance-status.sql`

## 📋 Cara Menggunakan

### **Metode 1: Input Manual Per Siswa**

1. **Login sebagai Admin**
2. **Buka Dashboard Admin** (`/admin`)
3. **Klik "Input Manual"** di card "Data Absensi"
4. **Pilih Tanggal** (default: hari ini)
5. **Pilih Kelas** (opsional, untuk filter)
6. **Input Status** untuk setiap siswa:
   - Dropdown pilih status: Hadir/Telat/Alpha/Ijin/Sakit
   - Tambah keterangan jika perlu (opsional)
7. **Klik "Simpan Absensi"**

### **Metode 2: Auto-Generate Alpha (Bulk)**

Untuk cepat tandai semua siswa yang belum absen sebagai Alpha:

1. **Buka halaman Input Manual**
2. **Pilih Tanggal**
3. **Klik tombol "Auto Alpha (Belum Absen)"**
4. Sistem akan:
   - Cek siswa yang belum punya record hari ini
   - Auto-create status "Alpha" untuk mereka
   - Keterangan: "Auto-generated"
5. **Edit jadi "Ijin" atau "Sakit"** jika ada surat menyusul

## 🎯 Workflow Harian yang Direkomendasikan

### **Pagi Hari (06:30 - 07:00)**
```
1. Petugas buka halaman Scan (`/scan`)
2. Siswa datang dan scan QR code
3. Status otomatis: Hadir (< 07:00) atau Telat (>= 07:00)
```

### **Setelah Jam Masuk (07:30)**
```
1. Admin buka "Input Manual" (`/admin/manual-attendance`)
2. Pilih tanggal hari ini
3. Klik "Auto Alpha" → tandai yang belum scan
4. Edit Alpha → Ijin/Sakit jika ada surat
```

### **Akhir Hari (Optional)**
```
1. Review data di halaman "Data Absensi" (`/attendance`)
2. Filter by status untuk cek:
   - Berapa yang Alpha?
   - Berapa yang Ijin/Sakit?
3. Export untuk laporan
```

## 📊 Fitur di Halaman Input Manual

### **1. Filter & Navigation**
- **Pilih Tanggal**: Input manual untuk tanggal tertentu (bisa isi absensi kemarin)
- **Filter Kelas**: Tampilkan hanya siswa dari kelas tertentu
- **Button Auto Alpha**: Generate Alpha untuk yang belum absen

### **2. Real-Time Statistics**
Dashboard mini menampilkan:
```
┌─────┬─────┬─────┬─────┬─────┐
│  ✅  │  ⏰  │  ❌  │  📝  │  🏥  │
│  12 │   5 │   2 │   1 │   1 │
│Hadir│Telat│Alpha│ Ijin│Sakit│
└─────┴─────┴─────┴─────┴─────┘
```

### **3. Tabel Siswa**
Kolom:
- **No, NIS, Nama, Kelas**: Info siswa
- **Status**: 
  - Jika sudah ada record → tampil badge status
  - Jika belum → dropdown pilih status
- **Keterangan**: Input text untuk catatan tambahan

### **4. Keterangan (Notes)**
Gunakan untuk detail seperti:
```
- "Sakit demam, surat dari orang tua"
- "Ijin acara keluarga"
- "Alpha tanpa kabar"
- "Terlambat karena macet"
```

## 📈 Melihat Data Absensi

### **Halaman Data Absensi** (`/attendance`)

Sekarang mendukung:
- **5 Status Cards**: Total untuk Hadir/Telat/Alpha/Ijin/Sakit
- **Filter by Status**: Filter tampilan by status tertentu
- **Badge Berwarna**: Setiap status punya warna berbeda

Contoh filter:
```
Filter Status: Alpha → Lihat siapa saja yang alpha
Filter Status: Ijin → Lihat siapa saja yang ijin
Filter Tanggal + Status → Kombinasi filter
```

## 🔄 Edit Status yang Sudah Ada

Jika sudah ada record tapi perlu diubah:

### **Cara 1: Via Input Manual**
1. Buka `/admin/manual-attendance`
2. Pilih tanggal yang sama
3. Siswa yang sudah ada record akan tampil **badge status**
4. Ubah status dengan pilih dari dropdown
5. Simpan perubahan

### **Cara 2: Hapus & Input Ulang**
1. Buka halaman Data Absensi
2. Note down student_id dan tanggal
3. Di Supabase, run:
```sql
DELETE FROM attendance 
WHERE student_id = 'xxx' AND date = '2024-01-15';
```
4. Input manual lagi dengan status yang benar

## 💡 Use Cases

### **Case 1: Siswa Alpha tapi Kirim Surat Menyusul**
```
1. Pagi: Auto-generate Alpha untuk yang tidak hadir
2. Siang: Siswa kirim surat ijin via WA
3. Admin buka Input Manual
4. Edit status dari Alpha → Ijin
5. Tambah keterangan: "Surat ijin via WA"
```

### **Case 2: Siswa Sakit 3 Hari Berturut-turut**
```
1. Hari 1: Input manual status "Sakit" + keterangan "Demam"
2. Hari 2: Input manual status "Sakit" + keterangan "Masih demam"
3. Hari 3: Input manual status "Sakit" + keterangan "Surat dokter"
```

### **Case 3: Kelas Ijin Acara Sekolah**
```
1. Buka Input Manual
2. Filter Kelas: XII RPL 1
3. Pilih semua siswa → Status: Ijin
4. Keterangan: "Acara wisuda"
5. Simpan sekaligus
```

## 🎨 Tampilan Status Badge

```
✅ Hadir  → Hijau
⏰ Telat  → Kuning
❌ Alpha  → Merah
📝 Ijin   → Biru
🏥 Sakit  → Ungu
```

## 📱 Akses untuk Siswa/Wali Murid

Di dashboard siswa (`/siswa`):
- Statistik akan include semua status
- Tabel riwayat tampilkan status lengkap
- Wali murid bisa lihat anak mereka Alpha/Ijin/Sakit

## ⚠️ Important Notes

1. **Unique Constraint**: Satu siswa hanya bisa punya 1 record per tanggal
   - Jika input ulang → akan update record yang ada (upsert)
   
2. **Waktu (Time)**:
   - Hadir/Telat dari scan → time = waktu scan
   - Alpha/Ijin/Sakit manual → time = waktu input
   
3. **Keterangan Optional**: 
   - Tidak wajib diisi
   - Bisa diisi kapan saja untuk detail tambahan

4. **Auto-Alpha**:
   - Hanya untuk siswa yang **belum ada record sama sekali**
   - Jika sudah ada record (Hadir/Telat) → tidak akan di-generate

## 🔧 Troubleshooting

### Error: "duplicate key value"
**Penyebab**: Siswa sudah punya record di tanggal tersebut
**Solusi**: Gunakan fitur edit, bukan insert baru

### Status tidak muncul di dropdown
**Penyebab**: Database constraint belum diupdate
**Solusi**: Jalankan SQL dari `update-attendance-status.sql`

### Auto-Alpha tidak jalan
**Penyebab**: Semua siswa sudah punya record
**Solusi**: Normal, artinya semua sudah absen

## 📊 Export & Laporan

Untuk generate laporan absensi:
```sql
-- Laporan per hari
SELECT 
  s.name,
  s.nis,
  s.class,
  a.status,
  a.keterangan
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE a.date = '2024-01-15'
ORDER BY s.class, s.name;

-- Statistik per kelas
SELECT 
  s.class,
  COUNT(*) FILTER (WHERE a.status = 'hadir') as hadir,
  COUNT(*) FILTER (WHERE a.status = 'telat') as telat,
  COUNT(*) FILTER (WHERE a.status = 'alpha') as alpha,
  COUNT(*) FILTER (WHERE a.status = 'ijin') as ijin,
  COUNT(*) FILTER (WHERE a.status = 'sakit') as sakit
FROM attendance a
JOIN students s ON a.student_id = s.id
WHERE a.date = '2024-01-15'
GROUP BY s.class;
```

---

## 🎯 Quick Reference

| Aksi | Cara |
|------|------|
| Input Alpha manual | Input Manual → Pilih siswa → Status: Alpha |
| Auto-generate Alpha | Input Manual → Button "Auto Alpha" |
| Edit Alpha → Ijin | Input Manual → Pilih tanggal → Edit status |
| Lihat yang Alpha hari ini | Data Absensi → Filter Status: Alpha |
| Input Ijin untuk besok | Input Manual → Ubah tanggal → Input status |

---

**Pro Tip**: Gunakan Auto-Alpha setiap pagi jam 07:30, lalu edit jadi Ijin/Sakit jika ada surat. Lebih cepat daripada input manual satu-satu! 🚀
