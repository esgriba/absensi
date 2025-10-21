-- ========================================
-- SETUP USERS TABLE & DEMO ACCOUNTS
-- Copy paste script ini ke Supabase SQL Editor
-- ========================================

-- Step 1: Hapus user lama (jika ada)
DELETE FROM users WHERE email IN ('admin@esgriba.sch.id', 'petugas@esgriba.sch.id');

-- Step 2: Insert admin dan petugas dengan password hash yang benar
-- Password untuk kedua akun: password123
-- Hash generated with bcryptjs (node generate-password.js)

INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Admin Sekolah', 'admin');

INSERT INTO users (email, password, full_name, role) VALUES
('petugas@esgriba.sch.id', '$2b$10$cOTCmZkX.LlNEfsB7mPR4uBx1ln8DzDjOwcjHV/gIPMW8D7eUkhn.', 'Petugas Absensi', 'petugas');

-- Step 3: Verifikasi user sudah dibuat
SELECT 
  email, 
  full_name, 
  role, 
  is_active,
  created_at
FROM users 
ORDER BY created_at DESC;

-- Harusnya muncul 2 baris:
-- 1. admin@esgriba.sch.id | Admin Sekolah | admin | true
-- 2. petugas@esgriba.sch.id | Petugas Absensi | petugas | true

-- ========================================
-- SELESAI! Sekarang coba login dengan:
-- Email: admin@esgriba.sch.id
-- Password: password123
-- ========================================
