"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Home, Menu as MenuList, PackageSearch, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { restaurant } from "@/lib/restaurant-data";

type AppHeaderProps = {
  variant?: "customer" | "admin";
};

const customerLinks = [
  { label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { label: "Cart", href: "/order", icon: ShoppingBag },
  { label: "Reserve", href: "/reservations", icon: CalendarDays },
  { label: "Track", href: "/track", icon: PackageSearch }
];

const adminLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Orders", href: "/admin/orders" }
];

function isActivePath(pathname: string, href: string) {
  const path = href.split("?")[0] || "/";
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function AppHeader({ variant = "customer" }: AppHeaderProps) {
  const isAdmin = variant === "admin";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]">
        <nav className="app-container flex h-16 items-center justify-between gap-3">
          <a href="/admin" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[var(--brand)] text-sm font-black text-white">CNG</span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-black text-[var(--ink)]">Operations</span>
              <span className="block text-xs font-semibold text-[var(--muted)]">Staff area</span>
            </span>
          </a>
          <div className="hidden items-center gap-1 text-sm lg:flex">
            {adminLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return <a key={link.href} href={link.href} className={`rounded-full px-4 py-2 font-bold transition ${active ? "bg-[var(--dark)] text-white" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"}`}>{link.label}</a>;
            })}
          </div>
          <div className="flex items-center gap-2">
            <a href="/kitchen" className="rounded-full bg-[var(--dark)] px-4 py-2.5 text-sm font-black text-white">Kitchen</a>
            <button type="button" onClick={() => setIsOpen((value) => !value)} className="rounded-full bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] shadow-sm ring-1 ring-[var(--line)] lg:hidden">{isOpen ? "Close" : "Menu"}</button>
          </div>
        </nav>
        <div className={`app-container grid overflow-hidden transition-all duration-300 ease-out lg:hidden ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="min-h-0">
            <div className="mb-4 mt-2 grid gap-2 rounded-3xl bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)]">
              {adminLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`rounded-2xl px-4 py-3 text-sm font-bold ${isActivePath(pathname, link.href) ? "bg-[var(--dark)] text-white" : "text-[var(--ink)] hover:bg-[var(--soft)]"}`}>{link.label}</a>)}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]">
        <nav className="app-container relative flex h-16 items-center justify-between gap-3">
          <a href="/" className="grid size-10 place-items-center rounded-full text-[var(--ink)] transition hover:bg-[var(--soft)]" aria-label="Home">
            <Home size={21} strokeWidth={2.25} />
          </a>

          <a href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center" aria-label="Chiq-N-Grill Home">
            <span className="text-base font-black tracking-[-0.03em] text-[var(--ink)]">Chiq-N-Grill</span>
          </a>

          <div className="hidden items-center gap-1 text-sm lg:flex">
            {customerLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return <a key={link.href} href={link.href} className={`rounded-full px-4 py-2 font-bold transition ${active ? "bg-[var(--dark)] text-white" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"}`}>{link.label}</a>;
            })}
          </div>

          <div className="flex items-center gap-1">
            <a href={restaurant.phoneHref} className="hidden size-10 place-items-center rounded-full text-[var(--ink)] transition hover:bg-[var(--soft)] md:grid" aria-label="Call restaurant" title="Call restaurant">
              <Phone size={20} strokeWidth={2.25} />
            </a>
            <a href="/order" className="grid size-10 place-items-center rounded-full text-[var(--ink)] transition hover:bg-[var(--soft)]" aria-label="Open cart" title="Cart">
              <ShoppingBag size={20} strokeWidth={2.25} />
            </a>
          </div>
        </nav>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--surface)] px-4 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_24px_rgba(36,23,19,0.08)] lg:hidden" aria-label="Mobile app navigation">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {customerLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            const Icon = link.icon;
            return (
              <a key={link.href} href={link.href} className={`grid place-items-center rounded-2xl px-2 py-2 transition ${active ? "text-[var(--brand)]" : "text-[var(--muted)]"}`} aria-label={link.label} title={link.label}>
                <Icon size={23} strokeWidth={active ? 2.7 : 2.2} />
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
