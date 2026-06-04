"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", plusCode: "", openingNote: "", mapsUrl: "", whatsappUrl: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSiteSettings();
        setForm({
          name: String(data.name || ""),
          phone: String(data.phone || ""),
          address: String(data.address || ""),
          plusCode: String(data.plusCode || ""),
          openingNote: String(data.openingNote || ""),
          mapsUrl: String(data.mapsUrl || ""),
          whatsappUrl: String(data.whatsappUrl || "")
        });
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
        else setError(err instanceof Error ? err.message : "Could not load settings");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);
    try {
      await updateSiteSettings(form);
      setSuccess("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Site Settings" description="Update restaurant contact, location, maps, WhatsApp, and opening information.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}
      <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
        {isLoading ? <p className="text-sm font-bold text-[#76675d]">Loading settings...</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black">Restaurant name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">Address<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">Plus code<input value={form.plusCode} onChange={(e) => setForm({ ...form, plusCode: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">Opening note<input value={form.openingNote} onChange={(e) => setForm({ ...form, openingNote: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">WhatsApp URL<input value={form.whatsappUrl} onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black md:col-span-2">Google Maps URL<input value={form.mapsUrl} onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
        </div>
        <button disabled={isSaving} className="mt-5 rounded-full bg-[#d86b2b] px-6 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save Settings"}</button>
      </form>
    </AdminShell>
  );
}
