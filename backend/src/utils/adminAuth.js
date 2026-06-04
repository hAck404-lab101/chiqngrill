const crypto = require('crypto');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

function getAdminConfig() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@chiqngrill.local',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    secret: process.env.ADMIN_SESSION_SECRET || 'change-this-secret-before-production'
  };
}

function base64Url(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
}

function signPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createAdminToken(email) {
  const { secret } = getAdminConfig();
  const header = base64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = base64Url({ email, role: 'admin', exp: Date.now() + TOKEN_TTL_MS });
  const signature = signPayload(`${header}.${payload}`, secret);
  return `${header}.${payload}.${signature}`;
}

function verifyAdminToken(token) {
  const { secret } = getAdminConfig();
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expected = signPayload(`${header}.${payload}`, secret);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!data.exp || Date.now() > data.exp) return null;
  if (data.role !== 'admin') return null;

  return data;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const admin = verifyAdminToken(token);

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }

  req.admin = admin;
  next();
}

function validateAdminLogin(email, password) {
  const config = getAdminConfig();
  return email === config.email && password === config.password;
}

module.exports = {
  createAdminToken,
  requireAdmin,
  validateAdminLogin,
  getAdminConfig
};
