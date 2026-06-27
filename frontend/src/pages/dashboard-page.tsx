import { ArrowRight, BarChart3, Clock3, FilePlus2, Sparkles, Target, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "../components/page-transition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/feedback";
import { useInterview } from "../context/interview-context";
import { formatDate } from "../utils/report";

export default function DashboardPage() {
  const { reports, session } = useInterview();
  const average = reports.length ? reports.reduce((sum, report) => sum + report.averageScore, 0) / reports.length : 0;
  const latest = reports[0];
  const stats: Array<{ label: string; value: string; icon: LucideIcon }> = [
    { label: "Completed", value: reports.length.toString(), icon: Clock3 },
    { label: "Average score", value: reports.length ? `${average.toFixed(1)}/10` : "—", icon: BarChart3 },
    { label: "Latest match", value: latest ? `${Math.round(latest.resumeMatchScore)}%` : "—", icon: Target },
    { label: "Confidence", value: latest ? `${Math.round(latest.interviewConfidence)}%` : "—", icon: Sparkles },
  ];

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Workspace</p><h1 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Interview dashboard</h1><p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Track practice, spot patterns, and keep moving.</p></div><Link to={session ? "/interview" : "/upload"}><Button>{session ? "Continue interview" : "New interview"} <ArrowRight className="size-4" /></Button></Link></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => <Card key={label} className="p-5"><div className="flex items-center justify-between"><p className="text-xs text-ink-500 dark:text-ink-400">{label}</p><Icon className="size-4 text-ink-400" /></div><p className="mt-7 text-3xl font-medium tracking-tight">{value}</p></Card>)}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-medium">Recent interviews</h2><p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Your latest completed practice sessions.</p></div>{reports.length > 0 && <Link to="/app/reports" className="text-xs font-medium text-ink-500 hover:text-ink-950 dark:hover:text-white">View all</Link>}</div>
          {reports.length ? <div className="space-y-2">{reports.slice(0, 4).map((report) => <Link key={report.id} to={`/report/${report.id}`} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-transparent p-4 transition hover:border-slate-900/[0.06] hover:bg-slate-900/[0.025] dark:hover:border-white/[0.07] dark:hover:bg-white/[0.03]"><div><p className="text-sm font-medium">{report.candidateCategory || "Candidate interview"}</p><p className="mt-1 text-xs text-ink-400">{formatDate(report.createdAt)} · {report.interviewDifficulty}</p></div><div className="text-right"><p className="text-sm font-medium">{report.averageScore.toFixed(1)}/10</p><p className="mt-1 text-xs text-ink-400">{report.recommendation}</p></div></Link>)}</div> : <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-900/10 text-center dark:border-white/10"><p className="text-sm font-medium">No interviews yet</p><p className="mt-2 max-w-xs text-xs leading-5 text-ink-400">Complete a session and your performance history will appear here.</p></div>}
        </Card>
        <Card className="flex flex-col p-6"><span className="mb-10 flex size-11 items-center justify-center rounded-2xl bg-ink-900 text-white dark:bg-white dark:text-ink-950"><FilePlus2 className="size-5" /></span><h2 className="text-xl font-medium">One focused session beats another hour of vague prep.</h2><p className="mt-3 text-sm leading-6 text-ink-500 dark:text-ink-400">Use a role you care about and answer like it’s the real room.</p><Link to="/upload" className="mt-auto pt-8"><Button variant="outline" className="w-full">Start fresh <ArrowRight className="size-4" /></Button></Link></Card>
      </div>

      {latest && <Card className="mt-4 p-6"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-medium">Latest confidence</p><span className="text-sm">{Math.round(latest.interviewConfidence)}%</span></div><Progress value={latest.interviewConfidence} /></Card>}
    </PageTransition>
  );
}
