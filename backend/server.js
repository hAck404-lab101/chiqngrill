require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('Blocked by CORS:', origin);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '2mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '2mb' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Chiq-N-Grill API is running',
    status: 'online',
    health: '/health',
    api: '/api'
  });
});

app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, status: 'ok', message: 'Chiq-N-Grill API is healthy' });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Chiq-N-Grill API',
    availableRoutes: {
      menu: '/api/menu',
      categories: '/api/menu/categories',
      restaurant: '/api/menu/restaurant',
      orders: '/api/orders',
      reservations: '/api/reservations',
      dashboard: '/api/dashboard',
      admin: '/api/admin'
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '1h', etag: true }));

const generalLimiter = rateLimit({
  windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parseNumber(process.env.RATE_LIMIT_MAX, 1000),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' }
});

const authLimiter = rateLimit({
  windowMs: parseNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again shortly.' }
});

app.use('/api/', generalLimiter);
app.use('/api/admin/login', authLimiter);

app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/reservations', require('./src/routes/reservations'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/admin', require('./src/routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(PORT, () => console.log(`Chiq-N-Grill API running on port ${PORT}`));
  server.keepAliveTimeout = parseNumber(process.env.SERVER_KEEP_ALIVE_TIMEOUT_MS, 65000);
  server.headersTimeout = parseNumber(process.env.SERVER_HEADERS_TIMEOUT_MS, 66000);
}

module.exports = app;
