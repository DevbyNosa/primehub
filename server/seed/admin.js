import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { query } from '../config/database.js';


dotenv.config();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    const existing = await query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@primehub.com']
    );

    if (existing.rows.length > 0) {
      return;
    }

    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING *`,
      ['Admin', 'admin@primehub.com', hashedPassword]
    );

    console.log('✅ Admin created!');
    console.log('📧 Email: admin@primehub.com');
    console.log('🔑 Password: Admin123!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdmin();