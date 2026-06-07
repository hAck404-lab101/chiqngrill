const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'app-data.json');

const defaultData = {
  restaurant: {
    name: 'Chiq-N-Grill',
    tagline: 'Bold Chicken. Smooth Vibes. Accra’s Grill Experience.',
    phone: '053 361 5069',
    phoneHref: 'tel:+233533615069',
    address: 'Papa Monrovia Street, Accra',
    plusCode: 'HR78+C3 Accra',
    priceRange: 'GH₵50–150',
    openingNote: 'Opens 11 AM',
    services: ['Dine-in', 'Kerbside Pickup', 'Delivery'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chiq-N-Grill%20Papa%20Monrovia%20Street%20Accra',
    whatsappUrl: 'https://wa.me/233533615069?text=Hi%20Chiq-N-Grill%2C%20I%20want%20to%20place%20an%20order.'
  },
  menuItems: [
    { id: 'breaded-buttered-combo', name: 'Breaded & Buttered Combo', category: 'Chicken Combos', description: 'Golden chicken with a crisp bite, built for serious cravings.', priceFrom: 70, spiceLevel: 'Medium', prepTime: '20–30 min', badge: 'Customer-loved', available: true, imageUrl: '' },
    { id: 'spicy-seasoned-chicken', name: 'Spicy Well-Seasoned Chicken', category: 'Chicken Combos', description: 'Juicy chicken with heat, depth, and grill-house character.', priceFrom: 65, spiceLevel: 'Hot', prepTime: '20–30 min', badge: 'Bold flavor', available: true, imageUrl: '' },
    { id: 'jollof-rice-plate', name: 'Jollof Rice Plate', category: 'Rice Meals', description: 'Rich jollof paired with chicken, sauce, and full Accra energy.', priceFrom: 75, spiceLevel: 'Medium', prepTime: '20–25 min', badge: 'Comfort side', available: true, imageUrl: '' },
    { id: 'herb-butter-rice', name: 'Herb Butter Rice', category: 'Rice Meals', description: 'Buttery, aromatic rice that cools the spice and completes the plate.', priceFrom: 75, spiceLevel: 'Mild', prepTime: '20–25 min', badge: 'Smooth balance', available: true, imageUrl: '' },
    { id: 'chicken-fries-combo', name: 'Chicken & Fries Combo', category: 'Fries & Sides', description: 'Crisp fries, saucy chicken, and a fast comfort-food finish.', priceFrom: 60, spiceLevel: 'Medium', prepTime: '15–25 min', badge: 'Quick craving', available: true, imageUrl: '' },
    { id: 'jerk-chicken', name: 'Jerk Chicken Option', category: 'Jerk Chicken', description: 'Smoky, spicy, and full of island-style grill energy.', priceFrom: 85, spiceLevel: 'Extra Hot', prepTime: '25–35 min', badge: 'Smoky heat', available: true, imageUrl: '' }
  ],
  galleryItems: [
    { id: 'golden-chicken', title: 'Golden Chicken', category: 'Food', imageUrl: '', isFeatured: true },
    { id: 'jollof-plate', title: 'Jollof Plate', category: 'Food', imageUrl: '', isFeatured: true },
    { id: 'interior-mood', title: 'Interior Mood', category: 'Vibe', imageUrl: '', isFeatured: false }
  ],
  homepageContent: {
    heroTitle: 'Order grilled chicken without the wait.',
    heroSubtitle: 'Browse the menu, add your meal, choose pickup or delivery, and send your order to Chiq-N-Grill.',
    featuredMealId: 'breaded-buttered-combo',
    heroImageUrl: '',
    announcement: 'Open from 11 AM'
  },
  orders: [],
  reservations: []
};

function readPersistedData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    console.warn('Could not read app-data.json. Falling back to defaults.', error.message);
    return {};
  }
}

function mergeData(defaults, saved) {
  return {
    restaurant: { ...defaults.restaurant, ...(saved.restaurant || {}) },
    menuItems: Array.isArray(saved.menuItems) ? saved.menuItems : defaults.menuItems,
    galleryItems: Array.isArray(saved.galleryItems) ? saved.galleryItems : defaults.galleryItems,
    homepageContent: { ...defaults.homepageContent, ...(saved.homepageContent || {}) },
    orders: Array.isArray(saved.orders) ? saved.orders : defaults.orders,
    reservations: Array.isArray(saved.reservations) ? saved.reservations : defaults.reservations
  };
}

const data = mergeData(defaultData, readPersistedData());

function saveData() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  restaurant: data.restaurant,
  menuItems: data.menuItems,
  galleryItems: data.galleryItems,
  homepageContent: data.homepageContent,
  orders: data.orders,
  reservations: data.reservations,
  saveData
};
