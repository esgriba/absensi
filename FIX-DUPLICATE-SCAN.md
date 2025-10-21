# Fix: Mencegah Scan QR Code Berulang

## 🐛 Masalah
Ketika QR code di-scan, data tersimpan terus menerus ke database karena scanner terus mendeteksi QR code yang sama berulang kali.

## ✅ Solusi yang Diterapkan

### 1. **Cooldown 3 Detik**
Setelah scan berhasil, sistem akan mengabaikan scan QR code yang sama dalam waktu 3 detik.

### 2. **Processing State**
Menambahkan state `processing` untuk mencegah multiple scan simultan saat sedang memproses absensi.

### 3. **Tracking QR Code & Timestamp**
- `lastQrCodeRef`: Menyimpan QR code terakhir yang di-scan
- `lastScanTimeRef`: Menyimpan timestamp scan terakhir
- Jika QR code sama di-scan dalam < 3 detik, akan diabaikan

## 🔧 Perubahan Kode

### State Baru:
```typescript
const [processing, setProcessing] = useState(false);
const lastScanTimeRef = useRef<number>(0);
const lastQrCodeRef = useRef<string>("");
```

### Logika Pencegahan:
```typescript
const now = Date.now();
const timeSinceLastScan = now - lastScanTimeRef.current;

if (
  processing || 
  (lastQrCodeRef.current === decodedText && timeSinceLastScan < 3000)
) {
  return; // Ignore scan
}
```

### UI Feedback:
Menambahkan indikator "Memproses..." saat sedang proses absensi.

## 📊 Hasil

**Sebelum:**
- QR code di-scan berkali-kali dalam 1 detik
- Data duplikat tersimpan ke database
- User bingung karena toast muncul terus

**Sesudah:**
- QR code hanya bisa di-scan 1x per 3 detik
- Tidak ada data duplikat
- UI menampilkan status "Memproses..."
- Clear feedback setelah 3 detik

## 🚀 Cara Deploy

Jalankan file `deploy.bat`:
```bash
deploy.bat
```

Atau manual:
```bash
git add .
git commit -m "Fix: Prevent duplicate QR scan"
git push origin main
```

## 🎯 Testing

1. Buka halaman `/scan`
2. Scan QR code siswa
3. Coba scan QR code yang sama segera setelahnya
4. **Expected:** Scan kedua akan diabaikan
5. Tunggu 3 detik
6. Scan lagi (akan muncul warning "sudah absen hari ini")

## ⏱️ Waktu Cooldown

Saat ini diset **3 detik**. Untuk mengubah:

```typescript
// Di file: src/app/scan/page.tsx
// Ubah angka 3000 (ms) sesuai kebutuhan
if (lastQrCodeRef.current === decodedText && timeSinceLastScan < 3000) {
  //                                                                ^^^^
  //                                                          ganti di sini
  return;
}
```

## 📝 Catatan

- Cooldown berlaku per QR code
- Jika scan QR code berbeda, tidak ada cooldown
- Processing state akan reset setelah 3 detik atau error
- Cocok untuk mencegah scan tidak sengaja berkali-kali

---

**Status:** ✅ Fixed and ready to deploy
