import { useState, useRef, useEffect, type ReactNode } from 'react'
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
    | 'other'

type InstitutionShellLayoutProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
    title: string
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
    { key: 'i-help', path: '/help', Icon: HelpCircle, label: 'Поддержка' },
] as const

export function InstitutionShellLayout({
    language,
    onLanguageChange,
    title,
    subtitle,
    activePage = 'other',
    children,
}: InstitutionShellLayoutProps) {
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
                                ? <form className="shell-search-form" onSubmit={e => { e.preventDefault(); setSearchOpen(false); setSearchQ('') }}>
                                    <input autoFocus className="shell-search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск..." />
                                    <button type="submit" className="ghost-icon" aria-label="Найти"><Search size={16} /></button>
                                    <button type="button" className="ghost-icon" aria-label="Закрыть" onClick={() => { setSearchOpen(false); setSearchQ('') }}><X size={16} /></button>
                                </form>
                                : <button type="button" className="ghost-icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={16} /></button>
                            }
                        </div>

                        <button type="button" className="ghost-icon" aria-label="Notifications"><Bell size={16} /></button>

                        <div className="mini-profile-wrap" ref={profileRef}>
                            <button type="button" className="ghost-icon" aria-label="Profile" onClick={() => setProfileOpen(o => !o)}><CircleUserRound size={16} /></button>
                            {profileOpen && (
                                <div className="mini-profile-panel">
                                    <div className="mini-profile-top">
                                        <div className="mini-profile-avatar">СД</div>
                                        <div className="mini-profile-info">
                                            <p className="mini-profile-name">Султангереев Данияр</p>
                                            <span className="mini-profile-role">Администратор</span>
                                        </div>
                                    </div>
                                    <div className="mini-profile-links">
                                        <button type="button" onClick={() => { navigate('/institution/settings'); setProfileOpen(false) }}><User size={14} /> Профиль</button>
                                        <button type="button" onClick={() => { navigate('/institution/settings'); setProfileOpen(false) }}><Cog size={14} /> Настройки</button>
                                        <button type="button" onClick={() => { navigate('/help'); setProfileOpen(false) }}><HelpCircle size={14} /> Помощь</button>
                                        <button type="button" className="mini-profile-logout"><LogOut size={14} /> Выйти</button>
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
