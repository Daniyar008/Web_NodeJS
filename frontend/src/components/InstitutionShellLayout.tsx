import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react'
import { auth, getAccessToken, decodeAccessToken, backendRoleToFrontend } from '../lib/api'
import {
    BarChart3,
    Bell,
    BookOpen,
    CircleUserRound,
    Cog,
    GraduationCap,
    HandCoins,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Network,
    Puzzle,
    Search,
    Shield,
    Swords,
    TrendingUp,
    User,
    Users,
    X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'

export type ActiveInstitutionPage =
    | 'i-dashboard'
    | 'i-structure'
    | 'i-users'
    | 'i-academic'
    | 'i-analytics'
    | 'i-courses'
    | 'i-finance'
    | 'i-tournaments'
    | 'i-communications'
    | 'i-integrations'
    | 'i-settings'
    | 'admissions'
    | 'other'

type InstitutionShellLayoutProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
    title?: string
    subtitle?: string
    activePage?: ActiveInstitutionPage
    children: ReactNode
}

const NAV_ITEMS = [
    { key: 'i-dashboard', path: '/institution/dashboard', Icon: LayoutDashboard, label: 'Дашборд' },
    { key: 'i-structure', path: '/institution/structure', Icon: Network, label: 'Структура' },
    { key: 'i-users', path: '/institution/users', Icon: Users, label: 'Пользователи' },
    { key: 'i-academic', path: '/institution/academic', Icon: GraduationCap, label: 'Учебный процесс' },
    { key: 'i-analytics', path: '/institution/analytics', Icon: BarChart3, label: 'Аналитика' },
    { key: 'i-courses', path: '/institution/courses', Icon: BookOpen, label: 'Курсы' },
    { key: 'i-finance', path: '/institution/finance', Icon: HandCoins, label: 'Финансы' },
    { key: 'i-tournaments', path: '/institution/tournaments', Icon: Swords, label: 'Турниры' },
    { key: 'i-communications', path: '/institution/communications', Icon: MessageSquare, label: 'Коммуникации' },
    { key: 'i-integrations', path: '/institution/integrations', Icon: Puzzle, label: 'Интеграции' },
    { key: 'i-settings', path: '/institution/settings', Icon: Cog, label: 'Настройки' },
    { key: 'admissions', path: '/institution/admissions', Icon: Users, label: 'Приём документов' },
    { key: 'i-help', path: '/institution/help', Icon: HelpCircle, label: 'Поддержка' },
] as const

const NOTIFS = [
    { id: '1', icon: '📚', title: 'Новые настройки', body: 'Приняты обновления для платформы', time: '2 часа назад', read: false },
    { id: '2', icon: '🏆', title: 'Новые пользователи', body: '5 новых учителей йдентифицированы', time: 'час назад', read: false },
    { id: '3', icon: '💬', title: 'турнир', body: 'Математика турнир закончился', time: 'Вчера', read: true },
]

