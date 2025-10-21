# ⏰ Konfigurasi Jam Keterlambatan

## 📋 Setting Saat Ini

**Batas Waktu Keterlambatan:** Jam 07:00

### Aturan Absensi:
- ✅ **HADIR**: Scan sebelum jam 07:00 (06:59:59 atau lebih awal)
- ⚠️ **TELAT**: Scan jam 07:00:00 atau setelahnya

## 🔧 Cara Mengubah Jam Keterlambatan

### File yang Perlu Diubah:
`src/app/scan/page.tsx`

### Line yang Perlu Diubah:

**Line ~138:**
```typescript
const status = hour < 7 ? "hadir" : "telat";
//                   ^ Ubah angka ini
```

**Line ~244:**
```typescript
Absensi sebelum jam 07:00 = Hadir, setelahnya = Telat
//                     ^ Ubah teks ini
```

## 📝 Contoh Konfigurasi Lain

### Jam 06:00
```typescript
const status = hour < 6 ? "hadir" : "telat";
// UI: "Absensi sebelum jam 06:00 = Hadir, setelahnya = Telat"
```

### Jam 07:30
```typescript
const now = new Date();
const hour = now.getHours();
const minute = now.getMinutes();
const status = (hour < 7 || (hour === 7 && minute < 30)) ? "hadir" : "telat";
// UI: "Absensi sebelum jam 07:30 = Hadir, setelahnya = Telat"
```

### Jam 08:00
```typescript
const status = hour < 8 ? "hadir" : "telat";
// UI: "Absensi sebelum jam 08:00 = Hadir, setelahnya = Telat"
```

## 🕐 Contoh Hasil Absensi

Dengan setting **jam 07:00**:

| Waktu Scan | Status | Keterangan |
|------------|--------|------------|
| 06:00:00 | ✅ HADIR | Sebelum jam 7 |
| 06:30:00 | ✅ HADIR | Sebelum jam 7 |
| 06:59:59 | ✅ HADIR | Sebelum jam 7 |
| 07:00:00 | ⚠️ TELAT | Jam 7 tepat |
| 07:00:01 | ⚠️ TELAT | Setelah jam 7 |
| 07:30:00 | ⚠️ TELAT | Setelah jam 7 |
| 08:00:00 | ⚠️ TELAT | Setelah jam 7 |

## 📊 Status Database

Status disimpan di database sebagai:
- `"hadir"` - untuk tepat waktu
- `"telat"` - untuk terlambat

## 🎨 UI Display

Status ditampilkan dengan badge:
- 🟢 **Hadir** - Background hijau
- 🟡 **Telat** - Background kuning

## 💡 Tips

1. **Konsistensi**: Pastikan semua stakeholder tahu aturan jam
2. **Komunikasi**: Beritahu siswa tentang batas waktu
3. **Testing**: Test dengan berbagai waktu sebelum deployment
4. **Dokumentasi**: Update user manual jika mengubah jam

## 🔄 History Perubahan

- **October 21, 2025**: Changed from 08:00 to 07:00
- Alasan: Sesuai kebijakan sekolah

## 🚀 Deploy Setelah Mengubah

Setelah mengubah jam keterlambatan:

```bash
# Test local dulu
npm run dev

# Jika sudah OK, deploy
./deploy.bat
```

## ⚙️ Advanced: Konfigurasi Dinamis

Untuk membuat jam bisa diubah tanpa coding:

### Option 1: Environment Variable
```typescript
// .env.local
NEXT_PUBLIC_LATE_HOUR=7

// src/app/scan/page.tsx
const lateHour = parseInt(process.env.NEXT_PUBLIC_LATE_HOUR || "7");
const status = hour < lateHour ? "hadir" : "telat";
```

### Option 2: Database Config
Simpan setting di tabel `settings`:
```sql
CREATE TABLE settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP
);

INSERT INTO settings (key, value) VALUES ('late_hour', '7');
```

Kemudian fetch saat load page.

### Option 3: Admin Panel
Buat halaman admin untuk manage settings tanpa coding.

---

**Current Status:** ⏰ Late threshold is 07:00 AM
