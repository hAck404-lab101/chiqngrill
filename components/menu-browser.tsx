"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FilterIcon, SearchIcon } from "@/components/icons";
import { resolvePublicAssetUrl } from "@/lib/api-client";
import type { MenuItem } from "@/lib/restaurant-data";

const spiceFilters = ["All", "Mild", "Medium", "Hot", "Extra Hot"] as const;
const priceFilters = [
  { label: "All", value: "all" },
  { label: "< GH₵70", value: "under-70" },
  { label: "GH₵70–80", value: "70-80" },
  { label: "> GH₵80", value: "above-80" }
] as const;

type SpiceFilter = (typeof spiceFilters)[number];
type PriceFilter = (typeof priceFilters)[number]["value"];

type MenuBrowserProps = {
  items: MenuItem[];
  categories: string[];
};

function safeText(value: unknown) {
  return String(value || "");
}

function matchesPriceFilter(item: MenuItem, filter: PriceFilter) {
  const price = Number(item.priceFrom || 0);
  if (filter === "under-70") return price < 70;
  if (filter === "70-80") return price >= 70 && price <= 80;
  if (filter === "above-80") return price > 80;
  return true;
}

export function MenuBrowser({ items, categories }: MenuBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const name = safeText(item.name).toLowerCase();
      const description = safeText(item.description).toLowerCase();
      const category = safeText(item.category).toLowerCase();
      const badge = safeText(item.badge).toLowerCase();

      const matchesSearch = !normalizedSearch || name.includes(normalizedSearch) || description.includes(normalizedSearch) || category.includes(normalizedSearch) || badge.includes(normalizedSearch);
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesSpice = spiceFilter === "All" || item.spiceLevel === spiceFilter;

      return matchesSearch && matchesCategory && matchesSpice && matchesPriceFilter(item, priceFilter);
    });
  }, [categoryFilter, items, priceFilter, searchTerm, spiceFilter]);

  return (
    <section className="mt-5 md:mt-8">
      <div className="store-panel p-3 md:p-5">
        <div className="flex items-center gap-2">
          <label className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"><SearchIcon className="size-4" /></span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-12 w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] pl-10 pr-3 text-sm font-bold outline-none focus:border-[var(--brand)]" placeholder="Search meals" />
          </label>
          <button type="button" onClick={() => setShowFilters((value) => !value)} className={`grid size-12 place-items-center rounded-2xl text-sm font-black ring-1 ring-[var(--line)] ${showFilters ? "bg-[var(--dark)] text-white" : "bg-white text-[var(--ink)]"}`} aria-label="Toggle filters">
            <FilterIcon />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((category) => (
            <button key={category} type="button" onClick={() => setCategoryFilter(category)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition md:px-4 md:text-sm ${categoryFilter === category ? "bg-[var(--dark)] text-white" : "bg-[var(--soft)] text-[var(--ink)]"}`}>
              {category}
            </button>
          ))}
        </div>

        <div className={`grid overflow-hidden transition-all duration-300 ${showFilters ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 md:mt-3 md:grid-rows-[1fr] md:opacity-100"}`}>
          <div className="min-h-0 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-xs font-black text-[var(--muted)]">
              Spice
              <select value={spiceFilter} onChange={(event) => setSpiceFilter(event.target.value as SpiceFilter)} className="h-11 rounded-2xl border border-[var(--line)] bg-white px-3 text-sm font-bold text-[var(--ink)] outline-none">
                {spiceFilters.map((filter) => <option key={filter}>{filter}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-xs font-black text-[var(--muted)]">
              Price
              <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value as PriceFilter)} className="h-11 rounded-2xl border border-[var(--line)] bg-white px-3 text-sm font-bold text-[var(--ink)] outline-none">
                {priceFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">{filteredItems.length} meals available</p>

      {filteredItems.length === 0 ? (
        <div className="surface mt-5 p-8 text-center">
          <h2 className="text-2xl font-black">No meals found</h2>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const imageUrl = resolvePublicAssetUrl(item.imageUrl);
            return (
              <article key={item.id} className="store-product p-2 md:p-3">
                {imageUrl ? <img src={imageUrl} alt={item.name} className="h-28 w-full rounded-[18px] object-cover sm:h-40 md:h-[180px]" /> : <div className="food-tile min-h-[112px] sm:min-h-[160px] md:min-h-[180px]" />}
                <div className="px-1 pb-1 pt-3 md:p-2 md:pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="hidden rounded-full bg-[var(--soft)] px-2 py-1 text-[10px] font-black text-[var(--brand-dark)] sm:inline-flex">{item.category}</p>
                    <p className="text-xs font-black text-[var(--brand-dark)] md:text-sm">GH₵{item.priceFrom}+</p>
                  </div>
                  <h3 className="mt-2 line-clamp-2 min-h-[38px] text-sm font-black leading-tight md:text-xl">{item.name}</h3>
                  <p className="mt-1 hidden min-h-12 text-sm font-medium leading-6 text-[var(--muted)] md:block">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[var(--muted)] md:mt-3 md:text-xs">
                    <span>{item.spiceLevel}</span>
                    <span className="hidden sm:inline">{item.prepTime}</span>
                  </div>
                  <AddToCartButton item={item} compact />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
