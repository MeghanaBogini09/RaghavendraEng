const useSqlite =
  process.env.DB_TYPE === 'sqlite' ||
  (process.env.NODE_ENV === 'production' && !process.env.DB_HOST);

module.exports = useSqlite ? require('./db-sqlite') : require('./db-mysql');
