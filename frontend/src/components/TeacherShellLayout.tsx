import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react'
import { auth, getAccessToken, decodeAccessToken, backendRoleToFrontend } from '../lib/api'
import {
    BarChart2,
    Bell,
    BookOpen,
    BookText,
    CalendarDays,
    CircleUserRound,
    HelpCircle,
    Layout,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    Plus,
    Search,
    Settings,
    User,
    Users,
    X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'

const NOTIFS = [
    { id: '1', icon: '📚', title: 'Новый материал', body: 'Загружен видеоурок: Основы дизайна', time: '5 мин назад', read: false },
    { id: '2', icon: '📝', title: 'Задание отправлено', body: 'Студент Айдар: домашняя работа #3', time: '2 часа назад', read: false },
    { id: '3', icon: '🏆', title: 'Классный результат', body: 'Класс А набрал 95% результатов', time: '5 часов назад', read: true },
    { id: '4', icon: '💬', title: 'Новое сообщение', body: 'Администратор: важное объявление', time: 'Вчера', read: true },
]

export type ActiveTeacherPage =
    | 't-workspace'
    | 't-dashboard'
    | 't-courses'
    | 't-students'
    | 't-schedule'
    | 't-analytics'
    | 't-chat'
    | 't-settings'
    | 't-grades'
    | 'other'

type TeacherShellLayoutProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
    title?: string
    children: ReactNode
    activePage?: ActiveTeacherPage
}

export function TeacherShellLayout({
    language,
    onLanguageChange,
    title = '',
    children,
    activePage = 'other',
}: TeacherShellLayoutProps) {
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
        <div className="teacher-shell">
            {/* ── Sidebar ──────────────────────────────────────────────────────── */}
            <aside className="teacher-sidebar">
                <div className="teacher-brand">
                    <div className="teacher-logo">E</div>
                    <div className="teacher-brand-text">
                        <span className="teacher-brand-name">ESTUDY</span>
                        <span className="teacher-brand-sub">Кабинет учителя</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="teacher-create-btn"
                    onClick={() => navigate('/teacher/courses/new')}
                >
                    <Plus size={15} />
                    Создать курс
                </button>

                <nav className="teacher-nav" aria-label="Teacher navigation">
                    <button
                        type="button"
                        className={activePage === 't-workspace' ? 'active' : ''}
                        onClick={() => navigate('/teacher')}
                    >
                        <Layout size={17} /> Рабочий стол
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-dashboard' ? 'active' : ''}
                        onClick={() => navigate('/teacher/dashboard')}
                    >
                        <LayoutDashboard size={17} /> Дашборд
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-courses' ? 'active' : ''}
                        onClick={() => navigate('/teacher/courses')}
                    >
                        <BookOpen size={17} /> Мои курсы
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-students' ? 'active' : ''}
                        onClick={() => navigate('/teacher/students')}
                    >
                        <Users size={17} /> Ученики
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-schedule' ? 'active' : ''}
                        onClick={() => navigate('/teacher/schedule')}
                    >
                        <CalendarDays size={17} /> Расписание
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-analytics' ? 'active' : ''}
                        onClick={() => navigate('/teacher/analytics')}
                    >
                        <BarChart2 size={17} /> Аналитика
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-grades' ? 'active' : ''}
                        onClick={() => navigate('/teacher/grades')}
                    >
                        <BookText size={17} /> Журнал
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-chat' ? 'active' : ''}
                        onClick={() => navigate('/teacher/chat')}
                    >
                        <MessageCircle size={17} /> Чат
                    </button>
                    <button
                        type="button"
                        className={activePage === 't-settings' ? 'active' : ''}
                        onClick={() => navigate('/teacher/settings')}
                    >
                        <Settings size={17} /> Настройки
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/teacher/help')}
                    >
                        <HelpCircle size={17} /> Поддержка
                    </button>
                </nav>
            </aside>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <section className="teacher-content">
                <header className="teacher-header">
                    <h1 className="teacher-header-title">{title}</h1>
                    <div className="teacher-header-actions">
                        <label className="lang-select">
                            <span>Lang</span>
                            <select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value as Language)}
                                aria-label="Language selector"
                            >
                                <option value="ru">RU</option>
                                <option value="en">EN</option>
                                <option value="kk">KZ</option>
                            </select>
                        </label>

                        <div className="shell-search-wrap">
                            {searchOpen
                                ? <form className="shell-search-form" onSubmit={e => { e.preventDefault(); navigate(`/teacher/search?q=${encodeURIComponent(searchQ)}`); setSearchOpen(false); setSearchQ('') }}>
                                    <input autoFocus className="shell-search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск..." />
                                    <button type="submit" className="ghost-icon" aria-label="Найти"><Search size={16} /></button>
                                    <button type="button" className="ghost-icon" aria-label="Закрыть" onClick={() => { setSearchOpen(false); setSearchQ('') }}><X size={16} /></button>
                                </form>
                                : <button type="button" className="ghost-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={16} /></button>
                            }
                        </div>

                        <div className="notif-wrap" ref={notifRef}>
                            <button type="button" className="ghost-icon" aria-label="Уведомления" onClick={() => setNotifOpen(o => !o)}>
                                <Bell size={16} />
                                {unread > 0 && <span className="notif-badge">{unread}</span>}
                            </button>
                            {notifOpen && (
                                <div className="notif-panel">
                                    <div className="notif-panel-head">
                                        <span>Уведомления{unread > 0 && <b className="notif-unread-count"> {unread} новых</b>}</span>
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
                            <button type="button" className="ghost-icon" aria-label="Профиль" onClick={() => setProfileOpen(o => !o)}>
                                <CircleUserRound size={16} />
                            </button>
                            {profileOpen && (
                                <div className="mini-profile-panel">
                                    <div className="mini-profile-top">
                                        <div className="mini-profile-avatar">{user?.firstName?.[0]?.toUpperCase() ?? '?'}</div>
                                        <div className="mini-profile-info">
                                            <p className="mini-profile-name">{user?.email ?? 'Гость'}</p>
                                            <span className="mini-profile-role">Учитель</span>
                                        </div>
                                    </div>
                                    <div className="mini-profile-links">
                                        <button type="button" onClick={() => { navigate('/teacher/settings'); setProfileOpen(false) }}><User size={14} /> Профиль</button>
                                        <button type="button" onClick={() => { navigate('/teacher/settings'); setProfileOpen(false) }}><Settings size={14} /> Настройки</button>
                                        <button type="button" onClick={() => { navigate('/teacher/help'); setProfileOpen(false) }}><HelpCircle size={14} /> Помощь</button>
                                        <button type="button" className="mini-profile-logout" onClick={handleLogout}><LogOut size={14} /> Выйти</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {children}
            </section>
        </div>
    )
}
