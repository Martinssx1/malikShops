import { useMemo, useState, type ReactNode } from "react";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_FROM,
  PRODUCTS,
  type Product,
} from "../data";
import { CartContext } from "./useContext";

export interface CartLine {
  product: Product;
  qty: number;
}

export interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  add: (product: Product) => void;
  changeQty: (id: number, delta: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  // Store just id → quantity; product details are looked up from PRODUCTS.
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const add = (product: Product) =>
    setQuantities((q) => ({ ...q, [product.id]: (q[product.id] ?? 0) + 1 }));

  const changeQty = (id: number, delta: number) =>
    setQuantities((q) => {
      const next = (q[id] ?? 0) + delta;
      const { [id]: _removed, ...rest } = q;
      return next > 0 ? { ...rest, [id]: next } : rest;
    });

  const remove = (id: number) =>
    setQuantities((q) => {
      const { [id]: _removed, ...rest } = q;
      return rest;
    });

  const clear = () => setQuantities({});

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(quantities).map(([id, qty]) => ({
        product: PRODUCTS.find((p) => p.id === Number(id))!,
        qty,
      })),
    [quantities],
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const delivery =
    subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        subtotal,
        delivery,
        total,
        add,
        changeQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
