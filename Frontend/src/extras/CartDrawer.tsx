import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { FREE_DELIVERY_FROM, formatNaira } from "../data";
import { useCart } from "../context/useContext";
import { useUI } from "../context/useContext";
import { ProductArt } from "./ProductArt";

export function CartDrawer() {
  const { lines, subtotal, delivery, total, changeQty, remove } = useCart();
  const { cartOpen, closeCart, goToCheckout } = useUI();

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-bg transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold">Your bag</h2>
          <button
            type="button"
            onClick={closeCart}
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
              onClick={closeCart}
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
                        onClick={() => remove(product.id)}
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
                          onClick={() => changeQty(product.id, -1)}
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
                          onClick={() => changeQty(product.id, 1)}
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
                onClick={goToCheckout}
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
