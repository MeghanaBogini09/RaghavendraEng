const express = require('express');
const { getPool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

function mapQuotation(row) {
  return {
    id: row.id,
    quotationNo: row.quotation_no,
    customerName: row.customer_name,
    email: row.email || '',
    phone: row.phone,
    company: row.company || '',
    address: row.address,
    brand: row.brand || '',
    equipmentDetails: row.equipment_details || '',
    powerKVA: row.power_kva || '',
    selectedServices: typeof row.selected_services === 'string'
      ? JSON.parse(row.selected_services)
      : row.selected_services,
    message: row.message || '',
    urgency: row.urgency,
    status: row.status,
    createdAt: row.created_at,
  };
}

router.post('/', async (req, res) => {
  try {
    const {
      quotationNo,
      customerName,
      email,
      phone,
      company,
      address,
      brand,
      equipmentDetails,
      powerKVA,
      selectedServices,
      message,
      urgency,
    } = req.body;

    if (!customerName || !phone || !address || !selectedServices?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pool = await getPool();
    const qNo = quotationNo || `SRES/QR/${Date.now()}`;

    const [result] = await pool.query(
      `INSERT INTO quotations
        (quotation_no, customer_name, email, phone, company, address, brand,
         equipment_details, power_kva, selected_services, message, urgency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        qNo,
        customerName,
        email || null,
        phone,
        company || null,
        address,
        brand || null,
        equipmentDetails || null,
        powerKVA || null,
        JSON.stringify(selectedServices),
        message || null,
        urgency || 'Normal',
      ]
    );

    const [rows] = await pool.query('SELECT * FROM quotations WHERE id = ?', [result.insertId]);
    res.status(201).json(mapQuotation(rows[0]));
  } catch (err) {
    console.error('Quotation submit error:', err.message);
    res.status(500).json({ error: 'Failed to submit quotation' });
  }
});

router.get('/', authMiddleware, async (_req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM quotations ORDER BY created_at DESC');
    res.json(rows.map(mapQuotation));
  } catch (err) {
    console.error('Quotations list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Reviewed', 'Quoted', 'Closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const pool = await getPool();
    const [result] = await pool.query('UPDATE quotations SET status = ? WHERE id = ?', [
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const [rows] = await pool.query('SELECT * FROM quotations WHERE id = ?', [req.params.id]);
    res.json(mapQuotation(rows[0]));
  } catch (err) {
    console.error('Quotation status error:', err.message);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
