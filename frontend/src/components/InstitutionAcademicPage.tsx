import { useMemo, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type Conflict = {
    id: string
    className: string
    subject: string
    teacher: string
    slot: string
    status: 'open' | 'resolved'
}

type PlanProgress = {
    id: string
    subject: string
    className: string
    plannedHours: number
    actualHours: number
}

const INITIAL_CONFLICTS: Conflict[] = [
    { id: 'cf1', className: '9А', subject: 'Алгебра', teacher: 'А. Сейтказина', slot: 'Пн 10:00', status: 'open' },
    { id: 'cf2', className: '8Б', subject: 'Физика', teacher: 'Р. Байтенов', slot: 'Вт 12:00', status: 'open' },
    { id: 'cf3', className: '10А', subject: 'Химия', teacher: 'И. Сарсенов', slot: 'Ср 09:00', status: 'resolved' },
]

const INITIAL_PROGRESS: PlanProgress[] = [
    { id: 'p1', subject: 'Алгебра', className: '8А', plannedHours: 128, actualHours: 112 },
    { id: 'p2', subject: 'Физика', className: '10А', plannedHours: 96, actualHours: 96 },
    { id: 'p3', subject: 'Английский', className: '7Б', plannedHours: 102, actualHours: 109 },
]

export function InstitutionAcademicPage({ language, onLanguageChange }: Props) {
    const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS)
    const [progress, setProgress] = useState<PlanProgress[]>(INITIAL_PROGRESS)

    const openConflicts = useMemo(() => conflicts.filter((c) => c.status === 'open').length, [conflicts])
    const avgExecution = useMemo(() => {
        const values = progress.map((p) => Math.min(100, Math.round((p.actualHours / p.plannedHours) * 100)))
        if (values.length === 0) return 0
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    }, [progress])

    function resolveConflict(id: string) {
        setConflicts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'resolved' } : c)))
    }

    function shiftActualHours(id: string, delta: number) {
        setProgress((prev) => prev.map((p) => (p.id === id ? { ...p, actualHours: Math.max(0, p.actualHours + delta) } : p)))
    }

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Учебный процесс"
            subtitle="Планы, нагрузка, расписание и контроль исполнения"
            activePage="i-academic"
        >
            <section className="inst-grid-3">
                <article className="inst-card">
                    <p className="inst-card-label">Учебных планов</p>
                    <p className="inst-card-value">42</p>
                    <p className="inst-card-note">На 2025/26 учебный год</p>
                </article>
                <article className="inst-card">
                    <p className="inst-card-label">Конфликтов расписания</p>
                    <p className="inst-card-value">{openConflicts}</p>
                    <p className="inst-card-note">Требуют корректировки кабинетов</p>
                </article>
                <article className="inst-card">
                    <p className="inst-card-label">Выполнение плана</p>
                    <p className="inst-card-value">{avgExecution}%</p>
                    <p className="inst-card-note">Средний показатель по учреждению</p>
                </article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Нагрузка учителей</h3>
                    <ul className="inst-list">
                        <li>12 учителей в безопасной зоне: до 24 часов/нед</li>
                        <li>6 учителей на верхней границе: 28-30 часов/нед</li>
                        <li>2 учителя с перегрузкой: 31+ часов/нед</li>
                        <li>Рекомендация: перераспределить 9 часов в параллели 9-х классов</li>
                    </ul>
                </article>

                <article className="inst-card tall">
                    <h3>Контроль выполнения тем</h3>
                    <div className="inst-table-like">
                        {progress.map((p) => {
                            const percent = Math.min(100, Math.round((p.actualHours / p.plannedHours) * 100))
                            return (
                                <div key={p.id} className="inst-row">
                                    <strong>{p.subject} · {p.className}</strong>
                                    <span>{p.actualHours} / {p.plannedHours} часов · {percent}%</span>
                                    <div className="inst-toolbar">
                                        <button type="button" className="inst-btn ghost" onClick={() => shiftActualHours(p.id, -1)}>-1ч</button>
                                        <button type="button" className="inst-btn ghost" onClick={() => shiftActualHours(p.id, 1)}>+1ч</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </article>
            </section>

            <section className="inst-grid-1">
                <article className="inst-card">
                    <h3>Конфликты расписания</h3>
                    <div className="inst-table-like">
                        {conflicts.map((c) => (
                            <div key={c.id} className="inst-row">
                                <strong>{c.subject} · {c.className}</strong>
                                <span>{c.teacher} · {c.slot}</span>
                                <div className="inst-toolbar">
                                    <span className={c.status === 'resolved' ? 'inst-chip ok' : 'inst-chip'}>{c.status === 'resolved' ? 'Решен' : 'Открыт'}</span>
                                    {c.status === 'open' && (
                                        <button type="button" className="inst-btn" onClick={() => resolveConflict(c.id)}>Отметить решенным</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
