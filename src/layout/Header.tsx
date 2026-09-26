import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/useContext";
import { useUI } from "../context/useContext";
import { ThemeToggle } from "../context/ThemeToggle";
import { Logo } from "./Logo";

export function Header() {
  const { count } = useCart();
  const { openCart } = useUI();

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
          <ThemeToggle />
          <button
            type="button"
            onClick={openCart}
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
