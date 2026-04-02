import { useState } from 'react'
import { Lock, Zap } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { useXP } from '../lib/xpStore'
import type { Language } from '../i18n/translations'

/* ── Types ─────────────────────────────────────────────────────── */
interface Achievement {
    id: string
    emoji: string
    title: string
    desc: string
    xp: number
    cat: string
    unlocked: boolean
    date?: string
    progress?: number   // 0-100, for locked ones
    progressLabel?: string
}

const CATS = [
    { id: 'all', label: 'Все' },
    { id: 'study', label: '📚 Учёба' },
    { id: 'streak', label: '🔥 Серия' },
    { id: 'social', label: '💬 Социальные' },
    { id: 'game', label: '🏆 Игровые' },
    { id: 'special', label: '⭐ Особые' },
]

const ACHIEVEMENTS: Achievement[] = [
    { id: 'a1', emoji: '🎓', title: 'Первый урок', desc: 'Завершите свой первый урок на платформе', xp: 50, cat: 'study', unlocked: true, date: '15 янв 2025' },
    { id: 'a2', emoji: '📚', title: 'Книжный червь', desc: 'Прочитайте 10 текстовых уроков', xp: 100, cat: 'study', unlocked: true, date: '20 янв 2025' },
    { id: 'a3', emoji: '💯', title: 'Перфекционист', desc: 'Получите 100% в тесте без подсказок', xp: 150, cat: 'study', unlocked: true, date: '2 фев 2025' },
    { id: 'a4', emoji: '⚡', title: 'Скорочтение', desc: 'Сдайте тест быстрее чем за 2 минуты', xp: 75, cat: 'study', unlocked: true, date: '10 фев 2025' },
    { id: 'a5', emoji: '🏅', title: 'Отличник', desc: 'Получите 5 пятёрок подряд', xp: 200, cat: 'study', unlocked: true, date: '18 фев 2025' },
    { id: 'a6', emoji: '📖', title: 'Завершил курс', desc: 'Пройдите полный курс от начала до конца', xp: 300, cat: 'study', unlocked: false, progress: 65, progressLabel: '13/20 уроков' },
    { id: 'a7', emoji: '🔥', title: 'Серия 7 дней', desc: '7 дней подряд занятий на платформе', xp: 100, cat: 'streak', unlocked: true, date: '8 фев 2025' },
    { id: 'a8', emoji: '🌡️', title: 'Серия 14 дней', desc: '14 дней подряд занятий на платформе', xp: 200, cat: 'streak', unlocked: true, date: '22 фев 2025' },
    { id: 'a9', emoji: '❄️', title: 'Серия 30 дней', desc: '30 дней подряд занятий на платформе', xp: 400, cat: 'streak', unlocked: false, progress: 73, progressLabel: '22/30 дней' },
    { id: 'a10', emoji: '💎', title: 'Серия 100 дней', desc: '100 дней подряд — настоящий чемпион!', xp: 1000, cat: 'streak', unlocked: false, progress: 22, progressLabel: '22/100 дней' },
    { id: 'a11', emoji: '💬', title: 'Первое сообщение', desc: 'Напишите первое сообщение в чате', xp: 25, cat: 'social', unlocked: true, date: '16 янв 2025' },
    { id: 'a12', emoji: '🤝', title: 'Наставник', desc: 'Помогите однокласснику с заданием', xp: 150, cat: 'social', unlocked: false, progress: 0, progressLabel: 'пока 0/1 раз' },
    { id: 'a13', emoji: '👥', title: 'Командный игрок', desc: 'Участвуйте в 3 командных турнирах', xp: 200, cat: 'social', unlocked: false, progress: 33, progressLabel: '1/3 турнира' },
    { id: 'a14', emoji: '🏆', title: 'Победитель', desc: 'Займите 1 место в любом турнире', xp: 500, cat: 'game', unlocked: false, progress: 0 },
    { id: 'a15', emoji: '🥈', title: 'Призёр', desc: 'Займите топ-3 в турнире', xp: 250, cat: 'game', unlocked: true, date: '5 мар 2025' },
    { id: 'a16', emoji: '🎮', title: 'Турнирный боец', desc: 'Примите участие в 5 турнирах', xp: 200, cat: 'game', unlocked: false, progress: 40, progressLabel: '2/5 турниров' },
    { id: 'a17', emoji: '⭐', title: 'Первые шаги', desc: 'Зарегистрируйтесь на платформе', xp: 10, cat: 'special', unlocked: true, date: '14 янв 2025' },
    { id: 'a18', emoji: '🌟', title: 'Ранний последователь', desc: 'Зарегистрируйтесь в первый месяц запуска', xp: 500, cat: 'special', unlocked: true, date: '14 янв 2025' },
    { id: 'a19', emoji: '🦄', title: 'Легенда', desc: 'Достигните 10 уровня', xp: 2000, cat: 'special', unlocked: false, progress: 60, progressLabel: 'Ур. 6/10' },
    { id: 'a20', emoji: '🚀', title: 'На старт!', desc: 'Выполните все задания на первой неделе', xp: 300, cat: 'special', unlocked: false, progress: 100, progressLabel: '5/5 заданий' },
]

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentAchievementsPage({ language, onLanguageChange }: Props) {
    const [activeCat, setActiveCat] = useState('all')
    const { level, levelTitle, xpInLevel, xpToNext, progress } = useXP()

    const unlocked = ACHIEVEMENTS.filter(a => a.unlocked)
    const locked = ACHIEVEMENTS.filter(a => !a.unlocked)

    const filtered = (activeCat === 'all'
        ? ACHIEVEMENTS
        : ACHIEVEMENTS.filter(a => a.cat === activeCat)
    ).sort((a, b) => Number(b.unlocked) - Number(a.unlocked))

    const totalXP = unlocked.reduce((s, a) => s + a.xp, 0)

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Достижения"
            activePage="achievements"
        >
            <div className="ach-page">

                {/* Hero */}
                <div className="ach-hero">
                    <div className="ach-hero-text">
                        <h1>🏆 Мои достижения</h1>
                        <p>Разблокируйте ачивки, учась каждый день. Каждое достижение приносит XP!</p>
                    </div>
                    <div className="ach-hero-badges">
                        <div className="ach-hero-stat">
                            <strong>{unlocked.length}</strong>
                            <span>получено</span>
                        </div>
                        <div className="ach-hero-stat">
                            <strong>{locked.length}</strong>
                            <span>осталось</span>
                        </div>
                        <div className="ach-hero-stat">
                            <strong>{totalXP.toLocaleString('ru')}</strong>
                            <span>XP заработано</span>
                        </div>
                    </div>
                </div>

                {/* XP Ring card */}
                <div className="ach-xp-card">
                    <div
                        className="ach-xp-ring"
                        style={{ '--p': progress } as React.CSSProperties}
                    >
                        <div className="ach-xp-ring-inner">
                            <span className="ach-xp-ring-level">{level}</span>
                            <span className="ach-xp-ring-label">УРОВЕНЬ</span>
                        </div>
                    </div>
                    <div className="ach-xp-info">
                        <div className="ach-xp-title">{levelTitle}</div>
                        <div className="ach-xp-sub">
                            {unlocked.length} из {ACHIEVEMENTS.length} достижений разблокировано
                        </div>
                        <div className="ach-xp-bar-wrap">
                            <div className="ach-xp-bar-track">
                                <div className="ach-xp-bar-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="ach-xp-bar-labels">
                                <span>{xpInLevel} XP</span>
                                <span>{xpToNext} XP до следующего уровня</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="ach-cats">
                    {CATS.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`ach-cat-btn${activeCat === cat.id ? ' active' : ''}`}
                            onClick={() => setActiveCat(cat.id)}
                        >
                            {cat.label}
                            <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.75 }}>
                                ({(cat.id === 'all' ? ACHIEVEMENTS
                                    : ACHIEVEMENTS.filter(a => a.cat === cat.id)).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="ach-grid">
                    {filtered.map(ach => (
                        <div
                            key={ach.id}
                            className={`ach-card${ach.unlocked ? ' unlocked' : ' locked'}`}
                        >
                            {!ach.unlocked && (
                                <span className="ach-card-lock">
                                    <Lock size={11} />
                                </span>
                            )}
                            <span className="ach-card-icon">{ach.emoji}</span>
                            <div className="ach-card-title">{ach.title}</div>
                            <div className="ach-card-desc">{ach.desc}</div>
                            <span className="ach-card-xp">
                                <Zap size={11} />
                                +{ach.xp} XP
                            </span>
                            {ach.unlocked && ach.date && (
                                <span className="ach-card-date">✓ {ach.date}</span>
                            )}
                            {!ach.unlocked && ach.progress !== undefined && ach.progress > 0 && (
                                <div className="ach-card-progress">
                                    <div className="ach-card-prog-bar">
                                        <div
                                            className="ach-card-prog-fill"
                                            style={{ width: `${ach.progress}%` }}
                                        />
                                    </div>
                                    <div className="ach-card-prog-label">{ach.progressLabel}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </CourseShellLayout>
    )
}
