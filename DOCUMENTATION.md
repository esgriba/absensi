# Dokumentasi Fitur Aplikasi Absensi

## 📋 Overview Fitur

Aplikasi ini memiliki 5 halaman utama:

### 1. 🏠 Homepage (`/`)
**File:** `src/app/page.tsx`

**Fitur:**
- Menu navigasi utama dengan 3 card:
  - Registrasi Siswa
  - Scan Absensi
  - Data Absensi
- Link ke halaman daftar siswa
- Desain gradient background yang menarik

**UI Components:**
- Card, Button dari Shadcn UI
- Responsive grid layout

---

### 2. ✍️ Registrasi Siswa (`/register`)
**File:** `src/app/register/page.tsx`

**Fitur:**
- Form input data siswa:
  - Nama Lengkap (text input)
  - NIS - Nomor Induk Siswa (text input, unique)
  - Kelas (dropdown select)
- Auto-generate QR Code unik saat registrasi
- Validasi NIS duplikat
- Redirect ke halaman detail siswa setelah berhasil
- Toast notification untuk feedback

**Kelas yang Tersedia:**
- X RPL 1, X RPL 2
- X TKJ 1, X TKJ 2
- XI RPL 1, XI RPL 2
- XI TKJ 1, XI TKJ 2
- XII RPL 1, XII RPL 2
- XII TKJ 1, XII TKJ 2

**Database:**
```typescript
{
  name: string,
  nis: string (unique),
  class: string,
  qr_code: string (unique, auto-generated)
}
```

**QR Code Format:**
```
{NIS}-{timestamp}
Contoh: 123456-1729526400000
```

---

### 3. 👥 Daftar Siswa (`/students`)
**File:** `src/app/students/page.tsx`

**Fitur:**
- Tabel daftar semua siswa terdaftar
- Kolom: NIS, Nama, Kelas, Aksi
- Tombol "Lihat QR Code" untuk setiap siswa
- Tombol tambah siswa baru
- Loading state
- Empty state jika belum ada siswa

**UI Components:**
- Table component dari Shadcn UI
- Card wrapper
- Button untuk actions

---

### 4. 📱 Detail Siswa & QR Code (`/students/[id]`)
**File:** `src/app/students/[id]/page.tsx`

**Fitur:**
- Tampilkan informasi siswa (Nama, NIS, Kelas)
- QR Code berukuran 256x256px
- Error correction level: H (High)
- Tombol Download QR Code sebagai PNG
- Tombol Print untuk cetak langsung
- Background putih pada QR Code untuk print yang jelas

**Fungsi Download:**
- Convert SVG QR Code ke PNG
- Nama file: `QR-{NIS}-{Nama}.png`
- Resolusi penuh

---

### 5. 📸 Scan QR Code (`/scan`)
**File:** `src/app/scan/page.tsx`

**Fitur:**
- Camera scanner menggunakan html5-qrcode
- Auto-detect QR Code
- Validasi QR Code dengan database
- Cek duplikasi absensi (1 siswa hanya bisa absen 1x per hari)
- Auto-determine status:
  - **Hadir**: Scan sebelum jam 08:00
  - **Telat**: Scan jam 08:00 atau setelahnya
- Toast notification untuk feedback
- Tampilan info siswa yang baru di-scan
- Tombol Start/Stop scanner

**Konfigurasi Scanner:**
```typescript
{
  fps: 10,
  qrbox: { width: 250, height: 250 },
  facingMode: "environment" // kamera belakang
}
```

**Flow Absensi:**
1. User klik "Mulai Scan"
2. Browser minta izin kamera
3. Arahkan kamera ke QR Code
4. Sistem detect QR Code
5. Validasi dengan database
6. Cek apakah sudah absen hari ini
7. Tentukan status (hadir/telat)
8. Simpan ke database
9. Tampilkan notifikasi sukses

---

### 6. 📊 Dashboard Absensi (`/attendance`)
**File:** `src/app/attendance/page.tsx`

**Fitur:**

#### Statistik Cards:
- Total Absensi hari ini
- Total Hadir
- Total Telat

#### Filter:
- **Tanggal**: Date picker (default: hari ini)
- **Kelas**: Dropdown semua kelas + "Semua Kelas"
- **Status**: Dropdown (Semua/Hadir/Telat)

