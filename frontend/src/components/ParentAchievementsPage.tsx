import type { Language } from '../i18n/translations'
import { ParentShellLayout } from './ParentShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const ACADEMIC = [
    { emoji: '📖', title: 'Отличник четверти', date: '15 мар', desc: 'Средний балл ≥ 4.8 за четверть' },
    { emoji: '✏️', title: 'Первое пятно на пятёрку', date: '5 янв', desc: 'Получить первую пятёрку' },
    { emoji: '📐', title: 'Математик', date: '10 фев', desc: '10 пятёрок по математике' },
    { emoji: '🔬', title: 'Учёный', date: '20 мар', desc: '5 пятёрок по точным наукам' },
    { emoji: '📚', title: 'Читатель', date: '8 апр', desc: 'Прочитать 5 книг за семестр' },
    { emoji: '🌟', title: 'Прогресс года', date: '', desc: 'Повысить средний балл на 0.5' },
]

const ATTENDANCE = [
    { emoji: '📅', title: 'Отличник посещаемости', date: '31 мар', desc: '100% за месяц' },
    { emoji: '🏃', title: 'Ни дня без школы', date: '28 фев', desc: '30 дней подряд без пропусков' },
    { emoji: '⏰', title: 'Пунктуальность', date: '14 фев', desc: '30 дней без опозданий' },
    { emoji: '📆', title: 'Четвертная явка', date: '', desc: 'Посещаемость 95%+ за четверть' },
]

const TOURNAMENT = [
    { emoji: '🥇', title: 'Золото олимпиады', date: '1 мар', desc: 'Победа в школьной олимпиаде' },
    { emoji: '🏆', title: 'Финалист турнира', date: '10 мар', desc: 'Топ-10 на платформенном турнире' },
    { emoji: '🎯', title: 'Меткий стрелок', date: '20 янв', desc: '80%+ правильных ответов в квизе' },
    { emoji: '⚡', title: 'Скоростной интеллект', date: '', desc: 'Ответить на 20 вопросов за 5 минут' },
    { emoji: '🤝', title: 'Командный игрок', date: '12 апр', desc: 'Победить в командном турнире' },
]

const SPECIAL = [
    { emoji: '🎨', title: 'Творческая душа', date: '5 апр', desc: 'Участие в творческом конкурсе' },
    { emoji: '🤖', title: 'Первый шаг в AI', date: '22 мар', desc: 'Пройти AI-курс в платформе' },
    { emoji: '💬', title: 'Социальная звезда', date: '', desc: 'Написать 50 сообщений учителям' },
]

const RATING = [
    { rank: 1, name: 'Алексей К.', xp: 3450, medal: '🥇' },
    { rank: 2, name: 'Анна С.', xp: 3210, medal: '🥈', isChild: true },
    { rank: 3, name: 'Кирилл М.', xp: 2980, medal: '🥉' },
    { rank: 4, name: 'Дина Н.', xp: 2740, medal: '' },
    { rank: 5, name: 'Олег Р.', xp: 2560, medal: '' },
    { rank: 6, name: 'Маша Т.', xp: 2390, medal: '' },
    { rank: 7, name: 'Саша Л.', xp: 2100, medal: '' },
]

const TOURNAMENTS = [
    { name: 'Весенняя олимпиада по математике', date: '1 мар 2025', result: '1 место', prize: 'Золотой значок + 200 XP' },
    { name: 'Командный квиз «История»', date: '15 фев 2025', result: 'Топ-10', prize: '80 XP' },
    { name: 'Физический марафон', date: '20 янв 2025', result: '3 место', prize: '120 XP' },
    { name: 'Диктант «Русский язык»', date: '10 апр 2025', result: 'Участие', prize: '20 XP' },
    { name: 'AI‑Хакатон «Будущее»', date: '22 мар 2025', result: 'Финалист', prize: 'Спец. значок + 150 XP' },
]

type Category = { label: string; prefix: string; items: { emoji: string; title: string; date: string; desc: string }[] }
const CATEGORIES: Category[] = [
    { label: 'Учёба', prefix: 'academic', items: ACADEMIC },
    { label: 'Посещаемость', prefix: 'attendance', items: ATTENDANCE },
    { label: 'Турниры', prefix: 'tournament', items: TOURNAMENT },
    { label: 'Особые', prefix: 'special', items: SPECIAL },
]

export function ParentAchievementsPage({ language, onLanguageChange }: Props) {
    const earned = [...ACADEMIC, ...ATTENDANCE, ...TOURNAMENT, ...SPECIAL].filter((a) => a.date !== '').length
    const total = ACADEMIC.length + ATTENDANCE.length + TOURNAMENT.length + SPECIAL.length

    return (
        <ParentShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Достижения"
            subtitle="Коллекция достижений Анны и рейтинг класса"
            activePage="p-achievements"
        >
            {/* Total progress */}
            <div className="pac-total-row">
                <span className="pac-total-label">🏅 Всего достижений:</span>
                <span className="pac-total-count">{earned} из {total}</span>
                <div className="pac-total-bar">
                    <div className="pac-total-fill" style={{ width: `${Math.round((earned / total) * 100)}%` }} />
                </div>
                <span className="pac-total-pct">{Math.round((earned / total) * 100)}%</span>
            </div>

            {/* Achievement categories */}
            {CATEGORIES.map((cat) => {
                const catEarned = cat.items.filter((a) => a.date !== '').length
                return (
                    <div key={cat.prefix} className="pac-category">
                        <div className="pac-cat-header">
                            <h3>{cat.label}</h3>
                            <span className="pac-cat-count">{catEarned}/{cat.items.length}</span>
                        </div>
                        <div className="pac-grid">
                            {cat.items.map((a) => (
                                <div
                                    key={a.title}
                                    className={`pac-card ${a.date ? 'earned' : 'locked'}`}
                                    title={a.desc}
                                >
                                    <span className="pac-emoji">{a.emoji}</span>
                                    <p className="pac-title">{a.title}</p>
                                    {a.date
                                        ? <p className="pac-date">✅ {a.date}</p>
                                        : <p className="pac-date locked-lbl">🔒 Не получено</p>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* Class XP leaderboard */}
            <div className="pac-rating-section">
                <h3 className="pac-rating-title">🏆 Рейтинг класса по XP</h3>
                <table className="pac-rating-table">
                    <thead>
                        <tr>
                            <th>#</th><th>Ученик</th><th>XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RATING.map((r) => (
                            <tr key={r.rank} className={r.isChild ? 'pac-my-child' : ''}>
                                <td>{r.medal || r.rank}</td>
                                <td>{r.name}{r.isChild && <span className="pac-child-tag"> (Анна)</span>}</td>
                                <td><span className="pac-xp">{r.xp.toLocaleString()} XP</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tournament results */}
            <div className="pac-tournaments-section">
                <h3 className="pac-rating-title">🎯 Результаты турниров</h3>
                <table className="pac-tournament-table">
                    <thead>
                        <tr>
                            <th>Турнир</th><th>Дата</th><th>Результат</th><th>Награда</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOURNAMENTS.map((t) => (
                            <tr key={t.name}>
                                <td>{t.name}</td>
                                <td>{t.date}</td>
                                <td>
                                    <span className={`pac-result ${t.result.startsWith('1') ? 'gold' : t.result.startsWith('3') ? 'bronze' : 'normal'}`}>
                                        {t.result}
                                    </span>
                                </td>
                                <td>{t.prize}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ParentShellLayout>
    )
}
