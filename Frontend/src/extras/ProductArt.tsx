import type { Product } from "../data";

/**
 * Placeholder art for a product: its icon centred on a tinted tile.
 * Set `image` on the product in data.ts to show a real photo instead.
 */
export function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className={`object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const Icon = product.icon;
  const tone = ["bg-tint", "bg-brand/10", "bg-line/60"][product.id % 3];

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${tone} ${className}`}
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/10" />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-surface/50" />
      <Icon
        aria-hidden
        strokeWidth={1.25}
        className="relative h-1/3 w-1/3 text-brand"
      />
    </div>
  );
}
