import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { menuItems, restaurant, reviewHighlights } from "@/lib/restaurant-data";

const featuredItems = menuItems.slice(0, 4);

const quickActions = [
  { title: "Order", detail: "Build your basket", href: "/menu" },
  { title: "Reserve", detail: "Book a table", href: "/reservations" },
  { title: "Track", detail: "Check status", href: "/track" }
];

export default function Home() {
  return (
    <main className="app-page overflow-hidden">
      <AppHeader />

      <section className="app-container grid gap-8 pb-12 pt-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-12">
        <div>
          <p className="eyebrow">Papa Monrovia Street · Accra</p>
          <h1 className="app-title mt-4 text-5xl md:text-7xl">Order grilled chicken without the wait.</h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[var(--muted)]">
            Browse the menu, add your meal, choose pickup or delivery, and send your order to Chiq-N-Grill.
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <CTAButton href="/menu" variant="flame">Order Food</CTAButton>
            <CTAButton href="/reservations" variant="outline">Reserve Table</CTAButton>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <a key={action.href} href={action.href} className="surface p-4 transition hover:-translate-y-0.5">
                <p className="text-lg font-black">{action.title}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{action.detail}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="surface mx-auto w-full max-w-[430px] overflow-hidden p-3">
          <div className="food-tile min-h-[250px]" />
          <div className="p-3 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Popular order</p>
                <h2 className="mt-2 text-3xl font-black leading-tight">Breaded & Buttered Combo</h2>
              </div>
              <span className="pill">GH₵70+</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[var(--muted)]">Crispy chicken, rice or fries, sauce, and full flavor.</p>
            <a href="/menu" className="btn-primary mt-5 w-full">Add meals</a>
          </div>
        </div>
      </section>

      <section className="app-container py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading eyebrow="Favorites" title="Customer-loved plates" />
          <CTAButton href="/menu" variant="outline">Browse Menu</CTAButton>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {featuredItems.map((item) => (
            <article key={item.id} className="surface overflow-hidden p-3">
              <div className="food-tile min-h-[150px]" />
              <div className="p-2 pt-4">
                <p className="pill">{item.category}</p>
                <h3 className="mt-3 text-xl font-black leading-tight">{item.name}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted)]">{item.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-black">
                  <span>GH₵{item.priceFrom}+</span>
                  <span className="text-[var(--muted)]">{item.prepTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="app-container py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface p-6 md:p-8">
            <p className="eyebrow">Reviews</p>
            <h2 className="app-title mt-3 text-4xl md:text-5xl">People come back for the seasoning.</h2>
            <div className="mt-6 grid gap-3">
              {reviewHighlights.slice(0, 3).map((review) => (
                <blockquote key={review} className="rounded-2xl bg-[var(--paper)] p-4 text-sm font-bold leading-6 text-[var(--ink)]">
                  “{review}”
                </blockquote>
              ))}
            </div>
          </div>

          <div className="surface p-6 md:p-8">
            <p className="eyebrow">Location</p>
            <h2 className="app-title mt-3 text-4xl md:text-5xl">Find Chiq-N-Grill in Accra.</h2>
            <div className="mt-6 space-y-3 text-base font-semibold text-[var(--muted)]">
              <p>{restaurant.address}</p>
              <p>Plus Code: {restaurant.plusCode}</p>
              <p>{restaurant.phone}</p>
            </div>
            <div className="mt-7 grid gap-3 sm:flex">
              <CTAButton href="/order" variant="flame">Start Order</CTAButton>
              <CTAButton href={restaurant.mapsUrl} variant="outline" external>Open Maps</CTAButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-[var(--line)] px-5 py-8 text-center text-sm font-semibold text-[var(--muted)]">
        <p>{restaurant.name} · Order, reserve, track, and return from your home screen.</p>
      </footer>
    </main>
  );
}
