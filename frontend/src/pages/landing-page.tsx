import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BrainCircuit, Check, FileSearch, Sparkles, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { PageTransition } from "../components/page-transition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/feedback";

const features = [
  { icon: BrainCircuit, title: "Adaptive interviews", text: "Every follow-up responds to the quality and depth of your previous answer." },
  { icon: FileSearch, title: "Resume-aware questions", text: "Practice around your real projects, experience, strengths, and target role." },
  { icon: BarChart3, title: "Useful feedback", text: "See confidence, fit, topic coverage, and clear recommendations after every session." },
];

const steps = [
  ["01", "Add your context", "Upload a PDF or DOCX resume and paste the role description."],
  ["02", "Take the interview", "Answer thoughtful, adaptive questions in a focused workspace."],
  ["03", "Close the gaps", "Turn your report into a practical plan for the real interview."],
];

export default function LandingPage() {
  return (
    <PageTransition>
      <Navbar />
      <main className="overflow-hidden pt-28">
        <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:pt-24 lg:pb-32">
          <div className="absolute left-1/2 top-10 -z-10 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-100/90 to-emerald-100/25 blur-3xl dark:from-sky-500/10 dark:to-transparent" />
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-900/[0.08] bg-white/78 px-3.5 py-2 text-xs font-medium text-ink-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300">
              <Sparkles className="size-3.5" /> Your sharpest interview starts before the call
            </motion.div>
            <h1 className="text-balance text-5xl font-medium leading-[1.03] tracking-[-0.055em] text-ink-950 sm:text-7xl lg:text-[88px] dark:text-white">
              Practice with an interviewer that <span className="text-emerald-600 dark:text-emerald-300">pays attention.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-8 text-ink-500 sm:text-xl dark:text-ink-400">
              HIREMIND turns your resume and target role into a focused, adaptive mock interview—with feedback you can actually use.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/upload"><Button size="lg">Start a mock interview <ArrowRight className="size-4" /></Button></Link>
              <Link to="/app"><Button size="lg" variant="outline">View dashboard</Button></Link>
            </div>
            <p className="mt-4 text-xs text-ink-400">No account required · PDF and DOCX supported</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.65 }} className="glass relative mx-auto mt-16 max-w-5xl rounded-[32px] p-2 sm:p-3">
            <div className="overflow-hidden rounded-[25px] border border-slate-900/[0.07] bg-ink-50 dark:border-white/[0.08] dark:bg-ink-950">
              <div className="flex h-12 items-center gap-2 border-b border-slate-900/[0.06] px-5 dark:border-white/[0.07]">
                <span className="size-2 rounded-full bg-sky-300 dark:bg-sky-700" /><span className="size-2 rounded-full bg-amber-300 dark:bg-amber-700" /><span className="size-2 rounded-full bg-emerald-300 dark:bg-emerald-700" />
                <span className="ml-3 text-[11px] text-ink-400">Live interview workspace</span>
              </div>
              <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_280px]">
                <div className="rounded-2xl bg-gradient-to-br from-ink-950 via-slate-900 to-slate-800 p-6 text-white dark:from-white dark:via-slate-50 dark:to-slate-100 dark:text-ink-950">
                  <div className="mb-10 flex items-center justify-between text-xs opacity-60"><span>QUESTION 04</span><span>System Design</span></div>
                  <p className="max-w-2xl text-xl font-medium leading-relaxed sm:text-2xl">How would you design a notification service that remains reliable during sudden traffic spikes?</p>
                  <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.08] p-4 text-sm text-white/70 dark:border-black/10 dark:bg-black/[0.04] dark:text-ink-500">Structure your answer here…</div>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {[["Confidence", "78%", 78], ["Resume match", "86%", 86]].map(([label, value, progress]) => (
                    <div key={String(label)} className="rounded-2xl border border-slate-900/[0.06] bg-white/72 p-4 dark:border-white/[0.08] dark:bg-white/[0.04]">
                      <p className="text-xs text-ink-500">{label}</p><p className="mb-4 mt-1 text-2xl font-medium">{value}</p><Progress value={Number(progress)} />
                    </div>
                  ))}
                  <div className="col-span-2 hidden items-center gap-3 rounded-2xl border border-slate-900/[0.06] bg-white/72 p-4 text-sm lg:flex dark:border-white/[0.08] dark:bg-white/[0.04]"><span className="flex size-8 items-center justify-center rounded-full bg-ink-100 dark:bg-white/8"><Zap className="size-4" /></span>Adapts after every answer</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24">
          <div className="max-w-2xl"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Designed for deliberate practice</p><h2 className="text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Less generic advice. More signal.</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.div key={title} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="h-full p-6 sm:p-7">
                  <span className="mb-12 flex size-11 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]"><Icon className="size-5" /></span>
                  <p className="mb-2 text-xs text-ink-400">0{index + 1}</p><h3 className="text-lg font-medium">{title}</h3><p className="mt-3 text-sm leading-6 text-ink-500 dark:text-ink-400">{text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">How it works</p><h2 className="text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">From résumé to readiness in one focused loop.</h2><p className="mt-5 max-w-lg text-base leading-7 text-ink-500 dark:text-ink-400">A calm practice space that asks better questions, adapts, and leaves you with a clearer next move.</p></div>
            <div className="space-y-3">
              {steps.map(([number, title, text]) => (
                <Card key={number} className="flex gap-5 p-5 sm:items-center sm:p-6"><span className="font-mono text-xs text-ink-400">{number}</span><div className="flex-1"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-400">{text}</p></div><Check className="hidden size-4 text-ink-400 sm:block" /></Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24">
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-ink-950 via-slate-900 to-slate-800 px-6 py-16 text-center text-white sm:px-12 sm:py-24 dark:from-white dark:via-slate-50 dark:to-slate-100 dark:text-ink-950">
            <div className="absolute left-1/2 top-0 h-56 w-2/3 -translate-x-1/2 rounded-full bg-white/10 blur-3xl dark:bg-black/[0.06]" />
            <Target className="relative mx-auto mb-6 size-7 opacity-60" /><h2 className="relative text-balance text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Your next interview should feel familiar.</h2><p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-white/55 dark:text-ink-500">Practice the pressure, find the gaps, and walk into the real conversation with evidence—not guesswork.</p><Link to="/upload" className="relative mt-8 inline-block"><Button size="lg" className="bg-white text-ink-950 hover:bg-ink-100 dark:bg-ink-950 dark:text-white dark:hover:bg-ink-800">Start practicing <ArrowRight className="size-4" /></Button></Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-slate-900/[0.07] px-5 py-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]"><span>© {new Date().getFullYear()} HIREMIND</span><span>Focused practice. Clearer outcomes.</span></footer>
    </PageTransition>
  );
}
