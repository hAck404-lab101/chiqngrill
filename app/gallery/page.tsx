import { CTAButton } from "@/components/cta-button";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const galleryItems = [
  { title: "Golden Chicken", mood: "Crispy · Juicy · Bold", size: "md:row-span-2" },
  { title: "Jollof Plates", mood: "Comfort · Rich · Accra", size: "" },
  { title: "Herb Butter Rice", mood: "Smooth · Warm · Aromatic", size: "" },
  { title: "Fries & Sides", mood: "Quick · Crunchy · Saucy", size: "" },
  { title: "Interior Mood", mood: "Serene · Music · Hangout", size: "md:row-span-2" },
  { title: "Drinks & Chill", mood: "Cold · Social · Relaxed", size: "" }
];

export default function GalleryPage() {
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

      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Food gallery"
            title="The grill should sell before the first bite."
            description="Use this page for real Chiq-N-Grill food photography, interior shots, customer moments, and short visual proof of the dining vibe."
          />
          <CTAButton href={restaurant.whatsappUrl} variant="flame" external>
            Order on WhatsApp
          </CTAButton>
        </div>

        <div className="mt-12 grid auto-rows-[16rem] gap-5 md:grid-cols-3">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-flame/50 via-smoke to-black p-6 shadow-warm ${item.size}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,244,230,0.2),transparent_18rem)] opacity-70 transition group-hover:scale-110" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="w-fit rounded-full border border-gold/30 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-gold">
                  Shot {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-3xl font-black">{item.title}</h2>
                  <p className="mt-2 text-sm font-bold text-cream/65">{item.mood}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <h2 className="text-2xl font-black">Photo direction before launch</h2>
          <p className="mt-3 max-w-4xl leading-8 text-cream/65">
            Replace these visual placeholders with real restaurant images: close-up chicken texture, plated jollof, herb butter rice, fries, drinks, seating setup, and customer table moments. This is what will make the website feel custom and not AI-generated.
          </p>
        </div>
      </section>
    </main>
  );
}
