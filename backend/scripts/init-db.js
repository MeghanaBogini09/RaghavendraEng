require('dotenv').config();
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

async function seedAdmin() {
  const pool = await getPool();
  const username = 'Administrator';
  const password = 'Admin@123';
  const hash = bcrypt.hashSync(password, 10);

  const [existing] = await pool.query('SELECT id FROM admins WHERE username = ?', [username]);
  if (existing.length === 0) {
    await pool.query(
      'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, 'Administrator']
    );
    console.log('Default admin created: Administrator / Admin@123');
  }
}

async function ensureTables() {
  const pool = await getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'Administrator',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS generators (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      power_kva DECIMAL(10,2) NOT NULL,
      frequency VARCHAR(10) NOT NULL DEFAULT '50Hz',
      description TEXT NOT NULL,
      price DECIMAL(12,2) NOT NULL DEFAULT 0,
      image_url VARCHAR(500) NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quotation_no VARCHAR(50) NOT NULL,
      customer_name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NULL,
      phone VARCHAR(20) NOT NULL,
      company VARCHAR(200) NULL,
      address VARCHAR(500) NOT NULL,
      brand VARCHAR(100) NULL,
      equipment_details TEXT NULL,
      power_kva VARCHAR(100) NULL,
      selected_services JSON NOT NULL,
      message TEXT NULL,
      urgency VARCHAR(50) NOT NULL DEFAULT 'Normal',
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_quotations_status (status),
      INDEX idx_quotations_created (created_at)
    )
  `);

  await seedAdmin();
}

module.exports = { ensureTables, seedAdmin };
