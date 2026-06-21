const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getPool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads', 'generators');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

function mapGenerator(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    type: row.type,
    powerKVA: parseFloat(row.power_kva),
    frequency: row.frequency,
    description: row.description,
    price: parseFloat(row.price),
    imageUrl: row.image_url || '',
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}

router.get('/', async (req, res) => {
  try {
    const { type, brand, minKVA, maxKVA } = req.query;
    const pool = await getPool();
    let query = `
      SELECT id, name, brand, type, power_kva, frequency, description, price, image_url, is_active, created_at
      FROM generators WHERE is_active = 1
    `;
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }
    if (minKVA) {
      query += ' AND power_kva >= ?';
      params.push(parseFloat(minKVA));
    }
    if (maxKVA) {
      query += ' AND power_kva <= ?';
      params.push(parseFloat(maxKVA));
    }

    query += ' ORDER BY power_kva';

    const [rows] = await pool.query(query, params);
    res.json(rows.map(mapGenerator));
  } catch (err) {
    console.error('Generators error:', err.message);
    res.status(500).json({ error: 'Failed to fetch generators' });
  }
});

router.get('/admin/all', authMiddleware, async (_req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, name, brand, type, power_kva, frequency, description, price, image_url, is_active, created_at
       FROM generators ORDER BY created_at DESC`
    );
    res.json(rows.map(mapGenerator));
  } catch (err) {
    console.error('Admin generators error:', err.message);
    res.status(500).json({ error: 'Failed to fetch generators' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, name, brand, type, power_kva, frequency, description, price, image_url, is_active, created_at
       FROM generators WHERE id = ? AND is_active = 1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Generator not found' });
    }
    res.json(mapGenerator(rows[0]));
  } catch (err) {
    console.error('Generator detail error:', err.message);
    res.status(500).json({ error: 'Failed to fetch generator' });
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, type, powerKVA, frequency, description, price } = req.body;

    if (!name || !brand || !type || !powerKVA || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imageUrl = req.file ? `/uploads/generators/${req.file.filename}` : null;
    const pool = await getPool();

    const [result] = await pool.query(
      `INSERT INTO generators (name, brand, type, power_kva, frequency, description, price, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        brand,
        type,
        parseFloat(powerKVA),
        frequency || '50Hz',
        description,
        parseFloat(price || 0),
        imageUrl,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, brand, type, power_kva, frequency, description, price, image_url, is_active, created_at
       FROM generators WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(mapGenerator(rows[0]));
  } catch (err) {
    console.error('Generator create error:', err.message);
    res.status(500).json({ error: 'Failed to create generator' });
  }
});

router.put('/:id/image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const pool = await getPool();
    const [existing] = await pool.query('SELECT image_url FROM generators WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Generator not found' });
    }

    const imageUrl = `/uploads/generators/${req.file.filename}`;

    if (existing[0].image_url) {
      const oldPath = path.join(__dirname, '..', existing[0].image_url.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await pool.query('UPDATE generators SET image_url = ? WHERE id = ?', [imageUrl, req.params.id]);

    const [rows] = await pool.query(
      `SELECT id, name, brand, type, power_kva, frequency, description, price, image_url, is_active, created_at
       FROM generators WHERE id = ?`,
      [req.params.id]
    );

    res.json(mapGenerator(rows[0]));
  } catch (err) {
    console.error('Generator image update error:', err.message);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pool = await getPool();
    const [existing] = await pool.query('SELECT image_url FROM generators WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Generator not found' });
    }

    await pool.query('UPDATE generators SET is_active = 0 WHERE id = ?', [req.params.id]);

    if (existing[0].image_url) {
      const oldPath = path.join(__dirname, '..', existing[0].image_url.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    res.json({ message: 'Generator removed' });
  } catch (err) {
    console.error('Generator delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete generator' });
  }
});

module.exports = router;
