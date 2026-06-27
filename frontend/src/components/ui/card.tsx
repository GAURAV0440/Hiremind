import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-900/8 bg-white/78 shadow-[0_14px_45px_rgba(15,23,42,.06)] backdrop-blur-xl transition-colors dark:border-white/[0.08] dark:bg-slate-950/45 dark:shadow-[0_16px_50px_rgba(0,0,0,.26)]",
        className,
      )}
      {...props}
    />
  );
}
