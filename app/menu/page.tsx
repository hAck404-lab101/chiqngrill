import { AppHeader } from "@/components/app-header";
import { MenuBrowser } from "@/components/menu-browser";
import { SectionHeading } from "@/components/section-heading";
import { fetchMenu } from "@/lib/api-client";

const modes = ["Dine-in", "Pickup", "Delivery", "Kerbside"];

export default async function MenuPage() {
  const items = await fetchMenu();
  const categories = Array.from(new Set(items.map((item) => item.category))).filter(Boolean);

  return (
    <main className="app-page">
      <AppHeader />

      <section className="app-container py-8 md:py-12">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <SectionHeading eyebrow="Menu" title="Choose your meal" description="Search, filter, add to cart, and checkout when you are ready." />
          <div className="flex gap-2 overflow-x-auto pb-1 md:justify-end">
            {modes.map((mode) => (
              <a key={mode} href="/order" className="shrink-0 rounded-full bg-[var(--soft)] px-4 py-2 text-sm font-extrabold text-[var(--ink)]">
                {mode}
              </a>
            ))}
          </div>
        </div>

        <MenuBrowser items={items} categories={categories} />
      </section>
    </main>
  );
}
