const express = require('express');
const { menuItems, orders } = require('../../data/seed');
const { createOrderReference } = require('../utils/orderReference');

const router = express.Router();

const validOrderModes = ['Dine-in', 'Pickup', 'Kerbside Pickup', 'Delivery'];
const validStatuses = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for delivery', 'Completed', 'Cancelled'];

function calculateItems(items = []) {
  return items.map((item) => {
    const menuItem = menuItems.find((entry) => entry.id === item.menuItemId);
    if (!menuItem) {
      const error = new Error(`Invalid menu item: ${item.menuItemId}`);
      error.status = 400;
      throw error;
    }

    const quantity = Math.max(1, Number(item.quantity || 1));
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      unitPrice: menuItem.priceFrom,
      quantity,
      lineTotal: menuItem.priceFrom * quantity
    };
  });
}

router.get('/', (req, res) => {
  res.json({ success: true, data: orders });
});

router.post('/', (req, res, next) => {
  try {
    const { customerName, phone, orderMode, deliveryAddress, notes, items } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone are required' });
    }

    if (!validOrderModes.includes(orderMode)) {
      return res.status(400).json({ success: false, message: 'Invalid order mode' });
    }

    if (orderMode === 'Delivery' && !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required for delivery orders' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    const orderItems = calculateItems(items);
    const subtotal = orderItems.reduce((total, item) => total + item.lineTotal, 0);
    const reference = createOrderReference();

    const order = {
      id: orders.length + 1,
      reference,
      customerName,
      phone,
      orderMode,
      deliveryAddress: deliveryAddress || null,
      notes: notes || '',
      items: orderItems,
      subtotal,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(order);

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    next(error);
  }
});

router.get('/:reference', (req, res) => {
  const order = orders.find((entry) => entry.reference === req.params.reference);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

router.patch('/:reference/status', (req, res) => {
  const order = orders.find((entry) => entry.reference === req.params.reference);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  res.json({ success: true, message: 'Order status updated', data: order });
});

module.exports = router;
