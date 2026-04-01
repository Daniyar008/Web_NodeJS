import { useState } from 'react'
import { Trophy, Star, Plus, Users, Award } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const ACTIVE_TOURNAMENTS = [
    { id: 1, name: 'Математическая битва 8-х классов', type: 'По оценкам',        ends: '20.04.2026', classes: ['8А','8Б'],        leader: '8А — 1 840 XP' },
    { id: 2, name: 'Марафон посещаемости',              type: 'По посещаемости',   ends: '30.04.2026', classes: ['9А','9Б','10А'],   leader: '10А — 98.2%' },
    { id: 3, name: 'Олимпиадный отбор по физике',       type: 'По активности',     ends: '12.04.2026', classes: ['10А','11А'],       leader: '11А — 2 410 XP' },
]

const CLASS_RATING = [
    { rank: 1, name: '11А', xp: 2420, teacher: 'Байтенов', avg: 4.6 },
    { rank: 2, name: '10А', xp: 2210, teacher: 'Сейтказина', avg: 4.5 },
    { rank: 3, name: '9Б',  xp: 1980, teacher: 'Ким', avg: 4.2 },
    { rank: 4, name: '8А',  xp: 1840, teacher: 'Абуова', avg: 4.4 },
    { rank: 5, name: '9А',  xp: 1690, teacher: 'Серик', avg: 3.9 },
]
const TEACHER_RATING = [
    { rank: 1, name: 'Алия Сейтказина',  subject: 'Математика', score: 4.8 },
    { rank: 2, name: 'Руслан Байтенов',  subject: 'Физика',     score: 4.7 },
    { rank: 3, name: 'Горь Ким',          subject: 'Химия',      score: 4.6 },
    { rank: 4, name: 'Данияр Серик',     subject: 'История',    score: 4.2 },
    { rank: 5, name: 'Зарина Абуова',    subject: 'Рус. язык',  score: 3.9 },
]
const STUDENT_RATING = [
    { rank: 1, name: 'Дамир Муратов',    cls: '11А', xp: 630 },
    { rank: 2, name: 'Айгерим Сакенова', cls: '11А', xp: 610 },
    { rank: 3, name: 'Асель Нурова',     cls: '10А', xp: 580 },
    { rank: 4, name: 'Жанар Бекова',     cls: '10А', xp: 545 },
    { rank: 5, name: 'Руслан Ахметов',   cls: '9Б',  xp: 510 },
]

const GLOBAL = [
    { name: 'Республиканская олимпиада по математике', org: 'МОН РК',    deadline: '01.05.2026', status: 'open'   },
    { name: 'Citytech Science Challenge',               org: 'Платформа', deadline: '15.04.2026', status: 'open'   },
    { name: 'Лига знаний — весенний сезон',             org: 'Платформа', deadline: '10.04.2026', status: 'closed' },
]

