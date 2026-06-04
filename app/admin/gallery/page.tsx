"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  createAdminGalleryItem,
  fetchAdminGallery,
  resolveAssetUrl,
  updateAdminGalleryItem,
  uploadAdminImage,
  type AdminGalleryItem
} from "@/lib/admin-api";

type GalleryForm = {
  title: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
};

const emptyForm: GalleryForm = { title: "", category: "Food", imageUrl: "", isFeatured: false };

function formFromItem(item: AdminGalleryItem): GalleryForm {
  return {
    title: String(item.title || ""),
    category: String(item.category || "Food"),
    imageUrl: String(item.imageUrl || ""),
    isFeatured: Boolean(item.isFeatured)
  };
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<GalleryForm>(emptyForm);

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
    setSuccess("");
    try {
      if (editingId) {
        await updateAdminGalleryItem(editingId, form);
        setSuccess("Gallery item updated.");
      } else {
        await createAdminGalleryItem(form);
        setSuccess("Gallery item added.");
      }
      setEditingId("");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save gallery item");
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

  function editItem(item: AdminGalleryItem) {
    setEditingId(String(item.id));
    setForm(formFromItem(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyForm);
  }

  return (
    <AdminShell title="Gallery Manager" description="Upload, add, and edit real food, interior, and customer moment images.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black">{editingId ? "Edit gallery item" : "Add gallery item"}</h2>
            {editingId ? <button type="button" onClick={cancelEdit} className="rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black">Cancel</button> : null}
          </div>
          <div className="mt-5 grid gap-4">
            {form.imageUrl ? <img src={resolveAssetUrl(form.imageUrl)} alt="Gallery preview" className="h-52 w-full rounded-3xl object-cover" /> : <div className="grid h-52 place-items-center rounded-3xl bg-[#fff8ef] text-sm font-black text-[#9d431f]">No image selected</div>}
            <label className="grid gap-2 text-sm font-black">
              Upload image
              <input type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0])} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" />
            </label>
            {isUploading ? <p className="text-sm font-bold text-[#76675d]">Uploading image...</p> : null}
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Photo title" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Category e.g. Food, Vibe, Drinks" />
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" placeholder="Image URL" />
            <label className="flex items-center gap-3 rounded-2xl bg-[#fff8ef] p-4 text-sm font-black">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Feature this image
            </label>
          </div>
          <button disabled={isSaving} className="mt-5 w-full rounded-full bg-[#d86b2b] px-5 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Image"}</button>
        </form>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
          <h2 className="text-2xl font-black">Gallery items</h2>
          {isLoading ? <p className="mt-4 text-sm font-bold text-[#76675d]">Loading gallery...</p> : null}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <article key={String(item.id)} className="rounded-2xl bg-[#fff8ef] p-3">
                {item.imageUrl ? <img src={resolveAssetUrl(String(item.imageUrl))} alt={String(item.title)} className="h-36 w-full rounded-2xl object-cover" /> : <div className="grid h-36 place-items-center rounded-2xl bg-[#efe0d0] text-sm font-black text-[#9d431f]">No image yet</div>}
                <div className="p-2 pt-3">
                  <h3 className="font-black">{String(item.title)}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#76675d]">{String(item.category)} {item.isFeatured ? "· Featured" : ""}</p>
                  <button type="button" onClick={() => editItem(item)} className="mt-3 rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">Edit</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
