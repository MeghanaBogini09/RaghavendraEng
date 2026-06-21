require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getPool } = require('./config/db');
const { ensureTables } = require('./scripts/init-db');

const authRouter = require('./routes/auth');
const generatorsRouter = require('./routes/generators');
const quotationsRouter = require('./routes/quotations');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist/frontend/browser');

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:4200', 'http://127.0.0.1:4200'];

if (!isProduction) {
  app.use(cors({ origin: corsOrigins }));
} else if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: corsOrigins }));
}

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

if (isProduction && fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      message: 'Raghavendra Engineers API',
      health: '/api/health',
      docs: {
        auth: '/api/auth',
        generators: '/api/generators',
        quotations: '/api/quotations',
      },
    });
  });
}

async function start() {
  try {
    await ensureTables();
    app.listen(PORT, () => {
      console.log(`Raghavendra Engineers API running on port ${PORT}`);
      if (isProduction && fs.existsSync(FRONTEND_DIST)) {
        console.log('Serving frontend from', FRONTEND_DIST);
      }
      console.log('Admin login: Administrator / Admin@123');
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Ensure MySQL is running and .env credentials are correct.');
    process.exit(1);
  }
}

start();
