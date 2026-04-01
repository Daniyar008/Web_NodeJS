import { useState } from 'react'
import { Target, CheckCircle, Gift } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type GoalType = 'academic' | 'attendance' | 'achievement' | 'complex'

interface Goal {
    id: number; title: string; type: GoalType; condition: string
    progress: number; reward: string; rewardType: 'virtual' | 'real'
    daysLeft: number; done: boolean; doneDate?: string
}

const GOAL_TYPE_LABEL: Record<GoalType, string> = {
    academic: '📖 Учёба', attendance: '📅 Посещаемость',
    achievement: '🏆 Достижения', complex: '🌟 Комплексная',
}

const INITIAL_GOALS: Goal[] = [
    {
        id: 1, title: 'Улучшить оценку по математике', type: 'academic',
        condition: 'Получить 5 за контрольную работу', progress: 60,
        reward: '+50 бонусных баллов', rewardType: 'virtual', daysLeft: 5, done: false,
    },
    {
        id: 2, title: 'Не пропускать школу месяц', type: 'attendance',
        condition: 'Посещаемость 100% в апреле', progress: 80,
        reward: 'Поход в кино', rewardType: 'real', daysLeft: 10, done: false,
    },
    {
        id: 3, title: 'Выиграть турнир по математике', type: 'achievement',
        condition: 'Занять 1–3 место в весенней олимпиаде', progress: 40,
        reward: 'Значок «Чемпион» + 100 XP', rewardType: 'virtual', daysLeft: 18, done: false,
    },
    {
        id: 4, title: 'Выполнить все ДЗ за неделю', type: 'complex',
        condition: 'Сдать все задания без просрочек с 15 по 21 апреля', progress: 100,
        reward: '+25 баллов + новый значок', rewardType: 'virtual', daysLeft: 0, done: true, doneDate: '21 апр',
    },
    {
        id: 5, title: 'Читать каждый день', type: 'academic',
        condition: 'Прочитать 2 книги до конца месяца', progress: 100,
        reward: 'Новая книга на выбор', rewardType: 'real', daysLeft: 0, done: true, doneDate: '15 мар',
    },
]

export function ParentMotivationPage({ language, onLanguageChange }: Props) {
    const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        title: '', type: 'academic' as GoalType,
        condition: '', reward: '', rewardType: 'virtual' as 'virtual' | 'real',
        daysLeft: '14',
    })

    const active = goals.filter((g) => !g.done)
    const completed = goals.filter((g) => g.done)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.title.trim() || !form.condition.trim()) return
        setGoals((prev) => [
            ...prev,
            {
                id: Date.now(), title: form.title, type: form.type,
                condition: form.condition, progress: 0,
                reward: form.reward || 'Не указана', rewardType: form.rewardType,
                daysLeft: Number(form.daysLeft) || 14, done: false,
            },
        ])
        setShowForm(false)
        setForm({ title: '', type: 'academic', condition: '', reward: '', rewardType: 'virtual', daysLeft: '14' })
    }

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Мотивация"
            subtitle="Цели и награды для Анны"
            activePage="p-motivation"
        >
            {/* Create goal button */}
            <div className="pm-header-row">
                <button
                    type="button"
                    className="pm-add-btn"
                    onClick={() => setShowForm((v) => !v)}
                >
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
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                placeholder="Например: Получить пятёрку по физике"
                                required
                            />
                        </label>
                        <label>
                            Тип цели
                            <select
                                className="pm-input"
                                value={form.type}
                                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as GoalType }))}
                            >
                                {(Object.keys(GOAL_TYPE_LABEL) as GoalType[]).map((t) => (
                                    <option key={t} value={t}>{GOAL_TYPE_LABEL[t]}</option>
                                ))}
                            </select>
                        </label>
                        <label className="pm-full">
                            Условие
                            <input
                                className="pm-input"
                                value={form.condition}
                                onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                                placeholder="Что должен сделать ребёнок"
                                required
                            />
                        </label>
                        <label>
                            Награда
                            <input
                                className="pm-input"
                                value={form.reward}
                                onChange={(e) => setForm((f) => ({ ...f, reward: e.target.value }))}
                                placeholder="Поход в кино, +50 XP…"
                            />
                        </label>
                        <label>
                            Срок (дней)
                            <input
                                className="pm-input"
                                type="number" min={1} max={365}
                                value={form.daysLeft}
                                onChange={(e) => setForm((f) => ({ ...f, daysLeft: e.target.value }))}
                            />
                        </label>
                        <div className="pm-radio-group pm-full">
                            <span>Тип награды:</span>
                            <label className="pm-radio">
                                <input
                                    type="radio" name="rtype" value="virtual"
                                    checked={form.rewardType === 'virtual'}
                                    onChange={() => setForm((f) => ({ ...f, rewardType: 'virtual' }))}
                                />
                                Виртуальная (XP / значок)
                            </label>
                            <label className="pm-radio">
                                <input
                                    type="radio" name="rtype" value="real"
                                    checked={form.rewardType === 'real'}
                                    onChange={() => setForm((f) => ({ ...f, rewardType: 'real' }))}
                                />
                                Реальная
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="pm-submit-btn">Сохранить цель</button>
                </form>
            )}

            {/* Active goals */}
            <h3 className="pm-section-title">
                <Target size={16} /> Активные цели
                <span className="pm-count">{active.length}</span>
            </h3>
            <div className="pm-goals-list">
                {active.map((g) => (
                    <div key={g.id} className={`pm-goal-card ${g.type}`}>
                        <div className="pm-goal-head">
                            <span className={`pm-type-chip ${g.type}`}>{GOAL_TYPE_LABEL[g.type]}</span>
                            <span className="pm-days-left">⏱ {g.daysLeft} дн.</span>
                        </div>
                        <p className="pm-goal-title">{g.title}</p>
                        <p className="pm-goal-cond">{g.condition}</p>

                        <div className="pm-progress-wrap">
                            <div className="pm-progress-bar">
                                <div
                                    className="pm-progress-fill"
                                    style={{ width: `${g.progress}%` }}
                                />
                            </div>
                            <span className="pm-progress-pct">{g.progress}%</span>
                        </div>

                        <div className="pm-goal-footer">
                            <span className={`pm-reward-pill ${g.rewardType}`}>
                                <Gift size={12} /> {g.reward}
                            </span>
                        </div>
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
                        {completed.map((g) => (
                            <div key={g.id} className="pm-done-card">
                                <CheckCircle size={16} className="green" />
                                <div>
                                    <p className="pm-done-title">{g.title}</p>
                                    <p className="pm-done-meta">
                                        {GOAL_TYPE_LABEL[g.type]} · выполнено {g.doneDate}
                                    </p>
                                </div>
                                <span className={`pm-reward-pill ${g.rewardType}`}>
                                    <Gift size={12} /> {g.reward}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* XP info card */}
            <div className="pm-xp-info">
                <p className="pm-xp-title">🎮 Как работают виртуальные награды?</p>
                <p className="pm-xp-text">
                    Бонусные баллы и значки начисляются ребёнку автоматически при достижении цели.
                    Баллы влияют на место в рейтинге класса и открывают новые достижения.
                </p>
            </div>
        </ParentShellLayout>
    )
}
