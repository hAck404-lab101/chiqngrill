"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { CTAButton } from "@/components/cta-button";
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
  { label: "Gallery", href: "/gallery" },
  { label: "Delivery", href: "/delivery" }
];

const adminLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Menu", href: "/menu" },
  { label: "Orders", href: "/order" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader({ variant = "customer" }: AppHeaderProps) {
  const isAdmin = variant === "admin";
  const links = isAdmin ? adminLinks : customerLinks;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <a href={isAdmin ? "/admin" : "/"} className="shrink-0 text-sm font-black uppercase tracking-[0.28em] text-gold">
          {isAdmin ? "CNG Ops" : "Chiq-N-Grill"}
        </a>

        <div className="hidden items-center gap-5 text-sm text-cream/75 lg:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <a key={link.href} href={link.href} className={`rounded-full px-3 py-2 transition ${active ? "bg-gold/15 text-gold" : "hover:text-gold"}`}>
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <span className="hidden rounded-full border border-gold/30 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold sm:inline-flex">
              Protected route pending
            </span>
          ) : (
            <div className="hidden sm:block">
              <CTAButton href={restaurant.phoneHref} variant="flame">
                Call
              </CTAButton>
            </div>
          )}
          <a href={isAdmin ? "/kitchen" : "/order"} className="hidden rounded-full border border-cream/20 px-5 py-3 text-sm font-black text-cream transition hover:border-gold hover:text-gold sm:inline-flex">
            {isAdmin ? "Kitchen" : "Cart"}
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="rounded-full border border-cream/20 px-4 py-3 text-sm font-black text-cream transition hover:border-gold hover:text-gold lg:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        className={`grid overflow-hidden border-t border-white/10 bg-charcoal transition-all duration-300 ease-out lg:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div
            className={`mx-auto grid max-w-7xl gap-3 px-5 py-5 transition duration-300 ease-out ${
              isOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[0.98] opacity-0"
            }`}
          >
            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl border px-4 py-4 font-black transition ${
                    active
                      ? "border-gold/40 bg-gold/15 text-gold"
                      : "border-white/10 bg-white/[0.04] text-cream/75 hover:border-gold hover:text-gold"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a href={isAdmin ? "/kitchen" : "/order"} className="rounded-full bg-cream px-5 py-4 text-center font-black text-charcoal">
                {isAdmin ? "Kitchen" : "Cart"}
              </a>
              <a href={isAdmin ? "/admin" : restaurant.phoneHref} className="rounded-full bg-flame px-5 py-4 text-center font-black text-charcoal">
                {isAdmin ? "Admin" : "Call"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
