const lanes = [
  {
    title: "New Orders",
    orders: [
      { ref: "CNG-0007", items: "2x Breaded Combo, 1x Jollof", time: "2 min ago" },
      { ref: "CNG-0008", items: "1x Herb Butter Rice", time: "5 min ago" }
    ]
  },
  {
    title: "Preparing",
    orders: [
      { ref: "CNG-0005", items: "3x Spicy Chicken", time: "12 min ago" },
      { ref: "CNG-0006", items: "1x Jerk Chicken", time: "15 min ago" }
    ]
  },
  {
    title: "Ready",
    orders: [
      { ref: "CNG-0003", items: "Chicken & Fries Combo", time: "Ready now" }
    ]
  }
];

export default function KitchenPage() {
  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />
      <header className="border-b border-white/10 bg-charcoal/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/admin" className="text-sm font-black uppercase tracking-[0.28em] text-gold">Kitchen View</a>
          <p className="rounded-full bg-flame px-4 py-2 text-sm font-black text-charcoal">Protected route pending</p>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Operations screen</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Move orders from new to ready.</h1>
        <p className="mt-4 max-w-3xl text-cream/65">This static kitchen screen prepares the workflow for cooks and staff before real-time backend order updates are connected.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {lanes.map((lane) => (
            <section key={lane.title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">{lane.title}</h2>
                <span className="rounded-full border border-gold/30 px-3 py-1 text-sm font-black text-gold">{lane.orders.length}</span>
              </div>
              <div className="mt-5 space-y-4">
                {lane.orders.map((order) => (
                  <article key={order.ref} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="font-black text-gold">{order.ref}</p>
                    <p className="mt-2 leading-7 text-cream/70">{order.items}</p>
                    <p className="mt-3 text-sm text-cream/45">{order.time}</p>
                    <button className="mt-5 w-full rounded-full bg-cream px-5 py-3 text-sm font-black text-charcoal hover:bg-gold">Move Forward</button>
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
