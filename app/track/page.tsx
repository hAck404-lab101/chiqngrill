"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { fetchOrder } from "@/lib/api-client";
import { restaurant } from "@/lib/restaurant-data";

type TrackedOrder = {
  reference: string;
  status: string;
  subtotal?: number;
  total?: number;
  orderMode: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
};

const statusSteps = ["Pending", "Preparing", "Ready", "Completed"];

function normalizeTrackingStatus(status: string) {
  if (status === "Accepted") return "Pending";
  if (status === "Out for delivery") return "Ready";
  if (status === "Cancelled") return "Completed";
  return status || "Pending";
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function TrackPage() {
  const [referenceInput, setReferenceInput] = useState("");
  const [trackedReference, setTrackedReference] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState("");

  async function trackOrder(referenceValue: string, options?: { silent?: boolean; clearExisting?: boolean }) {
    const cleanReference = referenceValue.trim().toUpperCase();

    if (!options?.silent) setError("");
    if (options?.clearExisting) setOrder(null);

    if (!cleanReference) {
      if (!options?.silent) setError("Enter your order reference.");
      return;
    }

    if (options?.silent) setIsAutoRefreshing(true);
    else setIsLoading(true);

    try {
      const result = await fetchOrder(cleanReference);
      setOrder(result as TrackedOrder);
      setTrackedReference(cleanReference);
      setLastChecked(formatTime());
      setError("");
    } catch (err) {
      if (!options?.silent) setError(err instanceof Error ? err.message : "Order not found. Check the reference and try again.");
    } finally {
      if (options?.silent) setIsAutoRefreshing(false);
      else setIsLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlReference = params.get("ref") || "";
    if (urlReference) {
      const cleanReference = urlReference.trim().toUpperCase();
      setReferenceInput(cleanReference);
      setTrackedReference(cleanReference);
      void trackOrder(cleanReference, { clearExisting: true });
    }
  }, []);

  useEffect(() => {
    if (!trackedReference) return;
    if (normalizeTrackingStatus(order?.status || "") === "Completed") return;

    const timer = window.setInterval(() => {
      void trackOrder(trackedReference, { silent: true });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [trackedReference, order?.status]);

  const currentStatus = normalizeTrackingStatus(order?.status || "Pending");
  const activeIndex = Math.max(0, statusSteps.indexOf(currentStatus));
  const displayTotal = Number(order?.total || order?.subtotal || 0);

  return (
    <main className="app-page">
      <AppHeader />

      <section className="store-shell grid gap-6 py-8 md:grid-cols-[0.85fr_1.15fr] md:py-12">
        <div>
          <p className="eyebrow">Tracking</p>
          <h1 className="app-title mt-2 text-4xl md:text-6xl">Track your order</h1>
          <p className="mt-3 max-w-xl text-base font-medium leading-7 text-[var(--muted)]">Enter the reference from checkout to see the current order status. This page refreshes automatically.</p>

          <div className="store-panel mt-6 p-5">
            <label className="app-label">
              Order reference
              <input value={referenceInput} onChange={(event) => setReferenceInput(event.target.value)} className="app-input uppercase" placeholder="CNG-20260602-1234" />
            </label>
            <button type="button" onClick={() => void trackOrder(referenceInput, { clearExisting: true })} disabled={isLoading} className="btn-primary mt-4 w-full disabled:opacity-50">
              {isLoading ? "Checking..." : "Track Order"}
            </button>
            {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
            {lastChecked ? <p className="mt-3 text-xs font-bold text-[var(--muted)]">Last checked: {lastChecked}{isAutoRefreshing ? " · refreshing..." : ""}</p> : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CTAButton href={restaurant.phoneHref} variant="flame">Call Restaurant</CTAButton>
            <CTAButton href="/menu" variant="outline">Back to Menu</CTAButton>
          </div>
        </div>

        <div className="store-panel p-5 md:p-6">
          {order ? (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow">Current order</p>
                  <h2 className="mt-2 text-3xl font-black">{order.reference}</h2>
                  <p className="mt-2 text-sm font-bold text-[var(--muted)]">{order.orderMode} · GH₵{displayTotal}</p>
                  {order.paymentMethod ? <p className="mt-1 text-xs font-bold text-[var(--muted)]">Payment: {order.paymentMethod} · {order.paymentStatus || "Pending"}</p> : null}
                </div>
                <span className="pill">{currentStatus}</span>
              </div>

              <div className="mt-6 space-y-4">
                {statusSteps.map((status, index) => {
                  const reached = index <= activeIndex;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`grid size-9 place-items-center rounded-full text-sm font-black ${reached ? "bg-[var(--brand)] text-white" : "bg-[var(--soft)] text-[var(--muted)]"}`}>{index + 1}</span>
                      <p className={`font-black ${reached ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{status}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-[var(--paper)] p-4">
                <p className="text-sm font-black">Items</p>
                <div className="mt-3 space-y-2">
                  {(order.items || []).map((item) => (
                    <div key={`${item.name}-${item.quantity}`} className="flex justify-between gap-4 text-sm font-semibold text-[var(--muted)]">
                      <span>{item.quantity}x {item.name}</span>
                      <span>GH₵{item.lineTotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid min-h-[360px] place-items-center text-center">
              <div>
                <p className="eyebrow">Waiting</p>
                <h2 className="mt-2 text-3xl font-black">Enter an order reference</h2>
                <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-[var(--muted)]">After placing an order, the reference appears on the checkout confirmation.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
