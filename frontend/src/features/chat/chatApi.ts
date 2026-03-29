import type { AxiosResponse } from "axios";

import { api } from "../../lib/api";

export type ChatUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ChatMessage = {
  id: string;
  content: string;
  attachmentUrl: string | null;
  chatId: string | null;
  senderId: string;
  receiverId: string;
  readAt: string | null;
  createdAt: string;
  sender: ChatUser;
};

export type ChatSummary = {
  id: string;
  title: string | null;
  type: "DIRECT" | "GROUP";
  participants: ChatUser[];
  lastMessage: ChatMessage | null;
};

export const chatApi = {
  contacts: (search = "") =>
    api
      .get<ChatUser[]>(`/chat/contacts${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then((response: AxiosResponse<ChatUser[]>) => response.data),
  listChats: () => api.get<ChatSummary[]>("/chat/chats").then((response: AxiosResponse<ChatSummary[]>) => response.data),
  createDirectChat: (participantId: string) =>
    api.post<ChatSummary>("/chat/chats", { participantId }).then((response: AxiosResponse<ChatSummary>) => response.data),
  getMessages: (chatId: string) =>
    api.get<ChatMessage[]>(`/chat/chats/${chatId}/messages`).then((response: AxiosResponse<ChatMessage[]>) => response.data),
  sendMessage: (chatId: string, payload: { content: string; attachmentUrl?: string }) =>
    api.post<ChatMessage>(`/chat/chats/${chatId}/messages`, payload).then((response: AxiosResponse<ChatMessage>) => response.data),
  markRead: (chatId: string) => api.post(`/chat/chats/${chatId}/read`),
};
