"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, Bike, Check, CreditCard, HandCoins, MapPin, Package, ShoppingBag, Store, Utensils } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { clearCart, getCartItems, getCartSubtotal, updateCartItemQuantity, type CartItem } from "@/lib/cart";
import { createOrder } from "@/lib/api-client";

const orderModes = ["Dine-in", "Pickup", "Kerbside Pickup", "Delivery"] as const;
const paymentMethods = ["Pay at restaurant", "Mobile Money on delivery", "Mobile Money after confirmation", "Cash on delivery"] as const;

type OrderMode = (typeof orderModes)[number];
type PaymentMethod = (typeof paymentMethods)[number];

function getPaymentMeta(method: string) {
  if (method === "Pay at restaurant") return { label: "Counter", hint: "Pay when you arrive", icon: Store };
  if (method === "Mobile Money on delivery") return { label: "MoMo Delivery", hint: "Pay when rider arrives", icon: CreditCard };
  if (method === "Mobile Money after confirmation") return { label: "MoMo Confirm", hint: "Restaurant confirms first", icon: HandCoins };
  return { label: "Cash Delivery", hint: "Cash on arrival", icon: Banknote };
}

function getModeMeta(mode: string) {
  if (mode === "Delivery") return { label: "Delivery", icon: Bike };
  if (mode === "Dine-in") return { label: "Dine", icon: Utensils };
  if (mode === "Kerbside Pickup") return { label: "Kerbside", icon: MapPin };
  return { label: "Pickup", icon: Package };
}

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
    if (orderMode === "Delivery" && paymentMethod === "Pay at restaurant") setPaymentMethod("Mobile Money on delivery");
    if ((orderMode === "Pickup" || orderMode === "Dine-in" || orderMode === "Kerbside Pickup") && paymentMethod === "Cash on delivery") setPaymentMethod("Pay at restaurant");
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

    if (isCartEmpty) return setError("Add at least one meal before checkout.");
    if (!name.trim() || !phone.trim()) return setError("Enter your name and phone number.");
    if (orderMode === "Delivery" && !address.trim()) return setError("Enter your delivery address.");
    if (!paymentMethod) return setError("Select a payment method.");

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

      <section className="store-shell grid gap-5 py-6 md:grid-cols-[1fr_0.9fr] md:py-12">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="app-title mt-2 text-4xl md:text-6xl">Confirm order</h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[var(--muted)] md:text-base md:leading-7">Review meals, choose service, choose payment, and send it to the restaurant.</p>

          <div className="store-panel mt-5 p-4 md:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black">Basket</h2>
              {cartItems.length > 0 ? <button type="button" onClick={handleClearCart} className="rounded-full bg-[var(--soft)] px-3 py-1.5 text-xs font-black text-[var(--brand-dark)]">Clear</button> : null}
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
                    <div className="min-w-0">
                      <p className="truncate font-black leading-tight">{item.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[var(--muted)]">GH₵{item.priceFrom} each</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="grid size-8 place-items-center rounded-full bg-[var(--soft)] font-black">−</button>
                      <span className="min-w-5 text-center text-sm font-black">{item.quantity}</span>
                      <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="grid size-8 place-items-center rounded-full bg-[var(--soft)] font-black">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xl font-black"><span>Total</span><span>GH₵{subtotal}</span></div>
          </div>
        </div>

        <div className="store-panel p-4 md:p-5">
          <h2 className="text-2xl font-black">Checkout</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">Select how you want to receive and pay.</p>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {orderModes.map((mode) => {
              const meta = getModeMeta(mode);
              const Icon = meta.icon;
              const active = orderMode === mode;
              return (
                <button key={mode} type="button" onClick={() => setOrderMode(mode)} className={`grid place-items-center gap-1 rounded-2xl border px-2 py-3 text-[10px] font-black transition sm:text-xs ${active ? "border-[var(--dark)] bg-[var(--dark)] text-white" : "border-[var(--line)] bg-white text-[var(--muted)]"}`}>
                  <Icon size={18} strokeWidth={active ? 2.6 : 2.1} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="text-sm font-black">Payment</p>
            <div className="mt-3 grid gap-2">
              {availablePaymentMethods.map((method) => {
                const meta = getPaymentMeta(method);
                const Icon = meta.icon;
                const active = paymentMethod === method;
                return (
                  <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? "border-[var(--brand)] bg-[#fff3e8]" : "border-[var(--line)] bg-white"}`}>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full ${active ? "bg-[var(--brand)] text-white" : "bg-[var(--paper)] text-[var(--muted)]"}`}><Icon size={19} strokeWidth={2.25} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-black text-[var(--ink)]">{meta.label}</span><span className="mt-0.5 block text-xs font-semibold text-[var(--muted)]">{meta.hint}</span></span>
                    <span className={`grid size-5 place-items-center rounded-full border ${active ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] text-transparent"}`}><Check size={13} strokeWidth={3} /></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="app-label">Name<input value={name} onChange={(event) => setName(event.target.value)} className="app-input" placeholder="Your name" /></label>
            <label className="app-label">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="app-input" placeholder="024 XXX XXXX" /></label>
            {orderMode === "Delivery" ? <label className="app-label">Delivery address<textarea value={address} onChange={(event) => setAddress(event.target.value)} className="app-input min-h-24" placeholder="Area, landmark, exact location" /></label> : null}
            <label className="app-label">Order note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="app-input min-h-24" placeholder="Extra spicy, pickup time, no onions..." /></label>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          <button type="button" onClick={handleSubmitOrder} disabled={isSubmitting || isCartEmpty} className="btn-primary mt-5 w-full disabled:opacity-50">{isSubmitting ? "Submitting..." : "Place Order"}</button>
        </div>
      </section>

      {createdReference ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/45 px-4">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-green-700"><Check size={34} strokeWidth={3} /></span>
            <h2 className="mt-5 text-3xl font-black">Order placed</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">Your order was sent successfully. Use this reference to track it.</p>
            <div className="mt-5 rounded-3xl bg-green-50 p-4 text-green-900"><p className="text-xs font-black uppercase tracking-[0.12em]">Reference</p><p className="mt-1 text-2xl font-black">{createdReference}</p><p className="mt-2 text-xs font-bold">{getPaymentMeta(paymentMethod).label}</p></div>
            <div className="mt-5 grid gap-2">
              <a href={`/track?ref=${encodeURIComponent(createdReference)}`} className="btn-primary">Track Order</a>
              <button type="button" onClick={() => setCreatedReference("")} className="btn-outline">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
