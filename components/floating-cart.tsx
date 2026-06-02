"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount, getCartItems, getCartSubtotal, type CartItem } from "@/lib/cart";

export function FloatingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    function syncCart() {
      setCartItems(getCartItems());
      setHasLoaded(true);
    }

    syncCart();
    window.addEventListener("chiqngrill-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("chiqngrill-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const count = getCartCount(cartItems);
  const subtotal = getCartSubtotal(cartItems);

  if (!hasLoaded || count === 0) return null;

  return (
    <Link
      href="/order"
      aria-label={`View cart with ${count} item${count === 1 ? "" : "s"}`}
      className="fixed inset-x-4 bottom-20 z-[80] mx-auto flex max-w-md items-center justify-between rounded-3xl bg-[var(--dark)] px-4 py-3 text-white shadow-[0_18px_45px_rgba(36,23,19,0.22)] transition hover:-translate-y-0.5 md:bottom-6 md:right-6 md:mx-0"
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-[var(--brand)] text-sm font-black text-white">
          {count}
        </span>
        <span>
          <span className="block text-sm font-black">View cart</span>
          <span className="block text-xs font-semibold text-white/65">Ready for checkout</span>
        </span>
      </span>
      <span className="text-right">
        <span className="block text-xs text-white/55">Subtotal</span>
        <span className="block font-black">GH₵{subtotal}</span>
      </span>
    </Link>
  );
}
