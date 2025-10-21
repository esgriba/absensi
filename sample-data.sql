-- ============================================
-- Sample Data untuk Testing
-- ============================================
-- File ini berisi contoh data siswa dan absensi
-- untuk keperluan testing dan demonstrasi
-- ============================================

-- ============================================
-- 1. Insert Sample Students
-- ============================================

-- Kelas X RPL 1
INSERT INTO students (name, nis, class, qr_code) VALUES
('Ahmad Rizki Pratama', '2024001', 'X RPL 1', '2024001-1729526401000'),
('Siti Nurhaliza', '2024002', 'X RPL 1', '2024002-1729526402000'),
('Budi Santoso', '2024003', 'X RPL 1', '2024003-1729526403000'),
('Dewi Lestari', '2024004', 'X RPL 1', '2024004-1729526404000'),
('Eko Prasetyo', '2024005', 'X RPL 1', '2024005-1729526405000');

-- Kelas X RPL 2
INSERT INTO students (name, nis, class, qr_code) VALUES
('Fitri Handayani', '2024006', 'X RPL 2', '2024006-1729526406000'),
('Gilang Ramadhan', '2024007', 'X RPL 2', '2024007-1729526407000'),
('Hana Melati', '2024008', 'X RPL 2', '2024008-1729526408000'),
('Indra Gunawan', '2024009', 'X RPL 2', '2024009-1729526409000'),
('Joko Susilo', '2024010', 'X RPL 2', '2024010-1729526410000');

-- Kelas X TKJ 1
INSERT INTO students (name, nis, class, qr_code) VALUES
('Kartika Sari', '2024011', 'X TKJ 1', '2024011-1729526411000'),
('Lukman Hakim', '2024012', 'X TKJ 1', '2024012-1729526412000'),
('Maya Puspita', '2024013', 'X TKJ 1', '2024013-1729526413000'),
('Nanda Pratama', '2024014', 'X TKJ 1', '2024014-1729526414000'),
('Oki Setiawan', '2024015', 'X TKJ 1', '2024015-1729526415000');

-- Kelas XI RPL 1
INSERT INTO students (name, nis, class, qr_code) VALUES
('Putri Amelia', '2023001', 'XI RPL 1', '2023001-1729526416000'),
('Qori Saputra', '2023002', 'XI RPL 1', '2023002-1729526417000'),
('Rina Wijaya', '2023003', 'XI RPL 1', '2023003-1729526418000'),
('Surya Pratama', '2023004', 'XI RPL 1', '2023004-1729526419000'),
('Tina Mariana', '2023005', 'XI RPL 1', '2023005-1729526420000');

-- Kelas XII RPL 1
INSERT INTO students (name, nis, class, qr_code) VALUES
('Umar Bakri', '2022001', 'XII RPL 1', '2022001-1729526421000'),
('Vina Amalia', '2022002', 'XII RPL 1', '2022002-1729526422000'),
('Wahyu Hidayat', '2022003', 'XII RPL 1', '2022003-1729526423000'),
('Xena Purnama', '2022004', 'XII RPL 1', '2022004-1729526424000'),
('Yudi Setiawan', '2022005', 'XII RPL 1', '2022005-1729526425000');

-- ============================================
-- 2. Insert Sample Attendance (Hari Ini)
-- ============================================

-- Absensi tepat waktu (sebelum jam 8:00)
INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE,
    '07:30:00',
    'hadir'
FROM students 
WHERE nis IN ('2024001', '2024002', '2024006', '2024011', '2023001', '2022001');

-- Absensi telat (setelah jam 8:00)
INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE,
    '08:15:00',
    'telat'
FROM students 
WHERE nis IN ('2024003', '2024007', '2024012', '2023002');

-- Absensi sangat telat
INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE,
    '09:30:00',
    'telat'
FROM students 
WHERE nis IN ('2024004', '2024008');

-- ============================================
-- 3. Insert Sample Attendance (Kemarin)
-- ============================================

INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE - INTERVAL '1 day',
    '07:25:00',
    'hadir'
FROM students 
WHERE nis IN ('2024001', '2024002', '2024003', '2024004', '2024005');

INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE - INTERVAL '1 day',
    '08:10:00',
    'telat'
FROM students 
WHERE nis IN ('2024006', '2024007', '2024008');

-- ============================================
-- 4. Insert Sample Attendance (Minggu Lalu)
-- ============================================

-- Senin minggu lalu
INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE - INTERVAL '7 days',
    '07:30:00',
    'hadir'
FROM students 
WHERE class = 'X RPL 1';

-- Selasa minggu lalu
INSERT INTO attendance (student_id, date, time, status)
SELECT 
    id,
    CURRENT_DATE - INTERVAL '6 days',
    '07:35:00',
    'hadir'
FROM students 
WHERE class IN ('X RPL 1', 'X RPL 2');

-- ============================================
-- 5. Verify Data
-- ============================================

-- Cek jumlah siswa per kelas
-- SELECT class, COUNT(*) as total_siswa FROM students GROUP BY class ORDER BY class;

-- Cek absensi hari ini
-- SELECT COUNT(*) as total_absen_hari_ini FROM attendance WHERE date = CURRENT_DATE;

-- Cek status absensi hari ini
-- SELECT status, COUNT(*) as jumlah FROM attendance WHERE date = CURRENT_DATE GROUP BY status;

-- Lihat detail absensi hari ini
-- SELECT 
--     s.nis,
--     s.name,
--     s.class,
--     a.time,
--     a.status
-- FROM attendance a
-- JOIN students s ON a.student_id = s.id
-- WHERE a.date = CURRENT_DATE
-- ORDER BY a.time;

-- ============================================
-- 6. Clean Up (Jika Ingin Hapus Sample Data)
-- ============================================

-- PERINGATAN: Jangan jalankan ini kecuali Anda ingin menghapus semua data!

-- DELETE FROM attendance WHERE student_id IN (
--     SELECT id FROM students WHERE nis LIKE '2022%' OR nis LIKE '2023%' OR nis LIKE '2024%'
-- );
-- DELETE FROM students WHERE nis LIKE '2022%' OR nis LIKE '2023%' OR nis LIKE '2024%';

-- ============================================
-- Notes:
-- ============================================
-- 1. Data ini menggunakan format NIS:
--    - 2024xxx = Kelas X (angkatan 2024)
--    - 2023xxx = Kelas XI (angkatan 2023)
--    - 2022xxx = Kelas XII (angkatan 2022)
--
-- 2. QR Code format: {NIS}-{timestamp}
--
-- 3. Status absensi:
--    - 'hadir' = datang sebelum jam 08:00
--    - 'telat' = datang jam 08:00 atau setelahnya
--
-- 4. Untuk testing, Anda bisa:
--    - Gunakan data siswa di atas
--    - Generate QR code dari halaman /students
--    - Test scan dengan QR code tersebut
--    - Lihat laporan di /attendance
--
-- 5. Untuk production:
--    - Hapus sample data ini
--    - Gunakan data siswa real
--    - Backup database secara berkala
-- ============================================
