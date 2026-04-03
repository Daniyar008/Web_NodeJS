import { useEffect, useState } from 'react'
import { Lock, Zap } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { useXP } from '../lib/xpStore'
import { student } from '../lib/api'
import type { ApiAchievement } from '../lib/api'
import type { Language } from '../i18n/translations'

/* ── Types ─────────────────────────────────────────────────────── */
interface LocalAch {
    id: string
    emoji: string
    title: string
    desc: string
    xp: number
    cat: string
    unlocked: boolean
    date?: string
}

const CAT_MAP: Record<string, string> = {
    LEARNING: 'study',
    STREAK: 'streak',
    TESTS: 'game',
    SOCIAL: 'social',
}

const CATS = [
    { id: 'all', label: 'Все' },
    { id: 'study', label: '📚 Учёба' },
    { id: 'streak', label: '🔥 Серия' },
    { id: 'social', label: '💬 Социальные' },
    { id: 'game', label: '🏆 Игровые' },
]

function apiToLocal(a: ApiAchievement, unlockedMap: Map<string, string>): LocalAch {
    const unlockedAt = unlockedMap.get(a.id)
    return {
        id: a.id,
        emoji: a.icon ?? '🏅',
        title: a.title,
        desc: a.description,
        xp: a.xpReward,
        cat: CAT_MAP[a.category] ?? 'study',
        unlocked: !!unlockedAt,
        date: unlockedAt
            ? new Date(unlockedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
            : undefined,
    }
}

/* ── Component ─────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentAchievementsPage({ language, onLanguageChange }: Props) {
    const [activeCat, setActiveCat] = useState('all')
    const [achievements, setAchievements] = useState<LocalAch[]>([])
    const { level, levelTitle, xpInLevel, xpToNext, progress } = useXP()

    useEffect(() => {
        student.achievements().then(data => {
            const unlockedMap = new Map(data.unlocked.map(u => [u.achievementId, u.unlockedAt]))
            setAchievements(data.all.map(a => apiToLocal(a, unlockedMap)))
        }).catch(() => {})
    }, [])

    const unlocked = achievements.filter(a => a.unlocked)
    const locked = achievements.filter(a => !a.unlocked)

    const filtered = (activeCat === 'all'
        ? achievements
        : achievements.filter(a => a.cat === activeCat)
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
                            {unlocked.length} из {achievements.length} достижений разблокировано
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
                                ({(cat.id === 'all' ? achievements
                                    : achievements.filter(a => a.cat === cat.id)).length})
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
                        </div>
                    ))}
                </div>
            </div>
        </CourseShellLayout>
    )
}
