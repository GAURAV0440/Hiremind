import { Database, Moon, Server, Sun } from "lucide-react";
import { PageTransition } from "../components/page-transition";
import { ThemeSwitch } from "../components/theme-switch";
import { Card } from "../components/ui/card";
import { useTheme } from "../context/theme-context";

export default function SettingsPage() {
  const { theme } = useTheme();
  return (
    <PageTransition>
      <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Preferences</p><h1 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Settings</h1><p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Tune the interface and inspect the frontend connection.</p></div>
      <div className="grid max-w-4xl gap-4">
        <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]">{theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}</span><div><h2 className="font-medium">Appearance</h2><p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Choose a light or dark workspace. Your choice is saved locally.</p></div></div><ThemeSwitch /></Card>
        <Card className="p-6"><div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]"><Server className="size-5" /></span><div className="min-w-0"><h2 className="font-medium">API connection</h2><p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Configured through <code className="rounded bg-slate-900/[0.04] px-1.5 py-0.5 text-xs dark:bg-white/[0.06]">VITE_API_BASE_URL</code>.</p><p className="mt-4 truncate rounded-xl border border-slate-900/[0.07] bg-slate-900/[0.025] px-3 py-2 font-mono text-xs text-ink-500 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-ink-400">{import.meta.env.VITE_API_BASE_URL ?? "Not configured"}</p></div></div></Card>
        <Card className="p-6"><div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]"><Database className="size-5" /></span><div><h2 className="font-medium">Local history</h2><p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-400">Active session state and up to 20 completed reports are kept in this browser so refreshes do not erase your progress.</p></div></div></Card>
      </div>
    </PageTransition>
  );
}
