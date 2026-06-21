const dns = require('dns').promises;
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raghavendra_enge_db',
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  connectTimeout: 60000,
  maxIdle: 1,
  idleTimeout: 60000,
};

if (process.env.DB_SSL === 'true') {
  config.ssl = { rejectUnauthorized: false };
}

let pool = null;
let lastDbError = null;
let hostResolved = false;

async function resolveDbHost() {
  if (hostResolved || config.host === 'localhost' || config.host === '127.0.0.1') {
    hostResolved = true;
    return;
  }
  try {
    const { address } = await dns.lookup(config.host, { family: 4 });
    config.host = address;
    console.log(`Resolved database host to ${address}`);
  } catch (err) {
    console.warn(`Could not resolve ${config.host} to IPv4:`, err.message);
  }
  hostResolved = true;
}

async function getPool() {
  if (!pool) {
    await resolveDbHost();
    pool = mysql.createPool(config);
    await pool.query('SELECT 1');
    lastDbError = null;
  }
  return pool;
}

function resetPool() {
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
  }
}

function getLastDbError() {
  return lastDbError;
}

function setLastDbError(err) {
  if (err?.errors?.length) {
    lastDbError = err.errors.map((e) => e.message).join('; ');
    return;
  }
  lastDbError = err?.message || String(err);
}

module.exports = { getPool, resetPool, getLastDbError, setLastDbError, config };
