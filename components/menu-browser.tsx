"use client";

import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { MenuItem } from "@/lib/restaurant-data";

const spiceFilters = ["All", "Mild", "Medium", "Hot", "Extra Hot"] as const;
const priceFilters = [
  { label: "All prices", value: "all" },
  { label: "Under GH₵70", value: "under-70" },
  { label: "GH₵70–80", value: "70-80" },
  { label: "Above GH₵80", value: "above-80" }
] as const;

type SpiceFilter = (typeof spiceFilters)[number];
type PriceFilter = (typeof priceFilters)[number]["value"];

type MenuBrowserProps = {
  items: MenuItem[];
  categories: string[];
};

function matchesPriceFilter(item: MenuItem, filter: PriceFilter) {
  if (filter === "under-70") return item.priceFrom < 70;
  if (filter === "70-80") return item.priceFrom >= 70 && item.priceFrom <= 80;
  if (filter === "above-80") return item.priceFrom > 80;
  return true;
}

export function MenuBrowser({ items, categories }: MenuBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [spiceFilter, setSpiceFilter] = useState<SpiceFilter>("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesSpice = spiceFilter === "All" || item.spiceLevel === spiceFilter;

      return matchesSearch && matchesCategory && matchesSpice && matchesPriceFilter(item, priceFilter);
    });
  }, [categoryFilter, items, priceFilter, searchTerm, spiceFilter]);

  return (
    <section className="mt-8">
      <div className="surface p-4 md:p-5">
        <label className="app-label">
          Search food
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="app-input" placeholder="Chicken, jollof, fries..." />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setCategoryFilter(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
                categoryFilter === category ? "bg-[var(--dark)] text-white" : "bg-[var(--soft)] text-[var(--ink)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="app-label">
            Spice
            <select value={spiceFilter} onChange={(event) => setSpiceFilter(event.target.value as SpiceFilter)} className="app-input">
              {spiceFilters.map((filter) => <option key={filter}>{filter}</option>)}
            </select>
          </label>
          <label className="app-label">
            Price
            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value as PriceFilter)} className="app-input">
              {priceFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-sm font-bold text-[var(--muted)]">{filteredItems.length} meals available</p>

      {filteredItems.length === 0 ? (
        <div className="surface mt-5 p-8 text-center">
          <h2 className="text-2xl font-black">No meals found</h2>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="surface overflow-hidden p-3">
              <div className="food-tile" />
              <div className="p-2 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="pill">{item.category}</p>
                  <p className="text-sm font-black text-[var(--brand-dark)]">GH₵{item.priceFrom}+</p>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight">{item.name}</h3>
                <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-[var(--muted)]">{item.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-[var(--muted)]">
                  <span>{item.spiceLevel}</span>
                  <span>{item.prepTime}</span>
                </div>
                <AddToCartButton item={item} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
