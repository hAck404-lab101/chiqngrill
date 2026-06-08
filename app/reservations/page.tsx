"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CTAButton } from "@/components/cta-button";
import { CheckIcon } from "@/components/icons";
import { fetchHomepageContent, resolvePublicAssetUrl, createReservation } from "@/lib/api-client";

const occasions = ["Casual visit", "Family meal", "Birthday", "Friends hangout", "Business lunch"];

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState(occasions[0]);
  const [notes, setNotes] = useState("");
  const [reservationImageUrl, setReservationImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    async function loadVisual() {
      const content = await fetchHomepageContent();
      setReservationImageUrl(resolvePublicAssetUrl(content.reservationImageUrl || content.heroImageUrl));
    }
    void loadVisual();
  }, []);

  async function submitReservation(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    setReference("");

    if (!name.trim() || !phone.trim() || !date || !time || !guests) {
      setError("Fill in your name, phone, date, time, and number of guests.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation = await createReservation({ name: name.trim(), phone: phone.trim(), date, time, guests: Number(guests), occasion, notes: notes.trim() });
      setReference(reservation.reference);
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit reservation. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetReservation() {
    setReference("");
    setError("");
    setName("");
    setPhone("");
    setDate("");
    setTime("19:00");
    setGuests("2");
    setOccasion(occasions[0]);
    setNotes("");
  }

  return (
    <main className="app-page">
      <AppHeader />
      <section className="store-shell grid gap-6 py-6 md:grid-cols-[0.82fr_1.18fr] md:items-start md:py-12">
        <div>
          <p className="eyebrow">Reserve</p>
          <h1 className="app-title mt-2 text-4xl md:text-6xl">Book a table</h1>
          <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[var(--muted)] md:text-base md:leading-7">Pick a time, group size, and occasion. The request goes straight to admin for response.</p>

          <div className="store-panel mt-6 overflow-hidden p-3">
            {reservationImageUrl ? <img src={reservationImageUrl} alt="Reserve table" className="h-[210px] w-full rounded-3xl object-cover" /> : <div className="food-tile min-h-[210px]" />}
            <div className="p-2 pt-4">
              <p className="text-lg font-black">Good for dine-in moments</p>
              <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted)]">Birthdays, friends, family meals, business lunch, and calm evening visits.</p>
              <div className="mt-4 flex flex-wrap gap-2">{occasions.slice(0, 4).map((item) => <span key={item} className="pill">{item}</span>)}</div>
            </div>
          </div>
        </div>

        <div className="store-panel p-5 md:p-6">
          <form onSubmit={submitReservation}>
            <h2 className="text-2xl font-black">Reservation details</h2>
            <p className="mt-1 text-sm font-medium text-[var(--muted)]">Keep it simple. We only need the details to confirm your table.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="app-label">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="app-input" /></label>
              <label className="app-label">Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="app-input" /></label>
              <label className="app-label">Guests<input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} className="app-input" /></label>
              <label className="app-label">Occasion<select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="app-input">{occasions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="app-label">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Your name" /></label>
              <label className="app-label">Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} className="app-input" placeholder="024 XXX XXXX" /></label>
              <label className="app-label md:col-span-2">Special request<textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="app-input min-h-24" placeholder="Seating preference, arrival note, group setup..." /></label>
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className="btn-primary mt-5 w-full disabled:opacity-50">{isSubmitting ? "Submitting request..." : "Request Table"}</button>
          </form>
        </div>
      </section>

      {reference ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-green-700"><CheckIcon className="size-8" /></span>
            <h2 className="mt-5 text-3xl font-black">Request sent</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">Your table request was sent. Admin can now confirm or decline it.</p>
            <div className="mt-5 rounded-3xl bg-green-50 p-4 text-green-900"><p className="text-xs font-black uppercase tracking-[0.12em]">Reference</p><p className="mt-1 text-2xl font-black">{reference}</p></div>
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={resetReservation} className="btn-outline">New Reservation</button>
              <CTAButton href="/menu" variant="flame">Order Food</CTAButton>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
