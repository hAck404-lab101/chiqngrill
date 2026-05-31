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
      className="fixed bottom-5 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-gold/30 bg-charcoal/95 px-5 py-4 text-cream shadow-warm backdrop-blur-xl transition hover:-translate-y-1 hover:border-gold md:left-auto md:right-6 md:w-96 md:translate-x-0"
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-flame font-black text-charcoal">
          {count}
        </span>
        <span>
          <span className="block text-xs font-black uppercase tracking-[0.22em] text-gold">Your cart</span>
          <span className="block text-sm text-cream/70">Ready for checkout</span>
        </span>
      </span>
      <span className="text-right">
        <span className="block text-xs text-cream/50">Subtotal</span>
        <span className="block font-black text-gold">GH₵{subtotal}</span>
      </span>
    </Link>
  );
}
