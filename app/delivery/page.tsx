import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const zones = [
  { name: "Nearby Accra", fee: "GH₵15–25", eta: "25–40 min", status: "Priority" },
  { name: "Central Accra", fee: "GH₵25–40", eta: "35–55 min", status: "Available" },
  { name: "Extended areas", fee: "Confirm", eta: "Confirm", status: "Call first" }
];

export default function DeliveryPage() {
  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container py-8 md:py-12">
        <SectionHeading
          eyebrow="Delivery"
          title="Check delivery before ordering"
          description="Use this as a simple guide for fees and estimated delivery time around Accra."
        />

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {zones.map((zone) => (
            <article key={zone.name} className="surface p-5">
              <span className="pill">{zone.status}</span>
              <h2 className="mt-4 text-2xl font-black">{zone.name}</h2>
              <div className="mt-5 space-y-2 text-sm font-semibold text-[var(--muted)]">
                <p>Fee: <span className="font-black text-[var(--ink)]">{zone.fee}</span></p>
                <p>Time: <span className="font-black text-[var(--ink)]">{zone.eta}</span></p>
              </div>
            </article>
          ))}
        </div>

        <div className="surface mt-7 p-5 md:p-7">
          <h2 className="text-2xl font-black">Ready to order?</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--muted)]">
            Final delivery fee can be confirmed when your order is received. For now, start your cart and choose delivery at checkout.
          </p>
          <div className="mt-5 grid gap-3 sm:flex">
            <CTAButton href="/menu" variant="flame">Choose Meals</CTAButton>
            <CTAButton href={restaurant.phoneHref} variant="outline">Call to Confirm</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
