require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getPool, resetPool } = require('./config/db');
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

let dbReady = false;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', database: dbReady ? 'connected' : 'connecting' });
});

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
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

  app.get(['/admin', '/admin/*'], (_req, res) => {
    res.redirect(`${frontendUrl}/admin/login`);
  });

  app.get('/', (_req, res) => {
    res.json({
      message: 'Raghavendra Engineers API (backend only)',
      website: frontendUrl,
      admin: `${frontendUrl}/admin/login`,
      health: '/api/health',
      docs: {
        auth: '/api/auth',
        generators: '/api/generators',
        quotations: '/api/quotations',
      },
    });
  });
}

async function connectDatabase(retries = 10, delayMs = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      resetPool();
      await ensureTables();
      dbReady = true;
      console.log('Database connected and tables ready.');
      return;
    } catch (err) {
      dbReady = false;
      console.error(`Database connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt === retries) {
        console.error('Could not connect to MySQL. Set DB_HOST, DB_USER, DB_PASSWORD in Render env vars.');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start() {
  fs.mkdirSync(path.join(__dirname, 'uploads', 'generators'), { recursive: true });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Raghavendra Engineers running on port ${PORT}`);
    if (isProduction && fs.existsSync(FRONTEND_DIST)) {
      console.log('Serving frontend from', FRONTEND_DIST);
    }
    console.log('Admin login: Administrator / Admin@123');
    connectDatabase();
  });
}

start();
