import { useState } from 'react'
import { Clock, Trophy, Users, Zap } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────────────── */
type TournStatus = 'active' | 'upcoming' | 'ended'
type TournTab = 'active' | 'mine' | 'results'

interface Tournament {
    id: string
    title: string
    subject: string
    subjectColor: string
    subjectBg: string
    prize: string
    participants: number
    maxParticipants: number
    deadline: string
    status: TournStatus
    featured?: boolean
    entered: boolean
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const INITIAL: Tournament[] = [
    {
        id: '1', title: 'Math Battle 2026',
        subject: 'Математика', subjectColor: '#1d4ed8', subjectBg: '#dbeafe',
        prize: '+500 XP + Диплом',
        participants: 48, maxParticipants: 100,
        deadline: '5 апр 2026', status: 'active', featured: true, entered: false,
    },
    {
        id: '2', title: 'Олимпиада по физике',
        subject: 'Физика', subjectColor: '#b45309', subjectBg: '#fef3c7',
        prize: '+300 XP',
        participants: 32, maxParticipants: 60,
        deadline: '8 апр 2026', status: 'active', entered: true,
    },
    {
        id: '3', title: 'Code & AI Challenge',
        subject: 'Информатика', subjectColor: '#6d28d9', subjectBg: '#ede9fe',
        prize: 'Сертификат + 200 XP',
        participants: 120, maxParticipants: 200,
        deadline: '15 апр 2026', status: 'upcoming', entered: false,
    },
    {
        id: '4', title: 'Литературный марафон',
        subject: 'Литература', subjectColor: '#065f46', subjectBg: '#d1fae5',
        prize: '+200 XP',
        participants: 67, maxParticipants: 120,
        deadline: '20 апр 2026', status: 'upcoming', entered: false,
    },
    {
        id: '5', title: 'Химическая олимпиада',
        subject: 'Химия', subjectColor: '#9d174d', subjectBg: '#fce7f3',
        prize: '+150 XP + Грамота',
        participants: 45, maxParticipants: 45,
        deadline: '2 апр 2026', status: 'ended', entered: true,
    },
]

const LEADERBOARD = [
    { rank: 1, name: 'Алина К.', xp: 2840, color: '#fbbf24', medal: '🥇', me: false },
    { rank: 2, name: 'Денис Р.', xp: 2620, color: '#94a3b8', medal: '🥈', me: false },
    { rank: 3, name: 'Вы', xp: 2480, color: '#43c38d', medal: '🥉', me: true },
    { rank: 4, name: 'Санжар М.', xp: 2100, color: '#818cf8', medal: '4', me: false },
    { rank: 5, name: 'Лейла Т.', xp: 1890, color: '#fb923c', medal: '5', me: false },
]

const STATUS_MAP: Record<TournStatus, { label: string; cls: string }> = {
    active: { label: '● Активен', cls: 'active' },
    upcoming: { label: '◷ Скоро', cls: 'upcoming' },
    ended: { label: '✓ Завершён', cls: 'ended' },
}

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentTournamentsPage({ language, onLanguageChange }: Props) {
    const [tab, setTab] = useState<TournTab>('active')
    const [tournaments, setTournaments] = useState(INITIAL)

    const enter = (id: string) => {
        setTournaments(prev =>
            prev.map(t => t.id === id ? { ...t, entered: true, participants: t.participants + 1 } : t)
        )
    }

    const filtered = tournaments.filter(t => {
        if (tab === 'active') return t.status === 'active' || t.status === 'upcoming'
        if (tab === 'mine') return t.entered
        if (tab === 'results') return t.status === 'ended'
        return true
    })

    const activeCnt = tournaments.filter(t => t.status === 'active' || t.status === 'upcoming').length
    const mineCnt = tournaments.filter(t => t.entered).length
    const resultsCnt = tournaments.filter(t => t.status === 'ended').length

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Турниры"
            activePage="tournaments"
        >
            <div className="tourn-page">
                {/* ── Left column ── */}
                <div className="tourn-main">

                    {/* Hero */}
                    <div className="tourn-header">
                        <div className="tourn-header-left">
                            <h2>🏆 Турниры EduFuture</h2>
                            <p>Соревнуйтесь с другими студентами и зарабатывайте XP, дипломы и сертификаты</p>
                        </div>
                        <div className="tourn-header-stats">
                            <div className="tourn-hstat">
                                <span className="tourn-hstat-num">{activeCnt}</span>
                                <span className="tourn-hstat-label">активных</span>
                            </div>
                            <div className="tourn-hstat">
                                <span className="tourn-hstat-num">{mineCnt}</span>
                                <span className="tourn-hstat-label">моих</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tourn-tabs">
                        {([
                            ['active', 'Активные', activeCnt],
                            ['mine', 'Мои', mineCnt],
                            ['results', 'Результаты', resultsCnt],
                        ] as [TournTab, string, number][]).map(([id, label, count]) => (
                            <button
                                key={id}
                                type="button"
                                className={`tourn-tab${tab === id ? ' active' : ''}`}
                                onClick={() => setTab(id)}
                            >
                                {label}
                                <span className="tourn-tab-count">{count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Cards */}
                    <div className="tourn-grid">
                        {filtered.map(t => {
                            const st = STATUS_MAP[t.status]
                            const full = t.participants >= t.maxParticipants && !t.entered
                            return (
                                <div key={t.id} className={`tourn-card${t.featured ? ' featured' : ''}`}>
                                    <div className="tourn-card-top">
                                        <span className="tourn-subject-badge" style={{ background: t.subjectBg, color: t.subjectColor }}>
                                            {t.subject}
                                        </span>
                                        <span className={`tourn-status-chip ${st.cls}`}>{st.label}</span>
                                    </div>

                                    <p className="tourn-card-title">{t.title}</p>

                                    <div className="tourn-card-prize">
                                        <Zap size={14} /> {t.prize}
                                    </div>

                                    <div className="tourn-card-meta">
                                        <div className="tourn-meta-row">
                                            <Users size={12} />
                                            <span>{t.participants} / {t.maxParticipants} участников</span>
                                        </div>
                                        <div className="tourn-meta-row">
                                            <Clock size={12} />
                                            <span>Дедлайн: {t.deadline}</span>
                                        </div>
                                    </div>

                                    <div className="tourn-card-footer">
                                        <span className="tourn-participant-count">
                                            {t.entered
                                                ? '✓ Вы участвуете'
                                                : full
                                                    ? 'Нет мест'
                                                    : `${t.maxParticipants - t.participants} мест`}
                                        </span>
                                        {t.status !== 'ended' ? (
                                            <button
                                                type="button"
                                                className={`tourn-enter-btn${t.entered ? ' entered' : ''}`}
                                                onClick={() => { if (!t.entered && !full) enter(t.id) }}
                                                disabled={full}
                                            >
                                                {t.entered ? 'Участвую ✓' : 'Участвовать'}
                                            </button>
                                        ) : (
                                            <span className="tourn-enter-btn" style={{ background: '#f1f5f9', color: '#9ca3af', boxShadow: 'none', cursor: 'default', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                                                Завершён
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 14 }}>
                                Нет турниров в этой категории
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <aside className="tourn-sidebar">
                    <div className="tourn-leaderboard">
                        <h3 className="tourn-lb-title">
                            <Trophy size={16} color="#f59e0b" /> Math Battle — Топ 5
                        </h3>
                        <div className="tourn-lb-list">
                            {LEADERBOARD.map(entry => (
                                <div key={entry.rank} className={`tourn-lb-row${entry.me ? ' me' : ''}`}>
                                    <span className="tourn-lb-rank">{entry.medal}</span>
                                    <div className="tourn-lb-avatar" style={{ background: entry.color }}>
                                        {entry.name[0]}
                                    </div>
                                    <span className={`tourn-lb-name${entry.me ? ' me' : ''}`}>{entry.name}</span>
                                    <span className="tourn-lb-xp">{entry.xp.toLocaleString()} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tourn-my-stats">
                        <h3 className="tourn-my-stats-title">Моя статистика</h3>
                        <div className="tourn-my-stat-row">
                            <span>Участий всего</span>
                            <strong>{mineCnt}</strong>
                        </div>
                        <div className="tourn-my-stat-row">
                            <span>Побед</span>
                            <strong>2</strong>
                        </div>
                        <div className="tourn-my-stat-row">
                            <span>XP из турниров</span>
                            <strong>+1 200 XP</strong>
                        </div>
                        <div className="tourn-my-stat-row">
                            <span>Лучшее место</span>
                            <strong>🥇 1-е</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </CourseShellLayout>
    )
}
