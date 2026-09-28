import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useContext";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
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
