import type { AxiosResponse } from "axios";

import { api } from "../../lib/api";

export type AiContext = "student" | "teacher" | "parent" | "general";

export type RecommendationItem = {
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
};

export type AiChatResponse = {
  source: "openai" | "fallback";
  answer: string;
};

export type GeneratedQuestion = {
  text: string;
  type: "SINGLE";
  points: number;
  options: Array<{ text: string; isCorrect: boolean }>;
};

export const aiApi = {
  recommendations: (limit = 4) =>
    api
      .get<RecommendationItem[]>(`/ai/recommendations?limit=${limit}`)
      .then((response: AxiosResponse<RecommendationItem[]>) => response.data),
  chat: (message: string, context?: AiContext) =>
    api
      .post<AiChatResponse>("/ai/chat", { message, ...(context ? { context } : {}) })
      .then((response: AxiosResponse<AiChatResponse>) => response.data),
  generateTest: (payload: { topic: string; difficulty: "easy" | "medium" | "hard"; questions: number }) =>
    api
      .post<GeneratedQuestion[]>("/ai/generate-test", payload)
      .then((response: AxiosResponse<GeneratedQuestion[]>) => response.data),
};
