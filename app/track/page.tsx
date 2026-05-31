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

export default function TrackPage() {
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
            description="This page prepares the future live tracking experience. For the MVP, customers can use it as a clean order status reference after WhatsApp checkout."
          />
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-gold">Sample reference</p>
            <h2 className="mt-3 text-3xl font-black">CNG-20260531-0001</h2>
            <p className="mt-3 text-sm leading-6 text-cream/60">
              Backend lookup will later allow customers to enter their real order reference and phone number.
            </p>
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
