import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { io, type Socket } from 'socket.io-client'

import { notificationApi, type NotificationItem } from '../features/notification/notificationApi'

export function MainLayout() {
    const isAuthenticated = Boolean(localStorage.getItem('accessToken'))
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [latestNotifications, setLatestNotifications] = useState<NotificationItem[]>([])
    const socketRef = useRef<Socket | null>(null)

    const token = useMemo(() => localStorage.getItem('accessToken') ?? '', [])

    useEffect(() => {
        if (!isAuthenticated) return

        void Promise.all([
            notificationApi.unreadCount(),
            notificationApi.list({ limit: 5 }),
        ]).then(([count, items]) => {
            setUnreadCount(count.count)
            setLatestNotifications(items)
        })

        const socket = io((import.meta.env['VITE_API_URL'] ?? 'http://localhost:4000/api').replace(/\/api$/, ''), {
            auth: { token },
            withCredentials: true,
        })
        socketRef.current = socket

        socket.on('notification:new', (item: NotificationItem) => {
            setUnreadCount((current) => current + 1)
            setLatestNotifications((current) => [item, ...current].slice(0, 5))
        })

        return () => {
            socket.disconnect()
        }
    }, [isAuthenticated, token])

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[#f6f7f3]/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link to="/" className="heading-font text-xl font-bold tracking-tight text-[color:var(--ink-900)]">
                        EduFuture
                    </Link>
                    <nav className="flex items-center gap-2 sm:gap-3">
                        <Link to="/" className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-700)] hover:bg-white">
                            Главная
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/assistant"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-700)] hover:bg-white"
                            >
                                AI-ассистент
                            </Link>
                        )}
                        {isAuthenticated && (
                            <Link
                                to="/messages"
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-700)] hover:bg-white"
                            >
                                Сообщения
                            </Link>
                        )}
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpen((value) => !value)}
                                    className="relative rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-700)] hover:bg-white"
                                >
                                    Уведомления
                                    {unreadCount > 0 && (
                                        <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-[color:var(--brand)] px-1.5 py-0.5 text-[11px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl border border-[color:var(--line)] bg-white p-3 shadow-xl">
                                        <div className="flex items-center justify-between gap-2 border-b border-[color:var(--line)] pb-2">
                                            <p className="text-sm font-semibold text-[color:var(--ink-900)]">Последние уведомления</p>
                                            <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-xs font-semibold text-[color:var(--brand)] hover:underline">
                                                Все уведомления
                                            </Link>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {latestNotifications.length === 0 && (
                                                <p className="text-sm text-[color:var(--ink-700)]">Новых уведомлений нет.</p>
                                            )}
                                            {latestNotifications.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={item.link ?? '/notifications'}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block rounded-xl border px-3 py-2 text-sm ${item.isRead ? 'border-[color:var(--line)] bg-white' : 'border-amber-200 bg-amber-50'}`}
                                                >
                                                    <p className="font-semibold text-[color:var(--ink-900)]">{item.title}</p>
                                                    <p className="mt-1 text-[color:var(--ink-700)]">{item.body}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <Link
                            to="/login"
                            className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-deep)]"
                        >
                            Войти
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                <Outlet />
            </main>
        </div>
    )
}
