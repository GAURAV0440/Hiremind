export interface ResumeUploadResponse {
  message: string;
  filename: string;
  resume_path: string;
  characters: number;
  resume_text: string;
}

export interface StartInterviewRequest {
  resume_path: string;
  job_description: string;
}

export interface StartInterviewResponse {
  session_id: string;
  candidate_category: string;
  resume_match_score: number;
  current_topic: string;
  question: string;
}

export interface AnswerRequest {
  session_id: string;
  answer: string;
}

export interface ContinueInterviewResponse {
  interview_finished: false;
  current_topic: string;
  score: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  next_action: string;
  next_question: string;
}

export interface FinishedInterviewResponse {
  interview_finished: true;
  average_score: number;
  resume_match_score: number;
  interview_confidence: number;
  report: string;
}

export type AnswerResponse = ContinueInterviewResponse | FinishedInterviewResponse;

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  nextAction: string;
}

export interface InterviewSession {
  sessionId: string;
  candidateCategory: string;
  resumeMatchScore: number;
  confidence: number;
  currentTopic: string;
  currentQuestion: string;
  pendingTopic: string | null;
  pendingQuestion: string | null;
  questionNumber: number;
  topics: string[];
  strengths: string[];
  weaknesses: string[];
  questionHistory?: QuestionReview[];
  feedback: InterviewFeedback | null;
}

export interface QuestionReview {
  title: string;
  topic?: string;
  question: string;
  answer: string;
  score: number | null;
  strengths: string[];
  weaknesses: string[];
  improvementAdvice: string[];
}

export interface LearningRoadmap {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface ReportData {
  id: string;
  createdAt: string;
  candidateCategory: string;
  candidateLevel: string;
  interviewDifficulty: string;
  averageScore: number;
  resumeMatchScore: number;
  interviewConfidence: number;
  topicsCovered: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  questionReviews: QuestionReview[];
  roadmap: LearningRoadmap;
  recommendation: string;
  rawReport: string;
}
