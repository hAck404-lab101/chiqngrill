"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchAdminDashboard, resetDemoData, type AdminDashboard } from "@/lib/admin-api";

const managementCards = [
  { title: "Orders", description: "View customer orders and prepare status updates.", href: "/admin/orders", cta: "Manage orders", badge: "Live" },
  { title: "Reservations", description: "Review table requests from customers.", href: "/admin/reservations", cta: "View requests", badge: "Tables" },
  { title: "Menu Manager", description: "Add meals, prices, categories, and image URLs.", href: "/admin/menu", cta: "Edit menu", badge: "Food" },
  { title: "Gallery", description: "Replace placeholders with real food and restaurant images.", href: "/admin/gallery", cta: "Manage photos", badge: "Media" },
  { title: "Homepage", description: "Edit hero text, announcement, and featured meal.", href: "/admin/homepage", cta: "Edit homepage", badge: "Content" },
  { title: "Settings", description: "Update phone, WhatsApp, address, maps, and opening hours.", href: "/admin/settings", cta: "Open settings", badge: "Config" }
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
    <AdminShell title="Control the restaurant app" description="Manage orders, reservations, menu, gallery, homepage content, and business settings from one protected area.">
      <div className="mb-6 flex flex-col gap-3 rounded-[28px] bg-[#241713] p-5 text-white shadow-[0_18px_50px_rgba(36,23,19,0.12)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black text-[#f2b36f]">Setup tools</p>
          <h2 className="mt-1 text-2xl font-black">Prepare this dashboard for the business.</h2>
          <p className="mt-1 text-sm font-medium text-[#ead9ca]">Reset only clears demo orders and reservations. Menu and content remain in place.</p>
        </div>
        <button onClick={handleResetDemo} disabled={isResetting} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#16110d] disabled:opacity-60">
          {isResetting ? "Resetting..." : "Reset demo data"}
        </button>
      </div>

      {isLoading ? <p className="font-bold text-[#76675d]">Loading admin dashboard...</p> : null}
      {error ? <p className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}

      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-5">
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

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {managementCards.map((card) => (
              <a key={card.href} href={card.href} className="group overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(36,23,19,0.12)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-[#efe0d0] px-3 py-1 text-xs font-black text-[#9d431f]">{card.badge}</span>
                  <span className="grid size-10 place-items-center rounded-2xl bg-[#fff8ef] text-lg font-black text-[#d86b2b] transition group-hover:bg-[#d86b2b] group-hover:text-white">→</span>
                </div>
                <h2 className="mt-5 text-2xl font-black">{card.title}</h2>
                <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-[#76675d]">{card.description}</p>
                <span className="mt-5 inline-flex rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">{card.cta}</span>
              </a>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">Recent Orders</h2>
                <a href="/admin/orders" className="text-sm font-black text-[#d86b2b]">View all</a>
              </div>
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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">Recent Reservations</h2>
                <a href="/admin/reservations" className="text-sm font-black text-[#d86b2b]">View all</a>
              </div>
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
    </AdminShell>
  );
}
