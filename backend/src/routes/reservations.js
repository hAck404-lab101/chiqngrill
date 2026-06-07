const express = require('express');
const { reservations, settings, addAuditLog, saveData } = require('../../data/seed');
const { createOrderReference } = require('../utils/orderReference');
const { assertReservationsAllowed } = require('../utils/businessRules');

const router = express.Router();

function findReservation(reference) {
  const cleanReference = decodeURIComponent(String(reference || '')).trim().toUpperCase();
  return reservations.find((entry) => String(entry.reference || '').trim().toUpperCase() === cleanReference);
}

router.get('/', (req, res) => {
  res.json({ success: true, data: reservations });
});

router.post('/', (req, res, next) => {
  try {
    assertReservationsAllowed(settings);

    const { name, phone, date, time, guests, occasion, notes } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: 'Name, phone, date, time, and guests are required' });
    }

    const guestCount = Number(guests);
    if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 50) {
      return res.status(400).json({ success: false, message: 'Guests must be between 1 and 50' });
    }

    const reservation = {
      id: reservations.length + 1,
      reference: createOrderReference('RSV'),
      name,
      phone,
      date,
      time,
      guests: guestCount,
      occasion: occasion || 'Casual visit',
      notes: notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reservations.unshift(reservation);
    saveData();
    addAuditLog('reservation.created', 'customer', { reference: reservation.reference, date, time, guests: guestCount });

    res.status(201).json({ success: true, message: 'Reservation request created successfully', data: reservation });
  } catch (error) {
    next(error);
  }
});

router.patch('/:reference/status', (req, res) => {
  const reservation = findReservation(req.params.reference);
  if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });

  const allowedStatuses = ['Pending', 'Confirmed', 'Declined', 'Completed', 'Cancelled'];
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid reservation status' });
  }

  const oldStatus = reservation.status;
  reservation.status = status;
  reservation.updatedAt = new Date().toISOString();
  saveData();
  addAuditLog('reservation.status_changed', 'system', { reference: reservation.reference, from: oldStatus, to: status });

  res.json({ success: true, message: 'Reservation status updated', data: reservation });
});

module.exports = router;
