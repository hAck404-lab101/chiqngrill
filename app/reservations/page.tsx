"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { SectionHeading } from "@/components/section-heading";
import { restaurant } from "@/lib/restaurant-data";

const occasions = ["Casual visit", "Family meal", "Birthday", "Friends hangout", "Business lunch"];

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState(occasions[0]);
  const [notes, setNotes] = useState("");

  const reservationUrl = useMemo(() => {
    return `${restaurant.whatsappUrl}%0A%0AReservation Request%0AName: ${encodeURIComponent(name || "Guest")}%0APhone: ${encodeURIComponent(phone || "Not provided")}%0ADate: ${encodeURIComponent(date || "Not selected")}%0ATime: ${encodeURIComponent(time)}%0AGuests: ${encodeURIComponent(guests)}%0AOccasion: ${encodeURIComponent(occasion)}%0ANotes: ${encodeURIComponent(notes || "None")}`;
  }, [date, guests, name, notes, occasion, phone, time]);

  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="noise-overlay" />
      <AppHeader />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
        <div>
          <SectionHeading eyebrow="Reservations" title="Book the vibe before you arrive." description="Reserve a table for dine-in, birthdays, casual visits, and relaxed hangouts with good food and soothing music." />
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-gold">Best for</p>
            <div className="mt-5 grid gap-3">
              {occasions.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 font-bold text-cream/75">{item}</div>)}
            </div>
          </div>
        </div>
        <form className="rounded-[2.5rem] border border-white/10 bg-cream p-6 text-charcoal md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-flame">Table request</p>
          <h1 className="mt-3 text-4xl font-black">Send reservation on WhatsApp.</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">Full name<input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="Your name" /></label>
            <label className="grid gap-2 text-sm font-bold">Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="024 XXX XXXX" /></label>
            <label className="grid gap-2 text-sm font-bold">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" /></label>
            <label className="grid gap-2 text-sm font-bold">Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" /></label>
            <label className="grid gap-2 text-sm font-bold">Guests<input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" /></label>
            <label className="grid gap-2 text-sm font-bold">Occasion<select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame">{occasions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold md:col-span-2">Special request<textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-28 rounded-2xl border border-charcoal/10 bg-white px-4 py-4 outline-none focus:border-flame" placeholder="Seating preference, arrival note, group setup..." /></label>
          </div>
          <a href={reservationUrl} className="mt-7 block rounded-full bg-flame px-7 py-4 text-center font-black text-charcoal transition hover:bg-gold">Send Reservation Request</a>
          <p className="mt-4 text-center text-sm text-charcoal/55">MVP request only. Admin approval and calendar slots come with backend.</p>
        </form>
      </section>
    </main>
  );
}
