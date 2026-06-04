"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { createAdminGalleryItem, fetchAdminGallery, type AdminGalleryItem } from "@/lib/admin-api";

export default function AdminGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Food", imageUrl: "", isFeatured: false });

  async function load() {
    try {
      setItems(await fetchAdminGallery());
    } catch (err) {
      if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
      else setError(err instanceof Error ? err.message : "Could not load gallery");
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
      await createAdminGalleryItem(form);
      setForm({ title: "", category: "Food", imageUrl: "", isFeatured: false });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save gallery item");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Gallery Manager" description="Replace visual placeholders with real food, interior, and customer moment image URLs.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Add gallery item</h2>
          <div className="mt-5 grid gap-4">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Photo title" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Category e.g. Food, Vibe, Drinks" />
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Image URL" />
            <label className="flex items-center gap-3 rounded-2xl bg-[#fff8ef] p-4 text-sm font-black">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Feature this image
            </label>
          </div>
          <button disabled={isSaving} className="mt-5 w-full rounded-full bg-[#d86b2b] px-5 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : "Add Image"}</button>
        </form>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Gallery items</h2>
          {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading gallery...</p> : null}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article key={String(item.id)} className="rounded-2xl bg-[#fff8ef] p-3">
                {item.imageUrl ? <img src={String(item.imageUrl)} alt={String(item.title)} className="h-36 w-full rounded-2xl object-cover" /> : <div className="grid h-36 place-items-center rounded-2xl bg-[#efe0d0] text-sm font-black text-[#9d431f]">No image yet</div>}
                <div className="p-2 pt-3">
                  <h3 className="font-black">{String(item.title)}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#76675d]">{String(item.category)} {item.isFeatured ? "· Featured" : ""}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
