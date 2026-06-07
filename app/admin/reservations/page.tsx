"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchAdminReservations, updateAdminReservationStatus, type AdminReservation } from "@/lib/admin-api";

const responseActions = ["Confirmed", "Declined", "Completed", "Cancelled"];

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReference, setUpdatingReference] = useState("");

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

  useEffect(() => { void load(); }, []);

  async function respond(reference: string, status: string) {
    setUpdatingReference(reference);
    setError("");
    setSuccess("");
    try {
      const updated = await updateAdminReservationStatus(reference, status);
      setReservations((current) => current.map((item) => String(item.reference) === reference ? updated : item));
      setSuccess(`Reservation ${reference} marked as ${status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update reservation");
    } finally {
      setUpdatingReference("");
    }
  }

  return (
    <AdminShell title="Reservations" description="View table requests and respond with confirmation, decline, completion, or cancellation.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}
      <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Table Requests</h2>
            <p className="mt-1 text-sm font-semibold text-[#76675d]">Respond to reservations from the admin dashboard.</p>
          </div>
          <span className="w-fit rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#9d431f]">{reservations.length} total</span>
        </div>
        {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading reservations...</p> : null}
        <div className="mt-5 grid gap-3">
          {reservations.length === 0 && !isLoading ? <p className="rounded-2xl bg-[#fff8ef] p-4 text-sm font-bold text-[#76675d]">No reservations yet.</p> : null}
          {reservations.map((reservation) => {
            const reference = String(reservation.reference);
            return (
              <article key={reference} className="rounded-[24px] bg-[#fff8ef] p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <p className="font-black">{reference}</p>
                    <p className="mt-1 text-sm font-semibold text-[#76675d]">{String(reservation.name)} · {String(reservation.phone)}</p>
                    <p className="mt-1 text-sm font-medium text-[#76675d]">{String(reservation.occasion || "Casual visit")} · {String(reservation.notes || "No notes")}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="font-black text-[#9d431f]">{String(reservation.date)} · {String(reservation.time)}</p>
                    <p className="mt-1 text-sm font-bold text-[#76675d]">{String(reservation.guests)} guests · {String(reservation.status)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {responseActions.map((status) => (
                    <button key={status} type="button" onClick={() => void respond(reference, status)} disabled={updatingReference === reference} className={`rounded-full px-4 py-2 text-sm font-black disabled:opacity-50 ${String(reservation.status) === status ? "bg-[#d86b2b] text-white" : "bg-white text-[#16110d] ring-1 ring-black/10"}`}>
                      {updatingReference === reference ? "Updating..." : status}
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
