"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { createAdminMenuItem, fetchAdminMenu, type AdminMenuItem } from "@/lib/admin-api";

export default function AdminMenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Chicken Combos", description: "", priceFrom: "", spiceLevel: "Medium", prepTime: "20–30 min", badge: "New", imageUrl: "" });

  async function load() {
    try {
      setItems(await fetchAdminMenu());
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
      else setError(err instanceof Error ? err.message : "Could not load menu");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await createAdminMenuItem({ ...form, priceFrom: Number(form.priceFrom), available: true });
      setForm({ name: "", category: "Chicken Combos", description: "", priceFrom: "", spiceLevel: "Medium", prepTime: "20–30 min", badge: "New", imageUrl: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save item");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Menu Manager" description="Add meals, prices, categories, availability, and image URLs. Real uploads can be added after storage setup.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Add meal</h2>
          <div className="mt-5 grid gap-4">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Meal name" />
            <input required value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Price e.g. 70" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Category" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Short description" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3"><option>Mild</option><option>Medium</option><option>Hot</option><option>Extra Hot</option></select>
              <input value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Prep time" />
            </div>
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Badge" />
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Image URL placeholder" />
          </div>
          <button disabled={isSaving} className="mt-5 w-full rounded-full bg-[#d86b2b] px-5 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : "Add Meal"}</button>
        </form>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Current meals</h2>
          {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading menu...</p> : null}
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <article key={String(item.id)} className="rounded-2xl bg-[#fff8ef] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-black">{String(item.name)}</h3><p className="mt-1 text-sm font-semibold text-[#76675d]">{String(item.category)} · {String(item.spiceLevel || "")}</p></div>
                  <p className="font-black text-[#9d431f]">GH₵{String(item.priceFrom)}</p>
                </div>
                <p className="mt-2 text-sm font-medium leading-6 text-[#76675d]">{String(item.description || "")}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
