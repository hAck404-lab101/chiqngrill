import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { fetchHomepageContent, resolvePublicAssetUrl } from "@/lib/api-client";
import { menuItems, restaurant, reviewHighlights } from "@/lib/restaurant-data";

const featuredItems = menuItems.slice(0, 6);
const categories = ["Chicken", "Rice", "Combos", "Sides", "Drinks"];
const serviceLinks = [
  { label: "Order", href: "/menu" },
  { label: "Reserve", href: "/reservations" },
  { label: "Track", href: "/track" },
  { label: "Delivery", href: "/delivery" }
];

export default async function Home() {
  const homepage = await fetchHomepageContent();
  const heroImage = resolvePublicAssetUrl(homepage.heroImageUrl);

  return (
    <main className="app-page overflow-hidden">
      <div className="store-strip">{homepage.announcement || "Order online · Pickup · Delivery · Dine-in at Papa Monrovia Street, Accra"}</div>
      <AppHeader />

      <section className="store-shell py-6 md:py-8">
        <div className="store-panel overflow-hidden">
          <div
            className="h-40 bg-[linear-gradient(135deg,#241713_0%,#d86b2b_58%,#f3b35f_100%)] bg-cover bg-center md:h-56"
            style={heroImage ? { backgroundImage: `linear-gradient(0deg, rgba(36,23,19,0.18), rgba(36,23,19,0.18)), url(${heroImage})` } : undefined}
          />
          <div className="px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-12 flex flex-col gap-5 md:-mt-14 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="store-avatar">CNG</div>
                <div className="pb-1">
                  <p className="store-chip">Chicken restaurant</p>
                  <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] md:text-6xl">Chiq-N-Grill</h1>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[var(--muted)]">
                    {homepage.heroSubtitle || "Well-seasoned chicken, jollof, rice meals, sides, pickup, delivery, and dine-in requests from Accra."}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:flex">
                <CTAButton href="/menu" variant="flame">Order Now</CTAButton>
                <CTAButton href={restaurant.phoneHref} variant="outline">Call</CTAButton>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <div className="rounded-3xl bg-[var(--paper)] p-4"><p className="text-xs font-bold text-[var(--muted)]">Rating</p><p className="mt-1 text-xl font-black">3.9 · 116</p></div>
              <div className="rounded-3xl bg-[var(--paper)] p-4"><p className="text-xs font-bold text-[var(--muted)]">Price</p><p className="mt-1 text-xl font-black">GH₵50–150</p></div>
              <div className="rounded-3xl bg-[var(--paper)] p-4"><p className="text-xs font-bold text-[var(--muted)]">Opens</p><p className="mt-1 text-xl font-black">11 AM</p></div>
              <div className="rounded-3xl bg-[var(--paper)] p-4"><p className="text-xs font-bold text-[var(--muted)]">Service</p><p className="mt-1 text-xl font-black">Pickup · Delivery</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="store-shell pb-5">
        <div className="grid grid-cols-4 gap-2 md:flex md:justify-center">
          {serviceLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-3xl bg-white px-3 py-4 text-center text-sm font-black shadow-[var(--shadow-card)] ring-1 ring-[var(--line)] transition hover:-translate-y-0.5">
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <section className="store-shell py-5">
        <div className="store-panel p-4 md:p-5">
          <p className="eyebrow">Browse categories</p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <a key={category} href="/menu" className="store-category bg-[var(--soft)] text-[var(--ink)]">{category}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="store-shell py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Popular today</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] md:text-5xl">Order customer favorites</h2>
          </div>
          <a href="/menu" className="hidden rounded-full bg-[var(--dark)] px-5 py-3 text-sm font-black text-white md:inline-flex">View all</a>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <article key={item.id} className="store-product p-3">
              <div className="product-image" />
              <div className="p-2 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="store-chip">{item.category}</span>
                  <span className="text-sm font-black text-[var(--brand-dark)]">GH₵{item.priceFrom}+</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight">{item.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[var(--muted)]">{item.description}</p>
                <a href="/menu" className="mt-4 inline-flex w-full justify-center rounded-full bg-[var(--brand)] px-4 py-3 text-sm font-black text-white">Add to order</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="store-shell py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="store-panel p-5 md:p-7">
            <p className="eyebrow">Customer love</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">Reviews mention the taste and atmosphere.</h2>
            <div className="mt-5 grid gap-3">
              {reviewHighlights.slice(0, 3).map((review) => (
                <blockquote key={review} className="rounded-3xl bg-[var(--paper)] p-4 text-sm font-bold leading-6">“{review}”</blockquote>
              ))}
            </div>
          </div>

          <div className="store-panel p-5 md:p-7">
            <p className="eyebrow">Visit</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">{restaurant.address}</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-[var(--muted)]">
              <p>Plus Code: {restaurant.plusCode}</p>
              <p>Phone: {restaurant.phone}</p>
              <p>Dine-in · Kerbside pickup · Delivery</p>
            </div>
            <div className="mt-6 grid gap-3 sm:flex">
              <CTAButton href={restaurant.mapsUrl} variant="outline" external>Directions</CTAButton>
              <CTAButton href="/reservations" variant="flame">Reserve</CTAButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-[var(--line)] px-5 py-8 text-center text-sm font-semibold text-[var(--muted)]">
        <p>{restaurant.name} · Storefront ordering app powered for pickup, delivery, tracking, admin, and kitchen operations.</p>
      </footer>
    </main>
  );
}
