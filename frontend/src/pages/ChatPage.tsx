import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { chatApi, type ChatMessage, type ChatSummary, type ChatUser } from "../features/chat/chatApi";

function readToken() {
  return localStorage.getItem("accessToken") ?? "";
}

function readAuth() {
  try {
    const token = readToken();
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { sub?: string };
    return { userId: payload.sub ?? "" };
  } catch {
    return { userId: "" };
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function ChatPage() {
  const { userId } = useMemo(() => readAuth(), []);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [contacts, setContacts] = useState<ChatUser[]>([]);
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState<ChatSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void Promise.all([chatApi.listChats(), chatApi.contacts()]).then(([chatItems, contactItems]) => {
      setChats(chatItems);
      setContacts(contactItems);
    });
  }, []);

  useEffect(() => {
    const socket = io((import.meta.env["VITE_API_URL"] ?? "http://localhost:4000/api").replace(/\/api$/, ""), {
      auth: { token: readToken() },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("chat:message", (message: ChatMessage) => {
      setChats((current) => {
        const existing = current.find((chat) => chat.id === message.chatId);
        if (!existing) return current;
        return current
          .map((chat) => (chat.id === message.chatId ? { ...chat, lastMessage: message } : chat))
          .sort((left, right) => {
            const leftTime = left.lastMessage?.createdAt ?? "";
            const rightTime = right.lastMessage?.createdAt ?? "";
            return rightTime.localeCompare(leftTime);
          });
      });

      setMessages((current) => {
        if (!activeChat || message.chatId !== activeChat.id) return current;
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChat]);

  useEffect(() => {
    if (!activeChat) return;
    socketRef.current?.emit("join:chat", activeChat.id);
    void chatApi.getMessages(activeChat.id).then((items) => {
      setMessages(items);
      void chatApi.markRead(activeChat.id);
    });

    return () => {
      socketRef.current?.emit("leave:chat", activeChat.id);
    };
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void chatApi.contacts(search).then(setContacts);
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [search]);

  async function startChat(contact: ChatUser) {
    const chat = await chatApi.createDirectChat(contact.id);
    setChats((current) => {
      const has = current.some((item) => item.id === chat.id);
      return has ? current : [chat, ...current];
    });
    setActiveChat(chat);
  }

  async function handleSend() {
    if (!activeChat || !draft.trim()) return;
    const message = await chatApi.sendMessage(activeChat.id, {
      content: draft.trim(),
      ...(attachmentUrl.trim() ? { attachmentUrl: attachmentUrl.trim() } : {}),
    });
    setMessages((current) => [...current, message]);
    setChats((current) =>
      current.map((chat) => (chat.id === activeChat.id ? { ...chat, lastMessage: message } : chat))
    );
    setDraft("");
    setAttachmentUrl("");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 shadow-sm">
          <h1 className="heading-font text-2xl font-bold">Сообщения</h1>
          <p className="mt-1 text-sm text-[color:var(--ink-700)]">Запускайте диалоги и получайте ответы в реальном времени.</p>
        </div>

        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Контакты</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по имени или email"
            className="mt-3 w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  void startChat(contact);
                }}
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-left text-sm transition hover:border-[color:var(--brand)]"
              >
                <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
                <p className="text-[color:var(--ink-700)]">{contact.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Чаты</h2>
          <div className="mt-3 space-y-2">
            {chats.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Чатов пока нет.</p>}
            {chats.map((chat) => {
              const partner = chat.participants.find((item) => item.id !== userId) ?? chat.participants[0];
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    activeChat?.id === chat.id
                      ? "border-[color:var(--brand)] bg-[color:var(--paper)]"
                      : "border-[color:var(--line)] bg-white hover:border-[color:var(--brand)]"
                  }`}
                >
                  <p className="font-semibold">{partner ? `${partner.firstName} ${partner.lastName}` : "Чат"}</p>
                  <p className="mt-1 truncate text-sm text-[color:var(--ink-700)]">{chat.lastMessage?.content ?? "Нет сообщений"}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 shadow-sm">
        {!activeChat ? (
          <div className="flex min-h-[720px] items-center justify-center p-6 text-[color:var(--ink-700)]">
            Выберите чат или начните новый диалог.
          </div>
        ) : (
          <div className="flex min-h-[720px] flex-col">
            <div className="border-b border-[color:var(--line)] px-5 py-4">
              <h2 className="heading-font text-xl font-bold">
                {activeChat.participants.find((item) => item.id !== userId)?.firstName ?? "Чат"}
              </h2>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f6f7f3] p-5">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <article className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.senderId === userId ? "bg-[color:var(--brand)] text-white" : "bg-white text-[color:var(--ink-900)]"}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.attachmentUrl && (
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-3 inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${message.senderId === userId ? "bg-white/15 text-white" : "bg-[color:var(--paper)] text-[color:var(--brand)]"}`}
                      >
                        Открыть файл
                      </a>
                    )}
                    <p className={`mt-2 text-[11px] ${message.senderId === userId ? "text-white/70" : "text-[color:var(--ink-700)]"}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </article>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[color:var(--line)] p-4">
              <input
                value={attachmentUrl}
                onChange={(event) => setAttachmentUrl(event.target.value)}
                placeholder="Ссылка на файл (необязательно)"
                className="mb-2 w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
              />
              <div className="flex gap-2">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Напишите сообщение..."
                  className="min-h-[84px] flex-1 rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm outline-none focus:border-[color:var(--brand)]"
                />
                <button
                  onClick={() => {
                    void handleSend();
                  }}
                  disabled={!draft.trim()}
                  className="self-end rounded-2xl bg-[color:var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
