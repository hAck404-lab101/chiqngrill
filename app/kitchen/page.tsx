"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, fetchAdminOrders, type AdminOrder } from "@/lib/admin-api";

const statusLanes = [
  { title: "New", status: "Pending", helper: "Accept or start preparing", tone: "bg-[#fff8ef]" },
  { title: "Preparing", status: "Preparing", helper: "Currently in kitchen", tone: "bg-[#fff3df]" },
  { title: "Ready", status: "Ready", helper: "Packed for pickup or dispatch", tone: "bg-[#eff8ef]" },
  { title: "Done", status: "Completed", helper: "Finished orders", tone: "bg-white" }
];

const fallbackOrders: AdminOrder[] = [
  {
    reference: "CNG-0007",
    customerName: "Walk-in pickup",
    status: "Pending",
    subtotal: 210,
    orderMode: "Pickup",
    createdAt: "Just now",
    items: [
      { name: "Breaded & Buttered Combo", quantity: 2, lineTotal: 140 },
      { name: "Jollof Rice Plate", quantity: 1, lineTotal: 70 }
    ]
  },
  {
    reference: "CNG-0005",
    customerName: "Delivery customer",
    status: "Preparing",
    subtotal: 145,
    orderMode: "Delivery",
    createdAt: "12 min ago",
    items: [
      { name: "Spicy Well-Seasoned Chicken", quantity: 1, lineTotal: 65 },
      { name: "Herb Butter Rice", quantity: 1, lineTotal: 75 }
    ]
  },
  {
    reference: "CNG-0003",
    customerName: "Kerbside pickup",
    status: "Ready",
    subtotal: 85,
    orderMode: "Kerbside Pickup",
    createdAt: "Ready now",
    items: [{ name: "Jerk Chicken Option", quantity: 1, lineTotal: 85 }]
  }
];

function normalizeStatus(value: unknown) {
  const status = String(value || "Pending");
  if (status === "Accepted") return "Pending";
  if (status === "Out for delivery") return "Ready";
  if (status === "Cancelled") return "Completed";
  return status;
}

function getOrderItems(order: AdminOrder) {
  const rawItems = Array.isArray(order.items) ? order.items : [];
  return rawItems.map((item) => ({
    name: String(item.name || "Menu item"),
    quantity: Number(item.quantity || 1),
    lineTotal: Number(item.lineTotal || 0)
  }));
}

export default function KitchenPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>(fallbackOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("Not synced yet");

  async function loadOrders() {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchAdminOrders();
      setOrders(data.length ? data : fallbackOrders);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("authentication")) {
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load kitchen orders");
      setOrders(fallbackOrders);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  const groupedOrders = useMemo(() => {
    return statusLanes.map((lane) => ({
      ...lane,
      orders: orders.filter((order) => normalizeStatus(order.status) === lane.status)
    }));
  }, [orders]);

  const activeOrders = orders.filter((order) => !["Completed", "Cancelled"].includes(String(order.status))).length;
  const readyOrders = orders.filter((order) => normalizeStatus(order.status) === "Ready").length;

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#16110d]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-4 md:px-6">
          <a href="/admin" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d86b2b] text-sm font-black text-white">CNG</span>
            <div>
              <p className="text-sm font-black">Kitchen Display</p>
              <p className="text-xs font-semibold text-[#76675d]">Private staff area</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a href="/admin" className="hidden rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#16110d] sm:inline-flex">Admin</a>
            <button onClick={() => void loadOrders()} className="rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">Refresh</button>
            <button onClick={logout} className="hidden rounded-full bg-white px-4 py-2 text-sm font-black text-[#76675d] ring-1 ring-black/10 sm:inline-flex">Logout</button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-[1500px] px-4 py-5 md:px-6 md:py-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#efe0d0] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9d431f]">Kitchen operations</span>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Orders at a glance</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#76675d]">
              A clean kitchen board for staff to see new, preparing, ready, and completed orders without touching the customer app.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:min-w-[390px]">
            <div className="rounded-3xl bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
              <p className="text-xs font-bold text-[#76675d]">Active</p>
              <p className="mt-1 text-3xl font-black">{activeOrders}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
              <p className="text-xs font-bold text-[#76675d]">Ready</p>
              <p className="mt-1 text-3xl font-black">{readyOrders}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
              <p className="text-xs font-bold text-[#76675d]">Synced</p>
              <p className="mt-2 text-sm font-black">{lastUpdated}</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}. Showing sample kitchen tickets until the backend is reachable and you are logged in.
          </div>
        ) : null}

        {isLoading ? <p className="mt-5 text-sm font-bold text-[#76675d]">Loading kitchen orders...</p> : null}

        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {groupedOrders.map((lane) => (
            <section key={lane.status} className={`min-h-[420px] rounded-[32px] ${lane.tone} p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">{lane.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#76675d]">{lane.helper}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#9d431f] ring-1 ring-black/5">{lane.orders.length}</span>
              </div>

              <div className="mt-4 space-y-3">
                {lane.orders.length === 0 ? (
                  <div className="grid min-h-[180px] place-items-center rounded-3xl bg-white/70 p-5 text-center text-sm font-bold text-[#76675d]">
                    No orders here
                  </div>
                ) : null}

                {lane.orders.map((order) => {
                  const items = getOrderItems(order);
                  return (
                    <article key={String(order.reference)} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(36,23,19,0.07)] ring-1 ring-black/5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black">{String(order.reference)}</p>
                          <p className="mt-1 text-xs font-bold text-[#76675d]">{String(order.customerName || "Customer")} · {String(order.orderMode || "Order")}</p>
                        </div>
                        <span className="rounded-full bg-[#fff8ef] px-3 py-1 text-xs font-black text-[#9d431f]">GH₵{Number(order.subtotal || 0)}</span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {items.map((item) => (
                          <div key={`${order.reference}-${item.name}`} className="flex justify-between gap-3 rounded-2xl bg-[#f6f1ea] px-3 py-2 text-sm font-bold">
                            <span>{item.quantity}× {item.name}</span>
                            <span className="text-[#76675d]">GH₵{item.lineTotal}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#76675d]">
                        <span>{String(order.createdAt || "New")}</span>
                        <span>{String(order.status || "Pending")}</span>
                      </div>

                      <button className="mt-4 w-full rounded-full bg-[#d86b2b] px-4 py-3 text-sm font-black text-white">
                        Move forward
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
