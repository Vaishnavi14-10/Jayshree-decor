const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'jayshree_decor',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        event_type VARCHAR(100),
        invoice_date DATE NOT NULL,
        event_date DATE,
        discount_percent NUMERIC(5,2) DEFAULT 0,
        tax_percent NUMERIC(5,2) DEFAULT 0,
        subtotal NUMERIC(12,2) DEFAULT 0,
        discount_amount NUMERIC(12,2) DEFAULT 0,
        tax_amount NUMERIC(12,2) DEFAULT 0,
        grand_total NUMERIC(12,2) DEFAULT 0,
        notes TEXT,
        status VARCHAR(30) DEFAULT 'unpaid',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
        rate NUMERIC(12,2) NOT NULL DEFAULT 0,
        amount NUMERIC(12,2) NOT NULL DEFAULT 0
      );
    `);
    console.log('✅ Database tables initialized');
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
