import type { ReactNode } from 'react'
import {
    BarChart3,
    Bell,
    BookOpen,
    CircleUserRound,
    Cog,
    GraduationCap,
    HandCoins,
    LayoutDashboard,
    MessageSquare,
    Network,
    Puzzle,
    Shield,
    Swords,
    Users,
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

export function InstitutionShellLayout({
    language,
    onLanguageChange,
    title,
    subtitle,
    activePage = 'other',
    children,
}: InstitutionShellLayoutProps) {
    const navigate = useNavigate()

    return (
        <div className="inst-shell">
            <aside className="inst-sidebar">
                <div className="inst-brand">
                    <div className="inst-logo">E</div>
                    <div className="inst-brand-text">
                        <span className="inst-brand-name">EDUFUTURE</span>
                        <span className="inst-brand-sub">Кабинет учреждения</span>
                    </div>
                </div>

                <nav className="inst-nav" aria-label="Institution navigation">
                    <button type="button" className={activePage === 'i-dashboard' ? 'active' : ''} onClick={() => navigate('/institution/dashboard')}><LayoutDashboard size={16} /> Дашборд</button>
                    <button type="button" className={activePage === 'i-structure' ? 'active' : ''} onClick={() => navigate('/institution/structure')}><Network size={16} /> Структура</button>
                    <button type="button" className={activePage === 'i-users' ? 'active' : ''} onClick={() => navigate('/institution/users')}><Users size={16} /> Пользователи</button>
                    <button type="button" className={activePage === 'i-academic' ? 'active' : ''} onClick={() => navigate('/institution/academic')}><GraduationCap size={16} /> Учебный процесс</button>
                    <button type="button" className={activePage === 'i-analytics' ? 'active' : ''} onClick={() => navigate('/institution/analytics')}><BarChart3 size={16} /> Аналитика</button>
                    <button type="button" className={activePage === 'i-courses' ? 'active' : ''} onClick={() => navigate('/institution/courses')}><BookOpen size={16} /> Курсы</button>
                    <button type="button" className={activePage === 'i-finance' ? 'active' : ''} onClick={() => navigate('/institution/finance')}><HandCoins size={16} /> Финансы</button>
                    <button type="button" className={activePage === 'i-tournaments' ? 'active' : ''} onClick={() => navigate('/institution/tournaments')}><Swords size={16} /> Турниры</button>
                    <button type="button" className={activePage === 'i-communications' ? 'active' : ''} onClick={() => navigate('/institution/communications')}><MessageSquare size={16} /> Коммуникации</button>
                    <button type="button" className={activePage === 'i-integrations' ? 'active' : ''} onClick={() => navigate('/institution/integrations')}><Puzzle size={16} /> Интеграции</button>
                    <button type="button" className={activePage === 'i-settings' ? 'active' : ''} onClick={() => navigate('/institution/settings')}><Cog size={16} /> Настройки</button>
                </nav>

                <div className="inst-sidebar-footer">
                    <div className="inst-plan-chip"><Shield size={12} /> Тариф: Профессиональный</div>
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
                        <button type="button" className="ghost-icon" aria-label="Notifications"><Bell size={16} /></button>
                        <button type="button" className="ghost-icon" aria-label="Profile"><CircleUserRound size={16} /></button>
                    </div>
                </header>

                <main className="inst-main">{children}</main>
            </section>
        </div>
    )
}
