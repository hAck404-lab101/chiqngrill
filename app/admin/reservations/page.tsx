"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchAdminReservations, type AdminReservation } from "@/lib/admin-api";

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setReservations(await fetchAdminReservations());
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
        else setError(err instanceof Error ? err.message : "Could not load reservations");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [router]);

  return (
    <AdminShell title="Reservations" description="View table requests submitted from the customer reservation page.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black">Table Requests</h2>
          <span className="rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#9d431f]">{reservations.length} total</span>
        </div>
        {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading reservations...</p> : null}
        <div className="mt-5 grid gap-3">
          {reservations.length === 0 && !isLoading ? <p className="rounded-2xl bg-[#fff8ef] p-4 text-sm font-bold text-[#76675d]">No reservations yet.</p> : null}
          {reservations.map((reservation) => (
            <article key={String(reservation.reference)} className="rounded-2xl bg-[#fff8ef] p-4">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                <div>
                  <p className="font-black">{String(reservation.reference)}</p>
                  <p className="mt-1 text-sm font-semibold text-[#76675d]">{String(reservation.name)} · {String(reservation.phone)}</p>
                </div>
                <div className="md:text-right">
                  <p className="font-black text-[#9d431f]">{String(reservation.date)} · {String(reservation.time)}</p>
                  <p className="mt-1 text-sm font-bold text-[#76675d]">{String(reservation.guests)} guests · {String(reservation.status)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
