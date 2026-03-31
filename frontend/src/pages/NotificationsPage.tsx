import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { notificationApi, type NotificationItem, type NotificationPreference } from "../features/notification/notificationApi";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
}

const prefLabels: Array<[keyof Omit<NotificationPreference, "id" | "userId" | "updatedAt">, string, string]> = [
  ["inAppEnabled", "In-app уведомления", "🔔"],
  ["emailEnabled", "Email уведомления", "📧"],
  ["pushEnabled", "Push уведомления", "📱"],
  ["chatEnabled", "Сообщения", "💬"],
  ["courseEnabled", "Курсы и задания", "📚"],
  ["systemEnabled", "Системные события", "⚙️"],
]

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
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div
          className="h-12 w-12 rounded-full border-4 animate-spin"
          style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--ink-300)' }}>Загрузка уведомлений…</p>
      </div>
    );
  }

  const unread = items.filter(i => !i.isRead).length;

  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="reveal glass-bright rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span
              className="badge mb-2"
              style={{
                background: 'rgba(99,102,241,0.12)',
                color: 'var(--brand-light)',
                border: '1px solid rgba(99,102,241,0.28)',
              }}
            >
              🔔 Центр уведомлений
            </span>
            <h1 className="heading-font text-3xl font-bold" style={{ color: 'var(--ink-100)' }}>
              Уведомления
              {unread > 0 && (
                <span
                  className="ml-3 text-lg font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(244,63,94,0.15)',
                    color: '#fb7185',
                    border: '1px solid rgba(244,63,94,0.3)',
                  }}
                >
                  {unread} новых
                </span>
              )}
            </h1>
          </div>
          <button
            onClick={() => { void handleMarkAllRead(); }}
            className="btn-ghost text-sm py-2.5 px-5"
          >
            ✓ Прочитать все
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* ── Notifications List ─────────────────────────────── */}
        <div className="reveal glass rounded-2xl p-5 space-y-3">
          {items.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-5xl mb-3">🎉</p>
              <p className="font-semibold" style={{ color: 'var(--ink-100)' }}>Всё прочитано!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--ink-500)' }}>Уведомлений пока нет</p>
            </div>
          )}
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl p-4 card-interactive transition-all"
              style={{
                background: item.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.08)',
                border: `1px solid ${item.isRead ? 'var(--line)' : 'rgba(99,102,241,0.25)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!item.isRead && (
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--brand)' }}
                      />
                    )}
                    <h2 className="font-semibold text-sm truncate" style={{ color: 'var(--ink-100)' }}>
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-300)' }}>{item.body}</p>
                  <p className="mt-2 text-xs" style={{ color: 'var(--ink-500)' }}>{formatDateTime(item.createdAt)}</p>
                  {item.link && (
                    <Link
                      to={item.link}
                      className="mt-2 inline-flex text-xs font-semibold transition-colors hover:underline"
                      style={{ color: 'var(--accent-teal)' }}
                    >
                      Перейти →
                    </Link>
                  )}
                </div>
                {!item.isRead && (
                  <button
                    onClick={() => { void handleMarkRead(item.id); }}
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: 'var(--brand-light)',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.25)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'}
                  >
                    ✓ Прочитано
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ── Preferences Panel ──────────────────────────────── */}
        <div className="reveal glass rounded-2xl p-5">
          <h2 className="heading-font text-lg font-bold mb-1" style={{ color: 'var(--ink-100)' }}>
            Настройки
          </h2>
          <p className="text-xs mb-5" style={{ color: 'var(--ink-500)' }}>
            Управление подписками на уведомления
          </p>
          {preference && (
            <div className="space-y-2">
              {prefLabels.map(([key, label, icon]) => {
                const isOn = preference[key] as boolean
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all"
                    style={{
                      background: isOn ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isOn ? 'rgba(99,102,241,0.2)' : 'var(--line)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{icon}</span>
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--ink-100)' }}>
                        {label}
                      </span>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => { void togglePreference(key); }}
                      className="relative flex-shrink-0 h-6 w-11 rounded-full transition-all duration-300"
                      style={{
                        background: isOn
                          ? 'linear-gradient(135deg, var(--brand) 0%, var(--accent-teal) 100%)'
                          : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${isOn ? 'var(--brand)' : 'var(--line-bright)'}`,
                        boxShadow: isOn ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                      }}
                      aria-label={`Toggle ${label}`}
                    >
                      <span
                        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
                        style={{
                          left: isOn ? 'calc(100% - 22px)' : '2px',
                        }}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}