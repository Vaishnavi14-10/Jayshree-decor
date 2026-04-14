const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all invoices with client info
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT i.*, c.name AS client_name, c.phone AS client_phone
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      ORDER BY i.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single invoice with items
router.get('/:id', async (req, res) => {
  try {
    const { rows: invoiceRows } = await pool.query(`
      SELECT i.*, c.name AS client_name, c.phone AS client_phone, c.address AS client_address
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.id = $1
    `, [req.params.id]);

    if (!invoiceRows.length) return res.status(404).json({ error: 'Invoice not found' });

    const { rows: items } = await pool.query(
      'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id',
      [req.params.id]
    );

    res.json({ ...invoiceRows[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET next invoice number
router.get('/meta/next-number', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT invoice_number FROM invoices ORDER BY id DESC LIMIT 1
    `);
    let next = 'JD-001';
    if (rows.length) {
      const last = rows[0].invoice_number;
      const num = parseInt(last.split('-')[1] || '0') + 1;
      next = `JD-${String(num).padStart(3, '0')}`;
    }
    res.json({ invoice_number: next });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create invoice
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      client_name, client_phone, client_address,
      event_type, invoice_number, invoice_date, event_date,
      discount_percent, tax_percent, subtotal, discount_amount,
      tax_amount, grand_total, notes, status, items
    } = req.body;

    // Upsert client
    let clientId;
    const existing = await client.query(
      'SELECT id FROM clients WHERE phone = $1 LIMIT 1', [client_phone]
    );
    if (existing.rows.length) {
      await client.query(
        'UPDATE clients SET name=$1, address=$2 WHERE id=$3',
        [client_name, client_address, existing.rows[0].id]
      );
      clientId = existing.rows[0].id;
    } else {
      const { rows } = await client.query(
        'INSERT INTO clients (name, phone, address) VALUES ($1,$2,$3) RETURNING id',
        [client_name, client_phone, client_address]
      );
      clientId = rows[0].id;
    }

    // Insert invoice
    const { rows: invRows } = await client.query(`
      INSERT INTO invoices
        (invoice_number, client_id, event_type, invoice_date, event_date,
         discount_percent, tax_percent, subtotal, discount_amount, tax_amount, grand_total, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id
    `, [
      invoice_number, clientId, event_type, invoice_date, event_date,
      discount_percent, tax_percent, subtotal, discount_amount,
      tax_amount, grand_total, notes, status || 'unpaid'
    ]);

    const invoiceId = invRows[0].id;

    // Insert items
    for (const item of items) {
      await client.query(`
        INSERT INTO invoice_items (invoice_id, category, description, quantity, rate, amount)
        VALUES ($1,$2,$3,$4,$5,$6)
      `, [invoiceId, item.category, item.description, item.quantity, item.rate, item.amount]);
    }

    await client.query('COMMIT');
    res.status(201).json({ id: invoiceId, invoice_number });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query(
      'UPDATE invoices SET status=$1, updated_at=NOW() WHERE id=$2',
      [status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM invoices WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET dashboard stats
router.get('/meta/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_invoices,
        COALESCE(SUM(grand_total),0) AS total_revenue,
        COALESCE(SUM(CASE WHEN status='paid' THEN grand_total ELSE 0 END),0) AS paid_amount,
        COALESCE(SUM(CASE WHEN status='unpaid' THEN grand_total ELSE 0 END),0) AS unpaid_amount,
        COUNT(CASE WHEN status='paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN status='unpaid' THEN 1 END) AS unpaid_count
      FROM invoices
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
