import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const control = "w-full rounded-2xl border border-slate-900/10 bg-white/78 px-4 text-[15px] text-ink-950 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-ink-500 focus:ring-4 focus:ring-ink-900/[0.05] dark:border-white/10 dark:bg-slate-950/45 dark:text-white dark:placeholder:text-ink-500 dark:focus:border-ink-400 dark:focus:ring-white/[0.05]";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(control, "h-11", className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(control, "min-h-32 resize-y py-3.5", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
