const express = require('express');
const { getPool, sql } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id AS id, Name AS name, Description AS description,
             Icon AS icon, PriceFrom AS priceFrom
      FROM Services WHERE IsActive = 1 ORDER BY Id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Services error:', err.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

module.exports = router;
