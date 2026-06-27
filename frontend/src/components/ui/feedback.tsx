import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle aria-hidden="true" className={cn("size-4 animate-spin", className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-xl bg-[linear-gradient(90deg,rgba(120,120,115,.08)_25%,rgba(120,120,115,.18)_50%,rgba(120,120,115,.08)_75%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={normalized} role="progressbar">
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/[0.07] dark:bg-white/10">
        <motion.div
          className="h-full rounded-full bg-ink-900 dark:bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-slate-900/[0.07] bg-slate-900/[0.035] px-2.5 py-1 text-xs font-medium text-ink-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-ink-300", className)}>
      {children}
    </span>
  );
}
