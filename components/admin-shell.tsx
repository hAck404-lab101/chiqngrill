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
  { label: "Operations", href: "/admin/operations" },
  { label: "Audit", href: "/admin/audit" },
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
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <a href="/admin" className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#d86b2b] text-sm font-black text-white">CNG</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">Admin</p>
              <p className="truncate text-xs font-semibold text-[#76675d]">Private staff area</p>
            </div>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <a href="/kitchen" className="rounded-full bg-[#241713] px-3 py-2 text-xs font-black text-white sm:px-4 sm:text-sm">Kitchen</a>
            <button type="button" onClick={logout} className="rounded-full bg-[#efe0d0] px-3 py-2 text-xs font-black text-[#16110d] sm:px-4 sm:text-sm">Logout</button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-5 lg:grid-cols-[240px_1fr] lg:gap-6 lg:py-6">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[26px] bg-white p-2 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
              {links.map((link) => {
                const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <a key={link.href} href={link.href} className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-black transition ${active ? "bg-[#d86b2b] text-white" : "text-[#76675d] hover:bg-[#fff8ef] hover:text-[#16110d]"}`}>
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(36,23,19,0.08)] ring-1 ring-black/5 sm:p-6 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
            <span className="inline-flex rounded-full bg-[#efe0d0] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9d431f]">Admin Control</span>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl md:text-5xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-[#76675d] sm:text-base sm:leading-7">{description}</p> : null}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