export function InstitutionTournamentsPage({ language, onLanguageChange }: Props) {
    const [ratingTab, setRatingTab] = useState<'class' | 'teacher' | 'student'>('class')
    const [showForm, setShowForm] = useState(false)

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Турниры и соревнования"
            subtitle="Внутренние турниры, глобальные соревнования и рейтинги"
            activePage="i-tournaments"
        >
            <div className="it-root">

                {/* ── Header actions ─────────────────────────────── */}
                <div className="it-header-row">
                    <button className="it-create-btn" onClick={() => setShowForm(!showForm)}>
                        <Plus size={15}/> Создать турнир
                    </button>
                </div>

                {/* ── Create form ────────────────────────────────── */}
                {showForm && (
                    <div className="it-form-card">
                        <h3 className="it-form-title">Новый турнир</h3>
                        <div className="it-form-grid">
                            <div className="it-field">
                                <label>Название</label>
                                <input type="text" placeholder="Напр.: Марафон активности — апрель"/>
                            </div>
                            <div className="it-field">
                                <label>Тип</label>
                                <select>
                                    <option>По оценкам</option>
                                    <option>По посещаемости</option>
                                    <option>По активности на платформе</option>
                                </select>
                            </div>
                            <div className="it-field">
                                <label>Дата начала</label>
                                <input type="date"/>
                            </div>
                            <div className="it-field">
                                <label>Дата окончания</label>
                                <input type="date"/>
                            </div>
                            <div className="it-field it-field-wide">
                                <label>Участники (классы)</label>
                                <input type="text" placeholder="8А, 8Б, 9А ..."/>
                            </div>
                        </div>
                        <div className="it-form-actions">
                            <button className="it-submit-btn">Запустить турнир</button>
                            <button className="it-cancel-btn" onClick={() => setShowForm(false)}>Отмена</button>
                        </div>
                    </div>
                )}

                {/* ── Active tournaments ─────────────────────────── */}
                <h2 className="it-section-title"><Trophy size={16}/> Активные турниры</h2>
                <div className="it-tournaments-list">
                    {ACTIVE_TOURNAMENTS.map((tour) => (
                        <div key={tour.id} className="it-tour-card">
                            <div className="it-tour-info">
                                <p className="it-tour-name">{tour.name}</p>
                                <p className="it-tour-meta">{tour.type} · Участники: {tour.classes.join(', ')} · До {tour.ends}</p>
                            </div>
                            <div className="it-tour-leader">
                                <Star size={13} style={{ color: '#f59e0b' }}/> {tour.leader}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Global tournaments ─────────────────────────── */}
                <h2 className="it-section-title"><Award size={16}/> Глобальные соревнования</h2>
                <div className="it-table-wrap">
                    <table className="it-table">
                        <thead><tr><th>Соревнование</th><th>Организатор</th><th>Дедлайн</th><th>Статус</th><th></th></tr></thead>
                        <tbody>
                            {GLOBAL.map((g, i) => (
                                <tr key={i}>
                                    <td className="it-tour-name-cell">{g.name}</td>
                                    <td>{g.org}</td>
                                    <td>{g.deadline}</td>
                                    <td><span className={`it-global-badge ${g.status}`}>{g.status === 'open' ? 'Открыта регистрация' : 'Регистрация закрыта'}</span></td>
                                    <td>{g.status === 'open' && <button className="it-reg-btn">Зарегистрироваться</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Ratings ────────────────────────────────────── */}
                <h2 className="it-section-title"><Users size={16}/> Рейтинги</h2>
                <div className="it-rating-tabs">
                    {[['class', 'Классы'], ['teacher', 'Учителя'], ['student', 'Ученики']].map(([k, l]) => (
                        <button key={k} type="button" className={ratingTab === k ? 'active' : ''} onClick={() => setRatingTab(k as typeof ratingTab)}>{l}</button>
                    ))}
                </div>

                {ratingTab === 'class' && (
                    <div className="it-table-wrap">
                        <table className="it-table">
                            <thead><tr><th>#</th><th>Класс</th><th>XP</th><th>Классный рук.</th><th>Ср. балл</th></tr></thead>
                            <tbody>{CLASS_RATING.map((r) => (
                                <tr key={r.rank} className={r.rank <= 3 ? 'it-top' : ''}>
                                    <td className="it-rank">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}</td>
                                    <td><strong>{r.name}</strong></td>
                                    <td>{r.xp.toLocaleString()} XP</td>
                                    <td>{r.teacher}</td>
                                    <td>{r.avg}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
                {ratingTab === 'teacher' && (
                    <div className="it-table-wrap">
                        <table className="it-table">
                            <thead><tr><th>#</th><th>Учитель</th><th>Предмет</th><th>Рейтинг</th></tr></thead>
                            <tbody>{TEACHER_RATING.map((r) => (
                                <tr key={r.rank} className={r.rank <= 3 ? 'it-top' : ''}>
                                    <td className="it-rank">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}</td>
                                    <td>{r.name}</td>
                                    <td>{r.subject}</td>
                                    <td><span className="it-score">{r.score}</span></td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
                {ratingTab === 'student' && (
                    <div className="it-table-wrap">
                        <table className="it-table">
                            <thead><tr><th>#</th><th>Ученик</th><th>Класс</th><th>XP</th></tr></thead>
                            <tbody>{STUDENT_RATING.map((r) => (
                                <tr key={r.rank} className={r.rank <= 3 ? 'it-top' : ''}>
                                    <td className="it-rank">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}</td>
                                    <td>{r.name}</td>
                                    <td>{r.cls}</td>
                                    <td>{r.xp.toLocaleString()} XP</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
            </div>
        </InstitutionShellLayout>
    )
}