import { useEffect, useState } from 'react'
import { Bell, Trash2, Check } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { notifications as notifApi, type Notification as ApiNotification } from '../lib/api'
import { RoleShellLayout } from './RoleShellLayout'

type Notification = {
    id: string
    icon: string
    title: string
    body: string
    time: string
    read: boolean
}

const TYPE_ICONS: Record<string, string> = {
    CHAT_MESSAGE: '💬',
    ASSIGNMENT: '📝',
    TOURNAMENT: '🏆',
    SYSTEM: '⭐',
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'только что'
    if (m < 60) return `${m} мин назад`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} ч назад`
    const d = Math.floor(h / 24)
    return d === 1 ? 'Вчера' : `${d} дн назад`
}

function mapApiNotif(n: ApiNotification): Notification {
    return { id: n.id, icon: TYPE_ICONS[n.type] ?? '🔔', title: n.title, body: n.body, time: timeAgo(n.createdAt), read: n.isRead }
}

const SAMPLE_NOTIFS: Notification[] = [
    { id: '1', icon: '📚', title: 'Новый урок', body: 'Математика: Дифференциальные уравнения', time: '5 мин назад', read: false },
    { id: '2', icon: '🏆', title: 'Достижение!', body: 'Вы получили значок "Серия 14 дней"', time: '2 часа назад', read: false },
    { id: '3', icon: '📝', title: 'Домашнее задание', body: 'Физика: задачи 1–5 сдать до пятницы', time: '5 часов назад', read: true },
    { id: '4', icon: '🎯', title: 'Турнир', body: 'Math Battle начнётся через 2 часа', time: 'Вчера', read: true },
]

export function NotificationsPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [notifs, setNotifs] = useState<Notification[]>([])
    const [, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        notifApi.list(50).then((data) => {
            if (data.length > 0) {
                setNotifs(data.map(mapApiNotif))
            } else {
                setNotifs(SAMPLE_NOTIFS)
            }
        }).catch(() => setNotifs(SAMPLE_NOTIFS)).finally(() => setLoading(false))
    }, [])

    const unread = notifs.filter(n => !n.read).length
    const visible = notifs.filter(n => filter === 'all' || !n.read)

    const handleMarkAllRead = () => {
        notifApi.markAllRead().catch(() => { /* ignore */ })
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    }

    const handleToggleRead = (id: string) => {
        const n = notifs.find(x => x.id === id)
        if (n && !n.read) notifApi.markRead(id).catch(() => { /* ignore */ })
        setNotifs(prev => prev.map(x => x.id === id ? { ...x, read: !x.read } : x))
    }

    return (
        <RoleShellLayout language={language} onLanguageChange={onLanguageChange}>
            <div className="np-root">
                <div className="np-header">
                    <div>
                        <h1 className="np-title">Уведомления</h1>
                        <p className="np-sub">{unread} непрочитанных</p>
                    </div>
                    <div className="np-actions">
                        <div className="np-filter">
                            {(['all', 'unread'] as const).map(f => (
                                <button key={f} type="button" className={filter === f ? 'np-filter-btn active' : 'np-filter-btn'} onClick={() => setFilter(f)}>
                                    {f === 'all' ? 'Все' : 'Непрочитанные'}
                                </button>
                            ))}
                        </div>
                        {unread > 0 && (
                            <button type="button" className="np-btn" onClick={handleMarkAllRead}>
                                <Check size={14} /> Прочитать все
                            </button>
                        )}
                    </div>
                </div>

                <div className="np-list">
                    {visible.length === 0 ? (
                        <div className="np-empty">
                            <Bell size={40} />
                            <p>Нет уведомлений</p>
                        </div>
                    ) : (
                        visible.map(n => (
                            <div key={n.id} className={`np-item ${n.read ? 'read' : 'unread'}`}>
                                <span className="np-icon">{n.icon}</span>
                                <div className="np-content">
                                    <p className="np-item-title">{n.title}</p>
                                    <p className="np-item-body">{n.body}</p>
                                    <p className="np-item-time">{n.time}</p>
                                </div>
                                <div className="np-actions-item">
                                    <button type="button" className="np-btn-sm" onClick={() => handleToggleRead(n.id)}>
                                        {n.read ? 'Отметить' : '✓'}
                                    </button>
                                    <button type="button" className="np-btn-sm danger" onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                {!n.read && <span className="np-dot" />}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </RoleShellLayout>
    )
}
