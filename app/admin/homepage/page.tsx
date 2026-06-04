"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { fetchHomepageContent, updateHomepageContent } from "@/lib/admin-api";

export default function AdminHomepagePage() {
  const router = useRouter();
  const [form, setForm] = useState({ heroTitle: "", heroSubtitle: "", featuredMealId: "", heroImageUrl: "", announcement: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHomepageContent();
        setForm({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          featuredMealId: data.featuredMealId || "",
          heroImageUrl: data.heroImageUrl || "",
          announcement: data.announcement || ""
        });
      } catch (err) {
        if (err instanceof Error && err.message.toLowerCase().includes("authentication")) router.replace("/admin/login");
        else setError(err instanceof Error ? err.message : "Could not load homepage content");
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
      await updateHomepageContent(form);
      setSuccess("Homepage content saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save homepage content");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Homepage Manager" description="Update the customer homepage content without touching code.">
      {error ? <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800">{success}</p> : null}
      <form onSubmit={submit} className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
        {isLoading ? <p className="text-sm font-bold text-[#76675d]">Loading homepage content...</p> : null}
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-black">Hero title<textarea value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className="min-h-24 rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-black">Hero subtitle<textarea value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className="min-h-24 rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black">Announcement<input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
            <label className="grid gap-2 text-sm font-black">Featured meal ID<input value={form.featuredMealId} onChange={(e) => setForm({ ...form, featuredMealId: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
          </div>
          <label className="grid gap-2 text-sm font-black">Hero image URL<input value={form.heroImageUrl} onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-3" /></label>
        </div>
        <button disabled={isSaving} className="mt-5 rounded-full bg-[#d86b2b] px-6 py-4 font-black text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save Homepage"}</button>
      </form>
    </AdminShell>
  );
}
