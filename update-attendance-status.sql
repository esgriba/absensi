-- Update attendance table untuk support status baru
-- Jalankan di Supabase SQL Editor

-- Drop constraint lama
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;

-- Add new constraint dengan status lengkap
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('hadir', 'telat', 'alpha', 'ijin', 'sakit'));

-- Add keterangan column untuk detail (opsional, jika belum ada)
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS keterangan TEXT;

-- Verifikasi
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'attendance';
