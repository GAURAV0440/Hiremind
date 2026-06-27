import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { interviewService } from "../services/interview.service";
import type { InterviewSession, ReportData } from "../types/interview";
import { createReportData } from "../utils/report";

interface InterviewContextValue {
  session: InterviewSession | null;
  reports: ReportData[];
  currentReport: ReportData | null;
  isStarting: boolean;
  isSubmitting: boolean;
  interviewCompleted: boolean;
  startInterview: (file: File, jobDescription: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<SubmitAnswerOutcome>;
  advanceQuestion: () => void;
  resetInterview: () => void;
}

export type SubmitAnswerOutcome =
  | { finished: false; report: null }
  | { finished: true; report: ReportData | null };

const SESSION_KEY = "hiremind-session";
const REPORTS_KEY = "hiremind-reports";

const InterviewContext = createContext<InterviewContextValue | null>(null);

function readStored<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<InterviewSession | null>(() =>
    readStored<InterviewSession>(SESSION_KEY),
  );
  const [reports, setReports] = useState<ReportData[]>(() =>
    readStored<ReportData[]>(REPORTS_KEY) ?? [],
  );
  const [currentReport, setCurrentReport] = useState<ReportData | null>(() =>
    readStored<ReportData[]>(REPORTS_KEY)?.[0] ?? null,
  );
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const saveSession = useCallback((next: InterviewSession | null) => {
    setSession(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const startInterview = useCallback(
    async (file: File, jobDescription: string) => {
      setIsStarting(true);
      setInterviewCompleted(false);
      try {
        const upload = await interviewService.uploadResume(file);
        const started = await interviewService.startInterview({
          resume_path: upload.resume_path,
          job_description: jobDescription,
        });
        const nextSession: InterviewSession = {
          sessionId: started.session_id,
          candidateCategory: started.candidate_category,
          resumeMatchScore: started.resume_match_score,
          confidence: 0,
          currentTopic: started.current_topic,
          currentQuestion: started.question,
          pendingTopic: null,
          pendingQuestion: null,
          questionNumber: 1,
          topics: [started.current_topic],
          strengths: [],
          weaknesses: [],
          questionHistory: [],
          feedback: null,
        };
        setCurrentReport(null);
        saveSession(nextSession);
      } finally {
        setIsStarting(false);
      }
    },
    [saveSession],
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!session) throw new Error("No active interview session.");
      setIsSubmitting(true);
      try {
        const result = await interviewService.submitAnswer({
          session_id: session.sessionId,
          answer,
        });

        if (result.interview_finished) {
          setInterviewCompleted(true);
          if (!result.report?.trim()) {
            setCurrentReport(null);
            saveSession(null);
            return { finished: true, report: null } as const;
          }
          const report = createReportData(result.report, {
            candidateCategory: session.candidateCategory,
            averageScore: result.average_score,
            resumeMatchScore: result.resume_match_score,
            interviewConfidence: result.interview_confidence,
            topicsCovered: unique([...session.topics, session.currentTopic]),
            strengths: session.strengths,
            weaknesses: session.weaknesses,
            questionReviews: [
              ...(session.questionHistory ?? []),
              {
                title: `Question ${session.questionNumber}`,
                topic: session.currentTopic,
                question: session.currentQuestion,
                answer,
                score: null,
                strengths: [],
                weaknesses: [],
                improvementAdvice: [],
              },
            ],
          });
          const nextReports = [report, ...reports].slice(0, 20);
          setReports(nextReports);
          setCurrentReport(report);
          localStorage.setItem(REPORTS_KEY, JSON.stringify(nextReports));
          saveSession(null);
          return { finished: true, report } as const;
        }

        saveSession({
          ...session,
          confidence: result.confidence,
          pendingTopic: result.current_topic,
          pendingQuestion: result.next_question,
          strengths: unique([...session.strengths, ...result.strengths]),
          weaknesses: unique([...session.weaknesses, ...result.weaknesses]),
          questionHistory: [
            ...(session.questionHistory ?? []),
            {
              title: `Question ${session.questionNumber}`,
              topic: session.currentTopic,
              question: session.currentQuestion,
              answer,
              score: result.score,
              strengths: result.strengths,
              weaknesses: result.weaknesses,
              improvementAdvice: result.next_action ? [result.next_action] : [],
            },
          ],
          feedback: {
            score: result.score,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            nextAction: result.next_action,
          },
        });
        return { finished: false, report: null } as const;
      } finally {
        setIsSubmitting(false);
      }
    },
    [reports, saveSession, session],
  );

  const advanceQuestion = useCallback(() => {
    if (!session?.pendingQuestion || !session.pendingTopic) return;
    saveSession({
      ...session,
      currentQuestion: session.pendingQuestion,
      currentTopic: session.pendingTopic,
      pendingQuestion: null,
      pendingTopic: null,
      questionNumber: session.questionNumber + 1,
      topics: unique([...session.topics, session.pendingTopic]),
      feedback: null,
    });
  }, [saveSession, session]);

  const resetInterview = useCallback(() => {
    saveSession(null);
    setCurrentReport(null);
    setInterviewCompleted(false);
  }, [saveSession]);

  const value = useMemo(
    () => ({
      session,
      reports,
      currentReport,
      isStarting,
      isSubmitting,
      interviewCompleted,
      startInterview,
      submitAnswer,
      advanceQuestion,
      resetInterview,
    }),
    [
      session,
      reports,
      currentReport,
      isStarting,
      isSubmitting,
      interviewCompleted,
      startInterview,
      submitAnswer,
      advanceQuestion,
      resetInterview,
    ],
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) throw new Error("useInterview must be used inside InterviewProvider");
  return context;
}
