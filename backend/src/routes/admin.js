const express = require('express');
const { restaurant, settings, menuItems, galleryItems, homepageContent, orders, reservations, auditLogs, addAuditLog, saveData } = require('../../data/seed');
const { createAdminToken, requireAdmin, validateAdminLogin, getAdminConfig } = require('../utils/adminAuth');

const router = express.Router();

const orderStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for delivery', 'Completed', 'Cancelled'];
const reservationStatuses = ['Pending', 'Confirmed', 'Declined', 'Completed', 'Cancelled'];

function findOrderByReference(reference) {
  const cleanReference = decodeURIComponent(String(reference || '')).trim().toUpperCase();
  return orders.find((entry) => String(entry.reference || '').trim().toUpperCase() === cleanReference);
}

function findReservationByReference(reference) {
  const cleanReference = decodeURIComponent(String(reference || '')).trim().toUpperCase();
  return reservations.find((entry) => String(entry.reference || '').trim().toUpperCase() === cleanReference);
}

function normalizeOrderStatus(status) {
  if (status === 'Accepted') return 'Pending';
  if (status === 'Out for delivery') return 'Ready';
  if (status === 'Cancelled') return 'Completed';
  return status || 'Pending';
}

function getNextOrderStatus(status) {
  const normalized = normalizeOrderStatus(status);
  if (normalized === 'Pending') return 'Preparing';
  if (normalized === 'Preparing') return 'Ready';
  if (normalized === 'Ready') return 'Completed';
  return 'Completed';
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!validateAdminLogin(email, password)) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = createAdminToken(email);

  res.json({
    success: true,
    message: 'Admin login successful',
    data: {
      token,
      admin: { email, role: 'admin' }
    }
  });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ success: true, data: { email: req.admin.email, role: req.admin.role } });
});

router.get('/setup-status', (req, res) => {
  const config = getAdminConfig();
  res.json({
    success: true,
    data: {
      hasCustomEmail: Boolean(process.env.ADMIN_EMAIL),
      hasCustomPassword: Boolean(process.env.ADMIN_PASSWORD),
      hasCustomSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      defaultEmail: config.email,
      productionReady: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
    }
  });
});

router.get('/dashboard', requireAdmin, (req, res) => {
  const revenue = orders.reduce((total, order) => total + Number(order.total || order.subtotal || 0), 0);

  res.json({
    success: true,
    data: {
      totals: {
        orders: orders.length,
        reservations: reservations.length,
        menuItems: menuItems.length,
        galleryItems: galleryItems.length,
        revenue
      },
      recentOrders: orders.slice(0, 8),
      recentReservations: reservations.slice(0, 8),
      homepageContent,
      restaurant,
      settings
    }
  });
});

router.get('/menu', requireAdmin, (req, res) => {
  res.json({ success: true, data: menuItems });
});

router.post('/menu', requireAdmin, (req, res) => {
  const { name, category, description, priceFrom, spiceLevel, prepTime, badge, available, imageUrl } = req.body;

  if (!name || !category || !priceFrom) {
    return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
  }

  const item = {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name,
    category,
    description: description || '',
    priceFrom: Number(priceFrom),
    spiceLevel: spiceLevel || 'Medium',
    prepTime: prepTime || '20–30 min',
    badge: badge || 'Menu item',
    available: available !== false,
    imageUrl: imageUrl || ''
  };

  menuItems.unshift(item);
  saveData();
  addAuditLog('menu.created', req.admin.email, { itemId: item.id, name: item.name });
  res.status(201).json({ success: true, message: 'Menu item added', data: item });
});

router.patch('/menu/:id', requireAdmin, (req, res) => {
  const item = menuItems.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });

  Object.assign(item, {
    ...req.body,
    priceFrom: req.body.priceFrom !== undefined ? Number(req.body.priceFrom) : item.priceFrom
  });

  saveData();
  addAuditLog('menu.updated', req.admin.email, { itemId: item.id, name: item.name });
  res.json({ success: true, message: 'Menu item updated', data: item });
});

router.delete('/menu/:id', requireAdmin, (req, res) => {
  const index = menuItems.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Menu item not found' });

  const [deleted] = menuItems.splice(index, 1);
  saveData();
  addAuditLog('menu.deleted', req.admin.email, { itemId: deleted.id, name: deleted.name });
  res.json({ success: true, message: 'Menu item deleted', data: deleted });
});

router.get('/gallery', requireAdmin, (req, res) => {
  res.json({ success: true, data: galleryItems });
});

