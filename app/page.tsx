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

const appFeatures = [
  { title: "Fast food ordering", description: "Browse meals, add to cart, select pickup or delivery, and submit the order to the Express API.", href: "/menu" },
  { title: "Table requests", description: "Guests can request a dine-in slot for birthdays, groups, and evening meals.", href: "/reservations" },
  { title: "Kitchen-ready flow", description: "Orders can be prepared for admin and kitchen screens after backend connection.", href: "/admin" }
];

export default function Home() {
  return (
    <main className="app-page overflow-hidden">
      <AppHeader />

      <section className="app-container grid gap-10 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-14">
        <div>
          <p className="eyebrow">Papa Monrovia Street · Accra</p>
          <h1 className="app-title mt-4 text-5xl md:text-7xl">
            Hot chicken, rice bowls, and calm Accra hangout energy.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[var(--ink-soft)]">
            Chiq-N-Grill is built for quick cravings, dine-in meals, pickup orders, delivery requests, and customers who already know the chicken is the main event.
          </p>

          <div className="mt-8 grid gap-3 sm:flex">
            <CTAButton href="/menu" variant="flame">Order Food</CTAButton>
            <CTAButton href="/reservations" variant="outline">Reserve Table</CTAButton>
            <CTAButton href={restaurant.mapsUrl} variant="outline" external>Directions</CTAButton>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => (
              <a key={action.href} href={action.href} className="solid-card p-4">
                <p className="text-xl font-black">{action.title}</p>
                <p className="mt-1 text-sm font-bold text-[var(--ink-soft)]">{action.detail}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mobile-app-frame mx-auto w-full max-w-[430px]">
          <div className="border-b-2 border-[var(--line)] bg-[var(--ink)] px-5 py-4 text-[var(--paper)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black">Chiq-N-Grill</span>
              <span className="rounded-full bg-[var(--clay)] px-3 py-1 text-xs font-black">Open 11 AM</span>
            </div>
          </div>
          <div className="p-5">
            <div className="food-tile" />
            <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
              <div>
                <p className="eyebrow">Popular order</p>
                <h2 className="mt-2 text-3xl font-black leading-tight">Breaded & Buttered Combo</h2>
                <p className="mt-2 text-sm font-bold text-[var(--ink-soft)]">Crispy chicken, rice or fries, sauce, and full flavor.</p>
              </div>
              <div className="rounded-[18px] border-2 border-[var(--line)] bg-[var(--paper-deep)] p-3 text-center">
                <p className="text-xs font-black text-[var(--ink-soft)]">From</p>
                <p className="text-xl font-black">GH₵70</p>
              </div>
            </div>
            <a href="/menu" className="btn-primary mt-5 w-full">Add meals</a>
          </div>
        </div>
      </section>

      <section className="app-container py-14">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading eyebrow="Customer-loved plates" title="Real menu energy, not stock food copy." />
          <CTAButton href="/menu" variant="outline">Browse Menu</CTAButton>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {featuredItems.map((item) => (
            <article key={item.id} className="solid-card p-4">
              <div className="food-tile" />
              <p className="eyebrow mt-5">{item.badge}</p>
              <h3 className="mt-2 text-2xl font-black leading-tight">{item.name}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-[var(--ink-soft)]">{item.description}</p>
              <div className="mt-5 flex items-center justify-between border-t-2 border-[var(--line)] pt-4 text-sm font-black">
                <span>GH₵{item.priceFrom}+</span>
                <span>{item.prepTime}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="app-container py-14">
        <div className="solid-panel-dark grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <p className="eyebrow text-[#f3b35f]">Web app flow</p>
            <h2 className="app-title mt-3 text-4xl md:text-6xl">Built to sell food from a phone.</h2>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-[#f3dfc3]">
              The client demo should feel like a restaurant app: tap, browse, order, reserve, track, and return later from the home screen.
            </p>
          </div>
          <div className="grid gap-4">
            {appFeatures.map((feature) => (
              <a key={feature.href} href={feature.href} className="rounded-[22px] border-2 border-[#fff7ec] bg-[#fff7ec] p-5 text-[var(--ink)]">
                <h3 className="text-2xl font-black">{feature.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--ink-soft)]">{feature.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container py-14">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="solid-panel p-6 md:p-10">
            <p className="eyebrow">What customers mention</p>
            <h2 className="app-title mt-3 text-4xl md:text-5xl">Flavor, setup, music, and well-seasoned chicken.</h2>
            <div className="mt-6 grid gap-3">
              {reviewHighlights.map((review) => (
                <blockquote key={review} className="rounded-[18px] border-2 border-[var(--line)] bg-[var(--paper)] p-4 font-black leading-7">
                  “{review}”
                </blockquote>
              ))}
            </div>
          </div>

          <div className="solid-panel p-6 md:p-10">
            <p className="eyebrow">Visit or call</p>
            <h2 className="app-title mt-3 text-4xl md:text-5xl">Find Chiq-N-Grill in Accra.</h2>
            <div className="mt-6 space-y-3 text-base font-bold text-[var(--ink-soft)]">
              <p>Address: {restaurant.address}</p>
              <p>Plus Code: {restaurant.plusCode}</p>
              <p>Phone: {restaurant.phone}</p>
              <p>Services: Dine-in, kerbside pickup, delivery</p>
            </div>
            <div className="mt-7 grid gap-3 sm:flex">
              <CTAButton href="/order" variant="flame">Start Order</CTAButton>
              <CTAButton href={restaurant.mapsUrl} variant="outline" external>Open Maps</CTAButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t-2 border-[var(--line)] bg-[var(--ink)] px-5 py-8 text-center text-sm font-bold text-[var(--paper)]">
        <p>{restaurant.name} · Order, reserve, track, and return from your home screen.</p>
      </footer>
    </main>
  );
}
