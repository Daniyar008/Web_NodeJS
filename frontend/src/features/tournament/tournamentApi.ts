import type { AxiosResponse } from "axios";
import { api } from "../../lib/api";

export interface TournamentUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Tournament {
  id: string;
  title: string;
  description: string | null;
  status: "UPCOMING" | "ACTIVE" | "FINISHED";
  startsAt: string;
  endsAt: string;
  maxScore: number;
  createdBy: TournamentUser;
  _count: { participants: number };
}

export interface TournamentDetail extends Tournament {
  participants: { id: string; userId: string; joinedAt: string; user: TournamentUser }[];
  results: { id: string; userId: string; score: number; rank: number | null; user: TournamentUser }[];
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  user: TournamentUser;
}

export interface CreateTournamentPayload {
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  maxScore?: number;
}

export interface UpdateTournamentPayload {
  title?: string;
  description?: string;
  status?: "UPCOMING" | "ACTIVE" | "FINISHED";
  startsAt?: string;
  endsAt?: string;
  maxScore?: number;
}

export const tournamentApi = {
  list: () => api.get<Tournament[]>("/tournaments").then((r: AxiosResponse<Tournament[]>) => r.data),
  get: (id: string) =>
    api.get<TournamentDetail>(`/tournaments/${id}`).then((r: AxiosResponse<TournamentDetail>) => r.data),
  leaderboard: (id: string) =>
    api
      .get<LeaderboardEntry[]>(`/tournaments/${id}/leaderboard`)
      .then((r: AxiosResponse<LeaderboardEntry[]>) => r.data),
  create: (payload: CreateTournamentPayload) =>
    api.post<Tournament>("/tournaments", payload).then((r: AxiosResponse<Tournament>) => r.data),
  update: (id: string, payload: UpdateTournamentPayload) =>
    api.patch<Tournament>(`/tournaments/${id}`, payload).then((r: AxiosResponse<Tournament>) => r.data),
  remove: (id: string) => api.delete(`/tournaments/${id}`),
  join: (id: string) => api.post(`/tournaments/${id}/join`).then((r: AxiosResponse<unknown>) => r.data),
  leave: (id: string) => api.delete(`/tournaments/${id}/leave`),
  submitScore: (id: string, score: number) =>
    api.post(`/tournaments/${id}/score`, { score }).then((r: AxiosResponse<unknown>) => r.data),
};
