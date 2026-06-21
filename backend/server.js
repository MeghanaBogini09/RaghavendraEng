require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { getPool, resetPool, getLastDbError, setLastDbError } = require('./config/db');
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

app.get('/health', async (_req, res) => {
  try {
    await getPool();
    if (dbReady) {
      return res.json({ status: 'ok', database: 'connected' });
    }
    res.json({ status: 'ok', database: 'connecting', message: getLastDbError() || 'Setting up tables...' });
  } catch (err) {
    setLastDbError(err);
    res.status(503).json({ status: 'error', database: 'disconnected', message: err.message });
  }
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

async function connectDatabase(retries = 30, delayMs = 10000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await ensureTables();
      dbReady = true;
      console.log('Database connected and tables ready.');
      return;
    } catch (err) {
      dbReady = false;
      setLastDbError(err);
      console.error(`Database setup attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt === retries) {
        console.error('Table setup paused. Will keep retrying in background.');
        scheduleDbRetry();
        return;
      }
      resetPool();
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

function scheduleDbRetry() {
  setTimeout(async () => {
    try {
      resetPool();
      await ensureTables();
      dbReady = true;
      setLastDbError(null);
      console.log('Database connected and tables ready (background retry).');
    } catch (err) {
      setLastDbError(err);
      console.error('Background DB retry failed:', err.message);
      scheduleDbRetry();
    }
  }, 30000);
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
