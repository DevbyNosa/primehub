import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    //  Use connection string if provided, otherwise fallback to individual params
    connectionString: process.env.DATABASE_URL,
    
    //  SSL is required for Supabase
    ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,  // Disable SSL locally if you want
    
    //  Keep existing settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, //  Increased from 2000 for cloud DB
    
    //  Fallback to individual params if no DATABASE_URL
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'ecommerce_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});


async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time');
        console.log('✅ Database connected successfully at:', result.rows[0].current_time);
        client.release();
        return true;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        if (err.stack) {
            console.error('Stack:', err.stack);
        }
        return false;
    }
}

// ✅ Run connection test
testConnection();

export const query = (text, params) => pool.query(text, params);
export { pool };