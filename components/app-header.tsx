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
  { label: "Deals", href: "/deals" },
  { label: "Track", href: "/track" },
  { label: "Delivery", href: "/delivery" }
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

export function AppHeader({ variant = "customer" }: AppHeaderProps) {
  const isAdmin = variant === "admin";
  const links = isAdmin ? adminLinks : customerLinks;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)] py-3">
      <nav className="app-container flex items-center justify-between gap-3 rounded-[26px] border-2 border-[var(--line)] bg-[#fffaf1] px-4 py-3 shadow-[4px_4px_0_#17110d]">
        <a href={isAdmin ? "/admin" : "/"} className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[15px] border-2 border-[var(--line)] bg-[var(--clay)] text-sm font-black text-white">
            CNG
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black uppercase tracking-[0.18em] text-[var(--ink)]">{isAdmin ? "Operations" : "Chiq-N-Grill"}</span>
            <span className="block text-xs font-bold text-[var(--ink-soft)]">{isAdmin ? "Kitchen control" : "Accra grill app"}</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 text-sm lg:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, activeSearchParams, link.href);
            return (
              <a key={link.href} href={link.href} className={`rounded-full px-4 py-2 font-black transition ${active ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--ink-soft)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"}`}>
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a href={isAdmin ? "/kitchen" : "/order"} className="btn-dark hidden px-5 py-3 text-sm sm:inline-flex">
            {isAdmin ? "Kitchen" : "Cart"}
          </a>
          {!isAdmin ? (
            <a href={restaurant.phoneHref} className="btn-primary hidden px-5 py-3 text-sm md:inline-flex">
              Call
            </a>
          ) : null}
          <button type="button" onClick={() => setIsOpen((value) => !value)} className="btn-outline px-4 py-3 text-sm lg:hidden" aria-expanded={isOpen} aria-label="Toggle navigation menu">
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div className={`app-container grid overflow-hidden transition-all duration-300 ease-out lg:hidden ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0">
          <div className={`mt-3 grid gap-3 rounded-[26px] border-2 border-[var(--line)] bg-[#fffaf1] p-3 shadow-[4px_4px_0_#17110d] transition duration-300 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
            {links.map((link) => {
              const active = isActivePath(pathname, activeSearchParams, link.href);
              return (
                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`rounded-[18px] border-2 border-[var(--line)] px-4 py-4 font-black ${active ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper)] text-[var(--ink)]"}`}>
                  {link.label}
                </a>
              );
            })}
            <div className="grid grid-cols-2 gap-3">
              <a href={isAdmin ? "/kitchen" : "/order"} className="btn-dark text-sm">{isAdmin ? "Kitchen" : "Cart"}</a>
              <a href={isAdmin ? "/admin" : restaurant.phoneHref} className="btn-primary text-sm">{isAdmin ? "Admin" : "Call"}</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
