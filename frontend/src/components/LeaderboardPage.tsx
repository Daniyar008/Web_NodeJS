import { useEffect, useState } from 'react'
import { Trophy, Zap } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { tournaments as tourApi, type Tournament, type LeaderboardEntry } from '../lib/api'
import { RoleShellLayout } from './RoleShellLayout'

type Student = { rank: number; name: string; xp: number; level: number; courses: number; avatar: string }

const FALLBACK: Student[] = [
    { rank: 1, name: 'Аиша Тулегенова', xp: 45200, level: 28, courses: 12, avatar: 'АТ' },
    { rank: 2, name: 'Нурсултан Ахметов', xp: 42100, level: 26, courses: 11, avatar: 'НА' },
    { rank: 3, name: 'Диана Сейткали', xp: 39800, level: 24, courses: 10, avatar: 'ДС' },
    { rank: 4, name: 'Марат Берденов', xp: 35600, level: 21, courses: 9, avatar: 'МБ' },
    { rank: 5, name: 'Зарина Кенжебаева', xp: 32400, level: 19, courses: 8, avatar: 'ЗК' },
]

function entryToStudent(e: LeaderboardEntry): Student {
    const name = `${e.user.firstName} ${e.user.lastName}`.trim()
    return { rank: e.rank, name, xp: e.score, level: 0, courses: 0, avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }
}

export function LeaderboardPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month')
    const [leaders, setLeaders] = useState<Student[]>(FALLBACK)
    const [, setTournamentList] = useState<Tournament[]>([])

    useEffect(() => {
        tourApi.list().then((list) => {
            setTournamentList(list)
            const active = list.find(t => t.status === 'ACTIVE') ?? list[0]
            if (active) {
                tourApi.leaderboard(active.id).then((entries) => {
                    if (entries.length > 0) setLeaders(entries.map(entryToStudent))
                }).catch(() => { /* keep fallback */ })
            }
        }).catch(() => { /* keep fallback */ })
    }, [])

    return (
        <RoleShellLayout language={language} onLanguageChange={onLanguageChange}>
            <div className="lb-root">
                <div className="lb-header">
                    <div>
                        <h1 className="lb-title">Глобальный лидерборд</h1>
                        <p className="lb-sub">Лучшие студенты платформы EduFuture</p>
                    </div>
                    <Trophy size={40} color="#f59e0b" />
                </div>

                <div className="lb-filters">
                    {(['week', 'month', 'all'] as const).map(p => (
                        <button key={p} type="button" className={period === p ? 'lb-filter active' : 'lb-filter'} onClick={() => setPeriod(p)}>
                            {p === 'week' ? 'За неделю' : p === 'month' ? 'За месяц' : 'Всё время'}
                        </button>
                    ))}
                </div>

                <div className="lb-table">
                    <div className="lb-header-row">
                        <span className="lb-col-rank">Место</span>
                        <span className="lb-col-name">Имя</span>
                        <span className="lb-col-stat"><Zap size={12} /> XP</span>
                        <span className="lb-col-stat">Уровень</span>
                        <span className="lb-col-stat">Курсы</span>
                    </div>
                    {leaders.map((s) => (
                        <div key={s.rank} className={`lb-row ${s.rank <= 3 ? `top${s.rank}` : ''}`}>
                            <span className="lb-col-rank">
                                {s.rank === 1 && '🥇'} {s.rank === 2 && '🥈'} {s.rank === 3 && '🥉'} {s.rank > 3 && <span className="lb-rank-num">#{s.rank}</span>}
                            </span>
                            <span className="lb-col-name">
                                <span className={`lb-avatar rank${s.rank}`}>{s.avatar}</span>
                                <span>{s.name}</span>
                            </span>
                            <span className="lb-col-stat">
                                <Zap size={12} /> {s.xp.toLocaleString()}
                            </span>
                            <span className="lb-col-stat">⭐ {s.level}</span>
                            <span className="lb-col-stat">{s.courses}</span>
                        </div>
                    ))}
                </div>
            </div>
        </RoleShellLayout>
    )
}
