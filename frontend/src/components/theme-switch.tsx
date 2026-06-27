import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme-context";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative grid h-9 w-[72px] grid-cols-2 rounded-full border border-slate-900/10 bg-slate-900/5 p-1 dark:border-white/10 dark:bg-white/[0.06]" role="group" aria-label="Color theme">
      <motion.span
        className="absolute top-1 size-7 rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,.14)] dark:bg-slate-100"
        animate={{ x: isDark ? 4 : 38 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      />
      <button className="relative z-10 flex items-center justify-center rounded-full" onClick={() => setTheme("dark")} aria-label="Use dark mode" aria-pressed={isDark}>
        <Moon className="size-3.5" />
      </button>
      <button className="relative z-10 flex items-center justify-center rounded-full" onClick={() => setTheme("light")} aria-label="Use light mode" aria-pressed={!isDark}>
        <Sun className="size-3.5" />
      </button>
    </div>
  );
}
