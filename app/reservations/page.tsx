"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { SectionHeading } from "@/components/section-heading";
import { createReservation } from "@/lib/api-client";

const occasions = ["Casual visit", "Family meal", "Birthday", "Friends hangout", "Business lunch"];

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState(occasions[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function submitReservation() {
    setError("");
    setReference("");

    if (!name.trim() || !phone.trim() || !date || !time || !guests) {
      setError("Fill in your name, phone, date, time, and number of guests.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation = await createReservation({
        name: name.trim(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests),
        occasion,
        notes: notes.trim()
      });
      setReference(reservation.reference);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit reservation. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-page">
      <AppHeader />
      <section className="app-container grid gap-6 py-8 md:grid-cols-[0.85fr_1.15fr] md:py-12">
        <div>
          <SectionHeading eyebrow="Reservations" title="Book a table" description="Choose a date, time, and group size. We will save the request in the restaurant system." />
          <div className="surface mt-6 p-5">
            <p className="text-lg font-black">Good for</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {occasions.map((item) => <span key={item} className="pill">{item}</span>)}
            </div>
          </div>
        </div>

        <div className="surface p-5 md:p-6">
          <h1 className="text-2xl font-black">Reservation details</h1>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="app-label">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Your name" /></label>
            <label className="app-label">Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} className="app-input" placeholder="024 XXX XXXX" /></label>
            <label className="app-label">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="app-input" /></label>
            <label className="app-label">Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="app-input" /></label>
            <label className="app-label">Guests<input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} className="app-input" /></label>
            <label className="app-label">Occasion<select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="app-input">{occasions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="app-label md:col-span-2">Special request<textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="app-input min-h-24" placeholder="Seating preference, arrival note, group setup..." /></label>
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          {reference ? (
            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-800">
              <p className="text-sm font-bold">Reservation saved</p>
              <p className="mt-1 text-xl font-black">{reference}</p>
            </div>
          ) : null}

          <button type="button" onClick={submitReservation} disabled={isSubmitting} className="btn-primary mt-5 w-full disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Request Table"}
          </button>
        </div>
      </section>
    </main>
  );
}
