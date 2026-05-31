const favorites = [
  {
    name: "Breaded & Buttered Combo",
    tag: "Customer-loved",
    description: "Golden chicken with a crisp bite, built for serious cravings."
  },
  {
    name: "Spicy Well-Seasoned Chicken",
    tag: "Bold flavor",
    description: "Juicy chicken with heat, depth, and grill-house character."
  },
  {
    name: "Jollof Rice Plate",
    tag: "Comfort side",
    description: "Rich jollof paired with chicken, sauce, and full Accra energy."
  },
  {
    name: "Herb Butter Rice",
    tag: "Smooth balance",
    description: "Buttery, aromatic rice that cools the spice and completes the plate."
  }
];

const reviewHighlights = [
  "Delicious food and spicy, well-seasoned chicken.",
  "I do like the setup.",
  "Enjoyed the soothing music with my meal.",
  "The food actually tastes great."
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-charcoal text-cream">
      <div className="noise-overlay" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#home" className="text-lg font-black tracking-[0.28em] text-cream">
            CNG
          </a>
          <div className="hidden items-center gap-8 text-sm text-cream/75 md:flex">
            <a href="#menu" className="hover:text-gold">Menu</a>
            <a href="#experience" className="hover:text-gold">Experience</a>
            <a href="#reviews" className="hover:text-gold">Reviews</a>
            <a href="#location" className="hover:text-gold">Location</a>
          </div>
          <a
            href="tel:+233533615069"
            className="rounded-full bg-flame px-5 py-2 text-sm font-bold text-charcoal shadow-warm transition hover:scale-105"
          >
            Call to Order
          </a>
        </nav>
      </header>

      <section id="home" className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24">
        <div className="relative z-10">
          <p className="mb-5 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">
            Papa Monrovia Street, Accra · Opens 11 AM
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-cream md:text-7xl">
            Bold Chicken. Smooth Vibes. Accra’s Grill Experience.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-cream/75">
            Enjoy well-seasoned chicken, comforting rice meals, fries, drinks, and a relaxed dine-in atmosphere made for lunch, dinner, pickup, and delivery.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a href="#menu" className="rounded-full bg-cream px-7 py-4 text-center font-black text-charcoal transition hover:bg-gold">
              View Menu
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Chiq-N-Grill%20Papa%20Monrovia%20Street%20Accra" className="rounded-full border border-cream/25 px-7 py-4 text-center font-black text-cream transition hover:border-gold hover:text-gold">
              Get Directions
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 text-sm text-cream/75 sm:grid-cols-4">
            {['Dine-in', 'Kerbside Pickup', 'Delivery', 'GH₵50–150'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[30rem] rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-smoke via-charcoal to-black p-5 shadow-warm">
          <div className="absolute inset-5 rounded-[2rem] border border-gold/20 bg-[radial-gradient(circle_at_50%_25%,rgba(245,176,65,0.18),transparent_18rem)]" />
          <div className="relative flex h-full flex-col justify-end rounded-[2rem] bg-black/25 p-6">
            <div className="max-w-sm rounded-3xl border border-white/10 bg-charcoal/70 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">Signature Mood</p>
              <h2 className="mt-3 text-3xl font-black">Chicken with character.</h2>
              <p className="mt-3 text-cream/70">
                Built for real food photography, warm light, smoky texture, and a premium Accra food vibe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-flame">Customer-loved favorites</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">Made hot. Served bold.</h2>
          </div>
          <a href="tel:+233533615069" className="rounded-full border border-gold/40 px-6 py-3 text-sm font-bold text-gold hover:bg-gold hover:text-charcoal">
            Call 053 361 5069
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {favorites.map((item) => (
            <article key={item.name} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.07]">
              <div className="mb-5 h-44 rounded-[1.5rem] bg-gradient-to-br from-flame/60 via-smoke to-black" />
              <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{item.tag}</p>
              <h3 className="mt-3 text-xl font-black">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-cream/65">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-[2.5rem] border border-white/10 bg-cream p-8 text-charcoal md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-flame">The experience</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black md:text-6xl">More than chicken. It’s the whole mood.</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal/70">
            A relaxed grill house with good music, calm atmosphere, cold drinks, and flavorful meals made for friends, quick cravings, and weekend visits.
          </p>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {['Soothing music', 'Serene atmosphere', 'Freshly prepared meals'].map((item) => (
              <div key={item} className="rounded-3xl border border-charcoal/10 bg-white p-5 font-black shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-flame">Social proof</p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">What customers love.</h2>
        <p className="mt-4 max-w-2xl text-cream/70">
          Rated 3.9 by 100+ customers, with regular praise for flavor, atmosphere, music, and well-seasoned chicken.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {reviewHighlights.map((review) => (
            <blockquote key={review} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-lg font-bold leading-8">
              “{review}”
            </blockquote>
          ))}
        </div>
      </section>

      <section id="location" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-6 rounded-[2.5rem] border border-white/10 bg-smoke p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-gold">Find us</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">Visit Chiq-N-Grill in Accra.</h2>
            <div className="mt-6 space-y-3 text-cream/75">
              <p>Address: Papa Monrovia Street, Accra</p>
              <p>Plus Code: HR78+C3 Accra</p>
              <p>Phone: 053 361 5069</p>
              <p>Services: Dine-in, kerbside pickup, delivery</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-gold/20 bg-charcoal p-6">
            <h3 className="text-2xl font-black">Hungry now?</h3>
            <p className="mt-3 text-cream/70">Order your favorite meal or open directions before you move.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="tel:+233533615069" className="rounded-full bg-flame px-6 py-4 text-center font-black text-charcoal">Call to Order</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Chiq-N-Grill%20Papa%20Monrovia%20Street%20Accra" className="rounded-full border border-cream/20 px-6 py-4 text-center font-black">Open Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-cream/55">
        <p>Chiq-N-Grill — Bold chicken, smooth vibes, and flavorful meals in Accra.</p>
      </footer>
    </main>
  );
}
