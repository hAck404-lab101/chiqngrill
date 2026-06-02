const express = require('express');
const { menuItems, orders, reservations } = require('../../data/seed');

const router = express.Router();

router.get('/', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter((order) => order.createdAt.startsWith(today));
  const revenue = todaysOrders.reduce((total, order) => total + order.subtotal, 0);

  res.json({
    success: true,
    data: {
      totals: {
        menuItems: menuItems.length,
        orders: orders.length,
        reservations: reservations.length,
        todaysOrders: todaysOrders.length,
        todaysRevenue: revenue
      },
      pendingOrders: orders.filter((order) => order.status === 'Pending'),
      recentOrders: orders.slice(0, 5),
      recentReservations: reservations.slice(0, 5),
      topItems: menuItems.slice(0, 4)
    }
  });
});

module.exports = router;
