import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function InstitutionAnalyticsPage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Аналитика"
            subtitle="Метрики по учителям, классам, предметам и AI-прогноз"
            activePage="i-analytics"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Эффективность учителей</h3>
                    <div className="inst-table-like">
                        <div className="inst-row"><strong>Топ-1: Алия Сейтказина</strong><span>Средняя оценка: 4.8</span><span>Выполнение плана: 96%</span></div>
                        <div className="inst-row"><strong>Топ-2: Руслан Байтенов</strong><span>Средняя оценка: 4.7</span><span>Выполнение плана: 93%</span></div>
                        <div className="inst-row"><strong>Топ-3: Игорь Ким</strong><span>Средняя оценка: 4.6</span><span>Выполнение плана: 92%</span></div>
                    </div>
                </article>

                <article className="inst-card tall">
                    <h3>Сравнение классов</h3>
                    <ul className="inst-list">
                        <li>8А: ср. балл 4.4, посещаемость 95%</li>
                        <li>8Б: ср. балл 4.1, посещаемость 91%</li>
                        <li>9А: ср. балл 3.9, посещаемость 88%</li>
                        <li>11А: ср. балл 4.6, посещаемость 97%</li>
                    </ul>
                </article>
            </section>

            <section className="inst-grid-1">
                <article className="inst-card">
                    <h3>AI-прогноз успеваемости</h3>
                    <p className="inst-card-note">18 учеников в группе риска по снижению результатов, 2 класса нуждаются в дополнительных консультациях, вероятность успешной сдачи выпускных экзаменов: 89%.</p>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
