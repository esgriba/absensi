-- Tabel untuk menyimpan data siswa
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  nis VARCHAR(50) UNIQUE NOT NULL,
  class VARCHAR(50) NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk menyimpan data absensi
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  time TIME DEFAULT CURRENT_TIME,
  status VARCHAR(20) DEFAULT 'hadir',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk meningkatkan performa query
CREATE INDEX IF NOT EXISTS idx_students_nis ON students(nis);
CREATE INDEX IF NOT EXISTS idx_students_qr_code ON students(qr_code);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy untuk students (allow all operations untuk development)
CREATE POLICY "Enable all operations for students" ON students
  FOR ALL USING (true) WITH CHECK (true);

-- Policy untuk attendance (allow all operations untuk development)
CREATE POLICY "Enable all operations for attendance" ON attendance
  FOR ALL USING (true) WITH CHECK (true);
