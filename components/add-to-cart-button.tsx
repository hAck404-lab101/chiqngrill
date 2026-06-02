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
      className="mt-4 w-full rounded-full bg-[var(--brand)] px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--soft)] disabled:text-[var(--muted)]"
    >
      {item.available ? (added ? "Added" : "Add to cart") : "Unavailable"}
    </button>
  );
}
