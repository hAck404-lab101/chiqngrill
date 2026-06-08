"use client";

import { useState } from "react";
import { CartIcon, CheckIcon } from "@/components/icons";
import { addMenuItemToCart } from "@/lib/cart";
import type { MenuItem } from "@/lib/restaurant-data";

type AddToCartButtonProps = {
  item: MenuItem;
  compact?: boolean;
};

export function AddToCartButton({ item, compact = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addMenuItemToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!item.available}
        className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-2xl bg-[var(--brand)] px-3 text-xs font-black text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--soft)] disabled:text-[var(--muted)] md:h-auto md:rounded-full md:px-5 md:py-3 md:text-sm"
      >
        {item.available ? (added ? <CheckIcon className="size-4" /> : <CartIcon className="size-4" />) : null}
        <span>{item.available ? (added ? "Added" : "Add") : "Off"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!item.available}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--soft)] disabled:text-[var(--muted)]"
    >
      {item.available ? (added ? <CheckIcon className="size-4" /> : <CartIcon className="size-4" />) : null}
      <span>{item.available ? (added ? "Added" : "Add to cart") : "Unavailable"}</span>
    </button>
  );
}
