"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { restaurant } from "@/lib/restaurant-data";

type AppHeaderProps = {
  variant?: "customer" | "admin";
};

const customerLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Order", href: "/order" },
  { label: "Reserve", href: "/reservations" },
  { label: "Track", href: "/track" }
];

const adminLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Menu", href: "/menu" },
  { label: "Orders", href: "/order" }
];

function getPathAndQuery(href: string) {
  const [path = "/", query = ""] = href.split("?");
  return { path, query };
}

function queryContainsRequiredParams(currentQuery: URLSearchParams, requiredQuery: string) {
  if (!requiredQuery) return true;
  const requiredParams = new URLSearchParams(requiredQuery);
  for (const [key, value] of requiredParams.entries()) {
    if (currentQuery.get(key) !== value) return false;
  }
  return true;
}

function isActivePath(pathname: string, searchParams: URLSearchParams, href: string) {
  const { path, query } = getPathAndQuery(href);
  const matchesPath = path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
  return matchesPath && queryContainsRequiredParams(searchParams, query);
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 7.5h14l-1.4 8.1a2 2 0 0 1-2 1.7H9.3a2 2 0 0 1-2-1.6L5.7 4.8H3.5" />
      <path d="M9 20.3h.01" />
      <path d="M17 20.3h.01" />
    </svg>
  );
}

export function AppHeader({ variant = "customer" }: AppHeaderProps) {
  const isAdmin = variant === "admin";
  const links = isAdmin ? adminLinks : customerLinks;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md">
      <nav className="app-container flex h-16 items-center justify-between gap-3">
        <a href={isAdmin ? "/admin" : "/"} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-[var(--brand)] text-sm font-black text-white">CNG</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black text-[var(--ink)]">{isAdmin ? "Operations" : "Chiq-N-Grill"}</span>
            <span className="block text-xs font-semibold text-[var(--muted)]">{isAdmin ? "Staff area" : restaurant.address}</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, activeSearchParams, link.href);
            return (
              <a key={link.href} href={link.href} className={`rounded-full px-4 py-2 font-bold transition ${active ? "bg-[var(--dark)] text-white" : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"}`}>
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a href={isAdmin ? "/kitchen" : "/order"} className={`${isAdmin ? "rounded-full bg-[var(--dark)] px-4 py-2.5 text-sm font-black text-white" : "grid size-11 place-items-center rounded-2xl bg-[var(--dark)] text-white shadow-[var(--shadow-card)]"}`} aria-label={isAdmin ? "Open kitchen" : "Open cart"} title={isAdmin ? "Kitchen" : "Cart"}>
            {isAdmin ? "Kitchen" : <CartIcon />}
          </a>
          {!isAdmin ? (
            <a href={restaurant.phoneHref} className="btn-primary hidden px-5 py-2.5 text-sm md:inline-flex">
              Call
            </a>
          ) : null}
          <button type="button" onClick={() => setIsOpen((value) => !value)} className="rounded-full bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--ink)] shadow-sm ring-1 ring-[var(--line)] lg:hidden" aria-expanded={isOpen} aria-label="Toggle navigation menu">
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div className={`app-container grid overflow-hidden transition-all duration-300 ease-out lg:hidden ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0">
          <div className={`mb-4 mt-2 grid gap-2 rounded-3xl bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)] transition duration-300 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
            {links.map((link) => {
              const active = isActivePath(pathname, activeSearchParams, link.href);
              return (
                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`rounded-2xl px-4 py-3 text-sm font-bold ${active ? "bg-[var(--dark)] text-white" : "text-[var(--ink)] hover:bg-[var(--soft)]"}`}>
                  {link.label}
                </a>
              );
            })}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a href={isAdmin ? "/kitchen" : "/order"} className="btn-dark text-sm">{isAdmin ? "Kitchen" : "Cart"}</a>
              <a href={isAdmin ? "/admin" : restaurant.phoneHref} className="btn-primary text-sm">{isAdmin ? "Admin" : "Call"}</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
