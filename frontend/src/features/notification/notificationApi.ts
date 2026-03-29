import type { AxiosResponse } from "axios";

import { api } from "../../lib/api";

export type NotificationItem = {
  id: string;
  type: "CHAT_MESSAGE" | "ASSIGNMENT" | "TOURNAMENT" | "SYSTEM";
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  deliveredAt: string | null;
  createdAt: string;
};

export type NotificationPreference = {
  id: string;
  userId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  chatEnabled: boolean;
  courseEnabled: boolean;
  systemEnabled: boolean;
  updatedAt: string;
};

export const notificationApi = {
  list: (params?: { unreadOnly?: boolean; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.unreadOnly !== undefined) search.set("unreadOnly", String(params.unreadOnly));
    if (params?.limit !== undefined) search.set("limit", String(params.limit));
    const query = search.toString();
    return api
      .get<NotificationItem[]>(`/notifications${query ? `?${query}` : ""}`)
      .then((response: AxiosResponse<NotificationItem[]>) => response.data);
  },
  unreadCount: () =>
    api.get<{ count: number }>("/notifications/unread-count").then((response: AxiosResponse<{ count: number }>) => response.data),
  markRead: (id: string) =>
    api.post<NotificationItem>(`/notifications/${id}/read`).then((response: AxiosResponse<NotificationItem>) => response.data),
  markAllRead: () => api.post("/notifications/read-all"),
  preferences: () =>
    api.get<NotificationPreference>("/notifications/preferences").then((response: AxiosResponse<NotificationPreference>) => response.data),
  updatePreferences: (payload: Partial<Omit<NotificationPreference, "id" | "userId" | "updatedAt">>) =>
    api.patch<NotificationPreference>("/notifications/preferences", payload).then((response: AxiosResponse<NotificationPreference>) => response.data),
};
