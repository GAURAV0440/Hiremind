import { api } from "./api";
import type {
  AnswerRequest,
  AnswerResponse,
  ResumeUploadResponse,
  StartInterviewRequest,
  StartInterviewResponse,
} from "../types/interview";

export const interviewService = {
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<ResumeUploadResponse>("/resume/upload", form);
    return data;
  },

  async startInterview(payload: StartInterviewRequest): Promise<StartInterviewResponse> {
    const { data } = await api.post<StartInterviewResponse>("/interview/start", payload);
    return data;
  },

  async submitAnswer(payload: AnswerRequest): Promise<AnswerResponse> {
    const { data } = await api.post<AnswerResponse>("/interview/answer", payload);
    return data;
  },
};
