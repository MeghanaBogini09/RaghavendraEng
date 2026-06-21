require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getPool } = require('./config/db');
const { ensureTables } = require('./scripts/init-db');

const authRouter = require('./routes/auth');
const generatorsRouter = require('./routes/generators');
const quotationsRouter = require('./routes/quotations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (_req, res) => {
  try {
    await getPool();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', message: err.message });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/generators', generatorsRouter);
app.use('/api/quotations', quotationsRouter);

async function start() {
  try {
    await ensureTables();
    app.listen(PORT, () => {
      console.log(`Raghavendra Engineers API running on http://localhost:${PORT}`);
      console.log('Admin login: Administrator / Admin@123');
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Ensure MySQL is running and .env credentials are correct.');
    process.exit(1);
  }
}

start();
