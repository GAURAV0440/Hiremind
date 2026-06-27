import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/page-transition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/feedback";
import { useInterview } from "../context/interview-context";
import { formatDate } from "../utils/report";

export default function ReportsPage() {
  const { reports } = useInterview();
  return (
    <PageTransition>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Performance archive</p><h1 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Reports</h1><p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Review completed interviews and recurring signals.</p></div><Link to="/upload"><Button>New interview <ArrowRight className="size-4" /></Button></Link></div>
      {reports.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{reports.map((report) => <Link key={report.id} to={`/report/${report.id}`}><Card className="group h-full p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(15,23,42,.1)]"><div className="mb-10 flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/[0.07]"><FileText className="size-[18px]" /></span><Badge>{report.recommendation}</Badge></div><h2 className="text-lg font-medium">{report.candidateCategory || "Interview report"}</h2><p className="mt-1 text-xs text-ink-400">{formatDate(report.createdAt)} · {report.interviewDifficulty}</p><div className="mt-6 flex items-end justify-between border-t border-slate-900/[0.06] pt-5 dark:border-white/[0.07]"><div><p className="text-xs text-ink-400">Average score</p><p className="mt-1 text-xl font-medium">{report.averageScore.toFixed(1)}<span className="text-xs text-ink-400"> / 10</span></p></div><ArrowRight className="size-4 text-ink-400 transition-transform group-hover:translate-x-1" /></div></Card></Link>)}</div> : <Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center"><span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]"><FileText className="size-5" /></span><h2 className="text-lg font-medium">Your report archive is empty</h2><p className="mt-2 max-w-sm text-sm leading-6 text-ink-500 dark:text-ink-400">Complete an adaptive interview to generate your first performance report.</p><Link to="/upload" className="mt-6"><Button>Start interview <ArrowRight className="size-4" /></Button></Link></Card>}
    </PageTransition>
  );
}
