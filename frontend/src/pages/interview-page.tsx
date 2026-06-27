import { ArrowLeft, ArrowRight, CheckCircle2, Gauge, Target, Trophy } from "lucide-react";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "../components/logo";
import { PageTransition } from "../components/page-transition";
import { QuestionCard } from "../components/question-card";
import { ThemeSwitch } from "../components/theme-switch";
import { VoiceWave } from "../components/voice-wave";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge, Progress, Spinner } from "../components/ui/feedback";
import { Textarea } from "../components/ui/form-controls";
import { useInterview } from "../context/interview-context";
import { useSpeechInterview } from "../hooks/use-speech-interview";

interface AnswerForm { answer: string }

export default function InterviewPage() {
  const navigate = useNavigate();
  const { session, currentReport, reports, isSubmitting, submitAnswer, advanceQuestion } = useInterview();
  const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm<AnswerForm>();
  const transcriptBaseRef = useRef("");
  const handleTranscript = useCallback((transcript: string) => {
    const answer = [transcriptBaseRef.current, transcript].filter(Boolean).join(" ").replace(/\s+/g, " ");
    setValue("answer", answer, { shouldDirty: true, shouldValidate: true });
  }, [setValue]);
  const voice = useSpeechInterview({
    question: session?.currentQuestion ?? "",
    questionKey: session?.questionNumber ?? 0,
    thinking: isSubmitting,
    onTranscript: handleTranscript,
  });

  if (!session) {
    const latestReport = currentReport ?? reports[0];
    return <Navigate to={latestReport ? `/report/${latestReport.id}` : "/upload"} replace />;
  }

  const startListening = () => {
    transcriptBaseRef.current = getValues("answer").trim();
    voice.startListening();
  };

  const onSubmit = handleSubmit(async ({ answer }) => {
    voice.stop();
    try {
      const finished = await submitAnswer(answer.trim());
      reset();
      if (finished.finished) {
        toast.success(finished.report ? "Interview complete — here’s your report" : "Interview complete");
        navigate(finished.report ? `/report/${finished.report.id}` : "/report", {
          replace: true,
          state: { report: finished.report },
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your answer.");
    }
  });

  return (
    <PageTransition className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5"><Logo /><div className="flex items-center gap-3"><Badge className="hidden sm:inline-flex">Session in progress</Badge><ThemeSwitch /></div></header>
      <main className="mx-auto max-w-7xl px-5 pb-12 pt-5">
        <div className="mb-6 flex items-center justify-between"><Link to="/upload" className="inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"><ArrowLeft className="size-4" /> Exit interview</Link><span className="text-xs text-ink-400">Question {session.questionNumber}</span></div>
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <section className="space-y-5">
            <QuestionCard topic={session.currentTopic} question={session.currentQuestion} number={session.questionNumber} />

            {session.pendingQuestion && session.feedback ? (
              <Card className="p-6 sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div><div className="mb-3 flex items-center gap-2"><CheckCircle2 className="size-4" /><h2 className="font-medium">Answer reviewed</h2></div><p className="max-w-xl text-sm leading-6 text-ink-500 dark:text-ink-400">Your response scored <strong className="text-ink-900 dark:text-white">{session.feedback.score.toFixed(1)}/10</strong>. The next question is ready when you are.</p></div>
                  <Button onClick={advanceQuestion}>Next question <ArrowRight className="size-4" /></Button>
                </div>
                {(session.feedback.strengths.length > 0 || session.feedback.weaknesses.length > 0) && <div className="mt-6 grid gap-3 border-t border-slate-900/[0.07] pt-5 sm:grid-cols-2 dark:border-white/[0.08]">
                  <div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-400">Strong signal</p><p className="text-sm text-ink-600 dark:text-ink-300">{session.feedback.strengths[0] ?? "Clear response structure"}</p></div>
                  <div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-400">Sharpen next</p><p className="text-sm text-ink-600 dark:text-ink-300">{session.feedback.weaknesses[0] ?? "Add specific examples"}</p></div>
                </div>}
              </Card>
            ) : (
              <Card className="p-5 sm:p-7">
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-3 flex items-center justify-between"><label htmlFor="answer" className="text-sm font-medium">Your answer</label><span className="text-xs text-ink-400">Be specific and concise</span></div>
                  <Textarea id="answer" className="min-h-64 text-base leading-7" placeholder="Walk through your thinking, decisions, and tradeoffs…" aria-invalid={Boolean(errors.answer)} {...register("answer", { required: "Write an answer before submitting.", minLength: { value: 10, message: "Add a little more detail before submitting." } })} />
                  {errors.answer && <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{errors.answer.message}</p>}
                  <div className="mt-5 flex justify-end"><Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <><Spinner /> Evaluating answer…</> : <>Submit answer <ArrowRight className="size-4" /></>}</Button></div>
                </form>
              </Card>
            )}
          </section>

          <aside className="space-y-4">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
              <Card className="p-5"><div className="mb-4 flex items-center justify-between"><span className="text-xs text-ink-500 dark:text-ink-400">Interview confidence</span><Gauge className="size-4 text-ink-400" /></div><p className="mb-4 text-3xl font-medium tracking-tight">{Math.round(session.confidence)}%</p><Progress value={session.confidence} label="Interview confidence" /></Card>
              <Card className="p-5"><div className="mb-4 flex items-center justify-between"><span className="text-xs text-ink-500 dark:text-ink-400">Resume match</span><Target className="size-4 text-ink-400" /></div><p className="mb-4 text-3xl font-medium tracking-tight">{Math.round(session.resumeMatchScore)}%</p><Progress value={session.resumeMatchScore} label="Resume match" /></Card>
            </div>
            <Card className="p-5"><div className="mb-4 flex items-center gap-2"><Trophy className="size-4 text-ink-400" /><h2 className="text-sm font-medium">Voice interview</h2></div><p className="text-xs leading-5 text-ink-400">Speak your answer or replay the current question. Transcription stays editable before you submit.</p><VoiceWave state={voice.state} muted={voice.muted} recognitionSupported={voice.recognitionSupported} synthesisSupported={voice.synthesisSupported} error={voice.error} onStart={startListening} onStop={voice.stop} onReplay={voice.replay} onToggleMute={voice.toggleMute} /></Card>
          </aside>
        </div>
      </main>
    </PageTransition>
  );
}
