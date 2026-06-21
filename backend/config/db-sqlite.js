const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = process.env.SQLITE_PATH || path.join(dataDir, 'raghavendra.db');

let db = null;
let pool = null;
let lastDbError = null;

function createPoolAdapter(database) {
  return {
    async query(sql, params = []) {
      const trimmed = sql.trim();
      const upper = trimmed.toUpperCase();

      if (upper.startsWith('SELECT')) {
        const rows = database.prepare(trimmed).all(...params);
        return [rows];
      }

      if (upper.startsWith('INSERT')) {
        const info = database.prepare(trimmed).run(...params);
        return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }];
      }

      if (upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
        const info = database.prepare(trimmed).run(...params);
        return [{ insertId: 0, affectedRows: info.changes }];
      }

      database.exec(trimmed);
      return [[]];
    },
  };
}

async function getPool() {
  if (!pool) {
    fs.mkdirSync(dataDir, { recursive: true });
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    pool = createPoolAdapter(db);
    await pool.query('SELECT 1');
    lastDbError = null;
    console.log('SQLite database ready at', dbPath);
  }
  return pool;
}

function resetPool() {
  if (db) {
    db.close();
    db = null;
    pool = null;
  }
}

function getLastDbError() {
  return lastDbError;
}

function setLastDbError(err) {
  lastDbError = err?.message || String(err);
}

module.exports = { getPool, resetPool, getLastDbError, setLastDbError, config: { path: dbPath } };
