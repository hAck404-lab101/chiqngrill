"use client";

import { useState } from "react";
import { addMenuItemToCart } from "@/lib/cart";
import type { MenuItem } from "@/lib/restaurant-data";

type AddToCartButtonProps = {
  item: MenuItem;
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addMenuItemToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!item.available}
      className="mt-5 w-full rounded-full bg-cream px-5 py-3 text-center text-sm font-black text-charcoal transition hover:bg-gold disabled:cursor-not-allowed disabled:bg-cream/40"
    >
      {item.available ? (added ? "Added to Cart" : "Add to Cart") : "Unavailable"}
    </button>
  );
}
