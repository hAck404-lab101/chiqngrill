"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { clearCart, getCartItems, getCartSubtotal, updateCartItemQuantity, type CartItem } from "@/lib/cart";
import { createOrder } from "@/lib/api-client";

const orderModes = ["Dine-in", "Pickup", "Kerbside Pickup", "Delivery"] as const;
const paymentMethods = ["Pay at restaurant", "Mobile Money on delivery", "Mobile Money after confirmation", "Cash on delivery"] as const;

type OrderMode = (typeof orderModes)[number];
type PaymentMethod = (typeof paymentMethods)[number];

export default function OrderPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [orderMode, setOrderMode] = useState<OrderMode>("Pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Pay at restaurant");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdReference, setCreatedReference] = useState("");

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

  useEffect(() => {
    if (orderMode === "Delivery" && paymentMethod === "Pay at restaurant") {
      setPaymentMethod("Mobile Money on delivery");
    }
    if ((orderMode === "Pickup" || orderMode === "Dine-in" || orderMode === "Kerbside Pickup") && paymentMethod === "Cash on delivery") {
      setPaymentMethod("Pay at restaurant");
    }
  }, [orderMode, paymentMethod]);

  const subtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems]);
  const isCartEmpty = hasLoadedCart && cartItems.length === 0;
  const availablePaymentMethods = paymentMethods.filter((method) => {
    if (orderMode !== "Delivery" && method === "Cash on delivery") return false;
    if (orderMode === "Delivery" && method === "Pay at restaurant") return false;
    return true;
  });

  function handleQuantityChange(itemId: string, quantity: number) {
    setCartItems(updateCartItemQuantity(itemId, quantity));
  }

  function handleClearCart() {
    clearCart();
    setCartItems([]);
  }

  async function handleSubmitOrder() {
    setError("");
    setCreatedReference("");

    if (isCartEmpty) {
      setError("Add at least one meal before checkout.");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError("Enter your name and phone number.");
      return;
    }

    if (orderMode === "Delivery" && !address.trim()) {
      setError("Enter your delivery address.");
      return;
    }

    if (!paymentMethod) {
      setError("Select a payment method.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        orderMode,
        deliveryAddress: address.trim(),
        notes: notes.trim(),
        paymentMethod,
        items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
      });

      setCreatedReference(order.reference);
      clearCart();
      setCartItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create order. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container grid gap-6 py-8 md:grid-cols-[1fr_0.9fr] md:py-12">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="app-title mt-2 text-4xl md:text-6xl">Confirm your order</h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-7 text-[var(--muted)]">
            Review your meals, choose how you want them served, choose payment, and submit directly to the restaurant system.
          </p>

          <div className="surface mt-6 p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black">Your basket</h2>
              {cartItems.length > 0 ? <button type="button" onClick={handleClearCart} className="text-sm font-bold text-[var(--brand-dark)]">Clear</button> : null}
            </div>

            {isCartEmpty ? (
              <div className="py-10 text-center">
                <h3 className="text-2xl font-black">Cart is empty</h3>
                <p className="mt-2 text-sm font-medium text-[var(--muted)]">Add meals from the menu to start.</p>
                <div className="mt-5"><CTAButton href="/menu" variant="flame">Browse Menu</CTAButton></div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--paper)] p-3">
                    <div>
                      <p className="font-black leading-tight">{item.name}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--muted)]">GH₵{item.priceFrom} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="grid size-9 place-items-center rounded-full bg-[var(--soft)] font-black">−</button>
                      <span className="min-w-5 text-center font-black">{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="grid size-9 place-items-center rounded-full bg-[var(--soft)] font-black">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xl font-black">
              <span>Total</span>
              <span>GH₵{subtotal}</span>
            </div>
          </div>
        </div>

        <div className="surface p-4 md:p-5">
          <h2 className="text-2xl font-black">Checkout</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">Choose service type and payment method before placing the order.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {orderModes.map((mode) => (
              <button key={mode} type="button" onClick={() => setOrderMode(mode)} className={`rounded-full px-3 py-3 text-sm font-extrabold ${orderMode === mode ? "bg-[var(--dark)] text-white" : "bg-[var(--soft)] text-[var(--ink)]"}`}>
                {mode}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-[var(--paper)] p-3">
            <p className="text-sm font-black">Payment method</p>
            <div className="mt-3 grid gap-2">
              {availablePaymentMethods.map((method) => (
                <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-2xl px-4 py-3 text-left text-sm font-black ${paymentMethod === method ? "bg-[var(--brand)] text-white" : "bg-white text-[var(--ink)] ring-1 ring-[var(--line)]"}`}>
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="app-label">Name<input value={name} onChange={(event) => setName(event.target.value)} className="app-input" placeholder="Your name" /></label>
            <label className="app-label">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="app-input" placeholder="024 XXX XXXX" /></label>
            {orderMode === "Delivery" ? <label className="app-label">Delivery address<textarea value={address} onChange={(event) => setAddress(event.target.value)} className="app-input min-h-24" placeholder="Area, landmark, exact location" /></label> : null}
            <label className="app-label">Order note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="app-input min-h-24" placeholder="Extra spicy, pickup time, no onions..." /></label>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          {createdReference ? (
            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-800">
              <p className="text-sm font-bold">Order created</p>
              <p className="mt-1 text-xl font-black">{createdReference}</p>
              <p className="mt-2 text-sm font-bold">Payment: {paymentMethod}</p>
              <a href={`/track?ref=${encodeURIComponent(createdReference)}`} className="mt-3 inline-flex text-sm font-black text-green-900">Track order</a>
            </div>
          ) : null}

          <button type="button" onClick={handleSubmitOrder} disabled={isSubmitting || isCartEmpty} className="btn-primary mt-5 w-full disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Place Order"}
          </button>
        </div>
      </section>
    </main>
  );
}
