import { motion } from "framer-motion";
import { Mic, RotateCcw, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "../utils/cn";
import type { VoiceState } from "../hooks/use-speech-interview";

interface VoiceWaveProps {
  state: VoiceState;
  muted: boolean;
  recognitionSupported: boolean;
  synthesisSupported: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
  onReplay: () => void;
  onToggleMute: () => void;
}

const heights = [16, 28, 19, 36, 25, 44, 30, 20, 39, 24, 32, 18, 27, 15];

export function VoiceWave({
  state,
  muted,
  recognitionSupported,
  synthesisSupported,
  error,
  onStart,
  onStop,
  onReplay,
  onToggleMute,
}: VoiceWaveProps) {
  const active = state !== "idle";
  const controls = [
    { label: "Start", icon: Mic, action: onStart, disabled: !recognitionSupported || state !== "idle" },
    { label: "Stop", icon: Square, action: onStop, disabled: state === "idle" || state === "thinking" },
    { label: "Replay", icon: RotateCcw, action: onReplay, disabled: !synthesisSupported || muted || state === "thinking" },
    { label: muted ? "Unmute" : "Mute", icon: muted ? VolumeX : Volume2, action: onToggleMute, disabled: !synthesisSupported },
  ];

  return (
    <div>
      <div className="flex items-center justify-center gap-2 pt-5" role="status" aria-live="polite">
        <motion.span
          className={cn("size-2 rounded-full", state === "idle" ? "bg-ink-300 dark:bg-ink-600" : "bg-ink-900 dark:bg-white")}
          animate={active ? { opacity: [0.35, 1, 0.35], scale: [0.8, 1.15, 0.8] } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, repeat: active ? Infinity : 0 }}
        />
        <span className="text-xs font-medium capitalize">{state}</span>
      </div>
      <div className="flex h-20 items-center justify-center gap-1" aria-hidden="true">
        {heights.map((height, index) => (
          <motion.span
            key={`${height}-${index}`}
            className="w-1 rounded-full bg-ink-900 dark:bg-ink-100"
            animate={{
              height: active ? [8, height, 10] : 8,
              opacity: active ? [0.35, 1, 0.4] : 0.2,
            }}
            transition={{
              duration: state === "thinking" ? 1.15 : 0.75,
              repeat: active ? Infinity : 0,
              delay: index * 0.045,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {controls.map(({ label, icon: Icon, action, disabled }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            disabled={disabled}
            className={cn(
              "flex min-h-16 min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-900/[0.08] bg-white/70 px-2.5 py-3 text-xs font-semibold text-ink-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-900/15 hover:bg-white hover:text-ink-950 disabled:pointer-events-none disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.055] dark:text-ink-200 dark:hover:border-white/20 dark:hover:bg-white/[0.085] dark:hover:text-white",
              label === "Stop" && state !== "idle" && state !== "thinking" && "border-ink-900 bg-ink-900 text-white hover:bg-ink-800 hover:text-white dark:border-white dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100 dark:hover:text-ink-950",
            )}
            aria-label={`${label} voice ${label === "Start" ? "input" : "control"}`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-xs leading-5 text-red-600 dark:text-red-400" role="alert">{error}</p>}
      {!recognitionSupported && !error && <p className="mt-3 text-xs leading-5 text-ink-400">Voice input is unavailable in this browser. Typed answers still work normally.</p>}
    </div>
  );
}
