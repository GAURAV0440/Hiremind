import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="Hiremind home">
      <span className="flex size-8 items-center justify-center rounded-[11px] bg-ink-900 text-white shadow-md dark:bg-white dark:text-ink-950">
        <Sparkles className="size-4" strokeWidth={2} />
      </span>
      {!compact && <span className="text-sm font-semibold tracking-[0.18em] text-ink-900 dark:text-white">HIREMIND</span>}
    </Link>
  );
}
