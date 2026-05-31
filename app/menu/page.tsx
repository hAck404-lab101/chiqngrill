import { CTAButton } from "@/components/cta-button";
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
            <CTAButton href={restaurant.phoneHref} variant="flame">Call</CTAButton>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <SectionHeading
            eyebrow="Digital menu"
            title="Explore the grill before you order."
            description="Browse customer-loved chicken combos, rice meals, fries, smoky options, and quick cravings."
          />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">Ordering mode</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {['Dine-in', 'Pickup', 'Delivery', 'Kerbside'].map((mode) => (
                <button key={mode} className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-cream/80 transition hover:border-gold hover:text-gold">
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <a key={category} href={`#${category.toLowerCase().replaceAll(' ', '-')}`} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-cream/75 hover:border-gold hover:text-gold">
              {category}
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-14">
          {categories.map((category) => (
            <section key={category} id={category.toLowerCase().replaceAll(' ', '-')}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-black md:text-3xl">{category}</h2>
                <span className="text-sm text-cream/50">{menuItems.filter((item) => item.category === category).length} items</span>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <article key={item.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-gold/40">
                      <div className="mb-5 h-48 rounded-[1.5rem] bg-gradient-to-br from-flame/55 via-smoke to-black" />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{item.badge}</p>
                        <p className="rounded-full bg-flame/15 px-3 py-1 text-xs font-black text-flame">{item.spiceLevel}</p>
                      </div>
                      <h3 className="mt-3 text-2xl font-black">{item.name}</h3>
                      <p className="mt-3 min-h-16 text-sm leading-6 text-cream/65">{item.description}</p>
                      <div className="mt-5 flex items-center justify-between text-sm text-cream/60">
                        <span>From GH₵{item.priceFrom}</span>
                        <span>{item.prepTime}</span>
                      </div>
                      <a
                        href={`${restaurant.whatsappUrl}%20Meal%3A%20${encodeURIComponent(item.name)}`}
                        className="mt-5 block rounded-full bg-cream px-5 py-3 text-center text-sm font-black text-charcoal transition hover:bg-gold"
                      >
                        Add via WhatsApp
                      </a>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
