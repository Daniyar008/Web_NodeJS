import type { ReactNode } from 'react'
import {
    BarChart2,
    Bell,
    BookOpen,
    CalendarDays,
    CircleUserRound,
    LayoutDashboard,
    MessageCircle,
    Plus,
    Settings,
    Users,
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
                        <button type="button" className="ghost-icon" aria-label="Notifications">
                            <Bell size={16} />
                        </button>
                        <button
                            type="button"
                            className="ghost-icon"
                            aria-label="Profile"
                            onClick={() => navigate('/teacher/settings')}
                        >
                            <CircleUserRound size={16} />
                        </button>
                    </div>
                </header>

                {children}
            </section>
        </div>
    )
}
