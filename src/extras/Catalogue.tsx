import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "../data";
import { fieldClass } from "../styles";
import { ProductCard } from "./ProductCard";

type SortMode = "featured" | "low" | "high";

export function Catalogue() {
  const [category, setCategory] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);

  return (
    <section
      id="shop"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          The shop
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className={`${fieldClass} pl-10 sm:w-64`}
            />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className={fieldClass}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Categories"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? "border-brand bg-brand text-brand-ink"
                : "border-line bg-surface text-muted hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line p-12 text-center">
          <p className="font-display text-xl font-bold">
            Nothing matches &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-sm text-muted">
            Try a shorter word or pick another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
