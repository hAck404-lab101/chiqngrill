const express = require('express');
const { reservations } = require('../../data/seed');
const { createOrderReference } = require('../utils/orderReference');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: reservations });
});

router.post('/', (req, res) => {
  const { name, phone, date, time, guests, occasion, notes } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, phone, date, time, and guests are required' });
  }

  const reservation = {
    id: reservations.length + 1,
    reference: createOrderReference('RSV'),
    name,
    phone,
    date,
    time,
    guests: Number(guests),
    occasion: occasion || 'Casual visit',
    notes: notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  reservations.unshift(reservation);

  res.status(201).json({ success: true, message: 'Reservation request created successfully', data: reservation });
});

router.patch('/:reference/status', (req, res) => {
  const reservation = reservations.find((entry) => entry.reference === req.params.reference);
  if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });

  const allowedStatuses = ['Pending', 'Confirmed', 'Declined', 'Completed', 'Cancelled'];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid reservation status' });
  }

  reservation.status = status;
  reservation.updatedAt = new Date().toISOString();

  res.json({ success: true, message: 'Reservation status updated', data: reservation });
});

module.exports = router;
