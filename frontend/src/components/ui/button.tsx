import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-sky-600 text-white shadow-[0_10px_28px_rgba(15,23,42,.2)] hover:-translate-y-0.5 hover:bg-sky-500 dark:bg-sky-500 dark:text-ink-950 dark:hover:bg-sky-400",
  secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/16",
  ghost: "text-ink-600 hover:bg-slate-900/5 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-white/8 dark:hover:text-white",
  outline: "border border-slate-900/10 bg-white/60 text-ink-800 hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-ink-100 dark:hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3.5 text-sm",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-13 rounded-2xl px-6 text-[15px]",
  icon: "size-10 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ink-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
