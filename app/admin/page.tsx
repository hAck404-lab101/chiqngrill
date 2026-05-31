const stats = [
  { label: "Today’s orders", value: "24", detail: "+8 since lunch" },
  { label: "Pending orders", value: "6", detail: "Needs kitchen action" },
  { label: "Estimated revenue", value: "GH₵2,840", detail: "MVP placeholder" },
  { label: "Top item", value: "Jollof Plate", detail: "Most requested" }
];

const sections = [
  "Orders",
  "Menu Items",
  "Categories",
  "Promos",
  "Reservations",
  "Gallery",
  "Reviews",
  "Delivery Zones",
  "Settings"
];

const orderStates = [
  { id: "CNG-20260531-0001", customer: "Walk-in pickup", status: "Preparing", total: "GH₵210" },
  { id: "CNG-20260531-0002", customer: "Delivery customer", status: "Pending", total: "GH₵145" },
  { id: "CNG-20260531-0003", customer: "Kerbside pickup", status: "Ready", total: "GH₵85" }
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5efe5] text-charcoal">
      <header className="border-b border-charcoal/10 bg-[#f5efe5]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-sm font-black uppercase tracking-[0.28em] text-flame">
            CNG Admin
          </a>
          <p className="rounded-full bg-charcoal px-4 py-2 text-sm font-bold text-cream">
            Protected route pending
          </p>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Operations dashboard</p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">Run the grill with clarity.</h1>
            <p className="mt-4 max-w-2xl text-charcoal/65">
              This admin shell prepares the management side for orders, menu items, promos, reviews, delivery zones, and settings.
            </p>
          </div>
          <a href="/order" className="rounded-full bg-flame px-6 py-4 text-center font-black text-charcoal hover:bg-gold">
            View Order Flow
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-[2rem] border border-charcoal/10 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-charcoal/55">{stat.label}</p>
              <h2 className="mt-3 text-4xl font-black">{stat.value}</h2>
              <p className="mt-2 text-sm text-flame">{stat.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[2rem] border border-charcoal/10 bg-white p-6">
            <h2 className="text-2xl font-black">Management areas</h2>
            <div className="mt-5 grid gap-3">
              {sections.map((section) => (
                <button key={section} className="rounded-2xl border border-charcoal/10 px-4 py-4 text-left font-black text-charcoal/75 transition hover:border-flame hover:text-flame">
                  {section}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-charcoal/10 bg-charcoal p-6 text-cream">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Recent order states</h2>
              <span className="rounded-full border border-gold/30 px-4 py-2 text-sm font-bold text-gold">Kitchen view next</span>
            </div>
            <div className="mt-6 space-y-4">
              {orderStates.map((order) => (
                <article key={order.id} className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-gold">{order.id}</p>
                    <p className="mt-1 text-sm text-cream/65">{order.customer}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-black">{order.status}</p>
                    <p className="text-sm text-cream/60">{order.total}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
