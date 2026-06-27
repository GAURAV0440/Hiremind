import { ArrowLeft, ArrowRight, LockKeyhole, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "../components/logo";
import { PageTransition } from "../components/page-transition";
import { ThemeSwitch } from "../components/theme-switch";
import { UploadArea } from "../components/upload-area";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Spinner } from "../components/ui/feedback";
import { Textarea } from "../components/ui/form-controls";
import { useInterview } from "../context/interview-context";

interface UploadForm { jobDescription: string }

export default function UploadPage() {
  const navigate = useNavigate();
  const { startInterview, isStarting, session, resetInterview } = useInterview();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<UploadForm>();

  const selectFile = (next: File | null) => {
    setFileError("");
    if (next && !next.name.toLowerCase().match(/\.(pdf|docx)$/)) {
      setFileError("Choose a PDF or DOCX file.");
      return;
    }
    setFile(next);
  };

  const onSubmit = handleSubmit(async ({ jobDescription }) => {
    if (!file) {
      setFileError("Add your resume to continue.");
      return;
    }
    try {
      if (session) resetInterview();
      await startInterview(file, jobDescription.trim());
      toast.success("Your interview is ready");
      navigate("/interview");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the interview.");
    }
  });

  return (
    <PageTransition className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5"><Logo /><ThemeSwitch /></header>
      <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 pt-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:pt-16">
        <section className="lg:sticky lg:top-12">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-500 transition hover:text-ink-950 dark:text-ink-400 dark:hover:text-white"><ArrowLeft className="size-4" /> Back home</Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Personalize your session</p>
          <h1 className="text-balance text-4xl font-medium tracking-[-0.045em] sm:text-5xl">Let’s build an interview around you.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-ink-500 dark:text-ink-400">Your resume grounds the questions in real experience. A job description makes the session even more targeted.</p>
          <div className="mt-9 space-y-4 text-sm text-ink-500 dark:text-ink-400">
            <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/[0.06]"><WandSparkles className="size-4" /></span>Adaptive questions based on your answers</div>
            <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-ink-100 dark:bg-white/[0.06]"><LockKeyhole className="size-4" /></span>Focused only on interview preparation</div>
          </div>
        </section>

        <Card className="p-5 sm:p-8">
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-8"><div className="mb-3 flex items-baseline justify-between"><label className="text-sm font-medium">Resume</label><span className="text-xs text-ink-400">Required</span></div><UploadArea file={file} onFileChange={selectFile} error={fileError} /></div>
            <div><div className="mb-3 flex items-baseline justify-between"><label htmlFor="jobDescription" className="text-sm font-medium">Job description</label><span className="text-xs text-ink-400">Recommended</span></div>
              <Textarea id="jobDescription" className="min-h-48" placeholder="Paste the role, responsibilities, and required skills…" aria-invalid={Boolean(errors.jobDescription)} {...register("jobDescription", { maxLength: { value: 12_000, message: "Keep the description under 12,000 characters." } })} />
              {errors.jobDescription && <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{errors.jobDescription.message}</p>}
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-900/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
              <p className="text-xs text-ink-400">Analysis can take a moment.</p>
              <Button type="submit" size="lg" disabled={isStarting}>{isStarting ? <><Spinner /> Preparing interview…</> : <>Start interview <ArrowRight className="size-4" /></>}</Button>
            </div>
          </form>
        </Card>
      </main>
    </PageTransition>
  );
}
