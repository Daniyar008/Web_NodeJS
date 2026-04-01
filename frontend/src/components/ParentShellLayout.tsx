import type { ReactNode } from 'react'
import {
    Award,
    Bell,
    BookOpen,
    CalendarDays,
    CircleUserRound,
    LayoutDashboard,
    MessageCircle,
    Settings,
    Star,
    Target,
    TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'

export type ActiveParentPage =
    | 'p-dashboard'
    | 'p-grades'
    | 'p-attendance'
    | 'p-homework'
    | 'p-motivation'
    | 'p-chat'
    | 'p-courses'
    | 'p-achievements'
    | 'p-settings'
    | 'other'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
    title: string
    subtitle?: string
    children: ReactNode
    activePage?: ActiveParentPage
}

export function ParentShellLayout({
    language,
    onLanguageChange,
    title,
    subtitle,
    children,
    activePage = 'other',
}: Props) {
    const navigate = useNavigate()

    return (
        <div className="parent-shell">
            {/* Sidebar */}
            <aside className="parent-sidebar">
                <div className="parent-brand">
                    <div className="parent-logo">E</div>
                    <div className="parent-brand-text">
                        <span className="parent-brand-name">ESTUDY</span>
                        <span className="parent-brand-sub">Кабинет родителя</span>
                    </div>
                </div>

                {/* Child switcher chip */}
                <div className="parent-child-chip">
                    <img
                        className="parent-child-avatar"
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anna"
                        alt="Анна"
                    />
                    <div>
                        <p className="parent-child-name">Анна Иванова</p>
                        <p className="parent-child-class">8А класс</p>
                    </div>
                </div>

                <nav className="parent-nav" aria-label="Parent navigation">
                    {[
                        ['p-dashboard', '/parent/dashboard', LayoutDashboard, 'Обзор'],
                        ['p-grades', '/parent/grades', TrendingUp, 'Успеваемость'],
                        ['p-attendance', '/parent/attendance', CalendarDays, 'Посещаемость'],
                        ['p-homework', '/parent/homework', BookOpen, 'Домашние задания'],
                        ['p-motivation', '/parent/motivation', Target, 'Мотивация'],
                        ['p-chat', '/parent/chat', MessageCircle, 'Чат с учителем'],
                        ['p-courses', '/parent/courses', Star, 'Курсы'],
                        ['p-achievements', '/parent/achievements', Award, 'Достижения'],
                        ['p-settings', '/parent/settings', Settings, 'Настройки'],
                    ].map(([key, path, Icon, label]) => (
                        <button
                            key={key as string}
                            type="button"
                            className={activePage === key ? 'active' : ''}
                            onClick={() => navigate(path as string)}
                        >
                            <Icon size={17} /> {label as string}
                        </button>
                    ))}
                </nav>


            </aside>

            {/* Main */}
            <section className="parent-content">
                <header className="parent-header">
                    <div>
                        <h1 className="parent-header-title">{title}</h1>
                        {subtitle && <p className="parent-header-sub">{subtitle}</p>}
                    </div>
                    <div className="parent-header-actions">
                        <label className="lang-select">
                            <span>Lang</span>
                            <select
                                value={language}
                                onChange={(e) => onLanguageChange(e.target.value as Language)}
                                aria-label="Language"
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
                            onClick={() => navigate('/parent/settings')}
                        >
                            <CircleUserRound size={16} />
                        </button>
                    </div>
                </header>
                <div className="parent-page-body">{children}</div>
            </section>
        </div>
    )
}
