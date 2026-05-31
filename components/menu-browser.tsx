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
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.badge.toLowerCase().includes(normalizedSearch);

      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesSpice = spiceFilter === "All" || item.spiceLevel === spiceFilter;
      const matchesAvailability = !availableOnly || item.available;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSpice &&
        matchesAvailability &&
        matchesPriceFilter(item, priceFilter)
      );
    });
  }, [availableOnly, categoryFilter, items, priceFilter, searchTerm, spiceFilter]);

  function resetFilters() {
    setSearchTerm("");
    setCategoryFilter("All");
    setSpiceFilter("All");
    setPriceFilter("all");
    setAvailableOnly(false);
  }

  return (
    <section className="mt-12">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <label className="grid gap-2 text-sm font-bold text-cream/75">
            Search menu
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-cream outline-none placeholder:text-cream/35 focus:border-gold"
              placeholder="Search chicken, jollof, fries..."
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-cream/75">
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-cream outline-none focus:border-gold"
            >
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-cream/75">
            Price
            <select
              value={priceFilter}
              onChange={(event) => setPriceFilter(event.target.value as PriceFilter)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-cream outline-none focus:border-gold"
            >
              {priceFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {spiceFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSpiceFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  spiceFilter === filter
                    ? "border-gold bg-gold text-charcoal"
                    : "border-white/10 text-cream/70 hover:border-gold hover:text-gold"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-cream/70">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="size-4 accent-[#F5B041]"
              />
              Available only
            </label>
            <button type="button" onClick={resetFilters} className="text-sm font-bold text-gold hover:text-cream">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-cream/55">
          Showing {filteredItems.length} of {items.length} menu items
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="text-2xl font-black">No meals found.</h2>
          <p className="mt-2 text-cream/60">Try another search, spice level, category, or price range.</p>
          <button type="button" onClick={resetFilters} className="mt-6 rounded-full bg-flame px-6 py-3 font-black text-charcoal hover:bg-gold">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-gold/40">
              <div className="mb-5 h-48 rounded-[1.5rem] bg-gradient-to-br from-flame/55 via-smoke to-black" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-gold">{item.badge}</p>
                <p className="rounded-full bg-flame/15 px-3 py-1 text-xs font-black text-flame">{item.spiceLevel}</p>
              </div>
              <h3 className="mt-3 text-2xl font-black">{item.name}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-cream/65">{item.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-cream/60">
                <span>From GH₵{item.priceFrom}</span>
                <span>{item.prepTime}</span>
              </div>
              <AddToCartButton item={item} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
