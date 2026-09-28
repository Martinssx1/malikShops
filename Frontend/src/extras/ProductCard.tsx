import { useState } from "react";
import { Check, Plus, Star } from "lucide-react";
import {
  MIN_PLAN_ORDER,
  formatNaira,
  installmentOf,
  type Product,
} from "../data";
import { useCart } from "../context/useContext";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col rounded-3xl border border-line bg-surface p-3 transition-colors hover:border-brand/50">
      <div className="relative">
        <ProductArt
          product={product}
          className="aspect-[4/5] w-full rounded-2xl"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-brand">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
        <p className="text-xs text-muted">{product.category}</p>
        <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.blurb}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-brand text-brand" />
          <span className="font-semibold text-ink">{product.rating}</span> (
          {product.reviews})
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="font-display text-xl font-extrabold">
              {formatNaira(product.price)}
            </p>
            {product.price >= MIN_PLAN_ORDER && (
              <p className="text-xs text-muted">
                or {formatNaira(installmentOf(product.price, 4))} × 4
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors ${
              added
                ? "bg-tint text-brand"
                : "bg-brand text-brand-ink hover:opacity-90"
            }`}
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
