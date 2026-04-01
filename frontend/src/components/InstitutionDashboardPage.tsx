import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

const KPIS = [
    { label: 'Ученики', value: '1 284', delta: '+6.2% за месяц' },
    { label: 'Учителя', value: '86', delta: '+4 новых в этом квартале' },
    { label: 'Средняя успеваемость', value: '4.32', delta: '+0.18 за 2 месяца' },
    { label: 'Посещаемость', value: '93%', delta: '+2.4% после внедрения напоминаний' },
]

export function InstitutionDashboardPage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Дашборд учреждения"
            subtitle="Ключевые показатели, активные риски и приоритеты на неделю"
            activePage="i-dashboard"
        >
            <section className="inst-grid-4">
                {KPIS.map((item) => (
                    <article key={item.label} className="inst-card">
                        <p className="inst-card-label">{item.label}</p>
                        <p className="inst-card-value">{item.value}</p>
                        <p className="inst-card-note">{item.delta}</p>
                    </article>
                ))}
            </section>

            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Приоритеты на неделю</h3>
                    <ul className="inst-list">
                        <li>Закрыть кадровый дефицит по математике и физике</li>
                        <li>Завершить формирование расписания для 9-11 классов</li>
                        <li>Подготовить отчёт по нагрузке учителей для аттестации</li>
                        <li>Проверить курсы, ожидающие модерацию</li>
                    </ul>
                </article>

                <article className="inst-card tall">
                    <h3>AI-сигналы группы риска</h3>
                    <ul className="inst-list">
                        <li>14 учеников с падением среднего балла более чем на 0.5</li>
                        <li>2 класса с посещаемостью ниже 85%</li>
                        <li>3 предмета с систематически низкими результатами контрольных</li>
                        <li>Рекомендация: добавить 6 консультационных сессий в расписание</li>
                    </ul>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
