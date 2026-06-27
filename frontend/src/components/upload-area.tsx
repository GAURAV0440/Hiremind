import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";

interface UploadAreaProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export function UploadArea({ file, onFileChange, error }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const selectFile = (candidate?: File) => {
    if (candidate) onFileChange(candidate);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);

  if (file) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 rounded-2xl border border-slate-900/10 bg-white/78 p-4 dark:border-white/10 dark:bg-white/[0.035]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/8">
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="mt-0.5 text-xs text-ink-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onFileChange(null)} aria-label="Remove resume">
          <X className="size-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "group flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 text-center transition-all duration-200",
          dragging
            ? "scale-[1.01] border-ink-600 bg-slate-900/[0.035] dark:border-ink-300 dark:bg-white/[0.06]"
            : "border-slate-900/15 bg-white/42 hover:border-slate-900/30 hover:bg-white/70 dark:border-white/15 dark:bg-white/[0.025] dark:hover:border-white/30 dark:hover:bg-white/[0.045]",
        )}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
      >
        <span className="mb-5 flex size-13 items-center justify-center rounded-2xl border border-slate-900/[0.08] bg-white shadow-sm transition-transform group-hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.07]">
          <UploadCloud className="size-5" />
        </span>
        <p className="font-medium">Drop your resume here</p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-ink-500 dark:text-ink-400">PDF or DOCX. Your resume is used only to personalize the interview.</p>
        <span className="mt-5 rounded-xl border border-slate-900/10 bg-white px-4 py-2 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-white/[0.06]">Browse files</span>
      </div>
      <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleInput} />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}