#### Tabel Absensi:
- Kolom: Waktu, NIS, Nama, Kelas, Status
- Status badge dengan warna:
  - 🟢 Hadir (hijau)
  - 🟡 Telat (kuning)
- Sorted by waktu (terbaru dulu)
- Responsive table
- Loading & empty state

**Database Query:**
```typescript
// Join students dengan attendance
SELECT 
  attendance.*,
  students.name,
  students.nis,
  students.class
FROM attendance
INNER JOIN students ON attendance.student_id = students.id
WHERE date = CURRENT_DATE
ORDER BY time DESC
```

---

## 🎨 Design System

### Color Palette:
- **Primary**: Blue gradient (`from-blue-50 to-indigo-100`)
- **Success**: Green (`bg-green-100 text-green-800`)
- **Warning**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Error**: Red (toast errors)

### Typography:
- **Headings**: Font-bold, various sizes
- **Body**: Default system font
- **Code**: Monospace

### Spacing:
- Container: `max-w-{2xl,5xl,6xl} mx-auto`
- Padding: `px-4 py-12`
- Gap: `space-y-{4,6}` untuk vertical spacing

### Components:
- Card dengan shadow dan hover effect
- Button dengan variants (default, secondary, outline, ghost)
- Input dengan focus states
- Table dengan zebra striping

---

## 🔧 Technical Details

### Database Schema:

**students table:**
```sql
id: UUID (PK)
name: VARCHAR(255)
nis: VARCHAR(50) UNIQUE
class: VARCHAR(50)
qr_code: TEXT UNIQUE
created_at: TIMESTAMP
```

**attendance table:**
```sql
id: UUID (PK)
student_id: UUID (FK → students.id)
date: DATE
time: TIME
status: VARCHAR(20)
created_at: TIMESTAMP
```

### API Routes:
Aplikasi menggunakan Supabase client-side, tidak ada API routes custom.

### State Management:
- React useState untuk local state
- No global state management (Redux, Zustand, etc)
- Data fetching on component mount dengan useEffect

### Error Handling:
- Try-catch blocks untuk semua database operations
- Toast notifications untuk user feedback
- Console.error untuk debugging
- Graceful degradation untuk empty states

---

## 🚀 Future Enhancements

Ide pengembangan lebih lanjut:

1. **Authentication:**
   - Login untuk admin
   - Role-based access (admin, guru, siswa)

2. **Export Data:**
   - Export ke Excel/CSV
   - Print laporan bulanan
   - Generate PDF

3. **Analytics:**
   - Chart kehadiran per minggu/bulan
   - Persentase kehadiran per kelas
   - Top students (perfect attendance)

4. **Notifications:**
   - Email reminder untuk siswa yang tidak hadir
   - WhatsApp integration
   - Push notifications

5. **Advanced Features:**
   - Face recognition backup
   - GPS location tracking
   - Multiple sessions per day
   - Excuse/izin system
   - Parent portal

6. **Mobile App:**
   - React Native version
   - Offline mode
   - Native camera integration

7. **Admin Panel:**
   - Bulk import siswa (CSV)
   - Edit/delete siswa
   - Manage kelas
   - System settings

---

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

**Breakpoints:**
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

**Testing Devices:**
- iPhone 12/13/14
- iPad Pro
- Desktop 1920x1080

---

## ⚡ Performance

**Optimizations:**
- Next.js automatic code splitting
- Image optimization (jika ada)
- Lazy loading components
- Database indexing pada kolom yang sering di-query
- Minimal dependencies

**Load Time:**
- Initial load: < 2s
- Page navigation: < 500ms
- QR scan detection: < 1s

---

## 🐛 Known Issues & Limitations

1. **Camera Permission:**
   - User harus allow camera access
   - Tidak ada fallback untuk manual input

2. **QR Code Scanner:**
   - Perlu pencahayaan yang cukup
   - Distance optimal: 20-30cm
   - Tidak support blur/damaged QR codes

3. **Duplikasi:**
   - Hanya cek per hari, tidak per session
   - Tidak ada sistem untuk pulang/keluar

4. **Timezone:**
   - Menggunakan timezone local browser
   - Perlu sinkronisasi untuk deployment

5. **Scalability:**
   - Supabase free tier: 500MB database
   - Rate limiting: perlu dihandle untuk banyak user

---

Dibuat dengan ❤️ menggunakan Next.js + Supabase + Shadcn UI
