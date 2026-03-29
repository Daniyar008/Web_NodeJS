import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { notificationApi, type NotificationItem, type NotificationPreference } from "../features/notification/notificationApi";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [preference, setPreference] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([notificationApi.list({ limit: 50 }), notificationApi.preferences()])
      .then(([notificationItems, currentPreference]) => {
        setItems(notificationItems);
        setPreference(currentPreference);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleMarkRead(id: string) {
    const updated = await notificationApi.markRead(id);
    setItems((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  async function handleMarkAllRead() {
    await notificationApi.markAllRead();
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  }

  async function togglePreference(key: keyof Omit<NotificationPreference, "id" | "userId" | "updatedAt">) {
    if (!preference) return;
    const updated = await notificationApi.updatePreferences({ [key]: !preference[key] });
    setPreference(updated);
  }

  if (loading) {
    return <div className="py-20 text-center text-[color:var(--ink-700)]">Загрузка уведомлений…</div>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Уведомления</p>
            <h1 className="heading-font mt-1 text-2xl font-bold">Центр уведомлений</h1>
          </div>
          <button
            onClick={() => {
              void handleMarkAllRead();
            }}
            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm font-semibold text-[color:var(--ink-700)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
          >
            Прочитать все
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Пока уведомлений нет.</p>}
          {items.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border p-4 ${item.isRead ? "border-[color:var(--line)] bg-white" : "border-amber-200 bg-amber-50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-[color:var(--ink-900)]">{item.title}</h2>
                  <p className="mt-1 text-sm text-[color:var(--ink-700)]">{item.body}</p>
                  <p className="mt-2 text-xs text-[color:var(--ink-700)]">{formatDateTime(item.createdAt)}</p>
                </div>
                {!item.isRead && (
                  <button
                    onClick={() => {
                      void handleMarkRead(item.id);
                    }}
                    className="rounded-lg bg-[color:var(--brand)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Прочитано
                  </button>
                )}
              </div>
              {item.link && (
                <Link to={item.link} className="mt-3 inline-flex text-sm font-semibold text-[color:var(--brand)] hover:underline">
                  Перейти
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Настройки</p>
        <h2 className="heading-font mt-1 text-xl font-bold">Подписки на уведомления</h2>
        {preference && (
          <div className="mt-5 space-y-3">
            {[
              ["inAppEnabled", "In-app уведомления"],
              ["emailEnabled", "Email уведомления"],
              ["pushEnabled", "Push уведомления"],
              ["chatEnabled", "Сообщения"],
              ["courseEnabled", "Курсы и задания"],
              ["systemEnabled", "Системные события"],
            ].map(([key, label]) => {
              const typedKey = key as keyof Omit<NotificationPreference, "id" | "userId" | "updatedAt">;
              return (
                <label key={key} className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] px-4 py-3 text-sm">
                  <span>{label}</span>
                  <button
                    onClick={() => {
                      void togglePreference(typedKey);
                    }}
                    className={`h-7 w-12 rounded-full p-1 transition ${preference[typedKey] ? "bg-[color:var(--brand)]" : "bg-gray-300"}`}
                  >
                    <span className={`block h-5 w-5 rounded-full bg-white transition ${preference[typedKey] ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}