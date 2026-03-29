import type { AxiosResponse } from "axios";
import { api } from "../../lib/api";

export interface UserPublic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChildProgress {
  profile: { xp: number; level: number; streak: number } | null;
  courses: {
    id: string;
    title: string;
    status: string;
    lessonsTotal: number;
    lessonsDone: number;
    percent: number;
  }[];
  recentSubmissions: {
    id: string;
    score: number | null;
    feedback: string | null;
    submittedAt: string;
    assignment: { title: string; maxScore: number };
  }[];
  recentAttempts: {
    id: string;
    score: number;
    passed: boolean;
    completedAt: string;
    test: { title: string; passingScore: number };
  }[];
}

export interface ParentGoal {
  id: string;
  title: string;
  description: string | null;
  targetXp: number;
  reward: string | null;
  achieved: boolean;
  achievedAt: string | null;
  studentId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  readAt: string | null;
  createdAt: string;
  sender: UserPublic;
}

export const parentApi = {
  // children
  getChildren: () =>
    api.get<UserPublic[]>("/parent/children").then((r: AxiosResponse<UserPublic[]>) => r.data),
  linkStudent: (studentId: string) =>
    api.post("/parent/children", { studentId }).then((r: AxiosResponse<unknown>) => r.data),
  unlinkStudent: (studentId: string) => api.delete(`/parent/children/${studentId}`),

  // progress
  getProgress: (studentId: string) =>
    api
      .get<ChildProgress>(`/parent/children/${studentId}/progress`)
      .then((r: AxiosResponse<ChildProgress>) => r.data),

  // goals
  listGoals: (studentId: string) =>
    api
      .get<ParentGoal[]>(`/parent/children/${studentId}/goals`)
      .then((r: AxiosResponse<ParentGoal[]>) => r.data),
  createGoal: (payload: {
    studentId: string;
    title: string;
    description?: string;
    targetXp?: number;
    reward?: string;
  }) =>
    api.post<ParentGoal>("/parent/goals", payload).then((r: AxiosResponse<ParentGoal>) => r.data),
  updateGoal: (id: string, payload: Partial<{ title: string; targetXp: number; reward: string; achieved: boolean }>) =>
    api.patch<ParentGoal>(`/parent/goals/${id}`, payload).then((r: AxiosResponse<ParentGoal>) => r.data),
  deleteGoal: (id: string) => api.delete(`/parent/goals/${id}`),
  checkGoals: (studentId: string) =>
    api
      .post<ParentGoal[]>(`/parent/children/${studentId}/goals/check`)
      .then((r: AxiosResponse<ParentGoal[]>) => r.data),

  // messaging
  listTeachers: () =>
    api.get<UserPublic[]>("/parent/teachers").then((r: AxiosResponse<UserPublic[]>) => r.data),
  listConversations: () =>
    api.get<UserPublic[]>("/parent/messages").then((r: AxiosResponse<UserPublic[]>) => r.data),
  getMessages: (partnerId: string) =>
    api
      .get<Message[]>(`/parent/messages/${partnerId}`)
      .then((r: AxiosResponse<Message[]>) => r.data),
  sendMessage: (receiverId: string, content: string) =>
    api
      .post<Message>("/parent/messages", { receiverId, content })
      .then((r: AxiosResponse<Message>) => r.data),
};
