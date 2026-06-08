export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  priceFrom: number;
  spiceLevel: "Mild" | "Medium" | "Hot" | "Extra Hot";
  prepTime: string;
  badge: string;
  available: boolean;
  imageUrl?: string;
};

export const restaurant = {
  name: "Chiq-N-Grill",
  tagline: "Bold Chicken. Smooth Vibes. Accra’s Grill Experience.",
  phone: "053 361 5069",
  phoneHref: "tel:+233533615069",
  address: "Papa Monrovia Street, Accra",
  plusCode: "HR78+C3 Accra",
  priceRange: "GH₵50–150",
  openingNote: "Opens 11 AM",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Chiq-N-Grill%20Papa%20Monrovia%20Street%20Accra",
  whatsappUrl:
    "https://wa.me/233533615069?text=Hi%20Chiq-N-Grill%2C%20I%20want%20to%20place%20an%20order."
};

export const menuItems: MenuItem[] = [
  {
    id: "breaded-buttered-combo",
    name: "Breaded & Buttered Combo",
    category: "Chicken Combos",
    description: "Golden chicken with a crisp bite, built for serious cravings.",
    priceFrom: 70,
    spiceLevel: "Medium",
    prepTime: "20–30 min",
    badge: "Customer-loved",
    available: true,
    imageUrl: ""
  },
  {
    id: "spicy-seasoned-chicken",
    name: "Spicy Well-Seasoned Chicken",
    category: "Chicken Combos",
    description: "Juicy chicken with heat, depth, and grill-house character.",
    priceFrom: 65,
    spiceLevel: "Hot",
    prepTime: "20–30 min",
    badge: "Bold flavor",
    available: true,
    imageUrl: ""
  },
  {
    id: "jollof-rice-plate",
    name: "Jollof Rice Plate",
    category: "Rice Meals",
    description: "Rich jollof paired with chicken, sauce, and full Accra energy.",
    priceFrom: 75,
    spiceLevel: "Medium",
    prepTime: "20–25 min",
    badge: "Comfort side",
    available: true,
    imageUrl: ""
  },
  {
    id: "herb-butter-rice",
    name: "Herb Butter Rice",
    category: "Rice Meals",
    description: "Buttery, aromatic rice that cools the spice and completes the plate.",
    priceFrom: 75,
    spiceLevel: "Mild",
    prepTime: "20–25 min",
    badge: "Smooth balance",
    available: true,
    imageUrl: ""
  },
  {
    id: "chicken-fries-combo",
    name: "Chicken & Fries Combo",
    category: "Fries & Sides",
    description: "Crisp fries, saucy chicken, and a fast comfort-food finish.",
    priceFrom: 60,
    spiceLevel: "Medium",
    prepTime: "15–25 min",
    badge: "Quick craving",
    available: true,
    imageUrl: ""
  },
  {
    id: "jerk-chicken",
    name: "Jerk Chicken Option",
    category: "Jerk Chicken",
    description: "Smoky, spicy, and full of island-style grill energy.",
    priceFrom: 85,
    spiceLevel: "Extra Hot",
    prepTime: "25–35 min",
    badge: "Smoky heat",
    available: true,
    imageUrl: ""
  }
];

export const categories = Array.from(new Set(menuItems.map((item) => item.category)));

export const reviewHighlights = [
  "Delicious food and spicy, well-seasoned chicken.",
  "I do like the setup.",
  "Enjoyed the soothing music with my meal.",
  "The food actually tastes great."
];

export const serviceBadges = ["Dine-in", "Kerbside Pickup", "Delivery", "GH₵50–150"];
