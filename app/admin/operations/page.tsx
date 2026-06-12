"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/admin-api";

type DeliveryZone = {
  id: string;
  name: string;
  fee: number;
  keywords: string[];
};

type OperationsForm = {
  orderingEnabled: boolean;
  reservationsEnabled: boolean;
  enforceBusinessHours: boolean;
  serviceFee: string;
  businessHours: {
    open: string;
    close: string;
    days: number[];
  };
  deliveryZones: DeliveryZone[];
};

const weekDays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 }
];

const fallbackForm: OperationsForm = {
  orderingEnabled: true,
  reservationsEnabled: true,
  enforceBusinessHours: false,
  serviceFee: "0",
  businessHours: { open: "11:00", close: "23:00", days: [0, 1, 2, 3, 4, 5, 6] },
  deliveryZones: [{ id: "other", name: "Other Accra area", fee: 45, keywords: [] }]
};

function normalizeZone(zone: DeliveryZone) {
  return {
    ...zone,
    fee: Number(zone.fee || 0),
    keywords: Array.isArray(zone.keywords) ? zone.keywords : []
  };
}

export default function AdminOperationsPage() {
  const router = useRouter();
  const [form, setForm] = useState<OperationsForm>(fallbackForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSiteSettings();
        const settings = (data as any).settings || data;
        setForm({
          orderingEnabled: settings.orderingEnabled !== false,
          reservationsEnabled: settings.reservationsEnabled !== false,
          enforceBusinessHours: Boolean(settings.enforceBusinessHours),
          serviceFee: String(settings.serviceFee ?? 0),
          businessHours: {
            open: String(settings.businessHours?.open || "11:00"),
            close: String(settings.businessHours?.close || "23:00"),
            days: Array.isArray(settings.businessHours?.days) ? settings.businessHours.days.map(Number) : [0, 1, 2, 3, 4, 5, 6]
          },
          deliveryZones: Array.isArray(settings.deliveryZones) && settings.deliveryZones.length ? settings.deliveryZones.map(normalizeZone) : fallbackForm.deliveryZones
        });
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
        else setError(err instanceof Error ? err.message : "Could not load operations settings");
      } finally {
        setIsLoading(false);
      }
    }
    void loadSettings();
  }, [router]);

  function toggleDay(day: number) {
    setForm((current) => {
      const exists = current.businessHours.days.includes(day);
      const days = exists ? current.businessHours.days.filter((entry) => entry !== day) : [...current.businessHours.days, day].sort();
      return { ...current, businessHours: { ...current.businessHours, days } };
    });
  }

  function updateZone(index: number, field: keyof DeliveryZone, value: string) {
    setForm((current) => {
      const deliveryZones = [...current.deliveryZones];
      const zone = { ...deliveryZones[index] };
      if (field === "fee") zone.fee = Number(value || 0);
      else if (field === "keywords") zone.keywords = value.split(",").map((item) => item.trim()).filter(Boolean);
      else zone[field] = value as never;
      deliveryZones[index] = zone;
      return { ...current, deliveryZones };
    });
  }

  function addZone() {
    setForm((current) => ({
      ...current,
      deliveryZones: [...current.deliveryZones, { id: `zone-${Date.now()}`, name: "New area", fee: 0, keywords: [] }]
    }));
  }

  function removeZone(index: number) {
    setForm((current) => ({ ...current, deliveryZones: current.deliveryZones.filter((_, zoneIndex) => zoneIndex !== index) }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateSiteSettings({
        settings: {
          orderingEnabled: form.orderingEnabled,
          reservationsEnabled: form.reservationsEnabled,
          enforceBusinessHours: form.enforceBusinessHours,
          serviceFee: Number(form.serviceFee || 0),
          businessHours: form.businessHours,
          deliveryZones: form.deliveryZones.map(normalizeZone)
        }
      });
      setSuccess("Operations settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save operations settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Operations" description="Control ordering, reservations, business hours, service fees, and delivery zone fees.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}

      <form onSubmit={submit} className="grid gap-5">
        <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Live Controls</h2>
              <p className="mt-1 text-sm font-semibold text-[#76675d]">Use these when the restaurant is closed, full, or not taking online orders.</p>
            </div>
            {isLoading ? <span className="rounded-full bg-[#fff8ef] px-4 py-2 text-sm font-black text-[#76675d]">Loading...</span> : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center justify-between gap-3 rounded-3xl bg-[#fff8ef] p-4 text-sm font-black">
              Ordering
              <input type="checkbox" checked={form.orderingEnabled} onChange={(event) => setForm({ ...form, orderingEnabled: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-3xl bg-[#fff8ef] p-4 text-sm font-black">
              Reservations
              <input type="checkbox" checked={form.reservationsEnabled} onChange={(event) => setForm({ ...form, reservationsEnabled: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-3xl bg-[#fff8ef] p-4 text-sm font-black">
              Enforce hours
              <input type="checkbox" checked={form.enforceBusinessHours} onChange={(event) => setForm({ ...form, enforceBusinessHours: event.target.checked })} />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
          <h2 className="text-2xl font-black">Hours & Fees</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-black">Open time<input type="time" value={form.businessHours.open} onChange={(event) => setForm({ ...form, businessHours: { ...form.businessHours, open: event.target.value } })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
            <label className="grid gap-2 text-sm font-black">Close time<input type="time" value={form.businessHours.close} onChange={(event) => setForm({ ...form, businessHours: { ...form.businessHours, close: event.target.value } })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
            <label className="grid gap-2 text-sm font-black">Service fee GH₵<input type="number" min="0" value={form.serviceFee} onChange={(event) => setForm({ ...form, serviceFee: event.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {weekDays.map((day) => {
              const active = form.businessHours.days.includes(day.value);
              return <button key={day.value} type="button" onClick={() => toggleDay(day.value)} className={`rounded-full px-4 py-2 text-sm font-black ${active ? "bg-[#d86b2b] text-white" : "bg-[#fff8ef] text-[#76675d]"}`}>{day.label}</button>;
            })}
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-4 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black">Delivery Zones</h2><p className="mt-1 text-sm font-semibold text-[#76675d]">Keywords help match typed delivery addresses.</p></div>
            <button type="button" onClick={addZone} className="rounded-full bg-[#241713] px-5 py-3 text-sm font-black text-white">Add zone</button>
          </div>
          <div className="mt-5 grid gap-3">
            {form.deliveryZones.map((zone, index) => (
              <article key={`${zone.id}-${index}`} className="rounded-[24px] bg-[#fff8ef] p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                  <input value={zone.name} onChange={(event) => updateZone(index, "name", event.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold" placeholder="Area name" />
                  <input type="number" min="0" value={zone.fee} onChange={(event) => updateZone(index, "fee", event.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold" placeholder="Fee" />
                  <button type="button" onClick={() => removeZone(index)} className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700">Remove</button>
                </div>
                <input value={zone.keywords.join(", ")} onChange={(event) => updateZone(index, "keywords", event.target.value)} className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold" placeholder="keywords: osu, east legon, airport" />
              </article>
            ))}
          </div>
        </section>

        <button disabled={isSaving} className="rounded-full bg-[#d86b2b] px-6 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving operations..." : "Save Operations"}</button>
      </form>
    </AdminShell>
  );
}
