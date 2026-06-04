"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  createAdminMenuItem,
  deleteAdminMenuItem,
  fetchAdminMenu,
  resolveAssetUrl,
  updateAdminMenuItem,
  uploadAdminImage,
  type AdminMenuItem
} from "@/lib/admin-api";

type MenuForm = {
  name: string;
  category: string;
  description: string;
  priceFrom: string;
  spiceLevel: string;
  prepTime: string;
  badge: string;
  imageUrl: string;
  available: boolean;
};

const emptyForm: MenuForm = {
  name: "",
  category: "Chicken Combos",
  description: "",
  priceFrom: "",
  spiceLevel: "Medium",
  prepTime: "20–30 min",
  badge: "New",
  imageUrl: "",
  available: true
};

function formFromItem(item: AdminMenuItem): MenuForm {
  return {
    name: String(item.name || ""),
    category: String(item.category || "Chicken Combos"),
    description: String(item.description || ""),
    priceFrom: String(item.priceFrom || ""),
    spiceLevel: String(item.spiceLevel || "Medium"),
    prepTime: String(item.prepTime || "20–30 min"),
    badge: String(item.badge || "Menu item"),
    imageUrl: String(item.imageUrl || ""),
    available: item.available !== false
  };
}

export default function AdminMenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<MenuForm>(emptyForm);

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
    setSuccess("");

    const payload = { ...form, priceFrom: Number(form.priceFrom) };

    try {
      if (editingId) {
        await updateAdminMenuItem(editingId, payload);
        setSuccess("Menu item updated.");
      } else {
        await createAdminMenuItem(payload);
        setSuccess("Menu item added.");
      }
      setEditingId("");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save item");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpload(file?: File) {
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const uploaded = await uploadAdminImage(file);
      setForm((current) => ({ ...current, imageUrl: uploaded.fileUrl }));
      setSuccess("Image uploaded and attached to form.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this menu item?");
    if (!confirmed) return;
    setError("");
    setSuccess("");
    try {
      await deleteAdminMenuItem(id);
      setSuccess("Menu item deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete item");
    }
  }

  function editItem(item: AdminMenuItem) {
    setEditingId(String(item.id));
    setForm(formFromItem(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyForm);
  }

  return (
    <AdminShell title="Menu Manager" description="Add, edit, delete, and upload images for meals. Changes are stored in the running backend for the current session.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">{editingId ? "Edit meal" : "Add meal"}</h2>
            {editingId ? <button type="button" onClick={cancelEdit} className="rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black">Cancel</button> : null}
          </div>
          <div className="mt-5 grid gap-4">
            {form.imageUrl ? (
              <img src={resolveAssetUrl(form.imageUrl)} alt="Menu preview" className="h-44 w-full rounded-3xl object-cover" />
            ) : <div className="grid h-44 place-items-center rounded-3xl bg-[#fff8ef] text-sm font-black text-[#9d431f]">No image selected</div>}
            <label className="grid gap-2 text-sm font-black">
              Upload image
              <input type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0])} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" />
            </label>
            {isUploading ? <p className="text-sm font-bold text-[#76675d]">Uploading image...</p> : null}
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Meal name" />
            <input required value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Price e.g. 70" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Category" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Short description" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3"><option>Mild</option><option>Medium</option><option>Hot</option><option>Extra Hot</option></select>
              <input value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Prep time" />
            </div>
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Badge" />
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Image URL" />
            <label className="flex items-center gap-3 rounded-2xl bg-[#fff8ef] p-4 text-sm font-black">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
              Available on menu
            </label>
          </div>
          <button disabled={isSaving} className="mt-5 w-full rounded-full bg-[#d86b2b] px-5 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Meal"}</button>
        </form>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Current meals</h2>
          {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading menu...</p> : null}
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <article key={String(item.id)} className="grid gap-4 rounded-2xl bg-[#fff8ef] p-4 md:grid-cols-[120px_1fr]">
                {item.imageUrl ? <img src={resolveAssetUrl(String(item.imageUrl))} alt={String(item.name)} className="h-28 w-full rounded-2xl object-cover" /> : <div className="grid h-28 place-items-center rounded-2xl bg-[#efe0d0] text-xs font-black text-[#9d431f]">No image</div>}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="font-black">{String(item.name)}</h3><p className="mt-1 text-sm font-semibold text-[#76675d]">{String(item.category)} · {String(item.spiceLevel || "")}</p></div>
                    <p className="font-black text-[#9d431f]">GH₵{String(item.priceFrom)}</p>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#76675d]">{String(item.description || "")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => editItem(item)} className="rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">Edit</button>
                    <button type="button" onClick={() => void handleDelete(String(item.id))} className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
