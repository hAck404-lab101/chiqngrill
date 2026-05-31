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
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />
      <AppHeader />

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="Delivery zones"
          title="Know the delivery range before checkout."
          description="This MVP page prepares zone pricing, delivery estimates, and area rules before live backend fee calculation is added."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {zones.map((zone) => (
            <article key={zone.name} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{zone.status}</p>
              <h2 className="mt-3 text-3xl font-black">{zone.name}</h2>
              <div className="mt-6 grid gap-3 text-cream/70">
                <p>Delivery fee: <span className="font-black text-gold">{zone.fee}</span></p>
                <p>Estimated time: <span className="font-black text-gold">{zone.eta}</span></p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-[2.5rem] border border-white/10 bg-cream p-8 text-charcoal md:p-12">
          <h2 className="text-4xl font-black">Delivery rule for production</h2>
          <p className="mt-4 max-w-3xl leading-8 text-charcoal/65">When the backend is added, delivery fees should be calculated server-side based on selected zone, address, distance rules, or admin-controlled fee tables.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/order" variant="flame">Start Delivery Order</CTAButton>
            <CTAButton href={restaurant.phoneHref} variant="gold">Call to Confirm</CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}
