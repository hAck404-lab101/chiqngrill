"use client";

import { useMemo, useState } from "react";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const trackingSteps = [
  {
    label: "Order received",
    description: "Your order request has been received by Chiq-N-Grill.",
    time: "Now",
    state: "completed"
  },
  {
    label: "Preparing your meal",
    description: "The kitchen is working on the chicken, rice, sides, and sauces.",
    time: "In progress",
    state: "active"
  },
  {
    label: "Ready for pickup / dispatch",
    description: "Your meal will be packed and prepared for pickup, kerbside, or delivery.",
    time: "Next",
    state: "pending"
  },
  {
    label: "Completed",
    description: "Meal collected, delivered, or served dine-in.",
    time: "Final",
    state: "pending"
  }
];

function normalizeReference(value: string) {
  return value.trim().toUpperCase() || "CNG-20260531-0001";
}

export default function TrackPage() {
  const [referenceInput, setReferenceInput] = useState("");
  const [trackedReference, setTrackedReference] = useState("CNG-20260531-0001");

  const estimatedReadyTime = useMemo(() => {
    return trackedReference.endsWith("0001") ? "20–30 minutes" : "Confirm with restaurant";
  }, [trackedReference]);

  function handleTrackOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTrackedReference(normalizeReference(referenceInput));
  }

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

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
        <div>
          <SectionHeading
            eyebrow="Order tracking"
            title="Track the heat from kitchen to table."
            description="Enter an order reference to preview the tracking experience. Backend lookup will later connect this page to real order statuses."
          />

          <form onSubmit={handleTrackOrder} className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <label className="grid gap-2 text-sm font-bold text-cream/75">
              Order reference
              <input
                value={referenceInput}
                onChange={(event) => setReferenceInput(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-cream outline-none placeholder:text-cream/35 focus:border-gold"
                placeholder="Example: CNG-20260531-0001"
              />
            </label>
            <button type="submit" className="mt-5 w-full rounded-full bg-flame px-6 py-4 font-black text-charcoal transition hover:bg-gold">
              Track Order
            </button>
            <p className="mt-4 text-sm leading-6 text-cream/60">
              For production, this should require order reference plus phone verification to protect customer privacy.
            </p>
          </form>

          <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-gold">Current reference</p>
            <h2 className="mt-3 text-3xl font-black">{trackedReference}</h2>
            <div className="mt-5 grid gap-3 text-sm text-cream/70">
              <p>Status: Preparing your meal</p>
              <p>Estimated ready time: {estimatedReadyTime}</p>
              <p>Support: {restaurant.phone}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton href={restaurant.phoneHref} variant="flame">Call Restaurant</CTAButton>
              <CTAButton href="/order" variant="outline">Back to Checkout</CTAButton>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-cream p-6 text-charcoal md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Live status preview</p>
          <h1 className="mt-3 text-4xl font-black">Preparing your meal.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-charcoal/65">
            Estimated time and live updates will connect to the order database later. For now, this shows the intended customer experience.
          </p>

          <div className="mt-8 space-y-5">
            {trackingSteps.map((step, index) => {
              const isCompleted = step.state === "completed";
              const isActive = step.state === "active";

              return (
                <article key={step.label} className="grid grid-cols-[auto_1fr] gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid size-11 place-items-center rounded-full border text-sm font-black ${
                        isCompleted
                          ? "border-flame bg-flame text-charcoal"
                          : isActive
                            ? "border-charcoal bg-charcoal text-cream"
                            : "border-charcoal/15 bg-white text-charcoal/35"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < trackingSteps.length - 1 ? <div className="h-16 w-px bg-charcoal/15" /> : null}
                  </div>
                  <div className="pb-6">
                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                      <h2 className="text-xl font-black">{step.label}</h2>
                      <span className="text-sm font-bold text-flame">{step.time}</span>
                    </div>
                    <p className="mt-2 leading-7 text-charcoal/65">{step.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
