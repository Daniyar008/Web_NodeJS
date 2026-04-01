import { useState } from 'react'
import { Wallet, CreditCard, Receipt, Download, BadgeCheck, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

const TARIFFS = [
    { key: 'basic',    name: 'Базовый',          price: 'Бесплатно',  students: 30,  desc: 'До 30 учеников, базовые возможности' },
    { key: 'pro',      name: 'Профессиональный',  price: '9 900₸/мес', students: 300, desc: 'До 300 учеников, все возможности платформы' },
    { key: 'corp',     name: 'Корпоративный',     price: 'Индивидуально', students: null, desc: 'Безлимит, собственный домен, API, SLA 99.9%' },
]
const CURRENT = 'pro'

const HISTORY = [
    { date: '14.03.2026', desc: 'Подписка Профессиональный', amount: '−9 900₸',  status: 'paid' },
    { date: '02.03.2026', desc: 'Пакет курсов ЕНТ (×15)',    amount: '−45 000₸', status: 'paid' },
    { date: '14.02.2026', desc: 'Подписка Профессиональный', amount: '−9 900₸',  status: 'paid' },
    { date: '01.02.2026', desc: 'Одобрение закупки — Химия', amount: '−18 000₸', status: 'paid' },
    { date: '10.01.2026', desc: 'Подписка Профессиональный', amount: '−9 900₸',  status: 'paid' },
]

const PENDING = [
    { teacher: 'А. Сейтказина', course: 'Алгебра. Углублённый курс', price: '12 000₸' },
    { teacher: 'Р. Байтенов',   course: 'Физика ЕНТ 2026',           price: '9 500₸' },
    { teacher: 'Г. Ким',        course: 'Химия. Лабораторный практикум', price: '15 000₸' },
]

export function InstitutionFinancePage({ language, onLanguageChange }: Props) {
    const [autoRenew, setAutoRenew] = useState(true)

    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Финансы и подписка"
            subtitle="Тариф, лимиты, платежи и управление бюджетом закупок"
            activePage="i-finance"
        >
            <div className="if-root">

                {/* ── Tariff cards ─────────────────────────────────── */}
                <h2 className="if-section-title"><Wallet size={16} /> Тариф</h2>
                <div className="if-tariff-row">
                    {TARIFFS.map((t) => (
                        <div key={t.key} className={`if-tariff-card ${t.key === CURRENT ? 'active' : ''}`}>
                            {t.key === CURRENT && <span className="if-current-badge"><BadgeCheck size={12}/> Текущий</span>}
                            <p className="if-tariff-name">{t.name}</p>
                            <p className="if-tariff-price">{t.price}</p>
                            <p className="if-tariff-desc">{t.desc}</p>
                            {t.students && (
                                <div className="if-limit-bar">
                                    <div className="if-limit-fill" style={{ width: t.key === CURRENT ? '94%' : '0%' }}/>
                                </div>
                            )}
                            {t.students && t.key === CURRENT && (
                                <p className="if-limit-note">284 / {t.students} учеников</p>
                            )}
                            {t.key !== CURRENT && (
                                <button className="if-upgrade-btn">{t.key === 'corp' ? 'Связаться' : 'Перейти'}</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Current plan status ───────────────────────────── */}
                <div className="if-status-row">
                    <div className="if-status-card">
                        <CreditCard size={16} className="if-icon" />
                        <div>
                            <p className="if-status-label">Следующее списание</p>
                            <p className="if-status-val">14 апреля 2026</p>
                        </div>
                    </div>
                    <div className="if-status-card">
                        <button className="if-autorenew-toggle" onClick={() => setAutoRenew(!autoRenew)}>
                            {autoRenew ? <ToggleRight size={22} style={{ color: '#7c3aed' }}/> : <ToggleLeft size={22} style={{ color: '#9099a8' }}/>}
                        </button>
                        <div>
                            <p className="if-status-label">Автопродление</p>
                            <p className="if-status-val">{autoRenew ? 'Включено' : 'Отключено'}</p>
                        </div>
                    </div>
                    <div className="if-status-card">
                        <Receipt size={16} className="if-icon" />
                        <div>
                            <p className="if-status-label">Метод оплаты</p>
                            <p className="if-status-val">Visa •••• 4821</p>
                        </div>
                    </div>
                </div>

                {/* ── Payment history ───────────────────────────────── */}
                <h2 className="if-section-title"><Receipt size={16} /> История платежей</h2>
                <div className="if-table-wrap">
                    <table className="if-table">
                        <thead>
                            <tr><th>Дата</th><th>Описание</th><th>Сумма</th><th>Статус</th><th></th></tr>
                        </thead>
                        <tbody>
                            {HISTORY.map((h, i) => (
                                <tr key={i}>
                                    <td>{h.date}</td>
                                    <td>{h.desc}</td>
                                    <td className="if-amount">{h.amount}</td>
                                    <td><span className="if-status-badge paid">Оплачен</span></td>
                                    <td><button className="if-dl-btn"><Download size={13}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Budget control ────────────────────────────────── */}
                <h2 className="if-section-title"><Wallet size={16} /> Бюджет закупок курсов</h2>
                <div className="if-budget-row">
                    <div className="if-budget-card">
                        <p className="if-budget-label">Годовой бюджет</p>
                        <p className="if-budget-val">500 000₸</p>
                    </div>
                    <div className="if-budget-card">
                        <p className="if-budget-label">Израсходовано</p>
                        <p className="if-budget-val spent">312 000₸</p>
                        <div className="if-budget-bar"><div className="if-budget-fill" style={{ width: '62.4%' }}/></div>
                        <p className="if-budget-pct">62.4%</p>
                    </div>
                    <div className="if-budget-card">
                        <p className="if-budget-label">Остаток</p>
                        <p className="if-budget-val remain">188 000₸</p>
                    </div>
                </div>

                <h3 className="if-subsection-title">Ожидают согласования ({PENDING.length})</h3>
                <div className="if-table-wrap">
                    <table className="if-table">
                        <thead><tr><th>Учитель</th><th>Курс</th><th>Сумма</th><th>Действие</th></tr></thead>
                        <tbody>
                            {PENDING.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.teacher}</td>
                                    <td>{p.course}</td>
                                    <td className="if-amount">{p.price}</td>
                                    <td>
                                        <button className="if-approve-btn">Одобрить</button>
                                        <button className="if-reject-btn">Отклонить</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstitutionShellLayout>
    )
}