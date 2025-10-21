# 🚀 Production Deployment Checklist

Checklist ini membantu Anda menyiapkan aplikasi untuk production.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.local` ke `.env.production`
- [ ] Pastikan `NEXT_PUBLIC_SUPABASE_URL` sudah benar
- [ ] Pastikan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- [ ] Jangan commit file `.env.*` ke Git

### 2. Database (Supabase)
- [ ] Backup database sebelum deploy
- [ ] Review Row Level Security (RLS) policies
- [ ] Pastikan indexes sudah dibuat
- [ ] Test query performance dengan data banyak
- [ ] Set up database backup schedule

### 3. Security
- [ ] Review dan perketat RLS policies
- [ ] Enable rate limiting di Supabase
- [ ] Tambahkan authentication untuk admin features
- [ ] Scan dependencies dengan `npm audit`
- [ ] Update dependencies yang vulnerable

### 4. Performance
- [ ] Run `npm run build` dan cek bundle size
- [ ] Test di mobile devices
- [ ] Check Lighthouse score (target: 90+)
- [ ] Optimize images (jika ada)
- [ ] Enable gzip compression

### 5. Testing
- [ ] Test semua fitur di staging environment
- [ ] Test registrasi siswa
- [ ] Test scan QR code
- [ ] Test filter di halaman absensi
- [ ] Test dengan data dalam jumlah besar
- [ ] Test di berbagai browser (Chrome, Firefox, Safari)
- [ ] Test di berbagai device (mobile, tablet, desktop)

### 6. Code Quality
- [ ] Run `npm run lint` dan fix semua errors
- [ ] Remove console.log yang tidak perlu
- [ ] Remove commented code
- [ ] Update README dengan info production
- [ ] Add proper error boundaries

---

## 🔒 Security Improvements

### Update RLS Policies

Ganti policies di Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for students" ON students;
DROP POLICY IF EXISTS "Enable all operations for attendance" ON attendance;

-- Students table - Public read, authenticated write
CREATE POLICY "Public can read students" ON students
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert students" ON students
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update students" ON students
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Attendance table - Public read, authenticated write
CREATE POLICY "Public can read attendance" ON attendance
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert attendance" ON attendance
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Add Authentication (Optional)

Jika ingin menambahkan auth:

1. Enable Email Auth di Supabase Dashboard
2. Install package:
```bash
npm install @supabase/auth-helpers-nextjs
```

3. Buat halaman login
4. Protect admin routes dengan middleware

---

## 📊 Monitoring & Analytics

### 1. Error Tracking

Install Sentry untuk error monitoring:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics

Tambahkan Google Analytics atau Plausible:

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros:**
- Zero config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Free tier tersedia

**Steps:**
1. Push code ke GitHub
2. Import project di Vercel
3. Add environment variables
4. Deploy!

**Domain Custom:**
```bash
# Vercel CLI
npm i -g vercel
vercel --prod
vercel domains add yourdomain.com
```

### Option 2: Netlify

**Steps:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Node.js 18+
- PM2 untuk process management
- Nginx sebagai reverse proxy
- SSL certificate (Let's Encrypt)

**Setup:**
```bash
# Install dependencies
npm install
npm run build

# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "absensi-app" -- start

# Nginx config
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable SSL
sudo certbot --nginx -d yourdomain.com
```

---

## 🔧 Environment Variables Production

Create `.env.production`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 📱 PWA (Progressive Web App)

Buat aplikasi installable:

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // next config
})
```

```json
// public/manifest.json
{
  "name": "Absensi Siswa SMK",
  "short_name": "Absensi",
  "description": "Sistem Absensi dengan QR Code",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 📈 Performance Optimization

### 1. Database Optimization

```sql
-- Tambahkan indexes
CREATE INDEX IF NOT EXISTS idx_attendance_date_time ON attendance(date, time);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);

-- Vacuum database
VACUUM ANALYZE students;
VACUUM ANALYZE attendance;
```

### 2. Next.js Config

```typescript
// next.config.ts
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}
```

### 3. Bundle Analysis

```bash
npm install @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

---

## 🔍 SEO Optimization

```typescript
// app/layout.tsx
export const metadata = {
  title: 'Absensi Siswa SMK - Sistem QR Code',
  description: 'Sistem absensi modern untuk SMK menggunakan QR Code',
  keywords: ['absensi', 'smk', 'qr code', 'siswa'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Absensi Siswa SMK',
    description: 'Sistem absensi modern dengan QR Code',
    url: 'https://yourdomain.com',
    siteName: 'Absensi SMK',
    images: [
      {
        url: 'https://yourdomain.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
}
```

---

## 🎯 Post-Deployment

### 1. Monitoring
- [ ] Setup uptime monitoring (UptimeRobot, Pingdom)
- [ ] Setup error alerts (Sentry)
- [ ] Monitor database usage (Supabase dashboard)
- [ ] Setup Google Search Console

### 2. Documentation
- [ ] Update README dengan production URL
- [ ] Document deployment process
- [ ] Create user guide
- [ ] Create admin guide

### 3. Backup
- [ ] Setup automatic database backups
- [ ] Test restore process
- [ ] Document backup locations
- [ ] Setup backup alerts

### 4. Support
- [ ] Create support email/form
- [ ] Setup FAQ page
- [ ] Create troubleshooting guide
- [ ] Setup feedback mechanism

---

## 📞 Rollback Plan

Jika ada masalah setelah deployment:

1. **Vercel:**
   ```bash
   vercel rollback
   ```

2. **Manual:**
   - Restore previous Git commit
   - Restore database backup
   - Clear CDN cache

3. **Communication:**
   - Notify users via announcement
   - Update status page
   - Document issue & solution

---

## 🎓 Training Materials

Buat materi training untuk user:

1. **Video Tutorial:**
   - Cara registrasi siswa
   - Cara scan QR code
   - Cara lihat laporan

2. **User Manual (PDF):**
   - Step-by-step dengan screenshot
   - FAQ
   - Contact support

3. **Quick Reference Card:**
   - Print-friendly
   - Highlight key features

---

## ✨ Launch Announcement

Template announcement:

```markdown
🎉 Sistem Absensi Baru Telah Diluncurkan!

Kami dengan bangga memperkenalkan sistem absensi modern menggunakan teknologi QR Code.

🚀 Fitur Utama:
- Registrasi siswa dengan QR Code
- Scan absensi otomatis
- Laporan real-time
- Interface yang mudah digunakan

📱 Akses di: https://yourdomain.com

📧 Butuh bantuan? Hubungi: support@yourdomain.com

Terima kasih!
```

---

Semoga sukses deployment! 🚀
