const express = require('express');
const { menuItems, restaurant, homepageContent } = require('../../data/seed');

const router = express.Router();

router.get('/', (req, res) => {
  const { category, search, available } = req.query;

  let items = [...menuItems];

  if (category) {
    items = items.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }

  if (available === 'true') {
    items = items.filter((item) => item.available);
  }

  if (search) {
    const query = String(search).toLowerCase();
    items = items.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, data: items });
});

router.get('/categories', (req, res) => {
  const categories = [...new Set(menuItems.map((item) => item.category))];
  res.json({ success: true, data: categories });
});

router.get('/restaurant', (req, res) => {
  res.json({ success: true, data: restaurant });
});

router.get('/homepage', (req, res) => {
  res.json({ success: true, data: homepageContent });
});

router.get('/:id', (req, res) => {
  const item = menuItems.find((menuItem) => menuItem.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
  res.json({ success: true, data: item });
});

module.exports = router;
