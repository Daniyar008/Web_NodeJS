import type { ReactNode } from 'react'
import {
    Bell,
    BookOpen,
    CalendarDays,
    ChartNoAxesCombined,
    CircleUserRound,
    GraduationCap,
    MessageCircle,
    Search,
    Settings,
    User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { translations } from '../i18n/translations'

type ActivePage = 'dashboard' | 'courses' | 'chat' | 'teacher' | 'profile' | 'schedule' | 'resources' | 'settings' | 'other'

type CourseShellLayoutProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
    title: string
    children: ReactNode
    includeCategoryFilter?: boolean
    activePage?: ActivePage
}

export function CourseShellLayout({
    language,
    onLanguageChange,
    title,
    children,
    includeCategoryFilter = false,
    activePage = 'other',
}: CourseShellLayoutProps) {
    const t = translations[language]
    const navigate = useNavigate()

    return (
        <div className="courses-shell">
            <aside className="courses-sidebar">
                <div className="courses-brand">
                    <div className="courses-logo">E</div>
                    <h2>{t.brand}</h2>
                    <p>{t.slogan}</p>
                </div>

                <nav className="courses-nav" aria-label="Sidebar navigation">
                    <button type="button" className={activePage === 'dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}><ChartNoAxesCombined size={17} /> {t.dashboard}</button>
                    <button type="button" className={activePage === 'courses' ? 'active' : ''} onClick={() => navigate('/courses')}><BookOpen size={17} /> {t.course}</button>
                    <button type="button" className={activePage === 'resources' ? 'active' : ''} onClick={() => navigate('/resources')}><GraduationCap size={17} /> {t.resources}</button>
                    <button type="button" className={activePage === 'chat' ? 'active' : ''} onClick={() => navigate('/chat')}><MessageCircle size={17} /> {t.chat}</button>
                    <button type="button" className={activePage === 'schedule' ? 'active' : ''} onClick={() => navigate('/schedule')}><CalendarDays size={17} /> {t.schedule}</button>
                    <button type="button" className={activePage === 'profile' ? 'active' : ''} onClick={() => navigate('/profile')}><User size={17} /> {t.profile}</button>
                    <button type="button" className={activePage === 'settings' ? 'active' : ''} onClick={() => navigate('/settings')}><Settings size={17} /> {t.settings}</button>
                </nav>

                <div className="courses-upgrade">
                    <p>Upgrade to PRO</p>
                    <button type="button">{t.upgradeNow}</button>
                </div>
            </aside>

            <section className="courses-content">
                <header className="courses-header">
                    <div className="courses-title-row">
                        <h1>{title}</h1>
                        <button type="button" className="search-circle" aria-label="Search">
                            <Search size={16} />
                        </button>
                    </div>

                    <div className="courses-actions">
                        <label className="lang-select">
                            <span>Lang</span>
                            <select
                                value={language}
                                onChange={(event) => onLanguageChange(event.target.value as Language)}
                                aria-label="Language selector"
                            >
                                <option value="ru">RU</option>
                                <option value="en">EN</option>
                                <option value="kk">KZ</option>
                            </select>
                        </label>

                        {includeCategoryFilter && (
                            <label className="sort-select">
                                <span>{t.sortBy}:</span>
                                <select aria-label="Sort courses">
                                    <option>{t.allCategories}</option>
                                    <option>Design</option>
                                    <option>UX/UI</option>
                                    <option>Illustration</option>
                                </select>
                            </label>
                        )}

                        <button type="button" className="ghost-icon" aria-label="Notifications"><Bell size={16} /></button>
                        <button type="button" className="ghost-icon" aria-label="Profile"><CircleUserRound size={16} /></button>
                    </div>
                </header>

                {children}
            </section>
        </div>
    )
}
