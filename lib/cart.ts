import type { MenuItem } from "@/lib/restaurant-data";

export type CartItem = Pick<MenuItem, "id" | "name" | "category" | "priceFrom" | "prepTime"> & {
  quantity: number;
};

const CART_STORAGE_KEY = "chiqngrill-cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];
    const parsedCart = JSON.parse(storedCart) as CartItem[];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("chiqngrill-cart-updated"));
}

export function addMenuItemToCart(item: MenuItem) {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

  const nextItems = existingItem
    ? currentItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      )
    : [
        ...currentItems,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          priceFrom: item.priceFrom,
          prepTime: item.prepTime,
          quantity: 1
        }
      ];

  saveCartItems(nextItems);
  return nextItems;
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  const safeQuantity = Math.max(0, Math.floor(quantity));
  const nextItems = getCartItems()
    .map((item) => (item.id === itemId ? { ...item, quantity: safeQuantity } : item))
    .filter((item) => item.quantity > 0);

  saveCartItems(nextItems);
  return nextItems;
}

export function clearCart() {
  saveCartItems([]);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.priceFrom * item.quantity, 0);
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}
