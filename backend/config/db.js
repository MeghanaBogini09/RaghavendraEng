const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raghavendra_enge_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_SSL === 'true') {
  config.ssl = { rejectUnauthorized: false };
}

let pool = null;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(config);
    await pool.query('SELECT 1');
  }
  return pool;
}

function resetPool() {
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
  }
}

module.exports = { getPool, resetPool, config };
