"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, fetchAdminDashboard, resetDemoData, type AdminDashboard } from "@/lib/admin-api";

const managementCards = [
  { title: "Orders", description: "View and update customer order states.", href: "/admin/orders" },
  { title: "Reservations", description: "Approve or decline table requests.", href: "/admin/reservations" },
  { title: "Menu Manager", description: "Add meals, prices, categories, and availability.", href: "/admin/menu" },
  { title: "Gallery", description: "Replace placeholders with real food and restaurant images.", href: "/admin/gallery" },
  { title: "Homepage", description: "Edit hero text, announcement, and featured meal.", href: "/admin/homepage" },
  { title: "Settings", description: "Update phone, WhatsApp, address, maps, and opening hours.", href: "/admin/settings" }
];

export default function AdminPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchAdminDashboard();
        setDashboard(data);
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load admin dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [router]);

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  async function handleResetDemo() {
    setIsResetting(true);
    setError("");
    try {
      await resetDemoData();
      const data = await fetchAdminDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset demo data");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#16110d]">
      <header className="border-b border-black/10 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a href="/admin" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d86b2b] text-sm font-black text-white">CNG</span>
            <div>
              <p className="text-sm font-black">Admin Dashboard</p>
              <p className="text-xs font-semibold text-[#76675d]">Private staff area</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a href="/kitchen" className="rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">Kitchen</a>
            <button onClick={logout} className="rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#16110d]">Logout</button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#efe0d0] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9d431f]">Operations</span>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Control the restaurant app.</h1>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#76675d]">
              Manage orders, reservations, menu, gallery, homepage content, and business settings from one protected area.
            </p>
          </div>
          <button onClick={handleResetDemo} disabled={isResetting} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#16110d] shadow-[0_12px_30px_rgba(36,23,19,0.08)] ring-1 ring-black/10 disabled:opacity-60">
            {isResetting ? "Resetting..." : "Reset demo data"}
          </button>
        </div>

        {isLoading ? <p className="mt-8 font-bold text-[#76675d]">Loading admin dashboard...</p> : null}
        {error ? <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

        {dashboard ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {[
                ["Orders", dashboard.totals.orders],
                ["Reservations", dashboard.totals.reservations],
                ["Menu Items", dashboard.totals.menuItems],
                ["Gallery", dashboard.totals.galleryItems],
                ["Revenue", `GH₵${dashboard.totals.revenue}`]
              ].map(([label, value]) => (
                <article key={label} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
                  <p className="text-sm font-bold text-[#76675d]">{label}</p>
                  <h2 className="mt-2 text-3xl font-black">{value}</h2>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {managementCards.map((card) => (
                <a key={card.href} href={card.href} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 transition hover:-translate-y-0.5">
                  <h2 className="text-2xl font-black">{card.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#76675d]">{card.description}</p>
                </a>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
                <h2 className="text-2xl font-black">Recent Orders</h2>
                <div className="mt-4 space-y-3">
                  {dashboard.recentOrders.length === 0 ? <p className="text-sm font-semibold text-[#76675d]">No orders yet.</p> : null}
                  {dashboard.recentOrders.map((order) => (
                    <div key={order.reference} className="rounded-2xl bg-[#fff8ef] p-4">
                      <p className="font-black">{order.reference}</p>
                      <p className="mt-1 text-sm font-semibold text-[#76675d]">{order.customerName} · {order.status} · GH₵{order.subtotal}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
                <h2 className="text-2xl font-black">Recent Reservations</h2>
                <div className="mt-4 space-y-3">
                  {dashboard.recentReservations.length === 0 ? <p className="text-sm font-semibold text-[#76675d]">No reservations yet.</p> : null}
                  {dashboard.recentReservations.map((reservation) => (
                    <div key={reservation.reference} className="rounded-2xl bg-[#fff8ef] p-4">
                      <p className="font-black">{reservation.reference}</p>
                      <p className="mt-1 text-sm font-semibold text-[#76675d]">{reservation.name} · {reservation.date} · {reservation.time}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
