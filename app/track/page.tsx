"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { fetchOrder } from "@/lib/api-client";
import { restaurant } from "@/lib/restaurant-data";

type TrackedOrder = {
  reference: string;
  status: string;
  subtotal: number;
  orderMode: string;
  items: Array<{ name: string; quantity: number; lineTotal: number }>;
};

const statusSteps = ["Pending", "Accepted", "Preparing", "Ready", "Out for delivery", "Completed"];

function getReferenceFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("ref") || "";
}

export default function TrackPage() {
  const [referenceInput, setReferenceInput] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlReference = getReferenceFromUrl();
    if (urlReference) {
      setReferenceInput(urlReference);
      void handleTrack(urlReference);
    }
  }, []);

  async function handleTrack(reference = referenceInput) {
    const cleanReference = reference.trim().toUpperCase();
    setError("");
    setOrder(null);

    if (!cleanReference) {
      setError("Enter your order reference.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchOrder(cleanReference);
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found. Check the reference and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const currentStatus = order?.status || "Pending";
  const activeIndex = Math.max(0, statusSteps.indexOf(currentStatus));

  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container grid gap-6 py-8 md:grid-cols-[0.85fr_1.15fr] md:py-12">
        <div>
          <SectionHeading eyebrow="Tracking" title="Track your order" description="Enter the reference from checkout to see the current order status." />

          <div className="surface mt-6 p-5">
            <label className="app-label">
              Order reference
              <input value={referenceInput} onChange={(event) => setReferenceInput(event.target.value)} className="app-input uppercase" placeholder="CNG-20260602-1234" />
            </label>
            <button type="button" onClick={() => handleTrack()} disabled={isLoading} className="btn-primary mt-4 w-full disabled:opacity-50">
              {isLoading ? "Checking..." : "Track Order"}
            </button>
            {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CTAButton href={restaurant.phoneHref} variant="flame">Call Restaurant</CTAButton>
            <CTAButton href="/menu" variant="outline">Back to Menu</CTAButton>
          </div>
        </div>

        <div className="surface p-5 md:p-6">
          {order ? (
            <>
              <p className="eyebrow">Current order</p>
              <h1 className="mt-2 text-3xl font-black">{order.reference}</h1>
              <p className="mt-2 text-sm font-bold text-[var(--muted)]">{order.orderMode} · GH₵{order.subtotal}</p>

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
                  {order.items.map((item) => (
                    <div key={item.name} className="flex justify-between gap-4 text-sm font-semibold text-[var(--muted)]">
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
