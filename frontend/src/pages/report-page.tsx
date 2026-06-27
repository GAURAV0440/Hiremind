import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileText,
  Gauge,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Logo } from "../components/logo";
import { MarkdownReport } from "../components/markdown-report";
import { MetricChart } from "../components/metric-chart";
import { PageTransition } from "../components/page-transition";
import { ThemeSwitch } from "../components/theme-switch";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/feedback";
import { useInterview } from "../context/interview-context";
import type { QuestionReview, ReportData } from "../types/interview";
import { formatDate } from "../utils/report";

interface ReportRouteState {
  report?: ReportData | null;
}

function display(value: string | number | null | undefined, fallback = "Not specified") {
  if (typeof value === "number") return Number.isFinite(value) ? value.toString() : fallback;
  return value?.toString().trim() || fallback;
}

function score(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)} / 10` : "Not provided";
}

function percent(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}%` : "Not provided";
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  featured,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  featured?: boolean;
}) {
  return (
    <Card
      className={
        featured
          ? "border-ink-900/15 bg-ink-100/90 p-5 text-ink-950 shadow-[0_14px_45px_rgba(15,23,42,.075)] dark:border-white/15 dark:bg-white/[0.085] dark:text-white"
          : "p-5"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <p className={featured ? "text-xs font-medium text-ink-600 dark:text-ink-300" : "text-xs text-ink-500 dark:text-ink-400"}>{label}</p>
        <Icon className={featured ? "size-5 text-ink-500 dark:text-ink-300" : "size-5 text-ink-400"} />
      </div>
      <p className="mt-5 text-xl font-medium leading-tight tracking-[-0.02em]">{value}</p>
    </Card>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.06]">
        <Icon className="size-4 text-ink-500 dark:text-ink-300" />
      </span>
      <div>
        <h2 className="font-medium tracking-[-0.01em]">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-400">{description}</p>}
      </div>
    </div>
  );
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="text-sm leading-6 text-ink-400">{empty}</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex gap-3 rounded-2xl bg-slate-900/[0.025] p-3.5 text-sm leading-6 text-ink-600 dark:bg-white/[0.035] dark:text-ink-300"
        >
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-700 dark:bg-ink-300" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function QuestionReviewCard({ review, index }: { review: QuestionReview; index: number }) {
  return (
    <details
      className="group rounded-3xl border border-slate-900/[0.07] bg-white/68 p-5 shadow-[0_14px_45px_rgba(15,23,42,.045)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/84 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
      open={index === 0}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{review.title || `Question ${index + 1}`}</h3>
            {review.topic && <Badge>{review.topic}</Badge>}
            <Badge>{score(review.score)}</Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-500 dark:text-ink-400">
            {display(review.question, "Question text not available.")}
          </p>
        </div>
        <ChevronDown className="mt-1 size-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-5 grid gap-4 border-t border-slate-900/[0.07] pt-5 dark:border-white/[0.08]">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Question</p>
          <p className="text-sm leading-6 text-ink-700 dark:text-ink-200">{display(review.question, "Question text not available.")}</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Candidate answer</p>
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-900/[0.025] p-4 text-sm leading-7 text-ink-600 dark:bg-white/[0.035] dark:text-ink-300">
            {display(review.answer, "Candidate answer not available.")}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Strengths</p>
            <BulletList items={review.strengths} empty="No strengths were returned for this question." />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Weaknesses</p>
            <BulletList items={review.weaknesses} empty="No weaknesses were returned for this question." />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Improvement advice</p>
            <BulletList items={review.improvementAdvice} empty="No improvement advice was returned for this question." />
          </div>
        </div>
      </div>
    </details>
  );
}

function RoadmapColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl bg-slate-900/[0.025] p-5 dark:bg-white/[0.035]">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-4">
        <BulletList items={items} empty="No roadmap items were returned." />
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { reportId } = useParams();
  const location = useLocation();
  const { currentReport, reports } = useInterview();
  const routeReport = (location.state as ReportRouteState | null)?.report ?? null;
  const report = routeReport ?? (reportId ? reports.find((item) => item.id === reportId) : currentReport ?? reports[0]);

  if (!report) {
    return (
      <PageTransition className="min-h-screen">
        <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Logo />
          <ThemeSwitch />
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center px-5 pb-16">
          <Card className="w-full p-8 text-center sm:p-10">
            <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-white/[0.07]">
              <FileText className="size-5 text-ink-500 dark:text-ink-300" />
            </span>
            <h1 className="text-2xl font-medium tracking-[-0.03em]">Interview report not available.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-400">
              The interview finished, but the backend did not return a report payload that this page can display.
            </p>
            <Link to="/upload" className="mt-7 inline-flex">
              <Button>Start New Interview <ArrowRight className="size-4" /></Button>
            </Link>
          </Card>
        </main>
      </PageTransition>
    );
  }

  const chartData = [
    { name: "Interview", value: Math.min(report.averageScore * 10, 100) },
    { name: "Resume fit", value: report.resumeMatchScore },
    { name: "Confidence", value: report.interviewConfidence },
  ];

  return (
    <PageTransition className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Logo />
        <ThemeSwitch />
      </header>
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-5">
        <motion.div
          className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <Link
              to="/app/reports"
              className="mb-7 inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"
            >
              <ArrowLeft className="size-4" /> All reports
            </Link>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
              Interview complete · {formatDate(report.createdAt)}
            </p>
            <h1 className="text-4xl font-medium tracking-[-0.045em] sm:text-5xl">Recruiter-ready interview report</h1>
          </div>
          <Link to="/upload">
            <Button>Start New Interview <ArrowRight className="size-4" /></Button>
          </Link>
        </motion.div>

        <section aria-labelledby="overall-summary">
          <SectionHeader
            icon={Brain}
            title="Overall Summary"
            description="A concise hiring snapshot from the completed interview and resume match signals."
          />
          <div id="overall-summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Candidate Category" value={display(report.candidateCategory)} icon={Brain} />
            <SummaryCard label="Candidate Level" value={display(report.candidateLevel)} icon={UserRound} />
            <SummaryCard label="Interview Difficulty" value={display(report.interviewDifficulty)} icon={Gauge} />
            <SummaryCard label="Average Score" value={score(report.averageScore)} icon={Award} />
            <SummaryCard label="Resume Match" value={percent(report.resumeMatchScore)} icon={Target} />
            <SummaryCard label="Interview Confidence" value={percent(report.interviewConfidence)} icon={Activity} />
            <SummaryCard label="Hiring Recommendation" value={display(report.recommendation, "Review complete")} icon={CheckCircle2} featured />
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-5 sm:p-7">
            <SectionHeader icon={Gauge} title="Performance Overview" description="Normalized scores across core interview signals." />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -18, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-900/[0.06] dark:text-white/[0.07]" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: "currentColor", opacity: 0.04 }}
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid rgba(120,120,115,.15)",
                      background: "var(--color-ink-950)",
                      color: "white",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="currentColor" className="text-ink-900 dark:text-ink-100" radius={[7, 7, 2, 2]} maxBarSize={58} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="grid grid-cols-2 items-center p-4 sm:p-6">
            <MetricChart value={report.resumeMatchScore} label="Resume match" />
            <MetricChart value={report.interviewConfidence} label="Confidence" />
          </Card>
        </div>

        <section className="mt-8" aria-labelledby="question-review">
          <SectionHeader
            icon={ListChecks}
            title="Question-by-Question Review"
            description="Each interview response separated into an expandable recruiter review card."
          />
          <div id="question-review" className="space-y-4">
            {report.questionReviews.length ? (
              report.questionReviews.map((review, index) => (
                <QuestionReviewCard key={`${review.title}-${index}`} review={review} index={index} />
              ))
            ) : (
              <Card className="p-6">
                <p className="text-sm leading-6 text-ink-500 dark:text-ink-400">
                  The backend report did not include structured question-by-question details. The full Markdown report is still available below.
                </p>
              </Card>
            )}
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHeader icon={CheckCircle2} title="Technical Strengths" />
            <BulletList items={report.strengths} empty="No structured technical strengths were returned." />
          </Card>
          <Card className="p-6">
            <SectionHeader icon={CircleAlert} title="Areas to Improve" />
            <BulletList items={report.weaknesses} empty="No structured improvement areas were returned." />
          </Card>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <SectionHeader icon={Target} title="Topics Covered" />
            <div className="flex flex-wrap gap-2">
              {report.topicsCovered.length ? (
                report.topicsCovered.map((topic) => <Badge key={topic}>{topic}</Badge>)
              ) : (
                <span className="text-sm text-ink-400">Topic details were not returned.</span>
              )}
            </div>
          </Card>
          <Card className="p-6">
            <SectionHeader icon={Lightbulb} title="Missing Skills" description="Job description skills not demonstrated strongly during the mock interview." />
            <BulletList items={report.missingSkills} empty="No missing Job Description skills were returned." />
          </Card>
        </div>

        <section className="mt-8" aria-labelledby="learning-roadmap">
          <SectionHeader icon={GraduationCap} title="Personalized Learning Roadmap" />
          <Card id="learning-roadmap" className="grid gap-4 p-4 md:grid-cols-3 sm:p-6">
            <RoadmapColumn title="Immediate Improvements" items={report.roadmap.immediate} />
            <RoadmapColumn title="Short-Term Learning" items={report.roadmap.shortTerm} />
            <RoadmapColumn title="Long-Term Learning" items={report.roadmap.longTerm} />
          </Card>
        </section>

        <section className="mt-8" aria-labelledby="full-ai-report">
          <SectionHeader
            icon={BookOpen}
            title="Full AI Report"
            description="Complete Markdown report returned by the backend, rendered without requiring another API call."
          />
          <Card id="full-ai-report" className="p-6 sm:p-8">
            <MarkdownReport>{report.rawReport}</MarkdownReport>
          </Card>
        </section>
      </main>
    </PageTransition>
  );
}
