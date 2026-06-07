function parseTimeToMinutes(time) {
  const [hours, minutes] = String(time || '00:00').split(':').map(Number);
  return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

function isWithinBusinessHours(settings, now = new Date()) {
  if (!settings.enforceBusinessHours) return { allowed: true, reason: 'Business-hours enforcement is disabled.' };

  const day = now.getDay();
  const allowedDays = Array.isArray(settings.businessHours?.days) ? settings.businessHours.days.map(Number) : [];
  if (!allowedDays.includes(day)) {
    return { allowed: false, reason: 'Ordering is closed today.' };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTimeToMinutes(settings.businessHours?.open || '11:00');
  const closeMinutes = parseTimeToMinutes(settings.businessHours?.close || '23:00');

  if (openMinutes <= closeMinutes) {
    const allowed = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    return { allowed, reason: allowed ? 'Open now.' : `Ordering is open from ${settings.businessHours.open} to ${settings.businessHours.close}.` };
  }

  const allowed = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  return { allowed, reason: allowed ? 'Open now.' : `Ordering is open from ${settings.businessHours.open} to ${settings.businessHours.close}.` };
}

function findDeliveryZone(settings, address = '') {
  const zones = Array.isArray(settings.deliveryZones) ? settings.deliveryZones : [];
  const query = String(address).toLowerCase();
  const matched = zones.find((zone) => Array.isArray(zone.keywords) && zone.keywords.some((keyword) => query.includes(String(keyword).toLowerCase())));
  return matched || zones.find((zone) => zone.id === 'other') || { id: 'default', name: 'Delivery area', fee: 0 };
}

function calculateOrderCharges({ subtotal, orderMode, deliveryAddress, settings }) {
  const serviceFee = Math.max(0, Number(settings.serviceFee || 0));
  const isDelivery = orderMode === 'Delivery';
  const deliveryZone = isDelivery ? findDeliveryZone(settings, deliveryAddress) : null;
  const deliveryFee = isDelivery ? Math.max(0, Number(deliveryZone?.fee || 0)) : 0;
  const total = Number(subtotal || 0) + serviceFee + deliveryFee;

  return {
    subtotal: Number(subtotal || 0),
    serviceFee,
    deliveryFee,
    total,
    deliveryZone: deliveryZone ? { id: deliveryZone.id, name: deliveryZone.name } : null
  };
}

function assertOrderingAllowed(settings) {
  if (!settings.orderingEnabled) {
    const error = new Error('Online ordering is currently disabled. Please call the restaurant.');
    error.status = 403;
    throw error;
  }

  const hours = isWithinBusinessHours(settings);
  if (!hours.allowed) {
    const error = new Error(hours.reason);
    error.status = 403;
    throw error;
  }
}

function assertReservationsAllowed(settings) {
  if (!settings.reservationsEnabled) {
    const error = new Error('Reservations are currently disabled. Please call the restaurant.');
    error.status = 403;
    throw error;
  }
}

module.exports = {
  assertOrderingAllowed,
  assertReservationsAllowed,
  calculateOrderCharges,
  findDeliveryZone,
  isWithinBusinessHours
};
