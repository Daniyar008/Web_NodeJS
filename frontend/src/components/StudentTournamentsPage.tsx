import { useEffect, useState } from 'react'
import { Clock, Trophy, Users, Zap } from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { tournaments as tournamentApi } from '../lib/api'
import type { Tournament as ApiTournament, LeaderboardEntry } from '../lib/api'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────────────── */
type TournStatus = 'active' | 'upcoming' | 'ended'
type TournTab = 'active' | 'mine' | 'results'

interface LocalTournament {
    id: string
    title: string
    description: string
    participants: number
    deadline: string
    status: TournStatus
    entered: boolean
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function mapStatus(s: string): TournStatus {
    if (s === 'ACTIVE') return 'active'
    if (s === 'UPCOMING') return 'upcoming'
    return 'ended'
}

function apiToLocal(t: ApiTournament): LocalTournament {
    return {
        id: t.id,
        title: t.title,
        description: t.description ?? '',
        participants: t._count?.participants ?? 0,
        deadline: new Date(t.endsAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: mapStatus(t.status),
        entered: !!t.joined,
    }
}

function medalFor(rank: number): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return String(rank)
}
const RANK_COLORS = ['#fbbf24', '#94a3b8', '#43c38d', '#818cf8', '#fb923c']

const STATUS_MAP: Record<TournStatus, { label: string; cls: string }> = {
    active: { label: '● Активен', cls: 'active' },
    upcoming: { label: '◷ Скоро', cls: 'upcoming' },
    ended: { label: '✓ Завершён', cls: 'ended' },
}

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function StudentTournamentsPage({ language, onLanguageChange }: Props) {
    const [tab, setTab] = useState<TournTab>('active')
    const [tournaments, setTournaments] = useState<LocalTournament[]>([])
    const [leaderboard, setLeaderboard] = useState<(LeaderboardEntry & { me: boolean })[]>([])
    const [lbTitle, setLbTitle] = useState('Топ 5')

    // Load tournaments from API
    useEffect(() => {
        tournamentApi.list().then(arr => setTournaments(arr.map(apiToLocal))).catch(() => { })
    }, [])

    // Load leaderboard for the first active tournament
    useEffect(() => {
        const active = tournaments.find(t => t.status === 'active')
        if (!active) return
        setLbTitle(`${active.title} — Топ 5`)
        const myId = localStorage.getItem('estudy-user-id') ?? ''
        tournamentApi.leaderboard(active.id).then(rows => {
            setLeaderboard(rows.slice(0, 5).map(r => ({
                ...r,
                me: r.user.id === myId,
            })))
        }).catch(() => { })
    }, [tournaments])

    const enter = async (id: string) => {
        try {
            await tournamentApi.join(id)
            setTournaments(prev =>
                prev.map(t => t.id === id ? { ...t, entered: true, participants: t.participants + 1 } : t)
            )
        } catch { /* already joined or finished */ }
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
                            return (
                                <div key={t.id} className="tourn-card">
                                    <div className="tourn-card-top">
                                        <span className={`tourn-status-chip ${st.cls}`}>{st.label}</span>
                                    </div>

                                    <p className="tourn-card-title">{t.title}</p>

                                    {t.description && (
                                        <div className="tourn-card-prize">
                                            <Zap size={14} /> {t.description}
                                        </div>
                                    )}

                                    <div className="tourn-card-meta">
                                        <div className="tourn-meta-row">
                                            <Users size={12} />
                                            <span>{t.participants} участников</span>
                                        </div>
                                        <div className="tourn-meta-row">
                                            <Clock size={12} />
                                            <span>Дедлайн: {t.deadline}</span>
                                        </div>
                                    </div>

                                    <div className="tourn-card-footer">
                                        <span className="tourn-participant-count">
                                            {t.entered ? '✓ Вы участвуете' : ''}
                                        </span>
                                        {t.status !== 'ended' ? (
                                            <button
                                                type="button"
                                                className={`tourn-enter-btn${t.entered ? ' entered' : ''}`}
                                                onClick={() => { if (!t.entered) enter(t.id) }}
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
                            <Trophy size={16} color="#f59e0b" /> {lbTitle}
                        </h3>
                        <div className="tourn-lb-list">
                            {leaderboard.length === 0 && (
                                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, padding: 12 }}>Нет результатов</div>
                            )}
                            {leaderboard.map((entry, i) => {
                                const name = entry.me ? 'Вы' : `${entry.user.firstName} ${entry.user.lastName.charAt(0)}.`
                                return (
                                    <div key={entry.rank} className={`tourn-lb-row${entry.me ? ' me' : ''}`}>
                                        <span className="tourn-lb-rank">{medalFor(entry.rank)}</span>
                                        <div className="tourn-lb-avatar" style={{ background: RANK_COLORS[i % RANK_COLORS.length] }}>
                                            {name[0]}
                                        </div>
                                        <span className={`tourn-lb-name${entry.me ? ' me' : ''}`}>{name}</span>
                                        <span className="tourn-lb-xp">{entry.score.toLocaleString()}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="tourn-my-stats">
                        <h3 className="tourn-my-stats-title">Моя статистика</h3>
                        <div className="tourn-my-stat-row">
                            <span>Участий всего</span>
                            <strong>{mineCnt}</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </CourseShellLayout>
    )
}
