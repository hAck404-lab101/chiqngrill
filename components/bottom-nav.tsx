"use client";

import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Cart", href: "/order" },
  { label: "Track", href: "/track" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--surface)]/96 px-3 py-2 shadow-[0_-10px_30px_rgba(24,18,15,0.08)] backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {links.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-2xl px-2 py-2.5 text-center text-xs font-extrabold transition ${
                active ? "bg-[var(--brand)] text-white" : "text-[var(--muted)]"
              }`}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
