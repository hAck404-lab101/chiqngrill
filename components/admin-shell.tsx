"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearAdminToken } from "@/lib/admin-api";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Reservations", href: "/admin/reservations" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Homepage", href: "/admin/homepage" },
  { label: "Settings", href: "/admin/settings" }
];

export function AdminShell({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-[#16110d]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5">
          <a href="/admin" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d86b2b] text-sm font-black text-white">CNG</span>
            <div className="hidden sm:block">
              <p className="text-sm font-black">Admin</p>
              <p className="text-xs font-semibold text-[#76675d]">Private staff area</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <a href="/kitchen" className="rounded-full bg-[#241713] px-4 py-2 text-sm font-black text-white">Kitchen</a>
            <button onClick={logout} className="rounded-full bg-[#efe0d0] px-4 py-2 text-sm font-black text-[#16110d]">Logout</button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[28px] bg-white p-3 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 lg:sticky lg:top-24 lg:h-fit">
          <div className="flex gap-2 overflow-x-auto lg:grid lg:gap-2">
            {links.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <a key={link.href} href={link.href} className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black transition ${active ? "bg-[#d86b2b] text-white" : "text-[#76675d] hover:bg-[#fff8ef] hover:text-[#16110d]"}`}>
                  {link.label}
                </a>
              );
            })}
          </div>
        </aside>

        <section>
          <div className="mb-6">
            <span className="inline-flex rounded-full bg-[#efe0d0] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9d431f]">Admin Control</span>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#76675d]">{description}</p> : null}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
