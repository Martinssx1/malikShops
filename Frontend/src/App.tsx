import { ThemeProvider } from "./context/ThemeContext";
import CartProvider from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Hero } from "./layout/Hero";
import { Catalogue } from "./extras/Catalogue";
import { PlanBand } from "./extras/PlanBand";
import { CartDrawer } from "./extras/CartDrawer";
import { Checkout } from "./extras/Checkout";

/**
 * Composition root. State lives in the three providers below and every
 * component reads what it needs from context, so nothing here is passed
 * down as props — see src/context/ for Theme, Cart and UI (drawer/modal) state.
 */
export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <UIProvider>
          <Header />
          <main>
            <Hero />
            <Catalogue />
            <PlanBand />
          </main>
          <Footer />
          <CartDrawer />
          <Checkout />
        </UIProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
