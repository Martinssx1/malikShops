import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Lock,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Sun,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  MIN_PLAN_ORDER,
  PLAN_OPTIONS,
  PRODUCTS,
  formatNaira,
  installmentOf,
  type Category,
  type PlanMonths,
  type Product,
} from "./data";
import { payWithPaystack, paystackReady } from "./paystack";

/* ───────────────────────── Theme ───────────────────────── */

function useTheme() {
  const [dark, setDark] = useState<boolean>(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("ms-theme", dark ? "dark" : "light");
    } catch {
      /* storage unavailable, ignore */
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
      className="relative flex h-9 w-[68px] shrink-0 items-center rounded-full border border-line bg-tint transition-colors"
    >
      <Sun aria-hidden className="absolute left-2.5 h-4 w-4 text-muted" />
      <Moon aria-hidden className="absolute right-2.5 h-4 w-4 text-muted" />
      <span
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-ink shadow transition-transform duration-300 ${
          dark ? "translate-x-[32px]" : "translate-x-0"
        }`}
      >
        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
    </button>
  );
}

/* ───────────────────────── Small pieces ───────────────────────── */

const field =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none";

function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const Icon = product.icon;
  const tone = ["bg-tint", "bg-brand/10", "bg-line/60"][product.id % 3];
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

function Logo() {
  return (
    <a
      href="#top"
      className="flex items-center gap-2.5"
      aria-label="malikshops home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-display text-lg font-extrabold text-brand-ink">
        m
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        malikshops
      </span>
    </a>
  );
}

/* ───────────────────────── Header ───────────────────────── */

function Header({
  dark,
  onToggleTheme,
  count,
  onOpenCart,
}: {
  dark: boolean;
  onToggleTheme: () => void;
  count: number;
  onOpenCart: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
          <a href="#shop" className="transition-colors hover:text-ink">
            Shop
          </a>
          <a href="#plans" className="transition-colors hover:text-ink">
            Payment plans
          </a>
          <a href="#help" className="transition-colors hover:text-ink">
            Delivery &amp; returns
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-brand-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const headphones = PRODUCTS.find((p) => p.id === 5)!;
  const sneakers = PRODUCTS.find((p) => p.id === 3)!;
  const lamp = PRODUCTS.find((p) => p.id === 10)!;

  return (
    <section
      id="top"
      className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-20"
    >
      <div>
        <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
          Shop today.
          <br />
          Pay small small.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          Split any order over {formatNaira(MIN_PLAN_ORDER)} into 2, 3 or 4
          monthly payments with Paystack. Pay the first part now and we&apos;ll
          ship right away.
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

      {/* Collage */}
      <div className="relative grid grid-cols-5 grid-rows-2 gap-3">
        <ProductArt
          product={headphones}
          className="col-span-3 row-span-2 min-h-[320px] rounded-3xl"
        />
        <ProductArt
          product={sneakers}
          className="col-span-2 aspect-square rounded-3xl"
        />
        <ProductArt
          product={lamp}
          className="col-span-2 aspect-square rounded-3xl"
        />
        <div className="absolute -bottom-4 left-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg shadow-brand/10 sm:left-8">
          <p className="text-xs text-muted">{headphones.name}</p>
          <p className="font-display text-lg font-bold">
            {formatNaira(installmentOf(headphones.price, 4))}
            <span className="text-sm font-medium text-muted">
              {" "}
              today, then 3 monthly payments
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Catalogue ───────────────────────── */

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
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

function Catalogue({ onAdd }: { onAdd: (p: Product) => void }) {
  const [category, setCategory] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

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
              className={`${field} pl-10 sm:w-64`}
            />
          </label>
          <label>
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className={field}
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
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── Payment plan explainer ───────────────────────── */

function PlanBand() {
  const steps = [
    {
      title: "Choose a plan at checkout",
      body: `Available on orders of ${formatNaira(MIN_PLAN_ORDER)} or more. Pick 2, 3 or 4 monthly payments.`,
    },
    {
      title: "Pay the first part today",
      body: "Pay securely with your card through Paystack. Your order is confirmed straight away.",
    },
    {
      title: "The rest is charged monthly",
      body: "Paystack charges the same card each month until the plan is complete. No paperwork.",
    },
  ];
  return (
    <section id="plans" className="scroll-mt-20 border-y border-line bg-tint">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Payment plans
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            A {formatNaira(85000)} pair of headphones becomes{" "}
            {formatNaira(installmentOf(85000, 4))} a month for four months.
          </p>
        </div>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-brand-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Cart drawer ───────────────────────── */

interface CartLine {
  product: Product;
  qty: number;
}

function CartDrawer({
  open,
  lines,
  subtotal,
  delivery,
  total,
  onClose,
  onChangeQty,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  total: number;
  onClose: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-bg transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold">Your bag</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="rounded-full p-2 hover:bg-tint"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="h-10 w-10 text-brand" strokeWidth={1.25} />
            <p className="mt-4 font-display text-lg font-bold">
              Your bag is empty
            </p>
            <p className="mt-1 text-sm text-muted">
              Add something from the shop and it will show up here.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink"
            >
              Keep shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <ProductArt
                    product={product}
                    className="h-20 w-20 shrink-0 rounded-xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-bold leading-snug">
                        {product.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-muted hover:text-ink"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line bg-surface">
                        <button
                          type="button"
                          onClick={() => onChangeQty(product.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-2 hover:text-brand"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onChangeQty(product.id, 1)}
                          aria-label="Increase quantity"
                          className="p-2 hover:text-brand"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold">
                        {formatNaira(product.price * qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-line px-5 py-5 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : formatNaira(delivery)}</span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-brand">
                  Add {formatNaira(FREE_DELIVERY_FROM - subtotal)} more for free
                  delivery.
                </p>
              )}
              <div className="flex justify-between pt-2 font-display text-lg font-extrabold">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                className="mt-3 w-full rounded-full bg-brand py-3.5 text-sm font-bold text-brand-ink transition-opacity hover:opacity-90"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

/* ───────────────────────── Checkout with Paystack ───────────────────────── */

function Checkout({
  lines,
  subtotal,
  delivery,
  total,
  onClose,
  onPaid,
}: {
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  total: number;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [months, setMonths] = useState<PlanMonths>(0);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const planAllowed = total >= MIN_PLAN_ORDER;
  const instalment = months ? installmentOf(total, months) : 0;
  const dueToday = months ? instalment : total;

  const pay = () => {
    setError("");
    if (!name.trim() || !address.trim())
      return setError("Enter your name and delivery address.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError(
        "Enter a valid email address. Paystack sends your receipt there.",
      );
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Enter a phone number the rider can call.");

    try {
      setPaying(true);
      payWithPaystack({
        email,
        amountNaira: dueToday,
        months,
        instalmentNaira: months ? instalment : undefined,
        metadata: {
          customer_name: name,
          phone,
          address,
          order_total: total,
          items: lines.map((l) => `${l.qty} × ${l.product.name}`).join(", "),
        },
        onSuccess: (ref) => {
          setPaying(false);
          setReference(ref);
          onPaid();
        },
        onClose: () => setPaying(false),
      });
    } catch (e) {
      setPaying(false);
      setError(
        e instanceof Error ? e.message : "Payment could not start. Try again.",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-bg sm:rounded-3xl">
        {reference ? (
          <div className="px-8 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-ink">
              <Check className="h-7 w-7" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-extrabold">
              Payment received
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              We sent a receipt to {email}.{" "}
              {months
                ? `Your remaining ${months - 1} payment${months - 1 > 1 ? "s" : ""} will be charged monthly to the same card.`
                : "Your order is on its way to being packed."}
            </p>
            <p className="mt-4 text-xs text-muted">
              Reference{" "}
              <span className="font-semibold text-ink">{reference}</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-bold text-brand-ink"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-xl font-bold">Checkout</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close checkout"
                className="rounded-full p-2 hover:bg-tint"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-6">
                <fieldset className="space-y-3">
                  <legend className="mb-1 font-display text-base font-bold">
                    Delivery details
                  </legend>
                  <input
                    className={field}
                    placeholder="Full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={field}
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className={field}
                      type="tel"
                      placeholder="Phone number"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <input
                    className={field}
                    placeholder="Delivery address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-display text-base font-bold">
                    How would you like to pay?
                  </legend>
                  <div className="space-y-2.5">
                    <PlanOption
                      selected={months === 0}
                      onSelect={() => setMonths(0)}
                      title="Pay in full"
                      detail={formatNaira(total)}
                    />
                    {PLAN_OPTIONS.map((m) => (
                      <PlanOption
                        key={m}
                        disabled={!planAllowed}
                        selected={months === m}
                        onSelect={() => setMonths(m)}
                        title={`${m} monthly payments`}
                        detail={`${formatNaira(installmentOf(total, m))} / month`}
                        note={
                          planAllowed
                            ? "First payment today"
                            : `Orders of ${formatNaira(MIN_PLAN_ORDER)}+ only`
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="h-fit rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-display text-base font-bold">
                  Order summary
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex justify-between gap-3">
                      <span className="text-muted">
                        {qty} × {product.name}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatNaira(product.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Delivery</span>
                    <span>
                      {delivery === 0 ? "Free" : formatNaira(delivery)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold">
                    <span>Order total</span>
                    <span>{formatNaira(total)}</span>
                  </div>
                  <div className="flex justify-between rounded-xl bg-tint px-3 py-2.5 font-display text-base font-extrabold text-brand">
                    <span>Due today</span>
                    <span>{formatNaira(dueToday)}</span>
                  </div>
                  {months > 0 && (
                    <p className="pt-1 text-xs text-muted">
                      Then {months - 1} more monthly payment
                      {months - 1 > 1 ? "s" : ""} of {formatNaira(instalment)}.
                    </p>
                  )}
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-line bg-tint px-3 py-2.5 text-sm"
                  >
                    {error}
                  </p>
                )}
                {!paystackReady() && (
                  <p className="mt-4 text-xs text-muted">
                    Paystack isn&apos;t configured yet. Add your public key to{" "}
                    <code>.env</code> to accept payments.
                  </p>
                )}

                <button
                  type="button"
                  onClick={pay}
                  disabled={paying}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-brand-ink transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Lock className="h-4 w-4" />
                  {paying
                    ? "Opening Paystack…"
                    : `Pay ${formatNaira(dueToday)}`}
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  Secured by Paystack. Card details never touch our site.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PlanOption({
  selected,
  disabled,
  onSelect,
  title,
  detail,
  note,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  note?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        selected ? "border-brand bg-tint" : "border-line bg-surface"
      } ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-brand/60"}`}
    >
      <input
        type="radio"
        name="plan"
        className="sr-only"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
      />
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-brand bg-brand text-brand-ink" : "border-line"
        }`}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        {note && <span className="block text-xs text-muted">{note}</span>}
      </span>
      <span className="text-sm font-bold">{detail}</span>
    </label>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  const perks = [
    {
      icon: Truck,
      title: "Nationwide delivery",
      body: `${formatNaira(DELIVERY_FEE)} flat rate, free over ${formatNaira(FREE_DELIVERY_FROM)}.`,
    },
    {
      icon: RotateCcw,
      title: "7-day returns",
      body: "Changed your mind? Send it back unused for a refund.",
    },
    {
      icon: ShieldCheck,
      title: "Secure payments",
      body: "Cards, transfers and USSD, handled by Paystack.",
    },
  ];
  return (
    <footer id="help" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        {perks.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tint text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold">{title}</h3>
              <p className="mt-0.5 text-sm text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} malikshops. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── App ───────────────────────── */

export default function App() {
  const { dark, toggle } = useTheme();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => ({
        product: PRODUCTS.find((p) => p.id === Number(id))!,
        qty,
      })),
    [cart],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const delivery =
    subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const add = (p: Product) =>
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
  const changeQty = (id: number, delta: number) =>
    setCart((c) => {
      const next = (c[id] ?? 0) + delta;
      const { [id]: _removed, ...rest } = c;
      return next > 0 ? { ...rest, [id]: next } : rest;
    });
  const remove = (id: number) =>
    setCart((c) => {
      const { [id]: _removed, ...rest } = c;
      return rest;
    });

  // Close overlays with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (checkoutOpen) setCheckoutOpen(false);
      else setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen]);

  return (
    <>
      <Header
        dark={dark}
        onToggleTheme={toggle}
        count={count}
        onOpenCart={() => setCartOpen(true)}
      />
      <main>
        <Hero />
        <Catalogue onAdd={add} />
        <PlanBand />
      </main>
      <Footer />

      <CartDrawer
        open={cartOpen}
        lines={lines}
        subtotal={subtotal}
        delivery={delivery}
        total={total}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={remove}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen && (
        <Checkout
          lines={lines}
          subtotal={subtotal}
          delivery={delivery}
          total={total}
          onClose={() => setCheckoutOpen(false)}
          onPaid={() => setCart({})}
        />
      )}
    </>
  );
}
