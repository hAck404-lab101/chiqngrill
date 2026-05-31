import { CTAButton } from "@/components/cta-button";
import { MenuBrowser } from "@/components/menu-browser";
import { SectionHeading } from "@/components/section-heading";
import { categories, menuItems, restaurant } from "@/lib/restaurant-data";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />

      <header className="border-b border-white/10 bg-charcoal/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-sm font-black uppercase tracking-[0.28em] text-gold">
            Chiq-N-Grill
          </a>
          <div className="flex items-center gap-3">
            <CTAButton href="/order" variant="outline">Cart</CTAButton>
            <CTAButton href={restaurant.phoneHref} variant="flame">Call</CTAButton>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <SectionHeading
            eyebrow="Digital menu"
            title="Find your plate faster."
            description="Search meals, filter by category, spice level, price, and availability, then add favorites to cart before checkout."
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Ordering mode</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {["Dine-in", "Pickup", "Delivery", "Kerbside"].map((mode) => (
                <a key={mode} href="/order" className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-bold text-cream/80 transition hover:border-gold hover:text-gold">
                  {mode}
                </a>
              ))}
            </div>
          </div>
        </div>

        <MenuBrowser items={menuItems} categories={categories} />
      </section>
    </main>
  );
}
