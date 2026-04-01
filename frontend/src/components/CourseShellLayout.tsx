import { useState, useRef, useEffect, type ReactNode } from 'react'
import {
    Bell,
    BookOpen,
    CalendarDays,
    ChartNoAxesCombined,
    CircleUserRound,
    GraduationCap,
    KanbanSquare,
    MessageCircle,
    Search,
    Settings,
    Star,
    Trophy,
    User,
    Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { translations } from '../i18n/translations'
import { EduBuddy } from './EduBuddy'
import { useXP } from '../lib/xpStore'

const NOTIFS = [
    { id: '1', icon: '📚', title: 'Новый урок', body: 'Математика: Дифференциальные уравнения', time: '5 мин назад', read: false },
    { id: '2', icon: '🏆', title: 'Достижение!', body: 'Вы получили значок "Серия 14 дней"', time: '2 часа назад', read: false },
    { id: '3', icon: '📝', title: 'Домашнее задание', body: 'Физика: задачи 1–5 сдать до пятницы', time: '5 часов назад', read: true },
    { id: '4', icon: '🎯', title: 'Турнир', body: 'Math Battle начнётся через 2 часа', time: 'Вчера', read: true },
    { id: '5', icon: '💬', title: 'Новое сообщение', body: 'Учитель Иванов: "Хорошая работа!"', time: 'Вчера', read: true },
]

type ActivePage = 'dashboard' | 'courses' | 'chat' | 'teacher' | 'profile' | 'schedule' | 'resources' | 'settings' | 'tasks' | 'tournaments' | 'other'

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
    const { level, levelTitle, progress, xpInLevel, xpToNext, addXP, justLeveledUp, clearLevelUp } = useXP()
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifs, setNotifs] = useState(NOTIFS)
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
                    <button type="button" className={activePage === 'tasks' ? 'active' : ''} onClick={() => navigate('/tasks')}><KanbanSquare size={17} /> Задачи</button>
                    <button type="button" className={activePage === 'tournaments' ? 'active' : ''} onClick={() => navigate('/tournaments')}><Trophy size={17} /> Турниры</button>
                    <button type="button" className={activePage === 'profile' ? 'active' : ''} onClick={() => navigate('/profile')}><User size={17} /> {t.profile}</button>
                    <button type="button" className={activePage === 'settings' ? 'active' : ''} onClick={() => navigate('/settings')}><Settings size={17} /> {t.settings}</button>
                </nav>

                {/* XP Bar */}
                <div className="xp-bar-wrap">
                    <div className="xp-bar-top">
                        <div className="xp-level-badge"><Zap size={10} /> Ур. {level}</div>
                        <span className="xp-bar-label">{xpInLevel} / {xpToNext} XP</span>
                    </div>
                    <div className="xp-bar-track">
                        <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="xp-bar-footer">
                        <span className="xp-level-title">{levelTitle}</span>
                        <button type="button" className="xp-earn-btn" onClick={() => addXP(50)} title="+50 XP за урок">+50 XP</button>
                    </div>
                </div>

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

                        <div className="notif-wrap" ref={notifRef}>
                            <button type="button" className="ghost-icon notif-trigger" aria-label="Уведомления" onClick={() => setNotifOpen(o => !o)}>
                                <Bell size={16} />
                                {unread > 0 && <span className="notif-badge">{unread}</span>}
                            </button>
                            {notifOpen && (
                                <div className="notif-panel">
                                    <div className="notif-panel-head">
                                        <span>Уведомления{unread > 0 && <b className="notif-unread-count"> {unread} новых</b>}</span>
                                        {unread > 0 && (
                                            <button type="button" className="notif-mark-all" onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}>
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
                        <button type="button" className="ghost-icon" aria-label="Профиль"><CircleUserRound size={16} /></button>
                    </div>
                </header>

                {children}
            </section>

            <EduBuddy />

            {/* Level-up modal */}
            {justLeveledUp && (
                <div className="levelup-backdrop" onClick={clearLevelUp}>
                    <div className="levelup-modal" onClick={e => e.stopPropagation()}>
                        <div className="levelup-stars" aria-hidden="true">✦ ✦ ✦</div>
                        <div className="levelup-icon"><Star size={40} fill="#fbbf24" color="#fbbf24" /></div>
                        <p className="levelup-eyebrow">Новый уровень!</p>
                        <div className="levelup-badge">Уровень {level}</div>
                        <p className="levelup-title">{levelTitle}</p>
                        <p className="levelup-desc">Поздравляем! Продолжайте учиться и открывайте новые достижения.</p>
                        <button type="button" className="levelup-btn" onClick={clearLevelUp}>Продолжить 🚀</button>
                    </div>
                </div>
            )}
        </div>
    )
}
