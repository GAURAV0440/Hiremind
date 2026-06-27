import { BarChart3, FilePlus2, FileText, LayoutDashboard, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "../components/logo";
import { ThemeSwitch } from "../components/theme-switch";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";

const navigation = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard, end: true },
  { label: "New Interview", to: "/upload", icon: FilePlus2 },
  { label: "Reports", to: "/app/reports", icon: FileText },
  { label: "Settings", to: "/app/settings", icon: Settings },
] as const;

function SidebarContent({ close }: { close?: () => void }) {
  return (
    <>
      <div className="flex h-20 items-center px-5"><Logo /></div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard navigation">
        {navigation.map(({ label, to, icon: Icon, ...item }) => (
          <NavLink
            key={label}
            to={to}
            end={"end" in item ? item.end : undefined}
            onClick={close}
            className={({ isActive }) => cn(
              "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-ink-900 text-white shadow-sm dark:bg-white dark:text-ink-950"
                : "text-ink-500 hover:bg-slate-900/5 hover:text-ink-950 dark:text-ink-400 dark:hover:bg-white/[0.06] dark:hover:text-white",
            )}
          >
            <Icon className="size-[18px]" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl border border-slate-900/[0.07] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-white/[0.035]">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-ink-500 dark:text-ink-400">
          <BarChart3 className="size-3.5" /> Interface theme
        </div>
        <ThemeSwitch />
      </div>
    </>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-900/[0.07] bg-white/55 backdrop-blur-2xl dark:border-white/[0.07] dark:bg-slate-950/65 lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside className="relative flex h-full w-72 flex-col bg-ink-50 shadow-2xl dark:bg-slate-950">
            <Button variant="ghost" size="icon" className="absolute right-3 top-5" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="size-5" /></Button>
            <SidebarContent close={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-900/[0.06] bg-ink-50/75 px-4 backdrop-blur-xl dark:border-white/[0.07] dark:bg-slate-950/75 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></Button>
          <Logo compact className="ml-2" />
        </header>
        <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-9"><Outlet /></main>
      </div>
    </div>
  );
}
