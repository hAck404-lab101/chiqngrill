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
  { label: "Gallery", href: "/gallery" }
];

const adminLinks = [
  { label: "Admin", href: "/admin" },
  { label: "Kitchen", href: "/kitchen" },
  { label: "Menu", href: "/menu" },
  { label: "Orders", href: "/order" }
];

export function AppHeader({ variant = "customer" }: AppHeaderProps) {
  const isAdmin = variant === "admin";
  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <a href={isAdmin ? "/admin" : "/"} className="shrink-0 text-sm font-black uppercase tracking-[0.28em] text-gold">
          {isAdmin ? "CNG Ops" : "Chiq-N-Grill"}
        </a>

        <div className="hidden items-center gap-5 text-sm text-cream/75 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-gold">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <span className="hidden rounded-full border border-gold/30 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gold sm:inline-flex">
              Protected route pending
            </span>
          ) : (
            <CTAButton href={restaurant.phoneHref} variant="flame">
              Call
            </CTAButton>
          )}
          <a href={isAdmin ? "/kitchen" : "/order"} className="rounded-full border border-cream/20 px-5 py-3 text-sm font-black text-cream transition hover:border-gold hover:text-gold">
            {isAdmin ? "Kitchen" : "Cart"}
          </a>
        </div>
      </nav>
    </header>
  );
}
