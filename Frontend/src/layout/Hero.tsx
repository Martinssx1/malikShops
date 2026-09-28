import { PRODUCTS, formatNaira, installmentOf } from '../data';
import { ProductArt } from '../extras/ProductArt';

export function Hero() {
  const headphones = PRODUCTS.find((p) => p.id === 5)!;
  const sneakers = PRODUCTS.find((p) => p.id === 3)!;
  const lamp = PRODUCTS.find((p) => p.id === 10)!;

  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-20">
      <div>
        <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
          Shop today.
          <br />
          Pay small small.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Split any order over {formatNaira(20000)} into 2, 3 or 4 monthly payments with Paystack. Pay the
          first part now and we&apos;ll ship right away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#shop"
            className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition-opacity hover:opacity-90"
          >
            Browse the shop
          </a>
          <a
            href="#plans"
            className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-bold transition-colors hover:bg-tint"
          >
            How payment plans work
          </a>
        </div>
      </div>

      <div className="relative grid grid-cols-5 grid-rows-2 gap-3">
        <ProductArt product={headphones} className="col-span-3 row-span-2 min-h-[320px] rounded-3xl" />
        <ProductArt product={sneakers} className="col-span-2 aspect-square rounded-3xl" />
        <ProductArt product={lamp} className="col-span-2 aspect-square rounded-3xl" />
        <div className="absolute -bottom-4 left-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg shadow-brand/10 sm:left-8">
          <p className="text-xs text-muted">{headphones.name}</p>
          <p className="font-display text-lg font-bold">
            {formatNaira(installmentOf(headphones.price, 4))}
            <span className="text-sm font-medium text-muted"> today, then 3 monthly payments</span>
          </p>
        </div>
      </div>
    </section>
  );
}
