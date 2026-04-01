import { useEffect, useMemo, useState } from 'react'
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

const ACADEMIC_STORAGE_KEY = 'institution-academic-v1'

export function InstitutionAcademicPage({ language, onLanguageChange }: Props) {
    const [conflicts, setConflicts] = useState<Conflict[]>(() => {
        try {
            const saved = localStorage.getItem(ACADEMIC_STORAGE_KEY)
            if (!saved) return INITIAL_CONFLICTS
            return (JSON.parse(saved) as { conflicts: Conflict[] }).conflicts
        } catch {
            return INITIAL_CONFLICTS
        }
    })
    const [progress, setProgress] = useState<PlanProgress[]>(() => {
        try {
            const saved = localStorage.getItem(ACADEMIC_STORAGE_KEY)
            if (!saved) return INITIAL_PROGRESS
            return (JSON.parse(saved) as { progress: PlanProgress[] }).progress
        } catch {
            return INITIAL_PROGRESS
        }
    })
    const [conflictModalOpen, setConflictModalOpen] = useState(false)
    const [newConflict, setNewConflict] = useState({ className: '', subject: '', teacher: '', slot: '' })

    useEffect(() => {
        localStorage.setItem(ACADEMIC_STORAGE_KEY, JSON.stringify({ conflicts, progress }))
    }, [conflicts, progress])

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

    function addConflict() {
        if (!newConflict.className.trim() || !newConflict.subject.trim() || !newConflict.teacher.trim() || !newConflict.slot.trim()) return
        setConflicts((prev) => [
            {
                id: `cf${Date.now()}`,
                className: newConflict.className.trim(),
                subject: newConflict.subject.trim(),
                teacher: newConflict.teacher.trim(),
                slot: newConflict.slot.trim(),
                status: 'open',
            },
            ...prev,
        ])
        setNewConflict({ className: '', subject: '', teacher: '', slot: '' })
        setConflictModalOpen(false)
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
                    <div className="inst-toolbar">
                        <button type="button" className="inst-btn" onClick={() => setConflictModalOpen(true)}>Добавить конфликт</button>
                    </div>
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

            {conflictModalOpen && (
                <div className="inst-modal-backdrop" onClick={() => setConflictModalOpen(false)}>
                    <div className="inst-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="inst-modal-head">
                            <h3>Новый конфликт расписания</h3>
                            <button type="button" className="inst-btn ghost" onClick={() => setConflictModalOpen(false)}>Закрыть</button>
                        </div>
                        <div className="inst-form-grid">
                            <input className="inst-input" placeholder="Класс" value={newConflict.className} onChange={(e) => setNewConflict((prev) => ({ ...prev, className: e.target.value }))} />
                            <input className="inst-input" placeholder="Предмет" value={newConflict.subject} onChange={(e) => setNewConflict((prev) => ({ ...prev, subject: e.target.value }))} />
                            <input className="inst-input" placeholder="Учитель" value={newConflict.teacher} onChange={(e) => setNewConflict((prev) => ({ ...prev, teacher: e.target.value }))} />
                            <input className="inst-input" placeholder="Слот (например Пн 10:00)" value={newConflict.slot} onChange={(e) => setNewConflict((prev) => ({ ...prev, slot: e.target.value }))} />
                        </div>
                        <div className="inst-toolbar end">
                            <button type="button" className="inst-btn ghost" onClick={() => setConflictModalOpen(false)}>Отмена</button>
                            <button type="button" className="inst-btn" onClick={addConflict}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </InstitutionShellLayout>
    )
}