export function InstitutionShellLayout({
    language,
    onLanguageChange,
    title = '',
    subtitle,
    activePage = 'other',
    children,
}: InstitutionShellLayoutProps) {
    const navigate = useNavigate()
    const user = useMemo(() => {
        const t = getAccessToken(); if (!t) return null;
        const p = decodeAccessToken(t); if (!p) return null;
        return { email: p.email, role: backendRoleToFrontend(p.role), firstName: p.email.split('@')[0] };
    }, [])
    const handleLogout = async () => { await auth.logout(); setProfileOpen(false); navigate('/') }

    const [profileOpen, setProfileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQ, setSearchQ] = useState('')
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifs, setNotifs] = useState(NOTIFS)
    const profileRef = useRef<HTMLDivElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)
    const unread = notifs.filter(n => !n.read).length

    useEffect(() => {
        if (!notifOpen) return
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [notifOpen])

    useEffect(() => {
        if (!profileOpen) return
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [profileOpen])

    return (
        <div className="inst-shell">
            <aside className="inst-sidebar">
                {/* Brand */}
                <div className="inst-brand">
                    <div className="inst-logo">E</div>
                    <div className="inst-brand-text">
                        <span className="inst-brand-name">EDUFUTURE</span>
                        <span className="inst-brand-sub">Учреждение</span>
                    </div>
                </div>

                {/* School info chip */}
                <div className="inst-school-chip">
                    <div className="inst-school-icon">🏫</div>
                    <div>
                        <p className="inst-school-name">СОШ №14</p>
                        <p className="inst-school-meta">г. Алматы · 1 284 уч.</p>
                    </div>
                    <div className="inst-school-online"><span />Онлайн</div>
                </div>

                {/* KPI mini strip */}
                <div className="inst-mini-kpi-row">
                    <div className="inst-mini-kpi">
                        <TrendingUp size={10} />
                        <span>4.32</span>
                        <span className="inst-mini-kpi-label">GPA</span>
                    </div>
                    <div className="inst-mini-kpi">
                        <Users size={10} />
                        <span>86</span>
                        <span className="inst-mini-kpi-label">Учит.</span>
                    </div>
                    <div className="inst-mini-kpi">
                        <BarChart3 size={10} />
                        <span>93%</span>
                        <span className="inst-mini-kpi-label">Посещ.</span>
                    </div>
                </div>

                <nav className="inst-nav" aria-label="Institution navigation">
                    {NAV_ITEMS.map(({ key, path, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={activePage === key ? 'active' : ''}
                            onClick={() => navigate(path)}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </nav>

                <div className="inst-sidebar-footer">
                    <div className="inst-plan-chip"><Shield size={12} /> Профессиональный</div>
                </div>
            </aside>

            <section className="inst-content">
                <header className="inst-header">
                    <div>
                        <h1 className="inst-header-title">{title}</h1>
                        {subtitle && <p className="inst-header-sub">{subtitle}</p>}
                    </div>
                    <div className="inst-header-actions">
                        <label className="lang-select">
                            <span>Lang</span>
                            <select value={language} onChange={(e) => onLanguageChange(e.target.value as Language)} aria-label="Language selector">
                                <option value="ru">RU</option>
                                <option value="en">EN</option>
                                <option value="kk">KZ</option>
                            </select>
                        </label>

                        <div className="shell-search-wrap">
                            {searchOpen
                                ? <form className="shell-search-form" onSubmit={e => { e.preventDefault(); navigate(`/institution/search?q=${encodeURIComponent(searchQ)}`); setSearchOpen(false); setSearchQ('') }}>
                                    <input autoFocus className="shell-search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск..." />
                                    <button type="submit" className="ghost-icon" aria-label="Найти"><Search size={16} /></button>
                                    <button type="button" className="ghost-icon" aria-label="Закрыть" onClick={() => { setSearchOpen(false); setSearchQ('') }}><X size={16} /></button>
                                </form>
                                : <button type="button" className="ghost-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={16} /></button>
                            }
                        </div>

                        <div className="notif-wrap" ref={notifRef}>
                            <button type="button" className="ghost-icon" aria-label="Нотификации" onClick={() => setNotifOpen(o => !o)}>
                                <Bell size={16} />
                                {unread > 0 && <span className="notif-badge">{unread}</span>}
                            </button>
                            {notifOpen && (
                                <div className="notif-panel">
                                    <div className="notif-panel-head">
                                        <span>Нотификации{unread > 0 && <b className="notif-unread-count"> {unread} новых</b>}</span>
                                        {unread > 0 && (
                                            <button type="button" className="notif-mark-all" onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                                            >
                                                Прочитать все
                                            </button>
                                        )}
                                    </div>
                                    <div className="notif-list">
                                        {notifs.map(n => (
                                            <div key={n.id} className={`notif-item${n.read ? '' : ' unread'}`} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                                                <span className="notif-item-icon">{n.icon}</span>
                                                <div className="notif-item-body">
                                                    <p className="notif-item-title">{n.title}</p>
                                                    <p className="notif-item-text">{n.body}</p>
                                                    <p className="notif-item-time">{n.time}</p>
                                                </div>
                                                {!n.read && <span className="notif-dot" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mini-profile-wrap" ref={profileRef}>
                            <button type="button" className="ghost-icon" aria-label="Profile" onClick={() => setProfileOpen(o => !o)}><CircleUserRound size={16} /></button>
                            {profileOpen && (
                                <div className="mini-profile-panel">
                                    <div className="mini-profile-top">
                                        <div className="mini-profile-avatar">{user?.firstName?.[0]?.toUpperCase() ?? '?'}</div>
                                        <div className="mini-profile-info">
                                            <p className="mini-profile-name">{user?.email ?? 'Гость'}</p>
                                            <span className="mini-profile-role">Администратор</span>
                                        </div>
                                    </div>
                                    <div className="mini-profile-links">
                                        <button type="button" onClick={() => { navigate('/institution/settings'); setProfileOpen(false) }}><User size={14} /> Профиль / Настройки</button>
                                        <button type="button" onClick={() => { navigate('/institution/help'); setProfileOpen(false) }}><HelpCircle size={14} /> Помощь</button>
                                        <button type="button" className="mini-profile-logout" onClick={handleLogout}><LogOut size={14} /> Выйти</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="inst-main">{children}</main>
            </section>
        </div>
    )
}
