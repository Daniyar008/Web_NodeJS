import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { io, type Socket } from 'socket.io-client'

import { notificationApi, type NotificationItem } from '../features/notification/notificationApi'

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

export function MainLayout() {
    const isAuthenticated = Boolean(localStorage.getItem('accessToken'))
    const [isOpen, setIsOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [latestNotifications, setLatestNotifications] = useState<NotificationItem[]>([])
    const [scrolled, setScrolled] = useState(false)
    const socketRef = useRef<Socket | null>(null)
    const notifRef = useRef<HTMLDivElement>(null)
    const location = useLocation()

    const token = useMemo(() => localStorage.getItem('accessToken') ?? '', [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close notif dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
        setIsOpen(false)
    }, [location.pathname])

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

    const navLinks = isAuthenticated ? [
        { to: '/', label: 'Главная' },
        { to: '/assistant', label: 'AI-ассистент' },
        { to: '/messages', label: 'Сообщения' },
        { to: '/pricing', label: 'Тарифы' },
        { to: '/billing', label: 'Платежи' },
    ] : [
        { to: '/', label: 'Главная' },
        { to: '/pricing', label: 'Тарифы' },
    ]

    return (
        <div className="min-h-screen">
            {/* ── Navbar ─────────────────────────────────────────── */}
            <header
                className="sticky top-0 z-30 transition-all duration-300"
                style={{
                    background: scrolled
                        ? 'rgba(8,12,20,0.85)'
                        : 'rgba(8,12,20,0.5)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid ' + (scrolled ? 'rgba(255,255,255,0.10)' : 'transparent'),
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div
                            className="flex items-center justify-center rounded-xl w-8 h-8 text-white text-sm font-black"
                            style={{
                                background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent-teal) 100%)',
                                boxShadow: '0 0 16px rgba(99,102,241,0.5)',
                            }}
                        >
                            E
                        </div>
                        <span
                            className="heading-font text-xl font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            EduFuture
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                                style={{
                                    color: location.pathname === link.to ? '#f1f5f9' : 'var(--ink-300)',
                                    background: location.pathname === link.to ? 'rgba(255,255,255,0.06)' : 'transparent',
                                }}
                                onMouseEnter={e => {
                                    if (location.pathname !== link.to) {
                                        (e.currentTarget as HTMLAnchorElement).style.color = '#f1f5f9'
                                        ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (location.pathname !== link.to) {
                                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-300)'
                                        ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setIsOpen((v) => !v)}
                                    className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                                    style={{ color: 'var(--ink-300)', background: 'rgba(255,255,255,0.05)' }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.10)'
                                        ;(e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9'
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-300)'
                                    }}
                                >
                                    <BellIcon />
                                    {unreadCount > 0 && (
                                        <span
                                            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white px-1"
                                            style={{ background: 'var(--accent-rose)' }}
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl p-1 shadow-2xl"
                                        style={{
                                            background: 'rgba(13,18,32,0.95)',
                                            border: '1px solid var(--line-bright)',
                                            backdropFilter: 'blur(20px)',
                                            animation: 'reveal-up 0.2s ease both',
                                        }}
                                    >
                                        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--ink-100)' }}>
                                                Уведомления
                                            </p>
                                            <Link
                                                to="/notifications"
                                                onClick={() => setIsOpen(false)}
                                                className="text-xs font-semibold transition-colors hover:underline"
                                                style={{ color: 'var(--brand-light)' }}
                                            >
                                                Все →
                                            </Link>
                                        </div>
                                        <div className="neon-line mx-4 mb-2" />
                                        <div className="space-y-1 pb-2 px-1">
                                            {latestNotifications.length === 0 && (
                                                <p className="px-3 py-4 text-sm text-center" style={{ color: 'var(--ink-500)' }}>
                                                    Нет новых уведомлений
                                                </p>
                                            )}
                                            {latestNotifications.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={item.link ?? '/notifications'}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block rounded-xl px-3 py-2.5 text-sm transition-all"
                                                    style={{
                                                        background: item.isRead ? 'transparent' : 'rgba(99,102,241,0.08)',
                                                        border: '1px solid ' + (item.isRead ? 'transparent' : 'rgba(99,102,241,0.2)'),
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = item.isRead ? 'transparent' : 'rgba(99,102,241,0.08)'}
                                                >
                                                    <p className="font-semibold" style={{ color: 'var(--ink-100)' }}>{item.title}</p>
                                                    <p className="mt-0.5 text-xs" style={{ color: 'var(--ink-300)' }}>{item.body}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Login / CTA */}
                        <Link
                            to="/login"
                            className="btn-primary hidden sm:inline-flex text-sm py-2 px-5"
                        >
                            {isAuthenticated ? 'Мой кабинет' : 'Войти'}
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-xl transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle menu"
                        >
                            <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: 'var(--ink-300)', transform: mobileOpen ? 'translateY(8px) rotate(45deg)' : 'none' }} />
                            <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: 'var(--ink-300)', opacity: mobileOpen ? 0 : 1 }} />
                            <span className="block w-5 h-0.5 rounded-full transition-all" style={{ background: 'var(--ink-300)', transform: mobileOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div
                        className="md:hidden border-t px-5 py-4 space-y-1"
                        style={{
                            borderColor: 'var(--line)',
                            background: 'rgba(8,12,20,0.95)',
                            backdropFilter: 'blur(20px)',
                            animation: 'reveal-up 0.2s ease both',
                        }}
                    >
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    color: location.pathname === link.to ? 'var(--brand-light)' : 'var(--ink-300)',
                                    background: location.pathname === link.to ? 'rgba(99,102,241,0.10)' : 'transparent',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2">
                            <Link to="/login" className="btn-primary w-full justify-center">
                                {isAuthenticated ? 'Мой кабинет' : 'Войти'}
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* ── Page Content ───────────────────────────────────── */}
            <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:py-12">
                <Outlet />
            </main>
        </div>
    )
}
