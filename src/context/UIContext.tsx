import { useEffect, useState, type ReactNode } from "react";
import { UIContext } from "./useContext.js";

export interface UIContextValue {
  cartOpen: boolean;
  checkoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Closes the cart drawer and opens checkout in one step. */
  goToCheckout: () => void;
  closeCheckout: () => void;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const closeCheckout = () => setCheckoutOpen(false);

  // Escape closes whichever overlay is open, checkout first.
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
    <UIContext.Provider
      value={{
        cartOpen,
        checkoutOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        goToCheckout: () => {
          setCartOpen(false);
          setCheckoutOpen(true);
        },
        closeCheckout,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

/** Open/close the cart drawer and checkout modal from any component. */
