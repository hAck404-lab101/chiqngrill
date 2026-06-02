import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const deals = [
  { title: "Weekend Combo", code: "WEEKENDGRILL", value: "Selected chicken combos", note: "Use at checkout after backend promo validation is added" },
  { title: "Student Bite", code: "STUDENTCNG", value: "Lunch-hour deal concept", note: "Great for campus and office orders" },
  { title: "Free Drink Pairing", code: "CHILLDRINK", value: "Drink promo concept", note: "For qualifying food orders" }
];

const rewards = ["Points on every order", "Birthday reward", "Discount redemptions", "Referral perks"];

export default function DealsPage() {
  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container py-8 md:py-12">
        <SectionHeading
          eyebrow="Deals"
          title="Save on your next order"
          description="Simple promo and loyalty ideas for customers who keep coming back."
        />

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {deals.map((deal) => (
            <article key={deal.code} className="surface p-5">
              <span className="pill">{deal.code}</span>
              <h2 className="mt-4 text-2xl font-black">{deal.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">{deal.value}</p>
              <p className="mt-4 text-xs font-bold leading-5 text-[var(--muted)]">{deal.note}</p>
            </article>
          ))}
        </div>

        <div className="surface mt-7 grid gap-6 p-5 md:grid-cols-[0.9fr_1.1fr] md:p-7">
          <div>
            <p className="eyebrow">Loyalty</p>
            <h2 className="mt-2 text-3xl font-black">Chiq Points</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted)]">
              A simple rewards idea for repeat customers. Points and discounts can be activated when customer accounts are added.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {rewards.map((reward) => (
              <div key={reward} className="rounded-2xl bg-[var(--paper)] px-4 py-3 text-sm font-black text-[var(--ink)]">{reward}</div>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:flex">
          <CTAButton href="/menu" variant="flame">Order Food</CTAButton>
          <CTAButton href={restaurant.phoneHref} variant="outline">Call Restaurant</CTAButton>
        </div>
      </section>
    </main>
  );
}
