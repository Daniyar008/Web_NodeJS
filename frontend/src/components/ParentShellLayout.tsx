import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
    Award,
    Bell,
    BookOpen,
    CalendarDays,
    ChevronDown,
    CircleUserRound,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    Search,
    Settings,
    Star,
    Target,
    TrendingUp,
    User,
    X,
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

const CHILDREN_LIST = [
    { name: 'Анна Иванова', cls: '8А класс', seed: 'Anna', avg: 4.6, hwPct: 78 },
    { name: 'Миша Иванов', cls: '5Б класс', seed: 'Mike', avg: 3.8, hwPct: 65 },
]

const NAV_ITEMS = [
    { key: 'p-dashboard', path: '/parent/dashboard', Icon: LayoutDashboard, label: 'Обзор' },
    { key: 'p-grades', path: '/parent/grades', Icon: TrendingUp, label: 'Успеваемость' },
    { key: 'p-attendance', path: '/parent/attendance', Icon: CalendarDays, label: 'Посещаемость' },
    { key: 'p-homework', path: '/parent/homework', Icon: BookOpen, label: 'Домашние задания' },
    { key: 'p-motivation', path: '/parent/motivation', Icon: Target, label: 'Мотивация' },
    { key: 'p-chat', path: '/parent/chat', Icon: MessageCircle, label: 'Чат с учителем' },
    { key: 'p-courses', path: '/parent/courses', Icon: Star, label: 'Курсы' },
    { key: 'p-achievements', path: '/parent/achievements', Icon: Award, label: 'Достижения' },
    { key: 'p-settings', path: '/parent/settings', Icon: Settings, label: 'Настройки' },
    { key: 'p-help', path: '/help', Icon: HelpCircle, label: 'Поддержка' },
] as const

export function ParentShellLayout({
    language,
    onLanguageChange,
    title,
    subtitle,
    children,
    activePage = 'other',
}: Props) {
    const navigate = useNavigate()
    const [activeChild, setActiveChild] = useState(0)
    const [childOpen, setChildOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQ, setSearchQ] = useState('')
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!profileOpen) return
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [profileOpen])
    const child = CHILDREN_LIST[activeChild]

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

                {/* Child switcher */}
                <div className="parent-child-switcher">
                    <button
                        type="button"
                        className="parent-child-chip"
                        onClick={() => setChildOpen((v) => !v)}
                    >
                        <img
                            className="parent-child-avatar"
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${child.seed}`}
                            alt={child.name}
                        />
                        <div className="parent-child-info">
                            <p className="parent-child-name">{child.name}</p>
                            <p className="parent-child-class">{child.cls}</p>
                        </div>
                        <ChevronDown size={14} className={`parent-child-chevron ${childOpen ? 'open' : ''}`} />
                    </button>

                    {childOpen && (
                        <div className="parent-child-dropdown">
                            {CHILDREN_LIST.map((c, i) => (
                                <button
                                    key={c.name}
                                    type="button"
                                    className={`parent-child-opt ${i === activeChild ? 'active' : ''}`}
                                    onClick={() => { setActiveChild(i); setChildOpen(false) }}
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.seed}`}
                                        alt={c.name}
                                    />
                                    <div>
                                        <p>{c.name}</p>
                                        <p className="parent-child-opt-cls">{c.cls}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mini stats */}
                <div className="parent-mini-stats">
                    <div className="parent-mini-stat">
                        <span className="parent-mini-val">{child.avg}</span>
                        <span className="parent-mini-lbl">Ср. балл</span>
                    </div>
                    <div className="parent-mini-sep" />
                    <div className="parent-mini-stat">
                        <span className="parent-mini-val">{child.hwPct}%</span>
                        <span className="parent-mini-lbl">ДЗ выполн.</span>
                    </div>
                </div>

                <nav className="parent-nav" aria-label="Parent navigation">
                    {NAV_ITEMS.map(({ key, path, Icon, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={activePage === key ? 'active' : ''}
                            onClick={() => navigate(path)}
                        >
                            <Icon size={17} /> {label}
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
                                            <span className="mini-profile-role">Родитель</span>
                                        </div>
                                    </div>
                                    <div className="mini-profile-links">
                                        <button type="button" onClick={() => { navigate('/parent/settings'); setProfileOpen(false) }}><User size={14} /> Профиль / Настройки</button>
                                        <button type="button" onClick={() => { navigate('/help'); setProfileOpen(false) }}><HelpCircle size={14} /> Помощь</button>
                                        <button type="button" className="mini-profile-logout" onClick={() => { localStorage.removeItem('estudy-role'); setProfileOpen(false); navigate('/') }}><LogOut size={14} /> Выйти</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="parent-page-body">{children}</div>
            </section>
        </div>
    )
}
