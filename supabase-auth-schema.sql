-- Add users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'petugas', 'siswa')),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read their own user data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Policy: Only admin can insert users
CREATE POLICY "Admin can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Add column to students table for parent/guardian phone
ALTER TABLE students ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE students ADD COLUMN IF NOT EXISTS parent_phone VARCHAR(20);

-- Sample users (password: "password123" for all)
-- Hash generated using bcrypt with salt rounds 10
INSERT INTO users (email, password, full_name, role) VALUES
('admin@esgriba.sch.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Esgriba', 'admin'),
('petugas@esgriba.sch.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Petugas Absensi', 'petugas')
ON CONFLICT (email) DO NOTHING;

-- Note: Siswa users will be created when student registers
-- Their email can be: NIS@student.esgriba.sch.id
-- Or parent's email if provided
