import { useEffect, useState } from 'react'
import { Target, CheckCircle, Gift, Trash2 } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'
import { parent as parentApi, type ParentGoal, type ParentChild } from '../lib/api'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function ParentMotivationPage({ language, onLanguageChange }: Props) {
    const [children, setChildren] = useState<ParentChild[]>([])
    const [selectedChild, setSelectedChild] = useState<string | null>(null)
    const [goals, setGoals] = useState<ParentGoal[]>([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', targetXp: '100', reward: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        parentApi.children().then(kids => {
            setChildren(kids)
            if (kids.length > 0) setSelectedChild(kids[0].student.id)
        }).catch(() => { })
    }, [])

    useEffect(() => {
        if (!selectedChild) return
        parentApi.goals(selectedChild).then(setGoals).catch(() => { })
        parentApi.checkGoals(selectedChild).catch(() => { })
    }, [selectedChild])

    const active = goals.filter(g => !g.achieved)
    const completed = goals.filter(g => g.achieved)

    const childName = children.find(c => c.student.id === selectedChild)?.student.firstName ?? ''

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title.trim() || !selectedChild) return
        setSaving(true)
        try {
            const created = await parentApi.createGoal({
                studentId: selectedChild,
                title: form.title,
                description: form.description || undefined,
                targetXp: Number(form.targetXp) || 100,
                reward: form.reward || undefined,
            })
            setGoals(prev => [created, ...prev])
            setShowForm(false)
            setForm({ title: '', description: '', targetXp: '100', reward: '' })
        } catch { /* ignore */ }
        setSaving(false)
    }

    async function handleDelete(id: string) {
        try {
            await parentApi.deleteGoal(id)
            setGoals(prev => prev.filter(g => g.id !== id))
        } catch { /* ignore */ }
    }

    async function handleToggleAchieved(id: string, achieved: boolean) {
        try {
            const updated = await parentApi.updateGoal(id, { achieved })
            setGoals(prev => prev.map(g => g.id === id ? updated : g))
        } catch { /* ignore */ }
    }

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Мотивация"
            subtitle={childName ? `Цели и награды для ${childName}` : 'Цели и награды'}
            activePage="p-motivation"
        >
            {/* Child selector */}
            {children.length > 1 && (
                <div className="pm-header-row" style={{ gap: 8 }}>
                    {children.map(c => (
                        <button
                            key={c.student.id}
                            type="button"
                            className={`pm-add-btn${selectedChild === c.student.id ? '' : ' secondary'}`}
                            onClick={() => setSelectedChild(c.student.id)}
                        >
                            {c.student.firstName}
                        </button>
                    ))}
                </div>
            )}

            {/* Create goal button */}
            <div className="pm-header-row">
                <button type="button" className="pm-add-btn" onClick={() => setShowForm(v => !v)}>
                    <Target size={15} /> {showForm ? 'Отмена' : 'Создать цель'}
                </button>
            </div>

            {/* Inline creation form */}
            {showForm && (
                <form className="pm-form" onSubmit={handleSubmit}>
                    <h3 className="pm-form-title">Новая цель</h3>
                    <div className="pm-form-grid">
                        <label>
                            Название
                            <input
                                className="pm-input"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="Например: Набрать 500 XP"
                                required
                            />
                        </label>
                        <label>
                            Целевой XP
                            <input
                                className="pm-input"
                                type="number" min={1}
                                value={form.targetXp}
                                onChange={e => setForm(f => ({ ...f, targetXp: e.target.value }))}
                            />
                        </label>
                        <label className="pm-full">
                            Описание
                            <input
                                className="pm-input"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Что должен сделать ребёнок"
                            />
                        </label>
                        <label className="pm-full">
                            Награда
                            <input
                                className="pm-input"
                                value={form.reward}
                                onChange={e => setForm(f => ({ ...f, reward: e.target.value }))}
                                placeholder="Поход в кино, новая игра…"
                            />
                        </label>
                    </div>
                    <button type="submit" className="pm-submit-btn" disabled={saving}>
                        {saving ? 'Сохранение...' : 'Сохранить цель'}
                    </button>
                </form>
            )}

            {/* Active goals */}
            <h3 className="pm-section-title">
                <Target size={16} /> Активные цели
                <span className="pm-count">{active.length}</span>
            </h3>
            <div className="pm-goals-list">
                {active.length === 0 && (
                    <p style={{ color: '#9ca3af', fontSize: 14, padding: '20px 0' }}>Нет активных целей. Создайте первую!</p>
                )}
                {active.map(g => (
                    <div key={g.id} className="pm-goal-card">
                        <div className="pm-goal-head">
                            <span className="pm-type-chip">🎯 {g.targetXp} XP</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button type="button" className="pm-days-left" onClick={() => handleToggleAchieved(g.id, true)} title="Отметить выполненной">
                                    <CheckCircle size={14} /> Выполнено
                                </button>
                                <button type="button" className="pm-days-left" style={{ color: '#ef4444' }} onClick={() => handleDelete(g.id)} title="Удалить">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="pm-goal-title">{g.title}</p>
                        {g.description && <p className="pm-goal-cond">{g.description}</p>}
                        {g.reward && (
                            <div className="pm-goal-footer">
                                <span className="pm-reward-pill">
                                    <Gift size={12} /> {g.reward}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Completed goals */}
            {completed.length > 0 && (
                <>
                    <h3 className="pm-section-title">
                        <CheckCircle size={16} className="green" /> Выполненные цели
                        <span className="pm-count">{completed.length}</span>
                    </h3>
                    <div className="pm-done-list">
                        {completed.map(g => (
                            <div key={g.id} className="pm-done-card">
                                <CheckCircle size={16} className="green" />
                                <div>
                                    <p className="pm-done-title">{g.title}</p>
                                    <p className="pm-done-meta">
                                        🎯 {g.targetXp} XP{g.achievedAt ? ` · выполнено ${new Date(g.achievedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}` : ''}
                                    </p>
                                </div>
                                {g.reward && (
                                    <span className="pm-reward-pill">
                                        <Gift size={12} /> {g.reward}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* XP info card */}
            <div className="pm-xp-info">
                <p className="pm-xp-title">🎮 Как работают цели?</p>
                <p className="pm-xp-text">
                    Цели привязаны к XP ребёнка. Когда ребёнок наберёт достаточно XP,
                    цель автоматически отмечается как выполненная. Вы также можете отметить
                    выполнение вручную.
                </p>
            </div>
        </ParentShellLayout>
    )
}
