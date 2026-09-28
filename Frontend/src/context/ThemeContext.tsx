import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./useContext.js";

export interface ThemeContextValue {
  dark: boolean;
  toggle: () => void;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() =>
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

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}
