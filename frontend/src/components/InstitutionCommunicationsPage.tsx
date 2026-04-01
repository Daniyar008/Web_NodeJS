import { useState } from 'react'
import { Send, Bell, MessageCircle, Calendar, Clock, Users } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const SENT_HISTORY = [
    { date: '12.03.2026 09:00', text: 'Напоминание: родительское собрание 14.03 в 18:00', target: 'Родители', channel: 'Push', read: 94 },
    { date: '11.03.2026 08:30', text: 'Недельный дайджест успеваемости — 2-я неделя марта', target: 'Все',      channel: 'Email', read: 87 },
    { date: '10.03.2026 12:00', text: 'Срочно: изменение расписания 11А на пятницу',        target: '11А',    channel: 'Telegram', read: 100 },
]

const MEETINGS = [
    { title: 'Родительское собрание — 8-е классы', date: '14.03.2026 18:00', type: 'Zoom',     link: '#' },
    { title: 'Педсовет: итоги III четверти',        date: '20.03.2026 15:00', type: 'Meet',     link: '#' },
    { title: 'Методическое объединение матем.',     date: '22.03.2026 14:00', type: 'Zoom',     link: '#' },
]

export function InstitutionCommunicationsPage({ language, onLanguageChange }: Props) {
    const [msgText, setMsgText] = useState('')
    const [target, setTarget] = useState('all')
    const [channel, setChannel] = useState('push')
    const [chatHoursFrom, setChatHoursFrom] = useState('08:00')
    const [chatHoursTo, setChatHoursTo] = useState('20:00')
    const [moderation, setModeration] = useState(true)

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Коммуникации"
            subtitle="Массовые уведомления, правила чатов и онлайн-собрания"
            activePage="i-communications"
        >
            <div className="ic-root">

                {/* ── Mass notifications ────────────────────────── */}
                <h2 className="ic-section-title"><Bell size={16}/> Массовые уведомления</h2>
                <div className="ic-compose-card">
                    <textarea
                        className="ic-compose-textarea"
                        placeholder="Текст сообщения для рассылки..."
                        rows={3}
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                    />
                    <div className="ic-compose-controls">
                        <div className="ic-compose-field">
                            <label>Получатели</label>
                            <select value={target} onChange={(e) => setTarget(e.target.value)}>
                                <option value="all">Все пользователи</option>
                                <option value="teachers">Только учителя</option>
                                <option value="students">Только ученики</option>
                                <option value="parents">Только родители</option>
                                <option value="8a">Класс 8А</option>
                                <option value="8b">Класс 8Б</option>
                                <option value="9a">Класс 9А</option>
                                <option value="11a">Класс 11А</option>
                            </select>
                        </div>
                        <div className="ic-compose-field">
                            <label>Канал</label>
                            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                                <option value="push">Push-уведомление</option>
                                <option value="email">Email</option>
                                <option value="telegram">Telegram</option>
                                <option value="all_channels">Все каналы</option>
                            </select>
                        </div>
                        <button
                            className="ic-send-btn"
                            disabled={!msgText.trim()}
                        >
                            <Send size={14}/> Отправить
                        </button>
                    </div>
                </div>

                {/* ── Sent history ──────────────────────────────── */}
                <h3 className="ic-subsection-title">История рассылок</h3>
                <div className="ic-table-wrap">
                    <table className="ic-table">
                        <thead><tr><th>Дата</th><th>Сообщение</th><th>Получатели</th><th>Канал</th><th>Прочитано</th></tr></thead>
                        <tbody>
                            {SENT_HISTORY.map((s, i) => (
                                <tr key={i}>
                                    <td className="ic-date">{s.date}</td>
                                    <td>{s.text}</td>
                                    <td>{s.target}</td>
                                    <td><span className={`ic-channel-badge ${s.channel.toLowerCase()}`}>{s.channel}</span></td>
                                    <td><span className="ic-read-pct">{s.read}%</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Communication rules ───────────────────────── */}
                <h2 className="ic-section-title"><MessageCircle size={16}/> Правила коммуникаций</h2>
                <div className="ic-rules-card">
                    <div className="ic-rule-row">
                        <div className="ic-rule-label">
                            <Clock size={14}/> Часы чатов родители–учителя
                        </div>
                        <div className="ic-rule-controls">
                            <input type="time" value={chatHoursFrom} onChange={(e) => setChatHoursFrom(e.target.value)} className="ic-time-input"/>
                            <span>—</span>
                            <input type="time" value={chatHoursTo} onChange={(e) => setChatHoursTo(e.target.value)} className="ic-time-input"/>
                        </div>
                    </div>
                    <div className="ic-rule-row">
                        <div className="ic-rule-label">
                            <Users size={14}/> Модерация по жалобам
                        </div>
                        <button className="ic-toggle-btn" onClick={() => setModeration(!moderation)}>
                            <span className={`ic-toggle-pill ${moderation ? 'on' : ''}`}/>
                            <span>{moderation ? 'Включена' : 'Отключена'}</span>
                        </button>
                    </div>
                    <div className="ic-rule-row">
                        <div className="ic-rule-label">Авто-дайджесты каждый</div>
                        <select className="ic-select-inline">
                            <option>Понедельник в 08:00</option>
                            <option>Пятница в 17:00</option>
                            <option>Отключить</option>
                        </select>
                    </div>
                </div>

                {/* ── Meetings ──────────────────────────────────── */}
                <h2 className="ic-section-title"><Calendar size={16}/> Онлайн-собрания</h2>
                <div className="ic-meetings-list">
                    {MEETINGS.map((m, i) => (
                        <div key={i} className="ic-meeting-card">
                            <div className="ic-meeting-info">
                                <p className="ic-meeting-title">{m.title}</p>
                                <p className="ic-meeting-meta">{m.date} · {m.type}</p>
                            </div>
                            <a href={m.link} className="ic-join-btn">Открыть</a>
                        </div>
                    ))}
                </div>
                <div className="ic-new-meeting-row">
                    <input type="text" className="ic-input" placeholder="Название собрания"/>
                    <input type="datetime-local" className="ic-input"/>
                    <select className="ic-select">
                        <option>Zoom</option>
                        <option>Google Meet</option>
                    </select>
                    <button className="ic-add-meeting-btn">Создать</button>
                </div>
            </div>
        </InstitutionShellLayout>
    )
}