import { useContext, createContext } from "react";
import type { UIContextValue } from "./UIContext";
import type { CartContextValue } from "./CartContext";
import type { ThemeContextValue } from "./ThemeContext";

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
export const UIContext = createContext<UIContextValue | null>(null);
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}
