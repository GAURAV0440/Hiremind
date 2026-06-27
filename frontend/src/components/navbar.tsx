import { ArrowUpRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "./logo";
import { ThemeSwitch } from "./theme-switch";
import { Button } from "./ui/button";

const links = [
  ["Features", "/#features"],
  ["How it works", "/#how-it-works"],
  ["Dashboard", "/app"],
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-5" aria-label="Main navigation">
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, to]) => (
            <NavLink key={label} to={to} className="text-sm text-ink-500 transition-colors hover:text-ink-950 dark:text-ink-400 dark:hover:text-white">
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeSwitch />
          <Link to="/upload" className="hidden sm:block">
            <Button size="sm">Start interview <ArrowUpRight className="size-3.5" /></Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
