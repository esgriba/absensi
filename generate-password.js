// Script untuk generate password hash dengan bcrypt
// Jalankan: node generate-password.js

const bcrypt = require('bcryptjs');

async function generatePassword() {
  const password = 'password123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n=== PASSWORD HASH GENERATOR ===\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n=== SQL UNTUK SUPABASE ===\n');
    console.log(`-- Akun Admin`);
    console.log(`INSERT INTO users (email, password, full_name, role) VALUES`);
    console.log(`('admin@esgriba.sch.id', '${hash}', 'Admin Sekolah', 'admin');`);
    console.log('');
    console.log(`-- Akun Petugas`);
    console.log(`INSERT INTO users (email, password, full_name, role) VALUES`);
    console.log(`('petugas@esgriba.sch.id', '${hash}', 'Petugas Absensi', 'petugas');`);
    console.log('\n================================\n');
    
    // Test verification
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification test:', isValid ? '✓ Valid' : '✗ Invalid');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePassword();
