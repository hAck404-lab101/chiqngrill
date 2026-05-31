import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const deals = [
  { title: "Weekend Combo", code: "WEEKENDGRILL", value: "Save on selected chicken combos", note: "Perfect for Friday to Sunday cravings" },
  { title: "Student Bite", code: "STUDENTCNG", value: "Special lunch-hour discount placeholder", note: "Backend verification later" },
  { title: "Free Drink Pairing", code: "CHILLDRINK", value: "Drink promo for qualifying orders", note: "Admin-controlled offer later" }
];

const rewards = [
  "Earn points for every order",
  "Unlock birthday rewards",
  "Redeem points for discounts",
  "Refer friends for bonus perks"
];

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />
      <header className="border-b border-white/10 bg-charcoal/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-sm font-black uppercase tracking-[0.28em] text-gold">Chiq-N-Grill</a>
          <CTAButton href="/menu" variant="flame">Order Now</CTAButton>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="Deals & rewards"
          title="Give customers a reason to come back."
          description="This page prepares promo codes, loyalty points, referrals, and birthday rewards for the full backend version."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {deals.map((deal) => (
            <article key={deal.code} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-gold/40">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{deal.code}</p>
              <h2 className="mt-3 text-3xl font-black">{deal.title}</h2>
              <p className="mt-3 leading-7 text-cream/70">{deal.value}</p>
              <p className="mt-4 text-sm text-cream/45">{deal.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-[2.5rem] border border-white/10 bg-cream p-8 text-charcoal md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Loyalty system</p>
            <h2 className="mt-3 text-4xl font-black">Chiq Points</h2>
            <p className="mt-4 leading-8 text-charcoal/65">Future customers can earn points, redeem rewards, and receive birthday offers. MVP shows the concept before database accounts are added.</p>
          </div>
          <div className="grid gap-3">
            {rewards.map((reward) => (
              <div key={reward} className="rounded-2xl border border-charcoal/10 bg-white px-5 py-4 font-black">{reward}</div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/menu" variant="flame">Use a Deal</CTAButton>
          <CTAButton href={restaurant.phoneHref} variant="outline">Call Restaurant</CTAButton>
        </div>
      </section>
    </main>
  );
}
