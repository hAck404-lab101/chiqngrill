"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchAdminOrders, type AdminOrder } from "@/lib/admin-api";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setOrders(await fetchAdminOrders());
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
        else setError(err instanceof Error ? err.message : "Could not load orders");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [router]);

  return (
    <AdminShell title="Orders" description="View customer orders, payment methods, customer details, and preparation status.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black">All Orders</h2>
          <span className="w-fit rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#9d431f]">{orders.length} total</span>
        </div>
        {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading orders...</p> : null}
        <div className="mt-5 grid gap-3">
          {orders.length === 0 && !isLoading ? <p className="rounded-2xl bg-[#fff8ef] p-4 text-sm font-bold text-[#76675d]">No orders yet.</p> : null}
          {orders.map((order) => (
            <article key={String(order.reference)} className="rounded-[24px] bg-[#fff8ef] p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <p className="font-black">{String(order.reference)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#76675d]">{String(order.customerName)} · {String(order.phone)} · {String(order.orderMode)}</p>
                  <p className="mt-1 text-sm font-bold text-[#9d431f]">Payment: {String(order.paymentMethod || "Not selected")}</p>
                  <p className="mt-1 text-xs font-bold text-[#76675d]">Payment status: {String(order.paymentStatus || "Pending")}</p>
                </div>
                <div className="md:text-right">
                  <p className="font-black text-[#9d431f]">GH₵{String(order.subtotal)}</p>
                  <p className="mt-1 text-sm font-bold text-[#76675d]">{String(order.status)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
