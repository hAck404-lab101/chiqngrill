"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@chiqngrill.local");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await adminLogin(email.trim(), password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#16110d]">
      <section className="mx-auto grid min-h-screen max-w-6xl place-items-center px-5 py-10">
        <div className="grid w-full gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-[#efe0d0] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9d431f]">Staff access</span>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.96] tracking-[-0.055em] md:text-7xl">Chiq-N-Grill Admin</h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-[#76675d]">
              This area is separated from the customer app. Use it to manage orders, menu, reservations, images, homepage content, and restaurant settings.
            </p>
            <div className="mt-6 rounded-3xl bg-white p-4 text-sm font-bold text-[#76675d] shadow-[0_18px_50px_rgba(36,23,19,0.08)]">
              Demo credentials are prefilled. Change <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code>, and <code>ADMIN_SESSION_SECRET</code> before production.
            </div>
          </div>

          <form onSubmit={handleLogin} className="rounded-[32px] bg-white p-5 shadow-[0_22px_60px_rgba(36,23,19,0.10)] md:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#d86b2b] text-sm font-black text-white">CNG</span>
              <div>
                <h2 className="text-2xl font-black">Sign in</h2>
                <p className="text-sm font-semibold text-[#76675d]">Protected admin dashboard</p>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-black">
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-4 outline-none focus:border-[#d86b2b]" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-2xl border border-black/10 bg-[#fff8ef] px-4 py-4 outline-none focus:border-[#d86b2b]" />
              </label>
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}

            <button disabled={isLoading} className="mt-6 w-full rounded-full bg-[#d86b2b] px-5 py-4 font-black text-white transition hover:bg-[#a7441f] disabled:opacity-60">
              {isLoading ? "Signing in..." : "Enter Admin"}
            </button>

            <a href="/" className="mt-4 block text-center text-sm font-black text-[#76675d]">Back to customer app</a>
          </form>
        </div>
      </section>
    </main>
  );
}
