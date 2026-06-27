import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { Badge } from "./ui/feedback";

export function QuestionCard({ topic, question, number }: { topic: string; question: string; number: number }) {
  return (
    <motion.article
      key={question}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,.2)] sm:p-8 dark:from-white dark:via-slate-50 dark:to-slate-100 dark:text-ink-950"
    >
      <div className="absolute -right-16 -top-20 size-52 rounded-full bg-white/[0.08] blur-2xl dark:bg-black/[0.06]" />
      <div className="relative">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Badge className="border-white/10 bg-white/10 text-white dark:border-black/10 dark:bg-black/[0.06] dark:text-ink-800">Question {number}</Badge>
          <MessageSquareText className="size-5 opacity-50" />
        </div>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] opacity-70">{topic}</p>
        <h1 className="max-w-3xl text-balance text-2xl font-medium leading-[1.35] tracking-[-0.025em] sm:text-3xl">{question}</h1>
      </div>
    </motion.article>
  );
}
