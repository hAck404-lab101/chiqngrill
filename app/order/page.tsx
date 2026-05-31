"use client";

import { useEffect, useMemo, useState } from "react";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { clearCart, getCartItems, getCartSubtotal, updateCartItemQuantity, type CartItem } from "@/lib/cart";
import { restaurant } from "@/lib/restaurant-data";

const orderModes = ["Dine-in", "Pickup", "Kerbside Pickup", "Delivery"] as const;

type OrderMode = (typeof orderModes)[number];

export default function OrderPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [orderMode, setOrderMode] = useState<OrderMode>("Pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setCartItems(getCartItems());
    setHasLoadedCart(true);

    function syncCart() {
      setCartItems(getCartItems());
    }

    window.addEventListener("chiqngrill-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("chiqngrill-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);
  const isCartEmpty = hasLoadedCart && cartItems.length === 0;

  function handleQuantityChange(itemId: string, quantity: number) {
    setCartItems(updateCartItemQuantity(itemId, quantity));
  }

  function handleClearCart() {
    clearCart();
    setCartItems([]);
  }

  const orderSummary = useMemo(() => {
    const itemLines = cartItems
      .map((item) => `${item.quantity}x ${item.name} - GH₵${item.priceFrom * item.quantity}`)
      .join("%0A");

    const addressLine = orderMode === "Delivery" ? `%0ADelivery Address: ${encodeURIComponent(address || "Not provided")}` : "";
    const notesLine = notes ? `%0ANotes: ${encodeURIComponent(notes)}` : "";

    return `${restaurant.whatsappUrl}%0A%0AName: ${encodeURIComponent(name || "Customer")}%0APhone: ${encodeURIComponent(phone || "Not provided")}%0AOrder Mode: ${encodeURIComponent(orderMode)}${addressLine}%0A%0AItems:%0A${itemLines || "No items selected"}%0A%0ASubtotal: GH₵${subtotal}${notesLine}`;
  }, [address, cartItems, name, notes, orderMode, phone, subtotal]);

  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />

      <header className="border-b border-white/10 bg-charcoal/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-sm font-black uppercase tracking-[0.28em] text-gold">
            Chiq-N-Grill
          </a>
          <div className="flex items-center gap-3">
            <CTAButton href="/menu" variant="outline">Menu</CTAButton>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <div>
          <SectionHeading
            eyebrow="Your basket"
            title="Review your meal before checkout."
            description="Items added from the menu appear here. Update quantities, choose how you want to receive your meal, then send the order through WhatsApp."
          />
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-gold">Basket</p>
              {cartItems.length > 0 ? (
                <button type="button" onClick={handleClearCart} className="text-sm font-bold text-cream/50 hover:text-flame">
                  Clear cart
                </button>
              ) : null}
            </div>

            {isCartEmpty ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-6 text-center">
                <h2 className="text-2xl font-black">Your cart is empty.</h2>
                <p className="mt-2 text-sm leading-6 text-cream/60">Add meals from the menu to start your order.</p>
                <div className="mt-5">
                  <CTAButton href="/menu" variant="flame">Browse Menu</CTAButton>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="mt-1 text-sm text-cream/60">{item.category} · {item.prepTime}</p>
                      <p className="mt-2 text-sm font-bold text-gold">GH₵{item.priceFrom} each</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:justify-end">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="grid size-10 place-items-center rounded-full border border-white/10 font-black hover:border-gold hover:text-gold"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-black">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="grid size-10 place-items-center rounded-full border border-white/10 font-black hover:border-gold hover:text-gold"
                      >
                        +
                      </button>
                      <p className="min-w-20 text-right font-black text-gold">GH₵{item.priceFrom * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xl font-black">
              <span>Subtotal</span>
              <span>GH₵{subtotal}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-cream/55">
              Delivery fee and final availability should be confirmed by the restaurant during WhatsApp checkout.
            </p>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-cream p-6 text-charcoal md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Checkout details</p>
          <h1 className="mt-3 text-4xl font-black">How should we serve you?</h1>

          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {orderModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setOrderMode(mode)}
                className={`rounded-full border px-4 py-3 text-sm font-black transition ${
                  orderMode === mode
                    ? "border-charcoal bg-charcoal text-cream"
                    : "border-charcoal/10 bg-white text-charcoal/70 hover:border-flame hover:text-flame"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              Full name
              <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Phone number
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="024 XXX XXXX" />
            </label>
            {orderMode === "Delivery" ? (
              <label className="grid gap-2 text-sm font-bold">
                Delivery address
                <textarea value={address} onChange={(event) => setAddress(event.target.value)} className="min-h-28 rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="Share your area, landmark, and exact delivery point" />
              </label>
            ) : null}
            <label className="grid gap-2 text-sm font-bold">
              Order notes
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="Extra spicy, no onions, pickup time, etc." />
            </label>
          </div>

          <a
            href={isCartEmpty ? "/menu" : orderSummary}
            className={`mt-7 block rounded-full px-7 py-4 text-center font-black transition ${
              isCartEmpty ? "bg-charcoal text-cream hover:bg-flame hover:text-charcoal" : "bg-flame text-charcoal hover:bg-gold"
            }`}
          >
            {isCartEmpty ? "Add Items First" : "Send Order on WhatsApp"}
          </a>
          <p className="mt-4 text-center text-sm text-charcoal/55">
            MVP checkout only. Backend order saving and Paystack payment come next.
          </p>
        </div>
      </section>
    </main>
  );
}
