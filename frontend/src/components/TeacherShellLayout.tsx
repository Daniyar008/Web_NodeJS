import { useState, useRef, useEffect, type ReactNode } from 'react'
import {
    BarChart2,
    Bell,
    BookOpen,
    BookText,
    CalendarDays,
    CircleUserRound,
    HelpCircle,
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

export type ActiveTeacherPage =
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
    title: string
    children: ReactNode
    activePage?: ActiveTeacherPage
}

export function TeacherShellLayout({
    language,
    onLanguageChange,
    title,
    children,
    activePage = 'other',
}: TeacherShellLayoutProps) {
    const navigate = useNavigate()

    const [profileOpen, setProfileOpen] = useState(false)
    const [searchOpen, setSearchOpen]   = useState(false)
    const [searchQ, setSearchQ]         = useState('')
    const profileRef = useRef<HTMLDivElement>(null)

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
                        onClick={() => navigate('/help')}
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
                                ? <form className="shell-search-form" onSubmit={e => { e.preventDefault(); setSearchOpen(false); setSearchQ('') }}>
                                    <input autoFocus className="shell-search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск..." />
                                    <button type="submit" className="ghost-icon" aria-label="Найти"><Search size={16} /></button>
                                    <button type="button" className="ghost-icon" aria-label="Закрыть" onClick={() => { setSearchOpen(false); setSearchQ('') }}><X size={16} /></button>
                                </form>
                                : <button type="button" className="ghost-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={16} /></button>
                            }
                        </div>

                        <button type="button" className="ghost-icon" aria-label="Уведомления">
                            <Bell size={16} />
                        </button>

                        <div className="mini-profile-wrap" ref={profileRef}>
                            <button type="button" className="ghost-icon" aria-label="Профиль" onClick={() => setProfileOpen(o => !o)}>
                                <CircleUserRound size={16} />
                            </button>
                            {profileOpen && (
                                <div className="mini-profile-panel">
                                    <div className="mini-profile-top">
                                        <div className="mini-profile-avatar">СД</div>
                                        <div className="mini-profile-info">
                                            <p className="mini-profile-name">Султангереев Данияр</p>
                                            <span className="mini-profile-role">Учитель</span>
                                        </div>
                                    </div>
                                    <div className="mini-profile-links">
                                        <button type="button" onClick={() => { navigate('/teacher/dashboard'); setProfileOpen(false) }}><User size={14} /> Профиль</button>
                                        <button type="button" onClick={() => { navigate('/teacher/settings'); setProfileOpen(false) }}><Settings size={14} /> Настройки</button>
                                        <button type="button" onClick={() => { navigate('/help'); setProfileOpen(false) }}><HelpCircle size={14} /> Помощь</button>
                                        <button type="button" className="mini-profile-logout"><LogOut size={14} /> Выйти</button>
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