router.post('/gallery', requireAdmin, (req, res) => {
  const { title, category, imageUrl, isFeatured } = req.body;

  if (!title) return res.status(400).json({ success: false, message: 'Gallery title is required' });

  const item = {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title,
    category: category || 'Food',
    imageUrl: imageUrl || '',
    isFeatured: Boolean(isFeatured)
  };

  galleryItems.unshift(item);
  saveData();
  addAuditLog('gallery.created', req.admin.email, { itemId: item.id, title: item.title });
  res.status(201).json({ success: true, message: 'Gallery item added', data: item });
});

router.patch('/gallery/:id', requireAdmin, (req, res) => {
  const item = galleryItems.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

  Object.assign(item, req.body);
  saveData();
  addAuditLog('gallery.updated', req.admin.email, { itemId: item.id, title: item.title });
  res.json({ success: true, message: 'Gallery item updated', data: item });
});

router.get('/homepage', requireAdmin, (req, res) => {
  res.json({ success: true, data: homepageContent });
});

router.patch('/homepage', requireAdmin, (req, res) => {
  Object.assign(homepageContent, req.body);
  saveData();
  addAuditLog('homepage.updated', req.admin.email, { fields: Object.keys(req.body || {}) });
  res.json({ success: true, message: 'Homepage content updated', data: homepageContent });
});

router.get('/settings', requireAdmin, (req, res) => {
  res.json({ success: true, data: { restaurant, settings } });
});

router.patch('/settings', requireAdmin, (req, res) => {
  const { restaurant: restaurantPayload, settings: settingsPayload, ...legacyRestaurantPayload } = req.body || {};

  if (restaurantPayload && typeof restaurantPayload === 'object') Object.assign(restaurant, restaurantPayload);
  if (Object.keys(legacyRestaurantPayload).length > 0) Object.assign(restaurant, legacyRestaurantPayload);
  if (settingsPayload && typeof settingsPayload === 'object') {
    Object.assign(settings, settingsPayload);
    if (settingsPayload.businessHours) Object.assign(settings.businessHours, settingsPayload.businessHours);
    if (Array.isArray(settingsPayload.deliveryZones)) settings.deliveryZones = settingsPayload.deliveryZones;
  }

  saveData();
  addAuditLog('settings.updated', req.admin.email, { restaurantFields: Object.keys(restaurantPayload || legacyRestaurantPayload || {}), settingsFields: Object.keys(settingsPayload || {}) });
  res.json({ success: true, message: 'Settings updated', data: { restaurant, settings } });
});

router.get('/audit-logs', requireAdmin, (req, res) => {
  res.json({ success: true, data: auditLogs.slice(0, 250) });
});

router.get('/orders', requireAdmin, (req, res) => {
  res.json({ success: true, data: orders });
});

router.patch('/orders/:reference/status', requireAdmin, (req, res) => {
  const order = findOrderByReference(req.params.reference);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const { status } = req.body;
  if (!orderStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  const oldStatus = order.status;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveData();
  addAuditLog('order.status_changed', req.admin.email, { reference: order.reference, from: oldStatus, to: status });

  res.json({ success: true, message: 'Order status updated', data: order });
});

router.post('/orders/:reference/move-forward', requireAdmin, (req, res) => {
  const order = findOrderByReference(req.params.reference);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const oldStatus = order.status;
  order.status = getNextOrderStatus(order.status);
  order.updatedAt = new Date().toISOString();
  saveData();
  addAuditLog('order.moved_forward', req.admin.email, { reference: order.reference, from: oldStatus, to: order.status });

  res.json({ success: true, message: 'Order moved forward', data: order });
});

router.get('/reservations', requireAdmin, (req, res) => {
  res.json({ success: true, data: reservations });
});

router.patch('/reservations/:reference/status', requireAdmin, (req, res) => {
  const reservation = findReservationByReference(req.params.reference);
  if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });

  const { status } = req.body;
  if (!reservationStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid reservation status' });
  }

  const oldStatus = reservation.status;
  reservation.status = status;
  reservation.updatedAt = new Date().toISOString();
  saveData();
  addAuditLog('reservation.status_changed', req.admin.email, { reference: reservation.reference, from: oldStatus, to: status });

  res.json({ success: true, message: 'Reservation status updated', data: reservation });
});

router.post('/reset-demo', requireAdmin, (req, res) => {
  orders.splice(0, orders.length);
  reservations.splice(0, reservations.length);
  saveData();
  addAuditLog('system.demo_reset', req.admin.email, {});
  res.json({ success: true, message: 'Demo orders and reservations cleared' });
});

module.exports = router;
